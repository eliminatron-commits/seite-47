# -*- coding: utf-8 -*-
"""Erzeugt data/wahlen/<id>.js aus einem Quellmodul (siehe .claude/quellen/).

Aufruf:  python .claude/baue_datensatz.py <modulname>
Die Aussage- und Frage-IDs werden bewusst durchmischt vergeben, damit sich aus
ihnen kein Rueckschluss auf die Partei ziehen laesst (sie stehen im DOM).
Schema 2: jedes Thema besteht aus Fragen mit 3-4 Aussagen verschiedener
Parteien; die Ausgewogenheit je Thema wird beim Bauen erzwungen.
"""
import io, json, os, random, sys, importlib.util

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pdftool  # noqa: E402

BASIS = pdftool.BASIS

# id, Anzeigename, Farbe, Aliasse.
# Die Aliasse werden vor der Aufdeckung in Aussagetexten maskiert, weil
# Originalzitate die eigene Partei benennen ("Wir Freie Demokraten ...").
PARTEIEN = [
    ("cdu",    "CDU",       "#0B0B0B",
     ["Christlich Demokratische Union", "Christdemokraten", "CDU-geführten"]),
    ("spd",    "SPD",       "#E3000F",
     ["Sozialdemokratische Partei", "Sozialdemokraten"]),
    ("gruene", "Grüne",     "#1FA12E",
     ["Grünen", "Bündnis 90/Die Grünen", "Bündnis 90", "BÜNDNIS 90"]),
    ("fdp",    "FDP",       "#E8B900",
     ["Freie Demokraten", "Freien Demokraten", "Freie Demokratische Partei"]),
    ("afd",    "AfD",       "#009EE0",
     ["Alternative für Deutschland"]),
    ("linke",  "Die Linke", "#BE3075",
     ["Linke", "Linken", "DIE LINKE"]),
    ("bsw",    "BSW",       "#7D254F",
     ["Bündnis Sahra Wagenknecht", "Wagenknecht"]),
]


def lade_modul(name):
    pfad = os.path.join(BASIS, ".claude", "quellen", name + ".py")
    spec = importlib.util.spec_from_file_location(name, pfad)
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul


def baue(name):
    m = lade_modul(name)
    wahl, kuerzel = m.WAHL, m.WAHL["kuerzel"]

    # Aussage- und Frage-IDs vorab mischen: die Nummer verraet weder Partei
    # noch Reihenfolge (beide stehen im DOM).
    anzahl = sum(len(a) for _, _, _, fragen in m.THEMEN for _, a in fragen)
    anzahl_fragen = sum(len(fragen) for _, _, _, fragen in m.THEMEN)
    nummern = list(range(1, anzahl + 1))
    fragen_nummern = list(range(1, anzahl_fragen + 1))
    random.Random(wahl["id"]).shuffle(nummern)
    random.Random(wahl["id"] + "-f").shuffle(fragen_nummern)
    naechste = iter(nummern)
    naechste_frage = iter(fragen_nummern)

    themen = []
    for themaId, titel, beschreibung, fragen in m.THEMEN:
        eintraege = []
        for fragetext, aussagen in fragen:
            if not 3 <= len(aussagen) <= 4:
                raise SystemExit("%s: Frage mit %d Aussagen – erlaubt sind 3 bis 4."
                                 % (themaId, len(aussagen)))
            eintraege.append({
                "id": "%s-f%03d" % (kuerzel, next(naechste_frage)),
                "text": fragetext,
                "aussagen": [{
                    "id": "%s-a%03d" % (kuerzel, next(naechste)),
                    "parteiId": parteiId,
                    "kurz": kurz,
                    "original": original,
                    "quelle": {
                        "datei": "data/programme/%s/%s.pdf" % (kuerzel, parteiId),
                        "seite": seite,
                        "markierung": markierung,
                    },
                } for parteiId, seite, kurz, original, markierung in aussagen],
            })
        themen.append({
            "id": themaId,
            "titel": titel,
            "beschreibung": beschreibung,
            "fragen": eintraege,
        })

    datensatz = {
        "schemaVersion": 2,
        "id": wahl["id"],
        "name": wahl["name"],
        "region": wahl["region"],
        "wahltag": wahl["wahltag"],
        "stand": wahl.get("stand", "2026-09-07"),
        "parteien": [{
            "id": pid,
            "name": pname,
            "farbe": farbe,
            "alias": alias,
            "logo": None,
            "programm": {
                "titel": m.PROGRAMME[pid][0],
                "datei": "data/programme/%s/%s.pdf" % (kuerzel, pid),
                "url": m.PROGRAMME[pid][1],
            },
        } for pid, pname, farbe, alias in PARTEIEN if pid in m.PROGRAMME],
        "themen": themen,
    }

    # Ausgewogenheit je Thema: gleich viele Auftritte (Abweichung hoechstens 1).
    # Dieselbe Regel prueft S47_DATA.pruefe im Browser.
    for t in themen:
        auftritte = {}
        for fr in t["fragen"]:
            for a in fr["aussagen"]:
                auftritte[a["parteiId"]] = auftritte.get(a["parteiId"], 0) + 1
        if auftritte and max(auftritte.values()) - min(auftritte.values()) > 1:
            raise SystemExit("%s/%s: unausgewogen %s" % (wahl["id"], t["id"], auftritte))

    # Paarungen sichtbar machen. Anders als die Auftrittszahl laesst sich das
    # nicht erzwingen: welche Parteien zusammen in einer Frage stehen, ergibt
    # sich daraus, wer dieselbe Unterfrage beantwortet - Vergleichbarkeit geht
    # vor Statistik. Die Spanne gehoert aber in den Blick, weil eine Partei
    # sonst dauerhaft an derselben Gegenposition gemessen wird.
    paare = {}
    for t in themen:
        for fr in t["fragen"]:
            ids = sorted(a["parteiId"] for a in fr["aussagen"])
            for i, x in enumerate(ids):
                for y in ids[i + 1:]:
                    paare[(x, y)] = paare.get((x, y), 0) + 1
    if paare:
        werte = sorted(paare.values())
        haeufigste = max(paare, key=lambda k: paare[k])
        print("  Paarungen je Parteienpaar: %d bis %d (haeufigste: %s, %dx)"
              % (werte[0], werte[-1], " + ".join(haeufigste), paare[haeufigste]))

    ziel = os.path.join(BASIS, "data", "wahlen", wahl["id"] + ".js")
    kopf = ("/* Seite 47 – Datensatz: %s (%s).\n"
            " * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/%s/.\n"
            " * Schema 2: Themen enthalten Fragen mit 3–4 Aussagen verschiedener\n"
            " * Parteien; gewaehlt werden die beste und die schlechteste.\n"
            " * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das\n"
            " * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).\n"
            " */\n" % (wahl["name"], wahl["wahltag"], kuerzel))
    io.open(ziel, "w", encoding="utf-8").write(
        kopf + "window.S47_DATA.register(\n"
        + json.dumps(datensatz, ensure_ascii=False, indent=2) + "\n);\n")

    print("%s: %d Themen, %d Fragen, %d Aussagen -> %s"
          % (wahl["id"], len(themen), anzahl_fragen, anzahl,
             os.path.relpath(ziel, BASIS)))
    return ziel


if __name__ == "__main__":
    for name in sys.argv[1:]:
        baue(name)
