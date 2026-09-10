(function () {
  "use strict";

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

  var STORAGE_SAVED = "grammarNotebook.saved";
  var STORAGE_THEME = "grammarNotebook.theme";

  var state = {
    activeTab: "N5",
    query: "",
    saved: loadSaved()
  };

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_SAVED);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function persistSaved() {
    try {
      localStorage.setItem(STORAGE_SAVED, JSON.stringify(state.saved));
    } catch (e) { /* storage unavailable, ignore */ }
  }

  function isSaved(id) {
    return state.saved.indexOf(id) !== -1;
  }

  function toggleSaved(id) {
    var idx = state.saved.indexOf(id);
    if (idx === -1) state.saved.push(id);
    else state.saved.splice(idx, 1);
    persistSaved();
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
    return null;
  }

  // ---------- Heuristic categorization ----------
  // grammar-data.js carries no explicit "theme" field, so section headers
  // are inferred from the pattern/title/short text. This is an approximation,
  // not hand-curated data.
  var PARTICLE_SET = ["は", "が", "を", "に", "で", "と", "も", "の", "か", "や", "へ", "ね", "よ", "こそ", "さえ", "しか", "だけ", "くらい", "ぐらい", "まで", "から", "ばかり", "など", "って"];

  function categorize(entry) {
    var raw = entry.pattern.replace(/[~～]/g, "").trim();
    var first = raw.split(/[／\/]/)[0].trim();
    var t = (entry.title + " " + entry.short).toLowerCase();

    if (PARTICLE_SET.indexOf(first) !== -1) return "Particles";
    if (/adjective/.test(t)) return "Adjectives";
    if (/(potential|passive|causative|volitional|imperative|command|honorific|humble)/.test(t)) return "Verb Forms";
    if (/(hearsay|rumor|conjecture|seems|looks like|appears|typical)/.test(t)) return "Conjecture & Hearsay";
    if (/(permission|prohibition|obligation|must|have to|request)/.test(t)) return "Requests, Permission & Obligation";
    if (/(reason|because|cause|thanks to|due to|blame)/.test(t)) return "Reason & Cause";
    if (/(compare|comparison|than\b)/.test(t)) return "Comparison";
    if (/(unless|conditional|even if|even though|despite|although|concession)/.test(t)) return "Conditionals & Concession";
    if (/(formal|literary|written)/.test(t)) return "Formal & Literary";
    if (/(want|desire|intend|plan)/.test(t)) return "Desire & Intention";
    if (/(exist|there is|there are)/.test(t)) return "Existence & Possession";
    return "Grammar Points";
  }

  var CATEGORY_ORDER = [
    "Particles", "Verb Forms", "Adjectives", "Existence & Possession",
    "Desire & Intention", "Conditionals & Concession", "Reason & Cause",
    "Comparison", "Requests, Permission & Obligation", "Conjecture & Hearsay",
    "Formal & Literary", "Grammar Points"
  ];

  function groupByCategory(entries) {
    var groups = [];
    var index = {};
    entries.forEach(function (entry) {
      var cat = categorize(entry);
      if (!(cat in index)) {
        index[cat] = { category: cat, items: [] };
        groups.push(index[cat]);
      }
      index[cat].items.push(entry);
    });
    groups.sort(function (a, b) {
      var ai = CATEGORY_ORDER.indexOf(a.category);
      var bi = CATEGORY_ORDER.indexOf(b.category);
      if (ai === -1) ai = CATEGORY_ORDER.length;
      if (bi === -1) bi = CATEGORY_ORDER.length;
      return ai - bi;
    });
    return groups;
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

  function buildAlignmentSegments(japanese, furigana) {
    var literalParts = japanese.split(KANJI_RUN_RE);
    var kanjiRuns = japanese.match(KANJI_RUN_RE) || [];
    var jPos = 0, fPos = 0;
    var segments = [];
    for (var i = 0; i < literalParts.length; i++) {
      var lit = literalParts[i];
      if (lit) {
        var idx = furigana.indexOf(lit, fPos);
        if (idx === -1) return null;
        segments.push({ jStart: jPos, jEnd: jPos + lit.length, fStart: idx, fEnd: idx + lit.length, isKanji: false });
        fPos = idx + lit.length;
        jPos += lit.length;
      }
      if (i < kanjiRuns.length) {
        var run = kanjiRuns[i];
        var nextLit = literalParts[i + 1];
        var end;
        if (nextLit) {
          end = furigana.indexOf(nextLit, fPos + 1);
          if (end === -1) return null;
        } else {
          end = furigana.length;
        }
        if (end === fPos) return null;
        segments.push({ jStart: jPos, jEnd: jPos + run.length, fStart: fPos, fEnd: end, isKanji: true });
        jPos += run.length;
        fPos = end;
      }
    }
    return segments;
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
  var KANJI_RUN_RE = /[\u4e00-\u9faf\u30050-9\uFF10-\uFF19]+/g;

  function buildRuby(japanese, furigana, hl) {
    if (!furigana) return highlightSlice(japanese, 0, japanese.length, hl);
    var literalParts = japanese.split(KANJI_RUN_RE);
    var kanjiRuns = japanese.match(KANJI_RUN_RE) || [];
    var ptr = 0;
    var jPos = 0;
    var out = "";
    for (var i = 0; i < literalParts.length; i++) {
      var lit = literalParts[i];
      if (lit) {
        var idx = furigana.indexOf(lit, ptr);
        if (idx === -1) return highlightSlice(japanese, 0, japanese.length, hl);
        ptr = idx + lit.length;
        out += highlightSlice(lit, jPos, jPos + lit.length, hl);
        jPos += lit.length;
      }
      if (i < kanjiRuns.length) {
        var run = kanjiRuns[i];
        var nextLit = literalParts[i + 1];
        var end;
        if (nextLit) {
          end = furigana.indexOf(nextLit, ptr + 1);
          if (end === -1) return highlightSlice(japanese, 0, japanese.length, hl);
        } else {
          end = furigana.length;
        }
        if (end === ptr) return highlightSlice(japanese, 0, japanese.length, hl);
        var reading = furigana.slice(ptr, end);
        var rubyHtml = "<ruby>" + escapeHtml(run) + "<rt>" + escapeHtml(reading) + "</rt></ruby>";
        var runStart = jPos, runEnd = jPos + run.length;
        if (hl && rangesOverlap(runStart, runEnd, hl.start, hl.end)) {
          out += '<mark class="grammar-hl">' + rubyHtml + "</mark>";
        } else {
          out += rubyHtml;
        }
        jPos += run.length;
        ptr = end;
      }
    }
    return out;
  }

  function matchesQuery(entry, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var haystack = [entry.title, entry.short, entry.pattern, entry.explanation, entry.notes || ""].join(" ").toLowerCase();
    if (haystack.indexOf(q) !== -1) return true;
    for (var i = 0; i < entry.usages.length; i++) {
      var u = entry.usages[i];
      if (u.title.toLowerCase().indexOf(q) !== -1) return true;
      for (var j = 0; j < u.examples.length; j++) {
        var ex = u.examples[j];
        var text = (ex.japanese + " " + ex.furigana + " " + ex.english).toLowerCase();
        if (text.indexOf(q) !== -1) return true;
      }
    }
    return false;
  }

  // ---------- Rendering ----------

  var $tabBar = document.getElementById("tabBar");
  var $main = document.getElementById("mainContent");
  var $search = document.getElementById("searchInput");
  var $searchWrap = document.getElementById("searchWrap");

  function renderTabs() {
    var html = "";
    LEVELS.forEach(function (lvl) {
      html += tabButtonHtml(lvl.id, lvl.label, "var(--lvl-" + lvl.id.toLowerCase() + ")");
    });
    html += tabButtonHtml("saved", "Saved · " + state.saved.length, "var(--accent)", true);
    $tabBar.innerHTML = html;

    Array.prototype.forEach.call($tabBar.querySelectorAll(".tab-btn"), function (btn) {
      btn.addEventListener("click", function () {
        state.activeTab = btn.getAttribute("data-tab");
        state.query = "";
        $search.value = "";
        renderTabs();
        renderMain();
      });
    });
  }

  function tabButtonHtml(id, label, color, star) {
    var active = state.activeTab === id ? " active" : "";
    return (
      '<button class="tab-btn' + active + '" data-tab="' + id + '" style="--tab-color:' + color + '">' +
      (star ? '<span class="star-icon">' + starSvg(true) + "</span>" : '<span class="dot" style="--tab-color:' + color + '"></span>') +
      "<span>" + label + "</span>" +
      "</button>"
    );
  }

  function starSvg(filled) {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (filled ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.63 22 9.24 16.5 14.14 18.18 21 12 17.27 5.82 21 7.5 14.14 2 9.24 8.91 8.63 12 2"/></svg>';
  }

  function chevronSvg() {
    return '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
  }

  function searchSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  }

  var $pageHeading = document.getElementById("pageHeading");

  function renderMain() {
    var isSavedTab = state.activeTab === "saved";
    var isSearching = state.query.trim().length > 0 && !isSavedTab;
    $search.placeholder = isSavedTab ? "Search your saved points…" : "Search all grammar points…";

    var entries = isSavedTab
      ? allEntries().filter(function (e) { return isSaved(e.id); })
      : (isSearching ? allEntries() : entriesForLevel(state.activeTab));

    var filtered = entries.filter(function (e) { return matchesQuery(e, state.query); });

    $pageHeading.innerHTML = pageHeadingHtml(isSavedTab, isSearching, isSearching ? filtered.length : entries.length);

    if (filtered.length === 0) {
      $main.innerHTML = emptyStateHtml(isSavedTab, entries.length === 0);
      return;
    }

    var html;
    if (isSavedTab || isSearching) {
      html = '<div class="entry-list">' + filtered.map(function (e) { return entryHtml(e, true); }).join("") + "</div>";
    } else {
      html = groupByCategory(filtered).map(function (g) {
        return '<div class="theme-heading">' + escapeHtml(g.category) + "</div>" +
          '<div class="entry-list">' + g.items.map(function (e) { return entryHtml(e, false); }).join("") + "</div>";
      }).join("");
    }
    $main.innerHTML = html;
    attachOpenHandlers();
    attachSaveHandlers();
  }

  function pageHeadingHtml(isSavedTab, isSearching, count) {
    var title, subtitle;
    if (isSearching) {
      title = "Search Results";
      subtitle = "Matches across all JLPT levels.";
    } else if (isSavedTab) {
      title = "Saved";
      subtitle = "Your saved grammar points for review.";
    } else {
      title = state.activeTab + " Grammar";
      subtitle = state.activeTab + " Japanese grammar patterns and usages.";
    }
    return (
      '<div class="page-heading">' +
        "<div>" +
          '<h2 class="page-heading-title">' + escapeHtml(title) + "</h2>" +
          '<p class="page-heading-subtitle">' + escapeHtml(subtitle) + "</p>" +
        "</div>" +
        '<div class="page-heading-count">' + count + "</div>" +
      "</div>"
    );
  }

  function emptyStateHtml(isSavedTab, noneAtAll) {
    if (isSavedTab && noneAtAll) {
      return '<div class="empty-state">No saved grammar points yet.<br>Tap the star on any entry to add it here for quick review.</div>';
    }
    return '<div class="empty-state">No grammar points match your search.</div>';
  }

  function entryHtml(entry, showBadge) {
    var saved = isSaved(entry.id);
    var color = "var(--lvl-" + entry.level.toLowerCase() + ")";
    var badge = showBadge
      ? '<span class="level-badge" style="--entry-color:' + color + '">' + entry.level + "</span>"
      : "";
    var usagesHtml = entry.usages.map(function (u) { return usageHtml(u, entry.pattern); }).join("");
    var conjugationsHtml = conjugationTableHtml(entry.conjugations, entry.pattern);
    var relatedHtml = relatedGrammarHtml(entry.related);
    var notesHtml = entry.notes
      ? '<div class="entry-note"><span class="entry-note-label">Note</span>' + escapeHtml(entry.notes) + "</div>"
      : "";
    var iconText = entry.pattern.replace(/^[~～]/, "").split(/[／\/]/)[0].trim();
    var iconClass = iconText.length > 3 ? " entry-icon--long" : "";
    return (
      '<div class="entry" data-id="' + entry.id + '" style="--entry-color:' + color + '">' +
        '<div class="entry-head" data-toggle="' + entry.id + '" role="button" tabindex="0" aria-expanded="false">' +
          '<div class="entry-icon' + iconClass + ' jp">' + escapeHtml(iconText) + "</div>" +
          '<div class="entry-head-text">' +
            '<div class="entry-pattern">' + badge + escapeHtml(entry.title) + "</div>" +
            '<div class="entry-meaning">' + escapeHtml(entry.short) + "</div>" +
          "</div>" +
          '<div class="entry-actions">' +
            '<button class="save-btn' + (saved ? " saved" : "") + '" data-save="' + entry.id + '" aria-label="Save grammar point" title="Save for review">' + starSvg(saved) + "</button>" +
            chevronSvg() +
          "</div>" +
        "</div>" +
        '<div class="entry-body">' +
          '<div class="entry-body-inner">' +
            explanationHtml(entry.explanation) +
            usagesHtml +
            conjugationsHtml +
            relatedHtml +
            notesHtml +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function relatedGrammarHtml(relatedIds) {
    if (!relatedIds || !relatedIds.length) return "";
    var chips = relatedIds.map(function (id) {
      var target = findEntryById(id);
      if (!target) return "";
      var iconText = target.pattern.replace(/^[~～]/, "").split(/[／\/]/)[0].trim();
      var chipColor = "var(--lvl-" + target.level.toLowerCase() + ")";
      return (
        '<button class="related-chip" data-navigate="' + target.id + '" style="--chip-color:' + chipColor + '">' +
          '<span class="related-chip-level">' + target.level + "</span>" +
          '<span class="related-chip-pattern jp">' + escapeHtml(iconText) + "</span>" +
        "</button>"
      );
    }).join("");
    if (!chips) return "";
    return (
      '<div class="related-wrap">' +
        '<div class="related-title">Related grammar</div>' +
        '<div class="related-chips">' + chips + "</div>" +
      "</div>"
    );
  }

  function conjugationTableHtml(conjugations, pattern) {
    if (!conjugations || !conjugations.length) return "";
    var rows = conjugations.map(function (row) {
      var hl = findHighlightRange(row.example, null, pattern);
      var exampleHtml = highlightSlice(row.example, 0, row.example.length, hl);
      return (
        "<tr>" +
          "<td>" + escapeHtml(row.pos) + "</td>" +
          "<td>" + escapeHtml(row.form) + "</td>" +
          '<td class="jp-body">' + exampleHtml + "</td>" +
        "</tr>"
      );
    }).join("");
    return (
      '<div class="conjugation-wrap">' +
        '<div class="conjugation-title">Conjugation</div>' +
        '<div class="conjugation-table-inner">' +
          '<table class="conjugation-table">' +
            "<thead><tr><th>Word Type</th><th>Form</th><th>Example</th></tr></thead>" +
            "<tbody>" + rows + "</tbody>" +
          "</table>" +
        "</div>" +
      "</div>"
    );
  }

  function explanationHtml(text) {
    var paragraphs = String(text || "").split(/\n\n+/);
    return paragraphs.map(function (p) {
      return '<p class="entry-explanation">' + escapeHtml(p) + "</p>";
    }).join("");
  }

  function usageHtml(usage, pattern) {
    var showTitle = usage.title && usage.title.length > 0;
    return (
      '<div class="usage-group">' +
        (showTitle ? '<div class="usage-title">' + escapeHtml(usage.title) + "</div>" : "") +
        usage.examples.map(function (ex) { return exampleHtml(ex, pattern); }).join("") +
      "</div>"
    );
  }

  function exampleHtml(ex, pattern) {
    // A few entries (い-adjectives, な-adjectives, 普通形) describe a whole
    // word class rather than a fixed piece of text, so there's no pattern
    // string to match against. For those, the example itself names the
    // exact substring to highlight instead.
    var hl = ex.hl
      ? (function () { var idx = ex.japanese.indexOf(ex.hl); return idx === -1 ? null : { start: idx, end: idx + ex.hl.length }; })()
      : findHighlightRange(ex.japanese, ex.furigana, pattern);
    return (
      '<div class="example">' +
        '<div class="example-jp jp-body">' + buildRuby(ex.japanese, ex.furigana, hl) + "</div>" +
        '<div class="example-en">' + escapeHtml(ex.english) + "</div>" +
      "</div>"
    );
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function attachOpenHandlers() {
    Array.prototype.forEach.call($main.querySelectorAll("[data-toggle]"), function (btn) {
      btn.addEventListener("click", function (evt) {
        if (evt.target.closest("[data-save]")) return; // star click shouldn't toggle open
        toggleEntry(btn);
      });
      btn.addEventListener("keydown", function (evt) {
        if (evt.key === "Enter" || evt.key === " " || evt.key === "Spacebar") {
          evt.preventDefault();
          toggleEntry(btn);
        }
      });
    });
    Array.prototype.forEach.call($main.querySelectorAll("[data-navigate]"), function (btn) {
      btn.addEventListener("click", function (evt) {
        evt.stopPropagation();
        navigateToEntry(btn.getAttribute("data-navigate"));
      });
    });
  }

  function navigateToEntry(id) {
    var target = findEntryById(id);
    if (!target) return;
    state.query = "";
    $search.value = "";
    if (state.activeTab !== target.level) {
      state.activeTab = target.level;
      renderTabs();
    }
    renderMain();
    var card = $main.querySelector('.entry[data-id="' + id + '"]');
    if (!card) return;
    var head = card.querySelector("[data-toggle]");
    if (head && !card.classList.contains("open")) toggleEntry(head);
    if (typeof card.scrollIntoView === "function") {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function toggleEntry(headEl) {
    var card = headEl.closest(".entry");
    var open = card.classList.toggle("open");
    headEl.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function attachSaveHandlers() {
    Array.prototype.forEach.call($main.querySelectorAll("[data-save]"), function (btn) {
      btn.addEventListener("click", function (evt) {
        evt.stopPropagation();
        var id = btn.getAttribute("data-save");
        toggleSaved(id);
        renderTabs();
        if (state.activeTab === "saved") {
          renderMain();
        } else {
          btn.classList.toggle("saved");
          btn.innerHTML = starSvg(isSaved(id));
        }
      });
    });
  }

  // ---------- Search ----------

  $search.addEventListener("input", function () {
    state.query = $search.value.trim();
    renderMain();
  });

  // ---------- Theme ----------

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementById("themeToggle").innerHTML = theme === "dark" ? sunSvg() : moonSvg();
  }

  function moonSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  function sunSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_THEME); } catch (e) {}
    var theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(theme);
  }

  document.getElementById("themeToggle").addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_THEME, next); } catch (e) {}
  });

  // ---------- Furigana toggle ----------

  var STORAGE_FURIGANA = "grammarNotebook.furigana";
  var $furiganaToggle = document.getElementById("furiganaToggle");

  function applyFurigana(show) {
    document.documentElement.classList.toggle("furigana-off", !show);
    $furiganaToggle.checked = show;
  }

  function initFurigana() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_FURIGANA); } catch (e) {}
    applyFurigana(saved !== "off");
  }

  $furiganaToggle.addEventListener("change", function () {
    var show = $furiganaToggle.checked;
    applyFurigana(show);
    try { localStorage.setItem(STORAGE_FURIGANA, show ? "on" : "off"); } catch (e) {}
  });

  // ---------- Init ----------

  $searchWrap.insertAdjacentHTML("afterbegin", searchSvg());

  initTheme();
  initFurigana();
  renderTabs();
  renderMain();
})();
