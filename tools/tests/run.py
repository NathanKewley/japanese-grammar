#!/usr/bin/env python3
"""Browser tests for the site: each study app, the landing page, backups and
Android emulation. They drive a real headless Chrome through the same screens
a learner uses.

    python3 tools/tests/run.py            # every test
    python3 tools/tests/run.py reading    # tests whose name contains "reading"

Needs Python 3 and Chrome (or Chromium; set CHROME to its path if it isn't on
the PATH). Each test gets a fresh browser profile, so none sees another's progress.
"""
import functools
import http.server
import json
import os
import sys
import threading
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Chrome, free_port  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BASE = None
TESTS = []


def test(fn):
    TESTS.append(fn)
    return fn


class Failure(Exception):
    pass


def check(cond, message):
    if not cond:
        raise Failure(message)


def serve():
    """Serves the site from the repo root on a free port, quietly."""
    global BASE
    port = free_port()
    handler = functools.partial(QuietHandler, directory=ROOT)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', port), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f'http://127.0.0.1:{port}/'
    return server


STAGING = 'japanese-grammar-staging/'


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Also serves the site under /japanese-grammar-staging/, on the same
    origin, the way GitHub Pages serves the staging copy beside the real one."""

    def translate_path(self, path):
        if path.startswith('/' + STAGING):
            path = path[len(STAGING):]
        return super().translate_path(path)

    def log_message(self, *args):
        pass


# ---------- Helpers ----------

def open_app(c, path, wait=3):
    c.go(BASE + path, 0.5)
    c.wait_for("!!(window.vibeApp || window.placement || document.querySelector('.tiles') || document.querySelector('.app-title'))", 15)
    c.sleep(wait - 0.5)


def question(c):
    """The current question, from the app's debug handle."""
    return c.js("""(() => { const q = vibeApp.ui.screen.state.engine.currentQuestion;
      return { type: q.type || null, ci: q.correctIndex,
        kana: q.answer && q.answer.main ? q.answer.main.map(s => s[1] || s[0]).join('') : q.kind === 'reading' ? q.word.r : null,
        line: q.type === 'dictation' ? q.item.lines[q.line].text : null }; })()""")


def in_quiz(c):
    return c.js("!!document.querySelector('.quiz-progress')")


def type_answer(c, text):
    c.js(f"document.getElementById('answer').value = {json.dumps(text)}; document.getElementById('answer').dispatchEvent(new Event('input'))")
    c.js("document.querySelector('form [type=submit]').click()")


def answer_all(c, mode=lambda i, q: 'right', limit=150):
    """Answers the open quiz to the end. mode(i, q) returns 'right', 'wrong', 'romaji' or 'amend'."""
    i = 0
    while in_quiz(c) and i < limit:
        c.sleep(0.35)  # past the input delay
        if c.js("[...document.querySelectorAll('.view button')].some(b => b.textContent.includes('Show answer'))"):
            c.click('Show answer', 0.35)
        q = question(c) if c.js("!!(vibeApp.ui.screen.state && vibeApp.ui.screen.state.engine && vibeApp.ui.screen.state.engine.currentQuestion)") else None
        m = mode(i, q)
        if q is None or q['type'] is None:  # Writing: self-marked
            c.click('Got it' if m == 'right' else 'Not yet', 0.2)
        elif q['type'] == 'order':
            # Tap the pieces in sentence order (right), or as shuffled (wrong).
            c.js(f"""(() => {{ const q = vibeApp.ui.screen.state.engine.currentQuestion;
              const seq = {'true' if m in ('right', 'romaji') else 'false'} ? q.pieces.map((_, i) => i) : q.order;
              for (const i of seq) {{ document.querySelectorAll('.order-bank > *')[q.order.indexOf(i)].click(); }}
              [...document.querySelectorAll('.view button')].find((b) => b.textContent.trim() === 'Check').click(); }})()""")
        elif q['type'] in ('choice',):
            n = c.js("document.querySelectorAll('.option').length")
            idx = q['ci'] if m in ('right', 'romaji') else (q['ci'] + 1) % n
            c.js(f"document.querySelectorAll('.option')[{idx}].click()")
        elif q['type'] == 'reread':
            c.click('Read it fine' if m == 'right' else 'Struggled', 0.2)
        elif q['type'] == 'dictation':
            type_answer(c, q['line'] if m == 'right' else 'ちがう')
        else:  # typed conjugation
            type_answer(c, ROMAJI[q['kana']] if m == 'romaji' and q['kana'] in ROMAJI else q['kana'] if m == 'right' else 'ぜんぜんちがう')
        if m == 'amend':
            c.sleep(0.4)
            c.click('as right' if c.js("document.body.innerText.includes('count it as right')") else 'mark as correct', 0.3)
        c.sleep(0.15)
        i += 1
    c.sleep(1.2)
    return i


ROMAJI = {'みます': 'mimasu', 'たべます': 'tabemasu', 'かきます': 'kakimasu', 'のみます': 'nomimasu', 'かいます': 'kaimasu',
          'はなします': 'hanashimasu', 'まちます': 'machimasu', 'おきます': 'okimasu', 'します': 'shimasu', 'きます': 'kimasu',
          'みません': 'mimasen', 'たべません': 'tabemasen', 'かきません': 'kakimasen', 'のみません': 'nomimasen',
          'かいません': 'kaimasen', 'はなしません': 'hanashimasen', 'まちません': 'machimasen', 'おきません': 'okimasen',
          'しません': 'shimasen', 'きません': 'kimasen'}


def no_errors(c):
    # Web fonts come from Google over the network, so a failed font request isn't the site's fault.
    errors = [l for l in c.dump_logs() if ('EXCEPTION' in l or 'log.error' in l or 'console.error' in l)
              and 'favicon' not in l and 'fonts.googleapis.com' not in l and 'fonts.gstatic.com' not in l]
    check(not errors, 'console errors:\n  ' + '\n  '.join(errors))


def view(c):
    return c.text('.view')


# ---------- Tests ----------

@test
def landing_starts_empty(c):
    open_app(c, 'index.html', 2.5)
    check(c.js("document.getElementById('summary').hidden"), 'summary strip should be hidden with no study')
    check(c.js("document.getElementById('backupReminder').hidden"), 'no backup reminder with no study')
    check(c.js("document.getElementById('backupReminder').offsetHeight") == 0, 'the hidden backup reminder should take up no space')
    check(c.text('[data-stat="writing"]') == 'Not started yet', 'Writing tile should say Not started yet')
    check(not c.js("document.querySelector('.data-info').open"), 'the progress box should start closed')
    c.click('.data-info summary', 0.3)
    check(c.js("document.querySelector('.data-info').open"), 'tapping it should open it')
    # Inside the closed progress box, so it's read as text rather than as shown.
    check('Your study data takes up about' in c.js("document.getElementById('storageLine').textContent"), 'storage line missing')
    open_app(c, 'grammar/index.html', 2)
    check('Grammar Library' in c.text('.app-title'), 'grammar header')
    no_errors(c)


