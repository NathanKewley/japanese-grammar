// grammar-core.js: the grammar data and the logic both the Grammar Library and
// the grammar course need. Finding a grammar point inside an example sentence,
// furigana as ruby markup, and fill-in-the-blank questions built from an
// entry's own examples. Moved out of app.js unchanged, so both pages compute
// these exactly the same way. Loaded as a plain script after grammar-data.js,
// reference-data.js and alignment.js; defines window.GrammarCore.
(function () {
  "use strict";

  // Math.random, or the source given to withRandom.
  var random = Math.random;

  /** Runs [fn] with [rnd] (a function returning 0 to 1) as the random source. */
  function withRandom(rnd, fn) {
    var saved = random;
    random = rnd;
    try { return fn(); } finally { random = saved; }
  }

  var LEVELS = [
    { id: "N5", label: "N5" },
    { id: "N4", label: "N4" },
    { id: "N3", label: "N3" },
    { id: "N2", label: "N2" },
    { id: "N1", label: "N1" }
  ];

  // grammar-data.js declares these with `const` at top level, so they live
  // in the shared global lexical scope rather than as window properties —
  // reference them directly, not via window.*.
  var LEVEL_DATA = {
    N5: (typeof N5_GRAMMAR !== "undefined") ? N5_GRAMMAR : [],
    N4: (typeof N4_GRAMMAR !== "undefined") ? N4_GRAMMAR : [],
    N3: (typeof N3_GRAMMAR !== "undefined") ? N3_GRAMMAR : [],
    N2: (typeof N2_GRAMMAR !== "undefined") ? N2_GRAMMAR : [],
    N1: (typeof N1_GRAMMAR !== "undefined") ? N1_GRAMMAR : []
  };

  // Longer-form reference articles (kana, conjugation mechanics, word
  // types, ...) — a separate, denser tier below the pattern-level grammar
  // entries above. See reference-data.js for the schema.
  var REFERENCE_ARTICLES_DATA = (typeof REFERENCE_ARTICLES !== "undefined") ? REFERENCE_ARTICLES : [];

  function findReferenceArticleById(id) {
    for (var i = 0; i < REFERENCE_ARTICLES_DATA.length; i++) {
      if (REFERENCE_ARTICLES_DATA[i].id === id) return REFERENCE_ARTICLES_DATA[i];
    }
    return null;
  }

  function isReferenceArticle(item) {
    return !!item && typeof item.id === "string" && item.id.indexOf("ref-") === 0;
  }

  function allEntries() {
    var out = [];
    LEVELS.forEach(function (lvl) { out = out.concat(LEVEL_DATA[lvl.id]); });
    return out;
  }

  function entriesForLevel(levelId) {
    return LEVEL_DATA[levelId] || [];
  }

  function findEntryById(id) {
    for (var i = 0; i < LEVELS.length; i++) {
      var arr = LEVEL_DATA[LEVELS[i].id];
      for (var j = 0; j < arr.length; j++) {
        if (arr[j].id === id) return arr[j];
      }
    }
    return findReferenceArticleById(id);
  }

  // ---------- Grammar-point highlighting ----------
  // We don't have manually-tagged spans, so this heuristically finds where
  // the entry's pattern (in some conjugated/attached form) appears in the
  // example sentence, by matching literal fragments extracted from the
  // pattern string. Works well for patterns that are a fixed suffix/particle
  // attached after a stem (the vast majority); patterns using ～ as a
  // *mid-string* placeholder (e.g. "お～になる", "～か～ないかのうちに")
  // won't reliably match and simply render unhighlighted — a safe no-op
  // rather than a wrong highlight.
  // Verbs ending in ぐ/ぬ/ぶ/む trigger euphonic voicing when the て/た-form
  // attaches: 泳ぐ+て -> 泳いで, 死ぬ+た -> 死んだ, 急ぐ+たって -> 急いだって.
  // Any pattern fragment beginning with た or て may show up voiced (だ/で)
  // in an example depending on the verb it attaches to, so we add that
  // variant as an extra candidate alongside the original.
  var VOICING_MAP = { "た": "だ", "て": "で" };

  function withVoicedVariant(frag) {
    var out = [frag];
    var first = frag.charAt(0);
    if (VOICING_MAP[first]) {
      out.push(VOICING_MAP[first] + frag.slice(1));
    }
    return out;
  }

  // Many pattern fragments are themselves conjugating verbs (させる, される,
  // られる, くれる, あげる, ...), so the dictionary form printed in `pattern`
  // often never appears verbatim in an example — させる shows up as
  // させました/させた/させて/させます. We add the conjugation stem as an
  // extra candidate so the highlight still finds it regardless of tense.
  var ICHIDAN_PRECEDING = "いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ";
  // Godan verbs' euphonic て/た-form and ます-stem depend only on which
  // kana the dictionary form ends in — uniform across every verb sharing
  // that ending, so a single per-ending rule covers all of them (this
  // fully replaces the old approach of listing specific verbs like ある/
  // なる by hand, which never generalized to ones we hadn't thought of).
  var GODAN_ENDINGS = {
    "く": { masu: "き", te: "いて", ta: "いた" },
    "ぐ": { masu: "ぎ", te: "いで", ta: "いだ" },
    "す": { masu: "し", te: "して", ta: "した" },
    "つ": { masu: "ち", te: "って", ta: "った" },
    "ぬ": { masu: "に", te: "んで", ta: "んだ" },
    "ぶ": { masu: "び", te: "んで", ta: "んだ" },
    "む": { masu: "み", te: "んで", ta: "んだ" }
  };

  // For polite ません, a godan verb's negative stem (あ-row: 飲ま-ない) needs
  // its final kana raised to the い-row (飲み-ません) — ichidan verbs need no
  // change since their nai-stem and masu-stem are identical (食べ-ない /
  // 食べ-ません). This table covers the row conversion for godan verbs.
  var AROW_TO_IROW = {
    "あ": "い", "か": "き", "が": "ぎ", "さ": "し", "ざ": "じ",
    "た": "ち", "だ": "ぢ", "な": "に", "は": "ひ", "ば": "び",
    "ぱ": "ぴ", "ま": "み", "ら": "り", "わ": "い"
  };

  // A handful of ない-endings are idiomatic/irregular rather than regular
  // verb negatives (しかない, がない, ではない, じゃない all trace back to
  // ある's suppletive negative), so their polite forms don't follow the
  // regular row-conversion rule above and are listed directly.
  var IDIOMATIC_NAI_POLITE = {
    "しかない": "しかありません",
    "がない": "がありません",
    "はない": "はありません",
    "もない": "もありません",
    "ほかない": "ほかありません",
    "ではない": "ではありません",
    "じゃない": "じゃありません"
  };

  function withPoliteVariant(frag) {
    var out = [frag];
    if (frag.length < 2 || frag.slice(-2) !== "ない") return out;

    var matchedIdiom = false;
    for (var idiom in IDIOMATIC_NAI_POLITE) {
      if (frag.slice(-idiom.length) === idiom) {
        out.push(frag.slice(0, -idiom.length) + IDIOMATIC_NAI_POLITE[idiom]);
        matchedIdiom = true;
        break;
      }
    }

    if (!matchedIdiom && frag.length >= 3) {
      var beforeNai = frag.charAt(frag.length - 3);
      if (ICHIDAN_PRECEDING.indexOf(beforeNai) !== -1) {
        // Ichidan (or already い/え-row): straight substitution.
        out.push(frag.slice(0, -2) + "ません");
      } else if (AROW_TO_IROW[beforeNai]) {
        // Godan: raise the preceding kana to its い-row counterpart first.
        out.push(frag.slice(0, -3) + AROW_TO_IROW[beforeNai] + "ません");
      }
    }

    // ない itself conjugates like an い-adjective (無い): なく (adverbial,
    // "までもなく"), なかった (past, "禁じ得なかった"). Add both regardless
    // of the verb-negative handling above, since either may be what an
    // example actually uses.
    out.push(frag.slice(0, -2) + "なく");
    out.push(frag.slice(0, -2) + "なかった");

    return out;
  }

  // ます itself conjugates (ません/ました/ませんでした) — needed for the
  // ～ます entry, where the bare pattern text never appears verbatim in a
  // negative or past-tense example.
  function withMasuVariant(frag) {
    var out = [frag];
    if (frag.slice(-2) === "ます") {
      var stem = frag.slice(0, -2);
      out.push(stem + "ません");
      out.push(stem + "ました");
      out.push(stem + "ませんでした");
    } else if (frag.slice(-3) === "ますか") {
      var qStem = frag.slice(0, -3);
      out.push(qStem + "ませんか");
    }
    return out;
  }

  // だ/です are the same copula at different formality, and both further
  // conjugate (だった/でした for past, で for the connective/te-form). Any
  // auxiliary built on だ — わけだ, はずだ, そうだ, ようだ, 〜予定だ — shows
  // up in examples in any of these forms depending on register and
  // sentence position.
  function withCopulaVariant(frag) {
    var out = [frag];
    if (frag.length >= 2 && frag.slice(-1) === "だ") {
      var stem = frag.slice(0, -1);
      out.push(stem + "です");
      out.push(stem + "で");
      // そう and よう additionally appear in adverbial (に) and
      // attributive (な) form, since they behave like な-adjectives.
      if (stem.slice(-2) === "そう" || stem.slice(-2) === "よう") {
        out.push(stem + "に");
        out.push(stem + "な");
      }
    } else if (frag.slice(-2) === "です") {
      var dStem = frag.slice(0, -2);
      out.push(dStem + "でした");
      out.push(dStem + "だった");
    }
    return out;
  }

  // てしまう/でしまう commonly contract to ちゃう/じゃう in casual speech
  // (宿題をやってしまった -> やっちゃった), which then conjugates as an
  // ordinary う-verb via the existing godan handling once substituted in.
  function withCasualContraction(frag) {
    var out = [frag];
    if (frag.indexOf("てしまう") !== -1) {
      out.push(frag.replace(/てしまう/, "ちゃう"));
    } else if (frag.indexOf("でしまう") !== -1) {
      out.push(frag.replace(/でしまう/, "じゃう"));
    }
    return out;
  }

  // ～になる／～にする (noun/な-adjective attachment) and ～くなる／～くする
  // (い-adjective attachment) are two attachment forms of the same pattern;
  // an entry's `pattern` field typically only spells out one; add the other
  // as a sibling so both surface in examples.
  // A handful of small, independent surface variations that don't fit the
  // broader rules above: some words optionally drop a trailing particle
  // before a pause (ため/ために, 末に/末の -> bare ため/末), one common
  // orthographic alternation (づ/ず, both pronounced "zu"), a couple of
  // fixed attributive/adverbial alternates, and one idiom built on ある's
  // suppletive negative.
  function withMiscVariant(frag) {
    var out = [frag];
    if (frag.slice(-3) === "ために") out.push(frag.slice(0, -1));
    if (frag === "末に" || frag === "末の") out.push("末");
    if (frag.indexOf("づ") !== -1) out.push(frag.replace(/づ/g, "ず"));
    if (frag.slice(-4) === "ばかりに") out.push(frag.slice(0, -1) + "の");
    if (frag === "さらに") out.push("さらなる");
    if (frag.charAt(0) === "に" && frag.length > 1) out.push("にも" + frag.slice(1));
    if (frag.slice(-3) === "がある") out.push(frag.slice(0, -3) + "はありません");
    return out;
  }

  // Some patterns list several particle-attached alternates that share a
  // long common prefix or suffix (次第だ／次第で／次第による all share
  // 次第; その結果／た結果 both end in 結果) — the shared portion is often
  // exactly what appears in an example on its own, so add it as one more
  // fallback candidate once all the alternates for a pattern are known.
  function withSharedSubstring(pieces) {
    if (pieces.length < 2) return pieces;
    var prefix = pieces[0];
    var suffix = pieces[0];
    for (var i = 1; i < pieces.length; i++) {
      while (prefix && pieces[i].indexOf(prefix) !== 0) prefix = prefix.slice(0, -1);
      while (suffix && pieces[i].slice(-suffix.length) !== suffix) suffix = suffix.slice(1);
    }
    var out = pieces.slice();
    if (prefix.length >= 2) out.push(prefix);
    if (suffix.length >= 2) out.push(suffix);
    return out;
  }

  function withNiKuVariant(frag) {
    var out = [frag];
    if (frag.slice(-3) === "になる" || frag.slice(-3) === "にする") {
      out.push("く" + frag.slice(-2));
    }
    return out;
  }

  // い-adjectives (and adjective-like verb suffixes such as たい) conjugate
  // by dropping い and adding くない/かった/くなかった/くて. Applied to any
  // fragment ending in い so it also covers cases like ～たい → ～たくない.
  function withAdjectiveVariant(frag) {
    var out = [frag];
    if (frag.length < 2 || frag.charAt(frag.length - 1) !== "い") return out;
    var stem = frag.slice(0, -1);
    out.push(stem + "くない");
    out.push(stem + "かった");
    out.push(stem + "くなかった");
    out.push(stem + "くて");
    return out;
  }

  function withConjugationStems(frag) {
    // られる only correctly attaches after ichidan-verb stems; for godan
    // verbs the equivalent passive/potential is just れる (読む -> 読まれる,
    // not *読まられる). Any fragment containing られる gets a れる sibling
    // so both conjugation families are covered.
    var candidates = [frag];
    if (frag.indexOf("られる") !== -1) {
      candidates.push(frag.replace(/られる/, "れる"));
    }
    // Causative-passive contracts for godan verbs: [causative-stem]せられる
    // -> [causative-stem]される (飲ませられる -> 飲まされる). The pattern
    // text itself models this with する (させられる), where さ is する's
    // own irregular causative stem — not part of the transferable
    // morpheme — so we first strip that down to the bare せられる that
    // actually attaches after other verbs, then contract that.
    if (frag.indexOf("させられる") !== -1) {
      var bareSeraeru = frag.replace(/させられる/, "せられる");
      candidates.push(bareSeraeru);
      candidates.push(bareSeraeru.replace(/せられる/, "される"));
    } else if (frag.indexOf("せられる") !== -1) {
      candidates.push(frag.replace(/せられる/, "される"));
    }

    var out = [];
    candidates.forEach(function (c) {
      out.push(c);
      if (c.length < 2) return;
      var last = c.charAt(c.length - 1);
      var beforeLast = c.charAt(c.length - 2);
      if (last === "る" && ICHIDAN_PRECEDING.indexOf(beforeLast) !== -1) {
        // Ichidan verb (たべる/せる/くれる/あげる/かける/れる/...): stem = drop る.
        out.push(c.slice(0, -1));
      } else if (c.slice(-2) === "する") {
        // Irregular する: stem = し.
        out.push(c.slice(0, -2) + "し");
      } else if (c.slice(-2) === "くる") {
        // Irregular 来る: stem = き (for ます/た/て forms).
        out.push(c.slice(0, -2) + "き");
      } else if (last === "う") {
        // Godan う-verb (もらう/しまう/買う/...): い for ます-stem,
        // って/った for て/た-form (small-つ + voicing, no exceptions).
        var stem = c.slice(0, -1);
        out.push(stem + "い");
        out.push(stem + "って");
        out.push(stem + "った");
      } else if (last === "る") {
        // Godan る-verb (ある/なる/終わる/取る/曲がる/...): uniform
        // euphonic pattern regardless of the preceding kana — り for
        // ます-stem, って/った for て/た-form.
        var ruStem = c.slice(0, -1);
        out.push(ruStem + "り");
        out.push(ruStem + "って");
        out.push(ruStem + "った");
      } else if (c.slice(-2) === "行く" || c.slice(-2) === "いく") {
        // 行く is the one well-known exception to the く-ending rule below
        // (行って/行った, not the euphonic 行いて/行いた).
        var ikuStem = c.slice(0, -1);
        out.push(ikuStem + "き");
        out.push(ikuStem + "って");
        out.push(ikuStem + "った");
      } else if (GODAN_ENDINGS[last]) {
        // Any other godan verb ending in く/ぐ/す/つ/ぬ/ぶ/む: apply that
        // ending's regular euphonic て/た-form and ます-stem.
        var rule = GODAN_ENDINGS[last];
        var gStem = c.slice(0, -1);
        out.push(gStem + rule.masu);
        out.push(gStem + rule.te);
        out.push(gStem + rule.ta);
      }
    });
    return out;
  }

  // Pattern text uses a single leading ～/~ as the conventional "attaches
  // here" marker, which we strip and keep the rest as one fragment. But a
  // ～ or bare capital letter appearing mid-string (AよりBのほうが,
  // どんな～も, 全然～ない) is a genuine placeholder standing in for
  // arbitrary content that will never appear verbatim in an example — for
  // those we split around the placeholder and search each surrounding
  // chunk independently instead of concatenating across the gap.
  function splitOnPlaceholders(text) {
    var pieces = text.split(/[~～A-Z]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    return pieces.length ? pieces : [text];
  }

  function extractFragments(pattern) {
    var frags = [];
    var parenRe = /[（(]([^）)]*)[）)]/g;
    var m;
    while ((m = parenRe.exec(pattern)) !== null) {
      frags.push(m[1]);
    }
    var withoutParens = pattern.replace(parenRe, " ");
    var allText = [withoutParens].concat(frags).join(" / ");
    var rawParts = allText.split(/[\/／・]/);
    var cleanedParts = [];
    rawParts.forEach(function (p) {
      p = p.trim();
      if (!p) return;
      if (/^[~～]/.test(p)) p = p.slice(1).trim();
      if (p) cleanedParts.push(p);
    });
    var parts = withSharedSubstring(cleanedParts);
    var out = [];
    parts.forEach(function (p) {
      splitOnPlaceholders(p).forEach(function (piece) {
        if (!piece) return;
        withMiscVariant(piece).forEach(function (mc) {
          withNiKuVariant(mc).forEach(function (nk) {
            withCasualContraction(nk).forEach(function (cc) {
              withAdjectiveVariant(cc).forEach(function (av) {
                withMasuVariant(av).forEach(function (mv) {
                  withCopulaVariant(mv).forEach(function (cv) {
                    withPoliteVariant(cv).forEach(function (pv) {
                      withConjugationStems(pv).forEach(function (variant) {
                        out = out.concat(withVoicedVariant(variant));
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    out.sort(function (a, b) { return b.length - a.length; });
    return out;
  }

  function findHighlightRange(japanese, furigana, pattern) {
    var frags = extractFragments(pattern);
    for (var i = 0; i < frags.length; i++) {
      var f = frags[i];
      if (!f) continue;
      var idx = japanese.indexOf(f);
      if (idx !== -1) return { start: idx, end: idx + f.length };
    }
    // Fallback: pattern written in hiragana but example spells it with
    // kanji (あいだ vs 間). Try the same fragments against the furigana
    // reading and map a hit back onto the kanji text.
    if (furigana) {
      var segments = null;
      for (var j = 0; j < frags.length; j++) {
        var hf = frags[j];
        if (!hf || !HIRAGANA_ONLY_RE.test(hf)) continue;
        var fIdx = furigana.indexOf(hf);
        if (fIdx === -1) continue;
        if (segments === null) segments = buildAlignmentSegments(japanese, furigana);
        if (!segments) break;
        var mapped = mapFuriRangeToJapanese(segments, fIdx, fIdx + hf.length);
        if (mapped) return mapped;
      }
    }
    return null;
  }

  function rangesOverlap(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  // Fallback for when the pattern is written in hiragana (あいだ) but the
  // example spells the same word with kanji (間): search the furigana
  // reading instead, then map the matched span back onto the kanji text
  // using the same alignment the ruby-builder relies on.
  var HIRAGANA_ONLY_RE = /^[\u3041-\u3096\u30fc]+$/;

  // Alignment algorithm lives in alignment.js (loaded before this file) so
  // the validator can reuse the exact same logic instead of a hand-copied
  // approximation of it. See that file for how/why it works.
  var computeAlignment = GrammarAlignment.computeAlignment;

  function buildAlignmentSegments(japanese, furigana) {
    return computeAlignment(japanese, furigana);
  }

  function mapFuriRangeToJapanese(segments, fStart, fEnd) {
    var jStart = null, jEnd = null;
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      if (seg.fEnd <= fStart || seg.fStart >= fEnd) continue;
      if (jStart === null) {
        jStart = seg.isKanji ? seg.jStart : seg.jStart + (Math.max(fStart, seg.fStart) - seg.fStart);
      }
      jEnd = seg.isKanji ? seg.jEnd : seg.jStart + (Math.min(fEnd, seg.fEnd) - seg.fStart);
    }
    if (jStart === null || jEnd === null) return null;
    return { start: jStart, end: jEnd };
  }

  function highlightSlice(text, segStart, segEnd, hl) {
    if (!hl) return escapeHtml(text);
    var s = Math.max(segStart, hl.start);
    var e = Math.min(segEnd, hl.end);
    if (s >= e) return escapeHtml(text);
    var relS = s - segStart, relE = e - segStart;
    var before = text.slice(0, relS);
    var mid = text.slice(relS, relE);
    var after = text.slice(relE);
    return escapeHtml(before) + (mid ? '<mark class="grammar-hl">' + escapeHtml(mid) + "</mark>" : "") + escapeHtml(after);
  }

  // ---------- Furigana -> ruby markup ----------
  // Aligns a plain-Japanese string against its all-hiragana furigana string
  // and produces <ruby>kanji<rt>reading</rt></ruby> markup. Falls back to
  // showing the japanese text plain if alignment ever fails. Optionally
  // wraps the span given by `hl` ({start,end} character offsets into
  // `japanese`) in a highlight <mark>.
  function buildRuby(japanese, furigana, hl) {
    if (!furigana) return highlightSlice(japanese, 0, japanese.length, hl);
    var segments = computeAlignment(japanese, furigana);
    if (!segments) return highlightSlice(japanese, 0, japanese.length, hl);
    var out = "";
    segments.forEach(function (seg) {
      var jText = japanese.slice(seg.jStart, seg.jEnd);
      if (!seg.isKanji) {
        out += highlightSlice(jText, seg.jStart, seg.jEnd, hl);
        return;
      }
      var reading = furigana.slice(seg.fStart, seg.fEnd);
      var rubyHtml = "<ruby>" + escapeHtml(jText) + "<rt>" + escapeHtml(reading) + "</rt></ruby>";
      if (hl && rangesOverlap(seg.jStart, seg.jEnd, hl.start, hl.end)) {
        out += '<mark class="grammar-hl">' + rubyHtml + "</mark>";
      } else {
        out += rubyHtml;
      }
    });
    return out;
  }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickN(arr, n) {
    return shuffleArray(arr).slice(0, Math.min(n, arr.length));
  }

  function flattenExamples(entry) {
    var all = [];
    entry.usages.forEach(function (u) { u.examples.forEach(function (ex) { all.push(ex); }); });
    return all;
  }

  function patternLabel(entry) {
    return entry.pattern.replace(/^[~～]/, "").split(/[／\/]/)[0].trim();
  }

  // Mirrors buildRuby, but instead of wrapping the grammar-point span in
  // <mark>, it omits that span entirely and drops in a text input — used
  // to build fill-in-the-blank questions from a real example sentence
  // without a second, separately-maintained way of locating that span.
  function buildRubyBlank(japanese, furigana, hl, blankMarkupHtml) {
    if (!hl) return buildRuby(japanese, furigana, null);
    if (!furigana) {
      return escapeHtml(japanese.slice(0, hl.start)) + blankMarkupHtml + escapeHtml(japanese.slice(hl.end));
    }
    var segments = computeAlignment(japanese, furigana);
    if (!segments) return buildRuby(japanese, furigana, null);
    var out = "";
    var blankInserted = false;
    segments.forEach(function (seg) {
      if (!rangesOverlap(seg.jStart, seg.jEnd, hl.start, hl.end)) {
        var jText = japanese.slice(seg.jStart, seg.jEnd);
        if (seg.isKanji) {
          var reading = furigana.slice(seg.fStart, seg.fEnd);
          out += "<ruby>" + escapeHtml(jText) + "<rt>" + escapeHtml(reading) + "</rt></ruby>";
        } else {
          out += escapeHtml(jText);
        }
        return;
      }
      if (seg.isKanji) {
        // Kanji runs are short; a partial overlap is rare and not worth
        // splitting a ruby annotation over, so the whole run is blanked.
        if (!blankInserted) { out += blankMarkupHtml; blankInserted = true; }
        return;
      }
      var s = Math.max(seg.jStart, hl.start), e = Math.min(seg.jEnd, hl.end);
      var text = japanese.slice(seg.jStart, seg.jEnd);
      var before = text.slice(0, s - seg.jStart);
      var after = text.slice(e - seg.jStart);
      out += escapeHtml(before);
      if (!blankInserted) { out += blankMarkupHtml; blankInserted = true; }
      out += escapeHtml(after);
    });
    return out;
  }

  function worksheetBlankPlaceholderHtml() {
    return '<span class="worksheet-blank-placeholder">＿＿＿＿</span>';
  }

  // Distractor patterns for the multiple-choice options: entries already
  // marked `related` make the best distractors (genuinely similar
  // patterns, so the question actually tests discrimination) — topped up
  // with random same-level entries when there aren't enough related ones.
  function pickDistractorEntries(entry, count) {
    var candidates = [];
    var seen = {};
    seen[entry.id] = true;
    if (entry.related) {
      entry.related.forEach(function (id) {
        var t = findEntryById(id);
        if (t && !isReferenceArticle(t) && !seen[t.id]) { candidates.push(t); seen[t.id] = true; }
      });
    }
    if (candidates.length < count) {
      var pool = shuffleArray(entriesForLevel(entry.level));
      for (var i = 0; i < pool.length && candidates.length < count; i++) {
        if (!seen[pool[i].id]) { candidates.push(pool[i]); seen[pool[i].id] = true; }
      }
    }
    return candidates.slice(0, count);
  }

  // Each question pairs a blanked example sentence with multiple-choice
  // options for which pattern fills the blank — merges what used to be
  // two separate exercises (a typed fill-in-the-blank, and a separate
  // pattern-recognition multiple choice) into one.
  // The main highlighting system deliberately marks only the invariant
  // core of a pattern (させ, not させました) — right for drawing attention
  // to "here's the grammar point" inline, but for a fill-in-the-blank
  // question it means the blank is missing whatever tense/politeness
  // ending the example actually uses, so every answer ends up looking
  // like the same bare stem regardless of which example got picked. This
  // extends the blank through ONE immediately-following conjugation
  // ending when present, so the blank (and the correct answer option)
  // reflects the whole conjugated word — させました, させた, させます —
  // not just its invariant core. Bounded to a single extension rather
  // than looped, so a blank like させて (causative + te-form) correctly
  // stops there instead of swallowing an unrelated following verb like
  // させてあげた's あげた.
  var TRAILING_CONJUGATION_ENDINGS = [
    "ませんでした", "ましょうか", "なかった", "ましょう", "ければ",
    "ません", "ました", "なくて", "ないで", "かった", "れば", "たら",
    "ない", "ます", "よう", "た", "て", "で", "ろ", "ば"
  ].sort(function (a, b) { return b.length - a.length; });

  function extendBlankForConjugation(japanese, hl) {
    if (!hl) return hl;
    var rest = japanese.slice(hl.end);
    for (var i = 0; i < TRAILING_CONJUGATION_ENDINGS.length; i++) {
      var ending = TRAILING_CONJUGATION_ENDINGS[i];
      if (rest.indexOf(ending) === 0) {
        return { start: hl.start, end: hl.end + ending.length };
      }
    }
    return hl;
  }

  // The text that was actually removed from an example — usually a
  // specific conjugated form (させました, させない, ...), not just the
  // pattern's bare dictionary-form label. Falls back to the label only in
  // the rare case no highlight range was found for this example.
  function literalBlankedText(entryForFallback, ex, hl) {
    if (hl) return ex.japanese.slice(hl.start, hl.end);
    return patternLabel(entryForFallback);
  }

  // Pulls a real conjugated snippet from one of a distractor entry's own
  // examples (rather than its bare label), so multiple-choice options are
  // all the same kind of thing — real inflected text a learner would
  // actually see — and naturally vary in form question to question along
  // with whichever example got picked. Tries a few of the distractor's
  // own examples in case one happens to collide with text already used
  // elsewhere in this question; returns null if every example (and even
  // the bare label fallback) collides, so the caller can skip this
  // distractor entirely rather than show a duplicate option.
  function pickDistractorText(distractorEntry, usedTexts) {
    var examples = shuffleArray(flattenExamples(distractorEntry));
    for (var i = 0; i < examples.length; i++) {
      var dHl = extendBlankForConjugation(examples[i].japanese, getExampleHighlightRange(examples[i], distractorEntry.pattern));
      var text = literalBlankedText(distractorEntry, examples[i], dHl);
      if (usedTexts.indexOf(text) === -1) return text;
    }
    var fallback = patternLabel(distractorEntry);
    return usedTexts.indexOf(fallback) === -1 ? fallback : null;
  }

  function buildFillBlankQuestions(entry, examples) {
    return examples.map(function (ex) {
      var hl = extendBlankForConjugation(ex.japanese, getExampleHighlightRange(ex, entry.pattern));
      var correctText = literalBlankedText(entry, ex, hl);
      var usedTexts = [correctText];
      var optionObjs = [{ text: correctText, correct: true }];
      // Pull extra candidates beyond the 3 needed, so a distractor whose
      // text fully collides with what's already used can just be skipped
      // rather than leaving the question short an option.
      var candidates = pickDistractorEntries(entry, 8);
      for (var i = 0; i < candidates.length && optionObjs.length < 4; i++) {
        var text = pickDistractorText(candidates[i], usedTexts);
        if (text === null) continue;
        usedTexts.push(text);
        optionObjs.push({ text: text, correct: false });
      }
      return { ex: ex, hl: hl, options: shuffleArray(optionObjs) };
    });
  }

  // Shared by exampleHtml (highlighting) and the worksheet generator
  // (blanking) — both need to know exactly which span of `japanese`
  // corresponds to the grammar point, and must never compute it two
  // different ways.
  function getExampleHighlightRange(ex, pattern) {
    if (ex.hl) {
      var idx = ex.japanese.indexOf(ex.hl);
      return idx === -1 ? null : { start: idx, end: idx + ex.hl.length };
    }
    return findHighlightRange(ex.japanese, ex.furigana, pattern);
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- The grammar course ----------
  // The course (grammar-course/) teaches every point in library order, a few
  // at a time within each level. The grouping lives here so the library can
  // link each entry to its lesson.
  var COURSE_LESSON_SIZE = 5;
  var courseLessonsCache = null;

  /** The course's lessons: [{number, level, entries}], N5 first. */
  function courseLessons() {
    if (courseLessonsCache) return courseLessonsCache;
    var out = [];
    LEVELS.forEach(function (level) {
      var entries = entriesForLevel(level.id);
      for (var i = 0; i < entries.length; i += COURSE_LESSON_SIZE) {
        out.push({ number: out.length + 1, level: level.id, entries: entries.slice(i, i + COURSE_LESSON_SIZE) });
      }
    });
    courseLessonsCache = out;
    return out;
  }

  /** The course lesson that teaches grammar point [id], or null. */
  function courseLessonOf(id) {
    var lessons = courseLessons();
    for (var i = 0; i < lessons.length; i++) {
      for (var j = 0; j < lessons[i].entries.length; j++) if (lessons[i].entries[j].id === id) return lessons[i];
    }
    return null;
  }

  window.GrammarCore = {
    withRandom: withRandom,
    courseLessons: courseLessons,
    courseLessonOf: courseLessonOf,
    LEVELS: LEVELS,
    LEVEL_DATA: LEVEL_DATA,
    REFERENCE_ARTICLES_DATA: REFERENCE_ARTICLES_DATA,
    findReferenceArticleById: findReferenceArticleById,
    isReferenceArticle: isReferenceArticle,
    allEntries: allEntries,
    entriesForLevel: entriesForLevel,
    findEntryById: findEntryById,
    VOICING_MAP: VOICING_MAP,
    withVoicedVariant: withVoicedVariant,
    ICHIDAN_PRECEDING: ICHIDAN_PRECEDING,
    GODAN_ENDINGS: GODAN_ENDINGS,
    AROW_TO_IROW: AROW_TO_IROW,
    IDIOMATIC_NAI_POLITE: IDIOMATIC_NAI_POLITE,
    withPoliteVariant: withPoliteVariant,
    withMasuVariant: withMasuVariant,
    withCopulaVariant: withCopulaVariant,
    withCasualContraction: withCasualContraction,
    withMiscVariant: withMiscVariant,
    withSharedSubstring: withSharedSubstring,
    withNiKuVariant: withNiKuVariant,
    withAdjectiveVariant: withAdjectiveVariant,
    withConjugationStems: withConjugationStems,
    splitOnPlaceholders: splitOnPlaceholders,
    extractFragments: extractFragments,
    findHighlightRange: findHighlightRange,
    rangesOverlap: rangesOverlap,
    HIRAGANA_ONLY_RE: HIRAGANA_ONLY_RE,
    computeAlignment: computeAlignment,
    buildAlignmentSegments: buildAlignmentSegments,
    mapFuriRangeToJapanese: mapFuriRangeToJapanese,
    highlightSlice: highlightSlice,
    buildRuby: buildRuby,
    shuffleArray: shuffleArray,
    pickN: pickN,
    flattenExamples: flattenExamples,
    patternLabel: patternLabel,
    buildRubyBlank: buildRubyBlank,
    worksheetBlankPlaceholderHtml: worksheetBlankPlaceholderHtml,
    pickDistractorEntries: pickDistractorEntries,
    TRAILING_CONJUGATION_ENDINGS: TRAILING_CONJUGATION_ENDINGS,
    extendBlankForConjugation: extendBlankForConjugation,
    literalBlankedText: literalBlankedText,
    pickDistractorText: pickDistractorText,
    buildFillBlankQuestions: buildFillBlankQuestions,
    getExampleHighlightRange: getExampleHighlightRange,
    escapeHtml: escapeHtml,
  };
})();
