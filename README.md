# Seite 47

Ein clientseitiger Wahlhelfer: Themen gewichten, anonymisierte Positionen aus
echten Wahlprogrammen **miteinander vergleichen** – und erst am Ende erfahren,
welche Partei wofür steht.

Zu jeder Frage stehen drei bis vier Aussagen verschiedener Parteien
nebeneinander; gewählt wird die Aussage mit der größten und die mit der
geringsten Zustimmung. Der Vergleich zwingt zur Unterscheidung – eine
Zustimmungsskala tut das nicht, weil Programmsätze so formuliert sind, dass man
ihnen schwer widerspricht.

## Starten

- **Ohne alles:** `index.html` doppelklicken. Die App läuft vollständig offline.
- **Mit lokalem Server** (nötig für die eingebettete PDF-Anzeige):
  `powershell -NoProfile -ExecutionPolicy Bypass -File .claude/server.ps1`
  und dann <http://localhost:8147> öffnen.

## Veröffentlichen (GitHub Pages)

Die Seite ist statisch und nutzt ausschließlich relative Pfade – sie läuft
deshalb auch unter einem Unterpfad wie `https://<konto>.github.io/seite-47/`.
`.nojekyll` liegt bereits im Wurzelverzeichnis, damit Pages die Dateien
unverändert ausliefert.

1. Leeres öffentliches Repository anlegen.
2. `git remote add origin <URL>` und `git push -u origin master`.
3. In den Repository-Einstellungen unter *Pages* die Quelle auf Branch
   `master`, Ordner `/ (root)` setzen.

Zu beachten: das Repository enthält die 21 Wahlprogramm-PDFs (rund 49 MB) und
die mitgelieferten Bibliotheken (rund 3,5 MB). Das liegt deutlich unter den
Grenzen von GitHub Pages (1 GB Repository, 100 GB Datenverkehr im Monat), der
erste Klon dauert aber entsprechend.

Über GitHub Pages ist die eingebettete Quellenanzeige aktiv; beim Start per
Doppelklick (`file://`) öffnet stattdessen der externe Fallback `datei#page=N`.

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
