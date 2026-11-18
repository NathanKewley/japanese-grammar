// Local persistence in the browser's IndexedDB. Nothing here leaves the device.
//
// The tables mirror the Android apps' SQLite schema. Everything is read into
// memory when the app opens (it's small), so reads are synchronous; each write
// updates memory at once and is then saved to IndexedDB.

import { cardFromMap, cardToMap } from './fsrs.js';

export const TABLES = {
  section_progress: 'section_id',
  srs_cards: 'card_id',
  review_log: 'id',
  deck_settings: 'part_id',
  quiz_sessions: 'id',
  quiz_answers: 'id',
  app_settings: 'key',
  practice_log: 'id',
  quiz_progress: 'quiz_key',
};

const AUTO_ID = ['review_log', 'quiz_sessions', 'quiz_answers', 'practice_log'];

export const SCHEMA_VERSION = 1;

function openDb(name) {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB unavailable')); return; }
    const req = indexedDB.open(name, SCHEMA_VERSION);
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

export class Store {
  constructor(db) {
    this.db = db; // null when the browser won't give us storage
    this.t = {};
    this.nextId = {};
    this.chain = Promise.resolve();
    this.onError = null;
  }

  static async open(name) {
    let db = null;
    try { db = await openDb(name); } catch (e) { db = null; }
    const store = new Store(db);
    for (const table of Object.keys(TABLES)) {
      const rows = db ? await readAll(db, table) : [];
      store.t[table] = new Map(rows.map((r) => [r[TABLES[table]], r]));
      if (AUTO_ID.includes(table)) store.nextId[table] = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    }
    if (db && navigator.storage && navigator.storage.persist) {
      // Ask the browser not to clear this site's data under storage pressure.
      navigator.storage.persist().catch(() => {});
    }
    return store;
  }

  get persistent() { return this.db != null; }

  rows(table) { return Array.from(this.t[table].values()); }

  /** Applies [ops] to memory now, and to IndexedDB in one transaction. */
  write(ops) {
    for (const op of ops) {
      const map = this.t[op.table];
      if (op.clear) map.clear();
      else if (op.del !== undefined) map.delete(op.del);
      else map.set(op.put[TABLES[op.table]], op.put);
    }
    if (!this.db) return Promise.resolve();
    const tables = [...new Set(ops.map((o) => o.table))];
    this.chain = this.chain.then(
      () =>
        new Promise((resolve) => {
          let tx;
          try { tx = this.db.transaction(tables, 'readwrite'); } catch (e) { this.fail(e); resolve(); return; }
          for (const op of ops) {
            const s = tx.objectStore(op.table);
            if (op.clear) s.clear();
            else if (op.del !== undefined) s.delete(op.del);
            else s.put(op.put);
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => { this.fail(tx.error); resolve(); };
          tx.onabort = () => { this.fail(tx.error); resolve(); };
        })
    );
    return this.chain;
  }

  fail(error) {
    if (this.onError) this.onError(error);
    else console.error('Saving failed', error);
  }

  /** Resolves once every write so far has reached IndexedDB. */
  flush() { return this.chain; }

  newId(table) { return this.nextId[table]++; }

  // ---------- Backups ----------

  exportTables() {
    const out = {};
    for (const table of Object.keys(TABLES)) out[table] = this.rows(table);
    return out;
  }

  /** Replaces all learner data. Unknown columns are dropped. */
  replaceAllTables(tables) {
    const ops = [];
    for (const table of Object.keys(TABLES)) {
      ops.push({ table, clear: true });
      for (const row of tables[table] || []) {
        if (row && row[TABLES[table]] != null) ops.push({ table, put: { ...row } });
      }
    }
    const done = this.write(ops);
    for (const table of AUTO_ID) this.nextId[table] = this.rows(table).reduce((m, r) => Math.max(m, r.id), 0) + 1;
    return done;
  }

  // ---------- Settings ----------

  loadSetting(key) {
    const row = this.t.app_settings.get(key);
    return row ? row.value : null;
  }

  saveSetting(key, value) { return this.write([{ table: 'app_settings', put: { key, value: String(value) } }]); }
  deleteSetting(key) { return this.write([{ table: 'app_settings', del: key }]); }

  // ---------- Saved quizzes ----------

  loadSavedQuizzes() {
    return this.rows('quiz_progress').map((r) => ({ key: r.quiz_key, sessionId: r.session_id, savedAt: r.saved_at, data: r.data }));
  }

  saveQuiz(q) {
    return this.write([{ table: 'quiz_progress', put: { quiz_key: q.key, session_id: q.sessionId, saved_at: q.savedAt, data: q.data } }]);
  }

  deleteSavedQuiz(key) { return this.write([{ table: 'quiz_progress', del: key }]); }

  // ---------- Practice log ----------

  practiceEntries() {
    return this.rows('practice_log')
      .map((r) => ({ id: r.id, at: r.logged_at, seconds: r.seconds, note: r.note }))
      .sort((a, b) => b.at - a.at || b.id - a.id);
  }

  addPractice(at, seconds, note) {
    const id = this.newId('practice_log');
    return this.write([{ table: 'practice_log', put: { id, logged_at: at, seconds, note } }]);
  }

  deletePractice(id) { return this.write([{ table: 'practice_log', del: id }]); }

  // ---------- Quiz history ----------

  allAnswers() {
    return this.rows('quiz_answers').map((r) => ({
      cardId: r.card_id, round: r.round, correct: r.correct === 1, millis: r.millis, at: r.answered_at, given: r.given,
    }));
  }

  reviewDays() {
    const days = new Set();
    for (const r of this.t.review_log.values()) days.add(r.day);
    return days;
  }

  startSession({ kind, partId, sectionId, at }) {
    const id = this.newId('quiz_sessions');
    this.write([{ table: 'quiz_sessions', put: { id, kind, part_id: partId, section_id: sectionId ?? null, started_at: at, finished_at: null, item_count: null, first_try_correct: null, passed: null } }]);
    return id;
  }

  finishSession(id, { at, itemCount, firstTryCorrect, passed }) {
    const row = this.t.quiz_sessions.get(id);
    if (!row) return Promise.resolve();
    return this.write([{
      table: 'quiz_sessions',
      put: { ...row, finished_at: at, item_count: itemCount, first_try_correct: firstTryCorrect, passed: passed == null ? null : passed ? 1 : 0 },
    }]);
  }

  logAnswer({ sessionId, cardId, partId, round, correct, millis, given, at }) {
    const id = this.newId('quiz_answers');
    return this.write([{
      table: 'quiz_answers',
      put: { id, session_id: sessionId, card_id: cardId, part_id: partId, round, correct: correct ? 1 : 0, millis, given: given ?? null, answered_at: at },
    }]);
  }

  /** Finished lesson quizzes with at least [minItems] items, all right first time. */
  perfectSectionQuizzes(minItems = 10) {
    let n = 0;
    for (const s of this.t.quiz_sessions.values()) {
      if (s.section_id != null && s.finished_at != null && s.item_count >= minItems && s.first_try_correct === s.item_count) n++;
    }
    return n;
  }

  sectionAttempts(sectionId) {
    return this.rows('quiz_sessions')
      .filter((s) => s.section_id === sectionId && s.finished_at != null)
      .sort((a, b) => a.finished_at - b.finished_at)
      .map((s) => ({ firstTryCorrect: s.first_try_correct, itemCount: s.item_count }));
  }

  reviewsByDay(partId) {
    const out = {};
    for (const r of this.t.review_log.values()) {
      if (r.part_id !== partId) continue;
      const d = (out[r.day] ||= { correct: 0, total: 0 });
      d.total++;
      if (r.rating >= 3) d.correct++;
    }
    return out;
  }

  itemScores(partId) {
    const out = {};
    for (const a of this.t.quiz_answers.values()) {
      if (a.part_id !== partId) continue;
      const s = (out[a.card_id] ||= { correct: 0, total: 0 });
      s.total++;
      s.correct += a.correct;
    }
    return out;
  }

  /** A card's answers, newest first. */
  itemAnswers(cardId, limit = 50) {
    const out = [];
    for (const a of this.t.quiz_answers.values()) {
      if (a.card_id !== cardId) continue;
      const s = this.t.quiz_sessions.get(a.session_id);
      out.push({ id: a.id, correct: a.correct === 1, millis: a.millis, given: a.given, at: a.answered_at, round: a.round, kind: s ? s.kind : 'practice' });
    }
    out.sort((a, b) => b.at - a.at || b.id - a.id);
    return out.slice(0, limit);
  }

  // ---------- Sections and cards ----------

  loadProgress() {
    const passed = new Set();
    const early = new Set();
    for (const r of this.t.section_progress.values()) {
      if (r.passed_at != null) passed.add(r.section_id);
      if (r.early_unlocked_at != null) early.add(r.section_id);
    }
    return { passed, early };
  }

  /** Sections passed by the placement test and not studied since. */
  placedSections() {
    const out = new Set();
    for (const r of this.t.section_progress.values()) if (r.placed_at != null && r.passed_at != null) out.add(r.section_id);
    return out;
  }

  /** Passes [sectionIds] for the placement test, with no cards. */
  savePlacedSections(sectionIds, at) {
    return this.write(sectionIds.map((id) => {
      const row = this.t.section_progress.get(id) || { section_id: id, early_unlocked_at: null };
      return { table: 'section_progress', put: { ...row, passed_at: at, placed_at: at } };
    }));
  }

  /** Undoes savePlacedSections. */
  clearPlacedSections(sectionIds) {
    return this.write(sectionIds.map((id) => {
      const row = this.t.section_progress.get(id) || { section_id: id, early_unlocked_at: null };
      return { table: 'section_progress', put: { ...row, passed_at: null, placed_at: null } };
    }));
  }

  markEarlyUnlocked(sectionId, at) {
    const row = this.t.section_progress.get(sectionId) || { section_id: sectionId, passed_at: null };
    return this.write([{ table: 'section_progress', put: { ...row, early_unlocked_at: at } }]);
  }

  /** Records a passed section and its new cards as one change. A placed section is now properly passed. */
  savePassedSection(sectionId, at, cards) {
    const row = this.t.section_progress.get(sectionId) || { section_id: sectionId, early_unlocked_at: null };
    return this.write([
      { table: 'section_progress', put: { ...row, passed_at: at, placed_at: null } },
      ...cards.map((c) => ({ table: 'srs_cards', put: { card_id: c.cardId, part_id: c.partId, data: JSON.stringify(cardToMap(c.card)) } })),
    ]);
  }

  loadCards() {
    const out = [];
    for (const r of this.t.srs_cards.values()) {
      try {
        out.push({ cardId: r.card_id, partId: r.part_id, card: cardFromMap(JSON.parse(r.data)), markedKnown: r.marked_known ?? null });
      } catch (e) { /* skip damaged card */ }
    }
    return out;
  }

  /**
   * Saves cards marked as already known. The mark stays on the row until the
   * card's first review rewrites it.
   */
  saveMarkedKnown(cards) {
    return this.write(cards.map((c) => ({
      table: 'srs_cards',
      put: { card_id: c.cardId, part_id: c.partId, data: JSON.stringify(cardToMap(c.card)), marked_known: c.markedKnown },
    })));
  }

  deleteCards(ids) { return this.write(ids.map((id) => ({ table: 'srs_cards', del: id }))); }

  /** Saves a review result and its log entry as one change. */
  saveReview(stored, day, at, rating) {
    const id = this.newId('review_log');
    return this.write([
      { table: 'srs_cards', put: { card_id: stored.cardId, part_id: stored.partId, data: JSON.stringify(cardToMap(stored.card)) } },
      { table: 'review_log', put: { id, card_id: stored.cardId, part_id: stored.partId, day, reviewed_at: at, rating } },
    ]);
  }

  /** The cards reviewed in each part on [day]. */
  loadReviewedOn(day) {
    const out = {};
    for (const r of this.t.review_log.values()) {
      if (r.day === day) (out[r.part_id] ||= new Set()).add(r.card_id);
    }
    return out;
  }

  loadDeckSettings() {
    const out = {};
    for (const r of this.t.deck_settings.values()) out[r.part_id] = { paused: r.paused === 1, dailyLimit: r.daily_limit };
    return out;
  }

  saveDeckSettings(partId, s) {
    return this.write([{ table: 'deck_settings', put: { part_id: partId, paused: s.paused ? 1 : 0, daily_limit: s.dailyLimit } }]);
  }
}

/** Every table of one app's database, read straight from IndexedDB. */
export async function exportDatabase(name) {
  const known = await (indexedDB.databases ? indexedDB.databases() : Promise.resolve(null));
  if (known && !known.some((d) => d.name === name)) return null;
  const db = await openDb(name);
  const tables = {};
  for (const table of Object.keys(TABLES)) tables[table] = await readAll(db, table);
  db.close();
  return tables;
}

/** Replaces one app's whole database. */
export async function importDatabase(name, tables) {
  const db = await openDb(name);
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

/** Deletes one app's whole database. */
export function deleteDatabase(name) {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(name);
    req.onsuccess = req.onerror = req.onblocked = () => resolve();
  });
}
