const STORAGE_KEY = "japaneseGrammarPrefs";

const state = {
  activeTab: "N5",
  expanded: new Set(),
  saved: new Set(),
  furigana: true,
  search: ""
};

const CATEGORY_ORDER = [
  "Particles",
  "Verb Forms",
  "Adjectives",
  "Basic Sentence Patterns",
  "Questions & Question Words",
  "Time & Sequence",
  "Desire, Ability & Preference",
  "Requests & Permission",
  "Comparison & Degree",
  "Reasons & Connections",
  "Conditions & Other Patterns"
];

const CATEGORY_MAP = {
  "n5-wa":"Particles", "n5-ga":"Particles", "n5-o":"Particles", "n5-ni":"Particles",
  "n5-de":"Particles", "n5-no":"Particles", "n5-ka":"Particles", "n5-mo":"Particles",
  "n5-e":"Particles", "n5-to":"Particles", "n5-ya":"Particles", "n5-kara":"Particles",
  "n5-made":"Particles", "n5-dake":"Particles",

  "n5-masu":"Verb Forms", "n5-teiru":"Verb Forms", "n5-plain-form":"Verb Forms",
  "n5-tari-tari":"Verb Forms", "n5-nagara":"Verb Forms", "n5-kata":"Verb Forms",
  "n5-toki":"Time & Sequence", "n5-mae-ni":"Time & Sequence", "n5-ato-de":"Time & Sequence",

  "n5-i-adj":"Adjectives", "n5-na-adj":"Adjectives",

  "n5-desu":"Basic Sentence Patterns", "n5-janai":"Basic Sentence Patterns",
  "n5-aru":"Basic Sentence Patterns", "n5-iru":"Basic Sentence Patterns", "n5-ga-hoshii":"Basic Sentence Patterns",
  "n5-kono":"Basic Sentence Patterns", "n5-kore":"Basic Sentence Patterns", "n5-ne":"Basic Sentence Patterns",
  "n5-yo":"Basic Sentence Patterns", "n5-ndesu":"Basic Sentence Patterns", "n5-deshou":"Basic Sentence Patterns",
  "n5-darou":"Basic Sentence Patterns",

  "n5-dare":"Questions & Question Words", "n5-nani":"Questions & Question Words", "n5-doko":"Questions & Question Words",
  "n5-doushite":"Questions & Question Words", "n5-dou":"Questions & Question Words", "n5-douyatte":"Questions & Question Words",
  "n5-donna":"Questions & Question Words", "n5-zenzen":"Questions & Question Words", "n5-amari":"Questions & Question Words",

  "n5-itsumo":"Time & Sequence", "n5-mou":"Time & Sequence", "n5-mada":"Time & Sequence",

  "n5-tai":"Desire, Ability & Preference", "n5-hoshii":"Desire, Ability & Preference", "n5-jouzu":"Desire, Ability & Preference",
  "n5-suki":"Desire, Ability & Preference", "n5-suki-na":"Desire, Ability & Preference", "n5-koto-ga-suki":"Desire, Ability & Preference",
  "n5-koto-ga-dekiru":"Desire, Ability & Preference", "n5-chotto":"Desire, Ability & Preference",

  "n5-te-kudasai":"Requests & Permission", "n5-naide-kudasai":"Requests & Permission", "n5-te-mo-ii":"Requests & Permission",
  "n5-te-wa-ikenai":"Requests & Permission", "n5-mashou":"Requests & Permission", "n5-masenk-a":"Requests & Permission",
  "n5-mashouka":"Requests & Permission", "n5-nakereba":"Requests & Permission", "n5-nai-to-ikenai":"Requests & Permission",
  "n5-hou-ga-ii":"Requests & Permission",

  "n5-ichiban":"Comparison & Degree", "n5-yori-hou":"Comparison & Degree",

  "n5-kedo":"Reasons & Connections", "n5-demo":"Reasons & Connections", "n5-soshite":"Reasons & Connections",
  "n5-sorekara":"Reasons & Connections", "n5-kara":"Reasons & Connections",

  "n5-tara":"Conditions & Other Patterns", "n5-nara":"Conditions & Other Patterns"
};

