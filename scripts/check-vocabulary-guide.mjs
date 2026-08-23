import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("beginner-japanese-vocabulary.html");
const index = read("index.html");
const learn = read("learn.html");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");

const canonical = "https://japanreadycoach.com/beginner-japanese-vocabulary";
if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) {
  throw new Error("Vocabulary guide canonical is missing or incorrect.");
}

for (const marker of [
  "Your First 50 Japanese Words",
  "How The Five Units Work",
  "How To Read The Pronunciation Line",
  "Unit 1: People, Names, And Japan",
  "Unit 2: Food And Everyday Things",
  "Unit 3: Getting Around",
  "Unit 4: Core Actions",
  "Unit 5: Questions And Calm Exchanges",
  "A Five-Session Routine",
  "not a complete N5 vocabulary course"
]) {
  if (!guide.includes(marker)) throw new Error(`Vocabulary guide is missing required content: ${marker}`);
}

const context = {};
vm.createContext(context);
vm.runInContext(read("n5-content.js") + ";globalThis.__n5Content=n5Content;", context);
vm.runInContext(read("vocabulary-lessons.js"), context);

const lessonHelper = context.JapanReadyVocabularyLessons;
const vocabulary = context.__n5Content.n5Vocabulary;
const words = lessonHelper.allWords(vocabulary);
if (words.length !== 50) throw new Error(`Expected 50 guided vocabulary words, found ${words.length}.`);

for (const word of words) {
  for (const marker of [
    word.japanese,
    `<em>${word.romaji}</em>`,
    word.english,
    `Say it like: ${lessonHelper.pronunciationFor(word)}`
  ]) {
    if (!guide.includes(marker)) {
      throw new Error(`Vocabulary guide is missing ${word.romaji}: ${marker}`);
    }
  }
}

if (!index.includes('href="/beginner-japanese-vocabulary"')) {
  throw new Error("Interactive vocabulary course does not link to the crawlable guide.");
}
for (const marker of [
  'function revealLinkedStudyArea()',
  'window.location.hash !== "#vocabularyCourse"',
  'showSection("n5Section")',
  'window.addEventListener("hashchange", revealLinkedStudyArea)'
]) {
  if (!read("app.js").includes(marker)) {
    throw new Error(`Vocabulary direct-link handling is missing: ${marker}`);
  }
}
if (!learn.includes('href="/beginner-japanese-vocabulary"')) {
  throw new Error("Kana learning path does not link to the vocabulary guide.");
}
if ((sitemap.match(new RegExp(canonical, "g")) || []).length !== 1) {
  throw new Error("Sitemap must contain the vocabulary guide exactly once.");
}
if (!worker.includes('"/beginner-japanese-vocabulary"')) {
  throw new Error("Service worker does not precache the vocabulary guide.");
}
if (/\b(?:prototype|beta)\b/i.test(guide)) {
  throw new Error("Vocabulary guide contains stale prototype/beta wording.");
}
if (/href="[^"#]+\.html/.test(guide)) {
  throw new Error("Vocabulary guide contains a stale public .html link.");
}

const jsonLd = guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) throw new Error("Vocabulary guide JSON-LD is missing.");
const data = JSON.parse(jsonLd);
if (data["@type"] !== "LearningResource" || data.url !== canonical) {
  throw new Error("Vocabulary guide structured data is not aligned with its canonical URL.");
}

console.log("Beginner vocabulary guide checks passed for all 50 shipped words.");
