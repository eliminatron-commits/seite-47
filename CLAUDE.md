# CLAUDE.md – Seite 47

Clientseitiger Wahlhelfer als Alternative zum Wahl-O-Mat. Nutzer gewichten Themen,
bewerten **anonymisierte** Positionen aus echten Wahlprogrammen und erfahren erst
auf der Ergebnisseite, welche Partei hinter welcher Aussage stand.

Kein Backend, kein Build-Schritt, kein Framework, kein Tracking. Deployment als
statische Seite (GitHub Pages). Oberfläche und Inhalte durchgängig **deutsch**.

## Ordnerstruktur

```
index.html              Einstiegspunkt; bindet Datenmanifest + App-Skripte ein
css/style.css           Gesamte Gestaltung (neutrale Palette, Parteifarben erst nach Aufdeckung)
js/daten.js             Datenschicht: Manifest, Laden, Schemaprüfung  -> window.S47_DATA
js/auswertung.js        Reine Rechenlogik, DOM-frei                    -> window.S47_AUSWERTUNG
js/quelle.js            Quellenanzeige (PDF.js-Viewer + Fallback)      -> window.S47_QUELLE
js/export.js            Ergebnis-Export als PDF                        -> window.S47_EXPORT
js/app.js               Ablauf + Oberfläche; enthält keine Wahlinhalte
data/wahlen.js          Manifest der Wahlen (reine Daten)
data/wahlen/<id>.js     Je Wahl ein Datensatz (JSON-Nutzlast im Script-Wrapper)
data/programme/<kz>/    Wahlprogramm-PDFs je Region (st | be | mv)
assets/logos/           Parteilogos – nur auf der Ergebnisseite verwendet
vendor/                 Mitgelieferte Bibliotheken (PDF.js, pdfmake) – nie CDN
schema/wahl.schema.json Verbindliches Schema eines Wahl-Datensatzes (Version 2)
docs/                   Rechercheprotokoll, Quellenliste
PROGRESS.md             Wiedereinstiegspunkt: abgeschlossene/nächste Phase
```

## Benennung

- Bezeichner, Dateinamen und Kommentare auf Deutsch (`zustand`, `gewichte`, `aussageKarte`).
- Globale Namen mit Präfix `S47_`. Kein anderes Global.
- CSS-Klassen nach BEM-Muster mit deutschen Wörtern: `.karte--aussage`, `.knopf--haupt`.
- Wahl-IDs: `<wahlart>-<land>-<jahr>`, z. B. `lt-st-2026`, `agh-be-2026`.
- Aussage-IDs: `<kz>-a<NNN>` – **undurchsichtig**, ohne Parteibezug (sie stehen im DOM).

## Zentrale Designentscheidungen

**1. Datenladen per Script-Injection statt `fetch()`.**
Die App muss per Doppelklick auf `index.html` laufen (`file://`). Dort blockieren
alle gängigen Browser `fetch()`/XHR auf lokale Dateien (Origin `null`). Ein
Wahl-Datensatz ist deshalb eine `.js`-Datei, deren Inhalt aus reinem JSON in
einem einzeiligen Aufruf `window.S47_DATA.register( … )` besteht. Der Datensatz
bleibt damit maschinell erzeugbar und prüfbar, ohne Server-Zwang.

**2. Datenbasis strikt von der App getrennt.**
`js/`, `css/` und `index.html` enthalten null Inhalte einzelner Wahlen. Eine neue
Wahl entsteht durch: Datensatzdatei unter `data/wahlen/`, PDFs unter
`data/programme/`, ein Eintrag in `data/wahlen.js`. Sonst nichts.

**3. Anonymität ist eine Datenstruktur-Eigenschaft, nicht nur eine Anzeigefrage.**
Vor der Aufdeckung wandert kein parteibezogenes Datum in den DOM: keine
`parteiId`, kein Name, keine Farbe, kein Logo, kein PDF-Dateiname. Die
Aussagen-Reihenfolge wird je Thema pro Sitzung zufällig gemischt
(Fisher-Yates), aber stabil gehalten, damit Zurückspringen die Reihenfolge nicht
verrät. Die Bewertungsansicht kennt nur `id`, `kurz` und `original`. Auch die
**Aussagentexte selbst** dürfen keine ableitbaren Marker enthalten (Nummern,
Kürzel, Formulierungseigenheiten).

