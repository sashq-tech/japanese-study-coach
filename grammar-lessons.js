(function attachGrammarLessons(globalScope) {
  const METADATA = Object.freeze({
    contentId: "jrc-grammar-foundation-1",
    schemaVersion: 1,
    contentVersion: 2,
    source: { type: "original", attribution: "Japan Ready Coach" },
    reviewStatus: "needs_review",
    compatibility: { website: "active", android: "candidate" },
    scope: { taughtExamples: 30, plannedExamples: 100, completeJlptAlignment: false }
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
    },
    {
      id: "existence-things-people",
      title: "Things and people that are there",
      description: "Use が with あります for things and います for people or animals.",
      note: "あります and います both express existence. Use あります for non-living things and います for living things in these beginner examples.",
      helperWords: ["あります (arimasu) - there is / have, for things", "います (imasu) - there is / have, for people or animals"],
      examples: [
        { id: "grammar-example-existence-water", japanese: "みずがあります。", romaji: "Mizu ga arimasu.", english: "There is water." },
        { id: "grammar-example-existence-friend", japanese: "ともだちがいます。", romaji: "Tomodachi ga imasu.", english: "There is a friend." },
        { id: "grammar-example-existence-phone", japanese: "でんわがあります。", romaji: "Denwa ga arimasu.", english: "There is a telephone." }
      ],
      questions: [
        {
          id: "existence-fill-ga",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle that marks what exists.",
          japanese: "みず ___ あります。",
          romaji: "Mizu ___ arimasu.",
          choices: ["は", "が", "を", "で"],
          answer: "が",
          explanation: "が marks みず as the thing that exists."
        },
        {
          id: "existence-choose-living",
          type: "choice",
          mode: "grammar",
          prompt: "Choose the existence verb used for a person.",
          japanese: "ともだちが ___。",
          romaji: "Tomodachi ga ___.",
          choices: ["あります", "います", "です", "かいます"],
          answer: "います",
          explanation: "A friend is a person, so use います rather than あります."
        },
        {
          id: "existence-build-bag",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: There is a bag.",
          tokens: [
            { text: "あります", romaji: "arimasu" },
            { text: "かばん", romaji: "kaban" },
            { text: "が", romaji: "ga" }
          ],
          answerTokens: ["かばん", "が", "あります"],
          answer: "かばんがあります。",
          romaji: "Kaban ga arimasu.",
          explanation: "Mark the non-living thing with が, then use あります."
        },
        {
          id: "existence-translate-phone",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "でんわがあります。",
          romaji: "Denwa ga arimasu.",
          choices: ["There is a telephone.", "I buy a telephone.", "The telephone is a friend."],
          answer: "There is a telephone.",
          explanation: "でんわ is a non-living thing, so でんわがあります means there is a telephone."
        }
      ]
    },
    {
      id: "locations-positions",
      title: "Locations and positions",
      description: "Use に with あります or います to say where a thing or person is.",
      note: "Position words connect to a reference noun with の: かばんのなか means inside the bag.",
      helperWords: ["うえ (ue) - on / above", "した (shita) - under / below", "なか (naka) - inside"],
      examples: [
        { id: "grammar-example-location-book-inside-bag", japanese: "ほんはかばんのなかにあります。", romaji: "Hon wa kaban no naka ni arimasu.", english: "The book is inside the bag." },
        { id: "grammar-example-location-phone-on-bag", japanese: "でんわはかばんのうえにあります。", romaji: "Denwa wa kaban no ue ni arimasu.", english: "The telephone is on the bag." },
        { id: "grammar-example-location-friend-at-station", japanese: "ともだちはえきにいます。", romaji: "Tomodachi wa eki ni imasu.", english: "The friend is at the station." }
      ],
      questions: [
        {
          id: "locations-fill-no",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle that connects the bag to its inside.",
          japanese: "ほんはかばん ___ なかにあります。",
          romaji: "Hon wa kaban ___ naka ni arimasu.",
          choices: ["は", "が", "の", "を"],
          answer: "の",
          explanation: "かばんのなか means inside the bag."
        },
        {
          id: "locations-fill-ni",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle that marks the telephone's location.",
          japanese: "でんわはかばんのうえ ___ あります。",
          romaji: "Denwa wa kaban no ue ___ arimasu.",
          choices: ["を", "に", "で", "と"],
          answer: "に",
          explanation: "に marks the place where the telephone exists."
        },
        {
          id: "locations-build-shoes-under-bag",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: The shoes are under the bag.",
          tokens: [
            { text: "あります", romaji: "arimasu" },
            { text: "した", romaji: "shita" },
            { text: "くつ", romaji: "kutsu" },
            { text: "に", romaji: "ni" },
            { text: "かばん", romaji: "kaban" },
            { text: "は", romaji: "wa" },
            { text: "の", romaji: "no" }
          ],
          answerTokens: ["くつ", "は", "かばん", "の", "した", "に", "あります"],
          answer: "くつはかばんのしたにあります。",
          romaji: "Kutsu wa kaban no shita ni arimasu.",
          explanation: "かばんのした gives the position, に marks it as the location, and あります is used for shoes."
        },
        {
          id: "locations-translate-friend",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "ともだちはえきにいます。",
          romaji: "Tomodachi wa eki ni imasu.",
          choices: ["The friend is at the station.", "The friend goes by train.", "There is a station in the bag."],
          answer: "The friend is at the station.",
          explanation: "えきに marks the location, and います is used because the friend is a person."
        }
      ]
    },
    {
      id: "question-words",
      title: "Asking where, what, and who",
      description: "Use どこ for where, なに for what, and だれ for who.",
      note: "Question words stay in the part of the sentence where the answer would normally appear, and か finishes the polite question.",
      helperWords: ["どこ (doko) - where", "なに (nani) - what", "だれ (dare) - who"],
      examples: [
        { id: "grammar-example-question-where-station", japanese: "えきはどこですか。", romaji: "Eki wa doko desu ka.", english: "Where is the station?" },
        { id: "grammar-example-question-what-buy", japanese: "なにをかいますか。", romaji: "Nani o kaimasu ka.", english: "What will you buy?" },
        { id: "grammar-example-question-who-there", japanese: "だれがいますか。", romaji: "Dare ga imasu ka.", english: "Who is there?" }
      ],
      questions: [
        {
          id: "questions-translate-where",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "えきはどこですか。",
          romaji: "Eki wa doko desu ka.",
          choices: ["Where is the station?", "Who is at the station?", "What is a station?"],
          answer: "Where is the station?",
          explanation: "どこ asks where, and か marks the sentence as a question."
        },
        {
          id: "questions-fill-what",
          type: "choice",
          mode: "grammar",
          prompt: "Choose the question word meaning what.",
          japanese: "___ をかいますか。",
          romaji: "___ o kaimasu ka.",
          choices: ["どこ", "なに", "だれ", "ともだち"],
          answer: "なに",
          explanation: "なに means what and is followed by を because it is what will be bought."
        },
        {
          id: "questions-build-where-toilet",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: Where is the toilet?",
          tokens: [
            { text: "です", romaji: "desu" },
            { text: "どこ", romaji: "doko" },
            { text: "トイレ", romaji: "toire" },
            { text: "か", romaji: "ka" },
            { text: "は", romaji: "wa" }
          ],
          answerTokens: ["トイレ", "は", "どこ", "です", "か"],
          answer: "トイレはどこですか。",
          romaji: "Toire wa doko desu ka.",
          explanation: "Set トイレ as the topic, ask its location with どこです, and finish with か."
        },
        {
          id: "questions-translate-who",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "だれがいますか。",
          romaji: "Dare ga imasu ka.",
          choices: ["Who is there?", "Where is the friend?", "What will you buy?"],
          answer: "Who is there?",
          explanation: "だれ asks who, が marks the person whose existence is being asked about, and います is used for people."
        }
      ]
    },
    {
      id: "polite-negatives",
      title: "Polite negative sentences",
      description: "Use じゃありません to make a polite negative noun sentence and ません to make a polite negative action.",
      note: "These are polite non-past negatives. This lesson does not yet teach past tense or a full verb-conjugation system.",
      helperWords: ["じゃありません (ja arimasen) - is not", "ません (masen) - polite negative action ending"],
      examples: [
        { id: "grammar-example-negative-not-book", japanese: "これはほんじゃありません。", romaji: "Kore wa hon ja arimasen.", english: "This is not a book." },
        { id: "grammar-example-negative-not-buy-bread", japanese: "パンをかいません。", romaji: "Pan o kaimasen.", english: "I do not buy bread." },
        { id: "grammar-example-negative-not-speak-japanese", japanese: "にほんごをはなしません。", romaji: "Nihongo o hanashimasen.", english: "I do not speak Japanese." }
      ],
      questions: [
        {
          id: "negatives-translate-not-book",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "これはほんじゃありません。",
          romaji: "Kore wa hon ja arimasen.",
          choices: ["This is not a book.", "This book is mine.", "There is a book."],
          answer: "This is not a book.",
          explanation: "ほんじゃありません politely says that it is not a book."
        },
        {
          id: "negatives-fill-drink",
          type: "choice",
          mode: "grammar",
          prompt: "Choose the polite negative action ending.",
          japanese: "みずをのみ ___。",
          romaji: "Mizu o nomi ___.",
          choices: ["ます", "ません", "です", "あります"],
          answer: "ません",
          explanation: "のみません is the polite negative form used here: do not drink."
        },
        {
          id: "negatives-build-not-go-station",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: I do not go to the station.",
          tokens: [
            { text: "えき", romaji: "eki" },
            { text: "いきません", romaji: "ikimasen" },
            { text: "に", romaji: "ni" }
          ],
          answerTokens: ["えき", "に", "いきません"],
          answer: "えきにいきません。",
          romaji: "Eki ni ikimasen.",
          explanation: "えきに marks the destination, and いきません politely makes the action negative."
        }
      ]
    },
    {
      id: "simple-requests",
      title: "Simple item requests",
      description: "Use a noun with をください to make a simple polite request for an item.",
      note: "This pattern asks for a thing. It is not a general rule for turning every verb into a request.",
      helperWords: ["ください (kudasai) - please give me"],
      examples: [
        { id: "grammar-example-request-water", japanese: "みずをください。", romaji: "Mizu o kudasai.", english: "Water, please." },
        { id: "grammar-example-request-bread", japanese: "パンをください。", romaji: "Pan o kudasai.", english: "Bread, please." },
        { id: "grammar-example-request-ticket", japanese: "きっぷをください。", romaji: "Kippu o kudasai.", english: "A ticket, please." }
      ],
      questions: [
        {
          id: "requests-fill-o",
          type: "choice",
          mode: "particles",
          prompt: "Choose the particle for the requested item.",
          japanese: "おちゃ ___ ください。",
          romaji: "Ocha ___ kudasai.",
          choices: ["は", "が", "を", "に"],
          answer: "を",
          explanation: "を marks おちゃ as the item being requested."
        },
        {
          id: "requests-translate-ticket",
          type: "choice",
          mode: "sentences",
          prompt: "What does this sentence mean?",
          japanese: "きっぷをください。",
          romaji: "Kippu o kudasai.",
          choices: ["A ticket, please.", "Where is the ticket?", "I do not buy a ticket."],
          answer: "A ticket, please.",
          explanation: "きっぷ is the requested item, and をください makes the simple polite request."
        },
        {
          id: "requests-build-coffee",
          type: "assembly",
          mode: "grammar",
          prompt: "Build: Coffee, please.",
          tokens: [
            { text: "ください", romaji: "kudasai" },
            { text: "コーヒー", romaji: "koohii" },
            { text: "を", romaji: "o" }
          ],
          answerTokens: ["コーヒー", "を", "ください"],
          answer: "コーヒーをください。",
          romaji: "Koohii o kudasai.",
          explanation: "Place the requested item first, mark it with を, and finish with ください."
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
