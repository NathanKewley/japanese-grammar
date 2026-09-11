#!/usr/bin/env node
// ---------------------------------------------------------------------
// validate.js — standing validation tool for grammar-data.js
//
// Run from this directory with:  node validate.js
//
// Consolidates every check that was previously re-derived from scratch
// in a throwaway script each time an edit was made:
//   1. Schema        — every entry/usage/example has its required fields
//   2. Alignment      — every (japanese, furigana) pair aligns cleanly,
//                        using the *actual* algorithm from alignment.js
//                        (shared with app.js — never a hand-copied
//                        approximation that can drift out of sync)
//   3. Duplicate IDs  — no entry id appears twice across the dataset
//   4. Duplicate examples — no example is repeated within one entry
//   5. Related links  — every id in an entry's `related` array resolves
//                        to a real entry somewhere in the dataset
//   6. Reading consistency — cross-references every kanji run's reading
//        across the whole dataset and flags cases where a rare reading
//        sits alongside a much more common one for the same kanji run.
//        This is a REVIEW list, not a hard failure: many flagged pairs
//        turn out to be legitimate alternate readings (好き vs 好む).
//        But this is exactly the check that isn't obvious to think to
//        run, and it's the one that caught a real rendering bug in the
//        core alignment algorithm (a boundary miscalculation that the
//        alignment check alone couldn't see, since it only verifies a
//        split reaches the right total length, not that each piece is
//        correct) plus four genuine furigana typos, none of which
//        checks 1-5 had any way of catching.
//
// Checks 1-5 are hard failures: the script exits non-zero if any fire.
// Check 6 always prints its findings but never affects the exit code —
// it needs a human to tell real errors apart from legitimate variance.
// ---------------------------------------------------------------------

var fs = require("fs");
var path = require("path");

var DATA_PATH = path.join(__dirname, "grammar-data.js");
var GrammarAlignment = require(path.join(__dirname, "alignment.js"));

function loadLevels() {
  var code = fs.readFileSync(DATA_PATH, "utf8");
  var fn = new Function(code + "; return {N5_GRAMMAR, N4_GRAMMAR, N3_GRAMMAR, N2_GRAMMAR, N1_GRAMMAR};");
  return fn();
}

function flattenEntries(levels) {
  var all = [];
  Object.entries(levels).forEach(function (pair) {
    var levelName = pair[0], arr = pair[1];
    arr.forEach(function (e) { all.push({ levelName: levelName, entry: e }); });
  });
  return all;
}

// ---------- 1. Schema ----------
function checkSchema(all) {
  var issues = [];
  var REQUIRED_ENTRY_FIELDS = ["id", "level", "pattern", "title", "short", "explanation", "usages"];
  all.forEach(function (item) {
    var e = item.entry, lvl = item.levelName;
    REQUIRED_ENTRY_FIELDS.forEach(function (f) {
      if (!(f in e)) issues.push(lvl + " " + (e.id || "(no id)") + ": missing field '" + f + "'");
    });
    if (!Array.isArray(e.usages) || e.usages.length === 0) {
      issues.push(lvl + " " + e.id + ": usages must be a non-empty array");
      return;
    }
    e.usages.forEach(function (u, ui) {
      if (typeof u.title !== "string" || !u.title) {
        issues.push(lvl + " " + e.id + ": usages[" + ui + "] missing title");
      }
      if (!Array.isArray(u.examples) || u.examples.length === 0) {
        issues.push(lvl + " " + e.id + ": usages[" + ui + "] must have a non-empty examples array");
        return;
      }
      u.examples.forEach(function (ex, xi) {
        ["japanese", "furigana", "english"].forEach(function (f) {
          if (typeof ex[f] !== "string" || !ex[f]) {
            issues.push(lvl + " " + e.id + ": usages[" + ui + "].examples[" + xi + "] missing/empty '" + f + "'");
          }
        });
      });
    });
    if (e.conjugations) {
      if (!Array.isArray(e.conjugations) || e.conjugations.length === 0) {
        issues.push(lvl + " " + e.id + ": conjugations must be a non-empty array when present");
      } else {
        e.conjugations.forEach(function (row, ri) {
          ["pos", "form", "example"].forEach(function (f) {
            if (typeof row[f] !== "string" || !row[f]) {
              issues.push(lvl + " " + e.id + ": conjugations[" + ri + "] missing/empty '" + f + "'");
            }
          });
        });
      }
    }
    if (e.related && !Array.isArray(e.related)) {
      issues.push(lvl + " " + e.id + ": related must be an array when present");
    }
  });
  return issues;
}

