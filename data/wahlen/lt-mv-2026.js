/* Seite 47 – Datensatz: Landtagswahl Mecklenburg-Vorpommern (2026-09-20).
 * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/mv/.
 * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das
 * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).
 */
window.S47_DATA.register(
{
  "schemaVersion": 1,
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
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a028",
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
          "id": "mv-a036",
          "parteiId": "spd",
          "kurz": "Die Landespolizei wurde in den vergangenen Jahren personell, technisch und organisatorisch modernisiert. Dazu zählen zusätzliche Ausbildungskapazitäten und eine bessere Ausstattung. Die öffentliche Sicherheit sei damit weiter gefestigt worden.",
          "original": "In den vergangenen Jahren haben wir die öffentliche Sicherheit in Mecklenburg-Vorpommern weiter gefestigt. Die Landespolizei wurde personell, technisch und organisatorisch modernisiert – mit zusätzlichen Ausbildungskapazitäten, besserer Ausstattung sowie neuen Angeboten.",
          "quelle": {
            "datei": "data/programme/mv/spd.pdf",
            "seite": 45,
            "markierung": "Die Landespolizei wurde personell, technisch und organisatorisch modernisiert"
          }
        },
        {
          "id": "mv-a038",
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
          "id": "mv-a052",
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
          "id": "mv-a012",
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
          "parteiId": "linke",
          "kurz": "Alle Sicherheitsbefugnisse sollen kritisch auf die Einhaltung der Bürger- und Freiheitsrechte geprüft werden. Gefordert wird eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat. Zudem sollen Kontrollquittungen für Betroffene polizeilicher Maßnahmen eingeführt werden.",
          "original": "• Alle Sicherheitsbefugnisse kritisch auf Einhaltung der Bürger:innen- und Freiheitsrechte prüfen. […] • Eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat, Ressourcen und Befugnissen, um Fehlverhalten der Polizei effektiv zu verfolgen und aufzuklären.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 20,
            "markierung": "Eine von der Polizei unabhängige Beschwerdestelle mit ausreichendem Mandat"
          }
        },
        {
          "id": "mv-a018",
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
      "id": "zuwanderung",
      "titel": "Zuwanderung und Integration",
      "beschreibung": "Aufnahme, Rückführung, Sprache und Arbeitsmarkt.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a049",
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
          "id": "mv-a032",
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
          "id": "mv-a046",
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
          "id": "mv-a003",
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
          "id": "mv-a021",
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
          "id": "mv-a001",
          "parteiId": "linke",
          "kurz": "Lebensgefährliche Abschiebungen sollen beendet werden, besonders bei unbegleiteten minderjährigen Flüchtlingen. Die UN-Kinderrechtskonvention soll uneingeschränkt angewendet werden. Integration wird als wechselseitiger Prozess verstanden.",
          "original": "Integration ist ein wechselseitiger Prozess, der Unterstützung, Bildung und gesellschaftliche Offenheit erfordert. Wir wollen: • Lebensgefährliche Abschiebungen beenden, besonders für unbegleitete minderjährige Flüchtlinge sowie die UN-Kinderrechtskonvention uneingeschränkt anwenden.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 13,
            "markierung": "Lebensgefährliche Abschiebungen beenden, besonders für unbegleitete minderjährige Flüchtlinge"
          }
        },
        {
          "id": "mv-a013",
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
      "id": "schule",
      "titel": "Schule und Unterrichtsversorgung",
      "beschreibung": "Unterrichtsausfall, Lehrkräfte und Schulqualität.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a023",
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
          "id": "mv-a055",
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
          "id": "mv-a060",
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
          "id": "mv-a062",
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
          "id": "mv-a005",
          "parteiId": "afd",
          "kurz": "Eine jahrzehntelange Politik des kleinsten gemeinsamen Nenners habe sichtbare Schäden hinterlassen. Genannt werden ideologische Experimente, Unterrichtsausfall und überforderte Lehrkräfte. Schulabgänger seien weder ausbildungs- noch studierfähig.",
          "original": "Mecklenburg-Vorpommern hat eine jahrzehntelange Politik des kleinsten gemeinsamen Nenners, geprägt von ideologischen Experimenten, vernachlässigten pädagogischen Grundlagen, Unterrichtsausfall, sinkenden Leistungen, überforderten Lehrkräften und Schulabgängern, die weder ausbildungs- noch studierfähig sind, sichtbare Schäden hinterl[assen].",
          "quelle": {
            "datei": "data/programme/mv/afd.pdf",
            "seite": 23,
            "markierung": "vernachlässigten pädagogischen Grundlagen, Unterrichtsausfall, sinkenden Leistungen"
          }
        },
        {
          "id": "mv-a050",
          "parteiId": "linke",
          "kurz": "Gute Bildung entstehe dort, wo ausreichend Zeit, Unterstützung und verlässliche Strukturen vorhanden sind. Lehrkräfte könnten ihren Auftrag nur erfüllen, wenn sie entlastet werden. Schule brauche multiprofessionelle Unterstützung.",
          "original": "Gute Bildung durch mehr Personal: Gute Bildung entsteht dort, wo ausreichend Zeit, Unterstützung und verlässliche Strukturen vorhanden sind. Lehrkräfte können ihren Bildungsauftrag nur dann gut erfüllen, wenn sie entlastet werden.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 5,
            "markierung": "Lehrkräfte können ihren Bildungsauftrag nur dann gut erfüllen, wenn sie entlastet werden"
          }
        },
        {
          "id": "mv-a033",
          "parteiId": "bsw",
          "kurz": "Schulen brauchen Zeit, verlässliche Rahmenbedingungen und ausreichend Unterstützung. Überschaubare Klassen und engagierte Lehrkräfte machten Lernen wirksam und gerecht. Hinzu kommen ein verlässliches Unterstützungsnetzwerk und vielfältige Bildungsangebote.",
          "original": "Schulen brauchen Zeit, verlässliche Rahmenbedingungen und ausreichend Unterstützung. Überschaubare Klassen, engagierte Lehrkräfte, ein verlässliches Unterstützungsnetzwerk und vielfältige Bildungsangebote machen Lernen wirksam, gerecht und spannend.",
          "quelle": {
            "datei": "data/programme/mv/bsw.pdf",
            "seite": 46,
            "markierung": "Überschaubare Klassen, engagierte Lehrkräfte, ein verlässliches Unterstützungsnetzwerk"
          }
        }
      ]
    },
    {
      "id": "kita",
      "titel": "Frühkindliche Bildung und Kita",
      "beschreibung": "Betreuungsschlüssel, Qualität und Elternbeiträge.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a030",
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
          "id": "mv-a002",
          "parteiId": "spd",
          "kurz": "Mit beitragsfreien Kitas und besseren Bildungsangeboten sei das Land sozial gerechter geworden. Hinzu kamen gezielte Investitionen in Infrastruktur. Dieser Kurs steht für einen Aufschwung, von dem alle profitieren sollen.",
          "original": "Mit beitragsfreien Kitas, besseren Bildungsangeboten, gezielten Investitionen in Infrastruktur und einem starken Einsatz für gute Arbeit haben wir gezeigt: Aufschwu[ng ist möglich].",
          "quelle": {
            "datei": "data/programme/mv/spd.pdf",
            "seite": 2,
            "markierung": "Mit beitragsfreien Kitas, besseren Bildungsangeboten, gezielten Investitionen in Infrastruktur"
          }
        },
        {
          "id": "mv-a043",
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
          "id": "mv-a008",
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
          "id": "mv-a019",
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
          "id": "mv-a063",
          "parteiId": "linke",
          "kurz": "Frühkindliche Bildung entscheide maßgeblich über den weiteren Bildungsweg und sei Schlüssel für Chancengerechtigkeit. Mit dem Erhalt der Beitragsfreiheit seien wichtige Voraussetzungen geschaffen. Nötig seien zusätzlich Zeit für jedes Kind und bessere Rahmenbedingungen.",
          "original": "Frühkindliche Bildung entscheidet maßgeblich über den weiteren Bildungsweg und ist der Schlüssel für echte Chancengerechtigkeit. Mit dem Erhalt der Beitragsfreiheit haben wir wichtige Voraussetzungen geschaffen. Doch gute Bildung braucht mehr: Zeit für jedes Kind, bessere Rahmenbedingungen und gezielte Förd[erung].",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 5,
            "markierung": "Mit dem Erhalt der Beitragsfreiheit haben wir wichtige Voraussetzungen geschaffen"
          }
        },
        {
          "id": "mv-a057",
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
      "id": "gesundheit",
      "titel": "Gesundheit und Versorgung in der Fläche",
      "beschreibung": "Krankenhäuser, Hausärzte und Pflege im Flächenland.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a029",
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
          "id": "mv-a004",
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
          "id": "mv-a061",
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
          "id": "mv-a007",
          "parteiId": "fdp",
          "kurz": "Die Gesundheitsversorgung im ländlichen Raum soll gesichert werden. Der Bedarf an medizinischer Versorgung steige durch die demografische Entwicklung. Die bisherigen Strukturen stießen dabei an ihre Grenzen.",
          "original": "Gesundheitsversorgung im ländlichen Raum sichern: Mecklenburg-Vorpommern steht vor einer doppelten Herausforderung: Während der Bedarf an medizinischer Versorgung durch die demografische Entwicklung steigt, stoßen die bisherigen Strukturen an ihre Grenzen.",
          "quelle": {
            "datei": "data/programme/mv/fdp.pdf",
            "seite": 43,
            "markierung": "Gesundheitsversorgung im ländlichen Raum sichern"
          }
        },
        {
          "id": "mv-a058",
          "parteiId": "afd",
          "kurz": "Der Ärztemangel im ländlichen Raum sei real, auch wenn Statistiken ihn kleinrechneten. Krankenhäuser würden geschlossen, Kinder- und Geburtsstationen verschwänden aus der Fläche. Pflegekräfte arbeiteten am Limit.",
          "original": "Der Ärztemangel im ländlichen Raum ist real, auch wenn offizielle Statistiken ihn kleinrechnen. Krankenhäuser werden geschlossen, Kinder- und Geburtsstationen verschwinden aus der Fläche. Pflegekräfte arbeiten am Limit.",
          "quelle": {
            "datei": "data/programme/mv/afd.pdf",
            "seite": 58,
            "markierung": "Krankenhäuser werden geschlossen, Kinder- und Geburtsstationen verschwinden aus der Fläche"
          }
        },
        {
          "id": "mv-a027",
          "parteiId": "linke",
          "kurz": "Das „Schwester-Agnes“-Modell für arztentlastende Dienste im ländlichen Raum soll wieder aufleben. Gesundheitslotsen sollen Patientinnen und Versicherte begleiten. Die Vergütung im Praktischen Jahr soll auf ein existenzsicherndes Niveau angehoben werden.",
          "original": "• Das „Schwester-Agnes“ Modell für arztentlastende Dienste im ländlichen Raum wieder aufleben lassen. • Darauf hinwirken, dass Gesundheitslots:innen zum Einsatz kommen, die Patient:innen und Versicherte in allen relevanten Bereichen des Gesundheitswesens begleiten.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 19,
            "markierung": "Das „Schwester-Agnes“ Modell für arztentlastende Dienste im ländlichen Raum wieder aufleben lassen"
          }
        },
        {
          "id": "mv-a037",
          "parteiId": "bsw",
          "kurz": "Gesundheit sei keine Ware, sondern ein Grundrecht. Die Gesundheitsversorgung soll bezahlbar und wohnortnah gesichert werden. Sie müsse gut und erreichbar sein.",
          "original": "5.1. Gesundheitsversorgung: Gesundheitsversorgung bezahlbar und wohnortnah sichern. Gesundheit ist keine Ware, sondern ein Grundrecht. Eine gute, erreichbare und bezahlbare Gesundheitsverso[rgung …].",
          "quelle": {
            "datei": "data/programme/mv/bsw.pdf",
            "seite": 57,
            "markierung": "Gesundheitsversorgung bezahlbar und wohnortnah sichern"
          }
        }
      ]
    },
    {
      "id": "energie",
      "titel": "Energie und Windkraft",
      "beschreibung": "Ausbau der Erneuerbaren, Akzeptanz und Beteiligung.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a025",
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
          "id": "mv-a041",
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
          "id": "mv-a048",
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
          "id": "mv-a006",
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
          "id": "mv-a010",
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
          "id": "mv-a017",
          "parteiId": "linke",
          "kurz": "Die Offshore-Windenergie soll gestärkt werden. Zudem sollen neue Geschäftsfelder in der maritimen Industrie geprüft werden. Genannt wird etwa die Umrüstung der Binnenschifffahrtsflotte auf alternative Antriebe.",
          "original": "• Neue Geschäftsfelder in der maritimen Industrie prüfen, etwa die Umrüstung der Binnenschifffahrtsflotte auf alternative Antriebe. • Offshore-Windenergie stärken.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 10,
            "markierung": "Offshore-Windenergie stärken"
          }
        },
        {
          "id": "mv-a024",
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
      "id": "mobilitaet",
      "titel": "Mobilität im Flächenland",
      "beschreibung": "Bus, Bahn, Straßen und Erreichbarkeit.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a009",
          "parteiId": "cdu",
          "kurz": "Die Verkehrsinfrastruktur soll effizienter geplant werden. Synergien zwischen Straßen-, Schienen- und Nahverkehr sollen besser genutzt werden. Grundlage ist eine Strategie mit klarer politischer Steuerung.",
          "original": "[Wir wollen eine Strategie entwickeln], die eine klare politische Steuerung vorsieht. Wir wollen die Verkehrsinfrastruktur effizienter planen und Synergien zwischen Straßen-, Schienen- und Nahverkehr besser nutzen.",
          "quelle": {
            "datei": "data/programme/mv/cdu.pdf",
            "seite": 22,
            "markierung": "Wir wollen die Verkehrsinfrastruktur effizienter planen"
          }
        },
        {
          "id": "mv-a022",
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
          "id": "mv-a054",
          "parteiId": "gruene",
          "kurz": "Mobilität wird vom Alltag der Menschen her gedacht. Angestrebt wird eine klimafreundliche Verbindung von attraktivem ÖPNV und individueller Mobilität, ob mit Rad, zu Fuß oder im Auto. Erreichbarkeit soll unabhängig vom Wohnort bestehen.",
          "original": "Wir denken Mobilität in Mecklenburg-Vorpommern vom Alltag der Menschen her: Wir stehen für eine klimafreundliche Verbindung von attraktivem ÖPNV und individueller Mobilität, ob mit dem Rad, zu Fuß oder im (E-)Auto.",
          "quelle": {
            "datei": "data/programme/mv/gruene.pdf",
            "seite": 21,
            "markierung": "eine klimafreundliche Verbindung von attraktivem ÖPNV und individueller Mobilität"
          }
        },
        {
          "id": "mv-a044",
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
          "id": "mv-a014",
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
          "id": "mv-a011",
          "parteiId": "linke",
          "kurz": "Für alle unter 21 Jahren soll ein kostenfreier Nahverkehr eingeführt werden. Damit sollen Mobilität und gesellschaftliche Teilhabe gewährleistet werden. Zudem wird auf Bundesebene eine solidarische Gesundheits- und Pflegeversicherung angestrebt.",
          "original": "• Kostenfreien Nahverkehr für alle unter 21 Jahren einführen, um Mobilität und gesellschaftliche Teilhabe zu gewährleisten.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 12,
            "markierung": "Kostenfreien Nahverkehr für alle unter 21 Jahren einführen"
          }
        },
        {
          "id": "mv-a051",
          "parteiId": "bsw",
          "kurz": "Erwartet werden eine verlässliche Infrastruktur, gute Straßen und Brücken sowie gepflegte Bahnhöfe. Bus und Bahn sollen erreichbar und pünktlich sein. Genannt werden ebenso lebenswerte Städte und Dörfer und Sicherheit im Alltag.",
          "original": "Lebenswerte Städte und Dörfer, Sicherheit im Alltag, verlässliche Infrastruktur – gute Straßen und Brücken, gepflegte Bahnhöfe, Bus und Bahn, die erreichbar und pünktlich sind.",
          "quelle": {
            "datei": "data/programme/mv/bsw.pdf",
            "seite": 1,
            "markierung": "gute Straßen und Brücken, gepflegte Bahnhöfe, Bus und Bahn, die erreichbar und pünktlich sind"
          }
        }
      ]
    },
    {
      "id": "landwirtschaft",
      "titel": "Landwirtschaft und ländlicher Raum",
      "beschreibung": "Agrarstruktur, Bodenpreise, Ökologie und Wertschöpfung.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a020",
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
          "id": "mv-a056",
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
          "id": "mv-a039",
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
          "id": "mv-a035",
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
          "id": "mv-a015",
          "parteiId": "afd",
          "kurz": "Die Landwirtschaft soll wertgeschätzt werden, geprägt von der jahrhundertealten Kulturlandschaft. Fischerei und Jagd werden als traditionsreiche Formen der Kulturlandschaftspflege begriffen, nicht als Relikte. Der ländliche Raum brauche mehr Freiheiten.",
          "original": "[Wir wollen eine Politik, die] Fischerei wie Jagd als traditionsreiche Formen der Kulturlandschaftspflege begreift und nicht als Relikte von gestern. Der ländliche Raum braucht mehr Freiheiten. Landwirtschaft wertschätzen […].",
          "quelle": {
            "datei": "data/programme/mv/afd.pdf",
            "seite": 73,
            "markierung": "Der ländliche Raum braucht mehr Freiheiten"
          }
        },
        {
          "id": "mv-a045",
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
          "id": "mv-a059",
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
      "id": "wirtschaft",
      "titel": "Wirtschaft und Fachkräfte",
      "beschreibung": "Ansiedlung, Industrie und Arbeitsmarkt.",
      "frage": "Wie stehen Sie zu den folgenden Aussagen aus den Wahlprogrammen?",
      "aussagen": [
        {
          "id": "mv-a031",
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
          "id": "mv-a053",
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
          "id": "mv-a042",
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
          "id": "mv-a034",
          "parteiId": "fdp",
          "kurz": "Große Chancen werden in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich gesehen. Auch in maritimer Wirtschaft, Landwirtschaft und technologiegestützten Wertschöpfungsketten könne das Land eine führende Rolle übernehmen. Die Voraussetzungen dafür seien gut.",
          "original": "Große Chancen liegen etwa in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich. Auch in der maritimen Wirtschaft, in der Landwirtschaft und in technologiegestützten Wertschöpfungsketten kann Mecklenburg-Vorpommern eine führende Rolle übernehmen.",
          "quelle": {
            "datei": "data/programme/mv/fdp.pdf",
            "seite": 12,
            "markierung": "Große Chancen liegen etwa in Wasserstoff, Kernfusion und weiteren Zukunftstechnologien im Energiebereich"
          }
        },
        {
          "id": "mv-a040",
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
          "id": "mv-a026",
          "parteiId": "linke",
          "kurz": "Neue Geschäftsfelder in der maritimen Industrie sollen geprüft werden. Qualifizierte Fachkräfte gelten als Grundlage für den Erhalt der wirtschaftlichen Leistungsfähigkeit. Genannt wird etwa die Umrüstung der Binnenschifffahrtsflotte.",
          "original": "Fachkräftesicherung: Qualifizierte Fachkräfte sind die Grundlage für den Erhalt der wirtschaftlichen Leistungsfähigkeit.",
          "quelle": {
            "datei": "data/programme/mv/linke.pdf",
            "seite": 10,
            "markierung": "Qualifizierte Fachkräfte sind die Grundlage für den Erhalt der wirtschaftlichen Leistungsfähigkeit"
          }
        },
        {
          "id": "mv-a047",
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
    }
  ]
}
);
