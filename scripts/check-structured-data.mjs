import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "index.html",
  "learn.html",
  "hiragana-reading-practice.html",
  "about.html",
  "blog.html",
  "privacy.html",
  "terms.html",
  "contact.html",
  ...fs.readdirSync(path.join(root, "blog"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join("blog", name))
];

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const canonical = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical) throw new Error(`${file}: missing canonical URL.`);
  const blocks = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) throw new Error(`${file}: expected exactly one JSON-LD block, found ${blocks.length}.`);
  for (const [, raw] of blocks) {
    const data = JSON.parse(raw);
    if (data["@context"] !== "https://schema.org") throw new Error(`${file}: unexpected JSON-LD context.`);
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    if (!nodes.length || nodes.some((node) => !node["@type"])) throw new Error(`${file}: JSON-LD is missing @type.`);
    const pageUrls = nodes.map((node) => node.url).filter(Boolean);
    if (pageUrls.length && !pageUrls.includes(canonical)) throw new Error(`${file}: JSON-LD URL does not match canonical.`);
  }
}

console.log("Structured data syntax and canonical checks passed.");
