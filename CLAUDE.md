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
schema/wahl.schema.json Verbindliches Schema eines Wahl-Datensatzes
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

**4. Auswertung.**
Punktwert je Aussage aus Sicht der dahinterstehenden Partei:
Zustimmung 100, Neutral 50, Ablehnung 0. Unbeantwortet zählt wie Neutral (50),
damit Überspringen keine Partei begünstigt; die Anzahl offener Aussagen wird vor
der Aufdeckung ausgewiesen, damit diese Annahme nicht unbemerkt bleibt.
Themenwert einer Partei = Punktwert ihrer Aussage zu diesem Thema.
Gesamtwert = `Σ(gewicht_t × themenwert_{p,t}) / Σ(gewicht_t)`, jeweils nur über
Themen mit Gewicht > 0, zu denen die Partei eine Position hat. Fehlt einer Partei
zu einem Thema die Position, entfällt dieses Thema **nur für sie**; die Nenner
unterscheiden sich dann bewusst je Partei. Gewicht 0 („Nicht wichtig") schließt
das Thema auch aus der Abfrage aus.

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

## Redaktionelle Regel für Aussagen (Phase 2)

Vereinfachte Fassung und Originalzitat sagen inhaltlich dasselbe. Über alle
Parteien hinweg gleiche Länge (2–3 Sätze), gleicher Ton, gleiche Konkretheit,
keine Wertung. Jede Aussage trägt Partei, PDF-Datei, Seitenzahl und den wörtlich
zu markierenden Textausschnitt.

## Prüfen

Kein Testframework. Manuell:
1. `index.html` doppelklicken (`file://`) – die App muss ohne Netz und ohne Server
   vollständig durchspielbar sein.
2. Browser-Konsole: keine Fehler; `S47_DATA.pruefe(datensatz)` meldet Schemaverstöße.
3. Vor der Aufdeckung DOM durchsuchen – kein Parteiname, keine Parteifarbe auffindbar.
   **Dabei jede Aussage auf das Originalzitat umschalten**: Zitate landen erst
   durch den Toggle im DOM, ein Scan ohne sie übersieht genau die riskanten Texte.
