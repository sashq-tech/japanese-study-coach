import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const kana = require("../kana-lessons.js");
const vocabulary = require("../vocabulary-lessons.js");
const grammar = require("../grammar-lessons.js");
const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const index = read("index.html");
const app = read("app.js");
const worker = read("service-worker.js");
const notFound = read("404.html");
const sitemap = read("sitemap.xml");

const contentContext = {};
vm.runInNewContext(`${read("n5-content.js")}; globalThis.__content = n5Content;`, contentContext);
const readingContext = {};
vm.runInNewContext(`${read("reading-scenarios.js")}; globalThis.__scenarios = readingScenarios;`, readingContext);

const counts = {
  kanaLessons: kana.lessonSequence().length,
  vocabularyWords: vocabulary.allWords(contentContext.__content.n5Vocabulary).length,
  grammarLessons: grammar.UNITS.length,
  grammarExamples: grammar.UNITS.reduce((total, unit) => total + unit.examples.length, 0),
  grammarChecks: grammar.allQuestions().length,
  readingScenarios: readingContext.__scenarios.length,
  readingChecks: readingContext.__scenarios.reduce((total, scenario) => total + scenario.questions.length, 0)
};

const expected = {
  kanaLessons: 22,
  vocabularyWords: 50,
  grammarLessons: 10,
  grammarExamples: 30,
  grammarChecks: 36,
  readingScenarios: 5,
  readingChecks: 10
};
for (const [key, value] of Object.entries(expected)) {
  if (counts[key] !== value) throw new Error(`Homepage release count ${key} expected ${value}, found ${counts[key]}.`);
}

for (const marker of [
  "22 kana lessons",
  "50 released words",
  "10 grammar lessons with 30 worked examples and 36 checks",
  "five Hiragana reading scenarios with ten comprehension checks",
  "Printable worksheets, local progress, and backup controls",
  "Printable writing practice",
  "This is a bounded beginner release, not a claim of complete JLPT N5 preparation"
]) {
  if (!index.includes(marker)) throw new Error(`Homepage is missing released-value copy: ${marker}`);
}

for (const marker of [
  'class="skip-link" href="#learning-content"',
  'class="lesson-area" id="learning-content" tabindex="-1"'
]) {
  if (!index.includes(marker)) throw new Error(`Homepage keyboard bypass is missing: ${marker}`);
}

const doorLinks = [
  "/learn",
  "/beginner-japanese-vocabulary",
  "/beginner-japanese-grammar-lessons-1-5",
  "/beginner-japanese-grammar-lessons-6-10",
  "/hiragana-reading-practice"
];
if ((index.match(/class="learning-door-link"/g) || []).length !== doorLinks.length) {
  throw new Error("Homepage must expose exactly five learning-door links.");
}
for (const href of doorLinks) {
  if (!index.includes(`class="learning-door-link" href="${href}"`)) throw new Error(`Homepage learning door is missing: ${href}`);
}

for (const stale of [
  "840 basic vocabulary words",
  "100 grammar example sentences",
  "100 basic kanji",
  "Later N4-N1",
  "Human review is still needed",
  "larger vocabulary roadmap",
  "full planned sentence path",
  "Kanji is next on the roadmap",
  "first reviewed kanji lessons",
  "Locked for later",
  "Kanji side quest"
]) {
  if (`${index}\n${app}`.includes(stale)) throw new Error(`Unfinished-roadmap framing remains public: ${stale}`);
}

for (const marker of [
  "const grammarDoor = structuredTask.unitNumber <= 5 ? 3 : 4",
  "step: 5",
  "Released beginner path complete",
  "Review the course you finished",
  'n5Content.levels.filter((level) => level.status === "active")'
]) {
  if (!app.includes(marker)) throw new Error(`Released-path resume behavior is missing: ${marker}`);
}

for (const candidate of ["reading-scenarios-2.js", "kanji-lessons.js"]) {
  if (`${index}\n${worker}`.includes(candidate)) throw new Error(`Review-gated resource leaked into public runtime: ${candidate}`);
}

if (!/<meta name="robots" content="noindex,follow">/.test(notFound)) throw new Error("404 page must be noindex,follow.");
if (!notFound.includes("Page Not Found | Japan Ready Coach")) throw new Error("404 page title is missing.");
if (/<link rel="canonical"/.test(notFound)) throw new Error("404 page must not declare a canonical URL.");
for (const href of ["/", "/learn", "/blog", "/contact"]) {
  if (!notFound.includes(`href="${href}"`)) throw new Error(`404 recovery navigation is missing: ${href}`);
}
if (sitemap.includes("/404")) throw new Error("404 page must not appear in the sitemap.");
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v64"')) throw new Error("Expected service worker v64.");
for (const asset of ["./404.html", "./styles.css?v=63", "./app.js?v=62"]) {
  if (!worker.includes(`"${asset}"`)) throw new Error(`Offline shell is missing release asset: ${asset}`);
}
if (!index.includes('href="styles.css?v=63"') || !index.includes('src="app.js?v=62"')) {
  throw new Error("Homepage release assets are not version-aligned.");
}

console.log("Homepage release checks passed for five released doors, exact curriculum counts, review gates, and custom 404 behavior.");
