(function attachGrammarLessons(globalScope) {
  const METADATA = Object.freeze({
    contentId: "jrc-grammar-foundation-1",
    schemaVersion: 1,
    contentVersion: 1,
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    compatibility: { website: "active", android: "candidate" }
  });

  const UNITS = [
    {
      id: "topics-identity",
      title: "Topics and identity",
      description: "Use は to set the topic, です for a polite statement, and か for a question.",
      note: "When は marks the topic, it is written ha but pronounced wa. Japanese often leaves out a subject that is already understood.",
      helperWords: ["これ (kore) - this"],
      examples: [
        { id: "grammar-example-topics-student", japanese: "わたしはがくせいです。", romaji: "Watashi wa gakusei desu.", english: "I am a student." },
        { id: "grammar-example-topics-book", japanese: "これはほんです。", romaji: "Kore wa hon desu.", english: "This is a book." },
        { id: "grammar-example-topics-bag-question", japanese: "これはかばんですか。", romaji: "Kore wa kaban desu ka.", english: "Is this a bag?" }
      ],
      questions: [
        {
          id: "topics-translate-student",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "わたしはがくせいです。",
          romaji: "Watashi wa gakusei desu.",
          choices: ["I am a student.", "My friend is a teacher.", "This is a book."],
          answer: "I am a student.",
          explanation: "は sets わたし as the topic, and がくせいです says student in a polite statement."
        },
        {
          id: "topics-fill-wa",
          type: "choice",
          mode: "particles",
          prompt: "Choose the topic particle.",
          japanese: "これ ___ ほんです。",
          romaji: "Kore ___ hon desu.",
          choices: ["は", "を", "で", "か"],
          answer: "は",
          explanation: "は marks これ, this, as the topic. Here it is pronounced wa."
        },
        {
          id: "topics-build-bag",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: This is a bag.",
          tokens: [
            { text: "かばん", romaji: "kaban" },
            { text: "です", romaji: "desu" },
            { text: "これ", romaji: "kore" },
            { text: "は", romaji: "wa" }
          ],
          answerTokens: ["これ", "は", "かばん", "です"],
          answer: "これはかばんです。",
          romaji: "Kore wa kaban desu.",
          explanation: "Start with the topic これは, then identify it with かばんです."
        },
        {
          id: "topics-build-phone-question",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: Is this a telephone?",
          tokens: [
            { text: "か", romaji: "ka" },
            { text: "でんわ", romaji: "denwa" },
            { text: "これ", romaji: "kore" },
            { text: "です", romaji: "desu" },
            { text: "は", romaji: "wa" }
          ],
          answerTokens: ["これ", "は", "でんわ", "です", "か"],
          answer: "これはでんわですか。",
          romaji: "Kore wa denwa desu ka.",
          explanation: "Keep the statement order and add か at the end to make the question."
        }
      ]
    },
    {
      id: "objects-actions",
      title: "Objects and actions",
      description: "Use を after the thing that receives an action.",
      note: "The particle を is pronounced o. The verbs here are polite ます-form chunks; this lesson is not a full conjugation lesson.",
      helperWords: [],
      examples: [
        { id: "grammar-example-objects-drink-water", japanese: "みずをのみます。", romaji: "Mizu o nomimasu.", english: "I drink water." },
        { id: "grammar-example-objects-buy-bread", japanese: "パンをかいます。", romaji: "Pan o kaimasu.", english: "I buy bread." },
        { id: "grammar-example-objects-speak-japanese", japanese: "にほんごをはなします。", romaji: "Nihongo o hanashimasu.", english: "I speak Japanese." }
      ],
      questions: [
        {
          id: "objects-fill-o",
          type: "choice",
          mode: "particles",
          prompt: "Choose the object particle.",
          japanese: "みず ___ のみます。",
          romaji: "Mizu ___ nomimasu.",
          choices: ["は", "を", "に", "で"],
          answer: "を",
          explanation: "みず is what is being drunk, so it is followed by を, pronounced o."
        },
        {
          id: "objects-translate-bread",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "パンをかいます。",
          romaji: "Pan o kaimasu.",
          choices: ["I eat bread.", "I buy bread.", "I see bread."],
          answer: "I buy bread.",
          explanation: "パン is bread, を marks it as the object, and かいます means buy in this polite sentence."
        },
        {
          id: "objects-build-tea",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: I drink tea.",
          tokens: [
            { text: "のみます", romaji: "nomimasu" },
            { text: "おちゃ", romaji: "ocha" },
            { text: "を", romaji: "o" }
          ],
          answerTokens: ["おちゃ", "を", "のみます"],
          answer: "おちゃをのみます。",
          romaji: "Ocha o nomimasu.",
          explanation: "Put the object first, mark it with を, then finish with the polite action."
        },
        {
          id: "objects-meaning-japanese",
          type: "choice",
          mode: "sentences",
          prompt: "Which meaning matches the sentence?",
          japanese: "にほんごをはなします。",
          romaji: "Nihongo o hanashimasu.",
          choices: ["I listen to Japanese.", "I speak Japanese.", "I understand Japanese."],
          answer: "I speak Japanese.",
          explanation: "にほんご is Japanese language and はなします means speak in this polite sentence."
        }
      ]
    },
    {
      id: "destinations-places",
      title: "Destinations and action places",
      description: "Use に for a destination and で for the place where an action happens.",
      note: "The verb helps decide the particle: go to a place with に; buy, eat, or speak at a place with で.",
      helperWords: [],
      examples: [
        { id: "grammar-example-places-go-station", japanese: "えきにいきます。", romaji: "Eki ni ikimasu.", english: "I go to the station." },
        { id: "grammar-example-places-buy-at-station", japanese: "えきでパンをかいます。", romaji: "Eki de pan o kaimasu.", english: "I buy bread at the station." },
        { id: "grammar-example-places-bus-to-station", japanese: "バスでえきにいきます。", romaji: "Basu de eki ni ikimasu.", english: "I go to the station by bus." }
      ],
      questions: [
        {
          id: "places-fill-destination",
          type: "choice",
          mode: "particles",
          prompt: "Choose the destination particle.",
          japanese: "えき ___ いきます。",
          romaji: "Eki ___ ikimasu.",
          choices: ["は", "を", "に", "で"],
          answer: "に",
          explanation: "えき is the destination of いきます, so use に."
        },
        {
          id: "places-fill-action",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle for where the buying happens.",
          japanese: "えき ___ パンをかいます。",
          romaji: "Eki ___ pan o kaimasu.",
          choices: ["は", "を", "に", "で"],
          answer: "で",
          explanation: "The buying happens at the station, so えき is followed by で."
        },
        {
          id: "places-build-bus",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: I go to the station by bus.",
          tokens: [
            { text: "えき", romaji: "eki" },
            { text: "いきます", romaji: "ikimasu" },
            { text: "で", romaji: "de" },
            { text: "に", romaji: "ni" },
            { text: "バス", romaji: "basu" }
          ],
          answerTokens: ["バス", "で", "えき", "に", "いきます"],
          answer: "バスでえきにいきます。",
          romaji: "Basu de eki ni ikimasu.",
          explanation: "で marks the means of travel, while に marks the destination."
        },
        {
          id: "places-translate-japan",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "にほんにいきます。",
          romaji: "Nihon ni ikimasu.",
          choices: ["I go to Japan.", "I speak Japanese.", "I return from Japan."],
          answer: "I go to Japan.",
          explanation: "にほん is the destination, に marks it, and いきます means go."
        }
      ]
    },
    {
      id: "noun-links",
      title: "Connecting nouns with の",
      description: "Use の to connect one noun to another for belonging, type, or description.",
      note: "The relationship depends on context. In these first examples, の means my, a friend's, or Japanese-language.",
      helperWords: [],
      examples: [
        { id: "grammar-example-nouns-my-bag", japanese: "これはわたしのかばんです。", romaji: "Kore wa watashi no kaban desu.", english: "This is my bag." },
        { id: "grammar-example-nouns-friend-umbrella", japanese: "これはともだちのかさです。", romaji: "Kore wa tomodachi no kasa desu.", english: "This is a friend's umbrella." },
        { id: "grammar-example-nouns-japanese-book", japanese: "にほんごのほんです。", romaji: "Nihongo no hon desu.", english: "It is a Japanese-language book." }
      ],
      questions: [
        {
          id: "noun-fill-no",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle that connects the two nouns.",
          japanese: "これはわたし ___ かばんです。",
          romaji: "Kore wa watashi ___ kaban desu.",
          choices: ["は", "を", "の", "も"],
          answer: "の",
          explanation: "わたしのかばん connects I/me to bag and means my bag."
        },
        {
          id: "noun-translate-friend",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "これはともだちのかさです。",
          romaji: "Kore wa tomodachi no kasa desu.",
          choices: ["This is a friend's umbrella.", "This friend has a bag.", "This umbrella is in Japan."],
          answer: "This is a friend's umbrella.",
          explanation: "ともだちのかさ links friend and umbrella: a friend's umbrella."
        },
        {
          id: "noun-build-language-book",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: It is a Japanese-language book.",
          tokens: [
            { text: "ほん", romaji: "hon" },
            { text: "です", romaji: "desu" },
            { text: "にほんご", romaji: "nihongo" },
            { text: "の", romaji: "no" }
          ],
          answerTokens: ["にほんご", "の", "ほん", "です"],
          answer: "にほんごのほんです。",
          romaji: "Nihongo no hon desu.",
          explanation: "にほんごのほん uses の to describe the book as a Japanese-language book."
        }
      ]
    },
    {
      id: "with-and-also",
      title: "With, and, and also",
      description: "Use と for with or a complete noun list, and も for also or too.",
      note: "These are controlled beginner examples. と has other uses that are outside this first block.",
      helperWords: [],
      examples: [
        { id: "grammar-example-with-friend-to-station", japanese: "ともだちとえきにいきます。", romaji: "Tomodachi to eki ni ikimasu.", english: "I go to the station with a friend." },
        { id: "grammar-example-also-going", japanese: "わたしもいきます。", romaji: "Watashi mo ikimasu.", english: "I am going too." },
        { id: "grammar-example-list-tea-bread", japanese: "おちゃとパンをかいます。", romaji: "Ocha to pan o kaimasu.", english: "I buy tea and bread." }
      ],
      questions: [
        {
          id: "with-fill-to",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle meaning with.",
          japanese: "ともだち ___ えきにいきます。",
          romaji: "Tomodachi ___ eki ni ikimasu.",
          choices: ["と", "も", "の", "で"],
          answer: "と",
          explanation: "ともだちと means with a friend in this sentence."
        },
        {
          id: "also-fill-mo",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle meaning also or too.",
          japanese: "わたし ___ いきます。",
          romaji: "Watashi ___ ikimasu.",
          choices: ["と", "も", "の", "を"],
          answer: "も",
          explanation: "わたしも means I also or me too."
        },
        {
          id: "with-build-tea-bread",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: I buy tea and bread.",
          tokens: [
            { text: "パン", romaji: "pan" },
            { text: "かいます", romaji: "kaimasu" },
            { text: "おちゃ", romaji: "ocha" },
            { text: "と", romaji: "to" },
            { text: "を", romaji: "o" }
          ],
          answerTokens: ["おちゃ", "と", "パン", "を", "かいます"],
          answer: "おちゃとパンをかいます。",
          romaji: "Ocha to pan o kaimasu.",
          explanation: "と joins the two items, then を marks the whole list as what is bought."
        }
      ]
    }
  ];

  function allQuestions() {
    return UNITS.flatMap((unit) => unit.questions);
  }

  function questionsFor(unitId) {
    return UNITS.find((unit) => unit.id === unitId)?.questions || [];
  }

  function normalizeProgress(value) {
    const allowed = new Set(allQuestions().map((question) => question.id));
    const completed = Array.isArray(value?.completed)
      ? [...new Set(value.completed.filter((id) => allowed.has(id)))]
      : [];
    return { completed };
  }

  function unitStatus(progress, unitId) {
    const questions = questionsFor(unitId);
    const completed = new Set(normalizeProgress(progress).completed);
    const done = questions.filter((question) => completed.has(question.id)).length;
    return {
      done,
      total: questions.length,
      complete: questions.length > 0 && done === questions.length,
      percent: questions.length ? Math.round((done / questions.length) * 100) : 0
    };
  }

  function isUnlocked(progress, unitId) {
    const index = UNITS.findIndex((unit) => unit.id === unitId);
    if (index <= 0) return index === 0;
    return UNITS.slice(0, index).every((unit) => unitStatus(progress, unit.id).complete);
  }

  function nextIncomplete(progress) {
    return UNITS.find((unit) => !unitStatus(progress, unit.id).complete) || null;
  }

  function markComplete(progress, question) {
    const normalized = normalizeProgress(progress);
    if (!question || !allQuestions().some((candidate) => candidate.id === question.id)) return normalized;
    return { completed: [...new Set([...normalized.completed, question.id])] };
  }

  function remainingQuestions(progress, unitId) {
    const completed = new Set(normalizeProgress(progress).completed);
    return questionsFor(unitId).filter((question) => !completed.has(question.id));
  }

  const helper = {
    METADATA,
    UNITS,
    allQuestions,
    questionsFor,
    normalizeProgress,
    unitStatus,
    isUnlocked,
    nextIncomplete,
    markComplete,
    remainingQuestions
  };

  globalScope.JapanReadyGrammarLessons = helper;
  if (typeof module !== "undefined" && module.exports) module.exports = helper;
})(typeof globalThis !== "undefined" ? globalThis : window);
