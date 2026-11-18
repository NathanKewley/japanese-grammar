// A Japanese passage whose words can be tapped to see what they mean, with
// furigana on kanji not yet learned, and read-aloud through the browser's
// speech engine. Used by Reading (passages) and Listening (transcripts).

import { html, raw, esc, icon, toast, furigana } from './dom.js';

// ---------- Dictionary ----------

export const isKanji = (c) => {
  const code = c.codePointAt(0);
  return (code >= 0x4e00 && code <= 0x9fff) || c === '々';
};

const PUNCTUATION = /^[\s。、！？「」『』（）・：…ー―〜!?,.]+$/;

/** JMdict's part-of-speech codes, in words. */
const POS_LABELS = {
  n: 'noun', pn: 'pronoun', num: 'number', ctr: 'counter', prt: 'particle', conj: 'conjunction', int: 'interjection',
  exp: 'expression', adv: 'adverb', 'adv-to': 'adverb (と)', 'adj-i': 'い-adjective', 'adj-ix': 'い-adjective (いい)',
  'adj-na': 'な-adjective', 'adj-no': 'noun that takes の', 'adj-pn': 'pre-noun adjective', 'adj-t': 'たる-adjective',
  'adj-f': 'pre-noun', pref: 'prefix', suf: 'suffix', 'n-suf': 'noun suffix', 'n-pref': 'noun prefix',
  'aux-v': 'auxiliary verb', 'aux-adj': 'auxiliary adjective', aux: 'auxiliary', cop: 'copula', v1: 'ru-verb',
  vk: 'irregular verb (来る)', vs: 'する verb', 'vs-i': 'する verb', 'vs-s': 'する verb', vz: 'ずる verb',
  vi: 'intransitive', vt: 'transitive', v5aru: 'u-verb (polite ある)', 'v5k-s': 'u-verb (行く)', 'v5r-i': 'u-verb (irregular)',
};

export const posLabel = (code) => POS_LABELS[code] || (code.startsWith('v5') ? 'u-verb' : code);

/** The JMdict entries and kanji details that a content file carries. */
export class Dictionary {
  constructor(entries, kanji) {
    this.entries = entries; // [{w, r, m, p}]
    this.kanji = kanji; // char -> {m, on, kun, lv, ls}
  }

  entry(i) { return i >= 0 ? this.entries[i] : null; }

  /** Whether [c] is a kanji not learned by Vibe Writing lesson [lesson]. */
  isUnlearned(c, lesson) {
    if (!isKanji(c) || c === '々') return false;
    const info = this.kanji[c];
    const ls = info ? info.ls : null;
    return ls == null || ls > lesson;
  }
}

const wordText = (w) => w.s.map((p) => p[0]).join('');
const isPunctuation = (w) => w.e < 0 && !w.f && PUNCTUATION.test(wordText(w));

// ---------- Speech ----------

let voicesReady = null;

function japaneseVoice() {
  if (!('speechSynthesis' in window)) return Promise.resolve(null);
  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const pick = () => speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('ja')) || null;
      const now = pick();
      if (now) { resolve(now); return; }
      let done = false;
      speechSynthesis.addEventListener('voiceschanged', () => { if (!done) { done = true; resolve(pick()); } });
      setTimeout(() => { if (!done) { done = true; resolve(pick()); } }, 1500);
    });
  }
  return voicesReady;
}

