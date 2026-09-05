import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicFiles = [
  "index.html",
  "learn.html",
  "hiragana-reading-practice.html",
  "beginner-japanese-vocabulary.html",
  "beginner-japanese-grammar-lessons-1-5.html",
  "beginner-japanese-grammar-lessons-6-10.html",
  "about.html",
  "blog.html",
  "privacy.html",
  "terms.html",
  "contact.html",
  ...fs.readdirSync(path.join(root, "blog"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join("blog", name))
];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("learn.html");
const index = read("index.html");
const app = read("app.js");
const privacy = read("privacy.html");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");

if (!guide.includes('<link rel="canonical" href="https://japanreadycoach.com/learn">')) {
  throw new Error("Learning guide canonical is missing or incorrect.");
}
for (const marker of [
  "The 22-Lesson Order",
  "How One Guided Lesson Works",
  "A Two-Week Starter Plan",
  "Your Stage 1 Readiness Check",
  "46 basic characters",
  "build targets, not completed-course claims",
  'href="/#kanaSection"'
]) {
  if (!guide.includes(marker)) throw new Error(`Learning guide is missing required content: ${marker}`);
}

const rowLabels = ["Vowels", "K row", "S row", "T row", "N row", "H row", "M row", "Y row", "R row", "W row", "Final N"];
for (const label of rowLabels) {
  if (!guide.includes(`<strong>${label}:`)) throw new Error(`Learning guide is missing the ${label} lesson row.`);
}

for (const file of publicFiles) {
  const source = read(file);
  if (!source.includes('href="/learn"')) throw new Error(`${file}: missing Learn navigation link.`);
  if (/href="(?:index|about|privacy|terms|contact|blog)\.html/.test(source)) {
    throw new Error(`${file}: contains a stale public .html navigation link.`);
  }
  if (/\b(?:prototype|beta)\b/i.test(source)) throw new Error(`${file}: contains stale public prototype/beta wording.`);
}

if ((sitemap.match(/https:\/\/japanreadycoach\.com\/learn/g) || []).length !== 1) {
  throw new Error("Sitemap must contain the learning guide exactly once.");
}
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v64"')) throw new Error("Expected service worker v64.");
if (!worker.includes('"/learn"')) throw new Error("Learning guide is not in the service worker shell.");
if (!worker.includes('"/hiragana-reading-practice"')) throw new Error("Reading guide is not in the service worker shell.");
if (!worker.includes('"/beginner-japanese-vocabulary"')) throw new Error("Vocabulary guide is not in the service worker shell.");
if (!worker.includes('"/beginner-japanese-grammar-lessons-1-5"')) throw new Error("Grammar Lessons 1-5 guide is not in the service worker shell.");
if (!index.includes('src="app.js?v=62"') || !worker.includes('"./app.js?v=62"')) {
  throw new Error("Versioned app bundle is not aligned between the page and service worker.");
}
for (const marker of [
  "Human review notes",
  "reviewNotesInput",
  "saveNotesButton",
  "notesStatus",
  "saveReviewNotes",
  "loadReviewNotes",
  "REVIEW_NOTES_STORAGE_KEY",
  "local human review notes"
]) {
  if (`${index}\n${app}\n${privacy}`.includes(marker)) {
    throw new Error(`Removed public review-notes feature remains: ${marker}`);
  }
}
if (!app.includes('localStorage.removeItem("jrj-wife-notes")')) {
  throw new Error("Legacy local review notes are not cleared.");
}
for (const staleClaim of ["N4 prep unlocked", "Earn N4 prep readiness", "counts toward N4 prep readiness"]) {
  if (index.includes(staleClaim) || app.includes(staleClaim)) throw new Error(`Stale readiness claim remains: ${staleClaim}`);
}
if (!index.includes('<span class="panel-label">Study momentum</span>')) {
  throw new Error("Generic activity score must be labeled as study momentum.");
}

console.log(`Learning guide checks passed across ${publicFiles.length} public HTML files.`);
