// Small DOM helpers: escaped HTML templates, icons, dialogs, toasts and theme.

class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

export function raw(s) { return new Raw(String(s)); }

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function piece(v) {
  if (v == null || v === false || v === true) return '';
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(piece).join('');
  return esc(v);
}

/** Tagged template: interpolated values are escaped unless made with raw() or html``. */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += piece(values[i]) + strings[i + 1];
  return new Raw(out);
}

/** `**bold**` paragraphs, as the lesson text uses. */
export function richText(text) {
  return raw(
    text
      .split('**')
      .map((p, i) => (i % 2 ? `<strong>${esc(p)}</strong>` : esc(p)))
      .join('')
  );
}

/**
 * Text with furigana over its kanji. [segments] are [text, reading] pairs, with
 * '' for kana. Neighbouring kanji with readings join, so 勉強 sits under
 * べんきょう without a gap. Pieces at [emphasise] are drawn in the accent colour.
 */
export function furigana(segments, emphasise = new Set()) {
  const pieces = [];
  segments.forEach(([text, ruby], i) => {
    const em = emphasise.has(i);
    const last = pieces[pieces.length - 1];
    if (last && ruby && last.ruby && last.em === em) {
      last.text += text;
      last.ruby += ruby;
    } else pieces.push({ text, ruby, em });
  });
  return raw(
    `<span lang="ja">${pieces
      .map((p) => {
        const inner = p.ruby ? `<ruby>${esc(p.text)}<rt>${esc(p.ruby)}</rt></ruby>` : esc(p.text);
        return p.em ? `<span class="emph">${inner}</span>` : inner;
      })
      .join('')}</span>`
  );
}

export const segText = (segments) => segments.map((s) => s[0]).join('');
export const segReading = (segments) => segments.map((s) => s[1] || s[0]).join('');

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : (many || one + 's')}`;
}

// ---------- Icons (stroke icons, 24px grid) ----------

const ICONS = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cross: '<path d="M6 6l12 12M18 6L6 18"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  crossCircle: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  warn: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  replay: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
};

export function icon(name) {
  return raw(`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`);
}

// ---------- Theme (shared with the grammar library) ----------

const THEME_KEY = 'grammarNotebook.theme';

export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* storage blocked */ }
  const theme = saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
}

export function toggleTheme() {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

// ---------- Toasts ----------

let toastHost = null;

export function toast(message, ms = 3500) {
  if (!toastHost) {
    toastHost = document.createElement('div');
    toastHost.className = 'toast-host';
    toastHost.setAttribute('role', 'status');
    document.body.appendChild(toastHost);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastHost.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

// ---------- Dialogs ----------

/**
 * Shows a modal. `body` is HTML; `actions` are [{label, value, kind}].
 * Resolves with the chosen value and the form's fields, or null if dismissed.
 */
export function dialog({ title, body = '', actions, onInput }) {
  return new Promise((resolve) => {
    const d = document.createElement('dialog');
    d.className = 'modal';
    d.innerHTML = String(html`
      <form method="dialog">
        <div class="h2">${title}</div>
        <div>${raw(String(body))}</div>
        <div class="actions">
          ${actions.map((a, i) => html`<button class="btn ${a.kind || ''}" value="${i}" ${a.disabled ? 'disabled' : ''}>${a.label}</button>`)}
        </div>
      </form>`);
    document.body.appendChild(d);
    const form = d.querySelector('form');
    if (onInput) {
      const update = () => onInput(form, d);
      form.addEventListener('input', update);
      update();
    }
    d.addEventListener('close', () => {
      const i = d.returnValue === '' ? -1 : Number(d.returnValue);
      const fields = {};
      for (const el of form.querySelectorAll('input,textarea,select')) if (el.name) fields[el.name] = el.value;
      d.remove();
      resolve(i >= 0 ? { value: actions[i].value, fields } : null);
    });
    d.showModal();
    const focus = d.querySelector('[autofocus]');
    if (focus) focus.focus();
  });
}

export async function confirmDialog(title, message, okLabel, cancelLabel = 'Cancel') {
  const r = await dialog({
    title,
    body: html`<p class="muted">${message}</p>`,
    actions: [
      { label: cancelLabel, value: false, kind: 'text' },
      { label: okLabel, value: true },
    ],
  });
  return !!(r && r.value);
}

// ---------- Dates ----------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(d) { return `${d.getDate()} ${MONTHS[d.getMonth()]}`; }
export function longDate(d) { return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; }
export function slashDate(d) { return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; }

export function formatSeconds(ms) { return `${(ms / 1000).toFixed(1)}s`; }

export function formatLong(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`;
}

export function formatMinutes(seconds) {
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
