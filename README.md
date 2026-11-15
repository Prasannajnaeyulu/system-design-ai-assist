# System design training

Open the reader on any device: [https://prasannajnaeyulu.github.io/system-design-ai-assist/](https://prasannajnaeyulu.github.io/system-design-ai-assist/)

Or run it locally and go week by week:

```bash
cd web
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765). Your notes and your place stay in that browser. Each week is two sessions: read the situation, make a choice, write the seven notes, then read the reference design.

You can build an API and a database. This program trains the next skill: making a design hold together when a call times out, a replica lags, or a model is slow. The finish line is a 45-minute design you can run for Google, Microsoft, or a financial firm, and defend on a ledger or an AI path.

Staff judgment still comes from shipping systems after the program. Hire-level here means a clean structure, a source of truth, one real deep dive, and failure handling.

## Time

- 14 weeks at about 90 minutes a day, 5 days a week, plus an optional 6th day for a blog or a timed mock.
- About 110–125 hours. If most days are 60 minutes, the same syllabus takes about 18 weeks.
- Stop at 2 hours. If the lab is unfinished, write the tradeoff in the journal and close the laptop.
- Two workshops a week. One timed 45-minute drill in weeks 5, 7, 11, and 14.

## How a day works

1. **15 minutes — one idea.** One mechanism, one number, one failure. The workshop names the DDIA chapter idea so you can map it back to the book. The workshop does not paste the book.
2. **20 minutes — one case.** Netflix or Uber is the case file. Read for the decision and what they gave up. Write five lines in the journal. Do not summarize the post.
3. **45 minutes — the workshop.** Open the canvas beside the chat. Each decision unlocks the next one. Then the lab injects a failure.
4. **10 minutes — the journal.** Copy [`journal/template.md`](journal/template.md) to `journal/<lab-name>.md` and fill it.

The canvas reveals the staff review only after you commit a source of truth and an idempotency story, and after you say what the failure does. Timed drills stay closed-book until the journal is submitted in the canvas.

A canvas is a live panel you open beside the chat. Click a link below. The `.canvas.tsx` file is the source of that panel. Reading it top to bottom shows later questions and the hidden review early, which skips the exercise.

Start from [Training home](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/training-home.canvas.tsx). Mark a lab there only after its journal exists. Read [guides/how-a-session-works.md](guides/how-a-session-works.md) once. The dropdown is a warm-up. The writing after the failure is the lab.

Week 1 has a plain-language guide for the goal, the flow, and the payment words. Read it before the first panel: [guides/week-01.md](guides/week-01.md). The card lab asks you to compute a day's storage and to place each step on the path the customer waits for, or the path that may finish later. The ledger lab in week 2 does the same for a balance check versus a home-screen feed. Later labs are still three choices and a writeup. Use them the same way.

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

## Who you are practicing for

Netflix and Uber stay the case studies. The bar you are practicing is the target companies.

- **Google and Microsoft.** Clarify before drawing. Estimate before naming a database. One deep dive, not a tour of every box. Say the tradeoff out loud. They interrupt.
- **Revolut and Monzo.** The ledger is the product. No negative available balance, no lost payout, no duplicate card charge. Mobile scale matters after those invariants hold.
- **Visa.** Authorization has a latency budget. A timeout is an unknown outcome, not a decline. Clearing and settlement are a different path from the auth decision, and reconciliation is where they meet.
- **Capital One.** The fraud model has a deadline. Name the fallback when the model is down. Audit the features the decision used.
- **JPMorgan Chase.** Audit and entitlement. Do not silently rewrite the ledger to match a file. A document assistant must not show another client's data. Human review leaves a trail.

## DDIA map

Read the chapter for the idea. The workshops teach the decision.

| Weeks | Chapter idea | Where you use it |
| --- | --- | --- |
| 1 | Ch 1. Reliable, scalable, maintainable. Percentiles, not averages. | Auth estimates, chatbot critique |
| 2 | Ch 5 and 9. Replication lag and consistency models. Ch 7. Transactions. | Ledger versus feed, charge idempotency |
| 3 | Ch 12. Derived data. Ch 6. Partitioning and hot keys. | Cache boundaries, partition keys |
| 4 | Ch 11. Streams and the dual write. Ch 8. Partial failure. | Outbox, retries, poison messages |
| 5–6 | Ch 1 and 8. Limits under failure. Ch 11 and 12. Fan-out and derived feeds. | Rate limiter, notifications, activity feed |
| 6–7 | Ch 10 versus 11. Batch versus stream. Ch 6. Access-pattern partitioning. | Netflix ranking path, Uber dispatch, location fan-out |
| 8 | Ch 10 and 12. Offline renditions, CDN as a cache. Ch 1. Tail latency. | Video path, SLOs |
| 9–11 | Ch 7. Invariants in the transaction. Ch 8 and 10. Reconciling two logs. | Ledger, state machine, reconciliation, fraud, wallets |
| 12–13 | Ch 10 and 11. Point-in-time derived features. Ch 2 and 12. Document access and rebuildable indexes. | Feature platform, serving, RAG, eval and cost |
| 14 | All of the above on one system | Payment-risk capstone and the mock |

## Workshops

Do them in order. The AI labs assume the ledger and the outbox.

### Week 1 — The method

Read [guides/week-01.md](guides/week-01.md) first. The week teaches the opening of a design: cut scope, pick the number that sizes disk versus the number that sizes servers, name the source of truth, and say what a timeout must not do. Session 1 is a card tap. Session 2 is a chatbot that must not become the ledger. You are not designing clearing, a full ledger, or a model platform yet.

- [Card authorization estimates](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-01-card-authorization.canvas.tsx)
- [Repair a banking chatbot design](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-01-banking-chatbot-critique.canvas.tsx)

### Week 2 — Consistency and idempotency

- [Ledger versus activity feed](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-02-ledger-vs-feed.canvas.tsx)
- [Charge idempotency](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-02-charge-idempotency.canvas.tsx) — then run `python3 labs/idempotency/charge.py`

### Week 3 — Cache and partitioning

- [Cache boundaries](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-03-cache-boundaries.canvas.tsx)
- [Partitioning payments and features](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-03-partitioning.canvas.tsx)

### Week 4 — Async and failure

- [Settlement outbox](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-04-settlement-outbox.canvas.tsx) — then run `python3 labs/outbox/outbox.py`
- [Retries and poison messages](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-04-retries-and-poison.canvas.tsx)

### Week 5 — Limits and notifications

- [Rate limiter](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-05-rate-limiter.canvas.tsx)
- [Notification drill, closed book](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-05-notification-drill.canvas.tsx)

### Week 6 — Feeds and ranking

- [Account activity feed](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-06-activity-feed.canvas.tsx)
- [Netflix personalization path](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-06-netflix-personalization.canvas.tsx)

### Week 7 — Marketplace

- [Uber dispatch](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-07-uber-dispatch.canvas.tsx)
- [Location fan-out drill, closed book](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-07-location-fanout-drill.canvas.tsx)

### Week 8 — Delivery and SLOs

- [Video delivery path](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-08-video-delivery.canvas.tsx)
- [SLOs for payments and models](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-08-slo-and-metrics.canvas.tsx)

### Week 9 — Ledger and payment states

- [Double-entry ledger](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-09-double-entry-ledger.canvas.tsx) — then run `python3 labs/ledger/ledger.py`
- [Auth, capture, refund](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-09-payment-state-machine.canvas.tsx)

### Week 10 — Breaks and fraud

- [Reconciliation](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-10-reconciliation.canvas.tsx)
- [Fraud decision](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-10-fraud-decision.canvas.tsx)

### Week 11 — Wallets

- [Wallet and payouts](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-11-wallet-payouts.canvas.tsx)
- [Payment platform drill, closed book](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-11-payment-platform-drill.canvas.tsx)

### Week 12 — Model platform

- [Feature platform](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-12-feature-platform.canvas.tsx)
- [Model serving](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-12-model-serving.canvas.tsx)

### Week 13 — Retrieval and eval

- [RAG over financial documents](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-13-financial-rag.canvas.tsx)
- [Eval and cost](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-13-eval-and-cost.canvas.tsx)

### Week 14 — Capstone

- [Payment-risk platform](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-14-payment-risk-capstone.canvas.tsx)
- [Full mock, closed book](/Users/anvitharaobuddabathuni/.cursor/projects/Users-anvitharaobuddabathuni-system-design-ai-assist/canvases/week-14-mock-interview.canvas.tsx)

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
- Timed drills are closed-book. The canvas hides the case debrief and the staff review until the journal is in.
- If a week slips, repeat the drill. Do not skip the financial weeks. The AI labs assume the ledger and the outbox.
