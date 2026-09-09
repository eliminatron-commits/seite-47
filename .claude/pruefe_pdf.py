# -*- coding: utf-8 -*-
"""Prueft den Satz des PDF-Exports gegen die Muster aus .claude/baue_pdf.js.

Geprueft wird, was sich am fertigen Dokument messen laesst:

1. Kein zerrissener Block - Fragetext und alle zugehoerigen Aussagen stehen
   auf derselben Seite. Das war der sichtbare Fehler: ein Satz unten, der
   Rest oben auf der naechsten Seite.
2. Keine verwaiste Ueberschrift als letzte Zeile einer Seite.
3. Keine fast leere Seite ausser der letzten.

Aufruf (die Muster muessen vorher gebaut sein):
    node .claude/baue_pdf.js <wahlId> .claude/muster-<wahlId>.pdf
    python .claude/pruefe_pdf.py
"""
from __future__ import print_function

import glob
import io
import json
import os
import re
import sys

import pymupdf

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
MINDESTFUELLUNG = 55          # Prozent, ausser auf der letzten Seite
KOPFZEILE = re.compile(
    r'^[^\n]{3,60}\s·\s(Kernthema|Wichtig|Am Rande|Wird nicht abgefragt)')


def datensatz(wahl_id):
    pfad = os.path.join(WURZEL, 'data', 'wahlen', wahl_id + '.js')
    roh = io.open(pfad, encoding='utf-8').read()
    anfang = roh.index('register(') + len('register(')
    ende = roh.rindex(')')
    return json.loads(roh[anfang:ende].strip().rstrip(';').strip())


def eng(text):
    """Leerraum entfernen: PDF-Extraktion trennt an Bindestrichen und
    Zeilenumbruechen anders als der Datensatz."""
    return re.sub(r'\s+', '', text).lower()


def pruefe(pfad):
    wahl_id = os.path.basename(pfad).replace('muster-', '').replace('.pdf', '')
    d = datensatz(wahl_id)
    doc = pymupdf.open(pfad)
    seiten = [eng(s.get_text()) for s in doc]
    fehler = []

    def seite_von(text):
        n = eng(text)
        for i, s in enumerate(seiten):
            if n in s:
                return i + 1
        return -1

    fragen = 0
    for thema in d['themen']:
        for frage in thema['fragen']:
            fragen += 1
            sf = seite_von(frage['text'])
            if sf < 0:
                fehler.append('Fragetext fehlt: ' + frage['text'][:50])
                continue
            for aussage in frage['aussagen']:
                sa = seite_von(aussage['kurz'][:70])
                if sa < 0:
                    fehler.append('Aussage fehlt: ' + aussage['kurz'][:40])
                elif sa != sf:
                    fehler.append('Block zerrissen: "%s" auf Seite %d, Aussage auf %d'
                                  % (frage['text'][:40], sf, sa))

    fuellung = []
    for i, seite in enumerate(doc):
        bloecke = [b for b in seite.get_text('blocks') if b[1] < 760]
        if not bloecke:
            fehler.append('Seite %d ist leer' % (i + 1))
            continue
        hoehe = seite.rect.height - 92
        fuellung.append(int(round((max(b[3] for b in bloecke) - 46) / hoehe * 100)))

        letzter = sorted(bloecke, key=lambda b: b[3])[-1][4].strip()
        if (KOPFZEILE.match(letzter) or letzter in ('Nach Themen', 'Quellen')
                or letzter.startswith('Anhang:')):
            fehler.append('Verwaiste Ueberschrift auf Seite %d: %s'
                          % (i + 1, letzter[:45]))

    for i, f in enumerate(fuellung[:-1]):
        if f < MINDESTFUELLUNG:
            fehler.append('Seite %d nur zu %d %% gefuellt' % (i + 1, f))

    print('%-14s %2d Seiten, %2d Fragen, Fuellung %s'
          % (wahl_id, doc.page_count, fragen, fuellung))
    for f in fehler:
        print('   FEHLER: ' + f)
    return len(fehler)


def main():
    muster = sorted(glob.glob(os.path.join(WURZEL, '.claude', 'muster-*.pdf')))
    if not muster:
        raise SystemExit('Keine Muster gefunden - erst node .claude/baue_pdf.js laufen lassen.')
    summe = sum(pruefe(p) for p in muster)
    print('')
    print('%d Muster geprueft, %d Fehler.' % (len(muster), summe))
    sys.exit(1 if summe else 0)


if __name__ == '__main__':
    main()