**Maskierung von Parteinamen im Zitat.** Originalzitate nennen regelmäßig die
eigene Partei („Die AfD fordert“, „Wir Freie Demokraten“, „Das BSW will“). Der
Fassungs-Toggle wäre damit ein direkter Weg zur Aufdeckung. `S47_DATA.anonymisiere()`
ersetzt deshalb vor der Aufdeckung jeden Parteinamen durch „[Partei]“. Welche
Namen das sind, steht **im Datensatz** (`parteien[].name` + `parteien[].alias`),
nicht im App-Code – eine neue Wahl bringt ihre Namen selbst mit. Die Ersetzung
greift nur auf ganze Wörter: „Grünem Wasserstoff“ bleibt unangetastet, „Grüne
Berufe“ wird maskiert. Nach der Aufdeckung erscheint das Zitat unverändert.

**4. Bewertung durch Vergleich statt durch Zustimmung (Schema 2).**
Nicht mehr „Stimmen Sie dieser Aussage zu?“, sondern: zu einer Unterfrage
stehen **3–4 Aussagen verschiedener Parteien** nebeneinander, und der Nutzer
wählt die **beste und die schlechteste**. Grund: Wahlprogrammsätze sind so
formuliert, dass man ihnen schwer widerspricht („Verwaltung soll schneller
werden“). Die Skala Zustimmung/Neutral/Ablehnung lief deshalb auf lauter
Zustimmung hinaus, und alle Parteien landeten nahe beieinander. Der erzwungene
Vergleich unterscheidet. Die volle Reihenfolge 1–4 wäre feiner, kostet aber je
Frage so viel Aufwand, dass über ~30 Fragen abgebrochen wird; beste und
schlechteste liefern den Großteil der Information für zwei Tipps.

Ein **Thema** hat deshalb mehrere **Fragen**; die Aussagen einer Frage müssen
dieselbe Unterfrage beantworten, sonst ist der Vergleich sinnlos („mehr
Polizisten“ gegen „mehr Prävention“ ist vergleichbar, gegen „digitale
Aktenführung“ nicht.)

**4a. Ausgewogenheit ist Teil der Datenqualität, nicht Geschmackssache.**
Weil eine Frage nur 3–4 der Parteien zeigt, hängt der Wert einer Partei davon
ab, **gegen wen** sie antritt: wer regelmäßig neben der unbeliebtesten Position
steht, gewinnt Punkte ohne eigenes Zutun. Zwei Regeln halten das in Schach:
- **Gleich viele Auftritte je Thema** (Abweichung höchstens 1). Das prüft
  `S47_DATA.pruefe` als Fehler.
- **Rotierende Paarungen**: möglichst gleich oft trifft jedes Parteienpaar
  aufeinander. `S47_DATA.ausgewogenheit()` liefert die Zahlen, und
  `baue_datensatz.py` gibt die Spanne bei jedem Bauen aus.

  Anders als die Auftrittszahl lässt sich das **nicht erzwingen**: wer zusammen
  in einer Frage steht, ergibt sich daraus, wer dieselbe Unterfrage beantwortet.
  **Vergleichbarkeit geht vor Statistik** – eine Frage, deren Aussagen nicht
  dasselbe beantworten, ist wertlos, eine leicht schiefe Paarung nur unschön.
  Gemessen wurde: rein maschinell gruppiert 3–5, inhaltlich gruppiert zunächst
  1–8, nach gezieltem Umsortieren dort, wo beide Zuordnungen sachlich tragen,
  **2–7**. Auffällige Häufungen (Linke+BSW 8×, CDU+AfD 8×) entstanden dadurch,
  dass dieselben Parteien regelmäßig in der Restgruppe landeten; sie wurden
  einzeln aufgelöst. Beim Ergänzen einer Frage die Spanne im Blick behalten.

**4b. Rechnung.**
Punktwert innerhalb einer Frage: beste 100, schlechteste 0, dazwischen 50.
Eine Frage zählt nur, wenn **beide** Enden gesetzt sind; unbeantwortete Fragen
fallen für **alle** Parteien heraus. Eine Ersatzannahme wäre hier nicht neutral
– sie zöge die Parteien einer Frage künstlich gleich. (In Schema 1 zählte
Unbeantwortet noch wie Neutral; das entfällt.)
Themenwert einer Partei = Mittel ihrer Punktwerte über die beantworteten Fragen
dieses Themas, in denen sie vorkommt – gemittelt, nicht summiert, weil nicht
jede Partei in jeder Frage steht.
Gesamtwert = `Σ(gewicht_t × themenwert_{p,t}) / Σ(gewicht_t)` über die Themen
mit Gewicht > 0, zu denen die Partei mindestens eine beantwortete Frage hat.
Die Nenner unterscheiden sich damit bewusst je Partei.

