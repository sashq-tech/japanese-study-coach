import fs from "node:fs";
import vm from "node:vm";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const index = read("index.html");
const app = read("app.js");
const contentSource = read("n5-content.js");
const styles = read("styles.css");
const worker = read("service-worker.js");

const context = { globalThis: {} };
vm.runInNewContext(`${contentSource}; globalThis.__content = n5Content;`, context);
const { hiragana, katakana } = context.globalThis.__content.kanaDecks;
if (hiragana.length !== 46 || katakana.length !== 46) {
  throw new Error("Worksheet source decks must contain 46 basic kana each.");
}
if (!hiragana.some((item) => item.kana === "ん" && item.romaji === "n")) throw new Error("Hiragana final N is missing.");
if (!katakana.some((item) => item.kana === "ン" && item.romaji === "n")) throw new Error("Katakana final N is missing.");

for (const marker of [
  'data-worksheet-deck="hiragana"',
  'data-worksheet-deck="katakana"',
  'data-worksheet-deck="both"',
  'data-worksheet-mode="trace"',
  'data-worksheet-mode="quiz"'
]) {
  if (!index.includes(marker)) throw new Error(`Worksheet control is missing: ${marker}`);
}

for (const marker of [
  '<details class="worksheet-answer-key">',
  '<summary>Show answer key after you finish</summary>',
  'answerKey.dataset.openedForPrint = "true"',
  'function clearWorksheetPrintState()'
]) {
  if (!app.includes(marker)) throw new Error(`Worksheet behavior is missing: ${marker}`);
}

for (const marker of [
  "body.printing-worksheet .worksheet-answer-key",
  "break-before: page",
  "grid-template-columns: repeat(8, minmax(0, 1fr))",
  "body.printing-worksheet .worksheet-answer-key > summary"
]) {
  if (!styles.includes(marker)) throw new Error(`Worksheet print boundary is missing: ${marker}`);
}

if (app.includes("jrj-worksheet")) throw new Error("Worksheet preferences must not alter local progress/backup contracts in this slice.");
if (!worker.includes('const CACHE_NAME = "japan-ready-coach-v52"')) throw new Error("Expected service worker v52.");
for (const asset of ["./app.js?v=52", "./styles.css?v=52"]) {
  if (!worker.includes(`"${asset}"`)) throw new Error(`Missing worksheet asset from offline shell: ${asset}`);
}

console.log("Printable kana worksheet checks passed.");
