// Listening: 132 voiced tracks with JLPT-style questions and dictation.

import { html, icon, plural } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { statGrid, barRow } from '../shared/srs/ui.js';
import { createSrsApp, boot, path, offerUnlock, progressPanel, LEVELS } from '../shared/srs/screens.js';
import { Rating, newCard } from '../shared/srs/fsrs.js';
import { Dictionary, renderPassage, resetPassages, connectLearner } from '../shared/srs/passage.js';
import { passageWords, wordLookupHooks } from '../shared/learner.js';
import { normaliseTyped, hasRomaji, toHiragana } from '../shared/srs/romaji.js';

const LEVEL_SUMMARIES = {
  N5: 'Short, slow conversations about everyday things.',
  N4: 'Settling in at an inn in Izumo, and the old stories told there.',
  N3: 'Daily life, announcements, and the myths of Izumo.',
  N2: 'Longer talks, the Kojiki myths, and yōkai.',
  N1: 'Lectures, radio and the myths retold in full.',
};

const TYPES = {
  task: ['Task', 'Work out what someone will do next.', '✅'],
  point: ['Key point', 'Listen for one detail, like a reason or a time.', '📍'],
  gist: ['Gist', 'Follow what a talk or conversation is mainly about.', '💭'],
  response: ['Quick response', 'Hear one line, then pick the natural reply.', '↪️'],
  announcement: ['Announcement', 'Notices, broadcasts and messages.', '📢'],
  story: ['Story', 'A story told aloud.', '📖'],
  integrated: ['Integrated', 'Compare several pieces of information.', '🧩'],
};

const typeOf = (item) => TYPES[item.type] || ['Listening', '', '🎧'];

/** Speakers as they're named in English prompts. */
const SPEAKERS = {
  男: 'the man', 女: 'the woman', 店員: 'the shop assistant', 駅員: 'the station attendant', アナウンス: 'the announcer',
  先生: 'the teacher', 医者: 'the doctor', 女将: 'the innkeeper', 主人: "the innkeeper's husband", おじいちゃん: 'Grandpa',
  葵: 'Aoi', 太一: 'Taichi', 拓海: 'Takumi',
};

const length = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// ---------- Content ----------

let DICT = null;
let MODEL = null;

function choice(item, q, rng, review = false) {
  // The right answer comes first in the content; shuffle the options.
  const order = rng.shuffle(q.o.map((_, i) => i));
  return {
    type: 'choice',
    item,
    prompt: q.q,
    options: order.map((i) => q.o[i]),
    correctIndex: order.indexOf(0),
    line: q.l < 0 ? null : q.l,
    review,
    skill: typeOf(item)[0],
  };
}

function buildCourse(data) {
  DICT = new Dictionary(data.entries, data.kanji);
  const parts = data.levels.map((l, i) => ({ id: l.id.toLowerCase(), number: i + 1, title: `${l.id} tracks`, summary: LEVEL_SUMMARIES[l.id] || l.title }));
  const lessons = data.items.map((it) => {
    const n = it.n;
    const item = {
      number: n,
      level: it.level,
      title: it.title,
      type: it.type,
      lesson: it.lesson,
      source: it.source,
      characters: it.chars,
      duration: it.dur,
      audio: `audio/${it.audio.split('/').pop()}`,
      lines: it.lines.map((l) => ({ speaker: l.sp, text: l.t, words: l.w, start: l.a, end: l.b, dictation: l.d ? new RegExp(`^${l.d}$`) : null })),
      questions: it.q,
      reviewQuestions: it.r,
    };
    const deck = it.level.toLowerCase();
    const reviewId = `relisten:${n}`;
    return {
      number: n,
      title: it.title,
      level: it.level,
      item,
      sections: [
        {
          id: `l${n}`,
          title: it.title,
          kind: 'listening',
          deckId: deck,
          blocks: [],
          // Passing a track means you've met every word in it.
          learn: passageWords(it.lines, data.entries),
          cards: it.q.map((q, i) => ({ id: `q:${n}.${i + 1}`, build: (rng) => choice(item, q, rng), info: { name: q.q, definition: q.o[0] } })),
          reviewCard: {
            id: reviewId,
            // A review asks the kept-back questions in turn, then the lesson's
            // ones, so the same question doesn't come back until every other one has.
            build: (rng) => {
              const pool = [...item.reviewQuestions, ...item.questions];
              return choice(item, pool[MODEL.reviewTurn(reviewId) % pool.length], rng, true);
            },
            info: { name: `Listen again: "${it.title}"`, definition: it.title },
          },
        },
        {
          id: `d${n}`,
          title: 'Dictation',
          kind: 'dictation',
          deckId: deck,
          blocks: [],
          cards: item.lines
            .map((line, i) => (line.dictation ? { id: `dict:${n}.${i + 1}`, build: () => ({ type: 'dictation', item, line: i, skill: 'Dictation' }), info: { name: line.text, definition: it.title } } : null))
            .filter(Boolean),
        },
      ],
    };
  });
  return new Course(parts, lessons);
}

