// FSRS scheduler, ported from the Dart `fsrs` 2.0.1 package the Android apps
// use, so cards are scheduled the same way. Times are epoch milliseconds.

const DEFAULT_PARAMETERS = [
  0.2172, 1.1771, 3.2602, 16.1507, 7.0114, 0.57, 2.0966, 0.0069, 1.5261, 0.112, 1.0178,
  1.849, 0.1133, 0.3127, 2.2934, 0.2191, 3.0004, 0.7536, 0.3332, 0.1437, 0.2,
];

const STABILITY_MIN = 0.001;
const MIN_DIFFICULTY = 1.0;
const MAX_DIFFICULTY = 10.0;
const DAY = 86400000;

const FUZZ_RANGES = [
  { start: 2.5, end: 7.0, factor: 0.15 },
  { start: 7.0, end: 20.0, factor: 0.1 },
  { start: 20.0, end: Infinity, factor: 0.05 },
];

export const State = { learning: 1, review: 2, relearning: 3 };
export const Rating = { again: 1, hard: 2, good: 3, easy: 4 };

/** Whole days between two times, truncated like Dart's Duration.inDays. */
function inDays(ms) { return Math.trunc(ms / DAY); }

export function newCard(now) {
  return { state: State.learning, step: 0, stability: null, difficulty: null, due: now, lastReview: null };
}

/** The same map the Dart package saves, so backups look alike. */
export function cardToMap(card) {
  return {
    cardId: 0,
    state: card.state,
    step: card.step,
    stability: card.stability,
    difficulty: card.difficulty,
    due: new Date(card.due).toISOString(),
    lastReview: card.lastReview == null ? null : new Date(card.lastReview).toISOString(),
  };
}

export function cardFromMap(m) {
  const due = Date.parse(m.due);
  if (Number.isNaN(due) || ![1, 2, 3].includes(m.state)) throw new Error('Bad card');
  return {
    state: m.state,
    step: m.step == null ? (m.state === State.learning ? 0 : null) : m.step,
    stability: m.stability == null ? null : Number(m.stability),
    difficulty: m.difficulty == null ? null : Number(m.difficulty),
    due,
    lastReview: m.lastReview ? Date.parse(m.lastReview) : null,
  };
}

export class Scheduler {
  constructor({
    parameters = DEFAULT_PARAMETERS,
    desiredRetention = 0.9,
    learningSteps = [60000, 600000],
    relearningSteps = [600000],
    maximumInterval = 36500,
    enableFuzzing = true,
  } = {}) {
    this.w = parameters.slice();
    this.desiredRetention = desiredRetention;
    this.learningSteps = learningSteps;
    this.relearningSteps = relearningSteps;
    this.maximumInterval = maximumInterval;
    this.enableFuzzing = enableFuzzing;
    this.decay = -this.w[20];
    this.factor = Math.pow(0.9, 1 / this.decay) - 1;
  }

  retrievability(card, now) {
    if (card.lastReview == null) return 0;
    const elapsed = Math.max(0, inDays(now - card.lastReview));
    return Math.pow(1 + (this.factor * elapsed) / card.stability, this.decay);
  }

