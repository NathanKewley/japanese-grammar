# Grammar App — Data Model & Conventions

Reference for `grammar-data.js`. Read this before adding or editing entries —
it captures conventions that built up over many editing passes and aren't
obvious from the code alone.

---

## 1. File structure

Five top-level arrays, one per JLPT level:

```js
const N5_GRAMMAR = [ {...}, {...} ];
const N4_GRAMMAR = [ ... ];
const N3_GRAMMAR = [ ... ];
const N2_GRAMMAR = [ ... ];
const N1_GRAMMAR = [ ... ];
```

Order in the file: N5, N4, N3, N2, N1. `app.js` reads these as top-level
`const` bindings (not `window.*` properties) — see the `LEVEL_DATA` object
near the top of `app.js`.

---

## 2. Entry schema

```js
{
  id: "n2-karatoitte",              // required, unique, kebab-case, level-prefixed
  level: "N2",                      // required, must match the array it's in
  pattern: "～からといって",          // required, see §2.1
  title: "Just because ... (doesn't mean)",  // required, short English gloss
  short: "One-line summary shown collapsed.", // required, ~1 sentence
  explanation: "...",               // required, see §2.2
  usages: [ ... ],                  // required, see §3
  conjugations: [ ... ],            // optional, see §4
  related: ["n1-towaie"],           // optional, see §5
  notes: "..."                      // optional, freeform aside
}
```

### 2.1 `pattern`

The canonical grammar-point text, used to drive automatic highlighting in
examples (see `app.js`'s fragment-matching logic that finds `pattern` text
inside `japanese` example strings — a separate system from the furigana
alignment).

- Leading `～`/`~` means "attaches here" — stripped automatically.
- `/` or `／` separates alternate forms: `"～ほうがいい / ～ほうがよかった"`.
- A `～` or bare `A`/`B` **in the middle** of the string is a placeholder
  standing in for arbitrary content (`"どんな～も"`, `"AよりBのほうが"`) —
  the matcher splits around these automatically now (see §7).
- Parenthetical annotations like `（様態）` are extracted as a secondary
  fragment candidate but mostly exist for the reader's benefit.

### 2.2 `explanation`

