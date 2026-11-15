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
for (const lesson of window.FOUNDATIONS || []) byFile[lesson.file] = lesson;
const foundationIds = (window.FOUNDATIONS || []).map((lesson) => lesson.file);
const flat = [...foundationIds, ...ORDER.flat()];

const DIAGRAM_NODES = [
  ["client", "Client"],
  ["lb", "Load balancer"],
  ["service", "Service"],
  ["db", "Database"],
  ["cache", "Cache"],
  ["queue", "Queue"],
  ["object", "Object storage"],
  ["third", "Third party"],
];

const ESTIMATES = {
  "week-01-card-authorization": {
    prompt: "200 authorizations a second, 500 bytes each. How many GB do you store in one day, before indexes and copies? Enter a number.",
    unit: "GB/day",
    low: 6,
    high: 12,
    method: "200 × 86,400 × 500 bytes, divided by 1e9, is about 8.6 GB/day.",
  },
  "week-05-notification-drill": {
    prompt: "Peak 5,000 sends a second. A quiet hour is about 500. If you size a full day of disk from the peak, by what factor do you overbuild? Enter the factor.",
    unit: "times",
    low: 8,
    high: 12,
    method: "5,000 / 500 is 10. Peak sizes workers. Average sizes a day's records.",
  },
  "week-09-double-entry-ledger": {
    prompt: "150 postings a second on average, 400 bytes each, kept 7 years. About how many TB is that before copies? Enter a number.",
    unit: "TB",
    low: 8,
    high: 20,
    method: "150 × 86,400 × 400 × 365 × 7 / 1e12 is about 13 TB.",
  },
};

const COMPETENCY_OF = {
  "foundation-data-models": ["Data models"],
  "foundation-storage": ["Indexing", "Storage engines"],
  "foundation-schema": ["Schema evolution"],
  "week-01-card-authorization": ["Requirements", "Estimation", "Load balancing"],
  "week-01-banking-chatbot-critique": ["Requirements", "Correctness"],
  "week-02-ledger-vs-feed": ["Replication", "Consistency", "Indexing"],
  "week-02-charge-idempotency": ["Idempotency", "Transactions"],
  "week-03-cache-boundaries": ["Caching"],
  "week-03-partitioning": ["Partitioning", "Indexing"],
  "week-04-settlement-outbox": ["Queues", "Derived data"],
  "week-04-retries-and-poison": ["Failure handling"],
  "week-05-rate-limiter": ["Load balancing", "Reliability"],
  "week-05-notification-drill": ["Queues", "Idempotency"],
  "week-06-activity-feed": ["Derived data", "Indexing"],
  "week-06-netflix-personalization": ["Derived data", "Caching"],
  "week-07-uber-dispatch": ["Indexing", "Consistency"],
  "week-07-location-fanout-drill": ["Queues", "Failure handling"],
  "week-08-video-delivery": ["Caching", "Reliability"],
  "week-08-slo-and-metrics": ["Observability"],
  "week-09-double-entry-ledger": ["Ledger", "Transactions", "Indexing"],
  "week-09-payment-state-machine": ["Payments", "Idempotency"],
  "week-10-reconciliation": ["Reconciliation"],
  "week-10-fraud-decision": ["Fraud", "Reliability"],
  "week-11-wallet-payouts": ["Ledger", "Idempotency"],
  "week-11-payment-platform-drill": ["Payments", "Tradeoffs"],
  "week-12-feature-platform": ["Derived data", "ML serving"],
  "week-12-model-serving": ["ML serving", "Reliability"],
  "week-13-financial-rag": ["Security", "Indexing"],
  "week-13-eval-and-cost": ["ML serving", "Tradeoffs"],
  "week-14-payment-risk-capstone": ["Payments", "Correctness", "Failure handling"],
  "week-14-mock-interview": ["Tradeoffs", "Estimation"],
};

