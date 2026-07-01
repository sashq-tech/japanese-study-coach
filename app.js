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
const REVIEW_NOTES_STORAGE_KEY = "jrj-wife-notes";
const PROGRESS_STORAGE_KEYS = [
  "jrj-correct",
  "jrj-review",
  "jrj-streak",
  "jrj-foundation-done",
  "jrj-kana-hits",
  "jrj-mastered-kana",
  "jrj-kana-mode",
  "jrj-onboarding-focus",
  "jrj-n5-mode-correct",
  "jrj-last-quiz-key",
  "jrj-n5-sprint-best",
  "jrj-n5-sprint-history",
  "jrj-n5-review-queue",
  "jrj-session-reflection",
  "jrj-mini-session-summary",
  "jrj-study-stats",
  "jrj-study-selected-minutes",
  REVIEW_NOTES_STORAGE_KEY
];

function loadKanaHits() {
  const savedHits = localStorage.getItem("jrj-kana-hits");
  if (savedHits) return JSON.parse(savedHits);
  const previousMastered = JSON.parse(localStorage.getItem("jrj-mastered-kana") || '{"hiragana":[],"katakana":[]}');
  const hits = { hiragana: {}, katakana: {} };
  Object.keys(previousMastered).forEach((deck) => {
    previousMastered[deck].forEach((key) => {
      hits[deck][key] = MASTERY_TARGET;
    });
  });
  return hits;
}

function loadModeCorrect() {
  const saved = JSON.parse(localStorage.getItem("jrj-n5-mode-correct") || "{}");
  return {
    vocab: saved.vocab || 0,
    particles: saved.particles || 0,
    grammar: saved.grammar || 0,
    sentences: saved.sentences || 0
  };
}

function loadStudyStats() {
  const saved = JSON.parse(localStorage.getItem("jrj-study-stats") || "{}");
  return {
    days: saved.days || {},
    sessions: saved.sessions || []
  };
}

function loadN5ReviewQueue() {
  return JSON.parse(localStorage.getItem("jrj-n5-review-queue") || "[]");
}

function loadSprintHistory() {
  const saved = JSON.parse(localStorage.getItem("jrj-n5-sprint-history") || "[]");
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
  const saved = JSON.parse(localStorage.getItem("jrj-session-reflection") || "{}");
  if (saved.date !== todayKey()) return freshSessionReflection();
  return {
    ...freshSessionReflection(),
    ...saved,
    practiced: saved.practiced || {},
    weakAreas: saved.weakAreas || {}
  };
}

function loadMiniSessionSummary() {
  return JSON.parse(localStorage.getItem("jrj-mini-session-summary") || "{}");
}

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
  kanaHits: loadKanaHits(),
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
  }
};

const els = {
  levelList: document.querySelector("#levelList"),
  readinessScore: document.querySelector("#readinessScore"),
  readinessBar: document.querySelector("#readinessBar"),
  correctCount: document.querySelector("#correctCount"),
  reviewCount: document.querySelector("#reviewCount"),
  streakCount: document.querySelector("#streakCount"),
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
  kanaChart: document.querySelector("#kanaChart"),
  toggleChartButton: document.querySelector("#toggleChartButton"),
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
  reviewNotesInput: document.querySelector("#reviewNotesInput"),
  notesStatus: document.querySelector("#notesStatus"),
  missionList: document.querySelector("#missionList"),
  missionType: document.querySelector("#missionType"),
  lessonTitle: document.querySelector("#lessonTitle"),
  lessonContext: document.querySelector("#lessonContext"),
  phraseCards: document.querySelector("#phraseCards")
};

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
  saveReviewNotes({ silent: true });
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

function saveReviewNotes(options = {}) {
  const value = els.reviewNotesInput.value;
  localStorage.setItem(REVIEW_NOTES_STORAGE_KEY, value);
  if (!options.silent) {
    const trimmed = value.trim();
    els.notesStatus.textContent = trimmed
      ? "Review notes saved in this browser and included in backups."
      : "Empty review notes saved. This clears the saved note in this browser.";
    els.notesStatus.className = "feedback success";
  }
}

