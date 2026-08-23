import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const vocabularyLessons = require("../vocabulary-lessons.js");
const grammarLessons = require("../grammar-lessons.js");
const source = fs.readFileSync(new URL("../reading-scenarios-2.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}; globalThis.__scenarios = readingScenarios2;`, context);
const scenarios = context.__scenarios;

const foundationIds = new Set(vocabularyLessons.WORDS.slice(0, 50).map((word) => word.id));
const intendedIds = new Set(vocabularyLessons.WORDS.slice(50, 100).map((word) => word.id));
const allowedVocabularyIds = new Set([...foundationIds, ...intendedIds]);
const builder2Concepts = new Set([
  "existence-things-people",
  "locations-positions",
  "question-words",
  "polite-negatives",
  "simple-requests"
]);
const grammarUnitIds = new Set(grammarLessons.UNITS.map((unit) => unit.id));
const metadataKeys = ["schemaVersion", "contentVersion", "scriptLevel", "prerequisites", "tags", "source", "reviewStatus"];

if (vocabularyLessons.WORDS.length < 100 || intendedIds.size !== 50) {
  throw new Error("The intended vocabulary 51-100 contract is incomplete.");
}
if (![...builder2Concepts].every((id) => grammarUnitIds.has(id))) {
  throw new Error("The Sentence Builder 2 concept contract is incomplete.");
}
if (!Array.isArray(scenarios) || scenarios.length !== 5) {
  throw new Error(`Expected five candidate scenarios, found ${scenarios?.length ?? "none"}.`);
}

function checkMetadata(item, label) {
  for (const key of metadataKeys) {
    if (item[key] === undefined) throw new Error(`${label} is missing ${key}.`);
  }
  if (item.schemaVersion !== 1 || item.contentVersion !== 1) throw new Error(`${label} has an unexpected version.`);
  if (item.scriptLevel !== "hiragana-only") throw new Error(`${label} must remain Hiragana-only.`);
  if (!item.prerequisites || !["kana", "vocabulary", "grammar"].every((key) => Array.isArray(item.prerequisites[key]))) {
    throw new Error(`${label} has incomplete prerequisites.`);
  }
  if (!item.prerequisites.kana.includes("hiragana-basic")) throw new Error(`${label} lacks the Hiragana prerequisite.`);
  if (!item.prerequisites.vocabulary.every((id) => allowedVocabularyIds.has(id))) {
    throw new Error(`${label} uses vocabulary outside the first 100-word contract.`);
  }
  if (!item.prerequisites.vocabulary.some((id) => intendedIds.has(id))) {
    throw new Error(`${label} is not tied to intended vocabulary 51-100.`);
  }
  if (item.prerequisites.grammar.length !== 1 || !builder2Concepts.has(item.prerequisites.grammar[0])) {
    throw new Error(`${label} must isolate one Sentence Builder 2 concept.`);
  }
  if (!Array.isArray(item.tags) || item.tags.length === 0 || new Set(item.tags).size !== item.tags.length) {
    throw new Error(`${label} must have unique tags.`);
  }
  if (item.source?.type !== "original_candidate" || item.source?.attribution !== "Japan Ready Coach") {
    throw new Error(`${label} has incomplete source metadata.`);
  }
  if (item.reviewStatus !== "needs_review") throw new Error(`${label} escaped the review gate.`);
}

const scenarioIds = new Set();
const questionIds = new Set();
const coveredConcepts = new Set();

for (const scenario of scenarios) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.id || "") || scenarioIds.has(scenario.id)) {
    throw new Error(`Scenario has a missing, invalid, or duplicate ID: ${scenario.id || "missing"}.`);
  }
  scenarioIds.add(scenario.id);
  checkMetadata(scenario, scenario.id);
  coveredConcepts.add(scenario.prerequisites.grammar[0]);
  if (!scenario.title || !scenario.passage || !Array.isArray(scenario.clues) || scenario.clues.length === 0) {
    throw new Error(`${scenario.id} has incomplete reading content.`);
  }
  if (/[一-龯]/u.test(JSON.stringify(scenario))) {
    throw new Error(`${scenario.id} introduced Kanji alongside new vocabulary and grammar.`);
  }
  if (!Array.isArray(scenario.questions) || scenario.questions.length !== 2) {
    throw new Error(`${scenario.id} must have exactly two questions.`);
  }

  scenario.questions.forEach((question, index) => {
    const expectedId = `${scenario.id}-q${index + 1}`;
    if (question.id !== expectedId || questionIds.has(question.id)) {
      throw new Error(`${scenario.id} has a missing, unstable, or duplicate question ID.`);
    }
    questionIds.add(question.id);
    checkMetadata(question, question.id);
    if (question.prerequisites.grammar[0] !== scenario.prerequisites.grammar[0]) {
      throw new Error(`${question.id} does not match its scenario's grammar concept.`);
    }
    if (!question.prompt || !Array.isArray(question.choices) || question.choices.length !== 3
      || !question.answer || !question.explanation) {
      throw new Error(`${question.id} has incomplete question content.`);
    }
    if (!question.choices.includes(question.answer)) throw new Error(`${question.id} answer is not one of its choices.`);
    if (new Set(question.choices).size !== question.choices.length) throw new Error(`${question.id} has duplicate choices.`);
  });
}

if (questionIds.size !== 10) throw new Error(`Expected ten unique questions, found ${questionIds.size}.`);
if (coveredConcepts.size !== 5 || [...builder2Concepts].some((id) => !coveredConcepts.has(id))) {
  throw new Error("The five Sentence Builder 2 concepts are not each represented once.");
}

for (const publicFile of ["../index.html", "../app.js", "../service-worker.js"]) {
  const publicSource = fs.readFileSync(new URL(publicFile, import.meta.url), "utf8");
  if (publicSource.includes("reading-scenarios-2.js") || publicSource.includes("readingScenarios2")) {
    throw new Error(`${publicFile} integrates the review-gated candidate.`);
  }
}

console.log("Reading scenario 2 candidate checks passed for 5 scenarios, 10 questions, and 5 isolated grammar concepts.");
