// Reading: 132 graded readings from N5 messages to N1 literature, with
// tappable words, comprehension questions and re-reading reviews.

import { html, icon, plural } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { statGrid, barRow } from '../shared/srs/ui.js';
import { createSrsApp, boot, path, offerUnlock, progressPanel, LEVELS, lessonFolds, levelGroups } from '../shared/srs/screens.js';
import { Rating, newCard } from '../shared/srs/fsrs.js';
import { Dictionary, renderPassage, connectLearner } from '../shared/srs/passage.js';
import { passageWords, wordLookupHooks } from '../shared/learner.js';

const LEVEL_SUMMARIES = {
  N5: 'Short messages, signs and conversations, mostly in kana.',
  N4: 'Everyday life in Japan: shops, trains, work and friends.',
  N3: 'Longer passages: notices, emails, stories and short articles.',
  N2: "Articles, essays and children's stories by Japanese authors.",
  N1: 'Japanese literature, in excerpts from public-domain works.',
};

const KINDS = {
  sign: ['Sign', '🪧'], menu: ['Menu', '🍽️'], message: ['Message', '💬'], email: ['Email', '✉️'],
  conversation: ['Conversation', '🗨️'], diary: ['Diary', '📔'], notice: ['Notice', '📢'], story: ['Story', '📖'],
  article: ['Article', '📰'], essay: ['Essay', '📝'], literature: ['Literature', '📚'],
};

const kindOf = (r) => KINDS[r.kind] || [r.kind, '📄'];

const AUTHOR_NAMES = {
  宮沢賢治: 'Miyazawa Kenji', 新美南吉: 'Niimi Nankichi', 芥川龍之介: 'Akutagawa Ryūnosuke', 夏目漱石: 'Natsume Sōseki',
  太宰治: 'Dazai Osamu', 小川未明: 'Ogawa Mimei', 森鷗外: 'Mori Ōgai', 樋口一葉: 'Higuchi Ichiyō', 寺田寅彦: 'Terada Torahiko',
  中島敦: 'Nakajima Atsushi', 梶井基次郎: 'Kajii Motojirō', 岡本かの子: 'Okamoto Kanoko', 坂口安吾: 'Sakaguchi Ango', 江戸川乱歩: 'Edogawa Ranpo',
};

// ---------- Content ----------

let DICT = null;

function buildCourse(data) {
  DICT = new Dictionary(data.entries, data.kanji);
  const parts = data.levels.map((l, i) => ({ id: l.id.toLowerCase(), number: i + 1, title: `${l.id} readings`, summary: LEVEL_SUMMARIES[l.id] || l.title }));
  const lessons = data.readings.map((r) => {
    const reading = {
      number: r.n,
      level: r.level,
      title: r.title,
      kind: r.kind,
      lesson: r.lesson,
      source: r.source,
      characters: r.chars,
      sentences: r.p.flat(),
      paragraphs: r.p.map((p) => p.length),
      questions: r.q,
    };
    const n = r.n;
    const section = {
      id: `r${n}`,
      title: r.title,
      kind: 'reading',
      deckId: r.level.toLowerCase(),
      blocks: [{ type: 'reading', reading }],
      // Passing a reading means you've met every word in it.
      learn: passageWords(reading.sentences, data.entries),
      cards: r.q.map((q, i) => ({
        id: `q:${n}.${i + 1}`,
        build: (rng) => {
          // The right answer comes first in the content; shuffle the options.
          const order = rng.shuffle(q.o.map((_, j) => j));
          return { type: 'choice', reading, prompt: q.q, options: order.map((j) => q.o[j]), correctIndex: order.indexOf(0), skill: 'Comprehension' };
        },
        info: { name: q.q, definition: q.o[0] },
      })),
      reviewCard: {
        id: `reread:${n}`,
        build: () => ({ type: 'reread', reading, skill: 'Re-reading' }),
        info: { name: `Re-read "${r.title}"`, definition: r.title },
      },
    };
    return { number: n, title: r.title, level: r.level, reading, sections: [section] };
  });
  return new Course(parts, lessons);
}

// ---------- Model ----------

class ReadingModel extends SrsModel {
  loadExtras() {
    const s = this.store;
    this.textScale = parseFloat(s.loadSetting('text_scale') || '') || 1.0;
    this.slowSpeech = s.loadSetting('slow_speech') === 'true';
    this.lookups = parseInt(s.loadSetting('lookups') || '0', 10) || 0;
    this.readAloudCount = parseInt(s.loadSetting('read_aloud') || '0', 10) || 0;
    this.fullLookups = parseInt(s.loadSetting('full_lookups') || '0', 10) || 0;
  }