@test
def writing_section_resume_and_stats(c):
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    for _ in range(3):
        c.sleep(0.35)
        c.click('Show answer', 0.35)
        c.click('Got it', 0.2)
    open_app(c, 'writing/index.html#/section/l1.kana', 1.5)
    check('3 of 10 done' in c.js("document.querySelector('.view .btn.block').textContent"), 'resume button should show 3 of 10')
    c.click('Resume writing', 0.6)
    check('Question 4 of 10' in c.text('.label'), 'should resume at question 4')
    answer_all(c)
    v = view(c)
    check('Section passed' in v and '10/10' in v, 'section should pass with 10/10 after resuming')
    check(c.js("vibeApp.model.cards.size") == 10, 'ten kana cards should join the deck')
    open_app(c, 'writing/index.html#/stats', 2)
    check('First strokes' in view(c) and 'Flawless' in view(c), 'first-section and perfect-quiz achievements should unlock')
    for path in ['#/reviews', '#/practice', '#/achievements', '#/deck/kana?tab=stats', '#/item/word%3A%E6%97%A5%E6%9C%AC', '#/settings']:
        open_app(c, 'writing/index.html' + path, 1)
    no_errors(c)


@test
def conjugation_typing_romaji_typo_and_drill(c):
    open_app(c, 'conjugation/index.html#/section/l1.types')
    c.click('Start the quiz')
    answer_all(c)
    check('Section passed' in view(c), 'word types section should pass')
    open_app(c, 'conjugation/index.html#/section/l2.learn', 1.5)
    c.click('Start the quiz')
    answer_all(c, lambda i, q: ['right', 'romaji', 'amend', 'right'][i % 4])
    v = view(c)
    check('Section passed' in v and '20/20' in v, 'romaji answers and typo amends should all count: ' + v[:200])
    open_app(c, 'conjugation/index.html#/', 2)
    c.click("Start today's drill")
    check(in_quiz(c), 'drill should open')
    answer_all(c)
    check('Extra review complete' in view(c), 'drill should finish')
    check(c.js("vibeApp.model.drillDoneToday"), 'drill should be marked done')
    no_errors(c)


@test
def reading_popup_pass_and_reread(c):
    open_app(c, 'reading/index.html#/section/r1')
    c.click('.passage p .pw ~ .pw', 0.6)
    check('person' in c.text('.word-popup'), 'word popup should open')
    c.click('.view h1', 0.3)
    c.click('Answer')
    answer_all(c)
    check('Reading passed' in view(c), 'reading should pass')
    c.js("(() => { const m = vibeApp.model; for (const x of m.cards.values()) x.card.due = Date.now() - 1000; m.notify(); })()")
    open_app(c, 'reading/index.html#/quiz/review-all', 2)
    check(c.js("vibeApp.ui.screen.state.engine.currentQuestion.type") == 'reread', 'review should be a re-read')
    answer_all(c)
    check('Review complete' in view(c), 're-read review should complete')
    no_errors(c)


@test
def listening_audio_amend_dictation_and_transcript(c):
    open_app(c, 'listening/index.html#/section/l1')
    c.click('Start listening')
    c.sleep(0.4)
    c.click('.pbtn', 1.2)
    check('played 1×' in c.js("document.querySelector('.audio-bar .time').textContent"), 'audio should play and count')
    answer_all(c, lambda i, q: 'amend' if i == 1 else 'right')
    check('Section passed' in view(c) and '3/3' in view(c), 'a wrong tap marked correct should still pass 3/3')
    open_app(c, 'listening/index.html#/section/d1', 1.5)
    c.click('Start dictation')
    answer_all(c)
    check('Section passed' in view(c), 'dictation should pass')
    open_app(c, 'listening/index.html#/section/l1', 1.5)
    c.click('Play along', 1.5)
    check(c.js("document.querySelector('p.tline.current')?.dataset.para") is not None, 'play along should highlight a line')
    no_errors(c)


@test
def listening_audio_falls_back_to_m4a_without_ogg(c):
    # Like Safari on iPhone: no Ogg, so each track should play from its .m4a copy.
    c.send('Page.addScriptToEvaluateOnNewDocument', source="""(() => {
      const can = HTMLMediaElement.prototype.canPlayType;
      HTMLMediaElement.prototype.canPlayType = function (t) { return /ogg/i.test(t) ? '' : can.call(this, t); };
      const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
      window.__srcs = [];
      Object.defineProperty(HTMLMediaElement.prototype, 'src', { get: d.get, configurable: true,
        set(v) { window.__srcs.push(v); d.set.call(this, v); } });
    })()""")
    open_app(c, 'listening/index.html#/section/l1')
    c.click('Start listening')
    c.sleep(0.4)
    c.click('.pbtn', 1.5)
    srcs = c.js("window.__srcs")
    check(srcs and all(s.endswith('.m4a') for s in srcs), f'tracks should load as .m4a, got {srcs}')
    check('Audio unavailable' not in view(c), 'the m4a copy should play')
    check(not c.text('.audio-bar .time').startswith('0:00'), 'the m4a copy should have moved past 0:00')
    answer_all(c)
    open_app(c, 'listening/index.html#/section/l1', 1.5)
    c.click('Play along', 1.5)
    check(c.js("document.querySelector('p.tline.current')?.dataset.para") is not None, 'play along should highlight a line')
    c.click('.line-play', 1.0)
    no_errors(c)


@test
def conjugation_example_sentences(c):
    # The data first: every sentence fits its lesson's table, has one slot for
    # the word, and furigana on every kanji. Each form a table teaches has two.
    import re
    with open(os.path.join(ROOT, 'conjugation', 'data', 'content.json'), encoding='utf-8') as f:
        content = json.load(f)
    with open(os.path.join(ROOT, 'conjugation', 'data', 'examples.json'), encoding='utf-8') as f:
        examples = json.load(f)
    words = content['words']
    tables = {s['id']: [b for b in s['blocks'] if b['t'] == 'table'] for l in content['lessons'] for s in l['sections']}
    kanji = re.compile(r'[㐀-鿿々〆]')
    problems = []
    for sid, items in examples.items():
        forms = {f for b in tables.get(sid, []) for f in b['forms']}
        if not forms:
            problems.append(f'{sid}: no such section with a table')
        for e in items:
            where = f"{sid} {e.get('w')} {e.get('f')}: {e.get('s')}"
            if e['f'] not in forms:
                problems.append(f'{where}: form not taught here')
            if e['f'] not in words.get(e['w'], {}).get('forms', {}):
                problems.append(f'{where}: word missing or has no such form')
            elif not 0 <= e.get('v', 0) < len(words[e['w']]['forms'][e['f']]['v']):
                problems.append(f'{where}: no variant {e["v"]} of that form')
            if e['s'].count('{}') != 1:
                problems.append(f'{where}: needs exactly one {{}}')
            if kanji.search(re.sub(r'[㐀-鿿々〆]+\[[^\]]+\]', '', e['s'])) or re.search(r'\[\]|[^㐀-鿿々〆]\[', e['s']):
                problems.append(f'{where}: kanji without a reading')
            if not e.get('en'):
                problems.append(f'{where}: no English')
    for sid, blocks in tables.items():
        for b in blocks:
            for f in b['forms']:
                n = sum(1 for e in examples.get(sid, []) if e['f'] == f)
                if n < 2:
                    problems.append(f'{sid} {f}: {n} example sentences, wants 2')
    check(not problems, 'example sentence problems:\n  ' + '\n  '.join(problems))

    # Then on screen: Lesson 38 shows them after the table, with the word picked out.
    open_app(c, 'conjugation/index.html#/section/l38.learn')
    check('In sentences' in view(c), 'the lesson should show example sentences')
    check(c.js("[...document.querySelectorAll('.view .emph')].some(e => e.textContent === 'きながら')"), 'the conjugated word should be highlighted')
    check('I eat while watching TV.' in view(c), 'the English should show')
    check(c.js("document.querySelectorAll('.view [aria-label=\"Hear this sentence\"]').length") == 5, 'each sentence should have a play button')
    c.click('[aria-label="Hear this sentence"]', 0.3)

    # After an answer, the result shows the form in a sentence too.
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('l38.learn'))")
    c.sleep(0.4)
    c.click('a.btn.block', 1)
    c.sleep(0.35)
    type_answer(c, question(c)['kana'])
    c.sleep(0.5)
    check('In a sentence' in c.text('.result'), 'the answer should come with an example sentence')
    no_errors(c)


