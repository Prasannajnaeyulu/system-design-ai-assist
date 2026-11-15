# How a session works

Open the reader at https://prasannajnaeyulu.github.io/system-design-ai-assist/ . Your notes stay in that browser. Export them from the home page before you switch devices.

## What a session is for

You are practicing a design review. The page opens as the prompt only. The choices are a comparison you make after you have already written.

The work that counts is what you write from the failure:

- the record that wins if two stores disagree
- what a retry returns
- the one component you would defend for the last ten minutes
- the tradeoff you are willing to say out loud

The staff review is a reference design. It opens after you commit so you can compare. Matching it is not the grade. A journal that defends a choice with a number or a failure is the grade. Score each of the seven moves 0, 1, or 2. Hire-level on a drill is 10 or more out of 14.

## What to do in the 90 minutes

1. Read the situation, the givens, and the failure. Do not go looking for the idea. It is not on the page yet.
2. Place each step on the path the caller waits for, or on the path that may finish after you have answered. Mark the source of truth.
3. Do the arithmetic when the page asks. Average traffic times 86,400 is a day's writes. Peak traffic sizes servers and the slow tail. Write the arithmetic in the Estimates note. The worked number stays hidden until the notes exist.
4. Write a short paragraph in each of the seven notes. That is what opens the lesson.
5. Read the idea, the case, and the choices. The line under a choice is the consequence. Some posts are about a neighboring problem. The page says what to take from the post.
6. Open the reference and compare it with what you wrote. Then score the seven moves. Fill `journal/<lab-name>.md` from [journal/template.md](../journal/template.md) if you want the same notes on paper.

Stop at two hours. If the lesson is still closed, the tradeoff note is how you resume tomorrow.

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

Every session now opens as the prompt. The later sessions still have a shorter lesson underneath than week 1. The writing is the lab. If a word in the lesson is undefined after it opens, add it to that day's journal in one sentence.

Timed drills in weeks 5, 7, 11, and 14 use the same gate. The givens stay visible. The case and the reference do not.
