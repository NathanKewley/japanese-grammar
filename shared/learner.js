// The learner model: one shared record of what you know, across every app.
//
// Each study app keeps its own database and its own review schedule, exactly
// as before. This is an index built from them, in a database of its own
// (vibe-learner), so the apps and the landing page can see the same picture:
// which words, kanji, kana and conjugation forms you've met, are learning, or
// know, and where from.
//
// An item is something you can know. Its id is the same in every app:
//   w:食べる|たべる   a word, by headword and reading (in hiragana)
//   k:食             a kanji
//   kana:た          a kana
//   f:te             a conjugation form
//
// A link ties an item to the app evidence for it: a review card ("card") or a
// passed lesson that used it ("seen"). Every app re-sends all its links
// whenever its progress changes (syncApp), so the index can't drift: restoring
// or resetting an app corrects it the next time that app opens. Lookups,
// tapping a word in Reading or Listening, are the one thing kept only here.
//
// Each app writes only its own links, so two open tabs can't overwrite each
// other's. Every row records when it last changed, ready for syncing between
// devices one day.

export const LEARNER_DB = 'vibe-learner';
const VERSION = 1;
const TABLES = { items: 'id', links: 'id', lookups: 'item_id', meta: 'key' };

/** A card counts as known once the scheduler expects you to remember it for this many days. */
export const KNOWN_DAYS = 21;

/** The FSRS state for a card in long-term review. */
const REVIEW_STATE = 2;

export const APP_NAMES = { vocab: 'Vocabulary', writing: 'Writing', conjugation: 'Conjugation', reading: 'Reading', listening: 'Listening' };

// ---------- Items ----------

const hiragana = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
export const isKanji = (c) => /[㐀-鿿]/.test(c);

export const wordItem = (surface, reading, meaning = '') => ({
  id: `w:${surface}|${hiragana(reading || surface)}`, kind: 'word', text: surface, reading: reading || surface, meaning,
});
export const kanjiItem = (char, meaning = '') => ({ id: `k:${char}`, kind: 'kanji', text: char, reading: '', meaning });
export const kanaItem = (char, romaji = '') => ({ id: `kana:${char}`, kind: 'kana', text: char, reading: romaji, meaning: '' });
export const formItem = (key, label) => ({ id: `f:${key}`, kind: 'form', text: label, reading: '', meaning: '' });

/** The kanji in [text], as items. [meaningOf] looks up a kanji's meaning, if known. */
export function kanjiItemsIn(text, meaningOf = () => '') {
  return [...new Set([...text].filter(isKanji))].map((c) => kanjiItem(c, meaningOf(c)));
}

// ---------- Storage ----------

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB unavailable')); return; }
    const req = indexedDB.open(LEARNER_DB, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const [table, key] of Object.entries(TABLES)) {
        if (!db.objectStoreNames.contains(table)) db.createObjectStore(table, { keyPath: key });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
}

function readAll(db, table) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(table, 'readonly').objectStore(table).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** The fields of a link that matter for comparing it with a fresh one. */
const LINK_FIELDS = ['item_id', 'app', 'ref', 'type', 'state', 'stability', 'due', 'last_review'];

export class Learner {
  constructor(db) {
    this.db = db; // null when the browser won't give us storage
    this.items = new Map();
    this.links = new Map();
    this.lookups = new Map();
    this.meta = new Map();
    this.byItem = null;
    this.chain = Promise.resolve();
  }

  static async open() {
    let db = null;
    try { db = await openDb(); } catch (e) { db = null; }
    const learner = new Learner(db);
    await learner.reload();
    return learner;
  }

  /** Reads everything again, to pick up what other tabs have written. */
  async reload() {
    if (!this.db) return;
    await this.chain;
    for (const [table, key] of Object.entries(TABLES)) {
      const rows = await readAll(this.db, table);
      this[table] = new Map(rows.map((r) => [r[key], r]));
    }
    this.byItem = null;
  }

  close() { if (this.db) this.db.close(); }