@test
def staging_keeps_its_own_data(c):
    # Real progress: a passed section and a dark theme.
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    answer_all(c)
    check(c.js("vibeApp.model.totalPassed") == 1, 'the real site should record the pass')
    c.js("localStorage.setItem('grammarNotebook.theme', 'dark')")
    check(not c.js("!!document.querySelector('.staging-badge')"), 'the real site should have no staging label')
    real_text = c.js("JSON.stringify(vibeApp.model.exportBackup())")

    # Staging starts empty, and what it saves stays there.
    open_app(c, STAGING + 'writing/index.html#/section/l1.kana')
    check(c.js("window.STAGING === true") and c.js("!!document.querySelector('.staging-badge')"), 'staging should be labelled')
    check(c.js("vibeApp.model.totalPassed") == 0, 'staging should not see real progress')
    check(c.js("localStorage.getItem('grammarNotebook.theme')") is None, 'staging should not see real settings')
    c.js("localStorage.setItem('grammarNotebook.theme', 'light')")
    keys = c.js("Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))")
    check(keys and not any(k.startswith('staging.') for k in keys), f'staging code should see plain key names, got {keys}')
    names = c.js("indexedDB.databases().then(d => d.map(x => x.name))")
    check('vibe-writing' in names and not any(n.startswith('staging.') for n in names), f'staging should see plain database names, got {names}')

    # A real backup restores on staging, without touching the real data.
    c.js(f"vibeApp.model.restoreBackup(vibeApp.model.readBackup(JSON.parse({json.dumps(real_text)})))")
    c.sleep(0.5)
    check(c.js("vibeApp.model.totalPassed") == 1, 'a real backup should restore on staging')
    open_app(c, STAGING + 'index.html', 2)
    check('Not started yet' not in c.text('[data-stat="writing"]'), 'the staging landing page should read staging progress')

    # Back on the real site, nothing changed.
    open_app(c, 'index.html', 2)
    check(c.js("localStorage.getItem('grammarNotebook.theme')") == 'dark', 'staging must not change real settings')
    raw = c.js("Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))")
    check('staging.grammarNotebook.theme' in raw, f'staging data should sit under its prefix, got {raw}')
    names = c.js("indexedDB.databases().then(d => d.map(x => x.name))")
    check('vibe-writing' in names and 'staging.vibe-writing' in names, f'each site should have its own database, got {names}')
    no_errors(c)


def learner_status(c, item_id):
    """An item's status in the open app's learner model, after this app has synced."""
    c.js("vibeApp.learnerReady.then(() => vibeApp.syncLearner())")
    return c.js(f"vibeApp.learner.status({json.dumps(item_id)})")


@test
def learner_model_shared_across_apps(c):
    # Conjugation: an empty backup for later, then pass the ます-form lesson.
    open_app(c, 'conjugation/index.html#/section/l2.learn')
    empty = c.js("vibeApp.model.exportBackup()")
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('l2.learn'))")
    c.sleep(0.4)
    c.click('a.btn.block', 1)
    answer_all(c)
    s = learner_status(c, 'w:食べる|たべる')
    check(s['status'] == 'learning' and s['studiedIn'] == ['conjugation'], f'食べる should be learning in Conjugation, got {s}')
    check(learner_status(c, 'f:masu')['status'] == 'learning', 'the ます form should be learning')

    # Writing: the first kana lesson.
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    answer_all(c)
    check(learner_status(c, 'kana:あ')['status'] == 'learning', 'あ should be learning in Writing')

    # Reading: a word studied elsewhere says so in its popup, and lookups count.
    open_app(c, 'reading/index.html#/section/r1')
    c.js("vibeApp.learnerReady")
    note = c.js("""(async () => {
      for (const el of document.querySelectorAll('.pw[data-pk]')) {
        el.click();
        await new Promise((r) => setTimeout(r, 30));
        const n = document.querySelector('.word-popup .known-note');
        if (n && /Conjugation|Writing/.test(n.textContent)) return n.textContent;
        document.body.click();
      }
      return null;
    })()""")
    check(note and 'learning this word in Conjugation' in note, f'a word from Conjugation should say so in Reading, got {note}')
    check(c.js("vibeApp.learner.lookups.size") > 0, 'tapping words should count as lookups')
    c.js("document.body.click()")
    c.click('Answer')
    answer_all(c)
    s = learner_status(c, 'w:こんにちは|こんにちは')
    check(s['status'] == 'met' and 'reading' in s['seenIn'], f'a passed reading should mark its words as met, got {s}')

    # The landing page counts it all.
    open_app(c, 'index.html', 2.5)
    check(c.js("!document.getElementById('knowledge').hidden"), 'the landing page should show what you know')
    table = c.text('#knowledgeBody')
    for label in ('Words', 'Kana', 'Conjugation forms'):
        check(label in table, f'"{label}" should be counted, got {table}')

    # Restoring Conjugation to before the lesson takes its items out again.
    open_app(c, 'conjugation/index.html')
    c.js(f"vibeApp.model.restoreBackup(vibeApp.model.readBackup({json.dumps(empty)}))")
    c.sleep(0.5)
    check(learner_status(c, 'f:masu')['status'] is None, 'restoring an older backup should update the learner model')
    s = learner_status(c, 'w:こんにちは|こんにちは')
    check(s['status'] == 'met', "other apps' evidence should be untouched")
    no_errors(c)


