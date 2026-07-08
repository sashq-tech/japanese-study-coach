import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const helper = require("../name-helper.js");

const curatedNames = [
  {
    input: ["sean", "shawn", "shaun"],
    katakana: "ショーン",
    sound: "shon / shoon",
    note: "Sean follows the Shawn sound."
  },
  {
    input: ["sarah", "sara"],
    katakana: "サラ",
    sound: "sara",
    note: "Sarah/Sara."
  },
  {
    input: ["emily", "emilie"],
    katakana: "エミリー",
    sound: "emirii",
    note: "Emily."
  },
  {
    input: ["mark", "marc"],
    katakana: "マーク",
    sound: "maaku",
    note: "Mark."
  },
  {
    input: ["david", "dave"],
    katakana: "デイビッド",
    sound: "deibiddo",
    note: "David."
  },
  {
    input: ["michael", "mike"],
    katakana: "マイケル",
    sound: "maikeru",
    note: "Michael."
  },
  {
    input: ["john", "jon"],
    katakana: "ジョン",
    sound: "jon",
    note: "John."
  },
  {
    input: ["conor", "connor"],
    katakana: "コナー",
    sound: "konaa",
    note: "Conor/Connor."
  }
];

const expectedCurated = new Map([
  ["Sean", "ショーン"],
  ["Shawn", "ショーン"],
  ["Shaun", "ショーン"],
  ["Sarah", "サラ"],
  ["Emily", "エミリー"],
  ["Mark", "マーク"],
  ["David", "デイビッド"],
  ["Michael", "マイケル"],
  ["John", "ジョン"],
  ["Conor", "コナー"]
]);

for (const [input, expected] of expectedCurated) {
  const suggestion = helper.suggestKatakanaName(input, curatedNames);
  if (!suggestion || suggestion.katakana !== expected || suggestion.source !== "curated") {
    throw new Error(`${input} expected curated ${expected}, got ${JSON.stringify(suggestion)}`);
  }
}

const go = helper.buildFallbackSuggestion("go");
if (go !== "ゴ") {
  throw new Error(`go fallback must be ゴ, got ${go}`);
}

for (const input of ["Taylor", "Jordan", "Alex"]) {
  const suggestion = helper.suggestKatakanaName(input, curatedNames);
  if (!suggestion || suggestion.source !== "fallback") {
    throw new Error(`${input} expected a fallback suggestion`);
  }
  if (/[A-Za-z]/.test(suggestion.katakana)) {
    throw new Error(`${input} fallback leaked Latin text: ${suggestion.katakana}`);
  }
}

console.log("Katakana name helper checks passed.");
