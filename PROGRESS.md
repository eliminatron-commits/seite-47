# PROGRESS – Seite 47

**Stand: alle 5 Phasen abgeschlossen.**

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
