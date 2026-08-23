const readingScenarios = [
  {
    id: "morning-water",
    schemaVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["asa", "watashi", "mizu", "nomu"],
      grammar: ["desu", "topic-wa", "object-o"]
    },
    tags: ["time", "daily-routine", "food-drink"],
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    title: "あさのみず",
    passage: "あさです。わたしはみずをのみます。",
    clues: [
      ["あさ", "morning"],
      ["みず", "water"],
      ["のみます", "drink"]
    ],
    questions: [
      {
        id: "morning-water-q1",
        prompt: "When is this happening?",
        choices: ["Morning", "Afternoon", "Night"],
        answer: "Morning",
        explanation: "あさ means morning."
      },
      {
        id: "morning-water-q2",
        prompt: "What does the speaker drink?",
        choices: ["Water", "Tea", "Coffee"],
        answer: "Water",
        explanation: "みず means water, and のみます means drink."
      }
    ]
  },
  {
    id: "station-friend",
    schemaVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["watashi", "tomodachi", "eki", "iku"],
      grammar: ["topic-wa", "companion-to", "destination-ni"]
    },
    tags: ["travel", "places", "people"],
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    title: "ともだちとえきへ",
    passage: "わたしはともだちとえきにいきます。",
    clues: [
      ["ともだち", "friend"],
      ["えき", "station"],
      ["いきます", "go"]
    ],
    questions: [
      {
        id: "station-friend-q1",
        prompt: "Where is the speaker going?",
        choices: ["The station", "School", "Home"],
        answer: "The station",
        explanation: "えき means station. に marks it as the destination."
      },
      {
        id: "station-friend-q2",
        prompt: "Who is going with the speaker?",
        choices: ["A friend", "A teacher", "A parent"],
        answer: "A friend",
        explanation: "ともだち means friend. と can mark the person someone goes with."
      }
    ]
  },
  {
    id: "book-on-desk",
    schemaVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["tsukue", "ue", "hon", "aru"],
      grammar: ["noun-no", "location-ni", "subject-ga", "existence-aru"]
    },
    tags: ["location", "objects", "position"],
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    title: "つくえのうえ",
    passage: "つくえのうえにほんがあります。",
    clues: [
      ["つくえ", "desk"],
      ["うえ", "on top / above"],
      ["ほん", "book"]
    ],
    questions: [
      {
        id: "book-on-desk-q1",
        prompt: "What is in the scene?",
        choices: ["A book", "A bag", "Water"],
        answer: "A book",
        explanation: "ほん means book."
      },
      {
        id: "book-on-desk-q2",
        prompt: "Where is the book?",
        choices: ["On the desk", "Under the desk", "In a bag"],
        answer: "On the desk",
        explanation: "つくえのうえ means on top of the desk."
      }
    ]
  },
  {
    id: "school-tomorrow",
    schemaVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["ashita", "gakkou", "iku", "nihongo", "benkyou-suru"],
      grammar: ["destination-ni", "action-location-de", "object-o"]
    },
    tags: ["time", "school", "study"],
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    title: "あしたのがっこう",
    passage: "あした、がっこうにいきます。がっこうでにほんごをべんきょうします。",
    clues: [
      ["あした", "tomorrow"],
      ["がっこう", "school"],
      ["にほんご", "Japanese language"],
      ["べんきょうします", "study"]
    ],
    questions: [
      {
        id: "school-tomorrow-q1",
        prompt: "When does the speaker go to school?",
        choices: ["Tomorrow", "Today", "Yesterday"],
        answer: "Tomorrow",
        explanation: "あした means tomorrow."
      },
      {
        id: "school-tomorrow-q2",
        prompt: "What does the speaker study?",
        choices: ["Japanese", "English", "Math"],
        answer: "Japanese",
        explanation: "にほんご means the Japanese language."
      }
    ]
  },
  {
    id: "lunch-at-home",
    schemaVersion: 1,
    scriptLevel: "hiragana-only",
    prerequisites: {
      kana: ["hiragana-basic"],
      vocabulary: ["hiru", "ie", "gohan", "taberu"],
      grammar: ["desu", "action-location-de", "object-o"]
    },
    tags: ["time", "home", "food-drink"],
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    title: "いえでひるごはん",
    passage: "ひるです。いえでごはんをたべます。",
    clues: [
      ["ひる", "noon / daytime"],
      ["いえ", "home"],
      ["ごはん", "meal / rice"],
      ["たべます", "eat"]
    ],
    questions: [
      {
        id: "lunch-at-home-q1",
        prompt: "Where does the speaker eat?",
        choices: ["At home", "At school", "At the station"],
        answer: "At home",
        explanation: "いえ means home. で marks where the eating happens."
      },
      {
        id: "lunch-at-home-q2",
        prompt: "What does the speaker do?",
        choices: ["Eats a meal", "Reads a book", "Drinks water"],
        answer: "Eats a meal",
        explanation: "ごはん is a meal or rice, and たべます means eat."
      }
    ]
  }
];
