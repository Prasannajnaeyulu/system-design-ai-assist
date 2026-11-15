const ORDER = [
  ["week-01-card-authorization", "week-01-banking-chatbot-critique"],
  ["week-02-ledger-vs-feed", "week-02-charge-idempotency"],
  ["week-03-cache-boundaries", "week-03-partitioning"],
  ["week-04-settlement-outbox", "week-04-retries-and-poison"],
  ["week-05-rate-limiter", "week-05-notification-drill"],
  ["week-06-activity-feed", "week-06-netflix-personalization"],
  ["week-07-uber-dispatch", "week-07-location-fanout-drill"],
  ["week-08-video-delivery", "week-08-slo-and-metrics"],
  ["week-09-double-entry-ledger", "week-09-payment-state-machine"],
  ["week-10-reconciliation", "week-10-fraud-decision"],
  ["week-11-wallet-payouts", "week-11-payment-platform-drill"],
  ["week-12-feature-platform", "week-12-model-serving"],
  ["week-13-financial-rag", "week-13-eval-and-cost"],
  ["week-14-payment-risk-capstone", "week-14-mock-interview"],
];

const WEEKS = [
  ["The method", "Start a design before you draw boxes. Place a load balancer and a stateless service, then cut the scope, estimate, and say what a timeout must not do."],
  ["Consistency and idempotency", "A balance that approves a card cannot be a few seconds stale. The index finds the account. A unique index, not an if-statement on one server, makes the retry safe."],
  ["Cache, indexes, and partitions", "A cache is a copy you can rebuild. An index finds a row. A partition key chooses the machine. A balance used to approve a card cannot be the cache."],
  ["Async and failure", "Save the business change and the queue message in one transaction. A cloud queue delivers more than once. A retry repeats the same attempt, and a poison message has to stop."],
  ["Load balancing and notifications", "Limit a money or model route where every instance shares the count. Then design payment receipts as workers on a queue, not as another hop on the card tap."],
  ["Feeds and ranking", "An activity list is derived from the ledger. A homepage of titles is a heavy job done ahead of time, plus a fast rank on the request."],
  ["Marketplace", "A match has a deadline. Live locations are a different path from the history of where someone was."],
  ["Delivery and SLOs", "Video is object storage, workers, and a cache near the viewer. Then name the latency and error numbers you would page on, including the load balancer and a lost zone."],
  ["Ledger and payment states", "Money is entries that sum to zero, on one writer, found by an index and guarded by a lock. Authorization, capture, and refund are states. A timeout is not a decline."],
  ["Breaks and fraud", "After an outage, compare two logs. Do not silently rewrite the ledger. A fraud score has a deadline and a named fallback."],
  ["Wallets", "A wallet cannot go negative and a payout cannot be lost. Then design a slice of a payment platform on a timer."],
  ["Model platform", "The features used to train and the features used to serve must be the same moment in time. If the model is down, the ledger still says what the money did."],
  ["Retrieval and cost", "A document assistant may only see that caller's documents, and it must cite them. Measure quality, and decide when a cheaper model is enough."],
  ["Capstone", "One system: a card attempt, a score, a ledger, a duplicate webhook, and a human review queue. Then a 45-minute mock."],
];

const NOTES = [
  ["scope", "Scope", "Who is the user, what is in this hour, and what you will not design."],
  ["estimates", "Estimates", "Average for disk. Peak and p99 for servers and speed. Show the arithmetic."],
  ["truth", "Source of truth", "The record that wins if a cache, a copy, or a model disagrees."],
  ["diagram", "Sync and async", "What the caller waits for, and what may finish after you have answered."],
  ["dive", "Deep dive", "The one component you would defend, and the rule it protects."],
  ["failure", "Failure", "What the caller sees, and what must not happen twice."],
  ["tradeoff", "Tradeoff", "What you optimized, and what you gave up."],
];

const GLOSSARY = [
  ["Source of truth", "The record that wins when a cache, a replica, or a model disagrees."],
  ["Idempotency key", "An id for this attempt. The same key on a retry returns the stored result. A new key is a new attempt."],
  ["Sync path", "What the caller waits for before you answer."],
  ["Async path", "What may finish after you have already answered."],
  ["p99", "99 of 100 requests finish inside this time. The average can look fine while these do not."],
  ["Hold", "Available balance drops. The shop has not been paid yet."],
  ["Primary", "The copy that accepts the write."],
  ["Follower", "A copy that receives the write afterward and can be seconds behind."],
  ["Ack", "The moment you tell the caller the operation succeeded."],
  ["Load balancer", "Sends a request to a healthy instance. It does not decide the payment."],
  ["Index", "A lookup the database maintains so you find a row without scanning the table."],
  ["Partition key", "Which machine stores this account or entity."],
  ["Cache-aside", "Read the cache. On a miss, read the source and fill the cache."],
  ["Stateless", "Any instance can take the next request because the durable data is elsewhere."],
];

