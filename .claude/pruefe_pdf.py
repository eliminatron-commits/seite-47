# -*- coding: utf-8 -*-
"""Prueft den Satz des PDF-Exports gegen die Muster aus .claude/baue_pdf.js.

Geprueft wird, was sich am fertigen Dokument messen laesst:

1. Kein zerrissener Block - die Unterfrage eines Duells und BEIDE Aussagen
   stehen auf derselben Seite. Das war der sichtbare Fehler: ein Satz unten,
   der Rest oben auf der naechsten Seite.
2. Keine verwaiste Ueberschrift als letzte Zeile einer Seite.
3. Keine fast leere Seite ausser der letzten.

Grundlage ist der Duellplan, den baue_pdf.js neben das PDF legt. Aus dem
Datensatz allein liesse er sich nicht herleiten: welche Paarungen vorkommen,
entscheidet sich erst beim Bauen des Plans, und nur diese stehen im PDF.

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


def plan(pfad_pdf):
    pfad = pfad_pdf[:-4] + '.plan.json'
    if not os.path.exists(pfad):
        raise SystemExit('Plan fehlt: %s - erst node .claude/baue_pdf.js laufen lassen.'
                         % os.path.basename(pfad))
    return json.load(io.open(pfad, encoding='utf-8'))


def eng(text):
    """Leerraum entfernen: PDF-Extraktion trennt an Bindestrichen und
    Zeilenumbruechen anders als der Datensatz."""
    return re.sub(r'\s+', '', text).lower()


def pruefe(pfad):
    wahl_id = os.path.basename(pfad).replace('muster-', '').replace('.pdf', '')
    p = plan(pfad)
    doc = pymupdf.open(pfad)
    seiten = [eng(s.get_text()) for s in doc]
    fehler = []

    def seiten_mit(text):
        n = eng(text)
        return [i + 1 for i, s in enumerate(seiten) if n in s]

    def seite_von(text):
        n = eng(text)
        for i, s in enumerate(seiten):
            if n in s:
                return i + 1
        return -1

    # Je Block pruefen, nicht je Text: eine Unterfrage kommt in mehreren
    # Duellen vor, also mehrfach im Dokument. Gesucht ist deshalb eine Seite,
    # auf der die Frage UND beide Aussagen zusammen stehen. Gibt es die, ist
    # der Block ganz geblieben - egal, auf welcher Seite dieselbe Frage sonst
    # noch auftaucht.
    for duell in p['duelle']:
        gesucht = [duell['frageText']] + [k[:70] for k in duell['aussagen']]
        eng_gesucht = [eng(t) for t in gesucht]
        zusammen = [i + 1 for i, seite in enumerate(seiten)
                    if all(t in seite for t in eng_gesucht)]
        if zusammen:
            continue
        # Nicht zusammen: sagen, was fehlt und was nur woanders steht.
        fehlend = [t for t in gesucht if seite_von(t) < 0]
        if fehlend:
            fehler.append('fehlt im Dokument: ' + fehlend[0][:50])
        else:
            fehler.append('Block zerrissen: "%s" - Frage auf %s, Aussagen auf %s'
                          % (duell['frageText'][:40],
                             seiten_mit(duell['frageText']),
                             [seiten_mit(k[:70]) for k in duell['aussagen']]))

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
                or letzter.startswith('Anhang:')
                or letzter.startswith('Das Finale')):
            fehler.append('Verwaiste Ueberschrift auf Seite %d: %s'
                          % (i + 1, letzter[:45]))

    for i, f in enumerate(fuellung[:-1]):
        if f < MINDESTFUELLUNG:
            fehler.append('Seite %d nur zu %d %% gefuellt' % (i + 1, f))

    print('%-14s %2d Seiten, %2d Duelle, Fuellung %s'
          % (wahl_id, doc.page_count, len(p['duelle']), fuellung))
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
