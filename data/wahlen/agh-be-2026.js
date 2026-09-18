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
      "logo": "assets/logos/cdu.svg",
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
      "logo": "assets/logos/spd.svg",
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
      "logo": "assets/logos/gruene.svg",
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
      "logo": "assets/logos/fdp.svg",
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
      "logo": "assets/logos/afd.svg",
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
      "logo": "assets/logos/linke.svg",
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
      "logo": "assets/logos/bsw.svg",
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
          "id": "be-f021",
          "text": "Wie stark soll der Staat in den Mietmarkt eingreifen?",
          "aussagen": [
            {
              "id": "be-a095",
              "parteiId": "cdu",
              "kurz": "Enteignungen und einem Mietendeckel wird eine Absage erteilt; Mieter sollen ihre Rechte leichter durchsetzen.",
              "original": "Populistischen Forderungen nach Enteignungen oder der Einführung eines Mietendeckels erteilen wir eine klare Absage. Solche Eingriffe sind keine Lösung für den angespannten Wohnungsmarkt, sondern verschärfen die Situation.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 30,
                "markierung": "Populistischen Forderungen nach Enteignungen oder der Einführung eines Mietendeckels erteilen wir eine klare Absage"
              }
            },
            {
              "id": "be-a097",
              "parteiId": "linke",
              "kurz": "Für die kommunalen Wohnungen soll ein Mietendeckel gelten; ein Landesamt für Mieterschutz ahndet Verstöße.",
              "original": "Unsere kommunalen Wohnungen müssen bezahlbar bleiben. Deshalb werden wir dort einen Mietendeckel durchsetzen. Mit unserem Landesamt für Mieterschutz schaffen wir eine handlungsfähige Behörde, die Verstöße ahndet und Recht durchsetzt.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 7,
                "markierung": "Deshalb werden wir dort einen Mietendeckel durchsetzen"
              }
            },
            {
              "id": "be-a037",
              "parteiId": "bsw",
              "kurz": "Die Mietenregulierung soll geschärft werden; über den Bundesrat soll zusätzlich ein Mietendeckel kommen.",
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
          "id": "be-f003",
          "text": "Wie soll mit Milieuschutz- und Sanierungsgebieten umgegangen werden?",
          "aussagen": [
            {
              "id": "be-a056",
              "parteiId": "spd",
              "kurz": "Bei An- und Ummeldung soll über Mietpreisbremse und Beratung informiert werden; Milieuschutzgebiete wachsen.",
              "original": "Bei An- und Ummeldungen informieren wir über Mietpreisbremse und Mietwucher, verweisen auf kostenlose Beratung in den Bezirken und erklären Schutzregeln in Milieuschutzgebieten. Wir setzen uns für die Ausweitung von Milieuschutzgebieten ein.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 20,
                "markierung": "Wir setzen uns für die Ausweitung von Milieuschutzgebieten ein"
              }
            },
            {
              "id": "be-a089",
              "parteiId": "gruene",
              "kurz": "Sanierungen in Milieuschutzgebieten sollen gefördert werden, damit Mieter den Energiekosten nicht ausgeliefert sind.",
              "original": "Mieter*innen in unsanierten Häusern dürfen den Kostensteigerungen fossiler Brennstoffe nicht ungeschützt ausgesetzt werden. Das Land Berlin soll insbesondere in Milieuschutzgebieten ambitionierte Sanierungen fördern und Gebäudeeigentümer entsprechend beraten.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 16,
                "markierung": "Das Land Berlin soll insbesondere in Milieuschutzgebieten ambitionierte Sanierun gen fördern"
              }
            },
            {
              "id": "be-a058",
              "parteiId": "fdp",
              "kurz": "Das öffentliche Vorkaufsrecht soll in Milieuschutzgebieten nur noch für öffentliche Infrastruktur gelten.",
              "original": "Die landeseigenen WBG sollen aus ihren Beständen auch Wohnraum für von Wohnungslosigkeit bedrohte Menschen zur Verfügung stellen. In Sanierungs- und Milieuschutzgebieten soll das öffentliche Vorkaufsrecht, außer für öffentliche Infrastruktur, nicht mehr ausgeübt werden.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 38,
                "markierung": "In Sanierungs- und Milieuschutzgebieten soll das öffentliche Vorkaufsrecht, außer für öffentliche Infrastruktur, nicht mehr ausgeübt werden"
              }
            },
            {
              "id": "be-a022",
              "parteiId": "afd",
              "kurz": "Die Fehlbelegungsabgabe soll zurückkommen, Untervermietung von Sozialwohnungen verboten, Milieuschutz begrenzt.",
              "original": "[Wir wollen] die Fehlbelegungsabgabe wieder einführen. Um den Missbrauch zu verhindern, setzen wir uns für ein generelles Verbot der Untervermietung von Sozialwohnungen ein. Milieuschutz begrenzen: Die Ausweisung von Wohnvierteln als Milieuschutzgebiete (§ 172 BauGB) […].",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 6,
                "markierung": "wir uns für ein generelles Verbot der Untervermietung von Sozialwohnungen ein"
              }
            }
          ]
        },
        {
          "id": "be-f012",
          "text": "Soll der Rand des Tempelhofer Feldes bebaut werden?",
          "aussagen": [
            {
              "id": "be-a017",
              "parteiId": "cdu",
              "kurz": "Am Rand des Tempelhofer Feldes sollen mehr als 20.000 Wohnungen entstehen, das übrige Feld bleibt Erholungsort.",
              "original": "Wir bekennen uns klar zur Randbebauung des Tempelhofer Feldes. Auf den Randflächen des Feldes sollen mehr als 20.000 neue Wohnungen für etwa 50.000 Menschen entstehen. Darüber hinaus soll das Tempelhofer Feld als Ort für Sport, Freizeit, Kultur und Erholung erhalten und zugleich gezielt weiterentwickelt werden.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 36,
                "markierung": "Auf den Randflächen des Feldes sollen mehr als 20.000 neue Wohnungen"
              }
            },
            {
              "id": "be-a099",
              "parteiId": "spd",
              "kurz": "Das Tempelhofer Feld soll bleiben, wie es ist; Wohnungen am Rand kommen nicht infrage, solange Flächen brachliegen.",
              "original": "Das Tempelhofer Feld ist ein besonderer Ort für Klima, Bewegung und soziales Miteinander. Wir erhalten es in seiner heutigen Funktion und entwickeln es behutsam weiter. […] Wohnungen am Feldrand kommen nicht in Frage, solang die bisherigen Flächen in Berlin ungenutzt sind […]",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 19,
                "markierung": "Wohnungen am Feldrand kommen nicht in Frage"
              }
            },
            {
              "id": "be-a008",
              "parteiId": "gruene",
              "kurz": "Das Tempelhofer Feld soll geschützt bleiben: als Kaltluftquelle, Lebensraum für Tiere und Pflanzen und Erholungsort.",
              "original": "Das Tempelhofer Feld, mit seiner herausragenden Bedeutung für das Stadtklima und seiner Funktion als wichtige Kaltluftquelle, Lebensraum zahlreicher Pflanzen- und Tierarten sowie einzigartiger Erholungsort, soll weiterhin geschützt bleiben.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 22,
                "markierung": "soll weiterhin geschützt bleiben"
              }
            },
            {
              "id": "be-a077",
              "parteiId": "bsw",
              "kurz": "Über eine Randbebauung soll erneut die Bevölkerung entscheiden; Volksentscheide bleiben dem Parlament entzogen.",
              "original": "Gesetze, die durch einen Volksentscheid zustande gekommen sind, können nicht durch das Abgeordnetenhaus allein geändert werden, sondern müssen der Bevölkerung erneut zur Abstimmung gestellt werden (Bsp. Randbebauung Tempelhofer Feld).",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 32,
                "markierung": "müssen der Bevölkerung erneut zur Abstimmung gestellt werden"
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
          "id": "be-f015",
          "text": "Wo und wie soll Videoüberwachung eingesetzt werden?",
          "aussagen": [
            {
              "id": "be-a006",
              "parteiId": "cdu",
              "kurz": "An Kriminalitätsschwerpunkten soll es mehr Videoüberwachung und Messerverbotszonen geben, dazu Taser.",
              "original": "Genau hinschauen, was passiert, um Kriminelle dingfest zu machen: An bekannten Kriminalitätsschwerpunkten kommen nun verstärkt Videoüberwachung und Waffen- und Messerverbotszonen zum Einsatz. Mit messbarem Erfolg […].",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 6,
                "markierung": "An bekannten Kriminalitätsschwerpunkten kommen nun verstärkt Videoüberwachung und Waffen- und Messerverbotszonen zum Einsatz"
              }
            },
            {
              "id": "be-a055",
              "parteiId": "fdp",
              "kurz": "An Risikoorten soll neben zeitweiliger Videoüberwachung mit Beleuchtung und offenen Sichtachsen gearbeitet werden.",
              "original": "Wir möchten Security by Design berlinweit implementieren. An Berliner Risikoorten wie Bahnhöfen oder Drogenumschlagplätzen wollen wir – neben der temporären Videoüberwachung – mit baulichen Maßnahmen wie guter Beleuchtung, offenen Sichtachsen, Verhinderung dunkler Ecken die Sicherheit […] [erhöhen].",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 67,
                "markierung": "neben der temporären Videoüberwachung – mit baulichen Maßnahmen wie guter Beleuchtung"
              }
            },
            {
              "id": "be-a076",
              "parteiId": "afd",
              "kurz": "Gefordert wird eine vollständige Videoüberwachung aller Brennpunkte, dazu mobile Wachen in Problemvierteln.",
              "original": "Die AfD fordert: → Die sofortige Aufhebung des Landesantidiskriminierungsgesetzes und die Überarbeitung anderer sicherheitsrelevanter Gesetze. → Eine vollständige Videoüberwachung in allen Brennpunktbereichen. → Die Einführung mobiler Polizeiwachen in Problemvierteln.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 13,
                "markierung": "Eine vollständige Videoüberwachung in allen Brennpunktbereichen"
              }
            },
            {
              "id": "be-a091",
              "parteiId": "bsw",
              "kurz": "Videoüberwachung soll nur an belasteten Orten stehen, mit parlamentarischer Genehmigung und Auswertung in Echtzeit.",
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
              "id": "be-a088",
              "parteiId": "spd",
              "kurz": "Kriminalitätsbelastete Orte sollen regelmäßig parlamentarisch kontrolliert werden; Palantir wird abgelehnt.",
              "original": "[Wir unterziehen] die Einstufung kriminalitätsbelasteter Orte einer regelmäßigen parlamentarischen Kontrolle. […] Den Einsatz von Software intransparente und datenschutzrechtlich bedenklicher Hersteller wie Palantir lehnen wir für Berlin entschieden [ab].",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 31,
                "markierung": "die Einstufung kriminalitätsbelasteter Orte einer regelmäßigen parlamentarischen Kontrolle"
              }
            },
            {
              "id": "be-a082",
              "parteiId": "gruene",
              "kurz": "Kriminalitätsbelastete Orte und Waffenverbotszonen sollen überprüft und wo nötig wieder abgeschafft werden.",
              "original": "Wir werden die bestehenden kriminalitätsbelasteten Orte und Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen und werden sie, wo erforderlich, wieder abschaffen. Die Ergebnisse der Bodycam-Studie wollen wir umsetzen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 228,
                "markierung": "Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen und werden sie, wo erforderlich, wieder abschaffen"
              }
            },
            {
              "id": "be-a094",
              "parteiId": "linke",
              "kurz": "Die Aufrüstung der Polizei soll enden; anlasslose Kontrollen und Verbotszonen gelten als wenig zielführend.",
              "original": "Aufrüstung der Polizei wollen wir stoppen und die Mittel umverteilen. Polizeieinsätze z. B. bei Demos, anlasslosen Kontrollen an KBOs und Waffenverbotszonen oder Fußballspielen sind personalintensiv und oft nicht zielführend.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 288,
                "markierung": "Aufrüstung der Polizei wollen wir stoppen und die Mittel umverteilen"
              }
            }
          ]
        },
        {
          "id": "be-f017",
          "text": "Sollen Waffen- und Messerverbotszonen bestehen bleiben?",
          "aussagen": [
            {
              "id": "be-a051",
              "parteiId": "afd",
              "kurz": "Messerverbotszonen gelten als Symbolpolitik; stattdessen härtere Strafen und mehr anlasslose Kontrollen.",
              "original": "Die Verschärfung des Strafrahmens der gefährlichen Körperverletzung bei Angriffen mit Messern, Schnellverfahren bei Messerdelikten, zügige Abschiebung ausländischer Messerstraftäter sowie die Ausweitung anlassloser Kontrollen an kriminalitätsbelasteten Orten. Messerverbotszonen lehnen wir als reine Symbolpolitik ab.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 15,
                "markierung": "Messerverbotszonen lehnen wir als reine Symbolpolitik ab"
              }
            },
            {
              "id": "be-a054",
              "parteiId": "gruene",
              "kurz": "Kriminalitätsbelastete Orte und Verbotszonen sollen überprüft und wo nötig wieder abgeschafft werden.",
              "original": "Wir werden die bestehenden kriminalitätsbelasteten Orte und Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen und werden sie, wo erforderlich, wieder abschaffen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 228,
                "markierung": "Messer- und Waffenverbotszonen auf ihre Sinnhaftigkeit überprüfen"
              }
            },
            {
              "id": "be-a090",
              "parteiId": "spd",
              "kurz": "Verbotszonen sollen die Ausnahme bleiben; verdachtsunabhängige Kontrollen werden aufs Nötige beschränkt.",
              "original": "Verdachtsunabhängige Kontrollen wollen wir räumlich und in ihrem Anwendungsbereich auf das notwendige Minimum beschränken. Waffen- und Messerverbotszonen sollen die Ausnahme bleiben.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 30,
                "markierung": "Waffen- und Messerverbotszonen sollen die Ausnahme bleiben"
              }
            },
            {
              "id": "be-a015",
              "parteiId": "linke",
              "kurz": "Anlasslose Kontrollen an belasteten Orten gelten als personalintensiv und oft nicht zielführend.",
              "original": "[…] Aufrüstung der Polizei wollen wir stoppen und die Mittel umverteilen. Polizeieinsätze z. B. bei Demos, anlasslosen Kontrollen an KBOs und Waffenverbotszonen oder Fußballspielen sind personalintensiv und oft nicht zielführend.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 288,
                "markierung": "anlasslosen Kontrollen an KBOs und Waffenverbotszonen"
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
          "id": "be-f010",
          "text": "Welcher Verkehrsart soll in der Stadt Vorrang eingeräumt werden?",
          "aussagen": [
            {
              "id": "be-a050",
              "parteiId": "gruene",
              "kurz": "Niemand soll ein Auto besitzen müssen; für Handwerk und Lieferverkehr gibt es mehr reservierte Flächen.",
              "original": "[Wir schaffen] Schulzonen und sichere Schulwege von der Haustür bis zum Schuleingang und gestalten lebenswerte Kieze, in denen man entspannt zu Fuß gehen kann. […] Man muss kein Auto mehr besitzen, um mobil zu sein – alle können sich frei und unabhängig bewegen. Und für die, die auf ein Auto angewiesen sind – beispielsweise Handwerker*innen, Lieferverkehr oder Menschen mit Mobilitätseinschränkungen –, gibt es mehr reservierte Parkplätze wie Lieferbereiche und Behindertenparkplätze.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 81,
                "markierung": "Man muss kein Auto mehr besitzen, um mobil zu sein"
              }
            },
            {
              "id": "be-a066",
              "parteiId": "afd",
              "kurz": "Das Auto bleibt unverzichtbarer Teil städtischer Mobilität; im Nahverkehr soll es Zugangskontrollen geben.",
              "original": "→ Zugangsbeschränkungen für Personen ohne Fahrschein. → Eine bessere Einbindung des Regionalverkehrs in das Gesamtnetz. Für diskriminierungsfreien Autoverkehr: Der motorisierte Individualverkehr bleibt für uns auch in Zukunft ein unverzichtbarer Bestandteil urbaner Mobilität.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 42,
                "markierung": "Der motorisierte Individualverkehr bleibt für uns auch in Zukunft ein unverzichtbarer Bestandteil urbaner Mobilität"
              }
            },
            {
              "id": "be-a034",
              "parteiId": "linke",
              "kurz": "Vorrang hat ein überzeugendes Nahverkehrsangebot, dazu ein dichtes Radwegenetz und barrierefreie Gehwege.",
              "original": "Unsere Priorität liegt daher auf einem überzeugenden Angebot im öffentlichen Personennahverkehr (ÖPNV) sowie dem Ausbau eines umfassenden Radwegenetzes und von barrierefreien Gehwegen. So ermöglichen wir allen eine kostengünstige Mobilität.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 55,
                "markierung": "Unsere Priorität liegt daher auf einem überzeugenden Angebot im öffentlichen Personennahverkehr"
              }
            },
            {
              "id": "be-a007",
              "parteiId": "bsw",
              "kurz": "Statt eines Gegeneinanders sollen Auto, Rad und Nahverkehr nebeneinander funktionieren, auch in den Außenbezirken.",
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
          "id": "be-f019",
          "text": "Worin soll beim Verkehr zuerst investiert werden?",
          "aussagen": [
            {
              "id": "be-a043",
              "parteiId": "cdu",
              "kurz": "Das Radwegenetz soll bedarfsgerecht wachsen, vorrangig durch Sanierung der vorhandenen Wege.",
              "original": "Mit dem Rad durch die Stadt: Das Berliner Radwegenetz werden wir gezielt verbessern und bedarfsgerecht ausbauen. Vorrang hat für uns die Sanierung und Ertüchtigung bestehender Wege.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 71,
                "markierung": "Das Berliner Radwegenetz werden wir gezielt verbessern und bedarfsgerecht ausbauen. Vorrang hat für uns die Sanierung"
              }
            },
            {
              "id": "be-a010",
              "parteiId": "spd",
              "kurz": "Der Ausbau der Straßenbahn soll in allen Bezirken vorangehen, die Busflotte wird weiter elektrifiziert.",
              "original": "Die Elektrifizierung des Busverkehrs setzen wir fort und senken damit zugleich den Lärm in der Stadt. Wir treiben den Ausbau der Straßenbahn in allen Bezirken voran, finanzieren laufende Projekte […].",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 24,
                "markierung": "Wir treiben den Ausbau der Straßenbahn in allen Bezirken voran"
              }
            },
            {
              "id": "be-a025",
              "parteiId": "fdp",
              "kurz": "Vorhandene Radwege sollen repariert werden, auch unterhalb der Normbreite, statt auf Konzepte zu warten.",
              "original": "Bestehende Radwege müssen repariert werden, auch wenn sie nicht der „Normbreite“ entsprechen, anstatt zehn Jahre auf ein „Verkehrskonzept“ und dessen Umsetzung zu warten.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 55,
                "markierung": "Bestehende Radwege müssen repariert werden, auch wenn sie nicht der „Normbreite“ entsprechen"
              }
            }
          ]
        },
        {
          "id": "be-f026",
          "text": "Soll die A 100 weitergebaut werden?",
          "aussagen": [
            {
              "id": "be-a098",
              "parteiId": "cdu",
              "kurz": "Der Weiterbau der A 100 und die Tangentialverbindung Ost sollen entschlossen vorangetrieben werden.",
              "original": "Übergeordnete Projekte wie den Weiterbau der A 100 oder die Tangentialverbindung Ost (TVO) werden wir entschlossen vorantreiben, um Wohngebiete von Durchgangsverkehr zu entlasten und insbesondere Stadtteile im Berliner Osten besser anzubinden.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 69,
                "markierung": "werden wir entschlossen vorantreiben, um Wohngebiete von Durchgangsverkehr zu entlasten"
              }
            },
            {
              "id": "be-a005",
              "parteiId": "fdp",
              "kurz": "Die A 100 soll zügig bis zur Storkower Straße weitergebaut werden, dazu neue Verbindungen im Nordosten.",
              "original": "Vor allem der Berliner Osten ist noch nicht in ausreichendem Umfang an das Hauptstraßennetz angeschlossen. Der zügige Weiterbau der A 100 durch den 17. Bauabschnitt bis Storkower Straße und der Fertigbau der Tangentialverbindung Ost (TVO) sowie neuer Straßenverbindungen, vor allem im Nordosten und Süden der Stadt, haben für uns daher weiterhin Priorität.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 62,
                "markierung": "Der zügige Weiterbau der A 100 durch den 17. Bauabschnitt bis Storkower Straße"
              }
            },
            {
              "id": "be-a020",
              "parteiId": "linke",
              "kurz": "Neue Autobahnen werden abgelehnt: Die A 100 soll am Treptower Park enden, vorhandene brauchen Lärmschutz.",
              "original": "Neue Autobahnen in Berlin lehnen wir ab. An bestehenden Autobahnen müssen Lärmschutzlösungen ermöglicht werden. Wir fordern, dass die A100 qualifiziert am Treptower Park beendet und nicht weiter ausgebaut wird.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 69,
                "markierung": "Neue Autobahnen in Berlin lehnen wir ab"
              }
            },
            {
              "id": "be-a074",
              "parteiId": "spd",
              "kurz": "Statt des Weiterbaus sollen Straßen und Brücken saniert und nachhaltige Mobilität gefördert werden.",
              "original": "Statt die A100 weiterzubauen, setzen wir auf den Erhalt unserer Straßen und Brücken sowie auf nachhaltige Mobilität. Wir setzen uns beim Bund dafür ein, dass Investitionsmittel stärker als bisher für die Sanierung von Straßen und Brücken […] eingesetzt werden.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 26,
                "markierung": "Statt die A100 weiterzubauen, setzen wir auf den Erhalt unserer Straßen und Brücken"
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
              "id": "be-a061",
              "parteiId": "spd",
              "kurz": "Der digitale Wirtschaftsservice soll kommen und mehr Leistungen sollen digital angeboten werden.",
              "original": "Wir setzen den DIWI – den digitalen Wirtschaftsservice der Berliner Verwaltung – um und bieten noch mehr Leistungen digital an. Außerdem setzen wir mit digitalen Tools ein modernes Vergaberecht um.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 11,
                "markierung": "den digitalen Wirtschaftsservice der Berliner Verwaltung – um und bieten noch mehr Leistungen digital an"
              }
            },
            {
              "id": "be-a003",
              "parteiId": "gruene",
              "kurz": "Die internen Abläufe sollen vollständig digitalisiert und die E-Akte überall eingeführt werden.",
              "original": "Um das Angebot unserer Behörden verbessern zu können, müssen wir die internen Prozesse in den Verwaltungen vollständig digitalisieren. Dafür führen wir übergreifend in allen Verwaltungen die E-Akte ein.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 71,
                "markierung": "Dafür führen wir übergreifend in allen Verwaltungen die E-Akte ein"
              }
            },
            {
              "id": "be-a052",
              "parteiId": "fdp",
              "kurz": "Für neue Gesetze sollen die Grundsätze digital only und digital once gelten: Daten nur einmal übermitteln.",
              "original": "Bei neuen Gesetzen und Verordnungen oder auch bei Änderungen sorgen wir dafür, dass alle damit verbundenen Verwaltungsvorgänge digitaltauglich umgesetzt werden können. Die Grundsätze „digital only“ und „digital once“ (Übermittlung von Daten nur noch einmal an die Berliner [Verwaltung]) […].",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 21,
                "markierung": "dass alle damit verbundenen Verwaltungsvorgänge digitaltauglich umgesetzt werden können"
              }
            },
            {
              "id": "be-a041",
              "parteiId": "bsw",
              "kurz": "Verwaltung sei Dienstleistung und müsse schneller werden; Papierakten sollen abgelöst werden.",
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
          "id": "be-f013",
          "text": "Worauf soll es bei der Verwaltungsreform jetzt ankommen?",
          "aussagen": [
            {
              "id": "be-a009",
              "parteiId": "cdu",
              "kurz": "Die Reform soll klare Verantwortung und starke Bezirke bringen und das Behörden-Pingpong beenden.",
              "original": "Mit der großen Verwaltungsreform setzen wir um, woran Vorgängersenate 25 Jahre gescheitert sind: klare Verantwortung, starke Bezirke, kein Behörden-Pingpong mehr. Wir bringen Berlin nach und nach wieder zum Funktionieren – für eine Verwaltung, die zuallererst den Bürgern dient.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 87,
                "markierung": "klare Verantwortung, starke Bezirke, kein Behörden-Pingpong mehr"
              }
            },
            {
              "id": "be-a062",
              "parteiId": "afd",
              "kurz": "Investiert werden müsse in Verwaltungsmodernisierung und kritische Systeme; der Stau liege über 100 Milliarden.",
              "original": "Der Investitionsstau der öffentlichen Hand beläuft sich inzwischen auf weit über 100 Mrd. Euro. Investitionen sind erforderlich, insbesondere in: Die Infrastruktur; die Verwaltungsmodernisierung; die Digitalisierung kritischer Systeme; Sicherheits- und Rettungsdienste; Substanzerhalt öffentlicher Gebäude.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 96,
                "markierung": "die Verwaltungsmodernisierung; die Digitalisierung kritischer Systeme"
              }
            },
            {
              "id": "be-a087",
              "parteiId": "linke",
              "kurz": "Die Verwaltung soll digitaler und effizienter werden; Geld für Überwachungskameras fließt ins Soziale.",
              "original": "Wir reduzieren die Ausgaben für Überwachungskameras und investieren stattdessen in soziale Angebote. Wir müssen unsere Verwaltung digitaler und effizienter machen und die Verwaltungsreform mit Leben füllen.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 11,
                "markierung": "Wir müssen unsere Verwaltung digitaler und effizienter machen und die Verwaltungsreform mit Leben füllen"
              }
            }
          ]
        },
        {
          "id": "be-f025",
          "text": "Wie offen sollen Daten und Unterlagen der Verwaltung sein?",
          "aussagen": [
            {
              "id": "be-a013",
              "parteiId": "linke",
              "kurz": "Ein Transparenzgesetz soll Veröffentlichungspflichten mit Fristen bringen, maschinenlesbar statt als Scan.",
              "original": "Transparenz ist Voraussetzung demokratischer Kontrolle, sie entsteht jedoch nicht allein durch politische Absichtserklärungen. Ein Transparenzgesetz für Berlin muss konkrete Veröffentlichungspflichten, verbindliche Fristen und maschinenlesbare Formate vorsehen. Informationen dürfen nicht nur als gescannte Dokumente bereitgestellt werden, sondern müssen strukturiert, durchsuchbar und technisch weiterverarbeitbar sein.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 257,
                "markierung": "Ein Transparenzgesetz für Berlin muss konkrete Veröffentlichungspflichten"
              }
            },
            {
              "id": "be-a028",
              "parteiId": "spd",
              "kurz": "Alle nicht sensiblen Verwaltungsdaten sollen öffentlich und über ein zentrales Portal in Echtzeit abrufbar sein.",
              "original": "Deshalb gilt für Daten das Prinzip „Open by default“. Alle nichtsensiblen Verwaltungsdaten sollen grundsätzlich öffentlich sein. Daten zur kritischen Infrastruktur bedürfen eines besonderen Schutzes. Wir streben ein umfassendes Transparenzgesetz und ein zentrales Transparenzportal an. In einem übersichtlichen Dashboard sollen Daten in Echtzeit abrufbar sein.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 62,
                "markierung": "Wir streben ein umfassendes Transparenzgesetz und ein zentrales Transparenzportal an"
              }
            },
            {
              "id": "be-a053",
              "parteiId": "cdu",
              "kurz": "Offenlegungspflichten sollen überprüft werden, damit Transparenzregeln keine Baupläne für Sabotage liefern.",
              "original": "Informationsfreiheits-, Transparenz- und Open-Data-Regelungen dürfen keine Baupläne für Sabotage liefern. Sensible Informationen über Lage, Aufbau oder Schwachstellen kritischer Infrastruktur müssen wirksam geschützt werden. Offenlegungspflichten werden wir dort überprüfen und anpassen […]",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 14,
                "markierung": "dürfen keine Baupläne für Sabotage liefern"
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
              "id": "be-a036",
              "parteiId": "cdu",
              "kurz": "Nach 62.000 neuen Schulplätzen soll weiter massiv in Schulbau investiert werden, dazu ein 11. Pflichtschuljahr.",
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
              "kurz": "Die Schulbauoffensive soll fortgesetzt und die Lehrkräftebildung über die Schools of Education gestärkt werden.",
              "original": "In diesem Sinne stärken wir die Schools of Education als zentrale Struktur der Lehrkräftebildung. Die Schulbauoffensive fortsetzen: Seit Beginn der Schulbauoffensive haben wir durch Erweiterungen und Neubauten deutlich über 50.000 Schulplätze geschaffen.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 42,
                "markierung": "Die Schulbauoffensive fortsetzen"
              }
            },
            {
              "id": "be-a083",
              "parteiId": "fdp",
              "kurz": "Schulen sollen ihr Personal selbst auswählen, ihre Selbstverwaltung ausbauen und eigene Teams bilden dürfen.",
              "original": "Wir wollen die personelle Situation der Schulen bei der Selbstverwaltung weiter verbessern, um Lehrkräfte und die pädagogische Schulleitung von Verwaltungsaufgaben zu entlasten. Im Rahmen ihrer Personalautonomie wollen wir es Schulen außerdem ermöglichen, schulspezifisch multiprofessionelle Teams […] zu bilden.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 8,
                "markierung": "um Lehrkräfte und die pädagogische Schulleitung von Verwaltungsaufgaben zu entlasten"
              }
            },
            {
              "id": "be-a085",
              "parteiId": "afd",
              "kurz": "Das Losverfahren für 30 Prozent der Schulplätze soll weg; es zählen Noten, Wohnortnähe und Geschwisterkinder.",
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
          "id": "be-f005",
          "text": "Worauf soll Bildung inhaltlich zielen?",
          "aussagen": [
            {
              "id": "be-a049",
              "parteiId": "gruene",
              "kurz": "Exkludierende Systeme sollen abgebaut und Inklusion an allen Schulen mit multiprofessionellen Teams möglich werden.",
              "original": "Exkludierende Systeme müssen vollständig abgebaut und Inklusion in allen Schulen möglich gemacht werden. Multiprofessionelle Teams, Schulassistenz sowie ergänzende Förderung und Betreuung in Grundschulen sichern gleiche Bildungschancen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 154,
                "markierung": "Exkludierende Systeme müssen vollständig abgebaut und Inklusion in allen Schulen möglich gemacht werden"
              }
            },
            {
              "id": "be-a093",
              "parteiId": "linke",
              "kurz": "Schüler sollen ihren Schulalltag selbstbestimmt mitgestalten; Bildung soll Gesellschaft kritisch verstehen lehren.",
              "original": "[…] ihren Schulalltag zunehmend selbstbestimmt mitgestalten können. Bildung soll sie befähigen, Gesellschaft kritisch zu verstehen und solidarisch zu verändern. Lehrkräfte wollen wir bestärken, emanzipatorische und partizipative pädagogische Konzepte anzuwenden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 152,
                "markierung": "Lehrkräfte wollen wir bestärken, emanzipatorische und partizipative pädagogische Konzepte anzuwenden"
              }
            },
            {
              "id": "be-a014",
              "parteiId": "bsw",
              "kurz": "Angestrebt wird eine Rückbesinnung auf verbindliche Inhalte, klare Standards und überprüfbare Ergebnisse.",
              "original": "Wir wollen eine Rückbesinnung auf verbindliche Inhalte, klare Leistungsstandards und überprüfbare Ergebnisse. Schülerinnen und Schüler sollen wissen, was sie können – und was von ihnen erwartet wird. Bildung bedeutet für uns, Leistung zu fordern und zu fördern, soziales Verhalten zu stärken und junge Menschen auf ein selbstbestimmtes, beruflich tragfähiges Leben vorzubereiten.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 14,
                "markierung": "eine Rückbesinnung auf verbindliche Inhalte, klare Leistungsstandards"
              }
            }
          ]
        },
        {
          "id": "be-f028",
          "text": "Sollen Smartphones an Schulen verboten werden?",
          "aussagen": [
            {
              "id": "be-a045",
              "parteiId": "afd",
              "kurz": "Die Grundschule soll bildschirmfrei bleiben; auch an weiterführenden Schulen wird das Mitführen streng geregelt.",
              "original": "Die AfD will die Grundschule bildschirmfrei halten, dazu gehört auch ein Verbot der Verwendung von Smartphones. Auch an den weiterführenden Schulen werden wir das Mitführen von Smartphones restriktiver handhaben, damit die Aufmerksamkeit im Unterricht und die sozial-emotionale Entwicklung der Schüler nicht beeinträchtigt werden.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 30,
                "markierung": "Auch an den weiterführenden Schulen werden wir das Mitführen von Smartphones restriktiver handhaben"
              }
            },
            {
              "id": "be-a018",
              "parteiId": "bsw",
              "kurz": "Smartphones und Tablets sollen aus den Grundschulklassen verschwinden; Lesen und Rechnen stehen im Vordergrund.",
              "original": "[…] dass […] in den Grundschulen wieder das Erlernen der Kernkompetenzen Lesen, Schreiben und Rechnen im Vordergrund steht. Smartphones und Tablets, die den Wissenserwerb nachweislich erschweren, wollen wir aus den Klassenzimmern der Grundschulen verbannen.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 2,
                "markierung": "wollen wir aus den Klassenzimmern der Grundschulen verbannen"
              }
            },
            {
              "id": "be-a048",
              "parteiId": "fdp",
              "kurz": "Generelle Verbote durch Land oder Bezirk werden abgelehnt; jede Schule soll eigene Regeln festlegen.",
              "original": "Generelle Verbote der Nutzung von Smartphones in Schulen auf Landes- oder Bezirksebene lehnen wir ab. Im Rahmen der Schulautonomie sollen schulindividuelle Regeln für den Smartphone-Gebrauch möglich bleiben.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 17,
                "markierung": "Generelle Verbote der Nutzung von Smartphones in Schulen auf Landes- oder Bezirksebene lehnen wir ab"
              }
            },
            {
              "id": "be-a075",
              "parteiId": "gruene",
              "kurz": "Die private Handynutzung soll dort eingeschränkt werden, wo die Schule selbst das für die beste Lösung hält.",
              "original": "Wir teilen die Sorgen über den steigenden Medienkonsum von Kindern und Jugendlichen. Deshalb unterstützen wir Einschränkungen der privaten Handynutzung, wo diese von der jeweiligen Schule für die beste Lösung gehalten werden.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 190,
                "markierung": "Deshalb unterstützen wir Einschränkungen der privaten Handynutzung"
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
          "id": "be-f004",
          "text": "Wie konsequent soll Zuwanderung begrenzt werden?",
          "aussagen": [
            {
              "id": "be-a038",
              "parteiId": "cdu",
              "kurz": "Rückführungen sollen ganzjährig stattfinden; Ausreisegewahrsam und Abschiebungshaft werden ausgeweitet.",
              "original": "[Wir wollen Rückführungen] ganzjährig durchzuführen, auch in den Wintermonaten. Um Rückführungen wirksam durchzusetzen, sind die bestehenden Instrumente des Ausreisegewahrsams und der Abschiebungshaft stärker zu nutzen. Dazu wollen wir die Kapazitäten des Ausreisegewahrsams deutlich erweitern.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 25,
                "markierung": "die Kapazitäten des Ausreisegewahrsams deutlich erweitern"
              }
            },
            {
              "id": "be-a071",
              "parteiId": "fdp",
              "kurz": "Irreguläre Migration soll unterbunden werden; wer legal kommt, bekommt Sprachkurse ab dem ersten Tag.",
              "original": "Irreguläre Migration muss unterbunden werden, wer legal kommt, erhält echte Chancen. Integration fordert alle Beteiligten: Sprach- und Integrationskurse vom ersten Tag an, die Vermittlung unserer freiheitlich-demokratischen Grundordnung, den Respekt vor Gleichberechtigung.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 95,
                "markierung": "Irreguläre Migration muss unterbunden werden, wer legal kommt, erhält echte Chancen"
              }
            },
            {
              "id": "be-a084",
              "parteiId": "afd",
              "kurz": "Eine Sondereinheit der Ausländerbehörde soll Ausweisung und Abschiebung krimineller Ausländer betreiben.",
              "original": "Die AfD fordert: → Die Einrichtung einer Sondereinheit bei der Ausländerbehörde, die die Ausweisung und Abschiebung ausländischer Krimineller [betreibt].",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 14,
                "markierung": "Die Einrichtung einer Sondereinheit bei der Ausländerbehörde"
              }
            },
            {
              "id": "be-a027",
              "parteiId": "bsw",
              "kurz": "Wer keinen Anspruch auf Asyl hat, soll gar nicht erst einreisen; dann stelle sich die Abschiebefrage nicht.",
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
          "id": "be-f023",
          "text": "Wie soll die Integration derer gelingen, die hier sind?",
          "aussagen": [
            {
              "id": "be-a073",
              "parteiId": "spd",
              "kurz": "Die Integration in den Arbeitsmarkt soll gestärkt und Teilhabe über die Einbürgerung ermöglicht werden.",
              "original": "[…] schnell selbst ihren Lebensunterhalt verdienen können. Deshalb stärken wir Berlins Anstrengungen zur Integration in den Arbeitsmarkt weiter. Teilhabe durch Einbürgerung: Wir wollen, dass alle Berlinerinnen und Berliner demokratisch mitbestimmen.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 52,
                "markierung": "Deshalb stärken wir Berlins Anstrengungen zur Integration in den Arbeitsmarkt weiter"
              }
            },
            {
              "id": "be-a079",
              "parteiId": "gruene",
              "kurz": "Rechtsberatung und aufenthaltsrechtliche Absicherung sollen helfen, Rechte ohne Angst wahrzunehmen.",
              "original": "[Mit] Rechtsberatung und aufenthaltsrechtlicher Absicherung unterstützen wir Betroffene dabei, ihre Rechte wahrzunehmen und Rechtsverfahren durchzustehen – ohne Angst vor Abschiebung. Dazu gehört auch eine ausreichende Zahl an Mitarbeiter*innen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 112,
                "markierung": "ihre Rechte wahrzunehmen und Rechtsverfahren durchzustehen – ohne Angst vor Abschiebung"
              }
            },
            {
              "id": "be-a065",
              "parteiId": "linke",
              "kurz": "Berufsbegleitende Sprachkurse sollen gestärkt und der Zugang zum Arbeitsmarkt erleichtert werden.",
              "original": "Berufsbegleitende Sprachkurse und Projekte für eine bessere Arbeitsmarktintegration von Migrant*innen müssen gestärkt werden. Der Zugang für Geflüchtete zum Arbeitsmarkt muss erleichtert werden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 105,
                "markierung": "Der Zugang für Geflüchtete zum Arbeitsmarkt muss erleichtert werden"
              }
            }
          ]
        },
        {
          "id": "be-f006",
          "text": "Soll Berlin die Bezahlkarte für Geflüchtete nutzen?",
          "aussagen": [
            {
              "id": "be-a032",
              "parteiId": "cdu",
              "kurz": "Die Bezahlkarte soll dauerhaft kommen; Asylbewerber sollen bis zur Entscheidung zentral untergebracht werden.",
              "original": "Asylbewerber und illegal Eingereiste sollen deshalb vom ersten Tag bis zur Entscheidung über ihren Asylantrag in zentralen Einrichtungen untergebracht werden. Wir stehen zur Einführung der Bezahlkarte und wollen diese dauerhaft etablieren.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 25,
                "markierung": "Wir stehen zur Einführung der Bezahlkarte und wollen diese dauerhaft etablieren"
              }
            },
            {
              "id": "be-a078",
              "parteiId": "fdp",
              "kurz": "Die Bezahlkarte soll unverzüglich eingeführt werden, für neu Ankommende wie für bereits hier Lebende.",
              "original": "Berlin führt – als letztes Bundesland – unverzüglich die Bezahlkarte für Geflüchtete ein. Diese gilt sowohl für neu ankommende Geflüchtete als auch für Bestandsfälle.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 96,
                "markierung": "Diese gilt sowohl für neu ankommende Geflüchtete als auch für Bestandsfälle"
              }
            },
            {
              "id": "be-a035",
              "parteiId": "linke",
              "kurz": "Die Bezahlkarte soll nicht kommen oder wieder verschwinden; EU-Bürger sollen Zugang zur Sozialhilfe haben.",
              "original": "Nicht-erwerbstätige Unionsbürger*innen brauchen Zugang zur Sozialhilfe. Außerdem werden wir die diskriminierende Bezahlkarte nicht einführen bzw. wieder abschaffen.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 278,
                "markierung": "Außerdem werden wir die diskriminierende Bezahlkarte nicht einführen"
              }
            },
            {
              "id": "be-a033",
              "parteiId": "spd",
              "kurz": "Die Bezahlkarte wird abgelehnt, weil sie Teilhabe einschränkt; stattdessen soll eine Stadtkarte kommen.",
              "original": "Eine Bezahlkarte für Geflüchtete lehnen wir ab. Sie schränkt Teilhabe am öffentlichen Leben stark ein. Stattdessen setzen wir uns im Bund für die Voraussetzungen einer Berliner Stadtkarte (CityID).",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 53,
                "markierung": "Eine Bezahlkarte für Geflüchtete lehnen wir ab"
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
          "id": "be-f027",
          "text": "Wie sollen die Krankenhäuser finanziert und getragen werden?",
          "aussagen": [
            {
              "id": "be-a086",
              "parteiId": "spd",
              "kurz": "Ambulante, stationäre und psychosoziale Angebote sollen enger zusammenarbeiten, die Kliniken auskömmlich finanziert.",
              "original": "Gesundheit ist ein Menschenrecht. Deshalb wollen wir eine gerechte und flächendeckende Gesundheitsversorgung. Ambulante, stationäre und psychosoziale Angebote müssen enger zusammenarbeiten. […] Die SPD Berlin setzt sich vor diesem Hintergrund für eine auskömmliche Finanzierung ein.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 33,
                "markierung": "Deshalb wollen wir eine gerechte und flächendeckende Gesundheitsversorgung"
              }
            },
            {
              "id": "be-a029",
              "parteiId": "fdp",
              "kurz": "Die Krankenhausfinanzierung soll sich am tatsächlichen Bedarf ausrichten, die Trennung ambulant/stationär fallen.",
              "original": "Wer eine Behandlung im Krankenhaus benötigt, muss rund um die Uhr an sieben Tagen in der Woche und 365 Tagen im Jahr die beste medizinische Versorgung erhalten können. […] Wir werden uns daher für eine Neuordnung der Krankenhausfinanzierung einsetzen, die sich am tatsächlichen medizinischen Patientenbedarf orientiert.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 114,
                "markierung": "eine Neuordnung der Krankenhausfinanzierung einsetzen, die sich am tatsächlichen medizinischen Patientenbedarf orientiert"
              }
            },
            {
              "id": "be-a001",
              "parteiId": "linke",
              "kurz": "Die Krankenhäuser sollen in kommunaler Hand bleiben; wo private Träger aussteigen, wird rekommunalisiert.",
              "original": "Unser Wohlbefinden, unsere Gesundheit darf nicht dem Profitstreben von Krankenhauskonzernen zum Opfer fallen. Wir wollen, dass unsere Krankenhäuser in kommunaler Hand bleiben und dort rekommunalisiert werden, wo sich private Konzerne aus der Verantwortung ziehen.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 8,
                "markierung": "dass unsere Krankenhäuser in kommunaler Hand bleiben und dort rekommunalisiert werden"
              }
            },
            {
              "id": "be-a069",
              "parteiId": "bsw",
              "kurz": "Das solidarische Gesundheitswesen soll gestärkt und die Zwei-Klassen-Medizin durch eine Bürgerversicherung beendet.",
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
          "id": "be-f014",
          "text": "Wie soll die Versorgung im Alltag erreichbar bleiben?",
          "aussagen": [
            {
              "id": "be-a068",
              "parteiId": "cdu",
              "kurz": "Dokumentations- und Meldepflichten in der Pflege sollen vereinfacht und Praxisplätze gesichert werden.",
              "original": "[Wir wollen Entlastungen] in der Pflege und der Verwaltung schaffen, um Dokumentations- und Meldeprozesse deutlich zu vereinfachen. Gute Versorgung braucht gute Ausbildung in allen Bereichen der Gesundheitsversorgung. Wir setzen uns insbesondere dafür ein, dass angehende Pflegefachkräfte ausreichend Praxisplätze finden.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 99,
                "markierung": "dass angehende Pflegefachkräfte ausreichend Praxisplätze finden"
              }
            },
            {
              "id": "be-a096",
              "parteiId": "gruene",
              "kurz": "Die Gesundheitschancen unterscheiden sich je nach Bezirk; Arztsitze sollen gleichmäßiger verteilt werden.",
              "original": "Noch immer unterscheiden sich die Gesundheitschancen in Berlin stark: Je nach Bezirk, Wohnviertel, Geschlecht und sozioökonomischem Status weichen Lebenserwartung und Krankheitshäufigkeiten voneinander ab. […] Wir setzen uns dafür ein, dass es eine gleichmäßige Verteilung von Vertragsärzt*innensitzen gibt.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 201,
                "markierung": "dass es eine gleichmäßige Verteilung von Vertragsärzt*innensitzen gibt"
              }
            },
            {
              "id": "be-a100",
              "parteiId": "afd",
              "kurz": "Wohnortnahe Versorgung und Pflege sollen auf Eigenverantwortung, Prävention und moderne Kliniken bauen.",
              "original": "Eine leistungsfähige und wohnortnahe Gesundheitsversorgung sowie eine fürsorgliche Pflege sind für die AfD von herausragender Bedeutung. Eigenverantwortung, Prävention, private und staatliche Angebote der Daseinsvorsorge sind die Basis für ein gesundes, langes und selbstbestimmtes Leben.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 69,
                "markierung": "Eine leistungsfähige und wohnortnahe Gesundheitsversorgung sowie eine fürsorgliche Pflege"
              }
            }
          ]
        },
        {
          "id": "be-f020",
          "text": "Wie soll Berlin mit Drogen und Drogenkonsum umgehen?",
          "aussagen": [
            {
              "id": "be-a039",
              "parteiId": "cdu",
              "kurz": "Drogenkriminalität soll mit aller Härte bekämpft werden; ein anonymes Hinweisgebersystem soll Meldungen erleichtern.",
              "original": "Drogenkriminalität werden wir in unserer Stadt mit aller Härte bekämpfen. Clanstrukturen und Drogennetzwerke müssen konsequent zerschlagen werden. Dafür braucht die Polizei noch bessere Möglichkeiten zur Informationsgewinnung. Deshalb wollen wir ein anonymes elektronisches Hinweisgebersystem bei der Polizei Berlin einführen, über das Hinweise zu Drogenhandel und Organisierter Kriminalität sicher und vertraulich gemeldet werden können.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 11,
                "markierung": "Drogenkriminalität werden wir in unserer Stadt mit aller Härte bekämpfen"
              }
            },
            {
              "id": "be-a060",
              "parteiId": "spd",
              "kurz": "Drogenkonsumräume sollen ausgebaut werden; Abhängige sollen nicht vertrieben, Parks aber drogenfrei werden.",
              "original": "Wir vertreiben drogenabhängige Menschen nicht von Ort zu Ort. Wir helfen dort, wo sie sind. Gleichzeitig holen wir Drogen aus dem öffentlichen Raum. Parks und Spielplätze müssen geschützt bleiben. Drogenkonsumräume bauen wir aus. Wir erleichtern ihre Einrichtung, erweitern Öffnungszeiten und stellen Landesgebäude bereit.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 51,
                "markierung": "Drogenkonsumräume bauen wir aus"
              }
            },
            {
              "id": "be-a002",
              "parteiId": "bsw",
              "kurz": "Die Prävention soll ausgeweitet werden, dazu geschützte Konsumräume und mehr Substitutionstherapien.",
              "original": "Wir setzen uns dafür ein, Maßnahmen zur Drogenprävention auszuweiten. Aufgrund der steigenden Zahl von Drogenkranken sollten Hilfsangebote wie geschützte Drogenkonsumräume, medizinische Betreuungseinrichtungen oder die Unterstützung bei Substitutionstherapien ausgeweitet werden.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 12,
                "markierung": "Maßnahmen zur Drogenprävention auszuweiten"
              }
            },
            {
              "id": "be-a016",
              "parteiId": "fdp",
              "kurz": "Drug-Checking soll deutlich ausgebaut werden, auch mobil und mit einem berlinweiten Frühwarnsystem.",
              "original": "Drug-Checking ist eine zentrale Maßnahme zur Schadensminderung, die den sicheren Konsum fördert und potenzielle Gesundheitsrisiken reduziert. […] Wir wollen, dass das Berliner Drug-Checking-Projekt deutlich ausgebaut, auch mobil verfügbar und mit einem berlinweiten Frühwarnsystem für gefährliche Wirkstoffe verbunden wird.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 118,
                "markierung": "Drug-Checking-Projekt deutlich ausgebaut"
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
          "id": "be-f022",
          "text": "Wodurch soll Berlin als Wirtschaftsstandort wachsen?",
          "aussagen": [
            {
              "id": "be-a040",
              "parteiId": "spd",
              "kurz": "In Wirtschaftsförderung und Infrastruktur soll investiert werden, mit Tarifbindung statt Lohndumping.",
              "original": "Wir investieren in Wirtschaftsförderung und Infrastruktur und wollen attraktive Arbeitsbedingungen mit Tarifbindungen statt Lohndumping.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 6,
                "markierung": "Wir investieren in Wirtschaftsförderung und Infrastruktur und wollen attraktive Arbeitsbedingungen mit Tarifbindungen statt Lohndumping"
              }
            },
            {
              "id": "be-a063",
              "parteiId": "gruene",
              "kurz": "Technologie, Industrie und Forschung sollen zusammenwirken; geprüft wird eine landeseigene Innovationsagentur.",
              "original": "[…] damit Technologie, Industrie, Forschung und Ausbildung an dieser wichtigen Schnittstelle zusammenwirken und Berlin als Standort für angewandte Innovation und klimaneutrale Industrie gestärkt wird. […] prüfen wir die Einrichtung einer landeseigenen Innovationsagentur.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 98,
                "markierung": "Berlin als Standort für angewandte Innovation und klimaneutrale Industrie gestärkt wird"
              }
            },
            {
              "id": "be-a044",
              "parteiId": "afd",
              "kurz": "Berlin soll wieder Industriestandort werden, mit Förderung von Luftfahrt, Halbleitern und Gesundheitswirtschaft.",
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
          "id": "be-f009",
          "text": "Wem soll die Wirtschaftspolitik vor allem dienen?",
          "aussagen": [
            {
              "id": "be-a067",
              "parteiId": "cdu",
              "kurz": "Ein Leerstandsmonitoring für Büro- und Gewerbeflächen soll Flächen für Start-ups und Betriebe verfügbar machen.",
              "original": "Für mehr Transparenz über die Entwicklungen auf dem Gewerbemarkt setzen wir uns für die Einführung eines systematischen Leerstandsmonitorings von Büro- und Gewerbeflächen ein. Wir werden das Leerstandsmanagement landeseigener Immobilien weiterentwickeln und gezielt für die Nutzung durch Start-ups und Unternehmen [öffnen].",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 37,
                "markierung": "die Einführung eines systematischen Leerstandsmonitorings von Büro- und Gewerbeflächen"
              }
            },
            {
              "id": "be-a081",
              "parteiId": "fdp",
              "kurz": "Berlin soll einer der freiesten Wirtschaftsstandorte Europas und vom Empfänger- zum Geberland werden.",
              "original": "Wir [wollen] Berlin zu einem der freiesten Wirtschaftsstandorte Europas machen. Unser Ziel ist eine Verwaltung, die sich auf ihre Kernaufgaben beschränkt, Verfahren beschleunigt, Rechtssicherheit gewährleistet und unternehmerische Tätigkeit nicht behindert, sondern ermöglicht. Berlin muss vom Empfänger- zum Geberland werden!",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 18,
                "markierung": "eine Verwaltung, die sich auf ihre Kernaufgaben beschränkt"
              }
            },
            {
              "id": "be-a059",
              "parteiId": "linke",
              "kurz": "Bei der Vergabe von Gewerbeflächen sollen Anwohner eingebunden, Bestände für Nahversorgung genutzt werden.",
              "original": "Wo immer möglich, sollen eigene Bestände für eine gute Nahversorgung für den täglichen Bedarf und soziale Angebote genutzt werden. Bei der Vergabe von Gewerbeflächen sollen Anwohner*innen und deren Vertretungen eng eingebunden werden.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 15,
                "markierung": "Bei der Vergabe von Gewerbeflächen sollen Anwohner*innen und deren Vertretungen eng eingebunden werden"
              }
            },
            {
              "id": "be-a057",
              "parteiId": "bsw",
              "kurz": "Im Mittelpunkt stehen Familienbetriebe und Selbständige: weniger Überregulierung, mehr Ausbildungsförderung.",
              "original": "Die Wirtschaftspolitik des Berliner BSW rückt Familienbetriebe, Selbständige und Freiberufler […] in den Mittelpunkt. Wir konzentrieren uns auf den Abbau von Überregulierung, den Ausbau digitaler Verwaltungsleistungen und die Ausbildungsförderung. Außerdem setzen wir uns für einen Mutterschutz für Selbständige ein.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 42,
                "markierung": "Wir konzentrieren uns auf den Abbau von Überregulierung, den Ausbau digitaler Verwaltungsleistungen"
              }
            }
          ]
        },
        {
          "id": "be-f011",
          "text": "Soll Berlin ein eigenes Vergabegesetz behalten?",
          "aussagen": [
            {
              "id": "be-a064",
              "parteiId": "afd",
              "kurz": "Das Berliner Vergabegesetz soll aufgehoben und entbehrliche Vorschriften sollen gestrichen werden.",
              "original": "Mit einem Sonderausschuss „Bürokratieabbau“ ist eine effektive Systematik zum Abbau des Bürokratiedschungels zu entwickeln und zu begleiten. Die Verwaltung ist aufgefordert, entbehrliche Gesetze und Verordnungen zur Streichung anzumelden. Der Berliner Sonderweg eines eigenen Vergabegesetzes ist aufzugeben.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 47,
                "markierung": "Der Berliner Sonderweg eines eigenen Vergabegesetzes ist aufzugeben"
              }
            },
            {
              "id": "be-a070",
              "parteiId": "fdp",
              "kurz": "Das Berliner Vergabegesetz soll abgeschafft werden; es gilt nur noch das Vergaberecht von Bund und EU.",
              "original": "Das Berliner Vergabegesetz werden wir abschaffen und nur noch das Vergaberecht des Bundes (bzw. der EU) anwenden. Die unternehmerischen Berichtspflichten wollen wir reduzieren.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 20,
                "markierung": "Das Berliner Vergabegesetz werden wir abschaffen"
              }
            },
            {
              "id": "be-a080",
              "parteiId": "gruene",
              "kurz": "Das Vergaberecht soll einfacher werden, Tariftreue und soziale Standards aber uneingeschränkt bleiben.",
              "original": "Deshalb wollen wir das Vergaberecht reformieren – unter Beibehaltung sozialer und ökologischer Standards sowie deren wirksamer Umsetzung und Kontrolle […]. Vereinfachte Verfahren, eine Flexibilisierung der Wertgrenzen bei uneingeschränkter Tariftreue und Mindestlohnregelung, eine Innovationsklausel und vereinfachte Eignungsprüfungen sowie eine stärkere Aufteilung von Losen erleichtern dabei insbesondere KMU und Start-ups den Zugang […]",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 96,
                "markierung": "Deshalb wollen wir das Vergaberecht reformieren"
              }
            },
            {
              "id": "be-a092",
              "parteiId": "spd",
              "kurz": "Tariftreue und Vergabemindestlohn sollen strenger durchgesetzt werden, um Lohndumping zu verhindern.",
              "original": "Berlin setzt mit dem Vergabe- und Landesmindestlohn schon jetzt Maßstäbe für faire Bezahlung im öffentlichen Auftragswesen. Wir verschärfen die Durchsetzung von Tariftreue und Vergabemindestlohn, um Lohndumping zu verhindern und öffentliche Gelder konsequent an soziale Standards zu binden. Auch Förderungen des Landes Berlin werden wir an Tarifbindung und Mitbestimmung koppeln.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 9,
                "markierung": "Wir verschärfen die Durchsetzung von Tariftreue und Vergabemindestlohn"
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
          "id": "be-f024",
          "text": "Wie soll die Wärmeversorgung bezahlbar und klimafreundlich werden?",
          "aussagen": [
            {
              "id": "be-a021",
              "parteiId": "fdp",
              "kurz": "Gesetzt wird auf massiven Ausbau der Geothermie und größere Fernwärmenetze, getragen von privaten Investitionen.",
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
              "kurz": "Fernwärme und Nahverkehr sollen bezahlbar bleiben; dauerhaft steigende Kosten dürfe die öffentliche Hand nicht abwälzen.",
              "original": "[Erforderlich ist eine Politik], die ideologische Kostensteigerungen zulasten der Berliner verhindert. Investitionen müssen in ein tragfähiges Finanzierungskonzept eingebettet sein. Fernwärme und ÖPNV solide und bezahlbar halten: Die öffentliche Hand darf Bürger und Wirtschaft nicht über dauerhaft steigende Kosten belasten.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 97,
                "markierung": "Fernwärme und ÖPNV solide und bezahlbar halten"
              }
            },
            {
              "id": "be-a024",
              "parteiId": "bsw",
              "kurz": "Vorrang hat eine stabile und bezahlbare Versorgung mit Strom, Wasser und Fernwärme, verlässlich finanziert.",
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
          "id": "be-f008",
          "text": "Wie verbindlich sollen die Berliner Klimaziele sein?",
          "aussagen": [
            {
              "id": "be-a046",
              "parteiId": "cdu",
              "kurz": "Gas, Fernwärme und Wärmepumpe sollen im Wettbewerb bleiben; einseitige staatliche Vorgaben werden abgelehnt.",
              "original": "Den Wettbewerb verschiedener Energieträger wie Gas, Fernwärme und Wärmepumpen wollen wir erhalten, denn nur so bleiben Heizkosten dauerhaft bezahlbar. Einseitige staatliche Vorgaben lehnen wir ab.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 31,
                "markierung": "Den Wettbewerb verschiedener Energieträger wie Gas, Fernwärme und Wärmepumpen wollen wir erhalten"
              }
            },
            {
              "id": "be-a030",
              "parteiId": "spd",
              "kurz": "Berlin soll vor 2045 klimaneutral werden; Mieter dürfen durch den Klimaschutz nicht zusätzlich belastet werden.",
              "original": "Wir stehen zu den Klimaschutzzielen, kämpfen für Klimaneutralität vor dem Jahr 2045 und stehen zur Umsetzung des Berliner Energiewendegesetzes.",
              "quelle": {
                "datei": "data/programme/be/spd.pdf",
                "seite": 59,
                "markierung": "kämpfen für Klimaneutralität vor dem Jahr 2045 und stehen zur Umsetzung des Berliner Energiewendegesetzes"
              }
            },
            {
              "id": "be-a031",
              "parteiId": "gruene",
              "kurz": "Berlin soll sich an Hamburg orientieren und bereits 2040 klimaneutral sein, mit klaren Prioritäten im Fahrplan.",
              "original": "Berlin muss sich ein Vorbild an Hamburg nehmen, das nun schon 2040 klimaneutral sein will. In Regierungsverantwortung werden wir den Fahrplan zur Klimaneutralität und -anpassung auf solide Beine stellen und Prioritäten setzen, um die Ziele schnellstmöglich zu erreichen.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 11,
                "markierung": "Berlin muss sich ein Vorbild an Hamburg nehmen"
              }
            },
            {
              "id": "be-a004",
              "parteiId": "linke",
              "kurz": "Auch der Luftverkehr müsse klimaneutral werden; Kurzstreckenflüge sollen bei Alternativen verboten sein.",
              "original": "Klimaschutz im Luftverkehr: Der Luftverkehrssektor muss klimaneutral werden. Dafür unterstützen wir die Schaffung der erforderlichen Voraussetzungen. Wir setzen uns für ein Verbot von Kurzstreckenflügen ein.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 71,
                "markierung": "Wir setzen uns für ein Verbot von Kurzstreckenflügen ein"
              }
            }
          ]
        },
        {
          "id": "be-f016",
          "text": "Wie sollen Böden und Regenwasser in Berlin geschützt werden?",
          "aussagen": [
            {
              "id": "be-a047",
              "parteiId": "linke",
              "kurz": "Bis 2030 soll unter dem Strich keine Fläche mehr versiegelt werden; für Neubau wird anderswo entsiegelt.",
              "original": "Boden ist ein Gemeingut. Wir treten für eine Netto-Null-Versiegelung bis 2030 ein. Wo versiegelt wird, muss innerhalb Berlins in gleicher Größe entsiegelt werden. Das Entsiegelungsprogramm wird in der nächsten Wahlperiode konsequent umgesetzt.",
              "quelle": {
                "datei": "data/programme/be/linke.pdf",
                "seite": 202,
                "markierung": "Wir treten für eine Netto-Null-Versiegelung bis 2030 ein"
              }
            },
            {
              "id": "be-a026",
              "parteiId": "afd",
              "kurz": "Der Flächenverbrauch soll sinken: ungenutzte Flächen bebauen, andere entsiegeln, damit Regen versickert.",
              "original": "Wir wollen den Flächenverbrauch konsequent reduzieren und naturnahe Flächen bewahren. Sowohl ungenutzte Naturflächen als auch teilweise versiegelte Flächen müssen gezielt erfasst werden. Manche Flächen können sinnvoll bebaut werden, andere sollen durch Entsiegelung wieder naturnah hergestellt werden, damit Regenwasser versickern kann und städtische Lebensräume ökologisch aufgewertet werden.",
              "quelle": {
                "datei": "data/programme/be/afd.pdf",
                "seite": 80,
                "markierung": "Manche Flächen können sinnvoll bebaut werden"
              }
            },
            {
              "id": "be-a023",
              "parteiId": "fdp",
              "kurz": "Berlin soll als Schwammstadt Regenwasser nutzen, erreicht mit privatem Kapital und Anreizen statt Verboten.",
              "original": "Wir wollen eine Stadt, die Regenwasser als Ressource nutzt, deren Gewässer Badequalität haben, die als Schwammstadt Starkregen bewältigt. Aber all das erreichen wir nicht durch Verbote, sondern durch die Mobilisierung privaten Kapitals und durch marktwirtschaftliche Anreize.",
              "quelle": {
                "datei": "data/programme/be/fdp.pdf",
                "seite": 87,
                "markierung": "nicht durch Verbote, sondern durch die Mobilisierung privaten Kapitals"
              }
            }
          ]
        },
        {
          "id": "be-f018",
          "text": "Wie soll Berlin vor Hitze geschützt werden?",
          "aussagen": [
            {
              "id": "be-a042",
              "parteiId": "cdu",
              "kurz": "Der Bestand an Straßenbäumen soll bis 2040 auf eine Million wachsen, mit gesicherter Finanzierung.",
              "original": "Wir wollen den Bestand an Straßenbäumen deutlich erhöhen und bis zum Jahr 2040 auf eine Million Bäume steigern, um Berlin widerstandsfähiger gegen Hitze und Extremwetter zu machen. Dabei setzen wir auf realistische Ziele für Baumbepflanzungen, eine Einbindung der Bezirke sowie verlässliche Finanzierungsmöglichkeiten für die Klimaanpassung.",
              "quelle": {
                "datei": "data/programme/be/cdu.pdf",
                "seite": 80,
                "markierung": "bis zum Jahr 2040 auf eine Million Bäume steigern"
              }
            },
            {
              "id": "be-a011",
              "parteiId": "gruene",
              "kurz": "In belasteten Vierteln sollen Klimainseln mit Schatten und Wasser entstehen, dazu mehr Trinkbrunnen.",
              "original": "[…] durch deutlich mehr Trinkwasserbrunnen […]. In besonders belasteten Quartieren schaffen wir Klimainseln, die mit Schatten, Wasser und Sitzgelegenheiten für sofortige Abkühlung sorgen. […] Wir wollen den Berliner Hitzeaktionsplan jährlich evaluieren und weiterentwickeln.",
              "quelle": {
                "datei": "data/programme/be/gruene.pdf",
                "seite": 21,
                "markierung": "Hitzeaktionsplan jährlich evaluieren und weiterentwickeln"
              }
            },
            {
              "id": "be-a072",
              "parteiId": "bsw",
              "kurz": "Neubauten sollen verbindlich begrünte Dächer und Höfe bekommen, dazu eine finanzierte Baumoffensive.",
              "original": "Verbindliche Begrünungspflichten für Neubauten: begrünte Dächer, Fassaden und Innenhöfe sollen die Regel sein. […] Wir wollen, dass aus diesen Beschlüssen echte Baumoffensiven werden. Dazu gehören eine verlässliche Finanzierung im Haushalt und klare Priorität für Neupflanzungen und Pflege.",
              "quelle": {
                "datei": "data/programme/be/bsw.pdf",
                "seite": 56,
                "markierung": "Verbindliche Begrünungspflichten für Neubauten"
              }
            }
          ]
        }
      ]
    }
  ],
  "begriffe": [
    {
      "wort": "A 100",
      "erklaerung": "Der Berliner Stadtring als Autobahn. Umstritten ist, ob er über den Treptower Park hinaus weiter nach Nordosten gebaut wird – dafür müssten Wohnhäuser, Kleingärten und Clubs weichen.",
      "formen": [
        "A 100"
      ]
    },
    {
      "wort": "Ausreisegewahrsam",
      "erklaerung": "Gewahrsam kurz vor einer Abschiebung, damit die Betroffenen zum Termin greifbar sind. Anders als die Abschiebungshaft dauert er nur wenige Tage.",
      "formen": [
        "Ausreisegewahrsam",
        "Abschiebungshaft"
      ]
    },
    {
      "wort": "Bezahlkarte",
      "erklaerung": "Eine Guthabenkarte statt Bargeld: Asylbewerber bekommen ihre Leistungen darauf gutgeschrieben. Wie viel Bargeld sie abheben und ob sie überweisen dürfen, legen die Länder fest.",
      "formen": [
        "Bezahlkarte"
      ]
    },
    {
      "wort": "Bodycams",
      "erklaerung": "Kleine Kameras an der Uniform, die Polizeieinsätze aufzeichnen. Gestritten wird darüber, wer sie einschaltet und wie lange die Aufnahmen gespeichert bleiben.",
      "formen": [
        "Bodycam"
      ]
    },
    {
      "wort": "Bürgerversicherung",
      "erklaerung": "Eine Krankenversicherung, in die alle einzahlen - auch Beamte und Selbständige. Die Trennung in gesetzlich und privat versichert entfiele.",
      "formen": [
        "Bürgerversicherung"
      ]
    },
    {
      "wort": "Drug-Checking",
      "erklaerung": "Ein Labor prüft mitgebrachte Drogen auf Wirkstoff und Beimischungen. Es soll Vergiftungen durch unerwartet starke oder gestreckte Stoffe verhindern.",
      "formen": [
        "Drug-Checking"
      ]
    },
    {
      "wort": "E-Akte",
      "erklaerung": "Die elektronische Akte der Verwaltung: Vorgänge werden digital geführt statt auf Papier. Ohne sie landen auch digitale Anträge wieder im Drucker.",
      "formen": [
        "E-Akte"
      ]
    },
    {
      "wort": "Fehlbelegungsabgabe",
      "erklaerung": "Eine Zahlung für Mieter einer Sozialwohnung, deren Einkommen inzwischen über der Grenze liegt. Sie schoepft ab, was die geförderte Miete günstiger ist als die ortsübliche.",
      "formen": [
        "Fehlbelegungsabgabe"
      ]
    },
    {
      "wort": "Fernwärme",
      "erklaerung": "Heißes Wasser aus einem zentralen Kraftwerk, das über Leitungen ganze Stadtteile heizt. Wer angeschlossen ist, kann den Anbieter nicht wechseln.",
      "formen": [
        "Fernwärme"
      ]
    },
    {
      "wort": "Klimaziele",
      "erklaerung": "Gesetzlich festgelegte Ziele, um wie viel der Ausstoß an Treibhausgasen bis zu einem bestimmten Jahr sinken soll – und ab wann ein Land klimaneutral sein will.",
      "formen": [
        "Klimaziele"
      ]
    },
    {
      "wort": "Kriminalitätsorte",
      "erklaerung": "Kurz für kriminalitätsbelastete Orte: Plätze, die die Polizei als besonders belastet einstuft. Dort darf sie Personen auch ohne konkreten Verdacht anhalten und durchsuchen.",
      "formen": [
        "Kriminalitätsorte"
      ]
    },
    {
      "wort": "Messerverbotszonen",
      "erklaerung": "Abgegrenzte Gebiete, in denen das Mitführen von Waffen und Messern verboten ist. Die Polizei darf dort ohne besonderen Anlass kontrollieren.",
      "formen": [
        "Waffen- und Messerverbotszonen",
        "Messerverbotszonen"
      ]
    },
    {
      "wort": "Mietendeckel",
      "erklaerung": "Eine gesetzliche Obergrenze für Mieten, unabhängig davon, was am Markt gezahlt würde. Berlins Landesgesetz dazu hat das Bundesverfassungsgericht 2021 gekippt - zuständig sei der Bund.",
      "formen": [
        "Mietendeckel"
      ]
    },
    {
      "wort": "Mietmarkt",
      "erklaerung": "Der Wohnungsmarkt aus Sicht der Mieter: Angebot, Preise und die Regeln dafür. Der Staat greift über Instrumente wie Mietpreisbremse, Milieuschutz oder öffentlichen Wohnungsbau ein.",
      "formen": [
        "Mietmarkt"
      ]
    },
    {
      "wort": "Mietpreisbremse",
      "erklaerung": "Bei Neuvermietung darf die Miete höchstens zehn Prozent über der ortsüblichen Vergleichsmiete liegen. Sie gilt nur in angespannten Wohnlagen und kennt Ausnahmen, etwa für Neubau.",
      "formen": [
        "Mietpreisbremse"
      ]
    },
    {
      "wort": "Milieuschutzgebiet",
      "erklaerung": "Ein Gebiet, in dem der Bezirk Umbauten, Luxussanierungen und die Umwandlung in Eigentumswohnungen genehmigen muss. Es soll verhindern, dass die bisherige Nachbarschaft durch steigende Mieten verdrängt wird.",
      "formen": [
        "Milieuschutzgebieten",
        "Milieuschutzgebiete",
        "Milieuschutz"
      ]
    },
    {
      "wort": "Sanierungsgebiet",
      "erklaerung": "Ein förmlich festgelegtes Gebiet, in dem die Stadt bauliche Missstände beheben will. Dort braucht es für Bau und Verkauf zusätzliche Genehmigungen, und die Stadt darf Grundstücke vorrangig kaufen.",
      "formen": [
        "Sanierungsgebieten"
      ]
    },
    {
      "wort": "Schwammstadt",
      "erklaerung": "Eine Stadt, die Regenwasser aufnimmt und speichert statt es abzuleiten - über entsiegelte Flächen, Gründächer und Mulden. Das dämpft Überflutung bei Starkregen und Hitze im Sommer.",
      "formen": [
        "Schwammstadt"
      ]
    },
    {
      "wort": "Tarifbindung",
      "erklaerung": "Ob ein Betrieb nach Tarifvertrag zahlt. Im Osten gilt das für deutlich weniger Betriebe als im Westen; wo sie fehlt, handelt jeder Beschäftigte seinen Lohn selbst aus.",
      "formen": [
        "Tarifbindung",
        "Tariftreue"
      ]
    },
    {
      "wort": "Taser",
      "erklaerung": "Ein Gerät, das aus einigen Metern Entfernung Stromstöße abgibt und den Getroffenen kurz bewegungsunfähig macht. Amtlich heißt es Distanz-Elektro-Impulsgerät.",
      "formen": [
        "Taser"
      ]
    },
    {
      "wort": "Tempelhofer Feld",
      "erklaerung": "Die Freifläche des früheren Flughafens Tempelhof, so groß wie rund 400 Fußballfelder. Ein Volksentscheid verbietet dort das Bauen; für eine Randbebauung müsste dieses Gesetz geändert werden.",
      "formen": [
        "Tempelhofer Feldes",
        "Tempelhofer Feld"
      ]
    },
    {
      "wort": "Vergabegesetz",
      "erklaerung": "Ein Landesgesetz, das öffentliche Aufträge an Bedingungen knüpft – etwa Tariflohn, Mindestlohn oder ökologische Standards. Ohne es gilt nur das Vergaberecht von Bund und EU.",
      "formen": [
        "Vergabegesetz"
      ]
    },
    {
      "wort": "Vergabemindestlohn",
      "erklaerung": "Der Stundenlohn, den ein Betrieb mindestens zahlen muss, wenn er einen öffentlichen Auftrag ausführt. Er liegt über dem gesetzlichen Mindestlohn und wird vom Land festgelegt.",
      "formen": [
        "Vergabemindestlohn"
      ]
    },
    {
      "wort": "Vergaberecht",
      "erklaerung": "Die Regeln, nach denen der Staat Aufträge vergibt: ausschreiben, vergleichen, den wirtschaftlichsten nehmen. Ab bestimmten Auftragswerten gilt EU-Recht.",
      "formen": [
        "Vergaberecht"
      ]
    },
    {
      "wort": "Verwaltungsreform",
      "erklaerung": "Die Neuverteilung der Zuständigkeiten zwischen Senat und Bezirken. Ziel ist, dass bei jeder Aufgabe klar ist, wer entscheidet und wer zahlt.",
      "formen": [
        "Verwaltungsreform"
      ]
    },
    {
      "wort": "Videoüberwachung",
      "erklaerung": "Dauerhaft installierte Kameras im öffentlichen Raum. Sie sollen abschrecken und Taten aufklären helfen; wer davon erfasst wird, hat sich nichts zuschulden kommen lassen müssen.",
      "formen": [
        "Videoüberwachung"
      ]
    },
    {
      "wort": "Volksentscheid",
      "erklaerung": "Eine Abstimmung, bei der die Wahlberechtigten selbst über ein Gesetz entscheiden. Das Ergebnis gilt wie ein Parlamentsbeschluss.",
      "formen": [
        "Volksentscheid"
      ]
    },
    {
      "wort": "Vorkaufsrecht",
      "erklaerung": "Das Recht der Stadt, ein verkauftes Haus selbst zum vereinbarten Preis zu übernehmen. In bestimmten Gebieten kann sie es nutzen, um Mieter zu schützen.",
      "formen": [
        "Vorkaufsrecht"
      ]
    },
    {
      "wort": "Wärmeversorgung",
      "erklaerung": "Heizung und Warmwasser - zusammen rund die Hälfte des Energieverbrauchs in Gebäuden. Sie kommt aus Gas, Öl, Fernwärme oder Wärmepumpen; der Umstieg auf klimafreundliche Quellen heißt Wärmewende.",
      "formen": [
        "Wärmeversorgung"
      ]
    },
    {
      "wort": "multiprofessionelle Teams",
      "erklaerung": "Schulteams, in denen neben Lehrkräften auch Sozialarbeit, Psychologie oder Erziehung arbeiten. Sie übernehmen Aufgaben, die nicht Unterricht sind.",
      "formen": [
        "multiprofessionelle Teams",
        "multiprofessionelle"
      ]
    }
  ]
}
);
