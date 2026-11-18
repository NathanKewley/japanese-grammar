// Screens every study app shares, and the function that wires an app together.

import { html, raw, icon, richText, plural, dialog, confirmDialog, toast, longDate, slashDate, shortDate, formatSeconds, formatLong, formatMinutes, currentTheme, setTheme } from './dom.js';
import { Ui, statGrid, statSection, barRow, barChart, legend, progressBar, dayLabel, aheadLabel, switchRow, GOOD, BAD, ACCENT } from './ui.js';
import { SrsModel, SectionStatus, BackupError, MIN_DAILY_LIMIT, MAX_DAILY_LIMIT, projectedFinish } from './model.js';
import { QuizEngine, seeded, shuffled } from './quiz-engine.js';
import { buildFocusAreas, buildInsights } from './focus.js';
import { deleteDatabase } from './store.js';
import { Learner } from '../learner.js';
import { updatePlanFromApp, nextStep, stepHref } from '../today.js';
import { startOfDay } from './stats.js';

export const EXTRA_REVIEW_SIZE = 20;

/** Input is ignored this long after a question appears, so a double tap can't answer the next one. */
const INPUT_DELAY = 300;

export const path = (...segs) => `#/${segs.map((s) => encodeURIComponent(s)).join('/')}`;

const DEFAULT_TEXT = {
  sectionQuizStart: (n) => `Start the quiz (${n} questions)`,
  sectionQuizResume: (done, n) => `Resume the quiz (${done} of ${n} done)`,
  sectionQuizAgain: 'Practise them again',
  passedNoDeck: 'These items now come up in your daily practice.',
  notPassed: "Passing takes 80% right first time. Repeated questions don't count towards the score.",
  itemTimesNote: 'Time to first answer. Red means it was missed first time.',
  attemptsNote: '80% is needed to pass.',
  itemDetailTitle: 'The answer',
  timesLabel: 'Times answered',
  rightLabel: 'Right',
  notAnswered: 'Not answered yet.',
  practiceTitle: 'Study log',
  practiceChart: 'Minutes studying',
  practiceStat: 'Study log',
  practiceNote: 'Time you log yourself, separate from time in quizzes.',
  practiceEmpty: 'No time logged yet. Start the timer when you sit down to study.',
  practiceWhat: 'What did you study? (optional)',
  practiceInsight: (m) => `You logged ${m} minute${m === 1 ? '' : 's'} of study over the last 7 days.`,
  slowNote: 'Median time to first answer.',
  firstAchievement: 'Pass your first section to unlock one.',
  reviewAll: (n) => `Review everything due (${plural(n, 'card')})`,
  reviewAllResume: 'Resume reviewing everything due',
  reviewPart: (n) => `Review ${plural(n, 'card')}`,
  weakestButton: (n) => `Review your weakest items (up to ${n})`,
  weakestNote: "Weakest means your most-missed items, then your slowest. This is extra practice, so it doesn't change when cards are due.",
  weakestTitle: 'Your weakest items',
  noAnswers: 'Pass a section quiz first, so there are answers to compare.',
  deckLearned: (n, total) => `${n} of ${total} items learned`,
  deckExtra: (n) => `Extra review of learned items (up to ${n})`,
  deckItemsTab: 'Items',
  lessonWord: 'Lesson',
  reviewAllTitle: 'Review everything due',
  reviewPartTitle: (part) => `${part.title} review`,
  sectionPassed: 'Section passed',
  sectionNotPassed: 'Section not passed',
  nextLesson: (l) => `Continue to Lesson ${l.number}: ${l.title}`,
  backToSection: 'Back to the section',
  rereadSection: 'Reread the section',
  missedTitle: (n) => `Items you got wrong (${n})`,
  missedNote: 'Tap an item name to see its details.',
  everyItemTitle: 'Every item, slowest first',
  itemTitle: 'Item',
  sectionsPassedStat: 'Sections passed',
  itemsLearnedStat: 'Items learned',
  forecastTitle: 'Cards due, next 14 days',
  progressTitle: 'Progress by part',
  sectionsPassedRow: 'sections passed',
  mostMissedTitle: 'Most-missed items',
  slowTitle: 'Slowest items',
  questionWord: () => 'Question',
  nothingDue: 'Nothing is due right now. Pass a section quiz to add its items to your reviews.',
};

// ---------- Shared pieces ----------

export function itemName(card) { return card.info.name; }

function resultBox(correct, heading, body, extra = '') {
  return html`<div class="result ${correct ? '' : 'bad'}">
    <div class="result-head">${icon(correct ? 'checkCircle' : 'crossCircle')}<span>${heading}</span></div>
    <div style="margin-top:6px">${body}</div>
    ${extra}
  </div>`;
}

function answerResult(app, attempt, ui, { heading, onTypo } = {}) {
  const spec = app.spec;
  const head = heading || spec.resultHeading(attempt);
  const typo = onTypo
    ? html`<button class="btn outline small" style="margin-top:10px" ${ui.onClick(onTypo)}>${spec.amendLabel ? spec.amendLabel(attempt) : 'It was a typo, count it as right'}</button>`
    : '';
  return resultBox(attempt.correct, head, spec.renderResult(attempt, ui, app), typo);
}

function deckSettingsPanel(app, part, ui) {
  const model = app.model;
  const settings = model.settingsFor(part);
  return html`<div>
    ${switchRow('Keep reviewing this part', 'Turn off once you know it well. Cards stop coming up, and your history is kept.', !settings.paused,
      ui.onChange((ev) => model.updateSettings(part, { paused: !ev.target.checked, dailyLimit: settings.dailyLimit })))}
    <div class="row" style="margin-top:6px">
      <span class="grow" style="font-weight:600">Daily card limit</span>
      <span class="chip" id="limit-${part.id}">${settings.dailyLimit}</span>
    </div>
    <input type="range" min="${MIN_DAILY_LIMIT}" max="${MAX_DAILY_LIMIT}" step="5" value="${settings.dailyLimit}" aria-label="Daily card limit for ${part.title}"
      oninput="document.getElementById('limit-${part.id}').textContent=this.value"
      ${ui.onChange((ev) => model.updateSettings(part, { paused: model.settingsFor(part).paused, dailyLimit: Number(ev.target.value) }))}>
  </div>`;
}

function forecastChart(model, part) {
  const f = part ? model.forecast(part, 14) : model.forecastAll(14);
  return barChart(f.map((n, i) => ({ label: aheadLabel(i), segments: [[n, ACCENT]] })));
}

// ---------- Reviews tab ----------

function reviewsTab(app, ui) {
  const model = app.model;
  const due = model.allReviewQueue.length;
  const saved = model.savedQuiz(SrsModel.reviewAllKey);
  const learned = model.course.parts.some((p) => model.summaryOf(p).totalCards > 0);
  return html`<div class="stack">
    ${saved || due > 0
      ? html`<a class="btn block" href="#/quiz/review-all">${saved ? app.text.reviewAllResume : app.text.reviewAll(due)}</a>`
      : html`<div class="notice">${app.text.nothingDue}</div>`}
    ${learned
      ? html`<button class="btn outline block" ${ui.onClick(() => openWeakestReview(app, ui))}>${app.text.weakestButton(EXTRA_REVIEW_SIZE)}</button>
        <p class="small">${app.text.weakestNote}</p>`
      : ''}
    <div style="height:6px"></div>
    ${model.course.parts.map((part) => deckCard(app, part, ui))}
  </div>`;
}

