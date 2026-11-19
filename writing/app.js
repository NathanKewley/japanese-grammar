// Writing: kana and kanji handwriting on paper, with self-marked quizzes.

import { html, raw, icon, richText, plural, toast } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { statGrid, barRow } from '../shared/srs/ui.js';
import { createSrsApp, boot, path, offerUnlock, progressPanel, knownToggle, LEVELS, lessonFolds, levelGroups } from '../shared/srs/screens.js';
import { seeded } from '../shared/srs/quiz-engine.js';
import { dayKey } from '../shared/srs/stats.js';
import { KANA_SETS } from './kana.js';
import { wordItem, kanaItem, kanjiItemsIn } from '../shared/learner.js';

// ---------- Content ----------

const PARTS = [
  { id: 'kana', number: 1, title: 'Kana', summary: 'Hiragana and katakana.' },
  { id: 'n5', number: 2, title: 'N5 kanji', summary: 'Words using the N5 kanji.' },
  { id: 'n4', number: 3, title: 'N4 kanji', summary: 'Words using the N4 kanji.' },
  { id: 'n3', number: 4, title: 'N3 kanji', summary: 'Words using the N3 kanji.' },
  { id: 'n2', number: 5, title: 'N2 kanji', summary: 'Words using the N2 kanji.' },
  { id: 'n1', number: 6, title: 'N1 kanji', summary: 'Words using the N1 kanji.' },
];

const isKanji = (c) => {
  const code = c.codePointAt(0);
  return (code >= 0x4e00 && code <= 0x9fff) || c === '々';
};

const isKana = (c) => {
  const code = c.codePointAt(0);
  return (code >= 0x3041 && code <= 0x3096) || (code >= 0x30a1 && code <= 0x30fa) || c === 'ー';
};

const katakanaToHiragana = (text) =>
  [...text].map((ch) => {
    const r = ch.codePointAt(0);
    return r >= 0x30a1 && r <= 0x30f6 ? String.fromCodePoint(r - 0x60) : ch;
  }).join('');

/** A question to write on paper from its prompt, then check and mark. */
function writeQuestion({ prompt, hint, answer, skill, answerReading = null }) {
  return {
    prompt,
    hint,
    answer,
    answerReading,
    skill,
    // Kana and kanji whose stroke order is shown with the answer.
    strokeChars: [...answer].filter((c) => isKanji(c) || (skill === 'Kana' && isKana(c))),
  };
}

/** [learn] lists what the card teaches, as learner-model items. */
function card(id, build, name, definition, learn = []) {
  return { id, build, info: { name, definition }, learn };
}

/** Each kanji's first meaning, for the learner model. Filled in by buildCourse. */
let KANJI_MEANING = new Map();
const kanjiMeaning = (c) => KANJI_MEANING.get(c) || '';

function kanaSection(lesson, setName) {
  const set = KANA_SETS[setName];
  const script = setName.startsWith('hira') ? 'hiragana' : 'katakana';
  return {
    id: `l${lesson}.kana`,
    title: set.title,
    kind: 'kana',
    deckId: 'kana',
    blocks: [
      { type: 'text', text: 'Write each row in your notebook, following the stroke order. Say each sound as you write it. Watch the **order** and **direction** of each stroke, because that is what makes handwriting look natural.' },
      ...set.rows.map((row, i) => ({ type: 'kana', title: row.name, kana: row.kana, cardId: `kana:${setName}.${i}` })),
      ...(set.words.length ? [{ type: 'text', text: `Then write these words in katakana: ${set.words.map(([k, m]) => `${k} (${m})`).join(', ')}.` }] : []),
    ],
    cards: [
      ...set.rows.map((row, i) => {
        const chars = row.kana.map((k) => k[0]).join('');
        return card(
          `kana:${setName}.${i}`,
          () => writeQuestion({ prompt: row.kana.map((k) => k[1]).join(' · '), hint: `Write in ${script}: ${row.name}`, answer: chars, skill: 'Kana' }),
          `${row.name} (${chars})`,
          `The ${script} ${row.name.toLowerCase()}: ${row.kana.map(([k, r]) => `${k} ${r}`).join(', ')}.`,
          row.kana.map(([k, r]) => kanaItem(k, r))
        );
      }),
      ...set.words.map(([word, meaning]) =>
        card(`kana-word:${word}`, () => writeQuestion({ prompt: katakanaToHiragana(word), hint: `Write in katakana: ${meaning}`, answer: word, skill: 'Kana' }), word, `Katakana for ${meaning}.`, [wordItem(word, word, meaning)])
      ),
    ],
  };
}

