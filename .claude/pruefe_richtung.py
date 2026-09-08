# -*- coding: utf-8 -*-
"""Sucht Aussagen, zu denen man sich nicht positionieren kann.

Die App verlangt eine Rangfolge: welcher Aussage stimme ich am ehesten zu,
welcher am wenigsten. Das setzt voraus, dass jede Aussage eine erkennbare
Richtung hat. Zwei Muster verfehlen das:

  RICHTUNGSLOS  Ein Veraenderungsverb ohne Ziel: "Die Regelungen zur
                Nutztierhaltung sollen geaendert werden" - wohin?
                "ueberprueft", "angepasst", "evaluiert", "reformiert" ebenso.

  NUR BEFUND    Die Aussage beschreibt eine Lage, ohne etwas zu fordern:
                "Der Aerztemangel im laendlichen Raum sei real." Dem kann man
                zustimmen, ohne damit eine Politik zu waehlen - und im
                Vergleich mit drei Forderungen steht so ein Satz allein da,
                was zugleich die Partei verraet.

Das Werkzeug entscheidet nichts, es sortiert zur Durchsicht.

Aufruf:  python .claude/pruefe_richtung.py
"""
import glob
import io
import json
import os
import re

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Veraenderung ohne Richtung. "verbessert", "erhoeht", "gesenkt" fehlen hier
# bewusst - die tragen eine Richtung in sich.
RICHTUNGSLOS = re.compile(
    r"\b(geändert|ändern|überprüft|überprüfen|auf den Prüfstand|evaluiert"
    r"|evaluieren|angepasst|anpassen|reformiert|weiterentwickelt"
    r"|weiterentwickeln|neu ausgerichtet|neu geordnet|umgebaut|umbauen"
    r"|geprüft|prüfen|neu gedacht|hinterfragt)\b", re.IGNORECASE)

# Eine Forderung erkennt man an Modalitaet oder an Forderungsverben.
FORDERUNG = re.compile(
    r"\b(soll|sollen|sollte|sollten|muss|müssen|müsse|müssten|wird|werden"
    r"|gefordert|angestrebt|vorgesehen|will|wollen|darf|dürfe|dürfen"
    r"|bleiben|bleibt|erhalten)\b", re.IGNORECASE)

# Reine Zustandsbeschreibung im Konjunktiv der indirekten Rede.
BEFUND = re.compile(
    r"\b(sei|seien|habe|haben|hätten|gebe|gebe es|liege|liegen|komme|kämen"
    r"|falle|fielen|erschwerten|verliere|verlören|gehe|gingen|arbeiteten"
    r"|würden|wuerde|verschwänden|stießen|stünden)\b")


def saetze(text):
    return [t for t in re.split(r"(?<=[.!?])\s+", text.strip()) if t]


def pruefe():
    richtungslos, nurbefund = [], []
    aussagen = 0
    for datei in sorted(glob.glob(os.path.join(BASIS, "data", "wahlen", "*.js"))):
        roh = io.open(datei, encoding="utf-8").read()
        d = json.loads(roh[roh.index("register(") + len("register("):roh.rindex(")")])
        for thema in d["themen"]:
            for frage in thema["fragen"]:
                for a in frage["aussagen"]:
                    aussagen += 1
                    ort = (d["id"], thema["id"], frage["id"], a["parteiId"], frage["text"])
                    for satz in saetze(a["kurz"]):
                        if RICHTUNGSLOS.search(satz):
                            richtungslos.append(ort + (satz,))
                    # "Nur Befund": kein Satz der Aussage enthaelt eine
                    # Forderung, aber mindestens einer eine Zustandsbeschreibung.
                    hat_forderung = any(FORDERUNG.search(s) and not BEFUND.search(s)
                                        for s in saetze(a["kurz"]))
                    if not hat_forderung:
                        nurbefund.append(ort + (a["kurz"],))

    def zeige(titel, liste):
        print("\n%s\n%s" % (titel, "=" * len(titel)))
        for wahl, thema, frage, partei, fragetext, satz in liste:
            print("\n%s / %s / %s / %s" % (wahl, thema, frage, partei))
            print("   Frage: %s" % fragetext)
            print("   Text : %s" % satz)

    zeige("RICHTUNGSLOS – Veraenderung ohne Ziel", richtungslos)
    zeige("NUR BEFUND – Lagebeschreibung ohne Forderung", nurbefund)
    print("\n%d Aussagen geprueft: %d richtungslose Saetze, %d Aussagen ohne Forderung."
          % (aussagen, len(richtungslos), len(nurbefund)))
    return len(richtungslos) + len(nurbefund)


if __name__ == "__main__":
    pruefe()
