// Vibe Grammar: every grammar point in the Grammar Library, N5 to N1, a few
// at a time, with spaced reviews. The points, examples and question-building
// come from the library itself (grammar-data.js and grammar-core.js, loaded
// before this file), so the course and the library always agree.

import { html, raw, icon, plural } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { newCard, cardToMap } from '../shared/srs/fsrs.js';
import { createSrsApp, boot, path, offerUnlock, progressPanel, knownToggle, LEVELS } from '../shared/srs/screens.js';
import { grammarItem } from '../shared/learner.js';
import { CONJUGATION_FOR_GRAMMAR } from '../shared/grammar-links.js';

const C = window.GrammarCore;

const LEVEL_SUMMARIES = {
  N5: 'Particles, です and ます, and the first verb forms.',
  N4: 'Conditionals, giving and receiving, and the passive and causative.',
  N3: 'Reasons, appearances, and how things are done.',
  N2: 'Formal connections and nuance for longer texts.',
  N1: 'Literary and formal patterns for news, essays and literature.',
};

const LIBRARY = '../grammar/index.html';
const label = (entry) => C.patternLabel(entry);

// ---------- Course ----------

/**
 * Fill the blank: each time it's asked, it picks one of the point's own
 * examples and blanks out the grammar, with options taken from related
 * points, exactly as the library's worksheet does.
 */
function pointCard(entry) {
  return {
    id: `g:${entry.id}`,
    build: (rng) => C.withRandom(rng.next, () => {
      const examples = C.flattenExamples(entry);
      const ex = examples[Math.floor(rng.next() * examples.length)];
      const [q] = C.buildFillBlankQuestions(entry, [ex]);
      if (q.hl && q.options.length >= 2) {
        return {
          type: 'choice', kind: 'blank', entry, ex, hl: q.hl,
          options: q.options.map((o) => o.text), correctIndex: q.options.findIndex((o) => o.correct), skill: 'Fill the blank',
        };
      }
      // No blank to make: which pattern has this meaning?
      const others = C.pickDistractorEntries(entry, 3).map(label);
      const options = C.shuffleArray([label(entry), ...others]);
      return { type: 'choice', kind: 'meaning', entry, options, correctIndex: options.indexOf(label(entry)), skill: 'Meanings' };
    }),
    info: { name: label(entry), definition: entry.title },
    learn: [grammarItem(entry)],
  };
}

/**
 * The point's examples that make a sentence-building question: split into
 * pieces (grammar-core.js) with the grammar kept in one piece.
 */
function orderableExamples(entry) {
  const out = [];
  for (const ex of C.flattenExamples(entry)) {
    const hl = C.getExampleHighlightRange(ex, entry.pattern);
    const pieces = C.sentencePieces(ex, hl);
    if (pieces) out.push({ ex, hl, pieces });
  }
  return out;
}

/**
 * Sentence building: one of the point's examples in pieces, to put back in
 * order from its English. Right when the pieces rebuild the sentence.
 */
function sentenceCard(entry, examples) {
  return {
    id: `gs:${entry.id}`,
    build: (rng) => {
      const { ex, hl, pieces } = examples[Math.floor(rng.next() * examples.length)];
      const ids = pieces.map((_, i) => i);
      let order = rng.shuffle(ids);
      // Never already in order.
      for (let tries = 0; tries < 5 && order.every((v, i) => v === i); tries++) order = rng.shuffle(ids);
      if (order.every((v, i) => v === i)) order = [...ids.slice(1), ids[0]];
      return { type: 'order', kind: 'order', entry, ex, hl, pieces, order, skill: 'Sentence building' };
    },
    info: { name: `${label(entry)}: build the sentence`, definition: entry.title },
    learn: [grammarItem(entry)],
  };
}

/** A point's cards: fill the blank, and build a sentence when an example allows. */
function cardsFor(entry) {
  const examples = orderableExamples(entry);
  return examples.length ? [pointCard(entry), sentenceCard(entry, examples)] : [pointCard(entry)];
}

