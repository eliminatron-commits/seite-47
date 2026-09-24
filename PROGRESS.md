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
lag nur als 24-seitiges Kurzprogramm aus Stichpunktlisten vor (übrige
Programme dort: 61–150 Seiten Fließtext). Messbar an Aussagen, deren Zitat
mehrere Stichpunkte bündelt: **AfD ST 9 von 10, alle übrigen 0 bis 1.**
Inzwischen behoben – siehe unten.

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

**Vollständige Richtungsprüfung aller 196 Aussagen (auf Nachfrage):**

Nicht nur die eine gemeldete Stelle, sondern jede Aussage gegen den Maßstab
gelesen: *Kann man sich dazu positionieren?* Ergebnis: **22 Aussagen ersetzt**,
verteilt über alle sieben Parteien.

Drei Muster traten hervor:
- **Bilanzen statt Forderungen** – vor allem bei Regierungsparteien
  („Die Migrationswende ist da", „Die Landespolizei wurde modernisiert",
  „Mit beitragsfreien Kitas sind wir sozial gerechter geworden").
- **Lagebeschreibungen** ohne Vorschlag („Busse kommen zu spät, U-Bahnen
  fallen aus", „Berlin sei größter Nettoempfänger", „Der Ärztemangel sei real").
- **Absichtserklärungen**, denen niemand widerspricht („Unterrichtsausfall
  darf nicht zur Normalität werden", „Gesundheit müsse gut und erreichbar
  sein", „Mobilität wird vom Alltag der Menschen her gedacht").

Ersetzt durch belegte Forderungen aus denselben Programmen, unter anderem:
rollende Arztpraxen und Facharzt-Busse (FDP ST), letztes Kita-Jahr als
Vorschuljahr (CDU ST), Community Health Nurse (FDP MV), kostenfreier
Nahverkehr unter 21 ohne den themenfremden Zusatz (Linke MV), Kapazitäten des
Ausreisegewahrsams (CDU BE), Rückbesinnung auf verbindliche Leistungsstandards
(BSW BE). Zwei Fragen neu gefasst, zwei Aussagen zwischen den Fragen eines
Themas getauscht.

Werkzeug: `.claude/pruefe_richtung.py` sortiert Kandidaten vor, entscheidet
aber nichts – die Durchsicht bleibt Handarbeit. Es fand 22 Kandidaten; die
tatsächliche Zahl der Fälle lag höher, weil das Skript Platitüden mit
Modalverb nicht erkennt.

Nachprüfung: 196/196 Quellenangaben, 0 Schemafehler, 0 Parteinamen-Lecks,
Längenspanne je Frage höchstens 15 Wörter, alle drei Wahlen im Browser
durchgespielt (20/18/18 Fragen, alle Zitate aufgeklappt) ohne Konsolenfehler
und ohne Überlauf.

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
- Parteilogos liegen seit 13.09.2026 in `assets/logos/` (Wikimedia Commons, gemeinfrei, Herkunft in `docs/quellen.md`); der Builder setzt `logo`, sobald `<partei>.svg` existiert.

**Nachbesserung nach Nutzerhinweis (richtungslose Aussagen, Kurzprogramm,
Quellen im PDF):**

- „Die Regelungen zur Nutztierhaltung sollen geändert werden" ließ offen,
  wohin. `.claude/pruefe_richtung.py` neu: findet Veränderungsverben ohne Ziel
  und Aussagen ohne jede Forderung (22 Kandidaten, 6 echte Fälle).
- Sechs Aussagen ersetzt, die keine Position enthielten: CDU Berlin und SPD MV
  (reine Erfolgsbilanzen), Grüne Berlin und AfD MV (reine Lagebeschreibungen),
  BSW ST (nur Problembeschreibung), AfD ST (Richtung ging beim Zusammenfassen
  verloren). Zwei Fragen dazu neu gefasst.
- Maskierungsfehler behoben: „Grüne Berufe" (Agrarberufe) wurde zu
  „[Partei] Berufe" – unsinnig und ein Marker. Aussage umformuliert.
- **AfD Sachsen-Anhalt: Vollprogramm statt Kurzprogramm.** Das 258-seitige
  Regierungsprogramm „Das Land zuerst" (Juli 2026) existiert als PDF; die
  Phase-2-Annahme „nur web-only" war überholt. Alle zehn AfD-Aussagen neu aus
  dem Vollprogramm extrahiert. Stichpunkt-Bündelung: von 9/10 auf 0/10.
- PDF-Export: neues Quellenverzeichnis am Ende mit Partei, Programmtitel,
  Fundort-URL, Dateipfad und Erhebungsstand.
- Geprüft: 196/196 Quellenangaben, 0 Schemafehler, 0 Parteinamen-Lecks,
  Handrechnungen bestätigt, 12-seitiges PDF ohne Mojibake.

**Datenlücken (geprüft):** Die Linke MV hat tatsächlich nur 30 Seiten – das
ist ihr Vollprogramm, kein Auszug. Grüne MV weiterhin als gespiegeltes PDF.
Details in `docs/quellen.md`.

## Oberflaeche ueberarbeitet (9. September 2026)

- Gestaltung neu: redaktionelles Bild (Serifen-Ueberschriften, Papierton,
  Haarlinien), Dunkelmodus, Aufmacher mit Ablauf in drei Schritten,
  Fortschrittsband, Siegerkarte mit aufziehenden Balken, Aufdeckung als
  eigener Moment. Begruendungen in CLAUDE.md, Punkt 8.
- Bedienung: klebende Navigation in der Frageansicht, Tastatursteuerung
  (Ziffer / Umschalt+Ziffer / Enter), Haken auf der getroffenen Wahl,
  gefuellte Reglerspur, Fingerflaechen ab 46 px.
- Zwei Fehler dabei gefunden und behoben: die Kopfkarte behauptete einen
  Einzelsieger, auch wenn sich mehrere Parteien den Spitzenwert teilten
  (getestet: Zweier- und Dreiergleichstand); und schwarze Parteifarben waren
  im Dunkelmodus unsichtbar.
- Geprueft: alle drei Wahlen durchgespielt, 0 Konsolenfehler, kein
  waagerechter Ueberlauf bei 380 px und 1120 px, Quellenanzeige mit Markierung,
  PDF-Export unveraendert, Handrechnungen und Anonymitaetspruefung bestaetigt.

## PDF-Export neu gesetzt (9. September 2026)

- Der gemeldete Fehler - einzelne Saetze allein auf einer Seite - ist behoben:
  jede Frage ist ein geschlossener Block, Themenueberschriften haengen an
  ihrer ersten Frage. Nachgewiesen an allen drei Wahlen: 0 zerrissene Bloecke,
  0 verwaiste Ueberschriften.
- Thementeil als Matrix statt als Kachelliste; erzwungene Seitenumbrueche vor
  den Abschnitten entfallen. Ergebnis: 10-11 statt 13 Seiten, keine Seite
  unter 55 % gefuellt ausser der letzten.
- Gestaltung angeglichen: Farbtupfer und Balken je Partei, eigene Wahl in
  Gruen/Rot, Kopf- und Fusszeile, Rechenweg als abgesetzter Kasten.
- Neue Werkzeuge: `.claude/baue_pdf.js` (PDF ohne Browser) und
  `.claude/pruefe_pdf.py` (Satzpruefung).
- Oberflaeche: Umschalter hell/dunkel im Kopf, ohne Speicherung.

## Konzept 2 umgesetzt – App-Teil (9. September 2026)

Grundlage: `docs/konzept-2.md` und die entschiedene These – *Menschen wählen
Etiketten, nicht Inhalte.*

- **Punktebudget** statt Regler (10 Punkte je Thema, Schritt 5, Deckel 30).
- **Tiefe folgt den Punkten**: `A.fragenTiefe()` entscheidet, wie viele Fragen
  eines Themas gestellt werden. Damit verlängert der geplante dritte
  Fragensatz den Durchgang nicht.
- **Tipp vor dem Durchgang** und **Zuordnung „Wer war wer?“** nach den Fragen,
  beides im Ergebnis gegen den Zufallserwartungswert gestellt.
- **Stichentscheid** bei einer Spitze innerhalb von 3 Prozentpunkten.
- **Gestufte Auflösung** in drei Schritten.

Geprüft: Handrechnung um Tiefe und Budget erweitert (alle Fälle bestätigt),
Anonymität 392 Aussagetexte ohne Fund, alle drei PDF-Muster ohne Befund,
Browser-Konsole ohne Fehler.

### Offen

- **Dritte Frage je Thema** (~98 Aussagen über alle drei Wahlen). Die App
  trägt sie bereits: `fragenTiefe` deckelt auf den vorhandenen Vorrat, heute
  also auf zwei. Erst mit dem dritten Fragensatz wird aus „Kernthema“ auch
  wirklich eine dritte Frage. **Dabei die Fragenreihenfolge beachten** – sie
  ist seit Punkt 12 bedeutungstragend.
- **Doppelgänger-Probe** (zwei Zitate zum selben Sachthema, Frage: dieselbe
  Partei oder zwei?) ist entworfen, aber nicht gebaut und nicht entschieden.

## Neues Konzept: die Spielform (10. September 2026)

Der Vorwurf war berechtigt: Die vorige Runde hatte vorne und hinten etwas
angebaut, den Kern aber nicht angefasst – vier lange Programmabsätze lesen und
ordnen, zwanzig Minuten ohne eine einzige Rückmeldung. Genau das war der
langweilige Teil.

**Der neue Kern ist das Duell.** Zwei Sätze zur selben Unterfrage, einer
gewinnt. Erst nach dem Klick fliegt ein Marker in das Feld der sieben
verdeckten Kandidaten und zeigt, wem der Punkt gehört – die Entscheidung
bleibt blind, die Rückmeldung kommt sofort.

**Der Durchgang hat eine Form**: Sichtung → zwei Zwischenstände mit Wette
(„Wer ist C?") → Finale zwischen den beiden Erstplatzierten → Zuordnung →
dreistufige Aufdeckung. Die Aufdeckung ist die Verwandlung desselben Feldes:
aus C wird ein Name und eine Parteifarbe, von hinten nach vorn.

Es ist auch rechnerisch besser. Gemessen mit `.claude/pruefe_duelle.js`:

| | Vorform | Spielform |
|---|---|---|
| Gleichstand an der Spitze | 13–21 % | 5–8 % |
| Mögliche Themenwerte | nur 0 / 50 / 100 | stetig |
| Auftritte je Partei, Spanne am Ende | bis 6 | 1 |
| Auftritte nach 13 Duellen, Spanne | bis 8 | 1 |
| PDF-Seitenfüllung | 60–70 % | 77–96 % |

### Unterwegs gefundene Fehler

- **Ausgewogenheit galt nur je Thema** und lief über den Durchgang auseinander:
  nach 13 Duellen war eine Partei neunmal angetreten und eine andere einmal –
  und die mit dem einen Auftritt führte das Feld an.
- **Rohe Siegquote**: 1 aus 1 stand vor 3 aus 5. Behoben durch Glättung.
- **Überspringen per Klick lief ins Leere**, weil die Karten während der
  Animation deaktiviert sind und den Klick schluckten.
- **Verwaiste Flugmarker** blieben am Bildrand liegen, wenn man übersprang.
- **Auf dem Telefon passte nur eine der beiden Karten ins Bild.**
- **Der PDF-Export hätte in der App gebrochen** – er kannte nur die alten
  Datenformen.
- **Bei zweizeiligen Parteinamen lag die Münzwurflinie höher** als bei den
  übrigen, womit der Vergleich über diese Linie unbrauchbar wurde.

### Offen

- **Dritte Frage je Thema** (~98 Aussagen über alle drei Wahlen). Sie würde
  hier vor allem den Vorrat an Paarungen vergrößern: das Finale ist heute 2 bis
  5 Duelle lang, weil sich zwei Parteien nur 2 bis 7 Mal zur selben Unterfrage
  äußern.
- **Doppelgänger-Probe** entworfen, nicht gebaut, nicht entschieden.

## Zweite Runde an der Spielform (10. September 2026)

Nach dem ersten Durchbau ging es um Bedienung, Aussehen und Redlichkeit. Was
dabei gefunden und behoben wurde – fast alles davon waren echte Fehler, nicht
Geschmacksfragen:

**Bedienung**
- Auf dem Telefon passte nur eine der beiden Karten ins Bild. Ein Vergleich,
  für den man scrollen muss, ist keiner. Enger gesetzt und über alle 45 Duelle
  eines Durchgangs auf 375×812 nachgemessen.
- Die Nebenknopfe (Zurück, Überspringen) sahen in voller Breite aus wie das
  Ziel; auf ganz schmalen Geräten kosteten sie zwei Zeilen, die dem Vergleich
  fehlten.
- Der Umfang ist jetzt wählbar (Zügig / Normal / Gründlich). Das Budget
  verschiebt bewusst nur die Aufmerksamkeit – damit hatte der Nutzer keinen
  Hebel für die Länge, und die Länge ist der häufigste Grund abzubrechen.
  Die kleinste Stufe ist gemessen gesetzt: bei zwei Duellen je Thema teilen
  sich in 21 bis 25 % der Durchgänge zwei Parteien die Spitze, bei drei nur in
  7 bis 13 %.

**Darstellung**
- Säulen und Balken wachsen ab der 50-Prozent-Linie. Von links gemessen sahen
  43 % und 57 % fast gleich aus, obwohl das eine unter und das andere über dem
  Zufall liegt. Auch im PDF.
- Bei zweizeiligen Parteinamen lag die Münzwurflinie höher als bei den
  übrigen – womit der Vergleich über diese Linie unbrauchbar war.
- Die Startseite und der Rechenweg im Ergebnis beschrieben noch das Ranken von
  vier Aussagen und die 100/50/0-Punkte. Beides war mit der Spielform schlicht
  falsch geworden.

**Redlichkeit**
- Der Wortlaut war mit der alten Ansicht verschwunden. Er steht jetzt im
  Anhang, einzeln aufklappbar.
- Am Ende steht, was gemessen wurde und was nicht.
- Neu: **Was Sie nicht erwartet haben** – das Programm auf dem letzten Platz
  mit den Sätzen daraus, die der Nutzer selbst gewählt hat.

**Werkzeuge**
- `.claude/dom_scan.js` spielt einen Durchgang durch und durchsucht nach jedem
  Bild das DOM nach Parteinamen, Aliassen, Farben, IDs und PDF-Pfaden.
  Gemessen über 45 bis 48 Bilder in zwei Wahlen: 0 Funde.
- `.claude/pruefe_css.py` findet Regeln ohne Fundstelle im Quelltext. Beim
  ersten Lauf 16 tote Klassen, 37 Regeln entfernt (1759 → 1600 Zeilen).
- `pruefe_duelle.js` misst jetzt auch jede Umfangsstufe.
- Entfallen, weil sie tote Regeln maessen: `js/auswertung.js`,
  `pruefe_auswertung.js`, `pruefe_tiefe.js`, `sortiere_tiefe.js`.

### Stand der Prüfungen

Alle Werkzeuge ohne Befund: Spielform bestätigt, 392 Aussagetexte ohne
Anonymitätsfund, Schema aller drei Datensätze ok, PDF 12–13 Seiten mit 0
zerrissenen Blöcken und 66–96 % Füllung, 0 tote CSS-Klassen, Browser-Konsole
fehlerfrei über vollständige Durchgänge in allen drei Wahlen (auch ohne Tipp,
mit übersprungenen Duellen und ohne Zuordnung).

**Nicht prüfbar in dieser Umgebung**: der `file://`-Betrieb per Doppelklick.
Die Vorschau rendert lokale Dateien nur als Standbild. Geprüft ist dafür die
bekannte Bruchstelle im Code – kein `fetch()`, kein XHR, keine Module, keine
`import`-Anweisung; Datensätze kommen weiterhin per Script-Injection, und die
beiden modernen Aufrufe (`closest`, `navigator.vibrate`) sind abgesichert.
Einmal doppelklicken sollte man trotzdem.

## Gestaltung und Bedienung, dritte Runde (11.–13. September 2026)

Alles auf Nutzerhinweis, Details und Begruendungen in `CLAUDE.md`:

- **Zeitungspapier**: Newsprint hell, Graphit dunkel, SVG-Papiertextur
  (`.claude/baue_textur.py`, mehrfach abgeschwaecht), Zeitungskopf,
  Dachzeilen, Rasterpunkte. Keine Initiale.
- **Titelseite auf breiten Schirmen** (ab 75rem) in drei Spalten.
- **Feste Leiste** fuer Feld und Knoepfe: Hoehe von Frage und Karten fuer den
  Durchgang reserviert, Leiste sticky darunter, `main` ueber der Fusszeile.
- **Fortschrittsbogen** waechst vom letzten Stand statt von null.
- **Zweite Erwartung** vor dem Spiel (Ausschluss) und Gegenprobe-Karte im
  Ergebnis.
- **Zwei Fragen statt Punktebudget**: Umfang (3/4/6 Duelle je Thema) und
  bis zu drei Schwerpunkte (`DU.verteile`).
- **Gutschrift**: vier Marken neben dem Feld statt Marker auf einer
  verdeckten Partei.
- **Hell ist Standard**, dunkel nur per Knopf.
- **Wortlaut-Umschalter im Duell** zurueck – beide Karten zugleich,
  maskiert, gedeckelte Hoehe.

### Offen

- `file://`-Doppelklick real bestaetigen; GitHub Pages (Nutzerkonto).
- Neue Themenansicht und Dunkelmodus auf einem echten Telefon ansehen.
- Doppelgaenger-Probe: entworfen, nicht entschieden.
- Breites Zeitungslayout fuer Duell und Ergebnis (angeboten, nicht beauftragt).

## Dritte Frage je Thema (13. September 2026)

Alle 28 Themen haben jetzt drei Fragen, 106 neue Aussagen (ST 37, BE 34,
MV 35). Neue Unterfragen sind bewusst solche mit klarer Richtung und
echtem Streit: Bezahlkarte, Smartphones an Schulen, Tariftreue- und
Vergabegesetz, Netzentgelte und Strompreis, Deutschlandticket, Wolf,
Pflege-Eigenanteile, Taser/Bodycams/Videoueberwachung, Tempelhofer Feld,
A 100, Waffenverbotszonen, Drogenpolitik, Transparenz, Versiegelung.

Quellen in `.claude/quellen/<kz>.py` als `DRITTE` am Dateiende, angehaengt
an die Themen. Jede Aussage gegen das PDF geprueft.

Stand der Pruefungen: `pdftool pruefe` 299 Quellenangaben / 0 Fehler,
Anonymitaet 598 Texte / 0 Funde, `pruefe_duelle` bestaetigt (Finale jetzt
im Mittel 3,3-3,5 Duelle), PDF-Satz 3 Muster / 0 Fehler.

**Paarungsspanne gestiegen**: ST 4-10, BE 3-9, MV 2-10 (vorher 2-7). In
ST wurden zwei dritte Fragen umbesetzt (SPD statt AfD bzw. BSW), weil die
SPD dort nur 4x auf CDU und FDP traf. MV AfD+BSW bleibt bei 10: die SPD
hat zum Wolf keine verwertbare Aussage (die Stelle handelt vom Kormoran). Die
dritten Fragen haben nur 3-4 Parteien, und wer sich zu einer strittigen
Frage aeussert, ist nicht gleich verteilt. Vergleichbarkeit ging vor. Wer
nachschaerfen will: in einzelnen dritten Fragen die haeufigsten Paare
(bsw+fdp in ST, afd+bsw in MV) durch eine andere Partei ersetzen.

**Gezielte Nachschaerfung (13.09.2026)**: Die beiden schwachen
Sprachstand-Fragen sind ersetzt. ST: „Sollen Eltern fuer die Kita weiter
Beitraege zahlen?" (FDP Geschwisterregel, Gruene soziale Staffelung, Linke
beitragsfrei). MV: „Wie viele Kinder soll eine Fachkraft in der Kita
betreuen?" (AfD 1:4/1:10/1:17, CDU demografische Rendite + Perspektivplan,
SPD Zukunftsplan mit Jahreszahlen) – hebt CDU+SPD von 2 auf 3, MV-Spanne
jetzt 3-10. Verworfen: MV-Smartphones umbesetzen (nur AfD, BSW, CDU, FDP
aeussern sich; jede Variante senkt afd+bsw auf 9 und hebt cdu+fdp auf 10)
und MV-Strompreis ohne AfD/BSW (SPD nur Bilanz, FDP und Linke ohne
Aussage). afd+bsw 10x bleibt damit; ohne neue Programmstellen nicht loesbar.

**Drei vierte Fragen (13.09.2026)**, als `VIERTE` am Ende von
`.claude/quellen/<kz>.py`. Nur Parteien, die im Thema bisher einmal
auftreten – so bleibt die Auftrittsregel erfuellt, und die Frage bringt
gezielt seltene Paare zusammen:
- ST Landwirtschaft „Wie streng sollen die Regeln fuer die Nutztierhaltung
  sein?" (CDU, SPD, BSW)
- BE Klima „Wie soll Berlin vor Hitze geschuetzt werden?" (CDU, Gruene, BSW)
- MV Landwirtschaft „Wie sollen die Moore im Land geschuetzt werden?"
  (CDU, SPD, Gruene)

Spannen danach: ST 4-10, BE 4-9 (vorher 3-9), MV 4-10 (vorher 2-10 vor der
Nachschaerfung). Pruefungen: 308 Quellenangaben / 0 Fehler, 616 Texte / 0
Funde, Spielform bestaetigt, Passung 15 alte Treffer, keiner neu.
Die Spitzenpaare (ST bsw+fdp, MV afd+bsw, je 10) sind so nicht zu senken:
eine Frage kann Paare nur hinzufuegen, nie abziehen.

## Duell auf breiten Schirmen (13.09.2026)

Ab 75rem Randspalte links (Ablauf des Durchgangs, Themen mit Zaehler),
Karten rechts breiter. Gemessen auf 1600x900: Randspalte 240 px, Mitte
934 px, Karte 408 px breit und 232 px hoch, Leiste ueber neun Duelle fest
bei 522 px; Wortlaut-Umschalter verschiebt sie einmal (522 -> 539), wie
vorgesehen. 1100x800: Randspalte aus, Layout wie vorher. 375x812:
Randspalte aus, zweite Karte endet bei 705 px, kein seitliches Scrollen.
Nicht geprueft: Finale und Dunkelmodus in der breiten Fassung (Screenshot
bei 1600 im Vorschaufenster nicht moeglich).

**Laenge**: innerhalb jeder dritten Frage hoechstens Faktor 1,39 zwischen
kuerzester und laengster Kurzfassung (drei zu kurze Saetze ersetzt oder
ergaenzt, sieben zu lange gekuerzt). **Ton und Konkretheit** prueft kein
Skript – das bleibt Durchsicht von Hand.


## Durchgang auf 15 Minuten (18.09.2026)

Anlass: Ein Testnutzer brauchte fuer Normal mit drei Schwerpunkten
**25 Minuten** (Sachsen-Anhalt, 40 + 5 Duelle), angesagt waren neun. Drei
Ursachen, alle drei behoben:

1. **Alle Themen vorgewaehlt.** Die Liste startet jetzt leer; Zeilenklick
   schaltet ein Thema an, das Druckquadrat macht daraus einen Schwerpunkt,
   Weiter ab drei Themen.
2. **Keine Obergrenze.** Gesamtzahl jetzt hoechstens 18 / 28 / 38 Duelle
   (Zuegig / Normal / Gruendlich), Gruendlich von 6 auf 5 Duelle je Thema,
   Finale von 5 auf 3, nur ein Zwischenstand unter 16 Duellen.
3. **Zu lange Texte.** Alle 308 Kurzfassungen von Ø 220 auf Ø 105-114 Zeichen
   gekuerzt (1-2 Saetze), Laengengleichheit je Frage wiederhergestellt
   (0 Fragen ueber 15 % Unterschied, vorher 19 / 16 / 17).

Gemessen danach (im Browser, Sachsen-Anhalt): vier Themen auf Zuegig
= 15 Duelle, Ansage 9 Minuten; fuenf Themen auf Normal = 23 Duelle,
10 Minuten; alle zehn Themen auf Normal = 31 Duelle, 15 Minuten. Leiste ueber
sechs Duelle fest auf 65 px.

Trennschaerfe (`pruefe_duelle.js`, jetzt **mit** Finale gewertet): geteilte
Spitze 3 bis 6 % statt vorher 5 bis 8 % - trotz halb so vieler Duelle, weil
das Finale die Spitze aufloest. Ohne Finale gerechnet waeren es 13 bis 18 %.

Alle Pruefungen gruen: pdftool 308 Quellenangaben 0 Fehler, Anonymitaet
616 + 220 Texte 0 Funde, pruefe_pdf 3 Muster 0 Fehler, pruefe_css 0 tote
Klassen, Passung 1 Treffer (Praezisierung, geprueft).

**Offen**: Der eigentliche Nachweis ist der naechste Testlauf mit echtem
Nutzer - die 22 Sekunden je Duell in `minuten()` sind eine Annahme, bis
jemand sie gestoppt hat.

## Begriffe erklaeren (18.09.2026)

Anlass: Nutzerhinweis an drei Fragen in Folge - "Soll Berlin die Bezahlkarte
fuer Gefluechtete nutzen?", "Soll die A 100 weitergebaut werden?", "Soll Berlin
ein eigenes Vergabegesetz behalten?" - "keine Ahnung was das ist, USW".

Neu: ein Glossar im Datensatz (`begriffe`), gepflegt in
`.claude/quellen/begriffe.py` (55 Eintraege), uebernommen wird je Datensatz
nur, was dort vorkommt (ST 25, BE 30, MV 19). Anzeige in `js/begriffe.js`:

- **Fragetext**: das Wort selbst gepunktet unterstrichen, Erklaerung bei
  Mauszeiger, Tastaturfokus oder Tipp.
- **Unter beiden Karten**: Zeile "Begriffe: ..." fuer Woerter aus den
  Aussagen. Bewusst NICHT in der Karte - eine Linie in nur einer der zwei
  Aussagen waere ein Unterschied im Schriftbild genau dort, wo entschieden
  wird. Was in der Frage schon markiert ist, wird nicht wiederholt.
- **PDF**: Begriffsverzeichnis vor den Quellen, nur mit den Woertern des
  gespielten Durchgangs.

Gemessen im Browser (Berlin, alle Themen, Normal): Leiste ueber sechs Duelle
fest auf 508 px - die Begriffszeile wird in `messeMitte` mitgemessen und
bleibt ohne Treffer unsichtbar stehen. Blase 384 px breit, 8 px unter dem
Wort, klappt am Fensterrand nach oben.

Abdeckung: 12 von 31 (ST), 12 von 28 (BE), 10 von 28 (MV) Fragen tragen
mindestens einen Begriff; die uebrigen Fragen sind Alltagsdeutsch. Neue
Pruefung `node .claude/pruefe_begriffe.js` (tote Eintraege, Parteinamen in
Erklaerungen, Laenge, nur-im-Wortlaut). 5 Hinweise: Agri-PV, Repowering,
Bodycams, Volksentscheid, multiprofessionelle Teams stehen nur im Zitat.

**Offen**: Ob ein Wort erklaerungsbeduerftig ist, entscheidet kein Skript.
Wenn weitere Fragen auffallen, gehoert das Wort in begriffe.py - mehr ist
nicht noetig.

## Ergebnisse, Sitzungsspeicher, Uhr (24.09.2026)

- **Titelseite**: vorlaeufige amtliche Zweitstimmen Berlin und M-V im
  Manifest (`data/wahlen.js`), Quelle je Wahl. BSW/Sonstige M-V und die
  Nachkommastellen Berlin ueber wahlrecht.de (beruft sich auf die
  Landeswahlleitungen).
- **Zurueck-Geste im Quellenviewer** schliesst nur den Viewer
  (`pushState`/`popstate` in `js/quelle.js`). Vorher verliess sie auf dem
  Telefon die App samt Durchgang.
- **Sitzungsspeicher** (CLAUDE.md Abschnitt 15): Durchgaenge und offene
  Ansicht in `sessionStorage`, Verweise statt Kopien. Neu laden getestet
  mitten im Spiel, auf dem Ergebnis und auf der Titelseite.
- **Alle Themen wieder vorgewaehlt** (Nutzerwunsch, Leerstart
  zurueckgenommen). Alle zehn Themen: Zuegig 21 Duelle / ~11 min,
  Normal 31 / ~14 min.
- **Uhr** (CLAUDE.md 4d): vorwaerts, nur bei sichtbarem Tab, vom ersten
  Duell bis zur Aufdeckung; im Ergebnis, auf der Titelseite, im PDF.

**Offen**: Zuegig mit allen Themen liegt bei ~11 statt unter 10 Minuten
(Vorschlag: `obergrenze` Zuegig 18 -> 14). Echte Zeiten von Testern
stehen aus; die Uhr liefert sie jetzt.