**4c. Gewichtung stufenlos, mit rastender Null.**
Der Regler liefert 0–100 statt vier Stufen: sichtbare Stufen verankern die
Nutzer auf der mittleren Beschriftung. Ein Ende bleibt aber eine echte
Schwelle – 0 schließt das Thema aus der Abfrage aus und darf nicht versehentlich
beim Wischen entstehen. Die Beschriftung (`gewichtLabel`) ist reine Anzeige,
gerechnet wird mit dem Zahlenwert.

**5. PDF-Export mit pdfmake (Phase 4).**
Gewählt gegenüber jsPDF und `window.print()`:
- **Umlaute**: pdfmake bettet eine vollständige TTF (Roboto) als Base64-VFS ein
  und kodiert nach Unicode. jsPDFs Standardschriften laufen über WinAnsi und
  brauchen für zuverlässige Umlaute ohnehin eine manuell eingebettete Schrift –
  denselben Aufwand, ohne den Rest.
- **Sauberer Satz**: pdfmake hat ein Layout-Modell mit automatischem Seitenumbruch,
  Tabellen mit Zeilenumbruch, Kopf-/Fußzeilen und Seitenzahlen. Genau das braucht
  der Anhang mit sämtlichen Nutzerantworten. jsPDF setzt Text koordinatenweise;
  Umbruchlogik müsste man selbst schreiben.
- **Offlinefähig**: pdfmake läuft als zwei lokale Dateien (`pdfmake.min.js`,
  `vfs_fonts.js`) ohne Netz – Voraussetzung für den `file://`-Betrieb.
- `window.print()` scheidet aus, weil Ausgabe und Seitenumbruch vom Browser und
  den Druckeinstellungen des Nutzers abhängen und der Anhang nicht steuerbar wäre.

**6. Quellenanzeige mit Fallback zuerst.**
`S47_QUELLE.zeige()` liefert `false`, wenn der eingebettete PDF.js-Viewer nicht
verfügbar ist oder scheitert; die App öffnet dann `datei#page=N` extern. Der
Fallback ist der Normalpfad, der Inline-Viewer die Verbesserung – nicht umgekehrt.
Grund: Inline-Rendering ist auf Mobil-Browsern unzuverlässig.

Der Viewer rendert die hinterlegte Seite auf ein Canvas und legt die Markierung
als Kästchen darüber. Die Fundstelle wird dazu in der Textlage von PDF.js
gesucht; deren Normalisierung in `js/quelle.js` (Ligaturen, Strichvarianten,
Silbentrennung am Zeilenende, Leerraum) **muss dieselbe sein wie in
`.claude/pdftool.py`** – die Markierungen im Datensatz sind gegen dieses
Werkzeug geprüft. Weicht sie ab, findet der Viewer Stellen nicht wieder, die
`pruefe` bestätigt. Zeichnen und Markieren laufen getrennt: die Hervorhebung
erscheint, sobald die Textlage da ist, unabhängig vom Malen der Seite.

Auf schmalen Geräten wird die Seite mit mindestens 560 px Breite gemalt statt
auf Fensterbreite gestaucht (unlesbar); die Bühne scrollt dann waagerecht und
springt zur Markierung.

Unter `file://` meldet `verfuegbar()` bewusst `false`: PDF.js lädt das PDF per
XHR, was der Browser bei lokalen Dateien blockiert. Dort ist der externe
Aufruf `datei#page=N` der einzige und ausreichende Weg.

## Verbotene Ansätze

- **Kein `fetch()`/XHR auf Projektdateien** – bricht unter `file://`.
- **Kein CDN**, keine externen Schriften, keine Analytics, keine Zählpixel.
- **Kein Build-Schritt**, kein npm, keine Module (`import`/`export`) – klassische
  `<script>`-Tags, ES5-verträglicher Stil.
- **Keine Wahlinhalte im App-Code.** Auch keine Themenlisten, Parteinamen oder
  Farben in `js/` oder `css/` – Parteifarben stehen im Datensatz.
- **Kein `innerHTML` mit Datensatzinhalten.** Ausschließlich `textContent`.
- **Keine Speicherung** in `localStorage`/`sessionStorage`/Cookies – Antworten
  leben nur im Speicher der Sitzung.
- **Keine wahlübergreifend vereinheitlichte Themenliste** – Themen werden je Wahl
  eigenständig aus den Programmen abgeleitet.
- **Keine erfundenen Quellen.** Findet sich ein Programm nicht, wird es in
  `PROGRESS.md` dokumentiert und die Partei entfällt für die betroffenen Themen.
- **Keine Konfidenz- oder Unsicherheitsskala** bei der Bewertung (Nicht-Ziel).
- **Keine Frage mit weniger als 3 oder mehr als 4 Aussagen** und nie zwei
  Aussagen derselben Partei in einer Frage.

