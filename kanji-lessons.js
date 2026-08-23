(function attachKanjiLessons(globalScope) {
  const METADATA = Object.freeze({
    contentId: "jrc-kanji-foundation-candidate-1",
    schemaVersion: 1,
    contentVersion: 1,
    source: { type: "curriculum_candidate", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    compatibility: { website: "hold", android: "hold" }
  });

  const KANJI = [
    {
      id: "kanji-one",
      character: "一",
      meaning: "one",
      readings: { on: ["いち"], kun: ["ひとつ"] },
      example: { word: "一つ", reading: "ひとつ", meaning: "one thing" },
      lessonId: "numbers-one-five",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-two",
      character: "二",
      meaning: "two",
      readings: { on: ["に"], kun: ["ふたつ"] },
      example: { word: "二つ", reading: "ふたつ", meaning: "two things" },
      lessonId: "numbers-one-five",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-three",
      character: "三",
      meaning: "three",
      readings: { on: ["さん"], kun: ["みっつ"] },
      example: { word: "三つ", reading: "みっつ", meaning: "three things" },
      lessonId: "numbers-one-five",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-four",
      character: "四",
      meaning: "four",
      readings: { on: ["し"], kun: ["よん", "よっつ"] },
      example: { word: "四つ", reading: "よっつ", meaning: "four things" },
      lessonId: "numbers-one-five",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-five",
      character: "五",
      meaning: "five",
      readings: { on: ["ご"], kun: ["いつつ"] },
      example: { word: "五つ", reading: "いつつ", meaning: "five things" },
      lessonId: "numbers-one-five",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-six",
      character: "六",
      meaning: "six",
      readings: { on: ["ろく"], kun: ["むっつ"] },
      example: { word: "六つ", reading: "むっつ", meaning: "six things" },
      lessonId: "numbers-six-ten",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-seven",
      character: "七",
      meaning: "seven",
      readings: { on: ["しち"], kun: ["なな", "ななつ"] },
      example: { word: "七つ", reading: "ななつ", meaning: "seven things" },
      lessonId: "numbers-six-ten",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-eight",
      character: "八",
      meaning: "eight",
      readings: { on: ["はち"], kun: ["やっつ"] },
      example: { word: "八つ", reading: "やっつ", meaning: "eight things" },
      lessonId: "numbers-six-ten",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-nine",
      character: "九",
      meaning: "nine",
      readings: { on: ["きゅう"], kun: ["ここのつ"] },
      example: { word: "九つ", reading: "ここのつ", meaning: "nine things" },
      lessonId: "numbers-six-ten",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-ten",
      character: "十",
      meaning: "ten",
      readings: { on: ["じゅう"], kun: ["とお"] },
      example: { word: "十", reading: "とお", meaning: "ten things" },
      lessonId: "numbers-six-ten",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-hundred",
      character: "百",
      meaning: "hundred",
      readings: { on: ["ひゃく"], kun: [] },
      example: { word: "百円", reading: "ひゃくえん", meaning: "one hundred yen" },
      lessonId: "amounts-people",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-thousand",
      character: "千",
      meaning: "thousand",
      readings: { on: ["せん"], kun: [] },
      example: { word: "千円", reading: "せんえん", meaning: "one thousand yen" },
      lessonId: "amounts-people",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-ten-thousand",
      character: "万",
      meaning: "ten thousand",
      readings: { on: ["まん"], kun: [] },
      example: { word: "一万円", reading: "いちまんえん", meaning: "ten thousand yen" },
      lessonId: "amounts-people",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-yen",
      character: "円",
      meaning: "yen",
      readings: { on: ["えん"], kun: [] },
      example: { word: "百円", reading: "ひゃくえん", meaning: "one hundred yen" },
      lessonId: "amounts-people",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-person",
      character: "人",
      meaning: "person",
      readings: { on: ["じん", "にん"], kun: ["ひと"] },
      example: { word: "人", reading: "ひと", meaning: "person" },
      lessonId: "amounts-people",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-day",
      character: "日",
      meaning: "day",
      readings: { on: ["にち"], kun: ["ひ"] },
      example: { word: "日", reading: "ひ", meaning: "day" },
      lessonId: "days-familiar-words",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-month",
      character: "月",
      meaning: "month",
      readings: { on: ["げつ", "がつ"], kun: ["つき"] },
      example: { word: "一月", reading: "いちがつ", meaning: "January" },
      lessonId: "days-familiar-words",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-fire",
      character: "火",
      meaning: "fire",
      readings: { on: ["か"], kun: ["ひ"] },
      example: { word: "火", reading: "ひ", meaning: "fire" },
      lessonId: "days-familiar-words",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-water",
      character: "水",
      meaning: "water",
      readings: { on: ["すい"], kun: ["みず"] },
      example: { word: "水", reading: "みず", meaning: "water" },
      lessonId: "days-familiar-words",
      reviewStatus: "needs_review"
    },
    {
      id: "kanji-book",
      character: "本",
      meaning: "book",
      readings: { on: ["ほん"], kun: ["もと"] },
      example: { word: "本", reading: "ほん", meaning: "book" },
      lessonId: "days-familiar-words",
      reviewStatus: "needs_review"
    }
  ];

  const LESSONS = [
    {
      id: "numbers-one-five",
      title: "Numbers one through five",
      description: "Recognize the first five number kanji and one practical reading for each.",
      kanjiIds: ["kanji-one", "kanji-two", "kanji-three", "kanji-four", "kanji-five"]
    },
    {
      id: "numbers-six-ten",
      title: "Numbers six through ten",
      description: "Complete the basic number sequence with six through ten.",
      kanjiIds: ["kanji-six", "kanji-seven", "kanji-eight", "kanji-nine", "kanji-ten"]
    },
    {
      id: "amounts-people",
      title: "Amounts, yen, and people",
      description: "Read common amount building blocks, the yen symbol, and the character for a person.",
      kanjiIds: ["kanji-hundred", "kanji-thousand", "kanji-ten-thousand", "kanji-yen", "kanji-person"]
    },
    {
      id: "days-familiar-words",
      title: "Days and familiar words",
      description: "Meet five useful characters connected to days and already familiar beginner words.",
      kanjiIds: ["kanji-day", "kanji-month", "kanji-fire", "kanji-water", "kanji-book"]
    }
  ];

  const KANJI_BY_ID = new Map(KANJI.map((item) => [item.id, item]));

  function kanjiKey(item) {
    return item?.id && KANJI_BY_ID.has(item.id) ? item.id : "";
  }

  function itemsFor(lessonId) {
    const lesson = LESSONS.find((candidate) => candidate.id === lessonId);
    if (!lesson) return [];
    return lesson.kanjiIds.map((id) => KANJI_BY_ID.get(id)).filter(Boolean);
  }

  function allItems() {
    return LESSONS.flatMap((lesson) => itemsFor(lesson.id));
  }

  function normalizeProgress(value) {
    const allowed = new Set(allItems().map(kanjiKey));
    const completed = Array.isArray(value?.completed)
      ? [...new Set(value.completed.filter((id) => allowed.has(id)))]
      : [];
    return { completed };
  }

  function lessonStatus(progress, lessonId) {
    const items = itemsFor(lessonId);
    const completed = new Set(normalizeProgress(progress).completed);
    const done = items.filter((item) => completed.has(kanjiKey(item))).length;
    return {
      done,
      total: items.length,
      complete: items.length > 0 && done === items.length,
      percent: items.length ? Math.round((done / items.length) * 100) : 0
    };
  }

  function isUnlocked(progress, lessonId) {
    const index = LESSONS.findIndex((lesson) => lesson.id === lessonId);
    if (index <= 0) return index === 0;
    return LESSONS.slice(0, index).every((lesson) => lessonStatus(progress, lesson.id).complete);
  }

  function nextIncomplete(progress) {
    return LESSONS.find((lesson) => !lessonStatus(progress, lesson.id).complete) || null;
  }

  function markComplete(progress, item) {
    const normalized = normalizeProgress(progress);
    const key = kanjiKey(item);
    if (!key) return normalized;
    return { completed: [...new Set([...normalized.completed, key])] };
  }

  function remainingItems(progress, lessonId) {
    const completed = new Set(normalizeProgress(progress).completed);
    return itemsFor(lessonId).filter((item) => !completed.has(kanjiKey(item)));
  }

  const helper = {
    METADATA,
    KANJI,
    LESSONS,
    kanjiKey,
    itemsFor,
    allItems,
    normalizeProgress,
    lessonStatus,
    isUnlocked,
    nextIncomplete,
    markComplete,
    remainingItems
  };

  globalScope.JapanReadyKanjiLessons = helper;
  if (typeof module !== "undefined" && module.exports) module.exports = helper;
})(typeof globalThis !== "undefined" ? globalThis : window);
