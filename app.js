const MASTERY_TARGET = 3;
const SPRINT_LENGTH = 12;
const SPRINT_PASS_PERCENT = 80;
const N1_NO_KANJI_LOWER_HOURS = 3000;
const N1_NO_KANJI_UPPER_HOURS = 4800;
const STUDY_MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 1700, 2200, 3000, 4800];
const REVIEW_INTERVAL_DAYS = [0, 1, 3];
const N5_MODE_TARGETS = { vocab: 10, particles: 8, grammar: 8, sentences: 8 };
const BACKUP_VERSION = 1;
const BACKUP_APP_NAMES = ["Japan Ready Coach", "Japanese Study Coach", "Japan Ready Japanese"];
const KANA_ROW_PROGRESS_STORAGE_KEY = "jrj-kana-row-progress";
const KANA_ROW_SELECTION_STORAGE_KEY = "jrj-kana-row-selection";
const VOCAB_PROGRESS_STORAGE_KEY = "jrj-vocab-course-progress";
const VOCAB_SELECTION_STORAGE_KEY = "jrj-vocab-course-selection";
const GRAMMAR_PROGRESS_STORAGE_KEY = "jrj-grammar-course-progress";
const GRAMMAR_SELECTION_STORAGE_KEY = "jrj-grammar-course-selection";
const READING_PROGRESS_STORAGE_KEY = "jrj-reading-progress";
const PROGRESS_STORAGE_KEYS = [
  "jrj-correct",
  "jrj-review",
  "jrj-streak",
  "jrj-foundation-done",
  "jrj-kana-hits",
  "jrj-mastered-kana",
  "jrj-kana-mode",
  KANA_ROW_PROGRESS_STORAGE_KEY,
  KANA_ROW_SELECTION_STORAGE_KEY,
  VOCAB_PROGRESS_STORAGE_KEY,
  VOCAB_SELECTION_STORAGE_KEY,
  GRAMMAR_PROGRESS_STORAGE_KEY,
  GRAMMAR_SELECTION_STORAGE_KEY,
  READING_PROGRESS_STORAGE_KEY,
  "jrj-onboarding-focus",
  "jrj-n5-mode-correct",
  "jrj-last-quiz-key",
  "jrj-n5-sprint-best",
  "jrj-n5-sprint-history",
  "jrj-n5-review-queue",
  "jrj-session-reflection",
  "jrj-mini-session-summary",
  "jrj-study-stats",
  "jrj-study-selected-minutes"
];

localStorage.removeItem("jrj-wife-notes");

