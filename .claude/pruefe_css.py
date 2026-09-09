# -*- coding: utf-8 -*-
"""Findet CSS-Klassen, die in keiner JS-Datei und nicht in index.html vorkommen.

Nach einem Umbau bleiben Regeln liegen, die niemand mehr trifft - im
schlimmsten Fall widersprechen sie spaeter neuen Regeln, und man sucht lange.
Weil alle Klassen hier ueber el(tag, {'class': ...}) gesetzt werden, laesst
sich das rein textlich pruefen.

Der Bericht ist eine Vorsortierung, keine Loeschliste: Klassen, die nur in
einer Medienabfrage oder als Nachbarschaftsselektor vorkommen, meldet das
Skript nicht - wohl aber solche, die zusammengesetzt gesetzt werden
(z.B. 'karte karte--' + art). Vor dem Loeschen also kurz nachsehen.

Aufruf:  python .claude/pruefe_css.py
"""
from __future__ import print_function

import glob
import io
import os
import re
import sys

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def quelltexte():
    text = []
    for muster in ('js/*.js', 'index.html'):
        for pfad in glob.glob(os.path.join(WURZEL, muster)):
            text.append(io.open(pfad, encoding='utf-8').read())
    return '\n'.join(text)


def klassen(css):
    # Nur Selektoren, keine Eigenschaften: alles vor der ersten '{' einer Regel.
    ohne_kommentare = re.sub(r'/\*.*?\*/', ' ', css, flags=re.S)
    gefunden = set()
    for block in re.findall(r'([^{}]+)\{', ohne_kommentare):
        for name in re.findall(r'\.([A-Za-z][A-Za-z0-9_-]*)', block):
            gefunden.add(name)
    return sorted(gefunden)


def main():
    css_pfad = os.path.join(WURZEL, 'css', 'style.css')
    css = io.open(css_pfad, encoding='utf-8').read()
    quelle = quelltexte()

    tot = []
    for name in klassen(css):
        if name in quelle:
            continue
        # Zusammengesetzt gesetzt? ('karte--' + art)
        stamm = name.split('--')[0]
        if '--' in name and ("'" + name.split('--')[0] + '--') in quelle:
            continue
        tot.append(name)

    print('%d Klassen in css/style.css, %d ohne Fundstelle im Quelltext.'
          % (len(klassen(css)), len(tot)))
    for name in tot:
        print('   .' + name)
    if tot:
        print('')
        print('Vor dem Loeschen pruefen: zusammengesetzte Klassennamen und '
              'Selektoren, die nur ueber Nachbarschaft greifen.')
    sys.exit(0)


if __name__ == '__main__':
    main()