function deckCard(app, part, ui) {
  const model = app.model;
  const s = model.summaryOf(part);
  const saved = model.savedQuiz(SrsModel.reviewQuizKey(part));
  const items = partItemCount(app, part);
  return html`<div class="card">
    <a class="row" href="${path('deck', part.id)}" style="color:inherit;text-decoration:none">
      <span class="grow h3">${part.title}</span><span class="chevron">${icon('chevron')}</span>
    </a>
    <p class="small" style="margin:4px 0 10px">
      ${app.text.deckLearned(s.totalCards, items)} · ${s.reviewedToday} reviewed today · limit ${s.settings.dailyLimit}/day${s.heldBack > 0 ? ` · ${s.heldBack} held back` : ''}
    </p>
    <div class="stack">
      ${s.settings.paused
        ? html`<p class="label">Reviews paused</p>`
        : saved
          ? html`<a class="btn block" href="${path('quiz', 'review', part.id)}">Resume review</a>`
          : s.dueNow > 0
            ? html`<a class="btn block" href="${path('quiz', 'review', part.id)}">${app.text.reviewPart(s.dueNow)}</a>`
            : html`<p class="label">Nothing due right now</p>`}
      ${s.totalCards > 0 ? html`<button class="btn outline block" ${ui.onClick(() => openPartExtraReview(app, ui, part))}>Extra review</button>` : ''}
    </div>
  </div>`;
}

function partItemCount(app, part) {
  return app.spec.partItemCount ? app.spec.partItemCount(part) : part.sections.reduce((n, sec) => n + sec.cards.length, 0);
}

function deckCards(app, section) {
  return app.spec.deckCards ? app.spec.deckCards(section) : section.cards;
}

export function openPartExtraReview(app, ui, part) {
  ui.startQuiz({ kind: 'extra', part, title: `${part.title} extra review`, cards: () => shuffled(app.model.learnedCards(part)).slice(0, EXTRA_REVIEW_SIZE) });
}

export function openSectionExtraReview(app, ui, part, section) {
  ui.startQuiz({ kind: 'extra', part, title: `Extra review: ${section.title}`, cards: () => deckCards(app, section) });
}

export function openWeakestReview(app, ui) {
  const cards = app.model.weakestCards(app.model.loadStudyStats(), EXTRA_REVIEW_SIZE);
  if (!cards.length) {
    toast(app.text.noAnswers);
    return;
  }
  ui.startQuiz({ kind: 'extra', part: null, title: app.text.weakestTitle, cards: () => cards });
}

// ---------- Deck screen ----------

function deckScreen(app, part, tab) {
  return {
    title: `${part.title} reviews`,
    render(ui) {
      const model = app.model;
      const s = model.summaryOf(part);
      const saved = s.settings.paused ? null : model.savedQuiz(SrsModel.reviewQuizKey(part));
      const tabs = [['items', app.text.deckItemsTab], ['stats', 'Stats'], ['settings', 'Settings']];
      const body = tab === 'stats' ? deckStats(app, part) : tab === 'settings' ? deckSettingsPanel(app, part, ui) : deckItems(app, part, ui);
      return html`<div class="stack">
        ${s.dueNow > 0 || saved ? html`<a class="btn block" href="${path('quiz', 'review', part.id)}">${saved ? 'Resume review' : app.text.reviewPart(s.dueNow)}</a>` : ''}
        ${s.totalCards > 0 ? html`<button class="btn outline block" ${ui.onClick(() => openPartExtraReview(app, ui, part))}>${app.text.deckExtra(EXTRA_REVIEW_SIZE)}</button>` : ''}
        <nav class="tabs" style="padding:0;margin-top:8px">
          ${tabs.map(([id, label]) => html`<a href="${path('deck', part.id)}?tab=${id}" class="${id === tab ? 'active' : ''}">${label}</a>`)}
        </nav>
        <div>${body}</div>
      </div>`;
    },
  };
}

