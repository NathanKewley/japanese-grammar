// Vibe Conjugation: word types and every form from N5 to N1, typed and checked.

import { html, raw, icon, richText, plural, toast, furigana, segText } from '../shared/srs/dom.js';
import { Store } from '../shared/srs/store.js';
import { Course } from '../shared/srs/course.js';
import { SrsModel, SectionStatus, count, answersWhere } from '../shared/srs/model.js';
import { statGrid, barRow } from '../shared/srs/ui.js';
import { createSrsApp, boot, path, offerUnlock } from '../shared/srs/screens.js';
import { seeded } from '../shared/srs/quiz-engine.js';
import { normaliseTyped, hasRomaji, toHiragana } from '../shared/srs/romaji.js';
import { speak, stopSpeaking } from '../shared/srs/passage.js';

// ---------- Answers ----------

/** Strips what a keyboard adds around an answer: spaces and end punctuation. */
function normaliseAnswer(typed) {
  return typed.replace(/[\s　]/g, '').replace(/[。．.!！?？、,]+$/, '');
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A word in one form: every accepted answer, the usual one first. */
class WordForm {
  constructor(variants, rule, mistakes) {
    this.variants = variants;
    this.rule = rule;
    // Likely wrong answers: [written, read, pattern].
    this.mistakes = mistakes;
    this.patterns = variants.map(
      (v) => new RegExp(`^${v.map(([t, r]) => (r ? `(?:${escapeRe(t)}|${escapeRe(r)})` : escapeRe(t))).join('')}$`)
    );
  }

  get main() { return this.variants[0]; }

  /**
   * Whether [typed] is one of the answers. Each kanji can be typed as the kanji
   * or as its kana, so 食べた and たべた both count. Romaji is read as kana.
   */
  accepts(typed) {
    const answer = normaliseAnswer(normaliseTyped(typed));
    if (!answer) return false;
    return this.patterns.some((p) => p.test(answer));
  }

  /** The mistake pattern [typed] matches, if any. */
  mistakeIn(typed) {
    const answer = normaliseAnswer(normaliseTyped(typed));
    for (const [written, read, pattern] of this.mistakes) {
      if (answer === read || (written && answer === written)) return pattern;
    }
    return null;
  }
}

// ---------- Content ----------

const I_OR_E = 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ';

/** Why [word] is the type it is, for after a "which type?" question. */
function typeExplanation(w) {
  const r = w.reading;
  const looksIchidan = r.endsWith('る') && r.length > 1 && I_OR_E.includes(r[r.length - 2]);
  switch (w.kind) {
    case 'u':
      if (looksIchidan) return `${w.surface} ends in -iる/-eる but is a う-verb: one of the exceptions to learn by heart.`;
      if (r.endsWith('る')) return `${w.surface} ends in る after an a, u or o sound, so it's a う-verb.`;
      return `${w.surface} doesn't end in る, so it's a う-verb.`;
    case 'ru': return `${w.surface} ends in -iる/-eる, so it's a る-verb.`;
    case 'suru': return `${w.surface} is made with する, so it's irregular.`;
    case 'kuru': return '来る is one of the two irregular verbs.';
    case 'i':
      if (r === 'いい') return 'いい is an い-adjective, but irregular: よくない, よかった.';
      return `${w.surface} ends in い and changes it, so it's an い-adjective.`;
    case 'na':
      if (r.endsWith('い')) return `${w.surface} ends in い but is a な-adjective: ${w.surface}な, ${w.surface}じゃない.`;
      return `${w.surface} doesn't end in い, so it's a な-adjective.`;
    default: return `${w.surface} is a ${w.kindLabel}.`;
  }
}

// ---------- Example sentences ----------

const KANJI_RUBY = /([㐀-鿿々〆]+)\[([^\]]+)\]/g;

