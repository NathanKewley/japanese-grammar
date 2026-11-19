(function () {
  "use strict";

  // The data, highlighting, furigana and question-building logic live in
  // grammar-core.js (loaded before this file), shared with the grammar course.
  var GC = GrammarCore;
  var LEVELS = GC.LEVELS;
  var LEVEL_DATA = GC.LEVEL_DATA;
  var REFERENCE_ARTICLES_DATA = GC.REFERENCE_ARTICLES_DATA;
  var findReferenceArticleById = GC.findReferenceArticleById;
  var isReferenceArticle = GC.isReferenceArticle;
  var allEntries = GC.allEntries;
  var entriesForLevel = GC.entriesForLevel;
  var findEntryById = GC.findEntryById;
  var VOICING_MAP = GC.VOICING_MAP;
  var withVoicedVariant = GC.withVoicedVariant;
  var ICHIDAN_PRECEDING = GC.ICHIDAN_PRECEDING;
  var GODAN_ENDINGS = GC.GODAN_ENDINGS;
  var AROW_TO_IROW = GC.AROW_TO_IROW;
  var IDIOMATIC_NAI_POLITE = GC.IDIOMATIC_NAI_POLITE;
  var withPoliteVariant = GC.withPoliteVariant;
  var withMasuVariant = GC.withMasuVariant;
  var withCopulaVariant = GC.withCopulaVariant;
  var withCasualContraction = GC.withCasualContraction;
  var withMiscVariant = GC.withMiscVariant;
  var withSharedSubstring = GC.withSharedSubstring;
  var withNiKuVariant = GC.withNiKuVariant;
  var withAdjectiveVariant = GC.withAdjectiveVariant;
  var withConjugationStems = GC.withConjugationStems;
  var splitOnPlaceholders = GC.splitOnPlaceholders;
  var extractFragments = GC.extractFragments;
  var findHighlightRange = GC.findHighlightRange;
  var rangesOverlap = GC.rangesOverlap;
  var HIRAGANA_ONLY_RE = GC.HIRAGANA_ONLY_RE;
  var computeAlignment = GC.computeAlignment;
  var buildAlignmentSegments = GC.buildAlignmentSegments;
  var mapFuriRangeToJapanese = GC.mapFuriRangeToJapanese;
  var highlightSlice = GC.highlightSlice;
  var buildRuby = GC.buildRuby;
  var shuffleArray = GC.shuffleArray;
  var pickN = GC.pickN;
  var flattenExamples = GC.flattenExamples;
  var patternLabel = GC.patternLabel;
  var buildRubyBlank = GC.buildRubyBlank;
  var worksheetBlankPlaceholderHtml = GC.worksheetBlankPlaceholderHtml;
  var pickDistractorEntries = GC.pickDistractorEntries;
  var TRAILING_CONJUGATION_ENDINGS = GC.TRAILING_CONJUGATION_ENDINGS;
  var extendBlankForConjugation = GC.extendBlankForConjugation;
  var literalBlankedText = GC.literalBlankedText;
  var pickDistractorText = GC.pickDistractorText;
  var buildFillBlankQuestions = GC.buildFillBlankQuestions;
  var getExampleHighlightRange = GC.getExampleHighlightRange;
  var escapeHtml = GC.escapeHtml;
  var courseLessonOf = GC.courseLessonOf;



  var STORAGE_SAVED = "grammarNotebook.saved";
  var STORAGE_THEME = "grammarNotebook.theme";

  var state = {
    activeTab: "N5",
    activeArticle: null,
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
  var $worksheetModal = document.getElementById("worksheetModal");
  var $worksheetContent = document.getElementById("worksheetContent");
  var $worksheetBackdrop = document.getElementById("worksheetBackdrop");
  var $worksheetClose = document.getElementById("worksheetClose");
  var $worksheetRegenerate = document.getElementById("worksheetRegenerate");
  var $worksheetCheck = document.getElementById("worksheetCheck");

  // Set to true to bring the Reference tab back — the tab, its data
  // (reference-data.js), and all its rendering/cross-link code are left
  // fully intact, just not shown.
  var SHOW_REFERENCE_TAB = false;

  function renderTabs() {
    var html = "";
    LEVELS.forEach(function (lvl) {
      html += tabButtonHtml(lvl.id, lvl.label, "var(--lvl-" + lvl.id.toLowerCase() + ")");
    });
    if (SHOW_REFERENCE_TAB) {
      html += tabButtonHtml("reference", "Reference", "var(--lvl-ref)");
    }
    html += tabButtonHtml("saved", "Saved · " + state.saved.length, "var(--accent)", true);
    $tabBar.innerHTML = html;

    Array.prototype.forEach.call($tabBar.querySelectorAll(".tab-btn"), function (btn) {
      btn.addEventListener("click", function () {
        state.activeTab = btn.getAttribute("data-tab");
        state.activeArticle = null;
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
    if (state.activeTab === "reference") {
      $searchWrap.style.display = "none";
      renderReferenceMain();
      return;
    }
    $searchWrap.style.display = "";

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
    paintCourseLines();
  }

  // ---------- The grammar course ----------
  // Each entry says where it stands in the grammar course (grammar-course/),
  // from the shared learner model, and links to the lesson that teaches it.

  var learner = null;

  function courseLineHtml(id) {
    var lesson = courseLessonOf(id);
    if (!lesson) return "";
    var href = "../grammar-course/index.html#/section/g" + lesson.number;
    var s = learner ? learner.status("g:" + id).status : null;
    var text = s === "known" ? "✓ You know this one: it's in your grammar reviews."
      : s === "learning" ? "You're learning this in your grammar reviews."
      : "Study it with spaced reviews:";
    return '<span class="entry-course-text">' + escapeHtml(text) + "</span> " +
      '<a href="' + href + '">Grammar lesson ' + lesson.number + "</a>";
  }

  function paintCourseLines() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-course]"), function (el) {
      el.innerHTML = courseLineHtml(el.getAttribute("data-course"));
    });
  }

  // The learner model is an ES module; a plain script can still load it.
  import("../shared/learner.js")
    .then(function (m) { return m.Learner.open(); })
    .then(function (l) { learner = l; paintCourseLines(); })
    .catch(function () { /* the links still work without it */ });

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

  // ---------- Reference tab (articles) ----------
  function renderReferenceMain() {
    $search.value = "";
    var article = state.activeArticle ? findReferenceArticleById(state.activeArticle) : null;
    if (state.activeArticle && !article) state.activeArticle = null; // stale id, fall back to list

    if (article) {
      $pageHeading.innerHTML = referenceHeadingHtml(article.title, "Reference", null);
      $main.innerHTML = referenceArticleDetailHtml(article);
      attachReferenceBackHandler();
      attachOpenHandlers(); // for related-grammar chips inside the article
    } else {
      $pageHeading.innerHTML = referenceHeadingHtml("Reference", "Longer-form explainers on kana, conjugation, and word types.", REFERENCE_ARTICLES_DATA.length);
      $main.innerHTML = REFERENCE_ARTICLES_DATA.length
        ? '<div class="entry-list">' + REFERENCE_ARTICLES_DATA.map(referenceArticleCardHtml).join("") + "</div>"
        : '<div class="empty-state">No reference articles yet.</div>';
      attachReferenceCardHandlers();
    }
  }

  function referenceHeadingHtml(title, subtitle, count) {
    return (
      '<div class="page-heading">' +
        "<div>" +
          '<h2 class="page-heading-title">' + escapeHtml(title) + "</h2>" +
          '<p class="page-heading-subtitle">' + escapeHtml(subtitle) + "</p>" +
        "</div>" +
        (count === null ? "" : '<div class="page-heading-count">' + count + "</div>") +
      "</div>"
    );
  }

  function referenceArticleCardHtml(article) {
    return (
      '<div class="entry article-card" data-article="' + article.id + '" style="--entry-color:var(--lvl-ref)">' +
        '<div class="entry-head" data-open-article="' + article.id + '" role="button" tabindex="0">' +
          '<div class="entry-icon jp">' + escapeHtml(article.title.slice(0, 2)) + "</div>" +
          '<div class="entry-head-text">' +
            '<div class="entry-pattern">' + escapeHtml(article.title) + "</div>" +
            '<div class="entry-meaning">' + escapeHtml(article.short) + "</div>" +
          "</div>" +
          '<div class="entry-actions">' + chevronSvg() + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function attachReferenceCardHandlers() {
    Array.prototype.forEach.call($main.querySelectorAll("[data-open-article]"), function (el) {
      el.addEventListener("click", function () {
        state.activeArticle = el.getAttribute("data-open-article");
        renderMain();
        if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function attachReferenceBackHandler() {
    var back = $main.querySelector("[data-article-back]");
    if (back) {
      back.addEventListener("click", function () {
        state.activeArticle = null;
        renderMain();
      });
    }
  }

  function referenceArticleDetailHtml(article) {
    var blocksHtml = (article.blocks || []).map(renderReferenceBlock).join("");
    return (
      '<div class="article-detail">' +
        '<button class="article-back" data-article-back>' + backArrowSvg() + " All reference articles</button>" +
        '<h2 class="article-title">' + escapeHtml(article.title) + "</h2>" +
        blocksHtml +
        relatedGrammarHtml(article.related) +
      "</div>"
    );
  }

  function renderReferenceBlock(block) {
    switch (block.type) {
      case "paragraph": return '<p class="ref-paragraph">' + escapeHtml(block.text) + "</p>";
      case "note": return '<div class="entry-note"><span class="entry-note-label">Note</span>' + escapeHtml(block.text) + "</div>";
      case "table": return renderRefTable(block);
      case "kana-table": return renderKanaTable(block);
      default: return "";
    }
  }

  function renderRefTable(block) {
    var head = "<tr>" + block.headers.map(function (h) { return "<th>" + escapeHtml(h) + "</th>"; }).join("") + "</tr>";
    var rows = block.rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + escapeHtml(cell == null ? "" : String(cell)) + "</td>"; }).join("") + "</tr>";
    }).join("");
    return (
      '<div class="ref-table-wrap">' +
        (block.title ? '<div class="ref-table-title">' + escapeHtml(block.title) + "</div>" : "") +
        '<div class="ref-table-scroll"><table class="ref-table"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>" +
      "</div>"
    );
  }

  function renderKanaTable(block) {
    var head = "<tr>" + block.headers.map(function (h) { return "<th>" + escapeHtml(h) + "</th>"; }).join("") + "</tr>";
    var rows = block.rows.map(function (row) {
      return "<tr>" + row.map(renderKanaCell).join("") + "</tr>";
    }).join("");
    return (
      '<div class="ref-table-wrap">' +
        (block.title ? '<div class="ref-table-title">' + escapeHtml(block.title) + "</div>" : "") +
        '<div class="ref-table-scroll"><table class="ref-table kana-table"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>" +
      "</div>"
    );
  }

  function renderKanaCell(cell) {
    if (!cell) return '<td class="kana-cell kana-cell-empty"></td>';
    return (
      '<td class="kana-cell">' +
        '<div class="kana-cell-hira jp">' + escapeHtml(cell.hira) + "</div>" +
        '<div class="kana-cell-kata jp">' + escapeHtml(cell.kata) + "</div>" +
        '<div class="kana-cell-romaji">' + escapeHtml(cell.romaji) + "</div>" +
      "</td>"
    );
  }

  function backArrowSvg() {
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
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
            '<div class="entry-course" data-course="' + entry.id + '"></div>' +
            '<button class="worksheet-open-btn" data-worksheet="' + entry.id + '" type="button">' + worksheetIconSvg() + " View Worksheet</button>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function worksheetIconSvg() {
    return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>';
  }

  // ---------- Worksheet generator ----------
  // Builds a practice worksheet entirely from an entry's own data (its
  // existing examples, its conjugation categories, its related entries) —
  // no separate authored content, so it works for all 487 entries without
  // a second giant writing pass. Regenerating draws a fresh random
  // selection each time, since this is meant to be practiced more than
  // once.


  function worksheetFillBlankHtml(questions) {
    var items = questions.map(function (q, i) {
      var sentenceHtml = q.hl
        ? buildRubyBlank(q.ex.japanese, q.ex.furigana, q.hl, worksheetBlankPlaceholderHtml())
        : buildRuby(q.ex.japanese, q.ex.furigana, null);
      var optionsHtml = q.options.map(function (opt, oi) {
        var letter = String.fromCharCode(65 + oi);
        return (
          '<button type="button" class="worksheet-mc-option" data-mc-option' + (opt.correct ? ' data-correct="true"' : "") + '>' +
            '<span class="worksheet-mc-letter">' + letter + "</span>" +
            '<span class="jp">' + escapeHtml(opt.text) + "</span>" +
            '<span class="worksheet-mc-feedback"></span>' +
          "</button>"
        );
      }).join("");
      return (
        '<div class="worksheet-item">' +
          '<div class="worksheet-item-num">' + (i + 1) + "</div>" +
          '<div class="worksheet-item-body">' +
            '<div class="worksheet-en">' + escapeHtml(q.ex.english) + "</div>" +
            '<div class="worksheet-jp jp-body">' + sentenceHtml + "</div>" +
            '<div class="worksheet-mc-options">' + optionsHtml + "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    return '<div class="worksheet-items">' + items + "</div>";
  }

  function generateWorksheetHtml(entry) {
    var allExamples = flattenExamples(entry);
    var pickedExamples = pickN(allExamples, Math.min(5, allExamples.length));
    var questions = buildFillBlankQuestions(entry, pickedExamples);

    var html = "";
    html += '<div class="worksheet-header">';
    html +=   '<div class="worksheet-header-pattern jp">' + escapeHtml(patternLabel(entry)) + "</div>";
    html +=   '<div class="worksheet-header-meaning">' + escapeHtml(entry.title) + "</div>";
    html += "</div>";

    if (questions.length) {
      html += '<div class="worksheet-section">';
      html +=   '<div class="worksheet-section-title">Fill in the Blank</div>';
      html +=   '<p class="worksheet-section-instructions">Choose the option that correctly fills the blank in each sentence, based on the English translation.</p>';
      html +=   '<div class="worksheet-score" id="worksheetScore" hidden></div>';
      html +=   worksheetFillBlankHtml(questions);
      html += "</div>";
    }

    return html;
  }

  var worksheetState = { entryId: null };

  function openWorksheet(entryId) {
    var entry = findEntryById(entryId);
    if (!entry || isReferenceArticle(entry)) return;
    worksheetState.entryId = entryId;
    $worksheetContent.innerHTML = generateWorksheetHtml(entry);
    $worksheetModal.hidden = false;
    document.body.classList.add("worksheet-open");
  }

  function regenerateWorksheet() {
    if (!worksheetState.entryId) return;
    var entry = findEntryById(worksheetState.entryId);
    if (!entry) return;
    $worksheetContent.innerHTML = generateWorksheetHtml(entry);
    $worksheetContent.scrollTop = 0;
  }

  function closeWorksheet() {
    $worksheetModal.hidden = true;
    worksheetState.entryId = null;
    document.body.classList.remove("worksheet-open");
  }

  $worksheetClose.addEventListener("click", closeWorksheet);
  $worksheetBackdrop.addEventListener("click", closeWorksheet);
  $worksheetRegenerate.addEventListener("click", regenerateWorksheet);
  $worksheetCheck.addEventListener("click", checkWorksheetAnswers);
  document.addEventListener("keydown", function (evt) {
    if (evt.key === "Escape" && !$worksheetModal.hidden) closeWorksheet();
  });
  $worksheetContent.addEventListener("click", function (evt) {
    var opt = evt.target.closest("[data-mc-option]");
    if (!opt) return;
    var group = opt.closest(".worksheet-mc-options");
    // A fresh pick after checking clears that question's feedback, so it
    // can be answered and checked again rather than staying locked in.
    Array.prototype.forEach.call(group.querySelectorAll(".worksheet-mc-option"), function (b) {
      b.classList.remove("selected", "worksheet-mc-option--correct", "worksheet-mc-option--incorrect");
    });
    opt.classList.add("selected");
  });

  function checkWorksheetAnswers() {
    var items = $worksheetContent.querySelectorAll(".worksheet-item");
    var answered = 0, correct = 0;
    Array.prototype.forEach.call(items, function (item) {
      var options = item.querySelectorAll(".worksheet-mc-option");
      var selected = item.querySelector(".worksheet-mc-option.selected");
      var correctOpt = item.querySelector('.worksheet-mc-option[data-correct="true"]');
      if (!selected) return; // unanswered questions are left as-is, not counted
      answered++;
      var gotItRight = selected === correctOpt;
      if (gotItRight) correct++;
      Array.prototype.forEach.call(options, function (opt) {
        opt.classList.remove("worksheet-mc-option--correct", "worksheet-mc-option--incorrect");
      });
      if (gotItRight) {
        selected.classList.add("worksheet-mc-option--correct");
      } else {
        selected.classList.add("worksheet-mc-option--incorrect");
        if (correctOpt) correctOpt.classList.add("worksheet-mc-option--correct");
      }
    });

    var $score = document.getElementById("worksheetScore");
    if ($score) {
      var total = items.length;
      if (answered === 0) {
        $score.hidden = true;
      } else {
        $score.hidden = false;
        $score.textContent = correct + " / " + answered + " correct" + (answered < total ? " (" + (total - answered) + " unanswered)" : "");
      }
    }
  }

  function relatedGrammarHtml(relatedIds) {
    if (!relatedIds || !relatedIds.length) return "";
    var chips = relatedIds.map(function (id) {
      var target = findEntryById(id);
      if (!target) return "";
      if (isReferenceArticle(target)) {
        if (!SHOW_REFERENCE_TAB) return "";
        return (
          '<button class="related-chip" data-navigate="' + target.id + '" style="--chip-color:var(--lvl-ref)">' +
            '<span class="related-chip-level">REF</span>' +
            '<span class="related-chip-pattern">' + escapeHtml(target.title) + "</span>" +
          "</button>"
        );
      }
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
        '<div class="related-title">Related</div>' +
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
    var hl = getExampleHighlightRange(ex, pattern);
    return (
      '<div class="example">' +
        '<div class="example-jp jp-body">' + buildRuby(ex.japanese, ex.furigana, hl) + "</div>" +
        '<div class="example-en">' + escapeHtml(ex.english) + "</div>" +
      "</div>"
    );
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
    Array.prototype.forEach.call($main.querySelectorAll("[data-worksheet]"), function (btn) {
      btn.addEventListener("click", function (evt) {
        evt.stopPropagation();
        openWorksheet(btn.getAttribute("data-worksheet"));
      });
    });
  }

  function navigateToEntry(id) {
    var target = findEntryById(id);
    if (!target) return;
    state.query = "";
    $search.value = "";

    if (isReferenceArticle(target)) {
      state.activeTab = "reference";
      state.activeArticle = target.id;
      renderTabs();
      renderMain();
      if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (state.activeTab !== target.level) {
      state.activeTab = target.level;
      state.activeArticle = null;
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
    paintThemeBar(theme);
  }

  function moonSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  function sunSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }

  function paintThemeBar(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0C' : '#FAFAFA');
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

  // Links like grammar/index.html#n4-nagara open that entry.
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (id && findEntryById(id)) navigateToEntry(id);
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();
})();
