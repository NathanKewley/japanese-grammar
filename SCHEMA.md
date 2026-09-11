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
  the matcher splits around these automatically now (see §6).
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
- `hl` is optional — see §6.2.

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
  instead of a pattern-driven table (see §6.2).
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

---

## 6. Highlighting mechanics (read before fighting with a stuck highlight)

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

### 6.1 When automatic highlighting won't find a match

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

### 6.2 The `hl` override

```js
{ japanese: "大きい犬です。", furigana: "おおきいいぬです。", english: "It is a big dog.", hl: "大きい" }
```

When present, `hl` is matched by plain `indexOf` against `japanese` — no
conjugation logic, just literal substring search. Use it when:
- The entry has no meaningful `pattern` text to match against (i-adjective/
  na-adjective/plain-form class-description entries).
- The pattern text's representative ending doesn't literally occur in a
  specific example (volitional/potential class-variance, §6.1).

Keep the highlighted span to the **grammar suffix**, not the content verb/
noun stem — e.g. highlight `める` in `読めます`, not `読める`; highlight
`こう` in `行こう`, not `行こう` in full. This matches how the automatic
matcher already behaves everywhere else, so a reader doesn't see
inconsistent highlighting scope between hand-set and automatic cases.

---

## 7. Validation

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

## 8. Changelog (high-level, chronological)

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

**Current state:** 487 entries across N5–N1, all validation checks
passing, 100% highlight coverage, 93 entries cross-linked, all 5 levels
at consistent explanation depth.

**Known gaps, not yet addressed:**
- No systematic re-check of whether more `related` pairs are warranted
  beyond the two curation passes in §5.
