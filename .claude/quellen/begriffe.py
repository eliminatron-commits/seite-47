# -*- coding: utf-8 -*-
"""Glossar: Fachwoerter aus den Fragetexten, in einem Satz erklaert.

WARUM UEBERHAUPT
"Soll Berlin die Bezahlkarte fuer Gefluechtete nutzen?" ist nur zu
beantworten, wenn man weiss, was eine Bezahlkarte ist. Die App fragt nach
Positionen, nicht nach Vorwissen - wer den Begriff nicht kennt, waehlt
sonst nach Bauchgefuehl oder ueberspringt.

WARUM HIER UND NICHT IM APP-CODE
Erklaerungen sind Wahlinhalt (CLAUDE.md, Entscheidung 2). Sie gehen deshalb
in den Datensatz. Diese Datei ist die gemeinsame Quelle fuer alle Regionen -
"Bezahlkarte" dreimal zu schreiben waere dreimal Gelegenheit, es
unterschiedlich zu schreiben. baue_datensatz.py uebernimmt in jeden
Datensatz nur die Begriffe, die in SEINEN Fragetexten vorkommen.

WARUM NUR IN DER FRAGE
Markiert wird ausschliesslich der Fragetext, nie eine Aussage. Die Frage
steht ueber beiden Karten und sagt damit ueber keine von beiden etwas.
Eine gepunktete Linie in nur einer der zwei Aussagen waere ein Unterschied
im Schriftbild genau dort, wo entschieden wird - und das Auge geht hin.

REDAKTIONELLE REGEL
Ein bis zwei Saetze, sachlich, ohne Wertung und ohne Partei. Erklaert wird,
was der Begriff BEDEUTET und warum darueber gestritten wird - nicht, wer
recht hat. Wo eine Zahl schnell veraltet (Ticketpreis, Bauabschnitt),
steht sie nicht drin.

Form:  wort: (erklaerung, [weitere Schreibformen im Fragetext])
Die Formen sind noetig, weil im Fragetext gebeugte oder zusammengesetzte
Varianten stehen ("Milieuschutz- und Sanierungsgebieten").
"""

