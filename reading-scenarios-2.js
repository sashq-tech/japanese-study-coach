const readingScenarios2Source = Object.freeze({
  type: "original_candidate",
  attribution: "Japan Ready Coach"
});

const readingScenarios2 = [
  {
    id: "bicycle-exists",
    schemaVersion: 1,
    contentVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["word-jitensha-bicycle"],
      grammar: ["existence-things-people"]
    },
    tags: ["reading-set-2", "transport", "existence"],
    source: readingScenarios2Source,
    reviewStatus: "needs_review",
    title: "じてんしゃがあります",
    passage: "じてんしゃがあります。",
    clues: [["じてんしゃ", "bicycle"], ["あります", "there is / exists"]],
    questions: [
      {
        id: "bicycle-exists-q1",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-jitensha-bicycle"], grammar: ["existence-things-people"] },
        tags: ["reading-set-2", "detail", "existence"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "What is there?",
        choices: ["A bicycle", "A car", "A bus"],
        answer: "A bicycle",
        explanation: "じてんしゃ means bicycle. あります says that it exists or is there."
      },
      {
        id: "bicycle-exists-q2",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-jitensha-bicycle"], grammar: ["existence-things-people"] },
        tags: ["reading-set-2", "form", "existence"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Which word says that the bicycle is there?",
        choices: ["あります", "じてんしゃ", "です"],
        answer: "あります",
        explanation: "あります expresses existence for a non-living thing such as a bicycle."
      }
    ]
  },
  {
    id: "friend-at-school",
    schemaVersion: 1,
    contentVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["word-tomodachi", "word-gakkou-school", "word-iru-exist-living"],
      grammar: ["locations-positions"]
    },
    tags: ["reading-set-2", "people", "school", "location"],
    source: readingScenarios2Source,
    reviewStatus: "needs_review",
    title: "ともだちはがっこうにいます",
    passage: "ともだちはがっこうにいます。",
    clues: [["ともだち", "friend"], ["がっこう", "school"], ["います", "is / exists (living thing)"]],
    questions: [
      {
        id: "friend-at-school-q1",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-gakkou-school"], grammar: ["locations-positions"] },
        tags: ["reading-set-2", "location", "school"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Where is the friend?",
        choices: ["At school", "At home", "At the station"],
        answer: "At school",
        explanation: "がっこう means school. に marks it as the location with います."
      },
      {
        id: "friend-at-school-q2",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-iru-exist-living"], grammar: ["locations-positions"] },
        tags: ["reading-set-2", "people", "living-existence"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Who is at that location?",
        choices: ["A friend", "A teacher", "A student"],
        answer: "A friend",
        explanation: "ともだち means friend, and います is used because the friend is a person."
      }
    ]
  },
  {
    id: "who-is-there",
    schemaVersion: 1,
    contentVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["word-dare-who", "word-sensei"],
      grammar: ["question-words"]
    },
    tags: ["reading-set-2", "people", "question-words"],
    source: readingScenarios2Source,
    reviewStatus: "needs_review",
    title: "だれがいますか",
    passage: "だれがいますか。せんせいがいます。",
    clues: [["だれ", "who"], ["せんせい", "teacher"], ["います", "is / exists (living thing)"]],
    questions: [
      {
        id: "who-is-there-q1",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-dare-who"], grammar: ["question-words"] },
        tags: ["reading-set-2", "question", "question-words"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Which word asks who is there?",
        choices: ["だれ", "せんせい", "います"],
        answer: "だれ",
        explanation: "だれ means who."
      },
      {
        id: "who-is-there-q2",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-dare-who"], grammar: ["question-words"] },
        tags: ["reading-set-2", "answer", "question-words"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Who is there?",
        choices: ["A teacher", "A friend", "A student"],
        answer: "A teacher",
        explanation: "せんせい means teacher."
      }
    ]
  },
  {
    id: "not-reading-today",
    schemaVersion: 1,
    contentVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["word-kyou-today", "word-hon", "word-yomu-read"],
      grammar: ["polite-negatives"]
    },
    tags: ["reading-set-2", "time", "books", "polite-negative"],
    source: readingScenarios2Source,
    reviewStatus: "needs_review",
    title: "きょうはよみません",
    passage: "きょうはほんをよみません。",
    clues: [["きょう", "today"], ["ほん", "book"], ["よみません", "do not read"]],
    questions: [
      {
        id: "not-reading-today-q1",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-yomu-read"], grammar: ["polite-negatives"] },
        tags: ["reading-set-2", "action", "polite-negative"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Does the speaker read a book?",
        choices: ["No", "Yes", "The passage does not say"],
        answer: "No",
        explanation: "よみません is the polite negative and means do not read."
      },
      {
        id: "not-reading-today-q2",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-kyou-today"], grammar: ["polite-negatives"] },
        tags: ["reading-set-2", "time", "polite-negative"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "When does the speaker not read?",
        choices: ["Today", "Tomorrow", "Yesterday"],
        answer: "Today",
        explanation: "きょう means today."
      }
    ]
  },
  {
    id: "new-book-request",
    schemaVersion: 1,
    contentVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["word-atarashii-new", "word-hon"],
      grammar: ["simple-requests"]
    },
    tags: ["reading-set-2", "books", "shopping", "simple-request"],
    source: readingScenarios2Source,
    reviewStatus: "needs_review",
    title: "あたらしいほんをください",
    passage: "あたらしいほんをください。",
    clues: [["あたらしい", "new"], ["ほん", "book"], ["ください", "please give me"]],
    questions: [
      {
        id: "new-book-request-q1",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-atarashii-new"], grammar: ["simple-requests"] },
        tags: ["reading-set-2", "item", "simple-request"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "What is being requested?",
        choices: ["A new book", "An old book", "A new bag"],
        answer: "A new book",
        explanation: "あたらしい means new, and ほん means book."
      },
      {
        id: "new-book-request-q2",
        schemaVersion: 1,
        contentVersion: 1,
        scriptLevel: "hiragana-only",
        prerequisites: { kana: ["hiragana-basic"], vocabulary: ["word-atarashii-new"], grammar: ["simple-requests"] },
        tags: ["reading-set-2", "request-marker", "simple-request"],
        source: readingScenarios2Source,
        reviewStatus: "needs_review",
        prompt: "Which word makes this a simple polite request?",
        choices: ["ください", "ほん", "あたらしい"],
        answer: "ください",
        explanation: "ください makes the noun phrase a simple polite request for the item."
      }
    ]
  }
];
