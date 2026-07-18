const readingScenarios = [
  {
    id: "morning-water",
    title: "あさのみず",
    passage: "あさです。わたしはみずをのみます。",
    clues: [
      ["あさ", "morning"],
      ["みず", "water"],
      ["のみます", "drink"]
    ],
    questions: [
      {
        prompt: "When is this happening?",
        choices: ["Morning", "Afternoon", "Night"],
        answer: "Morning",
        explanation: "あさ means morning."
      },
      {
        prompt: "What does the speaker drink?",
        choices: ["Water", "Tea", "Coffee"],
        answer: "Water",
        explanation: "みず means water, and のみます means drink."
      }
    ]
  },
  {
    id: "station-friend",
    title: "ともだちとえきへ",
    passage: "わたしはともだちとえきにいきます。",
    clues: [
      ["ともだち", "friend"],
      ["えき", "station"],
      ["いきます", "go"]
    ],
    questions: [
      {
        prompt: "Where is the speaker going?",
        choices: ["The station", "School", "Home"],
        answer: "The station",
        explanation: "えき means station. に marks it as the destination."
      },
      {
        prompt: "Who is going with the speaker?",
        choices: ["A friend", "A teacher", "A parent"],
        answer: "A friend",
        explanation: "ともだち means friend. と can mark the person someone goes with."
      }
    ]
  },
  {
    id: "book-on-desk",
    title: "つくえのうえ",
    passage: "つくえのうえにほんがあります。",
    clues: [
      ["つくえ", "desk"],
      ["うえ", "on top / above"],
      ["ほん", "book"]
    ],
    questions: [
      {
        prompt: "What is in the scene?",
        choices: ["A book", "A bag", "Water"],
        answer: "A book",
        explanation: "ほん means book."
      },
      {
        prompt: "Where is the book?",
        choices: ["On the desk", "Under the desk", "In a bag"],
        answer: "On the desk",
        explanation: "つくえのうえ means on top of the desk."
      }
    ]
  },
  {
    id: "school-tomorrow",
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
        prompt: "When does the speaker go to school?",
        choices: ["Tomorrow", "Today", "Yesterday"],
        answer: "Tomorrow",
        explanation: "あした means tomorrow."
      },
      {
        prompt: "What does the speaker study?",
        choices: ["Japanese", "English", "Math"],
        answer: "Japanese",
        explanation: "にほんご means the Japanese language."
      }
    ]
  },
  {
    id: "lunch-at-home",
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
        prompt: "Where does the speaker eat?",
        choices: ["At home", "At school", "At the station"],
        answer: "At home",
        explanation: "いえ means home. で marks where the eating happens."
      },
      {
        prompt: "What does the speaker do?",
        choices: ["Eats a meal", "Reads a book", "Drinks water"],
        answer: "Eats a meal",
        explanation: "ごはん is a meal or rice, and たべます means eat."
      }
    ]
  }
];
