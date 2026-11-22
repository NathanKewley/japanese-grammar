// Stroke-order diagrams for Writing: kanji and kana drawn from KanjiVG's
// strokes on a notebook square, with numbered strokes, the parts a kanji is
// built from, an animated drawing and a larger view.
//
// strokes.json has each character's strokes in writing order, each a run of
// x, y points in KanjiVG's 109-unit box. parts.json has each kanji's parts
// (魚 is 𠂊 + 田 + 灬): their characters, strokes and names.

import { html, raw, icon } from '../shared/srs/dom.js';

const BOX = 109;
let STROKES = null;

let PARTS = null;

export function setStrokes(data) { STROKES = data; }
export function strokesOf(ch) { return (STROKES && STROKES[ch]) || []; }
export const strokesLoaded = () => STROKES != null;

export function setParts(data) { PARTS = data; }
/** A kanji's parts, in writing order: [{c, o, s, r}], or none. */
export function partsOf(ch) { return (PARTS && PARTS.kanji[ch]) || []; }
const partName = (c) => (PARTS && PARTS.names[c]) || '';

// ---------- Preferences ----------

/** Stroke numbers, and parts in colour, on or off. Kept in the app's settings. */
export const prefs = { numbers: true, parts: true };
let saveSetting = null;

export function initStrokePrefs(store) {
  prefs.numbers = store.loadSetting('stroke_numbers') !== '0';
  prefs.parts = store.loadSetting('stroke_parts') !== '0';
  saveSetting = (key, value) => store.saveSetting(key, value);
}

function setNumbers(on) {
  prefs.numbers = on;
  if (saveSetting) saveSetting('stroke_numbers', on ? '1' : '0');
}

function setPartsColour(on) {
  prefs.parts = on;
  if (saveSetting) saveSetting('stroke_parts', on ? '1' : '0');
}

/** For each stroke, the index of the part it belongs to (or -1). */
function partOfStroke(ch) {
  const out = [];
  partsOf(ch).forEach((p, i) => { for (const s of p.s) out[s] = p.c ? i : -1; });
  return out;
}

// ---------- Geometry ----------

function strokeLength(pts) {
  let n = 0;
  for (let j = 2; j + 1 < pts.length; j += 2) n += Math.hypot(pts[j] - pts[j - 2], pts[j + 1] - pts[j - 1]);
  return n;
}

// ---------- Drawing ----------

/** Milliseconds for each stroke and the pause after it, at the chosen speed. */
function timings(strokes) {
  const speed = 0.12; // units per millisecond
  const gap = 170;
  let at = 0;
  return strokes.map((pts) => {
    const dur = Math.max(180, strokeLength(pts) / speed);
    const t = { delay: Math.round(at), dur: Math.round(dur) };
    at += dur + gap;
    return t;
  });
}

/**
 * One character drawn from its strokes on a practice square, like the boxes in
 * a writing notebook. Strokes after [upTo] are left out and the stroke at
 * [upTo] is highlighted. With [numbered], each stroke's number shows (if
 * stroke numbers are on). Every diagram can be animated by drawStrokes().
 */
export function strokeDiagram(ch, size = 120, { upTo = null, numbered = true, viewer = false, focus = null, stepping = false } = {}) {
  const strokes = strokesOf(ch);
  // Each part in its own colour (when Parts is on); a part picked out from the
  // list is in colour with the rest faded. Stepping through the larger view
  // keeps the colours; the small step-by-step strip doesn't.
  const owner = upTo == null || stepping ? partOfStroke(ch) : [];
  const partClass = (i) => {
    const p = owner[i] ?? -1;
    if (focus != null) return p === focus ? ` part-${focus % 4}` : ' faded';
    return prefs.parts && p >= 0 ? ` part-${p % 4}` : '';
  };
  const shown = upTo ?? strokes.length;
  const unit = BOX / size; // viewBox units per pixel
  const times = timings(strokes);
  const parts = [];
  for (let i = 0; i < shown && i < strokes.length; i++) {
    const current = upTo != null && i === shown - 1;
    const pts = strokes[i];
    let d = '';
    for (let j = 0; j + 1 < pts.length; j += 2) d += `${j ? 'L' : 'M'}${pts[j]},${pts[j + 1]}`;
    const width = Math.max(2 * unit, BOX * (current ? 0.055 : 0.045));
    const t = `--delay:${times[i].delay}ms;--dur:${times[i].dur}ms`;
    parts.push(`<path class="ink${current ? ' current' : partClass(i)}" d="${d}" pathLength="1" stroke-width="${width.toFixed(2)}" style="${t}"/>`);
    if (current) parts.push(`<circle class="dot" cx="${pts[0]}" cy="${pts[1]}" r="${Math.max(2.5 * unit, BOX * 0.04).toFixed(2)}"/>`);
    // The pen, seen only while the stroke is being drawn.
    if (upTo == null) parts.push(`<circle class="pen" cx="${pts[0]}" cy="${pts[1]}" r="${Math.max(2.6 * unit, BOX * 0.035).toFixed(2)}" style="${t}"/>`);
  }
  // Stepping: the strokes still to come, faintly, so you can see where it's going.
  if (stepping) {
    for (let i = shown; i < strokes.length; i++) {
      const pts = strokes[i];
      let d = '';
      for (let j = 0; j + 1 < pts.length; j += 2) d += `${j ? 'L' : 'M'}${pts[j]},${pts[j + 1]}`;
      parts.push(`<path class="ink ghost" d="${d}" stroke-width="${Math.max(2 * unit, BOX * 0.045).toFixed(2)}"/>`);
    }
  }
  if (numbered && prefs.numbers && (upTo == null || stepping)) {
    const font = Math.max(9 * unit, BOX * 0.085);
    strokes.slice(0, shown).forEach((pts, i) => {
      const label = String(i + 1);
      const w = font * 0.6 * label.length;
      const x = Math.min(Math.max(pts[0] - 2 * unit, w), BOX);
      const y = Math.min(Math.max(pts[1], font), BOX);
      const t = `--delay:${times[i].delay}ms;--dur:${times[i].dur}ms`;
      parts.push(`<text class="n lbl" x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${font.toFixed(1)}" text-anchor="end" style="${t}">${label}</text>`);
    });
  }
  const label = `Stroke order for ${ch}`;
  return raw(`<svg class="stroke${viewer ? ' big' : ''}" data-char="${ch}" width="${size}" height="${size}" viewBox="0 0 ${BOX} ${BOX}" role="img" aria-label="${label}">
    <rect class="frame" x="0.5" y="0.5" width="${BOX - 1}" height="${BOX - 1}"/>
    <line class="guide" x1="0" y1="${BOX / 2}" x2="${BOX}" y2="${BOX / 2}"/>
    <line class="guide" x1="${BOX / 2}" y1="0" x2="${BOX / 2}" y2="${BOX}"/>
    ${parts.join('')}
  </svg>`);
}