function parseStoredJson(key, fallback) {
  const value = localStorage.getItem(key);
  if (value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadKanaHits() {
  const savedHits = parseStoredJson("jrj-kana-hits", null);
  if (savedHits && typeof savedHits === "object" && !Array.isArray(savedHits)) return savedHits;
  const previousMastered = parseStoredJson("jrj-mastered-kana", { hiragana: [], katakana: [] });
  const hits = { hiragana: {}, katakana: {} };
  Object.keys(previousMastered).forEach((deck) => {
    if (!Array.isArray(previousMastered[deck]) || !hits[deck]) return;
    previousMastered[deck].forEach((key) => {
      hits[deck][key] = MASTERY_TARGET;
    });
  });
  return hits;
}

function loadKanaRowProgress(kanaHits) {
  const saved = parseStoredJson(KANA_ROW_PROGRESS_STORAGE_KEY, {});
  return JapanReadyKanaLessons.mergeLegacyHits(saved, kanaHits, n5Content.kanaDecks);
}

function loadKanaRowSelection(progress) {
  const saved = parseStoredJson(KANA_ROW_SELECTION_STORAGE_KEY, {});
  const validDeck = JapanReadyKanaLessons.DECK_ORDER.includes(saved.deck);
  const validRow = JapanReadyKanaLessons.STARTER_ROWS.some((row) => row.id === saved.rowId);
  if (validDeck && validRow
    && JapanReadyKanaLessons.isUnlocked(progress, saved.deck, saved.rowId, n5Content.kanaDecks)
    && !JapanReadyKanaLessons.rowStatus(progress, saved.deck, saved.rowId, n5Content.kanaDecks).complete) {
    return { deck: saved.deck, rowId: saved.rowId };
  }
  return JapanReadyKanaLessons.nextIncomplete(progress, n5Content.kanaDecks)
    || { deck: "katakana", rowId: "final-n" };
}

function loadVocabularyProgress() {
  return JapanReadyVocabularyLessons.normalizeProgress(
    parseStoredJson(VOCAB_PROGRESS_STORAGE_KEY, {}),
    n5Content.n5Vocabulary
  );
}

function loadVocabularySelection(progress) {
  const saved = localStorage.getItem(VOCAB_SELECTION_STORAGE_KEY) || "";
  const valid = JapanReadyVocabularyLessons.UNITS.some((unit) => unit.id === saved)
    && JapanReadyVocabularyLessons.isUnlocked(progress, saved, n5Content.n5Vocabulary);
  return valid
    ? saved
    : JapanReadyVocabularyLessons.nextIncomplete(progress, n5Content.n5Vocabulary)?.id
      || JapanReadyVocabularyLessons.UNITS.at(-1).id;
}

function loadGrammarProgress() {
  return JapanReadyGrammarLessons.normalizeProgress(
    parseStoredJson(GRAMMAR_PROGRESS_STORAGE_KEY, {})
  );
}

function loadGrammarSelection(progress) {
  const saved = localStorage.getItem(GRAMMAR_SELECTION_STORAGE_KEY) || "";
  const valid = JapanReadyGrammarLessons.UNITS.some((unit) => unit.id === saved)
    && JapanReadyGrammarLessons.isUnlocked(progress, saved);
  return valid
    ? saved
    : JapanReadyGrammarLessons.nextIncomplete(progress)?.id
      || JapanReadyGrammarLessons.UNITS.at(-1).id;
}

function loadReadingProgress() {
  const saved = parseStoredJson(READING_PROGRESS_STORAGE_KEY, {});
  const allowed = new Set(readingScenarios.map((scenario) => scenario.id));
  const completed = Array.isArray(saved?.completed)
    ? [...new Set(saved.completed.filter((id) => allowed.has(id)))]
    : [];
  return { completed };
}

function loadModeCorrect() {
  const parsed = parseStoredJson("jrj-n5-mode-correct", {});
  const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return {
    vocab: saved.vocab || 0,
    particles: saved.particles || 0,
    grammar: saved.grammar || 0,
    sentences: saved.sentences || 0
  };
}

function loadStudyStats() {
  const parsed = parseStoredJson("jrj-study-stats", {});
  const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return {
    days: saved.days || {},
    sessions: saved.sessions || []
  };
}

function loadN5ReviewQueue() {
  const saved = parseStoredJson("jrj-n5-review-queue", []);
  return Array.isArray(saved) ? saved : [];
}

function loadSprintHistory() {
  const saved = parseStoredJson("jrj-n5-sprint-history", []);
  if (!Array.isArray(saved)) return [];
  return saved.slice(0, 20).map((attempt) => ({
    completedAt: Number.isNaN(Date.parse(attempt.completedAt)) ? new Date().toISOString() : attempt.completedAt,
    percent: Math.max(0, Math.min(100, Number(attempt.percent) || 0)),
    correct: Math.max(0, Number(attempt.correct) || 0),
    total: Math.max(1, Number(attempt.total) || SPRINT_LENGTH)
  }));
}

function freshSessionReflection() {
  return {
    date: todayKey(),
    practiced: {},
    correct: 0,
    missed: 0,
    weakAreas: {},
    lastActionAt: ""
  };
}

function loadSessionReflection() {
  const parsed = parseStoredJson("jrj-session-reflection", {});
  const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  if (saved.date !== todayKey()) return freshSessionReflection();
  return {
    ...freshSessionReflection(),
    ...saved,
    practiced: saved.practiced || {},
    weakAreas: saved.weakAreas || {}
  };
}

function loadMiniSessionSummary() {
  const saved = parseStoredJson("jrj-mini-session-summary", {});
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
}

const initialKanaHits = loadKanaHits();
const initialKanaRowProgress = loadKanaRowProgress(initialKanaHits);
const initialKanaRowSelection = loadKanaRowSelection(initialKanaRowProgress);
const initialVocabularyProgress = loadVocabularyProgress();
const initialVocabularySelection = loadVocabularySelection(initialVocabularyProgress);
const initialGrammarProgress = loadGrammarProgress();
const initialGrammarSelection = loadGrammarSelection(initialGrammarProgress);
const initialReadingProgress = loadReadingProgress();

const state = {
  deck: "hiragana",
  kanaMode: localStorage.getItem("jrj-kana-mode") || "recognition",
  onboardingFocus: localStorage.getItem("jrj-onboarding-focus") || "",
  quizItem: null,
  n5Mode: "vocab",
  n5Question: null,
  n5ReviewActive: false,
  n5ReviewQueue: loadN5ReviewQueue(),
  typingTarget: null,
  lastQuizKey: localStorage.getItem("jrj-last-quiz-key") || "",
  kanaHits: initialKanaHits,
  kanaRowProgress: initialKanaRowProgress,
  kanaLesson: {
    ...initialKanaRowSelection,
    current: null,
    answered: false,
    renderToken: 0
  },
  vocabularyProgress: initialVocabularyProgress,
  vocabularyCourse: {
    unitId: initialVocabularySelection,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    correct: 0,
    attempts: 0,
    missed: new Set()
  },
  grammarProgress: initialGrammarProgress,
  grammarCourse: {
    unitId: initialGrammarSelection,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    selectedTokens: [],
    correct: 0,
    attempts: 0,
    missed: new Set()
  },
  lessonIndex: 0,
  correct: Number(localStorage.getItem("jrj-correct") || 0),
  review: Number(localStorage.getItem("jrj-review") || 0),
  streak: Number(localStorage.getItem("jrj-streak") || 0),
  n5ModeCorrect: loadModeCorrect(),
  foundationDone: Number(localStorage.getItem("jrj-foundation-done") || 0),
  studyStats: loadStudyStats(),
  selectedStudyMinutes: Number(localStorage.getItem("jrj-study-selected-minutes") || 15),
  studyTimer: {
    durationSeconds: Number(localStorage.getItem("jrj-study-selected-minutes") || 15) * 60,
    remainingSeconds: Number(localStorage.getItem("jrj-study-selected-minutes") || 15) * 60,
    running: false,
    intervalId: null
  },
  sprintBest: Number(localStorage.getItem("jrj-n5-sprint-best") || 0),
  sprintHistory: loadSprintHistory(),
  sprint: {
    active: false,
    complete: false,
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    current: null
  },
  sessionReflection: loadSessionReflection(),
  miniSession: {
    active: false,
    complete: false,
    focus: "",
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    current: null,
    latest: loadMiniSessionSummary()
  },
  reading: {
    scenarioIndex: 0,
    questionIndex: 0,
    answered: false,
    complete: false,
    scenarioCorrect: 0,
    completed: new Set(initialReadingProgress.completed)
  }
};

const els = {
  levelList: document.querySelector("#levelList"),
  readinessScore: document.querySelector("#readinessScore"),
  readinessBar: document.querySelector("#readinessBar"),
  correctCount: document.querySelector("#correctCount"),
  reviewCount: document.querySelector("#reviewCount"),
  streakCount: document.querySelector("#streakCount"),
  roadmapResumeMeta: document.querySelector("#roadmapResumeMeta"),
  roadmapResumeTitle: document.querySelector("#roadmapResumeTitle"),
  roadmapResumeSummary: document.querySelector("#roadmapResumeSummary"),
  roadmapResumeButton: document.querySelector("#roadmapResumeButton"),
  startHereTitle: document.querySelector("#startHereTitle"),
  startHereSummary: document.querySelector("#startHereSummary"),
  startHereActions: document.querySelector("#startHereActions"),
  todayDateLabel: document.querySelector("#todayDateLabel"),
  todaySummary: document.querySelector("#todaySummary"),
  resumeTitle: document.querySelector("#resumeTitle"),
  resumeSummary: document.querySelector("#resumeSummary"),
  resumeStats: document.querySelector("#resumeStats"),
  resumeActionButton: document.querySelector("#resumeActionButton"),
  todayFocusStats: document.querySelector("#todayFocusStats"),
  todayStudySteps: document.querySelector("#todayStudySteps"),
  onboardingStatus: document.querySelector("#onboardingStatus"),
  onboardingSummary: document.querySelector("#onboardingSummary"),
  onboardingChoices: document.querySelector("#onboardingChoices"),
  onboardingRecommendation: document.querySelector("#onboardingRecommendation"),
  onboardingStartButton: document.querySelector("#onboardingStartButton"),
  focusIntroLabel: document.querySelector("#focusIntroLabel"),
  focusIntroTitle: document.querySelector("#focusIntroTitle"),
  focusIntroBody: document.querySelector("#focusIntroBody"),
  focusIntroExamples: document.querySelector("#focusIntroExamples"),
  miniSessionTitle: document.querySelector("#miniSessionTitle"),
  miniSessionStatus: document.querySelector("#miniSessionStatus"),
  miniSessionMeta: document.querySelector("#miniSessionMeta"),
  miniSessionPrompt: document.querySelector("#miniSessionPrompt"),
  miniSessionHint: document.querySelector("#miniSessionHint"),
  miniSessionChoices: document.querySelector("#miniSessionChoices"),
  startMiniSessionButton: document.querySelector("#startMiniSessionButton"),
  nextMiniSessionButton: document.querySelector("#nextMiniSessionButton"),
  miniSessionPracticeButton: document.querySelector("#miniSessionPracticeButton"),
  miniSessionFeedback: document.querySelector("#miniSessionFeedback"),
  reflectionTitle: document.querySelector("#reflectionTitle"),
  reflectionSummary: document.querySelector("#reflectionSummary"),
  reflectionStats: document.querySelector("#reflectionStats"),
  reflectionWeakAreas: document.querySelector("#reflectionWeakAreas"),
  reflectionActionButton: document.querySelector("#reflectionActionButton"),
  quizDeckLabel: document.querySelector("#quizDeckLabel"),
  quizKana: document.querySelector("#quizKana"),
  quizPrompt: document.querySelector("#quizPrompt"),
  quizChoices: document.querySelector("#quizChoices"),
  quizFeedback: document.querySelector("#quizFeedback"),
  deckProgressLabel: document.querySelector("#deckProgressLabel"),
  deckProgressBar: document.querySelector("#deckProgressBar"),
  deckProgressNote: document.querySelector("#deckProgressNote"),
  kanaLessonSetStatus: document.querySelector("#kanaLessonSetStatus"),
  kanaLessonRows: document.querySelector("#kanaLessonRows"),
  kanaLessonMeta: document.querySelector("#kanaLessonMeta"),
  kanaLessonTitle: document.querySelector("#kanaLessonTitle"),
  kanaLessonProgressLabel: document.querySelector("#kanaLessonProgressLabel"),
  kanaLessonProgressBar: document.querySelector("#kanaLessonProgressBar"),
  kanaLessonCardMeta: document.querySelector("#kanaLessonCardMeta"),
  kanaLessonKana: document.querySelector("#kanaLessonKana"),
  kanaLessonPrompt: document.querySelector("#kanaLessonPrompt"),
  kanaLessonChoices: document.querySelector("#kanaLessonChoices"),
  kanaLessonFeedback: document.querySelector("#kanaLessonFeedback"),
  kanaLessonContinue: document.querySelector("#kanaLessonContinue"),
  kanaExtrasDrawer: document.querySelector("#kanaExtrasDrawer"),
  kanaChart: document.querySelector("#kanaChart"),
  toggleChartButton: document.querySelector("#toggleChartButton"),
  kanaWorksheet: document.querySelector("#kanaWorksheet"),
  worksheetStatus: document.querySelector("#worksheetStatus"),
  printWorksheetButton: document.querySelector("#printWorksheetButton"),
  romajiInput: document.querySelector("#romajiInput"),
  hiraganaOutput: document.querySelector("#hiraganaOutput"),
  katakanaOutput: document.querySelector("#katakanaOutput"),
  typingTargetLabel: document.querySelector("#typingTargetLabel"),
  typingFeedback: document.querySelector("#typingFeedback"),
  typingTargets: document.querySelector("#typingTargets"),
  nameInput: document.querySelector("#nameInput"),
  nameConvertButton: document.querySelector("#nameConvertButton"),
  nameResult: document.querySelector("#nameResult"),
  coverageStats: document.querySelector("#coverageStats"),
  vocabCourseStatus: document.querySelector("#vocabCourseStatus"),
  vocabCourseBar: document.querySelector("#vocabCourseBar"),
  vocabCourseCount: document.querySelector("#vocabCourseCount"),
  vocabUnitList: document.querySelector("#vocabUnitList"),
  vocabUnitMeta: document.querySelector("#vocabUnitMeta"),
  vocabUnitTitle: document.querySelector("#vocabUnitTitle"),
  vocabUnitDescription: document.querySelector("#vocabUnitDescription"),
  vocabTeachPanel: document.querySelector("#vocabTeachPanel"),
  vocabStudyList: document.querySelector("#vocabStudyList"),
  startVocabUnitButton: document.querySelector("#startVocabUnitButton"),
  vocabQuizPanel: document.querySelector("#vocabQuizPanel"),
  vocabQuestionMeta: document.querySelector("#vocabQuestionMeta"),
  vocabQuestionText: document.querySelector("#vocabQuestionText"),
  vocabQuestionRomaji: document.querySelector("#vocabQuestionRomaji"),
  vocabChoices: document.querySelector("#vocabChoices"),
  vocabFeedback: document.querySelector("#vocabFeedback"),
  vocabContinueButton: document.querySelector("#vocabContinueButton"),
  grammarCourse: document.querySelector("#grammarCourse"),
  grammarCourseStatus: document.querySelector("#grammarCourseStatus"),
  grammarCourseBar: document.querySelector("#grammarCourseBar"),
  grammarCourseCount: document.querySelector("#grammarCourseCount"),
  grammarUnitList: document.querySelector("#grammarUnitList"),
  grammarTeachPanel: document.querySelector("#grammarTeachPanel"),
  grammarUnitMeta: document.querySelector("#grammarUnitMeta"),
  grammarUnitTitle: document.querySelector("#grammarUnitTitle"),
  grammarUnitDescription: document.querySelector("#grammarUnitDescription"),
  grammarUnitNote: document.querySelector("#grammarUnitNote"),
  grammarExamples: document.querySelector("#grammarExamples"),
  grammarHelperWords: document.querySelector("#grammarHelperWords"),
  startGrammarUnitButton: document.querySelector("#startGrammarUnitButton"),
  grammarQuizPanel: document.querySelector("#grammarQuizPanel"),
  grammarQuestionMeta: document.querySelector("#grammarQuestionMeta"),
  grammarQuestionPrompt: document.querySelector("#grammarQuestionPrompt"),
  grammarQuestionJapanese: document.querySelector("#grammarQuestionJapanese"),
  grammarQuestionRomaji: document.querySelector("#grammarQuestionRomaji"),
  grammarChoices: document.querySelector("#grammarChoices"),
  grammarAssembly: document.querySelector("#grammarAssembly"),
  grammarAssemblyAnswer: document.querySelector("#grammarAssemblyAnswer"),
  grammarTokenBank: document.querySelector("#grammarTokenBank"),
  resetGrammarAssemblyButton: document.querySelector("#resetGrammarAssemblyButton"),
  checkGrammarAssemblyButton: document.querySelector("#checkGrammarAssemblyButton"),
  grammarFeedback: document.querySelector("#grammarFeedback"),
  grammarContinueButton: document.querySelector("#grammarContinueButton"),
  n5PracticeTitle: document.querySelector("#n5PracticeTitle"),
  n5QuestionMeta: document.querySelector("#n5QuestionMeta"),
  n5QuestionText: document.querySelector("#n5QuestionText"),
  n5QuestionHint: document.querySelector("#n5QuestionHint"),
  n5Choices: document.querySelector("#n5Choices"),
  n5Feedback: document.querySelector("#n5Feedback"),
  checkpointStatus: document.querySelector("#checkpointStatus"),
  checkpointBar: document.querySelector("#checkpointBar"),
  checkpointScore: document.querySelector("#checkpointScore"),
  checkpointCriteria: document.querySelector("#checkpointCriteria"),
  sprintStatus: document.querySelector("#sprintStatus"),
  sprintBar: document.querySelector("#sprintBar"),
  sprintScore: document.querySelector("#sprintScore"),
  sprintQuestionMeta: document.querySelector("#sprintQuestionMeta"),
  sprintQuestionText: document.querySelector("#sprintQuestionText"),
  sprintQuestionHint: document.querySelector("#sprintQuestionHint"),
  sprintChoices: document.querySelector("#sprintChoices"),
  sprintFeedback: document.querySelector("#sprintFeedback"),
  sprintHistoryList: document.querySelector("#sprintHistoryList"),
  startSprintButton: document.querySelector("#startSprintButton"),
  nextSprintButton: document.querySelector("#nextSprintButton"),
  clearSprintHistoryButton: document.querySelector("#clearSprintHistoryButton"),
  n5ReviewCount: document.querySelector("#n5ReviewCount"),
  reviewCategoryStats: document.querySelector("#reviewCategoryStats"),
  startReviewButton: document.querySelector("#startReviewButton"),
  clearReviewButton: document.querySelector("#clearReviewButton"),
  exportProgressButton: document.querySelector("#exportProgressButton"),
  importProgressInput: document.querySelector("#importProgressInput"),
  resetLocalDataConfirm: document.querySelector("#resetLocalDataConfirm"),
  resetLocalDataButton: document.querySelector("#resetLocalDataButton"),
  backupStatus: document.querySelector("#backupStatus"),
  studyTimerDisplay: document.querySelector("#studyTimerDisplay"),
  startStudyButton: document.querySelector("#startStudyButton"),
  pauseStudyButton: document.querySelector("#pauseStudyButton"),
  finishStudyButton: document.querySelector("#finishStudyButton"),
  studySessionStatus: document.querySelector("#studySessionStatus"),
  studyDayStreak: document.querySelector("#studyDayStreak"),
  studyDaysCount: document.querySelector("#studyDaysCount"),
  studyHoursCount: document.querySelector("#studyHoursCount"),
  studyTodayCount: document.querySelector("#studyTodayCount"),
  n1HorizonProgress: document.querySelector("#n1HorizonProgress"),
  n1HorizonBar: document.querySelector("#n1HorizonBar"),
  studyMilestoneText: document.querySelector("#studyMilestoneText"),
  vocabList: document.querySelector("#vocabList"),
  particleList: document.querySelector("#particleList"),
  grammarList: document.querySelector("#grammarList"),
  starterPhraseList: document.querySelector("#starterPhraseList"),
  kanjiLaterMessage: document.querySelector("#kanjiLaterMessage"),
  readingSetProgress: document.querySelector("#readingSetProgress"),
  readingScenarioList: document.querySelector("#readingScenarioList"),
  readingScenarioMeta: document.querySelector("#readingScenarioMeta"),
  readingScenarioTitle: document.querySelector("#readingScenarioTitle"),
  readingPassage: document.querySelector("#readingPassage"),
  readingClues: document.querySelector("#readingClues"),
  readingQuestionMeta: document.querySelector("#readingQuestionMeta"),
  readingQuestionText: document.querySelector("#readingQuestionText"),
  readingChoices: document.querySelector("#readingChoices"),
  readingFeedback: document.querySelector("#readingFeedback"),
  nextReadingButton: document.querySelector("#nextReadingButton"),
  missionList: document.querySelector("#missionList"),
  missionType: document.querySelector("#missionType"),
  lessonTitle: document.querySelector("#lessonTitle"),
  lessonContext: document.querySelector("#lessonContext"),
  phraseCards: document.querySelector("#phraseCards")
};

const sidebarProgressDrawer = document.querySelector(".sidebar-progress-drawer");
if (sidebarProgressDrawer && window.matchMedia("(max-width: 980px)").matches) {
  sidebarProgressDrawer.open = false;
}

function syncPressedState(selector, isSelected) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach((button) => {
    const selected = Boolean(isSelected(button));
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  return buttons;
}

const romajiMap = [
  ["kya", "きゃ"], ["kyu", "きゅ"], ["kyo", "きょ"],
  ["sha", "しゃ"], ["shu", "しゅ"], ["sho", "しょ"],
  ["cha", "ちゃ"], ["chu", "ちゅ"], ["cho", "ちょ"],
  ["nya", "にゃ"], ["nyu", "にゅ"], ["nyo", "にょ"],
  ["hya", "ひゃ"], ["hyu", "ひゅ"], ["hyo", "ひょ"],
  ["mya", "みゃ"], ["myu", "みゅ"], ["myo", "みょ"],
  ["rya", "りゃ"], ["ryu", "りゅ"], ["ryo", "りょ"],
  ["gya", "ぎゃ"], ["gyu", "ぎゅ"], ["gyo", "ぎょ"],
  ["ja", "じゃ"], ["ju", "じゅ"], ["jo", "じょ"],
  ["bya", "びゃ"], ["byu", "びゅ"], ["byo", "びょ"],
  ["pya", "ぴゃ"], ["pyu", "ぴゅ"], ["pyo", "ぴょ"],
  ["shi", "し"], ["chi", "ち"], ["tsu", "つ"], ["fu", "ふ"],
  ["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"],
  ["sa", "さ"], ["su", "す"], ["se", "せ"], ["so", "そ"],
  ["ta", "た"], ["te", "て"], ["to", "と"],
  ["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"],
  ["ha", "は"], ["hi", "ひ"], ["he", "へ"], ["ho", "ほ"],
  ["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"],
  ["ya", "や"], ["yu", "ゆ"], ["yo", "よ"],
  ["ra", "ら"], ["ri", "り"], ["ru", "る"], ["re", "れ"], ["ro", "ろ"],
  ["wa", "わ"], ["wo", "を"],
  ["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"],
  ["za", "ざ"], ["ji", "じ"], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
  ["da", "だ"], ["de", "で"], ["do", "ど"],
  ["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"],
  ["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"],
  ["a", "あ"], ["i", "い"], ["u", "う"], ["e", "え"], ["o", "お"], ["n", "ん"]
];

const katakanaPairs = [
  ["あ", "ア"], ["い", "イ"], ["う", "ウ"], ["え", "エ"], ["お", "オ"],
  ["か", "カ"], ["き", "キ"], ["く", "ク"], ["け", "ケ"], ["こ", "コ"],
  ["さ", "サ"], ["し", "シ"], ["す", "ス"], ["せ", "セ"], ["そ", "ソ"],
  ["た", "タ"], ["ち", "チ"], ["つ", "ツ"], ["て", "テ"], ["と", "ト"],
  ["な", "ナ"], ["に", "ニ"], ["ぬ", "ヌ"], ["ね", "ネ"], ["の", "ノ"],
  ["は", "ハ"], ["ひ", "ヒ"], ["ふ", "フ"], ["へ", "ヘ"], ["ほ", "ホ"],
  ["ま", "マ"], ["み", "ミ"], ["む", "ム"], ["め", "メ"], ["も", "モ"],
  ["や", "ヤ"], ["ゆ", "ユ"], ["よ", "ヨ"],
  ["ら", "ラ"], ["り", "リ"], ["る", "ル"], ["れ", "レ"], ["ろ", "ロ"],
  ["わ", "ワ"], ["を", "ヲ"], ["ん", "ン"],
  ["が", "ガ"], ["ぎ", "ギ"], ["ぐ", "グ"], ["げ", "ゲ"], ["ご", "ゴ"],
  ["ざ", "ザ"], ["じ", "ジ"], ["ず", "ズ"], ["ぜ", "ゼ"], ["ぞ", "ゾ"],
  ["だ", "ダ"], ["で", "デ"], ["ど", "ド"],
  ["ば", "バ"], ["び", "ビ"], ["ぶ", "ブ"], ["べ", "ベ"], ["ぼ", "ボ"],
  ["ぱ", "パ"], ["ぴ", "ピ"], ["ぷ", "プ"], ["ぺ", "ペ"], ["ぽ", "ポ"],
  ["ゃ", "ャ"], ["ゅ", "ュ"], ["ょ", "ョ"]
];

function saveProgress() {
  localStorage.setItem("jrj-correct", String(state.correct));
  localStorage.setItem("jrj-review", String(state.review));
  localStorage.setItem("jrj-streak", String(state.streak));
  localStorage.setItem("jrj-foundation-done", String(state.foundationDone));
  localStorage.setItem("jrj-kana-hits", JSON.stringify(state.kanaHits));
  localStorage.setItem("jrj-kana-mode", state.kanaMode);
  localStorage.setItem(KANA_ROW_PROGRESS_STORAGE_KEY, JSON.stringify(state.kanaRowProgress));
  localStorage.setItem(KANA_ROW_SELECTION_STORAGE_KEY, JSON.stringify({
    deck: state.kanaLesson.deck,
    rowId: state.kanaLesson.rowId
  }));
  localStorage.setItem(VOCAB_PROGRESS_STORAGE_KEY, JSON.stringify(state.vocabularyProgress));
  localStorage.setItem(VOCAB_SELECTION_STORAGE_KEY, state.vocabularyCourse.unitId);
  localStorage.setItem(GRAMMAR_PROGRESS_STORAGE_KEY, JSON.stringify(state.grammarProgress));
  localStorage.setItem(GRAMMAR_SELECTION_STORAGE_KEY, state.grammarCourse.unitId);
  localStorage.setItem(READING_PROGRESS_STORAGE_KEY, JSON.stringify({ completed: [...state.reading.completed] }));
  localStorage.setItem("jrj-onboarding-focus", state.onboardingFocus);
  localStorage.setItem("jrj-n5-mode-correct", JSON.stringify(state.n5ModeCorrect));
  localStorage.setItem("jrj-last-quiz-key", state.lastQuizKey);
  localStorage.setItem("jrj-n5-sprint-best", String(state.sprintBest));
  localStorage.setItem("jrj-n5-sprint-history", JSON.stringify(state.sprintHistory));
  localStorage.setItem("jrj-n5-review-queue", JSON.stringify(state.n5ReviewQueue));
  localStorage.setItem("jrj-session-reflection", JSON.stringify(state.sessionReflection));
  localStorage.setItem("jrj-mini-session-summary", JSON.stringify(state.miniSession.latest || {}));
  localStorage.setItem("jrj-study-stats", JSON.stringify(state.studyStats));
  localStorage.setItem("jrj-study-selected-minutes", String(state.selectedStudyMinutes));
}

function collectProgressBackup() {
  const data = {};
  PROGRESS_STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });
  return {
    app: BACKUP_APP_NAMES[0],
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data
  };
}

function exportProgressBackup() {
  saveProgress();
  const backup = collectProgressBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = `japan-ready-coach-progress-${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  els.backupStatus.textContent = "Backup exported.";
  els.backupStatus.className = "feedback success";
}

function applyProgressBackup(backup) {
  if (!backup || !BACKUP_APP_NAMES.includes(backup.app) || !backup.data || typeof backup.data !== "object") {
    throw new Error("This does not look like a Japan Ready Coach progress backup.");
  }
  Object.entries(backup.data).forEach(([key, value]) => {
    if (PROGRESS_STORAGE_KEYS.includes(key) && typeof value === "string") {
      localStorage.setItem(key, value);
    }
  });
}

function importProgressBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const backup = JSON.parse(String(reader.result || "{}"));
      applyProgressBackup(backup);
      els.backupStatus.textContent = "Backup imported. Reloading progress...";
      els.backupStatus.className = "feedback success";
      window.setTimeout(() => window.location.reload(), 650);
    } catch (error) {
      els.backupStatus.textContent = error.message || "Could not import that backup.";
      els.backupStatus.className = "feedback needs-review";
    } finally {
      els.importProgressInput.value = "";
    }
  });
  reader.addEventListener("error", () => {
    els.backupStatus.textContent = "Could not read that backup file.";
    els.backupStatus.className = "feedback needs-review";
    els.importProgressInput.value = "";
  });
  reader.readAsText(file);
}

function resetAllLocalData() {
  if (!els.resetLocalDataConfirm.checked) return;
  const confirmed = window.confirm("Reset all Japan Ready Coach local data in this browser? Export a backup first if you want to keep it.");
  if (!confirmed) return;
  PROGRESS_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  els.backupStatus.textContent = "Local data reset. Reloading clean state...";
  els.backupStatus.className = "feedback success";
  window.setTimeout(() => window.location.reload(), 650);
}

function renderProgress() {
  const quizBonus = Math.min(state.correct * 2, 54);
  const studiedDays = studyDayCount();
  const legacyDays = Math.max(state.foundationDone, studiedDays);
  const dayBonus = Math.min(legacyDays * 8, 40);
  const readiness = Math.min(quizBonus + dayBonus, 100);
  els.readinessScore.textContent = `${readiness}%`;
  els.readinessBar.style.width = `${readiness}%`;
  els.correctCount.textContent = state.correct;
  els.reviewCount.textContent = state.review;
  els.streakCount.textContent = state.streak;
  renderDeckProgress();
  renderRoadmapResume();
  renderCheckpointProgress();
  renderStudyStats();
  renderReviewQueuePanel();
  renderStartHereNudge();
  renderResumeSnapshot();
  renderOnboardingPanel();
  renderTodayStudyPath();
  renderSessionReflection();
}

function todayStudyMinutes() {
  return Math.floor((state.studyStats.days[todayKey()] || 0) / 60);
}

function getWeakestN5Mode() {
  return Object.entries(N5_MODE_TARGETS)
    .map(([mode, target]) => ({
      mode,
      target,
      count: state.n5ModeCorrect[mode] || 0,
      remaining: Math.max(target - (state.n5ModeCorrect[mode] || 0), 0)
    }))
    .filter((item) => item.remaining > 0)
    .sort((a, b) => (b.remaining / b.target) - (a.remaining / a.target))[0] || null;
}

function getNextKanaTask() {
  const hiragana = deckStatsFor("hiragana");
  const katakana = deckStatsFor("katakana");
  if (hiragana.remaining > 0) return { deck: "hiragana", stats: hiragana };
  if (katakana.remaining > 0) return { deck: "katakana", stats: katakana };
  return null;
}

function getNextKanaRowTask() {
  const next = JapanReadyKanaLessons.nextIncomplete(state.kanaRowProgress, n5Content.kanaDecks);
  if (!next) return null;
  const row = JapanReadyKanaLessons.STARTER_ROWS.find((item) => item.id === next.rowId);
  const status = JapanReadyKanaLessons.rowStatus(state.kanaRowProgress, next.deck, next.rowId, n5Content.kanaDecks);
  return { ...next, row, status };
}

function getStructuredN5Task() {
  const vocabularyUnit = JapanReadyVocabularyLessons.nextIncomplete(
    state.vocabularyProgress,
    n5Content.n5Vocabulary
  );
  if (vocabularyUnit) {
    const status = JapanReadyVocabularyLessons.unitStatus(
      state.vocabularyProgress,
      vocabularyUnit.id,
      n5Content.n5Vocabulary
    );
    return {
      step: 2,
      kind: "vocabulary",
      unit: vocabularyUnit,
      unitNumber: JapanReadyVocabularyLessons.UNITS.indexOf(vocabularyUnit) + 1,
      done: state.vocabularyProgress.completed.length,
      total: 50,
      unitDone: status.done,
      unitTotal: status.total,
      action: `vocabulary-course:${vocabularyUnit.id}`
    };
  }

  const grammarUnit = JapanReadyGrammarLessons.nextIncomplete(state.grammarProgress);
  if (grammarUnit) {
    const status = JapanReadyGrammarLessons.unitStatus(state.grammarProgress, grammarUnit.id);
    return {
      step: 3,
      kind: "grammar",
      unit: grammarUnit,
      unitNumber: JapanReadyGrammarLessons.UNITS.indexOf(grammarUnit) + 1,
      done: state.grammarProgress.completed.length,
      total: JapanReadyGrammarLessons.allQuestions().length,
      unitDone: status.done,
      unitTotal: status.total,
      action: `grammar-course:${grammarUnit.id}`
    };
  }

  if (state.reading.completed.size < readingScenarios.length) {
    const nextScenarioIndex = readingScenarios.findIndex((scenario) => !state.reading.completed.has(scenario.id));
    return {
      step: 4,
      kind: "reading",
      done: state.reading.completed.size,
      total: readingScenarios.length,
      scenarioIndex: Math.max(nextScenarioIndex, 0),
      action: "reading-course"
    };
  }
  return null;
}

function getRoadmapResumeState() {
  const rowTask = getNextKanaRowTask();
  if (rowTask) {
    const deckLabel = rowTask.deck === "katakana" ? "Katakana" : "Hiragana";
    return {
      step: 1,
      meta: "Current focus - Step 1 row lesson",
      title: `${deckLabel} ${rowTask.row.label}`,
      summary: `${rowTask.status.done}/${rowTask.status.total} cards complete in this row. Finish each card once, then continue to the next row.`,
      action: `kana-lesson:${rowTask.deck}:${rowTask.rowId}`,
      actionLabel: rowTask.status.done ? "Resume Row" : "Start Row"
    };
  }

  const dueItems = dueReviewItems();
  const dueCount = dueItems.length;
  if (dueCount) {
    const dueMode = dueItems[0]?.mode;
    const reviewStep = dueMode === "vocab"
      ? 2
      : ["particles", "grammar", "sentences"].includes(dueMode)
        ? 3
        : 1;
    return {
      step: reviewStep,
      meta: "Current focus - review first",
      title: "Review due weak items",
      summary: `${dueCount} local review item${dueCount === 1 ? "" : "s"} due before adding more new material.`,
      action: "review",
      actionLabel: "Review Due"
    };
  }

  const hiragana = deckStatsFor("hiragana");
  const katakana = deckStatsFor("katakana");
  const kanaTask = getNextKanaTask();
  const hasUsefulProgress = state.correct > 0
    || state.review > 0
    || studyDayCount() > 0
    || hiragana.mastered > 0
    || katakana.mastered > 0
    || Object.values(state.n5ModeCorrect).some((count) => count > 0);

  if (kanaTask || !hasUsefulProgress) {
    const deck = kanaTask?.deck || "hiragana";
    const stats = kanaTask?.stats || hiragana;
    return {
      step: 1,
      meta: hasUsefulProgress ? "Current focus - Step 1" : "Start here - Step 1",
      title: `${deck === "katakana" ? "Katakana" : "Hiragana"} and kana confidence`,
      summary: hasUsefulProgress
        ? `${stats.mastered}/${stats.total} mastered in this deck. Keep the first lap focused on kana before kanji.`
        : "No saved study progress found in this browser yet. Start with hiragana recognition.",
      action: `kana:${deck}`,
      actionLabel: hasUsefulProgress ? "Resume Kana" : "Start Step 1"
    };
  }

  const structuredTask = getStructuredN5Task();
  if (structuredTask?.kind === "vocabulary") {
    return {
      step: 2,
      meta: `Current focus - Step 2, Unit ${structuredTask.unitNumber}`,
      title: structuredTask.unit.title,
      summary: `${structuredTask.done}/50 unique starter words complete; ${structuredTask.unitDone}/${structuredTask.unitTotal} complete in this unit. This is the first block toward the larger vocabulary roadmap.`,
      action: structuredTask.action,
      actionLabel: structuredTask.unitDone ? "Resume Unit" : "Start Unit"
    };
  }

  if (structuredTask?.kind === "grammar") {
    return {
      step: 3,
      meta: `Current focus - Step 3, Lesson ${structuredTask.unitNumber}`,
      title: structuredTask.unit.title,
      summary: `${structuredTask.done}/${structuredTask.total} guided checks complete; ${structuredTask.unitDone}/${structuredTask.unitTotal} complete in this lesson. This is the first grammar block, not the full planned sentence path.`,
      action: structuredTask.action,
      actionLabel: structuredTask.unitDone ? "Resume Lesson" : "Start Lesson"
    };
  }

  if (structuredTask?.kind === "reading") {
    const scenario = readingScenarios[structuredTask.scenarioIndex];
    return {
      step: 4,
      meta: `Current focus - Step 4, Scene ${structuredTask.scenarioIndex + 1}`,
      title: "Hiragana reading for understanding",
      summary: `${structuredTask.done}/${structuredTask.total} scenes passed. Read ${scenario.title}, then answer both questions correctly to complete it.`,
      action: structuredTask.action,
      actionLabel: structuredTask.done ? "Resume Reading" : "Start Reading"
    };
  }

  return {
    step: 5,
    meta: "Next focus - Step 5",
    title: "Kanji is next on the roadmap",
    summary: "The first reviewed kanji lessons are the next content layer. Use the checkpoint while that course is prepared.",
    action: "checkpoint",
    actionLabel: "Open Checkpoint"
  };
}

function renderRoadmapResume() {
  if (!els.roadmapResumeTitle) return;
  const focus = getRoadmapResumeState();
  els.roadmapResumeMeta.textContent = focus.meta;
  els.roadmapResumeTitle.textContent = focus.title;
  els.roadmapResumeSummary.textContent = focus.summary;
  els.roadmapResumeButton.textContent = focus.actionLabel;
  els.roadmapResumeButton.dataset.roadmapAction = focus.action;
  document.querySelectorAll("[data-roadmap-step]").forEach((step) => {
    const stepNumber = Number(step.dataset.roadmapStep);
    step.classList.toggle("current", stepNumber === focus.step);
    step.classList.toggle("complete", stepNumber < focus.step);
  });
}

function n5ModeLabel(mode) {
  return {
    vocab: "vocabulary",
    particles: "particles",
    grammar: "grammar",
    sentences: "sentences"
  }[mode] || "N5";
}

function simpleHash(text) {
  return [...text].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 7);
}

function dailyPick(list, salt) {
  if (!list.length) return null;
  return list[simpleHash(`${todayKey()}:${salt}`) % list.length];
}

function getN5ModeDepth(mode) {
  const guidedVocabulary = availableVocabularyWords();
  const modeCounts = {
    vocab: guidedVocabulary.length,
    particles: n5Content.particlePractice.length,
    grammar: n5Content.grammarPractice.length,
    sentences: n5Content.sentencePractice.length
  };
  const supportingCounts = {
    vocab: `${new Set(guidedVocabulary.map((item) => item.category)).size} guided categories`,
    particles: `${n5Content.particles.length} particles`,
    grammar: `${n5Content.grammarPatterns.length} patterns`,
    sentences: `${n5Content.starterPhrases.length} starter phrases`
  };
  return {
    mode,
    label: n5ModeLabel(mode),
    count: modeCounts[mode] || 0,
    support: supportingCounts[mode] || "practice pool"
  };
}

function getTodayFocusExample(mode) {
  if (mode === "vocab") {
    const item = dailyPick(availableVocabularyWords(), mode);
    return item ? `${item.japanese} (${item.romaji}) - ${item.english}` : "";
  }
  if (mode === "particles") {
    const item = dailyPick(n5Content.particlePractice, mode);
    return item ? `${item.prompt} -> ${item.answer}` : "";
  }
  if (mode === "grammar") {
    const item = dailyPick(n5Content.grammarPractice, mode);
    return item ? item.prompt : "";
  }
  const item = dailyPick(n5Content.sentencePractice, mode);
  return item ? item.prompt : "";
}

function n5ModeProgress(mode) {
  const target = N5_MODE_TARGETS[mode] || 1;
  const count = state.n5ModeCorrect[mode] || 0;
  return {
    mode,
    count,
    target,
    complete: count >= target,
    percent: Math.min(Math.round((count / target) * 100), 100),
    depth: getN5ModeDepth(mode)
  };
}

function buildTodayStudyPath() {
  const steps = [];
  const dueCount = dueReviewItems().length;
  const kanaTask = getNextKanaTask();
  const n5Task = getWeakestN5Mode();
  const structuredN5Task = getStructuredN5Task();
  const criteria = getCheckpointCriteria();
  const completeCriteria = criteria.filter((item) => item.complete).length;
  const todayMinutes = todayStudyMinutes();

  steps.push({
    key: "review",
    label: "Warm up",
    title: dueCount ? "Review due weak items" : "Review pile is quiet",
    detail: dueCount ? `${dueCount} item${dueCount === 1 ? "" : "s"} due now.` : "No weak items are due right now.",
    action: "review",
    actionLabel: dueCount ? "Review Due" : "Done",
    complete: dueCount === 0
  });

  steps.push({
    key: "kana",
    label: "Kana",
    title: kanaTask ? `Continue ${kanaTask.deck}` : "Kana decks complete",
    detail: kanaTask
      ? `${kanaTask.stats.remaining} left. Aim for 5-10 solid answers.`
      : "Both hiragana and katakana are mastered for this pass.",
    action: kanaTask ? `kana:${kanaTask.deck}` : "kana",
    actionLabel: kanaTask ? "Practice Kana" : "Done",
    complete: !kanaTask
  });

  steps.push({
    key: "n5",
    label: "N5 focus",
    title: structuredN5Task?.kind === "reading"
      ? "Hiragana reading"
      : structuredN5Task?.unit?.title || "Guided starter blocks complete",
    detail: structuredN5Task
      ? structuredN5Task.kind === "reading"
        ? `${structuredN5Task.done}/${structuredN5Task.total} scenes passed; the next reading check is ready.`
        : `${structuredN5Task.done}/${structuredN5Task.total} complete in the ${structuredN5Task.kind} block; lesson ${structuredN5Task.unitNumber} is next.`
      : n5Task
        ? `Guided blocks are clear. Optional ${n5ModeLabel(n5Task.mode)} practice remains available.`
        : "The first guided vocabulary and grammar blocks are complete.",
    action: structuredN5Task?.action || "n5",
    actionLabel: structuredN5Task ? "Continue Path" : "Done",
    complete: !structuredN5Task
  });

  steps.push({
    key: "checkpoint",
    label: "Checkpoint",
    title: state.sprintBest >= SPRINT_PASS_PERCENT ? "Sprint passed" : "N5 sprint when ready",
    detail: state.sprintBest >= SPRINT_PASS_PERCENT
      ? `Best score: ${state.sprintBest}%.`
      : `${completeCriteria} / ${criteria.length} checkpoint items complete.`,
    action: "checkpoint",
    actionLabel: state.sprintBest >= SPRINT_PASS_PERCENT ? "Review Status" : "Open Sprint",
    complete: state.sprintBest >= SPRINT_PASS_PERCENT
  });

  steps.push({
    key: "timer",
    label: "Habit",
    title: todayMinutes ? "Study time logged" : "Log 15 minutes",
    detail: todayMinutes ? `${todayMinutes} minute${todayMinutes === 1 ? "" : "s"} logged today.` : "Start a short timer to keep the streak alive.",
    action: "timer",
    actionLabel: todayMinutes ? "Logged" : "Start Timer",
    complete: todayMinutes > 0
  });

  return steps;
}

function renderTodayStudyPath() {
  if (!els.todayStudySteps) return;
  const steps = buildTodayStudyPath();
  const focusMode = getWeakestN5Mode()?.mode || "sentences";
  const modes = Object.keys(N5_MODE_TARGETS).map(n5ModeProgress);
  const openCount = steps.filter((step) => !step.complete).length;
  els.todayDateLabel.textContent = new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  els.todaySummary.textContent = openCount
    ? `${openCount} suggested step${openCount === 1 ? "" : "s"} left for today's N5 session.`
    : "Today's foundation loop is clear. Great place to stop or do a light extra sprint.";
  els.todayFocusStats.innerHTML = modes.map((item) => `
    <button class="${item.mode === focusMode ? "active" : ""}" type="button" data-today-action="n5:${item.mode}">
      <span>${item.depth.label}</span>
      <strong>${item.count}/${item.target}</strong>
      <em>${item.depth.count} ${item.mode === "vocab" ? "cards" : "checks"} - ${item.depth.support}</em>
    </button>
  `).join("");
  els.todayStudySteps.innerHTML = steps.map((step) => `
    <section class="today-step ${step.complete ? "complete" : ""}">
      <span>${step.label}</span>
      <strong>${step.title}</strong>
      <p>${step.detail}</p>
      <button type="button" data-today-action="${step.action}" ${step.complete && step.action !== "checkpoint" ? "disabled" : ""}>${step.actionLabel}</button>
    </section>
  `).join("");
}

function buildStartHereActions() {
  const dueCount = dueReviewItems().length;
  const focus = activeOnboardingFocus();
  const focusLabel = onboardingOptions().find((option) => option.key === focus)?.label || "Hiragana";
  const kanaTask = getNextKanaTask();
  const n5Task = getWeakestN5Mode();
  const structuredN5Task = getStructuredN5Task();
  const structuredTitle = structuredN5Task?.kind === "reading"
    ? "Hiragana reading"
    : structuredN5Task?.unit?.title || "N5 starter checks";
  return [
    {
      key: "mini",
      label: "Fast start",
      title: `${focusLabel} mini-session`,
      detail: "Intro plus five guided questions.",
      action: "mini-session",
      recommended: !dueCount && !kanaTask && !n5Task
    },
    {
      key: "kana",
      label: "Kana",
      title: kanaTask ? `Practice ${kanaTask.deck}` : "Kana refresher",
      detail: kanaTask ? `${kanaTask.stats.remaining} characters left in this deck.` : "Both kana decks are complete for this pass.",
      action: kanaTask ? `kana:${kanaTask.deck}` : "kana:hiragana",
      recommended: !dueCount && !!kanaTask
    },
    {
      key: "review",
      label: "Review",
      title: dueCount ? "Clear due items" : "Review pile is quiet",
      detail: dueCount ? `${dueCount} weak item${dueCount === 1 ? "" : "s"} due now.` : "No weak items are due right now.",
      action: dueCount ? "review" : "checkpoint",
      recommended: dueCount > 0
    },
    {
      key: "n5",
      label: "N5",
      title: structuredN5Task ? structuredTitle : n5Task ? `Build ${n5ModeLabel(n5Task.mode)}` : "N5 starter checks",
      detail: structuredN5Task
        ? `${structuredN5Task.done}/${structuredN5Task.total} complete in the guided ${structuredN5Task.kind} block.`
        : n5Task ? `${n5Task.count}/${n5Task.target} toward the optional practice target.` : "Starter N5 targets are ready for sprint review.",
      action: structuredN5Task?.action || (n5Task ? `n5:${n5Task.mode}` : "checkpoint"),
      recommended: !dueCount && !kanaTask
    }
  ];
}

function renderStartHereNudge() {
  if (!els.startHereActions) return;
  const actions = buildStartHereActions();
  const recommended = actions.find((item) => item.recommended) || actions[0];
  els.startHereTitle.textContent = `Start with ${recommended.title}.`;
  els.startHereSummary.textContent = "One tap is enough: guided warm-up, kana, review, or N5 basics.";
  els.startHereActions.innerHTML = actions.map((item) => `
    <button class="${item.key === recommended.key ? "recommended" : ""}" type="button" data-start-action="${item.action}">
      <span>${item.label}</span>
      <strong>${item.title}</strong>
      <em>${item.detail}</em>
    </button>
  `).join("");
}

function latestStudySession() {
  return [...(state.studyStats.sessions || [])].sort((a, b) => {
    return Date.parse(b.completedAt || 0) - Date.parse(a.completedAt || 0);
  })[0] || null;
}

function formatShortDate(isoDate) {
  if (!isoDate || Number.isNaN(Date.parse(isoDate))) return "Not yet";
  return new Date(isoDate).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderResumeSnapshot() {
  if (!els.resumeTitle) return;
  const lastStudy = latestStudySession();
  const latestMini = state.miniSession.latest || {};
  const latestSprint = state.sprintHistory[0] || null;
  const dueCount = dueReviewItems().length;
  const focus = activeOnboardingFocus();
  const focusLabel = onboardingOptions().find((option) => option.key === focus)?.label || "Hiragana";
  const next = getReflectionNextAction();
  const totalHours = totalStudySeconds() / 3600;
  const hasAnyProgress = state.correct > 0 || state.review > 0 || lastStudy || latestMini.completedAt || latestSprint;

  els.resumeTitle.textContent = hasAnyProgress
    ? `Continue ${focusLabel}`
    : "Start with a short beginner session.";
  els.resumeSummary.textContent = hasAnyProgress
    ? `Last study: ${lastStudy ? `${lastStudy.minutes} min on ${formatShortDate(lastStudy.completedAt)}` : "no timer logged yet"}.`
    : "No account needed. Your progress starts and stays in this browser.";
  els.resumeStats.innerHTML = [
    { label: "Due review", value: dueCount },
    { label: "Total hours", value: totalHours.toFixed(1) },
    { label: "Mini-session", value: latestMini.completedAt ? `${latestMini.correct}/${latestMini.total}` : "Not yet" },
    { label: "Sprint best", value: `${state.sprintBest}%` }
  ].map((item) => `
    <span><strong>${item.value}</strong>${item.label}</span>
  `).join("");
  els.resumeActionButton.textContent = next.label;
  els.resumeActionButton.dataset.todayAction = next.action;
}

function onboardingOptions() {
  return [
    {
      key: "hiragana",
      label: "Hiragana",
      title: "I need the first kana lap",
      detail: "Best if Japanese characters still feel slow or unfamiliar.",
      action: "kana:hiragana"
    },
    {
      key: "katakana",
      label: "Katakana",
      title: "I know some hiragana",
      detail: "Good when foreign words and names are the next gap.",
      action: "kana:katakana"
    },
    {
      key: "n5",
      label: "N5 basics",
      title: "I can read basic kana",
      detail: "Start vocabulary, particles, grammar, and sentence checks.",
      action: "n5:vocab"
    }
  ];
}

function focusIntroFor(focus) {
  const intros = {
    hiragana: {
      label: "Tiny hiragana lesson",
      title: "Hiragana is the first sound map.",
      body: "Start by matching one character to one sound. Do not worry about speed yet; the goal is to make the symbols feel familiar.",
      examples: [
        { japanese: "あ", romaji: "a", english: "as in a simple open sound" },
        { japanese: "か", romaji: "ka", english: "k + a" },
        { japanese: "さ", romaji: "sa", english: "s + a" }
      ]
    },
    katakana: {
      label: "Tiny katakana lesson",
      title: "Katakana is for many foreign words and names.",
      body: "It uses the same basic sounds as hiragana, but the shapes are different. This is why names like Sean or loanwords use katakana.",
      examples: [
        { japanese: "ア", romaji: "a", english: "same sound as あ" },
        { japanese: "カ", romaji: "ka", english: "same sound as か" },
        { japanese: "コンビニ", romaji: "konbini", english: "convenience store" }
      ]
    },
    n5: {
      label: "Tiny N5 lesson",
      title: "N5 starts with useful words and sentence glue.",
      body: "After kana starts to click, build small meaning chunks: one word, one particle, one sentence pattern. Keep it short and repeatable.",
      examples: [
        { japanese: "わたし", romaji: "watashi", english: "I / me" },
        { japanese: "は", romaji: "wa", english: "topic marker" },
        { japanese: "です", romaji: "desu", english: "is / am / are" }
      ]
    }
  };
  return intros[focus] || intros.hiragana;
}

function recommendedOnboardingFocus() {
  const hiragana = deckStatsFor("hiragana");
  const katakana = deckStatsFor("katakana");
  if (hiragana.remaining > 0) return "hiragana";
  if (katakana.remaining > 0) return "katakana";
  return "n5";
}

function activeOnboardingFocus() {
  const allowed = onboardingOptions().map((option) => option.key);
  return allowed.includes(state.onboardingFocus) ? state.onboardingFocus : recommendedOnboardingFocus();
}

function renderOnboardingPanel() {
  if (!els.onboardingChoices) return;
  const recommended = recommendedOnboardingFocus();
  const active = activeOnboardingFocus();
  const selected = onboardingOptions().find((option) => option.key === active);
  const hiragana = deckStatsFor("hiragana");
  const katakana = deckStatsFor("katakana");
  const n5Task = getWeakestN5Mode();
  const hasProgress = state.correct > 0 || studyDayCount() > 0 || hiragana.mastered > 0 || katakana.mastered > 0;

  els.onboardingStatus.textContent = hasProgress ? "Calibrated" : "First run";
  els.onboardingSummary.textContent = hasProgress
    ? `Current foundation: hiragana ${hiragana.mastered}/${hiragana.total}, katakana ${katakana.mastered}/${katakana.total}, N5 ${n5Task ? "still building" : "starter checks ready"}.`
    : "Start with kana recognition, then move into N5 basics when the sounds feel familiar.";
  els.onboardingRecommendation.textContent = `Recommended: ${onboardingOptions().find((option) => option.key === recommended).label}.`;
  els.onboardingStartButton.textContent = selected ? `Start ${selected.label}` : "Start Today's Path";
  const intro = focusIntroFor(active);
  els.focusIntroLabel.textContent = intro.label;
  els.focusIntroTitle.textContent = intro.title;
  els.focusIntroBody.textContent = intro.body;
  els.focusIntroExamples.innerHTML = intro.examples.map((example) => `
    <section>
      <strong lang="ja">${example.japanese}</strong>
      <span>${example.romaji}</span>
      <p>${example.english}</p>
    </section>
  `).join("");
  els.onboardingChoices.innerHTML = onboardingOptions().map((option) => `
    <button class="${option.key === active ? "active" : ""}" type="button" data-onboarding-focus="${option.key}" aria-pressed="${option.key === active}">
      <span>${option.label}</span>
      <strong>${option.title}</strong>
      <em>${option.detail}</em>
    </button>
  `).join("");
}

function setOnboardingFocus(focus) {
  state.onboardingFocus = focus;
  state.miniSession = {
    ...state.miniSession,
    active: false,
    complete: false,
    focus,
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    current: null
  };
  saveProgress();
  renderOnboardingPanel();
  renderMiniSession();
}

function startOnboardingFocus() {
  const selected = onboardingOptions().find((option) => option.key === activeOnboardingFocus());
  if (!selected) return;
  runTodayAction(selected.action);
}

function makeMiniKanaQuestion(focus, item) {
  const deck = n5Content.kanaDecks[focus];
  const wrong = sample(deck.filter((candidate) => candidate.kana !== item.kana), 3);
  return {
    mode: focus,
    meta: `${focus} recognition`,
    prompt: item.kana,
    hint: "Choose the matching sound.",
    answer: item.romaji,
    choices: sample([item.romaji, ...wrong.map((candidate) => candidate.romaji)], 4),
    explanation: `${item.kana} is ${item.romaji}.`
  };
}

function buildMiniSessionQuestions(focus) {
  if (focus === "hiragana" || focus === "katakana") {
    return sample(n5Content.kanaDecks[focus], 5).map((item) => makeMiniKanaQuestion(focus, item));
  }
  return ["vocab", "vocab", "particles", "grammar", "sentences"].map(makeSprintQuestion);
}

function renderMiniSession() {
  if (!els.miniSessionTitle) return;
  const focus = activeOnboardingFocus();
  const selected = onboardingOptions().find((option) => option.key === focus);
  const total = state.miniSession.questions.length || 5;
  els.miniSessionTitle.textContent = `${selected?.label || "Focus"} mini-session`;
  els.miniSessionPracticeButton.dataset.todayAction = selected?.action || "kana:hiragana";
  if (!state.miniSession.active && !state.miniSession.complete) {
    const latest = state.miniSession.latest?.focus === focus ? state.miniSession.latest : null;
    els.miniSessionStatus.textContent = latest ? `Last: ${latest.correct}/${latest.total}` : "Ready";
    els.miniSessionMeta.textContent = "Intro -> 5 questions -> reflection";
    els.miniSessionPrompt.textContent = "Start a short guided run when you are ready.";
    els.miniSessionHint.textContent = latest
      ? `Last run: ${latest.correct}/${latest.total} correct. Try another small pass when ready.`
      : "This uses the focus above and feeds your daily reflection.";
    els.miniSessionChoices.innerHTML = "";
    els.miniSessionFeedback.textContent = "";
    els.miniSessionFeedback.className = "feedback";
    els.startMiniSessionButton.textContent = latest ? "Run Again" : "Start Mini-Session";
    els.nextMiniSessionButton.disabled = true;
    return;
  }
  if (state.miniSession.complete) {
    const percent = Math.round((state.miniSession.correct / total) * 100);
    els.miniSessionStatus.textContent = "Complete";
    els.miniSessionMeta.textContent = "Mini-session reflection";
    els.miniSessionPrompt.textContent = `${state.miniSession.correct}/${total} correct`;
    els.miniSessionHint.textContent = percent >= 80
      ? "Nice. Keep the momentum with the full practice loop."
      : "Good warm-up. Review the shaky spots, then try the focus again.";
    els.miniSessionChoices.innerHTML = "";
    els.miniSessionFeedback.textContent = percent >= 80
      ? "Confidence pass complete. Your daily reflection has been updated."
      : "Reflection updated. The next action will steer you toward the weak area.";
    els.miniSessionFeedback.className = percent >= 80 ? "feedback success" : "feedback needs-review";
    els.startMiniSessionButton.textContent = "Run Again";
    els.nextMiniSessionButton.disabled = true;
    return;
  }
  const question = state.miniSession.current;
  if (!question) return;
  els.miniSessionStatus.textContent = `Question ${state.miniSession.index + 1}/${total}`;
  els.miniSessionMeta.textContent = question.meta;
  els.miniSessionPrompt.textContent = question.prompt;
  els.miniSessionHint.textContent = question.hint;
  els.miniSessionFeedback.textContent = "";
  els.miniSessionFeedback.className = "feedback";
  els.miniSessionChoices.innerHTML = question.choices.map((choice) => `
    <button type="button" data-mini-answer="${choice}">${choice}</button>
  `).join("");
  els.startMiniSessionButton.textContent = "Restart";
  els.nextMiniSessionButton.disabled = true;
}

function startMiniSession() {
  const focus = activeOnboardingFocus();
  const questions = buildMiniSessionQuestions(focus);
  state.miniSession = {
    ...state.miniSession,
    active: true,
    complete: false,
    focus,
    questions,
    index: 0,
    correct: 0,
    answered: false,
    current: questions[0]
  };
  renderMiniSession();
}

function finishMiniSession() {
  state.miniSession.active = false;
  state.miniSession.complete = true;
  state.miniSession.latest = {
    focus: state.miniSession.focus,
    correct: state.miniSession.correct,
    total: state.miniSession.questions.length,
    completedAt: new Date().toISOString()
  };
  saveProgress();
  renderProgress();
  renderMiniSession();
}

function checkMiniSessionAnswer(answer) {
  const question = state.miniSession.current;
  if (!question || state.miniSession.answered) return;
  state.miniSession.answered = true;
  els.miniSessionChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  if (answer === question.answer) {
    state.correct += 1;
    state.streak += 1;
    state.miniSession.correct += 1;
    recordPracticeEvent("guided", `guided ${question.mode}`, true);
    els.miniSessionFeedback.textContent = `Correct. ${question.explanation}`;
    els.miniSessionFeedback.className = "feedback success";
  } else {
    state.review += 1;
    state.streak = 0;
    recordPracticeEvent("guided", `guided ${question.mode}`, false);
    if (["vocab", "particles", "grammar", "sentences"].includes(question.mode)) {
      addReviewQuestion(question);
    }
    els.miniSessionFeedback.textContent = `Review this: ${question.explanation}`;
    els.miniSessionFeedback.className = "feedback needs-review";
  }
  els.nextMiniSessionButton.disabled = false;
  saveProgress();
  renderProgress();
}

function nextMiniSessionQuestion() {
  if (!state.miniSession.active || !state.miniSession.answered) return;
  if (state.miniSession.index >= state.miniSession.questions.length - 1) {
    finishMiniSession();
    return;
  }
  state.miniSession.index += 1;
  state.miniSession.answered = false;
  state.miniSession.current = state.miniSession.questions[state.miniSession.index];
  renderMiniSession();
}

function recordPracticeEvent(area, detail, wasCorrect) {
  if (state.sessionReflection.date !== todayKey()) {
    state.sessionReflection = freshSessionReflection();
  }
  const label = detail || area;
  state.sessionReflection.practiced[label] = (state.sessionReflection.practiced[label] || 0) + 1;
  if (wasCorrect) {
    state.sessionReflection.correct += 1;
  } else {
    state.sessionReflection.missed += 1;
    state.sessionReflection.weakAreas[label] = (state.sessionReflection.weakAreas[label] || 0) + 1;
  }
  state.sessionReflection.lastActionAt = new Date().toISOString();
}

function getReflectionNextAction() {
  const dueCount = dueReviewItems().length;
  if (dueCount) return { label: "Review weak items", action: "review" };
  const weakest = Object.entries(state.sessionReflection.weakAreas || {})
    .sort((a, b) => b[1] - a[1])[0];
  if (weakest) {
    const mode = ["vocab", "particles", "grammar", "sentences"].find((item) => weakest[0].includes(item));
    if (mode) return { label: `Practice ${n5ModeLabel(mode)}`, action: `n5:${mode}` };
    if (weakest[0].includes("kana")) {
      const deck = weakest[0].includes("katakana") ? "katakana" : "hiragana";
      return { label: "Practice kana", action: `kana:${deck}` };
    }
  }
  const n5Task = getWeakestN5Mode();
  if (n5Task) return { label: `Build ${n5ModeLabel(n5Task.mode)}`, action: `n5:${n5Task.mode}` };
  if (!todayStudyMinutes()) return { label: "Start timer", action: "timer" };
  return { label: "Open checkpoint", action: "checkpoint" };
}

function renderSessionReflection() {
  if (!els.reflectionTitle) return;
  if (state.sessionReflection.date !== todayKey()) {
    state.sessionReflection = freshSessionReflection();
  }
  const practicedEntries = Object.entries(state.sessionReflection.practiced || {});
  const total = state.sessionReflection.correct + state.sessionReflection.missed;
  const accuracy = total ? Math.round((state.sessionReflection.correct / total) * 100) : 0;
  const practicedText = practicedEntries.length
    ? practicedEntries.map(([label, count]) => `${label}: ${count}`).join(", ")
    : "No practice logged yet.";
  const weakEntries = Object.entries(state.sessionReflection.weakAreas || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const next = getReflectionNextAction();
  els.reflectionTitle.textContent = total
    ? `${total} question${total === 1 ? "" : "s"} practiced today`
    : "Practice a few questions to build a summary.";
  els.reflectionSummary.textContent = total
    ? `Practiced: ${practicedText}`
    : "This will show what you practiced today, weak areas, and the next best action.";
  els.reflectionStats.innerHTML = [
    { label: "Correct", value: state.sessionReflection.correct },
    { label: "Review", value: state.sessionReflection.missed },
    { label: "Accuracy", value: total ? `${accuracy}%` : "0%" }
  ].map((item) => `
    <span><strong>${item.value}</strong>${item.label}</span>
  `).join("");
  els.reflectionWeakAreas.innerHTML = weakEntries.length
    ? weakEntries.map(([label, count]) => `<span>${label}<strong>${count}</strong></span>`).join("")
    : '<span>No weak area logged yet<strong>0</strong></span>';
  els.reflectionActionButton.textContent = next.label;
  els.reflectionActionButton.dataset.todayAction = next.action;
}

function renderLevels() {
  els.levelList.innerHTML = n5Content.levels.map((level) => {
    const isActive = level.status === "active";
    return `
    <button class="level-button ${level.status}" type="button" ${isActive ? 'data-level-target="kanaSection"' : 'disabled aria-disabled="true"'}>
      <span>${level.label}</span>
      <strong>${isActive ? "Start here" : "Locked for later"}</strong>
      <em>${level.description}</em>
    </button>
  `;
  }).join("");
}

function sample(list, count) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

function todayKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

function secondsToClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function studyDayCount() {
  return Object.keys(state.studyStats.days).length;
}

function totalStudySeconds() {
  return Object.values(state.studyStats.days).reduce((total, seconds) => total + seconds, 0);
}

function consecutiveStudyDays() {
  const studied = new Set(Object.keys(state.studyStats.days));
  if (!studied.size) return 0;
  let cursor = new Date();
  if (!studied.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!studied.has(todayKey(cursor))) return 0;
  }
  let streak = 0;
  while (studied.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function nextStudyMilestone(hours) {
  return STUDY_MILESTONES.find((milestone) => hours < milestone) || STUDY_MILESTONES[STUDY_MILESTONES.length - 1];
}

function renderStudyStats() {
  if (!els.studyTimerDisplay) return;
  const totalSeconds = totalStudySeconds();
  const todaySeconds = state.studyStats.days[todayKey()] || 0;
  const days = studyDayCount();
  const hours = totalSeconds / 3600;
  const streak = consecutiveStudyDays();
  const horizonPercent = Math.min((hours / N1_NO_KANJI_LOWER_HOURS) * 100, 100);
  const nextMilestone = nextStudyMilestone(hours);
  const remainingToMilestone = Math.max(0, nextMilestone - hours);
  els.studyTimerDisplay.textContent = secondsToClock(state.studyTimer.remainingSeconds);
  els.studyDayStreak.textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
  els.studyDaysCount.textContent = days;
  els.studyHoursCount.textContent = hours.toFixed(1);
  els.studyTodayCount.textContent = `${Math.round(todaySeconds / 60)} min`;
  els.n1HorizonProgress.textContent = `${horizonPercent.toFixed(2)}% of ${N1_NO_KANJI_LOWER_HOURS.toLocaleString()} hrs`;
  els.n1HorizonBar.style.width = `${horizonPercent}%`;
  els.studyMilestoneText.textContent = hours >= STUDY_MILESTONES[STUDY_MILESTONES.length - 1]
    ? `Long-range milestone reached: ${N1_NO_KANJI_UPPER_HOURS.toLocaleString()} hours.`
    : `Next milestone: ${nextMilestone.toLocaleString()} hours (${remainingToMilestone.toFixed(1)} left). N1 estimate for English speakers: ${N1_NO_KANJI_LOWER_HOURS.toLocaleString()}-${N1_NO_KANJI_UPPER_HOURS.toLocaleString()} hours.`;
  syncPressedState("[data-study-minutes]", (button) => (
    Number(button.dataset.studyMinutes) === state.selectedStudyMinutes
  )).forEach((button) => {
    button.disabled = state.studyTimer.running;
  });
}

function setStudyButtons() {
  const isRunning = state.studyTimer.running;
  const isFresh = state.studyTimer.remainingSeconds === state.studyTimer.durationSeconds;
  const isDone = state.studyTimer.remainingSeconds <= 0;
  els.startStudyButton.textContent = isFresh ? "Start" : "Resume";
  els.startStudyButton.disabled = isRunning || isDone;
  els.pauseStudyButton.disabled = !isRunning;
  els.finishStudyButton.disabled = isRunning || isFresh || isDone;
}

function setStudyDuration(minutes) {
  if (state.studyTimer.running) return;
  state.selectedStudyMinutes = minutes;
  state.studyTimer.durationSeconds = minutes * 60;
  state.studyTimer.remainingSeconds = minutes * 60;
  els.studySessionStatus.textContent = `Ready for a ${minutes}-minute session.`;
  saveProgress();
  renderStudyStats();
  setStudyButtons();
}

function startStudyTimer() {
  if (state.studyTimer.running || state.studyTimer.remainingSeconds <= 0) return;
  state.studyTimer.running = true;
  els.studySessionStatus.textContent = "Timer running. Pause if life interrupts.";
  setStudyButtons();
  state.studyTimer.intervalId = window.setInterval(() => {
    state.studyTimer.remainingSeconds = Math.max(0, state.studyTimer.remainingSeconds - 1);
    els.studyTimerDisplay.textContent = secondsToClock(state.studyTimer.remainingSeconds);
    if (state.studyTimer.remainingSeconds === 0) {
      completeStudyTimer();
    }
  }, 1000);
}

function pauseStudyTimer() {
  if (!state.studyTimer.running) return;
  window.clearInterval(state.studyTimer.intervalId);
  state.studyTimer.running = false;
  state.studyTimer.intervalId = null;
  els.studySessionStatus.textContent = "Paused. Resume when ready.";
  setStudyButtons();
  renderStudyStats();
}

function recordStudySession(seconds) {
  const loggedSeconds = Math.max(60, Math.round(seconds));
  const key = todayKey();
  state.studyStats.days[key] = (state.studyStats.days[key] || 0) + loggedSeconds;
  state.studyStats.sessions.push({
    date: key,
    minutes: Math.round(loggedSeconds / 60),
    completedAt: new Date().toISOString()
  });
  state.studyStats.sessions = state.studyStats.sessions.slice(-120);
  state.foundationDone = Math.max(state.foundationDone, studyDayCount());
  saveProgress();
}

function resetStudyTimerForNextSession() {
  state.studyTimer.running = false;
  state.studyTimer.intervalId = null;
  state.studyTimer.durationSeconds = state.selectedStudyMinutes * 60;
  state.studyTimer.remainingSeconds = state.studyTimer.durationSeconds;
}

function completeStudyTimer() {
  window.clearInterval(state.studyTimer.intervalId);
  const loggedSeconds = state.studyTimer.durationSeconds;
  recordStudySession(loggedSeconds);
  resetStudyTimerForNextSession();
  els.studySessionStatus.textContent = `${Math.round(loggedSeconds / 60)} minutes logged for today.`;
  renderProgress();
  setStudyButtons();
}

function finishPartialStudySession() {
  if (state.studyTimer.running) return;
  const elapsedSeconds = state.studyTimer.durationSeconds - state.studyTimer.remainingSeconds;
  if (elapsedSeconds < 60) {
    els.studySessionStatus.textContent = "Study at least one minute before logging.";
    return;
  }
  recordStudySession(elapsedSeconds);
  resetStudyTimerForNextSession();
  els.studySessionStatus.textContent = `${Math.round(elapsedSeconds / 60)} minutes logged for today.`;
  renderProgress();
  setStudyButtons();
}

function quizKey(item) {
  return `${state.deck}:${item.kana}`;
}

function deckStats() {
  return deckStatsFor(state.deck);
}

function deckStatsFor(deckName) {
  const deck = n5Content.kanaDecks[deckName];
  const hits = state.kanaHits[deckName] || {};
  const mastered = deck.filter((item) => (hits[`${deckName}:${item.kana}`] || 0) >= MASTERY_TARGET).length;
  return {
    total: deck.length,
    mastered,
    remaining: deck.length - mastered,
    percent: Math.round((mastered / deck.length) * 100)
  };
}

function getCheckpointCriteria() {
  const hiragana = deckStatsFor("hiragana");
  const katakana = deckStatsFor("katakana");
  return [
    {
      label: "Hiragana deck mastered",
      detail: `${hiragana.mastered} / ${hiragana.total}`,
      complete: hiragana.remaining === 0
    },
    {
      label: "Katakana deck mastered",
      detail: `${katakana.mastered} / ${katakana.total}`,
      complete: katakana.remaining === 0
    },
    {
      label: "Vocabulary starter checks",
      detail: `${state.n5ModeCorrect.vocab || 0} / ${N5_MODE_TARGETS.vocab} correct`,
      complete: (state.n5ModeCorrect.vocab || 0) >= N5_MODE_TARGETS.vocab
    },
    {
      label: "Particle starter checks",
      detail: `${state.n5ModeCorrect.particles || 0} / ${N5_MODE_TARGETS.particles} correct`,
      complete: (state.n5ModeCorrect.particles || 0) >= N5_MODE_TARGETS.particles
    },
    {
      label: "Grammar starter checks",
      detail: `${state.n5ModeCorrect.grammar || 0} / ${N5_MODE_TARGETS.grammar} correct`,
      complete: (state.n5ModeCorrect.grammar || 0) >= N5_MODE_TARGETS.grammar
    },
    {
      label: "Sentence reading checks",
      detail: `${state.n5ModeCorrect.sentences || 0} / ${N5_MODE_TARGETS.sentences} correct`,
      complete: (state.n5ModeCorrect.sentences || 0) >= N5_MODE_TARGETS.sentences
    },
    {
      label: "N5 sprint score",
      detail: `Best: ${state.sprintBest}% / ${SPRINT_PASS_PERCENT}%`,
      complete: state.sprintBest >= SPRINT_PASS_PERCENT
    }
  ];
}

function renderCheckpointProgress() {
  const criteria = getCheckpointCriteria();
  const completeCount = criteria.filter((item) => item.complete).length;
  const percent = Math.round((completeCount / criteria.length) * 100);
  els.checkpointStatus.textContent = completeCount === criteria.length ? "Starter check complete" : "Still in progress";
  els.checkpointStatus.className = completeCount === criteria.length ? "checkpoint-ready" : "";
  els.checkpointBar.style.width = `${percent}%`;
  els.checkpointScore.textContent = `${completeCount} / ${criteria.length} complete`;
  els.checkpointCriteria.innerHTML = criteria.map((item) => `
    <section class="${item.complete ? "complete" : ""}">
      <strong>${item.complete ? "Done" : "Open"}</strong>
      <div>
        <h4>${item.label}</h4>
        <p>${item.detail}</p>
      </div>
    </section>
  `).join("");
  renderSprintProgress();
}

function kanaLessonDeckLabel(deck) {
  return deck === "katakana" ? "Katakana" : "Hiragana";
}

function currentKanaLessonRow() {
  return JapanReadyKanaLessons.STARTER_ROWS.find((row) => row.id === state.kanaLesson.rowId)
    || JapanReadyKanaLessons.STARTER_ROWS[0];
}

function currentKanaLessonItems() {
  return JapanReadyKanaLessons.itemsFor(state.kanaLesson.deck, state.kanaLesson.rowId, n5Content.kanaDecks);
}

function currentKanaLessonStatus() {
  return JapanReadyKanaLessons.rowStatus(
    state.kanaRowProgress,
    state.kanaLesson.deck,
    state.kanaLesson.rowId,
    n5Content.kanaDecks
  );
}

function renderKanaLessonDeckButtons() {
  const katakanaUnlocked = JapanReadyKanaLessons.isUnlocked(
    state.kanaRowProgress,
    "katakana",
    "vowels",
    n5Content.kanaDecks
  );
  syncPressedState("[data-kana-lesson-deck]", (button) => button.dataset.kanaLessonDeck === state.kanaLesson.deck)
    .forEach((button) => {
      const locked = button.dataset.kanaLessonDeck === "katakana" && !katakanaUnlocked;
      button.disabled = locked;
      button.title = locked ? "Complete the Hiragana foundation rows first." : "";
    });
}

function renderKanaLessonRows() {
  if (!els.kanaLessonRows) return;
  els.kanaLessonRows.innerHTML = JapanReadyKanaLessons.STARTER_ROWS.map((row, index) => {
    const items = JapanReadyKanaLessons.itemsFor(state.kanaLesson.deck, row.id, n5Content.kanaDecks);
    const status = JapanReadyKanaLessons.rowStatus(state.kanaRowProgress, state.kanaLesson.deck, row.id, n5Content.kanaDecks);
    const unlocked = JapanReadyKanaLessons.isUnlocked(state.kanaRowProgress, state.kanaLesson.deck, row.id, n5Content.kanaDecks);
    const active = row.id === state.kanaLesson.rowId;
    const statusLabel = status.complete ? "Complete" : active ? `${status.done}/${status.total} now` : unlocked ? `${status.done}/${status.total}` : "Locked";
    return `
      <button type="button" data-kana-lesson-row="${row.id}" ${unlocked ? "" : "disabled"}
        aria-pressed="${active}" ${active ? 'aria-current="step"' : ""} class="${active ? "active" : ""} ${status.complete ? 'data-complete="true"' : ""}>
        <span>Row ${index + 1}</span>
        <strong>${row.shortLabel}</strong>
        <small lang="ja">${items.map((item) => item.kana).join(" ")}</small>
        <em>${statusLabel}</em>
      </button>
    `;
  }).join("");
}

function kanaLessonContinueLabel() {
  const next = JapanReadyKanaLessons.nextAfter(state.kanaLesson.deck, state.kanaLesson.rowId);
  if (!next) return "Continue to Practice Extras";
  const row = JapanReadyKanaLessons.STARTER_ROWS.find((item) => item.id === next.rowId);
  return `Continue to ${kanaLessonDeckLabel(next.deck)} ${row.shortLabel}`;
}

function renderKanaLesson() {
  if (!els.kanaLessonTitle) return;
  state.kanaLesson.renderToken += 1;
  state.kanaLesson.answered = false;
  const row = currentKanaLessonRow();
  const items = currentKanaLessonItems();
  const status = currentKanaLessonStatus();
  const sequenceIndex = JapanReadyKanaLessons.lessonSequence().findIndex((lesson) => (
    lesson.deck === state.kanaLesson.deck && lesson.rowId === state.kanaLesson.rowId
  ));
  const completedKeys = new Set(state.kanaRowProgress[state.kanaLesson.deck]?.[state.kanaLesson.rowId] || []);
  const current = items.find((item) => !completedKeys.has(JapanReadyKanaLessons.cardKey(state.kanaLesson.deck, item))) || null;
  state.kanaLesson.current = current;

  els.kanaLessonSetStatus.textContent = `Foundation lesson ${sequenceIndex + 1} of ${JapanReadyKanaLessons.lessonSequence().length}`;
  els.kanaLessonTitle.textContent = `${kanaLessonDeckLabel(state.kanaLesson.deck)} ${row.label}`;
  els.kanaLessonMeta.textContent = `${kanaLessonDeckLabel(state.kanaLesson.deck)} - ${row.label}`;
  els.kanaLessonProgressLabel.textContent = `${status.done} / ${status.total} cards complete`;
  els.kanaLessonProgressBar.style.width = `${status.percent}%`;
  els.kanaLessonContinue.textContent = kanaLessonContinueLabel();
  els.kanaLessonContinue.disabled = !status.complete;
  renderKanaLessonDeckButtons();
  renderKanaLessonRows();

  if (status.complete) {
    els.kanaLessonCardMeta.textContent = "Row complete";
    els.kanaLessonKana.textContent = "Done";
    els.kanaLessonKana.setAttribute("lang", "en");
    els.kanaLessonPrompt.textContent = `All ${status.total} ${status.total === 1 ? "card is" : "cards are"} complete. Continue when you are ready.`;
    els.kanaLessonChoices.innerHTML = "";
    els.kanaLessonFeedback.textContent = `${kanaLessonDeckLabel(state.kanaLesson.deck)} ${row.label} complete.`;
    els.kanaLessonFeedback.className = "feedback success";
    return;
  }

  const rowIndex = JapanReadyKanaLessons.STARTER_ROWS.findIndex((item) => item.id === row.id);
  const introducedItems = JapanReadyKanaLessons.STARTER_ROWS
    .slice(0, rowIndex + 1)
    .flatMap((item) => JapanReadyKanaLessons.itemsFor(state.kanaLesson.deck, item.id, n5Content.kanaDecks));
  const wrong = sample(introducedItems.filter((item) => item.kana !== current.kana), 3);
  const choices = sample([current, ...wrong], 4);
  els.kanaLessonCardMeta.textContent = `Card ${status.done + 1} of ${status.total}`;
  els.kanaLessonKana.textContent = current.kana;
  els.kanaLessonKana.setAttribute("lang", "ja");
  els.kanaLessonPrompt.textContent = "Choose the matching sound.";
  els.kanaLessonChoices.innerHTML = choices.map((choice) => `
    <button type="button" data-kana-lesson-answer="${choice.romaji}">${choice.romaji}</button>
  `).join("");
  els.kanaLessonFeedback.textContent = "";
  els.kanaLessonFeedback.className = "feedback";
}

function selectKanaLesson(deck, rowId, options = {}) {
  const validDeck = JapanReadyKanaLessons.DECK_ORDER.includes(deck);
  const validRow = JapanReadyKanaLessons.STARTER_ROWS.some((row) => row.id === rowId);
  if (!validDeck || !validRow) return false;
  if (!JapanReadyKanaLessons.isUnlocked(state.kanaRowProgress, deck, rowId, n5Content.kanaDecks)) return false;
  state.kanaLesson.deck = deck;
  state.kanaLesson.rowId = rowId;
  state.kanaLesson.current = null;
  state.kanaLesson.answered = false;
  saveProgress();
  renderKanaLesson();
  renderRoadmapResume();
  if (options.focus !== false) els.kanaLessonTitle.focus?.({ preventScroll: true });
  return true;
}

function selectKanaLessonDeck(deck) {
  const firstIncomplete = JapanReadyKanaLessons.STARTER_ROWS.find((row) => (
    !JapanReadyKanaLessons.rowStatus(state.kanaRowProgress, deck, row.id, n5Content.kanaDecks).complete
    && JapanReadyKanaLessons.isUnlocked(state.kanaRowProgress, deck, row.id, n5Content.kanaDecks)
  ));
  const fallback = [...JapanReadyKanaLessons.STARTER_ROWS].reverse().find((row) => (
    JapanReadyKanaLessons.isUnlocked(state.kanaRowProgress, deck, row.id, n5Content.kanaDecks)
  ));
  selectKanaLesson(deck, (firstIncomplete || fallback || JapanReadyKanaLessons.STARTER_ROWS[0]).id);
}

function checkKanaLessonAnswer(answer) {
  if (!state.kanaLesson.current || state.kanaLesson.answered) return;
  state.kanaLesson.answered = true;
  const item = state.kanaLesson.current;
  const token = state.kanaLesson.renderToken;
  els.kanaLessonChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  if (answer === item.romaji) {
    state.correct += 1;
    state.streak += 1;
    recordPracticeEvent("kana", `${state.kanaLesson.deck} ${state.kanaLesson.rowId} row`, true);
    state.kanaRowProgress = JapanReadyKanaLessons.markComplete(
      state.kanaRowProgress,
      state.kanaLesson.deck,
      state.kanaLesson.rowId,
      item,
      n5Content.kanaDecks
    );
    const key = JapanReadyKanaLessons.cardKey(state.kanaLesson.deck, item);
    state.kanaHits[state.kanaLesson.deck] = state.kanaHits[state.kanaLesson.deck] || {};
    state.kanaHits[state.kanaLesson.deck][key] = Math.min((state.kanaHits[state.kanaLesson.deck][key] || 0) + 1, MASTERY_TARGET);
    const complete = currentKanaLessonStatus().complete;
    els.kanaLessonFeedback.textContent = complete
      ? `Correct. ${kanaLessonDeckLabel(state.kanaLesson.deck)} ${currentKanaLessonRow().label} is complete.`
      : `Correct. ${item.kana} is ${item.romaji}.`;
    els.kanaLessonFeedback.className = "feedback success";
    saveProgress();
    renderProgress();
    window.setTimeout(() => {
      if (state.kanaLesson.renderToken === token) renderKanaLesson();
    }, 700);
    return;
  }
  state.review += 1;
  state.streak = 0;
  recordPracticeEvent("kana", `${state.kanaLesson.deck} ${state.kanaLesson.rowId} row`, false);
  els.kanaLessonFeedback.textContent = `Not yet. ${item.kana} is ${item.romaji}. Try this card again.`;
  els.kanaLessonFeedback.className = "feedback needs-review";
  saveProgress();
  renderProgress();
  window.setTimeout(() => {
    if (state.kanaLesson.renderToken === token) renderKanaLesson();
  }, 900);
}

function continueKanaLesson() {
  if (!currentKanaLessonStatus().complete) return;
  const next = JapanReadyKanaLessons.nextAfter(state.kanaLesson.deck, state.kanaLesson.rowId);
  if (next) {
    selectKanaLesson(next.deck, next.rowId);
    return;
  }
  if (els.kanaExtrasDrawer) {
    els.kanaExtrasDrawer.open = true;
    const summary = els.kanaExtrasDrawer.querySelector("summary");
    summary?.focus({ preventScroll: true });
  }
}

function renderDeckProgress() {
  const stats = deckStats();
  els.deckProgressLabel.textContent = `${stats.mastered} / ${stats.total} mastered`;
  els.deckProgressBar.style.width = `${stats.percent}%`;
  els.deckProgressNote.textContent = stats.remaining
    ? `${stats.remaining} kana left in this deck. Each one needs ${MASTERY_TARGET} correct answers.`
    : "Deck complete. Reset this deck when you want to run it again.";
}

function candidateQuizItems(deck) {
  const hits = state.kanaHits[state.deck] || {};
  const candidates = deck.filter((item) => (hits[quizKey(item)] || 0) < MASTERY_TARGET);
  const nonRepeat = candidates.filter((item) => quizKey(item) !== state.lastQuizKey);
  return nonRepeat.length ? nonRepeat : candidates;
}

function startQuiz() {
  const deck = n5Content.kanaDecks[state.deck];
  const candidates = candidateQuizItems(deck);
  if (!candidates.length) {
    state.quizItem = null;
    els.quizDeckLabel.textContent = state.deck === "hiragana" ? "Hiragana complete" : "Katakana complete";
    els.quizKana.textContent = "完";
    els.quizKana.classList.remove("sound-card");
    els.quizKana.setAttribute("lang", "ja");
    els.quizPrompt.textContent = "Deck complete.";
    els.quizChoices.innerHTML = "";
    els.quizFeedback.textContent = "Deck complete. Nice finish line. Reset the deck when you want another pass.";
    els.quizFeedback.className = "feedback success";
    document.querySelector("#newQuizButton").disabled = true;
    renderDeckProgress();
    return;
  }
  document.querySelector("#newQuizButton").disabled = false;
  state.quizItem = sample(candidates, 1)[0];
  state.lastQuizKey = quizKey(state.quizItem);
  const isReverse = state.kanaMode === "reverse";
  const wrong = sample(deck.filter((item) => item.kana !== state.quizItem.kana), 3);
  const choices = sample([state.quizItem, ...wrong], 4);
  const deckLabel = state.deck === "hiragana" ? "Hiragana" : "Katakana";
  els.quizDeckLabel.textContent = `${deckLabel} - ${isReverse ? "sound to kana" : "kana to sound"}`;
  els.quizKana.textContent = isReverse ? state.quizItem.romaji : state.quizItem.kana;
  els.quizKana.classList.toggle("sound-card", isReverse);
  els.quizKana.setAttribute("lang", isReverse ? "en" : "ja");
  els.quizPrompt.textContent = isReverse ? "Choose the matching kana." : "Choose the matching sound.";
  els.quizFeedback.textContent = "";
  els.quizFeedback.className = "feedback";
  els.quizChoices.innerHTML = choices.map((choice) => `
    <button type="button" data-answer="${isReverse ? choice.kana : choice.romaji}">${isReverse ? choice.kana : choice.romaji}</button>
  `).join("");
}

function renderKanaChart() {
  const deck = n5Content.kanaDecks[state.deck];
  els.kanaChart.innerHTML = deck.map((item) => `
    <div>
      <strong lang="ja">${item.kana}</strong>
      <span>${item.romaji}</span>
    </div>
  `).join("");
}

function worksheetDeckLabel(deck) {
  return {
    hiragana: "Hiragana",
    katakana: "Katakana",
    both: "Hiragana and Katakana"
  }[deck] || "Hiragana";
}

function worksheetGroupLabel(group) {
  return {
    all: "all rows",
    vowels: "vowels",
    kst: "K/S/T rows",
    nhm: "N/H/M rows",
    yrw: "Y/R/W rows plus final N"
  }[group] || "all rows";
}

function worksheetModeLabel(mode) {
  return {
    trace: "trace practice",
    quiz: "blank quiz"
  }[mode] || "trace practice";
}

function worksheetGroupKeys(group) {
  return {
    vowels: ["vowels"],
    kst: ["k", "s", "t"],
    nhm: ["n", "h", "m"],
    yrw: ["y", "r", "w"]
  }[group] || [];
}

function worksheetItemMatchesGroup(item, group) {
  if (group === "nhm") {
    return worksheetGroupKeys(group).includes(item.group) && item.romaji !== "n";
  }
  if (group === "yrw") {
    return worksheetGroupKeys(group).includes(item.group) || item.romaji === "n";
  }
  const groupKeys = worksheetGroupKeys(group);
  return !groupKeys.length || groupKeys.includes(item.group);
}

function activeWorksheetSettings() {
  return {
    deck: document.querySelector("[data-worksheet-deck].active")?.dataset.worksheetDeck || "hiragana",
    group: document.querySelector("[data-worksheet-group].active")?.dataset.worksheetGroup || "all",
    mode: document.querySelector("[data-worksheet-mode].active")?.dataset.worksheetMode || "trace"
  };
}

function worksheetItems(deck, group = "all") {
  const filterByGroup = (items) => items.filter((item) => worksheetItemMatchesGroup(item, group));
  if (deck === "both") {
    return [
      ...filterByGroup(n5Content.kanaDecks.hiragana).map((item) => ({ ...item, script: "Hiragana" })),
      ...filterByGroup(n5Content.kanaDecks.katakana).map((item) => ({ ...item, script: "Katakana" }))
    ];
  }
  const safeDeck = deck === "katakana" ? "katakana" : "hiragana";
  const script = safeDeck === "katakana" ? "Katakana" : "Hiragana";
  return filterByGroup(n5Content.kanaDecks[safeDeck]).map((item) => ({ ...item, script }));
}

function worksheetPrompt(item, mode, index, items) {
  const scriptLabel = index === 0 || items[index - 1].script !== item.script ? `<em>${item.script}</em>` : "";
  if (mode === "quiz") {
    return `
      ${scriptLabel}
      <strong>${item.romaji}</strong>
      <span>write kana</span>
    `;
  }
  return `
    ${scriptLabel}
    <strong lang="ja">${item.kana}</strong>
    <span>${item.romaji}</span>
  `;
}

function worksheetCells(item, mode) {
  if (mode === "quiz") {
    return "<span></span><span></span><span></span><span></span><span></span>";
  }
  return `
    <span class="trace" lang="ja">${item.kana}</span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  `;
}

function renderWorksheetAnswerKey(items, mode) {
  if (mode !== "quiz") return "";
  return `
    <details class="worksheet-answer-key">
      <summary>Show answer key after you finish</summary>
      <div>
        ${items.map((item) => `
          <span><b lang="ja">${item.kana}</b> ${item.romaji}</span>
        `).join("")}
      </div>
    </details>
  `;
}

function renderKanaWorksheet(deck = "hiragana", group = "all", mode = "trace") {
  if (!els.kanaWorksheet) return;
  const items = worksheetItems(deck, group);
  const safeMode = mode === "quiz" ? "quiz" : "trace";
  const title = `${worksheetDeckLabel(deck)} ${safeMode === "quiz" ? "blank quiz" : "writing worksheet"}`;
  const instructions = safeMode === "quiz"
    ? "Write the kana from memory, then check the answer key."
    : "Trace once, copy a few times, then try one from memory.";
  els.kanaWorksheet.innerHTML = `
    <section class="worksheet-title">
      <div>
        <span class="panel-label">Printable kana practice</span>
        <strong>${title}</strong>
      </div>
      <p>${items.length} kana from ${worksheetGroupLabel(group)}. ${instructions}</p>
    </section>
    <div class="worksheet-grid">
      ${items.map((item, index) => `
        <section class="worksheet-row ${safeMode === "quiz" ? "worksheet-row-quiz" : ""}">
          <div class="worksheet-prompt">
            ${worksheetPrompt(item, safeMode, index, items)}
          </div>
          <div class="worksheet-cells" aria-hidden="true">
            ${worksheetCells(item, safeMode)}
          </div>
        </section>
      `).join("")}
    </div>
    ${renderWorksheetAnswerKey(items, safeMode)}
  `;
}

function updateWorksheetStatus(deck, group, mode) {
  if (!els.worksheetStatus) return;
  els.worksheetStatus.textContent = `${worksheetDeckLabel(deck)} ${worksheetModeLabel(mode)} ready for ${worksheetGroupLabel(group)}.`;
  els.worksheetStatus.className = "feedback";
}

function setWorksheetDeck(deck, group = activeWorksheetSettings().group, mode = activeWorksheetSettings().mode) {
  syncPressedState("[data-worksheet-deck]", (button) => button.dataset.worksheetDeck === deck);
  renderKanaWorksheet(deck, group, mode);
  updateWorksheetStatus(deck, group, mode);
}

function setWorksheetGroup(group, deck = activeWorksheetSettings().deck, mode = activeWorksheetSettings().mode) {
  syncPressedState("[data-worksheet-group]", (button) => button.dataset.worksheetGroup === group);
  renderKanaWorksheet(deck, group, mode);
  updateWorksheetStatus(deck, group, mode);
}

function setWorksheetMode(mode, settings = activeWorksheetSettings()) {
  const safeMode = mode === "quiz" ? "quiz" : "trace";
  syncPressedState("[data-worksheet-mode]", (button) => button.dataset.worksheetMode === safeMode);
  renderKanaWorksheet(settings.deck, settings.group, safeMode);
  updateWorksheetStatus(settings.deck, settings.group, safeMode);
}

function printKanaWorksheet() {
  const { deck, group, mode } = activeWorksheetSettings();
  renderKanaWorksheet(deck, group, mode);
  const answerKey = els.kanaWorksheet.querySelector(".worksheet-answer-key");
  if (answerKey && !answerKey.open) {
    answerKey.open = true;
    answerKey.dataset.openedForPrint = "true";
  }
  document.body.classList.add("printing-worksheet");
  if (els.worksheetStatus) {
    els.worksheetStatus.textContent = "Opening browser print. Choose paper or Save as PDF from the print dialog.";
    els.worksheetStatus.className = "feedback success";
  }
  window.setTimeout(() => {
    window.print();
    window.setTimeout(clearWorksheetPrintState, 500);
  }, 0);
}

function clearWorksheetPrintState() {
  document.body.classList.remove("printing-worksheet");
  const answerKey = els.kanaWorksheet.querySelector(".worksheet-answer-key[data-opened-for-print='true']");
  if (answerKey) {
    answerKey.open = false;
    delete answerKey.dataset.openedForPrint;
  }
}

function chooseDeck(deck) {
  state.deck = deck;
  syncPressedState("[data-deck]", (button) => button.dataset.deck === deck);
  renderKanaChart();
  renderDeckProgress();
  startQuiz();
}

function renderKanaModeButtons() {
  syncPressedState("[data-kana-mode]", (button) => button.dataset.kanaMode === state.kanaMode);
}

function chooseKanaMode(mode) {
  state.kanaMode = mode === "reverse" ? "reverse" : "recognition";
  renderKanaModeButtons();
  saveProgress();
  startQuiz();
}

function checkKanaAnswer(answer) {
  if (!state.quizItem) return;
  els.quizChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  const expected = state.kanaMode === "reverse" ? state.quizItem.kana : state.quizItem.romaji;
  if (answer === expected) {
    state.correct += 1;
    state.streak += 1;
    recordPracticeEvent("kana", `${state.deck} kana`, true);
    const key = quizKey(state.quizItem);
    state.kanaHits[state.deck] = state.kanaHits[state.deck] || {};
    state.kanaHits[state.deck][key] = Math.min((state.kanaHits[state.deck][key] || 0) + 1, MASTERY_TARGET);
    const hits = state.kanaHits[state.deck][key];
    els.quizFeedback.textContent = hits >= MASTERY_TARGET
      ? `Mastered ${state.quizItem.kana}. It is out of this deck now.`
      : `Correct. ${state.quizItem.kana} is ${hits}/${MASTERY_TARGET} toward mastery.`;
    els.quizFeedback.className = "feedback success";
    saveProgress();
    renderProgress();
    window.setTimeout(startQuiz, 700);
    return;
  }
  state.review += 1;
  state.streak = 0;
  recordPracticeEvent("kana", `${state.deck} kana`, false);
  els.quizFeedback.textContent = `${state.quizItem.kana} is ${state.quizItem.romaji}. Add it to the review pile.`;
  els.quizFeedback.className = "feedback needs-review";
  saveProgress();
  renderProgress();
}

function makeVocabQuestion() {
  const vocabulary = availableVocabularyWords();
  const item = sample(vocabulary, 1)[0];
  const wrong = sample(vocabulary.filter((candidate) => candidate.english !== item.english), 3);
  return {
    mode: "vocab",
    meta: `${item.category} vocabulary`,
    prompt: item.japanese,
    hint: `Reading: ${item.romaji}`,
    answer: item.english,
    choices: sample([item.english, ...wrong.map((candidate) => candidate.english)], 4),
    explanation: `${item.japanese} (${item.romaji}) means ${item.english}.`
  };
}

function makeParticleQuestion() {
  const item = sample(n5Content.particlePractice, 1)[0];
  return {
    mode: "particles",
    meta: "Particle fill-in",
    prompt: item.prompt,
    hint: "Choose the particle that makes the sentence work.",
    answer: item.answer,
    choices: item.choices,
    explanation: item.explanation
  };
}

function makeGrammarQuestion() {
  const item = sample(n5Content.grammarPractice, 1)[0];
  return {
    mode: "grammar",
    meta: "Grammar pattern",
    prompt: item.prompt,
    hint: "Choose the best beginner pattern or meaning.",
    answer: item.answer,
    choices: item.choices,
    explanation: item.explanation
  };
}

function makeSentenceQuestion() {
  const item = sample(n5Content.sentencePractice, 1)[0];
  return {
    mode: "sentences",
    meta: "Sentence comprehension",
    prompt: item.prompt,
    hint: "Choose the meaning of the whole sentence.",
    answer: item.answer,
    choices: item.choices,
    explanation: item.explanation
  };
}

function makeSprintQuestion(mode) {
  const makers = {
    vocab: makeVocabQuestion,
    particles: makeParticleQuestion,
    grammar: makeGrammarQuestion,
    sentences: makeSentenceQuestion
  };
  return makers[mode]();
}

function reviewKey(question) {
  return `${question.mode}:${question.prompt}:${question.answer}`;
}

function addReviewQuestion(question) {
  const key = question.reviewKey || reviewKey(question);
  const now = new Date().toISOString();
  const existing = state.n5ReviewQueue.find((item) => item.key === key);
  if (existing) {
    existing.misses += 1;
    existing.reviewStage = 0;
    existing.dueAt = now;
    existing.lastMissedAt = now;
    return;
  }
  state.n5ReviewQueue.push({
    key,
    mode: question.reviewSourceMode || question.mode,
    meta: question.meta,
    prompt: question.prompt,
    hint: question.hint,
    answer: question.answer,
    choices: question.choices,
    explanation: question.explanation,
    misses: 1,
    reviewStage: 0,
    dueAt: now,
    lastMissedAt: now
  });
}

function removeReviewQuestion(key) {
  state.n5ReviewQueue = state.n5ReviewQueue.filter((item) => item.key !== key);
}

function reviewModeLabel(mode) {
  return {
    vocab: "Vocab",
    particles: "Particles",
    grammar: "Grammar",
    sentences: "Sentences"
  }[mode] || "Other";
}

function isReviewDue(item) {
  return !item.dueAt || Date.parse(item.dueAt) <= Date.now();
}

function dueReviewItems() {
  return state.n5ReviewQueue.filter(isReviewDue);
}

function nextReviewDueAt() {
  return state.n5ReviewQueue.reduce((next, item) => {
    if (!item.dueAt) return next;
    const due = Date.parse(item.dueAt);
    if (Number.isNaN(due)) return next;
    return next === null || due < next ? due : next;
  }, null);
}

function formatDueDistance(timestamp) {
  const minutes = Math.max(1, Math.ceil((timestamp - Date.now()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) return `${hours} hr`;
  return `${Math.ceil(hours / 24)} days`;
}

function scheduleReviewedItem(item) {
  const nextStage = (item.reviewStage || 0) + 1;
  if (nextStage >= REVIEW_INTERVAL_DAYS.length) {
    removeReviewQuestion(item.key);
    return "cleared";
  }
  const nextDue = new Date(Date.now() + REVIEW_INTERVAL_DAYS[nextStage] * 86400000);
  item.reviewStage = nextStage;
  item.dueAt = nextDue.toISOString();
  item.lastReviewedAt = new Date().toISOString();
  return formatDueDistance(nextDue.getTime());
}

function renderReviewQueuePanel() {
  if (!els.n5ReviewCount) return;
  const count = state.n5ReviewQueue.length;
  const dueCount = dueReviewItems().length;
  els.n5ReviewCount.textContent = count
    ? `${dueCount} due / ${count} total`
    : "0 items";
  els.startReviewButton.disabled = dueCount === 0;
  const nextDue = nextReviewDueAt();
  els.startReviewButton.textContent = dueCount
    ? `Review ${dueCount} Due`
    : count && nextDue
      ? `Next in ${formatDueDistance(nextDue)}`
      : "Review Due";
  els.clearReviewButton.disabled = count === 0;
  const totals = state.n5ReviewQueue.reduce((summary, item) => {
    const mode = ["vocab", "particles", "grammar", "sentences"].includes(item.mode) ? item.mode : "other";
    summary[mode] = summary[mode] || { due: 0, total: 0 };
    summary[mode].total += 1;
    if (isReviewDue(item)) summary[mode].due += 1;
    return summary;
  }, {});
  els.reviewCategoryStats.innerHTML = ["vocab", "particles", "grammar", "sentences"].map((mode) => `
    <span>${reviewModeLabel(mode)}<strong>${totals[mode]?.due || 0}/${totals[mode]?.total || 0}</strong></span>
  `).join("");
}

function startReviewQuestion() {
  const dueItems = dueReviewItems();
  if (!state.n5ReviewQueue.length) {
    state.n5ReviewActive = false;
    els.n5Feedback.textContent = "Review pile is clear.";
    els.n5Feedback.className = "feedback success";
    renderReviewQueuePanel();
    return;
  }
  if (!dueItems.length) {
    state.n5ReviewActive = false;
    const nextDue = nextReviewDueAt();
    els.n5Feedback.textContent = nextDue
      ? `No weak items due yet. Next review opens in ${formatDueDistance(nextDue)}.`
      : "No weak items are due right now.";
    els.n5Feedback.className = "feedback";
    renderReviewQueuePanel();
    return;
  }
  dueItems.sort((a, b) => {
    const missDelta = (b.misses || 0) - (a.misses || 0);
    if (missDelta) return missDelta;
    return Date.parse(b.lastMissedAt || 0) - Date.parse(a.lastMissedAt || 0);
  });
  const item = dueItems[0];
  state.n5ReviewActive = true;
  state.n5Question = {
    ...item,
    reviewKey: item.key,
    reviewSourceMode: item.mode
  };
  els.n5PracticeTitle.textContent = "Review pile";
  els.n5QuestionMeta.textContent = `${item.meta} - missed ${item.misses} ${item.misses === 1 ? "time" : "times"} - step ${(item.reviewStage || 0) + 1}/${REVIEW_INTERVAL_DAYS.length}`;
  els.n5QuestionText.textContent = item.prompt;
  els.n5QuestionHint.textContent = item.hint;
  els.n5Feedback.textContent = "";
  els.n5Feedback.className = "feedback";
  els.n5Choices.innerHTML = sample(item.choices, item.choices.length).map((choice) => `
    <button type="button" data-n5-answer="${choice}">${choice}</button>
  `).join("");
}

function clearReviewQueue() {
  state.n5ReviewActive = false;
  state.n5ReviewQueue = [];
  saveProgress();
  renderReviewQueuePanel();
  els.n5Feedback.textContent = "Review pile cleared.";
  els.n5Feedback.className = "feedback";
}

function buildSprintQuestions() {
  const plan = [
    "vocab", "vocab", "vocab", "vocab",
    "particles", "particles", "particles",
    "grammar", "grammar",
    "sentences", "sentences", "sentences"
  ];
  return sample(plan, plan.length).map(makeSprintQuestion);
}

function startN5Question() {
  state.n5ReviewActive = false;
  const makers = {
    vocab: makeVocabQuestion,
    particles: makeParticleQuestion,
    grammar: makeGrammarQuestion,
    sentences: makeSentenceQuestion
  };
  state.n5Question = makers[state.n5Mode]();
  els.n5PracticeTitle.textContent = {
    vocab: "Vocabulary check",
    particles: "Particle practice",
    grammar: "Grammar pattern check",
    sentences: "Sentence reading check"
  }[state.n5Mode];
  els.n5QuestionMeta.textContent = state.n5Question.meta;
  els.n5QuestionText.textContent = state.n5Question.prompt;
  els.n5QuestionHint.textContent = state.n5Question.hint;
  els.n5Feedback.textContent = "";
  els.n5Feedback.className = "feedback";
  els.n5Choices.innerHTML = state.n5Question.choices.map((choice) => `
    <button type="button" data-n5-answer="${choice}">${choice}</button>
  `).join("");
}

function renderSprintProgress() {
  if (!els.sprintStatus) return;
  const total = state.sprint.questions.length || SPRINT_LENGTH;
  const answeredCount = state.sprint.complete
    ? total
    : Math.min(state.sprint.index + (state.sprint.answered ? 1 : 0), total);
  const percent = Math.round((answeredCount / total) * 100);
  els.sprintBar.style.width = `${percent}%`;
  els.sprintScore.textContent = state.sprint.active || state.sprint.complete
    ? `${state.sprint.correct} / ${total} correct`
    : `Best score: ${state.sprintBest}%`;
  if (state.sprint.complete) {
    const result = Math.round((state.sprint.correct / total) * 100);
    els.sprintStatus.textContent = result >= SPRINT_PASS_PERCENT ? "Passed" : "Review and retry";
    els.sprintStatus.className = result >= SPRINT_PASS_PERCENT ? "checkpoint-ready" : "";
    return;
  }
  els.sprintStatus.textContent = state.sprint.active ? `Question ${state.sprint.index + 1} / ${total}` : "Ready";
  els.sprintStatus.className = "";
}

function formatSprintAttemptDate(isoDate) {
  return new Date(isoDate).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderSprintHistory() {
  if (!els.sprintHistoryList) return;
  if (!state.sprintHistory.length) {
    els.sprintHistoryList.innerHTML = '<p class="section-copy">No sprint attempts yet.</p>';
    els.clearSprintHistoryButton.disabled = true;
    return;
  }
  els.clearSprintHistoryButton.disabled = false;
  els.sprintHistoryList.innerHTML = state.sprintHistory.slice(0, 6).map((attempt) => {
    const passed = attempt.percent >= SPRINT_PASS_PERCENT;
    return `
      <section class="sprint-history-item">
        <div>
          <strong>${passed ? "Passed" : "Review run"} - ${attempt.correct}/${attempt.total} correct</strong>
          <span>${formatSprintAttemptDate(attempt.completedAt)}</span>
        </div>
        <span class="sprint-history-score ${passed ? "" : "retry"}">${attempt.percent}%</span>
      </section>
    `;
  }).join("");
}

function renderSprintQuestion() {
  const question = state.sprint.current;
  if (!question) {
    els.sprintQuestionMeta.textContent = "Mixed N5 sprint";
    els.sprintQuestionText.textContent = "Start a 12-question checkpoint run.";
    els.sprintQuestionHint.textContent = `Pass target: ${SPRINT_PASS_PERCENT}%. Questions mix vocabulary, particles, grammar, and sentence reading.`;
    els.sprintChoices.innerHTML = "";
    els.sprintFeedback.textContent = "";
    els.sprintFeedback.className = "feedback";
    els.nextSprintButton.disabled = true;
    renderSprintProgress();
    return;
  }
  els.sprintQuestionMeta.textContent = question.meta;
  els.sprintQuestionText.textContent = question.prompt;
  els.sprintQuestionHint.textContent = question.hint;
  els.sprintFeedback.textContent = "";
  els.sprintFeedback.className = "feedback";
  els.sprintChoices.innerHTML = question.choices.map((choice) => `
    <button type="button" data-sprint-answer="${choice}">${choice}</button>
  `).join("");
  els.nextSprintButton.disabled = true;
  renderSprintProgress();
}

function startSprint() {
  state.sprint = {
    active: true,
    complete: false,
    questions: buildSprintQuestions(),
    index: 0,
    correct: 0,
    answered: false,
    current: null
  };
  state.sprint.current = state.sprint.questions[0];
  els.startSprintButton.textContent = "Restart Sprint";
  renderSprintQuestion();
}

function finishSprint() {
  state.sprint.active = false;
  state.sprint.complete = true;
  const percent = Math.round((state.sprint.correct / state.sprint.questions.length) * 100);
  state.sprintBest = Math.max(state.sprintBest, percent);
  state.sprintHistory = [
    {
      completedAt: new Date().toISOString(),
      percent,
      correct: state.sprint.correct,
      total: state.sprint.questions.length
    },
    ...state.sprintHistory
  ].slice(0, 20);
  saveProgress();
  renderProgress();
  els.sprintChoices.innerHTML = "";
  els.sprintQuestionMeta.textContent = "Sprint complete";
  els.sprintQuestionText.textContent = `${percent}%`;
  els.sprintQuestionHint.textContent = percent >= SPRINT_PASS_PERCENT
    ? "Starter sprint passed. Review the current coverage before treating any N5 area as complete."
    : "Retake the sprint after reviewing the missed areas.";
  els.sprintFeedback.textContent = `${state.sprint.correct} correct out of ${state.sprint.questions.length}. Best score: ${state.sprintBest}%.`;
  els.sprintFeedback.className = percent >= SPRINT_PASS_PERCENT ? "feedback success" : "feedback needs-review";
  els.nextSprintButton.disabled = true;
  renderSprintProgress();
  renderSprintHistory();
}

function clearSprintHistory() {
  state.sprintHistory = [];
  saveProgress();
  renderSprintHistory();
}

function checkSprintAnswer(answer) {
  if (!state.sprint.current || state.sprint.answered) return;
  state.sprint.answered = true;
  els.sprintChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  if (answer === state.sprint.current.answer) {
    state.correct += 1;
    state.streak += 1;
    state.sprint.correct += 1;
    recordPracticeEvent("sprint", `sprint ${state.sprint.current.mode}`, true);
    els.sprintFeedback.textContent = `Correct. ${state.sprint.current.explanation}`;
    els.sprintFeedback.className = "feedback success";
  } else {
    state.review += 1;
    state.streak = 0;
    recordPracticeEvent("sprint", `sprint ${state.sprint.current.mode}`, false);
    addReviewQuestion(state.sprint.current);
    els.sprintFeedback.textContent = `Review this: ${state.sprint.current.explanation}`;
    els.sprintFeedback.className = "feedback needs-review";
  }
  els.nextSprintButton.disabled = false;
  saveProgress();
  renderProgress();
}

function nextSprintQuestion() {
  if (!state.sprint.active || !state.sprint.answered) return;
  if (state.sprint.index >= state.sprint.questions.length - 1) {
    finishSprint();
    return;
  }
  state.sprint.index += 1;
  state.sprint.answered = false;
  state.sprint.current = state.sprint.questions[state.sprint.index];
  renderSprintQuestion();
}

function chooseN5Mode(mode) {
  state.n5Mode = mode;
  syncPressedState("[data-n5-mode]", (button) => button.dataset.n5Mode === mode);
  startN5Question();
}

function checkN5Answer(answer) {
  if (!state.n5Question) return;
  const isReview = state.n5ReviewActive;
  els.n5Choices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  if (answer === state.n5Question.answer) {
    state.correct += 1;
    state.streak += 1;
    if (isReview) {
      recordPracticeEvent("review", `review ${state.n5Question.reviewSourceMode || state.n5Question.mode}`, true);
      const item = state.n5ReviewQueue.find((reviewItem) => reviewItem.key === state.n5Question.reviewKey);
      const result = item ? scheduleReviewedItem(item) : "cleared";
      els.n5Feedback.textContent = result === "cleared"
        ? `Cleared from review. ${state.n5Question.explanation}`
        : `Correct. Scheduled again in ${result}. ${state.n5Question.explanation}`;
    } else {
      state.n5ModeCorrect[state.n5Mode] = (state.n5ModeCorrect[state.n5Mode] || 0) + 1;
      recordPracticeEvent("n5", `n5 ${state.n5Mode}`, true);
      els.n5Feedback.textContent = `Correct. ${state.n5Question.explanation}`;
    }
    els.n5Feedback.className = "feedback success";
  } else {
    state.review += 1;
    state.streak = 0;
    recordPracticeEvent(isReview ? "review" : "n5", `${isReview ? "review" : "n5"} ${state.n5Question.reviewSourceMode || state.n5Mode}`, false);
    addReviewQuestion(state.n5Question);
    els.n5Feedback.textContent = `Added to weak-item review. ${state.n5Question.explanation}`;
    els.n5Feedback.className = "feedback needs-review";
  }
  saveProgress();
  renderProgress();
  if (isReview && answer === state.n5Question.answer) {
    window.setTimeout(startReviewQuestion, 650);
  }
}

function resetProgress() {
  state.correct = 0;
  state.review = 0;
  state.streak = 0;
  state.foundationDone = 0;
  state.kanaHits = { hiragana: {}, katakana: {} };
  state.kanaRowProgress = JapanReadyKanaLessons.normalizeProgress({}, n5Content.kanaDecks);
  state.kanaLesson = { deck: "hiragana", rowId: "vowels", current: null, answered: false, renderToken: 0 };
  state.vocabularyProgress = JapanReadyVocabularyLessons.normalizeProgress({}, n5Content.n5Vocabulary);
  state.vocabularyCourse = {
    unitId: JapanReadyVocabularyLessons.UNITS[0].id,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    correct: 0,
    attempts: 0,
    missed: new Set()
  };
  state.grammarProgress = JapanReadyGrammarLessons.normalizeProgress({});
  state.grammarCourse = {
    unitId: JapanReadyGrammarLessons.UNITS[0].id,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    selectedTokens: [],
    correct: 0,
    attempts: 0,
    missed: new Set()
  };
  state.kanaMode = "recognition";
  state.onboardingFocus = "";
  state.n5ModeCorrect = { vocab: 0, particles: 0, grammar: 0, sentences: 0 };
  state.n5ReviewActive = false;
  state.n5ReviewQueue = [];
  state.lastQuizKey = "";
  state.studyStats = { days: {}, sessions: [] };
  state.selectedStudyMinutes = 15;
  resetStudyTimerForNextSession();
  state.sprintBest = 0;
  state.sprintHistory = [];
  state.sessionReflection = freshSessionReflection();
  state.miniSession = {
    active: false,
    complete: false,
    focus: "",
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    current: null,
    latest: {}
  };
  state.sprint = { active: false, complete: false, questions: [], index: 0, correct: 0, answered: false, current: null };
  saveProgress();
  renderProgress();
  renderSprintQuestion();
  renderSprintHistory();
  renderMiniSession();
  setStudyDuration(15);
  renderKanaModeButtons();
  renderKanaLesson();
  renderVocabularyCourse();
  renderGrammarCourse();
  startQuiz();
}

function resetCurrentDeck() {
  state.kanaHits[state.deck] = {};
  state.kanaRowProgress[state.deck] = JapanReadyKanaLessons.normalizeProgress({}, n5Content.kanaDecks)[state.deck];
  const nextLesson = JapanReadyKanaLessons.nextIncomplete(state.kanaRowProgress, n5Content.kanaDecks)
    || { deck: "hiragana", rowId: "vowels" };
  state.kanaLesson = { ...state.kanaLesson, ...nextLesson, current: null, answered: false };
  state.lastQuizKey = "";
  saveProgress();
  renderDeckProgress();
  renderKanaLesson();
  renderRoadmapResume();
  startQuiz();
}

function romajiToHiragana(input) {
  let text = input.toLowerCase().replace(/[^a-z\s-]/g, "");
  let output = "";
  while (text.length) {
    if (text[0] === " " || text[0] === "-") {
      output += text[0];
      text = text.slice(1);
      continue;
    }
    if (text.length > 1 && text[0] === text[1] && !"aeioun".includes(text[0])) {
      output += "っ";
      text = text.slice(1);
      continue;
    }
    const match = romajiMap.find(([romaji]) => text.startsWith(romaji));
    if (match) {
      output += match[1];
      text = text.slice(match[0].length);
    } else {
      output += text[0];
      text = text.slice(1);
    }
  }
  return output;
}

function findNameTransliteration(input) {
  return JapanReadyNameHelper.findCuratedName(input, n5Content.nameTransliterations);
}

function hiraganaToKatakana(text) {
  return katakanaPairs.reduce((converted, pair) => converted.replaceAll(pair[0], pair[1]), text);
}

function updateTyping() {
  const nameMatch = findNameTransliteration(els.romajiInput.value);
  const hiragana = nameMatch ? nameMatch.hiragana : romajiToHiragana(els.romajiInput.value);
  const katakana = nameMatch ? nameMatch.katakana : hiraganaToKatakana(hiragana);
  els.hiraganaOutput.textContent = hiragana || " ";
  els.katakanaOutput.textContent = katakana || " ";
  updateTypingFeedback(hiragana, nameMatch);
}

function updateTypingFeedback(hiragana, nameMatch = null) {
  if (nameMatch) {
    els.typingTargetLabel.textContent = `Katakana name helper -> ${nameMatch.katakana}`;
    els.typingFeedback.textContent = nameMatch.note;
    els.typingFeedback.className = "feedback success";
    return;
  }
  if (!state.typingTarget) {
    els.typingFeedback.textContent = "";
    els.typingFeedback.className = "feedback";
    return;
  }
  if (!els.romajiInput.value.trim()) {
    els.typingFeedback.textContent = `Expected hiragana: ${state.typingTarget.hiragana}`;
    els.typingFeedback.className = "feedback";
    return;
  }
  if (hiragana === state.typingTarget.hiragana) {
    els.typingFeedback.textContent = "Correct kana for this target.";
    els.typingFeedback.className = "feedback success";
  } else {
    els.typingFeedback.textContent = `Not yet. Expected: ${state.typingTarget.hiragana}`;
    els.typingFeedback.className = "feedback needs-review";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function renderNameResult() {
  const rawName = els.nameInput.value.trim();
  if (!rawName) {
    els.nameResult.innerHTML = `<p>Type a name to get a Katakana helper suggestion.</p>`;
    return;
  }
  const suggestion = JapanReadyNameHelper.suggestKatakanaName(rawName, n5Content.nameTransliterations);
  if (!suggestion) {
    els.nameResult.innerHTML = `
      <section>
        <span>Needs pronunciation</span>
        <strong>Check sound first</strong>
        <p>I could not make a reliable Katakana helper suggestion from the spelling alone.</p>
        <small>Foreign names should be converted from pronunciation. Add this name to the curated list after confirming the common Katakana form.</small>
      </section>
    `;
    return;
  }
  const label = suggestion.source === "curated" ? "Curated helper suggestion" : "Rough helper suggestion";
  els.nameResult.innerHTML = `
    <section>
      <span>${label}</span>
      <label class="input-label" for="nameSuggestionOutput">Editable Katakana</label>
      <div class="name-output-row">
        <input id="nameSuggestionOutput" class="name-output-edit" type="text" lang="ja" value="${escapeHtml(suggestion.katakana)}" aria-label="Editable Katakana suggestion">
        <button class="secondary-action" type="button" data-copy-name>Copy</button>
      </div>
      <p>${escapeHtml(rawName)} was matched from the sound cue: ${escapeHtml(suggestion.sound)}.</p>
      <small>${escapeHtml(suggestion.note)} Native review is recommended for official, personal, or printed use.</small>
    </section>
  `;
}

function copyNameSuggestion() {
  const output = document.querySelector("#nameSuggestionOutput");
  if (!output) return;
  const status = els.nameResult.querySelector("small");
  const value = output.value.trim();
  if (!value) return;
  const finish = (message) => {
    if (status) status.textContent = message;
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value)
      .then(() => finish("Copied. Keep it editable and ask a fluent speaker before using it officially."))
      .catch(() => finish("Could not copy automatically. You can still select and copy the editable Katakana."));
    return;
  }
  output.select();
  const copied = document.execCommand("copy");
  finish(copied ? "Copied. Keep it editable and ask a fluent speaker before using it officially." : "Select the editable Katakana and copy it manually.");
}

function renderMiniCards() {
  els.typingTargets.innerHTML = n5Content.starterPhrases.slice(0, 5).map((phrase) => {
    const romaji = phrase.romaji.toLowerCase().replaceAll(".", "");
    const hiragana = romajiToHiragana(romaji);
    return `
    <button type="button" data-type-target="${romaji}" data-type-hiragana="${hiragana}" data-type-english="${phrase.english}">
      <strong>${phrase.romaji}</strong>
      <span>${phrase.english}</span>
      <small lang="ja">${hiragana}</small>
    </button>
  `;
  }).join("");
  els.vocabList.innerHTML = availableVocabularyWords().map((item) => `
    <section>
      <strong lang="ja">${item.japanese}</strong>
      <span>${item.romaji}</span>
      <p>${item.english}</p>
      <small>${item.category}</small>
    </section>
  `).join("");
  els.particleList.innerHTML = n5Content.particles.map((item) => `
    <section>
      <strong lang="ja">${item.particle}</strong>
      <span>${item.romaji} - ${item.role}</span>
      <p lang="ja">${item.example}</p>
      <small>${item.english}</small>
    </section>
  `).join("");
  els.grammarList.innerHTML = n5Content.grammarPatterns.map((item) => `
    <section>
      <strong lang="ja">${item.pattern}</strong>
      <span>${item.romaji}</span>
      <p>${item.meaning}</p>
      <small lang="ja">${item.example}</small>
    </section>
  `).join("");
  els.starterPhraseList.innerHTML = n5Content.starterPhrases.map((phrase) => `
    <section>
      <strong lang="ja">${phrase.japanese}</strong>
      <span>${phrase.romaji}</span>
      <p>${phrase.english}</p>
      <small>${phrase.note}</small>
    </section>
  `).join("");
}

function renderCoverageStats() {
  const stats = [
    { label: "Hiragana", value: n5Content.kanaDecks.hiragana.length, target: "core set" },
    { label: "Katakana", value: n5Content.kanaDecks.katakana.length, target: "core set" },
    { label: "Vocabulary", value: n5Content.n5Vocabulary.length, target: "starter seed" },
    { label: "Particles", value: n5Content.particles.length, target: "N5 basics" },
    { label: "Grammar", value: n5Content.grammarPatterns.length, target: "starter nodes" },
    { label: "Guided grammar", value: JapanReadyGrammarLessons.allQuestions().length, target: "first finite block" },
    { label: "Sentence Qs", value: n5Content.sentencePractice.length, target: "reading checks" },
    { label: "Practice Qs", value: n5Content.particlePractice.length + n5Content.grammarPractice.length + n5Content.sentencePractice.length, target: "plus generated vocab" }
  ];
  els.coverageStats.innerHTML = stats.map((item) => `
    <div>
      <dt>${item.label}</dt>
      <dd>${item.value}</dd>
      <span>${item.target}</span>
    </div>
  `).join("");
}

function currentVocabularyUnit() {
  return JapanReadyVocabularyLessons.UNITS.find((unit) => unit.id === state.vocabularyCourse.unitId)
    || JapanReadyVocabularyLessons.UNITS[0];
}

function availableVocabularyWords() {
  return JapanReadyVocabularyLessons.UNITS
    .filter((unit) => JapanReadyVocabularyLessons.isUnlocked(
      state.vocabularyProgress,
      unit.id,
      n5Content.n5Vocabulary
    ))
    .flatMap((unit) => JapanReadyVocabularyLessons.wordsFor(unit.id, n5Content.n5Vocabulary));
}

function currentVocabularyWord() {
  const key = state.vocabularyCourse.queue[0];
  return JapanReadyVocabularyLessons.allWords(n5Content.n5Vocabulary)
    .find((word) => JapanReadyVocabularyLessons.wordKey(word) === key) || null;
}

function shuffledVocabularyChoices(word, unit) {
  const choices = JapanReadyVocabularyLessons.wordsFor(unit.id, n5Content.n5Vocabulary)
    .filter((candidate) => candidate.english !== word.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((candidate) => candidate.english);
  return [...choices, word.english].sort(() => Math.random() - 0.5);
}

function renderVocabularyCourse(options = {}) {
  const unit = currentVocabularyUnit();
  const units = JapanReadyVocabularyLessons.UNITS;
  const unitIndex = units.findIndex((candidate) => candidate.id === unit.id);
  const allDone = state.vocabularyProgress.completed.length;
  const unitStatus = JapanReadyVocabularyLessons.unitStatus(state.vocabularyProgress, unit.id, n5Content.n5Vocabulary);

  els.vocabCourseStatus.textContent = `${allDone} / 50 words`;
  els.vocabCourseBar.style.width = `${Math.round((allDone / 50) * 100)}%`;
  els.vocabCourseCount.textContent = `Unit ${unitIndex + 1} of ${units.length} - ${unitStatus.done}/10 complete`;
  els.vocabUnitList.innerHTML = units.map((candidate, index) => {
    const status = JapanReadyVocabularyLessons.unitStatus(state.vocabularyProgress, candidate.id, n5Content.n5Vocabulary);
    const unlocked = JapanReadyVocabularyLessons.isUnlocked(state.vocabularyProgress, candidate.id, n5Content.n5Vocabulary);
    const active = candidate.id === unit.id;
    return `
      <button type="button" data-vocab-unit="${candidate.id}" ${unlocked ? "" : "disabled"} aria-pressed="${active}">
        <span>Unit ${index + 1}</span>
        <strong>${candidate.title}</strong>
        <small>${unlocked ? `${status.done}/10 words` : "Locked"}</small>
      </button>
    `;
  }).join("");

  if (state.vocabularyCourse.phase === "teach") {
    els.vocabTeachPanel.classList.remove("hidden");
    els.vocabQuizPanel.classList.add("hidden");
    els.vocabUnitMeta.textContent = `Unit ${unitIndex + 1} - Study before the check`;
    els.vocabUnitTitle.textContent = unit.title;
    els.vocabUnitDescription.textContent = unit.description;
    els.vocabStudyList.innerHTML = JapanReadyVocabularyLessons.wordsFor(unit.id, n5Content.n5Vocabulary).map((word) => {
      const complete = state.vocabularyProgress.completed.includes(JapanReadyVocabularyLessons.wordKey(word));
      return `
        <div${complete ? ' data-complete="true"' : ""}>
          <strong lang="ja">${word.japanese}</strong>
          <span class="vocab-study-pronunciation">
            <span>Romaji: ${word.romaji}</span>
            <small>Say it like: ${JapanReadyVocabularyLessons.pronunciationFor(word)}</small>
          </span>
          <p>${word.english}</p>
        </div>
      `;
    }).join("");
    els.startVocabUnitButton.textContent = unitStatus.complete ? "Review This 10-Word Unit" : `Start ${10 - unitStatus.done}-Word Check`;
    if (options.focus) els.vocabUnitTitle.focus({ preventScroll: true });
    return;
  }

  els.vocabTeachPanel.classList.add("hidden");
  els.vocabQuizPanel.classList.remove("hidden");

  if (state.vocabularyCourse.phase === "complete") {
    const nextUnit = units[unitIndex + 1] || null;
    els.vocabQuestionMeta.textContent = `Unit ${unitIndex + 1} complete`;
    els.vocabQuestionText.textContent = unitIndex + 1 === units.length ? "50-word starter block complete" : `${unit.title} complete`;
    els.vocabQuestionRomaji.textContent = `${unitStatus.done}/10 unique words complete. ${state.vocabularyCourse.missed.size} word${state.vocabularyCourse.missed.size === 1 ? "" : "s"} needed another try this session.`;
    els.vocabChoices.innerHTML = "";
    els.vocabFeedback.textContent = nextUnit
      ? "The next ten-word unit is now available."
      : "This is the first 50-word block, not the full planned N5 vocabulary path.";
    els.vocabFeedback.className = "feedback success";
    els.vocabContinueButton.disabled = !nextUnit;
    els.vocabContinueButton.textContent = nextUnit ? `Continue to Unit ${unitIndex + 2}` : "50-Word Block Complete";
    if (options.focus) els.vocabQuestionText.focus({ preventScroll: true });
    return;
  }

  const word = currentVocabularyWord();
  if (!word) {
    state.vocabularyCourse.phase = "complete";
    renderVocabularyCourse(options);
    return;
  }
  const completedInUnit = unitStatus.done;
  els.vocabQuestionMeta.textContent = `Unit ${unitIndex + 1} - ${completedInUnit}/10 complete - ${state.vocabularyCourse.queue.length} in this check`;
  els.vocabQuestionText.textContent = word.japanese;
  els.vocabQuestionRomaji.textContent = `Romaji: ${word.romaji} · Say it like: ${JapanReadyVocabularyLessons.pronunciationFor(word)}`;
  els.vocabChoices.innerHTML = shuffledVocabularyChoices(word, unit).map((choice) => `
    <button type="button" data-vocab-answer="${escapeHtml(choice)}">${choice}</button>
  `).join("");
  els.vocabFeedback.textContent = "";
  els.vocabFeedback.className = "feedback";
  els.vocabContinueButton.disabled = true;
  els.vocabContinueButton.textContent = "Next Word";
  state.vocabularyCourse.answered = false;
  if (options.focus) els.vocabQuestionText.focus({ preventScroll: true });
}

function selectVocabularyUnit(unitId, options = {}) {
  if (!JapanReadyVocabularyLessons.isUnlocked(state.vocabularyProgress, unitId, n5Content.n5Vocabulary)) return;
  state.vocabularyCourse = {
    ...state.vocabularyCourse,
    unitId,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    correct: 0,
    attempts: 0,
    missed: new Set()
  };
  saveProgress();
  renderVocabularyCourse(options);
}

function startVocabularyUnit() {
  const unit = currentVocabularyUnit();
  const remaining = JapanReadyVocabularyLessons.remainingWords(state.vocabularyProgress, unit.id, n5Content.n5Vocabulary);
  const words = remaining.length ? remaining : JapanReadyVocabularyLessons.wordsFor(unit.id, n5Content.n5Vocabulary);
  state.vocabularyCourse.phase = "quiz";
  state.vocabularyCourse.queue = words.map(JapanReadyVocabularyLessons.wordKey);
  state.vocabularyCourse.answered = false;
  state.vocabularyCourse.lastCorrect = false;
  state.vocabularyCourse.correct = 0;
  state.vocabularyCourse.attempts = 0;
  state.vocabularyCourse.missed = new Set();
  renderVocabularyCourse({ focus: true });
}

function checkVocabularyAnswer(answer) {
  if (state.vocabularyCourse.answered || state.vocabularyCourse.phase !== "quiz") return;
  const word = currentVocabularyWord();
  if (!word) return;
  const correct = answer === word.english;
  state.vocabularyCourse.answered = true;
  state.vocabularyCourse.lastCorrect = correct;
  state.vocabularyCourse.attempts += 1;
  els.vocabChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.vocabAnswer === word.english) button.classList.add("correct");
    if (!correct && button.dataset.vocabAnswer === answer) button.classList.add("incorrect");
  });
  if (correct) {
    state.vocabularyProgress = JapanReadyVocabularyLessons.markComplete(state.vocabularyProgress, word, n5Content.n5Vocabulary);
    if (JapanReadyVocabularyLessons.unitStatus(state.vocabularyProgress, currentVocabularyUnit().id, n5Content.n5Vocabulary).complete) {
      renderMiniCards();
    }
    state.vocabularyCourse.correct += 1;
    state.correct += 1;
    state.streak += 1;
    state.n5ModeCorrect.vocab = Math.max(state.n5ModeCorrect.vocab || 0, Math.min(state.vocabularyProgress.completed.length, N5_MODE_TARGETS.vocab));
    els.vocabFeedback.textContent = `Correct. ${word.japanese} (${word.romaji}) means ${word.english}. Say it like ${JapanReadyVocabularyLessons.pronunciationFor(word)}.`;
    els.vocabFeedback.className = "feedback success";
  } else {
    state.vocabularyCourse.missed.add(JapanReadyVocabularyLessons.wordKey(word));
    state.review += 1;
    state.streak = 0;
    els.vocabFeedback.textContent = `Not yet. ${word.japanese} (${word.romaji}) means ${word.english}. Say it like ${JapanReadyVocabularyLessons.pronunciationFor(word)}. This word will return before the unit finishes.`;
    els.vocabFeedback.className = "feedback needs-review";
  }
  recordPracticeEvent("n5", "guided vocabulary", correct);
  saveProgress();
  renderProgress();
  els.vocabContinueButton.disabled = false;
  els.vocabContinueButton.textContent = state.vocabularyCourse.queue.length === 1 && correct ? "Finish Unit" : "Next Word";
  els.vocabFeedback.focus({ preventScroll: true });
}

function continueVocabularyCourse() {
  const unit = currentVocabularyUnit();
  const unitIndex = JapanReadyVocabularyLessons.UNITS.findIndex((candidate) => candidate.id === unit.id);
  if (state.vocabularyCourse.phase === "complete") {
    const nextUnit = JapanReadyVocabularyLessons.UNITS[unitIndex + 1];
    if (nextUnit) selectVocabularyUnit(nextUnit.id, { focus: true });
    return;
  }
  if (!state.vocabularyCourse.answered) return;
  const currentKey = state.vocabularyCourse.queue.shift();
  if (!state.vocabularyCourse.lastCorrect) state.vocabularyCourse.queue.push(currentKey);
  if (!state.vocabularyCourse.queue.length) {
    state.vocabularyCourse.phase = "complete";
    saveProgress();
    renderProgress();
    renderVocabularyCourse({ focus: true });
    return;
  }
  renderVocabularyCourse({ focus: true });
}

function currentGrammarUnit() {
  return JapanReadyGrammarLessons.UNITS.find((unit) => unit.id === state.grammarCourse.unitId)
    || JapanReadyGrammarLessons.UNITS[0];
}

function currentGrammarQuestion() {
  const id = state.grammarCourse.queue[0];
  return JapanReadyGrammarLessons.allQuestions().find((question) => question.id === id) || null;
}

function renderGrammarAssembly(question) {
  const selected = state.grammarCourse.selectedTokens;
  els.grammarAssemblyAnswer.innerHTML = selected.length
    ? selected.map((token, index) => `
        <button type="button" data-grammar-remove-index="${index}" aria-label="Remove ${escapeHtml(token)} from the sentence">${escapeHtml(token)}</button>
      `).join("")
    : '<span>Choose words below.</span>';
  els.grammarTokenBank.innerHTML = question.tokens.map((token, index) => {
    const used = selected.includes(token.text);
    return `
      <button type="button" data-grammar-token-index="${index}" ${used ? "disabled" : ""}>
        <strong lang="ja">${token.text}</strong>
        <span>${token.romaji}</span>
      </button>
    `;
  }).join("");
  els.resetGrammarAssemblyButton.disabled = !selected.length || state.grammarCourse.answered;
  els.checkGrammarAssemblyButton.disabled = state.grammarCourse.answered
    || selected.length !== question.answerTokens.length;
}

function renderGrammarCourse(options = {}) {
  const unit = currentGrammarUnit();
  const units = JapanReadyGrammarLessons.UNITS;
  const unitIndex = units.findIndex((candidate) => candidate.id === unit.id);
  const total = JapanReadyGrammarLessons.allQuestions().length;
  const allDone = state.grammarProgress.completed.length;
  const unitStatus = JapanReadyGrammarLessons.unitStatus(state.grammarProgress, unit.id);

  els.grammarCourseStatus.textContent = `${allDone} / ${total} checks`;
  els.grammarCourseBar.style.width = `${Math.round((allDone / total) * 100)}%`;
  els.grammarCourseCount.textContent = `Lesson ${unitIndex + 1} of ${units.length} - ${unitStatus.done}/${unitStatus.total} complete`;
  els.grammarUnitList.innerHTML = units.map((candidate, index) => {
    const status = JapanReadyGrammarLessons.unitStatus(state.grammarProgress, candidate.id);
    const unlocked = JapanReadyGrammarLessons.isUnlocked(state.grammarProgress, candidate.id);
    return `
      <button type="button" data-grammar-unit="${candidate.id}" ${unlocked ? "" : "disabled"} aria-pressed="${candidate.id === unit.id}">
        <span>Lesson ${index + 1}</span>
        <strong>${candidate.title}</strong>
        <small>${unlocked ? `${status.done}/${status.total} checks` : "Locked"}</small>
      </button>
    `;
  }).join("");

  if (state.grammarCourse.phase === "teach") {
    els.grammarTeachPanel.classList.remove("hidden");
    els.grammarQuizPanel.classList.add("hidden");
    els.grammarUnitMeta.textContent = `Lesson ${unitIndex + 1} - Study before the check`;
    els.grammarUnitTitle.textContent = unit.title;
    els.grammarUnitDescription.textContent = unit.description;
    els.grammarUnitNote.textContent = unit.note;
    els.grammarHelperWords.innerHTML = unit.helperWords.length
      ? `<strong>Lesson helper:</strong> ${unit.helperWords.map(escapeHtml).join(", ")}. This helper is not counted among the 50 completed vocabulary words.`
      : "";
    els.grammarHelperWords.classList.toggle("hidden", !unit.helperWords.length);
    els.grammarExamples.innerHTML = unit.examples.map((example) => `
      <div>
        <strong lang="ja">${example.japanese}</strong>
        <span>${example.romaji}</span>
        <p>${example.english}</p>
      </div>
    `).join("");
    els.startGrammarUnitButton.textContent = unitStatus.complete
      ? `Review This ${unitStatus.total}-Check Lesson`
      : `Start ${unitStatus.total - unitStatus.done}-Check Lesson`;
    if (options.focus) els.grammarUnitTitle.focus({ preventScroll: true });
    return;
  }

  els.grammarTeachPanel.classList.add("hidden");
  els.grammarQuizPanel.classList.remove("hidden");

  if (state.grammarCourse.phase === "complete") {
    const nextUnit = units[unitIndex + 1] || null;
    els.grammarQuestionMeta.textContent = `Lesson ${unitIndex + 1} complete`;
    els.grammarQuestionPrompt.textContent = unitIndex + 1 === units.length
      ? `${total}-check first grammar block complete`
      : `${unit.title} complete`;
    els.grammarQuestionJapanese.textContent = "";
    els.grammarQuestionJapanese.classList.add("hidden");
    els.grammarQuestionRomaji.textContent = `${unitStatus.done}/${unitStatus.total} unique checks complete. ${state.grammarCourse.missed.size} check${state.grammarCourse.missed.size === 1 ? "" : "s"} needed another try this session.`;
    els.grammarChoices.innerHTML = "";
    els.grammarAssembly.classList.add("hidden");
    els.grammarFeedback.textContent = nextUnit
      ? "The next sentence lesson is now available."
      : "You cleared this first guided block. That is a finish line, not a claim of grammar mastery or full N5 coverage.";
    els.grammarFeedback.className = "feedback success";
    els.grammarContinueButton.disabled = !nextUnit;
    els.grammarContinueButton.textContent = nextUnit ? `Continue to Lesson ${unitIndex + 2}` : "First Grammar Block Complete";
    if (options.focus) els.grammarQuestionPrompt.focus({ preventScroll: true });
    return;
  }

  const question = currentGrammarQuestion();
  if (!question) {
    state.grammarCourse.phase = "complete";
    renderGrammarCourse(options);
    return;
  }
  els.grammarQuestionMeta.textContent = `Lesson ${unitIndex + 1} - ${unitStatus.done}/${unitStatus.total} complete - ${state.grammarCourse.queue.length} in this check`;
  els.grammarQuestionPrompt.textContent = question.prompt;
  els.grammarQuestionJapanese.textContent = question.japanese || "";
  els.grammarQuestionJapanese.classList.toggle("hidden", !question.japanese);
  els.grammarQuestionRomaji.textContent = question.romaji || "";
  els.grammarFeedback.textContent = "";
  els.grammarFeedback.className = "feedback";
  els.grammarContinueButton.disabled = !state.grammarCourse.answered;
  els.grammarContinueButton.textContent = "Continue";

  if (question.type === "assembly") {
    els.grammarChoices.innerHTML = "";
    els.grammarAssembly.classList.remove("hidden");
    renderGrammarAssembly(question);
  } else {
    els.grammarAssembly.classList.add("hidden");
    els.grammarChoices.innerHTML = question.choices.map((choice) => `
      <button type="button" data-grammar-answer="${escapeHtml(choice)}" ${state.grammarCourse.answered ? "disabled" : ""}>${choice}</button>
    `).join("");
  }
  if (options.focus) els.grammarQuestionPrompt.focus({ preventScroll: true });
}

function selectGrammarUnit(unitId, options = {}) {
  if (!JapanReadyGrammarLessons.isUnlocked(state.grammarProgress, unitId)) return;
  state.grammarCourse = {
    unitId,
    phase: "teach",
    queue: [],
    answered: false,
    lastCorrect: false,
    selectedTokens: [],
    correct: 0,
    attempts: 0,
    missed: new Set()
  };
  saveProgress();
  renderGrammarCourse(options);
}

function startGrammarUnit() {
  const unit = currentGrammarUnit();
  const remaining = JapanReadyGrammarLessons.remainingQuestions(state.grammarProgress, unit.id);
  const questions = remaining.length ? remaining : JapanReadyGrammarLessons.questionsFor(unit.id);
  state.grammarCourse.phase = "quiz";
  state.grammarCourse.queue = questions.map((question) => question.id);
  state.grammarCourse.answered = false;
  state.grammarCourse.lastCorrect = false;
  state.grammarCourse.selectedTokens = [];
  state.grammarCourse.correct = 0;
  state.grammarCourse.attempts = 0;
  state.grammarCourse.missed = new Set();
  renderGrammarCourse({ focus: true });
}

function answerGrammarQuestion(answer) {
  if (state.grammarCourse.answered || state.grammarCourse.phase !== "quiz") return;
  const question = currentGrammarQuestion();
  if (!question) return;
  const correct = answer === question.answer;
  state.grammarCourse.answered = true;
  state.grammarCourse.lastCorrect = correct;
  state.grammarCourse.attempts += 1;
  els.grammarChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.grammarAnswer === question.answer) button.classList.add("correct-answer");
    if (!correct && button.dataset.grammarAnswer === answer) button.classList.add("wrong-answer");
  });
  if (correct) {
    state.grammarProgress = JapanReadyGrammarLessons.markComplete(state.grammarProgress, question);
    state.grammarCourse.correct += 1;
    state.correct += 1;
    state.streak += 1;
    state.n5ModeCorrect[question.mode] = Math.min(
      N5_MODE_TARGETS[question.mode],
      (state.n5ModeCorrect[question.mode] || 0) + 1
    );
    els.grammarFeedback.textContent = `Correct. ${question.explanation}`;
    els.grammarFeedback.className = "feedback success";
  } else {
    state.grammarCourse.missed.add(question.id);
    state.review += 1;
    state.streak = 0;
    els.grammarFeedback.textContent = `Not yet. ${question.explanation} Correct answer: ${question.answer} (${question.romaji || "shown above"}). This check will return before the lesson finishes.`;
    els.grammarFeedback.className = "feedback needs-review";
  }
  els.grammarContinueButton.disabled = false;
  saveProgress();
  renderProgress();
  els.grammarFeedback.focus({ preventScroll: true });
}

function addGrammarToken(index) {
  const question = currentGrammarQuestion();
  if (!question || question.type !== "assembly" || state.grammarCourse.answered) return;
  const token = question.tokens[index];
  if (!token || state.grammarCourse.selectedTokens.includes(token.text)) return;
  state.grammarCourse.selectedTokens.push(token.text);
  renderGrammarAssembly(question);
}

function removeGrammarToken(index) {
  if (state.grammarCourse.answered) return;
  state.grammarCourse.selectedTokens.splice(index, 1);
  renderGrammarAssembly(currentGrammarQuestion());
}

function resetGrammarAssembly() {
  if (state.grammarCourse.answered) return;
  state.grammarCourse.selectedTokens = [];
  renderGrammarAssembly(currentGrammarQuestion());
}

function checkGrammarAssembly() {
  const question = currentGrammarQuestion();
  if (!question || question.type !== "assembly") return;
  answerGrammarQuestion(
    state.grammarCourse.selectedTokens.join("") === question.answerTokens.join("")
      ? question.answer
      : state.grammarCourse.selectedTokens.join("")
  );
  renderGrammarAssembly(question);
}

function continueGrammarCourse() {
  if (state.grammarCourse.phase === "complete") {
    const units = JapanReadyGrammarLessons.UNITS;
    const nextUnit = units[units.findIndex((unit) => unit.id === state.grammarCourse.unitId) + 1];
    if (nextUnit) selectGrammarUnit(nextUnit.id, { focus: true });
    return;
  }
  if (!state.grammarCourse.answered) return;
  const currentId = state.grammarCourse.queue.shift();
  if (!state.grammarCourse.lastCorrect) state.grammarCourse.queue.push(currentId);
  state.grammarCourse.answered = false;
  state.grammarCourse.lastCorrect = false;
  state.grammarCourse.selectedTokens = [];
  if (!state.grammarCourse.queue.length) {
    state.grammarCourse.phase = "complete";
    saveProgress();
    renderProgress();
  }
  renderGrammarCourse({ focus: true });
}

function renderMissions() {
  els.missionList.innerHTML = lessons.map((lesson, index) => `
    <button class="mission-button ${index === state.lessonIndex ? "active" : ""}" type="button" data-index="${index}">
      <span>${lesson.type}</span>
      <strong>${lesson.title}</strong>
      <em>Later practice</em>
    </button>
  `).join("");
}

function renderScenario() {
  const lesson = lessons[state.lessonIndex];
  els.missionType.textContent = lesson.type;
  els.lessonTitle.textContent = lesson.title;
  els.lessonContext.textContent = lesson.context;
  els.phraseCards.innerHTML = lesson.phrases.map((phrase) => `
    <section class="phrase-card">
      <strong lang="ja">${phrase.japanese}</strong>
      <p>${phrase.romaji}</p>
      <p>${phrase.english}</p>
      <small>${phrase.note}</small>
    </section>
  `).join("");
  renderMissions();
}

function currentReadingScenario() {
  return readingScenarios[state.reading.scenarioIndex];
}

function renderReadingScenarioList() {
  els.readingScenarioList.innerHTML = readingScenarios.map((scenario, index) => {
    const isActive = index === state.reading.scenarioIndex && !state.reading.complete;
    const isComplete = state.reading.completed.has(scenario.id);
    return `
      <button type="button" data-reading-scenario="${index}" ${isActive ? 'aria-current="step"' : ""}>
        <span>Scene ${index + 1}${isComplete ? " - complete" : ""}</span>
        <strong lang="ja">${scenario.title}</strong>
      </button>
    `;
  }).join("");
}

function renderReadingQuestion() {
  const scenario = currentReadingScenario();
  const question = scenario.questions[state.reading.questionIndex];
  els.readingQuestionMeta.textContent = `Question ${state.reading.questionIndex + 1} of ${scenario.questions.length}`;
  els.readingQuestionText.textContent = question.prompt;
  els.readingChoices.innerHTML = question.choices.map((choice) => `
    <button type="button" data-reading-choice="${choice}">${choice}</button>
  `).join("");
  els.readingFeedback.textContent = "";
  els.readingFeedback.className = "feedback";
  els.nextReadingButton.disabled = true;
  els.nextReadingButton.textContent = state.reading.questionIndex + 1 < scenario.questions.length
    ? "Next Question"
    : state.reading.scenarioIndex + 1 < readingScenarios.length
      ? "Next Scene"
      : "Finish Set";
}

function renderReadingCompletion() {
  els.readingScenarioMeta.textContent = "Reading set complete";
  els.readingScenarioTitle.textContent = "よくできました";
  els.readingPassage.lang = "en";
  els.readingPassage.textContent = "You finished five small hiragana scenes and ten comprehension checks.";
  els.readingClues.closest("details").hidden = true;
  els.readingQuestionMeta.textContent = "Session summary";
  els.readingQuestionText.textContent = "Choose a scene to practice again, or restart the set.";
  els.readingChoices.innerHTML = "";
  els.readingFeedback.textContent = "Completion is saved in this browser and included in local backups. No account or server is used.";
  els.readingFeedback.className = "feedback success";
  els.nextReadingButton.textContent = "Restart Reading Set";
  els.nextReadingButton.disabled = false;
  renderReadingScenarioList();
}

function renderReadingScenario() {
  els.readingSetProgress.textContent = `${state.reading.completed.size} / ${readingScenarios.length} complete`;
  if (state.reading.complete) {
    renderReadingCompletion();
    return;
  }
  const scenario = currentReadingScenario();
  els.readingScenarioMeta.textContent = `Scenario ${state.reading.scenarioIndex + 1} of ${readingScenarios.length}`;
  els.readingScenarioTitle.textContent = scenario.title;
  els.readingPassage.lang = "ja";
  els.readingPassage.textContent = scenario.passage;
  els.readingClues.closest("details").hidden = false;
  els.readingClues.innerHTML = scenario.clues.map(([word, meaning]) => `
    <span><b lang="ja">${word}</b>${meaning}</span>
  `).join("");
  renderReadingScenarioList();
  renderReadingQuestion();
}

function chooseReadingScenario(index) {
  state.reading.scenarioIndex = index;
  state.reading.questionIndex = 0;
  state.reading.answered = false;
  state.reading.complete = false;
  state.reading.scenarioCorrect = 0;
  renderReadingScenario();
  els.readingPassage.focus({ preventScroll: true });
}

function answerReadingQuestion(choice) {
  if (state.reading.answered || state.reading.complete) return;
  const question = currentReadingScenario().questions[state.reading.questionIndex];
  const correct = choice === question.answer;
  if (correct) state.reading.scenarioCorrect += 1;
  state.reading.answered = true;
  els.readingChoices.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.readingChoice === question.answer) button.classList.add("correct-answer");
    if (!correct && button.dataset.readingChoice === choice) button.classList.add("wrong-answer");
  });
  els.readingFeedback.textContent = `${correct ? "Correct" : `Not quite. The answer is ${question.answer}`}. ${question.explanation}`;
  els.readingFeedback.className = correct ? "feedback success" : "feedback needs-review";
  els.nextReadingButton.disabled = false;
  els.readingFeedback.focus({ preventScroll: true });
}

