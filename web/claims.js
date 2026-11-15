// Edition labels and source cards. Chapter numbers in the lesson files are
// the 2017 first edition. The 2026 second edition, by Kleppmann and Riccomini,
// inserts two opening chapters and renames partitioning to sharding.
window.DDIA_2E = {
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "9",
  9: "10",
  10: "11",
  11: "12",
  12: "1 and 13",
};

function editionTag(chapter) {
  const second = window.DDIA_2E[Number(chapter)];
  if (!second) return "";
  return `2e ch. ${second} (1e ch. ${chapter})`;
}

window.withEditions = function withEditions(text) {
  if (!text) return "";
  let value = String(text).replace(/DDIA chapters? ((?:\d+)(?:(?:,| and)+ \d+)*)/g, (_, list) => {
    const tags = list.match(/\d+/g).map(editionTag).filter(Boolean);
    return tags.length ? `DDIA ${tags.join(", ")}` : _;
  });
  value = value.replace(/\bchapter (\d+)\b/gi, (full, chapter, offset, source) => {
    const before = source.slice(Math.max(0, offset - 8), offset);
    if (/(?:1e|2e) $/.test(before) || /ch\. $/.test(before)) return full;
    return editionTag(chapter) || full;
  });
  return value;
};

window.neutralizeClaims = function neutralizeClaims(text) {
  if (!text) return "";
  const names = "JPMorgan Chase|Capital One|Google and Microsoft|Google or Microsoft|Revolut and Monzo|Visa and Revolut|Google|Microsoft|Visa|Revolut|Monzo";
  const verb = (phrase) => new RegExp(`\\b(?:${names}) ${phrase}\\b`, "g");
  return String(text)
    .replace(verb("fails this interview if"), "A weak answer is one where")
    .replace(verb("fail this interview if"), "A weak answer is one where")
    .replace(verb("fails the interview if"), "A weak answer is one where")
    .replace(verb("fail the interview if"), "A weak answer is one where")
    .replace(verb("ends the interview if"), "A weak answer is one where")
    .replace(verb("would also ask"), "A strong interview answer should also explain")
    .replace(verb("will ask"), "A strong interview answer should explain")
    .replace(verb("asks"), "A strong interview answer should explain")
    .replace(verb("ask"), "A strong interview answer should explain")
    .replace(verb("grades"), "A strong interview answer includes")
    .replace(verb("grade"), "A strong interview answer includes")
    .replace(verb("wants"), "A strong interview answer includes")
    .replace(verb("want"), "A strong interview answer includes")
    .replace(verb("hears"), "A strong interview answer covers")
    .replace(verb("hear"), "A strong interview answer covers")
    .replace(/\b[Vv]isa runs authorization, so they grade\b/g, "A strong interview answer includes")
    .replace(/\bCapital One issues the card, so they grade\b/g, "A strong interview answer includes")
    .replace(/\bthey grade\b/g, "a strong interview answer includes")
    .replace(/\bThey grade\b/g, "A strong interview answer includes")
    .replace(/\bThey want\b/g, "A strong interview answer includes")
    .replace(/\bthey will ask\b/g, "a strong interview answer should explain")
    .replace(/\bThey will fail a design\b/g, "A weak answer is a design")
    .replace(/\bThey will spend the interview\b/g, "Spend the time")
    .replace(/\bA Google interviewer would also want\b/g, "A strong interview answer also includes")
    .replace(/\bMonzo will call that\b/g, "That is");
};

window.SOURCES = [
  {
    test: /simian-army/,
    publisher: "Netflix Technology Blog",
    title: "The Netflix Simian Army",
    year: "2011",
    relationship: "Historical case",
    note: "The post is about practicing partial failure. It is not a description of a payments architecture.",
  },
  {
    test: /personalization-and-recommendation/,
    publisher: "Netflix Technology Blog",
    title: "System Architectures for Personalization and Recommendation",
    year: "2013",
    relationship: "Historical case",
    note: "Offline, nearline, and online computation are the enduring cut. This is not a description of Netflix's current stack.",
    also: {
      publisher: "Netflix Technology Blog",
      title: "Foundation Model for Personalized Recommendation",
      year: "2025",
      url: "https://netflixtechblog.com/foundation-model-for-personalized-recommendation-1a0bd8e02d39",
      relationship: "Later evolution",
      note: "A later post describes centralizing preference learning in a foundation model. Do not merge that design into the 2013 pipeline.",
    },
  },
  {
    test: /key-value-data-abstraction-layer/,
    publisher: "Netflix Technology Blog",
    title: "Introducing Netflix's Key-Value Data Abstraction Layer",
    year: "2016",
    relationship: "Primary engineering post",
    note: "Use it for the idea that one API can hide more than one storage engine.",
  },
  {
    test: /openconnect\.netflix\.com/,
    publisher: "Netflix",
    title: "Open Connect overview",
    year: "",
    relationship: "Primary overview",
    note: "A content-delivery overview. The lesson is cache-near-the-viewer, not a copy of their network.",
  },
  {
    test: /\/h3\/?$/,
    publisher: "Uber Engineering",
    title: "H3: Uber's Hexagonal Hierarchical Spatial Index",
    year: "2018",
    relationship: "Design inspiration",
    note: "The post says H3 partitions geography for marketplace analysis, including pricing and dispatch. A neighbor-cell search in this course is an exercise inspired by that index, not a documented Uber assignment algorithm.",
  },
  {
    test: /ubers-payments-platform/,
    publisher: "Uber",
    title: "Zero-Sum by Design: 10 years of the payments platform",
    year: "2026",
    relationship: "Primary engineering post",
    note: "Use the ledger as the durable money record. Do not copy the service list.",
  },
  {
    test: /michelangelo-machine-learning-platform/,
    publisher: "Uber Engineering",
    title: "Michelangelo: Uber's Machine Learning Platform",
    year: "2017",
    relationship: "Historical case",
    note: "The post is about training and serving models. The score is not the ledger.",
  },
];

function sourceHtml(card) {
  const year = card.year ? ` · ${card.year}` : "";
  const link = card.url ? `<a href="${card.url}" target="_blank" rel="noreferrer">${card.title}</a>` : card.title;
  return `<div class="source"><b>${card.relationship}${year}</b><p>${link}. ${card.publisher}. ${card.note}</p></div>`;
}

window.sourceCards = function sourceCards(url) {
  const match = window.SOURCES.find((item) => item.test.test(url || ""));
  if (!match) return "";
  return sourceHtml(match) + (match.also ? sourceHtml(match.also) : "");
};
