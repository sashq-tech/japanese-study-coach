(function attachVocabularyLessons(globalScope) {
  const METADATA = Object.freeze({
    contentId: "jrc-vocabulary-foundation-1",
    schemaVersion: 1,
    contentVersion: 1,
    source: { type: "legacy_seed", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    compatibility: { website: "active", android: "candidate" }
  });

  const WORDS = [
    { id: "word-watashi", romaji: "watashi", pronunciation: "wah-tah-shee" },
    { id: "word-hito", romaji: "hito", pronunciation: "hee-toh" },
    { id: "word-tomodachi", romaji: "tomodachi", pronunciation: "toh-moh-dah-chee" },
    { id: "word-sensei", romaji: "sensei", pronunciation: "sen-say" },
    { id: "word-gakusei", romaji: "gakusei", pronunciation: "gah-koo-say" },
    { id: "word-kazoku", romaji: "kazoku", pronunciation: "kah-zoh-koo" },
    { id: "word-namae", romaji: "namae", pronunciation: "nah-mah-eh" },
    { id: "word-kuni", romaji: "kuni", pronunciation: "koo-nee" },
    { id: "word-nihon", romaji: "nihon", pronunciation: "nee-hohn" },
    { id: "word-nihongo", romaji: "nihongo", pronunciation: "nee-hohn-goh" },
    { id: "word-mizu", romaji: "mizu", pronunciation: "mee-zoo" },
    { id: "word-gohan", romaji: "gohan", pronunciation: "goh-hahn" },
    { id: "word-ocha", romaji: "ocha", pronunciation: "oh-chah" },
    { id: "word-koohii", romaji: "koohii", pronunciation: "koh-hee" },
    { id: "word-pan", romaji: "pan", pronunciation: "pahn" },
    { id: "word-hon", romaji: "hon", pronunciation: "hohn" },
    { id: "word-denwa", romaji: "denwa", pronunciation: "den-wah" },
    { id: "word-kaban", romaji: "kaban", pronunciation: "kah-bahn" },
    { id: "word-kasa", romaji: "kasa", pronunciation: "kah-sah" },
    { id: "word-kutsu", romaji: "kutsu", pronunciation: "koo-tsoo" },
    { id: "word-eki", romaji: "eki", pronunciation: "eh-kee" },
    { id: "word-toire", romaji: "toire", pronunciation: "toh-ee-reh" },
    { id: "word-densha", romaji: "densha", pronunciation: "den-shah" },
    { id: "word-basu", romaji: "basu", pronunciation: "bah-soo" },
    { id: "word-takushii", romaji: "takushii", pronunciation: "tah-koo-shee" },
    { id: "word-kippu", romaji: "kippu", pronunciation: "keep-poo" },
    { id: "word-michi", romaji: "michi", pronunciation: "mee-chee" },
    { id: "word-migi", romaji: "migi", pronunciation: "mee-gee" },
    { id: "word-hidari", romaji: "hidari", pronunciation: "hee-dah-ree" },
    { id: "word-massugu", romaji: "massugu", pronunciation: "mahs-soo-goo" },
    { id: "word-iku", romaji: "iku", pronunciation: "ee-koo" },
    { id: "word-kuru", romaji: "kuru", pronunciation: "koo-roo" },
    { id: "word-kaeru", romaji: "kaeru", pronunciation: "kah-eh-roo" },
    { id: "word-taberu", romaji: "taberu", pronunciation: "tah-beh-roo" },
    { id: "word-nomu", romaji: "nomu", pronunciation: "noh-moo" },
    { id: "word-miru", romaji: "miru", pronunciation: "mee-roo" },
    { id: "word-kiku", romaji: "kiku", pronunciation: "kee-koo" },
    { id: "word-hanasu", romaji: "hanasu", pronunciation: "hah-nah-soo" },
    { id: "word-kau", romaji: "kau", pronunciation: "kah-oo" },
    { id: "word-suru", romaji: "suru", pronunciation: "soo-roo" },
    { id: "word-doko", romaji: "doko", pronunciation: "doh-koh" },
    { id: "word-nani", romaji: "nani", pronunciation: "nah-nee" },
    { id: "word-ikura", romaji: "ikura", pronunciation: "ee-koo-rah" },
    { id: "word-dou", romaji: "dou", pronunciation: "doh" },
    { id: "word-hai", romaji: "hai", pronunciation: "hah-ee" },
    { id: "word-iie", romaji: "iie", pronunciation: "ee-eh" },
    { id: "word-daijoubu", romaji: "daijoubu", pronunciation: "dye-joh-boo" },
    { id: "word-chotto", romaji: "chotto", pronunciation: "choht-toh" },
    { id: "word-yukkuri", romaji: "yukkuri", pronunciation: "yook-koo-ree" },
    { id: "word-wakaru", romaji: "wakaru", pronunciation: "wah-kah-roo" }
  ];

  const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]));
  const WORD_BY_ROMAJI = new Map(WORDS.map((word) => [word.romaji, word]));
  const PRONUNCIATIONS = Object.fromEntries(WORDS.map((word) => [word.romaji, word.pronunciation]));

  const UNITS = [
    {
      id: "people-japan",
      title: "People, names, and Japan",
      description: "Start with identity words that later support introductions and simple sentences.",
      wordIds: ["word-watashi", "word-hito", "word-tomodachi", "word-sensei", "word-gakusei", "word-kazoku", "word-namae", "word-kuni", "word-nihon", "word-nihongo"]
    },
    {
      id: "food-things",
      title: "Food and everyday things",
      description: "Learn concrete nouns and meet a few familiar words written in Katakana.",
      wordIds: ["word-mizu", "word-gohan", "word-ocha", "word-koohii", "word-pan", "word-hon", "word-denwa", "word-kaban", "word-kasa", "word-kutsu"]
    },
    {
      id: "getting-around",
      title: "Getting around",
      description: "Build a practical travel group for stations, rides, tickets, and directions.",
      wordIds: ["word-eki", "word-toire", "word-densha", "word-basu", "word-takushii", "word-kippu", "word-michi", "word-migi", "word-hidari", "word-massugu"]
    },
    {
      id: "core-actions",
      title: "Core actions",
      description: "Add verbs for moving, eating, listening, speaking, buying, and doing.",
      wordIds: ["word-iku", "word-kuru", "word-kaeru", "word-taberu", "word-nomu", "word-miru", "word-kiku", "word-hanasu", "word-kau", "word-suru"]
    },
    {
      id: "questions-exchanges",
      title: "Questions and calm exchanges",
      description: "Finish with words for asking, responding, slowing down, and recovering understanding.",
      wordIds: ["word-doko", "word-nani", "word-ikura", "word-dou", "word-hai", "word-iie", "word-daijoubu", "word-chotto", "word-yukkuri", "word-wakaru"]
    }
  ];

  function pronunciationFor(word) {
    const definition = word?.id ? WORD_BY_ID.get(word.id) : WORD_BY_ROMAJI.get(word?.romaji);
    return definition?.pronunciation || word?.romaji || "";
  }

  function wordKey(word) {
    const definition = word?.id ? WORD_BY_ID.get(word.id) : WORD_BY_ROMAJI.get(word?.romaji);
    return definition ? `vocab-${definition.id}` : "";
  }

  function wordsFor(unitId, vocabulary) {
    const unit = UNITS.find((candidate) => candidate.id === unitId);
    if (!unit || !Array.isArray(vocabulary)) return [];
    return unit.wordIds.map((id) => {
      const definition = WORD_BY_ID.get(id);
      const word = vocabulary.find((candidate) => candidate.romaji === definition?.romaji);
      return word ? { ...word, id } : null;
    }).filter(Boolean);
  }

  function allWords(vocabulary) {
    return UNITS.flatMap((unit) => wordsFor(unit.id, vocabulary));
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
    if (index <= 0) return index === 0;
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
    WORDS,
    UNITS,
    PRONUNCIATIONS,
    pronunciationFor,
    wordKey,
    wordsFor,
    allWords,
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
