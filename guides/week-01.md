# Week 1 — The method

Week 1 does not teach a new database or a new framework. It teaches the opening of every design interview and every design review you will do in this program.

You do two 90-minute sessions:

1. Card authorization estimates, in the reader — a card tap at a shop terminal.
2. Repair a banking chatbot design, in the reader — a proposal that lets a language model move money.

Open them from the site. The page starts as the prompt. The idea, the choices, and the reference open after the seven notes are paragraphs.

## Goal

Leave week 1 able to start a design without drawing boxes first.

On any prompt you should be able to say, in this order:

1. Who the user is, what you will design in this hour, and what you will name and then set aside.
2. Which number sizes disk, and which number sizes servers and response time.
3. Which record is the source of truth if a cache, a model, or another service disagrees.
4. What the caller sees when a dependency does not answer, and what must not happen twice.

Session 1 practices that on a payment path. Session 2 practices it on an AI path. The moves are the same.

## What you can do by the end of week 1

- Cut a card-payment design down to the decision at the terminal, and say why clearing, settlement, and disputes are a later design.
- Estimate storage from average traffic and estimate servers and latency from peak traffic, with the arithmetic written down.
- Tell a recorded decline apart from an unknown outcome, and say why treating "the bank went quiet" as "the bank said no" is a bug.
- Name the durable row that an auditor would trust for an approval.
- Look at a design that says "the LLM answers balances and sends money" and split it into a read, a confirmed payment, and an audit log.
- Score your own writeup 0, 1, or 2 on the seven moves in [README.md](../README.md). A 2 is a number, an invariant, or a failure. A 1 is only the name of the idea.

You are not expected to design Visa's network, a ledger, or a model platform this week. Those are later weeks. This week is the habit those weeks depend on.

## How one session moves

The panel is a sequence, not a document.

1. Read the situation, the givens, and the failure. Copy [journal/template.md](../journal/template.md) to `journal/week-01-card-authorization.md` or `journal/week-01-banking-chatbot.md` if you want a paper copy.
2. Place the diagram and write the seven notes in the reader. Each note is a short paragraph. The lesson is still closed.
3. When the notes exist, read the case for the decision and the cost, then the choices. Compare the consequence with what you wrote.
4. Open the reference. It is one design from the interviewer side. Score the seven moves.

Your choices stay in the panel after you close it. If you stop early, reopen the same panel tomorrow and finish the journal before you start session 2.

## Session 1 — the situation

A customer taps a card. The shop terminal needs an answer while the customer is still standing there: approved, declined, or "we do not know yet." You have about 150 milliseconds for 99 out of 100 taps.

You are designing that decision for a US card issuer. The issuer is the customer's bank. The terminal asks your system. Your system may ask the card network and the bank. Then you record what happened and answer the terminal.

The numbers on the panel are the whole sizing exercise:

- 200 attempts per second is a normal moment. Use this for how much you store.
- 2,000 attempts per second is a rush, such as a holiday afternoon. Use this for how many servers you run and whether you can still answer in time.
- 150 milliseconds is the p99 budget. Explained below.
- 500 bytes is one durable record of one attempt.

Rough storage, which you should be able to reproduce: 200 per second times 86,400 seconds is about 17 million records a day. Times 500 bytes is about 8.5 GB a day before indexes and extra copies. That is ordinary disk. The hard part of this design is the clock, not the bytes.

## The phrases that are easy to misread

### "Clearing and settlement exist, and they are not this hour."

A card tap starts a decision. It does not, by itself, pay the shop.

- **Authorization**, this session. The bank says yes, no, or nothing, in a fraction of a second. A yes usually places a **hold**: the available balance drops so the customer cannot spend that amount again, and the shop has not been paid yet.
- **Clearing**, later the same day or the next. The shop submits the actual amount. Tips and partial shipments mean it can differ from the hold.
- **Settlement**, after clearing. Money moves between banks.
- **Disputes**, days or months later. The customer says the charge was wrong.

