// Today's plan: one ordered list of what to study across every app, made by
// the landing page each day and ticked off by the apps as you go.
//
// Reviews come first, a step for each app with cards due. Then one new
// lesson. Vocabulary goes first until it's ahead of Reading and Listening
// (vocabulary lesson n teaches the words of Reading n and Track n); then
// whichever of those two is further behind. Grammar takes turns with them,
// Writing and Conjugation join the rotation once you use them, and the app
// studied least recently goes first.
//
// The plan lives in localStorage (vibe.today) for the day. Each app marks its
// own steps done when a quiz ends and offers the next one, so the day works as
// one flow even though each app is its own page. The landing page checks
// every step against the apps' real data whenever it opens.

import { dayKey } from './srs/stats.js';

const KEY = 'vibe.today';

export const PLAN_APPS = ['grammar', 'vocab', 'writing', 'conjugation', 'reading', 'listening'];
export const PLAN_NAMES = { grammar: 'Grammar', vocab: 'Vocabulary', writing: 'Writing', conjugation: 'Conjugation', reading: 'Reading', listening: 'Listening' };

export function loadPlan(now = Date.now()) {
  try {
    const plan = JSON.parse(localStorage.getItem(KEY) || 'null');
    return plan && plan.day === dayKey(now) && Array.isArray(plan.steps) ? plan : null;
  } catch (e) { return null; }
}

export function savePlan(plan) {
  try { localStorage.setItem(KEY, JSON.stringify(plan)); } catch (e) { /* storage blocked */ }
}

/** The first step not yet done, or null. */
export const nextStep = (plan) => (plan ? plan.steps.find((s) => !s.done) || null : null);

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** An app's next lesson number, from its summary: 1 if never opened, Infinity once finished. */
function nextLesson(summary) {
  if (!summary) return 1;
  return summary.next ? summary.next.lesson : Infinity;
}

/** The part of a lesson, when it isn't already clear from the lesson's title. */
const partName = (next) => (next.title && !next.title.startsWith(next.lessonTitle) ? ` · ${next.title}` : '');

function lessonStep(app, summary) {
  const next = summary && summary.next;
  return {
    id: `lesson:${app}`,
    app,
    kind: 'lesson',
    label: next ? `${PLAN_NAMES[app]} lesson ${next.lesson}: ${next.lessonTitle}${partName(next)}` : `${PLAN_NAMES[app]} lesson 1`,
    href: next ? `${app}/index.html#/section/${next.id}` : `${app}/index.html`,
    // Done once the app has passed more parts than this.
    baseline: summary ? summary.sectionsDone : 0,
    done: false,
  };
}

/**
 * The next new lesson to suggest. [activity] is each app's study history
 * ({learned, days}), [summaries] each app's saved summary.
 */
export function chooseLesson({ activity, summaries }) {
  const inUse = (id) => activity[id] && (activity[id].learned > 0 || activity[id].days.size > 0);
  const lastStudied = (id) => (activity[id] && activity[id].days.size ? [...activity[id].days].sort().pop() : '');
  const n = (id) => nextLesson(summaries[id]);
  const candidates = [];
  // Vocabulary, Reading and Listening move together.
  const passage = n('reading') <= n('listening') ? 'reading' : 'listening';
  const trio = n('vocab') <= n(passage) ? 'vocab' : passage;
  if (n(trio) !== Infinity) candidates.push(trio);
  // Grammar runs alongside them.
  if (n('grammar') !== Infinity) candidates.push('grammar');
  for (const id of ['writing', 'conjugation']) if (inUse(id) && n(id) !== Infinity) candidates.push(id);
  if (!candidates.length) return null;
  // The app studied least recently first (never studied counts as oldest).
  candidates.sort((a, b) => (lastStudied(a) < lastStudied(b) ? -1 : lastStudied(a) > lastStudied(b) ? 1 : 0));
  return lessonStep(candidates[0], summaries[candidates[0]]);
}

/**
 * Today's plan, made or brought up to date from the apps' real data, and
 * saved. [activity] holds each app's {due, learned, days}.
 */
export function refreshPlan({ activity, summaries }, now = Date.now()) {
  const plan = loadPlan(now) || { day: dayKey(now), steps: [] };
  for (const id of PLAN_APPS) {
    const due = activity[id] ? activity[id].due : 0;
    let step = plan.steps.find((s) => s.id === `review:${id}`);
    if (!step && due > 0) {
      step = { id: `review:${id}`, app: id, kind: 'review', count: due, href: `${id}/index.html#/quiz/review-all`, done: false };
      plan.steps.push(step);
    }
    if (!step) continue;
    step.count = Math.max(step.count, due);
    step.label = `Review ${plural(step.count, 'card')} in ${PLAN_NAMES[id]}`;
    step.done = due === 0;
  }
  if (!plan.steps.some((s) => s.kind === 'lesson')) {
    const lesson = chooseLesson({ activity, summaries });
    if (lesson) plan.steps.push(lesson);
  }
  for (const s of plan.steps) {
    if (s.kind === 'lesson' && summaries[s.app] && summaries[s.app].sectionsDone > s.baseline) s.done = true;
  }
  // Reviews before the lesson, each group in the order it was added.
  plan.steps.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'review' ? -1 : 1));
  savePlan(plan);
  return plan;
}

/**
 * In an app, after a quiz: ticks off its steps that are now done, and returns
 * the plan, or null if there's none for today.
 */
export function updatePlanFromApp(app, { reviewsLeft, sectionsDone }) {
  const plan = loadPlan();
  if (!plan) return null;
  for (const s of plan.steps) {
    if (s.app !== app) continue;
    if (s.kind === 'review' && reviewsLeft === 0) s.done = true;
    if (s.kind === 'lesson' && sectionsDone > s.baseline) s.done = true;
  }
  savePlan(plan);
  return plan;
}

/** A step's link from inside [app]'s page: within the app, or to another app. */
export function stepHref(step, app) {
  if (step.app !== app) return `../${step.href}`;
  const hash = step.href.indexOf('#');
  return hash >= 0 ? step.href.slice(hash) : '#/';
}
