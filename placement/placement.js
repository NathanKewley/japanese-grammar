// The placement test: finds a level in grammar, vocabulary and kanji, then
// saves which level each course should skip past (shared/placement.js). Each
// app applies its part the next time it opens.
//
// Each section climbs from N5: up to five questions a level, passed at four
// right, and over at the second wrong answer. "I don't know" counts as wrong,
// so guessing isn't needed. Nothing is saved until the results are applied.

import { html, raw, icon, initTheme, toggleTheme, currentTheme, slashDate } from '../shared/srs/dom.js';
import { readPlacement, writePlacement, markPlacementOffered } from '../shared/placement.js';

const C = window.GrammarCore;
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const PER_LEVEL = 5;
const PASS = 4;
const FAIL = PER_LEVEL - PASS + 1;

// ---------- Helpers ----------

function shuffle(a) {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const hasKanji = (s) => /[㐀-鿿々]/.test(s);

/** A right answer and up to three wrong ones, shuffled. */
function choice(right, wrong) {
  const options = shuffle([right, ...wrong.slice(0, 3)]);
  return { options, correctIndex: options.indexOf(right) };
}

// ---------- Questions ----------

const pools = { grammar: {}, vocab: {}, kanji: {} };

function buildPools(vocab, writing) {
  for (const level of LEVELS) {
    pools.grammar[level] = C.entriesForLevel(level).filter((e) => !C.isReferenceArticle(e) && C.flattenExamples(e).length);
    pools.vocab[level] = [];
    pools.kanji[level] = [];
  }
  for (const lesson of vocab.lessons) {
    for (const w of lesson.words) {
      if (!w.m.length) continue;
      const pos = w.p || [];
      const group = pos.some((p) => p.startsWith('v')) ? 'verb' : pos.some((p) => p.startsWith('adj')) ? 'adjective' : pos.some((p) => p.startsWith('adv')) ? 'adverb' : 'noun';
      pools.vocab[lesson.level].push({ key: `${w.w}|${w.r}`, w: w.w, r: w.r, meaning: w.m[0].split('; ').slice(0, 2).join('; '), group });
    }
  }
  for (const lesson of writing.lessons) {
    for (const k of lesson.kanji || []) {
      if (pools.kanji[k.level] && k.meanings.length) pools.kanji[k.level].push(k);
    }
  }
}

/** Fill the blank in one of a point's examples, as the grammar course asks it. */
function grammarQuestion(level, used) {
  for (const entry of shuffle(pools.grammar[level].filter((e) => !used.has(e.id)))) {
    used.add(entry.id);
    const examples = C.flattenExamples(entry);
    const ex = examples[Math.floor(Math.random() * examples.length)];
    const [q] = C.buildFillBlankQuestions(entry, [ex]);
    if (!q.hl || q.options.length < 3) continue;
    return {
      prompt: html`<div class="h3">Which fills the blank?</div>
        <div class="ja-l" lang="ja" style="line-height:2">${raw(C.buildRubyBlank(ex.japanese, ex.furigana, q.hl, '<span class="grammar-blank">？</span>'))}</div>
        <p class="small" style="color:var(--ink)">${ex.english}</p>`,
      options: q.options.map((o) => o.text),
      correctIndex: q.options.findIndex((o) => o.correct),
      ja: true,
    };
  }
  return null;
}

/** A word's meaning, with wrong options from the same level and kind of word. */
function vocabQuestion(level, used) {
  const pool = pools.vocab[level];
  const word = shuffle(pool.filter((w) => !used.has(w.key)))[0];
  if (!word) return null;
  used.add(word.key);
  const wrong = [];
  for (const other of [...shuffle(pool.filter((w) => w.group === word.group)), ...shuffle(pool)]) {
    if (wrong.length === 3) break;
    if (other.meaning !== word.meaning && !wrong.includes(other.meaning)) wrong.push(other.meaning);
  }
  return {
    prompt: html`<div class="h3">What does this word mean?</div>
      <div class="ja-xl" lang="ja">${word.w}</div>
      ${hasKanji(word.w) ? html`<div class="small" lang="ja">${word.r}</div>` : ''}`,
    ...choice(word.meaning, wrong),
  };
}

const kanjiMeaning = (k) => k.meanings.slice(0, 2).join(', ');

/** A kanji's meaning, with wrong options from the same level that share none of its meanings. */
function kanjiQuestion(level, used) {
  const pool = pools.kanji[level];
  const kanji = shuffle(pool.filter((k) => !used.has(k.char)))[0];
  if (!kanji) return null;
  used.add(kanji.char);
  const own = new Set(kanji.meanings);
  const wrong = [];
  for (const other of shuffle(pool)) {
    if (wrong.length === 3) break;
    const m = kanjiMeaning(other);
    if (other !== kanji && !other.meanings.some((x) => own.has(x)) && !wrong.includes(m)) wrong.push(m);
  }
  return {
    prompt: html`<div class="h3">What does this kanji mean?</div>
      <div class="ja-xl placement-kanji" lang="ja">${kanji.char}</div>`,
    ...choice(kanjiMeaning(kanji), wrong),
  };
}

const SECTIONS = [
  { id: 'grammar', title: 'Grammar', blurb: 'Pick what fills the blank in an example sentence.', make: grammarQuestion },
  { id: 'vocab', title: 'Vocabulary', blurb: 'Pick the meaning of a word.', make: vocabQuestion },
  { id: 'kanji', title: 'Kanji', blurb: 'Pick the meaning of a kanji.', make: kanjiQuestion },
];

/** The courses each section places, in the order the results show them. */
const COURSES = [
  { id: 'grammar', name: 'Grammar', from: 'grammar' },
  { id: 'conjugation', name: 'Conjugation', from: 'grammar', note: 'Follows your grammar level.' },
  { id: 'vocab', name: 'Vocabulary', from: 'vocab' },
  { id: 'reading', name: 'Reading', from: 'vocab', note: 'Follows your vocabulary level.' },
  { id: 'listening', name: 'Listening', from: 'vocab', note: 'Follows your vocabulary level.' },
  { id: 'writing', name: 'Writing', from: 'kanji', note: "The test checked reading kanji, not writing them. Lower this if you can't write them yet." },
];

// ---------- State ----------

const state = {
  phase: 'loading', // loading, intro, question, between, results, done, error
  section: 0,
  level: 0,
  right: 0,
  wrong: 0,
  asked: 0,
  answered: 0,
  question: null,
  used: new Set(),
  result: { grammar: null, vocab: null, kanji: null },
  choices: {},
  error: '',
};

function startSection(i) {
  state.section = i;
  state.level = 0;
  state.used = new Set();
  startLevel();
}

function startLevel() {
  state.right = 0;
  state.wrong = 0;
  state.asked = 0;
  nextQuestion();
}

function nextQuestion() {
  const section = SECTIONS[state.section];
  const q = section.make(LEVELS[state.level], state.used);
  if (!q) { endSection(); return; }
  state.question = q;
  state.asked++;
  state.phase = 'question';
}

function answer(correct) {
  state.answered++;
  if (correct) state.right++;
  else state.wrong++;
  if (state.right >= PASS) {
    state.result[SECTIONS[state.section].id] = LEVELS[state.level];
    if (state.level + 1 < LEVELS.length) {
      state.level++;
      startLevel();
    } else endSection();
  } else if (state.wrong >= FAIL) endSection();
  else nextQuestion();
}

function endSection() {
  state.question = null;
  state.phase = 'between';
}

function showResults() {
  for (const c of COURSES) state.choices[c.id] = state.result[c.from] || '';
  state.phase = 'results';
}

function apply() {
  const levels = {};
  for (const c of COURSES) levels[c.id] = state.choices[c.id] || null;
  writePlacement({ at: Date.now(), levels, applied: {} });
  state.phase = 'done';
}

// ---------- Screens ----------

const passedText = (level) => (level ? `${level} passed` : 'Not N5 yet');

function choiceLabel(level) {
  if (!level) return 'Start from the beginning';
  const i = LEVELS.indexOf(level);
  if (i === LEVELS.length - 1) return 'Skip everything, N5 to N1';
  return `Skip ${i ? `N5 to ${level}` : 'N5'}, start at ${LEVELS[i + 1]}`;
}

function introScreen() {
  const last = readPlacement();
  return html`<div class="stack-lg">
    <div class="stack">
      <h1 class="h1">Find your level</h1>
      <p class="prose">If you already know some Japanese, this short test finds your level in grammar, vocabulary and kanji, so the courses can skip what you know.</p>
    </div>
    <div class="card stack">
      ${SECTIONS.map((s, i) => html`<div class="row top"><span class="placement-num">${i + 1}</span><div class="grow"><div class="h3">${s.title}</div><div class="small">${s.blurb}</div></div></div>`)}
    </div>
    <div class="small stack">
      <p>Each part starts at N5 and moves up a level each time you get ${PASS} of ${PER_LEVEL} right. It stops at the first level you don't pass, so it takes 5 to 15 minutes.</p>
      <p>Don't guess: press <strong>I don't know</strong> instead, so the result fits what you really know. <strong>Stop here</strong> ends a part and keeps the levels you've passed.</p>
      <p>Skipped lessons count as done but don't add anything to your reviews. They stay open, so you can study any of them whenever you like.</p>
    </div>
    ${last ? html`<div class="notice">You took the test on ${slashDate(new Date(last.at))}. A new result only skips further ahead: lessons already passed stay passed. To go back, use <em>Undo placement</em> in an app's Settings.</div>` : ''}
    <div class="stack">
      <button class="btn block" data-act="start">Start the test</button>
      <a class="btn text block" href="../index.html">Not now</a>
    </div>
  </div>`;
}

function levelTrack() {
  const passed = state.result[SECTIONS[state.section].id];
  const upto = passed ? LEVELS.indexOf(passed) : -1;
  return html`<div class="placement-levels" aria-hidden="true">
    ${LEVELS.map((l, i) => html`<span class="${i <= upto ? 'done' : i === state.level ? 'now' : ''}">${i <= upto ? icon('check') : ''}${l}</span>`)}
  </div>`;
}

function questionScreen() {
  const section = SECTIONS[state.section];
  const q = state.question;
  return html`<div class="stack-lg">
    <div class="stack">
      <div class="row"><div class="grow label">Part ${state.section + 1} of ${SECTIONS.length}: ${section.title} · ${LEVELS[state.level]}</div><span class="small">Question ${state.asked} of up to ${PER_LEVEL}</span></div>
      ${levelTrack()}
    </div>
    <div class="stack">${q.prompt}</div>
    <div class="stack">
      ${q.options.map((opt, i) => html`<button class="option" ${q.ja ? raw('lang="ja"') : ''} data-act="answer" data-i="${i}">${opt}</button>`)}
      <button class="option placement-idk" data-act="answer" data-i="-1">I don't know</button>
    </div>
    <button class="btn text block" data-act="stop">Stop here</button>
  </div>`;
}

function betweenScreen() {
  const section = SECTIONS[state.section];
  const level = state.result[section.id];
  const next = SECTIONS[state.section + 1];
  return html`<div class="stack-lg">
    <div class="stack">
      <div class="label">Part ${state.section + 1} of ${SECTIONS.length} done</div>
      <h1 class="h1">${section.title}: ${level ? `${level} passed` : 'starting from N5'}</h1>
      ${levelTrack()}
      <p class="prose">${level
        ? level === 'N1' ? 'You passed every level.' : `The ${section.title.toLowerCase()} lessons can skip ahead to ${LEVELS[LEVELS.indexOf(level) + 1]}.`
        : `N5 is the place to start, so nothing is skipped here.`}</p>
    </div>
    ${next
      ? html`<div class="card"><div class="h3">Next: ${next.title}</div><div class="small">${next.blurb}</div></div>
        <button class="btn block" data-act="next">Continue</button>`
      : html`<button class="btn block" data-act="results">See your results</button>`}
  </div>`;
}

function resultsScreen() {
  return html`<div class="stack-lg">
    <div class="stack">
      <h1 class="h1">Your results</h1>
      <p class="prose">Grammar: ${passedText(state.result.grammar)}. Vocabulary: ${passedText(state.result.vocab)}. Kanji: ${passedText(state.result.kanji)}.</p>
      <p class="small">Here's where each course will start. Change any of them if you'd rather start earlier or later.</p>
    </div>
    <div class="list placement-results">
      ${COURSES.map((c) => html`<label class="placement-row">
        <span class="grow"><span class="h3">${c.name}</span>${c.note ? html`<span class="small">${c.note}</span>` : ''}</span>
        <select class="placement-select" data-course="${c.id}">
          ${['', ...LEVELS].map((l) => html`<option value="${l}" ${state.choices[c.id] === l ? 'selected' : ''}>${choiceLabel(l)}</option>`)}
        </select>
      </label>`)}
    </div>
    <div class="stack">
      <button class="btn block" data-act="apply">Apply</button>
      <a class="btn text block" href="../index.html">Start from the beginning instead</a>
    </div>
  </div>`;
}

function doneScreen() {
  const skipping = COURSES.filter((c) => state.choices[c.id]);
  return html`<div class="stack-lg">
    <div class="stack">
      <h1 class="h1">All set</h1>
      <p class="prose">${skipping.length
        ? html`Each course skips ahead the next time you open it: ${skipping.map((c, i) => html`${i ? ', ' : ''}${c.name} past ${state.choices[c.id]}`)}. The skipped lessons stay open to study, and each app's Settings can undo it.`
        : 'Every course starts from the beginning.'}</p>
    </div>
    <a class="btn block" href="../index.html">Go to the courses</a>
  </div>`;
}

function render() {
  const root = document.getElementById('app');
  const body = {
    loading: () => html`<div class="spinner"></div>`,
    error: () => html`<div class="notice warn">Couldn't load the test: ${state.error}. Try reloading the page.</div>`,
    intro: introScreen,
    question: questionScreen,
    between: betweenScreen,
    results: resultsScreen,
    done: doneScreen,
  }[state.phase]();
  root.innerHTML = String(html`<header class="appbar"><div class="appbar-row">
      <a class="icon-btn" href="../index.html" title="All study apps" aria-label="All study apps">${icon('home')}</a>
      <div class="appbar-title">Placement test</div>
      <button class="icon-btn" data-act="theme" title="Toggle dark mode" aria-label="Toggle dark mode">${icon(currentTheme() === 'dark' ? 'sun' : 'moon')}</button>
    </div></header>
    <main class="view">${body}</main>`);
}

