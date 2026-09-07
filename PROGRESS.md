# PROGRESS – Seite 47

**Stand: Phase 4 von 5 abgeschlossen.**

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
- Phase 5: Mobile-Feinschliff & Deployment (offen)

**Offene Punkte:** Start per Doppelklick auf `index.html` einmal real
bestätigen; Parteilogos in `assets/logos/` sind weiterhin optional.

**Datenlücken (dokumentiert, nicht ersetzt):** AfD Sachsen-Anhalt nur als
Kurzprogramm, Grüne MV nur als gespiegeltes PDF – Details in `docs/quellen.md`.