function kanjiSection(lesson, kanji, words) {
  return {
    id: `l${lesson}.kanji`,
    title: `New kanji: ${kanji.map((k) => k.char).join(' ')}`,
    kind: 'kanji',
    deckId: kanji[0].level.toLowerCase(),
    blocks: [
      { type: 'text', text: "For each kanji, follow the numbered strokes and write it **five times**, then write each of its words twice. In the quiz you'll see the reading and meaning, write the word from memory, then check it against the answer." },
      ...kanji.map((k) => ({ type: 'kanji', kanji: k, words: words.filter((w) => w.surface.includes(k.char)) })),
    ],
    cards: words.map((w) =>
      card(`word:${w.surface}`, () => writeQuestion({ prompt: w.reading, hint: w.meaning, answer: w.surface, answerReading: w.reading, skill: 'Words' }), `${w.surface} (${w.reading})`, w.meaning,
        [wordItem(w.surface, w.reading, w.meaning), ...kanjiItemsIn(w.surface, kanjiMeaning)])
    ),
  };
}

function sentenceCard(s) {
  return card(s.id, () => writeQuestion({ prompt: s.reading, hint: s.english, answer: s.text, answerReading: s.reading, skill: 'Sentences' }), s.text, s.english, kanjiItemsIn(s.kanji.join(''), kanjiMeaning));
}

function writingSection(lesson, sentences) {
  return {
    id: `l${lesson}.writing`,
    title: 'Writing: the story continues',
    kind: 'writing',
    deckId: null,
    blocks: [
      { type: 'text', text: "Read each sentence, then copy it once. In the quiz you'll see it in kana with its meaning, and write it from memory using every kanji you know." },
      ...sentences.map((s) => ({ type: 'sentence', sentence: s })),
    ],
    cards: sentences.map(sentenceCard),
  };
}

function buildCourse(data) {
  KANJI_MEANING = new Map(data.lessons.flatMap((l) => l.kanji.map((k) => [k.char, k.meanings[0] || ''])));
  const lessons = data.lessons.map((raw) => {
    const n = raw.number;
    const sentences = raw.sentences.map((s, i) => ({ id: `sentence:${n}.${i + 1}`, text: s.text, reading: s.reading, english: s.english, kanji: s.kanji }));
    const sections = [
      ...raw.kana.map((set) => kanaSection(n, set)),
      ...(raw.kanji.length ? [kanjiSection(n, raw.kanji, raw.words)] : []),
      ...(sentences.length ? [writingSection(n, sentences)] : []),
    ];
    return { number: n, title: raw.title, kanji: raw.kanji, sentences, sections };
  });
  return new Course(PARTS, lessons);
}

// ---------- Model ----------

class WritingModel extends SrsModel {
  /** The lessons that teach one JLPT level's kanji (kana come with N5). */
  lessonsAt(level) { return this.course.lessons.filter((l) => l.kanji.length && l.kanji[0].level === level); }

  get kanjiLearned() {
    return this.course.lessons
      .filter((l) => l.sections.some((s) => s.kind === 'kanji' && this.passed.has(s.id)))
      .reduce((n, l) => n + l.kanji.length, 0);
  }

  get writingDoneToday() { return this.dailyTaskDone('writing'); }
  get writingDays() { return this.dailyTaskCount('writing'); }
  markWritingDone() { return this.markDailyTaskDone('writing'); }

  /** For each kanji, the share of answers to words containing it that were marked wrong. */
  kanjiMissShare(stats) {
    const totals = new Map();
    for (const [c, score] of stats.cardScores) {
      if (!c.id.startsWith('word:')) continue;
      for (const ch of c.id.slice(5)) {
        const [w, t] = totals.get(ch) || [0, 0];
        totals.set(ch, [w + score.total - score.right, t + score.total]);
      }
    }
    return new Map([...totals].map(([k, [w, t]]) => [k, w / t]));
  }

