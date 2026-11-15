# How a session works

Open the panel from the link in [README.md](../README.md). Do not study the `.canvas.tsx` file. That file is the program that draws the panel. Reading it shows later questions and the hidden review early.

A canvas is a live panel beside the chat. Your answers stay in it after you close the laptop.

## What a session is for

You are practicing a design review, not collecting the right dropdown.

The dropdowns are a warm-up. They force a cut: scope, a number, or a consistency choice. The work that counts is what you write after the failure shows up:

- the record that wins if two stores disagree
- what a retry returns
- the one component you would defend for the last ten minutes
- the tradeoff you are willing to say out loud

The staff review is a reference design. It opens after you commit so you can compare. Matching it is not the grade. A journal that defends a choice with a number or a failure is the grade. Score each of the seven moves 0, 1, or 2. Hire-level on a drill is 10 or more out of 14.

## What to do in the 90 minutes

1. Read the goal and the word list on the panel. If a word is not in that list and you cannot say it in one sentence, write the sentence in the journal before you continue.
2. Read the case link for one decision the team made and what it cost them. Five lines. Some posts are about a neighboring problem. The panel says what to take from the post. Do not summarize it.
3. Answer the choices. Read the consequence that appears under the one you picked. If the consequence is a customer getting charged twice or waiting on the wrong clock, change the choice before you move on.
4. On the early labs, do the arithmetic on the panel. Average traffic times 86,400 is a day's writes. Peak traffic sizes servers and the slow tail. The panel checks your order of magnitude.
5. On the card lab, place each step on the path the customer waits for, or on the path that may finish after you have already answered.
6. Read the failure. Write what the caller sees and what must not happen twice.
7. Commit. Read the review. Then fill `journal/<lab-name>.md` from [journal/template.md](../journal/template.md).

Stop at two hours. If the review is still hidden, write the tradeoff in the journal anyway. That file is how you resume tomorrow.

## Words that show up on every lab

| Word | Meaning |
| --- | --- |
| Who is grading | The interview standard for this hour. Visa cares about a timeout. Google and Microsoft care that you did the arithmetic before naming a database. It is not a chart. |
| Source of truth | The record that wins when a cache, a replica, or a model disagrees. |
| Idempotency key | An id for this attempt. The same key on a retry returns the stored result. A new key is a new attempt. |
| Sync path | What the caller waits for before you answer. |
| Async path | What may finish after you have already answered. |
| p99 | 99 of 100 requests finish inside this time. The average can look fine while these do not. |
| Hold | Available balance drops. The shop has not been paid. |

## Where the materials are still thin

Week 1 and the ledger lab in week 2 explain the words, show the consequence of a choice, and make you compute or place steps. The later labs still use the older shape: three dropdowns, then writing, then a hidden review. Use them the same way. The writing is the lab. The dropdown is only the cut. If a word on those panels is undefined, add it to that day's journal in one sentence before you answer.

Timed drills in weeks 5, 7, 11, and 14 still show the numbers on the panel. Treat the journal as the closed-book answer. Do not scroll to the review, and do not open the case link, until you have committed.
