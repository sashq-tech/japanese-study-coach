# Backlog

## Product Direction

Build a personalized Japanese learning site that starts at a true beginner level and gradually unlocks practical Japan-life scenarios.

The current prototype is useful as a concept demo, but the next version should feel less advanced on first open. The learner should be able to start with character recognition, sound association, and small wins before being asked to assemble full official or family-life phrases.

## Learning Progression

1. N5 Foundation
   - Hiragana recognition.
   - Katakana recognition.
   - Basic particles: は, が, を, に, で, の.
   - Core greetings and survival phrases.
   - Simple sentence patterns: A is B, I want to do X, where is X?

2. N4 Expansion
   - More verbs and adjective patterns.
   - Polite requests.
   - Short listening and reading prompts.
   - Daily-life scenarios such as shopping, trains, restaurants, and appointments.

3. N3 Bridge
   - Longer sentences.
   - More natural conversation choices.
   - Work, housing, school, and city-office vocabulary.
   - More kanji-based reading practice.

4. N2 and N1 Long-Term
   - News, official notices, essays, and nuanced listening.
   - Keigo and formal writing.
   - Advanced kanji and vocabulary review.

## Feature Ideas

### Public Readiness

- Current prototype includes in-app About, Privacy, and Learning Scope copy for GitHub-stage evaluation.
- Current prototype includes static About, Privacy, Terms, and Contact pages plus `robots.txt` for soft-launch readiness.
- Public brand is now Japan Ready Coach, and `japanreadycoach.com` has been purchased for a future launch.
- README now explains the static/no-backend model, localStorage privacy, validation commands, and purchased-but-not-connected domain status.
- Later: add sitemap.xml and domain-specific canonical/social URLs only when `japanreadycoach.com` is connected.

### Returning Learner Continuity

- Current prototype includes a compact Start Here nudge that routes to mini-session, kana, review, or N5 basics.
- Current prototype includes a local-only Resume Snapshot in Today's Study Path.
- Resume Snapshot summarizes due review, total study hours, latest mini-session, sprint best, and routes to the next suggested action.
- Later: add a fuller weekly history view only if it stays beginner-safe and does not require accounts.

### Local Data Control

- Current prototype has a Local Data panel explaining browser-only storage.
- Learners can export/import a progress backup and reset local data with an explicit checkbox plus browser confirmation.
- Later: split backup contents by category only if the controls stay simple.

### Weak-Item Review

- Current prototype stores missed N5 practice and sprint questions in a local review pile.
- Review pile is deduped so repeated misses increase the miss count instead of creating duplicate cards.
- Current prototype shows review counts by category: vocabulary, particles, grammar, and sentence reading.
- Review starts with the most-missed items first.
- Current prototype uses simple spaced repetition timing: due now, then 1 day, then 3 days, then cleared.
- Later: show recent miss history and make the timing ladder adjustable.

### Progress Backup

- Current prototype can export local browser progress to a JSON file.
- Current prototype can import a valid backup JSON and restore progress in the browser.
- Backup includes kana mastery, scores, N5 mode counts, sprint score, weak-item review pile, session reflection, mini-session summary, study stats, selected timer length, and native-speaker notes.
- Later: add cloud sync or account-based progress only if publishing and multi-device use truly require it.

### Study Habit Tracker

- Current prototype has 15, 30, 45, and 60 minute study timers.
- Timer can be paused and resumed during interruptions.
- Completed or manually finished sessions are logged locally.
- Track consecutive days studied, total study days, total study hours, and today's minutes.
- Current prototype shows a long-range N1 horizon using 3,000-4,800 hours for English speakers without prior kanji knowledge.
- Long-range reference range to keep in mind: 1,700-2,600 hours with prior kanji knowledge, 3,000-4,800 hours without prior kanji knowledge.
- Later: add session history, weekly goal, and more milestone markers tied to N5/N4/N3/N2 checkpoints.

### Today's Study Path

