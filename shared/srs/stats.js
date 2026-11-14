// Everything derived from the raw answer history.

import { seeded } from './quiz-engine.js';

export const MIN_SAMPLE = 5;
const MAX_LISTED = 5;

export class Score {
  constructor(label) {
    this.label = label;
    this.right = 0;
    this.total = 0;
  }
  get fraction() { return this.total === 0 ? 0 : this.right / this.total; }
  get percent() { return Math.round(this.fraction * 100); }
  add(correct) {
    this.total++;
    if (correct) this.right++;
  }
}

export function dayKey(t) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Midnight at the start of the day [offset] days from [t]'s day, local time. */
export function startOfDay(t, offset = 0) {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset).getTime();
}

function dayNumber(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

function median(list) {
  const sorted = list.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export class StudyStats {
  /**
   * options.extraCard(id): for answers to cards outside any section (such as
   *   drill cards), returns { card, section } or null.
   * options.slowExcluded(cardId, skill): leaves an item out of the slowest list.
   */
  constructor(course, answers, otherActiveDays, now, practice = [], options = {}) {
    this.answers = answers;
    this.now = now;
    this.practice = practice;
    this.right = 0;
    this.totalMillis = 0;
    this.firstTry = new Score('First try');
    this.repeats = new Score('Repeat rounds');
    this.bySkill = new Map();
    this.byLesson = new Map();
    this.bySection = new Map();
    this.skillBySection = new Map(); // `${skill}\u0000${sectionId}` -> {score, section, skill}
    this.cardScores = new Map(); // card -> Score
    this.cardMedians = new Map();
    this.troubleItems = [];
    this.slowItems = [];
    this.activeDays = 0;
    this.currentStreak = 0;
    this.longestStreak = 0;

    const perCard = new Map();
    const timesByCard = new Map();
    const info = new Map(); // id -> {card, section, lesson, skill}
    for (const lesson of course.lessons) {
      for (const section of lesson.sections) {
        for (const card of section.reviewCard ? [...section.cards, section.reviewCard] : section.cards) {
          info.set(card.id, { card, section, lesson, skill: card.build(seeded(0)).skill });
        }
      }
    }

    const days = new Set(otherActiveDays);
    for (const p of practice) days.add(dayKey(p.at));
    for (const a of answers) {
      days.add(dayKey(a.at));
      let i = info.get(a.cardId);
      if (!i && options.extraCard) {
        const extra = options.extraCard(a.cardId);
        if (extra) {
          i = { card: extra.card, section: extra.section, lesson: course.lessonOf(extra.section), skill: extra.card.build(seeded(0)).skill };
          info.set(a.cardId, i);
        }
      }
      if (!i) continue; // A card since removed from the course.
      this.totalMillis += a.millis;
      if (a.correct) this.right++;
      if (!perCard.has(a.cardId)) perCard.set(a.cardId, new Score(a.cardId));
      perCard.get(a.cardId).add(a.correct);
      if (a.round === 1) {
        this.firstTry.add(a.correct);
        const add = (map, key, label) => {
          if (!map.has(key)) map.set(key, new Score(label));
          map.get(key).add(a.correct);
        };
        add(this.bySkill, i.skill, i.skill);
        add(this.byLesson, i.lesson, i.lesson.title);
        add(this.bySection, i.section, i.section.title);
        const k = `${i.skill}\u0000${i.section.id}`;
        if (!this.skillBySection.has(k)) this.skillBySection.set(k, { score: new Score(i.section.title), section: i.section, skill: i.skill });
        this.skillBySection.get(k).score.add(a.correct);
        const excluded = options.slowExcluded ? options.slowExcluded(a.cardId, i.skill) : false;
        if (!excluded) {
          if (!timesByCard.has(a.cardId)) timesByCard.set(a.cardId, []);
          timesByCard.get(a.cardId).push(a.millis);
        }
      } else {
        this.repeats.add(a.correct);
      }
    }

    for (const [id, score] of perCard) this.cardScores.set(info.get(id).card, score);
    for (const [id, times] of timesByCard) this.cardMedians.set(id, median(times));

    this.troubleItems = [];
    for (const [id, s] of perCard) {
      const misses = s.total - s.right;
      if (misses >= 2 && s.fraction <= 0.7) {
        const i = info.get(id);
        this.troubleItems.push({ card: i.card, section: i.section, misses, total: s.total });
      }
    }
    this.troubleItems.sort((a, b) => b.misses - a.misses || a.total - b.total);

    this.slowItems = [...timesByCard.entries()]
      .map(([id, times]) => ({ card: info.get(id).card, medianMillis: median(times) }))
      .sort((a, b) => b.medianMillis - a.medianMillis)
      .slice(0, MAX_LISTED);

    this.activeDays = days.size;
    this.computeStreaks(days);
  }

  computeStreaks(days) {
    if (days.size === 0) return;
    const numbers = new Set([...days].map(dayNumber));
    const today = dayNumber(dayKey(this.now));
    let run = 0;
    for (const n of [...numbers].sort((a, b) => a - b)) {
      run = numbers.has(n - 1) ? run + 1 : 1;
      if (run > this.longestStreak) this.longestStreak = run;
    }
    // A streak still counts today if the last study day was yesterday.
    let day = numbers.has(today) ? today : today - 1;
    while (numbers.has(day)) {
      this.currentStreak++;
      day--;
    }
  }

  /** One entry per day, oldest first and ending today. */
  daily(count) {
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      out.push({ date: startOfDay(this.now, -i), right: 0, wrong: 0, millis: 0, practiceSeconds: 0 });
    }
    const index = new Map(out.map((d, i) => [dayKey(d.date), i]));
    for (const a of this.answers) {
      const i = index.get(dayKey(a.at));
      if (i === undefined) continue;
      if (a.correct) out[i].right++;
      else out[i].wrong++;
      out[i].millis += a.millis;
    }
    for (const p of this.practice) {
      const i = index.get(dayKey(p.at));
      if (i !== undefined) out[i].practiceSeconds += p.seconds;
    }
    return out;
  }

  get totalPracticeSeconds() { return this.practice.reduce((s, p) => s + p.seconds, 0); }

  /** Seconds of logged practice over the last [days] days, including today. */
  practiceSecondsOver(days) { return this.daily(days).reduce((s, d) => s + d.practiceSeconds, 0); }

  /** When each card was last answered. */
  lastAnswered() {
    const out = new Map();
    for (const a of this.answers) {
      const prev = out.get(a.cardId);
      if (prev == null || a.at > prev) out.set(a.cardId, a.at);
    }
    return out;
  }

  /**
   * Answered items among [learned], weakest first: the highest share of wrong
   * answers, then the most wrong answers, then the slowest typical answer.
   */
  weakestItems(learned, limit) {
    const items = [...this.cardScores.entries()].filter(([c]) => learned.has(c.id));
    items.sort(([ca, a], [cb, b]) => {
      const byRate = a.fraction - b.fraction;
      if (byRate !== 0) return byRate;
      const byMisses = (b.total - b.right) - (a.total - a.right);
      if (byMisses !== 0) return byMisses;
      return (this.cardMedians.get(cb.id) || 0) - (this.cardMedians.get(ca.id) || 0);
    });
    return items.slice(0, limit).map(([c]) => c);
  }

  get topTrouble() { return this.troubleItems.slice(0, MAX_LISTED); }

  /** First-try score over a span of days ending [daysAgo] days ago. */
  periodScore(daysAgo, span) {
    const score = new Score('Period');
    const end = startOfDay(this.now, -daysAgo + 1);
    const start = startOfDay(end, -span);
    for (const a of this.answers) {
      if (a.round === 1 && a.at >= start && a.at < end) score.add(a.correct);
    }
    return score;
  }

  get weakestSkill() { return extreme(this.bySkill.values(), true); }
  get strongestSkill() { return extreme(this.bySkill.values(), false); }

  /** The section where [skill] scores lowest, with at least two answers there. */
  weakestSectionFor(skill) {
    let worst = null;
    let lowest = 2;
    for (const v of this.skillBySection.values()) {
      if (v.skill === skill && v.score.total >= 2 && v.score.fraction < lowest) {
        lowest = v.score.fraction;
        worst = v.section;
      }
    }
    return worst;
  }
}

function extreme(scores, lowest) {
  const enough = [...scores].filter((s) => s.total >= MIN_SAMPLE);
  if (!enough.length) return null;
  enough.sort((a, b) => (lowest ? a.fraction - b.fraction : b.fraction - a.fraction));
  return enough[0];
}