function deckItems(app, part, ui) {
  const model = app.model;
  const scores = model.store.itemScores(part.id);
  const status = (card) => {
    const stored = model.storedCard(card.id);
    const days = stored ? model.daysUntil(stored.card.due) : null;
    const schedule = !stored ? 'Not learned yet' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`;
    const sc = scores[card.id];
    return sc ? `${schedule} · ${sc.correct}/${sc.total} right (${Math.round((sc.correct * 100) / sc.total)}%)` : schedule;
  };
  const lessons = model.course.lessons.filter((l) => l.sections.some((s) => s.deckId === part.id));
  if (!lessons.length) return html`<p class="muted">No items in this part.</p>`;
  return html`${lessons.map((lesson) => html`
    <h3 class="h3 section-title">${app.text.lessonWord} ${lesson.number}: ${lesson.title}</h3>
    ${lesson.sections.filter((s) => s.deckId === part.id).map((section) => html`
      <div class="row" style="margin-top:8px">
        <span class="grow label" lang="ja">${section.title}</span>
        ${model.statusOf(section) === SectionStatus.passed ? html`<button class="btn text small" ${ui.onClick(() => openSectionExtraReview(app, ui, part, section))}>Extra review</button>` : ''}
      </div>
      <div class="list">
        ${deckCards(app, section).map((card) => html`<a class="list-item" href="${path('item', card.id)}">
          <span class="grow"><span lang="ja">${itemName(card)}</span><div class="sub">${status(card)}</div></span>
          <span class="chevron">${icon('chevron')}</span>
        </a>`)}
      </div>`)}`)}`;
}

function deckStats(app, part) {
  const model = app.model;
  const s = model.summaryOf(part);
  const items = partItemCount(app, part);
  const spread = model.intervalSpread(part);
  const widest = Math.max(1, ...Object.values(spread));
  const month = model.reviewHistory(part, 30);
  const fortnight = month.slice(-14);
  const reviews = month.reduce((n, d) => n + d.total, 0);
  const right = month.reduce((n, d) => n + d.correct, 0);
  return html`
    ${statGrid([
      [app.text.itemsLearnedStat, `${s.totalCards}/${items}`],
      ['Due now', s.dueNow],
      ['Held back', s.heldBack],
      ['Reviewed today', s.reviewedToday],
      ['Reviews, 30 days', reviews],
      ['Right, 30 days', reviews === 0 ? '-' : `${Math.round((right * 100) / reviews)}%`],
    ])}
    ${statSection('Reviews, last 14 days', html`${legend([[GOOD, 'Correct'], [BAD, 'Wrong']])}${barChart(fortnight.map((d, i) => ({ label: dayLabel(i, fortnight.length), segments: [[d.correct, GOOD], [d.total - d.correct, BAD]] })))}`)}
    ${statSection('Cards due, next 14 days', forecastChart(model, part), 'Before the daily limit is applied.')}
    ${statSection('How far apart cards are scheduled', Object.entries(spread).map(([k, v]) => barRow({ label: k, fraction: v / widest, value: v })), 'Longer gaps mean the app expects you to remember them longer.')}`;
}

// ---------- Section screen ----------

function sectionScreen(app, section) {
  return {
    title: (() => { const l = app.model.course.lessonOf(section); return app.spec.sectionScreenTitle ? app.spec.sectionScreenTitle(l, section) : `Lesson ${l.number} · ${l.title}`; })(),
    render(ui) {
      const model = app.model;
      const text = app.text;
      const passed = model.statusOf(section) === SectionStatus.passed;
      const key = SrsModel.sectionQuizKey(section);
      const saved = model.savedQuiz(key);
      const n = model.quizCards(section).length;
      const marked = section.cards.length - n;
      const quizHash = path('quiz', 'section', section.id);
      const tx = (t, ...args) => (typeof t === 'function' ? t(...args) : t);
      return html`<div class="stack-lg">
        ${app.spec.renderSectionBody ? '' : html`<h1 class="h1" lang="ja">${section.title}</h1>`}
        ${model.statusOf(section) === SectionStatus.locked ? html`<div class="notice">This section is still locked. You can read it, and unlock it early to take its quiz.</div>` : ''}
        ${app.spec.renderSectionBody ? app.spec.renderSectionBody(section, ui, app) : section.blocks.map((b) => app.spec.renderBlock(b, ui, app))}
        ${section.cards.length > 0 && (n > 0 || !passed) ? html`<div class="stack" style="position:sticky;bottom:0;padding:12px 0;background:linear-gradient(transparent,var(--bg) 30%)">
          ${model.statusOf(section) === SectionStatus.locked
            ? html`<button class="btn block" ${ui.onClick(() => offerUnlock(app, section))}>Unlock early</button>`
            : n === 0
              ? html`<button class="btn block" ${ui.onClick(async () => {
                await model.passSection(model.course.partOf(section), section, new Map());
                updatePlanFromApp(app.spec.id, { reviewsLeft: model.allReviewQueue.length, sectionsDone: model.totalPassed });
              })}>Mark this part as done</button>`
              : html`<a class="btn block" href="${quizHash}">${saved ? text.sectionQuizResume(model.savedQuizAnswered(saved), n, section) : passed ? tx(text.sectionQuizAgain, section) : text.sectionQuizStart(n, section)}</a>`}
          ${saved ? html`<button class="btn text" ${ui.onClick(async () => { await model.clearQuizProgress(key); ui.go(quizHash); })}>Start again</button>` : ''}
          ${marked ? html`<p class="small" style="text-align:center;margin:0">${plural(marked, 'item')} marked as already known${n ? ', so the quiz skips them' : ''}.</p>` : ''}
        </div>` : ''}
      </div>`;
    },
  };
}

/**
 * "I already know this" for one item in a lesson, made of [cardIds]. Marked
 * items skip the lesson quiz and join the reviews as known (see markKnown).
 * Shows nothing once the item is being studied, or if it has no review deck.
 */
export function knownToggle(app, ui, cardIds) {
  const model = app.model;
  if (!model.canMarkKnown(cardIds)) return '';
  const on = cardIds.every((id) => model.isMarkedKnown(id));
  return html`<button class="chip known-toggle ${on ? 'on' : ''}" type="button" aria-pressed="${on}"
    title="${on ? 'Undo: learn it in the quiz after all' : 'Skip it in the quiz and check it in a month'}"
    ${ui.onClick(() => (on ? model.unmarkKnown(cardIds) : model.markKnown(cardIds)))}>${on ? html`${icon('check')} Known` : 'I already know this'}</button>`;
}

export async function offerUnlock(app, section) {
  const ok = await confirmDialog('Unlock early?', `"${section.title}" normally opens after the part before it. You can unlock it now to go faster.`, 'Unlock', 'Not now');
  if (ok) await app.model.unlockEarly(section);
}

// ---------- Quiz ----------

function quizScreen(app, config) {
  const model = app.model;
  const spec = app.spec;
  const isExtra = config.kind === 'extra';
  const isReview = config.kind === 'review' || config.kind === 'reviewAll';
  const section = config.kind === 'section' ? config.section : null;
  const part = config.kind === 'section' ? model.course.partOf(section) : config.part || null;
  const quizKey = isExtra ? null : section ? SrsModel.sectionQuizKey(section) : config.kind === 'reviewAll' ? SrsModel.reviewAllKey : SrsModel.reviewQuizKey(part);
  const amendable = !!spec.amendable;
  const st = {};
  let saving = Promise.resolve();

  const title = config.title || (section ? section.title : part ? app.text.reviewPartTitle(part) : app.text.reviewAllTitle);

  function begin(resume = true) {
    st.alreadyPassed = section != null && model.statusOf(section) === SectionStatus.passed;
    st.last = null;
    st.finished = false;
    st.passed = null;
    st.pendingFirstTry = null;
    st.fresh = [];
    const saved = resume && quizKey ? model.savedQuiz(quizKey) : null;
    const restored = saved ? QuizEngine.restore(JSON.parse(saved.data), (id) => model.course.cardById(id), spec.outcomeFromJson) : null;
    if (restored) {
      st.engine = restored;
      st.session = saved.sessionId;
      st.last = restored.attempts.length ? restored.attempts[restored.attempts.length - 1] : null;
    } else {
      if (quizKey) {
        model.clearQuizProgress(quizKey);
        if (isReview) model.clearOverlappingReviews(quizKey);
      }
      const cards = isExtra
        ? config.cards()
        : section
          ? model.quizCards(section)
          : (config.kind === 'reviewAll' ? model.allReviewQueue : model.reviewQueue(part)).map((id) => model.course.cardById(id));
      st.engine = new QuizEngine(cards);
      st.session = model.startSession({ kind: isReview ? 'review' : st.alreadyPassed || isExtra ? 'practice' : 'section', part, section });
    }
    showQuestion();
  }

  function showQuestion() {
    st.view = {};
    st.shownAt = performance.now();
    st.questionNumber = (st.questionNumber || 0) + 1;
  }

  function save(attempt, firstTry, snapshot) {
    saving = saving.then(async () => {
      await model.logAnswer({
        sessionId: st.session,
        part: model.course.partOfCard(attempt.card),
        cardId: attempt.card.id,
        round: attempt.round,
        correct: attempt.correct,
        time: attempt.time,
        given: spec.givenText(attempt.outcome),
      });
      if (isReview && firstTry) await model.recordReview(attempt.card.id, { correct: attempt.correct, rating: attempt.outcome.rating });
      if (snapshot && quizKey) await model.saveQuizProgress(quizKey, st.session, snapshot);
    });
  }

  /** Saves the held-back answer, if there is one. */
  function commitPending(snapshot) {
    if (!st.last || st.pendingFirstTry == null) return;
    const firstTry = st.pendingFirstTry;
    st.pendingFirstTry = null;
    if (spec.onCommit) spec.onCommit(st.last, firstTry);
    save(st.last, firstTry, snapshot);
  }

  function answer(outcome, ui) {
    if (performance.now() - st.shownAt < INPUT_DELAY || st.finished || st.engine.isFinished) return;
    const engine = st.engine;
    if (amendable) commitPending(engine.snapshot());
    const firstTry = engine.round === 1;
    const attempt = engine.answer(outcome, performance.now() - st.shownAt);
    st.last = attempt;
    if (amendable) st.pendingFirstTry = firstTry;
    else save(attempt, firstTry, engine.isFinished ? null : engine.snapshot());
    if (engine.isFinished) {
      if (amendable) commitPending(null);
      finish(ui);
    } else {
      showQuestion();
      ui.render();
      window.scrollTo(0, 0);
    }
  }

  function countAsTypo(ui) {
    if (!st.last || st.last.correct) return;
    const engine = st.engine;
    const changed = engine.amendLastAsTypo(spec.amendOutcome);
    st.last = engine.attempts[engine.attempts.length - 1];
    if (changed && !engine.isFinished) showQuestion();
    if (engine.isFinished) {
      commitPending(null);
      finish(ui);
    } else ui.render();
  }

  async function finish(ui) {
    st.finishing = true;
    ui.render();
    await saving;
    if (quizKey) await model.clearQuizProgress(quizKey);
    if (config.onFinished) await config.onFinished();
    const engine = st.engine;
    let passed = null;
    if (section) {
      passed = model.isPassingScore(engine.firstTryCorrect, engine.total);
      if (passed && !st.alreadyPassed) await model.passSection(part, section, engine.firstTryResults);
    }
    await model.finishSession(st.session, { itemCount: engine.total, firstTryCorrect: engine.firstTryCorrect, passed });
    st.passed = passed;
    // Today's plan, with this app's steps ticked off if they're now done.
    st.plan = updatePlanFromApp(spec.id, { reviewsLeft: model.allReviewQueue.length, sectionsDone: model.totalPassed });
    st.finished = true;
    st.finishing = false;
    const stats = model.loadStudyStats();
    const fresh = await model.updateAchievements(stats);
    if (spec.onQuizFinished) await spec.onQuizFinished(model, stats);
    if (ui.screen === screen) {
      ui.render();
      window.scrollTo(0, 0);
    }
    celebrate(fresh);
    app.writeSummary();
  }

  const screen = {
    title,
    state: st,
    ignoreModel: true,
    onLeave() { if (amendable && !st.finished && st.engine && !st.engine.isFinished) commitPending(st.engine.snapshot()); },
    render(ui) {
      if (!st.engine) begin();
      const engine = st.engine;
      if (st.finished) return quizSummary(app, ui, { engine, part, section, passed: st.passed, alreadyPassed: st.alreadyPassed, isExtra, isReview, plan: st.plan, onTryAgain: () => { begin(false); ui.render(); } });
      if (engine.total === 0) return html`<div class="notice" style="margin-top:20px">Nothing to review right now.</div><div style="margin-top:12px"><button class="btn outline" ${ui.onClick(() => ui.back())}>Back</button></div>`;
      if (engine.isFinished || st.finishing) return html`<div class="spinner"></div>`;
      const done = (engine.total - engine.remaining) / engine.total;
      return html`<div class="stack">
        <div class="quiz-progress">${progressBar(done)}</div>
        <p class="label">${engine.round === 1
          ? `${app.text.questionWord(engine.currentQuestion)} ${engine.positionInRound} of ${engine.roundSize}`
          : `Round ${engine.round}: repeating missed questions · ${engine.positionInRound} of ${engine.roundSize}`}</p>
        <div>${spec.renderQuestion({ question: engine.currentQuestion, card: engine.currentCard, view: st.view, ui, app, answer: (o) => answer(o, ui), key: st.questionNumber })}</div>
        ${spec.renderBelowQuestion ? spec.renderBelowQuestion(engine.currentQuestion, ui, app) : ''}
        ${st.last ? html`<div style="margin-top:20px">${answerResult(app, st.last, ui, { onTypo: amendable && st.pendingFirstTry != null && !st.last.correct && (!spec.canAmend || spec.canAmend(st.last)) ? () => countAsTypo(ui) : null })}</div>` : ''}
      </div>`;
    },
  };
  return screen;
}

export function celebrate(fresh) {
  if (!fresh.length) return;
  toast(fresh.length === 1 ? `🏆 Achievement unlocked: ${fresh[0].title}` : `🏆 ${fresh.length} achievements unlocked: ${fresh.map((a) => a.title).join(', ')}`, 5000);
}

/** The way on to the next step of today's plan, or a note that it's all done. */
function planButton(app, plan) {
  if (!plan || !plan.steps.length) return '';
  const step = nextStep(plan);
  if (!step) return html`<a class="btn tonal block" href="../index.html">${icon('checkCircle')} Today's plan is done</a>`;
  return html`<a class="btn tonal block" href="${stepHref(step, app.spec.id)}">Next in today's plan: ${step.label}</a>`;
}

function quizSummary(app, ui, { engine, part, section, passed, alreadyPassed, isExtra, isReview, plan, onTryAgain }) {
  const model = app.model;
  const text = app.text;
  const next = section ? model.course.sectionAfter(section) : null;
  const firsts = engine.firstTries;
  const percent = Math.round((engine.firstTryCorrect * 100) / engine.total);
  const totalTime = engine.attempts.reduce((s, a) => s + a.time, 0);
  const times = firsts.map((a) => a.time).sort((a, b) => a - b);
  const missed = firsts.filter((a) => !a.correct);
  const tries = (card) => engine.attempts.filter((a) => a.card.id === card.id).length;
  const openItem = (card) => ui.onClick(() => ui.go(path('item', card.id)));

  const headline = isExtra ? 'Extra review complete' : isReview ? 'Review complete' : alreadyPassed ? 'Practice complete' : passed ? text.sectionPassed : text.sectionNotPassed;
  const outcome = isExtra
    ? "Extra reviews count in your stats, but don't change when cards are due."
    : isReview
      ? "First answers have updated each card's schedule."
      : alreadyPassed
        ? "Practice doesn't change your card schedules."
        : passed
          ? part ? `These items are now in your ${part.title} reviews.` : text.passedNoDeck
          : text.notPassed;

  const nextLabel = () => {
    const nextLesson = model.course.lessonOf(next);
    if (nextLesson !== model.course.lessonOf(section)) return text.nextLesson(nextLesson);
    return `Next: ${next.title}`;
  };

  const actions = html`<div class="stack">
    ${passed === false ? html`<button class="btn block" ${ui.onClick(onTryAgain)}>Try again</button>` : ''}
    ${isExtra ? html`<button class="btn block" ${ui.onClick(onTryAgain)}>Do another extra review</button>` : ''}
    ${passed === true && next ? html`<button class="btn block" ${ui.onClick(() => ui.backThenReplace(path('section', next.id)))}>${nextLabel()}</button>` : ''}
    ${planButton(app, plan)}
    <button class="btn outline block" ${ui.onClick(() => ui.back())}>${section ? (passed === false ? text.rereadSection : text.backToSection) : 'Done'}</button>
  </div>`;

  const bySkill = new Map();
  for (const a of firsts) {
    if (!bySkill.has(a.question.skill)) bySkill.set(a.question.skill, []);
    bySkill.get(a.question.skill).push(a);
  }

  const rounds = [];
  for (let r = 1; r <= engine.round; r++) {
    rounds.push({
      label: `Round ${r}`,
      segments: [
        [engine.attempts.filter((a) => a.round === r && a.correct).length, GOOD],
        [engine.attempts.filter((a) => a.round === r && !a.correct).length, BAD],
      ],
    });
  }

  const sorted = firsts.slice().sort((a, b) => b.time - a.time);
  const slowest = sorted[0].time;

  let nextReviews = '';
  if (isReview) {
    const rows = firsts.map((a) => [a, model.daysUntil(model.storedCard(a.card.id).card.due)]).sort((x, y) => x[1] - y[1]);
    const longest = Math.max(1, ...rows.map((r) => r[1]));
    nextReviews = html`
      ${statSection('When each card comes back', rows.map(([a, d]) => barRow({ label: itemName(a.card), fraction: d / longest, value: `in ${plural(d, 'day')}`, tap: openItem(a.card), ja: true })))}
      ${statSection('Cards due in the next 14 days', forecastChart(model, part))}`;
  }

  let attempts = '';
  if (section && !isReview && !isExtra) {
    const list = model.store.sectionAttempts(section.id);
    if (list.length) {
      attempts = statSection('First-try score across your attempts', barChart(list.map((a, i) => ({ label: `#${i + 1}`, segments: [[Math.round((a.firstTryCorrect * 100) / a.itemCount), ACCENT]] })), { suffix: '%' }), text.attemptsNote);
    }
  }

  return html`<div class="stack">
    ${answerResult(app, engine.attempts[engine.attempts.length - 1], ui)}
    <h2 class="h1" style="margin-top:18px">${headline}</h2>
    <p>${outcome}</p>
    ${statGrid([
      ['First-try score', `${percent}%`],
      ['Right first time', `${engine.firstTryCorrect}/${engine.total}`],
      ['Missed', missed.length],
      ['Rounds', engine.round],
      ['Answers given', engine.attempts.length],
      ['Total time', formatLong(totalTime)],
      ['Median first answer', formatSeconds(times[Math.floor(times.length / 2)])],
      ['Slowest', formatSeconds(times[times.length - 1])],
      ['Fastest', formatSeconds(times[0])],
    ])}
    ${actions}
    ${engine.round > 1 ? statSection('Answers per round', html`${legend([[GOOD, 'Correct'], [BAD, 'Wrong']])}${barChart(rounds)}`) : ''}
    ${statSection('First-try score by skill', [...bySkill.entries()].map(([skill, list]) => {
      const right = list.filter((a) => a.correct).length;
      return barRow({ label: skill, fraction: right / list.length, value: `${right}/${list.length} · ${Math.round((right * 100) / list.length)}%` });
    }))}
    ${missed.length ? statSection(text.missedTitle(missed.length), html`<div class="stack">${missed.map((a) => html`
      <a class="row" href="${path('item', a.card.id)}" style="color:inherit;text-decoration:none;margin-top:6px">
        <span class="grow h3" lang="ja">${itemName(a.card)} <span class="small">· ${plural(tries(a.card), 'try', 'tries')}</span></span><span class="chevron">${icon('chevron')}</span>
      </a>
      ${answerResult(app, a, ui, { heading: 'First answer: not quite' })}`)}</div>`, text.missedNote) : ''}
    ${statSection(text.everyItemTitle, sorted.map((a) => barRow({
      label: `${a.correct ? '✓' : '✗'} ${itemName(a.card)}`,
      fraction: slowest === 0 ? 0 : a.time / slowest,
      value: `${formatSeconds(a.time)} · ${plural(tries(a.card), 'try', 'tries')}`,
      color: a.correct ? null : BAD,
      tap: openItem(a.card),
      ja: true,
    })), text.itemTimesNote)}
    ${nextReviews}
    ${attempts}
  </div>`;
}

// ---------- Item screen ----------

function itemScreen(app, card) {
  return {
    title: app.text.itemTitle,
    render(ui) {
      const model = app.model;
      const text = app.text;
      const section = model.course.sectionOfCard(card) || (app.spec.sectionForCard ? app.spec.sectionForCard(card) : null);
      const question = card.build(seeded(0));
      const stored = model.storedCard(card.id);
      const answers = model.store.itemAnswers(card.id);
      const right = answers.filter((a) => a.correct).length;
      const days = stored ? model.daysUntil(stored.card.due) : null;
      return html`<div class="stack">
        <h1 class="ja-l" lang="ja">${card.info.name}</h1>
        <p>${card.info.definition}</p>
        ${(() => { const d = app.spec.renderItemDetail && app.spec.renderItemDetail(card, question, ui, app); return d ? statSection(text.itemDetailTitle, d) : ''; })()}
        ${section ? statSection('Taught in', model.statusOf(section) === SectionStatus.locked
          ? html`<p lang="ja">${section.title} (locked)</p>`
          : html`<a class="btn outline" href="${path('section', section.id)}" lang="ja">${text.lessonWord} ${model.course.lessonOf(section).number}: ${section.title}</a>`) : ''}
        ${statSection('Your record', html`
          ${statGrid([
            ['Next review', !stored ? 'Not in reviews' : days === 0 ? 'Today' : `In ${days} d`],
            ['Stability', stored && stored.card.stability != null ? `${stored.card.stability.toFixed(1)} d` : '-'],
            [text.timesLabel, answers.length],
            [text.rightLabel, answers.length ? `${Math.round((right * 100) / answers.length)}%` : '-'],
          ])}
          <div style="margin-top:12px">
            ${answers.length === 0 ? html`<p class="small">${text.notAnswered}</p>` : answers.map((a) => html`
              <div class="row small" style="padding:3px 0">
                <span class="${a.correct ? 'good-text' : 'bad-text'}" style="width:16px;height:16px;display:inline-flex">${icon(a.correct ? 'check' : 'cross')}</span>
                <span>${new Date(a.at).getDate()}/${new Date(a.at).getMonth() + 1} · ${a.kind === 'review' ? 'Review' : a.kind === 'section' ? 'Lesson quiz' : 'Practice'} · ${formatSeconds(a.millis)}${app.spec.showGiven && a.given ? ' · ' : ''}${app.spec.showGiven && a.given ? html`<span lang="ja">${a.given}</span>` : ''}</span>
              </div>`)}
          </div>`)}
      </div>`;
    },
  };
}

// ---------- Stats tab ----------

function runFocus(app, ui, action) {
  switch (action.type) {
    case 'reviewPart': return ui.go(path('quiz', 'review', action.part.id));
    case 'openSection': return ui.go(path('section', action.section.id));
    case 'openDeck': return ui.go(path('deck', action.part.id));
    case 'reviewWeakest': return ui.startQuiz({ kind: 'extra', part: null, title: app.text.weakestTitle, cards: () => action.cards });
    default: return app.spec.runFocus ? app.spec.runFocus(action, ui, app) : null;
  }
}

function statsTab(app, ui) {
  const model = app.model;
  const course = model.course;
  const text = app.text;
  const stats = model.loadStudyStats();
  const spec = app.spec;
  const focus = buildFocusAreas(model, stats, { lessonWord: text.lessonWord, ...(spec.focusExtra ? spec.focusExtra(model, stats) : {}) });
  const insights = buildInsights(model, stats, { practiceText: text.practiceInsight, extra: spec.insightsExtra ? spec.insightsExtra(model, stats) : [] });
  const hasAnswers = stats.answers.length > 0;
  // Achievements are checked whenever the stats are shown, as in the apps.
  model.updateAchievements(stats).then((fresh) => {
    if (fresh.length) { celebrate(fresh); app.writeSummary(); if (ui.screen && ui.screen.tab === 'stats') ui.render(); }
  });
  if (!model.lastFacts) model.lastFacts = model.achievementFacts(stats);

  const learned = course.parts.reduce((n, p) => n + model.summaryOf(p).totalCards, 0);
  const totalItems = course.parts.reduce((n, p) => n + partItemCount(app, p), 0);
  const due = course.parts.reduce((n, p) => n + model.summaryOf(p).dueNow, 0);
  const recall = model.overallRecall;
  const minutes = Math.floor(stats.totalMillis / 60000);
  const days = stats.daily(14);

  const unlocked = model.unlocked;
  const all = model.achievements;
  const latest = all.filter((a) => a.id in unlocked).sort((a, b) => unlocked[b.id] - unlocked[a.id]);

  const scoreRows = (scores) => scores.map((s) => barRow({ label: s.label, fraction: s.fraction, value: `${s.right}/${s.total} · ${s.percent}%` }));

  const forecast = model.forecastAll(14);
  const worst = stats.topTrouble.length ? Math.max(...stats.topTrouble.map((i) => i.misses)) : 1;

  return html`<div>
    ${statGrid([
      [text.sectionsPassedStat, `${model.totalPassed}/${course.allSections.length}`],
      [text.itemsLearnedStat, `${learned}/${totalItems}`],
      ['Due now', due],
      ['First-try score', stats.firstTry.total === 0 ? '-' : `${stats.firstTry.percent}%`],
      ['Predicted recall', recall == null ? '-' : `${Math.round(recall * 100)}%`],
      ['Answers', stats.answers.length],
      ['Time in quizzes', minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`],
      ['Current streak', `${stats.currentStreak} d`],
      ['Longest streak', `${stats.longestStreak} d`],
      [`${text.practiceStat}, 7 days`, formatMinutes(stats.practiceSecondsOver(7))],
      [`${text.practiceStat}, all time`, formatMinutes(stats.totalPracticeSeconds)],
      ['Active days', stats.activeDays],
      ...(spec.overviewExtra ? spec.overviewExtra(model, stats) : []),
    ])}
    ${statSection('Achievements', html`<a class="card tappable" href="#/achievements" style="display:block;color:inherit;text-decoration:none">
      <div class="row"><span style="font-size:1.8rem">🏆</span><span class="grow h3">${Object.keys(unlocked).length} of ${all.length} unlocked</span><span class="chevron">${icon('chevron')}</span></div>
      <div style="margin-top:10px">${progressBar(Object.keys(unlocked).length / all.length)}</div>
      ${latest.length
        ? html`<p class="label" style="margin-top:12px">Latest</p><div class="wrap" style="margin-top:4px">${latest.slice(0, 3).map((a) => html`<span class="chip">${a.icon} ${a.title}</span>`)}</div>`
        : html`<p class="small" style="margin-top:8px">${text.firstAchievement}</p>`}
    </a>`)}
    ${statSection('Recommended focus', focus.length
      ? focus.map((area) => html`<div style="margin-bottom:16px">
          <div class="h3" style="font-size:.95rem">${area.title}</div>
          <p class="small" style="margin:2px 0 8px;color:var(--ink)">${area.reason}</p>
          <button class="btn outline small" ${ui.onClick(() => runFocus(app, ui, area.action))}>${area.actionLabel}</button>
        </div>`)
      : html`<p>Nothing needs attention right now.</p>`)}
    ${insights.length ? statSection('Insights', html`<div class="stack">${insights.map((i) => html`<p>${i}</p>`)}</div>`) : ''}
    ${spec.statsExtra ? spec.statsExtra(model, stats, ui, app) : ''}
    ${statSection(`${text.practiceChart}, last 14 days`, html`
      ${stats.practice.length ? barChart(days.map((d, i) => ({ label: dayLabel(i, days.length), segments: [[Math.round(d.practiceSeconds / 60), ACCENT]] }))) : html`<p>Nothing logged yet.</p>`}
      <a class="btn outline small" style="margin-top:10px" href="#/practice">Open ${text.practiceTitle.toLowerCase()}</a>`, text.practiceNote)}
    ${hasAnswers ? html`
      ${statSection('Answers, last 14 days', html`${legend([[GOOD, 'Correct'], [BAD, 'Wrong']])}${barChart(days.map((d, i) => ({ label: dayLabel(i, days.length), segments: [[d.right, GOOD], [d.wrong, BAD]] })))}`)}
      ${statSection('Minutes in quizzes, last 14 days', barChart(days.map((d, i) => ({ label: dayLabel(i, days.length), segments: [[Math.round(d.millis / 6000) / 10, ACCENT]] }))))}
      ${statSection('First-try score by skill', scoreRows([...stats.bySkill.values()].sort((a, b) => a.fraction - b.fraction)), 'Lowest first.')}` : ''}
    ${statSection(text.forecastTitle, barChart(forecast.map((n, i) => ({ label: aheadLabel(i), segments: [[n, ACCENT]] }))), 'All active parts, before daily limits are applied.')}
    ${statSection(text.progressTitle, course.parts.map((part) => {
      const r = model.averageRecall(part);
      return html`${barRow({ label: `${part.title}: ${text.sectionsPassedRow}`, fraction: model.passedCount(part) / Math.max(1, part.sections.length), value: `${model.passedCount(part)}/${part.sections.length}`, tap: ui.onClick(() => ui.go(path('deck', part.id))) })}
        ${barRow({ label: `${part.title}: predicted recall`, fraction: r || 0, value: r == null ? 'No cards yet' : `${Math.round(r * 100)}%`, tap: ui.onClick(() => ui.go(path('deck', part.id))) })}`;
    }))}
    ${hasAnswers ? html`
      ${stats.byLesson.size ? statSection(spec.byLessonTitle || 'First-try score by lesson', course.lessons.filter((l) => stats.byLesson.has(l)).map((l) => {
        const s = stats.byLesson.get(l);
        return barRow({ label: `${text.lessonWord} ${l.number}: ${l.title}`, fraction: s.fraction, value: `${s.right}/${s.total} · ${s.percent}%` });
      })) : ''}
      ${stats.topTrouble.length ? statSection(text.mostMissedTitle, stats.topTrouble.map((i) => barRow({ label: itemName(i.card), fraction: i.misses / worst, value: `${i.misses} of ${i.total} wrong`, color: BAD, tap: ui.onClick(() => ui.go(path('item', i.card.id))), ja: true })), 'At least 2 misses and 70% or less right. Tap for details.') : ''}
      ${stats.slowItems.length ? statSection(text.slowTitle, stats.slowItems.map((i) => barRow({ label: itemName(i.card), fraction: i.medianMillis / stats.slowItems[0].medianMillis, value: formatSeconds(i.medianMillis), tap: ui.onClick(() => ui.go(path('item', i.card.id))), ja: true })), text.slowNote) : ''}
    ` : html`<p style="margin-top:20px">Answer some quiz questions to see your activity, skills and trouble spots here.</p>`}
  </div>`;
}

// ---------- Achievements ----------

function achievementsScreen(app) {
  return {
    title: 'Achievements',
    render() {
      const model = app.model;
      if (!model.lastFacts) model.lastFacts = model.achievementFacts(model.loadStudyStats());
      const unlocked = model.unlocked;
      return html`<div class="stack">
        <p class="label">${Object.keys(unlocked).length} of ${model.achievements.length} unlocked</p>
        ${model.achievements.map((a) => {
          const when = unlocked[a.id];
          const done = when != null;
          const hidden = a.secret && !done;
          const progress = Math.max(0, Math.min(a.target, model.achievementProgress(a)));
          return html`<div class="ach ${done ? 'done' : ''}">
            <div class="ach-badge">${hidden ? '🔒' : a.icon}</div>
            <div class="grow" style="flex:1;min-width:0">
              <div class="h3" style="font-size:.95rem">${hidden ? 'Secret' : a.title}</div>
              <p class="small">${hidden ? 'Keep studying to find this one.' : a.description}</p>
              ${done ? html`<p class="tiny" style="margin-top:4px">Unlocked ${longDate(new Date(when))}</p>`
                : hidden ? '' : html`<div style="margin-top:6px">${progressBar(progress / a.target)}</div><p class="tiny" style="margin-top:2px">${progress} / ${a.target}</p>`}
            </div>
          </div>`;
        })}
      </div>`;
    },
  };
}

// ---------- Practice log ----------

function clockText(ms) {
  const s = Math.floor(ms / 1000);
  const two = (n) => String(n).padStart(2, '0');
  const h = Math.floor(s / 3600);
  return h > 0 ? `${h}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}` : `${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`;
}

async function askToSave(app, seconds) {
  const r = await dialog({
    title: 'Log practice',
    body: html`<label class="label">Minutes<input class="field" name="minutes" type="number" min="1" max="999" inputmode="numeric" value="${seconds ? Math.ceil(seconds / 60) : ''}" ${seconds ? '' : raw('autofocus')}></label>
      <label class="label" style="display:block;margin-top:10px">${app.text.practiceWhat}<input class="field" name="note" maxlength="120"></label>`,
    actions: [{ label: 'Cancel', value: false, kind: 'text' }, { label: 'Save', value: true }],
    onInput(form, d) {
      const v = parseInt(form.elements.minutes.value, 10);
      d.querySelector('.actions .btn:last-child').disabled = !(v > 0);
    },
  });
  if (!r || !r.value) return false;
  const minutes = Math.min(999, parseInt(r.fields.minutes, 10) || 0);
  if (minutes <= 0) return false;
  await app.model.logPractice(minutes * 60, r.fields.note);
  return true;
}

function practiceScreen(app) {
  let ticker = null;
  return {
    title: app.text.practiceTitle,
    onLeave() { clearInterval(ticker); },
    render(ui) {
      const model = app.model;
      const text = app.text;
      const entries = model.store.practiceEntries();
      const now = model.now();
      const start = startOfDay(now);
      const since = (from) => entries.filter((e) => e.at >= from).reduce((s, e) => s + e.seconds, 0);
      const total = entries.reduce((s, e) => s + e.seconds, 0);
      const longest = entries.reduce((m, e) => Math.max(m, e.seconds), 0);
      const totals = new Array(14).fill(0);
      for (const e of entries) {
        const back = Math.round((start - startOfDay(e.at)) / 86400000);
        if (back >= 0 && back < 14) totals[13 - back] += e.seconds;
      }
      const started = model.timerStarted;
      clearInterval(ticker);
      if (started) {
        ticker = setInterval(() => {
          const el = document.getElementById('practice-clock');
          if (el) el.textContent = clockText(Date.now() - started);
          else clearInterval(ticker);
        }, 1000);
      }
      return html`<div class="stack">
        <div class="card accent" style="text-align:center">
          <div id="practice-clock" style="font-size:2.8rem;font-weight:700;font-variant-numeric:tabular-nums">${clockText(started ? now - started : 0)}</div>
          <div class="stack" style="margin-top:10px">
            ${started
              ? html`<button class="btn block" ${ui.onClick(async () => { if (await askToSave(app, Math.floor((Date.now() - started) / 1000))) await model.clearPracticeTimer(); })}>Finish and log</button>
                <button class="btn text" ${ui.onClick(() => model.clearPracticeTimer())}>Discard timer</button>`
              : html`<button class="btn block" ${ui.onClick(() => model.startPracticeTimer())}>Start practice timer</button>`}
          </div>
          <p class="tiny" style="margin-top:8px">The timer keeps running if you close the page.</p>
        </div>
        <button class="btn outline block" ${ui.onClick(() => askToSave(app, 0))}>Add time without the timer</button>
        <div style="height:8px"></div>
        ${statGrid([
          ['Today', formatMinutes(since(start))],
          ['Last 7 days', formatMinutes(since(startOfDay(now, -6)))],
          ['Last 30 days', formatMinutes(since(startOfDay(now, -29)))],
          ['All time', formatMinutes(total)],
          ['Sessions', entries.length],
          ['Longest', formatMinutes(longest)],
        ])}
        ${statSection(`${text.practiceChart}, last 14 days`, barChart(totals.map((s, i) => ({ label: dayLabel(i, 14), segments: [[Math.round(s / 60), ACCENT]] }))))}
        ${statSection('Sessions', entries.length === 0 ? html`<p>${text.practiceEmpty}</p>` : html`<div class="list">${entries.map((e) => html`
          <div class="list-item" style="cursor:default">
            <span class="grow">${slashDate(new Date(e.at))} · ${formatMinutes(e.seconds)}${e.note ? html`<div class="sub">${e.note}</div>` : ''}</span>
            <button class="icon-btn" title="Delete this session" aria-label="Delete this session" ${ui.onClick(async () => {
              if (await confirmDialog('Delete this session?', `${formatMinutes(e.seconds)} on ${slashDate(new Date(e.at))} will be removed from your log.`, 'Delete', 'Keep')) await model.deletePractice(e.id);
            })}>${icon('trash')}</button>
          </div>`)}</div>`)}
      </div>`;
    },
  };
}

// ---------- Settings ----------

function settingsTab(app, ui) {
  const model = app.model;
  const last = model.lastBackup;
  return html`<div>
    <h3 class="h3">Appearance</h3>
    ${switchRow('Dark mode', 'Shared by every app on this site.', currentTheme() === 'dark', ui.onChange((ev) => { setTheme(ev.target.checked ? 'dark' : 'light'); ui.render(); }))}
    ${app.spec.settingsExtra ? html`<hr class="rule">${app.spec.settingsExtra(ui, app)}` : ''}
    <hr class="rule">
    <h3 class="h3">Your data</h3>
    <p class="small" style="margin:4px 0 10px">
      Your progress is stored only in this browser, on this device. It isn't sent anywhere, and it isn't shared with your other browsers or devices.
      Clearing this site's data in your browser settings deletes it. Save a backup file now and then, so you can restore it here or in another browser.
      ${last == null ? "You haven't saved a backup yet." : `Last backup: ${slashDate(new Date(last))}.`}
    </p>
    ${model.store.persistent ? '' : html`<div class="notice warn" style="margin-bottom:10px">This browser isn't letting the site store data (often because of private browsing), so progress will be lost when you close the page.</div>`}
    <div class="stack">
      <button class="btn tonal block" ${ui.onClick(() => saveBackup(app))}>Save a backup</button>
      <button class="btn outline block" ${ui.onClick(() => restoreBackup(app))}>Restore from a backup</button>
      <button class="btn text" style="color:var(--bad)" ${ui.onClick(() => resetApp(app))}>Delete all ${app.title} progress</button>
    </div>
    <hr class="rule">
    <h3 class="h3">Review quizzes</h3>
    <p class="small">Each part has its own settings.</p>
    ${model.course.parts.map((part) => html`<div style="margin-top:16px"><div class="label" style="color:var(--ink)">${part.title}</div>${deckSettingsPanel(app, part, ui)}</div>`)}
    <hr class="rule">
    <h3 class="h3">About and credits</h3>
    <div class="small stack" style="margin-top:6px">${app.spec.credits || ''}</div>
  </div>`;
}

function saveBackup(app) {
  const text = app.model.exportBackup();
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${app.spec.backupFile}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  app.model.markBackedUp();
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

async function restoreBackup(app) {
  const file = await pickFile();
  if (!file) return;
  let backup;
  try {
    backup = app.model.readBackup(await file.text());
  } catch (e) {
    toast(e instanceof BackupError ? e.message : `This file isn't a ${app.title} backup.`);
    return;
  }
  const ok = await confirmDialog(
    'Replace your progress?',
    `This backup is from ${slashDate(new Date(backup.savedAt))}, with ${backup.sectionsPassed} sections passed and ${backup.itemsLearned} items learned. Restoring it replaces everything currently saved for ${app.title}, including reviews, stats and your study log. To keep your current progress, save a backup first.`,
    'Replace and restore'
  );
  if (!ok) return;
  await app.model.restoreBackup(backup);
  toast('Backup restored.');
}