  /** Applies [ops] ({table, put} or {table, del}) to memory now and to IndexedDB in one transaction. */
  write(ops) {
    if (!ops.length) return this.chain;
    for (const op of ops) {
      if (op.del !== undefined) this[op.table].delete(op.del);
      else this[op.table].set(op.put[TABLES[op.table]], op.put);
    }
    this.byItem = null;
    if (!this.db) return Promise.resolve();
    const tables = [...new Set(ops.map((o) => o.table))];
    this.chain = this.chain.then(() => new Promise((resolve) => {
      let tx;
      try { tx = this.db.transaction(tables, 'readwrite'); } catch (e) { console.error('Learner save failed', e); resolve(); return; }
      for (const op of ops) {
        const s = tx.objectStore(op.table);
        if (op.del !== undefined) s.delete(op.del);
        else s.put(op.put);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = tx.onabort = () => { console.error('Learner save failed', tx.error); resolve(); };
    }));
    return this.chain;
  }

  /** New items, and missing details filled in on known ones. Details already there are kept. */
  itemOps(items, now) {
    const ops = [];
    for (const item of items) {
      const old = this.items.get(item.id);
      if (!old) {
        ops.push({ table: 'items', put: { ...item, updated_at: now } });
      } else if ((!old.meaning && item.meaning) || (!old.reading && item.reading)) {
        ops.push({ table: 'items', put: { ...old, meaning: old.meaning || item.meaning, reading: old.reading || item.reading, updated_at: now } });
      }
    }
    return ops;
  }

  /**
   * Replaces everything [app] says about what you know. [entries] are
   * {item, ref, type: 'card' | 'seen', card?}, where ref is the app's card or
   * section id and card its FSRS card ({state, stability, due, lastReview}).
   */
  syncApp(app, entries) {
    const now = Date.now();
    const items = new Map();
    const fresh = new Map();
    for (const e of entries) {
      items.set(e.item.id, e.item);
      const id = `${app}|${e.ref}|${e.item.id}`;
      if (fresh.has(id)) continue;
      const c = e.card;
      fresh.set(id, {
        id, item_id: e.item.id, app, ref: e.ref, type: e.type,
        state: c ? c.state : null,
        stability: c ? c.stability : null,
        due: c ? c.due : null,
        last_review: c ? c.lastReview ?? null : null,
      });
    }
    const ops = this.itemOps(items.values(), now);
    for (const row of this.links.values()) {
      if (row.app === app && !fresh.has(row.id)) ops.push({ table: 'links', del: row.id });
    }
    for (const [id, row] of fresh) {
      const old = this.links.get(id);
      if (!old || LINK_FIELDS.some((f) => old[f] !== row[f])) ops.push({ table: 'links', put: { ...row, updated_at: now } });
    }
    if (ops.length || !this.meta.has(`synced.${app}`)) ops.push({ table: 'meta', put: { key: `synced.${app}`, value: now } });
    return this.write(ops);
  }

  /** Counts a lookup of [item] in [app]. Safe with other tabs counting at the same time. */
  recordLookup(item, app) {
    const now = Date.now();
    const bump = (row) => {
      const r = row ? { ...row, apps: { ...row.apps } } : { item_id: item.id, count: 0, first_at: now, apps: {} };
      r.count++;
      r.apps[app] = (r.apps[app] || 0) + 1;
      r.last_at = now;
      r.updated_at = now;
      return r;
    };
    this.lookups.set(item.id, bump(this.lookups.get(item.id)));
    const itemOps = this.itemOps([item], now);
    for (const op of itemOps) this.items.set(op.put.id, op.put);
    this.byItem = null;
    if (!this.db) return Promise.resolve();
    this.chain = this.chain.then(() => new Promise((resolve) => {
      let tx;
      try { tx = this.db.transaction(['lookups', 'items'], 'readwrite'); } catch (e) { resolve(); return; }
      const store = tx.objectStore('lookups');
      // Counted from what's stored, so another tab's lookups aren't lost.
      const req = store.get(item.id);
      req.onsuccess = () => store.put(bump(req.result));
      for (const op of itemOps) tx.objectStore('items').put(op.put);
      tx.oncomplete = () => resolve();
      tx.onerror = tx.onabort = () => resolve();
    }));
    return this.chain;
  }

  linksOf(itemId) {
    if (!this.byItem) {
      this.byItem = new Map();
      for (const l of this.links.values()) {
        if (!this.byItem.has(l.item_id)) this.byItem.set(l.item_id, []);
        this.byItem.get(l.item_id).push(l);
      }
    }
    return this.byItem.get(itemId) || [];
  }

  /**
   * Where [itemId] stands: 'known', 'learning', 'met' or null (never come
   * across), with the apps it's studied in (cards), seen in, and its lookups.
   */
  status(itemId) {
    const links = this.linksOf(itemId);
    const cards = links.filter((l) => l.type === 'card');
    const lookups = this.lookups.get(itemId);
    const studiedIn = [...new Set(cards.map((l) => l.app))];
    const seenIn = [...new Set(links.filter((l) => l.type === 'seen').map((l) => l.app))];
    let status = null;
    if (cards.some((l) => l.state === REVIEW_STATE && l.stability >= KNOWN_DAYS)) status = 'known';
    else if (cards.length) status = 'learning';
    else if (seenIn.length || lookups) status = 'met';
    return { status, studiedIn, seenIn, lookups: lookups ? lookups.count : 0 };
  }

  /** Counts by kind ('word', 'kanji', 'kana', 'form') and status, plus which apps have synced. */
  summary() {
    const byKind = {};
    for (const item of this.items.values()) {
      const { status } = this.status(item.id);
      if (!status) continue;
      const k = (byKind[item.kind] ||= { known: 0, learning: 0, met: 0 });
      k[status]++;
    }
    const synced = Object.keys(APP_NAMES).filter((app) => this.meta.has(`synced.${app}`));
    return { byKind, synced };
  }

  // ---------- Backups ----------

  exportTables() {
    const out = {};
    for (const table of Object.keys(TABLES)) out[table] = [...this[table].values()];
    return out;
  }
}

/** Every table of the learner database, for a whole-site backup. */
export async function exportLearner() {
  const learner = await Learner.open();
  const tables = learner.exportTables();
  learner.close();
  return tables;
}

/** Replaces the learner database with a backup's copy. */
export async function importLearner(tables) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(Object.keys(TABLES), 'readwrite');
    for (const [table, key] of Object.entries(TABLES)) {
      const s = tx.objectStore(table);
      s.clear();
      for (const row of tables[table] || []) if (row && row[key] != null) s.put(row);
    }
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/** The dictionary words in passage [sentences] (each with tokens in .w), as items. */
export function passageWords(sentences, entries) {
  const out = new Map();
  for (const s of sentences) {
    for (const t of s.w || []) {
      const e = t.e >= 0 ? entries[t.e] : null;
      if (!e) continue;
      const item = wordItem(e.w, e.r, (e.m && e.m[0]) || '');
      if (!out.has(item.id)) out.set(item.id, item);
    }
  }
  return [...out.values()];
}

/** Hooks for passage.js's word popup: count lookups, and note what's known. */
export function wordLookupHooks(getLearner, app) {
  const item = (e) => wordItem(e.w, e.r, (e.m && e.m[0]) || '');
  return {
    note: (e) => { const l = getLearner(); return l ? describeWord(l, item(e), app) : ''; },
    onLookup: (e) => { const l = getLearner(); if (l) l.recordLookup(item(e), app); },
  };
}

/**
 * One line for a word popup or lesson: what you already know about this word
 * from the other apps (not [here]), or '' if they have nothing to add.
 */
export function describeWord(learner, item, here) {
  const links = learner.linksOf(item.id).filter((l) => l.app !== here);
  const names = (apps) => [...new Set(apps)].map((a) => APP_NAMES[a] || a).join(' and ');
  const cards = links.filter((l) => l.type === 'card');
  const known = cards.filter((l) => l.state === REVIEW_STATE && l.stability >= KNOWN_DAYS);
  if (known.length) return `You know this word from ${names(known.map((l) => l.app))}.`;
  if (cards.length) return `You're learning this word in ${names(cards.map((l) => l.app))}.`;
  const seen = links.filter((l) => l.type === 'seen').map((l) => l.app);
  const n = learner.status(item.id).lookups;
  const bits = [seen.length ? `Met in ${names(seen)}` : '', n ? `looked up ${n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`} before` : ''].filter(Boolean);
  if (!bits.length) return '';
  const line = bits.join(', ');
  return `${line[0].toUpperCase()}${line.slice(1)}.`;
}