@test
def vocab_lessons_lookups_and_landing(c):
    # A lesson passes, and its words join the learner model.
    open_app(c, 'vocab/index.html#/section/v1.1')
    check('From Track 1' in view(c), 'examples should come from the passages')
    c.click('[aria-label="Play this line"]', 0.5)
    c.click('a.btn.block', 1)
    answer_all(c)
    check(c.js("vibeApp.model.passed.has('v1.1')"), 'the first lesson part should pass')
    first = c.js("vibeApp.model.course.sectionById('v1.1').cards[0].learn[0].id")
    s = learner_status(c, first)
    check(s['status'] == 'learning' and 'vocab' in s['studiedIn'], f'{first} should be learning in Vocabulary, got {s}')

    # A word looked up in Reading is offered for review, and says so in its lesson.
    open_app(c, 'reading/index.html#/section/r1')
    c.js("vibeApp.learnerReady")
    c.js("(() => { const els = [...document.querySelectorAll('.pw[data-pk]')]; els[els.length - 3].click(); })()")
    c.sleep(0.3)
    open_app(c, 'vocab/index.html', 2)
    c.js("vibeApp.learnerReady")
    check('Words you looked up' in view(c), 'looked-up words should be offered')
    before = c.js("vibeApp.model.wordsLearned")
    c.click('Add them to my reviews', 0.5)
    check(c.js("vibeApp.model.wordsLearned") > before, 'adding looked-up words should put them in the reviews')
    check('Words you looked up' not in view(c), 'the offer should go once they are added')
    section = c.js("""(() => { const course = vibeApp.model.course;
      for (const id of vibeApp.learner.lookups.keys()) {
        const w = course.wordByKey.get(id.slice(2));
        if (w) return course.sectionOfCard(course.cardById('mean:' + w.key)).id;
      } })()""")
    open_app(c, f'vocab/index.html#/section/{section}', 2)
    check('Looked up once before' in c.text('.view'), 'a looked-up word should say so in its lesson')

    # The landing page has the tile.
    open_app(c, 'index.html', 2.5)
    check('/' in c.text('[data-stat="vocab"]'), f"the Vocabulary tile should show progress, got {c.text('[data-stat=\"vocab\"]')}")
    no_errors(c)


def quiz_size(c):
    """The question count on the lesson screen's quiz button."""
    import re
    m = re.search(r'\((\d+) (?:questions|items)\)', c.text('.view'))
    return int(m.group(1)) if m else None


@test
def mark_items_already_known(c):
    # Vocabulary: one word marked, so the quiz skips its cards.
    open_app(c, 'vocab/index.html#/section/v1.1')
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('v1.1'))")
    c.sleep(0.3)
    before = quiz_size(c)
    c.click('I already know this', 0.4)
    after = quiz_size(c)
    check(before and after == before - 2, f'marking a kanji word should drop its 2 cards from the quiz: {before} -> {after}')
    check('Known' in c.text('.known-toggle.on'), 'the button should show the word as known')
    first = c.js("vibeApp.model.course.sectionById('v1.1').cards[0].id")
    item = c.js("vibeApp.model.course.sectionById('v1.1').cards[0].learn[0].id")
    check(learner_status(c, item)['status'] == 'known', 'a marked word should count as known')

    # It lasts, and can be undone.
    open_app(c, 'vocab/index.html#/section/v1.1', 1.5)
    check(quiz_size(c) == after and c.js("document.querySelectorAll('.known-toggle.on').length") == 1, 'the mark should survive a reload')
    c.click('.known-toggle.on', 0.4)
    check(quiz_size(c) == before, 'undoing should put the cards back in the quiz')

    # Every word in a part marked: the part can be finished without a quiz.
    open_app(c, 'vocab/index.html#/section/v1.2', 1.5)
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('v1.2'))")
    c.sleep(0.3)
    c.js("document.querySelectorAll('.known-toggle').forEach((b) => b.click())")
    c.sleep(0.5)
    c.click('Mark this part as done', 0.5)
    check(c.js("vibeApp.model.passed.has('v1.2')"), 'marking every word known should let the part be finished')

    # The first review clears the mark, and the button goes.
    open_app(c, 'vocab/index.html#/section/v1.1', 1.5)
    c.click('I already know this', 0.4)
    c.js(f"vibeApp.model.recordReview({json.dumps(first)}, {{ correct: true }})")
    c.sleep(0.4)
    check(not c.js(f"vibeApp.model.isMarkedKnown({json.dumps(first)})"), 'a review should clear the mark')

    # Writing: a kana row.
    open_app(c, 'writing/index.html#/section/l1.kana')
    before = quiz_size(c)
    c.click('I already know this', 0.4)
    check(quiz_size(c) == before - 1, 'a marked kana row should leave the quiz')

    # Conjugation: a word in a lesson table.
    open_app(c, 'conjugation/index.html#/section/l2.learn')
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('l2.learn'))")
    c.sleep(0.3)
    before = quiz_size(c)
    c.click('I already know this', 0.4)
    check(quiz_size(c) == before - 2, 'a marked word should take both its forms out of the quiz')
    c.click('a.btn.block', 1)
    check(c.js("vibeApp.ui.screen.state.engine.total") == before - 2, 'the quiz itself should skip marked cards')
    no_errors(c)


@test
def grammar_course_library_and_links(c):
    # Every hand-written link points at a real grammar point, with its pattern.
    open_app(c, 'grammar/index.html', 2)
    bad = c.js("""import('../shared/grammar-links.js').then((L) => {
      const bad = [];
      const ids = new Set([...Object.keys(L.GRAMMAR_LABELS), ...Object.values(L.CONJUGATION_LESSONS).flat(), ...Object.values(L.PASSAGE_FORMS).flat()]);
      for (const id of ids) {
        const e = GrammarCore.findEntryById(id);
        if (!e) bad.push(id + ': no such grammar point');
        else if (L.GRAMMAR_LABELS[id] !== e.pattern) bad.push(id + ': label ' + L.GRAMMAR_LABELS[id] + ' is not ' + e.pattern);
      }
      return bad; })""")
    check(not bad, 'grammar links: ' + '; '.join(bad or []))
    check(c.js("GrammarCore.courseLessons().reduce((n, l) => n + l.entries.length, 0)") == c.js("GrammarCore.allEntries().length"), 'the course should cover every grammar point')

    # The course: a lesson, one point marked known, the rest quizzed.
    open_app(c, 'grammar-course/index.html#/section/g1')
    first = c.js("vibeApp.model.course.sectionById('g1').cards[0].id")
    check('The full entry in the Grammar Library' in view(c), 'lessons should link to the library')
    before = quiz_size(c)
    c.click('I already know this', 0.4)
    cards_of_first = c.js("vibeApp.model.course.sectionById('g1').cards.filter((x) => x.id.endsWith(':' + vibeApp.model.course.sectionById('g1').cards[0].id.slice(2))).length")
    check(quiz_size(c) == before - cards_of_first, 'a known point should take all its cards out of the quiz')
    c.click('a.btn.block', 1)
    check(c.js("vibeApp.ui.screen.state.engine.currentQuestion.kind") in ('blank', 'order'), 'questions should be fill-the-blank or sentence building')
    answer_all(c)
    check(c.js("vibeApp.model.passed.has('g1')"), 'the first grammar lesson should pass')
    # The next grammar point's fill-the-blank card (each point also has a sentence card).
    second = c.js(f"vibeApp.model.course.sectionById('g1').cards.find((x) => x.id.startsWith('g:') && x.id !== {json.dumps(first)}).id")
    check(learner_status(c, second)['status'] == 'learning', 'a quizzed point should be learning')
    check(learner_status(c, first)['status'] == 'known', 'a point marked known should be known')

    # The library: a deep link opens the entry, which shows where it stands.
    entry = second[2:]
    c.go(BASE + f'grammar/index.html#{entry}', 2.5)
    check(c.js("document.querySelector('.entry.open') && document.querySelector('.entry.open').dataset.id") == entry, 'a deep link should open its entry')
    line = c.js(f"document.querySelector('[data-course=\"{entry}\"]').innerText")
    check('learning this' in line and 'lesson 1' in line, f'the entry should show its course status, got {line}')

    # Conjugation and Reading link to the grammar.
    open_app(c, 'conjugation/index.html#/section/l38.learn', 1.5)
    check(c.js("[...document.querySelectorAll('.view a')].some((a) => a.getAttribute('href') === '../grammar/index.html#n5-nagara')"), 'Conjugation lesson 38 should link to ながら')
    open_app(c, 'reading/index.html#/section/r3', 1.5)
    found = c.js("""(async () => { for (const el of document.querySelectorAll('.pw[data-pk]')) {
      if (!el.textContent.includes('です')) continue;
      el.click(); await new Promise((r) => setTimeout(r, 20));
      const g = document.querySelector('.word-popup .grammar-links a'); if (g) return g.getAttribute('href'); document.body.click(); } return null; })()""")
    check(found == '../grammar/index.html#n5-desu', f'a polite です word should link to です, got {found}')

    # The landing page has the course.
    open_app(c, 'index.html', 2.5)
    check('/' in c.text('[data-stat="grammar"]'), 'the Grammar course tile should show progress')
    no_errors(c)