  async setTextScale(scale) {
    this.textScale = Math.round(Math.min(1.6, Math.max(0.8, scale)) * 10) / 10;
    await this.store.saveSetting('text_scale', this.textScale);
    this.notify();
  }

  async setSlowSpeech(slow) {
    this.slowSpeech = slow;
    await this.store.saveSetting('slow_speech', slow);
    this.notify();
  }

  countLookup() { this.lookups++; return this.store.saveSetting('lookups', this.lookups); }
  countFullLookup() { this.fullLookups++; return this.store.saveSetting('full_lookups', this.fullLookups); }
  countReadAloud() { this.readAloudCount++; return this.store.saveSetting('read_aloud', this.readAloudCount); }

  lessonsAt(level) { return this.course.lessons.filter((l) => l.level === level); }

  /** Characters in the readings passed so far. */
  get charactersRead() {
    // Not readings skipped by the placement test.
    const read = this.achievementView();
    return this.course.lessons.filter((l) => read.lessonComplete(l)).reduce((n, l) => n + l.reading.characters, 0);
  }

  /**
   * Marks [section] passed and adds its re-read card to the level's deck. The
   * card starts as remembered, since the reading passed.
   */
  async passSection(part, section) {
    const now = this.now();
    const review = section.reviewCard;
    const added = [];
    if (part && review && !this.cards.has(review.id)) {
      added.push({ cardId: review.id, partId: part.id, card: this.scheduler.review(newCard(now), Rating.good, now) });
    }
    this.passed.add(section.id);
    for (const c of added) this.cards.set(c.cardId, c);
    await this.store.savePassedSection(section.id, now, added);
    this.notify();
  }

  learnedCards(part) {
    return part.sections.filter((s) => s.reviewCard && this.cards.has(s.reviewCard.id)).map((s) => s.reviewCard);
  }

  achievementFacts(stats) {
    return { model: this.achievementView(), stats, perfectQuizzes: this.store.perfectSectionQuizzes(1) };
  }

