// Holds progress in memory and writes every change through to the store.
// Each app extends SrsModel with its own features.

import { Scheduler, Rating, newCard, cardFromMap } from './fsrs.js';
import { SCHEMA_VERSION } from './store.js';
import { StudyStats, dayKey, startOfDay } from './stats.js';

export const SectionStatus = { locked: 'locked', available: 'available', passed: 'passed' };

export class BackupError extends Error {}

export const MIN_DAILY_LIMIT = 5;
export const MAX_DAILY_LIMIT = 100;

const DAY = 86400000;

/** Days until the first check of an item marked as already known. */
export const KNOWN_FIRST_REVIEW_DAYS = 30;

function dayNumber(t) {
  const d = new Date(t);
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
}

export class SrsModel {
  /**
   * config: {
   *   appName,       e.g. 'Vibe Writing'
   *   backupApp,     the id written into backup files
   *   passMark,      share right first time needed to pass a section
   *   statsOptions,  passed to StudyStats
   * }
   */
  constructor(store, course, config) {
    this.store = store;
    this.course = course;
    this.config = config;
    this.passMark = config.passMark ?? 0.8;
    // Quiz sections are the first exposure, so there's no need for same-day
    // learning steps. Missed cards are repeated within the session instead.
    this.scheduler = new Scheduler({ learningSteps: [], relearningSteps: [] });
    this.listeners = new Set();
    this.unlocked = {};
    this.lastFacts = null;
    this._achievements = null;
  }

  now() { return Date.now(); }

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  notify() { for (const fn of this.listeners) fn(); }

  // ---------- Loading ----------

  load() {
    const s = this.store;
    this.passed = new Set();
    this.early = new Set();
    this.cards = new Map();
    this.settings = {};
    this.savedQuizzes = new Map();
    this.reviewedDay = '';
    this.reviewedToday = {};
    this.timerStarted = parseMillis(s.loadSetting('practice_timer_started'));
    const unlocked = s.loadSetting('achievements');
    this.unlocked = unlocked ? JSON.parse(unlocked) : {};
    this.lastBackup = parseMillis(s.loadSetting('last_backup'));
    const today = dayKey(this.now());
    for (const quiz of s.loadSavedQuizzes()) {
      // A review's remaining cards are simply still due, so a review from an
      // earlier day is replaced by that day's fresh queue.
      if (quiz.key.startsWith('review:') && dayKey(quiz.savedAt) !== today) s.deleteSavedQuiz(quiz.key);
      else this.savedQuizzes.set(quiz.key, quiz);
    }
    const progress = s.loadProgress();
    this.passed = progress.passed;
    this.early = progress.early;
    for (const c of s.loadCards()) this.cards.set(c.cardId, c);
    this.settings = s.loadDeckSettings();
    this.refreshDay();
    this.loadExtras();
  }

  /** For subclasses: read their own settings. */
  loadExtras() {}

  /** Picks up a new day if the page stayed open past midnight. */
  refresh() {
    this.refreshDay();
    this.notify();
  }

  refreshDay() {
    const today = dayKey(this.now());
    if (today === this.reviewedDay) return;
    this.reviewedToday = this.store.loadReviewedOn(today);
    this.reviewedDay = today;
  }

  // ---------- Backups ----------

  exportBackup() {
    return JSON.stringify({
      app: this.config.backupApp,
      format: 1,
      schema: SCHEMA_VERSION,
      savedAt: this.now(),
      tables: this.store.exportTables(),
    });
  }

  async markBackedUp() {
    const now = this.now();
    await this.store.saveSetting('last_backup', now);
    this.lastBackup = now;
    this.notify();
  }

