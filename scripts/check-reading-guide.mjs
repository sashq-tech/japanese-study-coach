import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guide = read("hiragana-reading-practice.html");
const learn = read("learn.html");
const index = read("index.html");
const scenariosSource = read("reading-scenarios.js");
const sitemap = read("sitemap.xml");
const worker = read("service-worker.js");

const canonical = "https://japanreadycoach.com/hiragana-reading-practice";
if (!guide.includes(`<link rel="canonical" href="${canonical}">`)) {
  throw new Error("Reading guide canonical is missing or incorrect.");
}

for (const marker of [
  "The Three-Pass Method",
  "Worked Example: Morning Water",
  "The Five-Scene Sequence",
  "A 15-Minute Reading Session",
  "Printable Five-Scene Study Log",
  "When To Move Forward",
  "not official JLPT material"
]) {
  if (!guide.includes(marker)) throw new Error(`Reading guide is missing required content: ${marker}`);
}

for (const title of ["あさのみず", "ともだちとえきへ", "つくえのうえ", "あしたのがっこう", "いえでひるごはん"]) {
  if (!scenariosSource.includes(`title: "${title}"`)) throw new Error(`Scenario source is missing ${title}.`);
  if ((guide.match(new RegExp(title, "g")) || []).length < 2) throw new Error(`Reading guide does not teach and log ${title}.`);
}

if (!learn.includes('href="/hiragana-reading-practice"')) throw new Error("Kana learning path does not link to the reading guide.");
if (!index.includes('href="/hiragana-reading-practice"')) throw new Error("Reading tool does not link to the reading guide.");
if ((sitemap.match(new RegExp(canonical, "g")) || []).length !== 1) throw new Error("Sitemap must contain the reading guide exactly once.");
if (!worker.includes('"/hiragana-reading-practice"')) throw new Error("Service worker does not precache the reading guide.");
if (/\b(?:prototype|beta)\b/i.test(guide)) throw new Error("Reading guide contains stale prototype/beta wording.");
if (/href="[^"#]+\.html/.test(guide)) throw new Error("Reading guide contains a stale public .html link.");

const jsonLd = guide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) throw new Error("Reading guide JSON-LD is missing.");
const data = JSON.parse(jsonLd);
if (data["@type"] !== "LearningResource" || data.url !== canonical) {
  throw new Error("Reading guide structured data is not aligned with its canonical URL.");
}

console.log("Hiragana reading guide checks passed.");
