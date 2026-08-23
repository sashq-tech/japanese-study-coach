import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lessons = require("../kanji-lessons.js");

const expectedCharacters = [
  ["一", "二", "三", "四", "五"],
  ["六", "七", "八", "九", "十"],
  ["百", "千", "万", "円", "人"],
  ["日", "月", "火", "水", "本"]
];
const expectedReadings = new Map([
  ["一", { on: ["いち"], kun: ["ひと"] }],
  ["二", { on: ["に"], kun: ["ふた"] }],
  ["三", { on: ["さん"], kun: ["み"] }],
  ["四", { on: ["し"], kun: ["よ", "よん"] }],
  ["五", { on: ["ご"], kun: ["いつ"] }],
  ["六", { on: ["ろく"], kun: ["む"] }],
  ["七", { on: ["しち"], kun: ["なな"] }],
  ["八", { on: ["はち"], kun: ["や"] }],
  ["九", { on: ["きゅう"], kun: ["ここの"] }],
  ["十", { on: ["じゅう"], kun: ["とお"] }],
  ["百", { on: ["ひゃく"], kun: [] }],
  ["千", { on: ["せん"], kun: [] }],
  ["万", { on: ["まん"], kun: [] }],
  ["円", { on: ["えん"], kun: [] }],
  ["人", { on: ["じん", "にん"], kun: ["ひと"] }],
  ["日", { on: ["にち", "じつ"], kun: ["ひ", "か"] }],
  ["月", { on: ["げつ", "がつ"], kun: ["つき"] }],
  ["火", { on: ["か"], kun: ["ひ"] }],
  ["水", { on: ["すい"], kun: ["みず"] }],
  ["本", { on: ["ほん"], kun: [] }]
]);
const expectedFacts = new Map([
  ["一", { meaning: "one", example: ["一つ", "ひとつ", "one thing"] }],
  ["二", { meaning: "two", example: ["二つ", "ふたつ", "two things"] }],
  ["三", { meaning: "three", example: ["三つ", "みっつ", "three things"] }],
  ["四", { meaning: "four", example: ["四つ", "よっつ", "four things"] }],
  ["五", { meaning: "five", example: ["五つ", "いつつ", "five things"] }],
  ["六", { meaning: "six", example: ["六つ", "むっつ", "six things"] }],
  ["七", { meaning: "seven", example: ["七つ", "ななつ", "seven things"] }],
  ["八", { meaning: "eight", example: ["八つ", "やっつ", "eight things"] }],
  ["九", { meaning: "nine", example: ["九つ", "ここのつ", "nine things"] }],
  ["十", { meaning: "ten", example: ["十", "とお", "ten things"] }],
  ["百", { meaning: "hundred", example: ["百円", "ひゃくえん", "one hundred yen"] }],
  ["千", { meaning: "thousand", example: ["千円", "せんえん", "one thousand yen"] }],
  ["万", { meaning: "ten thousand", example: ["一万円", "いちまんえん", "ten thousand yen"] }],
  ["円", { meaning: "yen", example: ["百円", "ひゃくえん", "one hundred yen"] }],
  ["人", { meaning: "person", example: ["人", "ひと", "person"] }],
  ["日", { meaning: "day", example: ["日", "ひ", "day"] }],
  ["月", { meaning: "month", example: ["一月", "いちがつ", "January"] }],
  ["火", { meaning: "fire", example: ["火", "ひ", "fire"] }],
  ["水", { meaning: "water", example: ["水", "みず", "water"] }],
  ["本", { meaning: "book", example: ["本", "ほん", "book"] }]
]);
const kanaPattern = /^[\u3040-\u309fー]+$/u;

if (lessons.METADATA?.review?.status !== "source_verified") throw new Error("Kanji package must be source_verified.");
if (lessons.METADATA?.review?.status === "human_reviewed") throw new Error("Source review must not claim human review.");
if (lessons.METADATA?.compatibility?.website !== "hold" || lessons.METADATA?.compatibility?.android !== "hold") {
  throw new Error("Source-verified kanji must remain on compatibility hold.");
}
if (lessons.METADATA?.jlptAlignment !== "not_an_official_jlpt_list") throw new Error("JLPT scope guard is missing.");
if (lessons.METADATA?.readingScope !== "selected_beginner_readings_not_exhaustive") {
  throw new Error("Selected-reading scope guard is missing.");
}
if (!Array.isArray(lessons.SOURCES) || lessons.SOURCES.length !== 5) throw new Error("Expected five package sources.");
const sourcesById = new Map(lessons.SOURCES.map((source) => [source.id, source]));
if (sourcesById.size !== lessons.SOURCES.length) throw new Error("Package source IDs must be unique.");
for (const source of lessons.SOURCES) {
  if (!source.publisher || !source.title || !source.use || !source.url?.startsWith("https://")) {
    throw new Error(`${source.id} has incomplete source metadata.`);
  }
}
if (lessons.METADATA.sourceIds.some((id) => !sourcesById.has(id))) throw new Error("Package source reference is unresolved.");
if (lessons.LESSONS.length !== 4) throw new Error("Expected four bounded kanji lessons.");
if (lessons.KANJI.length !== 20) throw new Error("Expected exactly 20 kanji items.");
if (new Set(lessons.KANJI.map((item) => item.id)).size !== 20) throw new Error("Kanji IDs must be unique.");
if (new Set(lessons.KANJI.map((item) => item.character)).size !== 20) throw new Error("Kanji characters must be unique.");

