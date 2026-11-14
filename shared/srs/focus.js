// What to work on next, and observations from the data.

import { SectionStatus } from './model.js';
import { MIN_SAMPLE } from './stats.js';

/** A skill below this first-try score is worth recommending. */
const WEAK_SKILL_THRESHOLD = 75;

/** A paused part below this predicted recall is worth flagging. */
const FADING_RECALL_THRESHOLD = 0.8;

const s = (n, one, many) => (n === 1 ? one : many);

/**
 * Most useful first. Due reviews lead because they're the cheapest way to keep
 * what's been learned, and new material comes last. [extra] holds app-specific
 * areas: afterTrouble (after the most-missed sections) and beforeNext.
 */
export function buildFocusAreas(model, stats, extra = {}) {
  const out = [];
  const course = model.course;
  const name = (card) => card.info.name;

  for (const part of course.parts) {
    const summary = model.summaryOf(part);
    if (summary.dueNow > 0) {
      out.push({
        title: `Review ${part.title}`,
        reason: `${summary.dueNow} card${s(summary.dueNow, ' is', 's are')} due today.`,
        actionLabel: 'Start review',
        action: { type: 'reviewPart', part },
      });
    }
  }

  const bySection = new Map();
  for (const item of stats.troubleItems) {
    if (!bySection.has(item.section)) bySection.set(item.section, []);
    bySection.get(item.section).push(item);
  }
  const misses = (items) => items.reduce((sum, i) => sum + i.misses, 0);
  const hardest = [...bySection.entries()].sort((a, b) => misses(b[1]) - misses(a[1]));
  for (const [section, items] of hardest.slice(0, 2)) {
    const names = items.slice(0, 3).map((i) => `${name(i.card)} (${i.misses} of ${i.total} wrong)`).join(', ');
    out.push({
      title: `Reread "${section.title}"`,
      reason: `You keep missing ${names}.`,
      actionLabel: 'Open section',
      action: { type: 'openSection', section },
    });
  }

  out.push(...(extra.afterTrouble || []));

  const weakest = model.weakestCards(stats, 20);
  const weakIds = new Set(weakest.map((c) => c.id));
  const missed = stats.troubleItems.filter((t) => weakIds.has(t.card.id));
  if (missed.length) {
    out.push({
      title: 'Review your weakest items',
      reason: `${missed.length} of your learned items ${s(missed.length, 'keeps', 'keep')} being missed, such as ${name(missed[0].card)} (${missed[0].misses} of ${missed[0].total} wrong).`,
      actionLabel: 'Start extra review',
      action: { type: 'reviewWeakest', cards: weakest },
    });
  }

  const weak = stats.weakestSkill;
  if (weak && weak.percent < WEAK_SKILL_THRESHOLD) {
    const section = stats.weakestSectionFor(weak.label);
    if (section && model.statusOf(section) !== SectionStatus.locked) {
      out.push({
        title: `Work on ${weak.label.toLowerCase()}`,
        reason: `It's your lowest skill at ${weak.percent}% right first time (${weak.right} of ${weak.total}). "${section.title}" is where it's weakest.`,
        actionLabel: 'Open section',
        action: { type: 'openSection', section },
      });
    }
  }

  for (const part of course.parts) {
    const summary = model.summaryOf(part);
    if (summary.heldBack > 0) {
      out.push({
        title: `Raise the ${part.title} daily limit`,
        reason: `${summary.heldBack} due card${s(summary.heldBack, ' is', 's are')} being held back by your limit of ${summary.settings.dailyLimit}.`,
        actionLabel: 'Open review quiz',
        action: { type: 'openDeck', part },
      });
    }
    const recall = model.averageRecall(part);
    if (summary.settings.paused && recall != null && recall < FADING_RECALL_THRESHOLD) {
      out.push({
        title: `${part.title} may be fading`,
        reason: `Reviews are paused, and predicted recall is down to ${Math.round(recall * 100)}%. Turn them back on if you still want this part fresh.`,
        actionLabel: 'Open review quiz',
        action: { type: 'openDeck', part },
      });
    }
  }

  out.push(...(extra.beforeNext || []));

  const next = model.nextSection;
  if (next) {
    out.push({
      title: `Continue with "${next.title}"`,
      reason: `This is your next section in ${extra.lessonWord || 'Lesson'} ${course.lessonOf(next).number}.`,
      actionLabel: 'Open section',
      action: { type: 'openSection', section: next },
    });
  }
  return out;
}

/**
 * Observations, each stating the numbers behind it. [practiceText(minutes)]
 * words the practice-log line; [extra] are app-specific lines added at the end.
 */
export function buildInsights(model, stats, { practiceText, extra = [] } = {}) {
  const out = [];
  if (stats.firstTry.total > 0) {
    out.push(`You get ${stats.firstTry.percent}% right first time, across ${stats.firstTry.total} questions.`);
  }
  const strong = stats.strongestSkill;
  const weak = stats.weakestSkill;
  if (strong && weak && strong !== weak) {
    out.push(`${strong.label} is your strongest skill at ${strong.percent}%, and ${weak.label.toLowerCase()} is your weakest at ${weak.percent}%.`);
  }
  const thisWeek = stats.periodScore(0, 7);
  const lastWeek = stats.periodScore(7, 7);
  if (thisWeek.total >= MIN_SAMPLE && lastWeek.total >= MIN_SAMPLE) {
    const change = thisWeek.percent - lastWeek.percent;
    out.push(
      change === 0
        ? `Your first-try score is level with last week at ${thisWeek.percent}%.`
        : `Your first-try score is ${change > 0 ? 'up' : 'down'} ${Math.abs(change)} points on last week: ${thisWeek.percent}% against ${lastWeek.percent}%.`
    );
  }
  if (stats.repeats.total >= MIN_SAMPLE) {
    out.push(`In repeat rounds you get ${stats.repeats.percent}% right (${stats.repeats.right} of ${stats.repeats.total}).`);
  }
  const recall = model.overallRecall;
  if (recall != null) {
    out.push(`The scheduler predicts you'd recall about ${Math.round(recall * 100)}% of your learned items right now.`);
  }
  let nextWeek = 0;
  let limit = 0;
  for (const part of model.course.parts) {
    if (model.settingsFor(part).paused) continue;
    nextWeek += model.forecast(part, 7).reduce((a, b) => a + b, 0);
    limit += model.settingsFor(part).dailyLimit * 7;
  }
  if (nextWeek > 0) out.push(`${nextWeek} cards are due over the next 7 days, against a combined limit of ${limit}.`);
  if (stats.practice.length && practiceText) {
    out.push(practiceText(Math.floor(stats.practiceSecondsOver(7) / 60)));
  }
  const skipped = model.skippedSections;
  if (skipped > 0) {
    out.push(
      `You've moved past ${skipped} section${s(skipped, '', 's')} without passing ${s(skipped, 'its', 'their')} quiz, so ${s(skipped, 'its', 'their')} cards aren't in your reviews.`
    );
  }
  out.push(...extra);
  return out;
}