/** Katakana as hiragana, full-width digits as ASCII, any dash as ー, and no punctuation or spaces. */
function normaliseDictation(text) {
  let out = '';
  for (const ch of text) {
    const r = ch.codePointAt(0);
    if (r >= 0x30a1 && r <= 0x30f6) out += String.fromCodePoint(r - 0x60);
    else if (r >= 0xff10 && r <= 0xff19) out += String.fromCodePoint(r - 0xff10 + 0x30);
    else if ([0xff5e, 0x7e, 0x2d, 0x2010, 0x2212, 0xff70].includes(r)) out += 'ー';
    else out += ch;
  }
  return out.replace(/[\p{P}\p{S}\p{Z}\s]/gu, '');
}

// ---------- Model ----------

class ListeningModel extends SrsModel {
  loadExtras() {
    const s = this.store;
    this.textScale = parseFloat(s.loadSetting('text_scale') || '') || 1.0;
    this.lookups = parseInt(s.loadSetting('lookups') || '0', 10) || 0;
    this.plays = parseInt(s.loadSetting('plays') || '0', 10) || 0;
    this.oneListenRight = parseInt(s.loadSetting('one_listen_right') || '0', 10) || 0;
    this.fullLookups = parseInt(s.loadSetting('full_lookups') || '0', 10) || 0;
    try { this.turns = JSON.parse(s.loadSetting('review_turns') || '{}'); } catch (e) { this.turns = {}; }
  }

  reviewTurn(id) { return this.turns[id] || 0; }

  async setTextScale(scale) {
    this.textScale = Math.round(Math.min(1.6, Math.max(0.8, scale)) * 10) / 10;
    await this.store.saveSetting('text_scale', this.textScale);
    this.notify();
  }

  countLookup() { this.lookups++; return this.store.saveSetting('lookups', this.lookups); }
  countFullLookup() { this.fullLookups++; return this.store.saveSetting('full_lookups', this.fullLookups); }
  countPlay() { this.plays++; return this.store.saveSetting('plays', this.plays); }
  countOneListenRight() { this.oneListenRight++; return this.store.saveSetting('one_listen_right', this.oneListenRight); }

  lessonsAt(level) { return this.course.lessons.filter((l) => l.level === level); }

  get audioHeard() {
    return this.course.lessons.filter((l) => this.lessonComplete(l)).reduce((n, l) => n + l.item.duration, 0);
  }

  /**
   * A passed listening section adds one "listen again" card; a passed
   * dictation section adds a card for each of its lines.
   */
  async passSection(part, section, results) {
    const now = this.now();
    const review = section.reviewCard;
    const ratings = review ? new Map([[review.id, true]]) : new Map(section.cards.map((c) => [c.id, results.get(c.id) ?? false]));
    const added = [];
    for (const [id, correct] of ratings) {
      if (!part || this.cards.has(id)) continue;
      added.push({ cardId: id, partId: part.id, card: this.scheduler.review(newCard(now), correct ? Rating.good : Rating.again, now) });
    }
    this.passed.add(section.id);
    for (const c of added) this.cards.set(c.cardId, c);
    await this.store.savePassedSection(section.id, now, added);
    this.notify();
  }

  learnedCards(part) {
    return part.sections.flatMap((s) => [...(s.reviewCard ? [s.reviewCard] : []), ...s.cards]).filter((c) => this.cards.has(c.id));
  }