function advanceReadingPractice() {
  if (state.reading.complete) {
    state.reading = {
      scenarioIndex: 0,
      questionIndex: 0,
      answered: false,
      complete: false,
      scenarioCorrect: 0,
      completed: new Set()
    };
    saveProgress();
    renderReadingScenario();
    return;
  }
  if (!state.reading.answered) return;
  const scenario = currentReadingScenario();
  if (state.reading.questionIndex + 1 < scenario.questions.length) {
    state.reading.questionIndex += 1;
    state.reading.answered = false;
    renderReadingQuestion();
    els.readingQuestionText.focus?.({ preventScroll: true });
    return;
  }
  const passed = state.reading.scenarioCorrect === scenario.questions.length;
  if (passed) state.reading.completed.add(scenario.id);
  state.reading.questionIndex = 0;
  state.reading.answered = false;
  state.reading.scenarioCorrect = 0;
  if (!passed) {
    saveProgress();
    renderReadingScenario();
    els.readingFeedback.textContent = "Try this scene again. Both answers must be correct to complete it.";
    els.readingFeedback.className = "feedback needs-review";
    return;
  }
  if (state.reading.scenarioIndex + 1 < readingScenarios.length) {
    state.reading.scenarioIndex += 1;
  } else {
    state.reading.complete = true;
  }
  saveProgress();
  renderRoadmapResume();
  renderReadingScenario();
}

