import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const grammar = require("../grammar-lessons.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("beginner-japanese-grammar-lessons-1-5.html");
const secondGuide = read("beginner-japanese-grammar-lessons-6-10.html");
const index = read("index.html");
const learn = read("learn.html");
const app = read("app.js");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");
const canonical = "https://japanreadycoach.com/beginner-japanese-grammar-lessons-1-5";

if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) {
  throw new Error("Grammar Lessons 1-5 guide canonical is missing or incorrect.");
}
for (const marker of [
  "Beginner Japanese Grammar Lessons 1-5",
  "Lesson 1: Topics And Identity",
  "Lesson 2: Objects And Actions",
  "Lesson 3: Destinations And Action Places",
  "Lesson 4: Connecting Nouns With",
  "Lesson 5: With, And, And Also",
  "Common beginner mistake",
  "A Finite Five-Session Routine",
  "not an official JLPT product"
]) {
  if (!guide.includes(marker)) throw new Error(`Grammar Lessons 1-5 guide is missing required content: ${marker}`);
}

const units = grammar.UNITS.slice(0, 5);
if (units.length !== 5) throw new Error(`Expected five published grammar units, found ${units.length}.`);
if (units.reduce((total, unit) => total + unit.examples.length, 0) !== 15) throw new Error("Expected 15 worked examples in Lessons 1-5.");
if (units.reduce((total, unit) => total + unit.questions.length, 0) !== 18) throw new Error("Expected 18 checks in Lessons 1-5.");
for (const unit of units) {
  if (!guide.includes(unit.title)) throw new Error(`Grammar Lessons 1-5 guide is missing lesson title: ${unit.title}`);
  for (const example of unit.examples) {
    for (const value of [example.japanese, example.romaji, example.english]) {
      if (!guide.includes(value)) throw new Error(`Grammar Lessons 1-5 guide is missing ${example.id}: ${value}`);
    }
  }
}

for (const source of [index, learn, secondGuide]) {
  if (!source.includes('href="/beginner-japanese-grammar-lessons-1-5"')) {
    throw new Error("Grammar Lessons 1-5 guide is missing an internal discovery link.");
  }
}
if (!guide.includes('href="/beginner-japanese-grammar-lessons-6-10"')) throw new Error("Grammar guides are not connected in sequence.");
if ((guide.match(/href="\/#grammarCourse"/g) || []).length < 2) throw new Error("Grammar guide needs direct app links near the start and finish.");
for (const marker of [
  'window.location.hash === "#grammarCourse"',
  'showSection("n5Section")',
  "els.grammarCourse.open = true",
  'document.querySelector("#grammarCourse")'
]) {
  if (!app.includes(marker)) throw new Error(`Grammar direct-link behavior is missing: ${marker}`);
}
if ((sitemap.match(new RegExp(canonical, "g")) || []).length !== 1) throw new Error("Sitemap must contain the Grammar Lessons 1-5 guide exactly once.");
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v63"')) throw new Error("Expected service worker v63.");
if (!worker.includes('"/beginner-japanese-grammar-lessons-1-5"')) throw new Error("Service worker does not precache the Grammar Lessons 1-5 guide.");
if (/\b(?:prototype|beta)\b/i.test(guide)) throw new Error("Grammar guide contains stale prototype/beta wording.");
if (/href="[^"#]+\.html/.test(guide)) throw new Error("Grammar guide contains a stale public .html link.");
if (/<\/span(?:\s|$)/.test(guide)) throw new Error("Grammar guide contains a malformed closing span tag.");

const jsonLd = guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) throw new Error("Grammar Lessons 1-5 guide JSON-LD is missing.");
const data = JSON.parse(jsonLd);
if (data["@type"] !== "LearningResource" || data.url !== canonical || data.hasPart?.length !== 5) {
  throw new Error("Grammar Lessons 1-5 guide structured data is incomplete or misaligned.");
}

const publicRuntime = `${index}\n${worker}`;
for (const candidateResource of ["reading-scenarios-2.js", "kanji-lessons.js"]) {
  if (publicRuntime.includes(candidateResource)) throw new Error(`Review-gated resource leaked into public runtime: ${candidateResource}`);
}
for (const forbidden of ["vocabulary 51-100", "reading scenarios 6-10", "kanji candidates", "N4", "N3", "N2", "N1"]) {
  if (guide.includes(forbidden)) throw new Error(`Grammar guide exposes out-of-scope content: ${forbidden}`);
}

console.log("Grammar Lessons 1-5 guide checks passed for 5 lessons, 15 examples, and 18 checks.");
