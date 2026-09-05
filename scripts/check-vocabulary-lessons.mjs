import { createRequire } from "node:module";
import fs from "node:fs";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const lessons = require("../vocabulary-lessons.js");
const source = fs.readFileSync(new URL("../n5-content.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}; globalThis.__content = n5Content;`, context);
const vocabulary = context.__content.n5Vocabulary;

if (lessons.ALL_UNITS.length !== 10) throw new Error("Expected ten modeled vocabulary units.");
if (lessons.UNITS.length !== 5) throw new Error("Only the five released units may be learner-visible.");
if (lessons.METADATA?.reviewStatus !== "needs_review") throw new Error("Vocabulary review status must remain explicit.");
if (lessons.METADATA?.compatibility?.website !== "active") throw new Error("Vocabulary website compatibility is incomplete.");
if (lessons.METADATA?.plannedWordTarget !== 840) throw new Error("The internal vocabulary planning target changed unexpectedly.");
if (lessons.METADATA?.officialJlptAlignment !== false) throw new Error("Vocabulary metadata must not claim official JLPT alignment.");
if (lessons.PACKAGES.length !== 2) throw new Error("Expected released and review-gated vocabulary packages.");
if (new Set(lessons.PACKAGES.map((item) => item.packageId)).size !== lessons.PACKAGES.length) {
  throw new Error("Vocabulary package IDs must be unique.");
}
for (const item of lessons.PACKAGES) {
  for (const key of ["packageId", "schemaVersion", "sequenceStart", "sequenceEnd", "releaseStatus", "learnerVisible", "sourceReviewStatus", "languageReviewStatus", "sourceReferences", "notes"]) {
    if (!Object.hasOwn(item, key)) throw new Error(`${item.packageId || "Vocabulary package"} is missing ${key}.`);
  }
}

const releasedPackage = lessons.PACKAGES.find((item) => item.sequenceStart === 1);
const reviewPackage = lessons.PACKAGES.find((item) => item.sequenceStart === 51);
if (!releasedPackage?.learnerVisible || releasedPackage.sequenceEnd !== 50) {
  throw new Error("The existing 1-50 package must remain learner-visible.");
}
if (reviewPackage?.learnerVisible || reviewPackage?.releaseStatus !== "review_gated") {
  throw new Error("Words 51-100 must remain review-gated.");
}
if (reviewPackage?.sourceReviewStatus !== "needs_review" || reviewPackage?.languageReviewStatus !== "needs_review") {
  throw new Error("Words 51-100 must require source and language review.");
}

if (lessons.WORDS.length !== 100) throw new Error("Expected 100 stable vocabulary records.");
if (new Set(lessons.WORDS.map((word) => word.id)).size !== 100) throw new Error("Vocabulary IDs must be unique.");
if (new Set(lessons.WORDS.map((word) => word.romaji)).size !== 100) throw new Error("Track seed references must be unique.");
for (const word of lessons.WORDS) {
  if (!word.id || !word.packageId || !lessons.PACKAGES.some((item) => item.packageId === word.packageId)) {
    throw new Error(`${word.romaji || "Vocabulary item"} is missing stable package metadata.`);
  }
}

const trackWords = lessons.allTrackWords(vocabulary);
if (trackWords.length !== 100) throw new Error(`Expected 100 modeled words, got ${trackWords.length}.`);
if (new Set(trackWords.map(lessons.wordKey)).size !== 100) throw new Error("Modeled vocabulary keys must be unique.");
for (const word of trackWords) {
  const seedMatches = vocabulary.filter((candidate) => candidate.romaji === word.romaji);
  if (seedMatches.length !== 1) throw new Error(`${word.id} must reconcile to exactly one existing seed item.`);
  if (!word.packageId) throw new Error(`${word.id} is missing its package ID after seed reconciliation.`);
}

const words = lessons.allWords(vocabulary);
if (words.length !== 50) throw new Error(`Expected 50 guided words, got ${words.length}.`);
if (new Set(words.map(lessons.wordKey)).size !== 50) throw new Error("Guided vocabulary keys must be unique.");
if (Object.keys(lessons.PRONUNCIATIONS).length !== 50) throw new Error("Expected 50 pronunciation guides.");

for (const unit of lessons.UNITS) {
  const unitWords = lessons.wordsFor(unit.id, vocabulary);
  if (unitWords.length !== 10) throw new Error(`${unit.id} must contain ten existing vocabulary words.`);
  if (new Set(unitWords.map((word) => word.english)).size !== unitWords.length) {
    throw new Error(`${unit.id} contains duplicate English answer choices.`);
  }
  for (const word of unitWords) {
    if (!word.japanese || !word.romaji || !word.english) throw new Error(`${unit.id} contains an incomplete word.`);
    if (!lessons.pronunciationFor(word) || lessons.pronunciationFor(word) === word.romaji) {
      throw new Error(`${unit.id} is missing an English-friendly pronunciation for ${word.romaji}.`);
    }
  }
}

const reviewUnits = lessons.ALL_UNITS.filter((unit) => unit.packageId === reviewPackage.packageId);
if (reviewUnits.length !== 5) throw new Error("Expected five review-gated units for words 51-100.");
const expectedReviewUnitIds = ["places-daily-needs", "time-routine", "numbers-one-ten", "everyday-adjectives", "actions-questions"];
if (reviewUnits.map((unit) => unit.id).join("|") !== expectedReviewUnitIds.join("|")) {
  throw new Error("Words 51-100 no longer follow the approved five-theme sequence.");
}
for (const unit of reviewUnits) {
  const unitWords = lessons.wordsFor(unit.id, vocabulary);
  if (unitWords.length !== 10) throw new Error(`${unit.id} must contain ten existing seed words.`);
  if (new Set(unitWords.map((word) => word.english)).size !== 10) {
    throw new Error(`${unit.id} contains duplicate English answer choices.`);
  }
  if (unitWords.some((word) => word.packageId !== reviewPackage.packageId)) {
    throw new Error(`${unit.id} contains a word from the wrong package.`);
  }
  if (lessons.isUnlocked({}, unit.id, vocabulary)) {
    throw new Error(`${unit.id} became learner-accessible before review approval.`);
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
const migrated = lessons.normalizeProgress({ completed: [`vocab-${first.romaji}`] }, vocabulary);
if (migrated.completed[0] !== lessons.wordKey(first)) throw new Error("Legacy romaji progress did not migrate to the stable word ID.");
if (lessons.wordKey(first) !== "vocab-word-watashi") throw new Error("Stable vocabulary progress key changed unexpectedly.");

for (const unit of lessons.UNITS.slice(1)) {
  for (const word of lessons.wordsFor(unit.id, vocabulary)) {
    progress = lessons.markComplete(progress, word, vocabulary);
  }
}
if (progress.completed.length !== 50 || lessons.nextIncomplete(progress, vocabulary) !== null) {
  throw new Error("The complete five-unit sequence must end at exactly 50 unique words.");
}
for (const unit of reviewUnits) {
  if (lessons.isUnlocked(progress, unit.id, vocabulary)) {
    throw new Error(`${unit.id} unlocked after the released block despite its review gate.`);
  }
}

const indexSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appSource = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const workerSource = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
if (indexSource.indexOf("vocabulary-lessons.js") > indexSource.indexOf("app.js?v=62")) {
  throw new Error("Vocabulary lesson helper must load before the app bundle.");
}
for (const key of ["jrj-vocab-course-progress", "jrj-vocab-course-selection"]) {
  if (!appSource.includes(key)) throw new Error(`Missing local progress/backup key: ${key}`);
}
for (const marker of ["function availableVocabularyWords()", "const vocabulary = availableVocabularyWords()", "availableVocabularyWords().map((item)"]) {
  if (!appSource.includes(marker)) throw new Error(`Unguided vocabulary can still leak into practice: ${marker}`);
}
for (const marker of ["Your guided vocabulary path", "Study practical ten-word units", "not the full planned N5 vocabulary path"]) {
  if (!indexSource.includes(marker) && !appSource.includes(marker)) throw new Error(`Missing honest vocabulary-course marker: ${marker}`);
}
for (const marker of ["Say it like:", "pronunciationFor(word)"]) {
  if (!appSource.includes(marker)) throw new Error(`Missing pronunciation UI marker: ${marker}`);
}

const workerContext = {
  self: { addEventListener() {}, skipWaiting() {} },
  caches: {},
  fetch() {}
};
vm.runInNewContext(`${workerSource}; globalThis.__shell = { CACHE_NAME, APP_SHELL };`, workerContext);
if (workerContext.__shell.CACHE_NAME !== "japan-ready-coach-v64") throw new Error("Expected service worker v64.");
for (const asset of ["./vocabulary-lessons.js", "./app.js?v=62", "./styles.css?v=63"]) {
  if (!workerContext.__shell.APP_SHELL.includes(asset)) throw new Error(`Missing precached vocabulary asset: ${asset}`);
}

console.log("Vocabulary track checks passed: 50 released words and 50 review-gated candidates.");