function loadPrefs() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.saved = new Set(Array.isArray(data.saved) ? data.saved : []);
    state.furigana = data.furigana !== false;
  } catch (_) {}
}

function savePrefs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    saved: [...state.saved],
    furigana: state.furigana
  }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function rubyHtml(japanese, furigana) {
  if (!furigana) return escapeHtml(japanese);
  return `<ruby>${escapeHtml(japanese)}<rt>${escapeHtml(furigana)}</rt></ruby>`;
}

function categoryFor(item) {
  if (CATEGORY_MAP[item.id]) return CATEGORY_MAP[item.id];
  if (item.category && CATEGORY_ORDER.includes(item.category)) return item.category;
  return "Conditions & Other Patterns";
}

function searchableText(item) {
  return [
    item.pattern, item.title, item.short, item.explanation, item.notes || "",
    ...(item.usages || []).flatMap(u => [u.title, ...(u.examples || []).flatMap(e => [e.japanese, e.furigana, e.english])])
  ].join(" ").toLowerCase();
}

function matchesSearch(item) {
  const q = state.search.trim().toLowerCase();
  return !q || searchableText(item).includes(q);
}

function getAllGrammarData() {
  const collection = [];
  if (typeof GRAMMAR !== "undefined") collection.push(...GRAMMAR);
  if (typeof N5_GRAMMAR !== "undefined") collection.push(...N5_GRAMMAR);
  if (typeof N4_GRAMMAR !== "undefined") collection.push(...N4_GRAMMAR);
  if (typeof N3_GRAMMAR !== "undefined") collection.push(...N3_GRAMMAR);
  if (typeof N2_GRAMMAR !== "undefined") collection.push(...N2_GRAMMAR);
  if (typeof N1_GRAMMAR !== "undefined") collection.push(...N1_GRAMMAR);

  const seen = new Set();
  return collection.filter(item => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function renderTabs() {
  const tabs = [
    { id: "N5", label: "N5" },
    { id: "N4", label: "N4" },
    { id: "N3", label: "N3" },
    { id: "N2", label: "N2" },
    { id: "N1", label: "N1" },
    { id: "SAVED", label: "★ Saved" }
  ];

  document.getElementById("tabs").innerHTML = tabs.map(tab => `
    <button class="tab ${state.activeTab === tab.id ? "active" : ""}"
            data-tab="${tab.id}">
      ${tab.label}${tab.id === "SAVED" ? ` · ${state.saved.size}` : ""}
    </button>
  `).join("");

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeTab = btn.dataset.tab;
      state.search = "";
      document.getElementById("grammarSearch").value = "";
      render();
    });
  });
}

function renderExample(example) {
  return `
    <div class="example">
      <div class="japanese">${rubyHtml(example.japanese, example.furigana)}</div>
      <div class="translation">${escapeHtml(example.english)}</div>
    </div>
  `;
}

function renderCard(item) {
  const expanded = state.expanded.has(item.id);
  const saved = state.saved.has(item.id);

  return `
    <article class="card ${expanded ? "expanded" : ""}" data-id="${item.id}">
      <div class="card-header" role="button" tabindex="0"
           aria-expanded="${expanded}" data-action="expand">
        <div class="pattern">${escapeHtml(item.pattern)}</div>
        <div class="card-summary">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-short">${escapeHtml(item.short)}</div>
        </div>
        <button class="save-button ${saved ? "saved" : ""}"
                aria-label="${saved ? "Remove from saved" : "Save grammar point"}"
                data-action="save">${saved ? "★" : "☆"}</button>
        <span class="chevron" aria-hidden="true"></span>
      </div>

      <div class="card-body">
        <p class="explanation">${escapeHtml(item.explanation)}</p>
        ${(item.usages || []).map(usage => `
          <section class="usage">
            <div class="usage-title">${escapeHtml(usage.title)}</div>
            ${(usage.examples || []).map(renderExample).join("")}
          </section>
        `).join("")}
        ${item.notes ? `<div class="notes"><strong>Note:</strong> ${escapeHtml(item.notes)}</div>` : ""}
      </div>
    </article>
  `;
}