function revealActiveSection(section) {
  if (!section) return;
  if (!section.hasAttribute("tabindex")) {
    section.setAttribute("tabindex", "-1");
  }
  section.focus({ preventScroll: true });
  const scrollMargin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
  const targetTop = Math.max(0, window.scrollY + section.getBoundingClientRect().top - scrollMargin);
  window.scrollTo({ top: targetTop, behavior: "smooth" });
}

function showSection(id, options = {}) {
  const activeSection = document.getElementById(id);
  document.querySelectorAll(".app-section").forEach((section) => {
    section.classList.toggle("hidden", section.id !== id);
  });
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === id);
  });
  syncPressedState(".mode-tabs [data-section]", (button) => button.dataset.section === id);
  if (options.reveal) {
    window.requestAnimationFrame(() => revealActiveSection(activeSection));
  }
}

function revealLinkedStudyArea() {
  if (window.location.hash !== "#vocabularyCourse") return;
  showSection("n5Section");
  window.requestAnimationFrame(() => revealActiveSection(document.querySelector("#vocabularyCourse")));
}

function runTodayAction(action, options = {}) {
  if (action === "mini-session") {
    startMiniSession();
    return;
  }
  if (action === "review") {
    showSection("n5Section", options);
    startReviewQuestion();
    return;
  }
  if (action.startsWith("kana-lesson:")) {
    const [, deck, rowId] = action.split(":");
    showSection("kanaSection", options);
    selectKanaLesson(deck, rowId, { focus: !options.reveal });
    return;
  }
  if (action.startsWith("kana:")) {
    showSection("kanaSection", options);
    const deck = action.split(":")[1] === "katakana" ? "katakana" : "hiragana";
    chooseDeck(deck);
    const row = JapanReadyKanaLessons.STARTER_ROWS.find((item) => (
      !JapanReadyKanaLessons.rowStatus(state.kanaRowProgress, deck, item.id, n5Content.kanaDecks).complete
      && JapanReadyKanaLessons.isUnlocked(state.kanaRowProgress, deck, item.id, n5Content.kanaDecks)
    ));
    if (row) selectKanaLesson(deck, row.id, { focus: !options.reveal });
    return;
  }
  if (action.startsWith("vocabulary-course:")) {
    showSection("n5Section", options);
    const unitId = action.split(":")[1];
    selectVocabularyUnit(unitId, { focus: !options.reveal });
    window.requestAnimationFrame(() => {
      document.querySelector("#vocabularyCourse")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return;
  }
  if (action.startsWith("grammar-course:")) {
    showSection("n5Section", options);
    const unitId = action.split(":")[1];
    els.grammarCourse.open = true;
    selectGrammarUnit(unitId, { focus: !options.reveal });
    window.requestAnimationFrame(() => {
      els.grammarCourse.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return;
  }
  if (action.startsWith("n5:")) {
    showSection("n5Section", options);
    chooseN5Mode(action.split(":")[1]);
    return;
  }
  if (action === "checkpoint") {
    showSection("checkpointSection", options);
    if (!state.sprint.active && state.sprintBest < SPRINT_PASS_PERCENT) {
      startSprint();
    }
    return;
  }
  if (action === "reading-course") {
    const nextScenarioIndex = readingScenarios.findIndex((scenario) => !state.reading.completed.has(scenario.id));
    chooseReadingScenario(Math.max(nextScenarioIndex, 0));
    showSection("readingSection", options);
    return;
  }
  if (action === "timer") {
    setStudyDuration(15);
    startStudyTimer();
    renderTodayStudyPath();
  }
}

document.querySelectorAll("[data-deck]").forEach((button) => {
  button.addEventListener("click", () => chooseDeck(button.dataset.deck));
});

document.querySelectorAll("[data-kana-lesson-deck]").forEach((button) => {
  button.addEventListener("click", () => selectKanaLessonDeck(button.dataset.kanaLessonDeck));
});

els.kanaLessonRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-kana-lesson-row]");
  if (!button) return;
  selectKanaLesson(state.kanaLesson.deck, button.dataset.kanaLessonRow);
});

els.kanaLessonChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-kana-lesson-answer]");
  if (!button) return;
  checkKanaLessonAnswer(button.dataset.kanaLessonAnswer);
});

