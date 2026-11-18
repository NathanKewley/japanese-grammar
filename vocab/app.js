// Vocabulary: the words of each reading and track, learned just before
// you meet them. Built from the Reading and Listening content by
// tools/build-vocab.py.

import { html, icon, plural, toast, furigana } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { createSrsApp, boot, path, offerUnlock, progressPanel, knownToggle, LEVELS } from '../shared/srs/screens.js';
import { cardToMap, newCard } from '../shared/srs/fsrs.js';
import { speak, stopSpeaking, posLabel } from '../shared/srs/passage.js';
import { normaliseTyped, hasRomaji, toHiragana } from '../shared/srs/romaji.js';
import { wordItem, describeWord } from '../shared/learner.js';

/** Words per lesson section, so a quiz stays short. */
const SECTION_SIZE = 12;

const LEVEL_SUMMARIES = {
  N5: 'Everyday words for the first readings and tracks.',
  N4: 'Life at the inn, and the old stories told there.',
  N3: 'Daily life, announcements and the myths of Izumo.',
  N2: 'Longer talks, the Kojiki myths and yōkai.',
  N1: 'Lectures, radio, literature and the myths retold in full.',
};

// ---------- Words ----------

const hiragana = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const hasKanji = (s) => /[㐀-鿿々]/.test(s);
const isKana = (c) => /[ぁ-ゖァ-ヺー]/.test(c);

/**
 * Furigana segments for a word: kana it shares with its reading at either end
 * stay bare, and the reading sits over the rest. 食べる / たべる → 食[た]べる.
 */
function wordSegments(w, r) {
  if (!hasKanji(w)) return [[w, '']];
  const rh = hiragana(r);
  let start = 0;
  while (start < w.length && isKana(w[start]) && hiragana(w[start]) === rh[start]) start++;
  let end = 0;
  while (end < w.length - start && isKana(w[w.length - 1 - end]) && hiragana(w[w.length - 1 - end]) === rh[rh.length - 1 - end]) end++;
  const out = [];
  if (start) out.push([w.slice(0, start), '']);
  out.push([w.slice(start, w.length - end), r.slice(start, r.length - end)]);
  if (end) out.push([w.slice(w.length - end), '']);
  return out;
}

/** The broad kind of word, so wrong options in a quiz are the same sort of word. */
function groupOf(pos) {
  if (pos.some((p) => p.startsWith('v'))) return 'verb';
  if (pos.some((p) => p.startsWith('adj'))) return 'adjective';
  if (pos.some((p) => p.startsWith('adv'))) return 'adverb';
  return 'noun';
}

/** A meaning short enough for a quiz option: the first sense, to two glosses. */
const shortMeaning = (w) => w.m[0].split('; ').slice(0, 2).join('; ');

/** Strips what a keyboard adds: spaces and end punctuation. */
const normaliseAnswer = (typed) => typed.replace(/[\s　]/g, '').replace(/[。．.!！?？、,]+$/, '');

// ---------- Course ----------

