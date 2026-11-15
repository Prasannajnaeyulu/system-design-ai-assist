# System design training

Open the reader on any device: [https://prasannajnaeyulu.github.io/system-design-ai-assist/](https://prasannajnaeyulu.github.io/system-design-ai-assist/)

Or run it locally and go week by week:

```bash
cd web
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765). Your notes and your place stay in that browser. Each session starts as a blank prompt. The idea, the choices, and the reference open after the seven notes are written.

You can build an API and a database. This program trains the next skill: making a design hold together when a call times out, a replica lags, or a model is slow. The finish line is a 45-minute design you can run for Google, Microsoft, or a financial firm, and defend on a ledger or an AI path.

Staff judgment still comes from shipping systems after the program. Hire-level here means a clean structure, a source of truth, one real deep dive, and failure handling.

## Time

- 14 weeks at about 90 minutes a day, 5 days a week, plus an optional 6th day for a blog or a timed mock.
- About 110–125 hours. If most days are 60 minutes, the same syllabus takes about 18 weeks.
- Stop at 2 hours. If the lab is unfinished, write the tradeoff in the journal and close the laptop.
- Two workshops a week. One timed 45-minute drill in weeks 5, 7, 11, and 14.

## How a day works

The reader in `web/` is the course. Open the site above, or the local server. Do the three foundation sessions first, then the weeks in order.

1. **Read only the prompt.** The situation, the givens, and the failure. The idea, the case, the choices, and the reference stay closed.
2. **Place the diagram, do the arithmetic when the page asks, and write the seven notes.** Each note needs a short paragraph. That writing opens the lesson.
3. **Read the lesson and compare.** One mechanism, the case decision, and one reference design. The page names the DDIA chapter. It does not paste the book.
4. **Score each move 0, 1, or 2.** You cannot mark the session done until the seven notes, the diagram, and the scores are filled.

Notes stay in this browser. Use Export on the home page if you switch devices. [`journal/template.md`](journal/template.md) is the same seven moves on paper. [`guides/week-01.md`](guides/week-01.md) explains the card-payment words.

## The seven moves

Every interview and every design review in this program scores the same moves. Google and Microsoft grade all seven. Revolut, Monzo, Visa, Capital One, and JPMorgan Chase still want all seven, and they weight source of truth, idempotency, reconciliation, audit, and the regulatory trail above raw QPS.

Score each move 0, 1, or 2. **0** is missing. **1** is named. **2** is defended with a number, an invariant, or a failure. Hire-level on a drill is 10 or more out of 14, with failure and idempotency at 2 on any money prompt. Google and Microsoft also require estimates and the tradeoff at 2.

| Move | What a 2 looks like |
| --- | --- |
| Scope | Users, in scope, and what you will not build in this hour |
| Estimates | Peak for latency and fleet size, average for storage, arithmetic shown |
| API and data model | Source of truth named, idempotency key named, entities named |
| Diagram | A sync path the caller waits on, and an async path after the ack |
| Deep dive | One riskiest component, and the invariant it protects |
| Failure and idempotency | Timeout, retry, poison message, and what must not happen twice |
| Tradeoff | Consistency, latency, cost, or freshness, and what you gave up |

## Interview signals

Netflix and Uber stay the case studies. Google, Microsoft, Revolut, Monzo, Visa, Capital One, and JPMorgan Chase are the kinds of systems you are practicing for. The lines below are interview signals. They are not a claim about what a named company's interviewer asks.

- Clarify before drawing. Estimate before naming a database. One deep dive, not a tour of every box. Say the tradeoff out loud.
- On a ledger: no negative available balance, no lost payout, no duplicate card charge. Scale comes after those invariants hold.
- On authorization: a latency budget, and a timeout stored as unknown rather than a decline. Clearing and settlement are a later path.
- On a fraud model: a deadline, a named fallback when the model is down, and an audit of the features the decision used.
- On audit: do not silently rewrite the ledger to match a file. A document assistant must not show another client's data. Human review leaves a trail.

## DDIA map

Read the chapter for the idea. The workshops teach the decision.

The reader shows the 2026 second edition first, with the 2017 chapter in parentheses. Kleppmann and Riccomini, *Designing Data-Intensive Applications*, second edition.

| Weeks | Second edition | First edition | Where you use it |
| --- | --- | --- | --- |
| Foundations | Ch 3, 4, and 5. Models, storage, encoding. | Ch 2, 3, and 4 | Accounts versus documents, B-tree versus LSM, old and new payment events |
| 1 | Ch 2. Nonfunctional requirements. Percentiles. | Ch 1 | Auth estimates, chatbot critique |
| 2 | Ch 6 and 10. Replication and consensus. Ch 8. Transactions. | Ch 5, 9, and 7 | Ledger versus feed, charge idempotency |
| 3 | Ch 1 and 13. Derived data. Ch 7. Sharding. | Ch 12 and 6 | Cache boundaries, partition keys |
| 4 | Ch 12. Streams. Ch 9. Partial failure. | Ch 11 and 8 | Outbox, retries, poison messages |
| 5–6 | Ch 2 and 9. Limits under failure. Ch 12 and 13. Fan-out and derived feeds. | Ch 1, 8, 11, and 12 | Rate limiter, notifications, activity feed |
| 6–7 | Ch 11 versus 12. Batch versus stream. Ch 7. Sharding by access pattern. | Ch 10, 11, and 6 | Netflix ranking path, Uber dispatch, location fan-out |
| 8 | Ch 11 and 13. Offline renditions, CDN as a cache. Ch 2. Tail latency. | Ch 10, 12, and 1 | Video path, SLOs |
| 9–11 | Ch 8. Invariants in the transaction. Ch 9 and 11. Reconciling two logs. | Ch 7, 8, and 10 | Ledger, state machine, reconciliation, fraud, wallets |
| 12–13 | Ch 11 and 12. Point-in-time derived features. Ch 3 and 13. Documents and rebuildable indexes. | Ch 10, 11, 2, and 12 | Feature platform, serving, RAG, eval and cost |
| 14 | All of the above on one system | | Payment-risk capstone and the mock |

## Sessions

Do them in the reader, in order. Start with the three foundation sessions, then week 1. The AI labs assume the ledger and the outbox. Read [guides/week-01.md](guides/week-01.md) before the card-authorization session.

Week 2 also runs `python3 labs/idempotency/charge.py`. Week 4 runs `python3 labs/outbox/outbox.py`. Week 9 runs `python3 labs/ledger/ledger.py`.

## Code labs

Three small Python programs, standard library only. They make a correctness bug visible. They are not production services.

```bash
python3 labs/idempotency/charge.py
python3 labs/outbox/outbox.py
python3 labs/ledger/ledger.py
```

## Rules

- Every workshop is money, a marketplace, or a model.
- State a source of truth and an idempotency story before the review will open.
- Every session stays a prompt until the seven notes are written in the reader. Timed drills use the same gate.
- If a week slips, repeat the drill. Do not skip the financial weeks. The AI labs assume the ledger and the outbox.