/** Segments for text written with furigana as 漢字[かんじ]. */
function rubySegments(text) {
  const out = [];
  let at = 0;
  for (const m of text.matchAll(KANJI_RUBY)) {
    if (m.index > at) out.push([text.slice(at, m.index), '']);
    out.push([m[1], m[2]]);
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push([text.slice(at), '']);
  return out;
}

/**
 * The example sentences for a section, grouped by form. Each sentence's {}
 * is filled with the word in that form, from the same data as the table, so
 * the two always agree. Sentences whose word or form is missing are skipped.
 */
function exampleGroups(raw, forms, words) {
  const groups = new Map();
  for (const e of raw) {
    const form = forms[e.f];
    const wf = words[e.w] && words[e.w].forms[e.f];
    const parts = e.s.split('{}');
    if (!form || !wf || parts.length !== 2) continue;
    const before = rubySegments(parts[0]);
    const middle = wf.main;
    const segments = [...before, ...middle, ...rubySegments(parts[1])];
    const em = new Set(middle.map((_, i) => before.length + i));
    if (!groups.has(form.key)) groups.set(form.key, { form, sentences: [] });
    groups.get(form.key).sentences.push({ word: e.w, segments, em, english: e.en });
  }
  return [...groups.values()];
}

/** Reads a sentence aloud from its kana, so a kanji can't be misread. */
async function sayExample(s) {
  stopSpeaking();
  const ok = await speak(s.segments.map(([t, r]) => r || t).join(''));
  if (!ok) toast("No Japanese voice found. Add a Japanese text-to-speech voice in your device's settings (or try another browser), then reload the page.", 6000);
}

/** One example sentence: the word picked out, a button to hear it, and the English. */
function exampleLine(s, ui) {
  return html`<div class="row" style="align-items:flex-start;gap:8px">
    <div class="grow">
      <div class="ja-m" style="line-height:1.9">${furigana(s.segments, s.em)}</div>
      <div class="small">${s.english}</div>
    </div>
    <button class="icon-btn" type="button" style="width:34px;height:34px;flex:none;margin-top:6px" title="Hear this sentence" aria-label="Hear this sentence" ${ui.onClick(() => sayExample(s))}>${icon('speaker')}</button>
  </div>`;
}

/** An example of [formKey], with [word] if there is one. */
function exampleFor(course, formKey, word) {
  const list = formKey && course.examplesByForm[formKey];
  if (!list || !list.length) return null;
  return list.find((s) => s.word === word) || list[[...(word || '')].reduce((n, ch) => n + ch.codePointAt(0), 0) % list.length];
}

/** The example below an answer, if the question is about a form and isn't a sentence already. */
function answerExample(q, ui, app) {
  const s = !q.before && exampleFor(app.model.course, q.formKey || (q.form && q.form.key), q.word && q.word.surface);
  return s ? html`<div style="margin-top:10px">
    <div class="small" style="margin-bottom:2px">In a sentence</div>
    ${exampleLine(s, ui)}
  </div>` : '';
}

/** [blocks] with the example sentences after the last table, if there are any. */
function withExamples(blocks, groups) {
  if (!groups.length) return blocks;
  let at = blocks.length;
  for (let i = blocks.length - 1; i >= 0; i--) if (blocks[i].type === 'table') { at = i + 1; break; }
  return [...blocks.slice(0, at), { type: 'examples', groups }, ...blocks.slice(at)];
}

function buildCourse(data, examples = {}) {
  const forms = {};
  for (const [key, v] of Object.entries(data.forms)) forms[key] = { key, label: v.label, group: v.group, level: v.level };
  const words = {};
  for (const [surface, v] of Object.entries(data.words)) {
    const wf = {};
    for (const [key, f] of Object.entries(v.forms)) wf[key] = new WordForm(f.v, f.rule, f.m || []);
    words[surface] = { surface, reading: v.reading, kind: v.kind, kindLabel: v.kindLabel, level: v.level, meaning: v.meaning, segments: v.seg, forms: wf };
  }

  /** A question about [word] in [form], answered by typing it. */
  function conjugationCard(word, form) {
    const info = forms[form];
    const answer = word.forms[form];
    return {
      id: `conj:${word.surface}:${form}`,
      word,
      form,
      build: () => ({
        type: 'typein',
        word,
        form: info,
        answer,
        // The dictionary form is asked for from the ます form.
        shown: form === 'dict' ? word.forms.masu.main : word.segments,
        skill: info.label,
        explanation: answer.rule,
      }),
      info: { name: `${word.surface} → ${info.label}`, definition: segText(answer.main) },
    };
  }

  function card(raw) {
    const word = words[raw.w];
    switch (raw.k) {
      case 'conj':
        return conjugationCard(word, raw.f);
      case 'sent': {
        const form = forms[raw.f];
        const answer = word.forms[form.key];
        return {
          id: raw.id,
          word,
          form: form.key,
          build: () => ({ type: 'typein', word, form, answer, shown: word.segments, before: raw.before, after: raw.after, english: raw.en, skill: form.label, explanation: answer.rule }),
          info: { name: `${segText(raw.before)}＿＿${segText(raw.after)}`, definition: `${segText(raw.before)}${segText(answer.main)}${segText(raw.after)} (${raw.en})` },
        };
      }
      case 'type':
        return {
          id: raw.id,
          word,
          form: null,
          build: () => ({ type: 'choice', word, shown: word.segments, ask: 'What type of word is this?', options: raw.options, correctIndex: raw.answer, skill: 'Word types', explanation: typeExplanation(word) }),
          info: { name: `${word.surface}: what type?`, definition: word.kindLabel },
        };
      case 'rev': {
        const form = forms[raw.f];
        const shown = word.forms[form.key].main;
        return {
          id: raw.id,
          word,
          form: null,
          build: (rng) => {
            // The first option is right; shuffle them.
            const order = rng.shuffle(raw.options.map((_, i) => i));
            return {
              type: 'choice',
              word,
              shown,
              ask: `This is ${word.surface} (${word.meaning}). Which form is it?`,
              options: order.map((i) => raw.options[i]),
              correctIndex: order.indexOf(0),
              skill: 'Which form?',
              formKey: form.key,
              explanation: word.forms[form.key].rule,
            };
          },
          info: { name: `${segText(shown)}: which form?`, definition: form.label },
        };
      }
      default:
        throw new Error(`Unknown card kind in ${raw.id}`);
    }
  }

  const lessons = data.lessons.map((l) => ({
    number: l.number,
    partId: l.part,
    title: l.title,
    sections: l.sections.map((s) => ({
      id: s.id,
      title: s.title,
      kind: s.kind,
      deckId: l.part,
      forms: s.forms,
      blocks: withExamples(
        s.blocks.map((b) =>
          b.t === 'table' ? { type: 'table', words: b.words.map((w) => words[w]), forms: b.forms.map((f) => forms[f]) } : { type: b.t, text: b.s }
        ),
        exampleGroups(examples[s.id] || [], forms, words)
      ),
      cards: s.cards.map(card),
    })),
  }));

  const parts = data.parts.map((p, i) => ({ id: p.id, number: i + 1, title: p.title, summary: p.summary }));

  // Conjugation cards outside any section, which the daily drill makes, are
  // built on demand so saved drills can resume.
  const course = new Course(parts, lessons, {
    extraCardById(id) {
      const bits = id.split(':');
      if (bits.length === 3 && bits[0] === 'conj') {
        const word = words[bits[1]];
        if (word && word.forms[bits[2]]) return conjugationCard(word, bits[2]);
      }
      return null;
    },
  });
  course.words = words;
  course.forms = forms;
  course.conjugationCard = conjugationCard;
  course.mistakePatterns = data.mistakePatterns || {};

  // For each form, the words the course pairs it with in its lessons.
  course.wordsForForm = {};
  // The section that taught each form, for drill answers outside any section.
  course.formSections = {};
  // Every example sentence for each form, for the answers in quizzes.
  course.examplesByForm = {};
  for (const s of course.allSections) {
    for (const b of s.blocks) {
      if (b.type !== 'examples') continue;
      for (const g of b.groups) (course.examplesByForm[g.form.key] ||= []).push(...g.sentences);
    }
  }
  for (const s of course.allSections) {
    for (const c of s.cards) if (c.form) (course.wordsForForm[c.form] ||= new Set()).add(c.word.surface);
    for (const f of s.forms) course.formSections[f] = s;
  }
  return course;
}

// ---------- Mistake patterns ----------

/**
 * Groups wrong typed answers by the rule they break, most frequent first. A
 * wrong answer counts if it matches one of the word's likely mistakes (帰ない
 * for 帰らない), or if it's the word in a different form than the one asked for.
 */
function findMistakePatterns(course, answers) {
  const firstSection = {};
  for (const s of course.allSections) for (const f of s.forms) if (!(f in firstSection)) firstSection[f] = s;
  const found = new Map();
  const add = (id, label, section, example) => {
    if (!found.has(id)) found.set(id, { id, label, section, examples: [] });
    found.get(id).examples.push(example);
  };
  for (const a of answers) {
    if (a.correct || !a.given) continue;
    const card = course.cardById(a.cardId);
    if (!card || !card.form) continue;
    const asked = card.word.forms[card.form];
    if (!asked) continue;
    const example = { card, given: a.given, at: a.at };
    const pattern = asked.mistakeIn(a.given);
    if (pattern) {
      const p = course.mistakePatterns[pattern];
      if (p) add(pattern, p.label, course.sectionById(p.section), example);
      continue;
    }
    for (const [other, otherForm] of Object.entries(card.word.forms)) {
      if (other === card.form || !otherForm.accepts(a.given)) continue;
      // Count A-for-B and B-for-A as the same confusion.
      const pair = [card.form, other].sort();
      add(`mix:${pair.join(':')}`, `Mixing up the ${course.forms[pair[0]].label} and the ${course.forms[pair[1]].label}`, firstSection[card.form], example);
      break;
    }
  }
  return [...found.values()].sort((a, b) => b.examples.length - a.examples.length);
}

// ---------- Model ----------

const LEVELS = { N5: 0, N4: 1, Keigo: 2, N3: 2, N2: 3, N1: 4 };
// N3 to N1 patterns only suit some words, so they keep to the lessons' words.
const FREE_LEVELS = new Set(['N5', 'N4', 'Keigo']);

class ConjugationModel extends SrsModel {
  /** The forms taught in passed sections, in course order. */
  get learnedForms() {
    return this.course.allSections.filter((s) => this.passed.has(s.id)).flatMap((s) => s.forms);
  }

  get drillDoneToday() { return this.dailyTaskDone('drill'); }
  get drillsDone() { return this.dailyTaskCount('drill'); }
  markDrillDone() { return this.markDailyTaskDone('drill'); }

  /** For each form, the share of typed answers in it that were wrong. */
  formMissShare(stats) {
    const totals = new Map();
    for (const [c, score] of stats.cardScores) {
      if (!c.form) continue;
      const [w, t] = totals.get(c.form) || [0, 0];
      totals.set(c.form, [w + score.total - score.right, t + score.total]);
    }
    return new Map([...totals].map(([k, [w, t]]) => [k, w / t]));
  }

  /** When each form was last practised. */
  formLastAnswered(stats) {
    const byId = new Map([...stats.cardScores.keys()].map((c) => [c.id, c]));
    const out = new Map();
    for (const a of stats.answers) {
      const c = byId.get(a.cardId);
      if (!c || !c.form) continue;
      const prev = out.get(c.form);
      if (prev == null || a.at > prev) out.set(c.form, a.at);
    }
    return out;
  }

  /**
   * Today's mixed drill: [n] conjugations in the forms learned so far, with any
   * word that has the form. Forms often answered wrong come up most, then those
   * not practised for longest.
   */
  dailyDrill(stats, n = 10) {
    const course = this.course;
    const forms = [...new Set(this.learnedForms)].filter((f) => f !== 'dict');
    if (!forms.length) return [];
    const now = this.now();
    const weakness = this.formMissShare(stats);
    const last = this.formLastAnswered(stats);
    const d = new Date(now);
    // The same day always gives the same drill.
    const random = seeded(d.getFullYear() * 1000 + (d.getMonth() + 1) * 40 + d.getDate());
    const score = (f) => 2 * (weakness.get(f) || 0) + (last.get(f) == null ? 1.5 : Math.min((now - last.get(f)) / 3600000 / 168, 1.0)) + random.next() * 0.3;
    const ranked = forms.map((f) => [f, score(f)]).sort((a, b) => b[1] - a[1]);
    const cards = [];
    const used = new Set();
    for (let i = 0; cards.length < n && i < n * 4; i++) {
      const form = course.forms[ranked[i % ranked.length][0]];
      const words = Object.values(course.words).filter(
        (w) =>
          w.forms[form.key] &&
          LEVELS[w.level] <= LEVELS[form.level] &&
          (FREE_LEVELS.has(form.level) || (course.wordsForForm[form.key] && course.wordsForForm[form.key].has(w.surface))) &&
          !used.has(w.surface)
      );
      if (!words.length) continue;
      const word = words[random.int(words.length)];
      used.add(word.surface);
      cards.push(course.conjugationCard(word, form.key));
    }
    return cards;
  }

  buildAchievements() {
    const course = this.course;
    const allForms = new Set(course.allSections.flatMap((s) => s.forms)).size;
    const forms = (f) => new Set(f.model.learnedForms).size;
    const done = (f) => f.model.lessonsComplete;
    const answers = (f) => f.stats.answers.length;
    const learned = (f) => course.parts.reduce((n, p) => n + f.model.summaryOf(p).totalCards, 0);
    const streak = (f) => f.stats.longestStreak;
    const part = (id, title, description, icon) => {
      const p = course.partById(id);
      return count(`part_${id}`, title, description, icon, p.sections.length, (f) => f.model.passedCount(p));
    };
    return [
      count('first_section', 'First steps', 'Pass your first section.', '🚩', 1, (f) => f.model.totalPassed),
      count('first_lesson', 'Lesson one, done', 'Finish a whole lesson.', '🎓', 1, done),
      count('lessons_10', 'Ten down', 'Finish ten lessons.', '🔟', 10, done),
      count('lessons_30', 'Halfway there', 'Finish thirty lessons.', '📈', 30, done),
      part('n5v', 'Verb tamer', 'Finish N5 verbs.', '🏃'),
      part('n5a', 'Describer', 'Finish N5 adjectives and nouns.', '🎨'),
      part('n4', 'N4 conquered', 'Finish N4 forms.', '🎖️'),
      part('keigo', 'Ever so polite', 'Finish keigo.', '🙇'),
      part('n3', 'Grammar climber', 'Finish N3 forms.', '⛰️'),
      part('n2', 'Nearly fluent', 'Finish N2 forms.', '📚'),
      part('n1', 'Literary', 'Finish N1 forms.', '🪶'),
      count('everything', 'Sensei', 'Finish every lesson in the course.', '👑', course.lessons.length, done),
      count('forms_10', 'Shape shifter', 'Learn ten forms.', '🔀', 10, forms),
      count('forms_25', 'Form collector', 'Learn twenty-five forms.', '🧩', 25, forms),
      count('forms_50', 'Form hoarder', 'Learn fifty forms.', '📦', 50, forms),
      count('forms_all', 'Every form under the sun', `Learn all ${allForms} forms.`, '☀️', allForms, forms),
      count('answers_100', 'Warming up', 'Give a hundred answers.', '✏️', 100, answers),
      count('answers_1000', 'Keyboard warrior', 'Give a thousand answers.', '⌨️', 1000, answers),
      count('answers_5000', 'Unstoppable', 'Give five thousand answers.', '⚡', 5000, answers),
      count('answers_10000', 'Ten thousand forms', 'Give ten thousand answers.', '🚀', 10000, answers),
      count('learned_100', 'In the deck', 'Have a hundred items in your reviews.', '🃏', 100, learned),
      count('learned_500', 'Deep deck', 'Have five hundred items in your reviews.', '🗂️', 500, learned),
      count('streak_3', 'On a roll', 'Study three days in a row.', '🔥', 3, streak),
      count('streak_7', 'A whole week', 'Study seven days in a row.', '🌶️', 7, streak),
      count('streak_30', 'Habit formed', 'Study thirty days in a row.', '📅', 30, streak),
      count('streak_100', 'Hundred-day club', 'Study a hundred days in a row.', '🎉', 100, streak),
      count('drill_1', 'Drill sergeant', 'Finish a daily drill.', '🏋️', 1, (f) => f.model.drillsDone),
      count('drill_30', 'Daily grind', 'Finish thirty daily drills.', '🔁', 30, (f) => f.model.drillsDone),
      count('perfect_1', 'Flawless', 'Get every question in a lesson quiz right first time (ten or more questions).', '⭐', 1, (f) => f.perfectQuizzes),
      count('perfect_10', 'Perfectionist', 'Ace ten lesson quizzes like that.', '🌟', 10, (f) => f.perfectQuizzes),
      count('quick_50', 'Quick draw', 'Get fifty answers right first time in under five seconds each.', '⏱️', 50, (f) => f.stats.answers.filter((a) => a.round === 1 && a.correct && a.millis < 5000).length),
      count('comeback_50', 'Comeback kid', 'Get fifty questions right in a repeat round after missing them.', '↩️', 50, (f) => f.stats.repeats.right),
      count('night_owl', 'Night owl', 'Answer a question between midnight and 4am.', '🦉', 1, (f) => answersWhere(f, (d) => d.getHours() < 4), true),
      count('early_bird', 'Early bird', 'Answer a question between 5am and 6am.', '🌅', 1, (f) => answersWhere(f, (d) => d.getHours() === 5), true),
      count('weekend', 'Weekend warrior', 'Give a hundred answers on weekends.', '🛋️', 100, (f) => answersWhere(f, (d) => d.getDay() === 0 || d.getDay() === 6), true),
    ];
  }
}

// ---------- Lesson content ----------

function renderBlock(block, ui) {
  switch (block.type) {
    case 'text':
      return html`<p class="prose" lang="ja">${richText(block.text)}</p>`;
    case 'tip':
      return html`<div class="notice" style="color:var(--ink)"><p class="prose" lang="ja" style="font-size:.95rem">${richText(block.text)}</p></div>`;
    case 'table': {
      // Long labels wrap beside the examples, so a table with any stacks them all.
      const stacked = block.forms.some((f) => f.label.length > 20);
      return html`<div>
        <div class="h3" style="margin-bottom:8px">Examples</div>
        <div class="stack">
          ${block.words.filter((w) => block.forms.some((f) => w.forms[f.key])).map((w) => html`<div class="card">
            <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:4px 10px">
              <span class="ja-m" style="font-size:1.3rem">${furigana(w.segments)}</span>
              <span class="small">${w.meaning} · ${w.kindLabel}</span>
            </div>
            <div style="margin-top:6px">
              ${block.forms.filter((f) => w.forms[f.key]).map((f) => html`<div class="${stacked ? '' : 'row'}" style="padding-top:6px;align-items:flex-end">
                <span class="small" style="${stacked ? 'display:block' : 'width:140px;flex:none'}">${f.label}</span>
                <span class="ja-m">${furigana(f.key === 'dict' ? w.segments : w.forms[f.key].main)}</span>
              </div>`)}
            </div>
          </div>`)}
        </div>
      </div>`;
    }
    case 'examples':
      return html`<div>
        <div class="h3" style="margin-bottom:8px">In sentences</div>
        <div class="stack">
          ${block.groups.map((g) => html`<div class="card">
            <div class="small">${g.form.label}</div>
            ${g.sentences.map((s) => html`<div style="padding-top:10px">${exampleLine(s, ui)}</div>`)}
          </div>`)}
        </div>
      </div>`;
    default:
      return '';
  }
}

// ---------- Quiz ----------

/** What the question asks for, as one line. */
function questionSummary(q) {
  if (q.type === 'typein' && q.before) return `${segText(q.before)}＿＿${segText(q.after)} (${q.word.surface}, ${q.form.label})`;
  if (q.type === 'typein') return q.form.key === 'dict' ? `${segText(q.shown)} → dictionary form` : `${q.word.surface} → ${q.form.label}`;
  return `${segText(q.shown)}: ${q.ask}`;
}

/** A question's sentence with its blank, or with the answer in it. */
function sentenceWithBlank(q, filled = false) {
  const middle = filled ? q.answer.main : [['＿＿＿', '']];
  const start = q.before.length;
  const em = new Set(middle.map((_, i) => start + i));
  return furigana([...q.before, ...middle, ...q.after], em);
}

/** The right answer: every accepted form and the rule, or the right option. */
function answerPanel(q, compact = false) {
  if (q.type === 'typein') {
    return html`<div>
      <div class="${compact ? 'ja-m' : 'ja-l'}" style="${compact ? 'font-size:1.3rem' : ''}">${furigana(q.answer.main)}</div>
      ${q.answer.variants.length > 1 ? html`<div lang="ja" class="small" style="color:var(--ink)">Also right: ${q.answer.variants.slice(1).map(segText).join('、')}</div>` : ''}
      <p class="${compact ? 'small' : ''}" style="margin-top:6px" lang="ja">${q.answer.rule}</p>
    </div>`;
  }
  return html`<div>
    <div class="${compact ? 'h3' : 'h2'}">${q.options[q.correctIndex]}</div>
    <p class="${compact ? 'small' : ''}" lang="ja">${q.explanation}</p>
  </div>`;
}

function renderQuestion({ question: q, ui, answer }) {
  if (q.type === 'choice') {
    return html`<div class="stack">
      <div class="h3">${q.ask}</div>
      <div class="ja-xl">${furigana(q.shown)}</div>
      <div class="stack" style="margin-top:8px">
        ${q.options.map((opt, i) => html`<button class="option" ${ui.onClick(() => answer({ correct: i === q.correctIndex, given: opt }))}>${opt}</button>`)}
      </div>
    </div>`;
  }
  const check = () => {
    const input = document.getElementById('answer');
    const given = normaliseAnswer(normaliseTyped(input.value));
    if (!given) return;
    answer({ correct: q.answer.accepts(input.value), given });
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
    ${q.before
      ? html`<div class="ja-l">${sentenceWithBlank(q)}</div>
        <p>${q.english}</p>
        <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:4px 8px">
          <span>Fill the blank with</span><span class="ja-m" style="font-size:1.35rem">${furigana(q.word.segments)}</span><span>in the <strong>${q.form.label}</strong>.</span>
        </div>`
      : html`<p class="small" style="color:var(--ink)">${q.word.meaning} · ${q.word.kindLabel}</p>
        <div class="ja-xl" style="font-size:2.3rem">${furigana(q.shown)}</div>
        <div class="row" style="color:var(--accent)"><span style="width:22px;height:22px;display:inline-flex">${icon('chevron')}</span><span class="h2" style="color:var(--accent)">${q.form.label}</span></div>
        ${q.form.key === 'dict' ? html`<p class="small">This is the ます form. Give the dictionary form.</p>` : ''}`}
    <div>
      <input id="answer" class="text-input" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"
        placeholder="Type it in Japanese (or romaji)" aria-label="Your answer" data-autofocus>
      <div class="kana-preview" id="kana-preview" lang="ja"></div>
    </div>
    <button class="btn block" type="submit">Check</button>
  </form>`;
}

function givenText(o) {
  return o.typo ? `${o.given} (typo, counted as right)` : o.given || '';
}

function renderResult(attempt, ui, app) {
  const q = attempt.question;
  const o = attempt.outcome;
  return html`<p class="small" lang="ja" style="color:var(--ink)">${questionSummary(q)}</p>
    ${o.given ? html`<p class="small" lang="ja">You answered: ${givenText(o)}</p>` : ''}
    <div style="margin-top:6px">${answerPanel(q, true)}</div>
    ${answerExample(q, ui, app)}`;
}

function resultHeading(a) {
  return a.outcome.typo ? 'Last question: counted as right' : a.correct ? 'Last question: right' : 'Last question: not quite';
}

// ---------- Today tab ----------

const SECTION_LABELS = { types: 'Which type?', learn: 'Learn and practise', use: 'In sentences, and which form?', review: 'Mixed review' };

function startDrill(app, ui) {
  const model = app.model;
  const cards = model.dailyDrill(model.loadStudyStats());
  if (!cards.length) {
    toast('Pass a lesson that teaches a form first.');
    return;
  }
  ui.startQuiz({ kind: 'extra', part: null, title: 'Daily drill', cards: () => cards, onFinished: () => model.markDrillDone() });
}

function lessonTile(app, ui, lesson) {
  const model = app.model;
  const course = model.course;
  const complete = model.lessonComplete(lesson);
  const next = model.nextSection;
  const open = next && course.lessonOf(next) === lesson;
  const forms = lesson.sections.flatMap((s) => s.forms.map((f) => course.forms[f].label));
  return html`<details class="lesson" ${open ? 'open' : ''}>
    <summary>
      <span class="status-icon ${complete ? 'done' : ''}">${icon(complete ? 'checkCircle' : 'circle')}</span>
      <span class="grow">
        <div>Lesson ${lesson.number}: <span lang="ja">${lesson.title}</span></div>
        ${forms.length ? html`<div class="small" lang="ja">${forms.join(' · ')}</div>` : ''}
      </span>
      <span class="caret">${icon('chevron')}</span>
    </summary>
    <div class="list">
      ${lesson.sections.map((s) => {
        const status = model.statusOf(s);
        const locked = status === SectionStatus.locked;
        return html`<a class="list-item" href="${path('section', s.id)}" ${locked ? ui.onClick(() => offerUnlock(app, s)) : ''}>
          <span class="status-icon ${status === 'passed' ? 'done' : ''}">${icon(status === 'passed' ? 'check' : locked ? 'lock' : 'play')}</span>
          <span class="grow">${SECTION_LABELS[s.kind]}${locked ? html`<div class="sub">Tap to unlock early</div>` : ''}</span>
        </a>`;
      })}
    </div>
  </details>`;
}

function renderToday(ui, app) {
  const model = app.model;
  const course = model.course;
  const next = model.nextSection;
  const due = model.allReviewQueue.length;
  const saved = model.savedQuiz(SrsModel.reviewAllKey);
  const drillDone = model.drillDoneToday;
  const formsLearned = new Set(model.learnedForms).size;
  const totalForms = new Set(course.allSections.flatMap((s) => s.forms)).size;
  return html`<div class="stack-lg">
    <div class="stack">
      <h1 class="h1">Your progress</h1>
      ${statGrid([
        ['Lessons done', `${model.lessonsComplete}/${course.lessons.length}`],
        ['Forms learned', `${formsLearned}/${totalForms}`],
        ['Sections passed', `${model.totalPassed}/${course.allSections.length}`],
      ])}
      <div>${course.parts.map((p) => barRow({ label: p.title, fraction: model.passedCount(p) / p.sections.length, value: `${model.passedCount(p)}/${p.sections.length}` }))}</div>
    </div>
    ${next ? (() => {
      const lesson = course.lessonOf(next);
      const done = lesson.sections.filter((s) => model.statusOf(s) === SectionStatus.passed).length;
      return html`<a class="card accent tappable row" href="${path('section', next.id)}" style="color:inherit;text-decoration:none">
        <span class="grow">
          <span class="label">Next · Lesson ${lesson.number}: <span lang="ja">${lesson.title}</span></span>
          <div class="h2" style="margin:2px 0">${SECTION_LABELS[next.kind]}</div>
          <span class="small">${done} of ${lesson.sections.length} parts of this lesson done</span>
        </span>
        <span class="chevron">${icon('chevron')}</span>
      </a>`;
    })() : ''}
    ${due > 0 || saved ? html`<a class="btn tonal block" href="#/quiz/review-all">${saved ? "Resume today's reviews" : `Review ${plural(due, 'item')} due today`}</a>` : ''}
    <div class="card">
      <div class="row"><span class="grow h3">Daily drill</span>${drillDone ? html`<span class="status-icon" style="color:var(--good)">${icon('checkCircle')}</span>` : ''}</div>
      <p class="small" style="margin:4px 0 10px">${drillDone
        ? 'Done for today. You can do another set if you like.'
        : "Ten conjugations in the forms you've learned, with any word, favouring the forms you get wrong most."}</p>
      <button class="btn outline block" ${ui.onClick(() => startDrill(app, ui))}>${drillDone ? 'Do another set' : "Start today's drill"}</button>
    </div>
    ${course.parts.map((part) => html`<section>
      <h2 class="h3">${part.title}</h2>
      <p class="small">${part.summary}</p>
      <div style="margin-top:6px">${course.lessons.filter((l) => l.partId === part.id).map((l) => lessonTile(app, ui, l))}</div>
    </section>`)}
  </div>`;
}

// ---------- Focus ----------

/** A mistake pattern is worth flagging once it's happened this many times. */
const MIN_MISTAKE_REPEATS = 2;

function focusExtra(model, stats) {
  const afterTrouble = findMistakePatterns(model.course, stats.answers)
    .filter((p) => p.examples.length >= MIN_MISTAKE_REPEATS)
    .slice(0, 2)
    .map((p) => {
      const last = p.examples.reduce((a, b) => (b.at > a.at ? b : a));
      return {
        title: `Watch out: ${p.label}`,
        reason: `You've done this ${p.examples.length} times. Last time, for ${last.card.info.name} you wrote ${last.given} (right: ${last.card.info.definition}).`,
        actionLabel: 'Reread the rule',
        action: p.section ? { type: 'openSection', section: p.section } : { type: 'reviewWeakest', cards: model.weakestCards(stats, 20) },
      };
    });
  return { afterTrouble };
}

