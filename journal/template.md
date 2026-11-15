# Design journal

Copy this file to `journal/<lab-name>.md` before the workshop. Fill it in your last 10 minutes. Timed drills are scored from this page alone.

- Lab:
- Date:
- Minutes spent:
- Company bar (Google, Microsoft, Revolut, Monzo, Visa, Capital One, or JPMorgan Chase):
- DDIA chapter idea you used:

## 1. Scope

- Users:
- In scope:
- Out of scope:

## 2. Estimates

Use average traffic for storage and peak traffic for latency and fleet size.

- Average QPS:
- Peak QPS:
- Payload size:
- Hot retention:
- Storage (show the arithmetic):
- Bandwidth (show the arithmetic):
- p99 target:

## 3. API and data model

- Source of truth:
- Idempotency key (who creates it, where it is stored, how long it lives):
- Main entities:
- Write path API:

## 4. Diagram

- Sync path (what the caller waits for):
- Async path (what happens after the ack):

## 5. Deep dive

- Riskiest component:
- Why this one, for this company:
- The invariant it protects:

## 6. Failure

- Failure injected:
- What a caller observes:
- What must not happen to money, a match, or a model decision:
- Retry rule:
- Poison-message rule:

## 7. Tradeoff

- What you optimized (consistency, latency, cost, or freshness):
- What you gave up:
- What you would revisit with another week:

## Case notes

Five lines. The decision the case made, and what it gave up. Do not summarize the article.