async function resetApp(app) {
  const ok = await confirmDialog(
    `Delete all ${app.title} progress?`,
    'Every passed section, review card, answer and logged minute for this app will be removed from this browser. This can\'t be undone unless you have a backup.',
    'Delete everything'
  );
  if (!ok) return;
  // What this app said you know goes too.
  if (app.learner) await app.learner.syncApp(app.spec.id, []);
  app.model.store.db && app.model.store.db.close();
  await deleteDatabase(app.dbName);
  location.hash = '#/';
  location.reload();
}

// ---------- Progress panel (Writing, Reading, Listening) ----------

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

/**
 * Where the course stands: how much is left, when it would be done at one a
 * day, six days a week, and progress at each level. [noun]/[nouns] name a
 * lesson ("reading", "readings"); [stats] are [label, value] pairs.
 */
export function progressPanel(model, { noun, nouns, stats, lessonsAt }) {
  const lessons = model.course.lessons;
  const left = lessons.filter((l) => !model.lessonComplete(l)).length;
  const finish = projectedFinish(model, lessons);
  const status = left === 0
    ? `Every ${noun} is done, all of N5 to N1. Keep up your reviews.`
    : `${left} ${left === 1 ? noun : nouns} left. At one a day, six days a week, you'd finish on ${longDate(new Date(finish))}.`;
  return html`<div class="stack">
    <h1 class="h1">Your progress</h1>
    <p>${status}</p>
    ${statGrid(stats)}
    <div>
      ${LEVELS.map((level) => {
        const ls = lessonsAt(level);
        if (!ls.length) return '';
        const done = ls.filter((l) => model.lessonComplete(l)).length;
        return barRow({ label: level, fraction: done / ls.length, value: `${done}/${ls.length}` });
      })}
    </div>
  </div>`;
}