const byFile = Object.fromEntries(window.LESSONS.map((lesson) => [lesson.file, lesson]));
const flat = ORDER.flat();

const storageKey = "sd-training-reader-v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mechanismBlock(file) {
  const block = window.MECHANISMS && window.MECHANISMS[file];
  if (!block) return "";
  const paragraphs = block.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const terms = block.terms
    .map(([term, meaning]) => `<tr><td>${escapeHtml(term)}</td><td>${escapeHtml(meaning)}</td></tr>`)
    .join("");
  return `<h2>${escapeHtml(block.title)}</h2>${paragraphs}<table><thead><tr><th>Term</th><th>In this session</th></tr></thead><tbody>${terms}</tbody></table>`;
}

function weekOf(file) {
  return ORDER.findIndex((pair) => pair.includes(file)) + 1;
}

function doneCount(state, week) {
  const ids = week ? ORDER[week - 1] : flat;
  return ids.filter((id) => state.done && state.done[id]).length;
}

function lessonLink(file) {
  return `#/lesson/${file}`;
}

function renderSidebar(state, activeFile, weekOpen) {
  const weeks = WEEKS.map(([title], index) => {
    const week = index + 1;
    const ids = ORDER[index];
    const open = weekOpen === week;
    const lessons = open
      ? ids
          .map((id) => {
            const lesson = byFile[id];
            const mark = state.done && state.done[id] ? "Done" : "";
            return `<a class="lesson-link ${id === activeFile ? "active" : ""}" href="${lessonLink(id)}">${escapeHtml(lesson.title)} <span class="dot">${mark}</span></a>`;
          })
          .join("")
      : "";
    return `<a class="week-link ${open ? "active" : ""}" href="#/week/${week}"><span>Week ${week}</span><span class="dot">${doneCount(state, week)}/2</span></a>${lessons}`;
  }).join("");
  return `<aside class="side" id="side">
    <a class="brand" href="#/"><small>14 weeks · about 90 minutes a day</small><strong>System design</strong></a>
    <nav>${weeks}</nav>
  </aside>`;
}

function renderHome(state) {
  const next = flat.find((id) => !(state.done && state.done[id])) || flat[0];
  const nextLesson = byFile[next];
  const cards = WEEKS.map(([title, blurb], index) => {
    const week = index + 1;
    return `<a class="week-card" href="#/week/${week}">
      <div class="week-num">Week ${week}<div class="faint">${doneCount(state, week)}/2 read</div></div>
      <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(blurb)}</p></div>
    </a>`;
  }).join("");
  return `<article class="sheet">
    <p class="kicker">Read it week by week</p>
    <h1>System design training</h1>
    <p class="lead">Fourteen weeks, two sessions each, about 90 minutes a day. Each session is something you read, then a short choice, then a place to write the design in your own words.</p>
    <div class="pills"><span class="pill">${doneCount(state)} of 28 sessions marked done</span></div>
    <p><a class="button" href="${lessonLink(next)}">Continue: ${escapeHtml(nextLesson.title)}</a></p>
    <h2>How to use a session</h2>
    <ol class="steps">
      <li>Read the situation, the idea, and the word list. Do not skip to the reference design.</li>
      <li>Make the choices. The line under a choice says what that choice does to the customer.</li>
      <li>Write the seven notes at the bottom. That writing is the practice. Mark the session done when the notes exist, then come back the next day.</li>
    </ol>
    <p class="muted">The companies you are practicing for are Google, Microsoft, Revolut, Monzo, Visa, Capital One, and JPMorgan Chase. Netflix and Uber are the case studies, not the interviewers. The lessons are the same on every device. The notes you type stay in that browser.</p>
    <h2>What you practice placing</h2>
    <p>Every session asks where the durable data lives in a cloud deployment. The service copies are replaceable. The database, the queue, and the file store are not.</p>
    <ul class="steps">
      <li>A load balancer and stateless instances in more than one zone.</li>
      <li>A cache only for data you can rebuild and can afford to serve stale.</li>
      <li>An index for the row, and a partition key for the machine.</li>
      <li>One writer for money, and a queue for the work after you answer.</li>
    </ul>
    <h2>Weeks</h2>
    <div class="week-list">${cards}</div>
  </article>`;
}