@test
def grammar_sentence_building(c):
    # The pieces: every grammar point with a long enough example gets the
    # question, each piece's furigana matches the sentence's, and the grammar
    # point is never split.
    open_app(c, 'grammar/index.html', 2)
    bad = c.js("""(() => { const C = GrammarCore; const bad = []; let n = 0;
      for (const e of C.allEntries()) for (const ex of C.flattenExamples(e)) {
        const hl = C.getExampleHighlightRange(ex, e.pattern); const p = C.sentencePieces(ex, hl); if (!p) continue; n++;
        if (p.map((x) => ex.japanese.slice(x.start, x.end)).join('') !== ex.japanese) bad.push(ex.japanese + ': pieces lose text');
        if (hl && p.some((x) => x.start > hl.start && x.start < hl.end)) bad.push(ex.japanese + ': grammar split');
        const kana = p.map((x) => { const d = document.createElement('div'); d.innerHTML = C.pieceRuby(ex, x);
          d.querySelectorAll('ruby').forEach((r) => r.replaceWith(r.querySelector('rt').textContent)); return d.textContent; }).join('');
        if (ex.furigana && kana !== ex.furigana) bad.push(ex.japanese + ': furigana ' + kana + ' is not ' + ex.furigana);
      }
      return { n, bad: bad.slice(0, 5), count: bad.length }; })()""")
    check(bad['n'] > 1000 and not bad['count'], f"sentence pieces: {bad}")

    # In the course: a right order is right, a wrong one isn't.
    open_app(c, 'grammar-course/index.html#/section/g1')
    c.click('a.btn.block', 1)
    seen = {'right': False, 'wrong': False}
    for _ in range(20):
        if not in_quiz(c):
            break
        c.sleep(0.35)
        q = question(c)
        if q['type'] == 'order' and not all(seen.values()):
            mode = 'wrong' if not seen['wrong'] else 'right'
            answer_all(c, lambda i, q: mode, limit=1)
            ok = c.js("vibeApp.ui.screen.state.last.correct")
            check(ok == (mode == 'right'), f'a {mode} order should be marked {mode}')
            seen[mode] = True
        else:
            answer_all(c, limit=1)
    check(all(seen.values()), f'the lesson should ask sentence-building questions, saw {seen}')

    # A lesson passed before sentence building existed gets its cards on reload.
    answer_all(c)
    c.js("""(() => { const m = vibeApp.model; const ids = [...m.cards.keys()].filter((id) => id.startsWith('gs:'));
      for (const id of ids) m.cards.delete(id); return m.store.deleteCards(ids); })()""")
    c.sleep(0.4)
    open_app(c, 'grammar-course/index.html', 2)
    check(c.js("[...vibeApp.model.cards.keys()].some((id) => id.startsWith('gs:'))"), 'passed points should get their sentence cards')
    no_errors(c)


@test
def placement_test_and_skip_ahead(c):
    # A first visit offers the test.
    open_app(c, 'index.html', 2.5)
    check('Already know some Japanese?' in c.js("document.querySelector('dialog.modal')?.innerText || ''"), 'a first visit should offer the placement test')
    c.js("[...document.querySelectorAll('dialog.modal button')].find((b) => b.textContent.includes('Take the test')).click()")
    c.wait_for("!!(window.placement && placement.state.phase === 'intro')", 15)

    # Every level makes sound questions in every part.
    bad = c.js("""(() => { const bad = []; const { SECTIONS, LEVELS } = placement;
      for (const s of SECTIONS) for (const l of LEVELS) { const used = new Set();
        for (let i = 0; i < 12; i++) { const q = s.make(l, used);
          if (!q) { bad.push(s.id + ' ' + l + ': ran out at ' + i); break; }
          if (q.options.length < 3 || new Set(q.options).size !== q.options.length || !(q.correctIndex >= 0)) bad.push(s.id + ' ' + l + ': bad options ' + q.options.join(' / ')); } }
      return bad; })()""")
    check(not bad, 'placement questions: ' + '; '.join(bad[:5]))

    def take(section, until_level):
        """Answers right below until_level (an index into N5..N1), then I don't know."""
        n = 0
        while c.js("placement.state.phase") == 'question' and n < 60:
            right = c.js("placement.state.level") < until_level
            c.js(f"""(() => {{ const q = placement.state.question;
              const i = {'true' if right else 'false'} ? q.correctIndex : -1;
              document.querySelector(`[data-act="answer"][data-i="${{i}}"]`).click(); }})()""")
            n += 1
        check(c.js("placement.state.phase") == 'between', f'{section} should end on its result')

    c.click('Start the test', 0.3)
    take('grammar', 2)  # N5 and N4 passed
    check('N4 passed' in view(c), 'grammar should come out at N4: ' + view(c)[:200])
    c.click('Continue', 0.3)
    c.click('Stop here', 0.3)  # vocabulary: nothing passed
    check('starting from N5' in view(c), 'stopping at once should pass nothing')
    c.click('Continue', 0.3)
    take('kanji', 1)
    c.click('See your results', 0.3)
    choices = c.js("Object.fromEntries([...document.querySelectorAll('[data-course]')].map((s) => [s.dataset.course, s.value]))")
    check(choices == {'grammar': 'N4', 'conjugation': 'N4', 'vocab': '', 'reading': '', 'listening': '', 'writing': 'N5'}, f'result defaults: {choices}')
    c.js("const s = document.querySelector('[data-course=listening]'); s.value = 'N5'; s.dispatchEvent(new Event('change', { bubbles: true }))")
    c.click('Apply', 0.3)
    saved = c.js("JSON.parse(localStorage.getItem('vibe.placement')).levels")
    check(saved == {'grammar': 'N4', 'conjugation': 'N4', 'vocab': None, 'reading': None, 'listening': 'N5', 'writing': 'N5'}, f'saved levels: {saved}')
    no_errors(c)

    # The grammar course skips N5 and N4 when it opens, with no cards, even after a reload.
    open_app(c, 'grammar-course/index.html')
    expect = c.js("vibeApp.model.placementSections('N4').length")
    check(expect == c.js("vibeApp.model.lessonsAt('N5').length + vibeApp.model.lessonsAt('N4').length"), 'N4 placement should cover the N5 and N4 lessons')
    check(c.js("vibeApp.model.passed.size") == expect and c.js("vibeApp.model.placed.size") == expect, 'the N5 and N4 lessons should be placed')
    check(c.js("vibeApp.model.course.lessonOf(vibeApp.model.nextSection).level") == 'N3', 'the next lesson should be N3')
    open_app(c, 'grammar-course/index.html')
    check(c.js("vibeApp.model.passed.size") == expect, 'a reload should not apply the placement again')
    check(c.js("vibeApp.model.cards.size") == 0, 'placed lessons should add no review cards')
    check(c.js("vibeApp.model.achievementView().lessonsComplete") == 0, 'placed lessons should not count for achievements')

    # A placed lesson can still be studied: its quiz adds its cards.
    c.go(BASE + 'grammar-course/index.html#/section/g1', 1.5)
    check('You skipped this with the placement test' in view(c), 'a placed lesson should say so')
    c.click('Start the quiz', 1)
    answer_all(c)
    check(c.js("vibeApp.model.cards.size") > 0 and not c.js("vibeApp.model.isPlaced(vibeApp.model.course.sectionById('g1'))"), 'studying a placed lesson should add its cards')

    # Undo puts back everything not studied since.
    c.go(BASE + 'grammar-course/index.html#/settings', 1.5)
    c.click('Undo placement', 0.4)
    c.js("document.querySelector('dialog.modal .btn:not(.text)').click()")
    c.sleep(0.6)
    check(c.js("vibeApp.model.placed.size") == 0 and c.js("[...vibeApp.model.passed]") == ['g1'], 'undo should leave only the studied lesson passed')
    check('Undo placement' not in view(c), 'with nothing to undo, the setting should go')

    # The other apps apply their own levels.
    open_app(c, 'conjugation/index.html')
    check(c.js("vibeApp.model.course.lessonOf(vibeApp.model.nextSection).number") == 36, 'Conjugation at N4 should start after keigo, at lesson 36')
    open_app(c, 'writing/index.html')
    check(c.js("vibeApp.model.placed.size") == c.js("vibeApp.model.placementSections('N5').length") > 0, 'Writing should skip N5')
    check(c.js("vibeApp.model.dailyWriting(vibeApp.model.loadStudyStats()).length") == 0, 'placed lessons should not join the daily writing task')
    open_app(c, 'listening/index.html')
    check(c.js("vibeApp.model.placed.size") > 0, 'Listening should skip N5')
    open_app(c, 'vocab/index.html')
    check(c.js("vibeApp.model.passed.size") == 0, 'Vocabulary should start from the beginning')
    check(c.js("JSON.parse(localStorage.getItem('vibe.placement')).applied.vocab") is not None, 'each app should note it applied its part')

    # The test is offered only once.
    open_app(c, 'index.html', 2.5)
    check(not c.js("!!document.querySelector('dialog.modal')"), 'the test should not be offered twice')
    check(c.js("!!document.querySelector('a[href=\"placement/index.html\"]')"), 'the landing page should link to the test')
    check(c.text('#placementLink').startswith('Retake the placement test'), 'after a placement, the link should offer a retake')
    no_errors(c)


