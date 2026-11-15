#!/usr/bin/env python3
"""Double-entry ledger with derived balances.

Postings are the source of truth. A balance is the sum of postings and can be
rebuilt. Every entry sums to zero. The idempotency key is stored with the entry.
A read-then-write on a balance column loses a concurrent debit.

DDIA chapter 7: the invariant (sum to zero, no overdraft) lives inside the
transaction, under a per-account lock or a conditional update.
DDIA chapter 12: the balance is derived data.

Run from the repo root:

    python3 labs/ledger/ledger.py
"""

from __future__ import annotations


class Ledger:
    def __init__(self) -> None:
        self.accounts: dict[str, int] = {}
        self.entries: list[tuple[tuple[str, int], ...]] = []
        self.keys: dict[str, int] = {}

    def post(self, key: str, postings: list[tuple[str, int]]) -> dict[str, object]:
        if not key:
            raise ValueError("missing idempotency key")
        existing = self.keys.get(key)
        if existing is not None:
            return {"replayed": True, "entry_id": existing}
        if not postings:
            raise ValueError("empty entry")
        total = sum(amount for _, amount in postings)
        if total != 0:
            raise ValueError(f"unbalanced entry sums to {total}")
        for account, amount in postings:
            self.accounts[account] = self.accounts.get(account, 0) + amount
        entry_id = len(self.entries) + 1
        self.entries.append(tuple(postings))
        self.keys[key] = entry_id
        return {"replayed": False, "entry_id": entry_id}

    def balance(self, account: str) -> int:
        return self.accounts.get(account, 0)

    def trial_balance(self) -> int:
        return sum(self.accounts.values())


def serial_debits(start_cents: int, spends: list[int]) -> tuple[int, list[str]]:
    """One account lock. The second debit sees the first."""
    balance = start_cents
    outcomes: list[str] = []
    for spend in spends:
        if balance < spend:
            outcomes.append("declined")
            continue
        balance -= spend
        outcomes.append("approved")
    return balance, outcomes


def lost_update(start_cents: int, spends: list[int]) -> int:
    """Both requests read the same balance and write start - spend."""
    if any(start_cents < spend for spend in spends):
        raise RuntimeError("demo spends must each fit in the starting balance")
    writes = [start_cents - spend for spend in spends]
    return writes[-1]


def main() -> None:
    ledger = Ledger()
    opened = ledger.post(
        "open-1",
        [("customer_available", 10_000), ("equity", -10_000)],
    )
    assert opened["replayed"] is False
    spend = ledger.post(
        "pay-1",
        [("customer_available", -8_000), ("merchant_payable", 8_000)],
    )
    assert spend["replayed"] is False
    replay = ledger.post(
        "pay-1",
        [("customer_available", -8_000), ("merchant_payable", 8_000)],
    )
    assert replay["replayed"] is True
    assert ledger.balance("customer_available") == 2_000
    assert ledger.balance("merchant_payable") == 8_000
    assert ledger.trial_balance() == 0

    try:
        ledger.post("bad-1", [("customer_available", -100)])
    except ValueError as exc:
        unbalanced = str(exc)
    else:
        raise AssertionError("unbalanced entry was accepted")
    assert "unbalanced" in unbalanced
    assert ledger.balance("customer_available") == 2_000

    serial_balance, serial_outcomes = serial_debits(10_000, [8_000, 8_000])
    assert serial_outcomes == ["approved", "declined"]
    assert serial_balance == 2_000

    raced = lost_update(10_000, [8_000, 8_000])
    assert raced == 2_000

    print("Opening entry plus one spend. Trial balance is 0.")
    print("customer_available=2000, merchant_payable=8000. Replay of pay-1 did not move money.")
    print("Unbalanced entry was rejected. Balance stayed 2000.")
    print("Serialized debits of 8000 then 8000 on 10000: approved, declined. Balance 2000.")
    print(
        "Lost update: both debits read 10000 and the column ends at 2000, "
        "while two merchants were promised 8000 each."
    )
    print("Post balanced entries under a per-account lock. Derive the balance from postings.")


if __name__ == "__main__":
    main()