// ---------- 2. Furigana alignment ----------
function checkAlignment(all) {
  var issues = [];
  var total = 0;
  all.forEach(function (item) {
    var e = item.entry, lvl = item.levelName;
    e.usages.forEach(function (u) {
      u.examples.forEach(function (ex) {
        total++;
        if (GrammarAlignment.computeAlignment(ex.japanese, ex.furigana) === null) {
          issues.push(lvl + " " + e.id + ": alignment failed for \"" + ex.japanese + "\" / \"" + ex.furigana + "\"");
        }
      });
    });
  });
  return { issues: issues, total: total };
}

// ---------- 3. Duplicate IDs ----------
function checkDuplicateIds(all) {
  var seen = {};
  var issues = [];
  all.forEach(function (item) {
    var id = item.entry.id;
    if (seen[id]) issues.push("duplicate id '" + id + "' (" + seen[id] + " and " + item.levelName + ")");
    else seen[id] = item.levelName;
  });
  return issues;
}

// ---------- 4. Duplicate examples within an entry ----------
function checkDuplicateExamples(all) {
  var issues = [];
  all.forEach(function (item) {
    var e = item.entry, lvl = item.levelName;
    var texts = [];
    e.usages.forEach(function (u) { u.examples.forEach(function (ex) { texts.push(ex.japanese); }); });
    var seen = {};
    texts.forEach(function (t) {
      seen[t] = (seen[t] || 0) + 1;
    });
    Object.keys(seen).forEach(function (t) {
      if (seen[t] > 1) issues.push(lvl + " " + e.id + ": example repeated " + seen[t] + "x — \"" + t + "\"");
    });
  });
  return issues;
}

// ---------- 5. Related-link integrity ----------
function checkRelatedLinks(all) {
  var issues = [];
  var idSet = {};
  all.forEach(function (item) { idSet[item.entry.id] = true; });
  all.forEach(function (item) {
    var e = item.entry, lvl = item.levelName;
    if (!e.related) return;
    e.related.forEach(function (r) {
      if (!idSet[r]) issues.push(lvl + " " + e.id + ": related link to unknown id '" + r + "'");
      if (r === e.id) issues.push(lvl + " " + e.id + ": related link to itself");
    });
  });
  return issues;
}

// ---------- 6. Kanji-reading consistency (review list, not a hard failure) ----------
// For every kanji run that appears more than once across the dataset,
// collect all the distinct furigana readings it was given. If one reading
// dominates (>=3 occurrences) and another shows up only once, that lone
// reading is worth a human glance: it might be a legitimate second word
// sharing the same kanji (好き vs 好む), or it might be a typo/misalignment
// (as happened with 頑張, 済む, 彼, and 子供 in this dataset's history).
function checkReadingConsistency(all) {
  var readingMap = {}; // kanjiRun -> { reading: [{lvl, id, japanese}, ...] }
  all.forEach(function (item) {
    var e = item.entry, lvl = item.levelName;
    e.usages.forEach(function (u) {
      u.examples.forEach(function (ex) {
        var segments = GrammarAlignment.computeAlignment(ex.japanese, ex.furigana);
        if (!segments) return;
        segments.forEach(function (seg) {
          if (!seg.isKanji) return;
          var run = ex.japanese.slice(seg.jStart, seg.jEnd);
          var reading = ex.furigana.slice(seg.fStart, seg.fEnd);
          if (!readingMap[run]) readingMap[run] = {};
          if (!readingMap[run][reading]) readingMap[run][reading] = [];
          readingMap[run][reading].push({ lvl: lvl, id: e.id, japanese: ex.japanese });
        });
      });
    });
  });

  var flagged = [];
  Object.keys(readingMap).forEach(function (run) {
    var entries = Object.entries(readingMap[run]);
    if (entries.length < 2) return;
    entries.sort(function (a, b) { return b[1].length - a[1].length; });
    var topReading = entries[0][0], topCount = entries[0][1].length;
    entries.slice(1).forEach(function (pair) {
      var reading = pair[0], occurrences = pair[1];
      if (occurrences.length === 1 && topCount >= 3) {
        flagged.push({
          run: run, commonReading: topReading, commonCount: topCount,
          rareReading: reading, where: occurrences[0]
        });
      }
    });
  });
  return flagged;
}