@test
def placement_not_offered_to_existing_learners(c):
    open_app(c, 'grammar/index.html', 1.5)
    c.js("localStorage.setItem('vibe.summary.vocab', JSON.stringify({ lessonsDone: 1, lessonsTotal: 132, sectionsDone: 1, sectionsTotal: 400 }))")
    open_app(c, 'index.html', 2.5)
    check(not c.js("!!document.querySelector('dialog.modal')"), 'someone already studying should not be offered the test')
    check(c.js("localStorage.getItem('vibe.placementOffered')") is not None, 'and should not be asked later either')
    no_errors(c)


@test
def lesson_end_returns_to_the_lessons(c):
    # Two lessons in a row, then back: home, not the lesson before.
    open_app(c, 'grammar-course/index.html')
    c.click('.view a.card', 1)
    c.click('Start the quiz', 1)
    answer_all(c)
    c.click('Continue to Lesson 2', 1.2)
    check(c.js("location.hash") == '#/section/g2', 'the next button should open the next lesson: ' + c.js("location.hash"))
    c.click('Start the quiz', 1)
    answer_all(c)
    c.click('Back to the lessons', 1.2)
    check(c.js("location.hash") in ('', '#/'), 'back should go to the app home, not ' + c.js("location.hash"))
    check(c.js("(() => { const el = document.querySelector('[data-lesson=\"2\"]'); if (!el) return false; const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()"),
          'the lesson just finished should be in view')
    check(c.js("vibeApp.ui.stack.length") == 1, f'the in-app history should be unwound: {c.js("vibeApp.ui.stack")}')

    # Opened straight into a lesson, it still ends at home.
    c.go('about:blank', 0.3)
    open_app(c, 'grammar-course/index.html#/section/g3')
    c.click('Start the quiz', 1)
    answer_all(c)
    c.click('Back to the lessons', 1.5)
    check(c.js("location.hash") == '#/' and 'Your progress' in view(c), 'a lesson opened directly should also end at home: ' + c.js("location.hash"))
    check([t.strip() for t in c.js("[...document.querySelectorAll('.appbar-title')].map((e) => e.textContent)")] == ['Grammar'], 'the app should be called just Grammar')

    open_app(c, 'index.html', 2.5)
    names = c.js("[...document.querySelectorAll('nav.tiles .tile-name')].map((e) => e.textContent)")
    check(names == ['Grammar Library', 'Vocabulary', 'Writing', 'Grammar', 'Conjugation', 'Reading', 'Listening'], f'tile order: {names}')
    no_errors(c)


@test
def pages_load_quickly(c):
    # Each page lists all its code and content up front (tools/preloads.py).
    import subprocess
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'preloads.py'), '--check'], capture_output=True, text=True)
    check(r.returncode == 0, r.stdout.strip() or r.stderr.strip())
    # The app's frame shows before its code runs.
    c.go(BASE + 'vocab/index.html', 0.1)
    shell = c.js("fetch('index.html').then((r) => r.text()).then((t) => new DOMParser().parseFromString(t, 'text/html').querySelector('#app .appbar-title')?.textContent)")
    check(shell == 'Vocabulary', f'the page should hold the app frame, got {shell}')
    # Writing opens without its stroke data, then draws the strokes when it arrives.
    open_app(c, 'writing/index.html#/section/l2.kanji')
    c.wait_for("document.querySelectorAll('svg.stroke path.ink').length > 0", 15)
    check(not c.js("[...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r instanceof CSSImportRule); } catch (e) { return false; } })"), 'no stylesheet should @import (it holds up the page)')
    no_errors(c)


