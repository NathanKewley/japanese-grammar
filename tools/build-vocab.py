#!/usr/bin/env python3
"""Builds the vocabulary course (vocab/data/content.json) from the Reading and
Listening content, so it needs nothing beyond what the site already has.

Lesson n teaches the words that first appear in Reading n or Track n, in the
order they come up, so each lesson prepares you for that reading and track.
Pure grammar words (particles, the copula and so on) are left to the grammar
library. Each word keeps up to two example sentences from its lesson's passages:
one from the track (with its audio timing) and one from the reading. Each
lesson keeps its sentences once, and its words point at them.

    python3 tools/build-vocab.py

Run it after tools/sync-content.sh, which does so itself.
"""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Parts of speech that make an entry a grammar word rather than vocabulary.
GRAMMAR = {'prt', 'aux', 'aux-v', 'aux-adj', 'cop', 'cop-da'}
# Ones that don't stop it being a grammar word when they come with the above.
LOOSE = {'exp', 'suf', 'n-suf', 'pref'}

# The longest a meaning gets: this many senses, each cut to this many glosses.
SENSES = 3
GLOSSES = 3


def hiragana(s):
    return ''.join(chr(ord(c) - 0x60) if 'ァ' <= c <= 'ヶ' else c for c in s)


def is_grammar(entry):
    pos = set(entry['p'])
    return 'prt' in pos or (pos & GRAMMAR and not (pos - GRAMMAR - LOOSE))


def short(sense):
    return '; '.join(sense.split('; ')[:GLOSSES])


def load(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return json.load(f)


def segments(sentence):
    """A sentence as furigana segments, and where each token's segments start and end."""
    seg, spans = [], []
    for t in sentence['w']:
        spans.append((len(seg), len(seg) + len(t['s'])))
        seg.extend(t['s'])
    return seg, spans


def main():
    reading = load('reading/data/content.json')
    listening = load('listening/data/content.json')
    readings = {r['n']: r for r in reading['readings']}
    tracks = {t['n']: t for t in listening['items']}
    count = max(len(readings), len(tracks))

    words = {}  # key -> word, in the order they first come up
    sentences_out = {n: [] for n in range(1, count + 1)}
    kept = {}  # id(sentence) -> (index in its lesson, token spans)
    for n in range(1, count + 1):
        sources = []
        if n in tracks:
            t = tracks[n]
            sources.append(('listening', listening['entries'], [(l, {'src': 'listening', 'n': n, 'audio': t['audio'].split('/')[-1], 'clip': [l['a'], l['b']]}) for l in t['lines']]))
        if n in readings:
            r = readings[n]
            sources.append(('reading', reading['entries'], [(s, {'src': 'reading', 'n': n}) for p in r['p'] for s in p]))
        for src, entries, sentences in sources:
            for sentence, extra in sentences:
                for i, token in enumerate(sentence['w']):
                    if token['e'] < 0:
                        continue
                    e = entries[token['e']]
                    if is_grammar(e):
                        continue
                    key = f"{e['w']}|{hiragana(e['r'])}"
                    w = words.get(key)
                    if w is None:
                        w = words[key] = {'n': n, 'w': e['w'], 'r': e['r'], 'm': [short(m) for m in e['m'][:SENSES]], 'p': e['p'], 'ex': [], 'srcs': set()}
                    # One example from each source, from the word's own lesson.
                    # Sentences are kept once per lesson; a word points at one,
                    # with the segments to pick out: [sentence, start, end].
                    if w['n'] == n and src not in w['srcs']:
                        w['srcs'].add(src)
                        sid = id(sentence)
                        if sid not in kept:
                            seg, spans = segments(sentence)
                            kept[sid] = (len(sentences_out[n]), spans)
                            sentences_out[n].append({**extra, 'seg': seg})
                        index, spans = kept[sid]
                        w['ex'].append([index, *spans[i]])

    lessons = []
    for n in range(1, count + 1):
        r, t = readings.get(n), tracks.get(n)
        lessons.append({
            'n': n,
            'level': (r or t)['level'],
            'reading': r['title'] if r else None,
            'track': t['title'] if t else None,
            'sentences': sentences_out[n],
            'words': [{k: v for k, v in w.items() if k not in ('n', 'srcs')} for w in words.values() if w['n'] == n],
        })

    levels = [{'id': l['id'], 'title': l['title']} for l in reading['levels']]
    out = os.path.join(ROOT, 'vocab', 'data', 'content.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'levels': levels, 'lessons': lessons}, f, ensure_ascii=False, separators=(',', ':'))
    total = sum(len(l['words']) for l in lessons)
    print(f'{total} words in {len(lessons)} lessons, {os.path.getsize(out) // 1024} KB: {os.path.relpath(out, ROOT)}', file=sys.stderr)


if __name__ == '__main__':
    main()