/**
 * A diagram that opens the larger view when tapped. Any element with
 * data-viewer does, through one listener, so diagrams in quiz answers can too.
 */
export function tappableDiagram(ch, size, focus = null) {
  return html`<button class="stroke-open" type="button" data-viewer="${ch}" title="Show larger" aria-label="Show ${ch} larger">${strokeDiagram(ch, size, { focus })}<span class="stroke-caption" aria-hidden="true">${raw(EXPAND_ICON)} Enlarge</span></button>`;
}

/** Two arrows pointing out to the corners: "show larger". */
const EXPAND_ICON = '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

let viewerListening = false;
export function listenForViewer(onChange) {
  if (viewerListening) return;
  viewerListening = true;
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest && ev.target.closest('[data-viewer]');
    if (el && !el.closest('dialog')) openStrokeViewer(el.getAttribute('data-viewer'), onChange);
  });
}

/** Plays a diagram's drawing from the first stroke, restarting if it's already playing. */
export function drawStrokes(svg) {
  if (!svg) return;
  svg.classList.remove('drawing');
  void svg.getBoundingClientRect(); // so the animation starts again
  svg.classList.add('drawing');
}

/** The strokes of one character built up step by step. */
export function strokeSteps(ch, size = 52) {
  const n = strokesOf(ch).length;
  const out = [];
  for (let i = 1; i <= n; i++) out.push(strokeDiagram(ch, size, { upTo: i, numbered: false }));
  return html`<div class="wrap" style="gap:4px">${out}</div>`;
}

// ---------- Controls ----------

// ---------- Parts ----------

/**
 * A kanji's parts as chips: a colour swatch, the part, its name, and "radical"
 * on the one that's the radical. [attrs](i) gives each chip its tap action.
 */
function partChips(ch, focus, attrs) {
  const parts = partsOf(ch).filter((p) => p.c);
  if (!parts.length) return '';
  const all = partsOf(ch);
  return html`<div class="part-chips">${parts.map((p) => {
    const i = all.indexOf(p);
    const name = partName(p.c);
    const stands = p.o ? html` <span class="small" lang="ja">(${p.o})</span>` : '';
    return html`<button class="part-chip ${focus === i ? 'on' : ''}" type="button" aria-pressed="${focus === i}" title="Show its strokes" ${attrs(i)}>
      <span class="part-swatch part-${i % 4}" aria-hidden="true"></span>
      <span class="part-char" lang="ja">${p.c}</span>${stands}
      ${name ? html`<span class="part-name">${name}</span>` : ''}
      ${p.r ? html`<span class="part-radical">radical</span>` : ''}
    </button>`;
  })}</div>`;
}

/** The parts row for a kanji card. Tapping a part picks out its strokes in the diagram. */
export function partsRow(ui, ch) {
  const focus = (ui.partFocus ||= new Map()).get(ch) ?? null;
  return partChips(ch, focus, (i) => ui.onClick(() => {
    if (focus === i) ui.partFocus.delete(ch);
    else ui.partFocus.set(ch, i);
    ui.render();
  }));
}

/** The part picked out on a kanji card, if any. */
export const focusedPart = (ui, ch) => (ui.partFocus && ui.partFocus.has(ch) ? ui.partFocus.get(ch) : null);

