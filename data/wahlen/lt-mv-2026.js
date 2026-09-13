/* Seite 47 – Datensatz: Landtagswahl Mecklenburg-Vorpommern (2026-09-20).
 * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/mv/.
 * Schema 2: Themen enthalten Fragen mit 3–4 Aussagen verschiedener
 * Parteien; gewaehlt werden die beste und die schlechteste.
 * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das
 * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).
 */
window.S47_DATA.register(
{
  "schemaVersion": 2,
  "id": "lt-mv-2026",
  "name": "Landtagswahl Mecklenburg-Vorpommern",
  "region": "Mecklenburg-Vorpommern",
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
        "titel": "Chancenland. Wahlprogramm zur Landtagswahl 2026",
        "datei": "data/programme/mv/cdu.pdf",
        "url": "https://cdu-mv.de/wp-content/uploads/2026/06/Wahlprogramm-CDU-MV-2026.pdf"
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
        "titel": "Aufschwung, Zusammenhalt und Respekt. Regierungsprogramm 2026–2031",
        "datei": "data/programme/mv/spd.pdf",
        "url": "https://spd-mv.de/uploads/bilderpool/2-Mecklenburg-Vorpommern/Wahlen-und-Kandidaturen/2026-Landtagswahlen/SPD_MV_Programm_2026.pdf"
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
        "titel": "Klare Kante Zukunft. Für Mensch und Natur in MV. Wahlprogramm 2026",
        "datei": "data/programme/mv/gruene.pdf",
        "url": "https://schwerin.news/wp-content/uploads/2026/08/wahlprogramm-gruene.pdf"
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
        "titel": "Freiheit, Leistung, Erfolg. Programm zur Landtagswahl 2026",
        "datei": "data/programme/mv/fdp.pdf",
        "url": "https://www.fdp-mv.de/sites/default/files/2026-06/Landtagswahlprogramm_2026.pdf"
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
        "titel": "Bereit für die blaue Wende. AfD-Regierungsprogramm zur Landtagswahl 2026",
        "datei": "data/programme/mv/afd.pdf",
        "url": "https://afd-mv.de/wp-content/uploads/2026/06/AfD-Regierungsprogramm-Mecklenburg-Vorpommern-2026.pdf"
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
        "titel": "Sozial. Gerecht. Antifaschistisch. Programm zur Landtagswahl 2026",
        "datei": "data/programme/mv/linke.pdf",
        "url": "https://www.dielinke-rostock.de/fileadmin/kreise/rostock/user/upload/Linke_MV_Landtagswahlprogramm_2026.pdf"
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
        "titel": "Frischer Wind in MV! Landeswahlprogramm 2026",
        "datei": "data/programme/mv/bsw.pdf",
        "url": "https://mv.bsw-vg.de/wp-content/uploads/2026/04/Landeswahlprogramm-2026.pdf"
      }
    }
  ],
  "themen": [
    {
      "id": "sicherheit",
      "titel": "Innere Sicherheit und Polizei",
      "beschreibung": "Personal, Präsenz und Kontrolle der Polizei.",
      "fragen": [
        {
          "id": "mv-f006",
          "text": "Wie viel Polizeipräsenz braucht das Land?",
          "aussagen": [
            {
              "id": "mv-a005",
              "parteiId": "cdu",
              "kurz": "Ziel ist eine präsente Landespolizei mit schnellen Reaktionszeiten. Dazu kommen eine effektive Strafverfolgung und eine funktionierende Justiz. Auch Katastrophen- und Bevölkerungsschutz sollen ausgebaut werden.",
              "original": "Unser Ziel: Der wirksame Schutz von Leben, Freiheit und Eigentum, eine präsente Landespolizei mit schnellen Reaktionszeiten, eine effektive Strafverfolgung, eine funktionierende Justiz, der Ausbau des Katastrophen- und Bevölkerungsschutzes.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 26,
                "markierung": "Landespolizei mit schnellen Reaktionszeiten, eine effektive Strafverfolgung, eine"
              }
            },
            {
              "id": "mv-a066",
              "parteiId": "fdp",
              "kurz": "Der Personalschlüssel der Landespolizei soll bedarfs- und aufgabengerecht angepasst werden. Mehr Polizeibeamte sollen wieder im operativen Dienst eingesetzt werden. Sicherheit entstehe durch Präsenz.",
              "original": "Wir Freie Demokraten werden: den Personalschlüssel der Landespolizei bedarfs- und aufgabengerecht anpassen, und wieder mehr Polizeibeamte im operativen Dienst einsetzen. Sicherheit entsteht durch Präsenz.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 133,
                "markierung": "den Personalschlüssel der Landespolizei bedarfs- und aufgabengerecht anpassen"
              }
            },
            {
              "id": "mv-a046",
              "parteiId": "afd",
              "kurz": "Am Ziel von 6.200 Beamten der Landespolizei wird festgehalten. Die Fachhochschule Güstrow müsse fortlaufend genügend gut ausgebildete Absolventen hervorbringen. Die Polizei soll von Aufgaben entlastet und ihre Kompetenzen ausgebaut werden.",
              "original": "Personalbestand der Polizei sichern, Kompetenzen ausbauen, Kräfte freimachen: Wir halten am Ziel von 6200 Beamten der Landespolizei fest. Die Fachhochschule Güstrow muss fortlaufend genügend gut ausgebildete und motivierte Polizeiabsolventen hervorbringen.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 37,
                "markierung": "Wir halten am Ziel von 6200 Beamten der Landespolizei fest"
              }
            },
            {
              "id": "mv-a016",
              "parteiId": "bsw",
              "kurz": "Die Polizei soll sichtbar, ansprechbar und schnell vor Ort sein, in Städten wie im ländlichen Raum. Gesetzt wird auf Präsenz vor Technik: mehr Einsatzkräfte statt Ausweitung der Videoüberwachung. Polizeireviere sollen insbesondere in ländlichen Regionen erhalten bleiben.",
              "original": "Polizei muss sichtbar, ansprechbar und schnell vor Ort sein – in Städten wie im ländlichen Raum. […] • Präsenz vor Technik: mehr Einsatzkräfte statt Ausweitung von Videoüberwachung im öffentlichen Raum. • Erhalt von Polizeirevieren, insbesondere in ländlichen Regionen.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 67,
                "markierung": "Präsenz vor Technik: mehr Einsatzkräfte statt Ausweitung von Videoüberwachung im öffentlichen Raum"
              }
            }
          ]
        },
        {
          "id": "mv-f026",
          "text": "Wie soll die Polizeiarbeit weiterentwickelt werden?",
          "aussagen": [
            {
              "id": "mv-a024",
              "parteiId": "spd",
              "kurz": "Die Polizeiarbeit soll durch die konsequente Fortsetzung der Digitalisierungsstrategie modernisiert und von Mehrfacharbeiten entlastet werden. Sicherheit soll nicht die Polizei allein tragen, sondern gemeinsam mit Ordnungsbehörden, Jugendhilfe, Schulen und Sozialarbeit.",
              "original": "Dafür steht nicht die Polizei allein, sondern gemeinsam, vor allem mit ihren Kontaktbeamten, mit Ordnungsbehörden, Jugendhilfe, Schulen, Sozialarbeit, Wohnungsunternehmen, Vereinen und Trägern in Quartieren. […] Die polizeiliche Arbeit werden wir durch eine konsequente Fortsetzung der Digitalisierungsstrategie weiter modernisieren und insbesondere von Mehrfacharbeiten entlasten.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 47,
                "markierung": "durch eine konsequente Fortsetzung der Digitalisierungsstrategie weiter modernisieren"
              }
            },
            {
              "id": "mv-a002",
              "parteiId": "gruene",
              "kurz": "Gefordert werden ausreichende Neueinstellungen und eine Reform der Aus- und Fortbildung der Landespolizei. Diese soll einen höheren Anteil politischer Bildung vorsehen. Zudem soll besser auf Einsätze mit Menschen in psychischen Ausnahmezuständen vorbereitet werden.",
              "original": "Für eine bürger*innennahe Polizei wollen wir: • ausreichende Neueinstellungen und eine Reform der Aus- und Fortbildung der Landespolizei, die einen höheren Anteil an politischer Bildung vorsieht sowie besser auf Einsatzsituationen mit Menschen in psychischen Ausnahmezuständen vorbereitet.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 77,
                "markierung": "ausreichende Neueinstellungen und eine Reform der Aus- und Fortbildung der Landespolizei"
              }
            },
            {
              "id": "mv-a061",
              "parteiId": "linke",
              "kurz": "Alle Sicherheitsbefugnisse sollen kritisch auf die Einhaltung der Bürger- und Freiheitsrechte geprüft werden. Gefordert wird eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat. Zudem sollen Kontrollquittungen für Betroffene polizeilicher Maßnahmen eingeführt werden.",
              "original": "• Alle Sicherheitsbefugnisse kritisch auf Einhaltung der Bürger:innen- und Freiheitsrechte prüfen. […] • Eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat, Ressourcen und Befugnissen, um Fehlverhalten der Polizei effektiv zu verfolgen und aufzuklären.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 20,
                "markierung": "Eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat"
              }
            }
          ]
        },
        {
          "id": "mv-f024",
          "text": "Soll die Videoüberwachung im öffentlichen Raum ausgeweitet werden?",
          "aussagen": [
            {
              "id": "mv-a026",
              "parteiId": "cdu",
              "kurz": "Angsträume sollen unter anderem durch mehr Videoüberwachung verhindert werden. Dazu kommen je 50 zusätzliche Stellen bei Staatsanwaltschaften und Gerichten sowie bei der Kriminalpolizei.",
              "original": "Schaffung von 50 zusätzlichen Stellen bei den Staatsanwaltschaften und Gerichten sowie von 50 zusätzlichen spezialisierten Stellen bei der Kriminalpolizei, insbesondere zur wirksamen Bekämpfung von Kinderpornografie und Cyberkriminalität; Verhinderung von Angsträumen, unter anderem durch eine Ausweitung der Videoüberwachung.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 6,
                "markierung": "anderem durch eine Ausweitung der Videoüberwachung"
              }
            },
            {
              "id": "mv-a025",
              "parteiId": "bsw",
              "kurz": "Bürgernähe soll vor allem durch mehr Personal im Streifen- und Ermittlungsdienst entstehen. Einen unverhältnismäßigen Ausbau der Videoüberwachung im öffentlichen Raum soll es nicht geben.",
              "original": "Bürgernähe entsteht vor allem durch ausreichend Personal im Streifen- und Ermittlungsdienst und durch erreichbare Strukturen, nicht durch den unverhältnismäßigen Ausbau von Videoüberwachung im öffentlichen Raum.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 67,
                "markierung": "nicht durch den unverhältnismäßigen Ausbau von Videoüberwachung im öffentlichen Raum"
              }
            },
            {
              "id": "mv-a003",
              "parteiId": "fdp",
              "kurz": "Flächendeckende Videoüberwachung und automatisierte Gesichtserkennung werden klar abgelehnt. Freiheit soll nicht permanenter Beobachtung weichen.",
              "original": "[…] eine flächendeckende Videoüberwachung und automatisierte Gesichtserkennung klar und deutlich ablehnen. Freiheit darf nicht permanenter Beobachtung weichen.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 133,
                "markierung": "eine flächendeckende Videoüberwachung und automatisierte Gesichtserkennung klar und deutlich ablehnen"
              }
            },
            {
              "id": "mv-a064",
              "parteiId": "linke",
              "kurz": "Staatstrojaner, Vorratsdatenspeicherung und automatisierte Gesichtserkennung sollen nicht eingesetzt werden. Palantir und allgegenwärtige Videoüberwachung werden ausdrücklich abgelehnt.",
              "original": "Das Recht auf informationelle Selbstbestimmung sicherstellen: kein Einsatz von Staatstrojanern, Vorratsdatenspeicherung oder automatisierter Gesichtserkennung. Insbesondere stellen wir uns gegen eine Nutzung von Palantir oder allgegenwärtiger Videoüberwachung.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 19,
                "markierung": "Insbesondere stellen wir uns gegen eine Nutzung von Palantir oder allgegenwärtiger Videoüberwachung"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "zuwanderung",
      "titel": "Zuwanderung und Integration",
      "beschreibung": "Aufnahme, Rückführung, Sprache und Arbeitsmarkt.",
      "fragen": [
        {
          "id": "mv-f003",
          "text": "Wie konsequent soll abgeschoben werden?",
          "aussagen": [
            {
              "id": "mv-a023",
              "parteiId": "cdu",
              "kurz": "Die Handyortung soll gezielt zur Durchsetzung des Rechtsstaats genutzt werden, unter anderem bei untergetauchten Ausreisepflichtigen. Damit sollen gescheiterte Abschiebungen reduziert werden. Dafür brauche es eine klare rechtliche Grundlage.",
              "original": "Wir wollen, dass die Handyortung gezielt zur Durchsetzung des Rechtsstaats genutzt werden soll, unter anderem bei untergetauchten Ausreisepflichtigen, um gescheiterte Abschiebungen zu reduzieren und staatliche Maßnahmen effizient umzusetzen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 36,
                "markierung": "unter anderem bei untergetauchten Ausreisepflichtigen, um"
              }
            },
            {
              "id": "mv-a041",
              "parteiId": "fdp",
              "kurz": "Abschiebungen sollen bei Vorliegen der Voraussetzungen konsequent umgesetzt werden, Vollzugsdefizite dürfe es nicht geben. Menschen ohne Bleibeperspektive sollen nicht erst auf die Kommunen verteilt werden. Verfahren sollen zügig abgeschlossen werden.",
              "original": "Menschen ohne Bleibeperspektive sollen nicht erst auf die Kommunen verteilt werden, wenn sie ohnehin abgeschoben werden müssen. Abschiebungen müssen bei Vorliegen der Voraussetzungen konsequent umgesetzt werden. Vollzugsdefizite bei Abschiebungen darf es nicht geben.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 143,
                "markierung": "Abschiebungen müssen bei Vorliegen der Voraussetzungen konsequent umgesetzt werden"
              }
            },
            {
              "id": "mv-a081",
              "parteiId": "afd",
              "kurz": "Die illegale Einwanderung soll eingedämmt werden. Kriminelle und vollziehbar ausreisepflichtige Migranten sollen konsequent abgeschoben werden. Zugleich soll die Polizei modern ausgestattet und ihre Präsenz auf den Straßen erhöht werden.",
              "original": "[Wir werden] unsere Polizei modern ausstatten und ihre Präsenz auf den Straßen erhöhen. Die illegale Einwanderung werden wir eindämmen, indem wir kriminelle und vollziehbar ausreisepflichtige Migranten konsequent abschieben.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 11,
                "markierung": "indem wir kriminelle und vollziehbar ausreisepflichtige Migranten konsequent abschieben"
              }
            },
            {
              "id": "mv-a063",
              "parteiId": "linke",
              "kurz": "Lebensgefährliche Abschiebungen sollen beendet werden, besonders bei unbegleiteten minderjährigen Flüchtlingen. Die UN-Kinderrechtskonvention soll uneingeschränkt angewendet werden. Integration wird als wechselseitiger Prozess verstanden.",
              "original": "Integration ist ein wechselseitiger Prozess, der Unterstützung, Bildung und gesellschaftliche Offenheit erfordert. Wir wollen: • Lebensgefährliche Abschiebungen beenden, besonders für unbegleitete minderjährige Flüchtlinge sowie die UN-Kinderrechtskonvention uneingeschränkt anwenden.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 13,
                "markierung": "Lebensgefährliche Abschiebungen beenden, besonders für unbegleitete minderjährige Flüchtlinge"
              }
            }
          ]
        },
        {
          "id": "mv-f022",
          "text": "Wie soll Zuwanderung gesteuert und Integration gestaltet werden?",
          "aussagen": [
            {
              "id": "mv-a080",
              "parteiId": "spd",
              "kurz": "Übergänge aus dem Asylsystem in die Erwerbsmigration sollen erleichtert werden. Die Anerkennung von Berufsabschlüssen wird beschleunigt. Insbesondere Frauen sollen beim Zugang zu Sprachkursen, Ausbildung und Beschäftigung unterstützt werden.",
              "original": "[Wir erleichtern] Übergänge aus dem Asylsystem in die Erwerbsmigration, beschleunigen die Anerkennung von Berufsabschlüssen und unterstützen insbesondere Frauen beim Zugang zu Sprachkursen, Ausbildung und Beschäftigung.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 61,
                "markierung": "beschleunigen die Anerkennung von Berufsabschlüssen und unterstützen insbesondere Frauen beim Zugang zu Sprachkursen"
              }
            },
            {
              "id": "mv-a069",
              "parteiId": "gruene",
              "kurz": "Unternehmen sollen dabei unterstützt werden, Fachkräfte zu gewinnen und zu halten. Dazu dienen klare Anlaufstellen für Zuwanderung und Rückkehr. Hinzu kommen bessere Übergänge von Schule, Ausbildung und Studium in den Beruf.",
              "original": "Wir unterstützen Unternehmen dabei, Fachkräfte zu gewinnen und zu halten: mit klaren Anlaufstellen für Zuwanderung und Rückkehr, besseren Übergängen von Schule, Ausbildung und Studium in den Beruf und einer engeren Zusammenarbeit zwischen Bildung und Wirtschaft.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 30,
                "markierung": "mit klaren Anlaufstellen für Zuwanderung und Rückkehr"
              }
            },
            {
              "id": "mv-a042",
              "parteiId": "bsw",
              "kurz": "Zuwanderung soll verantwortungsvoll gestaltet werden: leistbar, rechtsstaatlich und integrationsfähig. Am Grundrecht auf Asyl für politisch Verfolgte wird festgehalten. Zuwanderungspolitik brauche Augenmaß und Rechtssicherheit statt ideologischer Schnellschüsse.",
              "original": "6.2. Zuwanderung: Zuwanderung verantwortungsvoll gestalten – leistbar, rechtsstaatlich und integrationsfähig. Das Grundrecht auf Asyl für politisch verfolgte Menschen [bleibt]. […] [Zuwanderungspolitik] braucht Augenmaß, Verantwortung und Rechtssicherheit – keine ideologischen Schnellschüsse.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 72,
                "markierung": "Zuwanderung verantwortungsvoll gestalten – leistbar, rechtsstaatlich und integrationsfähig"
              }
            }
          ]
        },
        {
          "id": "mv-f004",
          "text": "Soll die Bezahlkarte für Geflüchtete bleiben?",
          "aussagen": [
            {
              "id": "mv-a072",
              "parteiId": "fdp",
              "kurz": "Das landesweit einheitliche Bezahlkartensystem soll konsequent umgesetzt und beibehalten werden. Es soll Transparenz schaffen und Missbrauch vorbeugen.",
              "original": "[…] dass staatliche Leistungen dort ankommen, wo sie hingehören: bei den Menschen, die sie wirklich benötigen. Daher muss das landesweit einheitliches Bezahlkartensystem konsequent umgesetzt und beibehalten werden. Es schafft Transparenz und beugt Missbrauch vor.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 143,
                "markierung": "Bezahlkartensystem konsequent umgesetzt und beibehalten werden"
              }
            },
            {
              "id": "mv-a031",
              "parteiId": "gruene",
              "kurz": "Die Bezahlkarte soll abgeschafft werden, damit alle Geflüchteten einen selbstbestimmten Alltag führen können. Zugleich sollen faire Verfahren durch unabhängige Beratung gestärkt werden.",
              "original": "Wir gestalten Asylpolitik menschlich, verlässlich und gerecht. Wir schaffen die Bezahlkarte ab und ermöglichen allen Geflüchteten einen selbstbestimmten Alltag. Gleichzeitig stärken wir faire Verfahren durch unabhängige Beratung […]",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 92,
                "markierung": "Wir schaffen die Bezahlkarte ab"
              }
            },
            {
              "id": "mv-a076",
              "parteiId": "linke",
              "kurz": "Die Bezahlkarte soll in ihrer jetzigen Form abgeschafft werden. Geflüchtete sollen gleichberechtigt am Zahlungsverkehr teilnehmen, ohne Obergrenze für Bargeld und mit der Möglichkeit von Überweisungen.",
              "original": "Die Abschaffung der Bezahlkarte in der jetzigen Form, eine gleichberechtigte Teilhabe am Finanzverkehr, die Aufhebung der Begrenzung für Bargeldabhebungen sowie die Ermöglichung von Überweisungen.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 14,
                "markierung": "Die Abschaffung der Bezahlkarte in der jetzigen Form"
              }
            },
            {
              "id": "mv-a060",
              "parteiId": "afd",
              "kurz": "Asylbewerber und Ausreisepflichtige sollen nur noch Sachleistungen nach dem Prinzip Bett, Brot, Seife erhalten. Wer die Bezahlkarte umgeht oder anderen dabei hilft, soll strafrechtlich verfolgt werden können.",
              "original": "[…] das Sachleistungsprinzip maximal umsetzen. In den zu schaffenden Ausreiseeinrichtungen des Landes sollen zukünftig keinerlei Geldleistungen mehr ausgegeben werden. Zukünftig gilt stattdessen das „Bett-Brot-Seife-Prinzip“ für Asylbewerber und Ausreisepflichtige. […] Den Missbrauch der Bezahlkarte durch meist linksradikale Akteure werden wir konsequent beenden. Hierfür fordern wir auf Bundesebene die Ermöglichung strafrechtlicher Verfolgung […]",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 50,
                "markierung": "Den Missbrauch der Bezahlkarte durch meist linksradikale Akteure werden wir konsequent beenden"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "schule",
      "titel": "Schule und Unterrichtsversorgung",
      "beschreibung": "Unterrichtsausfall, Lehrkräfte und Schulqualität.",
      "fragen": [
        {
          "id": "mv-f017",
          "text": "Wie sollen Lehrkräfte entlastet und unterstützt werden?",
          "aussagen": [
            {
              "id": "mv-a074",
              "parteiId": "spd",
              "kurz": "Ziel ist eine flächendeckende und hochwertige Unterrichtsversorgung im Land. Lehrkräfte sollen unter anderem durch eine Reduzierung der Unterrichtsverpflichtung entlastet werden. Dies soll im Rahmen des Bildungspakts Gute Schule geschehen.",
              "original": "Unser Ziel ist, eine flächendeckende und hochwertige Unterrichtsversorgung im Land abzusichern und sich bietende Möglichkeiten zu nutzen, um Lehrkräfte, u.a. durch eine Reduzierung der Unterrichtsverpflichtung, zu entlasten.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 4,
                "markierung": "eine flächendeckende und hochwertige Unterrichtsversorgung im Land abzusichern"
              }
            },
            {
              "id": "mv-a035",
              "parteiId": "gruene",
              "kurz": "Gesetzt wird auf multiprofessionelle Teams, in denen Fachleute wirklich zusammenarbeiten. Sie sollen nicht nur nebeneinander agieren. Lehrkräfte sollen dadurch gestärkt werden.",
              "original": "6.2. Lehrkräfte stärken. „Wir setzen auf multiprofessionelle Teams, in denen Fachleute wirklich zusammenarbeiten und nicht nur nebeneinander agieren.“",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 42,
                "markierung": "Wir setzen auf multiprofessionelle Teams,"
              }
            },
            {
              "id": "mv-a054",
              "parteiId": "fdp",
              "kurz": "Die Arbeitsbedingungen für Lehrkräfte sollen durch weniger Bürokratie verbessert werden. Dazu kommen eine bessere digitale Basisausstattung und verlässliche Zuständigkeiten für Wartung und technische Betreuung. Schulen sollen zudem über den Weg zum Abitur selbst entscheiden können.",
              "original": "[Wir wollen] die Arbeitsbedingungen für Lehrkräfte durch weniger Bürokratie, bessere digitale Basisausstattung und verlässliche Zuständigkeiten für Wartung und technische Betreuung verbessern.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 86,
                "markierung": "die Arbeitsbedingungen für Lehrkräfte durch weniger Bürokratie, bessere digitale Basisausstattung"
              }
            },
            {
              "id": "mv-a048",
              "parteiId": "linke",
              "kurz": "Gute Bildung entstehe dort, wo ausreichend Zeit, Unterstützung und verlässliche Strukturen vorhanden sind. Lehrkräfte könnten ihren Auftrag nur erfüllen, wenn sie entlastet werden. Schule brauche multiprofessionelle Unterstützung.",
              "original": "Gute Bildung durch mehr Personal: Gute Bildung entsteht dort, wo ausreichend Zeit, Unterstützung und verlässliche Strukturen vorhanden sind. Lehrkräfte können ihren Bildungsauftrag nur dann gut erfüllen, wenn sie entlastet werden.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 5,
                "markierung": "Lehrkräfte können ihren Bildungsauftrag nur dann gut erfüllen, wenn sie entlastet werden"
              }
            }
          ]
        },
        {
          "id": "mv-f012",
          "text": "Welchen Kurs soll die Schulpolitik einschlagen?",
          "aussagen": [
            {
              "id": "mv-a008",
              "parteiId": "cdu",
              "kurz": "Der Unterrichtsausfall soll beendet werden. Der Anteil der Schüler ohne Schulabschluss soll drastisch verringert werden. Ziel ist, alle Schülerinnen und Schüler zu echter Ausbildungsreife zu führen.",
              "original": "Unterrichtsausfall beenden, Grundschul-Garantie und hochqualitativer Unterricht […]. Unser Ziel: Den Unterrichtsausfall beenden, den Anteil der Schüler ohne Schulabschluss drastisch verringern und alle Schülerinnen und Schüler zu echter Ausbildungs- [reife führen].",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 46,
                "markierung": "Den Unterrichtsausfall beenden, den Anteil der Schüler ohne"
              }
            },
            {
              "id": "mv-a059",
              "parteiId": "afd",
              "kurz": "Schulen sollen klare Regeln haben, in denen Lehrer ihre Aufgabe wahrnehmen können. Berufsschulen sollen handwerkliche Exzellenz fördern, Hochschulen Qualität vor Quantität stellen. Bildung sei kein Sozialprogramm.",
              "original": "Dafür braucht es Schulen, in denen klare Regeln gelten und Lehrer ihre Aufgabe wahrnehmen können, Berufsschulen, die handwerkliche Exzellenz fördern und Hochschulen, die Qualität vor Quantität stellen. Bildung ist kein Sozialprogramm und kein Haltungsturnen.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 24,
                "markierung": "Berufsschulen, die handwerkliche Exzellenz fördern"
              }
            },
            {
              "id": "mv-a019",
              "parteiId": "bsw",
              "kurz": "Schulen sollen mehr Freiräume und eine bessere Ausstattung erhalten, um die Schulentwicklung gemeinsam vor Ort zu gestalten. Der Lehrerberuf soll durch ein praxisnäheres, duales Studium und ein Referendariat als echte Ausbildungszeit attraktiver werden.",
              "original": "Mehr Freiräume für Schulen (auch im Sinne einer entsprechenden verbesserten Ausstattung) für eine gemeinsame Schulentwicklung vor Ort. […] Für die Lehrkräftegewinnung muss der Beruf attraktiver werden, z.B. durch ein praxisnäheres Studium (in Richtung eines Dualen Studiums), Entlastungen im Referendariat (als echte Ausbildungszeit).",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 47,
                "markierung": "Mehr Freiräume für Schulen"
              }
            }
          ]
        },
        {
          "id": "mv-f016",
          "text": "Sollen Smartphones an Schulen verboten werden?",
          "aussagen": [
            {
              "id": "mv-a032",
              "parteiId": "afd",
              "kurz": "Die private Handynutzung im Schulalltag soll per Verordnung bis einschließlich Klasse 7 unterbunden werden. Ausnahmen soll es nur in Notfällen oder nach Rücksprache mit der Lehrkraft geben.",
              "original": "Die private Handynutzung im Schulalltag werden wir auf dem Verordnungswege bis einschließlich der 7. Klasse konsequent unterbinden, allenfalls bei Notfällen oder nach Rücksprache mit dem Lehrer soll das Handy genutzt werden dürfen.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 31,
                "markierung": "bis einschließlich der 7. Klasse konsequent unterbinden"
              }
            },
            {
              "id": "mv-a011",
              "parteiId": "bsw",
              "kurz": "Handys und Tablets sollen aus den Klassenzimmern der Grundschulen verbannt werden. Digitale Geräte sollen nicht in den Mittelpunkt des Unterrichts rücken, sie gelten als bloße Werkzeuge.",
              "original": "Handys und Tablets wollen wir aus den Klassenzimmern der Grundschulen verbannen. Digitale Geräte wie Smartphones und Tablets dürfen nicht in den Mittelpunkt des Unterrichts gerückt werden. Sie sind nicht die Lösung der Bildungsprobleme, sondern lediglich Werkzeuge […]",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 47,
                "markierung": "Handys und Tablets wollen wir aus den Klassenzimmern der Grundschulen verbannen"
              }
            },
            {
              "id": "mv-a085",
              "parteiId": "cdu",
              "kurz": "Die private Smartphone-Nutzung soll landeseinheitlich bis Klasse 10 im Unterricht und auf dem ganzen Schulgelände verboten werden. Ab Klasse 7 dürfen Smartphones nur auf Anweisung der Lehrkraft genutzt werden.",
              "original": "Für die private Smartphone-Nutzung werden wir eine landeseinheitliche Regelung einführen, nach der die private Nutzung von Smartphones im Unterricht und auf dem gesamten Schulgelände bis Klasse zehn untersagt ist. Von Klasse sieben bis zehn darf der Einsatz von Smartphones ausschließlich auf Anweisung des Lehrers erfolgen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 53,
                "markierung": "dem gesamten Schulgelände bis Klasse zehn untersagt ist"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "kita",
      "titel": "Frühkindliche Bildung und Kita",
      "beschreibung": "Betreuungsschlüssel, Qualität und Elternbeiträge.",
      "fragen": [
        {
          "id": "mv-f027",
          "text": "Wie soll die Kita-Betreuung finanziert werden?",
          "aussagen": [
            {
              "id": "mv-a045",
              "parteiId": "cdu",
              "kurz": "Neubauten und Sanierungen von Schul- und Sportstätten, Kitas und Horteinrichtungen sollen auch durch Bund und Land finanziert werden. Damit sollen die Gemeinden entlastet werden. EU-Mittel sollen praxisgerechter für die Kommunen genutzt werden.",
              "original": "Insbesondere Neubauten und Sanierungen von Schul- und Sportstätten, Kitas und Horteinrichtungen sollten auch durch Bund und Land zur Entlastung der Gemeinden finanziert werden.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 41,
                "markierung": "Neubauten und Sanierungen von Schul- und Sportstätten, Kitas und Horteinrichtungen"
              }
            },
            {
              "id": "mv-a036",
              "parteiId": "spd",
              "kurz": "Die Kita soll in Krippe, Kindergarten, Hort und Tagespflege beitragsfrei bleiben; das wird ausdrücklich garantiert. Gleichzeitig soll in Qualitätsverbesserungen in der frühkindlichen Bildung investiert werden.",
              "original": "Für die Entlastung der Familien bleibt die Kita in Krippe, Kindergarten, Hort und Tagespflege beitragsfrei. Das garantieren wir. Gleichzeitig investieren wir in Qualitätsverbesserungen in der frühkindlichen Bildung.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 4,
                "markierung": "bleibt die Kita in Krippe, Kindergarten, Hort und Tagespflege beitragsfrei"
              }
            },
            {
              "id": "mv-a018",
              "parteiId": "fdp",
              "kurz": "Die Landesfinanzierung für die frühkindliche Betreuung in Kitas und Kindertagespflegestellen soll überprüft und an die tatsächlichen Notwendigkeiten angepasst werden. Die Trägervielfalt soll erhalten bleiben. Kommunen sollen bei Leistungen nach dem Bundesteilhabegesetz vollständig refinanziert werden.",
              "original": "[Wir wollen] die Finanzierung des Landes für die frühkindliche Betreuung in Kitas und Kindertagespflegestellen überprüfen und an die tatsächlichen Notwendigkeiten anpassen[;] uns für den Erhalt der Trägervielfalt […] [einsetzen].",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 37,
                "markierung": "die Finanzierung des Landes für die frühkindliche Betreuung in Kitas und Kindertagespflegestellen überprüfen"
              }
            },
            {
              "id": "mv-a075",
              "parteiId": "linke",
              "kurz": "Qualitätsverbesserungen sollen bei Krippe und Hort beginnen, weil die Bedarfe dort am drängendsten seien. Die Beitragsfreiheit in der Kita soll erhalten bleiben. Gute Bildung brauche zusätzlich Zeit für jedes Kind und gezielte Förderung.",
              "original": "Doch gute Bildung braucht mehr: Zeit für jedes Kind, bessere Rahmenbedingungen und gezielte Förderung. Wir wollen: Die Beitragsfreiheit in der Kita erhalten und Qualitätsverbesserungen beginnend in Krippe und Hort, da die Bedarfe dort am drängendsten sind.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 5,
                "markierung": "Qualitätsverbesserungen beginnend in Krippe und Hort"
              }
            }
          ]
        },
        {
          "id": "mv-f005",
          "text": "Was soll die Kita über die Betreuung hinaus leisten?",
          "aussagen": [
            {
              "id": "mv-a092",
              "parteiId": "gruene",
              "kurz": "Der Kita-Betreuungsschlüssel soll gesenkt und die Qualität verbessert werden. Zu große Gruppen und zu wenig Personal gingen zulasten von Kindern und Fachkräften. Horte liefen oft nur nebenher mit.",
              "original": "6.1. Kita-Betreuungsschlüssel senken und Qualität verbessern […]. Zu große Gruppen, zu wenig Personal und Horte, die oft nur nebenher mitlaufen, gehen zulasten der Kinder und der Fachkräfte.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 41,
                "markierung": "Kita-Betreuungsschlüssel senken und Qualität verbessern"
              }
            },
            {
              "id": "mv-a058",
              "parteiId": "afd",
              "kurz": "Vorgesehen sind konkrete Maßnahmen von einem Baby-Begrüßungsgeld bis zu besseren Kita-Betreuungsschlüsseln. Hinzu kommt der Schutz von Kindern vor Gewalt und ideologischer Einflussnahme. Junge Eltern sollen nicht mit bürokratischen Hürden überzogen werden.",
              "original": "Wir begegnen dieser Entwicklung mit konkreten Maßnahmen. Vom Baby-Begrüßungsgeld über bessere Kita-Betreuungsschlüssel bis hin zum Schutz von Kindern vor Gewalt und ideologischer Einflussnahme.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 18,
                "markierung": "Vom Baby-Begrüßungsgeld über bessere Kita-Betreuungsschlüssel"
              }
            },
            {
              "id": "mv-a044",
              "parteiId": "bsw",
              "kurz": "Kitas seien weit mehr als Betreuungsorte und förderten soziale, sprachliche und emotionale Kompetenzen. Frühkindliche Bildung lege den Grundstein für ein gelingendes Leben. Kitas, Schulen und Hochschulen sollen so gestaltet werden, dass Lernen Freude macht.",
              "original": "Chancen von Anfang an: Frühkindliche Bildung und Förderung legen den Grundstein für ein gelingendes Leben. Kitas sind weit mehr als Betreuungsorte: Sie unterstützen Kinder in ihrer Entwicklung, fördern soziale, sprachliche und emotionale Kompetenzen.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 45,
                "markierung": "Kitas sind weit mehr als Betreuungsorte"
              }
            }
          ]
        },
        {
          "id": "mv-f013",
          "text": "Wann soll der Sprachstand von Kindern verbindlich geprüft werden?",
          "aussagen": [
            {
              "id": "mv-a095",
              "parteiId": "bsw",
              "kurz": "Ab dem vierten Lebensjahr soll der Sprachstand früh und verbindlich festgestellt werden, verbunden mit gezielter Förderung. Zusätzlich soll es ein verpflichtendes Vorschuljahr für alle Kinder geben.",
              "original": "Frühe verbindliche Sprachstandsfeststellung ab dem vierten Lebensjahr, verbunden mit gezielter Förderung durch pädagogisch qualifiziertes Personal, als Voraussetzung für einen guten Grundschulstart. Wir setzen uns für ein verpflichtendes Vorschuljahr für alle Kinder ein.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 46,
                "markierung": "Frühe verbindliche Sprachstandsfeststellung ab dem vierten Lebensjahr"
              }
            },
            {
              "id": "mv-a050",
              "parteiId": "cdu",
              "kurz": "Zwischen dem vierten und fünften Lebensjahr soll der Sprachstand verpflichtend festgestellt werden, bei Defiziten folgt Pflichtförderung. Schulen sollen Kinder ohne ausreichende Deutschkenntnisse von der Einschulung zurückstellen lassen können.",
              "original": "Bei Sprachdefiziten wird eine verpflichtende Sprachförderung erfolgen, damit Kinder vor der Einschulung ausreichende Deutschkenntnisse erwerben („Erst deutsche Sprache – dann erste Klasse“), dafür wird es verpflichtende Sprachstandsfeststellungen für Kinder zwischen dem vierten und fünften Lebensjahr geben; zukünftig wird auch den Schulen ein Antragsrecht auf Zurückstellung von der Schulpflicht eingeräumt, dann verpflichtende Förderung in Kita oder Vorschulklassen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 7,
                "markierung": "Sprachstandsfeststellungen für Kinder zwischen dem vierten und fünften Lebensjahr"
              }
            },
            {
              "id": "mv-a027",
              "parteiId": "linke",
              "kurz": "Bei allen Kindern mit viereinhalb Jahren soll der Sprachstand flächendeckend festgestellt werden. Zusätzliche Sprachfachkräfte sollen die Sprachförderung verbessern.",
              "original": "Flächendeckende Sprachstandsfeststellungen bei den viereinhalbjährigen Kindern und eine verbesserte Sprachförderung durch zusätzliche Sprachfachkräfte.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 5,
                "markierung": "Flächendeckende Sprachstandsfeststellungen bei den viereinhalbjährigen Kindern"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "gesundheit",
      "titel": "Gesundheit und Versorgung in der Fläche",
      "beschreibung": "Krankenhäuser, Hausärzte und Pflege im Flächenland.",
      "fragen": [
        {
          "id": "mv-f010",
          "text": "Wie soll die ärztliche Versorgung in der Fläche gesichert werden?",
          "aussagen": [
            {
              "id": "mv-a084",
              "parteiId": "cdu",
              "kurz": "Erweiterte Aufgaben für berufserfahrene Medizinische Fachangestellte sollen Hausärzte entlasten. Das Land soll die entsprechende Qualifizierung finanzieren. So soll die Versorgung in der Fläche gesichert werden.",
              "original": "[Wir wollen die Qualifizierung zur Praxisassistentin] durch das Land [fördern], damit ausgebildete, berufserfahrene Medizinische Fachangestellte erweiterte medizinische Aufgaben übernehmen und so Hausärzte entlasten sowie die Versorgung in der Fläche sichern können.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 6,
                "markierung": "erweiterte medizinische Aufgaben übernehmen und so"
              }
            },
            {
              "id": "mv-a090",
              "parteiId": "fdp",
              "kurz": "Die Studienkapazitäten in den medizinischen Fächern sollen erhöht und Studienplätze bevorzugt an Bewerber vergeben werden, die sich anschließend im Land niederlassen. Das Berufsbild der Community Health Nurse soll konsequent eingeführt werden.",
              "original": "[Wir werden] uns für eine Erhöhung der Studienkapazitäten an Hochschulen des Landes in den medizinischen Fächern einsetzen […]. Studienplätze an diejenigen vergeben, die sich nach dem Abschluss in Mecklenburg-Vorpommern niederlassen, ergänzt durch ein gezieltes Stipendiensystem für Landeskinder. […] die medizinische Versorgung im ländlichen Raum durch die konsequente Einführung des Berufsbildes der Community Health Nurse (CHN) zukunftsfest und attraktiv zu gestalten.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 44,
                "markierung": "die konsequente Einführung des Berufsbildes der Community Health Nurse"
              }
            },
            {
              "id": "mv-a051",
              "parteiId": "linke",
              "kurz": "Das „Schwester-Agnes“-Modell für arztentlastende Dienste im ländlichen Raum soll wieder aufleben. Gesundheitslotsen sollen Patientinnen und Versicherte begleiten. Die Vergütung im Praktischen Jahr soll auf ein existenzsicherndes Niveau angehoben werden.",
              "original": "• Das „Schwester-Agnes“ Modell für arztentlastende Dienste im ländlichen Raum wieder aufleben lassen. • Darauf hinwirken, dass Gesundheitslots:innen zum Einsatz kommen, die Patient:innen und Versicherte in allen relevanten Bereichen des Gesundheitswesens begleiten.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 19,
                "markierung": "Das „Schwester-Agnes“ Modell für arztentlastende Dienste im ländlichen Raum wieder aufleben lassen"
              }
            }
          ]
        },
        {
          "id": "mv-f011",
          "text": "Was braucht das Gesundheitswesen darüber hinaus?",
          "aussagen": [
            {
              "id": "mv-a001",
              "parteiId": "spd",
              "kurz": "Alle Krankenhäuser im Land seien erhalten worden, dieser Einsatz soll fortgesetzt werden. Eine flächendeckende stationäre Regel- und Grundversorgung soll in allen Regionen gewährleistet werden. Zugleich sollen Spezialisierungen der Krankenhäuser vorangetrieben werden.",
              "original": "Wir haben es geschafft, dass alle Krankenhäuser im Land erhalten worden sind. […] Konkret werden wir eine flächendeckende stationäre Versorgung in der Regel- und Grundversorgung in allen Regionen unseres Landes gewährleisten und gleichzeitig Spezialisierungen der Krankenhäuser […] forcieren.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 28,
                "markierung": "eine flächendeckende stationäre Versorgung in der Regel- und Grundversorgung in allen Regionen"
              }
            },
            {
              "id": "mv-a057",
              "parteiId": "gruene",
              "kurz": "Gesundheits- und Pflegeberufe sollen aufgewertet werden. Ihre Arbeit sei von Personalmangel, hoher Belastung und zu wenig Zeit für die Versorgung geprägt. Viele verließen deshalb den Beruf.",
              "original": "9.1. Gesundheits- und Pflegeberufe aufwerten […]. Doch ihre Arbeit ist oft von Personalmangel, hoher Belastung und zu wenig Zeit für die eigentliche Versorgung geprägt. Viele verlassen den Beruf.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 58,
                "markierung": "Gesundheits- und Pflegeberufe aufwerten"
              }
            },
            {
              "id": "mv-a006",
              "parteiId": "afd",
              "kurz": "Die Gesundheitspolitik soll Eigenverantwortung und Solidarität verbinden, den Wettbewerb fördern und den Schutz der Schwächeren sichern. Für die Beschäftigten soll die Kontrollbürokratie spürbar abgebaut werden.",
              "original": "Das Leitbild ist eine Gesundheitspolitik, die Eigenverantwortung und Solidarität miteinander verbindet, den Wettbewerb fördert und den Schutz der Schwächeren sicherstellt. […] Das erfordert einen wirklichen Abbau der Kontrollbürokratie und des Dokumentationswahns.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 59,
                "markierung": "einen wirklichen Abbau der Kontrollbürokratie"
              }
            },
            {
              "id": "mv-a029",
              "parteiId": "bsw",
              "kurz": "Krankenhäuser und medizinische Versorgungszentren sollen als Teil der öffentlichen Daseinsvorsorge erhalten und weiterentwickelt werden. Die wohnortnahe medizinische Versorgung soll besonders in ländlichen Regionen gesichert und gestärkt werden.",
              "original": "Unsere Ziele: Sicherung und Stärkung der wohnortnahen medizinischen Versorgung, insbesondere in ländlichen Regionen. Erhalt und Weiterentwicklung von Krankenhäusern und medizinischen Versorgungszentren als Teil der öffentlichen Daseinsvorsorge.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 57,
                "markierung": "Erhalt und Weiterentwicklung von Krankenhäusern und medizinischen Versorgungszentren"
              }
            }
          ]
        },
        {
          "id": "mv-f009",
          "text": "Wie sollen die Eigenanteile in Pflegeheimen sinken?",
          "aussagen": [
            {
              "id": "mv-a082",
              "parteiId": "bsw",
              "kurz": "Das Land soll die Investitionskosten der Pflegeheime übernehmen, damit die Eigenanteile der Bewohner sinken. Grundlage soll die Landespflegeplanung sein.",
              "original": "Senkung der Eigenanteile pflegebedürftiger Personen in stationären Pflegeeinrichtungen durch Übernahme der Investitionskosten der Einrichtungen durch das Land auf Grundlage der Landespflegeplanung.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 66,
                "markierung": "durch Übernahme der Investitionskosten der Einrichtungen durch das Land"
              }
            },
            {
              "id": "mv-a010",
              "parteiId": "cdu",
              "kurz": "Das Land soll sich an den Investitionskosten und an der Ausbildungsumlage der Pflege beteiligen. So sollen die Eigenanteile sinken und Pflege bezahlbarer werden.",
              "original": "Wir entlasten Pflegebedürftige und ihre Angehörigen finanziell. Indem wir durch eine Landesbeteiligung an den Investitionskosten und der Ausbildungsumlage die Eigenanteile reduzieren, machen wir Pflege bezahlbarer.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 78,
                "markierung": "Landesbeteiligung an den Investitionskosten und der Ausbildungsumlage"
              }
            },
            {
              "id": "mv-a037",
              "parteiId": "linke",
              "kurz": "Ein Investitionsprogramm soll notwendige Sanierungen von Pflegeheimen unterstützen. So sollen die Wohnkosten die Eigenanteile nicht noch schneller steigen lassen.",
              "original": "Die notwendigen Sanierungen von vollstationären Einrichtungen durch ein Investitionsprogramm unterstützen, damit die Eigenanteile durch die Kosten des Wohnens nicht schneller in die Höhe getrieben werden.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 12,
                "markierung": "durch ein Investitionsprogramm unterstützen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "energie",
      "titel": "Energie und Windkraft",
      "beschreibung": "Ausbau der Erneuerbaren, Akzeptanz und Beteiligung.",
      "fragen": [
        {
          "id": "mv-f001",
          "text": "Soll die Windkraft an Land weiter ausgebaut werden?",
          "aussagen": [
            {
              "id": "mv-a009",
              "parteiId": "cdu",
              "kurz": "Windkraftausbau im Wald und Waldstilllegungen werden grundsätzlich abgelehnt. Stattdessen sollen Soforthilfen für Waldschäden und Waldumbau bereitgestellt werden. Die Nutzung privater Waldflächen und Holzbauprojekte wird unterstützt.",
              "original": "[Wir wollen] Soforthilfen für Waldschäden und Waldumbau zur Klimaanpassung bereitstellen. Dabei unterstützen wir die Nutzung privater Waldflächen und Holzbauprojekte. Windkraftausbau im Wald und Waldstilllegungen lehnen wir grundsätzlich ab.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 93,
                "markierung": "Windkraftausbau im Wald und"
              }
            },
            {
              "id": "mv-a040",
              "parteiId": "gruene",
              "kurz": "Die Planungssicherheit soll erhöht werden, indem Genehmigungsbehörden als moderne und personalstarke Agenturen neu ausgerichtet werden. So sollen Windräder und Solaranlagen schneller gebaut werden. Strom soll dadurch günstiger produziert werden.",
              "original": "Tempo für Erneuerbare: Wir erhöhen die Planungssicherheit, indem wir Genehmigungsbehörden als moderne und personalstarke Agenturen neu ausrichten und fördern. Damit Windräder und Solaranlagen schneller gebaut werden und Strom endlich günstiger produziert wird.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 6,
                "markierung": "Damit Windräder und Solaranlagen schneller gebaut werden"
              }
            },
            {
              "id": "mv-a071",
              "parteiId": "afd",
              "kurz": "Der weitere Ausbau von Windkraftanlagen wird abgelehnt. Die einzigartige Kulturlandschaft sei die Grundlage des Tourismus. Wer auf Qualitätstourismus setze, dürfe seine Landschaft nicht ruinieren.",
              "original": "Die einzigartige Kulturlandschaft ist die Grundlage dieses Tourismus. Wir lehnen den weiteren Ausbau von Windkraftanlagen ab. Wer auf Qualitätstourismus setzt, darf seine Landschaft nicht ruinieren.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 68,
                "markierung": "Wir lehnen den weiteren Ausbau von Windkraftanlagen ab"
              }
            },
            {
              "id": "mv-a007",
              "parteiId": "bsw",
              "kurz": "Die Windenergie sei ein wichtiger Bestandteil der Energieversorgung. Ihr Ausbau dürfe jedoch nicht gegen die Interessen der Bevölkerung erfolgen. Gewinne aus der Stromerzeugung müssten auch den Gemeinden zugutekommen.",
              "original": "Gewinne aus der Stromerzeugung müssen auch den Gemeinden zugutekommen. Windenergie mit Maß und kommunaler Verantwortung: Die Windenergie ist ein wichtiger Bestandteil der Energieversorgung. Der Ausbau darf jedoch nicht gegen die Int[eressen der Bevölkerung erfolgen].",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 25,
                "markierung": "Windenergie mit Maß und kommunaler Verantwortung"
              }
            }
          ]
        },
        {
          "id": "mv-f020",
          "text": "Welche Energiewirtschaft soll das Land aufbauen?",
          "aussagen": [
            {
              "id": "mv-a004",
              "parteiId": "spd",
              "kurz": "Der Bau von Converter-Plattformen soll die auf See erzeugte Windenergie an Land leiten. Die Energiehäfen Rostock, Sassnitz-Mukran und Lubmin sollen entwickelt werden. Damit zeige sich wirtschaftliches Potenzial über den Schiffbau hinaus.",
              "original": "Der Bau von Converter-Plattformen, um die auf See erzeugte Windenergie an Land zu leiten, und die Entwicklung der Energiehäfen Rostock, Sassnitz-Mukran und Lubmin zeigen, dass es auch über den Schiffbau hinaus wirtschaftliche [Perspektiven gibt].",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 7,
                "markierung": "die auf See erzeugte Windenergie an Land zu leiten"
              }
            },
            {
              "id": "mv-a078",
              "parteiId": "fdp",
              "kurz": "Neben Gaskraftwerken wird eine im Land ansässige Wasserstoffproduktion angestrebt. Vorhandene Überkapazitäten etwa in der Windenergie sollen zeitnah für Wasserstoff genutzt oder in Batterien gespeichert werden. Ziel ist die Nutzung bestehender Erzeugung.",
              "original": "Neben Gaskraftwerken setzen wir uns für eine in Mecklenburg-Vorpommern ansässige Wasserstoffproduktion ein. Die bereits vorhandenen Überkapazitäten z.B. in der Windenergie müssen zeitnah für die Produktion von Wasserstoff bereitgestellt oder in Batterien gespeichert werden.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 63,
                "markierung": "Die bereits vorhandenen Überkapazitäten z.B. in der Windenergie müssen zeitnah für die Produktion von Wasserstoff bereitgestellt"
              }
            },
            {
              "id": "mv-a055",
              "parteiId": "linke",
              "kurz": "Die Offshore-Windenergie soll gestärkt werden. Zudem sollen neue Geschäftsfelder in der maritimen Industrie geprüft werden. Genannt wird etwa die Umrüstung der Binnenschifffahrtsflotte auf alternative Antriebe.",
              "original": "• Neue Geschäftsfelder in der maritimen Industrie prüfen, etwa die Umrüstung der Binnenschifffahrtsflotte auf alternative Antriebe. • Offshore-Windenergie stärken.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 10,
                "markierung": "Offshore-Windenergie stärken"
              }
            }
          ]
        },
        {
          "id": "mv-f007",
          "text": "Wie soll Strom für die Menschen im Land bezahlbarer werden?",
          "aussagen": [
            {
              "id": "mv-a087",
              "parteiId": "bsw",
              "kurz": "Die Netzentgelte sollen bundesweit angeglichen und gesenkt werden, weil Erzeugerregionen bisher benachteiligt sind. Neue regionale Marktmodelle sollen die Wertschöpfung im Land halten.",
              "original": "Eine zentrale Stellschraube für bezahlbare Energie ist die Reform der Netzentgelte. Wir setzen uns für eine bundesweite Angleichung und Senkung der Netzentgelte ein. Die derzeitige Kostenverteilung benachteiligt insbesondere energieerzeugende Regionen wie Mecklenburg-Vorpommern. Darüber hinaus braucht es neue regionale Marktmodelle, um Wertschöpfung im Land zu halten.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 27,
                "markierung": "Wir setzen uns für eine bundesweite Angleichung und Senkung der Netzentgelte ein"
              }
            },
            {
              "id": "mv-a093",
              "parteiId": "gruene",
              "kurz": "Haushalte im Umkreis von Windrädern und Solarparks sollen vollständig von den Netzentgelten befreit werden. Wer die Energiewende trägt, soll günstigeren Strom erhalten.",
              "original": "Wer die Energiewende trägt, soll auch günstigeren Strom erhalten. […] Haushalte im unmittelbaren Umfeld von Windenergieanlagen (2 km Radius) sowie von Freiflächen-Photovoltaikanlagen (500 m Radius) befreien wir vollständig von den Netzentgelten auf ihren Stromverbrauch.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 9,
                "markierung": "befreien wir vollständig von den Netzentgelten"
              }
            },
            {
              "id": "mv-a015",
              "parteiId": "cdu",
              "kurz": "Menschen in Regionen mit Windkraftanlagen sollen direkte Stromgutschriften erhalten, dazu soll es einen Landesbonus geben. So sollen sie fair an der Energieerzeugung vor Ort beteiligt werden.",
              "original": "Neben der Einführung eines „MV-Bonus“ setzen wir auf direkte Stromgutschriften für Menschen in Regionen mit Windkraftanlagen, um die Akzeptanz der Energiewende zu stärken und eine faire finanzielle Teilhabe an der regionalen Energieerzeugung zu ermöglichen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 119,
                "markierung": "setzen wir auf direkte Stromgutschriften"
              }
            },
            {
              "id": "mv-a065",
              "parteiId": "afd",
              "kurz": "Grundlastfähige Gaskraftwerke sollen ins Land geholt werden, verbunden mit einer Wiedereröffnung von Nord Stream. Als Option soll auch ein Wiedereinstieg in die Kernenergie offenstehen.",
              "original": "[…] bezahlbare Stromversorgung. Wir werden deshalb daran arbeiten, grundlastfähige Gaskraftwerke nach Mecklenburg-Vorpommern zu holen, die insbesondere in Verbindung mit einer Wiedereröffnung von Nord Stream unschlagbare Argumente für Investitionen in MV liefern können. Zusätzlich mit der Option eines Wiedereinstiegs in die Kernenergie könnte so zum Beispiel im Bereich Lubmin […] ein modernes Industrie-Cluster entstehen […]",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 17,
                "markierung": "grundlastfähige Gaskraftwerke nach Mecklenburg-Vorpommern zu holen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "mobilitaet",
      "titel": "Mobilität im Flächenland",
      "beschreibung": "Bus, Bahn, Straßen und Erreichbarkeit.",
      "fragen": [
        {
          "id": "mv-f019",
          "text": "Wie soll der Nahverkehr im Flächenland zugänglich werden?",
          "aussagen": [
            {
              "id": "mv-a056",
              "parteiId": "spd",
              "kurz": "Gästekarten sollen neben touristischen Vergünstigungen auch die kostenlose Nutzung des ÖPNV enthalten. Diese Angebote sollen innerhalb einer Destinationsregion gelten. Auch Bewohnerinnen und Bewohner sollen sie ohne Aufpreis nutzen können.",
              "original": "[…] Gästekarten, die neben zahlreichen Vergünstigungen für touristische Angebote vor Ort […] auch eine kostenlose Nutzung des ÖPNV beinhalten. Diese Angebote sollen innerhalb einer Destinationsregion […] auch den Bewohnerinnen und Bewohnern ohne Aufpreis zur Verf[ügung stehen].",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 11,
                "markierung": "auch eine kostenlose Nutzung des ÖPNV beinhalten"
              }
            },
            {
              "id": "mv-a067",
              "parteiId": "gruene",
              "kurz": "Ein Landesverkehrsplan soll Bus und Bahn im ganzen Land zuverlässig verzahnen, damit alle auch ohne Auto bezahlbar von A nach B kommen. Bei Baumaßnahmen sollen alle Verkehrsteilnehmenden gleichberechtigt berücksichtigt werden, um den Radverkehr sicherer zu machen.",
              "original": "[Wir setzen uns ein für die Aufstellung eines Landesverkehrsplans], der Bus und Bahn im ganzen Land zuverlässig miteinander verzahnt, damit alle auch ohne Auto bezahlbar von A nach B kommen. […] mehr Sicherheit für den Radverkehr: indem bei Baumaßnahmen alle Verkehrsteilnehmenden gleichberechtigt berücksichtigt werden.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 21,
                "markierung": "der Bus und Bahn im ganzen Land zuverlässig miteinander verzahnt"
              }
            },
            {
              "id": "mv-a013",
              "parteiId": "afd",
              "kurz": "Gemeinsam mit Landkreisen und lokalen Akteuren soll ein landesweites Verkehrsverbundsystem eingeführt werden. Dieses soll Kindern einen verlässlichen und unkomplizierten Schulweg ermöglichen. Ziel sind möglichst kurze Transportwege.",
              "original": "Zu diesem Zweck werden wir mit den Landkreisen, kreisfreien Städten und lokalen Akteuren im öffentlichen Nahverkehr darauf hinwirken, ein landesweites Verkehrsverbundsystem einzuführen, das unseren Kindern einen verlässlichen und unkomplizierten Schulweg ermöglicht.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 32,
                "markierung": "ein landesweites Verkehrsverbundsystem einzuführen"
              }
            },
            {
              "id": "mv-a038",
              "parteiId": "linke",
              "kurz": "Für alle unter 21 Jahren soll ein kostenfreier Nahverkehr eingeführt werden. Damit sollen Mobilität und gesellschaftliche Teilhabe unabhängig vom Geldbeutel gewährleistet werden.",
              "original": "Kostenfreien Nahverkehr für alle unter 21 Jahren einführen, um Mobilität und gesellschaftliche Teilhabe zu gewährleisten.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 12,
                "markierung": "Kostenfreien Nahverkehr für alle unter 21 Jahren einführen"
              }
            }
          ]
        },
        {
          "id": "mv-f021",
          "text": "Worauf kommt es bei der Verkehrsinfrastruktur an?",
          "aussagen": [
            {
              "id": "mv-a014",
              "parteiId": "cdu",
              "kurz": "Landesstraßen und Brücken sollen strategisch instand gehalten werden. Bahnstrecken sollen reaktiviert und flächendeckende, sichere Rad- und Fußwege geschaffen werden. Die Flughafennutzung soll bedarfsgerecht erfolgen.",
              "original": "[Wir wollen] flächendeckende, sichere Rad- und Fußwege, die Reaktivierung von Bahnstrecken, bedarfsgerechte Flughafennutzung sowie die strategische Instandhaltung von Landesstraßen und Brücken [– sie] erhöhen Mobilität und Sicherheit im Alltag.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 124,
                "markierung": "strategische Instandhaltung von Landesstraßen und Brücken"
              }
            },
            {
              "id": "mv-a033",
              "parteiId": "fdp",
              "kurz": "Im regionalen Schienenverkehr sollen die Züge zuverlässig und pünktlich fahren. Anzeigen an Bahnsteigen und in Apps müssten den Tatsachen entsprechen. Menschen und Güter sollen schnell, zuverlässig und ohne ideologische Bevormundung unterwegs sein.",
              "original": "[…] frei von ideologischer Bevormundung durch unser Land und in unser Land kommen können. Im regionalen Schienenverkehr sollen nach unseren Vorstellungen die Züge zuverlässig und pünktlich fahren. Die Anzeigen an Bahnsteigen und in den Apps müssen den Tatsachen en[tsprechen].",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 60,
                "markierung": "Im regionalen Schienenverkehr sollen nach unseren Vorstellungen die Züge zuverlässig und pünktlich fahren"
              }
            },
            {
              "id": "mv-a053",
              "parteiId": "bsw",
              "kurz": "Der öffentliche Nahverkehr soll gut erreichbar und barrierefrei ausgebaut werden. Bus und Bahn sollen besser vernetzt und getaktet werden, mit umstiegsarmen Verbindungen und ausreichend Haltestellen. Eine wohnortnahe Versorgung soll die Wege kurz halten.",
              "original": "[Wir wollen die Sicherung] kurzer Wege durch eine wohnortnahe Versorgungs- und Infrastruktur im ganzen Land. Ausbau eines gut erreichbaren und barrierefrei nutzbaren öffentlichen Personennahverkehrs, insbesondere durch bessere Vernetzung und Taktung von Bus und Bahn, umstiegsarme Verbindungen, ausreichende Haltestellen.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 18,
                "markierung": "Ausbau eines gut erreichbaren und barrierefrei nutzbaren öffentlichen Personennahverkehrs"
              }
            }
          ]
        },
        {
          "id": "mv-f025",
          "text": "Wie soll das Deutschlandticket weiterentwickelt werden?",
          "aussagen": [
            {
              "id": "mv-a073",
              "parteiId": "cdu",
              "kurz": "Das Deutschlandticket soll durch zusätzliche Busangebote auf dem Land ergänzt werden. Für junge Menschen bis 27 Jahre soll es nach dem Vorbild des Seniorentickets vergünstigt werden.",
              "original": "Wir sehen das Deutschland-Ticket als Chance, ergänzt durch ein zusätzliches Busangebot im ländlichen Raum, um Mobilität flächendeckend zu sichern. Gleichzeitig wollen wir ein vergünstigtes Deutschlandticket für junge Menschen bis 27 Jahren nach dem Vorbild des Seniorentickets umsetzen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 124,
                "markierung": "vergünstigtes Deutschlandticket für junge Menschen bis"
              }
            },
            {
              "id": "mv-a049",
              "parteiId": "fdp",
              "kurz": "Das Deutschlandticket soll mit einem zukunftsfesten Finanzierungskonzept erhalten bleiben. Das Land soll die notwendigen eigenen Zuschüsse leisten.",
              "original": "[…] uns für den Erhalt eines Deutschlandtickets mit einem zukunftsfesten Finanzierungskonzept einsetzen und die notwendigen landesseitigen Zuschüsse leisten.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 61,
                "markierung": "Erhalt eines Deutschlandtickets mit einem zukunftsfesten Finanzierungskonzept"
              }
            },
            {
              "id": "mv-a086",
              "parteiId": "gruene",
              "kurz": "Alle Kinder und Jugendlichen sollen Busse und Bahnen kostenfrei nutzen können, mit einem U27-Deutschlandticket. So sollen sie auch ohne Führerschein zu Sportverein, Freunden und Familie kommen.",
              "original": "Wir werden allen Kindern und Jugendlichen die Möglichkeit geben, kostenfrei den öffentlichen Nahverkehr zu nutzen, indem wir ein U27-Deutschlandticket für sie einführen. Damit sie nicht nur zur Schule, sondern auch zum Sportverein, den Freunden und der Familie kommen.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 4,
                "markierung": "indem wir ein U27-Deutschlandticket für sie einführen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "landwirtschaft",
      "titel": "Landwirtschaft und ländlicher Raum",
      "beschreibung": "Agrarstruktur, Bodenpreise, Ökologie und Wertschöpfung.",
      "fragen": [
        {
          "id": "mv-f002",
          "text": "Wie viel Freiheit sollen Betriebe bei der Bewirtschaftung haben?",
          "aussagen": [
            {
              "id": "mv-a021",
              "parteiId": "cdu",
              "kurz": "Statt Nutzungseinschränkungen und starrer Bio-Quoten sollen Betriebe Planungsperspektiven und Nutzungssicherheit erhalten. Bodenspekulationen sollen verhindert werden. Angestrebt wird eine langfristig ausgewogene Agrarstruktur.",
              "original": "Statt Nutzungseinschränkungen und starren Bio-Quoten wollen wir Planungsperspektiven und Nutzungssicherheit für Betriebe. Bodenspekulationen sollen verhindert werden. Die Sorge vor steigenden Boden- und Pachtpreisen nehmen wir ernst und setzen auf eine langfristig ausgewogene Agrarstruktur.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 86,
                "markierung": "Statt Nutzungseinschränkungen und starren Bio-Quoten wollen wir"
              }
            },
            {
              "id": "mv-a012",
              "parteiId": "gruene",
              "kurz": "Steigende Kosten, unsichere Preise und hohe bürokratische Anforderungen erschwerten den Alltag der Betriebe. Zugleich müsse Landwirtschaft klima- und naturverträglich werden. Ziel sind Existenzsicherung und ein ermöglichter Umbau.",
              "original": "2.4. Faire Landwirtschaft – Existenzsicherung und Umbau ermöglichen. […] Doch steigende Kosten, unsichere Preise und hohe bürokratische Anforderungen erschweren den Alltag der Betriebe.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 16,
                "markierung": "Faire Landwirtschaft - Existenzsicherung und Umbau ermöglichen"
              }
            },
            {
              "id": "mv-a020",
              "parteiId": "fdp",
              "kurz": "Angestrebt wird eine Agrarpolitik, die Landwirte nicht bevormundet, sondern Freiraum für unternehmerisches Handeln lässt. Rechtsform, Größe und Art der Bewirtschaftung sollen dabei keine Rolle spielen. Land- und Forstwirtschaft gelten als Motor des ländlichen Raums.",
              "original": "Wir Freie Demokraten setzen uns für eine Agrarpolitik ein, die Landwirte nicht bevormundet, sondern Freiraum für unternehmerisches Handeln lässt. Die Rechtsform, die Größe oder die Art der Bewirtschaft[ung] […].",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 22,
                "markierung": "eine Agrarpolitik ein, die Landwirte nicht bevormundet, sondern Freiraum für unternehmerisches Handeln lässt"
              }
            },
            {
              "id": "mv-a034",
              "parteiId": "afd",
              "kurz": "Die Landwirtschaft soll wertgeschätzt werden, geprägt von der jahrhundertealten Kulturlandschaft. Fischerei und Jagd werden als traditionsreiche Formen der Kulturlandschaftspflege begriffen, nicht als Relikte. Der ländliche Raum brauche mehr Freiheiten.",
              "original": "[Wir wollen eine Politik, die] Fischerei wie Jagd als traditionsreiche Formen der Kulturlandschaftspflege begreift und nicht als Relikte von gestern. Der ländliche Raum braucht mehr Freiheiten. Landwirtschaft wertschätzen […].",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 73,
                "markierung": "Der ländliche Raum braucht mehr Freiheiten"
              }
            }
          ]
        },
        {
          "id": "mv-f018",
          "text": "Wie soll der ländliche Raum wirtschaftlich gestärkt werden?",
          "aussagen": [
            {
              "id": "mv-a047",
              "parteiId": "spd",
              "kurz": "Die Zukunft der ländlichen Räume liegt im Aufbau regionaler Wertschöpfungsketten. Grundlage sind Rohstoffe aus Land-, Forst- und Teichwirtschaft sowie erneuerbare Energien. Die Menschen vor Ort sollen davon profitieren.",
              "original": "Die Zukunft der ländlichen Räume sehen wir im Aufbau regionaler Wertschöpfungsketten auf Basis der Rohstoffe aus der Land-, Forst- und Teichwirtschaft, den Erneuerbare[n] Energien und den Möglichkeiten, dass die Menschen vor Ort davon profitieren.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 82,
                "markierung": "im Aufbau regionaler Wertschöpfungsketten auf Basis der Rohstoffe aus der Land-, Forst- und Teichwirtschaft"
              }
            },
            {
              "id": "mv-a017",
              "parteiId": "linke",
              "kurz": "Die Rahmenbedingungen für die landwirtschaftliche Nutzung wiedervernässter Moore sollen verbessert werden. Gefordert wird zudem die Wiedervernässung landwirtschaftlich genutzter Moorstandorte bis 2045. Ein Strukturwandelgesetz soll betroffene Betriebe unterstützen.",
              "original": "[Wir fordern die Wiedervernässung der] landwirtschaftlich genutzten Moorstandorte bis 2045 sowie eine umfassende Finanzierung der dafür notwendigen Maßnahmen und Strukturen. • Die Rahmenbedingungen für die landwirtschaftliche Nutzung wiedervernässter Moore (Paludikultur) verbessern.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 22,
                "markierung": "Die Rahmenbedingungen für die landwirtschaftliche Nutzung wiedervernässter Moore (Paludikultur) verbessern"
              }
            },
            {
              "id": "mv-a043",
              "parteiId": "bsw",
              "kurz": "Die Landwirtschaft präge große Teile des Landes und sei wesentlich für regionale Wertschöpfung und Beschäftigung. Ihre Potenziale würden bislang nur unzureichend im Land weiterverarbeitet. Die Verarbeitung landwirtschaftlicher Erzeugnisse soll gezielt ausgebaut werden.",
              "original": "Eine zentrale Rolle spielt die Landwirtschaft. Sie prägt große Teile Mecklenburg-Vorpommerns und ist ein wesentlicher Faktor für regionale Wertschöpfung und Beschäftigung. Die Potenziale der landwirtschaftlichen Produktion werden bislang jedoch nur unzureichend im Land weiterverarbeitet.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 22,
                "markierung": "Die Potenziale der landwirtschaftlichen Produktion werden bislang jedoch nur unzureichend im Land weiterverarbeitet"
              }
            }
          ]
        },
        {
          "id": "mv-f023",
          "text": "Wie soll mit dem Wolf umgegangen werden?",
          "aussagen": [
            {
              "id": "mv-a088",
              "parteiId": "cdu",
              "kurz": "Die Wolfsbestände sollen reguliert werden. So soll vor allem die Weidetierhaltung besser als bisher geschützt werden.",
              "original": "Die Wolfsbestände werden wir regulieren und dadurch insbesondere die Weidetierhaltung wirksamer als bisher schützen.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 88,
                "markierung": "Wolfsbestände werden wir regulieren"
              }
            },
            {
              "id": "mv-a028",
              "parteiId": "bsw",
              "kurz": "Schäden durch Wolf und Biber sollen vollständig entschädigt, der Herdenschutz umfassend gefördert werden. Auffällige Wölfe sollen schnell entnommen werden, dazu soll es wolfsfreie Zonen geben.",
              "original": "Vollständige Entschädigung bei Schäden durch streng geschützte Tiere wie Wolf, Biber und Co. sowie umfassende Förderung des Herdenschutzes. Praxistaugliches Wolfsmanagement mit schneller Entnahme auffälliger Tiere und wolfsfreien Zonen.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 81,
                "markierung": "Praxistaugliches Wolfsmanagement mit schneller Entnahme auffälliger Tiere"
              }
            },
            {
              "id": "mv-a022",
              "parteiId": "linke",
              "kurz": "Für geschützte Arten wie Wolf und Biber sollen Managementpläne und ein Monitoring vorangebracht werden. Dazu sollen Biotope besser vernetzt und Gewässer renaturiert werden.",
              "original": "Biotopvernetzung stärken und vorrangig wassergebundene Ökosysteme renaturieren. Managementpläne und Monitoring für geschützte Arten, insbesondere für Wolf und Biber, voranbringen.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 22,
                "markierung": "Managementpläne und Monitoring für geschützte Arten"
              }
            },
            {
              "id": "mv-a039",
              "parteiId": "afd",
              "kurz": "Zurückkehrende Arten wie Wolf, Wisent und Elch sollen nach Möglichkeit Platz bekommen. Eine ungehinderte Ausbreitung in die genutzte Kulturlandschaft wird aber abgelehnt.",
              "original": "Zurückkehrenden Arten wie Wolf, Wisent und Elch muss nach Möglichkeit Platz geboten werden. Eine ungehinderte Ausbreitung in die vom Menschen geschaffene und genutzte Kulturlandschaft lehnen wir jedoch ab.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 77,
                "markierung": "Eine ungehinderte Ausbreitung in die vom Menschen geschaffene und genutzte Kulturlandschaft lehnen wir jedoch ab"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "wirtschaft",
      "titel": "Wirtschaft und Fachkräfte",
      "beschreibung": "Ansiedlung, Industrie und Arbeitsmarkt.",
      "fragen": [
        {
          "id": "mv-f008",
          "text": "Auf welche Branchen und Stärken soll das Land setzen?",
          "aussagen": [
            {
              "id": "mv-a089",
              "parteiId": "cdu",
              "kurz": "Gezielt soll moderne Industrie ins Land geholt werden, die wettbewerbsfähige Löhne zahlt. Das Land soll als verlässlicher und investorenfreundlicher Wirtschaftsstandort gestärkt werden. Dazu gehören klare Rahmenbedingungen und eine aktive Ansiedlungspolitik.",
              "original": "Deshalb machen wir neue, attraktive Jobs zur Chefsache: Wir holen gezielt moderne Industrie nach MV, die wettbewerbsfähige Löhne zahlt. […] Unser Ziel: Wir stärken Mecklenburg-Vorpommern als attraktiven, verlässlichen und investorenfreundlichen Wirtschaftsstandort mit klaren Rahmenbedingungen und aktiver Ansiedlungspolitik.",
              "quelle": {
                "datei": "data/programme/mv/cdu.pdf",
                "seite": 9,
                "markierung": "Deshalb machen wir neue, attraktive Jobs zur Chefsache: Wir holen gezielt moderne"
              }
            },
            {
              "id": "mv-a077",
              "parteiId": "spd",
              "kurz": "Bewährt habe sich die Strategie, einen Branchenmix zu stärken. Genannt werden Energiewirtschaft, maritime Industrie, Gesundheitswirtschaft, Landwirtschaft, Bioökonomie und Tourismus. Mit dem Tariftreuegesetz für öffentliche Aufträge sei gute Arbeit gestärkt worden.",
              "original": "[…] haben sich die Strategien der SPD-geführten Landesregierungen bewährt, einen Branchenmix aus Energiewirtschaft, maritimer Industrie, Gesundheitswirtschaft, Landwirtschaft und Bioökonomie sowie Tourismus zu stärken.",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 7,
                "markierung": "einen Branchenmix aus Energiewirtschaft, maritimer Industrie, Gesundheitswirtschaft"
              }
            },
            {
              "id": "mv-a070",
              "parteiId": "fdp",
              "kurz": "Große Chancen werden in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich gesehen. Auch in maritimer Wirtschaft, Landwirtschaft und technologiegestützten Wertschöpfungsketten könne das Land eine führende Rolle übernehmen. Die Voraussetzungen dafür seien gut.",
              "original": "Große Chancen liegen etwa in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich. Auch in der maritimen Wirtschaft, in der Landwirtschaft und in technologiegestützten Wertschöpfungsketten kann Mecklenburg-Vorpommern eine führende Rolle übernehmen.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 12,
                "markierung": "Große Chancen liegen etwa in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich"
              }
            }
          ]
        },
        {
          "id": "mv-f014",
          "text": "Was braucht die Wirtschaft neben Ansiedlung und Förderung?",
          "aussagen": [
            {
              "id": "mv-a030",
              "parteiId": "gruene",
              "kurz": "Für die Wirtschaft sollen die Grundlagen gesichert werden: leistungsfähige Infrastruktur, gute Bildung und verlässliche Gesundheitsversorgung. Hinzu kommt eine offene Gesellschaft, die Fachkräfte anzieht und hält. Ziel ist eine nachhaltig wachsende Wirtschaft.",
              "original": "Gleichzeitig sorgen wir für die Grundlagen, die Wirtschaft braucht: eine leistungsfähige Infrastruktur, gute Bildung, verlässliche Gesundheitsversorgung und eine offene Gesellschaft, die Fachkräfte anzieht und hält.",
              "quelle": {
                "datei": "data/programme/mv/gruene.pdf",
                "seite": 29,
                "markierung": "eine leistungsfähige Infrastruktur, gute Bildung, verlässliche Gesundheitsversorgung und eine offene Gesellschaft"
              }
            },
            {
              "id": "mv-a091",
              "parteiId": "afd",
              "kurz": "Reallabore, Unternehmen, Museen und Hochschulen sollen vor Ort vernetzt werden. Ausgerichtet wird dies auf die spezifischen Stärken des Landes. Genannt werden maritime Wirtschaft, Luft- und Raumfahrt, Landwirtschaftstechnik, Gesundheitswirtschaft und Lebensmittelindustrie.",
              "original": "[Wir wollen] Reallabore, Unternehmen, Museen und Hochschulen vor Ort vernetzen und auf die spezifischen Stärken MVs ausgerichtet sind: maritime Wirtschaft, Luft- und Raumfahrt, Landwirtschaftstechnik, Gesundheitswirtschaft und Lebensmittelindustrie.",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 30,
                "markierung": "auf die spezifischen Stärken MVs ausgerichtet sind: maritime Wirtschaft, Luft- und Raumfahrt"
              }
            },
            {
              "id": "mv-a062",
              "parteiId": "linke",
              "kurz": "Gute Arbeitsbedingungen, Mitbestimmung und tarifliche Absicherung gelten als Grundlage wirtschaftlicher Entwicklung. Das Tariftreuegesetz soll weiterentwickelt und Betriebs- und Personalräte gestärkt werden. Arbeitsschutzbehörden sollen aufgabengerecht mit Personal ausgestattet werden.",
              "original": "Gute Arbeitsbedingungen, Mitbestimmung und tarifliche Absicherung gehören ebenso dazu wie die Förderung von Innovation und nachhaltiger Wirtschaftsentwicklung. […] Wir wollen: […] Arbeitsschutzbehörden aufgabengerecht mit Personal ausstatten. Das Tariftreuegesetz weiterentwickeln, Betriebs- und Personalräte stärken und das Personalvertretungsgesetzes evaluieren.",
              "quelle": {
                "datei": "data/programme/mv/linke.pdf",
                "seite": 9,
                "markierung": "Das Tariftreuegesetz weiterentwickeln, Betriebs- und Personalräte stärken"
              }
            },
            {
              "id": "mv-a083",
              "parteiId": "bsw",
              "kurz": "Häfen, Flughäfen und Infrastruktur sollen vorrangig zivil genutzt werden. Pläne zur Einbindung von Infrastruktur wie Krankenhäusern und Straßen in kriegsvorbereitende Maßnahmen werden abgelehnt. Zivile Arbeitsplätze und industrielle Strukturen sollen erhalten bleiben.",
              "original": "• Häfen, Flughäfen und Infrastruktur sollen vorrangig zivil genutzt werden. Wir lehnen die Pläne zur Einbindung von Infrastruktur, wie Krankenhäuser und Straßen, in kriegsvorbereitende Maßnahmen grundsätzlich ab. • Erhalt ziviler Arbeitsplätze und industrieller Strukturen.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 7,
                "markierung": "Häfen, Flughäfen und Infrastruktur sollen vorrangig zivil genutzt werden"
              }
            }
          ]
        },
        {
          "id": "mv-f015",
          "text": "Soll das Tariftreue- und Vergabegesetz bleiben?",
          "aussagen": [
            {
              "id": "mv-a068",
              "parteiId": "afd",
              "kurz": "Das Tariftreue- und Vergabegesetz soll grundlegend überarbeitet, lohnpolitische Kriterien sollen aus dem Vergaberecht gestrichen werden. Aufträge sollen nach Qualität, Zuverlässigkeit und Wirtschaftlichkeit vergeben werden.",
              "original": "Das geltende Tariftreue- und Vergabegesetz Mecklenburg-Vorpommerns ist ein Bürokratiemonster, das kleine Unternehmen und Einzelunternehmer systematisch benachteiligt. […] Wir werden das Gesetz grundlegend überarbeiten und lohnpolitische Kriterien aus dem Vergaberecht streichen. Öffentliche Aufträge müssen nach Qualität, Zuverlässigkeit und Wirtschaftlichkeit vergeben werden […]",
              "quelle": {
                "datei": "data/programme/mv/afd.pdf",
                "seite": 13,
                "markierung": "lohnpolitische Kriterien aus dem Vergaberecht streichen"
              }
            },
            {
              "id": "mv-a079",
              "parteiId": "spd",
              "kurz": "Unternehmen sollen auch künftig nur dann öffentliche Aufträge erhalten, wenn sie Tariflöhne oder tarifgleiche Löhne zahlen. Das soll Beschäftigte und tariftreue Betriebe schützen.",
              "original": "Mit dem Tariftreue- und Vergabegesetz MV erhalten Unternehmen auch in Zukunft nur dann öffentliche Aufträge, wenn sie Tariflöhne oder tarifgleiche Löhne zahlen. Das ist gerecht für die Beschäftigten, macht Arbeiten in MV attraktiver und schützt Unternehmen, die heute […]",
              "quelle": {
                "datei": "data/programme/mv/spd.pdf",
                "seite": 3,
                "markierung": "erhalten Unternehmen auch in Zukunft nur dann öffentliche Aufträge"
              }
            },
            {
              "id": "mv-a052",
              "parteiId": "bsw",
              "kurz": "Öffentliche Aufträge und Fördermittel sollen an gute Arbeit gekoppelt werden. Tariftreue, faire Arbeitsbedingungen und klare Standards sollen Voraussetzung sein.",
              "original": "Öffentliche Aufträge und Fördermittel an gute Arbeit koppeln: Tariftreue, faire Arbeitsbedingungen und klare Standards müssen Voraussetzung sein.",
              "quelle": {
                "datei": "data/programme/mv/bsw.pdf",
                "seite": 19,
                "markierung": "Tariftreue, faire Arbeitsbedingungen und klare Standards müssen Voraussetzung sein"
              }
            },
            {
              "id": "mv-a094",
              "parteiId": "fdp",
              "kurz": "Das Vergaberecht soll radikal modernisiert und von allen vergabefremden Kriterien befreit werden. Ausgeschrieben werden soll erst ab den EU-Schwellenwerten.",
              "original": "Die 16 Bundesländer haben 16 verschiedene Vergabegesetze. Wir Freie Demokraten fordern daher eine radikale Modernisierung des Vergaberechtes unter Herauslösung aller vergabefremden Kriterien. Aufträge sollen nach unseren Plänen erst ab einem Auftragswert in Höhe der EU-Schwellenwerte von 216.000 € für Dienstleistungen und ab 5.404.000 € für Bauleistungen ausgeschrieben werden müssen und dem Vergaberecht unterliegen.",
              "quelle": {
                "datei": "data/programme/mv/fdp.pdf",
                "seite": 11,
                "markierung": "radikale Modernisierung des Vergaberechtes unter Herauslösung aller vergabefremden Kriterien"
              }
            }
          ]
        }
      ]
    }
  ]
}
);
