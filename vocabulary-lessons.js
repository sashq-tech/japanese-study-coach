(function attachVocabularyLessons(globalScope) {
  const UNITS = [
    {
      id: "people-japan",
      title: "People, names, and Japan",
      description: "Start with identity words that later support introductions and simple sentences.",
      romaji: ["watashi", "hito", "tomodachi", "sensei", "gakusei", "kazoku", "namae", "kuni", "nihon", "nihongo"]
    },
    {
      id: "food-things",
      title: "Food and everyday things",
      description: "Learn concrete nouns and meet a few familiar words written in Katakana.",
      romaji: ["mizu", "gohan", "ocha", "koohii", "pan", "hon", "denwa", "kaban", "kasa", "kutsu"]
    },
    {
      id: "getting-around",
      title: "Getting around",
      description: "Build a practical travel group for stations, rides, tickets, and directions.",
      romaji: ["eki", "toire", "densha", "basu", "takushii", "kippu", "michi", "migi", "hidari", "massugu"]
    },
    {
      id: "core-actions",
      title: "Core actions",
      description: "Add verbs for moving, eating, listening, speaking, buying, and doing.",
      romaji: ["iku", "kuru", "kaeru", "taberu", "nomu", "miru", "kiku", "hanasu", "kau", "suru"]
    },
    {
      id: "questions-exchanges",
      title: "Questions and calm exchanges",
      description: "Finish with words for asking, responding, slowing down, and recovering understanding.",
      romaji: ["doko", "nani", "ikura", "dou", "hai", "iie", "daijoubu", "chotto", "yukkuri", "wakaru"]
    }
  ];

  const PRONUNCIATIONS = {
    watashi: "wah-tah-shee",
    hito: "hee-toh",
    tomodachi: "toh-moh-dah-chee",
    sensei: "sen-say",
    gakusei: "gah-koo-say",
    kazoku: "kah-zoh-koo",
    namae: "nah-mah-eh",
    kuni: "koo-nee",
    nihon: "nee-hohn",
    nihongo: "nee-hohn-goh",
    mizu: "mee-zoo",
    gohan: "goh-hahn",
    ocha: "oh-chah",
    koohii: "koh-hee",
    pan: "pahn",
    hon: "hohn",
    denwa: "den-wah",
    kaban: "kah-bahn",
    kasa: "kah-sah",
    kutsu: "koo-tsoo",
    eki: "eh-kee",
    toire: "toh-ee-reh",
    densha: "den-shah",
    basu: "bah-soo",
    takushii: "tah-koo-shee",
    kippu: "keep-poo",
    michi: "mee-chee",
    migi: "mee-gee",
    hidari: "hee-dah-ree",
    massugu: "mahs-soo-goo",
    iku: "ee-koo",
    kuru: "koo-roo",
    kaeru: "kah-eh-roo",
    taberu: "tah-beh-roo",
    nomu: "noh-moo",
    miru: "mee-roo",
    kiku: "kee-koo",
    hanasu: "hah-nah-soo",
    kau: "kah-oo",
    suru: "soo-roo",
    doko: "doh-koh",
    nani: "nah-nee",
    ikura: "ee-koo-rah",
    dou: "doh",
    hai: "hah-ee",
    iie: "ee-eh",
    daijoubu: "dye-joh-boo",
    chotto: "choht-toh",
    yukkuri: "yook-koo-ree",
    wakaru: "wah-kah-roo"
  };

  function pronunciationFor(word) {
    return word?.romaji ? PRONUNCIATIONS[word.romaji] || word.romaji : "";
  }

  function wordKey(word) {
    return `vocab-${word.romaji}`;
  }

  function wordsFor(unitId, vocabulary) {
    const unit = UNITS.find((candidate) => candidate.id === unitId);
    if (!unit || !Array.isArray(vocabulary)) return [];
    return unit.romaji.map((romaji) => vocabulary.find((word) => word.romaji === romaji)).filter(Boolean);
  }

  function allWords(vocabulary) {
    return UNITS.flatMap((unit) => wordsFor(unit.id, vocabulary));
  }

  function normalizeProgress(value, vocabulary) {
    const allowed = new Set(allWords(vocabulary).map(wordKey));
    const completed = Array.isArray(value?.completed)
      ? [...new Set(value.completed.filter((key) => allowed.has(key)))]
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
