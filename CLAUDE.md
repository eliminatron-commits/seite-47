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
js/duelle.js            Paarbildung, Verteilung, Wertung (DOM-frei)    -> window.S47_DUELLE
js/spiel.js             Duell, Zwischenstand, Finale, Aufdeckung       -> window.S47_SPIEL
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

**4. Bewertung durch Duelle (Spielform).**
Nicht „Stimmen Sie zu?" und auch nicht mehr „ordnen Sie diese vier": zu einer
Unterfrage stehen **genau zwei Aussagen verschiedener Parteien** nebeneinander,
und der Nutzer wählt eine davon. Zwei Gründe, die zusammenhängen:

- **Aufwand.** Vier Programmabsätze zu lesen und zu ordnen kostete fast eine
  Minute. Über zwanzig Fragen war das Arbeit, kein Spiel – und die Rückmeldung
  kam erst ganz am Schluss. Ein Duell ist die kleinste mögliche Entscheidung
  und in Sekunden getroffen.
- **Auflösung.** Innerhalb einer Frage gab es nur drei Werte (100/50/0), und
  jede Partei trat je Thema nur wenige Male an. Ein Themenwert konnte deshalb
  bloß 0, 50 oder 100 sein; die Spitze war in 13–21 % der Durchgänge geteilt.
  Mit Siegquoten über viele Paarungen entsteht eine stetige Skala; gemessen
  sinkt der Gleichstand auf 5–8 % (`.claude/pruefe_duelle.js`).