// ---------- Wiring ----------

/**
 * Everything [model] shows you've studied, for the learner model. Cards and
 * sections list what they teach in `learn` (items from learner.js): a card in
 * the review deck is studied, a passed section's items are seen.
 */
function learnerEntries(model) {
  const out = [];
  for (const [id, stored] of model.cards) {
    const card = model.course.cardById(id);
    for (const item of (card && card.learn) || []) out.push({ item, ref: id, type: 'card', card: stored.card });
  }
  for (const s of model.course.allSections) {
    if (!s.learn || !model.passed.has(s.id)) continue;
    for (const item of s.learn) out.push({ item, ref: s.id, type: 'seen' });
  }
  return out;
}

/**
 * spec: {
 *   id, title, model, credits,
 *   text: overrides for DEFAULT_TEXT,
 *   renderToday(ui, app), renderBlock(block, ui, app),
 *   renderQuestion({question, card, view, ui, app, answer, key}),
 *   resultHeading(attempt), renderResult(attempt, ui, app),
 *   renderItemDetail(card, question, ui, app),
 *   outcomeFromJson(json, question), givenText(outcome),
 *   amendable, amendOutcome(outcome),
 *   focusExtra, insightsExtra, statsExtra, overviewExtra, settingsExtra,
 *   onQuizFinished(model, stats), routes(parts, params, app) -> screen | null,
 * }
 */