BEGRIFFE = {
    "Bezahlkarte": (
        "Eine Guthabenkarte statt Bargeld: Asylbewerber bekommen ihre Leistungen "
        "darauf gutgeschrieben. Wie viel Bargeld sie abheben und ob sie "
        "überweisen dürfen, legen die Länder fest.",
        [],
    ),
    "Milieuschutzgebiet": (
        "Ein Gebiet, in dem der Bezirk Umbauten, Luxussanierungen und die "
        "Umwandlung in Eigentumswohnungen genehmigen muss. Es soll verhindern, "
        "dass die bisherige Nachbarschaft durch steigende Mieten verdrängt wird.",
        ["Milieuschutz", "Milieuschutzgebiete", "Milieuschutzgebieten"],
    ),
    "Sanierungsgebiet": (
        "Ein förmlich festgelegtes Gebiet, in dem die Stadt bauliche Missstände "
        "beheben will. Dort braucht es für Bau und Verkauf zusätzliche "
        "Genehmigungen, und die Stadt darf Grundstücke vorrangig kaufen.",
        ["Sanierungsgebiete", "Sanierungsgebieten"],
    ),
    "Tempelhofer Feld": (
        "Die Freifläche des früheren Flughafens Tempelhof, so groß wie rund "
        "400 Fußballfelder. Ein Volksentscheid verbietet dort das Bauen; für eine "
        "Randbebauung müsste dieses Gesetz geändert werden.",
        ["Tempelhofer Feldes"],
    ),
    "A 100": (
        "Der Berliner Stadtring als Autobahn. Umstritten ist, ob er über den "
        "Treptower Park hinaus weiter nach Nordosten gebaut wird – dafür müssten "
        "Wohnhäuser, Kleingärten und Clubs weichen.",
        [],
    ),
    "Kriminalitätsorte": (
        "Kurz für kriminalitätsbelastete Orte: Plätze, die die Polizei als "
        "besonders belastet einstuft. Dort darf sie Personen auch ohne konkreten "
        "Verdacht anhalten und durchsuchen.",
        ["Kriminalitätsort", "kriminalitätsbelastete Orte"],
    ),
    "Messerverbotszonen": (
        "Abgegrenzte Gebiete, in denen das Mitführen von Waffen und Messern "
        "verboten ist. Die Polizei darf dort ohne besonderen Anlass kontrollieren.",
        ["Messerverbotszone", "Waffen- und Messerverbotszonen"],
    ),
    "Taser": (
        "Ein Gerät, das aus einigen Metern Entfernung Stromstöße abgibt und den "
        "Getroffenen kurz bewegungsunfähig macht. Amtlich heißt es "
        "Distanz-Elektro-Impulsgerät.",
        ["Tasern"],
    ),
    "Bodycams": (
        "Kleine Kameras an der Uniform, die Polizeieinsätze aufzeichnen. "
        "Gestritten wird darüber, wer sie einschaltet und wie lange die "
        "Aufnahmen gespeichert bleiben.",
        ["Bodycam"],
    ),
    "Videoüberwachung": (
        "Dauerhaft installierte Kameras im öffentlichen Raum. Sie sollen "
        "abschrecken und Taten aufklären helfen; wer davon erfasst wird, hat sich "
        "nichts zuschulden kommen lassen müssen.",
        [],
    ),
    "Vergabegesetz": (
        "Ein Landesgesetz, das öffentliche Aufträge an Bedingungen knüpft – etwa "
        "Tariflohn, Mindestlohn oder ökologische Standards. Ohne es gilt nur das "
        "Vergaberecht von Bund und EU.",
        ["Tariftreue- und Vergabegesetz"],
    ),
    "Netzentgelte": (
        "Der Teil des Strompreises, der für die Leitungen gezahlt wird. Er ist je "
        "nach Region verschieden hoch und steigt dort besonders, wo viel Netz neu "
        "gebaut wird.",
        ["Netzentgelt"],
    ),
    "Eigenanteile": (
        "Der Teil der Pflegekosten, den Bewohner selbst zahlen. Die "
        "Pflegeversicherung übernimmt nur einen festen Betrag; Unterkunft, "
        "Verpflegung und die Kosten des Gebäudes kommen obendrauf.",
        ["Eigenanteil"],
    ),
    "Deutschlandticket": (
        "Ein bundesweit gültiges Monatsticket für Busse und Bahnen im Nahverkehr. "
        "Bund und Länder schießen die Differenz zu den tatsächlichen Kosten zu; "
        "über diese Zuschüsse wird jedes Jahr neu gestritten.",
        [],
    ),
    "Personalschlüssel": (
        "Wie viele Kinder auf eine Fachkraft kommen. Ein Schlüssel von 1:5 heißt "
        "fünf Kinder je Erzieherin – rechnerisch. Urlaub, Krankheit und "
        "Vorbereitung sind darin meist nicht enthalten.",
        ["Betreuungsschlüssel"],
    ),
    "Bleiberecht": (
        "Die Erlaubnis, dauerhaft in Deutschland zu bleiben. Wer sie nicht "
        "bekommt, ist ausreisepflichtig – kann aber geduldet werden, solange eine "
        "Ausreise nicht möglich ist.",
        [],
    ),
    "Moore": (
        "Dauerhaft nasse Böden, die sehr viel Kohlenstoff speichern. Entwässert "
        "man sie für Äcker und Weiden, geben sie Treibhausgase ab; eine "
        "Wiedervernässung stoppt das, erschwert aber die Bewirtschaftung.",
        ["Moor", "Mooren"],
    ),
    "Klimaziele": (
        "Gesetzlich festgelegte Ziele, um wie viel der Ausstoß an Treibhausgasen "
        "bis zu einem bestimmten Jahr sinken soll – und ab wann ein Land "
        "klimaneutral sein will.",
        ["Klimaziel"],
    ),
    "Verwaltungsreform": (
        "Die Neuverteilung der Zuständigkeiten zwischen Senat und Bezirken. Ziel "
        "ist, dass bei jeder Aufgabe klar ist, wer entscheidet und wer zahlt.",
        [],
    ),
    "Flächenland": (
        "Ein Bundesland mit großer Fläche und wenigen Einwohnern je Quadratkilometer. "
        "Wege zu Arzt, Schule und Behörde sind dort weit, und jede Buslinie bedient "
        "wenige Fahrgäste.",
        ["Flächenlandes"],
    ),
    # --- Zweite Runde: weitere Woerter aus den Fragetexten ---
    "Mietmarkt": (
        "Der Wohnungsmarkt aus Sicht der Mieter: Angebot, Preise und die Regeln "
        "dafür. Der Staat greift über Instrumente wie Mietpreisbremse, "
        "Milieuschutz oder öffentlichen Wohnungsbau ein.",
        [],
    ),
    "Wolf": (
        "Seit den 2000er Jahren leben wieder Wölfe in Deutschland; sie stehen unter "
        "strengem Schutz. Gestritten wird, ob und wie schnell Tiere geschossen werden "
        "dürfen, die Schafe oder Rinder reißen.",
        ["Wolfes", "Wölfe"],
    ),
    "Windräder": (
        "Windkraftanlagen an Land. Wo sie stehen dürfen, entscheidet die Planung von "
        "Land und Region; jedes Bundesland muss dafür einen festgelegten Anteil "
        "seiner Fläche ausweisen.",
        ["Windkraft", "Windkraftanlagen"],
    ),
    "Wärmeversorgung": (
        "Heizung und Warmwasser - zusammen rund die Hälfte des Energieverbrauchs in "
        "Gebäuden. Sie kommt aus Gas, Öl, Fernwärme oder Wärmepumpen; der Umstieg "
        "auf klimafreundliche Quellen heißt Wärmewende.",
        ["Wärmewende"],
    ),
    "Nutztierhaltung": (
        "Die Haltung von Tieren zur Lebensmittelerzeugung. Streitpunkte sind der Platz "
        "im Stall, wer den Umbau bezahlt und wie streng kontrolliert wird.",
        [],
    ),
    "Polizeipräsenz": (
        "Wie sichtbar die Polizei im Alltag ist: Streifen, Wachen und Reviere vor Ort. "
        "Präsenz bindet Personal, das dann in Ermittlung und Verwaltung fehlt.",
        [],
    ),
    "Unterrichtsausfall": (
        "Stunden, die ersatzlos entfallen oder fachfremd vertreten werden. Die Länder "
        "zählen unterschiedlich, deshalb sind ihre Quoten kaum vergleichbar.",
        [],
    ),

    # --- Woerter aus den Aussagen (Begriffszeile unter den Karten) ---
    "Mietendeckel": (
        "Eine gesetzliche Obergrenze für Mieten, unabhängig davon, was am Markt "
        "gezahlt würde. Berlins Landesgesetz dazu hat das Bundesverfassungsgericht "
        "2021 gekippt - zuständig sei der Bund.",
        [],
    ),
    "Mietpreisbremse": (
        "Bei Neuvermietung darf die Miete höchstens zehn Prozent über der "
        "ortsüblichen Vergleichsmiete liegen. Sie gilt nur in angespannten Wohnlagen "
        "und kennt Ausnahmen, etwa für Neubau.",
        [],
    ),
    "Tarifbindung": (
        "Ob ein Betrieb nach Tarifvertrag zahlt. Im Osten gilt das für deutlich "
        "weniger Betriebe als im Westen; wo sie fehlt, handelt jeder Beschäftigte "
        "seinen Lohn selbst aus.",
        ["Tariftreue"],
    ),
    "Vergabemindestlohn": (
        "Der Stundenlohn, den ein Betrieb mindestens zahlen muss, wenn er einen "
        "öffentlichen Auftrag ausführt. Er liegt über dem gesetzlichen Mindestlohn "
        "und wird vom Land festgelegt.",
        [],
    ),
    "Fallpauschalen": (
        "Krankenhäuser bekommen je Behandlungsfall einen festen Betrag, unabhängig "
        "von der Verweildauer. Kritiker sagen, das belohne Menge; Befürworter, es "
        "verhindere unnötig lange Aufenthalte.",
        ["Fallpauschale"],
    ),
    "Bürgerversicherung": (
        "Eine Krankenversicherung, in die alle einzahlen - auch Beamte und "
        "Selbständige. Die Trennung in gesetzlich und privat versichert entfiele.",
        [],
    ),
    "Pflegevollversicherung": (
        "Ein Modell, bei dem die Versicherung alle Pflegekosten übernimmt. Heute zahlt "
        "sie nur einen festen Betrag, den Rest tragen die Bewohner selbst.",
        [],
    ),
    "Share Deals": (
        "Statt einer Immobilie werden Anteile der Firma verkauft, der sie gehört. "
        "Bleibt der Anteil unter einer Schwelle, fällt keine Grunderwerbsteuer an.",
        ["Share Deal"],
    ),
    "Vorkaufsrecht": (
        "Das Recht der Stadt, ein verkauftes Haus selbst zum vereinbarten Preis zu "
        "übernehmen. In bestimmten Gebieten kann sie es nutzen, um Mieter zu schützen.",
        [],
    ),
    "Fehlbelegungsabgabe": (
        "Eine Zahlung für Mieter einer Sozialwohnung, deren Einkommen inzwischen über "
        "der Grenze liegt. Sie schoepft ab, was die geförderte Miete günstiger ist "
        "als die ortsübliche.",
        [],
    ),
    "Wiedervernässung": (
        "Entwässerte Moorböden wieder unter Wasser setzen. Das stoppt die Freisetzung "
        "von Treibhausgasen, macht die Fläche aber schwerer zu bewirtschaften.",
        ["wiedervernässt", "wiedervernässte", "wiedervernässten"],
    ),
    "Ökolandbau": (
        "Landwirtschaft nach den Regeln des ökologischen Anbaus: kein chemisch-"
        "synthetischer Pflanzenschutz, kein Kunstdünger, begrenzte Tierzahl je "
        "Fläche. Die Erträge sind niedriger, die Preise höher.",
        ["Ökoprämien"],
    ),
    "Repowering": (
        "Alte Windräder durch neue, größere am selben Standort ersetzen. Das bringt "
        "mehr Strom ohne zusätzliche Fläche, die Anlagen werden aber höher.",
        [],
    ),
    "Fernwärme": (
        "Heißes Wasser aus einem zentralen Kraftwerk, das über Leitungen ganze "
        "Stadtteile heizt. Wer angeschlossen ist, kann den Anbieter nicht wechseln.",
        [],
    ),
    "E-Akte": (
        "Die elektronische Akte der Verwaltung: Vorgänge werden digital geführt statt "
        "auf Papier. Ohne sie landen auch digitale Anträge wieder im Drucker.",
        ["medienbruchfrei", "Medienbruch"],
    ),
    "Vorratsdatenspeicherung": (
        "Das Speichern von Verbindungsdaten aller Nutzer auf Vorrat, ohne konkreten "
        "Verdacht - wer wann mit wem telefoniert oder welche Adresse hinter einem "
        "Anschluss steckte.",
        [],
    ),
    "Staatstrojaner": (
        "Software, die Ermittler heimlich auf Geräte aufspielen, um mitzulesen, bevor "
        "eine Nachricht verschlüsselt wird.",
        [],
    ),
    "Numerus clausus": (
        "Die Zulassungsgrenze für stark nachgefragte Studienfächer: Nur wer einen "
        "bestimmten Notendurchschnitt erreicht, bekommt einen Platz.",
        [],
    ),
    "Drug-Checking": (
        "Ein Labor prüft mitgebrachte Drogen auf Wirkstoff und Beimischungen. Es soll "
        "Vergiftungen durch unerwartet starke oder gestreckte Stoffe verhindern.",
        [],
    ),
    "Schwammstadt": (
        "Eine Stadt, die Regenwasser aufnimmt und speichert statt es abzuleiten - über "
        "entsiegelte Flächen, Gründächer und Mulden. Das dämpft Überflutung bei "
        "Starkregen und Hitze im Sommer.",
        [],
    ),
    "Volksentscheid": (
        "Eine Abstimmung, bei der die Wahlberechtigten selbst über ein Gesetz "
        "entscheiden. Das Ergebnis gilt wie ein Parlamentsbeschluss.",
        ["Volksentscheiden"],
    ),
    "multiprofessionelle Teams": (
        "Schulteams, in denen neben Lehrkräften auch Sozialarbeit, Psychologie oder "
        "Erziehung arbeiten. Sie übernehmen Aufgaben, die nicht Unterricht sind.",
        ["multiprofessionelle", "multiprofessioneller", "multiprofessionelles"],
    ),
    "Agri-PV": (
        "Solarmodule über oder zwischen Ackerflächen. Darunter wird weiter angebaut, "
        "die Fläche liefert also Strom und Ernte zugleich.",
        [],
    ),
    "Energie-Sharing": (
        "Nachbarn oder Genossenschaften erzeugen Strom gemeinsam und teilen ihn "
        "untereinander, statt ihn vollständig ins Netz zu geben.",
        ["Bürgerstrom", "Energiegenossenschaften"],
    ),
    "Kontrollquittungen": (
        "Eine schriftliche Bestätigung nach einer Polizeikontrolle, mit Grund und "
        "Dienstnummer. Sie soll Kontrollen nachvollziehbar machen.",
        [],
    ),
    "Ausreisegewahrsam": (
        "Gewahrsam kurz vor einer Abschiebung, damit die Betroffenen zum Termin "
        "greifbar sind. Anders als die Abschiebungshaft dauert er nur wenige Tage.",
        ["Abschiebungshaft"],
    ),
    "Ganztag": (
        "Schule mit Betreuung und Angeboten über den Unterricht hinaus, meist bis in "
        "den Nachmittag. Ab 2026 gilt für Grundschulkinder schrittweise ein "
        "Rechtsanspruch darauf.",
        ["Ganztagsangebot", "Ganztagsangebote"],
    ),
    "Vergaberecht": (
        "Die Regeln, nach denen der Staat Aufträge vergibt: ausschreiben, vergleichen, "
        "den wirtschaftlichsten nehmen. Ab bestimmten Auftragswerten gilt EU-Recht.",
        [],
    ),
}