function buildCourse() {
  const parts = C.LEVELS.map((l, i) => ({ id: l.id.toLowerCase(), number: i + 1, title: `${l.id} grammar`, summary: LEVEL_SUMMARIES[l.id] || '' }));
  // The lessons come from grammar-core.js, so the library can link to them.
  const lessons = C.courseLessons().map(({ number, level, entries }) => ({
    number,
    level,
    title: entries.map(label).join(' · '),
    entries,
    sections: [{
      id: `g${number}`,
      title: `${level} grammar: ${plural(entries.length, 'point')}`,
      kind: 'grammar',
      deckId: level.toLowerCase(),
      blocks: [{ type: 'points', entries }],
      cards: entries.flatMap(cardsFor),
    }],
  }));
  const course = new Course(parts, lessons);
  course.lessonOfEntry = new Map(lessons.flatMap((l) => l.entries.map((e) => [e.id, l])));
  return course;
}

// ---------- Model ----------

class GrammarModel extends SrsModel {
  lessonsAt(level) { return this.course.lessons.filter((l) => l.level === level); }

  /**
   * Sentence-building cards for points studied before they existed: in the
   * reviews for passed lessons, and known wherever the point was marked known.
   */
  async addSentenceCards() {
    const now = this.now();
    const added = [];
    const known = [];
    for (const section of this.course.allSections) {
      for (const card of section.cards) {
        if (!card.id.startsWith('gs:') || this.cards.has(card.id)) continue;
        const point = `g:${card.id.slice(3)}`;
        if (this.isMarkedKnown(point)) known.push(card.id);
        else if (this.passed.has(section.id)) added.push({ cardId: card.id, partId: section.deckId, card: newCard(now) });
      }
    }
    if (added.length) {
      for (const c of added) this.cards.set(c.cardId, c);
      await this.store.write(added.map((c) => ({ table: 'srs_cards', put: { card_id: c.cardId, part_id: c.partId, data: JSON.stringify(cardToMap(c.card)) } })));
    }
    if (known.length) await this.markKnown(known);
  }

  get pointsLearned() {
    let n = 0;
    for (const id of this.cards.keys()) if (id.startsWith('g:')) n++;
    return n;
  }