function renderWeek(state, week) {
  const [title, blurb] = WEEKS[week - 1];
  const sessions = ORDER[week - 1]
    .map((id, index) => {
      const lesson = byFile[id];
      const mark = state.done && state.done[id] ? "Done" : `Session ${index + 1}`;
      return `<a class="week-card" href="${lessonLink(id)}">
        <div class="week-num">${mark}</div>
        <div><strong>${escapeHtml(lesson.title)}</strong><p>${escapeHtml(lesson.brief)}</p></div>
      </a>`;
    })
    .join("");
  return `<article class="sheet">
    <p class="kicker">Week ${week} of 14</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="lead">${escapeHtml(blurb)}</p>
    <p class="muted">Two sessions. Stop at two hours even if a session is unfinished, and write the tradeoff before you close the laptop.</p>
    <div class="week-list">${sessions}</div>
    <p><a href="#/">All weeks</a></p>
  </article>`;
}

function renderLesson(state, file) {
  const lesson = byFile[file];
  if (!lesson) return `<article class="sheet"><h1>Missing session</h1><p><a href="#/">Back home</a></p></article>`;
  const week = weekOf(file);
  const picks = (state.picks && state.picks[file]) || {};
  const notes = (state.notes && state.notes[file]) || {};
  const showDebrief = !lesson.timed || Boolean(state.debrief && state.debrief[file]);
  const words = lesson.words && lesson.words.length ? lesson.words : GLOSSARY;
  const wordTable = `<table><thead><tr><th>Word</th><th>Meaning</th></tr></thead><tbody>${words
    .map(([term, meaning]) => `<tr><td>${escapeHtml(term)}</td><td>${escapeHtml(meaning)}</td></tr>`)
    .join("")}</tbody></table>`;
  const stats = lesson.numbers
    .map((item) => `<div class="stat"><b>${escapeHtml(item.value)}</b><span>${escapeHtml(item.label)}</span></div>`)
    .join("");
  const given = `<table><thead><tr>${lesson.tableHeaders.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${lesson.tableRows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
  const choices = lesson.choices
    .map((choice) => {
      const options = choice.options
        .map((option) => {
          const picked = picks[choice.id] === option.value;
          const reveal = showDebrief && option.value === choice.sound;
          return `<button class="opt ${picked ? "picked" : ""} ${reveal ? "match" : ""}" data-choice="${escapeHtml(choice.id)}" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>${
            picked && option.effect ? `<p class="effect">${escapeHtml(option.effect)}</p>` : ""
          }`;
        })
        .join("");
      const staff =
        showDebrief && picks[choice.id]
          ? `<p class="muted">${escapeHtml(choice.staff)}</p>`
          : "";
      return `<div class="choice"><h3>${escapeHtml(choice.prompt)}</h3>${options}${staff}</div>`;
    })
    .join("");
  const noteFields = NOTES.map(([id, label, hint]) => {
    return `<label class="note"><h3>${escapeHtml(label)}</h3><p class="faint">${escapeHtml(hint)}</p><textarea data-note="${id}">${escapeHtml(notes[id] || "")}</textarea></label>`;
  }).join("");
  const reviewBody = `<div class="callout"><strong>Reference design</strong><p>${escapeHtml(lesson.reviewIntro)}</p>${lesson.review
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("")}</div>
      <table><thead><tr><th>Move</th><th>What a strong answer includes</th></tr></thead><tbody>${lesson.rubric
        .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`)
        .join("")}</tbody></table>`;
  const review = showDebrief
    ? `<details class="reference"><summary>Open the reference design after you have written your notes</summary>${reviewBody}</details>`
    : `<div class="callout warn"><strong>Write first</strong><p>This is a timed drill. Write the seven notes below before you open the case debrief and the reference design.</p><button class="primary" id="show-debrief">I have written my notes. Show the debrief.</button></div>`;
  const caseBlock = showDebrief
    ? `<h2>The case</h2><p>${escapeHtml(lesson.caseBody)}</p><p><a href="${escapeHtml(lesson.caseUrl)}" target="_blank" rel="noreferrer">${escapeHtml(lesson.caseLink)}</a></p>`
    : "";
  const code = lesson.codeLab
    ? `<div class="callout"><strong>Then run the code lab</strong><p>${escapeHtml(lesson.codeLab)}</p></div>`
    : "";
  const prompt = lesson.timed && lesson.sealed ? `<div class="callout warn"><strong>The prompt</strong><p>${escapeHtml(lesson.sealed)}</p></div>` : "";
  const index = flat.indexOf(file);
  const prev = index > 0 ? flat[index - 1] : "";
  const next = index < flat.length - 1 ? flat[index + 1] : "";
  const done = state.done && state.done[file];
  return `<article class="sheet">
    <p class="kicker"><a href="#/week/${week}">Week ${week}</a> · ${escapeHtml(lesson.minutes)}</p>
    <h1>${escapeHtml(lesson.title)}</h1>
    <div class="pills">
      <span class="pill">${escapeHtml(lesson.company)}</span>
      ${lesson.timed ? `<span class="pill">Timed drill</span>` : ""}
      ${done ? `<span class="pill">Marked done</span>` : ""}
    </div>
    <p class="lead">${escapeHtml(lesson.brief)}</p>
    ${lesson.goal ? `<div class="callout good"><strong>Goal of this session</strong><p>${escapeHtml(lesson.goal)}</p></div>` : ""}
    ${prompt}
    <h2>The idea</h2>
    <p>${escapeHtml(lesson.idea)}</p>
    <div class="callout"><strong>${escapeHtml(lesson.ddiaTitle)}</strong><p>${escapeHtml(lesson.ddiaBody)}</p></div>
    <div class="callout"><strong>${escapeHtml(lesson.barTitle)}</strong><p>${escapeHtml(lesson.barBody)}</p></div>
    ${mechanismBlock(file)}
    <h2>${lesson.words && lesson.words.length ? "Words this session uses" : "Words that show up in every session"}</h2>
    ${wordTable}
    <h2>Numbers</h2>
    <div class="stats">${stats}</div>
    ${given}
    ${caseBlock}
    ${code}
    <h2>The failure you have to handle</h2>
    <div class="callout warn"><strong>${escapeHtml(lesson.failureTitle)}</strong><p>${escapeHtml(lesson.failureBody)}</p></div>
    <h2>Choose, then read what it does</h2>
    <p class="muted">Pick the cut you would defend. If a line appears under it, that is the consequence, not the score. The reference design is below, after you write.</p>
    ${choices}
    <h2>Write the design</h2>
    <p class="muted">These notes stay in this browser. A 2 on the score is a number, a rule, or a failure. A 1 is only the name of the idea.</p>
    ${noteFields}
    <div class="row">
      <button class="primary" id="mark-done">${done ? "Marked done" : "Mark this session done"}</button>
      <a class="button" href="#/week/${week}">Back to week ${week}</a>
    </div>
    <h2>Reference design</h2>
    <p class="muted">Read this after your notes. It is one defensible design, not the only one. Compare the rule it protects with the rule you wrote.</p>
    ${review}
    <div class="pager">
      ${prev ? `<a href="${lessonLink(prev)}">← ${escapeHtml(byFile[prev].title)}</a>` : "<span></span>"}
      ${next ? `<a href="${lessonLink(next)}">${escapeHtml(byFile[next].title)} →</a>` : "<span></span>"}
    </div>
  </article>`;
}

function shell(state, main, activeFile, weekOpen) {
  return `${renderSidebar(state, activeFile, weekOpen)}
    <main class="main">
      <button class="ghost menu-toggle" id="menu-toggle" type="button">Weeks</button>
      ${main}
    </main>`;
}

function render() {
  const state = loadState();
  const hash = location.hash || "#/";
  const lessonMatch = hash.match(/^#\/lesson\/([\w-]+)$/);
  const weekMatch = hash.match(/^#\/week\/(\d+)$/);
  let main = renderHome(state);
  let activeFile = "";
  let weekOpen = 0;
  if (lessonMatch && byFile[lessonMatch[1]]) {
    activeFile = lessonMatch[1];
    weekOpen = weekOf(activeFile);
    main = renderLesson(state, activeFile);
    state.last = hash;
    saveState(state);
  } else if (weekMatch) {
    const week = Number(weekMatch[1]);
    if (week >= 1 && week <= 14) {
      weekOpen = week;
      main = renderWeek(state, week);
    }
  }
  document.getElementById("app").innerHTML = shell(state, main, activeFile, weekOpen);
  const toggle = document.getElementById("menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.getElementById("side").classList.toggle("open"));
  }
  document.querySelectorAll("button.opt").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadState();
      next.picks = next.picks || {};
      next.picks[activeFile] = next.picks[activeFile] || {};
      next.picks[activeFile][button.dataset.choice] = button.dataset.value;
      saveState(next);
      render();
    });
  });
  document.querySelectorAll("textarea[data-note]").forEach((area) => {
    area.addEventListener("input", () => {
      const next = loadState();
      next.notes = next.notes || {};
      next.notes[activeFile] = next.notes[activeFile] || {};
      next.notes[activeFile][area.dataset.note] = area.value;
      saveState(next);
    });
  });
  const doneButton = document.getElementById("mark-done");
  if (doneButton) {
    doneButton.addEventListener("click", () => {
      const next = loadState();
      next.done = next.done || {};
      next.done[activeFile] = true;
      saveState(next);
      render();
    });
  }
  const debrief = document.getElementById("show-debrief");
  if (debrief) {
    debrief.addEventListener("click", () => {
      const next = loadState();
      next.debrief = next.debrief || {};
      next.debrief[activeFile] = true;
      saveState(next);
      render();
    });
  }
}

window.addEventListener("hashchange", render);
render();
