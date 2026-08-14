import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lessons = require("../grammar-lessons.js");

if (lessons.UNITS.length !== 5) throw new Error("Expected five guided grammar lessons.");
const questions = lessons.allQuestions();
if (questions.length !== 18) throw new Error(`Expected 18 grammar checks, found ${questions.length}.`);
if (new Set(questions.map((question) => question.id)).size !== questions.length) {
  throw new Error("Grammar check IDs must be unique.");
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
if (progress.completed.length !== 18) throw new Error("Idempotent completion failed.");
if (lessons.nextIncomplete(progress) !== null) throw new Error("Completed grammar block still has a next lesson.");

const malformed = lessons.normalizeProgress({ completed: [questions[0].id, questions[0].id, "bad-id", 7] });
if (malformed.completed.length !== 1 || malformed.completed[0] !== questions[0].id) {
  throw new Error("Malformed grammar progress was not normalized.");
}
if (lessons.remainingQuestions({ completed: [questions[0].id] }, lessons.UNITS[0].id).length !== lessons.UNITS[0].questions.length - 1) {
  throw new Error("Remaining grammar checks are not stable after reload.");
}

const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const worker = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
if (index.indexOf("grammar-lessons.js") > index.indexOf("app.js?v=50")) {
  throw new Error("Grammar lesson helper must load before the app bundle.");
}
for (const marker of [
  "Teach before check",
  "0 / 18 checks",
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

const workerContext = {
  self: { addEventListener() {}, skipWaiting() {} },
  caches: {},
  fetch() {}
};
vm.runInNewContext(`${worker}; globalThis.__shell = { CACHE_NAME, APP_SHELL };`, workerContext);
if (workerContext.__shell.CACHE_NAME !== "japan-ready-coach-v50") throw new Error("Expected service worker v50.");
for (const asset of ["./grammar-lessons.js", "./app.js?v=50", "./styles.css?v=50"]) {
  if (!workerContext.__shell.APP_SHELL.includes(asset)) throw new Error(`Missing precached grammar asset: ${asset}`);
}

console.log("Guided grammar lesson checks passed.");
