import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("hiragana-reading-practice.html");
const learn = read("learn.html");
const index = read("index.html");
const app = read("app.js");
const about = read("about.html");
const scenariosSource = read("reading-scenarios.js");
const candidateSource = read("reading-scenarios-2.js");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");

const scenarioContext = {};
vm.runInNewContext(`${scenariosSource}; globalThis.__scenarios = readingScenarios;`, scenarioContext);
const scenarios = scenarioContext.__scenarios;
const candidateContext = {};
vm.runInNewContext(`${candidateSource}; globalThis.__candidates = readingScenarios2;`, candidateContext);
const candidates = candidateContext.__candidates;

const canonical = "https://japanreadycoach.com/hiragana-reading-practice";
if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) {
  throw new Error("Reading guide canonical is missing or incorrect.");
}
if (!guide.includes("<title>Beginner Hiragana Sentence Practice | Japan Ready Coach</title>")) {
  throw new Error("Reading guide title does not match the beginner sentence-practice intent.");
}
if (!guide.includes("<h1>Beginner Hiragana Sentence Practice</h1>")) {
  throw new Error("Reading guide H1 does not match the beginner sentence-practice intent.");
}
if (!guide.includes('content="Practice reading basic hiragana sentences with five finite beginner scenes and ten comprehension checks. Retry misses and save progress locally."')) {
  throw new Error("Reading guide meta description is not aligned with the released practice set.");
}

for (const marker of [
  "What This Practice Includes",
  "The Three-Pass Method",
  "Worked Example: Morning Water",
  "Your Finite Five-Session Plan",
  "A 15-Minute Reading Session",
  "Print, Retry, And Keep The Set Finite",
  "When To Move Forward",
  "not official JLPT material",
  "Both answers must be correct in the same attempt",
  "Completion is saved in this browser and included in local backups",
  'href="/#readingSection"'
]) {
  if (!guide.includes(marker)) throw new Error(`Reading guide is missing required content: ${marker}`);
}

if (!Array.isArray(scenarios) || scenarios.length !== 5) throw new Error("Released reading set must contain exactly five scenarios.");
const questionCount = scenarios.reduce((total, scenario) => total + scenario.questions.length, 0);
if (questionCount !== 10) throw new Error(`Released reading set must contain exactly ten checks, found ${questionCount}.`);
if (!scenarios.every((scenario) => scenario.scriptLevel === "hiragana-only")) throw new Error("Released reading guide may only describe hiragana-only scenarios.");
if (!scenarios.every((scenario) => scenario.source?.type === "original" && scenario.source?.attribution === "Japan Ready Coach")) {
  throw new Error("Released reading source attribution changed.");
}
if (!scenarios.every((scenario) => scenario.reviewStatus === "needs_review")) {
  throw new Error("Public guide work must not weaken the private language-review gate.");
}

if (!about.includes("Hi, I'm Sean McDowell.")) throw new Error("About page does not support the reading-guide author attribution.");
for (const marker of [
  'Written by <a href="/about">Sean McDowell</a>',
  "Original practice set by Japan Ready Coach",
  "Updated September 4, 2026"
]) {
  if (!guide.includes(marker)) throw new Error(`Reading guide lacks truthful author/review information: ${marker}`);
}
if (/Reviewed by|Language review:/i.test(guide)) throw new Error("Reading guide exposes an unsupported reviewer or review-status claim.");

for (const title of ["あさのみず", "ともだちとえきへ", "つくえのうえ", "あしたのがっこう", "いえでひるごはん"]) {
  if (!scenariosSource.includes(`title: "${title}"`)) throw new Error(`Scenario source is missing ${title}.`);
  if ((guide.match(new RegExp(title, "g")) || []).length < 2) throw new Error(`Reading guide does not teach and log ${title}.`);
}

for (const candidate of candidates) {
  if (guide.includes(candidate.title) || guide.includes(candidate.passage) || guide.includes(candidate.id)) {
    throw new Error(`Review-gated candidate content leaked into the reading guide: ${candidate.id}`);
  }
}

for (let session = 1; session <= 5; session += 1) {
  if (!guide.includes(`Session ${session}:`)) throw new Error(`Finite reading plan is missing Session ${session}.`);
}

if (!learn.includes('href="/hiragana-reading-practice"')) throw new Error("Kana learning path does not link to the reading guide.");
if (!index.includes('href="/hiragana-reading-practice"')) throw new Error("Reading tool does not link to the reading guide.");
if ((sitemap.match(new RegExp(canonical, "g")) || []).length !== 1) throw new Error("Sitemap must contain the reading guide exactly once.");
if (!worker.includes('"/hiragana-reading-practice"')) throw new Error("Service worker does not precache the reading guide.");
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v63"')) throw new Error("Expected service worker v63.");
if (!index.includes('src="app.js?v=62"') || !worker.includes('"./app.js?v=62"')) {
  throw new Error("Reading handoff app bundle is not cache-version aligned.");
}
for (const marker of [
  'window.location.hash === "#readingSection"',
  'runTodayAction("reading-course", { reveal: true })'
]) {
  if (!app.includes(marker)) throw new Error(`Direct reading-workspace handoff is missing: ${marker}`);
}
if (/\b(?:prototype|beta)\b/i.test(guide)) throw new Error("Reading guide contains stale prototype/beta wording.");
if (/href="[^"#]+\.html/.test(guide)) throw new Error("Reading guide contains a stale public .html link.");

const jsonLd = guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) throw new Error("Reading guide JSON-LD is missing.");
const data = JSON.parse(jsonLd);
if (data["@type"] !== "LearningResource" || data.url !== canonical
  || data.name !== "Beginner Hiragana Sentence Practice"
  || data.author?.name !== "Sean McDowell"
  || data.dateModified !== "2026-09-04") {
  throw new Error("Reading guide structured data is not aligned with its canonical URL.");
}

console.log("Hiragana reading guide checks passed for five released passages, ten checks, honest review status, and direct app handoff.");
