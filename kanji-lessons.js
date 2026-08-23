(function attachKanjiLessons(globalScope) {
  const SOURCES = Object.freeze([
    {
      id: "bunka-joyo-kanji-2010",
      publisher: "Agency for Cultural Affairs, Government of Japan",
      title: "Joyo Kanji Table (Cabinet Notification No. 2, 2010)",
      url: "https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/",
      use: "Authoritative reference for standard-use kanji forms and readings."
    },
    {
      id: "bunka-public-writing-numerals",
      publisher: "Agency for Cultural Affairs, Government of Japan",
      title: "Public-document writing principles: use of numerals",
      url: "https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/kokugo_kadai/iinkai_32/pdf/91942601_02.pdf",
      use: "Confirms the 一つ, 二つ, 三つ sequence and related native counting forms."
    },
    {
      id: "jpf-irodori-starter-word-list",
      publisher: "The Japan Foundation",
      title: "IRODORI Japanese for Life in Japan Starter Word List",
      url: "https://www.irodori.jpf.go.jp/assets/data/wordlist_X.pdf",
      use: "Confirms beginner number, amount, and yen readings used in the practical examples."
    },
    {
      id: "kanjipedia-character-reference",
      publisher: "The Japan Kanji Aptitude Testing Foundation",
      title: "Kanjipedia character reference",
      url: "https://www.kanjipedia.jp/",
      use: "Supporting character-level reference for meanings and standard readings; locate by character."
    },
    {
      id: "jlpt-official-faq",
      publisher: "The Japan Foundation and Japan Educational Exchanges and Services",
      title: "Japanese-Language Proficiency Test FAQ",
      url: "https://www.jlpt.jp/e/faq/",
      use: "Confirms that the current JLPT does not publish an official vocabulary, kanji, and grammar item list."
    }
  ]);

  function sourceReview(notes) {
    return {
      status: "source_verified",
      reviewedBy: "Japan Ready Coach source verification",
      reviewedAt: "2026-08-23",
      notes: `${notes} This is source verification, not native-speaker editorial review.`
    };
  }

  const METADATA = Object.freeze({
    contentId: "jrc-kanji-foundation-candidate-1",
    schemaVersion: 1,
    contentVersion: 2,
    readingScope: "selected_beginner_readings_not_exhaustive",
    jlptAlignment: "not_an_official_jlpt_list",
    sourceIds: SOURCES.map((source) => source.id),
    review: sourceReview("All 20 glyphs, selected readings, meanings, and examples were checked against the cited government, foundation, and dictionary references."),
    compatibility: { website: "hold", android: "hold" }
  });

  const KANJI_SEED = [
    {
      id: "kanji-one",
      character: "一",
      meaning: "one",
      readings: { on: ["いち"], kun: ["ひと"] },
      example: { word: "一つ", reading: "ひとつ", meaning: "one thing" },
      lessonId: "numbers-one-five",
    },
    {
      id: "kanji-two",
      character: "二",
      meaning: "two",
      readings: { on: ["に"], kun: ["ふた"] },
      example: { word: "二つ", reading: "ふたつ", meaning: "two things" },
      lessonId: "numbers-one-five",
    },
    {
      id: "kanji-three",
      character: "三",
      meaning: "three",
      readings: { on: ["さん"], kun: ["み"] },
      example: { word: "三つ", reading: "みっつ", meaning: "three things" },
      lessonId: "numbers-one-five",
    },
    {
      id: "kanji-four",
      character: "四",
      meaning: "four",
      readings: { on: ["し"], kun: ["よ", "よん"] },
      example: { word: "四つ", reading: "よっつ", meaning: "four things" },
      lessonId: "numbers-one-five",
    },
    {
      id: "kanji-five",
      character: "五",
      meaning: "five",
      readings: { on: ["ご"], kun: ["いつ"] },
      example: { word: "五つ", reading: "いつつ", meaning: "five things" },
      lessonId: "numbers-one-five",
    },
    {
      id: "kanji-six",
      character: "六",
      meaning: "six",
      readings: { on: ["ろく"], kun: ["む"] },
      example: { word: "六つ", reading: "むっつ", meaning: "six things" },
      lessonId: "numbers-six-ten",
    },
    {
      id: "kanji-seven",
      character: "七",
      meaning: "seven",
      readings: { on: ["しち"], kun: ["なな"] },
      example: { word: "七つ", reading: "ななつ", meaning: "seven things" },
      lessonId: "numbers-six-ten",
    },
    {
      id: "kanji-eight",
      character: "八",
      meaning: "eight",
      readings: { on: ["はち"], kun: ["や"] },
      example: { word: "八つ", reading: "やっつ", meaning: "eight things" },
      lessonId: "numbers-six-ten",
    },
    {
      id: "kanji-nine",
      character: "九",
      meaning: "nine",
      readings: { on: ["きゅう"], kun: ["ここの"] },
      example: { word: "九つ", reading: "ここのつ", meaning: "nine things" },
      lessonId: "numbers-six-ten",
    },
    {
      id: "kanji-ten",
      character: "十",
      meaning: "ten",
      readings: { on: ["じゅう"], kun: ["とお"] },
      example: { word: "十", reading: "とお", meaning: "ten things" },
      lessonId: "numbers-six-ten",
    },
    {
      id: "kanji-hundred",
      character: "百",
      meaning: "hundred",
      readings: { on: ["ひゃく"], kun: [] },
      example: { word: "百円", reading: "ひゃくえん", meaning: "one hundred yen" },
      lessonId: "amounts-people",
    },
    {
      id: "kanji-thousand",
      character: "千",
      meaning: "thousand",
      readings: { on: ["せん"], kun: [] },
      example: { word: "千円", reading: "せんえん", meaning: "one thousand yen" },
      lessonId: "amounts-people",
    },
    {
      id: "kanji-ten-thousand",
      character: "万",
      meaning: "ten thousand",
      readings: { on: ["まん"], kun: [] },
      example: { word: "一万円", reading: "いちまんえん", meaning: "ten thousand yen" },
      lessonId: "amounts-people",
    },
    {
      id: "kanji-yen",
      character: "円",
      meaning: "yen",
      readings: { on: ["えん"], kun: [] },
      example: { word: "百円", reading: "ひゃくえん", meaning: "one hundred yen" },
      lessonId: "amounts-people",
    },
    {
      id: "kanji-person",
      character: "人",
      meaning: "person",
      readings: { on: ["じん", "にん"], kun: ["ひと"] },
      example: { word: "人", reading: "ひと", meaning: "person" },
      lessonId: "amounts-people",
    },
    {
      id: "kanji-day",
      character: "日",
      meaning: "day",
      readings: { on: ["にち", "じつ"], kun: ["ひ", "か"] },
      example: { word: "日", reading: "ひ", meaning: "day" },
      lessonId: "days-familiar-words",
    },
    {
      id: "kanji-month",
      character: "月",
      meaning: "month",
      readings: { on: ["げつ", "がつ"], kun: ["つき"] },
      example: { word: "一月", reading: "いちがつ", meaning: "January" },
      lessonId: "days-familiar-words",
    },
    {
      id: "kanji-fire",
      character: "火",
      meaning: "fire",
      readings: { on: ["か"], kun: ["ひ"] },
      example: { word: "火", reading: "ひ", meaning: "fire" },
      lessonId: "days-familiar-words",
    },
    {
      id: "kanji-water",
      character: "水",
      meaning: "water",
      readings: { on: ["すい"], kun: ["みず"] },
      example: { word: "水", reading: "みず", meaning: "water" },
      lessonId: "days-familiar-words",
    },
    {
      id: "kanji-book",
      character: "本",
      meaning: "book",
      readings: { on: ["ほん"], kun: [] },
      example: { word: "本", reading: "ほん", meaning: "book" },
      lessonId: "days-familiar-words",
    }
  ];

  const SOURCE_IDS_BY_LESSON = Object.freeze({
    "numbers-one-five": ["bunka-joyo-kanji-2010", "bunka-public-writing-numerals", "kanjipedia-character-reference"],
    "numbers-six-ten": ["bunka-joyo-kanji-2010", "bunka-public-writing-numerals", "kanjipedia-character-reference"],
    "amounts-people": ["bunka-joyo-kanji-2010", "jpf-irodori-starter-word-list", "kanjipedia-character-reference"],
    "days-familiar-words": ["bunka-joyo-kanji-2010", "kanjipedia-character-reference"]
  });

  const REVIEW_NOTES_BY_LESSON = Object.freeze({
    "numbers-one-five": "Standard readings and the 一つ through 五つ examples were checked; the kun arrays store the character reading while each example stores its full word reading with okurigana.",
    "numbers-six-ten": "Standard readings and the 六つ through 十 counting examples were checked; only beginner-selected readings are included.",
    "amounts-people": "The large-number and yen examples were checked against IRODORI, with standard character readings cross-checked against the government table and Kanjipedia.",
    "days-familiar-words": "The primary beginner glosses, selected readings, and simple examples were checked against the government table and Kanjipedia; omitted readings remain intentionally out of scope."
  });

  const KANJI = KANJI_SEED.map((item) => ({
    ...item,
    source: { ids: [...SOURCE_IDS_BY_LESSON[item.lessonId]] },
    review: sourceReview(REVIEW_NOTES_BY_LESSON[item.lessonId])
  }));

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
    SOURCES,
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
