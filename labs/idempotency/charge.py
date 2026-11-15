#!/usr/bin/env python3
"""Idempotent card charge.

A timeout is an unknown outcome. Retrying the same attempt with the same key
is safe only when the key and the debit commit together. Minting a new key
after a timeout is a second charge.

DDIA chapter 7: the key insert and the balance change are one transaction.
DDIA chapter 8: a slow success and a failure look the same from the client.

Run from the repo root:

    python3 labs/idempotency/charge.py
"""

from __future__ import annotations


class ChargeResult:
    def __init__(self, status: str, balance_cents: int, replayed: bool) -> None:
        self.status = status
        self.balance_cents = balance_cents
        self.replayed = replayed

    def __repr__(self) -> str:
        return (
            f"ChargeResult(status={self.status}, balance_cents={self.balance_cents}, "
            f"replayed={self.replayed})"
        )


class AtomicCharger:
    """Key and debit land together. A retry replays the stored result."""

    def __init__(self, balance_cents: int) -> None:
        self.balance_cents = balance_cents
        self._results: dict[str, tuple[str, int]] = {}

    def charge(self, key: str, amount_cents: int) -> ChargeResult:
        if not key:
            raise ValueError("missing idempotency key")
        if amount_cents <= 0:
            raise ValueError("amount must be positive")
        stored = self._results.get(key)
        if stored is not None:
            status, balance = stored
            return ChargeResult(status, balance, True)
        if self.balance_cents < amount_cents:
            status = "declined"
            balance = self.balance_cents
        else:
            self.balance_cents -= amount_cents
            status = "approved"
            balance = self.balance_cents
        self._results[key] = (status, balance)
        return ChargeResult(status, balance, False)


class SplitWriteCharger:
    """Debits, then stores the key. A crash in between loses the key."""

    def __init__(self, balance_cents: int) -> None:
        self.balance_cents = balance_cents
        self._results: dict[str, tuple[str, int]] = {}

    def charge(self, key: str, amount_cents: int, record_key: bool) -> ChargeResult:
        stored = self._results.get(key)
        if stored is not None:
            status, balance = stored
            return ChargeResult(status, balance, True)
        if self.balance_cents < amount_cents:
            raise RuntimeError("split-write demo always has funds")
        self.balance_cents -= amount_cents
        status = "approved"
        balance = self.balance_cents
        if record_key:
            self._results[key] = (status, balance)
        return ChargeResult(status, balance, False)


def main() -> None:
    atomic = AtomicCharger(10_000)
    first = atomic.charge("attempt-1", 2_500)
    retry = atomic.charge("attempt-1", 2_500)
    assert first.status == "approved" and not first.replayed
    assert retry.replayed and retry.status == "approved"
    assert atomic.balance_cents == 7_500

    second_attempt = atomic.charge("attempt-2", 2_500)
    assert not second_attempt.replayed
    assert atomic.balance_cents == 5_000

    poor = AtomicCharger(100)
    declined = poor.charge("attempt-9", 500)
    declined_retry = poor.charge("attempt-9", 500)
    assert declined.status == "declined" and not declined.replayed
    assert declined_retry.replayed and declined_retry.status == "declined"
    assert poor.balance_cents == 100

    crashed = SplitWriteCharger(10_000)
    crashed.charge("attempt-1", 2_500, record_key=False)
    again = crashed.charge("attempt-1", 2_500, record_key=True)
    assert again.replayed is False
    assert crashed.balance_cents == 5_000

    print("Same key, atomic store: charged once. Balance 7500 cents. Retry was a replay.")
    print("New key after a timeout: charged again. Balance 5000 cents.")
    print("Same key, decline stored: retry stayed declined. Balance 100 cents.")
    print("Crash after debit, before key insert: retry charged a second time. Balance 5000 cents.")
    print("Keep the idempotency key and the debit in one transaction.")


if __name__ == "__main__":
    main()
