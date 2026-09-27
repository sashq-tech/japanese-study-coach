import { createRequire } from "node:module";
import fs from "node:fs";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const lessons = require("../vocabulary-lessons.js");
const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const guide = read("beginner-japanese-vocabulary-51-100.html");
const firstGuide = read("beginner-japanese-vocabulary.html");
const learn = read("learn.html");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");
const source = read("n5-content.js");
const context = {};
vm.runInNewContext(`${source}; globalThis.__content = n5Content;`, context);

const canonical = "https://japanreadycoach.com/beginner-japanese-vocabulary-51-100";
const route = "/beginner-japanese-vocabulary-51-100";
const packageInfo = lessons.PACKAGES.find((item) => item.sequenceStart === 51);
const units = lessons.ALL_UNITS.filter((unit) => unit.packageId === packageInfo?.packageId);
const words = units.flatMap((unit) => lessons.wordsFor(unit.id, context.__content.n5Vocabulary));

if (!packageInfo?.learnerVisible || packageInfo.releaseStatus !== "released") {
  throw new Error("Words 51-100 are not marked as a released learner package.");
}
if (units.length !== 5 || words.length !== 50) {
  throw new Error(`Expected five units and 50 words, found ${units.length} units and ${words.length} words.`);
}
if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) throw new Error("Words 51-100 canonical is missing.");
for (const marker of [
  "Japanese Words 51-100",
  "Your second vocabulary finish line",
  "This is not an official JLPT list",
  "one beginner-friendly reading for each number",
  "for nonliving things and",
  "100-word foundation, not a complete N5 vocabulary course"
]) {
  if (!guide.includes(marker)) throw new Error(`Words 51-100 guide is missing: ${marker}`);
}

for (const unit of units) {
  if (!guide.toLowerCase().includes(unit.title.toLowerCase())) throw new Error(`Words 51-100 guide is missing unit title: ${unit.title}`);
}
for (const word of words) {
  const exactEntry = `<span lang="ja">${word.japanese}</span> - <em>${word.romaji}</em>`;
  if (!guide.includes(exactEntry)) throw new Error(`Words 51-100 guide is missing ${word.romaji}.`);
  const pronunciation = lessons.pronunciationFor(word);
  if (!pronunciation || pronunciation === word.romaji || !guide.includes(`Say it like: ${pronunciation}`)) {
    throw new Error(`Words 51-100 guide pronunciation is missing for ${word.romaji}.`);
  }
}

for (const sourcePage of [firstGuide, learn]) {
  if (!sourcePage.includes(`href="${route}"`)) throw new Error("Words 51-100 guide lacks an internal learning-path link.");
}
if ((sitemap.match(new RegExp(`<loc>${canonical}</loc>`, "g")) || []).length !== 1) {
  throw new Error("Sitemap must contain the Words 51-100 guide exactly once.");
}
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v66"')) throw new Error("Expected service worker v66.");
if (!worker.includes(`"${route}"`)) throw new Error("Words 51-100 guide is not available offline.");

console.log("Words 51-100 guide checks passed for five units and 50 released entries.");