  buildAchievements() {
    const course = this.course;
    const readings = course.lessons.length;
    const done = (f) => f.model.lessonsComplete;
    const chars = (f) => f.model.charactersRead;
    const skillRight = (f, skill) => (f.stats.bySkill.get(skill) || { right: 0 }).right;
    const skillTotal = (f, skill) => (f.stats.bySkill.get(skill) || { total: 0 }).total;
    const practiceMinutes = (f) => Math.floor(f.stats.totalPracticeSeconds / 60);
    const streak = (f) => f.stats.longestStreak;
    // Quoted authors, from sources like 芥川龍之介『蜘蛛の糸』.
    const byAuthor = new Map();
    for (const l of course.lessons) {
      if (!l.reading.source) continue;
      const author = l.reading.source.split('『')[0].trim();
      if (!byAuthor.has(author)) byAuthor.set(author, []);
      byAuthor.get(author).push(l);
    }
    return [
      count('first_reading', 'First page', 'Pass your first reading.', '🚩', 1, done),
      count('readings_10', 'Ten readings', 'Pass ten readings.', '🔟', 10, done),
      count('readings_50', 'Fifty readings', 'Pass fifty readings.', '📈', 50, done),
      count('readings_100', 'A hundred readings', 'Pass a hundred readings.', '🎖️', 100, done),
      count('everything', 'Bookworm', `Pass all ${readings} readings, N5 to N1.`, '🐛', readings, done),
      count('chars_1000', 'A thousand characters', 'Read 1,000 characters in passed readings.', '🔤', 1000, chars),
      count('chars_10000', 'Ten thousand characters', 'Read 10,000 characters in passed readings.', '📃', 10000, chars),
      count('chars_30000', 'A short novel', 'Read 30,000 characters in passed readings.', '📕', 30000, chars),
      count('lookups_100', 'Curious', 'Look up a hundred words.', '🔍', 100, (f) => f.model.lookups),
      count('lookups_1000', 'Dictionary diver', 'Look up a thousand words.', '🤿', 1000, (f) => f.model.lookups),
      count('lookups_5000', 'Walking dictionary', 'Look up five thousand words.', '📘', 5000, (f) => f.model.lookups),
      count('aloud_1', 'Out loud', 'Listen to a reading read aloud.', '🔊', 1, (f) => f.model.readAloudCount),
      count('aloud_50', 'All ears', 'Listen to fifty readings read aloud.', '👂', 50, (f) => f.model.readAloudCount),
      count('comprehension_100', 'Got the gist', 'Get a hundred comprehension questions right first time.', '💡', 100, (f) => skillRight(f, 'Comprehension')),
      count('comprehension_500', 'Reads between the lines', 'Get five hundred comprehension questions right first time.', '🧠', 500, (f) => skillRight(f, 'Comprehension')),
      count('perfect_1', 'Full marks', 'Get every question about a reading right first time.', '⭐', 1, (f) => f.perfectQuizzes),
      count('perfect_25', 'Sharp reader', 'Get full marks on twenty-five readings.', '🌟', 25, (f) => f.perfectQuizzes),
      count('comeback_25', 'Second look', 'Get twenty-five questions right in a repeat round after missing them.', '↩️', 25, (f) => f.stats.repeats.right),
      count('reread_50', 'Old favourites', 'Re-read fifty passages in your reviews.', '🔖', 50, (f) => skillTotal(f, 'Re-reading')),
      count('reread_300', 'Well-thumbed', 'Re-read three hundred passages in your reviews.', '📑', 300, (f) => skillTotal(f, 'Re-reading')),
      ...[...byAuthor.entries()].map(([author, ls]) =>
        count(`author_${author}`, AUTHOR_NAMES[author] || author, ls.length === 1 ? `Read the excerpt by ${author}.` : `Read all ${ls.length} excerpts by ${author}.`, '🖋️', ls.length,
          (f) => ls.filter((l) => f.model.lessonComplete(l)).length)
      ),
      count('streak_3', 'On a roll', 'Study three days in a row.', '🔥', 3, streak),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('streak_30', 'Habit formed', 'Study thirty days in a row.', '📅', 30, streak),
      count('streak_100', 'Hundred-day club', 'Study a hundred days in a row.', '🎉', 100, streak),
      count('practice_60', 'Out in the wild', 'Log an hour of reading outside the app.', '🌿', 60, practiceMinutes),
      count('practice_600', 'Ten hours in the wild', 'Log ten hours of reading outside the app.', '🌳', 600, practiceMinutes),
      count('night_owl', 'Night owl', 'Read between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
      count('early_bird', 'Early bird', 'Read between 5am and 6am.', '🌅', 1, (f) => answersWhere(f, (d) => d.getHours() === 5), true),
      count('weekend', 'Weekend warrior', 'Answer a hundred questions on weekends.', '🛋️', 100, (f) => answersWhere(f, (d) => d.getDay() === 0 || d.getDay() === 6), true),
      count('every_word', 'Every word counts', 'Look up every word in a single reading.', '🔡', 1, (f) => f.model.fullLookups, true),
    ];
  }
}

// ---------- Passages ----------

function readingHeader(r) {
  const [label, emoji] = kindOf(r);
  const minutes = Math.max(1, Math.round(r.characters / 250));
  return html`<p class="label" style="margin-bottom:8px">${emoji} ${label} · ${r.level} · ${r.characters} characters · about ${minutes} min</p>`;
}

function renderReading(r, ui, app, { header = true } = {}) {
  const model = app.model;
  return html`<div>
    ${header ? readingHeader(r) : ''}
    ${renderPassage(`r${r.number}`, {
      sentences: r.sentences,
      paragraphs: r.paragraphs,
      dict: DICT,
      lesson: r.lesson,
      ui,
      scale: model.textScale,
      slow: model.slowSpeech,
      setSlow: (v) => model.setSlowSpeech(v),
      setScale: (v) => model.setTextScale(v),
      hooks: {
        onLookup: () => model.countLookup(),
        onFullLookup: () => model.countFullLookup(),
        onReadAloud: () => model.countReadAloud(),
      },
    })}
    ${r.source ? html`<p class="small" lang="ja" style="text-align:right;margin-top:6px">― ${r.source}</p>` : ''}
  </div>`;
}

function renderBlock(block, ui, app) {
  if (block.type === 'reading') return html`<div class="stack"><p class="small">Tap any word to see what it means.</p>${renderReading(block.reading, ui, app)}</div>`;
  return '';
}

// ---------- Quiz ----------

function questionSummary(q) {
  return q.type === 'choice' ? q.prompt : `Re-read "${q.reading.title}"`;
}

function renderQuestion({ question: q, ui, app, answer }) {
  if (q.type === 'reread') {
    return html`<div class="stack">
      <h2 class="h2">${q.reading.title}</h2>
      <p class="small">Read it again, looking up only what you need to.</p>
      <div class="card">${renderReading(q.reading, ui, app)}</div>
      <div class="h3" style="font-size:.95rem;margin-top:8px">How did it go?</div>
      <div class="btn-row">
        <button class="btn outline" ${ui.onClick(() => answer({ correct: false, given: '' }))}>${icon('cross')} Struggled</button>
        <button class="btn" ${ui.onClick(() => answer({ correct: true, given: '' }))}>${icon('check')} Read it fine</button>
      </div>
    </div>`;
  }
  return html`<div class="stack">
    <div class="h2" lang="ja" style="font-weight:600">${q.prompt}</div>
    <div class="stack" style="margin-top:8px">
      ${q.options.map((opt, i) => html`<button class="option" lang="ja" ${ui.onClick(() => answer({ correct: i === q.correctIndex, given: opt }))}>${opt}</button>`)}
    </div>
  </div>`;
}

/** A comprehension question's passage, to look back at while answering. */
function renderBelowQuestion(q, ui, app) {
  if (q.type !== 'choice') return '';
  // Long passages start folded, so the question stays near the top.
  return html`<details class="passage-tile" style="margin-top:20px" ${q.reading.characters <= 400 ? 'open' : ''}>
    <summary><span class="grow">The passage: ${q.reading.title}</span><span class="caret">${icon('chevron')}</span></summary>
    <div>${renderReading(q.reading, ui, app, { header: false })}</div>
  </details>`;
}

const givenText = (o) => (o.given ? o.given : o.correct ? 'Read it comfortably' : 'Struggled with it');

function renderResult(attempt) {
  const q = attempt.question;
  return html`<p lang="ja">${questionSummary(q)}</p>
    ${q.type === 'choice' ? html`
      ${!attempt.correct ? html`<p class="small" lang="ja">You answered: ${givenText(attempt.outcome)}</p>` : ''}
      <div class="h3" lang="ja" style="margin-top:6px">${q.options[q.correctIndex]}</div>` : ''}`;
}

function resultHeading(a) {
  if (a.question.type === 'reread') return `Last re-read: ${givenText(a.outcome).toLowerCase()}`;
  return a.correct ? 'Last question: right' : 'Last question: not quite';
}

// ---------- Today tab ----------

function planPanel(model) {
  return progressPanel(model, {
    noun: 'reading',
    nouns: 'readings',
    lessonsAt: (level) => model.lessonsAt(level),
    stats: [
      ['Readings done', `${model.lessonsComplete}/${model.course.lessons.length}`],
      ['Characters read', model.charactersRead.toLocaleString()],
      ['Words looked up', model.lookups.toLocaleString()],
    ],
  });
}

function readingTile(app, ui, lesson) {
  const model = app.model;
  const section = lesson.sections[0];
  const status = model.statusOf(section);
  const locked = status === SectionStatus.locked;
  const [kind] = kindOf(lesson.reading);
  return html`<a class="list-item" href="${path('section', section.id)}" ${locked ? ui.onClick(() => offerUnlock(app, section)) : ''}>
    <span class="status-icon ${status === 'passed' ? 'done' : ''}">${icon(status === 'passed' ? 'checkCircle' : locked ? 'lock' : 'play')}</span>
    <span class="grow">${lesson.number}. ${lesson.reading.title}
      <div class="sub">${kind} · ${lesson.reading.characters} characters${locked ? ' · tap to unlock early' : ''}</div></span>
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
      const r = lesson.reading;
      const [kind, emoji] = kindOf(r);
      const started = model.savedQuiz(SrsModel.sectionQuizKey(next));
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Today's reading · ${lesson.number} of ${model.course.lessons.length}</span>
          <div class="h2" style="margin:2px 0">${r.title}</div>
          <span class="small">${emoji} ${kind} · ${r.level} · ${r.characters} characters${started ? ' · questions started' : ''}</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Re-read ${plural(due, 'passage')} due today`}</a>` : ''}
    ${lessonFolds(app, ui, levelGroups(model), (l) => readingTile(app, ui, l), { listClass: 'list' })}
  </div>`;
}

