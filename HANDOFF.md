# Handoff — Seite 47 (Wahlhelfer) — 24.09.2026

## Stand
Live auf https://eliminatron-commits.github.io/seite-47/ (GitHub Pages, master).
Diese Session: Wahlergebnisse Berlin/M-V auf der Titelseite, Zurueck-Geste im
Quellenviewer, Sitzungsspeicher (Durchgang ueberlebt Neuladen), alle Themen
wieder vorgewaehlt, Uhr im Durchgang (Quiz, Ergebnis, Titelseite, PDF). Alles
im Browser geprueft; `pruefe_duelle.js`, `pruefe_pdf.py`, `pruefe_css.py` gruen.
Details: PROGRESS.md, letzter Eintrag.

## Offene Punkte (priorisiert)
1. Nutzerentscheidung ausstehend: Obergrenze Zuegig 18 -> 14 Duelle
   (`UMFAENGE` in `js/duelle.js`), damit Zuegig mit allen Themen < 10 min.
   Danach `node .claude/pruefe_duelle.js` und CLAUDE.md 4c anpassen.
2. Echte Spielzeiten von Testern einsammeln (die Uhr zeigt sie jetzt) und
   `SEKUNDEN_JE_DUELL` (22) in `js/app.js` daran pruefen.
3. Angebot offen: `localStorage` statt `sessionStorage` (Nutzer sagte
   "mindestens" sessionStorage) – nur auf ausdruecklichen Wunsch.
4. Aeltere Angebote: Hinweis auf uebersprungene Duelle in der Aufdeckung,
   weitere "ohne Absender"-Formulierungen.

## Wichtige Entscheidungen + Begruendung
- sessionStorage statt localStorage: keine politische Neigung dauerhaft auf
  geteilten Geraeten (CLAUDE.md Abschnitt 15).
- Themen vorgewaehlt: Nutzer hat den Leerstart zurueckgenommen – nicht ohne
  Rueckfrage wieder umdrehen (CLAUDE.md 4c).
- Uhr zaehlt vorwaerts, nur sichtbarer Tab, kein Countdown (kein Zeitdruck).

## Relevante Pfade
- js/duelle.js — `UMFAENGE` (Tiefe, obergrenze)
- js/app.js — `minuten()`, Uhr (`stelleUhr`), Sitzungsspeicher (`sichere`, `stelleWiederHer`)
- .claude/pruefe_duelle.js — Trennschaerfe je Umfang
- CLAUDE.md — Abschnitte 4c, 4d, 15

## Empfehlung fuer Fortsetzung
- Modell: Opus 5.5
- Effort: niedrig – kleine, klar umrissene Parameteraenderung mit vorhandener Pruefung
- Erster Schritt: Nutzer fragen, ob die Obergrenze Zuegig auf 14 sinken soll; bei Ja aendern, `pruefe_duelle.js` laufen lassen, committen, pushen.
