// The landing page: theme, a progress line on each tile, and whole-site backups.

import { html, icon, initTheme, toggleTheme, currentTheme, toast, confirmDialog, dialog, slashDate } from './shared/srs/dom.js';
import { statGrid, barChart, legend, dayLabel } from './shared/srs/ui.js';
import { TABLES, exportDatabase, importDatabase } from './shared/srs/store.js';
import { dayKey, startOfDay } from './shared/srs/stats.js';
import { Learner, LEARNER_DB, exportLearner, importLearner } from './shared/learner.js';
import { placementOffered, markPlacementOffered } from './shared/placement.js';

const APPS = ['grammar', 'vocab', 'writing', 'conjugation', 'reading', 'listening'];
const GRAMMAR_PREFIX = 'grammarNotebook.';
const BACKUP_APP = 'vibe_web_all';

// ---------- Theme ----------

const toggle = document.getElementById('themeToggle');
function paintToggle() { toggle.innerHTML = String(icon(currentTheme() === 'dark' ? 'sun' : 'moon')); }
initTheme();
paintToggle();
toggle.addEventListener('click', () => { toggleTheme(); paintToggle(); });

// ---------- At a glance ----------

const NAMES = { grammar: 'Grammar', vocab: 'Vocabulary', writing: 'Writing', conjugation: 'Conjugation', reading: 'Reading', listening: 'Listening' };

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
      if (!stores.every((s) => db.objectStoreNames.contains(s))) { db.close(); resolve(null); return; }
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

