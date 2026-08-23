# Backlog

## Product Direction

Build a personalized Japanese learning site that starts at a true beginner level and gradually unlocks practical Japan-life scenarios.

The current app is useful as an early version, but the next version should feel less advanced on first open. The learner should be able to start with character recognition, sound association, and small wins before being asked to assemble full official or family-life phrases.

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

- Current app includes in-app About, Privacy, and Learning Scope copy for GitHub-stage evaluation.
- Current app includes static About, Privacy, Terms, and Contact pages plus `robots.txt` for soft-launch readiness.
- Public brand is now Japan Ready Coach, live at the apex domain `https://japanreadycoach.com/`.
- README now explains the static/no-backend model, localStorage privacy, validation commands, and live apex-domain status.
- Current app includes apex-domain canonical/social metadata, `robots.txt`, and `sitemap.xml`.
- Current app includes a first-person, human-grounded About page and a lightweight Blog section with a starter Cash, Cards, and Suica article based on Sean and Emi's Japan travel notes.
- Current app includes root `ads.txt` for AdSense publisher authorization.
- Public trust-page navigation uses extensionless production routes: `/about`, `/privacy`, `/terms`, and `/contact`.
- Later: add or document `www` only after it resolves or redirects.

### AdSense Low-Value Recovery - 2026-08-13

AdSense rejected Japan Ready Coach for low-value content. This supersedes the earlier measurement hold. The recovery goal is deeper, clearly discoverable learner value, not more ads or filler.

- Evidence at rejection: the sitemap exposed 12 indexable routes, but only the JavaScript-heavy homepage was a learning page. Six blog posts were substantial; the 22 guided kana lessons and worksheets were difficult for a reviewer or crawler to understand from a collapsed app surface.
- No manual AdSense units are present in source, so ad density is not the identified recovery target.
- Published recovery slice adds `/learn`, a crawlable Beginner Kana Study Path tied to the real 22-row lesson sequence and printable worksheets. It also replaces the premature N4-readiness checkpoint language with an honest starter-foundation check.
- Published recovery content also includes `/hiragana-reading-practice`, a crawlable three-pass method tied to the five real Hiragana scenes, with a finite 15-minute routine and printable study log rather than duplicated app controls.
- The generic activity percentage is labeled Study momentum instead of N5 Foundation because it measures quiz activity and study days, not curriculum coverage.
- Do not resubmit from this documentation change alone. First publish and human-review the learning guide, then deepen the actual guided curriculum.
- The app now includes 50 deliberately ordered beginner vocabulary words in five ten-word units, with teach-before-check flow, unique item progress, missed-word retry, sequential unlocking, and a visible finish line. This is explicitly the first 50-word block, not the planned 840-word course.
- Published recovery content now includes `/beginner-japanese-vocabulary`, a crawlable guide that exposes the exact five-unit sequence and all 50 shipped words, explains the finite retry loop, and links directly into the interactive course. The interactive course and guide pair standard romaji with clearly labeled English-friendly pronunciation approximations while stating that the aid does not replace native audio or feedback.
- The app now includes a first guided grammar block: five sequential teach-before-check lessons, 18 unique checks across は/です/か, を, に/で, の, and と/も, guided sentence assembly, same-session retry, local progress/backup support, and a visible finish line. It explicitly does not claim grammar mastery, full N5 coverage, or completion of the planned 100-example path.
- After this first grammar block: human-review the lesson wording and then add a second finite sentence-pattern block before claiming a complete N5 path.
- A live browser check observed Cloudflare's injected analytics beacon. Homepage and Privacy copy now distinguish local-only study progress from Cloudflare delivery, security, and aggregate traffic processing.
- Publication and AdSense resubmission remain separate decisions. No account-side action belongs in this recovery pass.

### Post-Launch Stabilization

Current status: no active post-launch known issues are tracked here after the initial soft-launch fixes.

- Removed the local Human Review Notes panel because it did not provide a meaningful learner function. Curriculum review belongs in the private editorial workflow, not the public app or learner backups.
- Mode-button selection now scrolls and focuses the active study panel so the learner sees the selected content immediately.
- Local Data import/export controls now align as a two-action backup row while keeping the file input accessible.
- Focused printable worksheet groups now cover every basic kana exactly once; standalone final N is labeled and included with the final Y/R/W group.

Recommended next area: continue strengthening beginner N5 retention and review flow before adding broader N4+ content or larger human review workflows.

### 2026-07-18 Deep Audit