function buildCourse(data) {
  const parts = data.levels.map((l, i) => ({ id: l.id.toLowerCase(), number: i + 1, title: `${l.id} words`, summary: LEVEL_SUMMARIES[l.id] || l.title }));
  const byGroup = {}; // level -> group -> [word]

  function meaningCard(word) {
    return {
      id: `mean:${word.key}`,
      build: (rng) => {
        // Three other words of the same level and kind, with meanings that differ.
        const pool = byGroup[word.level][word.group];
        const right = shortMeaning(word);
        const options = [right];
        for (const other of rng.shuffle(pool)) {
          if (options.length === 4) break;
          const m = shortMeaning(other);
          if (other !== word && !options.includes(m)) options.push(m);
        }
        const order = rng.shuffle(options.map((_, i) => i));
        return { type: 'choice', kind: 'meaning', word, options: order.map((i) => options[i]), correctIndex: order.indexOf(0), skill: 'Meanings' };
      },
      info: { name: word.w, definition: shortMeaning(word) },
      learn: [word.item],
    };
  }

  function readingCard(word) {
    return {
      id: `read:${word.key}`,
      build: () => ({ type: 'typein', kind: 'reading', word, skill: 'Readings' }),
      info: { name: `${word.w}: reading`, definition: word.r },
      learn: [word.item],
    };
  }

  const lessons = data.lessons.map((l) => {
    const sentences = l.sentences.map((s) => ({ ...s }));
    const words = l.words.map((raw) => {
      const key = `${raw.w}|${hiragana(raw.r)}`;
      const word = {
        key,
        w: raw.w,
        r: raw.r,
        m: raw.m,
        pos: raw.p,
        group: groupOf(raw.p),
        level: l.level,
        lesson: l.n,
        segments: wordSegments(raw.w, raw.r),
        hasKanji: hasKanji(raw.w),
        examples: raw.ex.map(([i, start, end]) => ({ sentence: sentences[i], em: new Set(Array.from({ length: end - start }, (_, j) => start + j)) })),
        item: wordItem(raw.w, raw.r, raw.m[0] || ''),
      };
      ((byGroup[l.level] ||= {})[word.group] ||= []).push(word);
      return word;
    });
    // Even sections of at most SECTION_SIZE words.
    const count = Math.max(1, Math.ceil(words.length / SECTION_SIZE));
    const size = Math.ceil(words.length / count);
    const sections = [];
    for (let i = 0; i < count; i++) {
      const chunk = words.slice(i * size, (i + 1) * size);
      if (!chunk.length) continue;
      sections.push({
        id: `v${l.n}.${i + 1}`,
        title: count === 1 ? 'Words' : `Words, part ${i + 1} of ${count}`,
        kind: 'words',
        deckId: l.level.toLowerCase(),
        blocks: [
          ...(i === 0 ? [{ type: 'intro', lesson: l }] : []),
          { type: 'words', words: chunk },
        ],
        cards: chunk.flatMap((w) => (w.hasKanji ? [meaningCard(w), readingCard(w)] : [meaningCard(w)])),
      });
    }
    return { number: l.n, title: l.reading || l.track, level: l.level, reading: l.reading, track: l.track, words, sections };
  });
  const course = new Course(parts, lessons);
  course.wordByKey = new Map(lessons.flatMap((l) => l.words.map((w) => [w.key, w])));
  return course;
}

// ---------- Model ----------

class VocabModel extends SrsModel {
  lessonsAt(level) { return this.course.lessons.filter((l) => l.level === level); }

  /** Words with a card in the review deck. */
  get wordsLearned() {
    let n = 0;
    for (const w of this.course.wordByKey.values()) if (this.cards.has(`mean:${w.key}`)) n++;
    return n;
  }

  /** Course words you've looked up in Reading or Listening that aren't in the deck yet. */
  lookedUpNotAdded(learner) {
    if (!learner) return [];
    const out = [];
    for (const id of learner.lookups.keys()) {
      const word = id.startsWith('w:') ? this.course.wordByKey.get(id.slice(2)) : null;
      if (word && !this.cards.has(`mean:${word.key}`)) out.push(word);
    }
    return out;
  }

  /** Puts [words]' cards straight into their level's review deck, due now. */
  async addWords(words) {
    const now = this.now();
    const added = [];
    for (const w of words) {
      for (const id of cardIdsOf(w)) {
        if (this.cards.has(id)) continue;
        const card = this.course.cardById(id);
        const part = card && this.course.partOfCard(card);
        if (part) added.push({ cardId: id, partId: part.id, card: newCard(now) });
      }
    }
    for (const c of added) this.cards.set(c.cardId, c);
    await this.store.write(added.map((c) => ({ table: 'srs_cards', put: { card_id: c.cardId, part_id: c.partId, data: JSON.stringify(cardToMap(c.card)) } })));
    this.notify();
    return added.length;
  }