  async recordReview(cardId, opts) {
    await super.recordReview(cardId, opts);
    // The next review of a track asks its next question.
    if (cardId.startsWith('relisten:')) {
      this.turns[cardId] = (this.turns[cardId] || 0) + 1;
      await this.store.saveSetting('review_turns', JSON.stringify(this.turns));
    }
  }

  achievementFacts(stats) {
    return { model: this.achievementView(), stats, perfectQuizzes: this.store.perfectSectionQuizzes(1) };
  }

  buildAchievements() {
    const course = this.course;
    const tracks = course.lessons.length;
    const done = (f) => f.model.lessonsComplete;
    const minutes = (f) => Math.floor(f.model.audioHeard / 60000);
    const skillRight = (f, skill) => (f.stats.bySkill.get(skill) || { right: 0 }).right;
    const practiceMinutes = (f) => Math.floor(f.stats.totalPracticeSeconds / 60);
    const streak = (f) => f.stats.longestStreak;
    const part = (id, title, description, emoji) => {
      const p = course.partById(id);
      return count(`part_${id}`, title, description, emoji, p.sections.length, (f) => f.model.passedCount(p));
    };
    const typeAchievement = (type, title, what, emoji) => {
      const ls = course.lessons.filter((l) => l.item.type === type);
      return count(`type_${type}`, title, `Finish all ${ls.length} ${what}.`, emoji, Math.max(1, ls.length), (f) => ls.filter((l) => f.model.lessonComplete(l)).length);
    };
    return [
      count('first_track', 'First listen', 'Finish your first track.', '🚩', 1, done),
      count('tracks_10', 'Ten tracks', 'Finish ten tracks.', '🔟', 10, done),
      count('tracks_50', 'Fifty tracks', 'Finish fifty tracks.', '📈', 50, done),
      count('tracks_100', 'A hundred tracks', 'Finish a hundred tracks.', '🎖️', 100, done),
      count('everything', 'All ears', `Finish all ${tracks} tracks, N5 to N1.`, '👑', tracks, done),
      part('n5', 'N5 listener', 'Finish every N5 track.', '5️⃣'),
      part('n4', 'N4 listener', 'Finish every N4 track.', '4️⃣'),
      part('n3', 'N3 listener', 'Finish every N3 track.', '3️⃣'),
      part('n2', 'N2 listener', 'Finish every N2 track.', '2️⃣'),
      part('n1', 'N1 listener', 'Finish every N1 track.', '1️⃣'),
      typeAchievement('story', "Storyteller's friend", 'stories', '📖'),
      typeAchievement('announcement', 'Mind the gap', 'announcements', '🚉'),
      typeAchievement('response', 'Quick on the reply', 'quick-response tracks', '↪️'),
      count('minutes_30', 'Half an hour', 'Hear 30 minutes of finished tracks.', '⏱️', 30, minutes),
      count('minutes_100', 'A hundred minutes', 'Hear a hundred minutes of finished tracks.', '⏳', 100, minutes),
      count('plays_500', 'On repeat', 'Press play 500 times.', '🔁', 500, (f) => f.model.plays),
      count('lookups_100', 'Curious', 'Look up a hundred words in transcripts.', '🔍', 100, (f) => f.model.lookups),
      count('lookups_1000', 'Dictionary diver', 'Look up a thousand words in transcripts.', '🤿', 1000, (f) => f.model.lookups),
      count('one_listen_25', 'Sharp ears', 'Answer 25 questions right after hearing the audio only once.', '👂', 25, (f) => f.model.oneListenRight),
      count('one_listen_250', 'Perfect pitch', 'Answer 250 questions right after hearing the audio only once.', '🎯', 250, (f) => f.model.oneListenRight),
      count('dictation_50', 'Scribe', 'Write down 50 lines right first time.', '✍️', 50, (f) => skillRight(f, 'Dictation')),
      count('dictation_250', 'Court stenographer', 'Write down 250 lines right first time.', '⌨️', 250, (f) => skillRight(f, 'Dictation')),
      count('perfect_1', 'Full marks', 'Get every question in a section right first time.', '⭐', 1, (f) => f.perfectQuizzes),
      count('perfect_25', 'Nothing gets past you', 'Get full marks in twenty-five sections.', '🌟', 25, (f) => f.perfectQuizzes),
      count('comeback_25', 'Second listen', 'Get twenty-five questions right in a repeat round after missing them.', '↩️', 25, (f) => f.stats.repeats.right),
      count('streak_3', 'On a roll', 'Study three days in a row.', '🔥', 3, streak),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('streak_30', 'Habit formed', 'Study thirty days in a row.', '📅', 30, streak),
      count('streak_100', 'Hundred-day club', 'Study a hundred days in a row.', '🎉', 100, streak),
      count('practice_60', 'Out in the wild', 'Log an hour of listening outside the app.', '🌿', 60, practiceMinutes),
      count('practice_600', 'Ten hours in the wild', 'Log ten hours of listening outside the app.', '🌳', 600, practiceMinutes),
      count('night_owl', 'Night owl', 'Listen between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
      count('early_bird', 'Early bird', 'Listen between 5am and 6am.', '🌅', 1, (f) => answersWhere(f, (d) => d.getHours() === 5), true),
      count('weekend', 'Weekend warrior', 'Answer a hundred questions on weekends.', '🛋️', 100, (f) => answersWhere(f, (d) => d.getDay() === 0 || d.getDay() === 6), true),
      count('every_word', 'Every word counts', 'Look up every word in a single transcript.', '🔡', 1, (f) => f.model.fullLookups, true),
    ];
  }
}

// ---------- Audio ----------

/** A little before and after a line, so its first and last sounds aren't cut. */
const LEAD = 150;
const TAIL = 300;

/** One shared audio element: a quiz's player and a transcript take turns. */
const player = {
  audio: new Audio(),
  owner: null, // what's playing: a player id or a transcript key
  stopAt: null, // seconds
  clipStart: 0,
  onTick: null,
  failed: false,
};
player.audio.preload = 'auto';

function stopAudio() {
  player.audio.pause();
  player.owner = null;
  player.stopAt = null;
  if (player.onTick) player.onTick();
  player.onTick = null;
}

function tick() {
  const a = player.audio;
  if (player.stopAt != null && a.currentTime >= player.stopAt) {
    a.pause();
    const t = player.onTick;
    player.owner = null;
    player.stopAt = null;
    if (t) t(true);
    player.onTick = null;
    return;
  }
  if (player.onTick) player.onTick();
  if (!a.paused) requestAnimationFrame(tick);
}

player.audio.addEventListener('ended', () => {
  const t = player.onTick;
  player.owner = null;
  player.stopAt = null;
  if (t) t(true);
  player.onTick = null;
});

async function play(owner, src, startMs, endMs, onTick) {
  const a = player.audio;
  if (player.onTick && player.owner !== owner) { const t = player.onTick; player.onTick = null; t(true); }
  player.owner = owner;
  player.onTick = onTick;
  player.stopAt = endMs == null ? null : endMs / 1000;
  const full = new URL(playable(src), location.href).href;
  const start = Math.max(0, startMs / 1000);
  // iOS only lets audio start from a tap, so play() is called before any
  // waiting. A new file plays muted until it has jumped to the right place.
  // A track that failed to load is loaded again, so trying again can work.
  if (a.src !== full || a.error) {
    a.src = full;
    a.muted = true;
    const seek = () => {
      a.currentTime = start;
      a.addEventListener('seeked', () => { a.muted = false; }, { once: true });
    };
    a.addEventListener('loadedmetadata', seek, { once: true });
    await a.play();
  } else {
    a.currentTime = start;
    await a.play();
  }
  requestAnimationFrame(tick);
}

window.addEventListener('hashchange', stopAudio);

/**
 * The track in a format this browser plays. Each track is Ogg Opus, with an
 * AAC (.m4a) copy for browsers without Ogg, such as Safari on iPhone.
 */
function playable(src) {
  return player.audio.canPlayType('audio/ogg; codecs=opus') ? src : src.replace(/\.ogg$/, '.m4a');
}

/**
 * The play bar under a question: the whole track, or one line of it. [view]
 * keeps the play count for the answer.
 */
function audioBar(ui, view, item, line) {
  view.barId ||= `ab${Math.random().toString(36).slice(2, 8)}`;
  const id = view.barId;
  const l = line == null ? null : item.lines[line];
  const start = l ? Math.max(0, l.start - LEAD) : 0;
  const end = l ? l.end + TAIL : null;
  const total = l ? end - start : item.duration;
  view.plays ||= 0;
  view.pos ||= 0;
  const playing = player.owner === view;
  const label = () => `${length(view.pos)} / ${length(total)}${view.plays ? ` · played ${view.plays}×` : ''}`;
  const update = (stopped) => {
    const root = document.getElementById(id);
    if (!root) return;
    if (stopped === true) view.pos = 0;
    else if (player.owner === view) view.pos = Math.max(0, player.audio.currentTime * 1000 - start);
    const on = player.owner === view && !player.audio.paused;
    root.querySelector('.fill').style.width = `${Math.min(100, (view.pos / total) * 100).toFixed(1)}%`;
    root.querySelector('.time').textContent = label();
    root.querySelector('.pbtn').innerHTML = String(icon(on ? 'pause' : 'play'));
  };
  const toggle = async () => {
    if (player.owner === view && !player.audio.paused) {
      player.audio.pause();
      update();
      return;
    }
    try {
      await play(view, item.audio, start + view.pos, end, update);
      // Counted once it's playing, so a failed try doesn't count as a listen.
      if (view.pos === 0) {
        view.plays++;
        MODEL.countPlay();
      }
      update();
    } catch (e) {
      player.owner = null;
      player.onTick = null;
      const root = document.getElementById(id);
      if (root) root.querySelector('.time').textContent = "Couldn't load the audio. Tap play to try again.";
    }
  };
  const restart = async () => {
    if (player.owner === view) player.audio.pause();
    view.pos = 0;
    await toggle();
  };
  return html`<div class="audio-bar" id="${id}">
    <button class="pbtn" type="button" title="${playing ? 'Pause' : 'Play'}" aria-label="Play or pause" ${ui.onClick(toggle)}>${icon(playing ? 'pause' : 'play')}</button>
    <button class="icon-btn" type="button" title="From the start" aria-label="From the start" ${ui.onClick(restart)}>${icon('replay')}</button>
    <div class="grow">
      <div class="progress"><div class="fill" style="width:${Math.min(100, (view.pos / total) * 100).toFixed(1)}%"></div></div>
      <div class="time tiny" style="margin-top:6px">${label()}</div>
    </div>
  </div>`;
}

// ---------- Transcript ----------

function renderTranscript(item, ui) {
  const key = `t${item.number}`;
  const following = player.owner === key;
  const highlight = () => {
    document.querySelectorAll(`.passage[data-key="${key}"] p.current`).forEach((p) => p.classList.remove('current'));
    if (player.owner !== key) return;
    const ms = player.audio.currentTime * 1000;
    let line = -1;
    item.lines.forEach((l, i) => { if (l.start <= ms) line = i; });
    const p = document.querySelector(`.passage[data-key="${key}"] p[data-para="${line}"]`);
    if (p) p.classList.add('current');
  };
  const onTick = (stopped) => {
    highlight();
    if (stopped === true) {
      document.querySelectorAll(`.passage[data-key="${key}"] p.current`).forEach((p) => p.classList.remove('current'));
      const b = document.getElementById(`pa-${key}`);
      if (b) b.innerHTML = String(html`${icon('play')} Play along`);
    }
  };
  const playFrom = async (line, onlyThis) => {
    resetPassages();
    const l = item.lines[line];
    MODEL.countPlay();
    try {
      await play(key, item.audio, Math.max(0, l.start - LEAD), onlyThis ? l.end + TAIL : null, onTick);
      const b = document.getElementById(`pa-${key}`);
      if (b) b.innerHTML = String(html`${icon('pause')} Stop`);
    } catch (e) { /* audio unavailable */ }
  };
  const playAlong = () => {
    if (player.owner === key) { stopAudio(); onTick(true); return; }
    playFrom(0, false);
  };
  return html`<div>
    ${renderPassage(key, {
      sentences: item.lines.map((l) => ({ t: l.text, w: l.words })),
      paragraphs: item.lines.map(() => 1),
      dict: DICT,
      lesson: item.lesson,
      ui,
      scale: MODEL.textScale,
      setScale: (v) => MODEL.setTextScale(v),
      paragraphClass: 'tline',
      toolbarExtra: html`<button class="btn tonal small" id="pa-${key}" ${ui.onClick(playAlong)}>${icon(following ? 'pause' : 'play')} ${following ? 'Stop' : 'Play along'}</button>`,
      hooks: {
        noReadAloud: true,
        onLookup: () => MODEL.countLookup(),
        onFullLookup: () => MODEL.countFullLookup(),
      },
      sentenceExtra: (i) => html`<span class="tline-head"><button class="icon-btn line-play" type="button" title="Play this line" aria-label="Play this line" ${ui.onClick(() => playFrom(i, true))}>${icon('play')}</button>${item.lines[i].speaker ? html`<span class="speaker">${item.lines[i].speaker}</span>` : ''}</span>`,
    })}
    ${item.source ? html`<p class="small" lang="ja" style="text-align:right;margin-top:6px">― ${item.source}</p>` : ''}
  </div>`;
}

// ---------- Section screen ----------

const revealed = new Set();

function renderSectionBody(section, ui, app) {
  const model = app.model;
  const lesson = model.course.lessonOf(section);
  const item = lesson.item;
  const [type, hint, emoji] = typeOf(item);
  const dictation = section.kind === 'dictation';
  const n = section.cards.length;
  const passed = model.statusOf(section) === SectionStatus.passed;
  return html`<div class="stack">
    <h1 class="h1">${item.title}${dictation ? ': dictation' : ''}</h1>
    <p class="label">${emoji} ${type} · ${item.level} · ${length(item.duration)} of audio</p>
    <div class="card"><p>${dictation
      ? `Dictation: write down ${plural(n, 'line')} from this track. Play each as often as you like, then type it in kana or kanji.`
      : `${hint} Each question is shown first, then you play the audio, as many times as you like.`}</p></div>
    <h2 class="h3" style="margin-top:12px">Transcript</h2>
    ${passed || revealed.has(section.id)
      ? renderTranscript(item, ui)
      : html`<div><button class="btn outline" ${ui.onClick(() => { revealed.add(section.id); ui.render(); })}>Show it now (gives the answers away)</button></div>`}
  </div>`;
}

// ---------- Quiz ----------

function questionSummary(q) {
  return q.type === 'choice' ? q.prompt : `Dictation: ${q.item.lines[q.line].text}`;
}

function renderQuestion({ question: q, view, ui, answer }) {
  if (q.type === 'choice') {
    const [type, hint] = typeOf(q.item);
    return html`<div class="stack">
      <p class="small">${type} · ${q.line == null ? hint : 'listen to one line'}</p>
      <div class="h2" lang="ja" style="font-weight:600">${q.prompt}</div>
      ${audioBar(ui, view, q.item, q.line)}
      <div class="stack" style="margin-top:4px">
        ${q.options.map((opt, i) => html`<button class="option" lang="ja" ${ui.onClick(() => { stopAudio(); answer({ correct: i === q.correctIndex, given: opt, plays: view.plays || 0 }); })}>${opt}</button>`)}
      </div>
    </div>`;
  }
  const line = q.item.lines[q.line];
  const who = SPEAKERS[line.speaker];
  const check = () => {
    const input = document.getElementById('answer');
    const given = input.value.trim();
    if (!given) return;
    stopAudio();
    answer({ correct: line.dictation.test(normaliseDictation(normaliseTyped(given))), given, plays: view.plays || 0 });
  };
  ui.after(() => {
    const input = document.getElementById('answer');
    const preview = document.getElementById('kana-preview');
    if (input) input.addEventListener('input', () => { preview.textContent = hasRomaji(input.value) ? `→ ${toHiragana(input.value)}` : ''; });
  });
  return html`<form class="stack" ${ui.onSubmit(check)}>
    <p class="small">Dictation · from "${q.item.title}"</p>
    <div class="h2">${who ? `Write down what ${who} says.` : 'Write down what you hear.'}</div>
    ${audioBar(ui, view, q.item, q.line)}
    <div>
      <input id="answer" class="text-input" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Kana, kanji or romaji" aria-label="What you heard">
      <div class="kana-preview" id="kana-preview" lang="ja"></div>
    </div>
    <p class="small">Kanji or kana both count. Punctuation and spaces are ignored.</p>
    <button class="btn block" type="submit">Check</button>
  </form>`;
}

const givenText = (o) => (!o.given ? '(nothing)' : o.typo ? `${o.given} (marked as correct)` : o.given);

function renderResult(attempt) {
  const q = attempt.question;
  const answerText = q.type === 'choice' ? q.options[q.correctIndex] : q.item.lines[q.line].text;
  return html`<p lang="ja">${questionSummary(q)}</p>
    ${!attempt.correct || attempt.outcome.typo ? html`<p class="small" lang="ja">You answered: ${givenText(attempt.outcome)}</p>` : ''}
    <div class="h3" lang="ja" style="margin-top:6px">${answerText}</div>`;
}

function resultHeading(a) {
  return a.outcome.typo ? 'Last question: marked as correct' : a.correct ? 'Last question: right' : 'Last question: not quite';
}

// ---------- Today tab ----------

function planPanel(model) {
  return progressPanel(model, {
    noun: 'track',
    nouns: 'tracks',
    lessonsAt: (level) => model.lessonsAt(level),
    stats: [
      ['Tracks done', `${model.lessonsComplete}/${model.course.lessons.length}`],
      ['Audio heard', `${Math.floor(model.audioHeard / 60000)} min`],
      ['Plays', model.plays.toLocaleString()],
    ],
  });
}

function trackTile(app, ui, lesson) {
  const model = app.model;
  const item = lesson.item;
  const statuses = lesson.sections.map((s) => model.statusOf(s));
  // The tile opens the first section not yet passed.
  const index = statuses.findIndex((s) => s !== SectionStatus.passed);
  const section = lesson.sections[index < 0 ? 0 : index];
  const status = model.statusOf(section);
  const done = statuses.filter((s) => s === SectionStatus.passed).length;
  const locked = status === SectionStatus.locked;
  const mark = (i) => (statuses[i] === SectionStatus.passed ? ' ✓' : '');
  const ic = done === statuses.length ? 'checkCircle' : locked ? 'lock' : 'play';
  return html`<a class="list-item" href="${path('section', section.id)}" ${locked ? ui.onClick(() => offerUnlock(app, section)) : ''}>
    <span class="status-icon ${done === statuses.length ? 'done' : ''}">${done > 0 && done < statuses.length ? '◐' : icon(ic)}</span>
    <span class="grow">${lesson.number}. ${item.title}
      <div class="sub">${typeOf(item)[0]} · ${length(item.duration)} · listening${mark(0)} · dictation${mark(1)}${locked ? ' · tap to unlock early' : ''}</div></span>
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
      const item = lesson.item;
      const [type, , emoji] = typeOf(item);
      const started = model.savedQuiz(SrsModel.sectionQuizKey(next));
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Today's track · ${lesson.number} of ${model.course.lessons.length}${next.kind === 'dictation' ? ' · dictation' : ''}</span>
          <div class="h2" style="margin:2px 0">${item.title}</div>
          <span class="small">${emoji} ${type} · ${item.level} · ${length(item.duration)}${started ? ' · questions started' : ''}</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Review ${plural(due, 'card')} due today`}</a>` : ''}
    ${LEVELS.map((level) => html`<section>
      <h2 class="h3">${level}</h2>
      <div class="list" style="margin-top:6px">${model.lessonsAt(level).map((l) => trackTile(app, ui, l))}</div>
    </section>`)}
  </div>`;
}