**7. Fingerflächen an `pointer: coarse`, nicht an der Fensterbreite.**
Ein schmales Fenster am Rechner ist keine Touch-Bedienung. Die Vergrößerung
von Zitat-Umschalter, Slider-Griff und Schließen-Knopf auf 44 px hängt deshalb
an `@media (pointer: coarse)`; reine Layoutfragen (Knopfreihen, Abstände,
Vollbild-Viewer) bleiben an `max-width`.

## Redaktionelle Regel für Aussagen (Phase 2)

Vereinfachte Fassung und Originalzitat sagen inhaltlich dasselbe. Über alle
Parteien hinweg gleiche Länge (2–3 Sätze), gleicher Ton, gleiche Konkretheit,
keine Wertung. Jede Aussage trägt Partei, PDF-Datei, Seitenzahl und den wörtlich
zu markierenden Textausschnitt.

**Seit Schema 2 gilt das nicht mehr nur im Durchschnitt, sondern innerhalb
jeder einzelnen Frage.** Drei bis vier Aussagen stehen dort direkt
untereinander und laden zum Stilvergleich ein – und Stil verrät die Partei
zuverlässiger als Inhalt. Weicht eine der Aussagen einer Frage in Länge, Ton
oder Konkretheit ab, ist sie identifizierbar, auch wenn kein Parteiname fällt.
Zweite Anforderung: alle Aussagen einer Frage müssen dieselbe Unterfrage
beantworten und echte Alternativen sein – und zwar **satzweise**, nicht nur
im Kern.

Der praktische Fallstrick: Programme, die nur als Kurzfassung mit
Stichpunktlisten vorliegen, zwingen dazu, mehrere unverbundene Forderungen
unter einer Überschrift zu bündeln. Gemessen an Aussagen, deren Zitat mehrere
Stichpunkte aneinanderreiht: AfD Sachsen-Anhalt 9 von 10 (24-seitiges
Kurzprogramm), alle anderen Parteien dort 0 bis 1 (61 bis 150 Seiten
Fließtext). Ein so mitgeschleppter Fremdsatz stört nicht nur den Vergleich –
weil er nur bei einer Partei auftritt, ist er ein Erkennungsmerkmal. Beim
Zuschneiden einer Frage deshalb jede Aussage Satz für Satz prüfen
(`pruefe_passung.py` hilft beim Sortieren).

## Prüfen

Kein Testframework, aber zwei Skripte und eine Handrechnung. Node liegt nicht
auf dem PATH: `export PATH="/c/Program Files/nodejs:$PATH"` voranstellen.

1. `index.html` doppelklicken (`file://`) – die App muss ohne Netz und ohne Server
   vollständig durchspielbar sein.
2. Browser-Konsole: keine Fehler; `S47_DATA.pruefe(datensatz)` meldet
   Schemaverstöße einschließlich der Ausgewogenheitsregel.
3. `node .claude/pruefe_auswertung.js` – rechnet die Auswertung an einem
   Miniaturdatensatz gegen von Hand ausgerechnete Werte nach (Mittelung je
   Partei, Gewichtung, halbe Antworten, Gewicht 0).
4. `node .claude/pruefe_anonymitaet.js data/wahlen/*.js` – kein Parteiname
   überlebt die Maskierung in `kurz`, `original`, Frage- und Thementexten.
5. `python .claude/pruefe_passung.py` – listet angehängte Sätze („Zudem …“,
   „Auch …“), die nichts mit ihrer Unterfrage zu tun haben. Jeder Treffer ist
   von Hand zu beurteilen; die meisten sind harmlose Präzisierungen. Prüfen
   heißt hier: beantwortet dieser Satz noch die Frage? Wenn nicht, streichen.
6. Vor der Aufdeckung zusätzlich im Browser das DOM durchsuchen – kein
   Parteiname, keine Parteifarbe, kein PDF-Pfad, keine `parteiId`.
   **Dabei jede Aussage auf das Originalzitat umschalten**: Zitate landen erst
   durch den Toggle im DOM, ein Scan ohne sie übersieht genau die riskanten
   Texte.
7. Quellenanzeige: über den lokalen Server (`.claude/launch.json`, Port 8147)
   `S47_QUELLE._finde(textlage, markierung)` gegen **alle** Quellenangaben eines
   Datensatzes laufen lassen – findet die Textlage eine Markierung nicht, bleibt
   die Seite ohne Hervorhebung, ohne dass ein Fehler sichtbar wird.
8. Datenseitig `python .claude/pdftool.py pruefe` (Seitenzahlen und
   Markierungen gegen die PDFs).
