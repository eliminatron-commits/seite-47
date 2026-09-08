# -*- coding: utf-8 -*-
"""Ueberfuehrt einen Wahl-Datensatz von Schema 1 nach Schema 2.

Schema 1: je Thema eine Aussage pro Partei, bewertet mit Zustimmung/Neutral/
Ablehnung.  Schema 2: je Thema mehrere Fragen mit 3-4 Aussagen verschiedener
Parteien, aus denen die beste und die schlechteste gewaehlt werden.

Was dieses Werkzeug leistet und was nicht:

  * Es GRUPPIERT die vorhandenen Aussagen ausgewogen zu Fragen: bei sieben
    Parteien und einer Aussage je Partei und Thema ergibt das zwei Fragen
    (4 + 3), in denen jede Partei genau einmal vorkommt.  Ueber die Themen
    hinweg rotieren die Paarungen, damit nicht immer dieselben Parteien
    nebeneinander stehen.
  * Es SCHREIBT KEINE Fragetexte.  Der Fragetext uebernimmt das bisherige
    Themenfeld 'frage' als Platzhalter, und jede erzeugte Frage traegt
    "vorlaeufig": true.  Ob die drei bis vier Aussagen tatsaechlich dieselbe
    Unterfrage beantworten, kann nur redaktionell entschieden werden - genau
    das ist die Arbeit der naechsten Phase.

Aufruf:  python .claude/migriere_v2.py <id> [<id> ...] [--ziel VERZEICHNIS]
Ohne --ziel wird data/wahlen/<id>.js ueberschrieben.
"""
import io
import itertools
import json
import os
import re
import sys

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def lade(pfad):
    """Liest die JSON-Nutzlast aus dem register(...)-Wrapper."""
    text = io.open(pfad, encoding="utf-8").read()
    anfang = text.index("register(") + len("register(")
    ende = text.rindex(")")
    return json.loads(text[anfang:ende])