export function createSrsApp(spec) {
  const app = {
    spec,
    model: spec.model,
    title: spec.title,
    dbName: `vibe-${spec.id}`,
    text: { ...DEFAULT_TEXT, ...(spec.text || {}) },
  };
  const ui = new Ui(app);
  app.ui = ui;

  app.tabs = () => {
    const due = app.model.allReviewQueue.length;
    return [
      { id: 'today', label: 'Today' },
      { id: 'reviews', label: due > 0 ? `Reviews (${due})` : 'Reviews' },
      { id: 'stats', label: 'Stats' },
      { id: 'settings', label: 'Settings' },
    ];
  };

  const tab = (id, render) => ({ tab: id, title: spec.title, subtitle: spec.subtitle, render: (u) => render(app, u) });

  app.resolve = (parts, params) => {
    const course = app.model.course;
    const [a, b, c] = parts;
    const custom = spec.routes ? spec.routes(parts, params, app) : null;
    if (custom) return custom;
    switch (a) {
      case undefined:
      case 'today': return tab('today', (ap, u) => spec.renderToday(u, ap));
      case 'reviews': return tab('reviews', reviewsTab);
      case 'stats': return tab('stats', statsTab);
      case 'settings': return tab('settings', settingsTab);
      case 'section': {
        const s = course.sectionById(b);
        return s ? sectionScreen(app, s) : null;
      }
      case 'deck': {
        const p = course.partById(b);
        return p ? deckScreen(app, p, params.get('tab') || 'items') : null;
      }
      case 'item': {
        const card = course.cardById(b);
        return card ? itemScreen(app, card) : null;
      }
      case 'achievements': return achievementsScreen(app);
      case 'practice': return practiceScreen(app);
      case 'quiz': {
        if (b === 'section') {
          const s = course.sectionById(c);
          if (!s) return null;
          if (app.model.statusOf(s) === SectionStatus.locked) return sectionScreen(app, s);
          return quizScreen(app, { kind: 'section', section: s });
        }
        if (b === 'review') {
          const p = course.partById(c);
          return p ? quizScreen(app, { kind: 'review', part: p }) : null;
        }
        if (b === 'review-all') return quizScreen(app, { kind: 'reviewAll' });
        if (b === 'x') {
          const config = ui.pendingQuizzes.get(c);
          return config ? quizScreen(app, config) : null;
        }
        return null;
      }
      default: return null;
    }
  };

  /**
   * A small summary for the landing page, which can't load the course content
   * itself: progress through the course and achievements unlocked.
   */
  app.writeSummary = () => {
    const m = app.model;
    try {
      localStorage.setItem(`vibe.summary.${spec.id}`, JSON.stringify({
        lessonsDone: m.lessonsComplete,
        lessonsTotal: m.course.lessons.length,
        noun: spec.summaryNoun || 'lessons',
        sectionsDone: m.totalPassed,
        sectionsTotal: m.course.allSections.length,
        achievements: Object.keys(m.unlocked).length,
        achievementsTotal: m.achievements.length,
        // The next lesson to study, for the landing page's plan for today.
        next: (() => {
          const s = m.nextSection;
          if (!s) return null;
          const l = m.course.lessonOf(s);
          return { id: s.id, title: s.title, lesson: l.number, lessonTitle: l.title };
        })(),
        updatedAt: Date.now(),
      }));
    } catch (e) { /* storage blocked */ }
  };
  app.writeSummary();

  // The shared learner model: this app's evidence of what you know, sent in
  // full whenever progress changes, so it always matches this app's data.
  app.learner = null;
  app.syncLearner = () => (app.learner ? app.learner.syncApp(spec.id, learnerEntries(app.model)) : Promise.resolve());
  let learnerTimer = null;
  const syncSoon = () => {
    clearTimeout(learnerTimer);
    learnerTimer = setTimeout(app.syncLearner, 400);
  };
  app.learnerReady = Learner.open()
    .then((l) => { app.learner = l; return app.syncLearner(); })
    .catch((e) => console.error('Learner model unavailable', e));

  app.model.onChange(() => {
    app.writeSummary();
    syncSoon();
    if (ui.screen && !ui.screen.ignoreModel) ui.render();
  });
  app.model.store.onError = () => toast("Couldn't save your progress. Your browser may be out of storage space.");

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    app.model.refresh();
    // Other tabs may have added to what you know.
    if (app.learner) app.learner.reload().catch(() => {});
  });

  app.mount = (root) => ui.mount(root);
  // Handy from the browser console when something looks off.
  window.vibeApp = app;
  return app;
}

/** Shows a loading spinner, then the app, or an error if the content can't load. */
export async function boot(root, start) {
  root.innerHTML = '<div class="spinner"></div>';
  try {
    const app = await start();
    app.mount(root);
  } catch (e) {
    console.error(e);
    root.innerHTML = String(html`<div class="view"><div class="notice warn">Couldn't load this app: ${e.message}. Try reloading the page.</div><p style="margin-top:12px"><a href="../index.html">Back to all apps</a></p></div>`);
  }
}

export { resultBox, answerResult, deckSettingsPanel, forecastChart, quizScreen, sectionScreen };
