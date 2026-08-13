import { createRequire } from "node:module";
import fs from "node:fs";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const lessons = require("../vocabulary-lessons.js");
const source = fs.readFileSync(new URL("../n5-content.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}; globalThis.__content = n5Content;`, context);
const vocabulary = context.__content.n5Vocabulary;

if (lessons.UNITS.length !== 5) throw new Error("Expected five guided vocabulary units.");
const words = lessons.allWords(vocabulary);
if (words.length !== 50) throw new Error(`Expected 50 guided words, got ${words.length}.`);
if (new Set(words.map(lessons.wordKey)).size !== 50) throw new Error("Guided vocabulary keys must be unique.");

for (const unit of lessons.UNITS) {
  const unitWords = lessons.wordsFor(unit.id, vocabulary);
  if (unitWords.length !== 10) throw new Error(`${unit.id} must contain ten existing vocabulary words.`);
  if (new Set(unitWords.map((word) => word.english)).size !== unitWords.length) {
    throw new Error(`${unit.id} contains duplicate English answer choices.`);
  }
  for (const word of unitWords) {
    if (!word.japanese || !word.romaji || !word.english) throw new Error(`${unit.id} contains an incomplete word.`);
  }
}

let progress = lessons.normalizeProgress({}, vocabulary);
if (lessons.nextIncomplete(progress, vocabulary)?.id !== lessons.UNITS[0].id) {
  throw new Error("Fresh progress must start at Unit 1.");
}
if (lessons.isUnlocked(progress, lessons.UNITS[1].id, vocabulary)) {
  throw new Error("Unit 2 must stay locked before Unit 1 is complete.");
}

for (const word of lessons.wordsFor(lessons.UNITS[0].id, vocabulary)) {
  progress = lessons.markComplete(progress, word, vocabulary);
}
if (!lessons.unitStatus(progress, lessons.UNITS[0].id, vocabulary).complete) {
  throw new Error("Unit 1 did not complete after ten unique words.");
}
if (!lessons.isUnlocked(progress, lessons.UNITS[1].id, vocabulary)) {
  throw new Error("Unit 2 did not unlock after Unit 1 completion.");
}
if (lessons.remainingWords(progress, lessons.UNITS[0].id, vocabulary).length !== 0) {
  throw new Error("Completed words still appear in the remaining-word list.");
}

const first = words[0];
const deduped = lessons.markComplete(progress, first, vocabulary);
if (deduped.completed.length !== progress.completed.length) throw new Error("Repeated correct answers must not inflate progress.");
const malformed = lessons.normalizeProgress({ completed: [lessons.wordKey(first), lessons.wordKey(first), "vocab-not-real", 4] }, vocabulary);
if (malformed.completed.length !== 1) throw new Error("Malformed or duplicate vocabulary progress was not normalized.");

for (const unit of lessons.UNITS.slice(1)) {
  for (const word of lessons.wordsFor(unit.id, vocabulary)) {
    progress = lessons.markComplete(progress, word, vocabulary);
  }
}
if (progress.completed.length !== 50 || lessons.nextIncomplete(progress, vocabulary) !== null) {
  throw new Error("The complete five-unit sequence must end at exactly 50 unique words.");
}

const indexSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appSource = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const workerSource = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
if (indexSource.indexOf("vocabulary-lessons.js") > indexSource.indexOf("app.js?v=49")) {
  throw new Error("Vocabulary lesson helper must load before the app bundle.");
}
for (const key of ["jrj-vocab-course-progress", "jrj-vocab-course-selection"]) {
  if (!appSource.includes(key)) throw new Error(`Missing local progress/backup key: ${key}`);
}
for (const marker of ["Your first 50 words", "Study five practical ten-word units", "not the full planned N5 vocabulary path"]) {
  if (!indexSource.includes(marker) && !appSource.includes(marker)) throw new Error(`Missing honest vocabulary-course marker: ${marker}`);
}

const workerContext = {
  self: { addEventListener() {}, skipWaiting() {} },
  caches: {},
  fetch() {}
};
vm.runInNewContext(`${workerSource}; globalThis.__shell = { CACHE_NAME, APP_SHELL };`, workerContext);
if (workerContext.__shell.CACHE_NAME !== "japan-ready-coach-v49") throw new Error("Expected service worker v49.");
for (const asset of ["./vocabulary-lessons.js", "./app.js?v=49", "./styles.css?v=49"]) {
  if (!workerContext.__shell.APP_SHELL.includes(asset)) throw new Error(`Missing precached vocabulary asset: ${asset}`);
}

console.log("Guided 50-word vocabulary checks passed.");
