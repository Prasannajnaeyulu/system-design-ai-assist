#!/usr/bin/env python3
"""Settlement outbox.

Two systems cannot commit together. If you update the settlement row and then
publish to a queue, a crash in the gap loses the event. An outbox row written
in the same database transaction survives the crash, and a publisher drains it.

DDIA chapter 11: the database is the source of the stream. The queue is derived.
Consumers are at-least-once, so applying a settlement must be idempotent.

Run from the repo root:

    python3 labs/outbox/outbox.py
"""

from __future__ import annotations

import sqlite3


def new_db() -> sqlite3.Connection:
    conn = sqlite3.connect(":memory:")
    conn.execute("create table settlement (id integer primary key, state text)")
    conn.execute(
        "create table outbox (id integer primary key, settlement_id integer, published integer)"
    )
    conn.execute("insert into settlement (id, state) values (1, 'pending')")
    conn.commit()
    return conn


def naive_commit_then_crash(conn: sqlite3.Connection) -> None:
    conn.execute("update settlement set state = 'ready' where id = 1")
    conn.commit()
    # The process dies before the queue publish.


def outbox_commit_then_crash(conn: sqlite3.Connection) -> None:
    conn.execute("begin")
    conn.execute("update settlement set state = 'ready' where id = 1")
    conn.execute("insert into outbox (settlement_id, published) values (1, 0)")
    conn.commit()
    # The process dies before the publisher runs. The outbox row is still there.


def drain(conn: sqlite3.Connection) -> list[int]:
    rows = conn.execute("select id, settlement_id from outbox where published = 0").fetchall()
    delivered: list[int] = []
    for outbox_id, settlement_id in rows:
        delivered.append(int(settlement_id))
        conn.execute("update outbox set published = 1 where id = ?", (outbox_id,))
    conn.commit()
    return delivered


def state_of(conn: sqlite3.Connection) -> str:
    row = conn.execute("select state from settlement where id = 1").fetchone()
    if row is None:
        raise RuntimeError("missing settlement")
    return str(row[0])


def main() -> None:
    naive = new_db()
    naive_commit_then_crash(naive)
    lost = drain(naive)
    assert state_of(naive) == "ready"
    assert lost == []

    durable = new_db()
    outbox_commit_then_crash(durable)
    first_drain = drain(durable)
    second_drain = drain(durable)
    assert state_of(durable) == "ready"
    assert first_drain == [1]
    assert second_drain == []

    print("Naive path: settlement is ready, and the drain delivered nothing. The event is gone.")
    print("Outbox path: after the crash, the drain delivered settlement 1 once.")
    print("Second drain delivered nothing. The consumer still needs its own idempotency key.")
    print("Write the business row and the outbox row in one database transaction.")


if __name__ == "__main__":
    main()