  /**
   * Sentences from finished lessons to write today. Those with kanji often
   * marked wrong come first, then those not written for longest.
   */
  dailyWriting(stats, n = 5) {
    const now = this.now();
    // Not lessons skipped by the placement test: you haven't written them here.
    const placed = this.placed;
    const eligible = this.course.lessons
      .filter((l) => l.sections.some((s) => s.kind === 'writing' && this.passed.has(s.id) && !placed.has(s.id)))
      .flatMap((l) => l.sentences);
    const weakness = this.kanjiMissShare(stats);
    const last = stats.lastAnswered();
    const d = new Date(now);
    // The same day always gives the same choice.
    const jitter = seeded(d.getFullYear() * 1000 + (d.getMonth() + 1) * 40 + d.getDate());
    return eligible
      .map((s) => {
        const weak = s.kanji.reduce((m, k) => Math.max(m, weakness.get(k) || 0), 0);
        const lastAt = last.get(s.id);
        const age = lastAt == null ? 1.5 : Math.min((now - lastAt) / 3600000 / 168, 1.0);
        return [s, 2 * weak + age + jitter.next() * 0.2];
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([s]) => s);
  }

  buildAchievements() {
    const course = this.course;
    const lessons = course.lessons.length;
    const allKanji = course.lessons.reduce((n, l) => n + l.kanji.length, 0);
    const done = (f) => f.model.lessonsComplete;
    const kanji = (f) => f.model.kanjiLearned;
    const answers = (f) => f.stats.answers.length;
    const learned = (f) => f.model.course.parts.reduce((n, p) => n + f.model.summaryOf(p).totalCards, 0);
    const sentences = (f) => f.stats.answers.filter((a) => a.cardId.startsWith('sentence:')).length;
    const practiceMinutes = (f) => Math.floor(f.stats.totalPracticeSeconds / 60);
    const part = (id, title, description, icon) => {
      const p = course.partById(id);
      return count(`part_${id}`, title, description, icon, p.sections.length, (f) => f.model.passedCount(p));
    };
    const streak = (f) => f.stats.longestStreak;
    return [
      count('first_section', 'First strokes', 'Pass your first section.', '🚩', 1, (f) => f.model.totalPassed),
      count('first_lesson', 'Lesson one, done', 'Finish a whole lesson.', '🎓', 1, done),
      count('lessons_10', 'Ten down', 'Finish ten lessons.', '🔟', 10, done),
      count('lessons_50', 'Fifty lessons', 'Finish fifty lessons.', '📈', 50, done),
      count('lessons_100', 'A hundred lessons', 'Finish a hundred lessons.', '🎖️', 100, done),
      count('lessons_200', 'Two hundred lessons', 'Finish two hundred lessons.', '🏆', 200, done),
      part('kana', 'Kana master', 'Finish the kana sections.', 'あ'),
      part('n5', 'N5 kanji', 'Finish the N5 kanji.', '5️⃣'),
      part('n4', 'N4 kanji', 'Finish the N4 kanji.', '4️⃣'),
      part('n3', 'N3 kanji', 'Finish the N3 kanji.', '3️⃣'),
      part('n2', 'N2 kanji', 'Finish the N2 kanji.', '2️⃣'),
      part('n1', 'N1 kanji', 'Finish the N1 kanji.', '1️⃣'),
      count('everything', 'Kanji sensei', `Finish all ${lessons} lessons.`, '👑', lessons, done),
      count('kanji_100', 'A hundred kanji', 'Learn a hundred kanji.', '✏️', 100, kanji),
      count('kanji_500', 'Five hundred kanji', 'Learn five hundred kanji.', '🖋️', 500, kanji),
      count('kanji_1000', 'A thousand kanji', 'Learn a thousand kanji.', '🖌️', 1000, kanji),
      count('kanji_2000', 'Newspaper ready', 'Learn two thousand kanji.', '📰', 2000, kanji),
      count('kanji_all', 'Every last one', `Learn all ${allKanji} kanji.`, '✨', allKanji, kanji),
      count('answers_100', 'Warming up', 'Mark a hundred answers.', '✔️', 100, answers),
      count('answers_1000', 'Ink stained', 'Mark a thousand answers.', '💧', 1000, answers),
      count('answers_5000', 'Unstoppable', 'Mark five thousand answers.', '⚡', 5000, answers),
      count('answers_10000', 'Ten thousand words', 'Mark ten thousand answers.', '🚀', 10000, answers),
      count('sentences_100', 'Storyteller', 'Write a hundred sentences.', '📖', 100, sentences),
      count('learned_500', 'Deep deck', 'Have five hundred items in your reviews.', '🗂️', 500, learned),
      count('learned_2000', 'Bottomless deck', 'Have two thousand items in your reviews.', '♾️', 2000, learned),
      count('streak_3', 'On a roll', 'Study three days in a row.', '🔥', 3, streak),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('streak_30', 'Habit formed', 'Study thirty days in a row.', '📅', 30, streak),
      count('streak_100', 'Hundred-day club', 'Study a hundred days in a row.', '🎉', 100, streak),
      count('writing_1', 'Daily writer', 'Finish the daily writing task.', '📝', 1, (f) => f.model.writingDays),
      count('writing_30', 'Thirty days of writing', 'Finish the daily writing task on thirty days.', '🔁', 30, (f) => f.model.writingDays),
      count('practice_60', 'An hour at the desk', 'Log an hour of handwriting practice.', '⏱️', 60, practiceMinutes),
      count('practice_600', 'Ten hours at the desk', 'Log ten hours of handwriting practice.', '⏳', 600, practiceMinutes),
      count('perfect_1', 'Flawless', 'Mark every item in a lesson quiz right first time (ten or more items).', '⭐', 1, (f) => f.perfectQuizzes),
      count('perfect_10', 'Perfectionist', 'Ace ten lesson quizzes like that.', '🌟', 10, (f) => f.perfectQuizzes),
      count('comeback_50', 'Comeback kid', 'Get fifty items right in a repeat round after missing them.', '↩️', 50, (f) => f.stats.repeats.right),
      count('night_owl', 'Night owl', 'Answer a question between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
      count('early_bird', 'Early bird', 'Answer a question between 5am and 6am.', '🌅', 1, (f) => answersWhere(f, (d) => d.getHours() === 5), true),
      count('weekend', 'Weekend warrior', 'Mark a hundred answers on weekends.', '🛋️', 100, (f) => answersWhere(f, (d) => d.getDay() === 0 || d.getDay() === 6), true),
    ];
  }
}

// ---------- Stroke order ----------

let STROKES = null;
const BOX = 109;

/**
 * The stroke data is big (3 MB) and only drawn in lessons and answers, so it
 * loads after the app opens; diagrams show an empty square until it arrives.
 */
function loadStrokes(app) {
  fetch('data/strokes.json')
    .then((r) => { if (!r.ok) throw new Error('stroke data missing'); return r.json(); })
    .then((strokes) => {
      STROKES = strokes;
      if (app.ui.screen && !app.ui.screen.ignoreModel) app.ui.render();
    })
    .catch((e) => console.error('Stroke order unavailable', e));
}

/**
 * One character drawn from its strokes on a practice square, like the boxes in
 * a writing notebook. Strokes after [upTo] are left out, the stroke at [upTo]
 * is highlighted, and [numbered] labels where each stroke starts.
 */
function strokeDiagram(ch, size = 120, { upTo = null, numbered = true } = {}) {
  const strokes = (STROKES && STROKES[ch]) || [];
  const shown = upTo ?? strokes.length;
  const unit = BOX / size; // viewBox units per pixel
  const paths = [];
  for (let i = 0; i < shown && i < strokes.length; i++) {
    const current = upTo != null && i === shown - 1;
    const pts = strokes[i];
    let d = '';
    for (let j = 0; j + 1 < pts.length; j += 2) d += `${j ? 'L' : 'M'}${pts[j]},${pts[j + 1]}`;
    const width = Math.max(2 * unit, BOX * (current ? 0.055 : 0.045));
    paths.push(`<path class="ink${current ? ' current' : ''}" d="${d}" stroke-width="${width.toFixed(2)}"/>`);
    if (current) paths.push(`<circle class="dot" cx="${pts[0]}" cy="${pts[1]}" r="${Math.max(2.5 * unit, BOX * 0.04).toFixed(2)}"/>`);
  }
  if (numbered) {
    const font = Math.max(9 * unit, BOX * 0.085);
    strokes.forEach((pts, i) => {
      const label = String(i + 1);
      const w = font * 0.6 * label.length;
      const x = Math.min(Math.max(pts[0] - 2 * unit, w), BOX);
      const y = Math.min(Math.max(pts[1], font), BOX);
      paths.push(`<text class="n" x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${font.toFixed(1)}" text-anchor="end">${label}</text>`);
    });
  }
  return raw(`<svg class="stroke" width="${size}" height="${size}" viewBox="0 0 ${BOX} ${BOX}" role="img" aria-label="Stroke order for ${ch}">
    <rect class="frame" x="0.5" y="0.5" width="${BOX - 1}" height="${BOX - 1}"/>
    <line class="guide" x1="0" y1="${BOX / 2}" x2="${BOX}" y2="${BOX / 2}"/>
    <line class="guide" x1="${BOX / 2}" y1="0" x2="${BOX / 2}" y2="${BOX}"/>
    ${paths.join('')}
  </svg>`);
}

/** The strokes of one character built up step by step. */
function strokeSteps(ch, size = 52) {
  const n = ((STROKES && STROKES[ch]) || []).length;
  const out = [];
  for (let i = 1; i <= n; i++) out.push(strokeDiagram(ch, size, { upTo: i, numbered: false }));
  return html`<div class="wrap" style="gap:4px">${out}</div>`;
}

/** The written answer, with the stroke order of every character in it. */
function answerPanel(q, size = 76) {
  const chars = [...new Set(q.strokeChars)];
  return html`<div>
    <div class="ja-xl" lang="ja">${q.answer}</div>
    ${chars.length ? html`<div class="wrap" style="margin-top:8px">${chars.map((c) => strokeDiagram(c, size))}</div>` : ''}
  </div>`;
}

// ---------- Lesson content ----------

function renderBlock(block, ui, app) {
  switch (block.type) {
    case 'text':
      return html`<p class="prose">${richText(block.text)}</p>`;
    case 'kana':
      return html`<div>
        <div class="row" style="margin-bottom:6px;flex-wrap:wrap;gap:6px 10px">
          <div class="h3 grow">${block.title}</div>
          ${knownToggle(app, ui, [block.cardId])}
        </div>
        <div class="wrap">${block.kana.map(([k, r]) => html`<div style="text-align:center">${strokeDiagram(k, 76)}<div class="small">${r}</div></div>`)}</div>
      </div>`;
    case 'kanji': {
      const k = block.kanji;
      return html`<div class="card">
        <div class="row top" style="gap:14px;flex-wrap:wrap">
          ${strokeDiagram(k.char, 132)}
          <div style="flex:1;min-width:160px">
            <div class="h3">${k.meanings.join(', ')}</div>
            ${k.on.length ? html`<div lang="ja" style="margin-top:4px">音 ${k.on.join('、')}</div>` : ''}
            ${k.kun.length ? html`<div lang="ja">訓 ${k.kun.map((r) => r.replace(/\./g, '')).join('、')}</div>` : ''}
            <div class="small" style="margin-top:4px">${k.strokes} strokes · ${k.level}</div>
          </div>
        </div>
        <div class="label" style="margin:10px 0 4px">Stroke by stroke</div>
        ${strokeSteps(k.char)}
        ${block.words.length ? html`<div class="label" style="margin:12px 0 2px">Words to write</div>
          ${block.words.map((w) => html`<div class="row" style="align-items:baseline;padding:3px 0;flex-wrap:wrap;gap:4px 10px">
            <span class="ja-m" lang="ja" style="font-size:1.3rem">${w.surface}</span>
            <span lang="ja">${w.reading}</span>
            <span class="small grow">${w.meaning}</span>
            ${knownToggle(app, ui, [`word:${w.surface}`])}
          </div>`)}` : ''}
      </div>`;
    }
    case 'sentence': {
      const s = block.sentence;
      return html`<div>
        <div class="ja-l" lang="ja">${s.text}</div>
        <div lang="ja">${s.reading}</div>
        <div class="small">${s.english}</div>
      </div>`;
    }
    default:
      return '';
  }
}

// ---------- Quiz ----------

function renderQuestion({ question: q, view, ui, answer }) {
  return html`<div class="stack">
    <div class="h3">${q.hint}</div>
    <div class="ja-xl" lang="ja">${q.prompt}</div>
    <p class="small">${q.skill === 'Sentences' ? 'Write the whole sentence on paper, using every kanji you know.' : 'Write it on paper, then check it.'}</p>
    ${!view.revealed
      ? html`<button class="btn block" data-autofocus ${ui.onClick(() => { view.revealed = true; ui.render(); })}>Show answer</button>`
      : html`<div class="card">${answerPanel(q)}</div>
        <div class="h3" style="font-size:.95rem">How did your writing compare?</div>
        <div class="btn-row">
          <button class="btn outline" ${ui.onClick(() => answer({ correct: false }))}>${icon('cross')} Not yet</button>
          <button class="btn" data-autofocus ${ui.onClick(() => answer({ correct: true }))}>${icon('check')} Got it</button>
        </div>`}
  </div>`;
}

function renderResult(attempt) {
  const q = attempt.question;
  return html`<p class="small">${q.hint}</p>
    <div lang="ja">${q.prompt}</div>
    <div style="margin-top:6px">${answerPanel(q, 56)}</div>`;
}

// ---------- Today tab ----------

function planPanel(model) {
  const kanjiTotal = model.course.lessons.reduce((n, l) => n + l.kanji.length, 0);
  const items = model.course.parts.reduce((n, p) => n + model.summaryOf(p).totalCards, 0);
  return progressPanel(model, {
    noun: 'lesson',
    nouns: 'lessons',
    lessonsAt: (level) => model.lessonsAt(level),
    stats: [
      ['Lessons done', `${model.lessonsComplete}/${model.course.lessons.length}`],
      ['Kanji learned', `${model.kanjiLearned}/${kanjiTotal}`],
      ['Words in reviews', items],
    ],
  });
}

function lessonTile(app, ui, lesson) {
  const model = app.model;
  const complete = model.lessonComplete(lesson);
  const next = model.nextSection;
  const open = next && model.course.lessonOf(next) === lesson;
  return html`<details class="lesson" ${open ? 'open' : ''}>
    <summary>
      <span class="status-icon ${complete ? 'done' : ''}">${icon(complete ? 'checkCircle' : 'circle')}</span>
      <span class="grow">
        <div>Lesson ${lesson.number}: ${lesson.title}</div>
        ${lesson.kanji.length ? html`<div class="small" lang="ja">${lesson.kanji.map((k) => k.char).join(' ')}</div>` : ''}
      </span>
      <span class="caret">${icon('chevron')}</span>
    </summary>
    <div class="list">
      ${lesson.sections.map((s) => {
        const status = model.statusOf(s);
        const locked = status === SectionStatus.locked;
        return html`<a class="list-item" href="${path('section', s.id)}" ${locked ? ui.onClick(() => offerUnlock(app, s)) : ''}>
          <span class="status-icon ${status === 'passed' ? 'done' : ''}">${icon(status === 'passed' ? 'check' : locked ? 'lock' : 'play')}</span>
          <span class="grow"><span lang="ja">${s.title}</span>${locked ? html`<div class="sub">Tap to unlock early</div>` : ''}</span>
        </a>`;
      })}
    </div>
  </details>`;
}

function startDailyWriting(app, ui) {
  const model = app.model;
  const sentences = model.dailyWriting(model.loadStudyStats());
  if (!sentences.length) {
    toast("Finish a lesson's writing section first.");
    return;
  }
  ui.startQuiz({ kind: 'extra', part: null, title: "Today's writing", cards: () => sentences.map(sentenceCard), onFinished: () => model.markWritingDone() });
}

function renderToday(ui, app) {
  const model = app.model;
  const next = model.nextSection;
  const due = model.allReviewQueue.length;
  const saved = model.savedQuiz(SrsModel.reviewAllKey);
  const writingDone = model.writingDoneToday;
  return html`<div class="stack-lg">
    ${planPanel(model)}
    ${next ? (() => {
      const lesson = model.course.lessonOf(next);
      const done = lesson.sections.filter((s) => model.statusOf(s) === SectionStatus.passed).length;
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Next · Lesson ${lesson.number}: ${lesson.title}</span>
          <div class="h2" lang="ja" style="margin:2px 0">${next.title}</div>
          <span class="small">${done} of ${lesson.sections.length} parts of this lesson done</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Review ${plural(due, 'item')} due today`}</a>` : ''}
    <div class="card">
      <div class="row"><span class="grow h3">Daily writing</span>${writingDone ? html`<span class="status-icon" style="color:var(--good)">${icon('checkCircle')}</span>` : ''}</div>
      <p class="small" style="margin:4px 0 10px">${writingDone
        ? 'Done for today. You can write another set if you like.'
        : "Five sentences from your lessons so far, favouring kanji you've marked wrong and sentences you haven't written lately."}</p>
      <button class="btn outline block" ${ui.onClick(() => startDailyWriting(app, ui))}>${writingDone ? 'Write another set' : "Start today's writing"}</button>
    </div>
    ${lessonFolds(app, ui, levelGroups(model), (l) => lessonTile(app, ui, l))}
  </div>`;
}

const CREDITS = html`
  <p>Stroke order data from <a href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a>, copyright © 2009-2013 Ulrich Apel, used under the Creative Commons Attribution-Share Alike 3.0 licence.</p>
  <p>Kanji readings, meanings and word checks from the <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noopener">KANJIDIC2</a> and <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a> files, the property of the Electronic Dictionary Research and Development Group, used under <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noopener">their licence</a> (CC BY-SA 4.0).</p>
  <p>N3, N2 and N1 kanji lists: Jonathan Waller's JLPT lists.</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const [content, store] = await Promise.all([
    fetch('data/content.json').then((r) => { if (!r.ok) throw new Error('content missing'); return r.json(); }),
    Store.open('vibe-writing'),
  ]);
  const course = buildCourse(content);
  const model = new WritingModel(store, course, {
    appName: 'Writing',
    backupApp: 'vibe_web_writing',
    passMark: 0.0, // Handwriting is self-marked, so a section passes once every item is ticked.
    noPartId: 'writing',
    statsOptions: { slowExcluded: (id, skill) => skill === 'Sentences' },
  });
  model.load();
  const app = createSrsApp({
    id: 'writing',
    title: 'Writing',
    model,
    summaryNoun: 'lessons',
    backupFile: 'vibe-writing-backup',
    credits: CREDITS,
    text: {
      sectionQuizStart: (n) => `Write from memory (${n} items)`,
      sectionQuizResume: (done, n) => `Resume writing (${done} of ${n} done)`,
      sectionQuizAgain: 'Write them again',
      passedNoDeck: 'You can write these again in the daily writing task.',
      notPassed: 'Finish the quiz to pass the section.',
      itemTimesNote: 'Time to first answer. Red means it was missed first time. Sentences take longer than words, because there is more to write.',
      attemptsNote: 'Any finished quiz passes. This shows how your recall is improving.',
      itemDetailTitle: "How it's written",
      timesLabel: 'Times written',
      rightLabel: 'Marked right',
      notAnswered: 'Not written yet.',
      practiceTitle: 'Practice log',
      practiceChart: 'Minutes writing',
      practiceStat: 'Writing',
      practiceEmpty: 'No practice logged yet. Start the timer when you sit down to write.',
      practiceWhat: 'What did you practise? (optional)',
      practiceInsight: (m) => `You logged ${m} minute${m === 1 ? '' : 's'} writing over the last 7 days.`,
      slowNote: 'Median time to first answer. Sentences are left out, because they take much longer than words.',
    },
    renderToday,
    renderBlock,
    renderQuestion,
    resultHeading: (a) => (a.correct ? 'Last question: marked as right' : 'Last question: marked as not yet'),
    renderResult,
    renderItemDetail: (card, q) => answerPanel(q, 96),
    outcomeFromJson: (json) => ({ correct: !!json.correct }),
    givenText: (o) => (o.correct ? 'Marked as right' : 'Marked as not yet'),
  });
  loadStrokes(app);
  return app;
});