  /** Checks a backup file without changing anything. */
  readBackup(text) {
    const notBackup = `This file isn't a ${this.config.appName} backup.`;
    let decoded;
    try { decoded = JSON.parse(text); } catch (e) { throw new BackupError(notBackup); }
    if (!decoded || typeof decoded !== 'object' || decoded.app !== this.config.backupApp) throw new BackupError(notBackup);
    if (typeof decoded.format !== 'number' || typeof decoded.schema !== 'number' || decoded.format > 1 || decoded.schema > SCHEMA_VERSION) {
      throw new BackupError('This backup came from a newer version of the app. Reload the page, then try again.');
    }
    try {
      const tables = decoded.tables;
      const progress = tables.section_progress;
      const cards = tables.srs_cards;
      for (const row of cards) cardFromMap(JSON.parse(row.data));
      return {
        savedAt: decoded.savedAt,
        sectionsPassed: progress.filter((r) => r.passed_at != null).length,
        itemsLearned: cards.length,
        tables,
      };
    } catch (e) {
      throw new BackupError("This backup file is damaged, so it can't be restored.");
    }
  }

  /** Replaces all progress with a backup checked by readBackup. */
  async restoreBackup(backup) {
    await this.store.replaceAllTables(backup.tables);
    // The backup was saved before its own "last backup" date could be updated.
    await this.store.saveSetting('last_backup', backup.savedAt);
    this.load();
    this.notify();
  }

  // ---------- Resuming quizzes ----------

  static sectionQuizKey(section) { return `section:${section.id}`; }
  static reviewQuizKey(part) { return `review:${part.id}`; }
  static get reviewAllKey() { return 'review:all'; }

  /**
   * Starting one kind of review ends a saved review of the other kind, so an
   * overlapping card can't be rated twice.
   */
  clearOverlappingReviews(startingKey) {
    const overlapping = startingKey === SrsModel.reviewAllKey
      ? [...this.savedQuizzes.keys()].filter((k) => k.startsWith('review:'))
      : [SrsModel.reviewAllKey];
    for (const key of overlapping) this.clearQuizProgress(key);
  }

  savedQuiz(key) { return this.savedQuizzes.get(key) || null; }

  /** How many of a saved quiz's questions have had a first answer. */
  savedQuizAnswered(quiz) {
    return JSON.parse(quiz.data).attempts.filter((a) => a.round === 1).length;
  }

  saveQuizProgress(key, sessionId, snapshot) {
    const quiz = { key, sessionId, savedAt: this.now(), data: JSON.stringify(snapshot) };
    this.savedQuizzes.set(key, quiz);
    return this.store.saveQuiz(quiz);
  }

  clearQuizProgress(key) {
    if (!this.savedQuizzes.delete(key)) return Promise.resolve();
    return this.store.deleteSavedQuiz(key);
  }

  // ---------- Lessons ----------

  lessonPassedCount(lesson) { return lesson.sections.filter((s) => this.passed.has(s.id)).length; }
  lessonComplete(lesson) { return lesson.sections.every((s) => this.passed.has(s.id)); }
  get lessonsComplete() { return this.course.lessons.filter((l) => this.lessonComplete(l)).length; }

  // ---------- Unlocking ----------

  statusOf(section) {
    if (this.passed.has(section.id)) return SectionStatus.passed;
    const index = this.course.indexOf(section);
    const open = index === 0 || this.passed.has(this.course.allSections[index - 1].id) || this.early.has(section.id);
    return open ? SectionStatus.available : SectionStatus.locked;
  }

  wasUnlockedEarly(section) { return this.early.has(section.id) && !this.passed.has(section.id); }

  async unlockEarly(section) {
    this.early.add(section.id);
    await this.store.markEarlyUnlocked(section.id, this.now());
    this.notify();
  }

  /** The next section to study, if any remain open. */
  get nextSection() {
    for (const s of this.course.allSections) if (this.statusOf(s) === SectionStatus.available) return s;
    return null;
  }

  passedCount(part) { return part.sections.filter((s) => this.passed.has(s.id)).length; }
  get totalPassed() { return this.course.allSections.filter((s) => this.passed.has(s.id)).length; }

  isPassingScore(correct, total) { return total > 0 && correct / total >= this.passMark; }

