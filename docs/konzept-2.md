# Konzept 2 – Anpassungsplan

Stand: 9. September 2026. Grundlage: vier blinde Ideenläufe (40 Vorschläge),
drei Messungen am bestehenden Datensatz.

---

## 1. Befund: woran es wirklich liegt

Der Eindruck „viermal sehr ähnliche Aussagen lesen und ranken" hat zwei
Ursachen, die man auseinanderhalten muss. Nur eine davon ist ein
Gestaltungsproblem.

### 1.1 Die Messung ist gröber, als sie aussieht

Gemessen an den drei Datensätzen:

| | Wert |
|---|---|
| Aussagen je Partei | 9 bis 10 |
| Auftritte je Partei **und Thema** | genau **1** (70 von 70 Fällen in ST) |
| Mögliche Themenwerte je Partei | nur **0, 50 oder 100** |

Der Themenwert ist als Mittel über „die Fragen dieses Themas, in denen die
Partei vorkommt" definiert – dieses Mittel läuft immer über **genau eine**
Frage. Zwanzig Fragen erzeugen also pro Partei zehn dreiwertige Urteile, mehr
nicht. Das Endergebnis ist im Kern die Antwort auf: *Wie oft war diese Partei
Ihre beste, wie oft Ihre schlechteste Wahl?*

Simulation mit 600 Durchläufen (Nutzer urteilt über Sätze: Parteiaffinität
plus Rauschen; bei Rauschen 0 wählt er streng parteitreu, bei 3 fast zufällig):

| Rauschen | Spanne 1. zu 7. | Abstand 1. zu 2. | Lieblingspartei gewinnt | Gleichstand an der Spitze |
|---|---|---|---|---|
| 0,0 | 100 % | 20,6 % | 100 % | 0 % |
| 1,0 | 66 % | 12,3 % | 64 % | 13 % |
| 2,0 | 49 % | 10,1 % | 49 % | 17 % |
| 3,0 | 43 % | 8,8 % | 36 % | 21 % |

Im realistischen Bereich trennt ein Abstand von rund zehn Punkten den ersten
vom zweiten Platz, und in jedem sechsten Durchlauf steht es an der Spitze
gleich. Das Ergebnis behauptet eine Genauigkeit, die es nicht hat.

### 1.2 Der Ablauf hat keinen Bogen

Zwanzig gleichförmige Entscheidungen, dann eine Tabelle. Es gibt keinen
Einsatz, keine Zwischenerkenntnis, keinen Grund weiterzulesen außer Pflicht.
Die Aufdeckung – der einzige echte Moment – kostet einen Klick und ist vorbei.

### 1.3 Was **nicht** das Problem ist

Dass die Aussagen einander ähneln, ist kein Fehler, sondern der Befund.
Wahlprogramme *sind* auf Zustimmungsfähigkeit geschrieben. Genau deshalb gibt
es dieses Projekt. Eine Umgestaltung, die diese Ähnlichkeit wegdesignt, würde
die Aussage des Projekts zerstören. Sie muss **erfahrbar** werden, nicht
verschwinden.

---

## 2. Der blinde Ideenlauf

