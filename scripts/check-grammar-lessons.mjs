import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lessons = require("../grammar-lessons.js");

if (!lessons.METADATA || typeof lessons.METADATA !== "object") {
  throw new Error("Grammar content metadata is required.");
}
if (lessons.METADATA.contentId !== "jrc-grammar-foundation-1") {
  throw new Error("Grammar content ID changed unexpectedly.");
}
if (!Number.isInteger(lessons.METADATA.schemaVersion) || lessons.METADATA.schemaVersion < 1) {
  throw new Error("Grammar schema version must be a positive integer.");
}
if (!Number.isInteger(lessons.METADATA.contentVersion) || lessons.METADATA.contentVersion < 1) {
  throw new Error("Grammar content version must be a positive integer.");
}
if (lessons.METADATA.contentVersion !== 2) throw new Error("Expected Sentence Builder 2 content version.");
if (!["needs_review", "reviewed", "approved", "needs_rewrite"].includes(lessons.METADATA.reviewStatus)) {
  throw new Error("Grammar review status is not recognized.");
}
if (lessons.METADATA.source?.attribution !== "Japan Ready Coach") throw new Error("Grammar source metadata is incomplete.");
if (lessons.METADATA.compatibility?.website !== "active") throw new Error("Grammar website compatibility is incomplete.");
if (lessons.METADATA.scope?.taughtExamples !== 30 || lessons.METADATA.scope?.plannedExamples !== 100) {
  throw new Error("Grammar scope counts must remain explicit.");
}
if (lessons.METADATA.scope?.completeJlptAlignment !== false) {
  throw new Error("Grammar scope must not claim complete JLPT alignment.");
}

if (lessons.UNITS.length !== 10) throw new Error("Expected ten guided grammar lessons across two builders.");
const firstBuilder = lessons.UNITS.slice(0, 5);
const secondBuilder = lessons.UNITS.slice(5);
if (secondBuilder.length !== 5) throw new Error("Sentence Builder 2 should contain five lessons.");
const expectedSecondBuilderIds = [
  "existence-things-people",
  "locations-positions",
  "question-words",
  "polite-negatives",
  "simple-requests"
];
if (secondBuilder.some((unit, index) => unit.id !== expectedSecondBuilderIds[index])) {
  throw new Error("Sentence Builder 2 lesson order changed unexpectedly.");
}
const expectedCheckShape = [4, 4, 4, 3, 3];
if (firstBuilder.some((unit, index) => unit.questions.length !== expectedCheckShape[index])) {
  throw new Error("Sentence Builder 1 check shape changed unexpectedly.");
}
if (secondBuilder.some((unit, index) => unit.questions.length !== expectedCheckShape[index])) {
  throw new Error("Sentence Builder 2 should use the 4/4/4/3/3 check shape.");
}
const questions = lessons.allQuestions();
if (questions.length !== 36) throw new Error(`Expected 36 grammar checks, found ${questions.length}.`);
if (new Set(questions.map((question) => question.id)).size !== questions.length) {
  throw new Error("Grammar check IDs must be unique.");
}

const examples = lessons.UNITS.flatMap((unit) => unit.examples);
if (examples.length !== 30) throw new Error(`Expected 30 teaching examples, found ${examples.length}.`);
if (new Set(examples.map((example) => example.id)).size !== examples.length) {
  throw new Error("Grammar teaching example IDs must be unique.");
}
const secondBuilderJapanese = secondBuilder.flatMap((unit) => unit.examples.map((example) => example.japanese)).join("\n");
for (const marker of ["があります", "がいます", "のなかにあります", "どこですか", "なにを", "だれが", "じゃありません", "ません", "をください"]) {
  if (!secondBuilderJapanese.includes(marker)) throw new Error(`Sentence Builder 2 is missing requested coverage: ${marker}`);
}
for (const example of examples) {
  if (!/^grammar-example-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(example.id || "")) {
    throw new Error(`Invalid grammar teaching example ID: ${example.id || "missing"}.`);
  }
}

for (const unit of lessons.UNITS) {
  if (unit.examples.length !== 3) throw new Error(`${unit.id} should teach three examples before checking.`);
  for (const example of unit.examples) {
    if (!example.japanese || !example.romaji || !example.english) {
      throw new Error(`${unit.id} has an incomplete Japanese/romaji/English example.`);
    }
    if (/[一-龯]/u.test(example.japanese)) throw new Error(`${unit.id} introduced kanji in the entry grammar block.`);
  }
  for (const question of unit.questions) {
    if (!question.prompt || !question.answer || !question.explanation) {
      throw new Error(`${question.id} is missing guided check content.`);
    }
    if (question.type === "assembly") {
      if (!question.answerTokens?.length || !question.tokens?.every((token) => token.text && token.romaji)) {
        throw new Error(`${question.id} is missing accessible assembly token guidance.`);
      }
      if (`${question.answerTokens.join("")}。` !== question.answer) {
        throw new Error(`${question.id} assembly order does not match its answer.`);
      }
    }
  }
}

