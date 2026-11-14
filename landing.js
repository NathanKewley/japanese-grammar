// The landing page: theme, a progress line on each tile, and whole-site backups.

import { icon, initTheme, toggleTheme, currentTheme, toast, confirmDialog, slashDate } from './shared/srs/dom.js';
import { TABLES, exportDatabase, importDatabase } from './shared/srs/store.js';
import { dayKey, startOfDay } from './shared/srs/stats.js';

const APPS = ['writing', 'conjugation', 'reading', 'listening'];
const GRAMMAR_PREFIX = 'grammarNotebook.';
const BACKUP_APP = 'vibe_web_all';

// ---------- Theme ----------

const toggle = document.getElementById('themeToggle');
function paintToggle() { toggle.innerHTML = String(icon(currentTheme() === 'dark' ? 'sun' : 'moon')); }
initTheme();
paintToggle();
toggle.addEventListener('click', () => { toggleTheme(); paintToggle(); });

// ---------- Tile stats ----------

async function knownDatabases() {
  if (!indexedDB.databases) return null;
  try { return new Set((await indexedDB.databases()).map((d) => d.name)); } catch (e) { return null; }
}

function readStores(name, stores) {
  return new Promise((resolve) => {
    const req = indexedDB.open(name);
    req.onerror = () => resolve(null);
    req.onsuccess = () => {
      const db = req.result;
      const present = stores.filter((s) => db.objectStoreNames.contains(s));
      if (present.length < stores.length) { db.close(); resolve(null); return; }
      const tx = db.transaction(stores, 'readonly');
      const out = {};
      for (const s of stores) {
        const r = tx.objectStore(s).getAll();
        r.onsuccess = () => { out[s] = r.result; };
      }
      tx.oncomplete = () => { db.close(); resolve(out); };
      tx.onerror = () => { db.close(); resolve(null); };
    };
  });
}

/** Cards learned, and cards due today within each deck's daily limit. */
async function appSummary(id, known) {
  const name = `vibe-${id}`;
  if (known && !known.has(name)) return null;
  const data = await readStores(name, ['srs_cards', 'deck_settings', 'review_log']);
  if (!data || !data.srs_cards.length) return null;
  const endOfDay = startOfDay(Date.now(), 1);
  const today = dayKey(Date.now());
  const settings = Object.fromEntries(data.deck_settings.map((r) => [r.part_id, r]));
  const dueByPart = {};
  for (const r of data.srs_cards) {
    try {
      if (Date.parse(JSON.parse(r.data).due) < endOfDay) dueByPart[r.part_id] = (dueByPart[r.part_id] || 0) + 1;
    } catch (e) { /* skip */ }
  }
  const reviewed = {};
  for (const r of data.review_log) if (r.day === today) (reviewed[r.part_id] ||= new Set()).add(r.card_id);
  let due = 0;
  for (const [part, n] of Object.entries(dueByPart)) {
    const s = settings[part];
    if (s && s.paused === 1) continue;
    const limit = s ? s.daily_limit : 20;
    due += Math.min(n, Math.max(0, limit - (reviewed[part] ? reviewed[part].size : 0)));
  }
  return { learned: data.srs_cards.length, due };
}

async function fillStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(`${GRAMMAR_PREFIX}saved`) || '[]');
    if (saved.length) document.querySelector('[data-stat="grammar"]').textContent = `${saved.length} saved grammar point${saved.length === 1 ? '' : 's'}`;
  } catch (e) { /* storage blocked */ }
  const known = await knownDatabases();
  for (const id of APPS) {
    const s = await appSummary(id, known);
    const el = document.querySelector(`[data-stat="${id}"]`);
    if (!s) { el.textContent = 'Not started yet'; el.style.opacity = '0.75'; continue; }
    el.textContent = `${s.learned} learned${s.due ? ` · ${s.due} due today` : ''}`;
  }
}

async function storageLine() {
  const el = document.getElementById('storageLine');
  if (!navigator.storage || !navigator.storage.estimate) return;
  try {
    const { usage } = await navigator.storage.estimate();
    const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const mb = (usage / 1048576).toFixed(usage > 10485760 ? 0 : 1);
    el.textContent = `This site is using about ${mb} MB of storage in this browser${persisted ? ', marked as persistent so the browser won\'t clear it to free space' : ''}.`;
  } catch (e) { /* not available */ }
}

// ---------- Whole-site backup ----------

async function backupAll() {
  const known = await knownDatabases();
  const apps = {};
  for (const id of APPS) {
    const name = `vibe-${id}`;
    if (known && !known.has(name)) continue;
    const tables = await exportDatabase(name);
    if (tables) apps[id] = tables;
  }
  const grammar = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(GRAMMAR_PREFIX)) grammar[k] = localStorage.getItem(k);
    }
  } catch (e) { /* storage blocked */ }
  const now = Date.now();
  const text = JSON.stringify({ app: BACKUP_APP, format: 1, savedAt: now, grammar, apps });
  const d = new Date(now);
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = `japanese-study-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  toast('Backup saved to your downloads.');
}

function pickFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => resolve(input.files[0] || null);
    input.click();
  });
}

async function restoreAll() {
  const file = await pickFile();
  if (!file) return;
  let backup;
  try {
    backup = JSON.parse(await file.text());
  } catch (e) {
    toast("This file isn't a backup from this site.");
    return;
  }
  if (!backup || backup.app !== BACKUP_APP || typeof backup.apps !== 'object') {
    toast(backup && typeof backup.app === 'string' && backup.app.startsWith('vibe_web_')
      ? "That's a backup of a single app. Restore it from that app's Settings tab."
      : "This file isn't a backup from this site.");
    return;
  }
  if (backup.format > 1) {
    toast('This backup came from a newer version of the site. Reload the page, then try again.');
    return;
  }
  const names = Object.keys(backup.apps).filter((id) => APPS.includes(id));
  const parts = [...names.map((n) => n[0].toUpperCase() + n.slice(1)), ...(Object.keys(backup.grammar || {}).length ? ['Grammar'] : [])];
  const ok = await confirmDialog(
    'Replace your progress?',
    `This backup is from ${slashDate(new Date(backup.savedAt))} and holds: ${parts.join(', ') || 'nothing'}. Restoring replaces the progress saved in this browser for those apps. Close any other tabs of this site first.`,
    'Replace and restore'
  );
  if (!ok) return;
  try {
    for (const id of names) {
      const tables = backup.apps[id];
      for (const t of Object.keys(TABLES)) if (tables[t] && !Array.isArray(tables[t])) throw new Error('damaged');
      await importDatabase(`vibe-${id}`, tables);
    }
    for (const [k, v] of Object.entries(backup.grammar || {})) {
      if (k.startsWith(GRAMMAR_PREFIX) && typeof v === 'string') localStorage.setItem(k, v);
    }
  } catch (e) {
    toast("Couldn't restore everything from this backup. It may be damaged.");
    return;
  }
  toast('Backup restored.');
  initTheme();
  paintToggle();
  fillStats();
}

document.getElementById('backupAll').addEventListener('click', backupAll);
document.getElementById('restoreAll').addEventListener('click', restoreAll);

fillStats();
storageLine();