const CREDITS = html`
  <p>Word types, readings and furigana are checked against <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener">JMdict</a> and <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noopener">KANJIDIC2</a>, the property of the Electronic Dictionary Research and Development Group, used under <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noopener">their licence</a> (CC BY-SA 4.0).</p>
  <p>Answers can be typed in kana, kanji or a mix (食べた, たべた). On a keyboard without Japanese input, type romaji and it's read as kana (tabeta).</p>`;

// ---------- Start ----------

boot(document.getElementById('app'), async () => {
  const [content, examples, store] = await Promise.all([
    fetch('data/content.json').then((r) => { if (!r.ok) throw new Error('content missing'); return r.json(); }),
    // Written for this site, so tools/sync-content.sh leaves it alone. The
    // lessons still work without it.
    fetch('data/examples.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    Store.open('vibe-conjugation'),
  ]);
  const course = buildCourse(content, examples);
  const model = new ConjugationModel(store, course, {
    appName: 'Vibe Conjugation',
    backupApp: 'vibe_web_conjugation',
    passMark: 0.8,
    noPartId: 'drill',
    statsOptions: {
      extraCard(id) {
        const card = course.cardById(id);
        const section = card && course.formSections[card.form];
        return card && section ? { card, section } : null;
      },
      slowExcluded: (id) => id.startsWith('sent:'),
    },
  });
  model.load();
  return createSrsApp({
    id: 'conjugation',
    title: 'Vibe Conjugation',
    model,
    summaryNoun: 'lessons',
    backupFile: 'vibe-conjugation-backup',
    credits: CREDITS,
    text: {
      passedNoDeck: 'These forms now come up in the daily drill.',
      itemTimesNote: 'Time to first answer. Red means it was missed first time. Sentences take longer than words, because there is more to read.',
      itemDetailTitle: 'Answer',
    },
    renderToday,
    renderBlock,
    renderQuestion,
    resultHeading,
    renderResult,
    renderItemDetail: (card, q, ui, app) => html`${answerPanel(q)}${answerExample(q, ui, app)}`,
    outcomeFromJson: (json) => ({ correct: !!json.correct, given: json.given || '', typo: !!json.typo }),
    givenText,
    amendable: true,
    canAmend: (a) => a.question.type === 'typein',
    amendOutcome: (o) => ({ ...o, correct: true, typo: true }),
    showGiven: true,
    focusExtra,
  });
});