const CASE_NOTES = {
  "week-06-netflix-personalization": "The 2013 post is a historical architecture. Decision to keep: candidates are computed before the request, and ranking has a deadline. A 2025 post describes a foundation model for preferences. Do not describe the 2013 pipeline as the current stack, and do not copy their services. A fraud score has the same shape: heavy features ahead of time, a small fresh lookup on the tap.",
  "week-07-uber-dispatch": "Decision to keep: a spatial index so a nearby lookup is not a scan of every driver. The neighbor-cell search in this exercise is inspired by H3. It is not a documented Uber dispatch algorithm. Do not copy a hex index into a ledger.",
  "week-02-ledger-vs-feed": "Decision to keep: one read must see the latest commit and another may lag. Their hex index is a neighboring problem. The lesson is the cut, not the hexes.",
  "foundation-data-models": "Decision to keep: the ledger stays a zero-sum record while the platform around it changes. Do not copy the org chart of services.",
};

const storageKey = "sd-training-reader-v1";

function plainEnough(value, depth) {
  if (depth > 6) return false;
  if (value == null || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length <= 8000;
  if (Array.isArray(value)) return value.every((item) => plainEnough(item, depth + 1));
  if (typeof value === "object") return Object.values(value).every((item) => plainEnough(item, depth + 1));
  return false;
}

function cleanImport(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
  const next = { schemaVersion: 1 };
  for (const key of ["notes", "picks", "done", "debrief", "diagrams", "estimates", "scores"]) {
    if (parsed[key] == null) continue;
    if (!plainEnough(parsed[key], 0)) throw new Error("value");
    next[key] = parsed[key];
  }
  if (typeof parsed.last === "string" && parsed.last.length < 200) next.last = parsed.last;
  if (!next.notes && !next.done && !next.scores && !next.diagrams) throw new Error("empty");
  if (JSON.stringify(next).length > 1000000) throw new Error("size");
  return next;
}

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

function estimateFeedback(estimate, saved, written) {
  if (!saved || saved.value === undefined || saved.value === "") return "";
  if (!written) return `<p class="muted">Saved. The worked arithmetic opens with the lesson, after the seven notes.</p>`;
  const message = saved.ok ? `That order of magnitude holds. ${estimate.method}` : `Not yet. ${estimate.method}`;
  return `<p class="muted">${escapeHtml(message)}</p>`;
}

function notesReady(state, file) {
  const notes = (state.notes && state.notes[file]) || {};
  return NOTES.every((item) => (notes[item[0]] || "").trim().length >= 40);
}

function diagramReady(state, file) {
  const diagram = (state.diagrams && state.diagrams[file]) || {};
  const lanes = diagram.lanes || {};
  const values = Object.values(lanes);
  return Boolean(diagram.truth) && values.includes("sync") && values.includes("async");
}

function estimateReady(state, file) {
  if (!ESTIMATES[file]) return true;
  return Boolean(state.estimates && state.estimates[file] && state.estimates[file].ok);
}

function scoresReady(state, file) {
  const scores = (state.scores && state.scores[file]) || {};
  return NOTES.every((item) => ["0", "1", "2"].includes(scores[item[0]]));
}

function readiness(state, file) {
  const missing = [];
  if (!diagramReady(state, file)) missing.push("place at least one sync step, one async step, and a source of truth");
  if (!estimateReady(state, file)) missing.push("check the arithmetic");
  if (!notesReady(state, file)) missing.push("write a real paragraph in each of the seven notes");
  if (!scoresReady(state, file)) missing.push("score each move 0, 1, or 2");
  return missing;
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
            return `<a class="lesson-link ${id === activeFile ? "active" : ""}" href="${lessonLink(id)}" ${id === activeFile ? 'aria-current="page"' : ""}>${escapeHtml(lesson.title)} <span class="dot">${mark}</span></a>`;
          })
          .join("")
      : "";
    return `<a class="week-link ${open ? "active" : ""}" href="#/week/${week}" ${open ? 'aria-current="page"' : ""}><span>Week ${week}</span><span class="dot">${doneCount(state, week)}/2</span></a>${lessons}`;
  }).join("");
  const foundations = foundationIds
    .map((id) => {
      const lesson = byFile[id];
      const mark = state.done && state.done[id] ? "Done" : "";
      return `<a class="lesson-link ${id === activeFile ? "active" : ""}" href="${lessonLink(id)}" ${id === activeFile ? 'aria-current="page"' : ""}>${escapeHtml(lesson.title)} <span class="dot">${mark}</span></a>`;
    })
    .join("");
  return `<a class="skip" href="#main">Skip to content</a><aside class="side" id="side">
    <a class="brand" href="#/"><small>Foundations, then 14 weeks</small><strong>System design</strong></a>
    <nav aria-label="Course">
      <a class="week-link" href="#/">Foundations</a>
      ${foundations}
      ${weeks}
    </nav>
  </aside>`;
}