  buildAchievements() {
    const lessons = this.course.lessons.length;
    const words = this.course.wordByKey.size;
    const done = (f) => f.model.lessonsComplete;
    const learned = (f) => f.model.wordsLearned;
    const streak = (f) => f.stats.longestStreak;
    return [
      count('first_lesson', 'First words', 'Finish your first lesson.', '🌱', 1, done),
      count('lessons_10', 'Ten lessons', 'Finish ten lessons.', '🔟', 10, done),
      count('lessons_50', 'Fifty lessons', 'Finish fifty lessons.', '📈', 50, done),
      count('everything', 'Lexicon', `Finish all ${lessons} lessons, N5 to N1.`, '📚', lessons, done),
      count('words_100', 'A hundred words', 'Have a hundred words in your reviews.', '💯', 100, learned),
      count('words_1000', 'A thousand words', 'Have a thousand words in your reviews.', '🎖️', 1000, learned),
      count('words_all', 'Every word', `Have all ${words.toLocaleString()} words in your reviews.`, '🏆', words, learned),
      count('perfect_1', 'Full marks', 'Get every question in a lesson right first time.', '⭐', 1, (f) => f.perfectQuizzes),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('streak_30', 'Habit formed', 'Study thirty days in a row.', '📅', 30, streak),
      count('night_owl', 'Night owl', 'Study between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
    ];
  }
}

let APP = null;

// ---------- Sound ----------

/** Says a word, or a sentence from its kana, so a kanji can't be misread. */
async function say(text) {
  stopSpeaking();
  stopClip();
  if (!(await speak(text))) toast("No Japanese voice found. Add a Japanese text-to-speech voice in your device's settings (or try another browser), then reload the page.", 6000);
}

/** One audio element for clips from the Listening tracks. */
const clip = { audio: new Audio(), stopAt: null };

function stopClip() {
  clip.audio.pause();
  clip.stopAt = null;
}

function tickClip() {
  if (clip.stopAt == null) return;
  if (clip.audio.currentTime >= clip.stopAt) { stopClip(); return; }
  if (!clip.audio.paused) requestAnimationFrame(tickClip);
}

/** Plays one line of a Listening track. Falls back to the speech voice if the audio won't play. */
async function playClip(sentence) {
  stopSpeaking();
  const a = clip.audio;
  const file = sentence.audio.replace(/\.ogg$/, a.canPlayType('audio/ogg; codecs=opus') ? '.ogg' : '.m4a');
  const src = new URL(`../listening/audio/${file}`, location.href).href;
  const [start, end] = sentence.clip;
  clip.stopAt = (end + 300) / 1000;
  try {
    // iOS only lets audio start from a tap, so play() comes before any
    // waiting. A new file plays muted until it has jumped to the line.
    if (a.src !== src || a.error) {
      a.src = src;
      a.muted = true;
      a.addEventListener('loadedmetadata', () => {
        a.currentTime = Math.max(0, start - 150) / 1000;
        a.addEventListener('seeked', () => { a.muted = false; }, { once: true });
      }, { once: true });
    } else {
      a.currentTime = Math.max(0, start - 150) / 1000;
    }
    await a.play();
    requestAnimationFrame(tickClip);
  } catch (e) {
    say(sentence.seg.map(([t, r]) => r || t).join(''));
  }
}

window.addEventListener('hashchange', () => { stopClip(); stopSpeaking(); });

// ---------- Lesson content ----------

const sentenceKana = (s) => s.seg.map(([t, r]) => r || t).join('');

function exampleLine(ex, ui) {
  const s = ex.sentence;
  const audio = s.src === 'listening';
  return html`<div class="row" style="align-items:flex-start;gap:8px;margin-top:8px">
    <div class="grow">
      <div class="ja-m" style="line-height:1.9">${furigana(s.seg, ex.em)}</div>
      <div class="tiny">${audio ? `From Track ${s.n}` : `From Reading ${s.n}`}</div>
    </div>
    <button class="icon-btn" type="button" style="width:34px;height:34px;flex:none;margin-top:6px" title="${audio ? 'Play this line' : 'Hear this sentence'}" aria-label="${audio ? 'Play this line' : 'Hear this sentence'}"
      ${ui.onClick(() => (audio ? playClip(s) : say(sentenceKana(s))))}>${icon(audio ? 'play' : 'speaker')}</button>
  </div>`;
}

const cardIdsOf = (word) => (word.hasKanji ? [`mean:${word.key}`, `read:${word.key}`] : [`mean:${word.key}`]);

/** What the learner model says about [word] from the other apps, if anything. */
function knownElsewhere(word) {
  return APP && APP.learner ? describeWord(APP.learner, word.item, 'vocab') : '';
}

function wordCard(word, ui) {
  const pos = [...new Set(word.pos.map(posLabel))].join(', ');
  const known = knownElsewhere(word);
  return html`<div class="card vocab-word">
    <div class="row" style="align-items:flex-end;gap:4px 10px;flex-wrap:wrap">
      <span class="ja-m" style="font-size:1.6rem">${furigana(word.segments)}</span>
      <span class="small grow">${pos}</span>
      <button class="icon-btn" type="button" style="width:34px;height:34px" title="Say it" aria-label="Say it" ${ui.onClick(() => say(hiragana(word.r)))}>${icon('speaker')}</button>
    </div>
    ${known ? html`<p class="small known-note" style="color:var(--accent);font-weight:600;margin-top:2px">${known}</p>` : ''}
    ${APP ? html`<div style="margin-top:6px">${knownToggle(APP, ui, cardIdsOf(word))}</div>` : ''}
    <div style="margin-top:4px">${word.m.map((m, i) => html`<p style="margin:0 0 2px">${word.m.length === 1 ? m : `${i + 1}. ${m}`}</p>`)}</div>
    ${word.examples.map((ex) => exampleLine(ex, ui))}
  </div>`;
}

function renderBlock(block, ui) {
  if (block.type === 'intro') {
    const l = block.lesson;
    const where = [l.reading ? `Reading ${l.n}, “${l.reading}”` : '', l.track ? `Track ${l.n}, “${l.track}”` : ''].filter(Boolean).join(' and ');
    return html`<p class="prose">These are the new words in ${where}. Learn them here, and the passages will be easier when you get to them. Each example comes from the passage itself.</p>`;
  }
  if (block.type === 'words') {
    return html`<div class="stack">${block.words.map((w) => wordCard(w, ui))}</div>`;
  }
  return '';
}

// ---------- Quiz ----------

function questionSummary(q) {
  return q.kind === 'meaning' ? `${q.word.w}: what does it mean?` : `${q.word.w}: how is it read?`;
}

/** Whether [typed] is the word's reading, in kana or romaji. */
function readingMatches(word, typed) {
  return hiragana(normaliseAnswer(normaliseTyped(typed))) === hiragana(word.r);
}

function renderQuestion({ question: q, ui, answer }) {
  if (q.type === 'choice') {
    return html`<div class="stack">
      <div class="h3">What does this mean?</div>
      <div class="ja-xl" style="font-size:2.3rem">${furigana(q.word.segments)}</div>
      <div class="stack" style="margin-top:8px">
        ${q.options.map((opt, i) => html`<button class="option" ${ui.onClick(() => answer({ correct: i === q.correctIndex, given: opt }))}>${opt}</button>`)}
      </div>
    </div>`;
  }
  const check = () => {
    const input = document.getElementById('answer');
    const given = normaliseAnswer(normaliseTyped(input.value));
    if (!given) return;
    answer({ correct: readingMatches(q.word, input.value), given });
  };
  ui.after(() => {
    const input = document.getElementById('answer');
    const preview = document.getElementById('kana-preview');
    if (!input) return;
    input.addEventListener('input', () => {
      preview.textContent = hasRomaji(input.value) ? `→ ${toHiragana(input.value)}` : '';
    });
  });
  return html`<form class="stack" ${ui.onSubmit(check)}>
    <div class="h3">How is this read?</div>
    <div class="ja-xl" lang="ja" style="font-size:2.3rem">${q.word.w}</div>
    <p class="small" style="color:var(--ink)">${shortMeaning(q.word)}</p>
    <div>
      <input id="answer" class="text-input" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"
        placeholder="Type it in kana (or romaji)" aria-label="Your answer" data-autofocus>
      <div class="kana-preview" id="kana-preview" lang="ja"></div>
    </div>
    <button class="btn block" type="submit">Check</button>
  </form>`;
}

function givenText(o) {
  return o.typo ? `${o.given} (typo, counted as right)` : o.given || '';
}

/** The word in full, with a button to hear it, for results and the item page. */
function answerPanel(q, ui) {
  const w = q.word;
  return html`<div>
    <div class="row" style="align-items:flex-end;gap:8px">
      <span class="ja-l">${furigana(w.segments)}</span>
      <button class="icon-btn" type="button" style="width:34px;height:34px" title="Say it" aria-label="Say it" ${ui.onClick(() => say(hiragana(w.r)))}>${icon('speaker')}</button>
    </div>
    <p style="margin-top:4px">${w.m[0]}</p>
    ${w.examples.length ? exampleLine(w.examples[0], ui) : ''}
  </div>`;
}

function renderResult(attempt, ui) {
  const q = attempt.question;
  const o = attempt.outcome;
  return html`<p class="small" lang="ja" style="color:var(--ink)">${questionSummary(q)}</p>
    ${o.given && !attempt.correct ? html`<p class="small" lang="ja">You answered: ${givenText(o)}</p>` : ''}
    <div style="margin-top:6px">${answerPanel(q, ui)}</div>`;
}

function resultHeading(a) {
  return a.outcome.typo ? 'Last question: counted as right' : a.correct ? 'Last question: right' : 'Last question: not quite';
}

// ---------- Today tab ----------

function planPanel(model) {
  return progressPanel(model, {
    noun: 'lesson',
    nouns: 'lessons',
    lessonsAt: (level) => model.lessonsAt(level),
    stats: [
      ['Lessons done', `${model.lessonsComplete}/${model.course.lessons.length}`],
      ['Words in reviews', `${model.wordsLearned.toLocaleString()}/${model.course.wordByKey.size.toLocaleString()}`],
    ],
  });
}

/** One part of a lesson: its status, and a glimpse of its words. */
function partRow(app, ui, section, label) {
  const status = app.model.statusOf(section);
  const locked = status === SectionStatus.locked;
  const words = section.blocks.find((b) => b.type === 'words').words;
  return html`<a class="list-item" href="${path('section', section.id)}" ${locked ? ui.onClick(() => offerUnlock(app, section)) : ''}>
    <span class="status-icon ${status === 'passed' ? 'done' : ''}">${icon(status === 'passed' ? 'checkCircle' : locked ? 'lock' : 'play')}</span>
    <span class="grow">${label}
      <div class="sub"><span lang="ja">${words.slice(0, 5).map((w) => w.w).join('、')}${words.length > 5 ? '…' : ''}</span>${locked ? ' · tap to unlock early' : ''}</div></span>
  </a>`;
}

/** A lesson in the list: one row, or a dropdown of its parts like Writing's. */
function lessonTile(app, ui, lesson) {
  const model = app.model;
  const total = lesson.sections.length;
  const title = `${lesson.number}. ${lesson.title}`;
  if (total === 1) return html`<div class="list">${partRow(app, ui, lesson.sections[0], html`${title} · ${plural(lesson.words.length, 'word')}`)}</div>`;
  const complete = model.lessonComplete(lesson);
  const next = model.nextSection;
  const open = next && model.course.lessonOf(next) === lesson;
  return html`<details class="lesson" ${open ? 'open' : ''}>
    <summary>
      <span class="status-icon ${complete ? 'done' : ''}">${icon(complete ? 'checkCircle' : 'circle')}</span>
      <span class="grow">
        <div>${title}</div>
        <div class="small">${plural(lesson.words.length, 'word')} · ${model.lessonPassedCount(lesson)}/${total} parts</div>
      </span>
      <span class="caret">${icon('chevron')}</span>
    </summary>
    <div class="list">
      ${lesson.sections.map((s, i) => partRow(app, ui, s, `Part ${i + 1} of ${total} · ${plural(s.cards.filter((c) => c.id.startsWith('mean:')).length, 'word')}`))}
    </div>
  </details>`;
}

/** Words looked up in Reading and Listening, offered for the review deck. */
function lookupsPanel(app, ui) {
  const words = app.model.lookedUpNotAdded(app.learner);
  if (!words.length) return '';
  const add = async () => {
    const n = await app.model.addWords(words);
    toast(`Added ${plural(words.length, 'word')} to your reviews (${plural(n, 'card')}).`);
  };
  return html`<div class="card">
    <div class="h3">Words you looked up</div>
    <p class="small" style="margin:4px 0 10px">You've looked up ${plural(words.length, 'word')} in Reading and Listening that ${words.length === 1 ? "isn't" : "aren't"} in your reviews yet: ${words.slice(0, 8).map((w) => w.w).join('、')}${words.length > 8 ? '…' : ''}</p>
    <button class="btn tonal small" type="button" ${ui.onClick(add)}>Add them to my reviews</button>
  </div>`;
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
      const started = model.savedQuiz(SrsModel.sectionQuizKey(next));
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Today's words · lesson ${lesson.number} of ${model.course.lessons.length}</span>
          <div class="h2" style="margin:2px 0">${lesson.title}</div>
          <span class="small">${lesson.level} · ${next.title}${started ? ' · quiz started' : ''}</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Review ${plural(due, 'card')} due today`}</a>` : ''}
    ${lookupsPanel(app, ui)}
    ${LEVELS.map((level) => html`<section>
      <h2 class="h3">${level}</h2>
      <div style="margin-top:6px">${model.lessonsAt(level).map((l) => lessonTile(app, ui, l))}</div>
    </section>`)}
  </div>`;
}

const CREDITS = html`
  <p>Words come from the Reading and Listening passages, so each lesson prepares you for one of each.</p>
  <p>Word meanings from <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a>, the property of the Electronic Dictionary Research and Development Group, used under <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noopener">their licence</a> (CC BY-SA 4.0).</p>
  <p>Example audio from the Listening tracks, voiced with <a href="https://voicevox.hiroshiba.jp/" target="_blank" rel="noopener">VOICEVOX</a>; see the Listening app for each voice.</p>
  <p>Tokenising: MeCab with UniDic, at build time only.</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const [content, store] = await Promise.all([
    fetch('data/content.json').then((r) => { if (!r.ok) throw new Error('content missing'); return r.json(); }),
    Store.open('vibe-vocab'),
  ]);
  const course = buildCourse(content);
  const model = new VocabModel(store, course, {
    appName: 'Vocabulary',
    backupApp: 'vibe_web_vocab',
    passMark: 0.8,
    noPartId: 'practice',
  });
  model.load();
  const app = createSrsApp({
    id: 'vocab',
    title: 'Vocabulary',
    model,
    summaryNoun: 'lessons',
    backupFile: 'vibe-vocab-backup',
    credits: CREDITS,
    text: {
      itemDetailTitle: 'Word',
      nothingDue: 'Nothing is due right now. Finish a lesson to add its words to your reviews.',
    },
    renderToday,
    renderBlock,
    renderQuestion,
    resultHeading,
    renderResult,
    renderItemDetail: (card, q, ui) => answerPanel(q, ui),
    outcomeFromJson: (json) => ({ correct: !!json.correct, given: json.given || '', typo: !!json.typo }),
    givenText,
    amendable: true,
    canAmend: (a) => a.question.type === 'typein',
    amendOutcome: (o) => ({ ...o, correct: true, typo: true }),
    showGiven: true,
    sectionScreenTitle: (lesson) => `Lesson ${lesson.number} · ${lesson.level}`,
  });
  APP = app;
  // The "words you looked up" panel and "known from" notes need the learner model.
  app.learnerReady.then(() => app.ui.screen && app.ui.render());
  return app;
});