let progress = lessons.normalizeProgress({});
if (!lessons.isUnlocked(progress, lessons.UNITS[0].id)) throw new Error("First grammar lesson should be unlocked.");
if (lessons.isUnlocked(progress, lessons.UNITS[1].id)) throw new Error("Second grammar lesson unlocked too early.");

for (const [index, unit] of lessons.UNITS.entries()) {
  if (!lessons.isUnlocked(progress, unit.id)) throw new Error(`${unit.id} should be unlocked in sequence.`);
  for (const question of unit.questions) {
    progress = lessons.markComplete(progress, question);
    progress = lessons.markComplete(progress, question);
  }
  const status = lessons.unitStatus(progress, unit.id);
  if (!status.complete || status.done !== unit.questions.length) throw new Error(`${unit.id} did not complete cleanly.`);
  const next = lessons.UNITS[index + 1];
  if (next && !lessons.isUnlocked(progress, next.id)) throw new Error(`${next.id} did not unlock.`);
}
if (progress.completed.length !== questions.length) throw new Error("Idempotent completion failed.");
if (lessons.nextIncomplete(progress) !== null) throw new Error("Completed grammar block still has a next lesson.");

const malformed = lessons.normalizeProgress({ completed: [questions[0].id, questions[0].id, "bad-id", 7] });
if (malformed.completed.length !== 1 || malformed.completed[0] !== questions[0].id) {
  throw new Error("Malformed grammar progress was not normalized.");
}
if (lessons.remainingQuestions({ completed: [questions[0].id] }, lessons.UNITS[0].id).length !== lessons.UNITS[0].questions.length - 1) {
  throw new Error("Remaining grammar checks are not stable after reload.");
}

const oldQuestionIds = firstBuilder.flatMap((unit) => unit.questions.map((question) => question.id));
const oldProgress = lessons.normalizeProgress({ completed: oldQuestionIds });
if (oldProgress.completed.length !== 18) throw new Error("Sentence Builder 1 progress was not preserved.");
if (lessons.nextIncomplete(oldProgress)?.id !== secondBuilder[0].id) {
  throw new Error("Completed Sentence Builder 1 progress should continue at Sentence Builder 2.");
}
if (!lessons.isUnlocked(oldProgress, secondBuilder[0].id) || lessons.isUnlocked(oldProgress, secondBuilder[1].id)) {
  throw new Error("Sentence Builder 2 did not preserve sequential unlocking from old progress.");
}

const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const worker = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
if (index.indexOf("grammar-lessons.js") > index.indexOf("app.js?v=60")) {
  throw new Error("Grammar lesson helper must load before the app bundle.");
}
for (const marker of [
  "Teach before check",
  "grammarCourseStatus",
  "grammarAssemblyAnswer",
  "jrj-grammar-course-progress",
  "jrj-grammar-course-selection",
  "grammar-course:"
]) {
  if (!`${index}\n${app}`.includes(marker)) throw new Error(`Missing grammar course marker: ${marker}`);
}
for (const phrase of ["not the full planned sentence path", "not a claim of grammar mastery or full N5 coverage"]) {
  if (!app.includes(phrase)) throw new Error(`Missing honest scope language: ${phrase}`);
}
for (const marker of [
  "selected.some((selectedToken) => selectedToken.index === index)",
  "selectedTokens.push({ index, text: token.text })",
  "selectedTokens.map((token) => token.text).join"
]) {
  if (!app.includes(marker)) throw new Error(`Grammar assembly is not duplicate-token safe: ${marker}`);
}

const workerContext = {
  self: { addEventListener() {}, skipWaiting() {} },
  caches: {},
  fetch() {}
};
vm.runInNewContext(`${worker}; globalThis.__shell = { CACHE_NAME, APP_SHELL };`, workerContext);
if (workerContext.__shell.CACHE_NAME !== "japan-ready-coach-v61") throw new Error("Expected service worker v61.");
for (const asset of ["./grammar-lessons.js", "./app.js?v=60", "./styles.css?v=60"]) {
  if (!workerContext.__shell.APP_SHELL.includes(asset)) throw new Error(`Missing precached grammar asset: ${asset}`);
}

console.log("Guided grammar lesson checks passed.");
