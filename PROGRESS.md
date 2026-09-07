# PROGRESS – Seite 47

**Abgeschlossen: Phase 2/5 – Datenrecherche & Extraktion**
**Nächste Phase: Phase 3/5 – Kern-App** (Opus 5, hoch)

## Stand

Drei vollständige Datensätze aus den echten Wahlprogrammen:

| Wahl | Themen | Aussagen | Parteien |
|---|---|---|---|
| Landtagswahl Sachsen-Anhalt (6.9.2026) | 10 | 70 | 7 |
| Abgeordnetenhauswahl Berlin (20.9.2026) | 9 | 63 | 7 |
| Landtagswahl Mecklenburg-Vorpommern (20.9.2026) | 9 | 63 | 7 |

21 Programm-PDFs unter `data/programme/<region>/`, Quellenliste in `docs/quellen.md`.
Alle **196 Quellenangaben maschinell gegen die PDFs verifiziert** (Partei, Datei,
Seite, wörtlicher Markierungstext): `python .claude/pdftool.py pruefe` → 0 Fehler.
Kurzfassungen sind über alle Parteien gleichförmig (Median 231–259 Zeichen je Partei,
je 28 Aussagen pro Partei). DOM-Scan über alle Themen einer Wahl: kein Parteiname,
keine ID, keine Farbe, kein PDF-Pfad vor der Aufdeckung.

Werkzeuge (nicht Teil der App): `.claude/pdftool.py` (Volltextsuche, Gliederung,
Verifikation), `.claude/baue_datensatz.py` + `.claude/quellen/<region>.py`
(Quelltext der Datensätze; erzeugt `data/wahlen/<id>.js`).

## Offene Punkte / Abweichungen

- **AfD Sachsen-Anhalt** veröffentlicht ihr Regierungsprogramm nur als Website
  (afd-regierungsprogramm.de), nicht als PDF. Verwendet wird daher das offizielle
  **Kurzprogramm** (24 Seiten) von afd-lsa.de – deutlich knapper als die übrigen
  Programme, aber echte Quelle statt erfundener Fundstelle.
- **Grüne Mecklenburg-Vorpommern** stellen ihr Programm auf der eigenen Seite nur
  als Web-Kapitel bereit; das PDF stammt aus der Sammlung von schwerin.news und
  wurde anhand von Titel und Impressum als das Original bestätigt.
- Keine Partei musste bei einem Thema ausgelassen werden: die gewählten Themen
  werden in allen 21 Programmen behandelt. Die Auslassungslogik bleibt im Schema
  und in der Auswertung erhalten, wird von den echten Daten aber nicht ausgelöst.
- `file://`-Start weiterhin nur konstruktiv abgesichert, noch nicht per Doppelklick
  bestätigt.
- `js/quelle.js` und `js/export.js` sind Schnittstellen-Stubs (Phase 4), `vendor/` leer.
- Parteilogos fehlen; das Ergebnis zeigt ersatzweise Farbpunkte.
