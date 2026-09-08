/* Seite 47 – Datensatz: Landtagswahl Sachsen-Anhalt (2026-09-06).
 * Erzeugt aus den Wahlprogramm-PDFs unter data/programme/st/.
 * Schema 2: Themen enthalten Fragen mit 3–4 Aussagen verschiedener
 * Parteien; gewaehlt werden die beste und die schlechteste.
 * Nutzlast unten ist reines JSON; der Aufruf ringsherum erlaubt das
 * Laden per <script> auch unter file:// (dort ist fetch() gesperrt).
 */
window.S47_DATA.register(
{
  "schemaVersion": 2,
  "id": "lt-st-2026",
  "name": "Landtagswahl Sachsen-Anhalt",
  "region": "Sachsen-Anhalt",
  "wahltag": "2026-09-06",
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
        "titel": "Regierungsprogramm zur Landtagswahl am 6. September 2026",
        "datei": "data/programme/st/cdu.pdf",
        "url": "https://www.cdulsa.de/sites/www.cdulsa.de/files/downloads/regierungsprogramm_ltw_web.pdf"
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
        "titel": "Mit Herz, Haltung und Zuversicht. Wahlprogramm 2026",
        "datei": "data/programme/st/spd.pdf",
        "url": "https://spdsachsenanhalt.de/wp-content/uploads/sites/63/2026/03/SPD-Wahlprogramm-2026.pdf"
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
        "titel": "Nur mit Grün wird Zukunft draus. Programm zur Landtagswahl 2026",
        "datei": "data/programme/st/gruene.pdf",
        "url": "https://www.gruene-lsa.de/wp-content/uploads/2026/05/Programm-zur-Landtagswahl-2026.pdf"
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
        "titel": "Freiheit hat nur eine Heimat. Wahlprogramm zur Landtagswahl 2026",
        "datei": "data/programme/st/fdp.pdf",
        "url": "https://www.fdp-lsa.de/sites/default/files/2026-07/fdpwahlprogrammltw2026.pdf"
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
        "titel": "Das Land zuerst. Regierungsprogramm zur Landtagswahl 2026",
        "datei": "data/programme/st/afd.pdf",
        "url": "https://afd-lsa.de/wp-content/uploads/2026/07/AfD_Sachsen-Anhalt_Regierungsprogramm_2026_230726-web.pdf"
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
        "titel": "Wir sind der Pol der Hoffnung. Wahlprogramm zur Landtagswahl 2026",
        "datei": "data/programme/st/linke.pdf",
        "url": "https://www.dielinke-sachsen-anhalt.de/fileadmin/aaa_download_lsa/Parteitage/10._LPT_2._Tagung_VV_LTW_2026/Beschluesse/2026-03-19_Landtagswahlprogramm__final_.pdf"
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
        "titel": "Sachsen-Anhalt bleibt anders. Wahlprogramm zur Landtagswahl 2026",
        "datei": "data/programme/st/bsw.pdf",
        "url": "https://st.bsw-vg.de/wp-content/uploads/2026/04/BSW_Landtagswahlprogramm_SachsenAnhalt.pdf"
      }
    }
  ],
  "themen": [
    {
      "id": "sicherheit",
      "titel": "Innere Sicherheit und Polizei",
      "beschreibung": "Personal und Befugnisse der Polizei, Kontrolle und Prävention.",
      "fragen": [
        {
          "id": "st-f015",
          "text": "Wie soll die Polizei personell und materiell ausgestattet werden?",
          "aussagen": [
            {
              "id": "st-a022",
              "parteiId": "cdu",
              "kurz": "Die Landespolizei soll personell deutlich wachsen, auf weit mehr als 8.100 Bedienstete. Zugleich sollen ihre Kompetenzen und Befugnisse erweitert werden. Ziel ist eine sichtbare und handlungsfähige Polizei.",
              "original": "Spürbare Sicherheit: Sicherheit gewährleisten durch eine sichtbare und handlungsfähige Polizei, hierzu erweitern wir ihre Kompetenzen und Befugnisse. Wir wollen einen personellen Aufwuchs innerhalb der Landespolizei auf weit mehr als 8.100 Bedienstete.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 6,
                "markierung": "personellen Aufwuchs innerhalb der Landespolizei auf weit mehr als 8.100 Bedienstete"
              }
            },
            {
              "id": "st-a018",
              "parteiId": "gruene",
              "kurz": "Der Personalausbau im Polizeivollzug soll bis zur Zielgröße von 7.000 Stellen fortgesetzt werden. Zusätzlich soll die Polizeiverwaltung substanziell gestärkt werden. Polizeireviere sollen eigenständige Budgets erhalten.",
              "original": "Der Personalausbau bei den Vollzugsbeamt*innen soll konsequent bis zur Zielgröße von 7.000 Stellen fortgesetzt werden. Gleichzeitig ist eine substanzielle Stärkung der Polizeiverwaltung erforderlich. […] Zudem sollen eigenständige und verlässliche Budgets für die Polizeireviere umgesetzt werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 41,
                "markierung": "Der Personalausbau bei den Vollzugsbeamt*innen soll konsequent bis zur Zielgröße von 7.000 Stellen fortgesetzt werden"
              }
            },
            {
              "id": "st-a046",
              "parteiId": "fdp",
              "kurz": "Mehr sichtbare Polizei in Stadt und Land soll durch eine klare Aufgabentrennung nach Qualifikation entstehen. Dafür wird eine Laufbahn als Polizeiverwaltungsassistent geschaffen. So wird der Vollzugsdienst entlastet.",
              "original": "Wir sorgen für sichtbar mehr Polizei in Stadt und Land durch eine klare Aufgabentrennung nach Qualifikation. […] Wir setzen uns für die Schaffung einer Laufbahn als Polizeiverwaltungsassistenten ein. So wird der Vollzugsdienst konsequent entlastet.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 47,
                "markierung": "Wir sorgen für sichtbar mehr Polizei in Stadt und Land durch eine klare Aufgabentrennung nach Qualifikation"
              }
            },
            {
              "id": "st-a035",
              "parteiId": "bsw",
              "kurz": "Polizei und Ermittlungsbehörden sollen so ausgestattet werden, dass sie kriminellen Netzwerken auf Augenhöhe begegnen können. Der Schwerpunkt liegt auf der Bekämpfung organisierter Kriminalität. Eine Privatisierung von Sicherheitsaufgaben wird abgelehnt.",
              "original": "Wir wollen Polizei und Ermittlungsbehörden in Sachsen-Anhalt so ausstatten, dass sie auf Augenhöhe mit kriminellen Netzwerken und der Organisierten Kriminalität agieren können. […] Polizei als staatliche Kernaufgabe stärken, Privatisierung ablehnen.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 67,
                "markierung": "Polizei und Ermittlungsbehörden in Sachsen-Anhalt so ausstatten, dass sie auf Augenhöhe mit kriminellen Netzwerken"
              }
            }
          ]
        },
        {
          "id": "st-f011",
          "text": "Was braucht die Polizei über mehr Personal hinaus?",
          "aussagen": [
            {
              "id": "st-a017",
              "parteiId": "spd",
              "kurz": "Polizistinnen und Polizisten sollen von bürokratischen Aufgaben entlastet werden, um sich auf ihre Kernaufgaben zu konzentrieren. Das Beförderungsbudget wird deutlich verbessert, um den Beförderungsstau abzubauen. Dienststellen sollen baulich auf modernen Stand gebracht werden.",
              "original": "Bürokratische Belastungen werden reduziert, damit Polizistinnen und Polizisten sich auf ihre Kernaufgaben konzentrieren können. […] Deshalb wird das Beförderungsbudget deutlich verbessert, um den Stau abzubauen und verlässliche Perspektiven zu schaffen.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 29,
                "markierung": "Bürokratische Belastungen werden reduziert, damit Polizistinnen und Polizisten sich auf ihre Kernaufgaben konzentrieren können"
              }
            },
            {
              "id": "st-a058",
              "parteiId": "afd",
              "kurz": "Die Polizei soll mit Distanz-Elektro-Impulsgeräten ausgestattet werden. In vielen Lagen sei der Schusswaffengebrauch unverhältnismäßig, mildere Mittel wie Pfefferspray oder Schlagstock aber unzureichend.",
              "original": "In vielen Fällen der polizeilichen Praxis wäre der Schusswaffengebrauch unverhältnismäßig, mildere Mittel wie Pfefferspray oder Schlagstock aber unzureichend. Oft wäre dann ein Distanz-Elektro-Impulsgerät, landläufig auch „Elektroschocker“ oder „Taser“ genannt, das Mittel der Wahl.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 106,
                "markierung": "mildere Mittel wie Pfefferspray oder Schlagstock aber unzureichend"
              }
            },
            {
              "id": "st-a041",
              "parteiId": "linke",
              "kurz": "Sicherheitspolitik soll öffentlich beraten werden, mit Anhörungen zu Sicherheitsgesetzen und Bürgerforen zur Polizeiarbeit. Eine unabhängige Polizeibeschwerdestelle mit eigenen Ermittlungsbefugnissen soll eingerichtet werden. Polizeistatistiken sollen offengelegt werden.",
              "original": "Wir schaffen echte Bürger:innenbeteiligung bei sicherheitspolitischen Fragen: Öffentliche Anhörungen zu neuen Sicherheitsgesetzen, Bürger:innenforen zur Polizeiarbeit vor Ort […]. Ihre Rechte werden gestärkt durch eine unabhängige Polizeibeschwerdestelle mit eigenen Ermittlungsbefugnissen.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 128,
                "markierung": "eine unabhängige Polizeibeschwerdestelle mit eigenen Ermittlungsbefugnissen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "migration",
      "titel": "Migration und Integration",
      "beschreibung": "Aufnahme, Rückführung, Sprachförderung und Zugang zum Arbeitsmarkt.",
      "fragen": [
        {
          "id": "st-f005",
          "text": "Wie soll mit Menschen ohne Bleiberecht umgegangen werden?",
          "aussagen": [
            {
              "id": "st-a012",
              "parteiId": "cdu",
              "kurz": "Migration soll geordnet, begrenzt und gesteuert werden: Schutz für Berechtigte, konsequente Rückführung für alle ohne Bleiberecht. Die irreguläre Migration soll auf null zurückgeführt werden. Integration soll verlässlich geregelt sein.",
              "original": "Migration ordnen, begrenzen, steuern: Klare Regeln: Schutz für Berechtigte, konsequente Rückführung für alle ohne Bleiberecht, Missbrauch verhindern, Integration mit Verlässlichkeit. Wir wollen die irreguläre Migration auf null zurückführen.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 6,
                "markierung": "konsequente Rückführung für alle ohne Bleiberecht"
              }
            },
            {
              "id": "st-a051",
              "parteiId": "fdp",
              "kurz": "Der irregulären Migration soll mit aller Kraft entgegengewirkt werden, Ausreisepflichtige sollen das Land zügig verlassen. Aufenthaltstitel zur Beschäftigung sollen binnen vier Wochen erteilt werden. Sprachkurse sollen vorrangig Selbstzahlern angeboten werden.",
              "original": "Der irregulären Migration werden wir mit aller Kraft entgegenwirken. Ausreisepflichtige Ausländer müssen zügig das Land verlassen. […] Ziel ist es, dass Aufenthaltstitel, die zur Aufnahme einer Beschäftigung berechtigen, innerhalb von vier Wochen erteilt werden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 10,
                "markierung": "Der irregulären Migration werden wir mit aller Kraft entgegenwirken. Ausreisepflichtige Ausländer müssen zügig das Land verlassen"
              }
            },
            {
              "id": "st-a032",
              "parteiId": "afd",
              "kurz": "Ausreisepflichtige sollen konsequent abgeschoben und eine Abschiebeoffensive eingeleitet werden. Abschiebung sei Ländersache: 2024 seien 654 Personen abgeschoben worden, während 1.252 Abschiebungen scheiterten. Dafür sind 100 Millionen Euro vorgesehen.",
              "original": "Ausreisepflichtige konsequent abschieben – Abschiebeoffensive einleiten! Abschiebung ist Ländersache. Im Jahre 2024 wurden von der CDU-geführten Landesregierung lediglich 654 ausreisepflichtige Personen abgeschoben, während 1.252 Abschiebungen scheiterten. […] einen Betrag in Höhe von 100 Millionen Euro zur Einleitung einer Abschiebeoffensive für ausreisepflichtige Ausländer.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 43,
                "markierung": "Ausreisepflichtige konsequent abschieben"
              }
            },
            {
              "id": "st-a062",
              "parteiId": "bsw",
              "kurz": "Wer keinen Anspruch auf Asyl hat, bei Asylmissbrauch oder bei Straffälligkeit soll konsequent abgeschoben werden. Die einheimische Bevölkerung soll vor Überlastungstendenzen geschützt werden. Die Handlungsfähigkeit des Staates soll sichtbar sein.",
              "original": "Die einheimische Bevölkerung ist vor Überlastungstendenzen zu schützen. Die Handlungsfähigkeit des Staates muss glaubhaft und sichtbar sein. Dazu gehört auch die konsequente Abschiebung, wenn kein Anspruch auf Asyl besteht, Asylmissbrauch vorliegt oder Migranten straffällig werden.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 62,
                "markierung": "die konsequente Abschiebung, wenn kein Anspruch auf Asyl besteht"
              }
            }
          ]
        },
        {
          "id": "st-f017",
          "text": "Was soll denen geboten werden, die bleiben?",
          "aussagen": [
            {
              "id": "st-a004",
              "parteiId": "spd",
              "kurz": "Wer arbeitet, lernt oder eine Ausbildung absolviert, soll eine Bleibeperspektive erhalten. Freiwillige Rückkehr wird unterstützt, Abschiebungen bleiben letztes Mittel. Ordnung und Humanität sollen sich nicht ausschließen.",
              "original": "Menschen, die arbeiten, lernen oder eine Ausbildung absolvieren, sollen eine Bleibeperspektive haben. Freiwillige Rückkehr wird unterstützt. Abschiebungen bleiben die ultima ratio. Ordnung und Humanität schließen sich nicht aus.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 33,
                "markierung": "sollen eine Bleibeperspektive haben. Freiwillige Rückkehr wird unterstützt. Abschiebungen bleiben die ultima ratio"
              }
            },
            {
              "id": "st-a016",
              "parteiId": "gruene",
              "kurz": "Sprachkurse sollen ab dem ersten Tag zugänglich sein, nicht erst nach Anerkennung oder Verwaltungsverfahren. Dazu gehören flexible und berufsbegleitende Kursmodelle. Sprache gilt als Schlüssel zu Arbeit, Bildung und Alltag.",
              "original": "Sprache ist der Schlüssel zu allem: Arbeit, Bildung, Alltag, Begegnung. Deshalb sollen Sprachkurse ab dem ersten Tag zugänglich sein, nicht erst nach Anerkennung oder nach Verwaltungsverfahren. Dazu gehören flexible Kursmodelle, berufsbegleitende […] Angebote.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 78,
                "markierung": "Sprachkurse ab dem ersten Tag zugänglich sein, nicht erst nach Anerkennung"
              }
            },
            {
              "id": "st-a031",
              "parteiId": "linke",
              "kurz": "Sprachkurse sollen flächendeckend angeboten werden, auch im ländlichen Raum. Ausländische Qualifikationen sollen anerkannt, Familiennachzug ermöglicht werden. Ziel sind klare Regelungen und verlässliche Zusagen.",
              "original": "Das erreichen wir über klare Regelungen [und] verlässliche Zusagen, was flächendeckende Angebote an Sprachkursen, auch im ländlichen Raum, die Anerkennung von Qualifikationen und die Möglichkeit des Familiennachzuges angeht.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 97,
                "markierung": "flächendeckende Angebote an Sprachkursen, auch im ländlichen Raum, die Anerkennung von Qualifikationen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "schule",
      "titel": "Schule und Unterrichtsversorgung",
      "beschreibung": "Lehrkräfte, Unterrichtsausfall, Schulformen und Ganztag.",
      "fragen": [
        {
          "id": "st-f012",
          "text": "Wie soll dem Lehrkräftemangel und dem Unterrichtsausfall begegnet werden?",
          "aussagen": [
            {
              "id": "st-a056",
              "parteiId": "cdu",
              "kurz": "Um die Unterrichtsversorgung im ländlichen Raum zu sichern, sollen Lehrkräfte im Vorbereitungsdienst eine ergänzende Zulage erhalten. Leistungsorientierung wird mit Chancengleichheit verbunden. Schulentwicklung soll datengestützt erfolgen.",
              "original": "Personalentwicklung gestalten: Um die Unterrichtsversorgung im ländlichen Raum zu sichern, sollen Lehrkräfte im Vorbereitungsdienst eine ergänzende Zulage zu ihren Anwärterbezügen erhalten […]. Wir verbinden Leistungsorientierung mit Chancengleichheit.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 24,
                "markierung": "Um die Unterrichtsversorgung im ländlichen Raum zu sichern, sollen Lehrkräfte im Vorbereitungsdienst eine ergänzende Zulage"
              }
            },
            {
              "id": "st-a059",
              "parteiId": "spd",
              "kurz": "Ein umfassendes Programm soll die Unterrichtsversorgung absichern. Schulstandorte im ländlichen Raum sollen erhalten und weiterentwickelt werden. Flexible, schulbezogene Modelle sollen Bildung auch dort ermöglichen, wo die Schülerzahlen sinken.",
              "original": "Deshalb braucht es ein umfassendes Programm zur Absicherung der Unterrichtsversorgung. […] Schulstandorte im ländlichen Raum werden erhalten und weiterentwickelt. Flexible Modelle und schulbezogene Lösungen ermöglichen Bildung auch dort, wo Schülerzahlen sinken.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 18,
                "markierung": "ein umfassendes Programm zur Absicherung der Unterrichtsversorgung"
              }
            },
            {
              "id": "st-a045",
              "parteiId": "linke",
              "kurz": "Der Mangel an ausgebildeten Lehrkräften soll mit einem Zehn-Punkte-Plan für eine gute Unterrichtsversorgung behoben werden. Schulen sollen möglichst große Teile ihres Schulhaushalts selbst bewirtschaften. Ursache ist aus Sicht der Partei eine Fehleinschätzung des Ausbildungsbedarfs.",
              "original": "Wir wollen den Schulen möglichst große Teile ihres Schulhaushalts als Budget zur eigenen Bewirtschaftung zur Verfügung stellen. Ressourcen sichern: 10 Punkte für eine gute Unterrichtsversorgung. Der extreme Mangel an ausgebildeten Lehrkräften […].",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 33,
                "markierung": "Ressourcen sichern: 10 Punkte für eine gute Unterrichtsversorgung"
              }
            }
          ]
        },
        {
          "id": "st-f010",
          "text": "Welcher Umbau der Schule hat darüber hinaus Vorrang?",
          "aussagen": [
            {
              "id": "st-a048",
              "parteiId": "gruene",
              "kurz": "Alle allgemeinbildenden Schulen sollen zu Schulen mit Ganztagsangebot weiterentwickelt werden. Volkshochschulen, Musikschulen, Sportvereine und Ehrenamt sollen in den Ganztag eingebunden werden. Der Zugang soll möglichst kostenfrei sein.",
              "original": "Deshalb wollen wir alle allgemeinbildenden Schulen in Sachsen-Anhalt zu Schulen mit Ganztagsangebot weiterentwickeln und den Ausbau der Ganztagsangebote konsequent vorantreiben. Dabei sollen an allen Schulen Angebote von Volkshochschulen, Musikschulen, Sportvereinen sowie aus dem Ehrenamt in den Ganztag eingebunden werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 59,
                "markierung": "alle allgemeinbildenden Schulen in Sachsen-Anhalt zu Schulen mit Ganztagsangebot weiterentwickeln"
              }
            },
            {
              "id": "st-a013",
              "parteiId": "fdp",
              "kurz": "Alle Schulen sollen eine moderne digitale Infrastruktur mit passenden Geräten erhalten. Damit soll zeitgemäßes Lernen ermöglicht und Unterrichtsausfall gerade im ländlichen Raum vermieden werden. Zusätzlich wird in nachhaltige und barrierefreie Schulgebäude investiert.",
              "original": "Eine moderne digitale Infrastruktur soll nun durch eine entsprechende Struktur und Geräte in allen Schulen ergänzt werden, um zeitgemäßes Lernen zu ermöglichen und Unterrichtsausfall – gerade im ländlichen Raum – möglichst zu vermeiden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 23,
                "markierung": "um zeitgemäßes Lernen zu ermöglichen und Unterrichtsausfall"
              }
            },
            {
              "id": "st-a023",
              "parteiId": "afd",
              "kurz": "Angestrebt wird ein leistungsdifferenziertes, mehrgliedriges Schulsystem. Das Gymnasium soll gestärkt werden und wieder die Schulform sein, die höchstens 25 Prozent eines Jahrgangs besuchen. Die Wiedereinführung von Hauptschule und Realschule soll geprüft werden.",
              "original": "[Wir treten] für ein leistungsdifferenziertes, mehrgliedriges Schulsystem ein. Wir werden das Gymnasium stärken und wieder zu dem machen, was es war: Die Schulform, die zur Universität führt und von nicht mehr als 25 Prozent eines Jahrgangs besucht werden muss. Weiterhin werden wir die Wiedereinführung von Hauptschule und Realschule prüfen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 72,
                "markierung": "für ein leistungsdifferenziertes, mehrgliedriges Schulsystem ein"
              }
            },
            {
              "id": "st-a044",
              "parteiId": "bsw",
              "kurz": "Das gegliederte Schulsystem habe sich überlebt. Angestrebt wird längeres gemeinsames Lernen bis zur 8. Klasse. Die frühe Auswahl in der 4. Klasse benachteilige Kinder aus sozial schwächeren Haushalten.",
              "original": "Die frühzeitige Selektion in der 4. Klasse für den zukünftigen Schulweg steht dem entgegen und benachteiligt zudem Kinder aus sozial schwächeren Haushalten. […] Das gegliederte Schulsystem hat sich überlebt. […] Längeres gemeinsames Lernen bleibt ein wichtiges Ziel.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 45,
                "markierung": "Das gegliederte Schulsystem hat sich überlebt"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "kita",
      "titel": "Frühkindliche Bildung und Kita",
      "beschreibung": "Personalschlüssel, Betreuungsplätze und Elternbeiträge.",
      "fragen": [
        {
          "id": "st-f007",
          "text": "Wie soll der Personalschlüssel in den Kitas verbessert werden?",
          "aussagen": [
            {
              "id": "st-a055",
              "parteiId": "spd",
              "kurz": "Der tatsächliche Personalschlüssel in der Arbeit mit den Kindern soll schrittweise verbessert werden. Kitas mit besonderen sozialen Herausforderungen erhalten zusätzliche Unterstützung. Beitragsfreiheit bleibt das erklärte Ziel.",
              "original": "Der tatsächliche Personalschlüssel in der Arbeit mit den Kindern wird schrittweise verbessert. Kitas mit besonderen sozialen Herausforderungen erhalten zusätzliche Unterstützung. […] Beitragsfreiheit bleibt unser Ziel.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 28,
                "markierung": "Der tatsächliche Personalschlüssel in der Arbeit mit den Kindern wird schrittweise verbessert"
              }
            },
            {
              "id": "st-a024",
              "parteiId": "gruene",
              "kurz": "Der Mindestpersonalschlüssel in den Kitas soll angehoben werden. Die Sonderförderung für Kitas mit besonderen Bedarfen wird ausgebaut und die Kitasozialarbeit gefördert. Aus der mittelfristigen Lösung soll eine strukturelle Verbesserung werden.",
              "original": "Dafür wollen wir den Mindestpersonalschlüssel anheben, die zielgenaue Sonderförderung für Kitas mit besonderen Bedarfen ausbauen und insbesondere die Kitasozialarbeit fördern.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 57,
                "markierung": "wollen wir den Mindestpersonalschlüssel anheben"
              }
            },
            {
              "id": "st-a010",
              "parteiId": "fdp",
              "kurz": "Der Betreuungsschlüssel soll weiter angepasst werden, unter Einbezug der individuellen Kinderförderung. Auch Zeit für Vor- und Nachbereitung soll berücksichtigt werden. Kindertagesstätte, Hort und Grundschule sollen enger verzahnt werden.",
              "original": "Zudem fordern wir eine weitere Anpassung des Betreuungsschlüssels unter Einbezug der Erfordernisse der individuellen Kinderförderung sowie der notwendigen zeitlichen Kontingente für die Vor- und Nachbereitung.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 25,
                "markierung": "eine weitere Anpassung des Betreuungsschlüssels unter Einbezug der Erfordernisse der individuellen Kinderförderung"
              }
            },
            {
              "id": "st-a009",
              "parteiId": "bsw",
              "kurz": "In den Kitas fehlen aus Sicht der Partei Fachkräfte, Plätze und Zeit für pädagogische Arbeit. Schlechte Personalschlüssel machten frühkindliche Bildung zur bloßen Betreuung. Stattdessen sollen Grundlagen für Sprache, Mathematik und soziale Entwicklung gelegt werden.",
              "original": "In Kitas fehlen Fachkräfte, Plätze und Zeit für pädagogische Arbeit. Schlechte Personalschlüssel machen frühkindliche Bildung oft zur bloßen Betreuung, statt Grundlagen für Sprache, Mathematik und soziale Entwicklung zu legen.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 42,
                "markierung": "Schlechte Personalschlüssel machen frühkindliche Bildung oft zur bloßen Betreuung"
              }
            }
          ]
        },
        {
          "id": "st-f009",
          "text": "Wie soll die frühkindliche Betreuung finanziert und ausgebaut werden?",
          "aussagen": [
            {
              "id": "st-a030",
              "parteiId": "cdu",
              "kurz": "Das letzte Kita-Jahr soll gezielt als Vorschuljahr ausgestaltet werden. Ein belastbares Konzept soll den tatsächlichen Bedarf erfassen, die Finanzierung stabilisieren und den Personalschlüssel verbessern. Ein Runder Tisch soll Vorschläge zu Finanzierung und Personalgewinnung erarbeiten.",
              "original": "Das letzte Kita-Jahr zum Vorschuljahr ausbauen: Wir werden das letzte Kita-Jahr gezielt als Vorschuljahr ausgestalten. […] Wir werden ein belastbares Konzept vorlegen, das den tatsächlichen Bedarf realistisch erfasst, eine stabile Finanzierung gewährleistet und gleichzeitig den Personalschlüssel verbessert. […] Dazu werden wir einen Runden Tisch mit allen Beteiligten einrichten.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 49,
                "markierung": "Wir werden das letzte Kita-Jahr gezielt als Vorschuljahr ausgestalten"
              }
            },
            {
              "id": "st-a068",
              "parteiId": "afd",
              "kurz": "Krippen und Kindergärten sollen ab dem ersten Kind kostenlos werden, mit einer dauerhaft auf Landesebene gesicherten Finanzierung. Auch die Mittagsverpflegung soll für alle Kinder kostenfrei und von hoher Qualität sein.",
              "original": "Wir werden Krippen und Kindergärten mit einer dauerhaft auf Landesebene gesicherten Finanzierung ab dem ersten Kind kostenlos machen. Die Mittagsverpflegung muss für alle Kinder, von der Krippe bis zur Schule, ebenfalls kostenfrei und von hoher Qualität vorzuhalten sein.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 18,
                "markierung": "Krippen und Kindergärten mit einer dauerhaft auf Landesebene"
              }
            },
            {
              "id": "st-a020",
              "parteiId": "linke",
              "kurz": "In Schulen, Kitas, Schulsozialarbeit und Jugendhilfe soll dauerhaft und ausreichend investiert werden. Gefordert wird eine Abkehr von der Sparpolitik bei den Jüngsten. Bildungspolitik soll soziale Unterschiede aktiv ausgleichen.",
              "original": "Wir stehen für eine Abkehr von der „Rotstiftpolitik bei den Kleinen“: Wer von Zukunft redet, muss in Schulen, Kitas, Schulsozialarbeit, Jugendhilfe, Weiterbildung und digitale Infrastruktur dauerhaft und ausreichend investieren.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 27,
                "markierung": "muss in Schulen, Kitas, Schulsozialarbeit, Jugendhilfe, Weiterbildung und digitale Infrastruktur dauerhaft und ausreichend investieren"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "wirtschaft",
      "titel": "Wirtschaft und Bürokratie",
      "beschreibung": "Standort, Ansiedlung, Entlastung von Unternehmen.",
      "fragen": [
        {
          "id": "st-f020",
          "text": "Wie soll die Bürokratie für Betriebe verringert werden?",
          "aussagen": [
            {
              "id": "st-a026",
              "parteiId": "spd",
              "kurz": "Handwerk, Gewerbe und Mittelstand sollen nicht durch Bürokratie ausgebremst werden. Gesetze werden auf ihre Wirkung hin geprüft. Mitbestimmung in den Betrieben wird als Bestandteil einer fairen Wirtschaftsordnung gestärkt.",
              "original": "Mittelstand, Handwerk und Bürokratieabbau: Handwerk, Gewerbe und Mittelstand sichern Arbeitsplätze im ganzen Land. Bürokratie darf sie nicht ausbremsen. […] Mitbestimmung in den Betrieben ist ein zentraler Bestandteil einer fairen Wirtschaftsordnung und wird gestärkt.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 4,
                "markierung": "Handwerk, Gewerbe und Mittelstand sichern Arbeitsplätze im ganzen Land. Bürokratie darf sie nicht ausbremsen"
              }
            },
            {
              "id": "st-a060",
              "parteiId": "gruene",
              "kurz": "Dokumentations- und Berichtspflichten sollen reduziert und Verfahren durch klare Zuständigkeiten beschleunigt werden. Prozesse sollen digital und medienbruchfrei ablaufen. Im Bundesrat wird für ein reformiertes Vergaberecht mit regionalen Kriterien geworben.",
              "original": "Wir setzen uns außerdem im Bundesrat für ein reformiertes Bundesvergaberecht ein, das mehr regionale Kriterien berücksichtigt und Bürokratie abbaut. […] Wir wollen Bürokratie abbauen, Dokumentations- und Berichtspflichten sollen reduziert und Verfahren durch klare Zuständigkeiten sowie digitale, medienbruchfreie Prozesse […].",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 89,
                "markierung": "Dokumentations- und Berichtspflichten sollen reduziert und Verfahren durch klare Zuständigkeiten"
              }
            },
            {
              "id": "st-a047",
              "parteiId": "fdp",
              "kurz": "Die Bürokratielast soll spürbar gesenkt werden, damit Investitionen nicht in Verfahren stecken bleiben. Unternehmen sollen ihre Zeit in die Entwicklung ihrer Produkte statt in Zuständigkeiten investieren. Ziel ist ein Staat, der Leistung ermöglicht statt behindert.",
              "original": "Bürokratieabbau heißt am Ende: weniger Stillstand, mehr Tempo und ein Staat, der Leistung ermöglicht, statt sie behindert. Deshalb werden wir die Bürokratielast [senken].",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 7,
                "markierung": "ein Staat, der Leistung ermöglicht, statt sie behindert"
              }
            }
          ]
        },
        {
          "id": "st-f008",
          "text": "Wodurch soll das Land die heimische Wirtschaft darüber hinaus stärken?",
          "aussagen": [
            {
              "id": "st-a040",
              "parteiId": "cdu",
              "kurz": "Produktionsvorhaben für wichtige Medikamente sollen als strategische Projekte anerkannt werden. Dadurch sollen Genehmigungsverfahren beschleunigt und Fördermöglichkeiten verbessert werden. Ziel sind attraktive Rahmenbedingungen für Ansiedlungen.",
              "original": "Ziel ist es, Produktionsvorhaben für wichtige Medikamente als „strategische Projekte“ anerkennen zu lassen. Dadurch können Genehmigungsverfahren beschleunigt, Fördermöglichkeiten verbessert und beihilferechtliche Spielräume erweitert werden.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 13,
                "markierung": "Dadurch können Genehmigungsverfahren beschleunigt, Fördermöglichkeiten verbessert"
              }
            },
            {
              "id": "st-a015",
              "parteiId": "afd",
              "kurz": "Die Förderung soll sich auf kleine und mittelständische heimische Unternehmen richten statt auf die Ansiedlung und Subventionierung ausländischer Großkonzerne. Als Beispiel wird die geplante Intel-Ansiedlung genannt, für die zehn Milliarden Euro Subventionen vorgesehen waren.",
              "original": "Förderung des Mittelstands statt Subventionierung globalistischer Großkonzerne! […] Statt sich auf die Unterstützung heimischer Unternehmen zu fokussieren, konzentriert sie sich auf die Ansiedlung und Subventionierung ausländischer Großkonzerne. Nach den Plänen der Landesregierung […] sollten für die Intel-Ansiedlung Subventionen in Höhe von zehn Milliarden Euro fließen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 143,
                "markierung": "Statt sich auf die Unterstützung heimischer Unternehmen zu fokussieren"
              }
            },
            {
              "id": "st-a039",
              "parteiId": "linke",
              "kurz": "Die Tarifbindung soll wieder zur Regel werden, weil immer weniger Betriebe nach Tarif zahlen. Gefordert werden ein Vergabemindestlohn von 16,50 Euro je Stunde und ein konsequentes Vergabegesetz. Zudem soll die Allgemeinverbindlichkeit von Tarifverträgen erleichtert werden.",
              "original": "Wo Tarif gilt, geht es den Menschen besser. Doch immer weniger Betriebe zahlen ihn noch – das drückt Löhne und mindert Lebensqualität. Wir wollen die Tarifbindung wieder zur Regel machen. Dafür fordern wir: einen Vergabemindestlohn von 16,50 Euro pro Stunde […], die Einführung eines konsequenten Vergabegesetzes […], die Allgemeinverbindlichkeit von Tarifverträgen zu erleichtern.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 86,
                "markierung": "Wir wollen die Tarifbindung wieder zur Regel machen"
              }
            },
            {
              "id": "st-a006",
              "parteiId": "bsw",
              "kurz": "Für heimische und regional agierende Betriebe ist aus Sicht der Partei nicht der Kostendruck, sondern die schwache Binnennachfrage das Hauptproblem. Bürokratieabbau und Entlastungen seien wichtig, schafften aber keine Aufträge. Entscheidend sei, dass Geld in der Region zirkuliert.",
              "original": "Für die heimischen und regional agierenden Betriebe ist nicht der internationale Kostendruck das Hauptproblem, sondern die anhaltende Schwäche der Binnennachfrage. Echter Bürokratieabbau und Entlastungen sind wichtig, schaffen jedoch keine neuen Aufträge.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 18,
                "markierung": "Echter Bürokratieabbau und Entlastungen sind wichtig, schaffen jedoch keine neuen Aufträge"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "energie",
      "titel": "Energie und Windkraft",
      "beschreibung": "Ausbau erneuerbarer Energien, Netze und Akzeptanz vor Ort.",
      "fragen": [
        {
          "id": "st-f018",
          "text": "Wer soll darüber entscheiden, wo Windräder gebaut werden?",
          "aussagen": [
            {
              "id": "st-a064",
              "parteiId": "gruene",
              "kurz": "Am Flächenziel für den Ausbau erneuerbarer Energien wird konsequent festgehalten. Eignungsgebiete sollen über die Regionalplanung ausgewiesen werden, NATURA-2000-Gebiete bleiben ausgeschlossen. Der Windausbau gilt als Voraussetzung für lokalen grünen Wasserstoff.",
              "original": "Wir halten konsequent am Flächenziel für den Ausbau erneuerbarer Energien fest, um die Energiewende voranzutreiben. […] Der Ausbau der Windenergie ist die wichtige Voraussetzung zur Herstellung von lokalem Grünem Wasserstoff mit regionalen Elektrolyseuren.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 23,
                "markierung": "Wir halten konsequent am Flächenziel für den Ausbau erneuerbarer Energien fest"
              }
            },
            {
              "id": "st-a043",
              "parteiId": "fdp",
              "kurz": "Die Länder sollen einen deutlich größeren Entscheidungsspielraum beim Ausbau erneuerbarer Energien erhalten. Erfüllt ein Land bis 2027 sein Sektorenziel bei Windenergie an Land, soll die Flächenzielpflicht bis 2032 entfallen. Eigene Energiequellen sollen genutzt werden.",
              "original": "[Wir wollen den Bundesländern] einen deutlich größeren Entscheidungsspielraum beim Ausbau erneuerbarer Energien [geben]. Erfüllen Bundesländer bis 2027 das Sektorenziel in erzeugter Energiemenge durch Windenergieanlagen an Land, entfällt die Pflicht zur Erfüllung des für sie derzeit festgelegten Flächenziels bis 2032.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 14,
                "markierung": "entfällt die Pflicht zur Erfüllung des für sie derzeit festgelegten Flächenziels bis 2032"
              }
            },
            {
              "id": "st-a054",
              "parteiId": "afd",
              "kurz": "Das Gesetz zur Akzeptanzsteigerung beim Ausbau erneuerbarer Energien soll abgeschafft werden. Seine finanziellen Anreize seien geeignet, klamme Kommunen zur Zustimmung zu Windrädern und Solarparks zu nötigen. Bürgerinitiativen dagegen sollen unterstützt werden.",
              "original": "Akzeptanzgesetz abschaffen! In Sachsen-Anhalt leisten zahlreiche Bürgerinitiativen Widerstand gegen den Bau von Windrädern, Solarparks und Kabeltrassen. […] Die in dem Gesetz verankerten finanziellen Anreize sind geeignet, widerspenstige Kommunen zu erpressen. […] Nun sollen die klammen Kommunen durch monetäre Anreize dazu genötigt werden, dem Bau von Windrädern oder Solarparks zuzustimmen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 157,
                "markierung": "Nun sollen die klammen Kommunen durch monetäre Anreize dazu genötigt werden"
              }
            },
            {
              "id": "st-a008",
              "parteiId": "bsw",
              "kurz": "Windkraftanlagen leisten aus Sicht der Partei einen wichtigen Beitrag zur Stromversorgung. Ihr Ausbau müsse jedoch regional ausgewogen erfolgen und die Belange der Bevölkerung berücksichtigen. Durch Repowering bestehender Anlagen soll die Leistung gesteigert werden.",
              "original": "Windkraftanlagen leisten ebenfalls einen wichtigen Beitrag zur Stromversorgung. Ihr Ausbau muss jedoch regional ausgewogen erfolgen und die Belange der Bevölkerung berücksichtigen. Durch Repowering bestehender Windkraftanlagen kann ihre Leistung erheblich gesteigert werden.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 24,
                "markierung": "Ihr Ausbau muss jedoch regional ausgewogen erfolgen und die Belange der Bevölkerung berücksichtigen"
              }
            }
          ]
        },
        {
          "id": "st-f006",
          "text": "Wie sollen Kommunen und Anwohner am Ausbau beteiligt werden?",
          "aussagen": [
            {
              "id": "st-a002",
              "parteiId": "cdu",
              "kurz": "Erneuerbare Energien sollen technologieoffen genutzt und die Bürgerakzeptanz bei der Windkraft gesichert werden. Windenergieanlagen im Wald werden kritisch gesehen. Alle Anlagen sollen die Zustimmung der kommunalen Ebene brauchen.",
              "original": "Erneuerbare Energien technologieoffen nutzen und Bürgerakzeptanz bei der Windkraftnutzung sicherstellen […]. Wir stehen dem Errichten von Windenergieanlagen im Wald aufgrund seiner Multifunktionalität kritisch gegenüber. Alle Windenergieanlagen müssen stets die Zustimmung der kommunalen Ebene […].",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 45,
                "markierung": "Erneuerbare Energien technologieoffen nutzen und Bürgerakzeptanz bei der Windkraftnutzung sicherstellen"
              }
            },
            {
              "id": "st-a042",
              "parteiId": "spd",
              "kurz": "Für die Wärmewende soll auf Bürgerbeteiligung gesetzt werden. Energiegenossenschaften, Bürgerstrom und Energie-Sharing sollen gefördert werden. Das Land soll zugleich Standort für Windkraft, Wasserstoff und Batterietechnologien werden.",
              "original": "[Wir stärken das Land als Standort für Zukunftsindustrien] von erneuerbaren Energien wie Windkraft über Wasserstoff und Batterietechnologien bis zur digitalen Wirtschaft. Für eine erfolgreiche Wärmewende setzen wir auf Bürgerbeteiligung, Förderung von Energiegenossenschaften, Bürgerstrom und Energie-Sharing.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 5,
                "markierung": "setzen wir auf Bürgerbeteiligung, Förderung von Energiegenossenschaften"
              }
            },
            {
              "id": "st-a053",
              "parteiId": "linke",
              "kurz": "Der Ausbau erneuerbarer Energien braucht aus Sicht der Partei klare Leitplanken: Naturverträglichkeit, Transparenz und echte Beteiligung vor Ort. Kommunen sollen von Wind-, Solar- und Agri-PV-Projekten profitieren. Ökologische Standards sollen gesichert sein.",
              "original": "Doch der Ausbau der erneuerbaren Energien braucht klare Leitplanken: Naturverträglichkeit, Transparenz und echte Beteiligung der Menschen vor Ort. Wenn Windräder, Solaranlagen und Agri-PV-Projekte Landschaften prägen, müssen Kommunen davon profitieren und ökologische Standards gesichert sein.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 107,
                "markierung": "Naturverträglichkeit, Transparenz und echte Beteiligung der Menschen vor Ort"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "gesundheit",
      "titel": "Gesundheit und Krankenhäuser",
      "beschreibung": "Wohnortnahe Versorgung, Krankenhausstandorte, Pflege.",
      "fragen": [
        {
          "id": "st-f003",
          "text": "Wie sollen die Krankenhäuser im Land gesichert werden?",
          "aussagen": [
            {
              "id": "st-a029",
              "parteiId": "cdu",
              "kurz": "Krankenhäuser sollen klare Profile und Spezialisierungen erhalten und als Knotenpunkte in regionalen Versorgungsnetzwerken eng mit ambulanten Strukturen zusammenarbeiten. Die flächendeckende medizinische Versorgung soll als Kern der Daseinsvorsorge gesichert werden.",
              "original": "Krankenhäuser mit klaren Profilen, die eng mit ambulanten Strukturen zusammenarbeiten und als starke Knotenpunkte und Spezialisierung in regionalen Versorgungsnetzwerken verankert sind. […] Versorgung sichern – überall im Land: Wir sichern eine flächendeckende medizinische Versorgung als Kern der Daseinsvorsorge.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 27,
                "markierung": "Krankenhäuser mit klaren Profilen, die eng mit ambulanten Strukturen"
              }
            },
            {
              "id": "st-a033",
              "parteiId": "gruene",
              "kurz": "Die Krankenhäuser im Land sollen als Orte der Gesundheits- und Notfallversorgung erhalten bleiben. Alle Berufsgruppen im Gesundheits- und Pflegebereich sollen eigenverantwortlich mitarbeiten. Kommunen, Land und Selbstverwaltung sollen optimal zusammenwirken.",
              "original": "Krankenhausstandorte erhalten, Versorgungssicherheit gewährleisten: Die Krankenhäuser im Land müssen als Orte der Gesundheits- und Notfallversorgung erhalten werden. […] eigenverantwortliche Mitarbeit aller Professionen des Gesundheits- und Pflegebereichs.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 79,
                "markierung": "Die Krankenhäuser im Land müssen als Orte der Gesundheits- und Notfallversorgung erhalten"
              }
            },
            {
              "id": "st-a003",
              "parteiId": "linke",
              "kurz": "Krankenhäuser sollen nach Bedarf und Qualität finanziert werden statt nach Fallpauschalen. Gefordert werden integrierte Versorgungszentren in kommunaler Trägerschaft. Diese sollen ambulante, stationäre und Notfallleistungen aus einer Hand anbieten.",
              "original": "Wir wollen: eine Entökonomisierung: Krankenhäuser sollen nach Bedarf und Qualität finanziert und organisiert werden, nicht nach Fallpauschalen, Profit oder Kostendruck[;] integrierte Versorgungszentren in kommunaler Trägerschaft, die ambulante, stationäre und Notfallleistungen aus einer Hand anbieten.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 48,
                "markierung": "Krankenhäuser sollen nach Bedarf und Qualität finanziert und organisiert werden, nicht nach Fallpauschalen"
              }
            }
          ]
        },
        {
          "id": "st-f013",
          "text": "Wie soll die Versorgung in der Fläche erreichbar bleiben?",
          "aussagen": [
            {
              "id": "st-a027",
              "parteiId": "spd",
              "kurz": "An der Schulgeldfreiheit in den Gesundheitsberufen und an Ausbildungsvergütungen soll festgehalten werden. Gesundheitsberufe sollen mehr Verantwortung übernehmen, auch durch Aufgabenverlagerung zur Entlastung von Ärztinnen und Ärzten.",
              "original": "Deshalb setzen wir weiterhin auf die Schulgeldfreiheit in den Gesundheitsberufen und die Zahlung von Ausbildungsvergütungen. Wir unterstützen, dass Gesundheitsberufe künftig mehr Verantwortung u.a. durch Aufgabenverlagerung in der medizinischen Versorgung übernehmen – auch zur Entlastung von Ärztinnen und Ärzten.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 12,
                "markierung": "setzen wir weiterhin auf die Schulgeldfreiheit in den Gesundheitsberufen"
              }
            },
            {
              "id": "st-a007",
              "parteiId": "fdp",
              "kurz": "Über ein landesweites Förderprogramm sollen rollende Arztpraxen und spezialisierte Facharzt-Busse in infrastrukturell schwierigen Regionen eingeführt werden. Vor allem in der Kinder- und Jugendmedizin sowie der psychiatrischen Versorgung soll das lange Anfahrtswege ersparen.",
              "original": "Gesundheit vor Ort – Die mobile Versorgungsoffensive: Wir bringen die medizinische Versorgung zu den Menschen, die sie benötigen. Durch ein landesweites Förderprogramm etablieren wir „rollende Arztpraxen“ und spezialisierte Facharzt-Busse in infrastrukturell herausfordernden Regionen. Besonders in der Kinder- und Jugendmedizin sowie der psychiatrischen Versorgung schaffen wir so eine schnelle, wohnortnahe Behandlung ohne lange Anfahrtswege.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 59,
                "markierung": "etablieren wir „rollende Arztpraxen“ und spezialisierte Facharzt-Busse"
              }
            },
            {
              "id": "st-a037",
              "parteiId": "afd",
              "kurz": "Die Kapazitäten für Medizinstudenten an den Universitäten des Landes sollen um mindestens 20 Prozent ausgebaut werden. Universitäten sollen mehr Bewerber unabhängig vom Numerus clausus direkt annehmen. Zusätzlich ist ein Landarztstipendienprogramm vorgesehen.",
              "original": "In einem ersten Schritt werden wir die Kapazitäten für Medizinstudenten an den Universitäten des Landes ausbauen. Der Aufwuchs an Studienplätzen soll mindestens 20 Prozent betragen. Wir werden auch dafür Sorge tragen, dass unsere Universitäten unabhängig von dem bürokratischen […] Numerus-clausus-System mehr engagierte Studienbewerber direkt annehmen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 243,
                "markierung": "Der Aufwuchs an Studienplätzen soll mindestens 20 Prozent betragen"
              }
            },
            {
              "id": "st-a069",
              "parteiId": "bsw",
              "kurz": "Krankenhäuser sollen erhalten und Personal sowie Ausbildungsplätze ausgebaut werden. Die Gesundheitsversorgung soll als Daseinsvorsorge flächendeckend gesichert werden. Ein verbindliches Tariftreuegesetz soll die Bezahlung in Gesundheitsberufen stärken.",
              "original": "Gesundheitsversorgung als Daseinsvorsorge flächendeckend sichern • Pflege- und Gesundheitsberufe mit fairer Bezahlung durch die Einführung eines für alle Mitarbeiter von Krankenhäusern verbindlichen Tariftreuegesetzes stärken • Krankenhäuser erhalten und Personal sowie Ausbildungsplätze ausbauen",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 58,
                "markierung": "Krankenhäuser erhalten und Personal sowie Ausbildungsplätze ausbauen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "mobilitaet",
      "titel": "Mobilität und Nahverkehr",
      "beschreibung": "Busse, Bahnen, Straßen und Anbindung der Fläche.",
      "fragen": [
        {
          "id": "st-f001",
          "text": "Wie soll das Nahverkehrsangebot ausgebaut werden?",
          "aussagen": [
            {
              "id": "st-a070",
              "parteiId": "cdu",
              "kurz": "Straßen und Schienennetz sollen ausgebaut und modernisiert werden. Das Deutschlandticket soll erhalten und das ÖPNV-Angebot im ländlichen Raum ausgebaut werden. Auch der Radverkehr soll gestärkt werden.",
              "original": "Bezahlbare Mobilität in Stadt und Land: Ausbau und Modernisierung von Straßen und Schienennetz – Deutschlandticket erhalten – ÖPNV-Angebot im ländlichen Raum ausbauen – Radverkehr stärken und Alltagsradeln fördern.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 61,
                "markierung": "Deutschlandticket erhalten - ÖPNV-Angebot im ländlichen Raum ausbauen"
              }
            },
            {
              "id": "st-a065",
              "parteiId": "spd",
              "kurz": "Ein Deutschlandticket für alle Schülerinnen und Schüler soll die Mobilität im Alltag verbessern. Jugendliche sollen in die ÖPNV-Planung eingebunden werden, damit Taktung und Verbindungen passen. Ergänzend werden Ruf- und Nachtbussysteme ausgebaut.",
              "original": "Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag. Jugendliche sollen in die Planung des ÖPNV eingebunden werden, damit Taktung und Verbindungen ihren Lebensrealitäten entsprechen. Ergänzend werden moderne Ruf- und Nachtbussysteme ausgebaut.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 26,
                "markierung": "Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag"
              }
            },
            {
              "id": "st-a021",
              "parteiId": "gruene",
              "kurz": "Der öffentliche Nahverkehr soll umfassend ausgebaut werden. Busse und Bahnen sollen im ganzen Land durch Barrierefreiheit und niedrigere Kosten attraktiver werden. Ziel sind nachhaltige Mobilitätslösungen für alle.",
              "original": "Wir setzen uns für einen umfassenden Ausbau des öffentlichen Nahverkehrs ein und wollen Busse und Bahnen im ganzen Land durch Barrierefreiheit und Kostenreduzierungen attraktiver machen.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 27,
                "markierung": "Wir setzen uns für einen umfassenden Ausbau des öffentlichen Nahverkehrs ein"
              }
            },
            {
              "id": "st-a028",
              "parteiId": "afd",
              "kurz": "Der öffentliche Personennahverkehr soll als Ergänzung zum privaten Pkw weiter ausgebaut werden, nicht als dessen Ersatz. Fährverbindungen im ländlichen Raum sollen erhalten und ihre Finanzierung dem Land übertragen werden.",
              "original": "Gleichwohl werden wir, nicht als Ersatz, aber als sinnvolle Ergänzung zum privaten PKW, den öffentlichen Personen-Nahverkehr weiter ausbauen. […] Um die Fährverbindungen im Land langfristig zu erhalten, werden wir die Finanzierung insbesondere im ländlichen Raum durch Gesetzesänderungen dem Land übertragen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 200,
                "markierung": "als sinnvolle Ergänzung zum privaten PKW"
              }
            }
          ]
        },
        {
          "id": "st-f004",
          "text": "Worauf kommt es beim Nahverkehr über das Angebot hinaus an?",
          "aussagen": [
            {
              "id": "st-a067",
              "parteiId": "fdp",
              "kurz": "Die Pünktlichkeit im Schienenpersonennahverkehr soll gegenüber 2025 um 20 Prozent steigen. Die Zugausfälle sollen um 30 Prozent sinken. Zugleich sollen die Straßen gut ausgebaut sein.",
              "original": "Die Pünktlichkeit im Schienenpersonennahverkehr (SPNV) soll gegenüber dem Basisjahr 2025 um 20 Prozent steigen, die Zugausfälle sollen um 30 Prozent sinken. Die Straßen sollen gut ausgebaut sein.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 57,
                "markierung": "Die Pünktlichkeit im Schienenpersonennahverkehr (SPNV) soll gegenüber dem Basisjahr 2025 um 20 Prozent steigen"
              }
            },
            {
              "id": "st-a005",
              "parteiId": "linke",
              "kurz": "Gefordert wird ein verbindliches Ausbauprogramm für alle ÖPNV-Haltestellen. Dazu gehören taktile Leitsysteme, Blindenschrift an Fahrplanaushängen, akustische Ansagen und stufenloser Einstieg. Öffentlicher Nahverkehr soll für alle nutzbar sein.",
              "original": "Öffentlicher Nahverkehr für alle, das bedeutet ein verbindliches Ausbauprogramm für alle Haltestellen des ÖPNV mit taktilen Leitsystemen, Blindenschrift an Fahrplanaushängen, akustischen Ansagen und stufenlosem Einstieg.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 66,
                "markierung": "ein verbindliches Ausbauprogramm für alle Haltestellen des ÖPNV"
              }
            },
            {
              "id": "st-a066",
              "parteiId": "bsw",
              "kurz": "Weitere Zerschlagungen der Mobilitätsinfrastruktur werden abgelehnt. Zentrale Mobilitätsinfrastruktur soll in die öffentliche Hand zurückgeführt werden. Nötig sei eine langfristige, transparente und realistisch finanzierte Verkehrsplanung.",
              "original": "Das BSW Sachsen-Anhalt lehnt weitere Zerschlagungen ab und setzt sich für eine Rückführung zentraler Mobilitätsinfrastruktur in die öffentliche Hand ein. Eine nachhaltige Landesentwicklung braucht eine langfristige, transparente und realistisch finanzierte Verkehrsplanung.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 32,
                "markierung": "setzt sich für eine Rückführung zentraler Mobilitätsinfrastruktur in die öffentliche Hand ein"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "landwirtschaft",
      "titel": "Landwirtschaft und Boden",
      "beschreibung": "Agrarförderung, Bodenmarkt, Ökolandbau, ländlicher Raum.",
      "fragen": [
        {
          "id": "st-f019",
          "text": "Welche Art von Landwirtschaft soll das Land fördern?",
          "aussagen": [
            {
              "id": "st-a019",
              "parteiId": "gruene",
              "kurz": "Der Ökolandbau soll besser unterstützt und sein Flächenanteil deutlich erhöht werden. Dazu dienen verlässliche Ökoprämien und ein stärkerer Fokus in Ausbildung, Fachschule und Beratung. Auch die Lehr- und Versuchseinrichtungen des Landes sollen einbezogen werden.",
              "original": "[Der Ökolandbau] soll besser unterstützt und sein Flächenanteil soll deutlich erhöht werden – insbesondere durch verlässliche Ökoprämien und einen stärkeren Fokus auf den Ökolandbau in der Ausbildung, in der Fachschule, bei der Umstellung, bei der Beratung.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 15,
                "markierung": "sein Flächenanteil soll deutlich erhöht werden – insbesondere durch verlässliche Ökoprämien"
              }
            },
            {
              "id": "st-a034",
              "parteiId": "afd",
              "kurz": "Zwischen Bio-, Öko- und konventionellen Betrieben soll nicht unterschieden werden; alle sollen gerecht und ausgewogen unterstützt werden. Eine einseitige Bevorzugung bestimmter Betriebsformen wird abgelehnt. Lokale Erzeuger- und Vermarktungsstrukturen sollen einen erheblichen Anteil der Wirtschaftsförderung ausmachen.",
              "original": "Jede Form der Landwirtschaft fördern! Wir unterscheiden nicht zwischen Bio-, Öko- oder konventionellen Betrieben. Alle Landwirte leisten ihren Beitrag und sind daher gerecht und ausgewogen zu unterstützen. […] eine einseitige, ungerechtfertigte Bevorzugung bestimmter Betriebsformen, die den Wettbewerb verzerrt, lehnen wir ab. Die Förderung lokaler Erzeuger- und Vermarktungsstrukturen […] muss ein erheblicher Anteil der Wirtschaftsförderung werden.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 177,
                "markierung": "Wir unterscheiden nicht zwischen Bio-, Öko- oder konventionellen Betrieben"
              }
            },
            {
              "id": "st-a025",
              "parteiId": "bsw",
              "kurz": "Zur Sicherung der einheimischen Landwirtschaft werden Abnahmegarantien für regional erzeugte Produkte gefordert. Öffentliche Einrichtungen sollen vorrangig regionale Erzeugnisse beziehen. Landwirtschaftliche Belange sollen wieder ins gesellschaftliche Bewusstsein rücken.",
              "original": "Zur Sicherung der einheimischen Landwirtschaft setzt sich das BSW für Abnahmegarantien für landwirtschaftliche Produkte aus regionaler Erzeugung ein. Öffentliche Einrichtungen sollen vorrangig [regionale Produkte beziehen].",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 19,
                "markierung": "setzt sich das BSW für Abnahmegarantien für landwirtschaftliche Produkte aus regionaler Erzeugung ein"
              }
            },
            {
              "id": "st-a011",
              "parteiId": "spd",
              "kurz": "Die Förderhöhe in der Agrarpolitik soll beibehalten und die Mittel regional verteilt werden. Gemeinwohlleistungen der Landwirtschaft sollen honoriert werden. Entscheidungen über Flächen sollen ortsnah und fachlich fundiert fallen.",
              "original": "Öffentliche Agrarförderung gerecht ausgestalten, Gemeinwohl stärken: […] Die Beibehaltung der Förderhöhe ist unabdingbar, ebenso wie die Verteilung der Mittel auf regionaler Ebene. Gemeinwohlleistungen der Landwirtschaft – etwa für Umwelt [und] Klima […].",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 46,
                "markierung": "Die Beibehaltung der Förderhöhe ist unabdingbar, ebenso wie die Verteilung der Mittel auf regionaler Ebene"
              }
            }
          ]
        },
        {
          "id": "st-f014",
          "text": "Wodurch sollen landwirtschaftliche Betriebe wirtschaftlich abgesichert werden?",
          "aussagen": [
            {
              "id": "st-a061",
              "parteiId": "fdp",
              "kurz": "Landwirte sollen beim Grunderwerb nicht doppelt besteuert werden, Share Deals sollen verursachergerecht erfasst werden. Der Boden gilt als wichtigstes Produktionsmittel. Angestrebt wird eine nachhaltige Produktivitätssteigerung.",
              "original": "Fairness beim Grunderwerb: doppelte Besteuerung beenden, Share Deals verursachergerecht erfassen. Landwirte beim Grunderwerb doppelt zu besteuern, finden wir nicht fair. Das wichtigste Produktionsmittel für Landwirte ist der Boden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 15,
                "markierung": "Fairness beim Grunderwerb: doppelte Besteuerung beenden, Share Deals verursachergerecht erfassen"
              }
            },
            {
              "id": "st-a057",
              "parteiId": "linke",
              "kurz": "Ein Agrarstrukturgesetz soll Bodenpreise begrenzen und Landkonzentration verhindern. Share Deals beim Erwerb landwirtschaftlicher Betriebe sollen landesweit verboten werden. Die Privatisierung der BVVG-Flächen soll dauerhaft enden.",
              "original": "Wir wollen: ein Agrarstrukturgesetz für Sachsen-Anhalt, das Bodenpreise begrenzt und Landkonzentration verhindert, ein landesweites Verbot von Share Deals beim Erwerb landwirtschaftlicher Betriebe, die Privatisierung der BVVG-Flächen dauerhaft beenden.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 111,
                "markierung": "ein Agrarstrukturgesetz für Sachsen-Anhalt, das Bodenpreise begrenzt und Landkonzentration verhindert"
              }
            },
            {
              "id": "st-a014",
              "parteiId": "cdu",
              "kurz": "Die Inanspruchnahme landwirtschaftlicher Nutzflächen für Versiegelung, Industrieansiedlungen auf der grünen Wiese oder Zersiedelung soll deutlich begrenzt werden. Die Bodenmarktreserve des Landes von 20.000 Hektar soll erhalten bleiben.",
              "original": "Landwirtschaftliche Nutzflächen wirksam schützen: Die Inanspruchnahme landwirtschaftlicher Nutzflächen für andere Zwecke – etwa Versiegelung, Industrieansiedlungen auf der „grünen Wiese“, Zersiedelung oder Ausgleichsmaßnahmen – wollen wir deutlich begrenzen. […] Die Bodenmarktreserve des Landes von 20.000 ha werden wir erhalten.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 39,
                "markierung": "Die Bodenmarktreserve des Landes von 20.000 ha werden wir erhalten"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "verwaltung",
      "titel": "Verwaltung und Digitalisierung",
      "beschreibung": "Behördenleistungen, Personal und digitale Verfahren.",
      "fragen": [
        {
          "id": "st-f002",
          "text": "Wie soll die Verwaltung digitalisiert werden?",
          "aussagen": [
            {
              "id": "st-a050",
              "parteiId": "cdu",
              "kurz": "Erfolgreiche Modellprojekte für digitalisierte Verwaltungsprozesse sollen zentral finanziert und standardisiert werden. So sollen erprobte Lösungen in die Fläche kommen. Kritische IT-Systeme sollen auf Open-Source-Software umgestellt werden.",
              "original": "Digitale Verwaltung ausbauen: Erfolgreiche Modellprojekte für digitalisierte Verwaltungsprozesse werden zentral finanziert und standardisiert, um erprobte Lösungen [zu verbreiten]. […] Die Umstellung kritischer IT-Systeme auf Open-Source Software sichert eine langfristige Arbeitsfähigkeit.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 52,
                "markierung": "Erfolgreiche Modellprojekte für digitalisierte Verwaltungsprozesse werden zentral finanziert und standardisiert"
              }
            },
            {
              "id": "st-a001",
              "parteiId": "spd",
              "kurz": "Digitale Lösungen sollen zentral entwickelt und bereitgestellt werden, um Kommunen zu entlasten. Bewährte Lösungen aus anderen Bundesländern sollen übernommen werden. Ziel sind besserer Service, schnellere Verfahren und mehr Transparenz.",
              "original": "[Lösungen sollen] zentral entwickelt und bereitgestellt werden, um Kommunen bei der Umsetzung zu entlasten. Digital etablierte Lösungen sind aus anderen Bundesländern zu übernehmen. Digitale Verwaltung dient nicht der Technik um ihrer selbst willen, sondern besserem Service, schnelleren Verfahren und mehr Transparenz.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 50,
                "markierung": "Digital etablierte Lösungen sind aus anderen Bundesländern zu übernehmen"
              }
            },
            {
              "id": "st-a063",
              "parteiId": "gruene",
              "kurz": "Die digitale Verwaltung soll aus Sicht der Nutzenden gedacht und gestaltet werden. Alle Verwaltungsdienstleistungen sollen über einen zentralen Zugang erreichbar sein. Verfahren sollen medienbruchfrei ablaufen.",
              "original": "Die digitale Verwaltung muss aus Sicht der Nutzenden gedacht und gestaltet werden. Alle Verwaltungsdienstleistungen sollen über einen zentralen Zugang erreichbar sein.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 89,
                "markierung": "Alle Verwaltungsdienstleistungen sollen über einen zentralen Zugang erreichbar se"
              }
            },
            {
              "id": "st-a036",
              "parteiId": "bsw",
              "kurz": "Digitale Behördengänge sollen für Bürger und Unternehmen einfacher, schneller und nachvollziehbarer werden. Digitale Serviceangebote sollen weiter ausgebaut werden. Digitalisierung soll dabei ein Angebot bleiben und kein Zwang werden.",
              "original": "Digitalisierung muss ein Angebot sein, kein Zwang. Digitale Behördengänge sollen für Bürger sowie Unternehmen einfacher, schneller und nachvollziehbarer werden. Wir wollen den weiteren Ausbau digitaler Serviceangebote […].",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 74,
                "markierung": "Digitalisierung muss ein Angebot sein, kein Zwang"
              }
            }
          ]
        },
        {
          "id": "st-f016",
          "text": "Wie soll der Staat schlanker und einfacher werden?",
          "aussagen": [
            {
              "id": "st-a038",
              "parteiId": "fdp",
              "kurz": "Digitalisierung soll bessere Services, weniger Wege und schnellere Entscheidungen bringen. Der Abbau von Bürokratie soll gemessen und über die Zeit sichtbar gemacht werden. Entbürokratisierung wird damit zum politischen Gradmesser.",
              "original": "So wird Entbürokratisierung zum politischen Gradmesser: Jede Regierung muss daran erkennbar liefern. Digitale Verwaltung ohne Umwege: Digitalisierung ist dann gut, wenn sie Freiheit schafft: bessere Services, weniger Wege, weniger Papier, schnellere Entscheidungen.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 44,
                "markierung": "Digitalisierung ist dann gut, wenn sie Freiheit schafft: bessere Services, weniger Wege"
              }
            },
            {
              "id": "st-a052",
              "parteiId": "afd",
              "kurz": "Die Ausgaben in Ministerien und Verwaltung sollen pauschal um mindestens zehn Prozent gekürzt werden; die Bürokratiekosten seien in zehn Jahren um über 60 Prozent gestiegen. Kommunalverwaltungen sollen gesetzlich auf die örtliche Daseinsvorsorge beschränkt werden.",
              "original": "Die Kommunalverwaltungen im Land sind gesetzlich auf die örtliche Daseinsvorsorge zu beschränken. […] Ausgaben in Ministerien und Verwaltung kürzen! Die Kosten für die Bürokratie sind in den letzten zehn Jahren um über 60 Prozent explodiert […]. Deshalb fordern wir eine pauschale Ausgabenkürzung von mindestens 10 Prozent.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 211,
                "markierung": "Die Kosten für die Bürokratie sind in den letzten zehn Jahren um über 60 Prozent explodiert"
              }
            },
            {
              "id": "st-a049",
              "parteiId": "linke",
              "kurz": "Statt Behörden-Dschungel sollen One-Stop-Shops mit klaren Zuständigkeiten geschaffen werden. Verwaltungen sollen gemeinsam die besten Verfahren erarbeiten. Damit sollen Abläufe für alle einfacher werden.",
              "original": "Statt Behörden-Dschungel und unklaren Verantwortlichkeiten, können „OneStop-Shops“ und damit klare Zuständigkeiten geschaffen werden.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 98,
                "markierung": "„OneStop-Shops“ und damit klare Zuständigkeiten"
              }
            }
          ]
        }
      ]
    }
  ]
}
);