/** Says [text]; resolves true once it's been read out, false if it can't be. */
export async function speak(text, slow = false) {
  const voice = await japaneseVoice();
  if (!voice) return false;
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = slow ? 0.7 : 1.0;
    u.onend = () => resolve(true);
    u.onerror = (e) => resolve(e.error === 'interrupted' || e.error === 'canceled' ? true : false);
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function noVoice() {
  toast("No Japanese voice found. Add a Japanese text-to-speech voice in your device's settings (or try another browser), then reload the page.", 6000);
}

// ---------- Passage state ----------

const passages = new Map(); // key -> {sentences, dict, lesson, hooks}
const allFurigana = new Set();
const lookedUp = new Map(); // key -> Set of "s:i"
let speaking = null; // {key, run, index}
let speakRun = 0;
let popup = null;
let selected = null;

export function isSpeaking(key) { return speaking && speaking.key === key; }

function highlightSpoken() {
  document.querySelectorAll('.pw.spoken').forEach((el) => el.classList.remove('spoken'));
  if (!speaking) return;
  document.querySelectorAll(`[data-pk="${speaking.key}"][data-s="${speaking.index}"]`).forEach((el) => el.classList.add('spoken'));
}

function setSpeakButton(key, on) {
  const b = document.getElementById(`ra-${key}`);
  if (b) b.innerHTML = String(html`${icon(on ? 'pause' : 'speaker')} ${on ? 'Stop' : 'Read aloud'}`);
}

/** Reads a passage aloud a sentence at a time, highlighting each. */
async function readAloud(key, slow) {
  closePopup();
  if (speaking) {
    const was = speaking.key;
    stop();
    if (was === key) return;
  }
  const p = passages.get(key);
  if (!p) return;
  const run = ++speakRun;
  speaking = { key, run, index: 0 };
  setSpeakButton(key, true);
  let counted = false;
  for (let i = 0; i < p.sentences.length; i++) {
    if (!speaking || speaking.run !== run) return;
    speaking.index = i;
    highlightSpoken();
    const ok = await speak(p.sentences[i].t, slow);
    if (!ok) {
      if (i === 0 && speaking && speaking.run === run) noVoice();
      break;
    }
    if (!counted && speaking && speaking.run === run) {
      counted = true;
      if (p.hooks.onReadAloud) p.hooks.onReadAloud();
    }
  }
  if (speaking && speaking.run === run) {
    speaking = null;
    highlightSpoken();
    setSpeakButton(key, false);
  }
}

function stop() {
  const key = speaking && speaking.key;
  speakRun++;
  speaking = null;
  stopSpeaking();
  highlightSpoken();
  if (key) setSpeakButton(key, false);
}

/** Stops read-aloud and closes any popup, as when leaving a screen. */
export function resetPassages() {
  stop();
  closePopup();
}

// ---------- Popup ----------

function closePopup() {
  if (popup) popup.remove();
  popup = null;
  if (selected) selected.classList.remove('selected');
  selected = null;
}

function kanjiRow(dict, c, lesson) {
  const info = dict.kanji[c];
  const learned = !dict.isUnlearned(c, lesson);
  const readings = [info && info.on.length ? info.on.slice(0, 3).join('、') : '', info && info.kun.length ? info.kun.slice(0, 3).join('、') : '']
    .filter(Boolean).join(' · ');
  const tags = [info && info.lv ? info.lv : 'Not on the JLPT lists', info && info.ls != null ? `Writing lesson ${info.ls}` : '', learned ? 'learned' : 'not learned yet']
    .filter(Boolean).join(' · ');
  return html`<div class="row top" style="padding:4px 0">
    <span lang="ja" style="font-size:1.8rem;width:44px;flex:none;line-height:1.2">${c}</span>
    <span class="grow">
      <div>${info && info.m.length ? info.m.slice(0, 3).join(', ') : '(no meaning listed)'}</div>
      ${readings ? html`<div class="small" lang="ja">${readings}</div>` : ''}
      <div class="tiny" style="color:${learned ? 'var(--accent)' : 'var(--warn)'};font-weight:600">${tags}</div>
    </span>
  </div>`;
}

// ---------- Learner model ----------

let learnerHooks = null;

/**
 * Lets an app count word lookups and say what's already known about a word:
 * { onLookup(entry), note(entry) -> text }. See wordLookupHooks in learner.js.
 */
export function connectLearner(hooks) { learnerHooks = hooks; }

function openPopup(el) {
  const key = el.dataset.pk;
  const p = passages.get(key);
  if (!p) return;
  if (selected === el) { closePopup(); return; }
  closePopup();
  const si = Number(el.dataset.s);
  const wi = Number(el.dataset.i);
  const word = p.sentences[si].w[wi];
  const dict = p.dict;
  const entry = dict.entry(word.e);
  const text = wordText(word);
  selected = el;
  el.classList.add('selected');

  if (p.hooks.onLookup) p.hooks.onLookup();
  if (!lookedUp.has(key)) lookedUp.set(key, new Set());
  const seen = lookedUp.get(key);
  const before = seen.size;
  seen.add(`${si}:${wi}`);
  const total = p.sentences.reduce((n, s) => n + s.w.filter((w) => !isPunctuation(w) && wordText(w).trim()).length, 0);
  if (seen.size === total && before < total && p.hooks.onFullLookup) p.hooks.onFullLookup();

  const kanji = [...new Set([...text, ...(entry ? entry.w : '')].filter((c) => isKanji(c) && c !== '々'))];
  const pos = entry ? [...new Set(entry.p.map(posLabel))].join(', ') : '';
  const showDictionary = entry && (entry.w !== text || word.f);
  // What's known from before this lookup, then the lookup itself.
  const known = entry && learnerHooks ? learnerHooks.note(entry) : '';
  if (entry && learnerHooks) learnerHooks.onLookup(entry);
  const box = document.createElement('div');
  box.className = 'word-popup';
  box.setAttribute('role', 'dialog');
  box.innerHTML = String(html`
    <div class="row" style="align-items:flex-end">
      <span class="grow" style="font-size:1.5rem">${furigana(word.s)}</span>
      <button class="icon-btn" data-pop="say" title="Say it" aria-label="Say it">${icon('speaker')}</button>
      <button class="icon-btn" data-pop="close" title="Close" aria-label="Close">${icon('cross')}</button>
    </div>
    ${word.f === 'name' ? html`<p>A person's name</p>` : entry ? '' : html`<p class="muted">Not in the dictionary.</p>`}
    ${known ? html`<p class="small known-note" style="color:var(--accent);font-weight:600;margin-top:2px">${known}</p>` : ''}
    ${showDictionary ? html`<p lang="ja" style="margin-top:4px">Dictionary form: ${entry.w === entry.r ? entry.w : `${entry.w}【${entry.r}】`}</p>` : ''}
    ${word.f && word.f !== 'name' ? html`<p lang="ja" style="color:var(--accent);font-weight:600">${word.f}</p>` : ''}
    ${pos ? html`<p class="small">${pos}</p>` : ''}
    ${entry ? html`<div style="margin-top:6px">${entry.m.map((m, i) => html`<p style="margin-bottom:2px">${entry.m.length === 1 ? m : `${i + 1}. ${m}`}</p>`)}</div>` : ''}
    ${kanji.length ? html`<hr class="rule" style="margin:10px 0">${kanji.map((c) => kanjiRow(dict, c, p.lesson))}` : ''}`);
  document.body.appendChild(box);
  box.querySelector('[data-pop="say"]').addEventListener('click', async () => { if (!(await speak(text))) noVoice(); });
  box.querySelector('[data-pop="close"]').addEventListener('click', closePopup);

  // Below the word if there's room, otherwise above it.
  const r = el.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const width = Math.min(vw - 32, 400);
  box.style.width = `${width}px`;
  const left = Math.min(Math.max(16, r.left), Math.max(16, vw - 16 - width));
  box.style.left = `${left + window.scrollX}px`;
  const below = r.bottom < window.innerHeight * 0.55;
  const room = below ? window.innerHeight - r.bottom - 24 : r.top - 24;
  box.style.maxHeight = `${Math.max(160, Math.min(room, window.innerHeight * 0.55))}px`;
  if (below) box.style.top = `${r.bottom + 6 + window.scrollY}px`;
  else box.style.top = `${r.top - 6 + window.scrollY - box.offsetHeight}px`;
  if (!below && box.offsetHeight > r.top) box.style.top = `${window.scrollY + 12}px`;
  popup = box;
}

document.addEventListener('click', (ev) => {
  const word = ev.target.closest && ev.target.closest('.pw[data-pk]');
  if (word) { openPopup(word); return; }
  if (popup && !popup.contains(ev.target)) closePopup();
});

window.addEventListener('hashchange', resetPassages);

// ---------- Rendering ----------

/** One word, with furigana only on kanji not yet learned (or on all of them). */
function renderWord(key, si, wi, w, dict, lesson, all) {
  const text = wordText(w);
  if (text === ' ') return ' ';
  const pieces = [];
  for (const [t, r] of w.s) {
    const show = r && (all || [...t].some((c) => dict.isUnlearned(c, lesson)));
    const ruby = show ? r : '';
    const last = pieces[pieces.length - 1];
    if (ruby && last && last.ruby) { last.text += t; last.ruby += ruby; } else pieces.push({ text: t, ruby });
  }
  const inner = pieces.map((p) => (p.ruby ? `<ruby>${esc(p.text)}<rt>${esc(p.ruby)}</rt></ruby>` : esc(p.text))).join('');
  if (isPunctuation(w)) return `<span class="pw-p" data-pk="${key}x" data-s="${si}">${inner}</span>`;
  return `<span class="pw" data-pk="${key}" data-s="${si}" data-i="${wi}">${inner}</span>`;
}

/**
 * A passage. sentences: [{t, w: [{s, e, f}]}] (s = [text, reading] pairs, e =
 * entry index, f = form label); paragraphs: sentence counts per paragraph.
 * lesson: the Vibe Writing lesson whose kanji count as learned.
 * opts: { ui, scale, slow, setSlow, setScale, toolbar, hooks, lineMarks }
 */
export function renderPassage(key, { sentences, paragraphs, dict, lesson, ui, scale = 1, slow = false, setSlow, setScale, toolbar = true, toolbarExtra = '', hooks = {}, sentenceExtra, paragraphClass = '' }) {
  passages.set(key, { sentences, dict, lesson, hooks });
  const all = allFurigana.has(key);
  const paras = [];
  let si = 0;
  for (const count of paragraphs) {
    let out = '';
    for (let n = 0; n < count; n++, si++) {
      const s = sentences[si];
      const before = sentenceExtra ? sentenceExtra(si) : '';
      out += String(before) + s.w.map((w, wi) => renderWord(key, si, wi, w, dict, lesson, all)).join('');
    }
    paras.push(out);
  }
  if (ui) ui.after(highlightSpoken);
  const on = isSpeaking(key);
  return html`<div class="passage-wrap">
    ${toolbar ? html`<div class="wrap" style="align-items:center;gap:6px;margin-bottom:10px">
      ${toolbarExtra}
      ${hooks.noReadAloud ? '' : html`<button class="btn tonal small" id="ra-${key}" ${ui.onClick(() => readAloud(key, slow))}>${icon(on ? 'pause' : 'speaker')} ${on ? 'Stop' : 'Read aloud'}</button>
      <button class="chip ${slow ? 'on' : ''}" ${ui.onClick(() => setSlow(!slow))} aria-pressed="${slow}">Slow</button>`}
      <button class="chip ${all ? 'on' : ''}" ${ui.onClick(() => { if (all) allFurigana.delete(key); else allFurigana.add(key); ui.render(); })} aria-pressed="${all}">All furigana</button>
      ${setScale ? html`<button class="icon-btn" style="width:34px;height:34px;font-weight:700;font-size:.8rem" title="Smaller text" aria-label="Smaller text" ${scale <= 0.8 ? 'disabled' : ''} ${ui.onClick(() => setScale(scale - 0.1))}>A−</button>
      <button class="icon-btn" style="width:34px;height:34px;font-weight:700" title="Larger text" aria-label="Larger text" ${scale >= 1.6 ? 'disabled' : ''} ${ui.onClick(() => setScale(scale + 0.1))}>A+</button>` : ''}
    </div>` : ''}
    <div class="passage" lang="ja" data-key="${key}" style="--pscale:${scale}">
      ${raw(paras.map((p, i) => `<p data-para="${i}"${paragraphClass ? ` class="${paragraphClass}"` : ''}>${p}</p>`).join(''))}
    </div>
  </div>`;
}

export { readAloud, stop as stopReadAloud };