const CREDITS = html`
  <p>Voices: <a href="https://voicevox.hiroshiba.jp/" target="_blank" rel="noopener">VOICEVOX</a>, with VOICEVOX:No.7, VOICEVOX:四国めたん, VOICEVOX:ちび式じい, VOICEVOX:白上虎太郎, VOICEVOX:玄野武宏, VOICEVOX:東北イタコ, VOICEVOX:青山龍星, VOICEVOX:九州そら, VOICEVOX:雀松朱司, VOICEVOX:東北ずん子, VOICEVOX:春日部つむぎ, VOICEVOX:剣崎雌雄 and VOICEVOX:麒ヶ島宗麟, each under its own terms.</p>
  <p>Scripts written for the app. The myths are retold from the Kojiki, the Izumo Fudoki and Lafcadio Hearn's Kwaidan, all in the public domain.</p>
  <p>Word meanings from <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a> and kanji from <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noopener">KANJIDIC2</a>, the property of the Electronic Dictionary Research and Development Group, used under <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noopener">their licence</a> (CC BY-SA 4.0).</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const [content, store] = await Promise.all([
    fetch('data/content.json').then((r) => { if (!r.ok) throw new Error('content missing'); return r.json(); }),
    Store.open('vibe-listening'),
  ]);
  const course = buildCourse(content);
  const model = new ListeningModel(store, course, {
    appName: 'Listening',
    backupApp: 'vibe_web_listening',
    passMark: 0.8,
    noPartId: 'practice',
    statsOptions: { slowExcluded: (id, skill) => skill === 'Dictation' },
  });
  MODEL = model;
  model.load();
  const app = createSrsApp({
    id: 'listening',
    title: 'Listening',
    model,
    summaryNoun: 'tracks',
    backupFile: 'vibe-listening-backup',
    credits: CREDITS,
    text: {
      sectionQuizStart: (n, s) => (s.kind === 'dictation' ? `Start dictation (${plural(n, 'line')})` : `Start listening (${n} questions)`),
      sectionQuizResume: (done, n) => `Resume (${done} of ${n} done)`,
      sectionQuizAgain: (s) => (s.kind === 'dictation' ? 'Write them again' : 'Answer the questions again'),
      backToLessons: 'Back to the tracks',
      itemTimesNote: 'Time to first answer. Red means it was missed first time. Dictation takes longer than picking an option.',
      practiceTitle: 'Outside listening log',
      practiceChart: 'Minutes of outside listening',
      practiceStat: 'Outside listening',
      practiceNote: 'Time spent on podcasts, drama, radio or anything else in Japanese, logged by you.',
      practiceEmpty: 'Nothing logged yet. Start the timer when you sit down to listen to something in Japanese.',
      practiceWhat: 'What did you listen to? (optional)',
      practiceInsight: (m) => `You logged ${m} minute${m === 1 ? '' : 's'} of outside listening over the last 7 days.`,
      slowNote: 'Median time to first answer. Dictation is left out, because it takes much longer than picking an option.',
      firstAchievement: 'Finish your first section to unlock one.',
      lessonWord: 'Track',
      deckItemsTab: 'Cards',
      itemsLearnedStat: 'Cards learned',
      deckLearned: (n, total) => `${n} of ${total} cards learned`,
      sectionsPassedStat: 'Sections passed',
      progressTitle: 'Progress by level',
      nextLesson: (l) => `Continue to the next track: ${l.number}, ${l.title}`,
      reviewAllTitle: "Today's reviews",
      nothingDue: 'Nothing is due right now. Pass a track to add it to your reviews.',
      noAnswers: 'Pass a track first, so there are answers to compare.',
      questionWord: (q) => (q && q.type === 'dictation' ? 'Line' : 'Question'),
      itemTitle: 'Card',
    },
    renderToday,
    renderSectionBody,
    renderBlock: () => '',
    renderQuestion,
    resultHeading,
    renderResult,
    renderItemDetail: (card, q, ui) => renderTranscript(q.item, ui),
    outcomeFromJson: (json) => ({ correct: !!json.correct, given: json.given || '', plays: json.plays || 0, typo: !!json.typo }),
    givenText,
    amendable: true,
    amendOutcome: (o) => ({ ...o, correct: true, typo: true }),
    amendLabel: (a) => (a.question.type === 'dictation' ? 'It was a typo: mark as correct' : 'I tapped the wrong one: mark as correct'),
    onCommit: (attempt, firstTry) => {
      if (firstTry && attempt.correct && attempt.outcome.plays === 1) model.countOneListenRight();
    },
    deckCards: (section) => [...(section.reviewCard ? [section.reviewCard] : []), ...section.cards.filter((c) => c.id.startsWith('dict:'))],
    partItemCount: (part) => part.sections.reduce((n, s) => n + (s.reviewCard ? 1 : s.cards.length), 0),
    sectionScreenTitle: (lesson) => `Track ${lesson.number} · ${lesson.level}`,
  });
  connectLearner(wordLookupHooks(() => app.learner, 'listening'));
  return app;
});
