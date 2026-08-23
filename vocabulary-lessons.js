(function attachVocabularyLessons(globalScope) {
  const RELEASED_PACKAGE_ID = "vocabulary.n5.foundation-001-050.v1";
  const REVIEW_PACKAGE_ID = "vocabulary.n5.foundation-051-100.v1";

  const PACKAGES = Object.freeze([
    Object.freeze({
      packageId: RELEASED_PACKAGE_ID,
      schemaVersion: 1,
      sequenceStart: 1,
      sequenceEnd: 50,
      releaseStatus: "released_existing",
      learnerVisible: true,
      sourceReviewStatus: "legacy_release",
      languageReviewStatus: "legacy_release",
      sourceReferences: [],
      notes: "Previously shipped starter block. This metadata does not claim official JLPT alignment or completed source review."
    }),
    Object.freeze({
      packageId: REVIEW_PACKAGE_ID,
      schemaVersion: 1,
      sequenceStart: 51,
      sequenceEnd: 100,
      releaseStatus: "review_gated",
      learnerVisible: false,
      sourceReviewStatus: "needs_review",
      languageReviewStatus: "needs_review",
      sourceReferences: [],
      notes: "Candidate block reconciled against the existing seed. Keep hidden until source and language review are complete."
    })
  ]);

  const METADATA = Object.freeze({
    contentId: "jrc-vocabulary-foundation-track",
    schemaVersion: 1,
    contentVersion: 2,
    plannedWordTarget: 840,
    officialJlptAlignment: false,
    source: { type: "legacy_seed", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    compatibility: { website: "active", android: "candidate" }
  });

  function releasedWord(id, romaji, pronunciation) {
    return Object.freeze({ id, romaji, pronunciation, packageId: RELEASED_PACKAGE_ID });
  }

  function reviewWord(id, romaji) {
    return Object.freeze({ id, romaji, packageId: REVIEW_PACKAGE_ID });
  }

  const WORDS = [
    releasedWord("word-watashi", "watashi", "wah-tah-shee"),
    releasedWord("word-hito", "hito", "hee-toh"),
    releasedWord("word-tomodachi", "tomodachi", "toh-moh-dah-chee"),
    releasedWord("word-sensei", "sensei", "sen-say"),
    releasedWord("word-gakusei", "gakusei", "gah-koo-say"),
    releasedWord("word-kazoku", "kazoku", "kah-zoh-koo"),
    releasedWord("word-namae", "namae", "nah-mah-eh"),
    releasedWord("word-kuni", "kuni", "koo-nee"),
    releasedWord("word-nihon", "nihon", "nee-hohn"),
    releasedWord("word-nihongo", "nihongo", "nee-hohn-goh"),
    releasedWord("word-mizu", "mizu", "mee-zoo"),
    releasedWord("word-gohan", "gohan", "goh-hahn"),
    releasedWord("word-ocha", "ocha", "oh-chah"),
    releasedWord("word-koohii", "koohii", "koh-hee"),
    releasedWord("word-pan", "pan", "pahn"),
    releasedWord("word-hon", "hon", "hohn"),
    releasedWord("word-denwa", "denwa", "den-wah"),
    releasedWord("word-kaban", "kaban", "kah-bahn"),
    releasedWord("word-kasa", "kasa", "kah-sah"),
    releasedWord("word-kutsu", "kutsu", "koo-tsoo"),
    releasedWord("word-eki", "eki", "eh-kee"),
    releasedWord("word-toire", "toire", "toh-ee-reh"),
    releasedWord("word-densha", "densha", "den-shah"),
    releasedWord("word-basu", "basu", "bah-soo"),
    releasedWord("word-takushii", "takushii", "tah-koo-shee"),
    releasedWord("word-kippu", "kippu", "keep-poo"),
    releasedWord("word-michi", "michi", "mee-chee"),
    releasedWord("word-migi", "migi", "mee-gee"),
    releasedWord("word-hidari", "hidari", "hee-dah-ree"),
    releasedWord("word-massugu", "massugu", "mahs-soo-goo"),
    releasedWord("word-iku", "iku", "ee-koo"),
    releasedWord("word-kuru", "kuru", "koo-roo"),
    releasedWord("word-kaeru", "kaeru", "kah-eh-roo"),
    releasedWord("word-taberu", "taberu", "tah-beh-roo"),
    releasedWord("word-nomu", "nomu", "noh-moo"),
    releasedWord("word-miru", "miru", "mee-roo"),
    releasedWord("word-kiku", "kiku", "kee-koo"),
    releasedWord("word-hanasu", "hanasu", "hah-nah-soo"),
    releasedWord("word-kau", "kau", "kah-oo"),
    releasedWord("word-suru", "suru", "soo-roo"),
    releasedWord("word-doko", "doko", "doh-koh"),
    releasedWord("word-nani", "nani", "nah-nee"),
    releasedWord("word-ikura", "ikura", "ee-koo-rah"),
    releasedWord("word-dou", "dou", "doh"),
    releasedWord("word-hai", "hai", "hah-ee"),
    releasedWord("word-iie", "iie", "ee-eh"),
    releasedWord("word-daijoubu", "daijoubu", "dye-joh-boo"),
    releasedWord("word-chotto", "chotto", "choht-toh"),
    releasedWord("word-yukkuri", "yukkuri", "yook-koo-ree"),
    releasedWord("word-wakaru", "wakaru", "wah-kah-roo"),
    reviewWord("word-ie-home", "ie"),
    reviewWord("word-mise-shop", "mise"),
    reviewWord("word-gakkou-school", "gakkou"),
    reviewWord("word-byouin-hospital", "byouin"),
    reviewWord("word-ginkou-bank", "ginkou"),
    reviewWord("word-yuubinkyoku-post-office", "yuubinkyoku"),
    reviewWord("word-kuruma-car", "kuruma"),
    reviewWord("word-jitensha-bicycle", "jitensha"),
    reviewWord("word-okane-money", "okane"),
    reviewWord("word-tegami-letter", "tegami"),
    reviewWord("word-kyou-today", "kyou"),
    reviewWord("word-ashita-tomorrow", "ashita"),
    reviewWord("word-kinou-yesterday", "kinou"),
    reviewWord("word-ima-now", "ima"),
    reviewWord("word-asa-morning", "asa"),
    reviewWord("word-hiru-daytime", "hiru"),
    reviewWord("word-yoru-night", "yoru"),
    reviewWord("word-mainichi-every-day", "mainichi"),
    reviewWord("word-maiasa-every-morning", "maiasa"),
    reviewWord("word-maiban-every-night", "maiban"),
    reviewWord("word-ichi-one", "ichi"),
    reviewWord("word-ni-two", "ni"),
    reviewWord("word-san-three", "san"),
    reviewWord("word-yon-four", "yon"),
    reviewWord("word-go-five", "go"),
    reviewWord("word-roku-six", "roku"),
    reviewWord("word-nana-seven", "nana"),
    reviewWord("word-hachi-eight", "hachi"),
    reviewWord("word-kyuu-nine", "kyuu"),
    reviewWord("word-juu-ten", "juu"),
    reviewWord("word-ii-good", "ii"),
    reviewWord("word-ookii-big", "ookii"),
    reviewWord("word-chiisai-small", "chiisai"),
    reviewWord("word-atarashii-new", "atarashii"),
    reviewWord("word-furui-old", "furui"),
    reviewWord("word-takai-expensive-tall", "takai"),
    reviewWord("word-yasui-cheap", "yasui"),
    reviewWord("word-atsui-hot", "atsui"),
    reviewWord("word-samui-cold", "samui"),
    reviewWord("word-oishii-delicious", "oishii"),
    reviewWord("word-yomu-read", "yomu"),
    reviewWord("word-kaku-write", "kaku"),
    reviewWord("word-aru-exist", "aru"),
    reviewWord("word-iru-exist-living", "iru"),
    reviewWord("word-au-meet", "au"),
    reviewWord("word-matsu-wait", "matsu"),
    reviewWord("word-tsukau-use", "tsukau"),
    reviewWord("word-dare-who", "dare"),
    reviewWord("word-itsu-when", "itsu"),
    reviewWord("word-doushite-why", "doushite")
  ];

  const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]));
  const WORD_BY_ROMAJI = new Map(WORDS.map((word) => [word.romaji, word]));
  const PRONUNCIATIONS = Object.fromEntries(
    WORDS.filter((word) => word.pronunciation).map((word) => [word.romaji, word.pronunciation])
  );

  const ALL_UNITS = [
    {
      id: "people-japan",
      packageId: RELEASED_PACKAGE_ID,
      title: "People, names, and Japan",
      description: "Start with identity words that later support introductions and simple sentences.",
      wordIds: ["word-watashi", "word-hito", "word-tomodachi", "word-sensei", "word-gakusei", "word-kazoku", "word-namae", "word-kuni", "word-nihon", "word-nihongo"]
    },
    {
      id: "food-things",
      packageId: RELEASED_PACKAGE_ID,
      title: "Food and everyday things",
      description: "Learn concrete nouns and meet a few familiar words written in Katakana.",
      wordIds: ["word-mizu", "word-gohan", "word-ocha", "word-koohii", "word-pan", "word-hon", "word-denwa", "word-kaban", "word-kasa", "word-kutsu"]
    },
    {
      id: "getting-around",
      packageId: RELEASED_PACKAGE_ID,
      title: "Getting around",
      description: "Build a practical travel group for stations, rides, tickets, and directions.",
      wordIds: ["word-eki", "word-toire", "word-densha", "word-basu", "word-takushii", "word-kippu", "word-michi", "word-migi", "word-hidari", "word-massugu"]
    },
    {
      id: "core-actions",
      packageId: RELEASED_PACKAGE_ID,
      title: "Core actions",
      description: "Add verbs for moving, eating, listening, speaking, buying, and doing.",
      wordIds: ["word-iku", "word-kuru", "word-kaeru", "word-taberu", "word-nomu", "word-miru", "word-kiku", "word-hanasu", "word-kau", "word-suru"]
    },
    {
      id: "questions-exchanges",
      packageId: RELEASED_PACKAGE_ID,
      title: "Questions and calm exchanges",
      description: "Finish with words for asking, responding, slowing down, and recovering understanding.",
      wordIds: ["word-doko", "word-nani", "word-ikura", "word-dou", "word-hai", "word-iie", "word-daijoubu", "word-chotto", "word-yukkuri", "word-wakaru"]
    },
    {
      id: "places-daily-needs",
      packageId: REVIEW_PACKAGE_ID,
      title: "Places and daily needs",
      description: "Connect common places, transportation, money, and everyday errands.",
      wordIds: ["word-ie-home", "word-mise-shop", "word-gakkou-school", "word-byouin-hospital", "word-ginkou-bank", "word-yuubinkyoku-post-office", "word-kuruma-car", "word-jitensha-bicycle", "word-okane-money", "word-tegami-letter"]
    },
    {
      id: "time-routine",
      packageId: REVIEW_PACKAGE_ID,
      title: "Time and routine",
      description: "Add day-to-day time words that support simple plans and routines.",
      wordIds: ["word-kyou-today", "word-ashita-tomorrow", "word-kinou-yesterday", "word-ima-now", "word-asa-morning", "word-hiru-daytime", "word-yoru-night", "word-mainichi-every-day", "word-maiasa-every-morning", "word-maiban-every-night"]
    },
    {
      id: "numbers-one-ten",
      packageId: REVIEW_PACKAGE_ID,
      title: "Numbers one through ten",
      description: "Recognize the first ten numbers before introducing counters and alternate readings.",
      wordIds: ["word-ichi-one", "word-ni-two", "word-san-three", "word-yon-four", "word-go-five", "word-roku-six", "word-nana-seven", "word-hachi-eight", "word-kyuu-nine", "word-juu-ten"]
    },
    {
      id: "everyday-adjectives",
      packageId: REVIEW_PACKAGE_ID,
      title: "Everyday descriptions",
      description: "Describe familiar things with a small set of useful beginner adjectives.",
      wordIds: ["word-ii-good", "word-ookii-big", "word-chiisai-small", "word-atarashii-new", "word-furui-old", "word-takai-expensive-tall", "word-yasui-cheap", "word-atsui-hot", "word-samui-cold", "word-oishii-delicious"]
    },
    {
      id: "actions-questions",
      packageId: REVIEW_PACKAGE_ID,
      title: "More actions and questions",
      description: "Extend simple exchanges with reading, writing, existence, meeting, waiting, and question words.",
      wordIds: ["word-yomu-read", "word-kaku-write", "word-aru-exist", "word-iru-exist-living", "word-au-meet", "word-matsu-wait", "word-tsukau-use", "word-dare-who", "word-itsu-when", "word-doushite-why"]
    }
  ];

  const PACKAGE_BY_ID = new Map(PACKAGES.map((item) => [item.packageId, item]));
  const UNITS = ALL_UNITS.filter((unit) => PACKAGE_BY_ID.get(unit.packageId)?.learnerVisible);

  function pronunciationFor(word) {
    const definition = WORD_BY_ID.get(word?.id) || WORD_BY_ROMAJI.get(word?.romaji);
    return definition?.pronunciation || word?.romaji || "";
  }

  function wordKey(word) {
    const definition = WORD_BY_ID.get(word?.id) || WORD_BY_ROMAJI.get(word?.romaji);
    return definition ? `vocab-${definition.id}` : "";
  }

  function wordsFor(unitId, vocabulary) {
    const unit = ALL_UNITS.find((candidate) => candidate.id === unitId);
    if (!unit || !Array.isArray(vocabulary)) return [];
    return unit.wordIds.map((id) => {
      const definition = WORD_BY_ID.get(id);
      const word = vocabulary.find((candidate) => candidate.romaji === definition?.romaji);
      return word ? { ...word, id, packageId: definition.packageId } : null;
    }).filter(Boolean);
  }

  function allWords(vocabulary) {
    return UNITS.flatMap((unit) => wordsFor(unit.id, vocabulary));
  }

  function allTrackWords(vocabulary) {
    return ALL_UNITS.flatMap((unit) => wordsFor(unit.id, vocabulary));
  }

  function normalizeProgress(value, vocabulary) {
    const words = allWords(vocabulary);
    const allowed = new Set(words.map(wordKey));
    const legacyKeys = new Map(words.map((word) => [`vocab-${word.romaji}`, wordKey(word)]));
    const completed = Array.isArray(value?.completed)
      ? [...new Set(value.completed
        .map((key) => legacyKeys.get(key) || key)
        .filter((key) => allowed.has(key)))]
      : [];
    return { completed };
  }

  function unitStatus(progress, unitId, vocabulary) {
    const words = wordsFor(unitId, vocabulary);
    const completed = new Set(normalizeProgress(progress, vocabulary).completed);
    const done = words.filter((word) => completed.has(wordKey(word))).length;
    return {
      done,
      total: words.length,
      complete: words.length > 0 && done === words.length,
      percent: words.length ? Math.round((done / words.length) * 100) : 0
    };
  }

  function isUnlocked(progress, unitId, vocabulary) {
    const index = UNITS.findIndex((unit) => unit.id === unitId);
    if (index < 0) return false;
    if (index === 0) return true;
    return UNITS.slice(0, index).every((unit) => unitStatus(progress, unit.id, vocabulary).complete);
  }

  function nextIncomplete(progress, vocabulary) {
    return UNITS.find((unit) => !unitStatus(progress, unit.id, vocabulary).complete) || null;
  }

  function markComplete(progress, word, vocabulary) {
    const normalized = normalizeProgress(progress, vocabulary);
    const allowed = new Set(allWords(vocabulary).map(wordKey));
    const key = word ? wordKey(word) : "";
    if (!allowed.has(key)) return normalized;
    return { completed: [...new Set([...normalized.completed, key])] };
  }

  function remainingWords(progress, unitId, vocabulary) {
    const completed = new Set(normalizeProgress(progress, vocabulary).completed);
    return wordsFor(unitId, vocabulary).filter((word) => !completed.has(wordKey(word)));
  }

  const helper = {
    METADATA,
    PACKAGES,
    WORDS,
    ALL_UNITS,
    UNITS,
    PRONUNCIATIONS,
    pronunciationFor,
    wordKey,
    wordsFor,
    allWords,
    allTrackWords,
    normalizeProgress,
    unitStatus,
    isUnlocked,
    nextIncomplete,
    markComplete,
    remainingWords
  };

  globalScope.JapanReadyVocabularyLessons = helper;
  if (typeof module !== "undefined" && module.exports) module.exports = helper;
})(typeof globalThis !== "undefined" ? globalThis : window);
