# Japan Ready Coach

Static study app for a beginner-first Japanese study coach focused on kana, JLPT N5 basics, and practical confidence for moving to Japan.

Japan Ready Coach is live at `https://japanreadycoach.com/`. The `www` subdomain is not currently part of the verified launch path.

## Production Status

- Live apex domain: `https://japanreadycoach.com/`
- Public routes verified: `/`, `/about`, `/blog`, `/blog/cash-cards-suica`, `/privacy`, `/terms`, `/contact`, `/robots.txt`, `/sitemap.xml`, and `/ads.txt`.
- Current launch posture: static browser-only beta, localStorage progress, no accounts, no backend, no analytics, and beginner/N5 scope.
- Post-launch stabilization completed: extensionless public routing, service-worker cache refresh behavior, Local Data backup control alignment, mode-selection visibility, and local human review notes save feedback.
- Next sensible backlog area: keep improving beginner N5 retention/review quality before expanding into larger N4+ content or a more formal human review workflow.

## Human Launch Checklist

Recommended public description:

> Japan Ready Coach is a local-first Japanese study coach for beginners who want to build kana, JLPT N5 basics, and practical confidence for life in Japan.

- Google Search Console: add the apex property for `https://japanreadycoach.com/`, verify ownership, submit `https://japanreadycoach.com/sitemap.xml`, and request indexing for the homepage plus `/about`, `/privacy`, `/terms`, and `/contact`.
- Bing Webmaster Tools: add the apex site, import from Google Search Console if useful, submit the same sitemap, and spot-check crawl/index status.
- Cloudflare/domain sanity: keep verifying HTTPS, apex `200` responses, `robots.txt`, `sitemap.xml`, and extensionless trust-page routes. Do not advertise `www` until it resolves or redirects correctly.
- Directory/community positioning: present the site as a beta, local-first Japanese learning coach for beginners and Japan move preparation. For WebsiteLaunches or similar directories, avoid implying official JLPT certification, full N5 coverage, accounts, sync, or guaranteed language accuracy.
- Trust copy before broad promotion: add a real public contact channel when ready, then re-check Privacy/Terms copy for the actual launch posture.

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
- Provides a lightweight static Blog section with a starter first-person practical note: Cash, Cards, and Suica in Japan.

## Privacy Model

There is no account, backend, analytics, or external API.

Progress is stored in browser `localStorage`, including scores, kana mastery, N5 mode counts, weak-item review, resume snapshot inputs, mini-session summary, study timer stats, and local human review notes. Clearing browser storage will remove progress unless a backup has been exported.

## Learning Scope

This is a beta learning aid, not an official JLPT preparation product or claim of full N5 coverage.

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
- Human review workflow
- Listening/audio practice
- N4-N1 progression
- Mobile/PWA polish after a hosting target exists

## How To Run

Open `index.html` directly in a browser. No server, account, API, database, package install, or build step is required.

For service worker and PWA install testing, serve the folder over `http://localhost` or a future hosted HTTPS URL. Service workers do not run from a raw `file://` page.

## File Map

- `index.html` - app structure and static trust/scope copy, deployed at `/`
- `about.html`, `privacy.html`, `terms.html`, `contact.html` - static public trust pages, linked publicly as `/about`, `/privacy`, `/terms`, and `/contact`
- `blog.html` - static blog index, linked publicly as `/blog`
- `blog/cash-cards-suica.html` - starter practical Japan money article, linked publicly as `/blog/cash-cards-suica`
- `ads.txt` - AdSense publisher authorization file at `/ads.txt`
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

Canonical, social metadata, navigation, and sitemap entries use extensionless apex routes such as `https://japanreadycoach.com/about`. Do not advertise `www` unless it resolves or redirects.

## Content Review Notes

Human review notes are stored locally in the browser and included in progress backups. They are a note pad for future feedback, not a server-side review workflow.

Reviewer feedback should focus on:

- Naturalness
- Politeness level
- Whether phrases fit the intended situation
- Whether beginner explanations are clear and not misleading

The local reference PDF for later N5 kanji work is outside this repo:

`C:\Users\rdrnr\Projects\Standalone Site Experiments\Japan language sources\kanjibookjlptn5.pdf`