  /** Returns the updated card; the original is left alone. */
  review(original, rating, now) {
    const card = { ...original };
    const w = this.w;
    const sinceLast = card.lastReview != null ? inDays(now - card.lastReview) : null;
    let interval; // milliseconds

    const toReview = () => {
      card.state = State.review;
      card.step = null;
      interval = this.nextInterval(card.stability) * DAY;
    };

    const stepInterval = (steps) => {
      if (steps.length === 0 || (card.step >= steps.length && rating !== Rating.again)) {
        toReview();
        return;
      }
      switch (rating) {
        case Rating.again:
          card.step = 0;
          interval = steps[0];
          break;
        case Rating.hard:
          if (card.step === 0 && steps.length === 1) interval = steps[0] * 1.5;
          else if (card.step === 0 && steps.length >= 2) interval = Math.floor((steps[0] + steps[1]) / 2);
          else interval = steps[card.step];
          break;
        case Rating.good:
          if (card.step + 1 === steps.length) toReview();
          else {
            card.step += 1;
            interval = steps[card.step];
          }
          break;
        default:
          toReview();
      }
    };

    switch (card.state) {
      case State.learning:
        if (card.stability == null && card.difficulty == null) {
          card.stability = this.initialStability(rating);
          card.difficulty = this.initialDifficulty(rating);
        } else if (sinceLast != null && sinceLast < 1) {
          card.stability = this.shortTermStability(card.stability, rating);
          card.difficulty = this.nextDifficulty(card.difficulty, rating);
        } else {
          card.stability = this.nextStability(card.difficulty, card.stability, this.retrievability(card, now), rating);
          card.difficulty = this.nextDifficulty(card.difficulty, rating);
        }
        stepInterval(this.learningSteps);
        break;
      case State.review:
        if (sinceLast != null && sinceLast < 1) {
          card.stability = this.shortTermStability(card.stability, rating);
        } else {
          card.stability = this.nextStability(card.difficulty, card.stability, this.retrievability(card, now), rating);
        }
        card.difficulty = this.nextDifficulty(card.difficulty, rating);
        if (rating === Rating.again && this.relearningSteps.length > 0) {
          card.state = State.relearning;
          card.step = 0;
          interval = this.relearningSteps[0];
        } else {
          interval = this.nextInterval(card.stability) * DAY;
        }
        break;
      default: // relearning
        if (sinceLast != null && sinceLast < 1) {
          card.stability = this.shortTermStability(card.stability, rating);
        } else {
          card.stability = this.nextStability(card.difficulty, card.stability, this.retrievability(card, now), rating);
        }
        card.difficulty = this.nextDifficulty(card.difficulty, rating);
        stepInterval(this.relearningSteps);
    }

    if (this.enableFuzzing && card.state === State.review) interval = this.fuzz(interval);
    card.due = now + interval;
    card.lastReview = now;
    return card;
  }

  clampDifficulty(d) { return Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, d)); }
  clampStability(s) { return Math.max(s, STABILITY_MIN); }

  initialStability(rating) { return this.clampStability(this.w[rating - 1]); }

  initialDifficulty(rating) {
    return this.clampDifficulty(this.w[4] - Math.exp(this.w[5] * (rating - 1)) + 1);
  }

  nextInterval(stability) {
    let days = (stability / this.factor) * (Math.pow(this.desiredRetention, 1 / this.decay) - 1);
    days = Math.round(days);
    days = Math.max(days, 1);
    return Math.min(days, this.maximumInterval);
  }

  shortTermStability(stability, rating) {
    const w = this.w;
    let inc = Math.exp(w[17] * (rating - 3 + w[18])) * Math.pow(stability, -w[19]);
    if (rating === Rating.good || rating === Rating.easy) inc = Math.max(inc, 1.0);
    return this.clampStability(stability * inc);
  }

  nextDifficulty(difficulty, rating) {
    const w = this.w;
    const delta = -(w[6] * (rating - 3));
    const damped = difficulty + ((10.0 - difficulty) * delta) / 9.0;
    const next = w[7] * this.initialDifficulty(Rating.easy) + (1 - w[7]) * damped;
    return this.clampDifficulty(next);
  }

  nextStability(difficulty, stability, r, rating) {
    const w = this.w;
    let next;
    if (rating === Rating.again) {
      const longTerm = w[11] * Math.pow(difficulty, -w[12]) * (Math.pow(stability + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]);
      const shortTerm = stability / Math.exp(w[17] * w[18]);
      next = Math.min(longTerm, shortTerm);
    } else {
      const hard = rating === Rating.hard ? w[15] : 1.0;
      const easy = rating === Rating.easy ? w[16] : 1.0;
      next = stability * (1 + Math.exp(w[8]) * (11 - difficulty) * Math.pow(stability, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard * easy);
    }
    return this.clampStability(next);
  }

  fuzz(intervalMs) {
    const days = inDays(intervalMs);
    if (days < 2.5) return intervalMs;
    let delta = 1.0;
    for (const f of FUZZ_RANGES) delta += f.factor * Math.max(Math.min(days, f.end) - f.start, 0.0);
    let min = Math.round(days - delta);
    let max = Math.round(days + delta);
    min = Math.max(2, min);
    max = Math.min(max, this.maximumInterval);
    min = Math.min(min, max);
    const fuzzed = Math.min(Math.round(Math.random() * (max - min + 1) + min), this.maximumInterval);
    return fuzzed * DAY;
  }
}