  buildAchievements() {
    const lessons = this.course.lessons.length;
    const done = (f) => f.model.lessonsComplete;
    const learned = (f) => f.model.pointsLearned;
    const streak = (f) => f.stats.longestStreak;
    return [
      count('first_lesson', 'First patterns', 'Finish your first grammar lesson.', '🌱', 1, done),
      count('lessons_10', 'Ten lessons', 'Finish ten lessons.', '🔟', 10, done),
      count('n5', 'N5 grammar', 'Have every N5 grammar point in your reviews.', '🎌', C.entriesForLevel('N5').length,
        (f) => C.entriesForLevel('N5').filter((e) => f.model.cards.has(`g:${e.id}`)).length),
      count('points_100', 'A hundred patterns', 'Have a hundred grammar points in your reviews.', '💯', 100, learned),
      count('everything', 'Grammarian', `Finish all ${lessons} lessons, N5 to N1.`, '📜', lessons, done),
      count('perfect_1', 'Full marks', 'Get every question in a lesson right first time.', '⭐', 1, (f) => f.perfectQuizzes),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('night_owl', 'Night owl', 'Study between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
    ];
  }
}

let APP = null;

// ---------- Lesson content ----------

function exampleHtml(ex, entry) {
  return html`<div style="margin-top:8px">
    <div class="ja-m" lang="ja" style="line-height:1.9">${raw(C.buildRuby(ex.japanese, ex.furigana, C.getExampleHighlightRange(ex, entry.pattern)))}</div>
    <div class="small">${ex.english}</div>
  </div>`;
}

/** Where else this point is practised: the forms in Conjugation. */
function linksHtml(entry) {
  const links = CONJUGATION_FOR_GRAMMAR[entry.id] || [];
  if (!links.length) return '';
  return html`<p class="small" style="margin-top:8px">Practise the forms in ${links.map((l, i) => html`${i ? ', ' : ''}<a href="../conjugation/index.html#/section/${l.section}">Conjugation lesson ${l.lesson}</a>`)}.</p>`;
}

function pointCardHtml(entry, ui) {
  const examples = C.flattenExamples(entry).slice(0, 2);
  return html`<div class="card" id="${entry.id}">
    <div class="row" style="align-items:flex-start;gap:8px;flex-wrap:wrap">
      <div class="grow">
        <div class="h2" lang="ja" style="margin:0">${entry.pattern}</div>
        <div class="h3" style="margin-top:2px">${entry.title}</div>
      </div>
      ${APP ? knownToggle(APP, ui, [`g:${entry.id}`, `gs:${entry.id}`].filter((id) => APP.model.course.sectionCard(id))) : ''}
    </div>
    ${String(entry.explanation || '').split(/\n\n+/).map((p) => html`<p class="prose" style="margin-top:8px">${p}</p>`)}
    ${examples.map((ex) => exampleHtml(ex, entry))}
    ${linksHtml(entry)}
    <p class="small" style="margin-top:8px"><a href="${LIBRARY}#${entry.id}">The full entry in the Grammar Library</a>: every example, how it attaches, and related points.</p>
  </div>`;
}

function renderBlock(block, ui) {
  if (block.type === 'points') return html`<div class="stack">${block.entries.map((e) => pointCardHtml(e, ui))}</div>`;
  return '';
}

// ---------- Quiz ----------

/** Sentence building: tap the pieces in order, tap a placed one to take it back. */
function renderOrder(q, view, ui, answer) {
  const placed = (view.placed ||= []);
  const text = (i) => q.ex.japanese.slice(q.pieces[i].start, q.pieces[i].end);
  const piece = (i) => raw(`<span lang="ja">${C.pieceRuby(q.ex, q.pieces[i])}</span>`);
  const check = () => {
    const given = placed.map(text).join('');
    answer({ correct: given === q.ex.japanese, given });
  };
  return html`<div class="stack">
    <div class="h3">Put the sentence in order</div>
    <p style="font-size:1.05rem">${q.ex.english}</p>
    <div class="order-line" aria-label="Your sentence">
      ${placed.length
        ? placed.map((i, k) => html`<button class="piece placed" type="button" ${ui.onClick(() => { placed.splice(k, 1); ui.render(); })}>${piece(i)}</button>`)
        : html`<span class="small">Tap the pieces in order.</span>`}
    </div>
    <div class="order-bank">
      ${q.order.map((i) => (placed.includes(i)
        ? html`<span class="piece gone" aria-hidden="true">${piece(i)}</span>`
        : html`<button class="piece" type="button" ${ui.onClick(() => { placed.push(i); ui.render(); })}>${piece(i)}</button>`))}
    </div>
    <button class="btn block" type="button" ${placed.length === q.pieces.length ? '' : 'disabled'} ${ui.onClick(check)}>Check</button>
  </div>`;
}

function renderQuestion({ question: q, view, ui, answer }) {
  if (q.kind === 'order') return renderOrder(q, view, ui, answer);
  const options = html`<div class="stack" style="margin-top:8px">
    ${q.options.map((opt, i) => html`<button class="option" lang="ja" ${ui.onClick(() => answer({ correct: i === q.correctIndex, given: opt }))}>${opt}</button>`)}
  </div>`;
  if (q.kind === 'blank') {
    return html`<div class="stack">
      <div class="h3">Which fills the blank?</div>
      <div class="ja-l" lang="ja" style="line-height:2">${raw(C.buildRubyBlank(q.ex.japanese, q.ex.furigana, q.hl, '<span class="grammar-blank">？</span>'))}</div>
      <p class="small" style="color:var(--ink)">${q.ex.english}</p>
      ${options}
    </div>`;
  }
  return html`<div class="stack">
    <div class="h3">Which pattern means this?</div>
    <div class="h2">${q.entry.title}</div>
    <p class="small">${q.entry.short}</p>
    ${options}
  </div>`;
}

const givenText = (o) => o.given || '';

function answerPanel(q) {
  const e = q.entry;
  return html`<div>
    ${q.kind === 'blank' || q.kind === 'order' ? html`<div class="ja-m" lang="ja" style="line-height:1.9">${raw(C.buildRuby(q.ex.japanese, q.ex.furigana, q.hl))}</div>` : ''}
    ${q.kind === 'order' ? html`<p class="small">${q.ex.english}</p>` : ''}
    <div class="h3" lang="ja" style="margin-top:6px">${e.pattern} · ${e.title}</div>
    <p class="small">${e.short} <a href="${LIBRARY}#${e.id}">Open in the Grammar Library</a></p>
  </div>`;
}

function renderResult(attempt) {
  const q = attempt.question;
  return html`${!attempt.correct ? html`<p class="small" lang="ja">You answered: ${givenText(attempt.outcome)}</p>` : ''}
    <div style="margin-top:6px">${answerPanel(q)}</div>`;
}

const resultHeading = (a) => (a.correct ? 'Last question: right' : 'Last question: not quite');

// ---------- Today tab ----------

function planPanel(model) {
  return progressPanel(model, {
    noun: 'lesson',
    nouns: 'lessons',
    lessonsAt: (level) => model.lessonsAt(level),
    stats: [
      ['Lessons done', `${model.lessonsComplete}/${model.course.lessons.length}`],
      ['Points in reviews', `${model.pointsLearned}/${model.course.lessonOfEntry.size}`],
    ],
  });
}

function lessonTile(app, ui, lesson) {
  const model = app.model;
  const section = lesson.sections[0];
  const status = model.statusOf(section);
  const locked = status === SectionStatus.locked;
  return html`<a class="list-item" href="${path('section', section.id)}" ${locked ? ui.onClick(() => offerUnlock(app, section)) : ''}>
    <span class="status-icon ${status === 'passed' ? 'done' : ''}">${icon(status === 'passed' ? 'checkCircle' : locked ? 'lock' : 'play')}</span>
    <span class="grow" lang="ja">${lesson.number}. ${lesson.title}
      <div class="sub">${plural(lesson.entries.length, 'point')}${locked ? ' · tap to unlock early' : ''}</div></span>
  </a>`;
}

function renderToday(ui, app) {
  const model = app.model;
  const next = model.nextSection;
  const due = model.allReviewQueue.length;
  const saved = model.savedQuiz(SrsModel.reviewAllKey);
  return html`<div class="stack-lg">
    ${planPanel(model)}
    ${next ? (() => {
      const lesson = model.course.lessonOf(next);
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Today's grammar · lesson ${lesson.number} of ${model.course.lessons.length}</span>
          <div class="h2" lang="ja" style="margin:2px 0">${lesson.title}</div>
          <span class="small">${lesson.level} · ${plural(lesson.entries.length, 'point')}${model.savedQuiz(SrsModel.sectionQuizKey(next)) ? ' · quiz started' : ''}</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Review ${plural(due, 'card')} due today`}</a>` : ''}
    <a class="btn outline block" href="${LIBRARY}">Browse the Grammar Library</a>
    ${LEVELS.map((level) => html`<section>
      <h2 class="h3">${level}</h2>
      <div class="list" style="margin-top:6px">${model.lessonsAt(level).map((l) => lessonTile(app, ui, l))}</div>
    </section>`)}
  </div>`;
}

const CREDITS = html`
  <p>Grammar points, explanations and examples come from the Grammar Library on this site; each lesson links to its full entries there.</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const store = await Store.open('vibe-grammar');
  const course = buildCourse();
  const model = new GrammarModel(store, course, {
    appName: 'Vibe Grammar',
    backupApp: 'vibe_web_grammar',
    passMark: 0.8,
    noPartId: 'practice',
  });
  model.load();
  await model.addSentenceCards();
  const app = createSrsApp({
    id: 'grammar',
    title: 'Vibe Grammar',
    model,
    summaryNoun: 'lessons',
    backupFile: 'vibe-grammar-backup',
    credits: CREDITS,
    text: {
      itemDetailTitle: 'Grammar point',
      nothingDue: 'Nothing is due right now. Finish a lesson to add its grammar points to your reviews.',
    },
    renderToday,
    renderBlock,
    renderQuestion,
    resultHeading,
    renderResult,
    renderItemDetail: (card, q) => answerPanel(q),
    outcomeFromJson: (json) => ({ correct: !!json.correct, given: json.given || '' }),
    givenText,
    sectionScreenTitle: (lesson) => `Lesson ${lesson.number} · ${lesson.level}`,
  });
  APP = app;
  return app;
});
