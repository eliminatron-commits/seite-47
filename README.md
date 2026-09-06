# Seite 47

Ein clientseitiger Wahlhelfer: Themen gewichten, anonymisierte Positionen aus
echten Wahlprogrammen bewerten – und erst am Ende erfahren, welche Partei
wofür steht.

## Starten

- **Ohne alles:** `index.html` doppelklicken. Die App läuft vollständig offline.
- **Mit lokalem Server** (nötig für die eingebettete PDF-Anzeige):
  `powershell -NoProfile -ExecutionPolicy Bypass -File .claude/server.ps1`
  und dann <http://localhost:8147> öffnen.

## Datenschutz

Keine Server, keine Konten, kein Tracking, keine externen Schriften oder Skripte.
Antworten und Ergebnis existieren nur im Speicher der laufenden Browsersitzung.

## Eine Wahl ergänzen

Ohne jede Änderung am App-Code:

1. Datensatz nach `schema/wahl.schema.json` als `data/wahlen/<id>.js` ablegen
   (JSON-Nutzlast in `window.S47_DATA.register( … );`).
2. Wahlprogramm-PDFs nach `data/programme/<kuerzel>/` legen.
3. Eintrag in `data/wahlen.js` ergänzen.

Details und Designentscheidungen: `CLAUDE.md`. Stand der Arbeit: `PROGRESS.md`.
