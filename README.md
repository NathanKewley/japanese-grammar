# Nath's 日本語 Tools

A static site with five ways to study Japanese, from N5 to N1. It runs on
GitHub Pages with no build step and no server.

| App | Folder | What it does |
| --- | --- | --- |
| Grammar | `grammar/` | The JLPT grammar library: every pattern, with examples and quizzes. |
| Writing | `writing/` | Kana and 2,195 kanji, written by hand on paper, with stroke order. |
| Conjugation | `conjugation/` | Word types and every form, typed and checked. |
| Reading | `reading/` | 132 graded readings with tappable words and comprehension questions. |
| Listening | `listening/` | 132 voiced tracks with questions and dictation. |

The landing page (`index.html`) links to all five. The four study apps are web
ports of the Android apps in `vibe-jap-writing`, `vibe-srs-jap-conjugating`,
`vibe-jap-reading` and `vibe-jap-listening`. They use the same content, the
same FSRS scheduling and the same course structure, stats and achievements.

![The grammar library](assets/screenshot.png)

## Where progress is kept

Everything stays in the browser, on the device:

- The grammar library keeps saved points and settings in `localStorage`
  (`grammarNotebook.*`). The theme key is shared by the whole site.
- Each study app keeps its progress in its own IndexedDB database
  (`vibe-writing`, `vibe-conjugation`, `vibe-reading`, `vibe-listening`). The
  tables mirror the Android apps' SQLite schema. IndexedDB is used instead of
  `localStorage` because the answer history quickly outgrows `localStorage`'s
  5 MB limit.

The landing page reads every app's database to show a combined streak, cards
due, today's answers, this week's study time and a 14-day chart. Course
progress on each tile comes from a small summary each app saves in
`localStorage` (`vibe.summary.<app>`) whenever it's opened or a quiz ends,
because the landing page doesn't load the course content.

Each app's Settings tab can back up and restore that app. The landing page can
back up and restore everything at once.

## Layout

```
index.html, landing.*      the landing page
shared/core.css            the shared look (light and dark)
shared/srs/                the shared study-app engine
  fsrs.js                    FSRS scheduler, ported from the Dart fsrs 2.0.1 package
  store.js                   IndexedDB tables, held in memory while an app is open
  model.js                   progress, unlocking, decks, reviews, backups, achievements
  quiz-engine.js             rounds that repeat missed cards, and resuming
  stats.js, focus.js         stats, recommended focus and insights
  screens.js, ui.js          the shared screens and the hash router
  passage.js                 tappable Japanese text with furigana and read-aloud
  romaji.js                  romaji to kana, for keyboards without Japanese input
writing/, conjugation/, reading/, listening/
  app.js                     each app's content loader, model and screens
  data/                      content copied from the Android repos
grammar/                   the grammar library
tools/sync-content.sh      copies content from the Android repos
```

## Updating content

Rebuild content in the Android app repos as their READMEs describe, then copy
it across:

```
tools/sync-content.sh [FOLDER_HOLDING_THE_REPOS]
```

The folder defaults to this repo's parent.

## Tests

Browser tests drive a real headless Chrome through each app the way a learner
would: lessons, typed and romaji answers, typo fixes, reviews, resuming a quiz,
audio and dictation, backups, the landing page's stats and backup reminder, and
Android phone emulation with touch. Any JavaScript error fails the test.

```
python3 tools/tests/run.py            # everything, about 3 minutes
python3 tools/tests/run.py listening  # just the tests with "listening" in their name
```

They need only Python 3 and Chrome or Chromium (set `CHROME` to its path if it
isn't found). Each test starts its own web server and a fresh browser profile.
Run them after `tools/sync-content.sh` too: the apps reimplement the Android
apps' logic, so a change to a content format shows up here first.

## Running locally

The apps load their content with `fetch` and use ES modules, so open them
through a web server, not from the file system:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Notes

- **iPhone and iPad:** Safari clears a website's stored data after 7 days without
  a visit, but not for sites added to the Home Screen. The site has a web app
  manifest and icons, so *Share → Add to Home Screen* installs it. The Home
  Screen copy keeps its own storage, separate from Safari's.
- **Android:** Chrome keeps the data unless it's cleared or the phone runs very
  low on space. Chrome can install the site as an app (the manifest has
  maskable icons for Android's launcher shapes), and the browser bar follows
  the site's light or dark theme.
- **Read-aloud** in Reading uses the browser's Japanese text-to-speech voice,
  which some devices need installed first.
- **Listening audio** is Ogg Opus. Current Chrome, Edge, Firefox and Safari
  (18.4 and later) play it.
- **Typed answers** accept kana, kanji or romaji. Romaji is converted to kana, and
  the conversion is shown as you type.
- **Debugging:** each study app exposes itself as `window.vibeApp` in the
  browser console.

## Data sources and licences

The content files in `*/data/` are derived from these sources and are shared
under the same terms (CC BY-SA). Each app's Settings tab carries the credits.

- Word meanings: [JMdict](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project), EDRDG, CC BY-SA 4.0.
- Kanji: [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project), EDRDG, CC BY-SA 4.0.
- Stroke order: [KanjiVG](https://kanjivg.tagaini.net/) by Ulrich Apel, CC BY-SA 3.0.
- Literature in Reading: public-domain works from [Aozora Bunko](https://www.aozora.gr.jp/).
- Voices in Listening: [VOICEVOX](https://voicevox.hiroshiba.jp/). The Listening app's Settings tab lists each voice.