function loadReviewNotes() {
  const savedNotes = localStorage.getItem(REVIEW_NOTES_STORAGE_KEY) || "";
  els.reviewNotesInput.value = savedNotes;
  if (savedNotes.trim()) {
    els.notesStatus.textContent = "Saved review notes loaded from this browser.";
    els.notesStatus.className = "feedback success";
  }
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
  const modeCounts = {
    vocab: n5Content.n5Vocabulary.length,
    particles: n5Content.particlePractice.length,
    grammar: n5Content.grammarPractice.length,
    sentences: n5Content.sentencePractice.length
  };
  const supportingCounts = {
    vocab: `${new Set(n5Content.n5Vocabulary.map((item) => item.category)).size} categories`,
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
    const item = dailyPick(n5Content.n5Vocabulary, mode);
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
    title: n5Task ? `Build ${n5ModeLabel(n5Task.mode)}` : "Starter N5 checks complete",
    detail: n5Task
      ? `${n5Task.count} / ${n5Task.target} correct. Today sample: ${getTodayFocusExample(n5Task.mode)}`
      : "Vocabulary, particles, grammar, and sentence checks hit starter targets.",
    action: n5Task ? `n5:${n5Task.mode}` : "n5",
    actionLabel: n5Task ? "Practice N5" : "Done",
    complete: !n5Task
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
      title: n5Task ? `Build ${n5ModeLabel(n5Task.mode)}` : "N5 starter checks",
      detail: n5Task ? `${n5Task.count}/${n5Task.target} toward the starter target.` : "Starter N5 targets are ready for sprint review.",
      action: n5Task ? `n5:${n5Task.mode}` : "checkpoint",
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
    <button class="${option.key === active ? "active" : ""}" type="button" data-onboarding-focus="${option.key}">
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
  els.levelList.innerHTML = n5Content.levels.map((level) => `
    <button class="level-button ${level.status}" type="button">
      <span>${level.label}</span>
      <strong>${level.status === "active" ? "Start here" : "Locked for later"}</strong>
      <em>${level.description}</em>
    </button>
  `).join("");
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
  document.querySelectorAll("[data-study-minutes]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.studyMinutes) === state.selectedStudyMinutes);
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
  els.checkpointStatus.textContent = completeCount === criteria.length ? "N4 prep unlocked" : "Not ready yet";
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

function chooseDeck(deck) {
  state.deck = deck;
  document.querySelectorAll("[data-deck]").forEach((button) => {
    button.classList.toggle("active", button.dataset.deck === deck);
  });
  renderKanaChart();
  renderDeckProgress();
  startQuiz();
}

function renderKanaModeButtons() {
  document.querySelectorAll("[data-kana-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.kanaMode === state.kanaMode);
  });
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
  const item = sample(n5Content.n5Vocabulary, 1)[0];
  const wrong = sample(n5Content.n5Vocabulary.filter((candidate) => candidate.english !== item.english), 3);
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
    ? "Checkpoint sprint passed. This counts toward N4 prep readiness."
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
  document.querySelectorAll("[data-n5-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.n5Mode === mode);
  });
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
  startQuiz();
}

function resetCurrentDeck() {
  state.kanaHits[state.deck] = {};
  state.lastQuizKey = "";
  saveProgress();
  renderDeckProgress();
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
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return n5Content.nameTransliterations.find((entry) => entry.input.includes(normalized)) || null;
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
    els.typingTargetLabel.textContent = `Foreign name helper -> ${nameMatch.katakana}`;
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

function renderNameResult() {
  const rawName = els.nameInput.value.trim();
  if (!rawName) {
    els.nameResult.innerHTML = `<p>Type a name to see a katakana form.</p>`;
    return;
  }
  const nameMatch = findNameTransliteration(rawName);
  if (nameMatch) {
    els.nameResult.innerHTML = `
      <section>
        <span>Curated name form</span>
        <strong lang="ja">${nameMatch.katakana}</strong>
        <p>${rawName} is usually written from the sound: ${nameMatch.sound}.</p>
        <small>${nameMatch.note}</small>
      </section>
    `;
    return;
  }
  const hiraganaGuess = romajiToHiragana(rawName);
  const katakanaGuess = hiraganaToKatakana(hiraganaGuess);
  if (/[a-z]/i.test(katakanaGuess)) {
    els.nameResult.innerHTML = `
      <section>
        <span>Needs pronunciation</span>
        <strong>Check sound first</strong>
        <p>I could not make a reliable kana guess from the spelling alone.</p>
        <small>Foreign names should be converted from pronunciation. Add this name to the curated list after confirming the common katakana form.</small>
      </section>
    `;
    return;
  }
  els.nameResult.innerHTML = `
    <section>
      <span>Rough kana guess</span>
      <strong lang="ja">${katakanaGuess || "No result yet"}</strong>
      <p>This is a spelling-based approximation. A real name form should be checked by pronunciation or a native speaker.</p>
      <small>Foreign names normally use katakana, and English spelling can be misleading.</small>
    </section>
  `;
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
  els.vocabList.innerHTML = n5Content.n5Vocabulary.map((item) => `
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
    { label: "Vocabulary", value: n5Content.n5Vocabulary.length, target: "prototype seed" },
    { label: "Particles", value: n5Content.particles.length, target: "N5 basics" },
    { label: "Grammar", value: n5Content.grammarPatterns.length, target: "starter nodes" },
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
  if (options.reveal) {
    window.requestAnimationFrame(() => revealActiveSection(activeSection));
  }
}

function runTodayAction(action) {
  if (action === "mini-session") {
    startMiniSession();
    return;
  }
  if (action === "review") {
    showSection("n5Section");
    startReviewQuestion();
    return;
  }
  if (action.startsWith("kana:")) {
    showSection("kanaSection");
    chooseDeck(action.split(":")[1]);
    return;
  }
  if (action.startsWith("n5:")) {
    showSection("n5Section");
    chooseN5Mode(action.split(":")[1]);
    return;
  }
  if (action === "checkpoint") {
    showSection("checkpointSection");
    if (!state.sprint.active && state.sprintBest < SPRINT_PASS_PERCENT) {
      startSprint();
    }
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

document.querySelectorAll("[data-kana-mode]").forEach((button) => {
  button.addEventListener("click", () => chooseKanaMode(button.dataset.kanaMode));
});

document.querySelectorAll("[data-section]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section, { reveal: true }));
});

document.querySelectorAll("[data-n5-mode]").forEach((button) => {
  button.addEventListener("click", () => chooseN5Mode(button.dataset.n5Mode));
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
document.querySelector("#shufflePhraseButton").addEventListener("click", () => {
  lessons[state.lessonIndex].phrases.sort(() => Math.random() - 0.5);
  renderScenario();
});
document.querySelector("#saveNotesButton").addEventListener("click", () => {
  saveReviewNotes();
});
els.reviewNotesInput.addEventListener("input", () => {
  els.notesStatus.textContent = "";
  els.notesStatus.className = "feedback";
});
els.romajiInput.addEventListener("input", updateTyping);
els.nameConvertButton.addEventListener("click", renderNameResult);
els.nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") renderNameResult();
});

els.kanjiLaterMessage.textContent = n5Content.kanjiLater.message;
loadReviewNotes();
renderLevels();
renderProgress();
renderKanaModeButtons();
renderKanaChart();
renderMiniCards();
renderCoverageStats();
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

if ("serviceWorker" in navigator && ["http:", "https:"].includes(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