  /**
   * Marks [section] passed and adds its cards to the part's deck. [results]
   * maps each card to whether it was right first time, which becomes its first
   * rating. Cards are never reset by retaking a quiz.
   */
  async passSection(part, section, results) {
    const now = this.now();
    const added = [];
    if (part) {
      for (const [cardId, correct] of results) {
        if (this.cards.has(cardId)) continue;
        const card = this.scheduler.review(newCard(now), correct ? Rating.good : Rating.again, now);
        added.push({ cardId, partId: part.id, card });
      }
    }
    this.passed.add(section.id);
    for (const c of added) this.cards.set(c.cardId, c);
    await this.store.savePassedSection(section.id, now, added);
    this.notify();
  }

  // ---------- Items you already know ----------

  /** Whether [cardId] was marked as already known and hasn't been reviewed since. */
  isMarkedKnown(cardId) {
    const c = this.cards.get(cardId);
    return !!(c && c.markedKnown);
  }

  /** A lesson's cards still to learn: those not marked as already known. */
  quizCards(section) { return section.cards.filter((c) => !this.isMarkedKnown(c.id)); }

  /** Cards that can be marked as known: in a review deck, and not being studied already. */
  canMarkKnown(cardIds) {
    return cardIds.length > 0 && cardIds.every((id) => {
      const card = this.course.cardById(id);
      return card && this.course.partOfCard(card) && (!this.cards.has(id) || this.isMarkedKnown(id));
    });
  }

  /**
   * Puts [cardIds] straight into their decks as known: no lesson quiz, and a
   * first check in a month, so a wrong guess still comes back round.
   */
  async markKnown(cardIds) {
    const now = this.now();
    const added = [];
    for (const id of cardIds) {
      if (this.cards.has(id)) continue;
      const part = this.course.partOfCard(this.course.cardById(id));
      if (!part) continue;
      const card = this.scheduler.review(newCard(now), Rating.easy, now);
      card.stability = Math.max(card.stability, KNOWN_FIRST_REVIEW_DAYS);
      card.due = now + KNOWN_FIRST_REVIEW_DAYS * DAY;
      added.push({ cardId: id, partId: part.id, card, markedKnown: now });
    }
    for (const c of added) this.cards.set(c.cardId, c);
    await this.store.saveMarkedKnown(added);
    this.notify();
  }

  /** Undoes markKnown for cards not yet reviewed. */
  async unmarkKnown(cardIds) {
    const ids = cardIds.filter((id) => this.isMarkedKnown(id));
    for (const id of ids) this.cards.delete(id);
    await this.store.deleteCards(ids);
    this.notify();
  }

  // ---------- Quiz history ----------

  startSession({ kind, part, section }) {
    return this.store.startSession({ kind, partId: part ? part.id : 'all', sectionId: section ? section.id : null, at: this.now() });
  }

  logAnswer({ sessionId, part, cardId, round, correct, time, given }) {
    return this.store.logAnswer({
      sessionId, cardId, partId: part ? part.id : this.config.noPartId || 'none', round, correct, millis: Math.round(time), given, at: this.now(),
    });
  }

  finishSession(sessionId, { itemCount, firstTryCorrect, passed }) {
    return this.store.finishSession(sessionId, { at: this.now(), itemCount, firstTryCorrect, passed });
  }

  // ---------- Decks ----------

  settingsFor(part) { return this.settings[part.id] || { paused: false, dailyLimit: 20 }; }

  async updateSettings(part, settings) {
    this.settings[part.id] = settings;
    await this.store.saveDeckSettings(part.id, settings);
    this.notify();
  }

  dueCards(part) {
    // A card due any time today counts, so a review doesn't hinge on the hour.
    const endOfDay = startOfDay(this.now(), 1);
    return [...this.cards.values()]
      .filter((c) => c.partId === part.id && c.card.due < endOfDay && this.course.cardById(c.cardId))
      .sort((a, b) => a.card.due - b.card.due);
  }

  remainingToday(part) {
    const used = this.reviewedToday[part.id] ? this.reviewedToday[part.id].size : 0;
    return Math.max(0, this.settingsFor(part).dailyLimit - used);
  }

  /** Today's reviews across every part, each within its own daily limit. */
  get allReviewQueue() { return this.course.parts.flatMap((p) => this.reviewQueue(p)); }