Die Zustimmungsskala war schon vorher verworfen worden: Programmsätze sind so
formuliert, dass man ihnen schwer widerspricht („Verwaltung soll schneller
werden"), die Skala lief auf lauter Zustimmung hinaus und alle Parteien landeten
nahe beieinander. Der erzwungene Vergleich unterscheidet.

Ein **Thema** hat weiterhin mehrere **Fragen** mit je 3–4 Aussagen im Datensatz;
daraus bildet `S47_DUELLE.plan()` die Paare. Beide Aussagen eines Duells müssen
dieselbe Unterfrage beantworten, sonst ist der Vergleich sinnlos („mehr
Polizisten" gegen „mehr Prävention" ist vergleichbar, gegen „digitale
Aktenführung" nicht).

**4a. Ausgewogenheit ist Teil der Datenqualität, nicht Geschmackssache.**
Weil eine Frage nur 3–4 der Parteien zeigt, hängt der Wert einer Partei davon
ab, **gegen wen** sie antritt: wer regelmäßig neben der unbeliebtesten Position
steht, gewinnt Punkte ohne eigenes Zutun. Zwei Regeln halten das in Schach:
- **Gleich viele Auftritte je Thema** (Abweichung höchstens 1). Das prüft
  `S47_DATA.pruefe` als Fehler.
- **Rotierende Paarungen**: möglichst gleich oft trifft jedes Parteienpaar
  aufeinander. `S47_DATA.ausgewogenheit()` liefert die Zahlen, und
  `baue_datensatz.py` gibt die Spanne bei jedem Bauen aus.

  **Seit der Spielform gilt beides auch WAEHREND des Durchgangs.** Der
  Auftrittszähler in `S47_DUELLE.plan()` läuft über alle Themen hinweg, und der
  fertige Plan wird gierig aufgefädelt statt gemischt: als nächstes kommt
  immer das Duell, dessen beide Parteien bisher am seltensten dran waren.
  Grund: Das Feld zeigt einen laufenden Stand und wird beim Zwischenstand zur
  Wette gemacht. Gemessen war vorher nach 13 Duellen eine Partei neunmal
  angetreten und eine andere einmal – und die mit dem einen Auftritt führte
  das Feld an. Danach: Spanne 1, jede Partei mindestens dreimal dabei.

  Anders als die Auftrittszahl lässt sich die Paarungshäufigkeit **nicht
  erzwingen**: wer zusammen
  in einer Frage steht, ergibt sich daraus, wer dieselbe Unterfrage beantwortet.
  **Vergleichbarkeit geht vor Statistik** – eine Frage, deren Aussagen nicht
  dasselbe beantworten, ist wertlos, eine leicht schiefe Paarung nur unschön.
  Gemessen wurde: rein maschinell gruppiert 3–5, inhaltlich gruppiert zunächst
  1–8, nach gezieltem Umsortieren dort, wo beide Zuordnungen sachlich tragen,
  **2–7** (bei zwei Fragen je Thema). Mit der dritten Frage je Thema (September
  2026) stieg die Spanne auf 2–10: wer sich zu einer strittigen Unterfrage
  äußert, ist nicht gleich verteilt; einzelne dritte Fragen wurden gezielt
  umbesetzt, wo ein anderes Programm dieselbe Frage beantwortet. Auffällige Häufungen (Linke+BSW 8×, CDU+AfD 8×) entstanden dadurch,
  dass dieselben Parteien regelmäßig in der Restgruppe landeten; sie wurden
  einzeln aufgelöst. Beim Ergänzen einer Frage die Spanne im Blick behalten.

**4b. Rechnung.**
Punktwert gibt es nicht mehr, gewertet wird die **Siegquote**: Wie oft wurde ein
Programm gewählt, wenn es angetreten ist? Übersprungene Duelle zählen für
niemanden.

**Geglättet mit einer Vorannahme von einem halben Sieg und einer halben
Niederlage** (Laplace, k = 1). Die rohe Quote behandelt 1 aus 1 wie 5 aus 5 – im
laufenden Spiel führte damit regelmäßig ein Programm mit einem einzigen
Auftritt vor einem mit fünf. Das ist keine Rundungsfrage, sondern eine falsche
Aussage. Nebenwirkung, die erwünscht ist: 100 % kämen sonst schon nach einem
Duell zustande und behaupteten eine Sicherheit, die die Daten nicht hergeben
(4 aus 4 ergibt 90 %, nicht 100 %).

Themenwert einer Partei = ihre geglättete Siegquote in den Duellen dieses
Themas, in denen sie angetreten ist.
Gesamtwert = `Σ(punkte_t × themenwert_{p,t}) / Σ(punkte_t)` über die Themen mit
Punkten > 0, zu denen die Partei mindestens ein gespieltes Duell hat.
Die Nenner unterscheiden sich damit bewusst je Partei.

**4c. Zwei Fragen statt Rechenaufgabe.**
Vorgaenger war ein Punktebudget: 90 Punkte in Fuenferschritten auf die Themen
verteilen, bis die Kasse auf null steht, dazu ein zweiter Regler "Umfang". Die
Idee dahinter war richtig - wo alles wichtig ist, wiegt nichts -, die Bedienung
nicht: eine Rechenaufgabe mit Restbetrag, deren Ergebnis niemand vorhersagen
konnte, und das eigentliche Anliegen ("diese zwei Themen sind mir wichtig")
liess sich nur ueber Umwege ausdruecken. Vom Nutzer als unfertig
zurueckgewiesen.

Jetzt zwei Fragen (`ANSICHTEN.gewichtung`):
1. **Wie lange?** Drei Karten mit echten Zahlen - Zuegig / Normal / Gruendlich
   entsprechen **3 / 4 / 6 Duellen je Thema** (`DU.UMFAENGE`), angezeigt als
   Duelle und Minuten.
2. **Worauf kommt es an?** Hoechstens **drei Schwerpunkte**
   (`SCHWERPUNKT_MAX`) per Klick auf die Themenzeile; einzelne Themen lassen
   sich mit x ganz abwaehlen.

Gerechnet wird weiter mit Zahlen, nur eingegeben nicht mehr: abgewaehlt 0,
normal 10, Schwerpunkt 20. `DU.werte` gewichtet damit unveraendert.

**Die Laenge haengt an der Tiefe, nicht am Gewicht.** Gesamtzahl = Tiefe x
aktive Themen; `DU.verteile` verteilt sie proportional zum Gewicht, mit
`MINDEST_TIEFE` 2 als Boden und dem Vorrat des Themas als Deckel, Rest nach
groesstem Bruchteil. Damit gilt der Grundsatz von vorher weiter: Die
Gewichtung verschiebt nur, wo genauer gefragt wird, sie verlaengert nie.
Kuerzer wird es nur, wenn man Themen abwaehlt - und das ist die ehrliche
Folge.

Die kleinste Stufe ist 3 und nicht weniger: Gemessen bricht die Trennschaerfe
unterhalb von drei Duellen je Thema ein (bei zweien 21 bis 25 % geteilte
Spitze, dasselbe Niveau wie in der Vorform). `pruefe_duelle.js` misst jede
Stufe; die Trennschaerfewerte schwanken leicht, weil dort mit Zufallsantworten
simuliert wird.

**4d. Der Bogen des Durchgangs.**
Vierzig gleiche Klicks sind kein Spiel, sondern eine Liste. Der Durchgang hat
deshalb eine Form (`js/spiel.js`):

- **Sichtung** – Duelle quer durch die Themen, verteilt nach Umfang und Schwerpunkten (4c).
- **Zwischenstand**, zweimal (bei 32 % und 68 %) – das Feld groß, dazu eine
  **Wette**: „Wer ist C?" Mitten im Lauf, allein aus Sätzen, ohne Namen. Im
  Ergebnis steht, nach wie vielen Duellen der Tipp fiel.
- **Finale** – die beiden Erstplatzierten treten direkt gegeneinander an, 2 bis
  5 Duelle. Das ersetzt den früheren Stichentscheid, der nur bei knapper Spitze
  kam und deshalb meistens ausfiel; ein Höhepunkt, den es meistens nicht gibt,
  ist keiner. Die Länge hängt daran, wie oft sich die Finalisten zur selben
  Unterfrage äußern; mit drei Fragen je Thema im Mittel 3,3–3,5 Duelle.

**4e. Erst wählen, dann sehen – aber nie Satz für Satz.**
Nach dem Klick fliegt ein Marker aus der gewählten Karte in die
**Gutschrift** – vier Marken links neben dem Feld der sieben verdeckten
Kandidaten (Buchstaben, je Sitzung neu ausgelost). Vorher landete er in der
Mitte des Feldes und damit auf einer verdeckten Partei; der Nutzer hat das zu
Recht beanstandet, denn dort hat ein Zeiger nichts zu suchen. Die Marken
zeigen zugleich, wie viele Duelle bis zur nächsten Welle offen sind. Die Entscheidung
bleibt blind und damit unbeeinflusst vom Zwischenstand. Umgekehrt – Kandidat
sichtbar, dann wählen – wäre das Spiel eine Selbstbestätigung: man füttert, wer
ohnehin vorn liegt.

**Der Rückweg war die eigentliche Lücke, und er war lange offen.** Gesichert
war nur die eine Richtung (der Zwischenstand darf die Wahl nicht beeinflussen).
Die andere stand sperrangelweit auf: Wer einen Satz an Inhalt oder Ton erkannte
und danach genau eine Säule wachsen sah, hatte den Buchstaben – und behielt ihn
für den ganzen Durchgang, weil die Auslosung eine Sitzung lang hält. **Ein
einziger erkannter Satz deckte eine Partei über vierzig Duelle hinweg auf**,
drei davon das halbe Feld. Vom Nutzer gemeldet, nicht von einer Prüfung
gefunden – die Prüfungen suchten nach Parteinamen im DOM und fanden keine, denn
hier stand nie einer. Verraten hat es die **Bewegung**.

Drei Dinge machten es leicht, und alle drei sind weg:
- Der **Marker trug den Buchstaben** – die Zuordnung war nicht angedeutet,
  sondern ausgeschrieben.
- **Genau eine Säule blinkte** (`chip--treffer`) – der Zeigefinger daneben.
- Die Säulen zeigten den **exakten Zähler** („2/2"). Zwei Bilder
  nebeneinanderlegen, Differenz bilden, fertig.

Gebucht wird jetzt in **Wellen** (`WELLE = 4`): Der Punkt wandert erst in die
Gutschrift, das Feld bewegt sich alle vier Duelle – dann aber als Ganzes. Weil
jedes Duell Sieger **und** Verlierer verschiebt (der Verlierer bekommt einen
Auftritt, seine geglättete Quote sinkt), wirft eine Welle bis zu acht Säulen um.
Ein erkannter Satz ist damit einer unter vielen. Grenzen sind zusätzlich jeder
Halt, der Anpfiff des Finales und das Ende – sonst zeigte der Zwischenstand
einen Stand, der ein bis drei Duelle alt ist, und genau auf den wird gewettet.
Ohne Welle ist die Beat-Folge kürzer: Wer nichts zu sehen bekommt, soll nicht
warten.

**Das ist eine Verteuerung, keine Dichtung.** Wer mitschreibt, kann Wellen über
mehrere Durchläufe hinweg auseinanderrechnen. Dicht wäre nur, während der
Sichtung gar keinen Stand zu zeigen – und damit wäre die Frage „wer ist
eigentlich dieses C?" weg, die das Spiel trägt. Der Aufwand steigt von „ein
erkannter Satz" auf „systematische Buchführung"; das ist die Grenze dessen, was
ein laufender Zwischenstand zulässt, und sie wird hier bewusst gezogen.

Aus demselben Grund nennt die **Hinweiszeile keinen Buchstaben** mehr. Sie
sagte „3× hintereinander für G" direkt nach dem Klick und, wo es passte,
„Überraschung: Das war bisher Ihr Schlusslicht." – der erste verriet die
Zuordnung im Klartext, der zweite zeigte auf die letzte Säule. Die Serie läuft
jetzt „für dasselbe Programm"; die Beobachtung über den Ausreißer steht im
**Zwischenstand** (`halt-notiz`), wo sie sich auf ein Dutzend Duelle bezieht
und keinen einzelnen Satz verrät.

Die Säulen wachsen **von der Mitte**, nicht vom Boden: 50 % ist der Münzwurf und
der einzige Bezugspunkt, der etwas bedeutet. Eine halbe Säule steht für 30
Prozentpunkte – ein Durchgang schöpft gemessen nur rund 30 bis 75 % aus, und
eine Skala, deren Ränder leer bleiben, verschenkt drei Viertel der Fläche.

Dasselbe gilt für die waagerechten Balken im Ergebnis und im PDF. **Drei
Darstellungen derselben Zahl** – `saeuleSetzen` in `js/spiel.js`,
`balkenSetzen` in `js/app.js`, `balken` in `js/export.js` – und alle drei
benutzen denselben Maßstab und dieselbe Mittellinie. Wer eine ändert, muss
die beiden anderen mitändern.

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

**8. Gestaltung: Dossier statt App, unbunt aus Prinzip.**
Der Name ist eine Seitenzahl, der Inhalt sind Zitate aus Programmen – die
Oberflaeche ist deshalb redaktionell gesetzt: Serifen (Georgia, systemeigen)
in den Ueberschriften, Grotesk im Fliesstext, Haarlinien statt Kaesten.

Die Oberflaeche ist **bewusst unbunt**. Jede Buntfarbe ist im deutschen
Politikkontext besetzt (Schwarz, Rot, Gruen, Gelb, Blau, Magenta); eine bunte
Oberflaeche saehe immer nach einer Partei aus. Farbe traegt genau zwei Dinge:
die eigene Wahl (gruen/rot als Richtung) und die Parteifarben **nach** der
Aufdeckung. Weil die Parteifarben aus dem Datensatz kommen und Schwarz und
Weiss darunter sind, bekommt jede Farbflaeche einen Ring in Gegenrichtung
(`--ring`) – sonst verschwaende der schwarze Balken im Dunkelmodus.

**Zeitungspapier, nicht Bildschirmweiss.** Hell ist graeuliches Newsprint
(`#ebe8e1`) mit Druckerschwarz, dunkel neutrales Graphit (`#121314`). Beide
bewusst ohne Gelbanteil: Die Vorfassung war beige und dunkelbraun, und ueber
beiden lag ein sepiafarbener Verlauf – das Helle wirkte vergilbt, das Dunkle
„eklig braun" (Nutzerurteil). Beige kippt neben Schwarz sofort ins Braune.

Die Papierwirkung kommt aus **Textur**, nicht aus Farbe: `--textur` (Seite)
und `--textur-blatt` (jede Flaeche) sind SVG-Rauschen als Daten-URI, kein
Bild, kein Netz, laeuft unter `file://`. Drei Ebenen wie echtes Papier:
**Wolke** (ungleichmaessige Dichte), **Faser** (gestreckte Striche),
**Korn**. Im Dunkeln helle statt dunkler Spuren. Erzeugt und gestimmt
werden sie **ausschliesslich** mit `python .claude/baue_textur.py` – die
Daten-URIs sind von Hand weder lesbar noch sicher zu escapen.

**Hell braucht deutlich schwaechere Werte als Dunkel.** Dunkle Spuren auf
hellem Grund fallen viel staerker auf als helle auf dunklem; mit gleichen
Werten wirkte Hell wie Tarnmuster, waehrend Dunkel stimmte. Gestimmt wurde in
drei Runden, jede am Bild geprueft (Verlauf im Kopf des Skripts): zu grobe
Wolke gibt Rauchflecken, zu lange Fasern geben gebuerstetes Metall. Massstab
ist, dass der kleinste Text (Ablauf, Fussnoten) unveraendert lesbar bleibt.
Danach auf Nutzerwunsch deutlich abgeschwaecht, dunkel am staerksten: Die
Textur soll man spueren, nicht sehen. Nicht wieder anheben.
Im Dunkeln zweimal nachgesenkt; dort traegt auch die **Kopflinie**
(`--kopflinie`) einen gedaempften Grauton statt Weiss - die 3-px-Linien
waren die hellsten Flaechen der Seite und der eigentliche Kontrasttreiber.

Die erste Fassung war ein einzelner feiner Kornschleier ueber der ganzen
Seite; der Nutzer sah ihn nicht und fand die Flaechen weiter glatt. Zwei
Lehren daraus: Die Textur muss auf den **Flaechen selbst** liegen, und Blatt
und Grund brauchen **verschiedene Maserung** (anderer Zufallswert), sonst
verschmilzt die Karte mit dem Grund und wirkt aufgemalt statt aufgelegt.

Formensprache: Kaesten sind **Blaetter**, nicht App-Karten – Radien 3–4 px,
dazu ein Blattschatten aus `--schatten` (feine Kante, dunklere Randzone),
kein weicher Schwebeschatten. Kopf und Fuss tragen die **Doppellinie** einer
Titelzeile. Wer 12-px-Rundungen oder Weichzeichner-Schatten einfuehrt, baut
die App-Optik zurueck, die der Nutzer abgelehnt hat.

**Dicht wie ein Blatt, nicht leer wie eine App.** Die Farben allein reichten
nicht („zu minimalistisch", Nutzerurteil). Deshalb traegt die Oberflaeche die
Elemente einer Zeitung, alle aus CSS ohne Bilddatei und ohne Buntfarbe
(Abschnitt „TEXTUR" am Ende von `css/style.css`):
- **Zeitungskopf** auf der Startseite: grosser Titel, Dick-duenn-Linie,
  Datumszeile mit dem Heutedatum (nicht dem Wahldatum – die Startseite
  gehoert keiner einzelnen Wahl).
- **Dachzeile und Druckquadrat** vor jeder Rubrik; der Ablauf als
  drei Spalten mit Spaltenlinien statt dreier Kaesten; Kaesten und
  Ueberschriften mit kraeftiger Kopflinie.
- **Rasterpunkte** in Saeulen und Balken, wie gedruckte Grafiken. Das Raster
  ist eine eigene Schicht (`::before`) UEBER der Fuellung, kein
  Hintergrundbild: Die Parteifarbe wird in der Aufdeckung per
  `style.background` gesetzt, und diese Kurzform loescht jedes
  Hintergrundbild.
- **Rasterverlauf in den Duellkarten** aus der oberen Ecke – auf beiden
  Karten gleich, damit er ueber keinen der beiden Saetze etwas sagt.
- Eine neutralgraue **Vignette** zum Rand.

**Titelseite auf breiten Schirmen** (ab 75rem, `.titelseite`): Auf 16:9
blieben zwei Drittel der Flaeche leer. Dort drei Spalten wie eine Zeitung –
links „So funktioniert es" (der Ablauf untereinander), in der Mitte der
Aufmacher mit dem Wahl-Kasten, rechts „Zur Wahl stehen" (`.wahl-rand`) als
Terminkaesten mit Datum und Frist, die direkt starten. Die Wahlen kommen aus
dem Manifest, nicht aus dem App-Code. Kopfleiste und Fusszeile
laufen auf der Titelseite in voller Breite mit (`body:has(.titelseite)`).

**Zweite Runde (September 2026), naeher an einer echten Titelseite:**
Das animierte Buchstabenband im Aufmacher und der Kasten „Welche Wahl?“
mit Auswahlfeld sind entfernt – beides sah nach App aus, nicht nach
Zeitung (Nutzerurteil). Gewaehlt wird **nur** ueber die Terminkaesten; sie
stehen deshalb auch schmal sichtbar, dort direkt unter dem Aufmacher.
Unter dem Aufmacher steht ein **Leitartikel** zur These (zweispaltig ab
48rem), allgemein und ohne Wahlinhalte. **Vergangene Wahlen** bleiben grau
und tragen ihr Ergebnis als Kurzmeldung (Parteien, Prozent, grauer Balken,
Art und Quelle) – aus `ergebnis` im Manifest, nie aus dem App-Code, und
nur mit belegter Quelle. Unbunt: Parteifarben gehoeren zur Aufdeckung.

**Ergebnis auf breiten Schirmen** (ab 75rem, `.ergebnis-blatt`, Stufe 2
und 3): Dieselbe Blattbreite wie die Titelseite. Links die Wertung
(`.ergebnis-haupt`: Sieger, alle Plaetze), rechts die Randspalte
(`.ergebnis-rand`: Tipp, Gegenprobe, Wetten, Zuordnung), „Nach Themen“
zweispaltig (`.themen-spalten`). Vorher stand das Ergebnis als 660 px
schmale Spalte in leerem Papier. **Schmal bleibt die Reihenfolge wie
vorher**: Die Spaltenhuellen sind dort `display: contents`, und `order`
stellt die Karten zurueck in Sieger, Tipp, Gegenprobe, Wetten, Plaetze,
Zuordnung – wer eine Karte ergaenzt, muss ihr dort eine `order` geben.
Die Aufdeckung (Stufe 1) bleibt einspaltig: Dort gehoert der Blick dem
einen Feld.

**Duell auf breiten Schirmen** (ab 75rem, `.spiel:has(> .spiel-rand)`):
Blattbreite wie Titelseite, links eine ruhige Randspalte (`randSpalte` in
`js/spiel.js`: Meilensteine Zwischenstaende und Finale – zuerst alle
schwarz, erreichte abgehakt und grau (Nutzerwunsch; eine eigene Zeile
„Sichtung“ ist bewusst entfallen) –, dazu die Themen mit „gespielt /
geplant“), rechts
Frage, Karten und Leiste. Die Karten werden breiter (gemessen 408 statt
277 px je Karte, 232 statt 307 px hoch), die Leiste steht weiter auf einem
Pixel (ueber neun Duelle 522 px auf 1600x900). Zwei Fallen, die dabei zu
beachten sind:
- **Der Messbereich von `messeMitte` liegt im Rasterfeld `mitte`**, nicht
  ueber die ganze Blattbreite – sonst misst er zu breit und reserviert zu
  wenig Hoehe.
- **Die letzte Rasterzeile ist leer und flexibel.** Ist die Randspalte
  hoeher als die Mitte, verteilt das Raster den Ueberschuss sonst auf die
  Zeilen der rechten Spalte, und zwischen Karten und Leiste entsteht eine
  Luecke.
Die Randspalte zeigt nur Themen und Zaehler, nichts, was an einer Partei
haengt. Unter 75rem ist sie aus, schmal bleibt alles wie vorher.

Bewusst nicht: **keine Initiale** (grosser Anfangsbuchstabe ueber mehrere
Zeilen – vom Nutzer ausdruecklich abgelehnt, war schon einmal drin),
Schraeglagen, Papierrisse, Klebeband – das waere Bastelbogen,
und es kostete Platz genau dort, wo auf dem Telefon beide Saetze ins Bild
muessen. Nachgemessen ueber zwoelf Duelle auf 375x812: die zweite Karte endet
bei 588–689 px, ohne seitliches Scrollen.

Hell ist Standard, dunkel nur ueber den Knopf im Kopf und nur fuer die
Sitzung (Abschnitt 10).

Bewegung uebernimmt in der Spielform, was sonst Farbe leisten wuerde: die
gewaehlte Karte leuchtet kurz auf, die andere faellt weg, der Marker fliegt ins
Feld, die Saeulen tauschen die Plaetze. Ohne diese Quittung fuehlt sich der
Klick folgenlos an - und das war der Hauptvorwurf gegen die Vorform.

Weiteres:
- **Buchstaben statt Ziffern** an den Kandidaten. Die Zuordnung wird je Sitzung
  neu ausgelost; eine Ziffer laese sich als Rangfolge missverstehen.
- **Fortschrittsbogen** ueber den Karten statt Band im Kopf - dort schaut der
  Nutzer ohnehin hin, und zweimal dieselbe Auskunft ist einmal zu viel.
  Er waechst von Frage zu Frage **vom letzten Stand aus**, nicht von null:
  Er wird mit jeder Frage neu gebaut, startet deshalb mit dem gemerkten
  Stand (`bogenZuletzt` in `js/spiel.js`) und laeuft von dort zum neuen.
  Start- und Zielwert werden synchron gesetzt, mit erzwungener
  Stilberechnung dazwischen – nicht per requestAnimationFrame, sonst haengt
  der gemerkte Stand davon ab, ob ein Bild gezeichnet wurde.
- **Tastatur**: 1 und 2 oder Pfeil links und rechts waehlen; waehrend der
  Beat-Folge schaltet jede dieser Tasten weiter.
- **Ueberspringen per Klick** faengt ein Handler am Dokument ab, nicht die
  Karten - die sind waehrend der Folge deaktiviert und schluckten den Klick.
- **Kurze Vibration** bei der Wahl, wo das Geraet sie kennt. Kein Ton: der
  braeuchte eine Datei, liesse sich nicht leise stellen und waere unterwegs
  peinlich.
- **Stoss am Klickort**: eine kurze Welle aus dem Punkt, an dem der Finger
  war. Die Karte skaliert ohnehin, aber das ist eine Eigenschaft der Karte -
  der Stoss gehoert dem Klick. Kleinste moegliche Quittung fuer die am
  haeufigsten wiederholte Handlung im Durchgang.
- **Der Umschalter zum Wortlaut steht im Duell** (`.wortlaut-zeile` ueber
  den Karten). Er war zwischenzeitlich draussen, weil zwei Programmabsaetze
  nebeneinander jedes Telefon sprengten; der Nutzer hat ihn zurueckverlangt,
  und das zu Recht: Die vereinfachte Fassung ist eine Behauptung, solange
  man den Wortlaut nicht danebenlegen kann - und danebenlegen heisst
  waehrend der Entscheidung, nicht Stunden spaeter im Anhang.

  Drei Regeln halten ihn vertraeglich mit allem, was vorher dagegen sprach:
  - **Er schaltet beide Karten zugleich** (`zustand.wortlaut`, gilt fuer den
    ganzen Durchgang). Eine Karte im Zitat und die andere in der
    Zusammenfassung waere ein verzerrter Vergleich - und der Unterschied
    selbst ein Erkennungsmerkmal.
  - **Das Zitat laeuft durch `D.anonymisiere`** (`satzText` in
    `js/spiel.js`). Originalzitate nennen fast immer die eigene Partei;
    ohne Maskierung waere der Umschalter der kuerzeste Weg zur Aufdeckung.
  - **Gedeckelte Hoehe mit Bildlauf** (`.duell-satz--wortlaut`, 14rem, auf
    dem Telefon 8.5rem). Damit bleiben die Karten gleich hoch, beide Saetze
    stehen gleichzeitig im Bild, und die Leiste darunter steht weiter fest.
    Klicks auf den Griff der Bildlaufleiste zaehlen nicht als Wahl - die
    Karte ist ein Knopf.

  Beim Umschalten wird die reservierte Hoehe **einmal neu bestimmt**, die
  Leiste ruckt also auf diesen Klick hin. Das ist gewollt: Die Alternative
  waere, dauerhaft Platz fuer die laengere Fassung freizuhalten, und der
  fehlte dann auf dem Telefon. Innerhalb einer Fassung steht sie fest
  (gemessen ueber acht Duelle: 573 px auf 1280x800, 605 px auf 375x812).

  **Rest, der bleibt**: Zitate sind unterschiedlich lang, und ob eine Karte
  scrollt, sieht man. Das ist ein schwacher Hinweis auf die Programmsprache
  einer Partei, kein Name - und er ist der Preis dafuer, den Beleg ueberhaupt
  zeigen zu koennen. Im Anhang steht der Wortlaut weiterhin ebenfalls.
- **Am Ende steht, was gemessen wurde** und was nicht: Zustimmung zu Saetzen,
  nicht zu Personen, Koalitionen oder Regierungsbilanzen. Eine Prozentzahl
  neben einem Parteinamen liest sich wie eine Empfehlung; die Einordnung
  gehoert deshalb an dieselbe Stelle wie die Zahl und nicht ins
  Kleingedruckte.
- **Auf schmalen Geraeten muessen BEIDE Saetze gleichzeitig im Bild stehen.**
  Ein Vergleich, fuer den man scrollen muss, ist keiner - man erinnert den
  ersten Satz nicht mehr, waehrend man den zweiten liest. Dafuer ist auf
  Telefonen alles enger gesetzt; geprueft ueber einen ganzen Durchgang auf
  375x812.
- **Feld und Knoepfe stehen fest** in einer Leiste (`.spiel-dock`) direkt
  unter Frage und Karten. Deren Hoehe ist fuer den ganzen Durchgang auf das
  laengste Duell reserviert (`messeMitte` in `js/spiel.js`, verdeckt
  gemessen), deshalb steht die Leiste bei jeder Frage auf demselben Pixel.
  Liegt diese Stelle unterhalb des Fensters, haelt sie per `sticky` am
  unteren Rand – pro Fenster immer derselbe Fall. Verworfen, damit es nicht
  wiederkommt: Anker per Fensterhoehe (sprang auf 720 px weiter), fest am
  Fensterrand (auf hohen Schirmen weit weg von den Karten, Fusszeile
  darueber). Die reservierte Hoehe allein war frueher schon einmal verworfen,
  weil die Knoepfe auf dem Telefon unter den Rand rutschten – das lag an der
  damals eigenen Knopfzeile, die es nicht mehr gibt.
  **Kein `transform` auf einem Vorfahren der Leiste** (auch nicht in einer
  Einblendanimation); `.spiel.einblenden` hat deshalb keine Animation.
  `main` liegt ueber der Fusszeile (`z-index: 2`), sonst zeichnet sich die
  Fusszeile ueber die Leiste.
  **Die Leiste muss flach bleiben** – jeder Pixel fehlt den Karten. Mit
  214 px lag bei langen Saetzen das Ende der zweiten Karte unter ihr. Deshalb
  stehen die Knoepfe auf breiten Schirmen neben dem Feld, die im Duell leere
  Zaehlerzeile ist ausgeblendet, und der Formular-Innenabstand, den das
  Kandidatenfeld von `.feld` erbt, ist zurueckgenommen.
  Auf dem Telefon stehen die Knoepfe ebenfalls neben dem Feld, dort als
  Pfeile (← / →, voller Name im `title`): Die eigene Knopfzeile kostete
  49 px, und damit lag bei langen Saetzen das Ende der zweiten Karte unter
  der Leiste.
- **Gleichstand** wird benannt, nicht sortiert: teilen sich mehrere Parteien
  den gerundeten Spitzenwert, nennt die Kopfkarte sie alle und sagt, dass sich
  daraus kein Vorsprung ableiten laesst.
- Kein weiches Scrollen: die App springt bei jedem Ansichtswechsel nach oben,
  Gleiten wirkt dort wie Verzoegerung.
- Symbol als Daten-URI im Dokument – keine zusaetzliche Datei, kein
  vergeblicher Ruf nach `/favicon.ico`.

**9. PDF-Satz: Bloecke bleiben ganz.**
Der Export brach vorher an beliebiger Stelle um - ein Satz am Seitenfuss, der
Rest oben auf der naechsten Seite. Drei Regeln halten das jetzt zusammen:

- **Jedes Duell ist ein `unbreakable`-Block** aus Unterfrage und beiden
  Aussagen. Passt er nicht mehr, wandert er ganz auf die naechste Seite. Die
  Alternative waere ein zerrissener Vergleich, und der ist wertlos. Seit der
  Spielform sind die Bloecke kleiner (zwei Aussagen statt vier), und die
  Seiten sind entsprechend voller: 77-96 % statt 60-70 %.
- **Themenueberschriften stecken im selben Block wie ihre erste Frage**
  ("keep with next"). `pageBreakBefore` reicht dafuer nicht: pdfmake meldet
  dort auch Knoten als "folgend auf dieser Seite", die gar nicht mehr
  hinpassen - gemessen stand eine Ueberschrift bei `verticalRatio` 0,73 mit
  32 angeblich folgenden Knoten allein am Seitenfuss.
- **Abschnitte erzwingen keinen Seitenumbruch.** Ein erzwungener Umbruch vor
  jedem Teil erzeugte drei halb leere Seiten. Linie und Abstand trennen
  genauso deutlich, und das Dokument wurde um eine bis zwei Seiten kuerzer.

Der Anhang zeigt **Duell fuer Duell** die Unterfrage, beide Aussagen mit
Fundstelle und die eigene Wahl - nach Themen gruppiert, mit dem Finale als
eigenem Abschnitt. Im Durchgang sind die Duelle absichtlich durchmischt; im
Nachschlagewerk waere das nur hinderlich.

Die Themenwerte stehen als **Matrix** (Themen als Zeilen, Parteien als
Spalten, Spaltenreihenfolge aus der Gesamtwertung). Untereinander gesetzte
Kacheln brauchten drei Seiten und liessen die letzte fast leer; die Matrix
passt auf eine, und man kann Parteien ueber Themen hinweg vergleichen.
Aussagetexte stehen als Fliesstext, nicht in Tabellenzellen - in einer Spalte
von 60 pt bricht jeder zweite Satz um.

**10. Hell und dunkel.**
**Hell ist Standard**, unabhaengig von der Systemeinstellung - so hat der
Nutzer es verlangt. Es gibt deshalb keinen `prefers-color-scheme`-Block mehr;
die dunkle Palette haengt allein an `:root[data-modus="dunkel"]`, gesetzt vom
Knopf im Kopf. Der Wechsel gilt nur fuer die Sitzung: Speichern ist
ausgeschlossen, und ohne Speicher ueberlebt keine Wahl das Neuladen.

**11. Die These, an der alles hängt.**
*Menschen wählen Etiketten, nicht Inhalte. Wer dieselben Sätze ohne Absender
liest, landet häufig woanders, als er von sich erwartet hätte.*

Das ist kein Beiwerk, sondern der Maßstab für Gestaltungsentscheidungen. Die
Anonymisierung bis zum Schluss, die Maskierung der Parteinamen im Zitat und die
Aufdeckung als eigener Schritt folgen daraus. Zwei Bausteine machen die These
messbar, statt sie nur zu behaupten:
- **Zwei Erwartungen vor dem Durchgang** (`ANSICHTEN.tipp`): Wer steht oben,
  und **welche Partei kommt am wenigsten in Frage**? Beide werden
  festgehalten, bevor der erste Satz gelesen ist – hinterher erinnert sich
  niemand unverzerrt daran, was er vorher gedacht hat.

  Der **Ausschluss ist die schärfere der beiden Fragen**, und deshalb steht
  er überhaupt da. Wen man ablehnt, weiß man meist genauer als, wen man
  wählt; die Ablehnung hängt fast immer am Etikett und nicht an gelesenen
  Programmsätzen. Sie ist damit der beste Prüfstein, den die App aufstellen
  kann: Gewinnen ausgerechnet dort Sätze, ist die These belegt, und zwar
  überprüfbar am eigenen Klick statt an einer Prozentzahl.

  Beide Angaben zusammen sind Bedingung fürs Weitergehen, dieselbe Partei
  darf nicht in beiden stehen (in der jeweils anderen Liste durchgestrichen;
  wer sie trotzdem antippt, verschiebt seine Wahl, statt gegen einen toten
  Knopf zu klicken).
- **Wetten im Zwischenstand** (`S47_SPIEL.zwischenstand`): mitten im Lauf ein
  Tipp auf den führenden Buchstaben, allein aus Sätzen erschlossen. Im
  Ergebnis steht, nach wie vielen Duellen er fiel – ein früher Treffer sagt
  mehr als ein später.
- **Zuordnung „Wer war wer?“** (`ANSICHTEN.zuordnung`): Gefragt wird nach den
  **Buchstaben**, nicht nach einzelnen Sätzen. Der Nutzer hat fünf Minuten
  lang C und E gefüttert und sich längst ein Bild von ihnen gemacht – danach
  nach einem einzelnen Satz zu fragen, wäre eine andere, künstlichere
  Aufgabe. Als Beleg steht bei jedem Buchstaben, was der Nutzer selbst für
  ihn gewählt hat, dazu seine Siegquote.

  Jede Partei ist **genau einmal** zu vergeben; wer eine schon vergeben hat,
  nimmt sie dem anderen Buchstaben weg. Das macht daraus ein
  Zuordnungsrätsel mit Ausschlussverfahren statt sieben unabhängiger
  Ratefragen – und es hält den Zufallserwartungswert bei genau 1 Treffer,
  unabhängig von der Parteienzahl (Fixpunkte einer zufälligen Permutation).
  Ohne diese Eins ist „2 von 7“ keine Auskunft.

Alle drei werten **nie die politische Meinung**, immer nur die Selbsteinschätzung.
Keine Bestenliste, keine Serien, keine Abzeichen, kein Zeitdruck.

Die Tipp-Ansicht ist die **einzige Stelle vor der Aufdeckung mit Parteinamen im
DOM**. Erlaubt ist sie, weil die Namen an nichts hängen: eine bloße Liste der
Parteien dieser Wahl, keine Zuordnung zu einer Aussage, ohne Farben und ohne
Logos. Die Anonymitätsprüfung im DOM (Prüfschritt 6) gilt deshalb für die
Frage-, nicht für die Tipp-Ansicht.

**12. Was aus der Vorform geworden ist.**
Zwei Bausteine der Zwischenstufe sind in der Spielform aufgegangen und stehen
hier, damit sie nicht versehentlich wieder gebaut werden:

- **„Tiefe folgt den Punkten"** (`A.fragenTiefe`) wählte aus, wie viele *Fragen*
  eines Themas gestellt werden. Das übernimmt jetzt `DU.verteile`, und
  zwar feiner: es geht um Duelle, nicht um Fragen, und die Schwerpunkte
  verlängern nie (4c).
- **Der Stichentscheid** kam nur, wenn die Spitze innerhalb von 3 Punkten lag –
  bei zufälligem Antwortverhalten in 27 % der Durchgänge. Ersetzt durch das
  **Finale**, das immer stattfindet (4d). Ein Höhepunkt, den es meistens nicht
  gibt, ist keiner.

Die Glättung (4b) und das Finale machen den Gleichstand ohnehin selten: 5–8 %
statt 13–21 %.

Mit ihnen sind vier Dateien entfallen, weil sie nur noch tote Regeln maßen:
`js/auswertung.js` (die 100/50/0-Rechnung; das Budget ist nach `js/duelle.js`
gewandert), `.claude/pruefe_auswertung.js`, sowie `pruefe_tiefe.js` und
`sortiere_tiefe.js`. Letztere sicherten, dass die **erste** Frage eines Themas
über alle Themen hinweg ausgewogen ist – nötig, solange die Fragen der Reihe
nach gestellt wurden. `waehleAusThema` zieht die Paare jetzt aus **allen** Fragen
eines Themas, die Reihenfolge im Datensatz ist damit bedeutungslos. Die
Umsortierung, die die Werkzeuge einmal vorgenommen haben, schadet nicht und
bleibt stehen.

**12a. Die Gegenprobe zeigt den geschlagenen Satz mit.**
Die Karte „Was Sie nicht erwartet haben" nimmt die **vorab ausgeschlossene**
Partei, ersatzweise (nur bei „Weiß ich nicht") die letztplatzierte. Der
Ausschluss ist die härtere Vorannahme: Er kommt vom Nutzer, steht vor dem
ersten Satz fest und hängt am Namen. Das Schlusslicht der Wertung dagegen ist
ein Ergebnis – es gegen den Nutzer zu wenden wäre ein Zirkelschluss („Sie mögen
es nicht, weil Sie es nicht gewählt haben").

Zu jedem gezeigten Satz steht, **wogegen** er gewonnen hat, mit Parteinamen –
nach der Aufdeckung ist der erlaubt. Ohne den Gegner ist „gewählt" die halbe
Auskunft: Zustimmung entsteht in dieser App immer im Vergleich, nie für sich.
Dazu die Bilanz („in 16 Duellen stand ein Satz daraus zur Wahl, 8 Mal haben Sie
ihn genommen") – eine Zahl ohne Nenner wäre Stimmungsmache.

**Der leere Befund wird ebenso gezeigt.** Kein einziger gewählter Satz aus dem
ausgeschlossenen Programm ist die aussagekräftigste Auskunft, die diese Karte
geben kann: Die Ablehnung hat der Blindprobe standgehalten. Nur die Treffer der
These zu zeigen und ihre Fehlschläge wegzulassen, wäre genau die Sorte
Selbstbestätigung, gegen die das ganze Projekt gebaut ist. Dritter Fall: Die
Partei kam gar nicht vor – dann sagt der Durchgang über sie nichts, und auch
das steht da.

**13. Die Aufdeckung ist die Verwandlung des Feldes.**
Der Nutzer hat fünf Minuten lang sieben Buchstaben gefüttert. Die Auflösung
darf deshalb keine neue Liste sein, sondern muss **dasselbe Feld** sein:
dieselben Säulen, an derselben Stelle, in derselben Reihenfolge – nur wird aus
C ein Name und eine Parteifarbe. Aufgedeckt wird von hinten nach vorn; die
Spitze kommt zum Schluss, weil dort die Frage sitzt, die das Spiel aufgebaut
hat. Der Weiter-Knopf erscheint erst, wenn alle Namen stehen, sonst klickt man
mitten in die Auflösung hinein und sieht sie nie.

Drei Stufen, in dieser Reihenfolge:

1. **Aufdeckung** – nur das Feld, sonst nichts. Wer hier ankommt, will eine
   einzige Auskunft.
2. **Wie gut lagen Sie?** – die Abrechnung der These: der Tipp von vor dem
   Spiel, die Wetten aus den Zwischenständen, die Zuordnung am Ende.
3. **Alles im Einzelnen** – vollständiges Feld, Themen, jedes Duell, Quellen,
   Export.

Umgekehrt hätte niemand die Auflösung der Zuordnung noch gelesen. Die Stufen
sind reine Anzeige; gerechnet ist zu diesem Zeitpunkt alles.

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
  Bei der Überarbeitung erneut geprüft und verworfen: sie käme 20 zusätzliche
  Klicks genau in dem Teil zu stehen, der ohnehin als zäh empfunden wird –
  Monotonie mit mehr Klickarbeit bekämpft. Das Problem, das sie lösen sollte
  (Gleichstand an der Spitze), löst heute das Finale (4d) zusammen mit der Glättung (4b).
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

**Nur Vollprogramme verwenden, keine Kurzfassungen.** Kurzprogramme bestehen
aus Stichpunktlisten und zwingen dazu, mehrere unverbundene Forderungen unter
einer Überschrift zu bündeln. Beim 24-seitigen AfD-Kurzprogramm
Sachsen-Anhalt stammten 9 von 10 Aussagen aus solchen Bündeln (alle anderen
Parteien dort: 0 bis 1). Ein mitgeschleppter Fremdsatz stört nicht nur den
Vergleich – weil er nur bei einer Partei auftritt, ist er ein
Erkennungsmerkmal. Ersetzt durch das 258-seitige Regierungsprogramm; danach
0 von 10.

Vor der Extraktion prüfen: Ist das vorliegende PDF die Vollfassung? Ein
auffällig kurzes Programm ist ein Warnzeichen, aber kein Beweis – Die Linke
MV hat tatsächlich nur 30 Seiten. Im Zweifel beim Landesverband nachsehen.
Unabhängig davon jede Aussage Satz für Satz gegen ihre Frage prüfen
(`pruefe_passung.py` und `pruefe_richtung.py` helfen beim Sortieren).

**Jede Aussage braucht eine erkennbare Richtung.** Der Maßstab ist: *Kann
man sich dazu positionieren?* Drei Muster fallen durch:
- **Richtungslos** – „Die Regelungen sollen geändert werden" (wohin?).
  „Vereinfacht" oder „verschärft" wäre eine Richtung.
- **Bilanz** – „Die Migrationswende ist da", „Die Landespolizei wurde
  modernisiert". Rückschau ist keine Wahlentscheidung. Tritt gehäuft bei
  Regierungsparteien auf, deren Programme im Ton der Erfolgsmeldung
  geschrieben sind.
- **Platitüde** – „Unterrichtsausfall darf nicht zur Normalität werden",
  „Gesundheit müsse gut und erreichbar sein". Zustimmung kostet nichts.

Alle drei sind zugleich Anonymitätsrisiken: Wo drei Aussagen konkrete
Forderungen nennen und eine nicht, sticht die vierte hervor.
`pruefe_richtung.py` sortiert Kandidaten vor, erkennt aber keine Platitüde
mit Modalverb – die Durchsicht bleibt Handarbeit.

## Prüfen

Kein Testframework, aber zwei Skripte und eine Handrechnung. Node liegt nicht
auf dem PATH: `export PATH="/c/Program Files/nodejs:$PATH"` voranstellen.

1. `index.html` doppelklicken (`file://`) – die App muss ohne Netz und ohne Server
   vollständig durchspielbar sein.
2. Browser-Konsole: keine Fehler; `S47_DATA.pruefe(datensatz)` meldet
   Schemaverstöße einschließlich der Ausgewogenheitsregel.
3. `node .claude/pruefe_duelle.js` – simuliert vollstaendige Durchgaenge und
   misst, was die Spielform tragen muss: Umfang (Schwerpunkte verschieben, sie
   verlaengern nie), Ausgewogenheit der Auftritte **am Ende und nach 13
   Duellen**, Trennschaerfe (Spanne, Abstand 1. zu 2., Gleichstandsrate) und
   ob das Finale zustande kommt. Die Werte im Kopf der Datei sind die
   Messlatte gegen die Vorform.
4. `node .claude/pruefe_anonymitaet.js data/wahlen/*.js` – kein Parteiname
   überlebt die Maskierung in `kurz`, `original`, Frage- und Thementexten.
5. `python .claude/pruefe_passung.py` – listet angehängte Sätze („Zudem …“,
   „Auch …“), die nichts mit ihrer Unterfrage zu tun haben. Jeder Treffer ist
   von Hand zu beurteilen; die meisten sind harmlose Präzisierungen. Prüfen
   heißt hier: beantwortet dieser Satz noch die Frage? Wenn nicht, streichen.
6. `.claude/dom_scan.js` in die Browser-Konsole einfügen, während eine Wahl
   läuft: Das Skript spielt einen ganzen Durchgang durch und durchsucht nach
   **jedem Bild** das gesamte DOM nach Parteinamen, Aliassen, Parteifarben,
   Partei-IDs und PDF-Pfaden. Leere Fundliste heißt bestanden.

   **Das Skript prueft Namen, nicht Bewegung.** Es haette die
   Marker-Luecke (4e) nie gefunden, weil dort nie ein Parteiname im DOM
   stand - verraten hat die Zuordnung das Wachsen einer einzelnen Saeule
   nach einem einzelnen Klick. Wer eine Rueckmeldung einbaut, die sich auf
   genau ein Duell bezieht, muss selbst pruefen, ob sie den Buchstaben
   verraet; ein gruener Lauf dieses Skripts sagt darueber nichts.

   Erlaubt sind Parteinamen an genau drei Stellen, und nur dort zählt das
   Skript sie nicht: Tipp-Ansicht, Wette im Zwischenstand und
   Zuordnungsauswahl. Dort hängen sie an nichts – eine bloße Liste der
   Parteien dieser Wahl, ohne Zuordnung zu einer Aussage, ohne Farbe, ohne
   Logo.

   Das **Originalzitat** ist im Duell wieder zuschaltbar (Abschnitt 8,
   Umschalter). Die Maskierung in `S47_DATA.anonymisiere` ist damit nicht
   mehr nur nötig, sondern tragend: Sie läuft über beide Fassungen, und im
   Zitat steht der Parteiname fast immer (Prüfschritt 4).
7. Quellenanzeige: über den lokalen Server (`.claude/launch.json`, Port 8147)
   `S47_QUELLE._finde(textlage, markierung)` gegen **alle** Quellenangaben eines
   Datensatzes laufen lassen – findet die Textlage eine Markierung nicht, bleibt
   die Seite ohne Hervorhebung, ohne dass ein Fehler sichtbar wird.
8. Datenseitig `python .claude/pdftool.py pruefe` (Seitenzahlen und
   Markierungen gegen die PDFs).
9. `node .claude/baue_pdf.js <wahlId> .claude/muster-<wahlId>.pdf` erzeugt das
   PDF ausserhalb des Browsers (window-Ersatz, dieselben Dateien wie die App).
   Danach `python .claude/pruefe_pdf.py`: zerrissene Bloecke, verwaiste
   Ueberschriften und fast leere Seiten. Ohne dieses Werkzeug ist der Satz nur
   im Browser zu sehen, und der zeichnet nicht, wenn das Fenster im
   Hintergrund liegt.

10. `python .claude/pruefe_css.py` – meldet Klassen in `css/style.css`, die in
    keiner JS-Datei und nicht in `index.html` vorkommen. Nach einem Umbau
    bleiben Regeln liegen, die niemand mehr trifft; später widersprechen sie
    neuen Regeln, und man sucht lange. Die Liste ist eine Vorsortierung, keine
    Löschliste – zusammengesetzte Namen (`'karte karte--' + art`) und
    Nachbarschaftsselektoren prüft man von Hand nach.