Resolved in the reading-practice release:

- Malformed local progress JSON now falls back safely instead of stopping app startup.
- The collapsed Practice tools row stays contained and horizontally scrollable at 390px after adding Reading.
- N4-N1 ladder controls are now disabled while locked; the active N5 control opens Kana practice.
- Mode-target sections have accessible names and retain a visible keyboard focus indicator.
- Stale future-hosting copy and the homepage sitemap date were corrected.

Resolved in the front-door consolidation release:

- Mobile progress/JLPT details now start collapsed, while desktop keeps them open in the sidebar.
- Beginner Ramp, timer, Start Here, calibration, mini-session, Today's Path, and reflection remain intact inside one Guided study plan disclosure.
- The roadmap Resume action and active Kana workspace now appear before the optional guidance stack.
- Practice-section buttons expose one current `aria-pressed` state and retain direct focus routing.

Resolved in the accessibility and Contact polish release:

- Timer, calibration, Kana, worksheet, and N5 single-select button groups expose synchronized `aria-pressed` state.
- Contact validation marks every invalid required field, provides inline guidance, and focuses the first field needing attention without changing the truthful mailto flow.

Severity-ranked follow-up:

1. **Medium - PWA real-device acceptance:** repeat install, update, reload, and offline checks in Chrome/Safari on a phone or tablet. Automated checks confirm cache assets and version markers, but do not replace a real installed-PWA upgrade test.
2. **Resolved 2026-08-06 - bounded structured data:** added factual `WebSite`/`WebApplication`, trust-page, and `BlogPosting` JSON-LD without author, review, course-completion, or JLPT-alignment claims.

### Staged Reading Scenarios

- Current app includes five hiragana-only micro-scenarios with two English comprehension checks each.
- The crawlable `/hiragana-reading-practice` guide teaches how to use that finite set without adding another landing-page panel.
- Reading is a focused door inside collapsed Practice tools and does not add another landing-page panel.
- Results are session-only; no account, backend, or permanent reading score is implied.
- Next slice: review the five passages for naturalness, then add a second set using hiragana plus carefully introduced katakana without changing the calm entry path.

### Returning Learner Continuity

- Current app includes a compact Start Here nudge that routes to mini-session, kana, review, or N5 basics.
- Current app includes a local-only Resume Snapshot in Today's Study Path.
- Resume Snapshot summarizes due review, total study hours, latest mini-session, sprint best, and routes to the next suggested action.
- Later: add a fuller weekly history view only if it stays beginner-safe and does not require accounts.

### Local Data Control

- Current app has a Local Data panel explaining browser-only storage.
- Learners can export/import a progress backup and reset local data with an explicit checkbox plus browser confirmation.
- Later: split backup contents by category only if the controls stay simple.

### Weak-Item Review

- Current app stores missed N5 practice and sprint questions in a local review pile.
- Review pile is deduped so repeated misses increase the miss count instead of creating duplicate cards.
- Current app shows review counts by category: vocabulary, particles, grammar, and sentence reading.
- Review controls now show how many weak items are due or when the next review opens.
- Review starts with the most-missed items first.
- Current app uses simple spaced repetition timing: due now, then 1 day, then 3 days, then cleared.
- Later: show recent miss history and make the timing ladder adjustable.

### Progress Backup

- Current app can export local browser progress to a JSON file.
- Current app can import a valid backup JSON and restore progress in the browser.
- Backup includes kana mastery, scores, N5 mode counts, sprint score, weak-item review pile, session reflection, mini-session summary, study stats, and selected timer length.
- Later: add cloud sync or account-based progress only if publishing and multi-device use truly require it.

### Study Habit Tracker

- Current app has 15, 30, 45, and 60 minute study timers.
- Timer can be paused and resumed during interruptions.
- Completed or manually finished sessions are logged locally.
- Track consecutive days studied, total study days, total study hours, and today's minutes.
- Current app shows a long-range N1 horizon using 3,000-4,800 hours for English speakers without prior kanji knowledge.
- Long-range reference range to keep in mind: 1,700-2,600 hours with prior kanji knowledge, 3,000-4,800 hours without prior kanji knowledge.
- Later: add session history, weekly goal, and more milestone markers tied to N5/N4/N3/N2 checkpoints.

### Today's Study Path