  /** Today's review queue, oldest first. Paused decks have none. */
  reviewQueue(part) {
    if (this.settingsFor(part).paused) return [];
    return this.dueCards(part).slice(0, this.remainingToday(part)).map((c) => c.cardId);
  }

  weakestCards(stats, limit) { return stats.weakestItems(new Set(this.cards.keys()), limit); }

  summaryOf(part) {
    const settings = this.settingsFor(part);
    const due = this.dueCards(part).length;
    const allowed = settings.paused ? 0 : this.remainingToday(part);
    const dueNow = Math.min(due, allowed);
    let total = 0;
    for (const c of this.cards.values()) if (c.partId === part.id) total++;
    return {
      totalCards: total,
      dueNow,
      heldBack: settings.paused ? 0 : due - dueNow,
      reviewedToday: this.reviewedToday[part.id] ? this.reviewedToday[part.id].size : 0,
      settings,
    };
  }

  // ---------- Stats ----------

  loadStudyStats() {
    return new StudyStats(
      this.course,
      this.store.allAnswers(),
      this.store.reviewDays(),
      this.now(),
      this.store.practiceEntries(),
      this.config.statsOptions || {}
    );
  }

  meanRecall(cards) {
    const now = this.now();
    const known = cards.filter((c) => this.course.cardById(c.cardId));
    if (!known.length) return null;
    return known.reduce((s, c) => s + this.scheduler.retrievability(c.card, now), 0) / known.length;
  }

  /** The scheduler's predicted chance of recalling a part's cards right now. */
  averageRecall(part) { return this.meanRecall([...this.cards.values()].filter((c) => c.partId === part.id)); }
  get overallRecall() { return this.meanRecall([...this.cards.values()]); }

  /** Unpassed sections that come before the furthest section passed. */
  get skippedSections() {
    const sections = this.course.allSections;
    let furthest = -1;
    sections.forEach((s, i) => { if (this.passed.has(s.id)) furthest = i; });
    return sections.slice(0, furthest + 1).filter((s) => !this.passed.has(s.id)).length;
  }

  storedCard(cardId) { return this.cards.get(cardId) || null; }

  /** The items in a part that have joined its review deck. */
  learnedCards(part) {
    return part.sections.flatMap((s) => s.cards.filter((c) => this.cards.has(c.id)));
  }

  /** Days from today until [due], where 0 is today or overdue. */
  daysUntil(due) { return Math.max(0, dayNumber(due) - dayNumber(this.now())); }

  /** Cards falling due on each of the next [days] days, ignoring the limit. */
  forecast(part, days) {
    const out = new Array(days).fill(0);
    for (const c of this.cards.values()) {
      if (c.partId !== part.id) continue;
      const d = this.daysUntil(c.card.due);
      if (d < days) out[d]++;
    }
    return out;
  }

  /** Cards falling due in every active part, ignoring daily limits. */
  forecastAll(days) {
    const out = new Array(days).fill(0);
    for (const part of this.course.parts) {
      if (this.settingsFor(part).paused) continue;
      this.forecast(part, days).forEach((n, i) => { out[i] += n; });
    }
    return out;
  }

  /** The past [days] days of reviews, oldest first and ending today. */
  reviewHistory(part, days) {
    const byDay = this.store.reviewsByDay(part.id);
    const out = [];
    for (let i = days - 1; i >= 0; i--) out.push(byDay[dayKey(startOfDay(this.now(), -i))] || { correct: 0, total: 0 });
    return out;
  }

  /** How many learned cards sit at each scheduled interval length. */
  intervalSpread(part) {
    const spread = { '1 day': 0, '2-3 days': 0, '4-7 days': 0, '8-30 days': 0, '31+ days': 0 };
    for (const c of this.cards.values()) {
      if (c.partId !== part.id || c.card.lastReview == null) continue;
      const days = Math.trunc((c.card.due - c.card.lastReview) / DAY);
      const bucket = days <= 1 ? '1 day' : days <= 3 ? '2-3 days' : days <= 7 ? '4-7 days' : days <= 30 ? '8-30 days' : '31+ days';
      spread[bucket]++;
    }
    return spread;
  }