- Current prototype shows a guided daily N5 path near the top of the app.
- Current prototype includes a first-run/returning calibration panel that recommends hiragana, katakana, or N5 basics from local progress and routes into practice.
- Current prototype shows a tiny lesson intro for the selected calibration focus before quizzing.
- Current prototype offers a guided five-question mini-session for the selected focus and feeds results into daily reflection.
- Path pulls from live state: due weak-item review, kana deck progress, weakest N5 mode, sprint readiness, and today's logged study minutes.
- Current prototype shows N5 focus chips for vocabulary, particles, grammar, and sentences with progress targets and practice-pool depth.
- The N5 focus card includes a rotating daily sample from the suggested weak area.
- Current prototype includes a daily session reflection with practiced areas, weak areas, accuracy, and the next suggested action.
- Each path card jumps into the matching practice area instead of creating a separate lesson system.
- Later: add weekly goals, streak rewards, and optional "short / normal / deep" session plans.

### N5 Content Depth

- Current prototype has expanded kana-only N5 seed content for daily life, directions, study, conversation, places, verbs, adjectives, particles, grammar checks, sentence comprehension, and survival phrases.
- Beginner-facing N5 content remains kana/katakana-first. Kanji is still held for the later side quest.
- Later: have native-speaker review phrase naturalness and add listening-style prompts once audio or speech support is planned.

### Kana Trainer

- Hiragana chart with stroke-order hints later.
- Katakana chart with loanword examples.
- Flashcard quiz: see character, choose sound.
- Current prototype includes reverse quiz mode: see sound, choose character.
- Timed recognition mode for speed.
- Weak-character review queue.

### Built-In Japanese Typing

- Type romaji into an app-controlled input.
- Convert romaji to hiragana without requiring IME installation.
- Toggle conversion between hiragana and katakana.
- Later: offer candidate kanji for known words.
- Use this for answer entry, phrase practice, and dictation.

### Kanji Side Quest

- "Kanji of the Day" card.
- Meaning, readings, example word, and sample sentence.
- Mark as familiar, shaky, or review.
- Start with N5 kanji before adding higher levels.
- Use the local N5 kanji PDF in `C:\Users\rdrnr\Projects\Standalone Site Experiments\Japan language sources\kanjibookjlptn5.pdf` as a reference when this feature moves out of backlog.

### JLPT Ladder

- Visible path from N5 to N1.
- Each level contains characters, vocabulary, grammar, phrases, and mini scenarios.
- Keep the tone encouraging and game-like without making the user feel tested by a textbook.

### N5 Checkpoint / Level Gate

- Add a milestone that marks the user ready for N4 prep after foundational N5 tasks are complete.
- Keep practice sections open, but use checkpoint completion to unlock progress badges and readiness labels.
- Gate on multiple skills, not one stressful exam: kana decks, starter vocabulary, particles, grammar, reading, and practical phrases.
- Let retakes feel normal and route missed areas into review.
- Current prototype includes a 12-question mixed N5 sprint with an 80% pass target.
- Current prototype stores recent N5 sprint attempts locally and includes them in progress backups.

### Wife Review Workflow

- Keep native-speaker notes per lesson.
- Add a review status: needs review, reviewed, approved, needs rewrite.
- Add an easy export/copy view for lesson feedback.

### Foreign Name Helper

- Keep as a later engagement feature, not a core learning priority.
- Store curated name-to-katakana mappings only after pronunciation or native-speaker review.
- Avoid showing mixed Latin/kana guesses that look authoritative but are wrong.
- Eventually support common names, pronunciation notes, and "How to introduce yourself" examples.

### Site Trust / Publishing Later

- Draft an About Me page before buying a domain or applying for ads.
- Explain the personal reason for the site: Japan background, family connection, move planning, and why a more engaging learning path matters.
- Add Contact, Privacy Policy, and Learning Roadmap pages before public launch.
- Keep ads and monetization out of the prototype until the learning loop is genuinely useful.

### Mobile / PWA Groundwork

- Current prototype includes PWA metadata, an app icon, and a service worker for local-server or hosted use.
- Current prototype keeps direct `index.html` opening as the simplest local path; service worker registration is skipped on `file://`.
- Mobile layout has a sticky section switcher, fixed type scales, larger answer targets, and reduced small-screen background weight.
- Later: test on real phone/tablet after a domain or temporary local network URL exists.

## Next Implementation Candidates

1. Add weekly goals and streak rewards for the Today path.
2. Add the About Me draft and real public contact channel before connecting japanreadycoach.com.
