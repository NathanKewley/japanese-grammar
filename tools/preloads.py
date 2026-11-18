#!/usr/bin/env python3
"""Keeps each page's preload list in step with its code.

Browsers find an ES module's imports only after downloading it, so an app
would load its code in rounds: app.js, then screens.js, then ui.js... Listing
every module up front with <link rel="modulepreload"> fetches them all at once,
and preloading the app's content files starts them alongside the code instead
of after it.

    python3 tools/preloads.py          # rewrite the lists
    python3 tools/preloads.py --check  # exit 1 if any page is out of date (the tests run this)

The list sits between two marker comments in each page's <head>.
"""
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Content each page fetches as soon as it starts, relative to the page.
DATA = {
    'vocab': ['data/content.json'],
    'writing': ['data/content.json'],
    'conjugation': ['data/content.json', 'data/examples.json'],
    'reading': ['data/content.json'],
    'listening': ['data/content.json'],
    'placement': ['../vocab/data/content.json', '../writing/data/content.json'],
}

START = '<!-- Preloads: written by tools/preloads.py, so edit that instead. -->'
END = '<!-- End of preloads. -->'
IMPORT = re.compile(r"""(?:^|[;\n])\s*(?:import|export)\s(?:[^'";]*?\sfrom\s*)?['"](\.{1,2}/[^'"]+)['"]""")
ENTRY = re.compile(r'<script type="module" src="([^"]+)"></script>')


def module_graph(entry):
    """Every module [entry] imports, directly or not, in the order found."""
    seen = []
    stack = [entry]
    while stack:
        path = stack.pop(0)
        if path in seen:
            continue
        seen.append(path)
        with open(path, encoding='utf-8') as f:
            src = f.read()
        for rel in IMPORT.findall(src):
            stack.append(os.path.normpath(os.path.join(os.path.dirname(path), rel)))
    return seen


def preload_block(page):
    folder = os.path.dirname(page)
    with open(page, encoding='utf-8') as f:
        html = f.read()
    lines = []
    for src in ENTRY.findall(html):
        for mod in module_graph(os.path.normpath(os.path.join(folder, src))):
            lines.append(f'<link rel="modulepreload" href="{os.path.relpath(mod, folder)}">')
    for data in DATA.get(os.path.basename(folder) if folder != ROOT else '', []):
        lines.append(f'<link rel="preload" href="{data}" as="fetch" crossorigin>')
    return '\n'.join([START, *dict.fromkeys(lines), END])


def pages():
    out = [os.path.join(ROOT, 'index.html')]
    for name in sorted(os.listdir(ROOT)):
        page = os.path.join(ROOT, name, 'index.html')
        if os.path.isfile(page):
            out.append(page)
    return out


def updated(page):
    """The page with its preload list rewritten, or None if it has no modules."""
    with open(page, encoding='utf-8') as f:
        html = f.read()
    if not ENTRY.search(html):
        return None
    block = preload_block(page)
    if START in html:
        return re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, html, flags=re.S)
    # First run: just before the end of <head>.
    return html.replace('</head>', block + '\n</head>', 1)


def main():
    check = '--check' in sys.argv
    stale = []
    for page in pages():
        new = updated(page)
        if new is None:
            continue
        with open(page, encoding='utf-8') as f:
            old = f.read()
        if new != old:
            stale.append(os.path.relpath(page, ROOT))
            if not check:
                with open(page, 'w', encoding='utf-8') as f:
                    f.write(new)
    if check and stale:
        print('Preload lists out of date (run python3 tools/preloads.py): ' + ', '.join(stale))
        sys.exit(1)
    if not check:
        print('Updated: ' + (', '.join(stale) or 'nothing'))


if __name__ == '__main__':
    main()
