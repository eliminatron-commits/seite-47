# PROGRESS – Seite 47

**Stand: Umbau auf Schema 2 abgeschlossen (4 von 4).**

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
- Umbau 2/4: Daten ✔
  - Quellmodule `.claude/quellen/*.py` tragen jetzt Fragen statt flacher
    Aussagenlisten; `baue_datensatz.py` erzeugt Schema 2 und erzwingt die
    Ausgewogenheit beim Bauen.
  - **56 Fragen** aus 28 Themen (ST 20, BE 18, MV 18), alle 196 Aussagen
    zugeordnet, jede Partei je Thema genau einmal.
  - Zwei Datenfehler gefunden und behoben, die im alten Aufbau unsichtbar
    blieben: Linke Sachsen-Anhalt hatte für „wirtschaft“ und „verwaltung“
    **zwei Aussagen aus demselben Satz auf Seite 98**; bei Linke MV
    beschrieb die vereinfachte Fassung zu „wirtschaft“ einen **anderen
    Absatz als ihr Zitat**. Beide durch belegte Positionen ersetzt
    (ST S. 86 Tarifbindung, MV S. 9 Tariftreuegesetz).
  - Paarungsspanne je Wahl: ST 2–7, BE 2–6, MV 2–7 (siehe CLAUDE.md 4a).
  - Geprüft: 196/196 Quellenangaben gegen die PDFs (`pdftool pruefe`, 0 Fehler),
    0 Schemafehler, Auftritte exakt gleich, Längenspanne innerhalb einer Frage
    im Mittel 6,5–7,3 Wörter (keine über 15), 392 Aussagetexte ohne
    Parteinamen-Leck nach der Maskierung.
- Umbau 3/4: App ✔
  - Eine Frage pro Bildschirm statt einer langen Kartenliste; je Aussage die
    beiden Knöpfe „Am ehesten“ und „Am wenigsten“, Kollisionen werden
    aufgelöst (dieselbe Aussage kann nicht beides sein, jede Rolle nur einmal).
  - Aussagen werden **innerhalb jeder Frage** gemischt – sonst stünde die
    CDU-Aussage systematisch an erster Stelle, weil die Datensätze die
    Parteien immer gleich sortieren.
  - Gewichtungsregler stufenlos 0–100; die unteren Prozente rasten auf 0 ein,
    damit die Ausschluss-Schwelle nicht aus Versehen beim Wischen entsteht.
  - Ergebnisseite zeigt je Thema den Parteimittelwert und darunter jede Frage
    mit den Aussagen, der eigenen Wahl und der Quelle.
  - **Das gemeldete Springen beim Antworten ist behoben**: Ursache war der
    3 px breite Rahmen, der nur bei unbeantworteten Karten gesetzt wurde und
    die Textbreite änderte. Der Platz ist jetzt immer reserviert
    (`border-left: 3px solid transparent`), gemessen: Kartenhöhen und
    Seitenhöhe vor und nach dem Antworten identisch.
  - Geprüft: 20 Fragen durchgespielt, 0 Konsolenfehler, kein waagerechter
    Überlauf bei 360 px, Bewertungsknöpfe 150×44 px; 13 Handrechnungen
    bestätigt (`.claude/pruefe_auswertung.js`); Anonymitätsscan über alle
    20 Fragen **mit allen 70 Zitaten aufgeklappt** ohne Fund.
- Umbau 4/4: Export und Abschluss ✔
  - `js/export.js` auf Fragen umgestellt: Ranking, Themen mit Parteimittelwert
    und Fragenzahl, im Anhang jede Frage mit ihren Aussagen, Partei, eigener
    Wahl und Fundstelle; Erklärtext zur neuen Rechenweise.
  - Geprüft: 11-seitiges PDF (%PDF-1.3, 83 KB), Umlaute korrekt in der
    gerenderten Textlage („Übereinstimmung“, „Grüne“, „für“), kein Mojibake;
    ausgeschlossenes Thema erscheint als „nicht abgefragt“, offene Frage als
    „nicht beantwortet“.
  - Vollständige Durchläufe über alle drei Wahlen (18/18/20 Fragen), je 0
    Konsolenfehler, kein waagerechter Überlauf, alle Quellenknöpfe vorhanden
    (63/63/70).
  - **196/196 Markierungen** über `S47_QUELLE._finde` in der PDF.js-Textlage
    wiedergefunden; Viewer aus dem neuen Ergebnisaufbau geöffnet und die
    Fundstelle hervorgehoben.
  - Ergebnisseite und Export bei 360 px ohne Überlauf.

**Wichtig für den Wiedereinstieg – die App ist derzeit nicht lauffähig.**
Die App ist wieder vollständig lauffähig; `.claude/migriere_v2.py` bleibt als
Werkzeug für Schema-1-Datensätze von außen.

**Nachbesserung nach Nutzerhinweis (Aussagen, die ihre Frage nicht beantworten):**
Bei „Wie soll die Bürokratie für Betriebe verringert werden?" endete eine
Aussage mit der Forderung nach einem Ende der Russlandsanktionen. Ursache: die
Aussagen entstanden in Phase 2 zu breiten Themen; beim Umgruppieren wurde nur
die Gruppe auf Stimmigkeit geprüft, nicht jeder einzelne Satz.

Systematisch bedingt durch eine Datenlücke: das AfD-Programm Sachsen-Anhalt
liegt nur als 24-seitiges Kurzprogramm aus Stichpunktlisten vor (übrige
Programme dort: 61–150 Seiten Fließtext). Messbar an Aussagen, deren Zitat
mehrere Stichpunkte bündelt: **AfD ST 9 von 10, alle übrigen 0 bis 1.**

- `.claude/pruefe_passung.py` neu: listet angehängte Sätze ohne Bezug zur
  Unterfrage (20 Kandidaten, davon 3 echte Fehler – alle AfD ST).
- Korrigiert: Russlandsanktionen (Bürokratiefrage), „Landesenergieagentur und
  grüne Wasserstoffstrategie beenden" (Windrad-Standortfrage), „flächen-
  deckender Netzempfang" (Nahverkehrsangebot). Die AfD-Aussage zur Wirtschaft
  steht jetzt in der Frage nach der Wirtschaftsförderung, wo ihr
  Förderschwerpunkt hingehört.
- Erneut geprüft: 196/196 Quellenangaben, 0 Schemafehler, 0 Parteinamen-Lecks,
  Längenspanne je Frage unter 15 Wörtern, alle 20 ST-Fragen im Browser
  durchgespielt ohne Konsolenfehler.

**Weiterhin offen (aus den Grundphasen):** der Start per Doppelklick auf
`index.html` ist nach wie vor nicht real bestätigt, und die Veröffentlichung
auf GitHub Pages steht aus (kein Remote gesetzt, siehe README).

`.claude/migriere_v2.py` wurde für den Umstieg gebaut, aber am Ende nicht
gebraucht: die Datensätze entstehen aus den Quellmodulen neu. Es bleibt als
Werkzeug für den Fall, dass ein Schema-1-Datensatz von außen dazukommt.

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