- Current app shows a guided daily N5 path near the top of the app.
- Current app includes a first-run/returning calibration panel that recommends hiragana, katakana, or N5 basics from local progress and routes into practice.
- Current app shows a tiny lesson intro for the selected calibration focus before quizzing.
- Current app offers a guided five-question mini-session for the selected focus and feeds results into daily reflection.
- Path pulls from live state: due weak-item review, kana deck progress, weakest N5 mode, sprint readiness, and today's logged study minutes.
- Current app shows N5 focus chips for vocabulary, particles, grammar, and sentences with progress targets and practice-pool depth.
- The N5 focus card includes a rotating daily sample from the suggested weak area.
- Current app includes a daily session reflection with practiced areas, weak areas, accuracy, and the next suggested action.
- Each path card jumps into the matching practice area instead of creating a separate lesson system.
- Later: add weekly goals, streak rewards, and optional "short / normal / deep" session plans.

### N5 Content Depth

- Current app has expanded kana-only N5 seed content for daily life, directions, study, conversation, places, verbs, adjectives, particles, grammar checks, sentence comprehension, and survival phrases.
- Beginner-facing N5 content remains kana/katakana-first. Kanji is still held for the later side quest.
- Later: have reviewer feedback check phrase naturalness and add listening-style prompts once audio or speech support is planned.

### Structured Kana Lessons

- Current app guides a learner through all 11 basic kana rows in Hiragana, then Katakana: vowels, K, S, T, N, H, M, Y, R, W, and final N. Short rows keep their natural three-, two-, or one-card length.
- Each completed row has a visible completion state and one Continue action; the roadmap resume card returns to the first unfinished row.
- Guided row completion is not presented as full kana mastery. The existing three-correct full deck, reverse quiz, chart, and worksheets remain under More Kana Tools.
- Row lesson progress and the selected row stay local, survive reload, and are included in export/import/reset handling.
- Next slice: human-review the expanded sequence for pronunciation, pacing, and phone/tablet comfort before adding voiced sounds or combination kana.

### Kana Trainer

- Hiragana chart with stroke-order hints later.
- Katakana chart with loanword examples.
- Flashcard quiz: see character, choose sound.
- Current app includes reverse quiz mode: see sound, choose character.
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

- Keep the current checkpoint as a starter-foundation review until the promised vocabulary, grammar, reading, and kanji depth exists.
- Do not mark a learner ready for N4 preparation from the current shallow quiz thresholds.
- Gate on multiple skills, not one stressful exam: kana decks, starter vocabulary, particles, grammar, reading, and practical phrases.
- Let retakes feel normal and route missed areas into review.
- Current app includes a 12-question mixed N5 sprint with an 80% pass target.
- Current app stores recent N5 sprint attempts locally and includes them in progress backups.

### Private Human Review Workflow

- Keep reviewer notes out of the public learner interface and learner progress backups.
- Use private review states: needs review, reviewed, approved, and needs rewrite.
- Export only approved curriculum changes for validation and release.

### Foreign Name Helper

- Keep as a later engagement feature, not a core learning priority.
- Store curated name-to-katakana mappings only after pronunciation or human review.
- Avoid showing mixed Latin/kana guesses that look authoritative but are wrong.
- Eventually support common names, pronunciation notes, and "How to introduce yourself" examples.

### Site Trust / Publishing Later

- Draft an About Me page before buying a domain or applying for ads.
- Explain the personal reason for the site: Japan background, family connection, move planning, and why a more engaging learning path matters.
- Add Contact, Privacy Policy, and Learning Roadmap pages before public launch.
- Keep ads and monetization limited until the learning loop is genuinely useful.

### Mobile / PWA Groundwork

- Current app includes PWA metadata, an app icon, and a service worker for local-server or hosted use.
- Service-worker v52 precaches the expanded kana foundation, crawlable kana and Hiragana reading guides, guided 50-word vocabulary course, and first finite grammar block. Blank Quiz answer keys stay collapsed on screen and print on a dedicated compact reference page.
- Current app keeps direct `index.html` opening as the simplest local path; service worker registration is skipped on `file://`.
- Mobile layout has a sticky section switcher, fixed type scales, larger answer targets, and reduced small-screen background weight.
- Later: test on real phone/tablet after a domain or temporary local network URL exists.

## Next Implementation Candidates

1. Human-review the kana guide, guided 50-word vocabulary block, and first 18-check grammar block on a real phone/tablet.
2. Build the next bounded curriculum layer: a second finite grammar/example-sentence block or a 10-scenario reading set, based on human review.
3. Reassess public learner depth and trust after these slices; resubmission to AdSense remains a separate human decision.