@test
def android_backups_restore(c):
    # A backup from the Android app restores from that app's Settings.
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    answer_all(c)
    android = json.loads(c.js("vibeApp.model.exportBackup()"))
    android['app'] = 'vibe_jap_writing'
    android['tables']['app_settings'].append({'key': 'dark_mode', 'value': 'true'})  # Android-only, ignored here
    text = json.dumps(android)
    info = c.js(f"(() => {{ const b = vibeApp.model.readBackup({json.dumps(text)}); return [b.fromAndroid, b.sectionsPassed, b.itemsLearned]; }})()")
    check(info == [True, 1, 10], f'an Android Writing backup should be accepted: {info}')
    c.js("vibeApp.model.store.replaceAllTables({})")
    c.sleep(0.3)
    c.js(f"vibeApp.model.restoreBackup(vibeApp.model.readBackup({json.dumps(text)}))")
    c.sleep(0.5)
    check(c.js("vibeApp.model.totalPassed") == 1 and c.js("vibeApp.model.cards.size") == 10, 'the Android backup should restore')
    bad = c.js("(() => { try { vibeApp.model.readBackup(JSON.stringify({ app: 'vibe_jap_reading', format: 1, schema: 1, tables: {} })); return 'accepted'; } catch (e) { return e.message; } })()")
    check("isn't a Writing backup" in bad, "another Android app's backup should be refused")

    # From the landing page, any single app's backup goes to its app: here a
    # Reading backup as the Android app writes it.
    open_app(c, 'reading/index.html')
    card = c.js("vibeApp.model.course.sectionById('r1').reviewCard.id")
    part = c.js("vibeApp.model.course.partOf(vibeApp.model.course.sectionById('r1')).id")
    now = int(time.time() * 1000)
    data = json.dumps({'cardId': 1700000000000, 'state': 2, 'step': None, 'stability': 3.2, 'difficulty': 5.1,
                       'due': '2026-12-01T09:00:00.000Z', 'lastReview': '2026-11-20T09:00:00.000Z'})
    reading = {'app': 'vibe_jap_reading', 'format': 1, 'schema': 1, 'savedAt': now, 'tables': {
        'section_progress': [{'section_id': 'r1', 'passed_at': now, 'early_unlocked_at': None}],
        'srs_cards': [{'card_id': card, 'part_id': part, 'data': data}],
        'review_log': [{'id': 1, 'card_id': card, 'part_id': part, 'day': '2026-11-20', 'reviewed_at': now, 'rating': 3}],
        'deck_settings': [{'part_id': part, 'paused': 0, 'daily_limit': 20}],
        'quiz_sessions': [], 'quiz_answers': [], 'practice_log': [], 'quiz_progress': [],
        'app_settings': [{'key': 'lookups', 'value': '12'}, {'key': 'departure', 'value': '2027-01-05'}],
    }}
    open_app(c, 'index.html', 2.5)
    c.js("document.querySelector('dialog.modal')?.close()")
    c.js(f"""HTMLInputElement.prototype.click = function () {{
      const dt = new DataTransfer(); dt.items.add(new File([{json.dumps(json.dumps(reading))}], 'reading.json', {{ type: 'application/json' }}));
      this.files = dt.files; this.dispatchEvent(new Event('change')); }}""")
    c.click('#restoreAll', 0.8)
    check('from the Android app' in c.js("document.querySelector('dialog.modal')?.innerText || ''"), 'the landing page should offer to restore the Android Reading backup')
    c.js("document.querySelector('dialog.modal .btn:not(.text)').click()")
    c.sleep(1)
    open_app(c, 'reading/index.html')
    check(c.js("vibeApp.model.passed.has('r1')") and c.js("vibeApp.model.cards.size") == 1, 'the Reading progress should be restored')
    check(c.js("vibeApp.model.lookups") == 12, 'its counts should carry over')
    check(c.js("vibeApp.model.cards.get(" + json.dumps(card) + ").card.stability") == 3.2, 'the card schedule should carry over')
    no_errors(c)


@test
def lesson_lists_and_empty_tabs(c):
    # Today lists fold by level, with only the next lesson's level open.
    open_app(c, 'vocab/index.html')
    check(c.js("document.querySelectorAll('.fold').length") == 5 and c.js("document.querySelectorAll('.fold.open').length") == 1, 'one fold per level, only N5 open')
    check(not c.js("!!document.querySelector('[data-lesson=\"16\"]')"), 'N4 lessons should stay folded away')
    c.js("[...document.querySelectorAll('.fold-head')].find((b) => b.textContent.includes('N4')).click()")
    c.sleep(0.3)
    check(c.js("!!document.querySelector('[data-lesson=\"16\"]')"), 'tapping N4 should open it')
    # Conjugation folds by part.
    open_app(c, 'conjugation/index.html')
    check(c.js("document.querySelectorAll('.fold').length") == 7, 'Conjugation should fold by part')
    # A word's further senses wait behind a tap.
    open_app(c, 'vocab/index.html#/section/v1.1')
    check(c.js("!!document.querySelector('.vocab-word details.more-senses')"), 'extra meanings should be folded away')
    check(c.js("!!document.querySelector('.vocab-word .word-head .word-reading')"), 'a word should show its reading above it')
    # Before any study, Reviews and Stats say what they're for.
    open_app(c, 'vocab/index.html#/reviews')
    check('No reviews yet' in view(c) and 'Start your first lesson' in view(c), 'Reviews should explain itself before any study')
    open_app(c, 'vocab/index.html#/stats')
    check('Your stats start here' in view(c) and 'Achievements' in view(c), 'Stats should explain itself before any study')
    # The library's header matches the apps'.
    open_app(c, 'grammar/index.html', 2)
    check(c.js("!!document.querySelector('.app-header .home-btn[href=\"../index.html\"]')") and 'Furigana' in c.text('.furigana-chip'), 'library header')
    no_errors(c)


@test
def kanji_stroke_diagrams(c):
    open_app(c, 'writing/index.html#/section/l13.kanji')
    c.wait_for("document.querySelectorAll('svg.stroke path.ink').length > 0", 15)
    card = "[...document.querySelectorAll('.kanji-card')].find((e) => e.textContent.includes('fish'))"
    check(c.js(f"{card}.querySelectorAll('.stroke-main .lbl').length") == 11, '魚 should show its 11 stroke numbers')
    check(c.js(f"!!{card}.querySelector('.stroke-main .stroke-expand')"), 'the diagram should show that it opens larger')
    check(not c.js(f"[...{card}.querySelectorAll('.stroke-controls .chip')].some((b) => b.textContent.includes('Slow'))"), 'no Slow button')
    # Play draws it stroke by stroke.
    c.js(f"[...{card}.querySelectorAll('.stroke-controls .chip')].find((b) => b.textContent.includes('Play')).click()")
    check(c.js(f"{card}.querySelector('.stroke-main svg.stroke').classList.contains('drawing')"), 'Play should start the drawing')
    # Numbers off, remembered.
    c.js(f"[...{card}.querySelectorAll('.stroke-controls .chip')].find((b) => b.textContent.includes('Stroke numbers')).click()")
    c.sleep(0.4)
    check(c.js("document.querySelectorAll('.kanji-card .stroke-main .lbl').length") == 0, 'turning numbers off should hide them')
    c.sleep(0.5)
    open_app(c, 'writing/index.html#/section/l13.kanji')
    c.wait_for("document.querySelectorAll('svg.stroke path.ink').length > 0", 15)
    check(c.js("document.querySelectorAll('.kanji-card .stroke-main .lbl').length") == 0, 'numbers off should be remembered')
    c.js(f"[...{card}.querySelectorAll('.stroke-controls .chip')].find((b) => b.textContent.includes('Stroke numbers')).click()")
    c.sleep(0.4)
    # The larger view.
    c.js(f"{card}.querySelector('.stroke-open').click()")
    c.sleep(0.5)
    check(c.js("document.querySelectorAll('dialog.stroke-viewer .lbl').length") == 11, 'the larger view should show the numbers')
    c.js("document.querySelector('dialog.stroke-viewer [data-close]').click()")
    c.sleep(0.3)
    check(not c.js("!!document.querySelector('dialog.stroke-viewer')"), 'the larger view should close')
    # A quiz answer's diagram opens it too.
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('l13.kanji'))")
    c.sleep(0.4)
    c.click('a.btn.block', 1)
    c.click('Show answer', 0.4)
    c.js("document.querySelector('[data-viewer]').click()")
    c.sleep(0.5)
    check(c.js("!!document.querySelector('dialog.stroke-viewer svg.stroke')"), "a quiz answer's diagram should open the larger view")
    no_errors(c)


