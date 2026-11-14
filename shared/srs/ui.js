// The app shell: a hash router, delegated event handling, and chart helpers
// shared by every screen.

import { html, raw, icon, esc, initTheme, toggleTheme, currentTheme, toast } from './dom.js';

export class Ui {
  constructor(app) {
    this.app = app;
    this.actions = new Map();
    this.nextAction = 0;
    this.screen = null;
    this.hash = null;
    this.stack = [];
    this.pendingQuizzes = new Map();
    this.quizCounter = 0;
    this.afterRender = [];
  }

  // ---------- Actions ----------

  /** Registers a handler and returns the attribute that triggers it. */
  act(fn, kind = 'act') {
    const id = `a${this.nextAction++}`;
    this.actions.set(id, fn);
    return raw(`data-${kind}="${id}"`);
  }

  onClick(fn) { return this.act(fn, 'act'); }
  onChange(fn) { return this.act(fn, 'change'); }
  onSubmit(fn) { return this.act(fn, 'submit'); }

  /** A link-like action that navigates to [hash]. */
  link(hash) { return this.act(() => this.go(hash)); }

  bindEvents(root) {
    const run = (attr) => (ev) => {
      const el = ev.target.closest(`[data-${attr}]`);
      if (!el || !root.contains(el)) return;
      const fn = this.actions.get(el.getAttribute(`data-${attr}`));
      if (!fn) return;
      if (attr === 'submit' || el.tagName === 'A') ev.preventDefault();
      fn(ev, el);
    };
    root.addEventListener('click', run('act'));
    root.addEventListener('change', run('change'));
    root.addEventListener('submit', run('submit'));
  }

  // ---------- Navigation ----------

  go(hash) {
    if (!hash.startsWith('#')) hash = `#/${hash}`;
    if (location.hash === hash) this.route(true);
    else location.hash = hash;
  }

  /** Replaces the current screen in history. */
  replace(hash) {
    if (!hash.startsWith('#')) hash = `#/${hash}`;
    this.stack.pop();
    location.replace(hash);
  }

  back() {
    if (this.stack.length > 1) history.back();
    else this.go('#/');
  }

  /** Goes back one screen, then replaces that screen with [hash]. */
  backThenReplace(hash) {
    if (this.stack.length > 1) {
      const target = hash.startsWith('#') ? hash : `#/${hash}`;
      const onPop = () => {
        window.removeEventListener('hashchange', onPop);
        setTimeout(() => this.replace(target), 0);
      };
      window.addEventListener('hashchange', onPop);
      history.back();
    } else this.replace(hash);
  }

  /** Opens a quiz built from [config] (an extra review or a daily task). */
  startQuiz(config) {
    const n = ++this.quizCounter;
    this.pendingQuizzes.set(String(n), config);
    this.go(`#/quiz/x/${n}`);
  }

  route(force = false) {
    const hash = location.hash || '#/';
    if (!force && hash === this.hash && this.screen) return;
    // Track the in-app back stack, so Back can leave the app only from its first screen.
    if (this.stack[this.stack.length - 2] === hash) this.stack.pop();
    else if (this.stack[this.stack.length - 1] !== hash) this.stack.push(hash);
    if (this.screen && this.screen.onLeave) this.screen.onLeave();
    this.hash = hash;
    const [path, query] = hash.slice(2).split('?');
    const params = new URLSearchParams(query || '');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    this.screen = this.app.resolve(parts, params) || this.app.resolve([], params);
    this.render();
    window.scrollTo(0, 0);
  }

  // ---------- Rendering ----------

  render() {
    const screen = this.screen;
    if (!screen) return;
    this.actions.clear();
    this.afterRender = [];
    const app = this.app;
    const tabs = screen.tab
      ? html`<nav class="tabs" aria-label="Sections">
          ${app.tabs().map((t) => html`<a href="#/${t.id}" class="${t.id === screen.tab ? 'active' : ''}">${t.label}</a>`)}
        </nav>`
      : '';
    const left = screen.tab
      ? html`<a class="icon-btn" href="../index.html" title="All study apps" aria-label="All study apps">${icon('home')}</a>`
      : html`<button class="icon-btn" ${this.onClick(() => this.back())} title="Back" aria-label="Back">${icon('back')}</button>`;
    const title = screen.title || app.title;
    const body = screen.render(this);
    this.header.innerHTML = String(html`
      <div class="appbar-row">
        ${left}
        <div class="appbar-title">${title}${screen.subtitle ? html`<small>${screen.subtitle}</small>` : ''}</div>
        <button class="icon-btn" ${this.onClick(() => { toggleTheme(); this.render(); })} title="Toggle dark mode" aria-label="Toggle dark mode">
          ${icon(currentTheme() === 'dark' ? 'sun' : 'moon')}
        </button>
      </div>
      ${tabs}`);
    this.view.innerHTML = String(body);
    document.title = screen.tab || !screen.title ? app.title : `${screen.title} · ${app.title}`;
    for (const fn of this.afterRender) fn();
    const focus = this.view.querySelector('[data-autofocus]');
    if (focus && document.activeElement !== focus) focus.focus({ preventScroll: true });
  }