/** One app's study history, boiled down for the landing page. */
async function appActivity(id, known) {
  const name = `vibe-${id}`;
  if (known && !known.has(name)) return null;
  const data = await readStores(name, ['srs_cards', 'deck_settings', 'review_log', 'quiz_answers', 'practice_log', 'app_settings']);
  if (!data) return null;
  const now = Date.now();
  const endOfDay = startOfDay(now, 1);
  const today = dayKey(now);

  // Cards due today, within each deck's daily limit, as the app counts them.
  const settings = Object.fromEntries(data.deck_settings.map((r) => [r.part_id, r]));
  const dueByPart = {};
  for (const r of data.srs_cards) {
    try {
      if (Date.parse(JSON.parse(r.data).due) < endOfDay) dueByPart[r.part_id] = (dueByPart[r.part_id] || 0) + 1;
    } catch (e) { /* skip a damaged card */ }
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

  // Study days, answers and minutes, by day.
  const days = new Set(data.review_log.map((r) => r.day));
  const minutesByDay = {};
  const answersByDay = {};
  for (const a of data.quiz_answers) {
    const k = dayKey(a.answered_at);
    days.add(k);
    answersByDay[k] = (answersByDay[k] || 0) + 1;
    minutesByDay[k] = (minutesByDay[k] || 0) + a.millis / 60000;
  }
  for (const p of data.practice_log) {
    const k = dayKey(p.logged_at);
    days.add(k);
    minutesByDay[k] = (minutesByDay[k] || 0) + p.seconds / 60;
  }
  const backup = data.app_settings.find((r) => r.key === 'last_backup');
  const lastBackup = backup ? parseInt(backup.value, 10) || null : null;
  return { learned: data.srs_cards.length, due, days, minutesByDay, answersByDay, lastBackup };
}

function readSummary(id) {
  try { return JSON.parse(localStorage.getItem(`vibe.summary.${id}`) || 'null'); } catch (e) { return null; }
}

function dayNumber(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

/** The current streak: a day studied in any app counts, and it holds until the end of today. */
function streak(days) {
  const numbers = new Set([...days].map(dayNumber));
  const today = dayNumber(dayKey(Date.now()));
  let day = numbers.has(today) ? today : today - 1;
  let n = 0;
  while (numbers.has(day)) { n++; day--; }
  return n;
}

function fmtMinutes(m) {
  const r = Math.round(m);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h ${r % 60}m`;
}

async function fillGlance() {
  try {
    const saved = JSON.parse(localStorage.getItem(`${GRAMMAR_PREFIX}saved`) || '[]');
    if (saved.length) document.querySelector('[data-stat="library"]').textContent = `${saved.length} saved grammar point${saved.length === 1 ? '' : 's'}`;
  } catch (e) { /* storage blocked */ }

  const known = await knownDatabases();
  const apps = {};
  for (const id of APPS) apps[id] = await appActivity(id, known);
  fillKnowledge(apps, known);

  // Each tile: course progress from the app's own summary, and cards due.
  for (const id of APPS) {
    const a = apps[id];
    const sum = readSummary(id);
    const el = document.querySelector(`[data-stat="${id}"]`);
    const started = (a && (a.learned > 0 || a.days.size > 0)) || (sum && sum.lessonsDone > 0);
    if (!started) { el.textContent = 'Not started yet'; el.style.opacity = '0.75'; continue; }
    el.style.opacity = '';
    const bits = [];
    if (sum) bits.push(`${sum.lessonsDone}/${sum.lessonsTotal} ${sum.noun}`);
    else bits.push(`${a.learned} learned`);
    if (a && a.due) bits.push(`${a.due} due today`);
    el.textContent = bits.join(' · ');
  }

  // The summary strip, once anything has been studied.
  const active = APPS.filter((id) => apps[id] && apps[id].days.size > 0);
  const summary = document.getElementById('summary');
  const activity = document.getElementById('activity');
  if (!active.length) { summary.hidden = true; activity.hidden = true; backupReminder(apps, new Set()); return apps; }

  const allDays = new Set(active.flatMap((id) => [...apps[id].days]));
  const today = dayKey(Date.now());
  const due = APPS.reduce((n, id) => n + (apps[id] ? apps[id].due : 0), 0);
  const answeredToday = APPS.reduce((n, id) => n + (apps[id] ? apps[id].answersByDay[today] || 0 : 0), 0);
  let week = 0;
  for (let i = 0; i < 7; i++) {
    const k = dayKey(startOfDay(Date.now(), -i));
    for (const id of active) week += apps[id].minutesByDay[k] || 0;
  }
  const s = streak(allDays);
  summary.innerHTML = String(html`
    ${statGrid([
      ['Day streak', `${s ? '🔥 ' : ''}${s}`],
      ['Due today', due],
      ['Answered today', answeredToday],
      ['Studied this week', fmtMinutes(week)],
    ])}
`);
  summary.hidden = false;
  backupReminder(apps, allDays);

  // Minutes per day, stacked by app.
  const series = [];
  for (let i = 13; i >= 0; i--) {
    const k = dayKey(startOfDay(Date.now(), -i));
    series.push({
      label: dayLabel(13 - i, 14),
      segments: APPS.map((id) => [Math.round((apps[id] ? apps[id].minutesByDay[k] || 0 : 0) * 10) / 10, `var(--app-${id})`]),
    });
  }
  const any = series.some((d) => d.segments.some(([v]) => v > 0));
  activity.hidden = !any;
  if (any) {
    const used = APPS.filter((id) => series.some((d) => d.segments[APPS.indexOf(id)][0] > 0));
    document.getElementById('activityChart').innerHTML = String(html`
      ${legend(used.map((id) => [`var(--app-${id})`, NAMES[id]]))}
      ${barChart(series.map((d) => ({ ...d, segments: d.segments.map(([v, c]) => [Math.round(v), c]) })))}`);
  }
  return apps;
}

// ---------- Placement test ----------

/**
 * Offers the placement test once, on a first visit: only when nothing has
 * been studied yet, so people already using the site never see it.
 */
async function offerPlacement(apps) {
  if (placementOffered()) return;
  markPlacementOffered();
  let saved = 0;
  try { saved = JSON.parse(localStorage.getItem(`${GRAMMAR_PREFIX}saved`) || '[]').length; } catch (e) { /* storage blocked */ }
  const started = saved > 0 || APPS.some((id) => {
    const a = apps && apps[id];
    const sum = readSummary(id);
    return (a && (a.learned > 0 || a.days.size > 0)) || (sum && sum.sectionsDone > 0);
  });
  if (started) return;
  const r = await dialog({
    title: 'Already know some Japanese?',
    body: html`<p class="muted">A short test finds your level in grammar, vocabulary and kanji, so the courses can skip what you already know. It takes 5 to 15 minutes, and you can stop any time.</p>
      <p class="muted" style="margin-top:8px">You can also take it later, from the link under the courses.</p>`,
    actions: [
      { label: 'Start from the beginning', value: false, kind: 'text' },
      { label: 'Take the test', value: true },
    ],
  });
  if (r && r.value) location.href = 'placement/index.html';
}

// ---------- What you know ----------

const KINDS = [['grammar', 'Grammar points'], ['word', 'Words'], ['kanji', 'Kanji'], ['kana', 'Kana'], ['form', 'Conjugation forms']];

/** The learner model's counts, and a note for apps whose progress isn't in it yet. */
async function fillKnowledge(apps, known) {
  const section = document.getElementById('knowledge');
  let summary = { byKind: {}, synced: [] };
  // Opening it would create it, so it's only read once an app has made it.
  if (!known || known.has(LEARNER_DB)) {
    try {
      const learner = await Learner.open();
      summary = learner.summary();
      learner.close();
    } catch (e) { /* not available */ }
  }
  const kinds = KINDS.filter(([k]) => summary.byKind[k]);
  // An app with progress that hasn't been opened since the learner model arrived.
  const missing = APPS.filter((id) => apps[id] && apps[id].learned + apps[id].days.size > 0 && !summary.synced.includes(id));
  if (!kinds.length && !missing.length) { section.hidden = true; return; }
  const num = (n) => html`<span class="k-num ${n ? '' : 'k-zero'}">${n}</span>`;
  document.getElementById('knowledgeBody').innerHTML = String(html`
    ${kinds.length ? html`<div class="k-table">
      <span class="k-head">&nbsp;</span><span class="k-head k-num">Known</span><span class="k-head k-num">Learning</span><span class="k-head k-num">Met</span>
      ${kinds.map(([k, label]) => {
        const c = summary.byKind[k];
        return html`<span>${label}</span>${num(c.known)}${num(c.learning)}${num(c.met)}`;
      })}
    </div>` : ''}
    ${missing.length ? html`<p class="small k-note">Open ${missing.map((id) => NAMES[id]).join(' and ')} once to add what you've studied there.</p>` : ''}`);
  section.hidden = false;
}

/**
 * How much this site's study data takes up: the app databases and the
 * grammar library's settings, measured as their saved contents. The browser's
 * own storage estimate covers the whole origin, which on GitHub Pages is
 * shared with every other project on the same account, so it isn't used.
 */
async function storageLine() {
  const el = document.getElementById('storageLine');
  try {
    const known = await knownDatabases();
    let bytes = 0;
    for (const id of APPS) {
      const name = `vibe-${id}`;
      if (known && !known.has(name)) continue;
      const tables = await exportDatabase(name);
      if (tables) bytes += new Blob([JSON.stringify(tables)]).size;
    }
    if (!known || known.has(LEARNER_DB)) bytes += new Blob([JSON.stringify(await exportLearner())]).size;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(GRAMMAR_PREFIX) || k.startsWith('vibe.summary.')) bytes += (k.length + (localStorage.getItem(k) || '').length) * 2;
      }
    } catch (e) { /* storage blocked */ }
    const size = bytes < 1024 * 100 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
    const persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false;
    el.textContent = `Your study data takes up about ${size} in this browser${persisted ? ", and the browser has agreed not to clear it to free space" : ''}.`;
  } catch (e) { /* not available */ }
}

// ---------- Backup reminder ----------

const SITE_BACKUP_KEY = 'vibe.lastBackup';
const SNOOZE_KEY = 'vibe.backupSnooze';
const DAY = 86400000;
/** A backup older than this is worth refreshing. */
const STALE_DAYS = 14;
/** Days of study before the first nudge, so a quick look around doesn't trigger it. */
const MIN_STUDY_DAYS = 3;

function readNumber(key) {
  try { return parseInt(localStorage.getItem(key) || '', 10) || null; } catch (e) { return null; }
}

function writeNumber(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (e) { /* storage blocked */ }
}

/**
 * Nudges towards a backup once there's real progress and nothing recent covers
 * it. An app is covered by a whole-site backup or by its own, whichever is newer.
 */
function backupReminder(apps, allDays) {
  const el = document.getElementById('backupReminder');
  const now = Date.now();
  const snoozed = (readNumber(SNOOZE_KEY) || 0) > now;
  const site = readNumber(SITE_BACKUP_KEY);
  const studied = APPS.filter((id) => apps[id] && (apps[id].learned > 0 || apps[id].days.size > 0));
  if (snoozed || allDays.size < MIN_STUDY_DAYS || !studied.length) { el.hidden = true; return; }
  const covered = studied.map((id) => [id, Math.max(site || 0, apps[id].lastBackup || 0) || null]);
  const never = covered.filter(([, t]) => t == null).map(([id]) => id);
  const oldest = covered.filter(([, t]) => t != null).reduce((m, [, t]) => Math.min(m, t), Infinity);
  const ageDays = oldest === Infinity ? null : Math.floor((now - oldest) / DAY);
  let message;
  if (never.length === studied.length) {
    message = "You haven't backed up your progress yet. It only lives in this browser, so save a copy now and then.";
  } else if (never.length) {
    message = `${never.map((id) => NAMES[id]).join(' and ')} ${never.length === 1 ? "hasn't" : "haven't"} been backed up yet.`;
  } else if (ageDays >= STALE_DAYS) {
    message = `Your last backup was ${ageDays} days ago. Save a fresh copy so recent progress is safe too.`;
  } else {
    el.hidden = true;
    return;
  }
  el.innerHTML = String(html`
    <span style="font-size:1.4rem" aria-hidden="true">💾</span>
    <span class="grow">${message}</span>
    <span class="actions">
      <button class="btn small" type="button" data-reminder="backup">Back up now</button>
      <button class="btn text small" type="button" data-reminder="later">Remind me later</button>
    </span>`);
  el.querySelector('[data-reminder="backup"]').addEventListener('click', () => backupAll());
  el.querySelector('[data-reminder="later"]').addEventListener('click', () => {
    writeNumber(SNOOZE_KEY, now + 7 * DAY);
    el.hidden = true;
  });
  el.hidden = false;
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
  // What you know across the apps. Most of it is rebuilt from the apps, but
  // word lookups are kept only there.
  const learner = !known || known.has(LEARNER_DB) ? await exportLearner() : null;
  const now = Date.now();
  const text = JSON.stringify({ app: BACKUP_APP, format: 1, savedAt: now, grammar, apps, learner });
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
  writeNumber(SITE_BACKUP_KEY, now);
  document.getElementById('backupReminder').hidden = true;
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
  const parts = [...names.map((n) => NAMES[n]), ...(Object.keys(backup.grammar || {}).length ? ['Grammar Library'] : [])];
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
      // Its saved summary is out of date until the app is next opened.
      try { localStorage.removeItem(`vibe.summary.${id}`); } catch (e) { /* storage blocked */ }
    }
    if (backup.learner && typeof backup.learner === 'object') await importLearner(backup.learner);
    for (const [k, v] of Object.entries(backup.grammar || {})) {
      if (k.startsWith(GRAMMAR_PREFIX) && typeof v === 'string') localStorage.setItem(k, v);
    }
  } catch (e) {
    toast("Couldn't restore everything from this backup. It may be damaged.");
    return;
  }
  toast('Backup restored.');
  // The restored progress is exactly what that file holds, so it's backed up as of then.
  writeNumber(SITE_BACKUP_KEY, backup.savedAt);
  initTheme();
  paintToggle();
  fillGlance();
}

document.getElementById('backupAll').addEventListener('click', backupAll);
document.getElementById('restoreAll').addEventListener('click', restoreAll);

fillGlance().then(offerPlacement).catch((e) => console.error(e));
storageLine();
