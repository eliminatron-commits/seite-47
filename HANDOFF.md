# Handoff — Seite 47 (Wahlhelfer) — 7. September 2026

## Stand

Phasen 1–3 von 5 abgeschlossen und committet (`57f2d62`), Arbeitsverzeichnis sauber.
Die App ist auf echten Daten für alle drei Wahlen vollständig durchspielbar und
wurde im Browser automatisiert verifiziert: kein Konsolenfehler, Handrechnung eines
Themas exakt bestätigt (Gewichte 3/1/0…: 87,5 % / 12,5 % / 50 %), Anonymitätsscan
über alle 196 Aussagen **mit jedem Zitat geöffnet** ohne Fund. Datenbasis: 21
Wahlprogramm-PDFs, 196 Aussagen, alle Quellenangaben maschinell gegen die PDFs
geprüft (`python .claude/pdftool.py pruefe` → 0 Fehler).

Nächste Phase ist 4/5 – Quellenanzeige & PDF-Export. Sie war angekündigt, aber
noch nicht begonnen.

## Offene Punkte (priorisiert)

1. **Phase 4 – PDF.js-Viewer**: `vendor/pdfjs/` lokal ablegen (kein CDN), Viewer in
   `js/quelle.js` implementieren: Sprung auf `quelle.seite`, farbige Hervorhebung
   von `quelle.markierung` im Textlayer. `S47_QUELLE.zeige()` muss `false`
   zurückgeben, wenn das Rendern scheitert – dann greift der bereits funktionierende
   Fallback `datei#page=N`.
2. **Phase 4 – PDF-Export**: `vendor/pdfmake/` (`pdfmake.min.js` + `vfs_fonts.js`)
   ablegen, `js/export.js` füllen: Ranking und Themenaufschlüsselung vorn, im
   Anhang sämtliche Nutzerantworten mit Aussage und Bewertung.
3. **Phase 5** – Mobile-Feinschliff bei 360 px und Deployment via GitHub Pages.
4. Parteilogos in `assets/logos/` ergänzen (optional; `parteien[].logo` ist im
   Schema vorgesehen, aktuell überall `null`, Ergebnis zeigt Farbpunkte).

## Wichtige Entscheidungen + Begründung

Vollständig in CLAUDE.md, Abschnitt „Zentrale Designentscheidungen". Nicht erneut
diskutieren, sondern dort nachlesen — insbesondere:

- **Script-Injection statt `fetch()`** für Datensätze (Punkt 1), weil `file://`
  funktionieren muss.
- **Maskierung von Parteinamen vor der Aufdeckung** (Punkt 3). In dieser Session
  gefunden: 14 Originalzitate nennen die eigene Partei („Die AfD fordert“, „Wir
  Freie Demokraten“). Gelöst über `S47_DATA.anonymisiere()`, gespeist aus
  `parteien[].name`/`alias` **im Datensatz** — Zitate bleiben unverändert, nach der
  Aufdeckung erscheinen sie im Original.
- **pdfmake statt jsPDF/`window.print()`** für den Export (Punkt 5) — für Phase 4
  bindend, Begründung dort ausformuliert.

## Bekannte Probleme / Blocker

- **`file://`-Start nie real geprüft.** Konstruktiv abgesichert (keine `fetch`-
  Aufrufe), aber der Vorschau-Browser wandelt `file://` in Snapshots um und die
  Chrome-Extension war nicht verbunden. Einmal per Doppelklick auf `index.html`
  bestätigen — das ist ein Kernkriterium des Projekts.
- Kein Blocker, aber dokumentierte Datenlücken: AfD Sachsen-Anhalt existiert nur
  als 24-seitiges Kurzprogramm (Vollprogramm ist web-only), Grüne MV als
  gespiegeltes PDF. Details in `docs/quellen.md` und PROGRESS.md.

## Relevante Pfade

- `js/quelle.js` — Stub der Quellenanzeige; Fallback funktioniert, Viewer fehlt (Punkt 1)
- `js/export.js` — Stub des PDF-Exports; wirft noch „Noch nicht implementiert“ (Punkt 2)
- `vendor/` — leer, hier gehören PDF.js und pdfmake als lokale Dateien hin
- `js/app.js` — Ergebnisseite ruft `S47_QUELLE.zeige()` und `S47_EXPORT.erzeuge()` auf
- `.claude/pdftool.py` — `pruefe` verifiziert alle Quellenangaben gegen die PDFs;
  `suche`/`seite`/`gliederung` für Stichproben der Seitenzahlen in Phase 4
- `.claude/launch.json` + `.claude/server.ps1` — lokaler Server auf Port 8147
  (für den PDF.js-Viewer nötig, `file://` reicht dafür nicht)

## Empfehlung für Fortsetzung

- Modell/Effort: **Opus 5 (hoch)** — zwei Fremdbibliotheken offline einbinden,
  Textlayer-Treffer koordinatengenau lokalisieren, Fallbackpfad zuverlässig
  auslösen; Fehler zeigen sich erst im gerenderten Ergebnis.
- Erster Schritt: PDF.js in `vendor/pdfjs/` ablegen und `S47_QUELLE.zeige()` so
  implementieren, dass ein Klick auf „Quelle: Seite N“ auf der Ergebnisseite das
  PDF eingebettet öffnet, zur Seite springt und `quelle.markierung` hervorhebt.
  Zur Stichprobe eignet sich `lt-st-2026`, Thema „Innere Sicherheit und Polizei“.