let lastPhase = null;
function update() {
  render();
  // A new screen starts at the top.
  if (state.phase !== lastPhase || state.phase === 'question') window.scrollTo(0, 0);
  lastPhase = state.phase;
}

document.getElementById('app').addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'theme') { toggleTheme(); update(); return; }
  if (act === 'start') startSection(0);
  else if (act === 'answer') answer(Number(el.dataset.i) === state.question.correctIndex);
  else if (act === 'stop') endSection();
  else if (act === 'next') startSection(state.section + 1);
  else if (act === 'results') showResults();
  else if (act === 'apply') apply();
  else return;
  update();
});

document.getElementById('app').addEventListener('change', (ev) => {
  const el = ev.target.closest('[data-course]');
  if (el) state.choices[el.dataset.course] = el.value;
});

async function load() {
  initTheme();
  // Opening the test counts as being offered it.
  markPlacementOffered();
  update();
  try {
    const get = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); });
    const [vocab, writing] = await Promise.all([get('../vocab/data/content.json'), get('../writing/data/content.json')]);
    buildPools(vocab, writing);
    state.phase = 'intro';
  } catch (e) {
    console.error(e);
    state.error = e.message;
    state.phase = 'error';
  }
  update();
}

// Handy from the browser console, and for the tests.
window.placement = { state, SECTIONS, LEVELS, pools };

load();