els.kanaLessonContinue.addEventListener("click", continueKanaLesson);

document.querySelectorAll("[data-kana-mode]").forEach((button) => {
  button.addEventListener("click", () => chooseKanaMode(button.dataset.kanaMode));
});

document.querySelectorAll("[data-worksheet-deck]").forEach((button) => {
  button.addEventListener("click", () => setWorksheetDeck(button.dataset.worksheetDeck));
});

document.querySelectorAll("[data-worksheet-group]").forEach((button) => {
  button.addEventListener("click", () => setWorksheetGroup(button.dataset.worksheetGroup));
});

document.querySelectorAll("[data-worksheet-mode]").forEach((button) => {
  button.addEventListener("click", () => setWorksheetMode(button.dataset.worksheetMode));
});

document.querySelectorAll("[data-section]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section, { reveal: true }));
});

els.levelList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-level-target]");
  if (!button) return;
  showSection(button.dataset.levelTarget, { reveal: true });
});

els.readingScenarioList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-reading-scenario]");
  if (!button) return;
  chooseReadingScenario(Number(button.dataset.readingScenario));
});

els.readingChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-reading-choice]");
  if (!button) return;
  answerReadingQuestion(button.dataset.readingChoice);
});

els.nextReadingButton.addEventListener("click", advanceReadingPractice);

