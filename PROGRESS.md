# PROGRESS – Seite 47

**Abgeschlossen: Phase 1/5 – Architektur & Fundament**
**Nächste Phase: Phase 2/5 – Datenrecherche & Extraktion** (Fable 5, hoch; Alternative Opus 5, max)

## Stand

Grundgerüst läuft: Wahl-Dropdown, Themengewichtung, anonyme Bewertung, gewichtete
Auswertung, Ergebnis mit Aufdeckung. Drei Platzhalter-Datensätze
(Sachsen-Anhalt 10 Themen, Berlin 9, MV 9; je 7 Parteien, mit Beispiel-Auslassungen).
Schema unter `schema/wahl.schema.json`, Designentscheidungen in `CLAUDE.md`.

Verifiziert über lokalen Server: keine Konsolenfehler; DOM-Scan vor der Aufdeckung
findet keinen Parteinamen, keine Partei-ID, keine Parteifarbe, keinen PDF-Pfad;
Nachrechnung eines Themas stimmt (CDU 55 %, SPD 45 %, übrige 50 %).

## Offene Punkte / Abweichungen

- `file://`-Start ist konstruktiv sichergestellt (Script-Injection statt `fetch`),
  konnte in dieser Umgebung aber nicht real per Doppelklick geprüft werden –
  einmal manuell bestätigen.
- `js/quelle.js` und `js/export.js` sind bewusst Schnittstellen-Stubs (Phase 4);
  `vendor/` ist noch leer.
- Quellen-Links zeigen auf noch nicht vorhandene PDFs unter `data/programme/`.
- Parteilogos (`assets/logos/`) fehlen noch; Ergebnis zeigt ersatzweise Farbpunkte.