for (const [index, lesson] of lessons.LESSONS.entries()) {
  if (!lesson.id || !lesson.title || !lesson.description) throw new Error(`Lesson ${index + 1} is missing metadata.`);
  const items = lessons.itemsFor(lesson.id);
  if (items.length !== 5) throw new Error(`${lesson.id} must contain five kanji.`);
  const characters = items.map((item) => item.character);
  if (characters.join("") !== expectedCharacters[index].join("")) {
    throw new Error(`${lesson.id} has an unexpected character sequence.`);
  }
  for (const item of items) {
    if (!/^kanji-[a-z]+(?:-[a-z]+)*$/.test(item.id)) throw new Error(`${item.id} is not a stable kanji ID.`);
    if (item.lessonId !== lesson.id) throw new Error(`${item.id} does not match its lesson metadata.`);
    if (typeof item.meaning !== "string" || !item.meaning.trim()) throw new Error(`${item.id} needs one meaning.`);
    if (item.review?.status !== "source_verified") throw new Error(`${item.id} must be source_verified.`);
    if (!item.review.reviewedBy || !/^\d{4}-\d{2}-\d{2}$/.test(item.review.reviewedAt) || !item.review.notes) {
      throw new Error(`${item.id} has incomplete review metadata.`);
    }
    if (!item.review.notes.includes("not native-speaker editorial review")) {
      throw new Error(`${item.id} is missing the human-review boundary.`);
    }
    if (!Array.isArray(item.source?.ids) || item.source.ids.length < 2) throw new Error(`${item.id} needs item source references.`);
    if (item.source.ids.some((id) => !sourcesById.has(id))) throw new Error(`${item.id} has an unresolved source reference.`);
    if (!Array.isArray(item.readings?.on) || !Array.isArray(item.readings?.kun)) {
      throw new Error(`${item.id} readings must use on and kun arrays.`);
    }
    const readings = [...item.readings.on, ...item.readings.kun];
    if (!readings.length || readings.some((reading) => !kanaPattern.test(reading))) {
      throw new Error(`${item.id} has an invalid kana reading.`);
    }
    const expected = expectedReadings.get(item.character);
    if (JSON.stringify(item.readings) !== JSON.stringify(expected)) {
      throw new Error(`${item.id} readings drifted from the audited source set.`);
    }
    const expectedFact = expectedFacts.get(item.character);
    if (item.meaning !== expectedFact?.meaning) throw new Error(`${item.id} meaning drifted from the audited source set.`);
    if (item.example) {
      if (!item.example.word.includes(item.character)) throw new Error(`${item.id} example must contain its character.`);
      if (!kanaPattern.test(item.example.reading)) throw new Error(`${item.id} example reading must be kana.`);
      if (!item.example.meaning?.trim()) throw new Error(`${item.id} example needs a meaning.`);
      if (JSON.stringify([item.example.word, item.example.reading, item.example.meaning]) !== JSON.stringify(expectedFact.example)) {
        throw new Error(`${item.id} example drifted from the audited source set.`);
      }
    }
  }
}

if (lessons.allItems().map((item) => item.character).join("") !== expectedCharacters.flat().join("")) {
  throw new Error("The finite kanji sequence is unstable.");
}
if (lessons.itemsFor("missing").length !== 0) throw new Error("Unknown lessons must return no items.");
if (lessons.kanjiKey({ id: "missing" }) !== "") throw new Error("Unknown kanji must not produce a progress key.");

let progress = lessons.normalizeProgress({});
if (!lessons.isUnlocked(progress, lessons.LESSONS[0].id)) throw new Error("First kanji lesson should be unlocked.");
if (lessons.isUnlocked(progress, lessons.LESSONS[1].id)) throw new Error("Second kanji lesson unlocked too early.");

for (const [index, lesson] of lessons.LESSONS.entries()) {
  if (!lessons.isUnlocked(progress, lesson.id)) throw new Error(`${lesson.id} should unlock in sequence.`);
  const before = progress;
  for (const item of lessons.itemsFor(lesson.id)) {
    progress = lessons.markComplete(progress, item);
    progress = lessons.markComplete(progress, item);
  }
  if (before.completed.length && before.completed.length !== index * 5) {
    throw new Error("Progress input was mutated unexpectedly.");
  }
  const status = lessons.lessonStatus(progress, lesson.id);
  if (!status.complete || status.done !== 5 || status.percent !== 100) {
    throw new Error(`${lesson.id} did not complete cleanly.`);
  }
  const next = lessons.LESSONS[index + 1];
  if (next && !lessons.isUnlocked(progress, next.id)) throw new Error(`${next.id} did not unlock.`);
}

if (progress.completed.length !== 20) throw new Error("Idempotent completion failed.");
if (lessons.nextIncomplete(progress) !== null) throw new Error("Completed kanji path still has a next lesson.");
if (lessons.remainingItems(progress, lessons.LESSONS[3].id).length !== 0) {
  throw new Error("Completed lesson still has remaining items.");
}

const malformed = lessons.normalizeProgress({
  completed: [lessons.KANJI[0].id, lessons.KANJI[0].id, "bad-id", 7]
});
if (malformed.completed.length !== 1 || malformed.completed[0] !== lessons.KANJI[0].id) {
  throw new Error("Malformed kanji progress was not normalized.");
}
const untouched = { completed: [lessons.KANJI[0].id] };
const marked = lessons.markComplete(untouched, lessons.KANJI[1]);
if (untouched.completed.length !== 1 || marked.completed.length !== 2) {
  throw new Error("Kanji progress helpers must not mutate their input.");
}

console.log("Bounded 20-kanji lesson checks passed.");