function settingsExtra() {
  return html`    <h3 class="h3">Read aloud</h3>
    <p class="small" style="margin-top:4px">Read-aloud uses your browser's Japanese text-to-speech voice. Some devices need one installed in their settings first.</p>`;
}

const CREDITS = html`
  <p>Literature: public-domain works transcribed by <a href="https://www.aozora.gr.jp/" target="_blank" rel="noopener">Aozora Bunko</a> volunteers.</p>
  <p>Word meanings from <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a> and kanji meanings and readings from <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noopener">KANJIDIC2</a>, the property of the Electronic Dictionary Research and Development Group, used under <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noopener">their licence</a> (CC BY-SA 4.0).</p>
  <p>Tokenising: MeCab with UniDic, at build time only.</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const [content, store] = await Promise.all([
    fetch('data/content.json').then((r) => { if (!r.ok) throw new Error('content missing'); return r.json(); }),
    Store.open('vibe-reading'),
  ]);
  const course = buildCourse(content);
  const model = new ReadingModel(store, course, {
    appName: 'Reading',
    backupApp: 'vibe_web_reading',
    passMark: 0.8,
    noPartId: 'practice',
    // Re-reading a whole passage takes far longer than a question.
    statsOptions: { slowExcluded: (id, skill) => skill === 'Re-reading' },
  });
  model.load();
  const app = createSrsApp({
    id: 'reading',
    title: 'Reading',
    model,
    summaryNoun: 'readings',
    backupFile: 'vibe-reading-backup',
    credits: CREDITS,
    text: {
      sectionQuizStart: (n) => `Answer ${n} questions`,
      sectionQuizResume: (done, n) => `Resume questions (${done} of ${n} done)`,
      sectionQuizAgain: 'Answer the questions again',
      notPassed: 'It passes with 80% right first time. Read the passage again, then try the questions once more.',
      itemTimesNote: 'Time to first answer. Red means it was missed first time. Re-reads take longer than questions, because there is a whole passage to read.',
      itemDetailTitle: 'The passage',
      practiceTitle: 'Outside reading log',
      practiceChart: 'Minutes of outside reading',
      practiceStat: 'Outside reading',
      practiceNote: 'Time spent reading manga, news or anything else in Japanese, logged by you.',
      practiceEmpty: 'Nothing logged yet. Start the timer when you sit down to read something in Japanese.',
      practiceWhat: 'What did you read? (optional)',
      practiceInsight: (m) => `You logged ${m} minute${m === 1 ? '' : 's'} of outside reading over the last 7 days.`,
      slowNote: 'Median time to first answer. Re-reads are left out, because they take much longer than questions.',
      firstAchievement: 'Pass your first reading to unlock one.',
      reviewAll: (n) => `Re-read everything due (${plural(n, 'passage')})`,
      reviewAllResume: 'Resume re-reading everything due',
      reviewPart: (n) => `Re-read ${plural(n, 'passage')}`,
      weakestButton: (n) => `Re-read your weakest passages (up to ${n})`,
      weakestNote: "Weakest means the passages you most often struggled with, then your slowest. This is extra practice, so it doesn't change when passages are due.",
      weakestTitle: 'Your weakest re-reads',
      noAnswers: 'Pass a reading first, so there are answers to compare.',
      deckLearned: (n, total) => `${n} of ${total} passages to re-read`,
      deckExtra: (n) => `Extra re-reading (up to ${n})`,
      deckItemsTab: 'Passages',
      lessonWord: 'Reading',
      reviewAllTitle: "Today's re-reading",
      reviewPartTitle: (part) => `${part.title} re-reading`,
      sectionPassed: 'Reading passed',
      sectionNotPassed: 'Not passed yet',
      nextLesson: (l) => `Continue to the next reading: ${l.number}, ${l.title}`,
      backToLessons: 'Back to the readings',
      rereadSection: 'Read the passage again',
      missedTitle: (n) => `Questions you got wrong (${n})`,
      missedNote: 'Tap a question to see its answer and history.',
      everyItemTitle: 'Every question, slowest first',
      itemTitle: 'Reading',
      sectionsPassedStat: 'Readings passed',
      itemsLearnedStat: 'Passages to re-read',
      forecastTitle: 'Re-reads due, next 14 days',
      progressTitle: 'Progress by level',
      sectionsPassedRow: 'readings passed',
      mostMissedTitle: 'Most-missed questions and re-reads',
      slowTitle: 'Slowest questions',
      nothingDue: 'Nothing is due right now. Pass a reading to add it to your re-reading reviews.',
      questionWord: (q) => (q && q.type === 'reread' ? 'Passage' : 'Question'),
    },
    renderToday,
    renderBlock,
    renderQuestion,
    renderBelowQuestion,
    resultHeading,
    renderResult,
    renderItemDetail: (card, q, ui, app) => (q.type === 'reread' ? renderReading(q.reading, ui, app, { header: false }) : null),
    outcomeFromJson: (json) => ({ correct: !!json.correct, given: json.given || '' }),
    givenText,
    deckCards: (section) => (section.reviewCard ? [section.reviewCard] : []),
    partItemCount: (part) => part.sections.length,
    sectionScreenTitle: (lesson) => `Reading ${lesson.number} · ${lesson.level}`,
    settingsExtra,
  });
  connectLearner(wordLookupHooks(() => app.learner, 'reading'));
  return app;
});
