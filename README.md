# Japan Ready Coach

Static prototype for a beginner-first Japanese study coach focused on kana, JLPT N5 basics, and practical confidence for moving to Japan.

Japan Ready Coach is live at `https://japanreadycoach.com/`. The `www` subdomain is not currently part of the verified launch path.

## What It Does

- Starts gently with hiragana and katakana recognition before introducing heavier content.
- Provides a compact Start Here nudge for guided mini-session, kana, review, or N5 basics.
- Uses a Start Calibration panel to recommend Hiragana, Katakana, or N5 Basics from local progress.
- Teaches a tiny focus intro, then offers a guided five-question mini-session.
- Shows a local-only Resume Snapshot for returning learners.
- Routes into Today's Study Path for due review, kana, N5 practice, checkpoint sprint, and study timer logging.
- Tracks weak items locally and schedules short review passes.
- Includes browser-only progress export/import and a deliberate local reset control.
- Keeps later Japan-life scenarios available without making them the first thing a beginner sees.
- Provides static About, Privacy, Terms, and Contact pages for soft-launch review.

## Privacy Model

There is no account, backend, analytics, or external API.

Progress is stored in browser `localStorage`, including scores, kana mastery, N5 mode counts, weak-item review, resume snapshot inputs, mini-session summary, study timer stats, and native-speaker notes. Clearing browser storage will remove progress unless a backup has been exported.

## Learning Scope

This is a prototype learning aid, not an official JLPT preparation product or claim of full N5 coverage.

Current focus:

- Kana-first beginner ramp
- N5 starter vocabulary
- Basic particles
- Basic grammar patterns
- Short sentence reading checks
- Habit-building and retention loops

Later roadmap:

- N5 kanji side quest
- More complete N5 coverage
- Native-speaker review workflow
- Listening/audio practice
- N4-N1 progression
- Mobile/PWA polish after a hosting target exists

## How To Run

Open `index.html` directly in a browser. No server, account, API, database, package install, or build step is required.

For service worker and PWA install testing, serve the folder over `http://localhost` or a future hosted HTTPS URL. Service workers do not run from a raw `file://` page.

## File Map

- `index.html` - app structure and static trust/scope copy
- `about.html`, `privacy.html`, `terms.html`, `contact.html` - static public trust pages
- `robots.txt`, `sitemap.xml` - crawler policy and apex-domain sitemap for `https://japanreadycoach.com/`
- `styles.css` - responsive layout and visual design
- `app.js` - interactions, scoring, local progress, review, calibration, and mini-sessions
- `n5-content.js` - beginner-first N5 kana, vocabulary, particles, grammar, and phrases
- `lessons.js` - editable scenario and phrase content
- `manifest.webmanifest`, `service-worker.js`, `icon.svg` - PWA groundwork for hosted/local-server use
- `BACKLOG.md` - roadmap and learning progression ideas

## Validation

Run these from the project folder:

```powershell
node --check app.js
node --check n5-content.js
node --check service-worker.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8')); console.log('manifest ok')"
Select-String -LiteralPath ".\n5-content.js" -Pattern '[一-龯]'
```

The no-kanji scan should return no matches while the first learning pass remains kana-first.

Canonical and social metadata use the apex domain `https://japanreadycoach.com/`. Do not advertise `www` unless it resolves or redirects.

## Content Review Notes

Native-speaker review should focus on:

- Naturalness
- Politeness level
- Whether phrases fit the intended situation
- Whether beginner explanations are clear and not misleading

The local reference PDF for later N5 kanji work is outside this repo:

`C:\Users\rdrnr\Projects\Standalone Site Experiments\Japan language sources\kanjibookjlptn5.pdf`
