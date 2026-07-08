(function attachNameHelper(globalScope) {
  const spellingReplacements = [
    [/ph/g, "f"],
    [/ck/g, "k"],
    [/qu/g, "kw"],
    [/x/g, "ks"],
    [/c(?=[eiy])/g, "s"],
    [/c/g, "k"],
    [/gh/g, "g"],
    [/y$/g, "i"],
    [/e$/g, ""]
  ];

  const romajiChunks = [
    ["kya", "キャ"], ["kyu", "キュ"], ["kyo", "キョ"],
    ["sha", "シャ"], ["shu", "シュ"], ["sho", "ショ"], ["she", "シェ"],
    ["cha", "チャ"], ["chu", "チュ"], ["cho", "チョ"], ["che", "チェ"],
    ["ja", "ジャ"], ["ju", "ジュ"], ["jo", "ジョ"], ["je", "ジェ"],
    ["nya", "ニャ"], ["nyu", "ニュ"], ["nyo", "ニョ"],
    ["hya", "ヒャ"], ["hyu", "ヒュ"], ["hyo", "ヒョ"],
    ["mya", "ミャ"], ["myu", "ミュ"], ["myo", "ミョ"],
    ["rya", "リャ"], ["ryu", "リュ"], ["ryo", "リョ"],
    ["gya", "ギャ"], ["gyu", "ギュ"], ["gyo", "ギョ"],
    ["bya", "ビャ"], ["byu", "ビュ"], ["byo", "ビョ"],
    ["pya", "ピャ"], ["pyu", "ピュ"], ["pyo", "ピョ"],
    ["fa", "ファ"], ["fi", "フィ"], ["fe", "フェ"], ["fo", "フォ"],
    ["va", "ヴァ"], ["vi", "ヴィ"], ["vu", "ヴ"], ["ve", "ヴェ"], ["vo", "ヴォ"],
    ["tsa", "ツァ"], ["tsi", "ツィ"], ["tse", "ツェ"], ["tso", "ツォ"],
    ["ti", "ティ"], ["tu", "トゥ"], ["di", "ディ"], ["du", "ドゥ"],
    ["wi", "ウィ"], ["we", "ウェ"], ["wo", "ウォ"],
    ["shi", "シ"], ["chi", "チ"], ["tsu", "ツ"], ["fu", "フ"],
    ["ka", "カ"], ["ki", "キ"], ["ku", "ク"], ["ke", "ケ"], ["ko", "コ"],
    ["sa", "サ"], ["si", "シ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"],
    ["ta", "タ"], ["ti", "チ"], ["tu", "ツ"], ["te", "テ"], ["to", "ト"],
    ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"],
    ["ha", "ハ"], ["hi", "ヒ"], ["hu", "フ"], ["he", "ヘ"], ["ho", "ホ"],
    ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"],
    ["ya", "ヤ"], ["yu", "ユ"], ["yo", "ヨ"],
    ["ra", "ラ"], ["ri", "リ"], ["ru", "ル"], ["re", "レ"], ["ro", "ロ"],
    ["la", "ラ"], ["li", "リ"], ["lu", "ル"], ["le", "レ"], ["lo", "ロ"],
    ["wa", "ワ"],
    ["ga", "ガ"], ["gi", "ギ"], ["gu", "グ"], ["ge", "ゲ"], ["go", "ゴ"],
    ["za", "ザ"], ["zi", "ジ"], ["zu", "ズ"], ["ze", "ゼ"], ["zo", "ゾ"],
    ["da", "ダ"], ["ji", "ジ"], ["du", "ヅ"], ["de", "デ"], ["do", "ド"],
    ["ba", "バ"], ["bi", "ビ"], ["bu", "ブ"], ["be", "ベ"], ["bo", "ボ"],
    ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"],
    ["a", "ア"], ["i", "イ"], ["u", "ウ"], ["e", "エ"], ["o", "オ"],
    ["n", "ン"]
  ];

  const finalConsonants = {
    b: "ブ",
    c: "ク",
    d: "ド",
    f: "フ",
    g: "グ",
    h: "フ",
    j: "ジ",
    k: "ク",
    l: "ル",
    m: "ム",
    n: "ン",
    p: "プ",
    q: "ク",
    r: "ル",
    s: "ス",
    t: "ト",
    v: "ヴ",
    w: "ウ",
    x: "クス",
    y: "イ",
    z: "ズ"
  };

  function normalizeNameInput(input) {
    return String(input || "")
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function findCuratedName(input, curatedNames) {
    const normalized = normalizeNameInput(input);
    if (!normalized || !Array.isArray(curatedNames)) return null;
    return curatedNames.find((entry) => entry.input.includes(normalized)) || null;
  }

  function preparePart(part) {
    return spellingReplacements.reduce((text, [pattern, replacement]) => (
      text.replace(pattern, replacement)
    ), part);
  }

  function convertPartToKatakana(part) {
    let text = preparePart(part);
    let output = "";
    while (text.length) {
      const doubled = text.length > 1 && text[0] === text[1] && !/[aeioun]/.test(text[0]);
      if (doubled) {
        output += "ッ";
        text = text.slice(1);
        continue;
      }
      const match = romajiChunks.find(([romaji]) => text.startsWith(romaji));
      if (match) {
        output += match[1];
        text = text.slice(match[0].length);
        continue;
      }
      const fallback = finalConsonants[text[0]];
      output += fallback || "";
      text = text.slice(1);
    }
    return output;
  }

  function buildFallbackSuggestion(input) {
    const normalized = normalizeNameInput(input);
    const parts = normalized
      .replace(/[^a-z\s-]/g, "")
      .split(/[\s-]+/)
      .filter(Boolean);
    const katakana = parts.map(convertPartToKatakana).filter(Boolean).join("・");
    return katakana || "";
  }

  function suggestKatakanaName(input, curatedNames) {
    const normalized = normalizeNameInput(input);
    if (!normalized) return null;
    const curated = findCuratedName(input, curatedNames);
    if (curated) {
      return {
        source: "curated",
        katakana: curated.katakana,
        sound: curated.sound,
        note: curated.note
      };
    }
    const katakana = buildFallbackSuggestion(input);
    if (!katakana) return null;
    return {
      source: "fallback",
      katakana,
      sound: normalized,
      note: "This is a rough spelling-based suggestion. Confirm the pronunciation before treating it as your name form."
    };
  }

  const helper = {
    normalizeNameInput,
    findCuratedName,
    buildFallbackSuggestion,
    suggestKatakanaName
  };

  globalScope.JapanReadyNameHelper = helper;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = helper;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