  /** Applies a review's first answer to the card's schedule. */
  async recordReview(cardId, { correct, rating }) {
    this.refreshDay();
    const stored = this.cards.get(cardId);
    if (!stored) return;
    const now = this.now();
    const r = rating ?? (correct ? Rating.good : Rating.again);
    const updated = { cardId, partId: stored.partId, card: this.scheduler.review(stored.card, r, now) };
    this.cards.set(cardId, updated);
    (this.reviewedToday[stored.partId] ||= new Set()).add(cardId);
    await this.store.saveReview(updated, this.reviewedDay, now, r);
  }

  // ---------- Daily task (a drill, writing set, ...) ----------

  /** Days the app's daily task has been finished on, under [prefix] keys. */
  dailyTaskDone(prefix) { return this.store.loadSetting(`${prefix}_done`) === dayKey(this.now()); }
  dailyTaskCount(prefix) { return parseInt(this.store.loadSetting(`${prefix}_count`) || '0', 10) || 0; }

  async markDailyTaskDone(prefix) {
    const today = dayKey(this.now());
    // Extra sets on the same day don't count again.
    if (this.store.loadSetting(`${prefix}_done`) !== today) {
      await this.store.saveSetting(`${prefix}_count`, this.dailyTaskCount(prefix) + 1);
    }
    await this.store.saveSetting(`${prefix}_done`, today);
    this.notify();
  }

  // ---------- Achievements ----------

  /** For subclasses: every achievement, in display order. */
  buildAchievements() { return []; }

  get achievements() {
    if (!this._achievements) this._achievements = this.buildAchievements();
    return this._achievements;
  }

  achievementFacts(stats) {
    return { model: this, stats, perfectQuizzes: this.store.perfectSectionQuizzes() };
  }

  /** Records any newly reached achievements and returns them. */
  async updateAchievements(stats) {
    const facts = this.achievementFacts(stats);
    this.lastFacts = facts;
    const now = this.now();
    const fresh = this.achievements.filter((a) => !(a.id in this.unlocked) && a.progress(facts) >= a.target);
    if (fresh.length) {
      for (const a of fresh) this.unlocked[a.id] = now;
      await this.store.saveSetting('achievements', JSON.stringify(this.unlocked));
    }
    return fresh;
  }

  achievementProgress(a) { return this.lastFacts ? a.progress(this.lastFacts) : 0; }

  // ---------- Practice log ----------

  async startPracticeTimer() {
    const now = this.now();
    this.timerStarted = now;
    await this.store.saveSetting('practice_timer_started', now);
    this.notify();
  }

  async clearPracticeTimer() {
    this.timerStarted = null;
    await this.store.deleteSetting('practice_timer_started');
    this.notify();
  }

  async logPractice(seconds, note) {
    const trimmed = note ? note.trim() : '';
    await this.store.addPractice(this.now(), seconds, trimmed || null);
    this.notify();
  }

  async deletePractice(id) {
    await this.store.deletePractice(id);
    this.notify();
  }
}

function parseMillis(v) {
  const n = parseInt(v || '', 10);
  return Number.isFinite(n) ? n : null;
}

// ---------- Pace ----------

/**
 * When [lessons] would all be done, at one a day, six days a week:
 * n lessons take ceil(n * 7 / 6) calendar days. Null when none are left.
 */
export function projectedFinish(model, lessons) {
  const left = lessons.filter((l) => !model.lessonComplete(l)).length;
  if (left === 0) return null;
  return startOfDay(model.now(), Math.ceil((left * 7) / 6) - 1);
}

/** Builds achievement entries tersely: count(id, title, description, icon, target, progress, secret?). */
export function count(id, title, description, icon, target, progress, secret = false) {
  return { id, title, description, icon, target, progress, secret };
}

export function answersWhere(facts, test) {
  return facts.stats.answers.filter((a) => test(new Date(a.at))).length;
}
