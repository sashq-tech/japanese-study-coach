const lessons = [
  {
    id: "arrival",
    type: "Arrival",
    title: "Landing And Getting Oriented",
    tag: "Airport / train / first day",
    context: "Practice polite, practical phrases for arriving in Japan, asking where to go, and confirming the next step without freezing.",
    phrases: [
      {
        japanese: "すみません、駅はどこですか。",
        kana: "すみません、えきはどこですか。",
        romaji: "Sumimasen, eki wa doko desu ka.",
        english: "Excuse me, where is the station?",
        note: "Safe, polite, and useful almost anywhere."
      },
      {
        japanese: "この切符で大丈夫ですか。",
        kana: "このきっぷでだいじょうぶですか。",
        romaji: "Kono kippu de daijobu desu ka.",
        english: "Is this ticket okay?",
        note: "Good when you want confirmation before boarding."
      },
      {
        japanese: "もう一度お願いします。",
        kana: "もういちどおねがいします。",
        romaji: "Mo ichido onegai shimasu.",
        english: "One more time, please.",
        note: "A core recovery phrase when listening gets fast."
      }
    ],
    builder: {
      prompt: "Build: Excuse me, where is the station?",
      answer: ["すみません", "駅は", "どこですか"],
      distractors: ["いくらですか", "お願いします", "大丈夫です"]
    },
    reviewPrompt: "What is your recovery phrase when someone speaks too quickly?"
  },
  {
    id: "ward-office",
    type: "Move Prep",
    title: "At The Ward Office",
    tag: "Residence / paperwork",
    context: "You will likely need calm, polite language for forms, address registration, and asking what document comes next.",
    phrases: [
      {
        japanese: "住所登録をしたいです。",
        kana: "じゅうしょとうろくをしたいです。",
        romaji: "Jusho toroku o shitai desu.",
        english: "I would like to register my address.",
        note: "Useful for city or ward office procedures."
      },
      {
        japanese: "この書類で足りますか。",
        kana: "このしょるいでたりますか。",
        romaji: "Kono shorui de tarimasu ka.",
        english: "Are these documents enough?",
        note: "A practical way to check requirements."
      },
      {
        japanese: "ゆっくり話していただけますか。",
        kana: "ゆっくりはなしていただけますか。",
        romaji: "Yukkuri hanashite itadakemasu ka.",
        english: "Could you please speak slowly?",
        note: "Polite and important in official settings."
      }
    ],
    builder: {
      prompt: "Build: I would like to register my address.",
      answer: ["住所登録を", "したいです"],
      distractors: ["駅は", "ください", "どこですか"]
    },
    reviewPrompt: "Which official errand worries you most, and what phrase would help you stay calm?"
  },
  {
    id: "family",
    type: "Family",
    title: "Warm Family Conversation",
    tag: "Home / in-laws / everyday",
    context: "Practice gentle phrases that help you participate without trying to sound more advanced than you are.",
    phrases: [
      {
        japanese: "手伝いましょうか。",
        kana: "てつだいましょうか。",
        romaji: "Tetsudaimasho ka.",
        english: "Shall I help?",
        note: "Simple and kind around family or home."
      },
      {
        japanese: "とてもおいしいです。",
        kana: "とてもおいしいです。",
        romaji: "Totemo oishii desu.",
        english: "It is very delicious.",
        note: "Reliable and warm at meals."
      },
      {
        japanese: "日本語をもっと勉強したいです。",
        kana: "にほんごをもっとべんきょうしたいです。",
        romaji: "Nihongo o motto benkyo shitai desu.",
        english: "I want to study Japanese more.",
        note: "A good honest sentence for your current goal."
      }
    ],
    builder: {
      prompt: "Build: Shall I help?",
      answer: ["手伝いましょうか"],
      distractors: ["どこですか", "もう一度", "切符"]
    },
    reviewPrompt: "What is one household phrase you want your wife to help make more natural?"
  }
];