function renderHome(state) {
  const next = flat.find((id) => !(state.done && state.done[id])) || flat[0];
  const practiced = {};
  for (const id of flat) {
    if (!(state.done && state.done[id])) continue;
    for (const name of COMPETENCY_OF[id] || []) practiced[name] = (practiced[name] || 0) + 1;
  }
  const allCompetencies = [...new Set(Object.values(COMPETENCY_OF).flat())].sort();
  const competencyList = allCompetencies
    .map((name) => `<li>${escapeHtml(name)} — ${practiced[name] ? `${practiced[name]} session${practiced[name] === 1 ? "" : "s"}` : "not yet"}</li>`)
    .join("");
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
    <div class="pills"><span class="pill">${doneCount(state)} of ${flat.length} sessions marked done</span></div>
    <p><a class="button" href="${lessonLink(next)}">Continue: ${escapeHtml(nextLesson.title)}</a></p>
    <div class="row">
      <button class="ghost" id="export-progress" type="button">Export progress</button>
      <label class="button">Import progress<input id="import-progress" type="file" accept="application/json" hidden /></label>
      <button class="ghost" id="clear-progress" type="button">Clear progress on this browser</button>
    </div>
    <p class="muted">Notes, scores, and diagram choices stay in this browser. Nothing is sent to a server. Export the file before you switch devices. Clearing removes them from this browser only.</p>
    <h2>How to use a session</h2>
    <ol class="steps">
      <li>Read the situation, the numbers, and the failure. That is the question.</li>
      <li>Place the boxes and write the seven notes before you read further. The idea, the choices, and the reference open after those notes are paragraphs.</li>
      <li>Then compare, score each move, and mark the session done.</li>
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
    <h2>Competencies</h2>
    <p class="muted">A competency counts as practiced when you mark a session that uses it done. This is coverage, not a score. The 0–2 scores live on each session.</p>
    <ul class="steps">${competencyList}</ul>
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
  const written = notesReady(state, file);
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
          const reveal = written && option.value === choice.sound;
          return `<button class="opt ${picked ? "picked" : ""} ${reveal ? "match" : ""}" data-choice="${escapeHtml(choice.id)}" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>${
            picked && option.effect ? `<p class="effect">${escapeHtml(option.effect)}</p>` : ""
          }`;
        })
        .join("");
      const staff =
        written && picks[choice.id]
          ? `<p class="muted">${escapeHtml(window.neutralizeClaims(choice.staff))}</p>`
          : "";
      return `<div class="choice"><h3>${escapeHtml(choice.prompt)}</h3>${options}${staff}</div>`;
    })
    .join("");
  const noteFields = NOTES.map(([id, label, hint]) => {
    return `<label class="note"><h3>${escapeHtml(label)}</h3><p class="faint">${escapeHtml(hint)}</p><textarea data-note="${id}">${escapeHtml(notes[id] || "")}</textarea></label>`;
  }).join("");
  const reviewBody = `<div class="callout"><strong>Reference design</strong><p>${escapeHtml(window.neutralizeClaims(lesson.reviewIntro))}</p>${lesson.review
    .map((paragraph) => `<p>${escapeHtml(window.neutralizeClaims(paragraph))}</p>`)
    .join("")}</div>
      <table><thead><tr><th>Move</th><th>What a strong answer includes</th></tr></thead><tbody>${lesson.rubric
        .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`)
        .join("")}</tbody></table>`;
  const caseNote = CASE_NOTES[file] ? `<p>${escapeHtml(CASE_NOTES[file])}</p>` : "";
  const caseBlock = `<h2>The case</h2><p>${escapeHtml(lesson.caseBody)}</p>${caseNote}${window.sourceCards(lesson.caseUrl)}<p><a href="${escapeHtml(lesson.caseUrl)}" target="_blank" rel="noreferrer">${escapeHtml(lesson.caseLink)}</a></p>`;
  const diagram = (state.diagrams && state.diagrams[file]) || { lanes: {}, truth: "" };
  const diagramRows = DIAGRAM_NODES.map(([id, label]) => {
    const lane = (diagram.lanes || {})[id] || "";
    return `<div class="choice"><h3>${escapeHtml(label)}</h3><div class="row">
      <button class="opt ${lane === "sync" ? "picked" : ""}" type="button" data-lane="${id}" data-where="sync">Caller waits</button>
      <button class="opt ${lane === "async" ? "picked" : ""}" type="button" data-lane="${id}" data-where="async">After the answer</button>
      <button class="opt ${lane === "out" ? "picked" : ""}" type="button" data-lane="${id}" data-where="out">Not in this design</button>
      <button class="opt ${diagram.truth === id ? "picked" : ""}" type="button" data-truth="${id}">Source of truth</button>
    </div></div>`;
  }).join("");
  const estimate = ESTIMATES[file];
  const estimateState = (state.estimates && state.estimates[file]) || {};
  const estimateBlock = estimate
    ? `<h2>Do the arithmetic</h2><p>${escapeHtml(estimate.prompt)}</p><div class="row"><input id="estimate-input" type="number" aria-label="${escapeHtml(estimate.unit)}" placeholder="${escapeHtml(estimate.unit)}" value="${escapeHtml(estimateState.value || "")}" style="max-width:160px" /><button class="ghost" id="check-estimate" type="button">Check</button></div>${estimateFeedback(estimate, estimateState, written)}`
    : "";
  const scoreFields = NOTES.map(([id, label]) => {
    const value = ((state.scores && state.scores[file]) || {})[id] || "";
    return `<label class="note"><h3>${escapeHtml(label)}</h3><select data-score="${id}" aria-label="Score for ${escapeHtml(label)}"><option value="">Score</option><option value="0" ${value === "0" ? "selected" : ""}>0 missing</option><option value="1" ${value === "1" ? "selected" : ""}>1 named</option><option value="2" ${value === "2" ? "selected" : ""}>2 defended</option></select></label>`;
  }).join("");
  const missing = readiness(state, file);
  const code = lesson.codeLab
    ? `<div class="callout"><strong>Then run the code lab</strong><p>${escapeHtml(lesson.codeLab)}</p></div>`
    : "";
  const prompt = lesson.timed && lesson.sealed ? `<div class="callout warn"><strong>The prompt</strong><p>${escapeHtml(lesson.sealed)}</p></div>` : "";
  const index = flat.indexOf(file);
  const prev = index > 0 ? flat[index - 1] : "";
  const next = index < flat.length - 1 ? flat[index + 1] : "";
  const done = state.done && state.done[file];
  return `<article class="sheet">
    <p class="kicker">${week ? `<a href="#/week/${week}">Week ${week}</a>` : `<a href="#/">Foundations</a>`} · ${escapeHtml(lesson.minutes)}</p>
    <h1>${escapeHtml(lesson.title)}</h1>
    <div class="pills">
      <span class="pill">${escapeHtml(lesson.company)}</span>
      ${lesson.timed ? `<span class="pill">Timed drill</span>` : ""}
      ${done ? `<span class="pill">Marked done</span>` : ""}
    </div>
    ${lesson.plain ? `<div class="callout good"><strong>The one job</strong><p>${escapeHtml(lesson.plain)}</p></div>` : ""}
    <p class="lead">${escapeHtml(lesson.brief)}</p>
    ${prompt}
    ${written ? "" : `<div class="callout warn"><strong>A note to you</strong><p>This box is not part of the design. It is a reminder for the person studying. Answer in the seven notes further down before you read the lesson. The explanation, the word list, the article, the choices, and one sample answer stay hidden until each note is a short paragraph. That is the practice: decide first, then compare.</p></div>`}
    <h2>Numbers you can use</h2>
    <p class="muted">These are facts about the problem. They are not the answer.</p>
    <div class="stats">${stats}</div>
    <h2>The failure you have to handle</h2>
    <div class="callout warn"><strong>${escapeHtml(lesson.failureTitle)}</strong><p>${escapeHtml(lesson.failureBody)}</p></div>
    <h2>Place the design</h2>
    <p class="muted">Put each box on the path the caller waits for, on the path after you answer, or outside this design. Mark the one store that wins if the others disagree. Only a store should be the source of truth. A load balancer is not a source of truth.</p>
    ${diagramRows}
    ${estimateBlock}
    <h2>Write the design</h2>
    <p class="muted">These notes stay in this browser. A 2 on the score is a number, a rule, or a failure. A 1 is only the name of the idea.</p>
    ${noteFields}
    <h2>Score the seven moves</h2>
    <p class="muted">0 is missing. 1 is only the name. 2 is a number, a rule, or a failure. These scores are how the home page knows what you have actually judged.</p>
    ${scoreFields}
    <p id="ready-warn" class="muted">${missing.length ? escapeHtml(`Before this can be marked done: ${missing.join(". ")}.`) : "The notes, the diagram, and the scores are enough to mark this done."}</p>
    <div class="row">
      <button class="primary" id="mark-done" type="button" ${missing.length ? "disabled" : ""}>${done ? "Marked done" : "Mark this session done"}</button>
      ${week ? `<a class="button" href="#/week/${week}">Back to week ${week}</a>` : `<a class="button" href="#/">Back home</a>`}
    </div>
    ${written ? `<h2>The lesson</h2>
    ${lesson.goal ? `<div class="callout good"><strong>Goal of this session</strong><p>${escapeHtml(lesson.goal)}</p></div>` : ""}
    <p>${escapeHtml(lesson.idea)}</p>
    <div class="callout"><strong>${escapeHtml(window.withEditions(lesson.ddiaTitle))}</strong><p>${escapeHtml(window.withEditions(lesson.ddiaBody))}</p></div>
    <div class="callout"><strong>Interview signal</strong><p>${escapeHtml(window.neutralizeClaims(lesson.barBody))}</p></div>
    ${mechanismBlock(file)}
    <h2>${lesson.words && lesson.words.length ? "Words this session uses" : "Words that show up in every session"}</h2>
    ${wordTable}
    ${given}
    ${caseBlock}
    ${code}
    <h2>Choose, then read what it does</h2>
    <p class="muted">Pick the cut you would defend. The line under a choice is the consequence. Then open the reference and compare it with the notes you already wrote.</p>
    ${choices}
    <h2>Reference design</h2>
    <details class="reference"><summary>Open the reference design</summary>${reviewBody}</details>` : ""}
    <div class="pager">
      ${prev ? `<a href="${lessonLink(prev)}">← ${escapeHtml(byFile[prev].title)}</a>` : "<span></span>"}
      ${next ? `<a href="${lessonLink(next)}">${escapeHtml(byFile[next].title)} →</a>` : "<span></span>"}
    </div>
  </article>`;
}

function shell(state, main, activeFile, weekOpen) {
  return `${renderSidebar(state, activeFile, weekOpen)}
    <main class="main" id="main">
      <button class="ghost menu-toggle" id="menu-toggle" type="button">Weeks</button>
      ${main}
    </main>`;
}

function focusKey(element) {
  if (!element || !element.getAttribute) return "";
  if (element.id) return `#${CSS.escape(element.id)}`;
  if (element.dataset.note) return `textarea[data-note="${element.dataset.note}"]`;
  if (element.dataset.score) return `select[data-score="${element.dataset.score}"]`;
  if (element.dataset.lane && element.dataset.where) return `button[data-lane="${element.dataset.lane}"][data-where="${element.dataset.where}"]`;
  if (element.dataset.truth) return `button[data-truth="${element.dataset.truth}"]`;
  if (element.dataset.choice && element.dataset.value) return `button[data-choice="${element.dataset.choice}"][data-value="${element.dataset.value}"]`;
  return "";
}