@test
def app_backup_round_trip(c):
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    answer_all(c)
    text = c.js("vibeApp.model.exportBackup()")
    info = c.js(f"(() => {{ const b = vibeApp.model.readBackup({json.dumps(text)}); return [b.sectionsPassed, b.itemsLearned]; }})()")
    check(info == [1, 10], f'backup should hold 1 section and 10 items, got {info}')
    c.js("vibeApp.model.store.replaceAllTables({})")
    c.sleep(0.3)
    c.js(f"vibeApp.model.restoreBackup(vibeApp.model.readBackup({json.dumps(text)}))")
    c.sleep(0.5)
    check(c.js("vibeApp.model.totalPassed") == 1, 'restore should bring progress back')
    bad = c.js("(() => { try { vibeApp.model.readBackup('{\"app\":\"vibe_web_reading\"}'); return 'accepted'; } catch (e) { return e.message; } })()")
    check("isn't a Writing backup" in bad, 'another app\'s backup should be refused')
    no_errors(c)


@test
def landing_glance_chart_and_backup_reminder(c):
    open_app(c, 'writing/index.html#/section/l1.kana')
    c.click('Write from memory')
    answer_all(c)
    c.js("""(() => { const s = vibeApp.model.store; const day = 86400000;
      for (let d = 1; d <= 2; d++) s.logAnswer({ sessionId: 1, cardId: 'kana:hiragana-basic.0', partId: 'kana', round: 1, correct: true, millis: 90000, given: null, at: Date.now() - d * day }); })()""")
    c.sleep(0.5)
    open_app(c, 'index.html', 2.5)
    strip = c.text('#summary')
    check('3' in strip and 'Day streak' in strip, 'streak should be 3: ' + strip)
    check(not c.js("document.getElementById('activity').hidden"), 'chart should show')
    check(c.text('[data-stat="writing"]').startswith('0/262 lessons'), 'Writing tile should show lessons from its summary')
    reminder = c.js("document.getElementById('backupReminder').hidden ? '' : document.getElementById('backupReminder').innerText")
    check("haven't backed up" in reminder, 'backup reminder should show after three study days')
    c.click('[data-reminder="later"]', 0.4)
    open_app(c, 'index.html', 2)
    check(c.js("document.getElementById('backupReminder').hidden"), 'Remind me later should hide it on reload')
    no_errors(c)


@test
def android_emulation_touch_install_and_enter(c):
    c.send('Emulation.setDeviceMetricsOverride', width=412, height=915, deviceScaleFactor=2.6, mobile=True)
    c.send('Emulation.setTouchEmulationEnabled', enabled=True, maxTouchPoints=5)
    c.send('Emulation.setUserAgentOverride', userAgent='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', platform='Android')

    def tap(selector, wait=0.5):
        x, y = c.js(f"(() => {{ const e = document.querySelector({json.dumps(selector)}); e.scrollIntoView({{block:'center'}}); const b = e.getBoundingClientRect(); return [b.left + b.width/2, b.top + b.height/2]; }})()")
        c.send('Input.dispatchTouchEvent', type='touchStart', touchPoints=[{'x': x, 'y': y}])
        c.send('Input.dispatchTouchEvent', type='touchEnd', touchPoints=[])
        c.sleep(wait)

    open_app(c, 'index.html', 2.5)
    check(c.send('Page.getInstallabilityErrors')['installabilityErrors'] == [], 'site should be installable')
    # A first visit offers the placement test; a tap declines it.
    tap('dialog.modal .btn.text')
    check(not c.js("!!document.querySelector('dialog.modal')"), 'tapping Start from the beginning should close the placement offer')
    # The starting theme follows the system's, so check the tap flips it either way.
    before = c.js("document.documentElement.dataset.theme")
    tap('#themeToggle')
    after = c.js("document.documentElement.dataset.theme")
    check(after != before, 'tapping the toggle should switch the theme')
    bar = c.js("document.querySelector('meta[name=theme-color]').content")
    check(bar == ('#0A0A0C' if after == 'dark' else '#FAFAFA'), f'bar colour should follow the {after} theme, got {bar}')
    tap('a[href="reading/index.html"]', 3)
    check(c.js("location.pathname").endswith('/reading/index.html'), 'tapping a tile should open the app')
    open_app(c, 'conjugation/index.html#/section/l2.learn', 1.5)
    c.js("vibeApp.model.unlockEarly(vibeApp.model.course.sectionById('l2.learn'))")
    c.sleep(0.4)
    tap('a.btn.block', 1.5)
    kana = question(c)['kana']
    tap('#answer', 0.4)
    c.send('Input.insertText', text=kana)
    c.send('Input.dispatchKeyEvent', type='keyDown', key='Enter', code='Enter', windowsVirtualKeyCode=13, text='\r')
    c.send('Input.dispatchKeyEvent', type='keyUp', key='Enter', code='Enter', windowsVirtualKeyCode=13)
    c.sleep(0.8)
    check('right' in c.text('.result-head'), 'keyboard Enter should submit the typed answer')
    no_errors(c)


@test
def every_screen_renders(c):
    for app, paths in {
        'writing': ['', '#/reviews', '#/stats', '#/settings', '#/section/l1.kana', '#/achievements'],
        'conjugation': ['', '#/reviews', '#/stats', '#/settings', '#/section/l1.types', '#/deck/n5v?tab=stats'],
        'reading': ['', '#/reviews', '#/stats', '#/settings', '#/section/r1', '#/item/reread%3A1'],
        'listening': ['', '#/reviews', '#/stats', '#/settings', '#/section/l1', '#/practice'],
        'vocab': ['', '#/reviews', '#/stats', '#/settings', '#/section/v1.1', '#/section/v60.2', '#/achievements'],
        'grammar-course': ['', '#/reviews', '#/stats', '#/settings', '#/section/g1', '#/section/g100', '#/achievements'],
    }.items():
        for p in paths:
            open_app(c, f'{app}/index.html{p}', 1)
            check(len(view(c)) > 40, f'{app}{p} rendered nothing')
    no_errors(c)


# ---------- Runner ----------

def main():
    only = sys.argv[1] if len(sys.argv) > 1 else ''
    server = serve()
    chosen = [t for t in TESTS if only in t.__name__]
    failed = 0
    start = time.time()
    for t in chosen:
        c = Chrome(420, 900)
        t0 = time.time()
        try:
            t(c)
            print(f'PASS  {t.__name__}  ({time.time() - t0:.0f}s)')
        except Failure as e:
            failed += 1
            print(f'FAIL  {t.__name__}: {e}')
        except Exception:
            failed += 1
            print(f'ERROR {t.__name__}:')
            traceback.print_exc()
        finally:
            c.close()
    server.shutdown()
    print(f'\n{len(chosen) - failed} of {len(chosen)} passed in {time.time() - start:.0f}s')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
