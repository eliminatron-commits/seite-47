# -*- coding: utf-8 -*-
"""Sucht Saetze, die nicht zur Unterfrage ihrer Frage passen.

Hintergrund: die Aussagen entstanden, als ein Thema noch breit war. Seit
Schema 2 beantworten 3-4 Aussagen dieselbe Unterfrage - ein Satz, der davon
abweicht, ist doppelt schaedlich: er stoert den Vergleich, und weil er neben
den uebrigen Aussagen heraussticht, verraet er die Partei.

Das Werkzeug entscheidet nichts, es sortiert nur zur Durchsicht: je Satz wird
gemessen, wie viele inhaltstragende Woerter er mit der Frage und mit den
anderen Aussagen derselben Frage teilt. Saetze ohne jede Ueberschneidung
stehen oben.

Aufruf:  python .claude/pruefe_passung.py [grenze]
"""
import glob
import io
import json
import os
import re
import sys

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Funktionswoerter tragen keine Bedeutung und wuerden jede Ueberschneidung
# aufblaehen.
STOPP = set("""
der die das den dem des ein eine einer einem einen und oder aber auch noch nur
soll sollen sollte werden wird wurde ist sind sein war waren hat haben wir sie
er es man in im am an auf aus bei bis durch fuer für gegen mit nach ohne seit
von vor zu zur zum als wie dass wenn weil damit statt sowie zudem dabei dazu
mehr weniger nicht kein keine ihre ihrer ihren sich sowie sollen soll um
gilt gelten aus sicht partei prozent euro werden
""".split())


def woerter(text):
    roh = re.findall(r"[A-Za-zÄÖÜäöüß]{4,}", text.lower())
    return set(w for w in roh if w not in STOPP)


def saetze(text):
    teile = re.split(r"(?<=[.!?])\s+", text.strip())
    return [t for t in teile if t]


# Anhaengsel-Marker: Saetze, die mit diesen Woertern beginnen, tragen etwas
# Zusaetzliches nach. Genau dort steckt der Fehler aus Phase 2 - die Aussagen
# fassten damals ein breites Thema zusammen, nicht eine Unterfrage.
ANHANG = re.compile(r"^(Zudem|Zusätzlich|Hinzu kommen|Hinzu kommt|Auch |Ergänzend"
                    r"|Daneben|Außerdem|Ferner|Weiterhin|Darüber hinaus)")


def pruefe(grenze=0):
    treffer = []
    gesamt = 0
    for datei in sorted(glob.glob(os.path.join(BASIS, "data", "wahlen", "*.js"))):
        roh = io.open(datei, encoding="utf-8").read()
        d = json.loads(roh[roh.index("register(") + len("register("):roh.rindex(")")])
        for thema in d["themen"]:
            for frage in thema["fragen"]:
                frage_woerter = woerter(frage["text"] + " " + thema["titel"])
                je_aussage = dict((a["id"], woerter(a["kurz"])) for a in frage["aussagen"])
                for a in frage["aussagen"]:
                    andere = set()
                    for b in frage["aussagen"]:
                        if b["id"] != a["id"]:
                            andere |= je_aussage[b["id"]]
                    for satz in saetze(a["kurz"]):
                        gesamt += 1
                        w = woerter(satz)
                        if not w or not ANHANG.match(satz):
                            continue
                        punkte = len(w & frage_woerter) + len(w & andere)
                        if punkte <= grenze:
                            treffer.append((punkte, d["id"], thema["id"], frage["id"],
                                            a["parteiId"], frage["text"], satz))
    treffer.sort()
    for punkte, wahl, thema, frage, partei, fragetext, satz in treffer:
        print("\n[%d] %s / %s / %s / %s" % (punkte, wahl, thema, frage, partei))
        print("    Frage: %s" % fragetext)
        print("    Satz : %s" % satz)
    print("\n%d Saetze geprueft, %d angehaengte Saetze ohne Bezug zur Frage."
          % (gesamt, len(treffer)))
    return len(treffer)


if __name__ == "__main__":
    pruefe(int(sys.argv[1]) if len(sys.argv) > 1 else 0)
