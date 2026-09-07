# -*- coding: utf-8 -*-
"""Hilfswerkzeug für Phase 2: Volltextsuche in den Wahlprogramm-PDFs.

Nutzung:
  python .claude/pdftool.py suche <region> <partei|alle> "<begriff>" [treffer]
  python .claude/pdftool.py seite <region> <partei> <seite>
  python .claude/pdftool.py pruefe            # verifiziert alle Quellenangaben
"""
import sys, os, re, glob, json

import pymupdf

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Ligaturen und Sonderzeichen, die einzelne PDFs falsch kodieren.
ERSATZ = [
    ("ﬀ", "ff"), ("ﬁ", "fi"), ("ﬂ", "fl"),
    ("ﬃ", "ffi"), ("ﬄ", "ffl"),
    # BSW MV kodiert einige Ligaturen als eigenstaendige Buchstaben:
    ("Ō", "ft"),   # "VernunOe"      -> "Vernunft"
    ("Ɵ", "ti"),   # "GerechTgkeit" -> "Gerechtigkeit"
    ("Ʃ", "tt"),   # "staS"         -> "statt"
    ("‐", "-"), ("‑", "-"), ("‒", "-"), ("−", "-"),
    ("­", ""),
    (" ", " "), (" ", " "), (" ", " "), (" ", " "),
    (" ", " "), (" ", " "),
    ("", " "), ("", " "), ("●", " "), ("▶", " "),
    ("○", " "),
]


def normalisiere(text):
    for a, b in ERSATZ:
        text = text.replace(a, b)
    text = text.replace("-\n", "")       # Silbentrennung am Zeilenende
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def pfad(region, partei):
    return os.path.join(BASIS, "data", "programme", region, partei + ".pdf")


def seiten(region, partei):
    """[(seitennummer_1basiert, normalisierter_text)]"""
    d = pymupdf.open(pfad(region, partei))
    return [(i + 1, normalisiere(p.get_text())) for i, p in enumerate(d)]


def parteien(region):
    ordner = os.path.join(BASIS, "data", "programme", region)
    return sorted(os.path.splitext(os.path.basename(f))[0]
                  for f in glob.glob(os.path.join(ordner, "*.pdf")))


def suche(region, partei, begriff, maxtreffer=6, umfeld=320):
    """Volltextsuche. Inhaltsverzeichnis-Seiten werden uebersprungen:
    Punktfuehrungslinien ("......") verraten sie zuverlaessig."""
    muster = re.compile(begriff, re.IGNORECASE)
    treffer = []
    for nr, text in seiten(region, partei):
        if text.count("....") > 3:
            continue
        for m in muster.finditer(text):
            a = max(0, m.start() - umfeld // 2)
            treffer.append((nr, text[a:a + umfeld]))
            if len(treffer) >= maxtreffer:
                return treffer
    return treffer



def gliederung(region, partei, mindestgroesse=None):
    """Ueberschriften mit Seitenzahl: Zeilen, deren Schriftgrad deutlich
    ueber dem Fliesstext des Dokuments liegt."""
    d = pymupdf.open(pfad(region, partei))
    zeilen = []
    groessen = {}
    for i, seite in enumerate(d):
        for block in seite.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                text = normalisiere("".join(s["text"] for s in line["spans"]))
                if not text or len(text) > 90 or text.count("....") > 0:
                    continue
                groesse = round(max(s["size"] for s in line["spans"]), 1)
                groessen[groesse] = groessen.get(groesse, 0) + len(text)
                zeilen.append((i + 1, groesse, text))
    if mindestgroesse is None:
        # Der Schriftgrad mit den meisten Zeichen ist der Fliesstext.
        flies = max(groessen.items(), key=lambda kv: kv[1])[0]
        mindestgroesse = flies * 1.25
    letzte = None
    for nr, groesse, text in zeilen:
        if groesse >= mindestgroesse and text != letzte:
            print("S%-4d %4.1f  %s" % (nr, groesse, text))
            letzte = text


def _cli():
    befehl = sys.argv[1]
    if befehl == "suche":
        region, partei, begriff = sys.argv[2], sys.argv[3], sys.argv[4]
        maxt = int(sys.argv[5]) if len(sys.argv) > 5 else 3
        liste = parteien(region) if partei == "alle" else [partei]
        for p in liste:
            print("\n### %s/%s" % (region, p))
            tr = suche(region, p, begriff, maxt)
            if not tr:
                print("  (kein Treffer)")
            for nr, txt in tr:
                print("  S%-4d %s" % (nr, txt.replace("\n", " ")))
    elif befehl == "gliederung":
        gliederung(sys.argv[2], sys.argv[3],
                   float(sys.argv[4]) if len(sys.argv) > 4 else None)
    elif befehl == "seite":
        region, partei, nr = sys.argv[2], sys.argv[3], int(sys.argv[4])
        for n, t in seiten(region, partei):
            if n == nr:
                print(t)
    elif befehl == "pruefe":
        _pruefe()


def _pruefe():
    """Jede Quellenangabe in data/wahlen/*.js gegen das PDF prüfen."""
    gesamt = fehler = 0
    cache = {}
    for datei in sorted(glob.glob(os.path.join(BASIS, "data", "wahlen", "*.js"))):
        roh = open(datei, encoding="utf-8").read()
        nutzlast = roh[roh.index("register(") + len("register("):roh.rindex(")")]
        d = json.loads(nutzlast)
        print("\n== %s" % d["id"])
        for t in d["themen"]:
            for a in t["aussagen"]:
                gesamt += 1
                q = a["quelle"]
                schluessel = q["datei"]
                if schluessel not in cache:
                    voll = os.path.join(BASIS, q["datei"].replace("/", os.sep))
                    doc = pymupdf.open(voll)
                    cache[schluessel] = [normalisiere(p.get_text()) for p in doc]
                seiten_texte = cache[schluessel]
                nadel = normalisiere(q["markierung"])
                nr = q["seite"]
                if nr < 1 or nr > len(seiten_texte):
                    print("  FEHLER %s: Seite %d existiert nicht" % (a["id"], nr))
                    fehler += 1
                elif nadel.lower() not in seiten_texte[nr - 1].lower():
                    wo = [i + 1 for i, s in enumerate(seiten_texte)
                          if nadel.lower() in s.lower()]
                    print("  FEHLER %s (%s): Markierung nicht auf S%d%s"
                          % (a["id"], a["parteiId"], nr,
                             (", aber auf %s" % wo) if wo else " und nirgends"))
                    fehler += 1
    print("\n%d Quellenangaben geprüft, %d Fehler." % (gesamt, fehler))
    return fehler


if __name__ == "__main__":
    _cli()
