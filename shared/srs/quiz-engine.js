// Runs cards in rounds. Each round after the first holds the cards missed in
// the one before, so a quiz ends only when every card has been answered right.

/** A small seeded random generator (mulberry32), so a saved quiz rebuilds the same questions. */
export function seeded(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (n) => Math.floor(next() * n),
    pick: (list) => list[Math.floor(next() * list.length)],
    shuffle(list) {
      const out = list.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

export function randomSeed() {
  return Math.floor(Math.random() * 4294967296);
}

export function shuffled(list) {
  return seeded(randomSeed()).shuffle(list);
}

export class QuizEngine {
  constructor(cards) {
    this.total = cards ? cards.length : 0;
    this.queue = cards ? shuffled(cards) : [];
    this.missed = [];
    this.index = 0;
    this.round = 1;
    this.attempts = [];
    this.question = null;
    this.seed = 0;
    if (cards) this.buildQuestion();
  }

  /**
   * Continues a quiz saved by snapshot(). Returns null if the saved data can't
   * be used, for example because a content update removed one of its cards.
   */
  static restore(data, cardById, outcomeFromJson) {
    try {
      const cards = (key) =>
        data[key].map((id) => {
          const c = cardById(id);
          if (!c) throw new Error('missing card');
          return c;
        });
      const e = new QuizEngine(null);
      e.total = data.total;
      e.queue = cards('queue');
      e.missed = cards('missed');
      e.index = data.index;
      e.round = data.round;
      for (const item of data.attempts) {
        const card = cardById(item.card);
        if (!card) throw new Error('missing card');
        const question = card.build(seeded(item.seed));
        const outcome = outcomeFromJson(item.outcome, question);
        e.attempts.push({
          card,
          question,
          outcome,
          correct: outcome.correct,
          round: item.round,
          time: item.millis,
          seed: item.seed,
        });
      }
      if (e.isFinished) return null;
      e.seed = data.seed;
      e.question = e.currentCard.build(seeded(e.seed));
      return e;
    } catch (err) {
      return null;
    }
  }

  /** Everything needed to pick this quiz up again later. */
  snapshot() {
    return {
      total: this.total,
      queue: this.queue.map((c) => c.id),
      missed: this.missed.map((c) => c.id),
      index: this.index,
      round: this.round,
      seed: this.seed,
      attempts: this.attempts.map((a) => ({
        card: a.card.id,
        seed: a.seed,
        round: a.round,
        millis: a.time,
        outcome: { ...a.outcome },
      })),
    };
  }

  get isFinished() { return this.index >= this.queue.length; }
  get currentCard() { return this.queue[this.index]; }
  get currentQuestion() { return this.question; }
  get positionInRound() { return this.index + 1; }
  get roundSize() { return this.queue.length; }

  /** Cards still to be answered correctly, including the current one. */
  get remaining() { return this.queue.length - this.index + this.missed.length; }

  buildQuestion() {
    this.seed = randomSeed();
    this.question = this.isFinished ? null : this.currentCard.build(seeded(this.seed));
  }

  answer(outcome, time) {
    const attempt = {
      card: this.currentCard,
      question: this.currentQuestion,
      outcome,
      round: this.round,
      time,
      seed: this.seed,
    };
    attempt.correct = outcome.correct;
    this.attempts.push(attempt);
    if (!outcome.correct) this.missed.push(this.currentCard);
    this.index++;
    this.rollRound();
    this.buildQuestion();
    return attempt;
  }

  rollRound() {
    if (this.isFinished && this.missed.length) {
      this.queue = shuffled(this.missed);
      this.missed = [];
      this.index = 0;
      this.round++;
    }
  }

  /**
   * Counts the last answer as right after all, because it was a typo.
   * Returns whether the current question changed (the quiz may now be finished).
   */
  amendLastAsTypo(amendOutcome) {
    const last = this.attempts.pop();
    this.attempts.push({ ...last, outcome: amendOutcome(last.outcome), correct: true });
    if (last.correct) return false;
    const missedAt = this.missed.indexOf(last.card);
    if (missedAt >= 0) {
      this.missed.splice(missedAt, 1);
      return false;
    }
    // The miss ended its round, so it already starts the next one.
    const i = this.queue.indexOf(last.card, this.index);
    if (i < 0) return false;
    this.queue.splice(i, 1);
    if (this.queue.length === 0) {
      // That round held only this card, so it never really started.
      this.round--;
      this.index = 0;
    }
    if (i !== this.index && !this.isFinished) return false;
    this.buildQuestion();
    return true;
  }

  get firstTries() { return this.attempts.filter((a) => a.round === 1); }

  /** Each card's first answer, which is what decides passing and scheduling. */
  get firstTryResults() {
    const out = new Map();
    for (const a of this.firstTries) out.set(a.card.id, a.correct);
    return out;
  }

  get firstTryCorrect() { return this.firstTries.filter((a) => a.correct).length; }
}