Vier Agenten ohne Kenntnis dieses Projekts und ohne Kenntnis des Wahl-O-Mat,
mit derselben abstrakten Aufgabe („sieben anonyme Autoren, je 30 kurze Texte,
finde in 15 Minuten heraus, wem du am nächsten stehst"), aus vier
Fachrichtungen: **Spielentwurf**, **Entscheidungsforschung**, **Redaktion /
Dramaturgie**, **Ausstellungsgestaltung**. 40 Vorschläge.

Aufschlussreich ist weniger die einzelne Idee als die **Übereinstimmung**.
Drei Muster kamen aus mehreren Fachrichtungen unabhängig voneinander:

| Muster | genannt von |
|---|---|
| **Eigener Einsatz vor dem Start + gestufte Auflösung am Ende** | alle vier |
| **Knappes Punktebudget statt freier Regler** | Forschung, Ausstellung |
| **Direkter Zweikampf zur Entscheidung der knappen Spitze** | Forschung, Spielentwurf |

Dass vier getrennt arbeitende Perspektiven auf denselben Aufbau kommen, ist
ein stärkeres Argument als jede einzelne Begründung.

---

## 3. Bewertung der engeren Auswahl

Maßstäbe, in dieser Reihenfolge:

- **A – Anonymität** bis zur Aufdeckung (harte Bedingung, sonst raus)
- **B – Vertrauen/Ton**: ein Wahlhelfer darf kein Quiz sein und nie lügen
- **C – Trennschärfe**: wird die Messung feiner oder verlässlicher?
- **D – Fairness**: keine Pfadabhängigkeit, gleiche Chancen für alle Parteien
- **E – Ehrlichkeit**: kein Anreiz, strategisch statt aufrichtig zu antworten
- **F – Datenaufwand**: reicht der vorhandene Bestand?
- **G – Bauaufwand** ohne Server, ohne Speicher, ohne Build
- **H – Sog**

| Idee | A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| **Tipp vor dem Start + gestufte Aufdeckung** | ++ | + | o | ++ | + | ++ | + | ++ |
| **Zuordnung der Namen vor der Auflösung** | ++ | ++ | o | ++ | ++ | ++ | + | ++ |
| **Punktebudget statt Regler** | ++ | + | ++ | ++ | + | ++ | ++ | + |
| **Stichentscheid bei knapper Spitze** | ++ | + | ++ | + | + | ++ | o | ++ |
| **Doppelgänger-Probe** (Zwischenspiel) | ++ | ++ | −− | ++ | ++ | ++ | ++ | + |
| Volle Rangfolge 1–4 statt beste/schlechteste | ++ | + | ++ | ++ | o | ++ | o | − |
| Sicherheitsmarkierung „sicher/knapp" | ++ | + | ++ | ++ | o | ++ | + | o |
| Adaptive Fragenauswahl | ++ | − | + | −− | + | ++ | −− | + |
| Merkmalsprofile statt Zitate | ++ | −− | + | + | + | −− | −− | o |
| Steckbrief mit Stilmerkmalen | −− | o | o | + | o | + | o | ++ |
| Rahmen Verhör / Gericht / Blind Date | ++ | −− | o | ++ | o | ++ | o | ++ |
| Unzuverlässiger Fürsprecher | ++ | −− | −− | ++ | − | ++ | + | ++ |
| K.-o.-Turnier, Tauschladen | ++ | + | − | −− | o | ++ | o | ++ |
| Mehrheitsvergleich („was sagen andere?") | ++ | −− | o | ++ | o | −− | −− | ++ |

**Ausgeschieden und warum:**

- **Rahmenerzählungen** (Verhör, Gerichtsverhandlung, Blind Date): Der Ton
  wertet. „Unglaubwürdig", „Urteil", „Date" sind keine fairen Kategorien für
  ein Wahlprogramm. Ihre *Dramaturgie* – gestreckte Auflösung – übernehmen wir,
  ihren Ton nicht.
- **Unzuverlässiger Fürsprecher**: behauptet absichtlich Falsches. Ein
  Wahlhelfer, der lügt, ist erledigt.
- **Steckbrief mit Stilmerkmalen** („meidet Zahlen", „schreibt am längsten"):
  direktes Anonymitätsleck. Zulässig nur mit Merkmalen aus den *eigenen
  Wahlen* des Nutzers – so ist es unter „Zuordnung" aufgenommen.
- **K.-o.-Turnier und Tauschladen**: pfadabhängig. Wer früh ausscheidet,
  bekommt keine faire Chance – das verletzt die Ausgewogenheitsregel.
- **Mehrheitsvergleich**: bräuchte echte Nutzerdaten, also einen Server. Ohne
  ihn wäre die Vergleichszahl erfunden.
- **Merkmalsprofile statt Zitate**: löst den Vergleich vom Wortlaut – und der
  Wortlaut ist der Kern dieses Projekts.
- **Adaptive Fragenauswahl**: verletzt die gleiche Auftrittszahl je Partei und
  macht das Ergebnis unerklärbar.

---

## 4. Der gewählte Umbau

Vier Eingriffe. Keiner rührt an den Kern (blinder Vergleich wörtlicher
Zitate), keiner braucht neue Recherche, keiner braucht Speicher oder Server.

### 4.1 „Der Einsatz" – Tipp vor dem Start

Nach der Wahl der Wahl, **vor** der ersten Aussage: Die sieben Parteien werden
mit Namen gezeigt (öffentlich bekannt, verrät nichts über die Zuordnung der
Sätze). Der Nutzer tippt: *Welche Partei wird bei mir vorn liegen?*

Der Tipp fließt **nicht** in die Rechnung und ist während des Durchgangs nicht
sichtbar. Er erzeugt eine offene Schleife: Man will wissen, ob man sich selbst
richtig eingeschätzt hat.

*Risiko und Gegenmittel:* Der Tipp könnte spätere Antworten in seine Richtung
ziehen (Konsistenzdruck). Deshalb ist er nach der Abgabe unsichtbar und wird
nirgends erwähnt, bis alles beantwortet ist.

### 4.2 „Wer war wer?" – Zuordnung vor der Auflösung

Nach der letzten Frage, **vor** der Aufdeckung: Sieben Profilkarten – jede
zeigt ausschließlich, was der **Nutzer selbst** über diesen Autor entschieden
hat („Autor C: viermal Ihre beste, einmal Ihre schlechteste Wahl, stark bei
Schule und Gesundheit") plus die Möglichkeit, alle Aussagen dieses Autors
nachzulesen. Daneben die sieben Parteinamen. Der Nutzer ordnet zu, so weit er
sich traut; Felder dürfen leer bleiben.

Erst dann fällt die echte Zuordnung darüber, Karte für Karte, richtige grün
gerahmt. Danach das Ergebnis.

Das ist der stärkste Einzelgriff des ganzen Plans: Er kostet keine neue
Datenzeile, verwandelt die Aufdeckung von einer Mitteilung in einen Selbsttest
– und liefert die These des Projekts als eigene Erfahrung. Wer sieben von
sieben richtig zuordnet, hat die Programme wirklich erkannt. Wer zwei richtig
hat, weiß ab jetzt, wie wenig die Etiketten mit den Sätzen zu tun hatten.

### 4.3 Punktebudget statt Regler

Statt zehn unabhängiger Regler, die alle auf 50 stehen bleiben: **100 Punkte
auf die Themen verteilen**, Restanzeige immer sichtbar, höchstens 30 auf ein
Thema. Themen ohne Punkte werden übersprungen.

Begründung: Unabhängige Regler laden zur Gleichverteilung ein – „alles ist mir
wichtig" –, und dann trägt die Gewichtung keine Information mehr. Knappheit
erzwingt echte Rangunterschiede. Die Gewichtung wird damit erstmals zu einer
Entscheidung statt zu einer Formalie.

### 4.4 Stichentscheid bei knapper Spitze

Wenn nach allen Fragen der Abstand zwischen Platz 1 und 2 unter fünf Punkten
liegt (nach der Messung oben: jeder sechste Durchlauf), folgen **direkte
Zweikämpfe** zwischen genau diesen beiden Parteien: nur zwei Aussagen
nebeneinander, „welche überzeugt Sie mehr?", gezogen aus den höchstgewichteten
Themen.

Machbar mit dem vorhandenen Bestand: **jedes der 21 Parteipaare trifft in
jedem Datensatz mindestens zweimal und höchstens siebenmal aufeinander** –
geprüft, keine Lücke. Der direkte Vergleich zweier Texte ist eine andere
Information als ein Vierervergleich; er beseitigt genau das Artefakt, dass die
Spitzenwerte aus unterschiedlichen Gegnerfeldern gemittelt wurden.

### 4.5 Optional: „Doppelgänger-Probe" als Zwischenspiel

Einmal in der Mitte, als Pause: zwei Aussagen zum selben Unterthema, Frage:
*Vom selben Autor oder von verschiedenen?* Sofortige Auflösung ohne Namen,
Trefferquote läuft mit.

Liefert **keinen** Datenpunkt für die Wertung – deshalb optional. Aber sie
bringt die These des Projekts in fünf Sekunden auf den Punkt: Man liegt fast
immer daneben.

---

## 5. Was sich dadurch am Ablauf ändert

| | heute | neu |
|---|---|---|
| 1 | Wahl auswählen | Wahl auswählen |
| 2 | – | **Tipp abgeben** |
| 3 | zehn Regler | **100 Punkte verteilen** |
| 4 | 18–20 Fragen | 18–20 Fragen (unverändert) |
| 5 | – | *optional Doppelgänger-Probe in der Mitte* |
| 6 | – | **Stichentscheid, falls Spitze knapp** |
| 7 | – | **Namen zuordnen** |
| 8 | Aufdeckung + Tabelle | **Auflösung der Zuordnung**, dann Tipp gegen Ergebnis, dann Tabelle |

Der Kern – Schritt 4 – bleibt vollständig unangetastet. Alles Neue liegt
davor, dazwischen und danach.

---

## 6. Umsetzung in Abschnitten

| Abschnitt | Inhalt | Berührte Dateien | Aufwand |
|---|---|---|---|
| **1** | Punktebudget statt Regler | `js/app.js`, `js/auswertung.js` (Gewichtsquelle), `css/style.css` | klein |
| **2** | Tipp vor dem Start, Speicherung im Sitzungszustand | `js/app.js`, `css/style.css` | klein |
| **3** | Zuordnung vor der Auflösung inkl. Profilkarten | `js/app.js`, `css/style.css` | **groß** |
| **4** | Gestufte Auflösung: Zuordnung → Tipp → Ergebnis | `js/app.js` | mittel |
| **5** | Stichentscheid bei knapper Spitze | `js/auswertung.js`, `js/app.js` | mittel |
| **6** | Doppelgänger-Probe (optional) | `js/app.js` | klein |
| **7** | PDF: Tipp, Zuordnungstreffer und Stichentscheid aufnehmen | `js/export.js` | klein |

Nach jedem Abschnitt: `S47_DATA.pruefe`, `pruefe_auswertung.js`,
`pruefe_anonymitaet.js`, Durchlauf aller drei Wahlen, `baue_pdf.js` +
`pruefe_pdf.py`.

**Neue Prüfungen, die dazukommen müssen:**

- Der Tipp darf vor der Aufdeckung nirgends im DOM stehen (er nennt einen
  Parteinamen – er ist der einzige Parteiname, der vor der Aufdeckung
  überhaupt existiert, und muss beim Verlassen des Tipp-Schritts aus dem DOM
  verschwinden).
- Die Profilkarten dürfen nur Zahlen aus den eigenen Wahlen enthalten, keine
  Stilmerkmale.
- Der Stichentscheid darf keine Frage zweimal in derselben Form zeigen.

---

## 7. Offene Entscheidungen

1. **Sicherheitsmarkierung.** Die Entscheidungsforschung bewertet „war ich
   sicher oder war es knapp?" als das wirksamste Einzelmittel gegen den
   bekannten Nachteil der erzwungenen Wahl (der Münzwurf zählt so viel wie die
   klare Präferenz). Die Ursprungsvorgabe schließt eine Konfidenz- oder
   Unsicherheitsskala jedoch ausdrücklich aus. Soll diese Vorgabe für zwei
   Stufen (nicht: Skala) neu bewertet werden?

2. **Volle Rangfolge 1–4** statt beste/schlechteste würde die Messung
   verfeinern – und wurde bereits einmal zugunsten des geringeren Aufwands
   verworfen. Der Stichentscheid (4.4) ist der billigere Weg zum selben Ziel.
   Bleibt es dabei?

3. **Themenwerte bleiben grob** (0/50/100), solange jede Partei je Thema nur
   einmal vorkommt. Das ließe sich nur mit neuer Recherche ändern: eine dritte
   Frage je Thema, also rund 30 zusätzliche Aussagen je Wahl. Lohnt das?

4. **Doppelgänger-Probe**: mitnehmen oder weglassen? Sie ist reines
   Zwischenspiel ohne Messwert.
