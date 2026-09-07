# -*- coding: utf-8 -*-
"""Erzeugt data/wahlen/<id>.js aus einem Quellmodul (siehe .claude/quellen/).

Aufruf:  python .claude/baue_datensatz.py <modulname>
Die Aussage-IDs werden bewusst durchmischt vergeben, damit sich aus ihnen
kein Rueckschluss auf die Partei ziehen laesst (sie stehen spaeter im DOM).
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

    # Aussage-IDs vorab mischen: die Nummer verraet weder Partei noch Reihenfolge.
    anzahl = sum(len(a) for _, _, _, a in m.THEMEN)
    nummern = list(range(1, anzahl + 1))
    random.Random(wahl["id"]).shuffle(nummern)
    naechste = iter(nummern)

    themen = []
    for themaId, titel, beschreibung, aussagen in m.THEMEN:
        eintraege = []
        for parteiId, seite, kurz, original, markierung in aussagen:
            eintraege.append({
                "id": "%s-a%03d" % (kuerzel, next(naechste)),
                "parteiId": parteiId,
                "kurz": kurz,
                "original": original,
                "quelle": {
                    "datei": "data/programme/%s/%s.pdf" % (kuerzel, parteiId),
                    "seite": seite,
                    "markierung": markierung,
                },
            })
        themen.append({
            "id": themaId,
            "titel": titel,
            "beschreibung": beschreibung,
            "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
            "aussagen": eintraege,
        })

    datensatz = {
        "schemaVersion": 1,
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

    ziel = os.path.join(BASIS, "data", "wahlen", wahl["id"] + ".js")
    kopf = ("/* Seite 47 – Datensatz: %s (%s).\n"
            " * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/%s/.\n"
            " * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das\n"
            " * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).\n"
            " */\n" % (wahl["name"], wahl["wahltag"], kuerzel))
    io.open(ziel, "w", encoding="utf-8").write(
        kopf + "window.S47_DATA.register(\n"
        + json.dumps(datensatz, ensure_ascii=False, indent=2) + "\n);\n")

    print("%s: %d Themen, %d Aussagen -> %s"
          % (wahl["id"], len(themen), anzahl, os.path.relpath(ziel, BASIS)))
    return ziel


if __name__ == "__main__":
    for name in sys.argv[1:]:
        baue(name)