function groupItems(items) {
  const groups = new Map();
  for (const category of CATEGORY_ORDER) groups.set(category, []);
  items.forEach(item => groups.get(categoryFor(item)).push(item));
  return [...groups.entries()].filter(([, group]) => group.length);
}

function renderGroupedList(items) {
  return groupItems(items).map(([category, group]) => `
    <section class="grammar-section">
      <h2 class="grammar-section-title">${escapeHtml(category)}</h2>
      <div class="grammar-list">
        ${group.map(renderCard).join("")}
      </div>
    </section>
  `).join("");
}

function updateFuriganaVisibility() {
  document.querySelectorAll(".japanese ruby").forEach(ruby => {
    ruby.classList.toggle("ruby-hidden", !state.furigana);
  });
}

function render() {
  renderTabs();

  const allData = getAllGrammarData();
  const isSaved = state.activeTab === "SAVED";
  const allItems = isSaved
    ? allData.filter(item => state.saved.has(item.id))
    : allData.filter(item => item.level === state.activeTab);
  const items = allItems.filter(matchesSearch);
  const searching = state.search.trim().length > 0;

  document.getElementById("sectionTitle").textContent = isSaved ? "Saved Grammar" : `${state.activeTab} Grammar`;
  document.getElementById("grammarSearch").placeholder = isSaved ? "Search saved grammar..." : `Search ${state.activeTab} grammar...`;
  document.getElementById("searchClear").hidden = !state.search;
  document.getElementById("sectionDescription").textContent = searching
    ? `${items.length} result${items.length === 1 ? "" : "s"} matching “${state.search.trim()}”.`
    : isSaved
      ? "Grammar points saved for quick review."
      : `${state.activeTab} Japanese grammar patterns and usages.`;
  document.getElementById("countBadge").textContent = items.length;

  const list = document.getElementById("grammarList");
  const empty = document.getElementById("emptyState");
  const noResults = document.getElementById("noResultsState");

  list.hidden = items.length === 0;
  empty.hidden = !(isSaved && allItems.length === 0);
  noResults.hidden = !(items.length === 0 && allItems.length > 0);
  list.innerHTML = items.length ? renderGroupedList(items) : "";

  document.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id;
    const header = card.querySelector(".card-header");

    const toggleCard = () => {
      if (state.expanded.has(id)) {
        state.expanded.delete(id);
        card.classList.remove("expanded");
        header.setAttribute("aria-expanded", "false");
      } else {
        state.expanded.add(id);
        card.classList.add("expanded");
        header.setAttribute("aria-expanded", "true");
      }
    };

    header.addEventListener("click", event => {
      if (event.target.closest("[data-action='save']")) return;
      toggleCard();
    });

    header.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        if (event.target.closest("[data-action='save']")) return;
        event.preventDefault();
        toggleCard();
      }
    });
  });

  document.querySelectorAll("[data-action='save']").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const id = button.closest(".card").dataset.id;
      if (state.saved.has(id)) state.saved.delete(id);
      else state.saved.add(id);
      savePrefs();
      render();
    });
  });

  document.getElementById("furiganaToggle").checked = state.furigana;
  updateFuriganaVisibility();
}

document.getElementById("furiganaToggle").addEventListener("change", event => {
  state.furigana = event.target.checked;
  savePrefs();
  updateFuriganaVisibility();
});

document.getElementById("grammarSearch").addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

document.getElementById("searchClear").addEventListener("click", () => {
  state.search = "";
  document.getElementById("grammarSearch").value = "";
  render();
  document.getElementById("grammarSearch").focus();
});

loadPrefs();
render();