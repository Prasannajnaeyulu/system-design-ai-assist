const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("web/claims.js", "utf8"), ctx);
vm.runInNewContext(fs.readFileSync("web/content.js", "utf8"), ctx);
vm.runInNewContext(fs.readFileSync("web/foundations.js", "utf8"), ctx);
const lessons = [...ctx.window.FOUNDATIONS, ...ctx.window.LESSONS];
const problems = [];
for (const lesson of lessons) {
  const title = ctx.window.withEditions(lesson.ddiaTitle || "");
  const body = ctx.window.withEditions(lesson.ddiaBody || "");
  if (/DDIA chapter \d/.test(title) || /DDIA chapter \d/.test(body)) {
    problems.push(`${lesson.file}: ambiguous DDIA chapter in ${title}`);
  }
  const claims = [lesson.barBody, lesson.reviewIntro, ...(lesson.review || []), ...(lesson.choices || []).map((choice) => choice.staff)]
    .map((text) => ctx.window.neutralizeClaims(text || ""))
    .join("\n");
  if (/\b(Google|Microsoft|Visa|Capital One|JPMorgan Chase|Revolut|Monzo) (asks|ask|grades|grade|wants|want|hears|hear)\b/.test(claims)) {
    problems.push(`${lesson.file}: unsourced interviewer claim remains`);
  }
  if (lesson.caseUrl && !ctx.window.sourceCards(lesson.caseUrl)) {
    problems.push(`${lesson.file}: case has no source card`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`checked ${lessons.length} lessons`);
