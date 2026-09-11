// ---------- Furigana/kanji alignment ----------
// Shared between app.js (rendering) and validate.js (data validation) so
// there is exactly one implementation of this algorithm — the validator
// must check the same logic the app actually runs, not a hand-copied
// approximation of it that can silently drift out of sync.
//
// Works as a plain <script> in the browser (attaches GrammarAlignment to
// window) and as a Node module (module.exports) with no other change.
(function (root, factory) {
  var exported = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  } else {
    root.GrammarAlignment = exported;
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var KANJI_RUN_RE = /[\u4e00-\u9faf\u30050-9\uFF10-\uFF19]+/g;

  // Divides `furigana` into segments aligned against `japanese`'s literal
  // (hiragana/katakana/punctuation) and kanji-run pieces. A literal piece's
  // own text is unambiguous, but a kanji run's reading boundary is not:
  // the short/common particle that follows a kanji run (に, の, で, ...)
  // can also occur as a mora *inside* that run's own correct reading
  // (本人 -> ほんにん contains に as its 3rd mora; 機能性 -> きのうせい
  // contains の as its 2nd). A single left-to-right scan can settle on a
  // boundary that still lets the rest of the string align successfully to
  // the end — appearing "valid" — while attributing the wrong reading to
  // each side of that boundary. So instead we enumerate every boundary
  // choice that produces a fully valid alignment, then pick among them by
  // preferring the one where reading-length-per-kanji-character-length
  // stays most consistent across segments, since real compound readings
  // spread mora roughly evenly rather than starving one kanji run to feed
  // extra characters to its neighbor.
  function computeAlignment(japanese, furigana) {
    var literalParts = japanese.split(KANJI_RUN_RE);
    var kanjiRuns = japanese.match(KANJI_RUN_RE) || [];
    var solutions = [];
    var CANDIDATE_CAP = 5;

    function tryFrom(partIndex, jPos, fPos, segments) {
      if (solutions.length >= 8) return; // enough candidates to score from
      if (partIndex >= literalParts.length) {
        if (fPos === furigana.length) solutions.push(segments.slice());
        return;
      }
      var lit = literalParts[partIndex];
      var hasKanjiRun = partIndex < kanjiRuns.length;
      var run = hasKanjiRun ? kanjiRuns[partIndex] : null;
      if (lit) {
        var idx = furigana.indexOf(lit, fPos);
        if (idx === -1) return;
        var litSeg = { jStart: jPos, jEnd: jPos + lit.length, fStart: idx, fEnd: idx + lit.length, isKanji: false };
        continueFromKanji(partIndex, jPos + lit.length, idx + lit.length, segments.concat([litSeg]), hasKanjiRun, run);
      } else {
        continueFromKanji(partIndex, jPos, fPos, segments, hasKanjiRun, run);
      }
    }

    function continueFromKanji(partIndex, jPos, fPos, segments, hasKanjiRun, run) {
      if (!hasKanjiRun) {
        tryFrom(partIndex + 1, jPos, fPos, segments);
        return;
      }
      var nextLit = literalParts[partIndex + 1];
      if (!nextLit) {
        if (furigana.length <= fPos) return;
        var lastSeg = { jStart: jPos, jEnd: jPos + run.length, fStart: fPos, fEnd: furigana.length, isKanji: true };
        tryFrom(partIndex + 1, jPos + run.length, furigana.length, segments.concat([lastSeg]));
        return;
      }
      var searchFrom = fPos + 1;
      for (var tried = 0; tried < CANDIDATE_CAP; tried++) {
        var end = furigana.indexOf(nextLit, searchFrom);
        if (end === -1) break;
        var kanjiSeg = { jStart: jPos, jEnd: jPos + run.length, fStart: fPos, fEnd: end, isKanji: true };
        tryFrom(partIndex + 1, jPos + run.length, end, segments.concat([kanjiSeg]));
        searchFrom = end + 1;
      }
    }

    tryFrom(0, 0, 0, []);
    if (solutions.length === 0) return null;
    if (solutions.length === 1) return solutions[0];

    function evennessScore(segments) {
      var ratios = [];
      segments.forEach(function (seg) {
        if (seg.isKanji) ratios.push((seg.fEnd - seg.fStart) / (seg.jEnd - seg.jStart));
      });
      if (ratios.length < 2) return 0;
      var mean = ratios.reduce(function (a, b) { return a + b; }, 0) / ratios.length;
      return ratios.reduce(function (a, r) { return a + (r - mean) * (r - mean); }, 0);
    }

    var best = solutions[0];
    var bestScore = evennessScore(best);
    for (var i = 1; i < solutions.length; i++) {
      var score = evennessScore(solutions[i]);
      if (score < bestScore) { best = solutions[i]; bestScore = score; }
    }
    return best;
  }

  return {
    KANJI_RUN_RE: KANJI_RUN_RE,
    computeAlignment: computeAlignment
  };
});
