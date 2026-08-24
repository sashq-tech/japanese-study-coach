import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const grammar = require("../grammar-lessons.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("beginner-japanese-grammar-lessons-6-10.html");
const index = read("index.html");
const learn = read("learn.html");
const app = read("app.js");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");
const canonical = "https://japanreadycoach.com/beginner-japanese-grammar-lessons-6-10";

if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) {
  throw new Error("Grammar guide canonical is missing or incorrect.");
}
for (const marker of [
  "Beginner Japanese Grammar Lessons 6-10",
  "Lesson 6: Things And People That Are There",
  "Lesson 7: Locations And Positions",
  "Lesson 8: Asking Where, What, And Who",
  "Lesson 9: Polite Negative Sentences",
  "Lesson 10: Simple Item Requests",
  "Common beginner mistake",
  "A Finite Five-Session Routine",
  "not an official JLPT product"
]) {
  if (!guide.includes(marker)) throw new Error(`Grammar guide is missing required content: ${marker}`);
}

const units = grammar.UNITS.slice(5, 10);
if (units.length !== 5) throw new Error(`Expected five published grammar units, found ${units.length}.`);
if (units.reduce((total, unit) => total + unit.examples.length, 0) !== 15) throw new Error("Expected 15 worked examples in Lessons 6-10.");
if (units.reduce((total, unit) => total + unit.questions.length, 0) !== 18) throw new Error("Expected 18 checks in Lessons 6-10.");
for (const unit of units) {
  if (!guide.includes(unit.title)) throw new Error(`Grammar guide is missing lesson title: ${unit.title}`);
  for (const example of unit.examples) {
    for (const value of [example.japanese, example.romaji, example.english]) {
      if (!guide.includes(value)) throw new Error(`Grammar guide is missing ${example.id}: ${value}`);
    }
  }
}

if (!index.includes('href="/beginner-japanese-grammar-lessons-6-10"')) throw new Error("Guided grammar app does not link to the guide.");
if (!learn.includes('href="/beginner-japanese-grammar-lessons-6-10"')) throw new Error("Learning path does not link to the grammar guide.");
if ((guide.match(/href="\/#grammarCourse"/g) || []).length < 2) throw new Error("Grammar guide needs direct app links near the start and finish.");
for (const marker of [
  'window.location.hash === "#grammarCourse"',
  'showSection("n5Section")',
  "els.grammarCourse.open = true",
  'document.querySelector("#grammarCourse")'
]) {
  if (!app.includes(marker)) throw new Error(`Grammar direct-link behavior is missing: ${marker}`);
}
if ((sitemap.match(new RegExp(canonical, "g")) || []).length !== 1) throw new Error("Sitemap must contain the grammar guide exactly once.");
if (!worker.includes('"/beginner-japanese-grammar-lessons-6-10"')) throw new Error("Service worker does not precache the grammar guide.");
if (/\b(?:prototype|beta)\b/i.test(guide)) throw new Error("Grammar guide contains stale prototype/beta wording.");
if (/href="[^"#]+\.html/.test(guide)) throw new Error("Grammar guide contains a stale public .html link.");

const jsonLd = guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) throw new Error("Grammar guide JSON-LD is missing.");
const data = JSON.parse(jsonLd);
if (data["@type"] !== "LearningResource" || data.url !== canonical || data.hasPart?.length !== 5) {
  throw new Error("Grammar guide structured data is incomplete or misaligned.");
}

const publicRuntime = `${index}\n${worker}`;
for (const candidateResource of ["reading-scenarios-2.js", "kanji-lessons.js"]) {
  if (publicRuntime.includes(candidateResource)) throw new Error(`Review-gated resource leaked into public runtime: ${candidateResource}`);
}
for (const candidateLabel of ["vocabulary 51-100", "reading scenarios 6-10", "kanji candidates"]) {
  if (guide.toLowerCase().includes(candidateLabel)) throw new Error(`Grammar guide exposes review-gated content: ${candidateLabel}`);
}

console.log("Grammar Lessons 6-10 guide checks passed for 5 lessons, 15 examples, and 18 checks.");