function onMenuKey(event) {
  if (event.key !== "Escape") return;
  const side = document.getElementById("side");
  const toggle = document.getElementById("menu-toggle");
  if (!side || !side.classList.contains("open")) return;
  side.classList.remove("open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
}

function render() {
  const active = document.activeElement;
  const restoreFocus = focusKey(active);
  const caret = active && active.dataset && active.dataset.note ? active.selectionStart : null;
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
  if (restoreFocus) {
    const target = document.querySelector(restoreFocus);
    if (target) {
      target.focus();
      if (caret != null && target.setSelectionRange) {
        const pos = Math.min(caret, target.value.length);
        target.setSelectionRange(pos, pos);
      }
    }
  }
  const toggle = document.getElementById("menu-toggle");
  const side = document.getElementById("side");
  if (toggle && side) {
    toggle.setAttribute("aria-controls", "side");
    toggle.setAttribute("aria-expanded", side.classList.contains("open") ? "true" : "false");
    toggle.addEventListener("click", () => {
      const open = side.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.removeEventListener("keydown", onMenuKey);
  document.addEventListener("keydown", onMenuKey);
  document.querySelectorAll("button[data-choice]").forEach((button) => {
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
      const wasWritten = notesReady(next, activeFile);
      next.notes = next.notes || {};
      next.notes[activeFile] = next.notes[activeFile] || {};
      next.notes[activeFile][area.dataset.note] = area.value;
      saveState(next);
      if (wasWritten !== notesReady(next, activeFile)) {
        render();
        return;
      }
      const missingNow = readiness(next, activeFile);
      const button = document.getElementById("mark-done");
      const warn = document.getElementById("ready-warn");
      if (button) button.disabled = missingNow.length > 0;
      if (warn) {
        warn.textContent = missingNow.length
          ? `Before this can be marked done: ${missingNow.join(". ")}.`
          : "The notes, the diagram, and the scores are enough to mark this done.";
      }
    });
  });
  document.querySelectorAll("button[data-lane]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadState();
      next.diagrams = next.diagrams || {};
      const current = next.diagrams[activeFile] || { lanes: {}, truth: "" };
      current.lanes = current.lanes || {};
      current.lanes[button.dataset.lane] = button.dataset.where;
      next.diagrams[activeFile] = current;
      saveState(next);
      render();
    });
  });
  document.querySelectorAll("button[data-truth]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadState();
      next.diagrams = next.diagrams || {};
      const current = next.diagrams[activeFile] || { lanes: {}, truth: "" };
      current.truth = button.dataset.truth;
      next.diagrams[activeFile] = current;
      saveState(next);
      render();
    });
  });
  document.querySelectorAll("select[data-score]").forEach((select) => {
    select.addEventListener("change", () => {
      const next = loadState();
      next.scores = next.scores || {};
      next.scores[activeFile] = next.scores[activeFile] || {};
      next.scores[activeFile][select.dataset.score] = select.value;
      saveState(next);
      render();
    });
  });
  const checkEstimate = document.getElementById("check-estimate");
  if (checkEstimate) {
    checkEstimate.addEventListener("click", () => {
      const spec = ESTIMATES[activeFile];
      const raw = document.getElementById("estimate-input").value;
      const value = Number(raw);
      const ok = Number.isFinite(value) && value >= spec.low && value <= spec.high;
      const next = loadState();
      next.estimates = next.estimates || {};
      next.estimates[activeFile] = {
        value: raw,
        ok,
        message: ok ? `That order of magnitude holds. ${spec.method}` : `Not yet. ${spec.method}`,
      };
      saveState(next);
      render();
    });
  }
  const doneButton = document.getElementById("mark-done");
  if (doneButton) {
    doneButton.addEventListener("click", () => {
      const next = loadState();
      if (readiness(next, activeFile).length) return;
      next.done = next.done || {};
      next.done[activeFile] = true;
      next.schemaVersion = 1;
      saveState(next);
      render();
    });
  }
  const exportButton = document.getElementById("export-progress");
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const payload = { schemaVersion: 1, exportedAt: new Date().toISOString(), ...loadState() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "system-design-progress.json";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }
  const importInput = document.getElementById("import-progress");
  if (importInput) {
    importInput.addEventListener("change", () => {
      const file = importInput.files && importInput.files[0];
      if (!file) return;
      if (file.size > 1000000) {
        window.alert("That file is larger than 1 MB. This reader only imports its own progress file.");
        importInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          saveState(cleanImport(String(reader.result)));
          render();
        } catch (error) {
          window.alert("That file is not a progress export from this reader.");
        }
      };
      reader.readAsText(file);
    });
  }
  const clearButton = document.getElementById("clear-progress");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (!window.confirm("Clear notes, scores, and diagram choices from this browser?")) return;
      saveState({});
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
