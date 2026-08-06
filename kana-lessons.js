(function attachKanaLessons(globalScope) {
  const STARTER_ROWS = [
    { id: "vowels", label: "Vowel row", shortLabel: "Vowels", group: "vowels", romaji: ["a", "i", "u", "e", "o"] },
    { id: "k", label: "K row", shortLabel: "K row", group: "k", romaji: ["ka", "ki", "ku", "ke", "ko"] },
    { id: "s", label: "S row", shortLabel: "S row", group: "s", romaji: ["sa", "shi", "su", "se", "so"] },
    { id: "t", label: "T row", shortLabel: "T row", group: "t", romaji: ["ta", "chi", "tsu", "te", "to"] },
    { id: "n", label: "N row", shortLabel: "N row", group: "n", romaji: ["na", "ni", "nu", "ne", "no"] },
    { id: "h", label: "H row", shortLabel: "H row", group: "h", romaji: ["ha", "hi", "fu", "he", "ho"] },
    { id: "m", label: "M row", shortLabel: "M row", group: "m", romaji: ["ma", "mi", "mu", "me", "mo"] },
    { id: "y", label: "Y row", shortLabel: "Y row", group: "y", romaji: ["ya", "yu", "yo"] },
    { id: "r", label: "R row", shortLabel: "R row", group: "r", romaji: ["ra", "ri", "ru", "re", "ro"] },
    { id: "w", label: "W row", shortLabel: "W row", group: "w", romaji: ["wa", "wo"] },
    { id: "final-n", label: "Final N", shortLabel: "Final N", group: "n", romaji: ["n"] }
  ];
  const DECK_ORDER = ["hiragana", "katakana"];

  function cardKey(deck, item) {
    return `${deck}:${item.kana}`;
  }

  function rowById(rowId) {
    return STARTER_ROWS.find((row) => row.id === rowId) || null;
  }

  function itemsFor(deck, rowId, kanaDecks) {
    const row = rowById(rowId);
    const items = kanaDecks?.[deck];
    if (!row || !Array.isArray(items)) return [];
    return row.romaji.map((romaji) => items.find((item) => item.group === row.group && item.romaji === romaji)).filter(Boolean);
  }

  function emptyProgress() {
    return { hiragana: {}, katakana: {} };
  }

  function normalizeProgress(value, kanaDecks) {
    const normalized = emptyProgress();
    DECK_ORDER.forEach((deck) => {
      STARTER_ROWS.forEach((row) => {
        const allowed = new Set(itemsFor(deck, row.id, kanaDecks).map((item) => cardKey(deck, item)));
        const saved = value?.[deck]?.[row.id];
        normalized[deck][row.id] = Array.isArray(saved)
          ? [...new Set(saved.filter((key) => allowed.has(key)))]
          : [];
      });
    });
    return normalized;
  }

  function mergeLegacyHits(progress, kanaHits, kanaDecks) {
    const merged = normalizeProgress(progress, kanaDecks);
    DECK_ORDER.forEach((deck) => {
      STARTER_ROWS.forEach((row) => {
        const completed = new Set(merged[deck][row.id]);
        itemsFor(deck, row.id, kanaDecks).forEach((item) => {
          const key = cardKey(deck, item);
          if ((kanaHits?.[deck]?.[key] || 0) > 0) completed.add(key);
        });
        merged[deck][row.id] = [...completed];
      });
    });
    return merged;
  }

  function rowStatus(progress, deck, rowId, kanaDecks) {
    const items = itemsFor(deck, rowId, kanaDecks);
    const completed = new Set(progress?.[deck]?.[rowId] || []);
    const done = items.filter((item) => completed.has(cardKey(deck, item))).length;
    return {
      total: items.length,
      done,
      complete: items.length > 0 && done === items.length,
      percent: items.length ? Math.round((done / items.length) * 100) : 0
    };
  }

  function markComplete(progress, deck, rowId, item, kanaDecks) {
    const updated = normalizeProgress(progress, kanaDecks);
    const allowed = itemsFor(deck, rowId, kanaDecks).some((candidate) => candidate.kana === item?.kana);
    if (!allowed) return updated;
    const key = cardKey(deck, item);
    updated[deck][rowId] = [...new Set([...updated[deck][rowId], key])];
    return updated;
  }

  function lessonSequence() {
    return DECK_ORDER.flatMap((deck) => STARTER_ROWS.map((row) => ({ deck, rowId: row.id })));
  }

  function nextIncomplete(progress, kanaDecks) {
    return lessonSequence().find((lesson) => !rowStatus(progress, lesson.deck, lesson.rowId, kanaDecks).complete) || null;
  }

  function nextAfter(deck, rowId) {
    const sequence = lessonSequence();
    const index = sequence.findIndex((lesson) => lesson.deck === deck && lesson.rowId === rowId);
    return index >= 0 ? sequence[index + 1] || null : sequence[0];
  }

  function isUnlocked(progress, deck, rowId, kanaDecks) {
    const sequence = lessonSequence();
    const index = sequence.findIndex((lesson) => lesson.deck === deck && lesson.rowId === rowId);
    if (index <= 0) return index === 0;
    return sequence.slice(0, index).every((lesson) => rowStatus(progress, lesson.deck, lesson.rowId, kanaDecks).complete);
  }

  const helper = {
    STARTER_ROWS,
    DECK_ORDER,
    cardKey,
    itemsFor,
    normalizeProgress,
    mergeLegacyHits,
    rowStatus,
    markComplete,
    lessonSequence,
    nextIncomplete,
    nextAfter,
    isUnlocked
  };

  globalScope.JapanReadyKanaLessons = helper;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = helper;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