document.querySelectorAll("[data-n5-mode]").forEach((button) => {
  button.addEventListener("click", () => chooseN5Mode(button.dataset.n5Mode));
});

els.roadmapResumeButton.addEventListener("click", () => {
  runTodayAction(els.roadmapResumeButton.dataset.roadmapAction, { reveal: true });
});

els.todayStudySteps.addEventListener("click", (event) => {
  const button = event.target.closest("[data-today-action]");
  if (!button || button.disabled) return;
  runTodayAction(button.dataset.todayAction);
});

els.startHereActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-start-action]");
  if (!button) return;
  runTodayAction(button.dataset.startAction);
});

els.todayFocusStats.addEventListener("click", (event) => {
  const button = event.target.closest("[data-today-action]");
  if (!button) return;
  runTodayAction(button.dataset.todayAction);
});

els.resumeActionButton.addEventListener("click", () => {
  runTodayAction(els.resumeActionButton.dataset.todayAction);
});

els.onboardingChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-onboarding-focus]");
  if (!button) return;
  setOnboardingFocus(button.dataset.onboardingFocus);
});

els.onboardingStartButton.addEventListener("click", startOnboardingFocus);

els.startMiniSessionButton.addEventListener("click", startMiniSession);
els.nextMiniSessionButton.addEventListener("click", nextMiniSessionQuestion);
els.miniSessionChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mini-answer]");
  if (!button) return;
  checkMiniSessionAnswer(button.dataset.miniAnswer);
});
els.miniSessionPracticeButton.addEventListener("click", () => {
  runTodayAction(els.miniSessionPracticeButton.dataset.todayAction);
});