  /** Runs [fn] after the current render reaches the page. */
  after(fn) { this.afterRender.push(fn); }

  mount(root) {
    initTheme();
    root.innerHTML = '<header class="appbar"></header><main class="view"></main>';
    this.header = root.querySelector('.appbar');
    this.view = root.querySelector('.view');
    this.bindEvents(root);
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }

  toast(message) { toast(message); }
}

// ---------- Charts and stat blocks ----------

export const GOOD = 'var(--good)';
export const BAD = 'var(--bad)';
export const ACCENT = 'var(--accent)';

export function statGrid(pairs) {
  return html`<div class="stat-grid">${pairs.map(([k, v]) => html`<div class="stat"><div class="v">${v}</div><div class="k">${k}</div></div>`)}</div>`;
}

export function statSection(title, body, note) {
  return html`<section>
    <h3 class="h3 section-title">${title}</h3>
    ${note ? html`<p class="small section-note">${note}</p>` : html`<div style="height:8px"></div>`}
    ${body}
  </section>`;
}

/** A labelled horizontal bar. [tap] is an action attribute from ui.onClick. */
export function barRow({ label, fraction, value, color, tap, ja = false }) {
  const pct = Math.max(0, Math.min(1, fraction || 0)) * 100;
  return html`<div class="bar-row ${tap ? 'tappable' : ''}" ${tap || ''}>
    <div class="bar-label" ${ja ? raw('lang="ja"') : ''}>${label}</div>
    <div class="bar-value">${value}</div>
    <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;${color ? `background:${color}` : ''}"></div></div>
  </div>`;
}

/** Vertical bars. data: [{ label, segments: [[value, color]] }]. */
export function barChart(data, { suffix = '' } = {}) {
  const totals = data.map((d) => d.segments.reduce((s, [v]) => s + v, 0));
  const max = Math.max(1, ...totals);
  return html`<div>
    <div class="chart">
      ${data.map((d, i) => html`<div class="chart-col" title="${totals[i]}${suffix}">
        ${totals[i] > 0 ? html`<div class="num">${fmtNum(totals[i])}${suffix}</div>` : ''}
        ${d.segments.slice().reverse().map(([v, c]) => (v > 0 ? html`<div class="seg" style="height:${((v / max) * 100).toFixed(1)}%;background:${c}"></div>` : ''))}
      </div>`)}
    </div>
    <div class="chart-axis">${data.map((d) => html`<span>${d.label || ''}</span>`)}</div>
  </div>`;
}

function fmtNum(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export function legend(items) {
  return html`<div class="legend">${items.map(([c, l]) => html`<span><i style="background:${c}"></i>${l}</span>`)}</div>`;
}

export function progressBar(fraction) {
  return html`<div class="progress"><div style="width:${(Math.max(0, Math.min(1, fraction)) * 100).toFixed(1)}%"></div></div>`;
}

/** Every third day back from today, so the axis stays readable. */
export function dayLabel(index, count) {
  const back = count - 1 - index;
  if (back === 0) return 'Today';
  return back % 3 === 0 ? `-${back}` : null;
}

export function aheadLabel(i) {
  return i === 0 ? 'Today' : i % 3 === 0 ? `+${i}` : null;
}

export function switchRow(title, subtitle, checked, change) {
  return html`<label class="switch-row">
    <span class="grow"><span style="font-weight:600">${title}</span>${subtitle ? html`<br><span class="small">${subtitle}</span>` : ''}</span>
    <span class="switch"><input type="checkbox" ${checked ? 'checked' : ''} ${change}><span class="track"></span></span>
  </label>`;
}

export { esc };