Those later steps are real systems with different clocks and different correctness rules. "They are not this hour" means you say they exist, you say you are not designing them in this 90 minutes, and you do not draw them. An interviewer at Visa listens for that cut. Drawing auth, clearing, settlement, and disputes in one picture looks thorough and leaves you with no time for the decision that has a deadline.

### "The next person can tell a decline from an unknown."

Three recorded outcomes, and they are not interchangeable.

- **Approved.** The bank said yes. A hold exists.
- **Declined.** The bank said no. Do not retry the same attempt as if it were a new purchase. The customer can try a different card.
- **Unknown.** The bank did not answer in time, or the answer was lost before you stored it. You do not know whether a hold exists.

Maintainable here means the stored row uses different values for those three. The next engineer, the customer support tool, and an auditor can tell them apart without reading your code.

The bug is storing a timeout as a decline. The customer is told "the bank refused" when the bank was silent. A retry may then be treated as a new purchase and place a second hold. Or the reverse bug: you retry blindly and place a second hold because you did not store the first approval.

### "Percentiles rather than averages. Which number sizes latency, and which number sizes storage."

This is from chapter 1 of *Designing Data-Intensive Applications*. Two different mistakes hide inside the word "average."

**Latency.** Suppose 99 taps return in 80 milliseconds and 1 tap waits 2 seconds. The average is still close to 80 milliseconds, and the customer who waited 2 seconds felt a failure. A **percentile** says how bad the slow tail is. **p99 of 150 milliseconds** means 99 out of 100 taps finish within 150 milliseconds. Chapter 1 asks for that number because the average hides the tail. You size servers and the pool of connections to the bank for the peak of 2,000 per second, so the tail still fits in 150 milliseconds.

**Storage.** The peak does not last all day. If you multiply 2,000 per second by a full day, you plan for about ten times more disk than the 200-per-second average will write. That extra disk does not make the terminal faster. Disk is sized from the average. Servers and the latency budget are sized from the peak.

So the sentence "which number sizes latency, and which number sizes storage" means: peak and p99 for speed and fleet, average for bytes.

### "Bar: Visa and Capital One, with a Google estimate"

**Bar** means the standard that interview is grading, not a chart and not a toolbar.

This hour mixes two standards on purpose.

- **Visa** runs authorization. They will ask whether a timeout is stored as "unknown" rather than "declined," and whether a retry places a second hold.
- **Capital One** is a card issuer. They will ask whether the path still has a defined behavior when a dependency is slow, such as a fraud check or the network call.
- **A Google or Microsoft estimate** is the habit of doing the arithmetic before you name a database. If you say "Postgres" or "Kafka" before you have shown average-for-disk and peak-for-latency, they stop you. The product rules in this hour are Visa and Capital One. The discipline of the numbers is Google and Microsoft.

The staff review stays hidden until you commit so you practice making the call, then compare. Matching the review is not the point of the journal. Defending your call with a number or a failure is the point.

## Session 2 — why it is the second half of the same week

A teammate proposes one box labeled "LLM" that answers balances and moves money. You are in a design review in an hour. Your job is to repair the design, not to invent a chatbot product.

The same four moves apply.

- Scope: the model may read. A payment is a different API the user confirms. The model is not the ledger.
- Numbers: a balance answer has a deadline. A payment has a different deadline. "30 chat turns per second" does not size the ledger.
- Source of truth: a spoken balance comes from a ledger read on that request. The model's memory of an earlier turn is not a balance.
- Failure: if the payments call times out, the assistant says the outcome is unknown. It does not say "I sent the money." A retry uses the same idempotency key.

**Idempotency key**, in both sessions: an id for this attempt, created by the caller, stored with the outcome. The same key on a retry returns the stored outcome. A new key is a new attempt and may move money or place a hold again.

By the end of session 2 you have used the method on money and on a model. Week 2 starts the mechanisms: consistency, then a charge endpoint that makes a duplicate charge visible in code.