- Plain sentences, no markdown. A literal `\n\n` is rendered as a paragraph
  break (`app.js`'s `explanationHtml` splits on it) — up to **2 paragraphs**
  is the norm, though a single well-written paragraph is entirely fine for
  simple/obvious patterns (most N5 particles, for instance) rather than
  padding to 2 for its own sake.
- Good content for paragraph 2: register (formal/casual/written), what it's
  commonly confused with and how they differ, which word classes it
  attaches to and any irregular attachment.

---

## 3. `usages`

```js
usages: [
  { title: "With verbs", examples: [ {...}, {...} ] },
  { title: "With nouns", examples: [ {...}, {...} ] }
]
```

Each example:

```js
{ japanese: "コーヒーにします。", furigana: "コーヒーにします。", english: "I'll go with coffee.", hl: "..." }
```

- `furigana` is the **all-hiragana/katakana reading** of the whole
  sentence, not per-word annotations — `app.js` derives the `<ruby>` markup
  by aligning `japanese` against `furigana` automatically.
- `hl` is optional — see §7.2.

### 3.1 Bucket titles

When a pattern attaches to more than one word class, split examples into
titled buckets rather than one flat list:

- `"With verbs"`, `"With adjectives"` (い and な combined into one bucket —
  don't split those further), `"With nouns"`.
- When a pattern has genuinely distinct **meanings** rather than just
  different attaching word classes (e.g. `だけに` = "precisely because" vs
  `だけのことはある` = "lives up to its reputation"), title by meaning
  instead and don't force a POS split — meaning-based splits take priority
  over POS-based ones when both are arguably possible.
- Single-category patterns (particles, most auxiliary-verb constructions)
  just get one usage group — don't manufacture a split that isn't there.

### 3.2 How many examples

- Minimum 2 examples per entry.
- **Every category actually shown in the `conjugations` table needs at
  least 2 examples backing it up.** This is the rule `validate.js` doesn't
  check automatically (would need to cross-reference usage titles against
  table categories) — if you add a table row, go back and confirm the
  matching usage bucket has 2+ examples, or add one.
- Prefer genuinely different verbs/nouns/contexts across examples within a
  bucket, not near-duplicate sentences.

---

## 4. `conjugations` (the table)

```js
conjugations: [
  { pos: "Verb", form: "plain form", example: "行く → 行くからといって" },
  { pos: "い-Adjective", form: "plain form", example: "安い → 安いからといって" },
  { pos: "な-Adjective", form: "stem + だ", example: "便利 → 便利だからといって" },
  { pos: "Noun", form: "+ だ", example: "学生 → 学生だからといって" }
]
```

Renders as a small table after the examples (`app.js`'s
`conjugationTableHtml`). The `example` column is run through the **same**
highlighting logic as the main examples, so からといって lights up
automatically there too — no extra work needed for that part.

### 4.1 When to include a table — and when to skip it

**Include** a table for anything that attaches to a preceding word with an
identifiable conjugation rule: auxiliary verbs, most particles (single-row
`Noun + が` etc. is fine), STANDARD-style patterns spanning verb/adjective/
noun.

**Skip** the table entirely for:
- Pure adverbs and sentence connectors that don't attach to a specific
  preceding word (どうせ, ところで, つまり, しかも, それでも, とりわけ...).
- Sentence-final particles that attach to a whole predicate rather than a
  word class (か, ね, よ).
- Entries that describe a whole word class rather than a single grammar
  point (い-adjectives, な-adjectives, 普通形) — these need `hl` overrides
  instead of a pattern-driven table (see §7.2).
- Fixed idioms with no productive conjugation (やむを得ない as a frozen
  phrase, not a general X+を得ない pattern).

When genuinely unsure, err toward a **single-row table** over no table —
almost everything attaches to *something*, even if it's just `Noun + X`.

### 4.2 How many rows

- 1 row for single-category patterns (most N1, many particles).
- Up to 4 rows (Verb / い-Adj / な-Adj / Noun) for STANDARD-style patterns.
- Add extra rows for genuinely irregular attachment (する→すべき, godan
  causative-passive contraction, etc.) rather than forcing them into the
  standard 4.

---

## 5. `related`

```js
related: ["n1-towaie"]
```

Array of other entries' `id`s. Renders as clickable chips (`app.js`'s
`relatedGrammarHtml` + `navigateToEntry`) that switch tabs/expand/scroll to
the target — works across levels.

**Always bidirectional** — if A links to B, B must also link to A. Add both
sides in the same edit.

**Curation bar:** don't link everything that's loosely related. Two
sources that have earned a link so far:
1. The `explanation` text already makes an explicit comparison ("more
   formal than X", "unlike X", "often confused with X").
2. The pair belongs to a well-known pedagogical confusion cluster (the four
   conditionals と/ば/たら/なら; the hearsay/appearance family そうだ/ようだ/
   みたい/らしい; passive/causative/potential's overlapping conjugation
   shapes; etc.) — even without explanation text calling it out explicitly.

Don't add a link on vague topical similarity alone. `validate.js` checks
that every id resolves and that nothing links to itself, but it can't check
whether a link is *worth* having — that's a judgment call each time.

`related` can point to a reference article (§6) as well as another grammar
entry — the chip rendering and navigation both handle either target
automatically based on whether the id is prefixed `ref-`.

---

## 6. Reference articles (`reference-data.js`)

A second, separate top-level tab ("Reference") for longer-form, denser
explainers that sit *underneath* the pattern-level grammar entries above —
kana charts, conjugation mechanics, word-type overviews. Where a grammar
entry's `conjugations` table says `Verb (godan), form: negative stem` and
assumes you already know what that means, an article is where that
assumption gets explained.

### 6.1 File and schema

`reference-data.js` declares `const REFERENCE_ARTICLES = [...]` the same
way `grammar-data.js` declares its five level arrays — loaded as a plain
script tag in `index.html`, referenced directly (not via `window.*`).

```js
{
  id: "ref-kana",              // required, unique, "ref-" prefixed
  title: "Kana Charts",        // required
  short: "One-line summary shown in the article list.",  // required
  related: [],                 // optional, ids of grammar entries or other articles
  blocks: [ ... ]               // required, non-empty, see §6.2
}
```

The `ref-` id prefix isn't cosmetic — `isReferenceArticle()` in `app.js`
uses it to tell an article apart from a grammar entry wherever the two can
appear interchangeably (cross-link chip targets, `findEntryById` results).
Don't use that prefix for anything else.

### 6.2 Block types

An article's body is a flat array of typed blocks, rendered in order:

- `{ type: "paragraph", text: "..." }` — plain prose.
- `{ type: "note", text: "..." }` — reuses the grammar-entry note styling,
  for an aside worth visually setting apart from the main flow.
- `{ type: "table", title: "...", headers: [...], rows: [[...], ...] }` —
  generic table, string cells. `title` is optional.
- `{ type: "kana-table", title: "...", headers: [...], rows: [[cell, ...], ...] }`
  — specialized for hiragana/katakana/romaji triples. Each cell is either
  `null` (no such sound exists — renders as a blank cell) or
  `{ hira, kata, romaji }`.

Every row must have exactly as many cells as `headers` has columns —
`validate.js`'s §3b check enforces this, along with checking that every
`kana-table` cell that isn't `null` has all three of `hira`/`kata`/`romaji`.

This is a deliberately small, closed set of block types (no generic
markdown/HTML rendering) — add a new block type only when an article
genuinely needs a layout none of the existing ones can express, and update
`renderReferenceBlock` and the §3b schema check in `validate.js` together
when you do.

### 6.3 Navigation shape

The Reference tab sits at the same level as N5–N1 and Saved (one top-level
tab), with its own two-level navigation *inside* that tab: a list view
(`referenceArticleCardHtml`, one card per article) and a full detail view
(`referenceArticleDetailHtml`, with a back button) — not the accordion/
expand-in-place pattern the grammar entries use, since these are meant to
be read as standalone long-form pages rather than skimmed inline.

The search bar is intentionally hidden while on the Reference tab
(`$searchWrap.style.display`) rather than left active — search does not
currently span into article content, and leaving the box visible-but-
inert was worse than hiding it outright (rendering the reference view
also blanks `$search.value`, which would otherwise erase whatever the
person had just typed on every keystroke).

### 6.4 Cross-linking with grammar entries

Same `related` mechanism as §5, extended to work in both directions:
a grammar entry can link to an article, and an article can link back to
specific grammar entries via its own `related` array. `navigateToEntry`
detects an article target (via the `ref-` prefix) and switches to the
Reference tab + opens that article, instead of trying to switch to a JLPT
level tab and expand an accordion card.

The kana article currently has no grammar-entry links — kana charts don't
have a natural single-pattern pairing the way, say, a future "verb types"
article would (which should link out to n4-passive/n4-causative/
n4-potential, all of which lean on godan/ichidan conjugation knowledge).
Don't force a link where one doesn't genuinely help; an article with zero
`related` entries is fine.

---

## 7. Highlighting mechanics (read before fighting with a stuck highlight)

Two independent things are happening in an example sentence:

1. **Furigana → ruby markup.** `alignment.js`'s `computeAlignment` aligns
   `japanese` against `furigana` char-by-char and wraps kanji runs in
   `<ruby>`. This is the algorithm that had a real boundary-ambiguity bug
   (fixed by enumerating all valid alignments and preferring the one with
   the evenest mora-per-kanji-character ratio — see changelog). It's
   shared between `app.js` (rendering) and `validate.js` (checking) via
   this one file — never re-derive a second copy of it.

2. **Grammar-point highlighting.** A *separate* system in `app.js` takes
   `pattern` and tries to find it (with a large pile of conjugation/
   voicing/politeness variant-generation) inside `japanese`. This is what
   wraps the matched span in `<mark class="grammar-hl">`.

### 7.1 When automatic highlighting won't find a match

The variant-generation in `app.js` (`withConjugationStems`,
`withPoliteVariant`, `withCopulaVariant`, `withAdjectiveVariant`,
`withCasualContraction`, `withMiscVariant`, `withSharedSubstring`, the
mid-string/A-Z placeholder splitting) covers: godan/ichidan conjugation
including irregular する/来る, plain↔polite (ます⇄ません, だ⇄です, ない⇄
ません/なく/なかった), casual contractions (てしまう→ちゃう), a handful of
idiomatic ある-derived negatives (しかない→しかありません etc.), and
placeholder-style pattern text.

It does **not**, and structurally cannot without per-verb conjugation-class
data, resolve cases where the pattern text itself uses one representative
ending that varies by verb class — volitional よう/おう (行く→行こう, not
行よう) and potential られる/れる (読む→読める, not 読まれる) are the known
example of this. This is why those entries use `hl` overrides.

### 7.2 The `hl` override

```js
{ japanese: "大きい犬です。", furigana: "おおきいいぬです。", english: "It is a big dog.", hl: "大きい" }
```

When present, `hl` is matched by plain `indexOf` against `japanese` — no
conjugation logic, just literal substring search. Use it when:
- The entry has no meaningful `pattern` text to match against (i-adjective/
  na-adjective/plain-form class-description entries).
- The pattern text's representative ending doesn't literally occur in a
  specific example (volitional/potential class-variance, §7.1).

Keep the highlighted span to the **grammar suffix**, not the content verb/
noun stem — e.g. highlight `める` in `読めます`, not `読める`; highlight
`こう` in `行こう`, not `行こう` in full. This matches how the automatic
matcher already behaves everywhere else, so a reader doesn't see
inconsistent highlighting scope between hand-set and automatic cases.

---

## 8. Worksheet generator (`generateWorksheetHtml` in `app.js`)

Every grammar entry's expanded view has a "View Worksheet" button
(`worksheet-open-btn`) that opens a fullscreen modal with a practice
worksheet, built entirely from that entry's own data — no separate
worksheet content is authored or stored anywhere.

### 8.1 What it generates

A single "Fill in the Blank" section: up to 5 of the entry's own
examples, each with the grammar-point span removed and replaced with a
static visual blank (`worksheet-blank-placeholder`), followed by
multiple-choice options for which text correctly fills it. Which span to
blank starts from `getExampleHighlightRange` — the exact same function
`exampleHtml` uses to decide what to highlight (§7) — then extended
through one immediately-following conjugation ending via
`extendBlankForConjugation` (a fixed list of common endings: ました, ます,
た, て, ない, ...), since the highlighting system deliberately marks only
a pattern's invariant core (させ) and a blank built from just that would
always look like the same bare stem regardless of which example was
picked. The extension is capped at a single following ending rather than
looped, so a blank like させて (causative + て-form) correctly stops there
instead of swallowing an unrelated following verb, as in させてあげた.

Each option is real inflected text pulled from an actual example — the
correct option from the entry's own extended blank, and each distractor
from a genuinely different pattern's own examples (preferring `related`
entries first, since a real confusion pair makes a better question than
a random one; topped up with random same-level entries, requesting extra
candidates beyond what's needed so a distractor whose text happens to
collide with something already used can just be skipped rather than
leaving the question short an option) — buildRubyBlank (a sibling of
buildRuby that takes the blank's markup as a parameter) renders the
sentence with the blank in place.

A "✓ Check Answers" button (`checkWorksheetAnswers`) marks each answered
question's selected option green if correct or red if not, revealing the
correct option in green alongside it when the pick was wrong, and shows a
score summary ("3 / 5 correct (1 unanswered)"). Re-selecting an option on
an already-checked question clears that question's feedback so it can be
answered and checked again — nothing is locked after one check. An
earlier version used a static `<details>` answer key instead; that's what
this replaced.

An even earlier version split this into two separate exercises (a typed
fill-in-the-blank, plus a separate "which pattern fits" multiple choice
using just the English translation and the bare pattern label as every
option) and included a third, ungraded "write your own sentence" section.
Both were cut in favor of the single merged exercise described above.

### 8.2 Regeneration

Selections are randomized (`shuffleArray`/`pickN`) — the "↻ New
Worksheet" button re-runs generation for the same entry, producing a
different set of examples/distractors each time, since this is meant to
be practiced more than once rather than viewed as a single fixed sheet.

### 8.3 Why this approach

Building this as an algorithm over existing data (rather than authoring a
worksheet per entry by hand) means it works for all 487 entries
immediately and stays in sync automatically if an entry's examples ever
change — no second content-authoring pass to maintain alongside the main
one.

## 9. Validation

Run before shipping any data change:

```
cd grammar-app && node validate.js
```

Checks (see the file's own header comment for full detail): schema,
furigana alignment, duplicate entry ids, duplicate examples within an
entry, related-link integrity (hard failures, non-zero exit) — plus a
kanji-reading-consistency review list (never a hard failure; most flagged
pairs are legitimate alternate readings like 好き vs 好む, but it's the
check that caught the alignment algorithm bug and 4 real furigana typos,
so glance at new entries in that list rather than ignoring it by habit).

`validate.js` requires `alignment.js` — don't delete or bypass that file,
and don't copy its logic elsewhere; both `app.js` and `validate.js` import
the same implementation on purpose.

After any data edit, also spot-check in a real render — `validate.js`
confirms the *data* is well-formed, not that it *renders* correctly (e.g.
it wouldn't catch a CSS regression or a JS error in a new feature).

---

## 10. Changelog (high-level, chronological)

1. **Initial build** — static HTML5 JLPT reference, N5–N1, ~486 grammar
   points with furigana toggle, search, save/review list, light/dark mode.
2. **Highlighting v1** — pattern-in-example matching with conjugation-stem
   generation (godan/ichidan verb endings, voicing, kanji/kana furigana
   fallback).
3. **Content depth pass (N1→N2→N3)** — explanations expanded to up to 2
   paragraphs, examples expanded for nuance coverage. N4/N5 deliberately
   left lighter.
4. **Conjugation tables** — added to all 5 levels, with the
   skip-for-adverbs/particles criteria in §4.1. Then a second, more
   rigorous pass across N2 (then N3, N1, N4, N5) to guarantee every
   category shown in a table has 2+ backing examples, not just "some".
5. **Highlighting v2** — fixed the three known blind spots: plain/polite
   negative alternation, placeholder-style pattern text, and word-class
   description entries (via the new `hl` override). 193 → 7 dataset-wide
   misses in that pass.
6. **ので added** — a genuine content gap (no dedicated ので entry despite
   being fundamental N4/N5 material).
7. **Typo sweep → alignment algorithm rewrite.** Went looking for simple
   typos; found instead that the core furigana-alignment algorithm had a
   real boundary-ambiguity bug (a short/common particle can appear both as
   the separator *and* embedded inside the preceding kanji run's own
   reading — 機能性→きのうせい contains の; 本人→ほんにん contains に).
   Simple heuristics weren't sufficient; the fix enumerates every
   structurally-valid alignment and picks the one with the most even
   mora-per-kanji-character ratio. Also found and fixed 4 real furigana
   typos this same bug had been masking (頑張, 済む, 彼, 子供).
8. **Related-grammar links** — cross-linking between commonly-confused
   pairs, in two passes (explicit "compare with X" language already in
   explanations, then well-known pedagogical clusters). 93 entries linked.
9. **Tooling consolidation** — extracted the alignment algorithm into
   `alignment.js` (shared between `app.js` and a new `validate.js`) so the
   validator can never drift from what the app actually renders.
10. **Highlighting v3** — closed the last 7 misses (volitional/potential
    class-variance) via `hl` overrides. Dataset-wide highlight coverage is
    now 100% (2,290 highlights / 1,688 examples / 0 misses).
11. **N4/N5 explanation depth** — brought both levels up to the same
    standard as N1–N3 (1–2 paragraphs, register/confusion notes where
    genuinely warranted). Most N5 entries stayed at 1 solid paragraph
    given how simple the underlying grammar is; N4 skews slightly longer
    given more auxiliary-verb nuance to unpack. This closes the depth gap
    called out as a known limitation after the original content passes.
12. **Reference tab added** — a new top-level tab for longer-form articles
    on Japanese mechanics (kana, conjugation systems, word types) that sit
    underneath the pattern-level grammar entries, with cross-linking in
    both directions via the same `related` mechanism. Started with one
    article (kana charts); see §6.
13. **Five more reference articles** — particles at a glance (consolidated
    comparison table across every core particle, cross-linked to 15
    individual grammar entries), counters, numbers & dates, kanji readings
    (onyomi/kunyomi), and keigo's irregular verbs (cross-linked to the two
    productive keigo grammar entries). 6 articles total.
14. **Conjugation reference tables** — the full adjective (い vs な) and
    verb (ichidan vs godan) conjugation paradigms side by side, adapted
    from a user-supplied reference doc. Corrected one factual error found
    in that source (an example demonstrating "too quiet to sleep" had used
    寝られる, the *positive* "can sleep," rather than a negative outcome —
    fixed to 眠れない) and replaced its abstract gojūon-row lookup method
    for verb stem-shifts with a direct table of each dictionary ending's
    full shifted forms, explicitly calling out the う→わ exception the
    original's row-based method left implicit. Cross-linked to the
    adjective-type entries and the passive/causative/potential/volitional
    grammar entries (added bidirectionally, per §5's rule). 7 articles
    total.
15. **Reference tab hidden.** Reconsidered — felt like it pulled focus
    away from the app's core (pattern-level grammar reference) rather than
    complementing it. Hidden behind `SHOW_REFERENCE_TAB` in `app.js`
    (currently `false`) rather than removed: `reference-data.js`, its
    render/cross-link code, and `validate.js`'s article checks are all
    left fully intact, so flipping that one flag brings it straight back.
    Related-grammar chips pointing to articles are also suppressed while
    the flag is off, so nothing links into a tab with no way back to it.
16. **Worksheet generator.** A "View Worksheet" button on every expanded
    grammar entry opens a fullscreen modal with a practice worksheet:
    fill-in-the-blank (built by reusing the exact highlighting/`hl`-match
    logic to find and blank the grammar-point span in a few of the
    entry's own examples), multiple-choice pattern recognition (distractor
    options drawn from `related` entries when available, falling back to
    random same-level entries), an open "write your own sentence" prompt,
    and a collapsible answer key. Everything is generated algorithmically
    from data the entry already has — no separate worksheet content was
    authored, so it works for all 487 entries immediately, and a
    "New Worksheet" button reshuffles the selection on demand. See §8.
17. **Worksheet simplified: merged into one exercise.** The separate
    typed-fill-in-the-blank and pattern-recognition-multiple-choice
    sections were merged into a single "fill in the blank, answered by
    multiple choice" exercise, and the ungraded "write your own sentence"
    section was dropped entirely. `buildRubyBlank` was generalized to take
    the blank's markup as a parameter (a static placeholder now, rather
    than always building a text input) so the same span-splicing logic
    still serves both.
18. **Worksheet: Check Answers replaces the static answer key.** A
    "✓ Check Answers" button grades whatever's currently selected in
    place — correct picks turn green, wrong picks turn red with the
    actual correct option also revealed in green, and a score summary
    appears ("3 / 5 correct"). Re-picking an option on an already-checked
    question clears its feedback so it can be tried and checked again.
19. **Worksheet options now use real inflected text, not the bare
    pattern label.** Previously every option was just the entry's
    dictionary-form pattern name regardless of which example was shown,
    so a causative question always offered "causative voice" as the
    answer even when the blanked sentence used させました or させて.
    `extendBlankForConjugation` extends the blank (and thus the correct
    answer) through one following conjugation ending, and distractors are
    now pulled from a genuinely different pattern's own examples the same
    way, so options actually vary in form question to question. Needed a
    second fix once shipped: a distractor whose extracted text happened
    to collide with the correct answer wasn't always caught (the
    fallback path didn't re-check for collision), so `buildFillBlankQuestions`
    now requests extra candidate distractors and skips any that fully
    collide rather than showing a duplicate option.

**Current state:** 487 entries across N5–N1, all validation checks
passing, 100% highlight coverage, 96 entries cross-linked, all 5 levels
at consistent explanation depth, 7 reference articles built (currently
hidden), worksheet generation available on every entry.

**Known gaps, not yet addressed:**
- No systematic re-check of whether more `related` pairs are warranted
  beyond the two curation passes in §5.
- Reference-tab search is intentionally out of scope for now (§6.3) —
  revisit if the article count grows enough that browsing alone doesn't
  cut it.
- Two of the four originally-uploaded reference docs haven't been adapted
  into articles yet: identifying い-adjectives vs な-adjectives (including
  the いい exception and the えい-ending rule), and identifying
  Ichidan vs Godan vs Irregular verbs. The conjugation *tables* from the
  third doc are done (§14); the *type-identification* guides from the
  other two are still outstanding.
- Further reference-article candidates considered but not yet built:
  compound verb formation (〜始める/〜過ぎる/〜出す as a general mechanism),
  sentence structure/word order, and a consolidated formality-register
  chart (だ/です, から/ので, ない/ません side by side).