els.reflectionActionButton.addEventListener("click", () => {
  runTodayAction(els.reflectionActionButton.dataset.todayAction);
});

els.quizChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-answer]");
  if (!button) return;
  checkKanaAnswer(button.dataset.answer);
});

els.n5Choices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-n5-answer]");
  if (!button) return;
  checkN5Answer(button.dataset.n5Answer);
});

els.vocabUnitList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vocab-unit]");
  if (!button || button.disabled) return;
  selectVocabularyUnit(button.dataset.vocabUnit, { focus: true });
});
els.startVocabUnitButton.addEventListener("click", startVocabularyUnit);
els.vocabChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vocab-answer]");
  if (!button) return;
  checkVocabularyAnswer(button.dataset.vocabAnswer);
});
els.vocabContinueButton.addEventListener("click", continueVocabularyCourse);

els.grammarUnitList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-grammar-unit]");
  if (!button || button.disabled) return;
  selectGrammarUnit(button.dataset.grammarUnit, { focus: true });
});
els.startGrammarUnitButton.addEventListener("click", startGrammarUnit);
els.grammarChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-grammar-answer]");
  if (!button) return;
  answerGrammarQuestion(button.dataset.grammarAnswer);
});
els.grammarTokenBank.addEventListener("click", (event) => {
  const button = event.target.closest("[data-grammar-token-index]");
  if (!button || button.disabled) return;
  addGrammarToken(Number(button.dataset.grammarTokenIndex));
});
els.grammarAssemblyAnswer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-grammar-remove-index]");
  if (!button) return;
  removeGrammarToken(Number(button.dataset.grammarRemoveIndex));
});
els.resetGrammarAssemblyButton.addEventListener("click", resetGrammarAssembly);
els.checkGrammarAssemblyButton.addEventListener("click", checkGrammarAssembly);
els.grammarContinueButton.addEventListener("click", continueGrammarCourse);