def teile(n):
    """Blockgroessen fuer n Aussagen: nur 3er und 4er, moeglichst wenige Bloecke.
    Gibt None zurueck, wenn n nicht als Summe aus 3 und 4 darstellbar ist
    (n = 1, 2, 5) - dann muss redaktionell nachgebessert werden."""
    for vierer in range(n // 4, -1, -1):
        rest = n - 4 * vierer
        if rest % 3 == 0:
            return [4] * vierer + [3] * (rest // 3)
    return None


def paarzahlen(plan, groessen, n):
    """Wie oft stehen zwei Parteien zusammen in einer Frage?"""
    zaehler = {}
    for a in range(n):
        for b in range(a + 1, n):
            zaehler[(a, b)] = 0
    for ordnung in plan:
        pos = 0
        for g in groessen:
            block = sorted(ordnung[pos:pos + g])
            pos += g
            for i, a in enumerate(block):
                for b in block[i + 1:]:
                    zaehler[(a, b)] += 1
    werte = list(zaehler.values())
    return max(werte) - min(werte), max(werte)


def rotation(n, themen, groessen, saat):
    """Sucht je Thema eine Reihenfolge der Parteien, sodass ueber alle Themen
    hinweg jedes Parteienpaar ungefaehr gleich oft zusammen in einer Frage
    steht.

    Warum ueberhaupt: eine Frage zeigt nur 3-4 der Parteien. Wer staendig
    neben derselben Partei steht, wird an ihr gemessen statt am ganzen Feld -
    die Gruppierung wuerde das Ergebnis mitbestimmen. Blosses Durchrotieren
    reicht nicht: es erzeugte Paare, die achtmal zusammen auftraten, waehrend
    andere sich nie begegneten.

    Deterministisch ueber die Saat (die Wahl-id), damit derselbe Datensatz
    immer dieselbe Aufteilung ergibt.
    """
    import random as _r
    zufall = _r.Random(saat)
    permutationen = list(itertools.permutations(range(n)))

    bester = None
    for _ in range(30):
        plan = [list(zufall.choice(permutationen)) for _ in range(themen)]
        for _runde in range(5):
            for i in range(themen):
                gewaehlt, wert = plan[i], paarzahlen(plan, groessen, n)
                for kandidat in zufall.sample(permutationen, min(50, len(permutationen))):
                    plan[i] = list(kandidat)
                    neu_wert = paarzahlen(plan, groessen, n)
                    if neu_wert < wert:
                        wert, gewaehlt = neu_wert, list(kandidat)
                plan[i] = list(gewaehlt)
        wert = paarzahlen(plan, groessen, n)
        if bester is None or wert < bester[0]:
            bester = (wert, [list(o) for o in plan])
        if bester[0][0] <= 1:
            break
    return bester[1], bester[0]


def migriere(datensatz):
    themen = datensatz["themen"]
    warnungen = []
    kuerzel = "xx"
    for thema in themen:
        if thema.get("aussagen"):
            treffer = re.match(r"^([a-z]{2})-a", thema["aussagen"][0]["id"])
            if treffer:
                kuerzel = treffer.group(1)
            break

    # Die Rotation braucht eine einheitliche Blockaufteilung. Sie wird an der
    # haeufigsten Aussagenzahl je Thema bestimmt; Themen, die davon abweichen,
    # bekommen ihre eigene Aufteilung ohne Rotationsoptimierung.
    haeufig = {}
    for thema in themen:
        n = len(thema.get("aussagen") or [])
        haeufig[n] = haeufig.get(n, 0) + 1
    regelfall = max(haeufig, key=lambda k: (haeufig[k], k))
    groessen = teile(regelfall)

    plan, guete = None, None
    if groessen:
        gleiche = [t for t in themen if len(t["aussagen"]) == regelfall]
        plan, guete = rotation(regelfall, len(gleiche), groessen, datensatz["id"])
    naechster_plan = iter(plan or [])

    fragen_nr = 0
    for thema in themen:
        aussagen = thema.pop("aussagen")
        platzhalter_frage = thema.pop("frage", None) or (
            "Welcher Aussage zu diesem Thema stimmen Sie am ehesten zu?")
        n = len(aussagen)

        eigene = teile(n)
        if eigene is None:
            warnungen.append(
                "%s: %d Aussagen lassen sich nicht in Bloecke aus 3 und 4 teilen. "
                "Thema uebersprungen - eine Aussage ergaenzen oder streichen."
                % (thema["id"], n))
            thema["fragen"] = []
            continue

        if n == regelfall and plan:
            ordnung = next(naechster_plan)
            aufteilung = groessen
        else:
            ordnung = list(range(n))
            aufteilung = eigene
            warnungen.append(
                "%s: %d statt %d Aussagen - ohne Rotationsausgleich gruppiert."
                % (thema["id"], n, regelfall))

        thema["fragen"] = []
        pos = 0
        for g in aufteilung:
            fragen_nr += 1
            thema["fragen"].append({
                "id": "%s-f%03d" % (kuerzel, fragen_nr),
                "text": platzhalter_frage,
                "vorlaeufig": True,
                "aussagen": [aussagen[k] for k in ordnung[pos:pos + g]],
            })
            pos += g

    datensatz["schemaVersion"] = 2
    return datensatz, warnungen, guete


def pruefe_ausgewogenheit(datensatz):
    """Dieselbe Regel wie S47_DATA.pruefe: je Thema hoechstens 1 Auftritt
    Unterschied zwischen den Parteien."""
    fehler = []
    for thema in datensatz["themen"]:
        auftritte = {}
        for frage in thema["fragen"]:
            for aussage in frage["aussagen"]:
                auftritte[aussage["parteiId"]] = auftritte.get(aussage["parteiId"], 0) + 1
        if auftritte and max(auftritte.values()) - min(auftritte.values()) > 1:
            fehler.append("%s: unausgewogen %s" % (thema["id"], auftritte))
    return fehler


def schreibe(datensatz, pfad):
    kopf = ("/* Seite 47 – Datensatz: %s (%s).\n"
            " * Schema 2: Themen enthalten Fragen mit 3–4 Aussagen.\n"
            " * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das\n"
            " * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).\n"
            " */\n" % (datensatz["name"], datensatz["wahltag"]))
    io.open(pfad, "w", encoding="utf-8").write(
        kopf + "window.S47_DATA.register(\n"
        + json.dumps(datensatz, ensure_ascii=False, indent=2) + "\n);\n")


def main(argv):
    ziel = None
    if "--ziel" in argv:
        k = argv.index("--ziel")
        ziel = argv[k + 1]
        argv = argv[:k] + argv[k + 2:]

    for wahl_id in argv:
        quelle = os.path.join(BASIS, "data", "wahlen", wahl_id + ".js")
        datensatz = lade(quelle)
        if datensatz.get("schemaVersion") == 2:
            print("%s: liegt bereits als Schema 2 vor - uebersprungen." % wahl_id)
            continue

        datensatz, warnungen, guete = migriere(datensatz)
        for w in warnungen:
            print("  WARNUNG %s" % w)
        for w in pruefe_ausgewogenheit(datensatz):
            print("  WARNUNG %s" % w)

        pfad = os.path.join(ziel, wahl_id + ".js") if ziel else quelle
        if ziel and not os.path.isdir(ziel):
            os.makedirs(ziel)
        schreibe(datensatz, pfad)

        if guete:
            print("  Paarungen je Parteienpaar: Spanne %d, hoechstens %d gemeinsame Fragen."
                  % guete)
        fragen = sum(len(t["fragen"]) for t in datensatz["themen"])
        aussagen = sum(len(f["aussagen"]) for t in datensatz["themen"] for f in t["fragen"])
        print("%s: %d Themen, %d Fragen, %d Aussagen -> %s"
              % (wahl_id, len(datensatz["themen"]), fragen, aussagen,
                 os.path.relpath(pfad, BASIS)))


if __name__ == "__main__":
    main(sys.argv[1:])
