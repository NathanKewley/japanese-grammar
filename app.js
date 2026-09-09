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

  // ---------- Furigana -> ruby markup ----------
  // Aligns a plain-Japanese string against its all-hiragana furigana string
  // and produces <ruby>kanji<rt>reading</rt></ruby> markup. Falls back to
  // showing the japanese text plain if alignment ever fails.
  var KANJI_RUN_RE = /[\u4e00-\u9faf\u30050-9\uFF10-\uFF19]+/g;

  function buildRuby(japanese, furigana) {
    if (!furigana) return escapeHtml(japanese);
    var literalParts = japanese.split(KANJI_RUN_RE);
    var kanjiRuns = japanese.match(KANJI_RUN_RE) || [];
    var ptr = 0;
    var out = "";
    for (var i = 0; i < literalParts.length; i++) {
      var lit = literalParts[i];
      if (lit) {
        var idx = furigana.indexOf(lit, ptr);
        if (idx === -1) return escapeHtml(japanese);
        ptr = idx + lit.length;
        out += escapeHtml(lit);
      }
      if (i < kanjiRuns.length) {
        var run = kanjiRuns[i];
        var nextLit = literalParts[i + 1];
        var end;
        if (nextLit) {
          end = furigana.indexOf(nextLit, ptr + 1);
          if (end === -1) return escapeHtml(japanese);
        } else {
          end = furigana.length;
        }
        if (end === ptr) return escapeHtml(japanese);
        var reading = furigana.slice(ptr, end);
        out += "<ruby>" + escapeHtml(run) + "<rt>" + escapeHtml(reading) + "</rt></ruby>";
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
    $search.placeholder = isSavedTab ? "Search your saved points…" : "Search " + state.activeTab + " grammar…";

    var entries = isSavedTab
      ? allEntries().filter(function (e) { return isSaved(e.id); })
      : entriesForLevel(state.activeTab);

    $pageHeading.innerHTML = pageHeadingHtml(isSavedTab, entries.length);

    var filtered = entries.filter(function (e) { return matchesQuery(e, state.query); });

    if (filtered.length === 0) {
      $main.innerHTML = emptyStateHtml(isSavedTab, entries.length === 0);
      return;
    }

    var html;
    if (isSavedTab) {
      html = '<div class="entry-list">' + filtered.map(entryHtml).join("") + "</div>";
    } else {
      html = groupByCategory(filtered).map(function (g) {
        return '<div class="theme-heading">' + escapeHtml(g.category) + "</div>" +
          '<div class="entry-list">' + g.items.map(entryHtml).join("") + "</div>";
      }).join("");
    }
    $main.innerHTML = html;
    attachOpenHandlers();
    attachSaveHandlers();
  }

  function pageHeadingHtml(isSavedTab, count) {
    var title = isSavedTab ? "Saved" : state.activeTab + " Grammar";
    var subtitle = isSavedTab
      ? "Your saved grammar points for review."
      : state.activeTab + " Japanese grammar patterns and usages.";
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

  function entryHtml(entry) {
    var saved = isSaved(entry.id);
    var color = "var(--lvl-" + entry.level.toLowerCase() + ")";
    var badge = state.activeTab === "saved"
      ? '<span class="level-badge" style="--entry-color:' + color + '">' + entry.level + "</span>"
      : "";
    var usagesHtml = entry.usages.map(usageHtml).join("");
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
            '<p class="entry-explanation">' + escapeHtml(entry.explanation) + "</p>" +
            usagesHtml +
            notesHtml +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function usageHtml(usage) {
    var showTitle = usage.title && usage.title.length > 0;
    return (
      '<div class="usage-group">' +
        (showTitle ? '<div class="usage-title">' + escapeHtml(usage.title) + "</div>" : "") +
        usage.examples.map(exampleHtml).join("") +
      "</div>"
    );
  }

  function exampleHtml(ex) {
    return (
      '<div class="example">' +
        '<div class="example-jp jp-body">' + buildRuby(ex.japanese, ex.furigana) + "</div>" +
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
