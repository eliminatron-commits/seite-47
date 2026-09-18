# -*- coding: utf-8 -*-
"""Kurzfassungen kuerzen: ausgeben, zurueckschreiben, messen.

Die vereinfachten Fassungen waren im Schnitt 220 Zeichen lang (2-3 Saetze).
Ein Testnutzer brauchte damit rund 30 Sekunden je Duell - zwei Absaetze
nebeneinander sind schlicht viel Text. Ziel sind 120-150 Zeichen.

Das Werkzeug fasst die Aussagen NICHT selbst zusammen (das bleibt
redaktionelle Arbeit), es haelt nur die Buchfuehrung:

  python .claude/kuerze.py zeige st [thema]   nummeriert ausgeben
  python .claude/kuerze.py setze st neu.json  zurueckschreiben
  python .claude/kuerze.py miss  st           Laengen je Frage messen

neu.json ist {"laufende Nummer": "neue Fassung", ...}. Die Nummern stammen
aus "zeige" und zaehlen die Aussagen der Datei der Reihe nach.

Gemessen wird, was CLAUDE.md fordert: innerhalb EINER Frage muessen alle
Fassungen gleich lang sein (Abweichung hoechstens 15 %), sonst ist die
abweichende identifizierbar, auch ohne Parteinamen.
"""
import io
import json
import os
import re
import sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Eine Aussage ist ein Tupel ('partei', seite, 'kurz', 'original', 'markierung').
# Gesucht wird die dritte Zeichenkette - sie steht immer allein auf ihrer Zeile.
AUSSAGE = re.compile(
    r"^(\s*)\('(?P<partei>[a-z]+)',\s*(?P<seite>\d+),\s*\n"
    r"(?P<vor>\s*)'(?P<kurz>(?:[^'\\]|\\.)*)',\s*\n",
    re.M)


def quelle(kz):
    return os.path.join(WURZEL, '.claude', 'quellen', kz + '.py')


def lies(kz):
    return io.open(quelle(kz), encoding='utf-8').read()


def treffer(text):
    return list(AUSSAGE.finditer(text))


def fragen(text):
    """Ordnet jede Aussage ihrer Frage zu: [(Fragetext, [(nr, partei, kurz)])]."""
    # Auch die nachgereichten Fragen in DRITTE/VIERTE: "'thema': ('Frage?', ["
    fragezeile = re.compile(r"^\s*(?:'[a-z]+':\s*)?\('(?P<frage>[^']+\?)',\s*\[", re.M)
    marken = [(m.start(), m.group('frage')) for m in fragezeile.finditer(text)]
    raus = []
    for i, m in enumerate(treffer(text)):
        pos = m.start()
        frage = ''
        for start, f in marken:
            if start < pos:
                frage = f
            else:
                break
        if not raus or raus[-1][0] != frage:
            raus.append((frage, []))
        raus[-1][1].append((i, m.group('partei'), m.group('kurz')))
    return raus


def entschluessle(s):
    return s.replace("\\'", "'").replace('\\\\', '\\')


def zeige(kz, filter_thema=None):
    text = lies(kz)
    for frage, aussagen in fragen(text):
        if filter_thema and filter_thema.lower() not in frage.lower():
            continue
        print('')
        print('FRAGE: ' + frage)
        for nr, partei, kurz in aussagen:
            k = entschluessle(kurz)
            print('  [%d] %s (%d Z.): %s' % (nr, partei, len(k), k))


def miss(kz, still=False):
    text = lies(kz)
    laengen = []
    schief = []
    for frage, aussagen in fragen(text):
        werte = [len(entschluessle(k)) for _, _, k in aussagen]
        laengen.extend(werte)
        spanne = (max(werte) - min(werte)) / float(max(werte))
        if spanne > 0.15:
            schief.append((frage, werte, round(spanne * 100)))
    if not still:
        print('%d Aussagen, Laenge im Mittel %d, Spanne %d bis %d'
              % (len(laengen), sum(laengen) / len(laengen), min(laengen), max(laengen)))
        print('%d Fragen mit mehr als 15 %% Laengenunterschied:' % len(schief))
        for frage, werte, spanne in schief:
            print('  %3d %%  %s  %s' % (spanne, werte, frage[:70]))
    return laengen, schief


def setze(kz, jsonpfad):
    text = lies(kz)
    neu = json.load(io.open(jsonpfad, encoding='utf-8'))
    ms = treffer(text)
    stellen = []
    for schluessel, fassung in neu.items():
        i = int(schluessel)
        if i >= len(ms):
            raise SystemExit('Nummer %d gibt es nicht (%d Aussagen)' % (i, len(ms)))
        if "'" in fassung and "\\'" not in fassung:
            fassung = fassung.replace("'", "\\'")
        m = ms[i]
        anfang = m.start('kurz')
        ende = m.end('kurz')
        stellen.append((anfang, ende, fassung))
    for anfang, ende, fassung in sorted(stellen, reverse=True):
        text = text[:anfang] + fassung + text[ende:]
    io.open(quelle(kz), 'w', encoding='utf-8', newline='').write(text)
    print('%d Fassungen ersetzt in %s' % (len(stellen), quelle(kz)))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    befehl, kz = sys.argv[1], sys.argv[2]
    if befehl == 'zeige':
        zeige(kz, sys.argv[3] if len(sys.argv) > 3 else None)
    elif befehl == 'setze':
        setze(kz, sys.argv[3])
    elif befehl == 'miss':
        miss(kz)
    else:
        raise SystemExit(__doc__)
