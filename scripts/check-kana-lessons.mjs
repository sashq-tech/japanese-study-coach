import { createRequire } from "node:module";
import fs from "node:fs";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const lessons = require("../kana-lessons.js");
const source = fs.readFileSync(new URL("../n5-content.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}; globalThis.__content = n5Content;`, context);
const decks = context.__content.kanaDecks;

if (lessons.STARTER_ROWS.length !== 5) throw new Error("Expected five starter rows.");
for (const deck of lessons.DECK_ORDER) {
  for (const row of lessons.STARTER_ROWS) {
    const items = lessons.itemsFor(deck, row.id, decks);
    if (items.length !== 5) throw new Error(`${deck} ${row.id} expected five cards, got ${items.length}.`);
  }
}

let progress = lessons.normalizeProgress({}, decks);
let next = lessons.nextIncomplete(progress, decks);
if (next?.deck !== "hiragana" || next?.rowId !== "vowels") throw new Error("Fresh progress must start with Hiragana vowels.");

for (const item of lessons.itemsFor("hiragana", "vowels", decks)) {
  progress = lessons.markComplete(progress, "hiragana", "vowels", item, decks);
}
if (!lessons.rowStatus(progress, "hiragana", "vowels", decks).complete) throw new Error("Vowel row did not complete after five correct cards.");
if (!lessons.isUnlocked(progress, "hiragana", "k", decks)) throw new Error("K row should unlock after vowels.");
if (lessons.isUnlocked(progress, "katakana", "vowels", decks)) throw new Error("Katakana should remain locked before Hiragana starter rows complete.");

for (const row of lessons.STARTER_ROWS.slice(1)) {
  for (const item of lessons.itemsFor("hiragana", row.id, decks)) {
    progress = lessons.markComplete(progress, "hiragana", row.id, item, decks);
  }
}
next = lessons.nextIncomplete(progress, decks);
if (next?.deck !== "katakana" || next?.rowId !== "vowels") throw new Error("Katakana vowels should follow the five Hiragana rows.");

const legacyKey = lessons.cardKey("katakana", lessons.itemsFor("katakana", "vowels", decks)[0]);
const merged = lessons.mergeLegacyHits({}, { katakana: { [legacyKey]: 2 } }, decks);
if (lessons.rowStatus(merged, "katakana", "vowels", decks).done !== 1) throw new Error("Legacy kana hits were not carried into row progress.");

const malformed = lessons.normalizeProgress({ hiragana: { vowels: ["bad", "hiragana:あ", "hiragana:あ"] } }, decks);
if (malformed.hiragana.vowels.length !== 1) throw new Error("Malformed or duplicate progress was not normalized.");

const indexSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appSource = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const workerSource = fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8");
if (indexSource.indexOf("kana-lessons.js") > indexSource.indexOf("app.js?v=46")) {
  throw new Error("Kana lesson helper must load before the app bundle.");
}
for (const key of ["jrj-kana-row-progress", "jrj-kana-row-selection"]) {
  if (!appSource.includes(key)) throw new Error(`Missing local progress key: ${key}`);
}
const workerContext = {
  self: { addEventListener() {}, skipWaiting() {} },
  caches: {},
  fetch() {}
};
vm.runInNewContext(`${workerSource}; globalThis.__shell = { CACHE_NAME, APP_SHELL };`, workerContext);
if (workerContext.__shell.CACHE_NAME !== "japan-ready-coach-v46") throw new Error("Expected service worker v46.");
if (!workerContext.__shell.APP_SHELL.includes("./kana-lessons.js")) throw new Error("Kana lesson helper is not precached.");
const resolvedShell = workerContext.__shell.APP_SHELL.map((url) => new URL(url, "https://japanreadycoach.com/service-worker.js").href);
if (new Set(resolvedShell).size !== resolvedShell.length) throw new Error("Service worker shell contains duplicate resolved requests.");

console.log("Kana row lesson checks passed.");
