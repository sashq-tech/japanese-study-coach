import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../reading-scenarios.js", import.meta.url), "utf8");
const appSource = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}; globalThis.__readingScenarios = readingScenarios;`, context);
const scenarios = context.__readingScenarios;

const expectedVisibleContent = [
  {
    id: "morning-water",
    title: "あさのみず",
    passage: "あさです。わたしはみずをのみます。",
    clues: [["あさ", "morning"], ["みず", "water"], ["のみます", "drink"]],
    questions: [
      ["When is this happening?", ["Morning", "Afternoon", "Night"], "Morning", "あさ means morning."],
      ["What does the speaker drink?", ["Water", "Tea", "Coffee"], "Water", "みず means water, and のみます means drink."]
    ]
  },
  {
    id: "station-friend",
    title: "ともだちとえきへ",
    passage: "わたしはともだちとえきにいきます。",
    clues: [["ともだち", "friend"], ["えき", "station"], ["いきます", "go"]],
    questions: [
      ["Where is the speaker going?", ["The station", "School", "Home"], "The station", "えき means station. に marks it as the destination."],
      ["Who is going with the speaker?", ["A friend", "A teacher", "A parent"], "A friend", "ともだち means friend. と can mark the person someone goes with."]
    ]
  },
  {
    id: "book-on-desk",
    title: "つくえのうえ",
    passage: "つくえのうえにほんがあります。",
    clues: [["つくえ", "desk"], ["うえ", "on top / above"], ["ほん", "book"]],
    questions: [
      ["What is in the scene?", ["A book", "A bag", "Water"], "A book", "ほん means book."],
      ["Where is the book?", ["On the desk", "Under the desk", "In a bag"], "On the desk", "つくえのうえ means on top of the desk."]
    ]
  },
  {
    id: "school-tomorrow",
    title: "あしたのがっこう",
    passage: "あした、がっこうにいきます。がっこうでにほんごをべんきょうします。",
    clues: [["あした", "tomorrow"], ["がっこう", "school"], ["にほんご", "Japanese language"], ["べんきょうします", "study"]],
    questions: [
      ["When does the speaker go to school?", ["Tomorrow", "Today", "Yesterday"], "Tomorrow", "あした means tomorrow."],
      ["What does the speaker study?", ["Japanese", "English", "Math"], "Japanese", "にほんご means the Japanese language."]
    ]
  },
  {
    id: "lunch-at-home",
    title: "いえでひるごはん",
    passage: "ひるです。いえでごはんをたべます。",
    clues: [["ひる", "noon / daytime"], ["いえ", "home"], ["ごはん", "meal / rice"], ["たべます", "eat"]],
    questions: [
      ["Where does the speaker eat?", ["At home", "At school", "At the station"], "At home", "いえ means home. で marks where the eating happens."],
      ["What does the speaker do?", ["Eats a meal", "Reads a book", "Drinks water"], "Eats a meal", "ごはん is a meal or rice, and たべます means eat."]
    ]
  }
];

if (!Array.isArray(scenarios) || scenarios.length !== 5) {
  throw new Error(`Expected five reading scenarios, found ${scenarios?.length ?? "none"}.`);
}

const scenarioIds = new Set();
const questionIds = new Set();

scenarios.forEach((scenario, scenarioIndex) => {
  const expected = expectedVisibleContent[scenarioIndex];
  if (scenario.id !== expected.id || scenarioIds.has(scenario.id)) {
    throw new Error(`Scenario ID is missing, unstable, or duplicated at index ${scenarioIndex}.`);
  }
  scenarioIds.add(scenario.id);

  if (scenario.schemaVersion !== 1) throw new Error(`${scenario.id} must use schema version 1.`);
  if (scenario.scriptLevel !== "hiragana-only") throw new Error(`${scenario.id} has an unexpected script level.`);
  if (!scenario.prerequisites || !["kana", "vocabulary", "grammar"].every((key) => Array.isArray(scenario.prerequisites[key]))) {
    throw new Error(`${scenario.id} has incomplete prerequisite metadata.`);
  }
  if (!scenario.prerequisites.kana.includes("hiragana-basic")) {
    throw new Error(`${scenario.id} must declare its basic Hiragana prerequisite.`);
  }
  if (!Array.isArray(scenario.tags) || scenario.tags.length === 0 || new Set(scenario.tags).size !== scenario.tags.length) {
    throw new Error(`${scenario.id} must have unique content tags.`);
  }
  if (scenario.source?.type !== "original" || scenario.source?.attribution !== "Japan Ready Coach") {
    throw new Error(`${scenario.id} has incomplete source metadata.`);
  }
  if (scenario.reviewStatus !== "needs_review") throw new Error(`${scenario.id} must remain needs_review until approved privately.`);

  if (scenario.title !== expected.title || scenario.passage !== expected.passage
    || JSON.stringify(scenario.clues) !== JSON.stringify(expected.clues)) {
    throw new Error(`${scenario.id} learner-visible scenario content changed.`);
  }
  if (scenario.questions.length !== expected.questions.length) throw new Error(`${scenario.id} question count changed.`);

  scenario.questions.forEach((question, questionIndex) => {
    const expectedQuestion = expected.questions[questionIndex];
    const expectedId = `${scenario.id}-q${questionIndex + 1}`;
    if (question.id !== expectedId || questionIds.has(question.id)) {
      throw new Error(`${scenario.id} has a missing, unstable, or duplicated question ID.`);
    }
    questionIds.add(question.id);
    const visibleQuestion = [question.prompt, question.choices, question.answer, question.explanation];
    if (JSON.stringify(visibleQuestion) !== JSON.stringify(expectedQuestion)) {
      throw new Error(`${question.id} learner-visible question content changed.`);
    }
    if (!question.choices.includes(question.answer)) throw new Error(`${question.id} answer is not one of its choices.`);
    if (new Set(question.choices).size !== question.choices.length) throw new Error(`${question.id} contains duplicate choices.`);
  });
});

if (questionIds.size !== 10) throw new Error(`Expected ten unique question IDs, found ${questionIds.size}.`);

for (const marker of [
  'const READING_PROGRESS_STORAGE_KEY = "jrj-reading-progress"',
  "scenarioCorrect",
  'action: "reading-course"',
  "Both answers must be correct to complete it",
  "completed: new Set(initialReadingProgress.completed)",
  'structuredN5Task?.kind === "reading"'
]) {
  if (!appSource.includes(marker)) throw new Error(`Missing persistent reading-path marker: ${marker}`);
}
if (!appSource.includes("state.reading.scenarioCorrect === scenario.questions.length")) {
  throw new Error("Reading scenes must require a fully correct attempt before completion.");
}

console.log("Reading scenario contract checks passed for 5 scenarios and 10 questions.");
