# Japanese Learning Prototype

Local prototype for a personalized Japanese study site focused on moving back to Japan.

## Prototype Goals

- Make practice feel like real Japan-life preparation, not generic flashcards.
- Keep all lesson content local and easy to revise after native-speaker feedback.
- Start gently for a true beginner, then progress from JLPT N5 toward N1 over time.
- Teach recognition and recall for hiragana, katakana, and later kanji before leaning too hard on full phrases.
- Build a repeatable loop: learn characters, quiz recall, practice phrases, review weak items.
- Give the learner a clear daily path so the app answers "what should I study right now?"

## How To Run

Open `index.html` directly in a browser. No server, account, API, database, or build step is required.

For PWA install/offline testing, open the folder through a local server or future hosted domain. Browser service workers do not run from a raw `file://` page.

## File Map

- `index.html` - app structure
- `styles.css` - responsive layout and visual design
- `n5-content.js` - beginner-first N5 kana, vocabulary, particles, grammar, and phrases
- `lessons.js` - editable scenario and phrase content
- `app.js` - interactions, scoring, progress, and review queue
- `manifest.webmanifest`, `service-worker.js`, `icon.svg` - PWA groundwork for hosted/local-server use
- `BACKLOG.md` - roadmap and learning progression ideas

## Local Reference Sources

- `C:\Users\rdrnr\Projects\Standalone Site Experiments\Japan language sources\kanjibookjlptn5.pdf` - N5 kanji reference for the later kanji side quest.

## Content Editing Notes

Each lesson in `lessons.js` has:

- `title` - scenario name
- `context` - why this scenario matters
- `phrases` - Japanese, kana, romaji, English, and notes
- `builder` - sentence-building challenge
- `reviewPrompt` - short reflection prompt

Native-speaker review should focus on naturalness, politeness level, and whether the phrase fits the scenario.

## Current Direction

The first prototype proved the scenario-training idea, but the next version should become more beginner-friendly:

- Begin with hiragana and katakana recognition drills.
- Calibrate the first run with a tiny beginner-safe start choice: hiragana, katakana, or N5 basics.
- Teach a tiny intro for the selected focus before routing into the quiz loop.
- Offer a guided five-question mini-session after the intro to build confidence before open practice.
- Add a Japanese typing surface that works without a system IME.
- Organize lessons by JLPT level, starting with N5 basics.
- Use the Today path to route the learner into due review, kana, N5 practice, checkpoint sprint, and timer logging, with live N5 focus chips showing progress and practice depth.
- Show a lightweight session reflection after practice so the learner sees what was studied, weak areas, accuracy, and the next suggested action.
- Keep real-life Japan move scenarios, but unlock them gradually after foundation practice.
- Add optional side quests such as "Kanji of the Day" once the learner is ready.