// ---------- Runner ----------
function section(title) {
  console.log("\n" + title);
  console.log("-".repeat(title.length));
}

function main() {
  var levels = loadLevels();
  var all = flattenEntries(levels);

  console.log("Loaded " + all.length + " entries across " + Object.keys(levels).length + " levels:");
  Object.entries(levels).forEach(function (pair) {
    console.log("  " + pair[0] + ": " + pair[1].length + " entries");
  });

  var hardFailures = 0;

  section("1. Schema");
  var schemaIssues = checkSchema(all);
  if (schemaIssues.length === 0) {
    console.log("OK — every entry has its required fields.");
  } else {
    schemaIssues.forEach(function (i) { console.log("FAIL: " + i); });
    hardFailures += schemaIssues.length;
  }

  section("2. Furigana alignment");
  var alignResult = checkAlignment(all);
  console.log("Checked " + alignResult.total + " examples.");
  if (alignResult.issues.length === 0) {
    console.log("OK — every example aligns.");
  } else {
    alignResult.issues.forEach(function (i) { console.log("FAIL: " + i); });
    hardFailures += alignResult.issues.length;
  }

  section("3. Duplicate entry IDs");
  var dupIdIssues = checkDuplicateIds(all);
  if (dupIdIssues.length === 0) {
    console.log("OK — no duplicate ids.");
  } else {
    dupIdIssues.forEach(function (i) { console.log("FAIL: " + i); });
    hardFailures += dupIdIssues.length;
  }

  section("4. Duplicate examples within an entry");
  var dupExIssues = checkDuplicateExamples(all);
  if (dupExIssues.length === 0) {
    console.log("OK — no repeated examples within any entry.");
  } else {
    dupExIssues.forEach(function (i) { console.log("FAIL: " + i); });
    hardFailures += dupExIssues.length;
  }

  section("5. Related-link integrity");
  var relatedIssues = checkRelatedLinks(all);
  var relatedCount = all.filter(function (item) { return item.entry.related; }).length;
  console.log("Checked " + relatedCount + " entries with related links.");
  if (relatedIssues.length === 0) {
    console.log("OK — every related link resolves to a real entry.");
  } else {
    relatedIssues.forEach(function (i) { console.log("FAIL: " + i); });
    hardFailures += relatedIssues.length;
  }

  section("6. Kanji-reading consistency (review — not a hard failure)");
  var flagged = checkReadingConsistency(all);
  if (flagged.length === 0) {
    console.log("Nothing flagged.");
  } else {
    console.log(flagged.length + " kanji/reading pairs worth a glance:");
    console.log("(Most of these are legitimate — a kanji genuinely read two");
    console.log("different ways in two different words. Only worth chasing");
    console.log("down if a specific one looks actually wrong.)\n");
    flagged.forEach(function (f) {
      console.log(
        f.run + ": " + f.commonReading + " (x" + f.commonCount + ") vs " + f.rareReading + " (x1)" +
        "  <- " + f.where.lvl + " " + f.where.id + " \"" + f.where.japanese + "\""
      );
    });
  }

  console.log("\n" + "=".repeat(40));
  if (hardFailures === 0) {
    console.log("ALL CHECKS PASSED (" + flagged.length + " reading pairs to optionally review)");
  } else {
    console.log(hardFailures + " HARD FAILURE(S) — see above");
  }
  console.log("=".repeat(40));

  process.exit(hardFailures === 0 ? 0 : 1);
}

main();