// ---------- Controls ----------

/**
 * Play, Numbers and Parts, for the diagram in the same [scope]
 * (the nearest element matching it). [rerender] redraws after a setting changes.
 */
export function strokeControls(ui, { scope = '.kanji-card', rerender } = {}) {
  const redraw = rerender || (() => ui.render());
  const play = (ev, el) => drawStrokes(el.closest(scope).querySelector('svg.stroke[data-char]'));
  return html`<div class="stroke-controls">
    <button class="chip" type="button" ${ui.onClick(play)}>${icon('play')} Play</button>
    <button class="chip ${prefs.numbers ? 'on' : ''}" type="button" aria-pressed="${prefs.numbers}" title="Show stroke numbers" ${ui.onClick(() => { setNumbers(!prefs.numbers); redraw(); })}>Numbers</button>
    <button class="chip ${prefs.parts ? 'on' : ''}" type="button" aria-pressed="${prefs.parts}" title="Colour the parts the kanji is made of" ${ui.onClick(() => { setPartsColour(!prefs.parts); redraw(); })}>Parts</button>
  </div>`;
}

/** Just the numbers switch, for a set of kana. */
export function numbersToggle(ui) {
  return html`<button class="chip ${prefs.numbers ? 'on' : ''}" type="button" aria-pressed="${prefs.numbers}" title="Show stroke numbers" ${ui.onClick(() => { setNumbers(!prefs.numbers); ui.render(); })}>Numbers</button>`;
}

// ---------- Larger view ----------

/**
 * The diagram large, in its own window, with the same controls. Tapping a
 * lesson's diagram opens it, already drawn. [onChange] runs after a setting changes, so the
 * page behind can redraw too.
 */
export function openStrokeViewer(ch, onChange) {
  const d = document.createElement('dialog');
  d.className = 'modal stroke-viewer';
  // The whole width of a phone, up to a comfortable size on a big screen.
  const size = Math.min(600, window.innerWidth - 48, window.innerHeight - 260);
  let focus = null;
  // The stroke being stepped to, or null for the whole kanji.
  let step = null;
  const total = strokesOf(ch).length;
  const paint = () => {
    d.innerHTML = String(html`<div class="stroke-viewer-body">
      <div class="row"><div class="h2 grow" lang="ja">${ch}</div>
        <button class="icon-btn" type="button" data-close aria-label="Close" title="Close">${icon('cross')}</button></div>
      <div class="stroke-viewer-art">${strokeDiagram(ch, size, { viewer: true, focus: prefs.parts && step == null ? focus : null, upTo: step, stepping: step != null })}</div>
      <div class="stroke-controls">
        <button class="chip" type="button" data-play>${icon('play')} Play</button>
        <button class="chip" type="button" data-prev ${step === 1 ? 'disabled' : ''} title="Previous stroke">${icon('back')} Previous</button>
        <button class="chip" type="button" data-next title="Next stroke">Next ${icon('chevron')}</button>
        <span class="small stroke-count">${step == null ? `${total} strokes` : `Stroke ${step} of ${total}`}</span>
      </div>
      <div class="stroke-controls">
        <button class="chip ${prefs.numbers ? 'on' : ''}" type="button" data-numbers aria-pressed="${prefs.numbers}" title="Show stroke numbers">Numbers</button>
        ${partsOf(ch).some((p) => p.c) ? html`<button class="chip ${prefs.parts ? 'on' : ''}" type="button" data-parts aria-pressed="${prefs.parts}" title="Colour the parts the kanji is made of">Parts</button>` : ''}
      </div>
      ${prefs.parts ? partChips(ch, focus, (i) => raw(`data-part="${i}"`)) : ''}
    </div>`);
  };
  paint();
  d.addEventListener('click', (ev) => {
    const el = ev.target.closest('button');
    if (ev.target === d || (el && el.hasAttribute('data-close'))) { d.close(); return; }
    if (!el) return;
    if (el.hasAttribute('data-play')) {
      if (step != null) { step = null; paint(); }
      drawStrokes(d.querySelector('svg.stroke'));
    } else if (el.hasAttribute('data-next')) {
      // From the whole kanji, start at the first stroke; after the last, show it whole again.
      step = step == null ? 1 : step < total ? step + 1 : null;
      paint();
    } else if (el.hasAttribute('data-prev')) {
      step = step == null ? Math.max(1, total - 1) : Math.max(1, step - 1);
      paint();
    } else if (el.hasAttribute('data-part')) {
      const i = Number(el.getAttribute('data-part'));
      focus = focus === i ? null : i;
      paint();
    } else if (el.hasAttribute('data-numbers') || el.hasAttribute('data-parts')) {
      if (el.hasAttribute('data-numbers')) setNumbers(!prefs.numbers);
      else setPartsColour(!prefs.parts);
      paint();
      if (onChange) onChange();
    }
  });
  d.addEventListener('close', () => d.remove());
  document.body.appendChild(d);
  // It opens already drawn; Play animates it.
  d.showModal();
}
