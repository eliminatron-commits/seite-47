/* Seite 47 – Datensatz: Abgeordnetenhauswahl Berlin (2026-09-20).
 * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/be/.
 * Schema 2: Themen enthalten Fragen mit 3–4 Aussagen verschiedener
 * Parteien; gewaehlt werden die beste und die schlechteste.
 * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das
 * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).
 */
window.S47_DATA.register(
{
  "schemaVersion": 2,
  "id": "agh-be-2026",
  "name": "Abgeordnetenhauswahl Berlin",
  "region": "Berlin",
  "wahltag": "2026-09-20",
  "stand": "2026-09-07",
  "parteien": [
    {
      "id": "cdu",
      "name": "CDU",
      "farbe": "#0B0B0B",
      "alias": [
        "Christlich Demokratische Union",
        "Christdemokraten",
        "CDU-geführten"
      ],
      "logo": null,
      "programm": {
        "titel": "Der Anfang ist gemacht. Regierungsprogramm 2026–2031",
        "datei": "data/programme/be/cdu.pdf",
        "url": "https://berlin-wird.de/image/uploads/data/regierungsprogramm2026_2031.pdf"
      }
    },
    {
      "id": "spd",
      "name": "SPD",
      "farbe": "#E3000F",
      "alias": [
        "Sozialdemokratische Partei",
        "Sozialdemokraten"
      ],
      "logo": null,
      "programm": {
        "titel": "Wahlprogramm zur Abgeordnetenhauswahl 2026",
        "datei": "data/programme/be/spd.pdf",
        "url": "https://spd.berlin/media/2026/08/SPD_Berlin_Wahlprogramm_20260521-v4-1.pdf"
      }
    },
    {
      "id": "gruene",
      "name": "Grüne",
      "farbe": "#1FA12E",
      "alias": [
        "Grünen",
        "Bündnis 90/Die Grünen",
        "Bündnis 90",
        "BÜNDNIS 90"
      ],
      "logo": null,
      "programm": {
        "titel": "Politik ändern. Berlin bleiben. Wahlprogramm zur Abgeordnetenhauswahl 2026",
        "datei": "data/programme/be/gruene.pdf",
        "url": "https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf"
      }
    },
    {
      "id": "fdp",
      "name": "FDP",
      "farbe": "#E8B900",
      "alias": [
        "Freie Demokraten",
        "Freien Demokraten",
        "Freie Demokratische Partei"
      ],
      "logo": null,
      "programm": {
        "titel": "Berlin geht besser. Wahlprogramm zur Abgeordnetenhauswahl 2026",
        "datei": "data/programme/be/fdp.pdf",
        "url": "https://www.fdp-berlin.de/sites/default/files/2026-07/Wahlprogramm_FDP%20Berlin_Abgeordnetenhauswahl%202026_FINAL.pdf"
      }
    },
    {
      "id": "afd",
      "name": "AfD",
      "farbe": "#009EE0",
      "alias": [
        "Alternative für Deutschland"
      ],
      "logo": null,
      "programm": {
        "titel": "Berlin. Stark. Machen. Programm für die Wahlen am 20. September 2026",
        "datei": "data/programme/be/afd.pdf",
        "url": "https://lichtenberg.afd.berlin/wp-content/uploads/2026/07/AfD-WK-Berlin-Wahlprogramm-Webversion.pdf"
      }
    },
    {
      "id": "linke",
      "name": "Die Linke",
      "farbe": "#BE3075",
      "alias": [
        "Linke",
        "Linken",
        "DIE LINKE"
      ],
      "logo": null,
      "programm": {
        "titel": "Berlin machen bezahlbar. Wahlprogramm zur Abgeordnetenhauswahl 2026",
        "datei": "data/programme/be/linke.pdf",
        "url": "https://dielinke.berlin/fileadmin/download/2026/Wahlprogramm_AGH_2026_Die_Linke_Berlin.pdf"
      }
    },
    {
      "id": "bsw",
      "name": "BSW",
      "farbe": "#7D254F",
      "alias": [
        "Bündnis Sahra Wagenknecht",
        "Wagenknecht"
      ],
      "logo": null,
      "programm": {
        "titel": "Berlin – Mit uns endlich vernünftig und gerecht. Wahlprogramm zur AGH-Wahl 2026",
        "datei": "data/programme/be/bsw.pdf",
        "url": "https://bsw.berlin/wp-content/uploads/Wahlprogramm-BSW-Berlin-AGH-Wahl-2026.pdf"
      }
    }
  ],
  "themen": [
    {
      "id": "wohnen",
      "titel": "Wohnen und Mieten",
      "beschreibung": "Mietregulierung, Neubau, landeseigene Wohnungsunternehmen.",
      "fragen": [
        {
          "id": "be-f004",
          "text": "Wie stark soll der Staat in den Mietmarkt eingreifen?",
          "aussagen": [
            {
              "id": "be-a049",
              "parteiId": "cdu",
              "kurz": "Forderungen nach Enteignungen oder einem Mietendeckel wird eine klare Absage erteilt. Solche Eingriffe seien keine Lösung, sondern verschärften die Lage am Wohnungsmarkt. Stattdessen sollen Mieterinnen und Mieter ihre Rechte einfacher geltend machen können.",
              "original": "Populistischen Forderungen nach Enteignungen oder der Einführung eines Mietendeckels erteilen wir eine klare Absage. Solche Eingriffe sind keine Lösung für den angespannten Wohnungsmarkt, sondern verschärfen die Situation.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 30,
                "markierung": "Populistischen Forderungen nach Enteignungen oder der Einführung eines Mietendeckels erteilen wir eine klare Absage"
              }
            },
            {
              "id": "be-a039",
              "parteiId": "linke",
              "kurz": "Für die kommunalen Wohnungen soll ein Mietendeckel durchgesetzt werden. Ein Landesamt für Mieterschutz soll Verstöße ahnden und Recht durchsetzen. Die landeseigenen Wohnungen müssen bezahlbar bleiben.",
              "original": "Unsere kommunalen Wohnungen müssen bezahlbar bleiben. Deshalb werden wir dort einen Mietendeckel durchsetzen. Mit unserem Landesamt für Mieterschutz schaffen wir eine handlungsfähige Behörde, die Verstöße ahndet und Recht durchsetzt.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 7,
                "markierung": "Deshalb werden wir dort einen Mietendeckel durchsetzen"
              }
            },
            {
              "id": "be-a055",
              "parteiId": "bsw",
              "kurz": "Die bestehenden Instrumente der Mietenregulierung sollen geschärft und konsequent durchgesetzt werden. Über eine Bundesratsinitiative soll zusätzlich ein Mietendeckel eingeführt werden. Berlin brauche mehr Wohnungen in öffentlicher Hand und gemeinnütziger Bewirtschaftung.",
              "original": "Wir wollen die bestehenden Instrumente der Mietenregulierung schärfen und endlich konsequent durchsetzen und zusätzlich über eine Bundesratsinitiative einen Mietendeckel einführen. Berlin braucht mehr Wohnungen in öffentlicher Hand und in gemeinnütziger Bewirtschaftung.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 2,
                "markierung": "zusätzlich über eine Bundesratsinitiative einen Mietendeckel einführen"
              }
            }
          ]
        },
        {
          "id": "be-f014",
          "text": "Wie soll mit Milieuschutz- und Sanierungsgebieten umgegangen werden?",
          "aussagen": [
            {
              "id": "be-a048",
              "parteiId": "spd",
              "kurz": "Bei An- und Ummeldungen soll über Mietpreisbremse und Mietwucher informiert und auf kostenlose Beratung verwiesen werden. Die Schutzregeln in Milieuschutzgebieten sollen erklärt werden. Milieuschutzgebiete sollen ausgeweitet werden.",
              "original": "Bei An- und Ummeldungen informieren wir über Mietpreisbremse und Mietwucher, verweisen auf kostenlose Beratung in den Bezirken und erklären Schutzregeln in Milieuschutzgebieten. Wir setzen uns für die Ausweitung von Milieuschutzgebieten ein.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 20,
                "markierung": "Wir setzen uns für die Ausweitung von Milieuschutzgebieten ein"
              }
            },
            {
              "id": "be-a007",
              "parteiId": "gruene",
              "kurz": "Das Land soll insbesondere in Milieuschutzgebieten ambitionierte Sanierungen fördern und Eigentümer beraten. Mieterinnen und Mieter in unsanierten Häusern dürfen den Kostensteigerungen fossiler Brennstoffe nicht ungeschützt ausgesetzt sein. In allen Bezirken soll eine starke unabhängige Beratung entstehen.",
              "original": "Mieter*innen in unsanierten Häusern dürfen den Kostensteigerungen fossiler Brennstoffe nicht ungeschützt ausgesetzt werden. Das Land Berlin soll insbesondere in Milieuschutzgebieten ambitionierte Sanierungen fördern und Gebäudeeigentümer entsprechend beraten.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 16,
                "markierung": "Das Land Berlin soll insbesondere in Milieuschutzgebieten ambitionierte Sanierun gen fördern"
              }
            },
            {
              "id": "be-a003",
              "parteiId": "fdp",
              "kurz": "Das öffentliche Vorkaufsrecht soll in Sanierungs- und Milieuschutzgebieten außer für öffentliche Infrastruktur nicht mehr ausgeübt werden. Die landeseigenen Wohnungsbaugesellschaften sollen Wohnraum für von Wohnungslosigkeit bedrohte Menschen bereitstellen. Reine Mieter-Neubauquartiere am Stadtrand werden abgelehnt.",
              "original": "Die landeseigenen WBG sollen aus ihren Beständen auch Wohnraum für von Wohnungslosigkeit bedrohte Menschen zur Verfügung stellen. In Sanierungs- und Milieuschutzgebieten soll das öffentliche Vorkaufsrecht, außer für öffentliche Infrastruktur, nicht mehr ausgeübt werden.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 38,
                "markierung": "In Sanierungs- und Milieuschutzgebieten soll das öffentliche Vorkaufsrecht, außer für öffentliche Infrastruktur, nicht mehr ausgeübt werden"
              }
            },
            {
              "id": "be-a046",
              "parteiId": "afd",
              "kurz": "Die Fehlbelegungsabgabe soll wieder eingeführt und die Untervermietung von Sozialwohnungen generell verboten werden. Die Ausweisung von Milieuschutzgebieten soll begrenzt werden. Ziel ist es, Missbrauch zu verhindern.",
              "original": "[Wir wollen] die Fehlbelegungsabgabe wieder einführen. Um den Missbrauch zu verhindern, setzen wir uns für ein generelles Verbot der Untervermietung von Sozialwohnungen ein. Milieuschutz begrenzen: Die Ausweisung von Wohnvierteln als Milieuschutzgebiete (§ 172 BauGB) […].",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 6,
                "markierung": "wir uns für ein generelles Verbot der Untervermietung von Sozialwohnungen ein"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "sicherheit",
      "titel": "Innere Sicherheit",
      "beschreibung": "Polizei, Videoüberwachung, Verbotszonen und Kontrolle.",
      "fragen": [
        {
          "id": "be-f009",
          "text": "Wo und wie soll Videoüberwachung eingesetzt werden?",
          "aussagen": [
            {
              "id": "be-a043",
              "parteiId": "cdu",
              "kurz": "An bekannten Kriminalitätsschwerpunkten sollen verstärkt Videoüberwachung sowie Waffen- und Messerverbotszonen eingesetzt werden. Als Beleg wird auf die Wache am Kottbusser Tor verwiesen. Die Polizei soll zudem mit Tasern ausgestattet werden.",
              "original": "Genau hinschauen, was passiert, um Kriminelle dingfest zu machen: An bekannten Kriminalitätsschwerpunkten kommen nun verstärkt Videoüberwachung und Waffen- und Messerverbotszonen zum Einsatz. Mit messbarem Erfolg […].",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 6,
                "markierung": "An bekannten Kriminalitätsschwerpunkten kommen nun verstärkt Videoüberwachung und Waffen- und Messerverbotszonen zum Einsatz"
              }
            },
            {
              "id": "be-a047",
              "parteiId": "fdp",
              "kurz": "An Risikoorten wie Bahnhöfen soll neben temporärer Videoüberwachung mit baulichen Maßnahmen gearbeitet werden. Dazu zählen gute Beleuchtung, offene Sichtachsen und die Vermeidung dunkler Ecken. Security by Design soll berlinweit umgesetzt werden.",
              "original": "Wir möchten Security by Design berlinweit implementieren. An Berliner Risikoorten wie Bahnhöfen oder Drogenumschlagplätzen wollen wir – neben der temporären Videoüberwachung – mit baulichen Maßnahmen wie guter Beleuchtung, offenen Sichtachsen, Verhinderung dunkler Ecken die Sicherheit […] [erhöhen].",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 67,
                "markierung": "neben der temporären Videoüberwachung – mit baulichen Maßnahmen wie guter Beleuchtung"
              }
            },
            {
              "id": "be-a025",
              "parteiId": "afd",
              "kurz": "Gefordert wird eine vollständige Videoüberwachung in allen Brennpunktbereichen. Mobile Polizeiwachen in Problemvierteln und ein dichteres Netz stationärer Wachen sollen eingeführt werden. Das Landesantidiskriminierungsgesetz soll sofort aufgehoben werden.",
              "original": "Die AfD fordert: → Die sofortige Aufhebung des Landesantidiskriminierungsgesetzes und die Überarbeitung anderer sicherheitsrelevanter Gesetze. → Eine vollständige Videoüberwachung in allen Brennpunktbereichen. → Die Einführung mobiler Polizeiwachen in Problemvierteln.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 13,
                "markierung": "Eine vollständige Videoüberwachung in allen Brennpunktbereichen"
              }
            },
            {
              "id": "be-a004",
              "parteiId": "bsw",
              "kurz": "Videoüberwachung soll an nachweislich besonders kriminalitätsbelasteten Orten eingesetzt werden. Nötig seien dafür eine parlamentarische Genehmigung und eine Echtzeit-Auswertung durch ausreichend Personal. Kriminalität und Gewalt müsse wirksam entgegengetreten werden.",
              "original": "Kriminalität und Gewalt muss wirksam entgegengetreten werden, damit sich alle Bürger unserer Stadt sicher fühlen können. Dazu setzen wir Videoüberwachung an nachweislich besonders kriminalitätsbelasteten Orten ein – mit parlamentarischer Genehmigung und Echtzeit-Auswertung durch ausreichend Personal.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 41,
                "markierung": "Videoüberwachung an nachweislich besonders kriminalitätsbelasteten Orten ein – mit parlamentarischer Genehmigung"
              }
            }
          ]
        },
        {
          "id": "be-f001",
          "text": "Wie sollen Polizeibefugnisse und Kriminalitätsorte kontrolliert werden?",
          "aussagen": [
            {
              "id": "be-a005",
              "parteiId": "spd",
              "kurz": "Die Einstufung kriminalitätsbelasteter Orte soll einer regelmäßigen parlamentarischen Kontrolle unterliegen. Software intransparenter Hersteller wie Palantir wird für Berlin abgelehnt. Die Polizei soll respektvoll handeln und die Vielfalt der Stadt widerspiegeln.",
              "original": "[Wir unterziehen] die Einstufung kriminalitätsbelasteter Orte einer regelmäßigen parlamentarischen Kontrolle. […] Den Einsatz von Software intransparente und datenschutzrechtlich bedenklicher Hersteller wie Palantir lehnen wir für Berlin entschieden [ab].",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 31,
                "markierung": "die Einstufung kriminalitätsbelasteter Orte einer regelmäßigen parlamentarischen Kontrolle"
              }
            },
            {
              "id": "be-a050",
              "parteiId": "gruene",
              "kurz": "Die bestehenden kriminalitätsbelasteten Orte sowie Messer- und Waffenverbotszonen sollen auf ihre Sinnhaftigkeit überprüft und wo nötig wieder abgeschafft werden. Die Ergebnisse der Bodycam-Studie sollen umgesetzt werden. Ziel sind Transparenz und Nachvollziehbarkeit polizeilichen Handelns.",
              "original": "Wir werden die bestehenden kriminalitätsbelasteten Orte und Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen und werden sie, wo erforderlich, wieder abschaffen. Die Ergebnisse der Bodycam-Studie wollen wir umsetzen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 228,
                "markierung": "Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen und werden sie, wo erforderlich, wieder abschaffen"
              }
            },
            {
              "id": "be-a028",
              "parteiId": "linke",
              "kurz": "Die Aufrüstung der Polizei soll gestoppt und die Mittel umverteilt werden. Einsätze bei Demonstrationen, anlasslose Kontrollen und Waffenverbotszonen gelten als personalintensiv und oft nicht zielführend. Geprüft werden soll, den Personalbestand auf das Niveau anderer Städte zu bringen.",
              "original": "Aufrüstung der Polizei wollen wir stoppen und die Mittel umverteilen. Polizeieinsätze z. B. bei Demos, anlasslosen Kontrollen an KBOs und Waffenverbotszonen oder Fußballspielen sind personalintensiv und oft nicht zielführend.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 288,
                "markierung": "Aufrüstung der Polizei wollen wir stoppen und die Mittel umverteilen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "verkehr",
      "titel": "Verkehr und Mobilität",
      "beschreibung": "Rad, Auto, Bus und Bahn im Stadtverkehr.",
      "fragen": [
        {
          "id": "be-f013",
          "text": "Welcher Verkehrsart soll in der Stadt Vorrang eingeräumt werden?",
          "aussagen": [
            {
              "id": "be-a010",
              "parteiId": "gruene",
              "kurz": "Mobilität dürfe keine Frage von Einkommen, Wohnort oder Alter sein. Derzeit kämen Busse zu spät, U-Bahnen fielen aus und Radwege endeten im Nichts. Zu viele Straßen seien für Kinder, Seniorinnen und Menschen mit Behinderungen gefährlich.",
              "original": "Sie darf keine Frage des Einkommens, des Wohnorts oder des Alters sein. Doch die Realität sieht derzeit anders aus: Busse kommen zu spät, U-Bahnen fallen aus, Radwege enden im Nichts und zu viele Straßen sind gerade für Kinder, Senior*innen und Menschen mit Behinderungen gefährlich.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 80,
                "markierung": "Busse kommen zu spät, U-Bahnen fallen aus, Radwege enden im Nichts"
              }
            },
            {
              "id": "be-a038",
              "parteiId": "afd",
              "kurz": "Der motorisierte Individualverkehr bleibt aus Sicht der Partei unverzichtbarer Bestandteil urbaner Mobilität. Gefordert werden Zugangsbeschränkungen für Personen ohne Fahrschein im Nahverkehr. Der Regionalverkehr soll besser in das Gesamtnetz eingebunden werden.",
              "original": "→ Zugangsbeschränkungen für Personen ohne Fahrschein. → Eine bessere Einbindung des Regionalverkehrs in das Gesamtnetz. Für diskriminierungsfreien Autoverkehr: Der motorisierte Individualverkehr bleibt für uns auch in Zukunft ein unverzichtbarer Bestandteil urbaner Mobilität.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 42,
                "markierung": "Der motorisierte Individualverkehr bleibt für uns auch in Zukunft ein unverzichtbarer Bestandteil urbaner Mobilität"
              }
            },
            {
              "id": "be-a014",
              "parteiId": "linke",
              "kurz": "Priorität hat ein überzeugendes Angebot im öffentlichen Nahverkehr. Hinzu kommen der Ausbau eines umfassenden Radwegenetzes und barrierefreier Gehwege. So soll allen eine kostengünstige Mobilität ermöglicht werden.",
              "original": "Unsere Priorität liegt daher auf einem überzeugenden Angebot im öffentlichen Personennahverkehr (ÖPNV) sowie dem Ausbau eines umfassenden Radwegenetzes und von barrierefreien Gehwegen. So ermöglichen wir allen eine kostengünstige Mobilität.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 55,
                "markierung": "Unsere Priorität liegt daher auf einem überzeugenden Angebot im öffentlichen Personennahverkehr"
              }
            },
            {
              "id": "be-a026",
              "parteiId": "bsw",
              "kurz": "Gefordert wird kein Gegeneinander von Auto, Fahrrad und Nahverkehr, sondern ein vernünftiges Miteinander. Sichere Fußwege, ein starker Nahverkehr, ein verlässliches Radwegenetz und gute Bedingungen für den Autoverkehr gehören zusammen. Besonders benannt werden Außenbezirke, Schichtarbeit und Handwerk.",
              "original": "[Wir wollen kein Gegeneinander] zwischen Auto, Fahrrad und öffentlichem Nahverkehr, sondern ein vernünftiges Miteinander. Sichere Wege für Fußgänger, ein starker Nahverkehr, ein verlässliches Radwegenetz und gute Bedingungen für den motorisierten Individualverkehr gehören zusammen.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 48,
                "markierung": "ein verlässliches Radwegenetz und gute Bedingungen für den motorisierten Individualverkehr gehören zusammen"
              }
            }
          ]
        },
        {
          "id": "be-f003",
          "text": "Worin soll beim Verkehr zuerst investiert werden?",
          "aussagen": [
            {
              "id": "be-a053",
              "parteiId": "cdu",
              "kurz": "Das Radwegenetz soll gezielt verbessert und bedarfsgerecht ausgebaut werden. Vorrang haben Sanierung und Ertüchtigung bestehender Wege. Sharing-Fahrzeuge sollen nur noch an fest definierten Abstellanlagen abgestellt werden dürfen.",
              "original": "Mit dem Rad durch die Stadt: Das Berliner Radwegenetz werden wir gezielt verbessern und bedarfsgerecht ausbauen. Vorrang hat für uns die Sanierung und Ertüchtigung bestehender Wege.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 71,
                "markierung": "Das Berliner Radwegenetz werden wir gezielt verbessern und bedarfsgerecht ausbauen. Vorrang hat für uns die Sanierung"
              }
            },
            {
              "id": "be-a051",
              "parteiId": "spd",
              "kurz": "Der Ausbau der Straßenbahn soll in allen Bezirken vorangetrieben werden. Die Elektrifizierung des Busverkehrs wird fortgesetzt und senkt zugleich den Lärm. Laufende Projekte sollen weiter finanziert werden.",
              "original": "Die Elektrifizierung des Busverkehrs setzen wir fort und senken damit zugleich den Lärm in der Stadt. Wir treiben den Ausbau der Straßenbahn in allen Bezirken voran, finanzieren laufende Projekte […].",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 24,
                "markierung": "Wir treiben den Ausbau der Straßenbahn in allen Bezirken voran"
              }
            },
            {
              "id": "be-a009",
              "parteiId": "fdp",
              "kurz": "Bestehende Radwege sollen repariert werden, auch wenn sie nicht der Normbreite entsprechen. Man solle nicht zehn Jahre auf ein Verkehrskonzept und dessen Umsetzung warten. Eine bessere Anbindung von Außenbezirken und Umland soll den Wohnungsmarkt entlasten.",
              "original": "Bestehende Radwege müssen repariert werden, auch wenn sie nicht der „Normbreite“ entsprechen, anstatt zehn Jahre auf ein „Verkehrskonzept“ und dessen Umsetzung zu warten.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 55,
                "markierung": "Bestehende Radwege müssen repariert werden, auch wenn sie nicht der „Normbreite“ entsprechen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "verwaltung",
      "titel": "Verwaltung und Digitalisierung",
      "beschreibung": "Bürgerämter, Verwaltungsreform und digitale Verfahren.",
      "fragen": [
        {
          "id": "be-f002",
          "text": "Wie weit soll die Verwaltung digitalisiert werden?",
          "aussagen": [
            {
              "id": "be-a033",
              "parteiId": "spd",
              "kurz": "Der digitale Wirtschaftsservice der Berliner Verwaltung soll umgesetzt und mehr Leistungen digital angeboten werden. Digitalisierungsprojekte sollen schneller in die Umsetzung kommen. Mit digitalen Werkzeugen soll ein modernes Vergaberecht umgesetzt werden.",
              "original": "Wir setzen den DIWI – den digitalen Wirtschaftsservice der Berliner Verwaltung – um und bieten noch mehr Leistungen digital an. Außerdem setzen wir mit digitalen Tools ein modernes Vergaberecht um.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 11,
                "markierung": "den digitalen Wirtschaftsservice der Berliner Verwaltung – um und bieten noch mehr Leistungen digital an"
              }
            },
            {
              "id": "be-a056",
              "parteiId": "gruene",
              "kurz": "Die internen Prozesse in den Verwaltungen sollen vollständig digitalisiert werden. Dafür soll übergreifend in allen Verwaltungen die E-Akte eingeführt werden. Zudem soll die Datenkommunikation zwischen den Behörden abgesichert werden.",
              "original": "Um das Angebot unserer Behörden verbessern zu können, müssen wir die internen Prozesse in den Verwaltungen vollständig digitalisieren. Dafür führen wir übergreifend in allen Verwaltungen die E-Akte ein.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 71,
                "markierung": "Dafür führen wir übergreifend in allen Verwaltungen die E-Akte ein"
              }
            },
            {
              "id": "be-a059",
              "parteiId": "fdp",
              "kurz": "Bei neuen Gesetzen und Verordnungen sollen alle Verwaltungsvorgänge digitaltauglich umgesetzt werden können. Gelten sollen die Grundsätze „digital only“ und „digital once“. Daten sollen also nur noch einmal an die Verwaltung übermittelt werden.",
              "original": "Bei neuen Gesetzen und Verordnungen oder auch bei Änderungen sorgen wir dafür, dass alle damit verbundenen Verwaltungsvorgänge digitaltauglich umgesetzt werden können. Die Grundsätze „digital only“ und „digital once“ (Übermittlung von Daten nur noch einmal an die Berliner [Verwaltung]) […].",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 21,
                "markierung": "dass alle damit verbundenen Verwaltungsvorgänge digitaltauglich umgesetzt werden können"
              }
            },
            {
              "id": "be-a027",
              "parteiId": "bsw",
              "kurz": "Verwaltung bedeute auch Dienstleistung und müsse beschleunigt werden. Dafür brauche es eine konsequentere Digitalisierung, Papierakten sollen abgelöst werden. Beförderungen für kontinuierliche Leistung sollen zum Regelfall werden.",
              "original": "Verwaltung modernisieren: Verwaltung bedeutet auch Dienstleistung. Damit diese beschleunigt wird, braucht es eine konsequentere Digitalisierung: Papierakten soll[en] […] [abgelöst werden].",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 62,
                "markierung": "Damit diese beschleunigt wird, braucht es eine konsequentere Digitalisierung"
              }
            }
          ]
        },
        {
          "id": "be-f017",
          "text": "Worauf soll es bei der Verwaltungsreform jetzt ankommen?",
          "aussagen": [
            {
              "id": "be-a031",
              "parteiId": "cdu",
              "kurz": "Die Verwaltungsreform soll klare Verantwortung, starke Bezirke und ein Ende des Behörden-Pingpongs bringen. Die Verwaltung soll zuallererst den Bürgern dienen und die Stadt Schritt für Schritt wieder zum Funktionieren bringen.",
              "original": "Mit der großen Verwaltungsreform setzen wir um, woran Vorgängersenate 25 Jahre gescheitert sind: klare Verantwortung, starke Bezirke, kein Behörden-Pingpong mehr. Wir bringen Berlin nach und nach wieder zum Funktionieren – für eine Verwaltung, die zuallererst den Bürgern dient.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 87,
                "markierung": "klare Verantwortung, starke Bezirke, kein Behörden-Pingpong mehr"
              }
            },
            {
              "id": "be-a061",
              "parteiId": "afd",
              "kurz": "Investitionen seien insbesondere in Verwaltungsmodernisierung und die Digitalisierung kritischer Systeme erforderlich. Genannt werden zudem Infrastruktur, Sicherheits- und Rettungsdienste sowie der Substanzerhalt öffentlicher Gebäude. Der Investitionsstau der öffentlichen Hand liege bei weit über 100 Milliarden Euro.",
              "original": "Der Investitionsstau der öffentlichen Hand beläuft sich inzwischen auf weit über 100 Mrd. Euro. Investitionen sind erforderlich, insbesondere in: Die Infrastruktur; die Verwaltungsmodernisierung; die Digitalisierung kritischer Systeme; Sicherheits- und Rettungsdienste; Substanzerhalt öffentlicher Gebäude.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 96,
                "markierung": "die Verwaltungsmodernisierung; die Digitalisierung kritischer Systeme"
              }
            },
            {
              "id": "be-a045",
              "parteiId": "linke",
              "kurz": "Die Verwaltung soll digitaler und effizienter werden und die Verwaltungsreform mit Leben gefüllt werden. Die Ausgaben für Überwachungskameras sollen reduziert werden. Stattdessen soll in soziale Angebote investiert werden.",
              "original": "Wir reduzieren die Ausgaben für Überwachungskameras und investieren stattdessen in soziale Angebote. Wir müssen unsere Verwaltung digitaler und effizienter machen und die Verwaltungsreform mit Leben füllen.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 11,
                "markierung": "Wir müssen unsere Verwaltung digitaler und effizienter machen und die Verwaltungsreform mit Leben füllen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "schule",
      "titel": "Schule und Bildung",
      "beschreibung": "Schulplätze, Personal, Schulformen und Inklusion.",
      "fragen": [
        {
          "id": "be-f007",
          "text": "Wie soll die Schule organisiert und gesteuert werden?",
          "aussagen": [
            {
              "id": "be-a018",
              "parteiId": "cdu",
              "kurz": "Im Rahmen der Schulbauoffensive sind rund 62.000 neue Schulplätze, 41 neue Schulen und 76 Sporthallen entstanden. In den Schulbau soll massiv weiter investiert werden. Ein neues 11. Pflichtschuljahr soll Jugendlichen ohne Ausbildungsplatz eine Perspektive geben.",
              "original": "Das neue 11. Pflichtschuljahr gibt Jugendlichen ohne Ausbildungsplatz eine klare Perspektive. Wir investieren massiv in Berlins Schulbau: Im Rahmen der Schulbauoffensive wurden so rund 62.000 neue Schulplätze, 41 neue Schulen, 119 Ergänzungsbauten und 76 neue Sporthallen entstanden.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 54,
                "markierung": "Wir investieren massiv in Berlins Schulbau"
              }
            },
            {
              "id": "be-a019",
              "parteiId": "spd",
              "kurz": "Die Schulbauoffensive soll fortgesetzt werden, nachdem bereits über 50.000 Schulplätze geschaffen wurden. Die Lehrkräftebildung soll über die Schools of Education gestärkt werden. Betont wird eine praxisorientierte Professionalisierung.",
              "original": "In diesem Sinne stärken wir die Schools of Education als zentrale Struktur der Lehrkräftebildung. Die Schulbauoffensive fortsetzen: Seit Beginn der Schulbauoffensive haben wir durch Erweiterungen und Neubauten deutlich über 50.000 Schulplätze geschaffen.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 42,
                "markierung": "Die Schulbauoffensive fortsetzen"
              }
            },
            {
              "id": "be-a017",
              "parteiId": "fdp",
              "kurz": "Schulen sollen ihr Personal selbst auswählen und ihre Selbstverwaltung ausbauen können. Lehrkräfte und Schulleitungen sollen von Verwaltungsaufgaben entlastet werden. Schulen sollen schulspezifisch multiprofessionelle Teams bilden dürfen.",
              "original": "Wir wollen die personelle Situation der Schulen bei der Selbstverwaltung weiter verbessern, um Lehrkräfte und die pädagogische Schulleitung von Verwaltungsaufgaben zu entlasten. Im Rahmen ihrer Personalautonomie wollen wir es Schulen außerdem ermöglichen, schulspezifisch multiprofessionelle Teams […] zu bilden.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 8,
                "markierung": "um Lehrkräfte und die pädagogische Schulleitung von Verwaltungsaufgaben zu entlasten"
              }
            },
            {
              "id": "be-a057",
              "parteiId": "afd",
              "kurz": "Die Vergabe von 30 Prozent der Schulplätze über das Losverfahren soll abgeschafft werden. Die Aufnahme an weiterführenden Schulen soll sich an Noten, Wohnortnähe und einer Geschwisterkindregelung orientieren. An freiwilligen Aufnahmetests zum Gymnasium wird festgehalten.",
              "original": "[Die Aufnahme an] weiterführenden Schulen muss sich konsequent an den Noten und der Wohnortnähe orientieren sowie eine Geschwisterkindregelung umfassen. Die Vergabe von 30 % der Schulplätze über das Losverfahren werden wir abschaffen.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 28,
                "markierung": "Die Vergabe von 30 % der Schulplätze über das Losverfahren werden wir abschaffen"
              }
            }
          ]
        },
        {
          "id": "be-f010",
          "text": "Worauf soll Bildung inhaltlich zielen?",
          "aussagen": [
            {
              "id": "be-a037",
              "parteiId": "gruene",
              "kurz": "Exkludierende Systeme sollen vollständig abgebaut und Inklusion in allen Schulen ermöglicht werden. Multiprofessionelle Teams und Schulassistenz sollen gleiche Bildungschancen sichern. Hinzu kommen ergänzende Förderung und Betreuung in Grundschulen.",
              "original": "Exkludierende Systeme müssen vollständig abgebaut und Inklusion in allen Schulen möglich gemacht werden. Multiprofessionelle Teams, Schulassistenz sowie ergänzende Förderung und Betreuung in Grundschulen sichern gleiche Bildungschancen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 154,
                "markierung": "Exkludierende Systeme müssen vollständig abgebaut und Inklusion in allen Schulen möglich gemacht werden"
              }
            },
            {
              "id": "be-a042",
              "parteiId": "linke",
              "kurz": "Schülerinnen und Schüler sollen ihren Schulalltag zunehmend selbstbestimmt mitgestalten können. Bildung soll befähigen, Gesellschaft kritisch zu verstehen. Lehrkräfte sollen bestärkt werden, emanzipatorische und partizipative Konzepte anzuwenden.",
              "original": "[…] ihren Schulalltag zunehmend selbstbestimmt mitgestalten können. Bildung soll sie befähigen, Gesellschaft kritisch zu verstehen und solidarisch zu verändern. Lehrkräfte wollen wir bestärken, emanzipatorische und partizipative pädagogische Konzepte anzuwenden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 152,
                "markierung": "Lehrkräfte wollen wir bestärken, emanzipatorische und partizipative pädagogische Konzepte anzuwenden"
              }
            },
            {
              "id": "be-a001",
              "parteiId": "bsw",
              "kurz": "Das Bildungssystem verliere zunehmend an Bildungsqualität, Chancengerechtigkeit und kultureller Tiefe. Diese Entwicklung soll umgekehrt werden. Ziel ist eine Bildungswende hin zu mündigen, selbstständig denkenden Kindern.",
              "original": "Das deutsche Bildungssystem verliert zunehmend an Bildungsqualität, Chancengerechtigkeit und kultureller Tiefe. Das BSW will diese Entwicklung umkehren. Unser Ziel ist eine Bildungswende, die die Erziehung unserer Kinder zu mündigen, selbstständig denkenden und verantwortungsbewussten [Menschen fördert].",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 14,
                "markierung": "Unser Ziel ist eine Bildungswende"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "zuwanderung",
      "titel": "Zuwanderung und Integration",
      "beschreibung": "Aufnahme, Rückführung, Einbürgerung und Arbeitsmarkt.",
      "fragen": [
        {
          "id": "be-f015",
          "text": "Wie konsequent soll Zuwanderung begrenzt werden?",
          "aussagen": [
            {
              "id": "be-a008",
              "parteiId": "cdu",
              "kurz": "Die Zahl der Abschiebungen, insbesondere aus dem Strafvollzug, sei deutlich gestiegen. Die Migrationswende sei damit vollzogen. Neue Containerunterkünfte in Berlins Kiezen soll es nicht mehr geben.",
              "original": "Die Migrationswende ist da: Die Zahl der Abschiebungen, insbesondere aus dem Strafvollzug, ist jetzt deutlich höher. Und deshalb gilt jetzt auch: Keine neuen Containerunterkünfte in Berlins Kiezen.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 18,
                "markierung": "Keine neuen Containerunterkünfte in Berlins Kiezen"
              }
            },
            {
              "id": "be-a020",
              "parteiId": "fdp",
              "kurz": "Irreguläre Migration soll unterbunden werden, wer legal komme, erhalte echte Chancen. Sprach- und Integrationskurse soll es vom ersten Tag an geben. Vermittelt werden sollen die freiheitlich-demokratische Grundordnung und der Respekt vor Gleichberechtigung.",
              "original": "Irreguläre Migration muss unterbunden werden, wer legal kommt, erhält echte Chancen. Integration fordert alle Beteiligten: Sprach- und Integrationskurse vom ersten Tag an, die Vermittlung unserer freiheitlich-demokratischen Grundordnung, den Respekt vor Gleichberechtigung.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 95,
                "markierung": "Irreguläre Migration muss unterbunden werden, wer legal kommt, erhält echte Chancen"
              }
            },
            {
              "id": "be-a044",
              "parteiId": "afd",
              "kurz": "Bei der Ausländerbehörde soll eine Sondereinheit eingerichtet werden. Diese soll die Ausweisung und Abschiebung ausländischer Krimineller betreiben. Die Maßnahmen richten sich zudem gegen Strukturen der organisierten Kriminalität.",
              "original": "Die AfD fordert: → Die Einrichtung einer Sondereinheit bei der Ausländerbehörde, die die Ausweisung und Abschiebung ausländischer Krimineller [betreibt].",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 14,
                "markierung": "Die Einrichtung einer Sondereinheit bei der Ausländerbehörde"
              }
            },
            {
              "id": "be-a022",
              "parteiId": "bsw",
              "kurz": "Wer keinen Anspruch auf Asyl habe, dürfe gar nicht erst in die EU einreisen. Dann komme es auch nicht mehr zu Schwierigkeiten bei einer Abschiebung. Die notwendigen Regelungen sollen in Deutschland zügig umgesetzt werden, damit Zuwanderung regelbasiert stattfindet.",
              "original": "Wer keinen Anspruch auf Asyl hat, darf gar nicht erst in die Europäische Union einreisen und es kann somit auch nicht mehr zu Schwierigkeiten bei einer Abschiebung kommen. Wir fordern, dass die notwendigen Regelungen in Deutschland nun zügig umzusetzen sind, damit Zuwanderung künftig regelbasiert stattfindet.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 34,
                "markierung": "Wer keinen Anspruch auf Asyl hat, darf gar nicht erst in die Europäische Union einreisen"
              }
            }
          ]
        },
        {
          "id": "be-f011",
          "text": "Wie soll die Integration derer gelingen, die hier sind?",
          "aussagen": [
            {
              "id": "be-a034",
              "parteiId": "spd",
              "kurz": "Die Anstrengungen zur Integration in den Arbeitsmarkt sollen weiter gestärkt werden, damit Menschen schnell selbst ihren Lebensunterhalt verdienen. Über Einbürgerung soll Teilhabe ermöglicht werden. Alle Berlinerinnen und Berliner sollen demokratisch mitbestimmen können.",
              "original": "[…] schnell selbst ihren Lebensunterhalt verdienen können. Deshalb stärken wir Berlins Anstrengungen zur Integration in den Arbeitsmarkt weiter. Teilhabe durch Einbürgerung: Wir wollen, dass alle Berlinerinnen und Berliner demokratisch mitbestimmen.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 52,
                "markierung": "Deshalb stärken wir Berlins Anstrengungen zur Integration in den Arbeitsmarkt weiter"
              }
            },
            {
              "id": "be-a041",
              "parteiId": "gruene",
              "kurz": "Betroffene sollen durch Rechtsberatung und aufenthaltsrechtliche Absicherung unterstützt werden, ihre Rechte ohne Angst vor Abschiebung wahrzunehmen. Dafür brauche es ausreichend Personal. Die Kernarbeitsnormen der Internationalen Arbeitsorganisation sollen beachtet werden.",
              "original": "[Mit] Rechtsberatung und aufenthaltsrechtlicher Absicherung unterstützen wir Betroffene dabei, ihre Rechte wahrzunehmen und Rechtsverfahren durchzustehen – ohne Angst vor Abschiebung. Dazu gehört auch eine ausreichende Zahl an Mitarbeiter*innen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 112,
                "markierung": "ihre Rechte wahrzunehmen und Rechtsverfahren durchzustehen – ohne Angst vor Abschiebung"
              }
            },
            {
              "id": "be-a030",
              "parteiId": "linke",
              "kurz": "Berufsbegleitende Sprachkurse und Projekte zur Arbeitsmarktintegration von Migrantinnen und Migranten sollen gestärkt werden. Der Zugang für Geflüchtete zum Arbeitsmarkt soll erleichtert werden. Behörden mit Kontakt zu migrantischen Beschäftigten sollen geschult werden.",
              "original": "Berufsbegleitende Sprachkurse und Projekte für eine bessere Arbeitsmarktintegration von Migrant*innen müssen gestärkt werden. Der Zugang für Geflüchtete zum Arbeitsmarkt muss erleichtert werden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 105,
                "markierung": "Der Zugang für Geflüchtete zum Arbeitsmarkt muss erleichtert werden"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "gesundheit",
      "titel": "Gesundheit und Krankenhäuser",
      "beschreibung": "Versorgung in den Bezirken, Kliniken und Pflege.",
      "fragen": [
        {
          "id": "be-f005",
          "text": "Wie sollen die Krankenhäuser finanziert und getragen werden?",
          "aussagen": [
            {
              "id": "be-a029",
              "parteiId": "spd",
              "kurz": "Angestrebt wird eine gerechte und flächendeckende Gesundheitsversorgung. Ambulante, stationäre und psychosoziale Angebote sollen enger zusammenarbeiten. Für die Krankenhäuser wird eine auskömmliche Finanzierung gefordert.",
              "original": "Gesundheit ist ein Menschenrecht. Deshalb wollen wir eine gerechte und flächendeckende Gesundheitsversorgung. Ambulante, stationäre und psychosoziale Angebote müssen enger zusammenarbeiten. […] Die SPD Berlin setzt sich vor diesem Hintergrund für eine auskömmliche Finanzierung ein.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 33,
                "markierung": "Deshalb wollen wir eine gerechte und flächendeckende Gesundheitsversorgung"
              }
            },
            {
              "id": "be-a032",
              "parteiId": "fdp",
              "kurz": "Wer eine Krankenhausbehandlung benötigt, soll rund um die Uhr die beste medizinische Versorgung erhalten. Angestrebt wird eine Neuordnung der Krankenhausfinanzierung am tatsächlichen Patientenbedarf. Die Trennung zwischen ambulant und stationär soll überwunden werden.",
              "original": "Wer eine Behandlung im Krankenhaus benötigt, muss rund um die Uhr an sieben Tagen in der Woche und 365 Tagen im Jahr die beste medizinische Versorgung erhalten können. […] Wir werden uns daher für eine Neuordnung der Krankenhausfinanzierung einsetzen, die sich am tatsächlichen medizinischen Patientenbedarf orientiert.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 114,
                "markierung": "eine Neuordnung der Krankenhausfinanzierung einsetzen, die sich am tatsächlichen medizinischen Patientenbedarf orientiert"
              }
            },
            {
              "id": "be-a035",
              "parteiId": "linke",
              "kurz": "Die Krankenhäuser sollen in kommunaler Hand bleiben. Wo private Konzerne sich aus der Verantwortung ziehen, soll rekommunalisiert werden. Gesundheit dürfe nicht dem Profitstreben von Krankenhauskonzernen zum Opfer fallen.",
              "original": "Unser Wohlbefinden, unsere Gesundheit darf nicht dem Profitstreben von Krankenhauskonzernen zum Opfer fallen. Wir wollen, dass unsere Krankenhäuser in kommunaler Hand bleiben und dort rekommunalisiert werden, wo sich private Konzerne aus der Verantwortung ziehen.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 8,
                "markierung": "dass unsere Krankenhäuser in kommunaler Hand bleiben und dort rekommunalisiert werden"
              }
            },
            {
              "id": "be-a040",
              "parteiId": "bsw",
              "kurz": "Das solidarische Gesundheitswesen soll gestärkt statt kaputtgespart werden. Die Zwei-Klassen-Medizin soll beendet werden. Angestrebt wird eine Bürgerversicherung als einheitliches Krankenversicherungssystem.",
              "original": "Wir wollen das solidarische Gesundheitswesen stärken, statt es weiter kaputtzusparen. Die Zwei-Klassen-Medizin muss beendet werden. […] Deshalb strebt das BSW eine Bürgerversicherung als einheitliches Krankenversicherungssystem [an].",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 21,
                "markierung": "Deshalb strebt das BSW eine Bürgerversicherung als einheitliches Krankenversicherungssystem"
              }
            }
          ]
        },
        {
          "id": "be-f006",
          "text": "Wie soll die Versorgung im Alltag erreichbar bleiben?",
          "aussagen": [
            {
              "id": "be-a054",
              "parteiId": "cdu",
              "kurz": "Dokumentations- und Meldeprozesse in Pflege und Verwaltung sollen deutlich vereinfacht werden. Gute Versorgung brauche gute Ausbildung in allen Bereichen. Angehende Pflegefachkräfte sollen ausreichend Praxisplätze finden.",
              "original": "[Wir wollen Entlastungen] in der Pflege und der Verwaltung schaffen, um Dokumentations- und Meldeprozesse deutlich zu vereinfachen. Gute Versorgung braucht gute Ausbildung in allen Bereichen der Gesundheitsversorgung. Wir setzen uns insbesondere dafür ein, dass angehende Pflegefachkräfte ausreichend Praxisplätze finden.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 99,
                "markierung": "dass angehende Pflegefachkräfte ausreichend Praxisplätze finden"
              }
            },
            {
              "id": "be-a011",
              "parteiId": "gruene",
              "kurz": "Die Gesundheitschancen unterscheiden sich in Berlin je nach Bezirk und sozioökonomischem Status stark. Haus-, Fach- und Kinderärztinnen fehlten besonders in Stadtrandlagen. Angestrebt wird eine gleichmäßige Verteilung der Vertragsarztsitze.",
              "original": "Noch immer unterscheiden sich die Gesundheitschancen in Berlin stark: Je nach Bezirk, Wohnviertel, Geschlecht und sozioökonomischem Status weichen Lebenserwartung und Krankheitshäufigkeiten voneinander ab. […] Wir setzen uns dafür ein, dass es eine gleichmäßige Verteilung von Vertragsärzt*innensitzen gibt.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 201,
                "markierung": "dass es eine gleichmäßige Verteilung von Vertragsärzt*innensitzen gibt"
              }
            },
            {
              "id": "be-a062",
              "parteiId": "afd",
              "kurz": "Eine leistungsfähige und wohnortnahe Gesundheitsversorgung sowie fürsorgliche Pflege haben herausragende Bedeutung. Grundlage sind Eigenverantwortung, Prävention sowie private und staatliche Angebote der Daseinsvorsorge. Moderne Krankenhäuser sollen gesichert werden.",
              "original": "Eine leistungsfähige und wohnortnahe Gesundheitsversorgung sowie eine fürsorgliche Pflege sind für die AfD von herausragender Bedeutung. Eigenverantwortung, Prävention, private und staatliche Angebote der Daseinsvorsorge sind die Basis für ein gesundes, langes und selbstbestimmtes Leben.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 69,
                "markierung": "Eine leistungsfähige und wohnortnahe Gesundheitsversorgung sowie eine fürsorgliche Pflege"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "wirtschaft",
      "titel": "Wirtschaft und Gewerbe",
      "beschreibung": "Gewerbeflächen, Ansiedlung und Rahmenbedingungen.",
      "fragen": [
        {
          "id": "be-f012",
          "text": "Wodurch soll Berlin als Wirtschaftsstandort wachsen?",
          "aussagen": [
            {
              "id": "be-a058",
              "parteiId": "spd",
              "kurz": "In Wirtschaftsförderung und Infrastruktur soll investiert werden. Angestrebt werden attraktive Arbeitsbedingungen mit Tarifbindung statt Lohndumping. Wachstum soll dem Wohl aller dienen.",
              "original": "Wir investieren in Wirtschaftsförderung und Infrastruktur und wollen attraktive Arbeitsbedingungen mit Tarifbindungen statt Lohndumping.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 6,
                "markierung": "Wir investieren in Wirtschaftsförderung und Infrastruktur und wollen attraktive Arbeitsbedingungen mit Tarifbindungen statt Lohndumping"
              }
            },
            {
              "id": "be-a023",
              "parteiId": "gruene",
              "kurz": "Technologie, Industrie, Forschung und Ausbildung sollen an einer gemeinsamen Schnittstelle zusammenwirken. Berlin soll als Standort für angewandte Innovation und klimaneutrale Industrie gestärkt werden. Geprüft wird die Einrichtung einer landeseigenen Innovationsagentur.",
              "original": "[…] damit Technologie, Industrie, Forschung und Ausbildung an dieser wichtigen Schnittstelle zusammenwirken und Berlin als Standort für angewandte Innovation und klimaneutrale Industrie gestärkt wird. […] prüfen wir die Einrichtung einer landeseigenen Innovationsagentur.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 98,
                "markierung": "Berlin als Standort für angewandte Innovation und klimaneutrale Industrie gestärkt wird"
              }
            },
            {
              "id": "be-a015",
              "parteiId": "afd",
              "kurz": "Berlin soll wieder industrieller Kernstandort werden. Gezielt gefördert wird die Ansiedlung in Luft- und Raumfahrt, Gesundheitswirtschaft, Halbleiter und KI. Ein öffentliches Gewerbeflächenkataster soll Flächen transparent verfügbar machen.",
              "original": "[Der] Energiestandort Berlin muss wieder industrieller Kernstandort werden. Wir fördern gezielt die Ansiedlung von Unternehmen in den Bereichen: + Luft- und Raumfahrt; + Gesundheitswirtschaft; + Halbleiter, KI […]. Flächen für Gewerbe und Industrie – transparent und verfügbar: Ein öffentliches Gewerbeflächenkataster […].",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 47,
                "markierung": "Wir fördern gezielt die Ansiedlung von Unternehmen in den Bereichen"
              }
            }
          ]
        },
        {
          "id": "be-f008",
          "text": "Wem soll die Wirtschaftspolitik vor allem dienen?",
          "aussagen": [
            {
              "id": "be-a016",
              "parteiId": "cdu",
              "kurz": "Für mehr Transparenz auf dem Gewerbemarkt soll ein systematisches Leerstandsmonitoring von Büro- und Gewerbeflächen eingeführt werden. Das Leerstandsmanagement landeseigener Immobilien soll weiterentwickelt werden. Flächen sollen gezielt für Start-ups und Unternehmen genutzt werden.",
              "original": "Für mehr Transparenz über die Entwicklungen auf dem Gewerbemarkt setzen wir uns für die Einführung eines systematischen Leerstandsmonitorings von Büro- und Gewerbeflächen ein. Wir werden das Leerstandsmanagement landeseigener Immobilien weiterentwickeln und gezielt für die Nutzung durch Start-ups und Unternehmen [öffnen].",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 37,
                "markierung": "die Einführung eines systematischen Leerstandsmonitorings von Büro- und Gewerbeflächen"
              }
            },
            {
              "id": "be-a052",
              "parteiId": "fdp",
              "kurz": "Berlin sei trotz Universitäten und lebendiger Start-up-Szene größter Nettoempfänger im Länderfinanzausgleich. Als Grund werden Bürokratie und endlose Genehmigungsverfahren genannt. Investoren würden abgeschreckt statt empfangen.",
              "original": "Trotzdem sind wir nach Jahrzehnten als Hauptstadt immer noch der größte Nettoempfänger im Länderfinanzausgleich. Der Grund ist klar: Während andere Städte Investorinnen und Investoren freundlich empfangen, schrecken wir sie mit Bürokratie-Wahnsinn, endlosen Genehmigungsverfahren […] [ab].",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 18,
                "markierung": "schrecken wir sie mit Bürokratie-Wahnsinn, endlosen Genehmigungsverfahren"
              }
            },
            {
              "id": "be-a002",
              "parteiId": "linke",
              "kurz": "Bei der Vergabe von Gewerbeflächen sollen Anwohnerinnen und Anwohner eng eingebunden werden. Eigene Bestände sollen wo möglich für Nahversorgung und soziale Angebote genutzt werden. Zwangsräumungen wegen Mietschulden werden abgelehnt.",
              "original": "Wo immer möglich, sollen eigene Bestände für eine gute Nahversorgung für den täglichen Bedarf und soziale Angebote genutzt werden. Bei der Vergabe von Gewerbeflächen sollen Anwohner*innen und deren Vertretungen eng eingebunden werden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 15,
                "markierung": "Bei der Vergabe von Gewerbeflächen sollen Anwohner*innen und deren Vertretungen eng eingebunden werden"
              }
            },
            {
              "id": "be-a024",
              "parteiId": "bsw",
              "kurz": "Die Wirtschaftspolitik rückt Familienbetriebe, Selbständige und Freiberufler in den Mittelpunkt. Schwerpunkte sind der Abbau von Überregulierung, der Ausbau digitaler Verwaltungsleistungen und die Ausbildungsförderung. Zusätzlich wird ein Mutterschutz für Selbständige gefordert.",
              "original": "Die Wirtschaftspolitik des Berliner BSW rückt Familienbetriebe, Selbständige und Freiberufler […] in den Mittelpunkt. Wir konzentrieren uns auf den Abbau von Überregulierung, den Ausbau digitaler Verwaltungsleistungen und die Ausbildungsförderung. Außerdem setzen wir uns für einen Mutterschutz für Selbständige ein.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 42,
                "markierung": "Wir konzentrieren uns auf den Abbau von Überregulierung, den Ausbau digitaler Verwaltungsleistungen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "klima",
      "titel": "Klima, Energie und Wärme",
      "beschreibung": "Klimaziele, Wärmeversorgung und Energiekosten.",
      "fragen": [
        {
          "id": "be-f016",
          "text": "Wie soll die Wärmeversorgung bezahlbar und klimafreundlich werden?",
          "aussagen": [
            {
              "id": "be-a013",
              "parteiId": "fdp",
              "kurz": "Gesetzt wird auf einen massiven Ausbau der Geothermie, um die Wärmeversorgung klimaneutral zu gestalten. Die CO2-Emissionen der Fernwärme sollen weitgehend reduziert und die Netze ausgeweitet werden. Bevorzugt werden Technologieoffenheit und private Investitionen.",
              "original": "Zudem setzen wir auf den massiven Ausbau der Geothermie in Berlin, um die Wärmeversorgung klimaneutral zu gestalten. Wir wollen die CO2-Emissionen der Fernwärme weitgehend reduzieren und die Fern- und Nahwärmenetze im Stadtgebiet ausweiten.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 87,
                "markierung": "den massiven Ausbau der Geothermie in Berlin, um die Wärmeversorgung klimaneutral zu gestalten"
              }
            },
            {
              "id": "be-a012",
              "parteiId": "afd",
              "kurz": "Die stark gestiegenen Preise für Strom, Gas und Heizöl wirkten sich auf die Kosten der Fernwärmeversorgung aus. Für Mieter landeseigener Wohnungsgesellschaften habe das zu drastischen Nachzahlungen geführt. Als Ursache wird die gescheiterte Energiewende benannt.",
              "original": "Die infolge der gescheiterten „Energiewende“ und steuerlicher Belastungen stark gestiegenen Preise für Strom, Gas und Heizöl wirken sich auch auf die Kosten der Fernwärmeversorgung aus. Dies hat nicht nur für Mieter der landeseigenen Wohnungsgesellschaften zu teilweise drastischen Nachzahlungen geführt.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 7,
                "markierung": "stark gestiegenen Preise für Strom, Gas und Heizöl wirken sich auch auf die Kosten der Fernwärmeversorgung aus"
              }
            },
            {
              "id": "be-a021",
              "parteiId": "bsw",
              "kurz": "Mit hoher Priorität soll für eine stabile, bezahlbare und krisenfeste Versorgung mit Strom, Wasser und Fernwärme gesorgt werden. Die Infrastruktur soll verlässlich finanziert werden. Betont wird die Bedeutung eines starken Wissenschafts- und Technologiestandorts.",
              "original": "Gleichzeitig ist mit hoher Priorität für eine stabile, bezahlbare und krisenfeste Versorgung mit Strom, Wasser und Fernwärme zu sorgen.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 43,
                "markierung": "für eine stabile, bezahlbare und krisenfeste Versorgung mit Strom, Wasser und Fernwärme zu sorgen"
              }
            }
          ]
        },
        {
          "id": "be-f018",
          "text": "Wie verbindlich sollen die Berliner Klimaziele sein?",
          "aussagen": [
            {
              "id": "be-a006",
              "parteiId": "cdu",
              "kurz": "Der Wettbewerb verschiedener Energieträger wie Gas, Fernwärme und Wärmepumpen soll erhalten bleiben. Nur so blieben Heizkosten dauerhaft bezahlbar. Einseitige staatliche Vorgaben werden abgelehnt.",
              "original": "Den Wettbewerb verschiedener Energieträger wie Gas, Fernwärme und Wärmepumpen wollen wir erhalten, denn nur so bleiben Heizkosten dauerhaft bezahlbar. Einseitige staatliche Vorgaben lehnen wir ab.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 31,
                "markierung": "Den Wettbewerb verschiedener Energieträger wie Gas, Fernwärme und Wärmepumpen wollen wir erhalten"
              }
            },
            {
              "id": "be-a036",
              "parteiId": "spd",
              "kurz": "Die Partei steht zu den Klimaschutzzielen und kämpft für Klimaneutralität vor dem Jahr 2045. Das Berliner Energiewendegesetz soll umgesetzt werden. Mieterinnen und Mieter sollen durch Klimaschutzmaßnahmen nicht zusätzlich belastet werden.",
              "original": "Wir stehen zu den Klimaschutzzielen, kämpfen für Klimaneutralität vor dem Jahr 2045 und stehen zur Umsetzung des Berliner Energiewendegesetzes.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 59,
                "markierung": "kämpfen für Klimaneutralität vor dem Jahr 2045 und stehen zur Umsetzung des Berliner Energiewendegesetzes"
              }
            },
            {
              "id": "be-a060",
              "parteiId": "gruene",
              "kurz": "Berlin solle sich an Hamburg orientieren, das bereits 2040 klimaneutral sein will. Der Fahrplan zur Klimaneutralität soll auf solide Beine gestellt und mit klaren Prioritäten hinterlegt werden, um die Ziele schnellstmöglich zu erreichen.",
              "original": "Berlin muss sich ein Vorbild an Hamburg nehmen, das nun schon 2040 klimaneutral sein will. In Regierungsverantwortung werden wir den Fahrplan zur Klimaneutralität und -anpassung auf solide Beine stellen und Prioritäten setzen, um die Ziele schnellstmöglich zu erreichen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 11,
                "markierung": "Berlin muss sich ein Vorbild an Hamburg nehmen"
              }
            },
            {
              "id": "be-a063",
              "parteiId": "linke",
              "kurz": "Der Luftverkehrssektor müsse klimaneutral werden. Dafür sollen die erforderlichen Voraussetzungen geschaffen werden. Gefordert wird ein Verbot von Kurzstreckenflügen, wenn es Alternativen gibt.",
              "original": "Klimaschutz im Luftverkehr: Der Luftverkehrssektor muss klimaneutral werden. Dafür unterstützen wir die Schaffung der erforderlichen Voraussetzungen. Wir setzen uns für ein Verbot von Kurzstreckenflügen ein.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 71,
                "markierung": "Wir setzen uns für ein Verbot von Kurzstreckenflügen ein"
              }
            }
          ]
        }
      ]
    }
  ]
}
);