els.sprintChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sprint-answer]");
  if (!button) return;
  checkSprintAnswer(button.dataset.sprintAnswer);
});

els.typingTargets.addEventListener("click", (event) => {
  const button = event.target.closest("[data-type-target]");
  if (!button) return;
  state.typingTarget = {
    romaji: button.dataset.typeTarget,
    hiragana: button.dataset.typeHiragana,
    english: button.dataset.typeEnglish
  };
  els.romajiInput.value = button.dataset.typeTarget;
  els.typingTargetLabel.textContent = `${state.typingTarget.english} -> ${state.typingTarget.hiragana}`;
  updateTyping();
});

els.missionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  state.lessonIndex = Number(button.dataset.index);
  renderScenario();
});

document.querySelector("#newQuizButton").addEventListener("click", startQuiz);
document.querySelector("#nextN5Button").addEventListener("click", startN5Question);
els.startReviewButton.addEventListener("click", startReviewQuestion);
els.clearReviewButton.addEventListener("click", clearReviewQueue);
els.exportProgressButton.addEventListener("click", exportProgressBackup);
els.importProgressInput.addEventListener("change", (event) => {
  importProgressBackup(event.target.files[0]);
});
els.resetLocalDataConfirm.addEventListener("change", () => {
  els.resetLocalDataButton.disabled = !els.resetLocalDataConfirm.checked;
});
els.resetLocalDataButton.addEventListener("click", resetAllLocalData);
els.startSprintButton.addEventListener("click", startSprint);
els.nextSprintButton.addEventListener("click", nextSprintQuestion);
els.clearSprintHistoryButton.addEventListener("click", clearSprintHistory);
document.querySelectorAll("[data-study-minutes]").forEach((button) => {
  button.addEventListener("click", () => setStudyDuration(Number(button.dataset.studyMinutes)));
});
els.startStudyButton.addEventListener("click", startStudyTimer);
els.pauseStudyButton.addEventListener("click", pauseStudyTimer);
els.finishStudyButton.addEventListener("click", finishPartialStudySession);
document.querySelector("#resetProgressButton").addEventListener("click", resetProgress);
document.querySelector("#resetDeckButton").addEventListener("click", resetCurrentDeck);
els.toggleChartButton.addEventListener("click", () => {
  const isHidden = els.kanaChart.classList.toggle("hidden");
  els.toggleChartButton.textContent = isHidden ? "Reveal Chart" : "Hide Chart";
  els.toggleChartButton.setAttribute("aria-expanded", String(!isHidden));
});
els.printWorksheetButton.addEventListener("click", printKanaWorksheet);
window.addEventListener("afterprint", () => {
  clearWorksheetPrintState();
});
document.querySelector("#shufflePhraseButton").addEventListener("click", () => {
  lessons[state.lessonIndex].phrases.sort(() => Math.random() - 0.5);
  renderScenario();
});
els.romajiInput.addEventListener("input", updateTyping);
els.nameConvertButton.addEventListener("click", renderNameResult);
els.nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") renderNameResult();
});
els.nameResult.addEventListener("click", (event) => {
  if (event.target.closest("[data-copy-name]")) {
    copyNameSuggestion();
  }
});

els.kanjiLaterMessage.textContent = n5Content.kanjiLater.message;
renderLevels();
renderProgress();
renderKanaLesson();
renderKanaModeButtons();
renderKanaChart();
renderKanaWorksheet(activeWorksheetSettings().deck, activeWorksheetSettings().group, activeWorksheetSettings().mode);
renderReadingScenario();
renderMiniCards();
renderCoverageStats();
renderVocabularyCourse();
renderGrammarCourse();
renderScenario();
startN5Question();
startQuiz();
renderMiniSession();
renderSprintQuestion();
renderSprintHistory();
renderStudyStats();
renderReviewQueuePanel();
setStudyButtons();
updateTyping();
renderNameResult();
revealLinkedStudyArea();

window.addEventListener("hashchange", revealLinkedStudyArea);

if ("serviceWorker" in navigator && ["http:", "https:"].includes(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
