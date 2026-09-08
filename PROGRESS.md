# PROGRESS – Seite 47

**Stand: Umbau auf Schema 2 läuft – Phase 1 von 4 abgeschlossen.**

Die fünf ursprünglichen Phasen sind fertig. Danach hat sich das Konzept
geändert: statt jede Aussage einzeln auf einer Zustimmungsskala zu bewerten,
stehen 3–4 Aussagen verschiedener Parteien zu derselben Unterfrage nebeneinander
und der Nutzer wählt die beste und die schlechteste. Begründung: CLAUDE.md,
Punkt 4.

- Umbau 1/4: Konzept & Datenmodell ✔
  - `schema/wahl.schema.json` auf Version 2 (Thema → Fragen → 3–4 Aussagen).
    Nebenbefund: die Datei war bisher **kein gültiges JSON** (`"^\d{4}-…"` ist
    eine ungültige Escape-Sequenz) – korrigiert und beim Erzeugen validiert.
  - `S47_DATA.pruefe` prüft die neue Struktur und die Ausgewogenheit je Thema;
    `S47_DATA.ausgewogenheit` liefert Auftritte und Paarungen als Diagnose.
  - `js/auswertung.js` neu: beste 100 / schlechteste 0 / dazwischen 50,
    unbeantwortete Fragen fallen für alle heraus, Themenwert als Mittel,
    Gewichtung stufenlos 0–100.
  - `.claude/migriere_v2.py` überführt die drei bestehenden Datensätze und
    verteilt die Paarungen ausgewogen (vorher 1–8 gemeinsame Fragen je
    Parteienpaar, jetzt 3–5; Auftritte exakt gleich).
  - Geprüft mit Node gegen alle drei migrierten Datensätze: 0 Schemafehler,
    Gewicht 0 schließt Fragen aus, ohne Antworten bleibt das Ranking leer.
- Umbau 2/4: Daten – Unterfragen ableiten, Aussagen zuordnen und angleichen (offen)
- Umbau 3/4: App – stufenloser Regler, Beste/Schlechteste-Ansicht, Ergebnis (offen)
- Umbau 4/4: PDF-Export, Mobil, Prüfung (offen)

**Wichtig für den Wiedereinstieg – die App ist derzeit nicht lauffähig.**
`js/auswertung.js` folgt bereits Schema 2, `js/app.js` und `js/export.js`
greifen aber noch auf `A.BEWERTUNGEN` und `A.GEWICHTE` zu (app.js:175, 287,
384, 400; export.js:27, 69, 88). Beide werden in Umbau 3/4 und 4/4 ersetzt.
`data/wahlen/*.js` liegt absichtlich noch als Schema 1 vor; die Migration wird
erst in Umbau 2/4 hineingeschrieben, wenn die Fragetexte redaktionell stehen.

---

**Fertige Grundphasen:**

- Phase 1: Architektur & Fundament ✔
- Phase 2: Datenrecherche & Extraktion ✔ (21 Programm-PDFs, 196 Aussagen,
  alle Quellenangaben maschinell geprüft)
- Phase 3: Kern-App ✔ (Gewichtung, Bewertung, Auswertung, Aufdeckung)
- Phase 4: Quellenanzeige & PDF-Export ✔
  - PDF.js 3.11.174 und pdfmake 0.2.10 liegen lokal unter `vendor/` (kein CDN).
  - Klick auf „Quelle: Seite N“ öffnet das Programm eingebettet, springt zur
    Seite und hebt den hinterlegten Ausschnitt hervor; unter `file://` und bei
    Fehlern greift der externe Aufruf `datei#page=N`.
  - Alle 196 Markierungen wurden in der PDF.js-Textlage wiedergefunden
    (0 Fehlstellen) – dafür ist die Normalisierung in `js/quelle.js` an
    `.claude/pdftool.py` angeglichen.
  - Ergebnis-Export als PDF (pdfmake): Ranking, Themenaufschlüsselung, Anhang
    mit allen Aussagen, Partei, eigener Bewertung und Fundstelle; geprüft mit
    10 Seiten und korrekten Umlauten.
- Phase 5: Mobile-Feinschliff & Deployment ✔
  - Bei 360 px durchgespielt: keine waagerechte Überlauffläche auf einer
    einzigen Seite, kein Konsolenfehler.
  - Fingerflächen über `@media (pointer: coarse)` statt über die Fensterbreite:
    Zitat-Umschalter und Slider auf mindestens 44 px, größerer Slider-Griff.
  - Zustimmung/Neutral/Ablehnung stehen unter 30 rem in einer Reihe (vorher
    2 + 1; der umbrechende dritte Knopf las sich wie eine andere Antwortart).
  - Viewer auf schmalen Geräten: Seite wird mit mindestens 560 px Breite
    gemalt statt auf Fensterbreite gestaucht, die Bühne scrollt waagerecht
    und springt zur Markierung – bei 360 px geprüft (3 Trefferkästchen).
  - Deployment vorbereitet: relative Pfade durchgängig, `.nojekyll` vorhanden,
    Schritte in `README.md`.

**Offene Punkte:**

- Start per Doppelklick auf `index.html` einmal real bestätigen. In dieser
  Umgebung nicht möglich (der Vorschau-Browser rendert `file://` als
  Schnappschuss, keine Chrome-Verbindung). Statisch abgesichert: kein
  `fetch`/`XHR`, kein `import`/`export`, keine absoluten Pfade.
- Veröffentlichung auf GitHub Pages: kein Git-Remote gesetzt; der Push
  gehört ins Konto des Nutzers (siehe `README.md`).
- Parteilogos in `assets/logos/` sind weiterhin optional.

**Datenlücken (dokumentiert, nicht ersetzt):** AfD Sachsen-Anhalt nur als
Kurzprogramm, Grüne MV nur als gespiegeltes PDF – Details in `docs/quellen.md`.
