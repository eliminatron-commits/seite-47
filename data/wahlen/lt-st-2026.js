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
      "logo": "assets/logos/cdu.svg",
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
      "logo": "assets/logos/spd.svg",
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
      "logo": "assets/logos/gruene.svg",
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
      "logo": "assets/logos/fdp.svg",
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
      "logo": "assets/logos/afd.svg",
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
      "logo": "assets/logos/linke.svg",
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
      "logo": "assets/logos/bsw.svg",
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
          "id": "st-f021",
          "text": "Wie soll die Polizei personell und materiell ausgestattet werden?",
          "aussagen": [
            {
              "id": "st-a037",
              "parteiId": "cdu",
              "kurz": "Die Landespolizei soll auf weit mehr als 8.100 Bedienstete wachsen. Zugleich sollen ihre Befugnisse erweitert werden.",
              "original": "Spürbare Sicherheit: Sicherheit gewährleisten durch eine sichtbare und handlungsfähige Polizei, hierzu erweitern wir ihre Kompetenzen und Befugnisse. Wir wollen einen personellen Aufwuchs innerhalb der Landespolizei auf weit mehr als 8.100 Bedienstete.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 6,
                "markierung": "personellen Aufwuchs innerhalb der Landespolizei auf weit mehr als 8.100 Bedienstete"
              }
            },
            {
              "id": "st-a059",
              "parteiId": "gruene",
              "kurz": "Der Personalausbau im Vollzug soll bis zur Zielgröße von 7.000 Stellen laufen. Auch die Polizeiverwaltung wird gestärkt.",
              "original": "Der Personalausbau bei den Vollzugsbeamt*innen soll konsequent bis zur Zielgröße von 7.000 Stellen fortgesetzt werden. Gleichzeitig ist eine substanzielle Stärkung der Polizeiverwaltung erforderlich. […] Zudem sollen eigenständige und verlässliche Budgets für die Polizeireviere umgesetzt werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 41,
                "markierung": "Der Personalausbau bei den Vollzugsbeamt*innen soll konsequent bis zur Zielgröße von 7.000 Stellen fortgesetzt werden"
              }
            },
            {
              "id": "st-a019",
              "parteiId": "fdp",
              "kurz": "Mehr sichtbare Polizei soll durch klare Aufgabentrennung entstehen. Eine neue Verwaltungslaufbahn entlastet den Vollzug.",
              "original": "Wir sorgen für sichtbar mehr Polizei in Stadt und Land durch eine klare Aufgabentrennung nach Qualifikation. […] Wir setzen uns für die Schaffung einer Laufbahn als Polizeiverwaltungsassistenten ein. So wird der Vollzugsdienst konsequent entlastet.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 47,
                "markierung": "Wir sorgen für sichtbar mehr Polizei in Stadt und Land durch eine klare Aufgabentrennung nach Qualifikation"
              }
            },
            {
              "id": "st-a061",
              "parteiId": "bsw",
              "kurz": "Polizei und Ermittlungsbehörden sollen organisierter Kriminalität auf Augenhöhe begegnen. Sicherheit bleibt staatliche Aufgabe.",
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
          "id": "st-f008",
          "text": "Was braucht die Polizei über mehr Personal hinaus?",
          "aussagen": [
            {
              "id": "st-a086",
              "parteiId": "spd",
              "kurz": "Polizisten sollen von Bürokratie entlastet werden. Das Beförderungsbudget steigt, Dienststellen werden baulich erneuert.",
              "original": "Bürokratische Belastungen werden reduziert, damit Polizistinnen und Polizisten sich auf ihre Kernaufgaben konzentrieren können. […] Deshalb wird das Beförderungsbudget deutlich verbessert, um den Stau abzubauen und verlässliche Perspektiven zu schaffen.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 29,
                "markierung": "Bürokratische Belastungen werden reduziert, damit Polizistinnen und Polizisten sich auf ihre Kernaufgaben konzentrieren können"
              }
            },
            {
              "id": "st-a045",
              "parteiId": "afd",
              "kurz": "Die Polizei soll Distanz-Elektro-Impulsgeräte erhalten. Schusswaffen seien oft unverhältnismäßig, mildere Mittel zu schwach.",
              "original": "In vielen Fällen der polizeilichen Praxis wäre der Schusswaffengebrauch unverhältnismäßig, mildere Mittel wie Pfefferspray oder Schlagstock aber unzureichend. Oft wäre dann ein Distanz-Elektro-Impulsgerät, landläufig auch „Elektroschocker“ oder „Taser“ genannt, das Mittel der Wahl.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 106,
                "markierung": "mildere Mittel wie Pfefferspray oder Schlagstock aber unzureichend"
              }
            },
            {
              "id": "st-a104",
              "parteiId": "linke",
              "kurz": "Eine unabhängige Beschwerdestelle mit eigenen Ermittlungsbefugnissen soll entstehen. Polizeistatistiken werden offengelegt.",
              "original": "Wir schaffen echte Bürger:innenbeteiligung bei sicherheitspolitischen Fragen: Öffentliche Anhörungen zu neuen Sicherheitsgesetzen, Bürger:innenforen zur Polizeiarbeit vor Ort […]. Ihre Rechte werden gestärkt durch eine unabhängige Polizeibeschwerdestelle mit eigenen Ermittlungsbefugnissen.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 128,
                "markierung": "eine unabhängige Polizeibeschwerdestelle mit eigenen Ermittlungsbefugnissen"
              }
            }
          ]
        },
        {
          "id": "st-f003",
          "text": "Wie sollen Taser und Bodycams bei der Polizei eingesetzt werden?",
          "aussagen": [
            {
              "id": "st-a054",
              "parteiId": "cdu",
              "kurz": "Die Polizei soll Taser bekommen und Bodycams konsequent nutzen; landesweit soll KI-gestützter Videoschutz möglich werden.",
              "original": "Moderne Einsatzkräfte und starken Schutz: Sicherheit für jene, die für unsere Sicherheit sorgen. Beste Ausstattung für Polizei, Feuerwehren und Rettungsdienste, in Stadt und Land. Ausstattung unserer Polizei mit Tasern, konsequenter Einsatz von Bodycams. Technologie für Ihre Sicherheit: KI-gestützten intelligenten Videoschutz landesweit ermöglichen […]",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 6,
                "markierung": "Ausstattung unserer Polizei mit Tasern, konsequenter Einsatz von Bodycams"
              }
            },
            {
              "id": "st-a106",
              "parteiId": "gruene",
              "kurz": "Taser sollen nur letztes Mittel der Deeskalation sein; Vorrang hat die Zusammenarbeit mit psychosozialer Hilfe.",
              "original": "Es braucht eine eindeutige Definition des polizeilichen Aufgabenfeldes, insbesondere im Umgang mit Menschen in psychischen Ausnahmesituationen, bei denen ein ganzheitliches Konzept erforderlich ist. Der Einsatz von Tasern kann dabei lediglich eine der letzten Möglichkeiten der Deeskalation sein. Notwendig ist vielmehr eine bessere Verzahnung der beteiligten Akteur*innen zwischen Gefahrenabwehr, psychosozialer Unterstützung und dem Schutz vor Eigengefährdung.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 42,
                "markierung": "Der Einsatz von Tasern kann dabei lediglich eine der letzten Möglichkeiten der Deeskalation sein"
              }
            },
            {
              "id": "st-a076",
              "parteiId": "linke",
              "kurz": "Polizeikräfte sollen gekennzeichnet werden, Bodycams sich bei Schusswaffen- und Tasereinsatz automatisch einschalten.",
              "original": "Eine demokratische Polizei hat nichts zu verbergen. Die individuelle Kennzeichnungspflicht und der automatische Einsatz von Bodycams beim Schusswaffengebrauch oder beim Einsatz von Tasern schützen Bürger:innen ebenso wie Polizeikräfte vor falschen Anschuldigungen.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 129,
                "markierung": "Die individuelle Kennzeichnungspflicht und der automatische Einsatz von Bodycams"
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
          "id": "st-f001",
          "text": "Wie soll mit Menschen ohne Bleiberecht umgegangen werden?",
          "aussagen": [
            {
              "id": "st-a013",
              "parteiId": "cdu",
              "kurz": "Migration soll geordnet und begrenzt werden: Schutz für Berechtigte, konsequente Rückführung für alle ohne Bleiberecht.",
              "original": "Migration ordnen, begrenzen, steuern: Klare Regeln: Schutz für Berechtigte, konsequente Rückführung für alle ohne Bleiberecht, Missbrauch verhindern, Integration mit Verlässlichkeit. Wir wollen die irreguläre Migration auf null zurückführen.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 6,
                "markierung": "konsequente Rückführung für alle ohne Bleiberecht"
              }
            },
            {
              "id": "st-a097",
              "parteiId": "fdp",
              "kurz": "Der irregulären Migration soll entgegengewirkt werden. Wer ausreisepflichtig ist, soll das Land zügig verlassen.",
              "original": "Der irregulären Migration werden wir mit aller Kraft entgegenwirken. Ausreisepflichtige Ausländer müssen zügig das Land verlassen. […] Ziel ist es, dass Aufenthaltstitel, die zur Aufnahme einer Beschäftigung berechtigen, innerhalb von vier Wochen erteilt werden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 10,
                "markierung": "Der irregulären Migration werden wir mit aller Kraft entgegenwirken. Ausreisepflichtige Ausländer müssen zügig das Land verlassen"
              }
            },
            {
              "id": "st-a016",
              "parteiId": "afd",
              "kurz": "Ausreisepflichtige sollen konsequent abgeschoben werden; dafür sind 100 Millionen Euro und eine Abschiebeoffensive vorgesehen.",
              "original": "Ausreisepflichtige konsequent abschieben – Abschiebeoffensive einleiten! Abschiebung ist Ländersache. Im Jahre 2024 wurden von der CDU-geführten Landesregierung lediglich 654 ausreisepflichtige Personen abgeschoben, während 1.252 Abschiebungen scheiterten. […] einen Betrag in Höhe von 100 Millionen Euro zur Einleitung einer Abschiebeoffensive für ausreisepflichtige Ausländer.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 43,
                "markierung": "Ausreisepflichtige konsequent abschieben"
              }
            },
            {
              "id": "st-a048",
              "parteiId": "bsw",
              "kurz": "Wer keinen Anspruch auf Asyl hat oder straffällig wird, soll konsequent abgeschoben werden. Der Staat soll handlungsfähig sein.",
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
          "id": "st-f011",
          "text": "Was soll denen geboten werden, die bleiben?",
          "aussagen": [
            {
              "id": "st-a098",
              "parteiId": "spd",
              "kurz": "Wer arbeitet, lernt oder eine Ausbildung macht, soll eine Bleibeperspektive bekommen. Abschiebungen bleiben letztes Mittel.",
              "original": "Menschen, die arbeiten, lernen oder eine Ausbildung absolvieren, sollen eine Bleibeperspektive haben. Freiwillige Rückkehr wird unterstützt. Abschiebungen bleiben die ultima ratio. Ordnung und Humanität schließen sich nicht aus.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 33,
                "markierung": "sollen eine Bleibeperspektive haben. Freiwillige Rückkehr wird unterstützt. Abschiebungen bleiben die ultima ratio"
              }
            },
            {
              "id": "st-a070",
              "parteiId": "gruene",
              "kurz": "Sprachkurse sollen vom ersten Tag an offenstehen, nicht erst nach der Anerkennung – auch berufsbegleitend und flexibel.",
              "original": "Sprache ist der Schlüssel zu allem: Arbeit, Bildung, Alltag, Begegnung. Deshalb sollen Sprachkurse ab dem ersten Tag zugänglich sein, nicht erst nach Anerkennung oder nach Verwaltungsverfahren. Dazu gehören flexible Kursmodelle, berufsbegleitende […] Angebote.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 78,
                "markierung": "Sprachkurse ab dem ersten Tag zugänglich sein, nicht erst nach Anerkennung"
              }
            },
            {
              "id": "st-a047",
              "parteiId": "linke",
              "kurz": "Sprachkurse sollen flächendeckend angeboten, ausländische Abschlüsse anerkannt und Familiennachzug ermöglicht werden.",
              "original": "Das erreichen wir über klare Regelungen [und] verlässliche Zusagen, was flächendeckende Angebote an Sprachkursen, auch im ländlichen Raum, die Anerkennung von Qualifikationen und die Möglichkeit des Familiennachzuges angeht.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 97,
                "markierung": "flächendeckende Angebote an Sprachkursen, auch im ländlichen Raum, die Anerkennung von Qualifikationen"
              }
            }
          ]
        },
        {
          "id": "st-f020",
          "text": "Sollen Geflüchtete ihre Leistungen per Bezahlkarte statt als Geld erhalten?",
          "aussagen": [
            {
              "id": "st-a032",
              "parteiId": "cdu",
              "kurz": "Die Bezahlkarte soll dauerhaft abgesichert und weiterentwickelt werden, samt beschleunigter Verfahren.",
              "original": "Leistungsfähige Ausländerbehörden, beschleunigte Verfahren, eine zentrale Erstaufnahme und wirksame Instrumente wie die Bezahlkarte sichern wir dauerhaft ab und entwickeln sie gezielt weiter.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 8,
                "markierung": "wirksame Instrumente wie die Bezahlkarte sichern wir dauerhaft ab"
              }
            },
            {
              "id": "st-a069",
              "parteiId": "gruene",
              "kurz": "Die Bezahlkarte soll abgeschafft werden; Sozialleistungen sollen ohne Unterschied als Geld ausgezahlt werden.",
              "original": "Wir fordern die Abschaffung der Bezahlkarte und wollen diese diskriminierende Praxis endgültig beenden. Sozialleistungen müssen unterschiedslos als Geldleistungen ausgezahlt werden, damit alle Menschen frei über ihre Mittel verfügen können.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 79,
                "markierung": "Wir fordern die Abschaffung der Bezahlkarte"
              }
            },
            {
              "id": "st-a033",
              "parteiId": "linke",
              "kurz": "Die Bezahlkarte soll durch ein Basiskonto ersetzt werden, das Geflüchtete selbstständig führen können.",
              "original": "Selbständige Kontoführung: Die diskriminierende Bezahlkarte wird durch ein verpflichtendes Basiskonto ersetzt.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 98,
                "markierung": "Die diskriminierende Bezahlkarte wird durch ein verpflichtendes Basiskonto ersetzt"
              }
            },
            {
              "id": "st-a007",
              "parteiId": "afd",
              "kurz": "Asylbewerber sollen Sachleistungen statt Geld erhalten; Zahlungen ins Ausland sollen unterbunden werden.",
              "original": "Eine AfD-geführte Landesregierung wird das Sachleistungsprinzip im Einklang mit dem Asylbewerberleistungsgesetz konsequent anwenden, um finanzielle Fehlanreize für illegale Zuwanderer zu unterbinden. Außerdem werden – sofern nötig und möglich – über die Bezahlkarte hinaus Möglichkeiten geprüft werden, um Auslandszahlungen von „Flüchtlingen“ bzw. Asylanten zu unterbinden.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 35,
                "markierung": "Sachleistungsprinzip im Einklang mit dem Asylbewerberleistungsgesetz konsequent anwenden"
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
          "id": "st-f022",
          "text": "Wie soll dem Lehrkräftemangel und dem Unterrichtsausfall begegnet werden?",
          "aussagen": [
            {
              "id": "st-a095",
              "parteiId": "cdu",
              "kurz": "Lehrkräfte im Vorbereitungsdienst sollen eine Zulage erhalten, um die Unterrichtsversorgung auf dem Land zu sichern.",
              "original": "Personalentwicklung gestalten: Um die Unterrichtsversorgung im ländlichen Raum zu sichern, sollen Lehrkräfte im Vorbereitungsdienst eine ergänzende Zulage zu ihren Anwärterbezügen erhalten […]. Wir verbinden Leistungsorientierung mit Chancengleichheit.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 24,
                "markierung": "Um die Unterrichtsversorgung im ländlichen Raum zu sichern, sollen Lehrkräfte im Vorbereitungsdienst eine ergänzende Zulage"
              }
            },
            {
              "id": "st-a024",
              "parteiId": "spd",
              "kurz": "Ein Programm soll die Unterrichtsversorgung absichern. Schulstandorte im ländlichen Raum sollen erhalten bleiben.",
              "original": "Deshalb braucht es ein umfassendes Programm zur Absicherung der Unterrichtsversorgung. […] Schulstandorte im ländlichen Raum werden erhalten und weiterentwickelt. Flexible Modelle und schulbezogene Lösungen ermöglichen Bildung auch dort, wo Schülerzahlen sinken.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 18,
                "markierung": "ein umfassendes Programm zur Absicherung der Unterrichtsversorgung"
              }
            },
            {
              "id": "st-a040",
              "parteiId": "linke",
              "kurz": "Ein Zehn-Punkte-Plan soll den Lehrkräftemangel beheben. Schulen sollen ihren Haushalt weitgehend selbst bewirtschaften.",
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
          "id": "st-f019",
          "text": "Welcher Umbau der Schule hat darüber hinaus Vorrang?",
          "aussagen": [
            {
              "id": "st-a062",
              "parteiId": "gruene",
              "kurz": "Alle allgemeinbildenden Schulen sollen Ganztagsangebote bekommen, möglichst kostenfrei und mit Vereinen und Musikschulen.",
              "original": "Deshalb wollen wir alle allgemeinbildenden Schulen in Sachsen-Anhalt zu Schulen mit Ganztagsangebot weiterentwickeln und den Ausbau der Ganztagsangebote konsequent vorantreiben. Dabei sollen an allen Schulen Angebote von Volkshochschulen, Musikschulen, Sportvereinen sowie aus dem Ehrenamt in den Ganztag eingebunden werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 59,
                "markierung": "alle allgemeinbildenden Schulen in Sachsen-Anhalt zu Schulen mit Ganztagsangebot weiterentwickeln"
              }
            },
            {
              "id": "st-a044",
              "parteiId": "fdp",
              "kurz": "Alle Schulen sollen moderne digitale Technik und passende Geräte erhalten, dazu barrierefreie und nachhaltige Gebäude.",
              "original": "Eine moderne digitale Infrastruktur soll nun durch eine entsprechende Struktur und Geräte in allen Schulen ergänzt werden, um zeitgemäßes Lernen zu ermöglichen und Unterrichtsausfall – gerade im ländlichen Raum – möglichst zu vermeiden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 23,
                "markierung": "um zeitgemäßes Lernen zu ermöglichen und Unterrichtsausfall"
              }
            },
            {
              "id": "st-a010",
              "parteiId": "afd",
              "kurz": "Angestrebt wird ein leistungsdifferenziertes, mehrgliedriges Schulsystem mit starkem Gymnasium für höchstens 25 Prozent.",
              "original": "[Wir treten] für ein leistungsdifferenziertes, mehrgliedriges Schulsystem ein. Wir werden das Gymnasium stärken und wieder zu dem machen, was es war: Die Schulform, die zur Universität führt und von nicht mehr als 25 Prozent eines Jahrgangs besucht werden muss. Weiterhin werden wir die Wiedereinführung von Hauptschule und Realschule prüfen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 72,
                "markierung": "für ein leistungsdifferenziertes, mehrgliedriges Schulsystem ein"
              }
            },
            {
              "id": "st-a023",
              "parteiId": "bsw",
              "kurz": "Angestrebt wird längeres gemeinsames Lernen bis zur 8. Klasse; die Auswahl nach der 4. Klasse benachteilige ärmere Kinder.",
              "original": "Die frühzeitige Selektion in der 4. Klasse für den zukünftigen Schulweg steht dem entgegen und benachteiligt zudem Kinder aus sozial schwächeren Haushalten. […] Das gegliederte Schulsystem hat sich überlebt. […] Längeres gemeinsames Lernen bleibt ein wichtiges Ziel.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 45,
                "markierung": "Das gegliederte Schulsystem hat sich überlebt"
              }
            }
          ]
        },
        {
          "id": "st-f009",
          "text": "Sollen Smartphones an Schulen verboten werden?",
          "aussagen": [
            {
              "id": "st-a031",
              "parteiId": "afd",
              "kurz": "Smartphones sollen bis einschließlich Klasse 10 untersagt sein; Buch, Heft und Tafel bleiben die Hauptmedien.",
              "original": "Wir werden dafür Sorge tragen, dass digitale Medien im Unterricht nicht schon an der Grundschule, sondern erst an weiterführenden Schulen und dort nicht flächendeckend, sondern nur selektiv eingesetzt werden. Außerdem werden wir entsprechend den Empfehlungen der Leopoldina die Nutzung von Smartphones bis einschließlich Klasse 10 untersagen. Das Buch, das Hausaufgabenheft und die Schultafel müssen die Hauptmedien des Unterrichts bleiben.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 79,
                "markierung": "die Nutzung von Smartphones bis einschließlich Klasse 10 untersagen"
              }
            },
            {
              "id": "st-a081",
              "parteiId": "bsw",
              "kurz": "Im Schulalltag soll ein verbindliches Verbot gelten; in der Grundschule sollen digitale Geräte ganz wegbleiben.",
              "original": "Digitale Geräte sind Werkzeuge, keine pädagogische Lösung. In der Grundschule lehnen wir ihren Einsatz ab, da sie den Erwerb grundlegender Fähigkeiten beeinträchtigen. Außerdem setzen wir uns für ein verbindliches Smartphone-Verbot im Schulalltag ein, um Ablenkung, Leistungsabfall, soziale Konflikte und digitale Abhängigkeiten zu reduzieren.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 45,
                "markierung": "verbindliches Smartphone-Verbot im Schulalltag"
              }
            },
            {
              "id": "st-a102",
              "parteiId": "fdp",
              "kurz": "Jede Schule soll selbst entscheiden, ob Handys erlaubt sind. Statt Verboten soll es Unterstützung geben.",
              "original": "Der Umgang mit digitalen Medien an Schulen kann und muss vor Ort entschieden werden: Das gilt für den Einsatz digitaler Medien im Unterricht wie für die Handynutzung auf dem Schulgelände. Wer Kinder und Jugendliche auf die digitale Welt vorbereiten will, braucht keine Verbote, sondern gute Unterstützungsangebote auch für Eltern.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 26,
                "markierung": "Der Umgang mit digitalen Medien an Schulen kann und muss vor Ort entschieden werden"
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
          "id": "st-f013",
          "text": "Wie soll der Personalschlüssel in den Kitas verbessert werden?",
          "aussagen": [
            {
              "id": "st-a003",
              "parteiId": "spd",
              "kurz": "Der Personalschlüssel in der Arbeit mit den Kindern soll schrittweise steigen. Kitas in schwieriger Lage bekommen mehr.",
              "original": "Der tatsächliche Personalschlüssel in der Arbeit mit den Kindern wird schrittweise verbessert. Kitas mit besonderen sozialen Herausforderungen erhalten zusätzliche Unterstützung. […] Beitragsfreiheit bleibt unser Ziel.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 28,
                "markierung": "Der tatsächliche Personalschlüssel in der Arbeit mit den Kindern wird schrittweise verbessert"
              }
            },
            {
              "id": "st-a028",
              "parteiId": "gruene",
              "kurz": "Der Mindestpersonalschlüssel soll angehoben, die Sonderförderung ausgebaut und die Kitasozialarbeit gefördert werden.",
              "original": "Dafür wollen wir den Mindestpersonalschlüssel anheben, die zielgenaue Sonderförderung für Kitas mit besonderen Bedarfen ausbauen und insbesondere die Kitasozialarbeit fördern.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 57,
                "markierung": "wollen wir den Mindestpersonalschlüssel anheben"
              }
            },
            {
              "id": "st-a002",
              "parteiId": "fdp",
              "kurz": "Der Betreuungsschlüssel soll weiter steigen, samt Zeit für Vor- und Nachbereitung. Kita und Grundschule rücken zusammen.",
              "original": "Zudem fordern wir eine weitere Anpassung des Betreuungsschlüssels unter Einbezug der Erfordernisse der individuellen Kinderförderung sowie der notwendigen zeitlichen Kontingente für die Vor- und Nachbereitung.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 25,
                "markierung": "eine weitere Anpassung des Betreuungsschlüssels unter Einbezug der Erfordernisse der individuellen Kinderförderung"
              }
            },
            {
              "id": "st-a011",
              "parteiId": "bsw",
              "kurz": "Es fehlen Fachkräfte, Plätze und Zeit; schlechte Schlüssel machten frühkindliche Bildung zur bloßen Betreuung.",
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
          "id": "st-f030",
          "text": "Wie soll die frühkindliche Betreuung finanziert und ausgebaut werden?",
          "aussagen": [
            {
              "id": "st-a089",
              "parteiId": "cdu",
              "kurz": "Das letzte Kita-Jahr soll ein Vorschuljahr werden. Ein Konzept soll Bedarf, Finanzierung und Personalschlüssel klären.",
              "original": "Das letzte Kita-Jahr zum Vorschuljahr ausbauen: Wir werden das letzte Kita-Jahr gezielt als Vorschuljahr ausgestalten. […] Wir werden ein belastbares Konzept vorlegen, das den tatsächlichen Bedarf realistisch erfasst, eine stabile Finanzierung gewährleistet und gleichzeitig den Personalschlüssel verbessert. […] Dazu werden wir einen Runden Tisch mit allen Beteiligten einrichten.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 49,
                "markierung": "Wir werden das letzte Kita-Jahr gezielt als Vorschuljahr ausgestalten"
              }
            },
            {
              "id": "st-a065",
              "parteiId": "afd",
              "kurz": "Krippe und Kindergarten sollen ab dem ersten Kind kostenlos werden, dauerhaft vom Land finanziert, samt Mittagessen.",
              "original": "Wir werden Krippen und Kindergärten mit einer dauerhaft auf Landesebene gesicherten Finanzierung ab dem ersten Kind kostenlos machen. Die Mittagsverpflegung muss für alle Kinder, von der Krippe bis zur Schule, ebenfalls kostenfrei und von hoher Qualität vorzuhalten sein.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 18,
                "markierung": "Krippen und Kindergärten mit einer dauerhaft auf Landesebene"
              }
            },
            {
              "id": "st-a046",
              "parteiId": "linke",
              "kurz": "In Kitas, Schulen und Jugendhilfe soll dauerhaft investiert werden; gefordert wird eine Abkehr vom Sparen bei den Jüngsten.",
              "original": "Wir stehen für eine Abkehr von der „Rotstiftpolitik bei den Kleinen“: Wer von Zukunft redet, muss in Schulen, Kitas, Schulsozialarbeit, Jugendhilfe, Weiterbildung und digitale Infrastruktur dauerhaft und ausreichend investieren.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 27,
                "markierung": "muss in Schulen, Kitas, Schulsozialarbeit, Jugendhilfe, Weiterbildung und digitale Infrastruktur dauerhaft und ausreichend investieren"
              }
            }
          ]
        },
        {
          "id": "st-f010",
          "text": "Sollen Eltern für die Kita weiter Beiträge zahlen?",
          "aussagen": [
            {
              "id": "st-a008",
              "parteiId": "fdp",
              "kurz": "Die Kita-Beiträge sollen überprüft werden; Fehlanreize bei Geschwisterkindern sollen verschwinden.",
              "original": "Hohe Qualität in der frühkindlichen Bildung darf nicht an finanziellen Hürden scheitern – deshalb nehmen wir auch die Beitragsgestaltung in den Blick. Wir wollen Fehlanreize in der Geschwisterkindregelung auflösen, ohne diese abzuschaffen.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 25,
                "markierung": "Fehlanreize in der Geschwisterkindregelung auflösen, ohne diese abzuschaffen"
              }
            },
            {
              "id": "st-a035",
              "parteiId": "gruene",
              "kurz": "Die Ermäßigung für Familien mit mehreren Kindern soll bleiben; Beiträge sollen sozial gestaffelt werden.",
              "original": "Wir sichern die Beitragsermäßigung für Mehrkinderfamilien dauerhaft ab, um Familien finanziell zu entlasten und allen Kindern gleiche Zugänge zu frühkindlicher Bildung zu ermöglichen. Das Land soll ein Modell zur sozialen Staffelung von Kitabeiträgen erarbeiten.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 57,
                "markierung": "Modell zur sozialen Staffelung von Kitabeiträgen"
              }
            },
            {
              "id": "st-a068",
              "parteiId": "linke",
              "kurz": "Die Kita soll für alle beitragsfrei werden; Beiträge und bessere Personalschlüssel zahlt das Land.",
              "original": "[…] die Bildung in Kindertageseinrichtungen für alle Eltern beitragsfrei wird, […] die bisherigen Elternbeiträge sowie die höheren Kosten durch bessere Personalschlüssel werden dabei vollständig durch das Land finanziert […]",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 29,
                "markierung": "die Bildung in Kindertageseinrichtungen für alle Eltern beitragsfrei wird"
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
          "id": "st-f015",
          "text": "Wie soll die Bürokratie für Betriebe verringert werden?",
          "aussagen": [
            {
              "id": "st-a029",
              "parteiId": "spd",
              "kurz": "Handwerk und Mittelstand sollen nicht durch Bürokratie ausgebremst werden; Gesetze werden auf ihre Wirkung geprüft.",
              "original": "Mittelstand, Handwerk und Bürokratieabbau: Handwerk, Gewerbe und Mittelstand sichern Arbeitsplätze im ganzen Land. Bürokratie darf sie nicht ausbremsen. […] Mitbestimmung in den Betrieben ist ein zentraler Bestandteil einer fairen Wirtschaftsordnung und wird gestärkt.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 4,
                "markierung": "Handwerk, Gewerbe und Mittelstand sichern Arbeitsplätze im ganzen Land. Bürokratie darf sie nicht ausbremsen"
              }
            },
            {
              "id": "st-a018",
              "parteiId": "gruene",
              "kurz": "Dokumentations- und Berichtspflichten sollen sinken, Verfahren durch klare Zuständigkeiten und Digitalisierung schneller werden.",
              "original": "Wir setzen uns außerdem im Bundesrat für ein reformiertes Bundesvergaberecht ein, das mehr regionale Kriterien berücksichtigt und Bürokratie abbaut. […] Wir wollen Bürokratie abbauen, Dokumentations- und Berichtspflichten sollen reduziert und Verfahren durch klare Zuständigkeiten sowie digitale, medienbruchfreie Prozesse […].",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 89,
                "markierung": "Dokumentations- und Berichtspflichten sollen reduziert und Verfahren durch klare Zuständigkeiten"
              }
            },
            {
              "id": "st-a103",
              "parteiId": "fdp",
              "kurz": "Die Bürokratielast soll spürbar sinken, damit Investitionen nicht in Verfahren stecken bleiben und Zeit ins Produkt geht.",
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
          "id": "st-f018",
          "text": "Wodurch soll das Land die heimische Wirtschaft darüber hinaus stärken?",
          "aussagen": [
            {
              "id": "st-a105",
              "parteiId": "cdu",
              "kurz": "Die Produktion wichtiger Medikamente soll als strategisches Projekt gelten: schnellere Genehmigungen, bessere Förderung.",
              "original": "Ziel ist es, Produktionsvorhaben für wichtige Medikamente als „strategische Projekte“ anerkennen zu lassen. Dadurch können Genehmigungsverfahren beschleunigt, Fördermöglichkeiten verbessert und beihilferechtliche Spielräume erweitert werden.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 13,
                "markierung": "Dadurch können Genehmigungsverfahren beschleunigt, Fördermöglichkeiten verbessert"
              }
            },
            {
              "id": "st-a051",
              "parteiId": "afd",
              "kurz": "Gefördert werden sollen kleine und mittlere heimische Betriebe statt Ansiedlung und Subvention ausländischer Großkonzerne.",
              "original": "Förderung des Mittelstands statt Subventionierung globalistischer Großkonzerne! […] Statt sich auf die Unterstützung heimischer Unternehmen zu fokussieren, konzentriert sie sich auf die Ansiedlung und Subventionierung ausländischer Großkonzerne. Nach den Plänen der Landesregierung […] sollten für die Intel-Ansiedlung Subventionen in Höhe von zehn Milliarden Euro fließen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 143,
                "markierung": "Statt sich auf die Unterstützung heimischer Unternehmen zu fokussieren"
              }
            },
            {
              "id": "st-a100",
              "parteiId": "linke",
              "kurz": "Tarifbindung soll wieder die Regel werden, mit einem Vergabemindestlohn von 16,50 Euro und einem strengen Vergabegesetz.",
              "original": "Wo Tarif gilt, geht es den Menschen besser. Doch immer weniger Betriebe zahlen ihn noch – das drückt Löhne und mindert Lebensqualität. Wir wollen die Tarifbindung wieder zur Regel machen. Dafür fordern wir: einen Vergabemindestlohn von 16,50 Euro pro Stunde […], die Einführung eines konsequenten Vergabegesetzes […], die Allgemeinverbindlichkeit von Tarifverträgen zu erleichtern.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 86,
                "markierung": "Wir wollen die Tarifbindung wieder zur Regel machen"
              }
            },
            {
              "id": "st-a071",
              "parteiId": "bsw",
              "kurz": "Das Hauptproblem sei nicht der Kostendruck, sondern die schwache Nachfrage; entscheidend sei Geld, das in der Region bleibt.",
              "original": "Für die heimischen und regional agierenden Betriebe ist nicht der internationale Kostendruck das Hauptproblem, sondern die anhaltende Schwäche der Binnennachfrage. Echter Bürokratieabbau und Entlastungen sind wichtig, schaffen jedoch keine neuen Aufträge.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 18,
                "markierung": "Echter Bürokratieabbau und Entlastungen sind wichtig, schaffen jedoch keine neuen Aufträge"
              }
            }
          ]
        },
        {
          "id": "st-f027",
          "text": "Soll das Tariftreue- und Vergabegesetz bleiben?",
          "aussagen": [
            {
              "id": "st-a006",
              "parteiId": "fdp",
              "kurz": "Das Tariftreue- und Vergabegesetz soll so schnell wie möglich abgeschafft werden; es reiche Kosten an Betriebe durch.",
              "original": "Deshalb braucht Sachsen-Anhalt eine Politik, die die Kosten des Staates nicht nach unten durchreicht, sondern den Staat so organisiert, dass er Arbeit erleichtert und Wachstum beschleunigt. […] In den kommenden Jahren gilt es, das Tariftreue- und Vergabegesetz schnellstmöglich abzuschaffen.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 7,
                "markierung": "das Tariftreue- und Vergabegesetz schnellstmöglich abzuschaffen"
              }
            },
            {
              "id": "st-a108",
              "parteiId": "spd",
              "kurz": "Das Tariftreue- und Vergabegesetz soll die Tarifbindung stärken; eine Abschaffung wird ausgeschlossen.",
              "original": "Tarifbindung und betriebliche Mitbestimmung sind entscheidend für gute Arbeitsbedingungen und höhere Einkommen. Mit dem Tariftreue- und Vergabegesetz stärken wir die Tarifbindung im Land. Eine Ausweitung der bestehenden Einschränkungen oder eine Abschaffung dieses Gesetzes wird es mit uns nicht geben.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 8,
                "markierung": "Eine Ausweitung der bestehenden Einschränkungen oder eine Abschaffung dieses Gesetzes"
              }
            },
            {
              "id": "st-a073",
              "parteiId": "gruene",
              "kurz": "Das Tariftreue- und Vergabegesetz soll die Tarifbindung stärken: Aufträge nur an Betriebe mit fairen Löhnen.",
              "original": "Deshalb soll die Tarifbindung in Sachsen-Anhalt durch das bestehende Tariftreue- und Vergabegesetz weiter gestärkt werden. Öffentliche Aufträge sollen nur an Unternehmen mit fairen Löhnen vergeben werden. Auch in der Privatwirtschaft sollen Tarifbindung und Mitbestimmung ausgebaut werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 76,
                "markierung": "Öffentliche Aufträge sollen nur an Unternehmen mit fairen Löhnen vergeben werden"
              }
            },
            {
              "id": "st-a096",
              "parteiId": "bsw",
              "kurz": "Wer Fördermittel oder öffentliche Aufträge erhält, soll nach Tarif bezahlen; Tariftreue wird Förderbedingung.",
              "original": "Unternehmen, die Fördermittel des Landes erhalten oder öffentliche Aufträge ausführen, müssen mindestens nach Tarif bezahlen. Tariftreue ist Voraussetzung für öffentliche Förderung.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 35,
                "markierung": "müssen mindestens nach Tarif bezahlen"
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
          "id": "st-f017",
          "text": "Wer soll darüber entscheiden, wo Windräder gebaut werden?",
          "aussagen": [
            {
              "id": "st-a025",
              "parteiId": "gruene",
              "kurz": "Am Flächenziel für erneuerbare Energien wird festgehalten; Eignungsgebiete weist die Regionalplanung aus, Schutzgebiete nicht.",
              "original": "Wir halten konsequent am Flächenziel für den Ausbau erneuerbarer Energien fest, um die Energiewende voranzutreiben. […] Der Ausbau der Windenergie ist die wichtige Voraussetzung zur Herstellung von lokalem Grünem Wasserstoff mit regionalen Elektrolyseuren.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 23,
                "markierung": "Wir halten konsequent am Flächenziel für den Ausbau erneuerbarer Energien fest"
              }
            },
            {
              "id": "st-a085",
              "parteiId": "fdp",
              "kurz": "Die Länder sollen mehr Spielraum bekommen: Wer sein Windziel bis 2027 erfüllt, soll die Flächenpflicht bis 2032 loswerden.",
              "original": "[Wir wollen den Bundesländern] einen deutlich größeren Entscheidungsspielraum beim Ausbau erneuerbarer Energien [geben]. Erfüllen Bundesländer bis 2027 das Sektorenziel in erzeugter Energiemenge durch Windenergieanlagen an Land, entfällt die Pflicht zur Erfüllung des für sie derzeit festgelegten Flächenziels bis 2032.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 14,
                "markierung": "entfällt die Pflicht zur Erfüllung des für sie derzeit festgelegten Flächenziels bis 2032"
              }
            },
            {
              "id": "st-a064",
              "parteiId": "afd",
              "kurz": "Das Gesetz zur Akzeptanzsteigerung soll abgeschafft werden; seine Zahlungen nötigten klamme Kommunen zur Zustimmung.",
              "original": "Akzeptanzgesetz abschaffen! In Sachsen-Anhalt leisten zahlreiche Bürgerinitiativen Widerstand gegen den Bau von Windrädern, Solarparks und Kabeltrassen. […] Die in dem Gesetz verankerten finanziellen Anreize sind geeignet, widerspenstige Kommunen zu erpressen. […] Nun sollen die klammen Kommunen durch monetäre Anreize dazu genötigt werden, dem Bau von Windrädern oder Solarparks zuzustimmen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 157,
                "markierung": "Nun sollen die klammen Kommunen durch monetäre Anreize dazu genötigt werden"
              }
            },
            {
              "id": "st-a084",
              "parteiId": "bsw",
              "kurz": "Windkraft leiste einen wichtigen Beitrag, der Ausbau müsse aber regional ausgewogen sein und Rücksicht auf Anwohner nehmen.",
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
          "id": "st-f007",
          "text": "Wie sollen Kommunen und Anwohner am Ausbau beteiligt werden?",
          "aussagen": [
            {
              "id": "st-a021",
              "parteiId": "cdu",
              "kurz": "Erneuerbare sollen technologieoffen genutzt werden; jede Anlage soll die Zustimmung der Kommune brauchen, Wald kritisch.",
              "original": "Erneuerbare Energien technologieoffen nutzen und Bürgerakzeptanz bei der Windkraftnutzung sicherstellen […]. Wir stehen dem Errichten von Windenergieanlagen im Wald aufgrund seiner Multifunktionalität kritisch gegenüber. Alle Windenergieanlagen müssen stets die Zustimmung der kommunalen Ebene […].",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 45,
                "markierung": "Erneuerbare Energien technologieoffen nutzen und Bürgerakzeptanz bei der Windkraftnutzung sicherstellen"
              }
            },
            {
              "id": "st-a026",
              "parteiId": "spd",
              "kurz": "Bürgerbeteiligung soll die Wärmewende tragen: Energiegenossenschaften, Bürgerstrom und Energie-Sharing werden gefördert.",
              "original": "[Wir stärken das Land als Standort für Zukunftsindustrien] von erneuerbaren Energien wie Windkraft über Wasserstoff und Batterietechnologien bis zur digitalen Wirtschaft. Für eine erfolgreiche Wärmewende setzen wir auf Bürgerbeteiligung, Förderung von Energiegenossenschaften, Bürgerstrom und Energie-Sharing.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 5,
                "markierung": "setzen wir auf Bürgerbeteiligung, Förderung von Energiegenossenschaften"
              }
            },
            {
              "id": "st-a020",
              "parteiId": "linke",
              "kurz": "Der Ausbau braucht Naturverträglichkeit, Transparenz und Beteiligung vor Ort; Kommunen sollen an den Projekten verdienen.",
              "original": "Doch der Ausbau der erneuerbaren Energien braucht klare Leitplanken: Naturverträglichkeit, Transparenz und echte Beteiligung der Menschen vor Ort. Wenn Windräder, Solaranlagen und Agri-PV-Projekte Landschaften prägen, müssen Kommunen davon profitieren und ökologische Standards gesichert sein.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 107,
                "markierung": "Naturverträglichkeit, Transparenz und echte Beteiligung der Menschen vor Ort"
              }
            }
          ]
        },
        {
          "id": "st-f029",
          "text": "Wie sollen die Netzentgelte für Stromkunden sinken?",
          "aussagen": [
            {
              "id": "st-a060",
              "parteiId": "cdu",
              "kurz": "Die Netzentgelte sollen bundesweit vereinheitlicht werden; Regionen mit vielen Anlagen sollen nicht allein zahlen.",
              "original": "Die bundesweite Vereinheitlichung von Netzentgelten kann beispielsweise die Bürger in Regionen mit überproportional vielen regenerativen Energieerzeugungsanlagen wie Sachsen-Anhalt spürbar entlasten. So müssen die durch die notwendigen Netzausbaumaßnahmen stark steigenden Netzentgelte, die die Bürger vor Ort über ihre Stromrechnung bezahlen müssen, gedämpft werden.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 45,
                "markierung": "Die bundesweite Vereinheitlichung von Netzentgelten"
              }
            },
            {
              "id": "st-a080",
              "parteiId": "fdp",
              "kurz": "Die Netzentgelte sollen fairer verteilt und spürbar gesenkt, Umlagen und Abgaben zusammengeführt werden.",
              "original": "Sachsen-Anhalt trägt als starker Windstrom-Erzeuger zugleich eine besondere Netzkostenlast, obwohl andere Regionen vom exportierten Strom profitieren. […] Netzentgelte müssen daher zwischen den Regionen fairer verteilt und für die Menschen in Sachsen-Anhalt spürbar gesenkt werden. Umlagen und Abgaben sollten zusammengeführt werden, um Komplexität und Verwaltungskosten zu reduzieren.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 13,
                "markierung": "Netzentgelte müssen daher zwischen den Regionen fairer verteilt"
              }
            },
            {
              "id": "st-a058",
              "parteiId": "linke",
              "kurz": "Die Netzentgelte sollen deutlich sinken, die Stromsteuer fallen, die Energienetze in öffentliche Hand kommen.",
              "original": "die Netzentgelte deutlich senken und damit die regionale Ungerechtigkeit abbauen, dass wir in Sachsen-Anhalt mehr bezahlen als in anderen Bundesländern, die Einführung von Strompreiszonen prüfen, damit Länder mit viel erneuerbarer Energie profitieren, die Stromsteuer auf 0,1 ct/kWh senken, Energienetze in öffentliche Hand überführen […]",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 107,
                "markierung": "die Netzentgelte deutlich senken und damit die regionale Ungerechtigkeit abbauen"
              }
            },
            {
              "id": "st-a077",
              "parteiId": "spd",
              "kurz": "Die Netzentgelte sollen weitgehend gedeckelt, die Stromsteuer gesenkt und die Netze digitalisiert werden.",
              "original": "Wir stehen für eine konsequente Energiewende bei bezahlbaren Energiepreisen für Unternehmen und private Haushalte. Deshalb setzen wir uns für eine weitgehende Deckelung der Netzentgelte, eine konsequente Digitalisierung der Netze sowie für eine Reduzierung der Stromsteuer ein.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 5,
                "markierung": "weitgehende Deckelung der Netzentgelte"
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
          "id": "st-f005",
          "text": "Wie sollen die Krankenhäuser im Land gesichert werden?",
          "aussagen": [
            {
              "id": "st-a017",
              "parteiId": "cdu",
              "kurz": "Krankenhäuser sollen klare Profile bekommen und als Knotenpunkte eng mit den ambulanten Strukturen zusammenarbeiten.",
              "original": "Krankenhäuser mit klaren Profilen, die eng mit ambulanten Strukturen zusammenarbeiten und als starke Knotenpunkte und Spezialisierung in regionalen Versorgungsnetzwerken verankert sind. […] Versorgung sichern – überall im Land: Wir sichern eine flächendeckende medizinische Versorgung als Kern der Daseinsvorsorge.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 27,
                "markierung": "Krankenhäuser mit klaren Profilen, die eng mit ambulanten Strukturen"
              }
            },
            {
              "id": "st-a083",
              "parteiId": "gruene",
              "kurz": "Die Krankenhäuser sollen als Orte der Gesundheits- und Notfallversorgung erhalten bleiben und alle Berufsgruppen einbinden.",
              "original": "Krankenhausstandorte erhalten, Versorgungssicherheit gewährleisten: Die Krankenhäuser im Land müssen als Orte der Gesundheits- und Notfallversorgung erhalten werden. […] eigenverantwortliche Mitarbeit aller Professionen des Gesundheits- und Pflegebereichs.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 79,
                "markierung": "Die Krankenhäuser im Land müssen als Orte der Gesundheits- und Notfallversorgung erhalten"
              }
            },
            {
              "id": "st-a039",
              "parteiId": "linke",
              "kurz": "Krankenhäuser sollen nach Bedarf und Qualität finanziert werden statt nach Fallpauschalen, in kommunalen Versorgungszentren.",
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
          "id": "st-f012",
          "text": "Wie soll die Versorgung in der Fläche erreichbar bleiben?",
          "aussagen": [
            {
              "id": "st-a034",
              "parteiId": "spd",
              "kurz": "Gesundheitsberufe sollen mehr Verantwortung übernehmen; Schulgeldfreiheit und Ausbildungsvergütung bleiben bestehen.",
              "original": "Deshalb setzen wir weiterhin auf die Schulgeldfreiheit in den Gesundheitsberufen und die Zahlung von Ausbildungsvergütungen. Wir unterstützen, dass Gesundheitsberufe künftig mehr Verantwortung u.a. durch Aufgabenverlagerung in der medizinischen Versorgung übernehmen – auch zur Entlastung von Ärztinnen und Ärzten.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 12,
                "markierung": "setzen wir weiterhin auf die Schulgeldfreiheit in den Gesundheitsberufen"
              }
            },
            {
              "id": "st-a043",
              "parteiId": "fdp",
              "kurz": "Ein Förderprogramm soll rollende Arztpraxen und Facharzt-Busse in schwierige Regionen bringen und Anfahrten verkürzen.",
              "original": "Gesundheit vor Ort – Die mobile Versorgungsoffensive: Wir bringen die medizinische Versorgung zu den Menschen, die sie benötigen. Durch ein landesweites Förderprogramm etablieren wir „rollende Arztpraxen“ und spezialisierte Facharzt-Busse in infrastrukturell herausfordernden Regionen. Besonders in der Kinder- und Jugendmedizin sowie der psychiatrischen Versorgung schaffen wir so eine schnelle, wohnortnahe Behandlung ohne lange Anfahrtswege.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 59,
                "markierung": "etablieren wir „rollende Arztpraxen“ und spezialisierte Facharzt-Busse"
              }
            },
            {
              "id": "st-a075",
              "parteiId": "afd",
              "kurz": "Die Kapazitäten für Medizinstudenten sollen um mindestens 20 Prozent wachsen, dazu kommt ein Landarztstipendium.",
              "original": "In einem ersten Schritt werden wir die Kapazitäten für Medizinstudenten an den Universitäten des Landes ausbauen. Der Aufwuchs an Studienplätzen soll mindestens 20 Prozent betragen. Wir werden auch dafür Sorge tragen, dass unsere Universitäten unabhängig von dem bürokratischen […] Numerus-clausus-System mehr engagierte Studienbewerber direkt annehmen.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 243,
                "markierung": "Der Aufwuchs an Studienplätzen soll mindestens 20 Prozent betragen"
              }
            },
            {
              "id": "st-a094",
              "parteiId": "bsw",
              "kurz": "Krankenhäuser sollen erhalten, Personal und Ausbildungsplätze ausgebaut und die Bezahlung tariflich gesichert werden.",
              "original": "Gesundheitsversorgung als Daseinsvorsorge flächendeckend sichern • Pflege- und Gesundheitsberufe mit fairer Bezahlung durch die Einführung eines für alle Mitarbeiter von Krankenhäusern verbindlichen Tariftreuegesetzes stärken • Krankenhäuser erhalten und Personal sowie Ausbildungsplätze ausbauen",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 58,
                "markierung": "Krankenhäuser erhalten und Personal sowie Ausbildungsplätze ausbauen"
              }
            }
          ]
        },
        {
          "id": "st-f006",
          "text": "Wie sollen die Eigenanteile in der Pflege begrenzt werden?",
          "aussagen": [
            {
              "id": "st-a079",
              "parteiId": "cdu",
              "kurz": "Die Pflegeversicherung soll reformiert und die Eigenanteile gedeckelt werden; Wohneigentum bleibt geschützt.",
              "original": "[…] grundlegende Reform der Pflegeversicherung ein, mit gedeckelten Eigenanteilen, fairer Finanzierung und Schutz des selbstgenutzten Wohneigentums.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 29,
                "markierung": "Reform der Pflegeversicherung ein, mit gedeckelten Eigenanteilen"
              }
            },
            {
              "id": "st-a030",
              "parteiId": "afd",
              "kurz": "Die Kosten der Heimpflege sollen begrenzt werden; pflegende Angehörige bekommen ein Landespflegegeld.",
              "original": "Die steigenden Eigenanteile in der stationären Pflege sind für viele Menschen in Sachsen-Anhalt eine untragbare Belastung. Wir stehen für eine wirksame Begrenzung dieser Kosten und mehr Unterstützung für Familien. Angesichts der hohen Kosten, die ein Pflegeplatz im Heim erzeugt, sind die Vergütungen für pflegende Familienangehörige noch zu niedrig. Wir brauchen steuerliche Entlastungen und ein Landespflegegeld.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 245,
                "markierung": "Wir stehen für eine wirksame Begrenzung dieser Kosten und mehr Unterstützung für Familien"
              }
            },
            {
              "id": "st-a078",
              "parteiId": "bsw",
              "kurz": "Eine Pflegevollversicherung soll überwiegend aus Steuern bezahlt werden; Pflege darf keine Geldfrage sein.",
              "original": "Das BSW fordert eine Pflegevollversicherung, die überwiegend aus Steuermitteln finanziert wird. Eine würdige Pflege im Alter darf keine Frage des Geldes sein.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 58,
                "markierung": "Pflegevollversicherung, die überwiegend aus Steuermitteln finanziert wird"
              }
            },
            {
              "id": "st-a012",
              "parteiId": "linke",
              "kurz": "Eine solidarische Pflegevollversicherung soll die Eigenanteile abschaffen, Kapitalerträge werden einbezogen.",
              "original": "Wir wollen: eine solidarische Pflegevollversicherung auf Bundesebene, damit pflegebedingte Eigenanteile abgeschafft werden. die Abschaffung der Beitragsbemessungsgrenze und die Einbeziehung von Kapitalerträgen in die Beitragsbemessung, damit starke Schultern mehr tragen.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 56,
                "markierung": "damit pflegebedingte Eigenanteile abgeschafft werden"
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
          "id": "st-f026",
          "text": "Wie soll das Nahverkehrsangebot ausgebaut werden?",
          "aussagen": [
            {
              "id": "st-a090",
              "parteiId": "cdu",
              "kurz": "Straße und Schiene sollen ausgebaut werden. Das Deutschlandticket bleibt, der Nahverkehr auf dem Land wächst.",
              "original": "Bezahlbare Mobilität in Stadt und Land: Ausbau und Modernisierung von Straßen und Schienennetz – Deutschlandticket erhalten – ÖPNV-Angebot im ländlichen Raum ausbauen – Radverkehr stärken und Alltagsradeln fördern.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 61,
                "markierung": "Deutschlandticket erhalten - ÖPNV-Angebot im ländlichen Raum ausbauen"
              }
            },
            {
              "id": "st-a082",
              "parteiId": "spd",
              "kurz": "Alle Schüler sollen ein Deutschlandticket bekommen. Ruf- und Nachtbusse werden ausgebaut, Jugendliche planen mit.",
              "original": "Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag. Jugendliche sollen in die Planung des ÖPNV eingebunden werden, damit Taktung und Verbindungen ihren Lebensrealitäten entsprechen. Ergänzend werden moderne Ruf- und Nachtbussysteme ausgebaut.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 26,
                "markierung": "Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag"
              }
            },
            {
              "id": "st-a092",
              "parteiId": "gruene",
              "kurz": "Der Nahverkehr soll umfassend ausgebaut und durch Barrierefreiheit und niedrigere Preise attraktiver werden.",
              "original": "Wir setzen uns für einen umfassenden Ausbau des öffentlichen Nahverkehrs ein und wollen Busse und Bahnen im ganzen Land durch Barrierefreiheit und Kostenreduzierungen attraktiver machen.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 27,
                "markierung": "Wir setzen uns für einen umfassenden Ausbau des öffentlichen Nahverkehrs ein"
              }
            },
            {
              "id": "st-a015",
              "parteiId": "afd",
              "kurz": "Der Nahverkehr soll als Ergänzung zum Auto ausgebaut werden, nicht als Ersatz. Fähren auf dem Land bleiben erhalten.",
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
              "id": "st-a004",
              "parteiId": "fdp",
              "kurz": "Die Pünktlichkeit im Nahverkehr auf der Schiene soll um 20 Prozent steigen, die Zugausfälle um 30 Prozent sinken.",
              "original": "Die Pünktlichkeit im Schienenpersonennahverkehr (SPNV) soll gegenüber dem Basisjahr 2025 um 20 Prozent steigen, die Zugausfälle sollen um 30 Prozent sinken. Die Straßen sollen gut ausgebaut sein.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 57,
                "markierung": "Die Pünktlichkeit im Schienenpersonennahverkehr (SPNV) soll gegenüber dem Basisjahr 2025 um 20 Prozent steigen"
              }
            },
            {
              "id": "st-a056",
              "parteiId": "linke",
              "kurz": "Ein verbindliches Programm soll alle Haltestellen barrierefrei machen: stufenloser Einstieg, Ansagen, Leitsysteme.",
              "original": "Öffentlicher Nahverkehr für alle, das bedeutet ein verbindliches Ausbauprogramm für alle Haltestellen des ÖPNV mit taktilen Leitsystemen, Blindenschrift an Fahrplanaushängen, akustischen Ansagen und stufenlosem Einstieg.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 66,
                "markierung": "ein verbindliches Ausbauprogramm für alle Haltestellen des ÖPNV"
              }
            },
            {
              "id": "st-a091",
              "parteiId": "bsw",
              "kurz": "Zentrale Verkehrsinfrastruktur soll in die öffentliche Hand zurück; weitere Zerschlagungen werden abgelehnt.",
              "original": "Das BSW Sachsen-Anhalt lehnt weitere Zerschlagungen ab und setzt sich für eine Rückführung zentraler Mobilitätsinfrastruktur in die öffentliche Hand ein. Eine nachhaltige Landesentwicklung braucht eine langfristige, transparente und realistisch finanzierte Verkehrsplanung.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 32,
                "markierung": "setzt sich für eine Rückführung zentraler Mobilitätsinfrastruktur in die öffentliche Hand ein"
              }
            }
          ]
        },
        {
          "id": "st-f028",
          "text": "Wie soll es mit dem Deutschlandticket weitergehen?",
          "aussagen": [
            {
              "id": "st-a057",
              "parteiId": "fdp",
              "kurz": "Das Deutschlandticket soll Teil des Angebots bleiben, aber nicht zulasten der Qualität des Nahverkehrs gehen.",
              "original": "Das Deutschlandticket bleibt Teil des Angebots, darf jedoch nicht zu Lasten von Qualität und Stabilität der Verkehre gehen.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 67,
                "markierung": "Das Deutschlandticket bleibt Teil des Angebots, darf jedoch nicht zu Lasten von Qualität und Stabilität der Verkehre gehen"
              }
            },
            {
              "id": "st-a066",
              "parteiId": "bsw",
              "kurz": "Das Deutschlandticket soll bleiben und mit der Zeit günstiger werden; der Tarifdschungel soll kleiner werden.",
              "original": "Das Deutschlandticket hat sich bewährt, muss erhalten bleiben und perspektivisch günstiger werden. Der Tarifdschungel ist zu reduzieren, digitale und analoge Ticketangebote müssen gleichermaßen verfügbar sein.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 33,
                "markierung": "muss erhalten bleiben und perspektivisch günstiger werden"
              }
            },
            {
              "id": "st-a005",
              "parteiId": "spd",
              "kurz": "Alle Schülerinnen und Schüler sollen ein Deutschlandticket bekommen und die Planung mitgestalten können.",
              "original": "Kinder und Jugendliche müssen selbstständig, sicher, barrierefrei und bezahlbar unterwegs sein können. Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag. Jugendliche sollen in die Planung des ÖPNV eingebunden werden, damit Taktung und Verbindungen ihren Lebensrealitäten entsprechen.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 26,
                "markierung": "Ein Deutschlandticket für alle Schülerinnen und Schüler verbessert die Mobilität im Alltag"
              }
            },
            {
              "id": "st-a053",
              "parteiId": "linke",
              "kurz": "Auf stark genutzten Strecken soll das Deutschlandticket auch im Intercity gelten, finanziert aus Landesmitteln.",
              "original": "Landesmittel einsetzen, um auf stark frequentierten Nahverkehrs-verbindungen auch im IC-Netz das Deutschlandticket nutzbar zu machen […]",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 103,
                "markierung": "auch im IC-Netz das Deutschlandticket nutzbar zu machen"
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
          "id": "st-f024",
          "text": "Welche Art von Landwirtschaft soll das Land fördern?",
          "aussagen": [
            {
              "id": "st-a014",
              "parteiId": "gruene",
              "kurz": "Der Ökolandbau soll stärker gefördert und sein Flächenanteil deutlich erhöht werden, mit verlässlichen Ökoprämien.",
              "original": "[Der Ökolandbau] soll besser unterstützt und sein Flächenanteil soll deutlich erhöht werden – insbesondere durch verlässliche Ökoprämien und einen stärkeren Fokus auf den Ökolandbau in der Ausbildung, in der Fachschule, bei der Umstellung, bei der Beratung.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 15,
                "markierung": "sein Flächenanteil soll deutlich erhöht werden – insbesondere durch verlässliche Ökoprämien"
              }
            },
            {
              "id": "st-a074",
              "parteiId": "afd",
              "kurz": "Bio-, Öko- und konventionelle Betriebe sollen gleich behandelt werden; eine Bevorzugung einzelner Formen wird abgelehnt.",
              "original": "Jede Form der Landwirtschaft fördern! Wir unterscheiden nicht zwischen Bio-, Öko- oder konventionellen Betrieben. Alle Landwirte leisten ihren Beitrag und sind daher gerecht und ausgewogen zu unterstützen. […] eine einseitige, ungerechtfertigte Bevorzugung bestimmter Betriebsformen, die den Wettbewerb verzerrt, lehnen wir ab. Die Förderung lokaler Erzeuger- und Vermarktungsstrukturen […] muss ein erheblicher Anteil der Wirtschaftsförderung werden.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 177,
                "markierung": "Wir unterscheiden nicht zwischen Bio-, Öko- oder konventionellen Betrieben"
              }
            },
            {
              "id": "st-a041",
              "parteiId": "bsw",
              "kurz": "Gefordert werden Abnahmegarantien für regionale Erzeugnisse; öffentliche Einrichtungen sollen vorrangig regional einkaufen.",
              "original": "Zur Sicherung der einheimischen Landwirtschaft setzt sich das BSW für Abnahmegarantien für landwirtschaftliche Produkte aus regionaler Erzeugung ein. Öffentliche Einrichtungen sollen vorrangig [regionale Produkte beziehen].",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 19,
                "markierung": "setzt sich das BSW für Abnahmegarantien für landwirtschaftliche Produkte aus regionaler Erzeugung ein"
              }
            },
            {
              "id": "st-a101",
              "parteiId": "spd",
              "kurz": "Die Förderhöhe soll bleiben, die Mittel regional verteilt werden. Gemeinwohlleistungen sollen honoriert werden.",
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
          "id": "st-f031",
          "text": "Wodurch sollen landwirtschaftliche Betriebe wirtschaftlich abgesichert werden?",
          "aussagen": [
            {
              "id": "st-a042",
              "parteiId": "fdp",
              "kurz": "Landwirte sollen beim Grunderwerb nicht doppelt besteuert werden; Share Deals sollen verursachergerecht erfasst werden.",
              "original": "Fairness beim Grunderwerb: doppelte Besteuerung beenden, Share Deals verursachergerecht erfassen. Landwirte beim Grunderwerb doppelt zu besteuern, finden wir nicht fair. Das wichtigste Produktionsmittel für Landwirte ist der Boden.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 15,
                "markierung": "Fairness beim Grunderwerb: doppelte Besteuerung beenden, Share Deals verursachergerecht erfassen"
              }
            },
            {
              "id": "st-a055",
              "parteiId": "linke",
              "kurz": "Ein Agrarstrukturgesetz soll Bodenpreise begrenzen und Landkonzentration verhindern; Share Deals werden verboten.",
              "original": "Wir wollen: ein Agrarstrukturgesetz für Sachsen-Anhalt, das Bodenpreise begrenzt und Landkonzentration verhindert, ein landesweites Verbot von Share Deals beim Erwerb landwirtschaftlicher Betriebe, die Privatisierung der BVVG-Flächen dauerhaft beenden.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 111,
                "markierung": "ein Agrarstrukturgesetz für Sachsen-Anhalt, das Bodenpreise begrenzt und Landkonzentration verhindert"
              }
            },
            {
              "id": "st-a072",
              "parteiId": "cdu",
              "kurz": "Der Verbrauch landwirtschaftlicher Flächen für Versiegelung und Zersiedelung soll deutlich begrenzt werden.",
              "original": "Landwirtschaftliche Nutzflächen wirksam schützen: Die Inanspruchnahme landwirtschaftlicher Nutzflächen für andere Zwecke – etwa Versiegelung, Industrieansiedlungen auf der „grünen Wiese“, Zersiedelung oder Ausgleichsmaßnahmen – wollen wir deutlich begrenzen. […] Die Bodenmarktreserve des Landes von 20.000 ha werden wir erhalten.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 39,
                "markierung": "Die Bodenmarktreserve des Landes von 20.000 ha werden wir erhalten"
              }
            }
          ]
        },
        {
          "id": "st-f014",
          "text": "Wie soll mit dem Wolf umgegangen werden?",
          "aussagen": [
            {
              "id": "st-a009",
              "parteiId": "afd",
              "kurz": "Die Wolfspopulation soll gezielt reguliert und das Wolfskompetenzzentrum des Landes abgeschafft werden.",
              "original": "Die vom Wolf verursachten Kosten laufen aus dem Ruder. Erstattungen von Rissen, Förderung von Schutzmaßnahmen und das Wolfskompetenzzentrum (WZI) behindern die Tierhaltung. […] Daher werden wir das umstrittene Wolfskompetenzzentrum abschaffen und die Population gezielt regulieren.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 181,
                "markierung": "das umstrittene Wolfskompetenzzentrum abschaffen und die Population gezielt regulieren"
              }
            },
            {
              "id": "st-a099",
              "parteiId": "gruene",
              "kurz": "Der Wolf soll aus dem Jagdrecht gestrichen werden; Abschüsse soll es nur in eng begrenzten Ausnahmen geben.",
              "original": "Zum Erhalt des Schutzstatus von Wölfen setzen wir uns auf Bundes- und Landesebene dafür ein, die Eintragung ins Jagdrecht rückgängig zu machen und seinen Schutz wieder im Bundesnaturschutzrecht zu verankern. Jagdrechtliche Regelungen in Sachsen-Anhalt sollen auf einem unabhängigen, wissenschaftlich fundierten Wolfsmanagement basieren, wobei Abschüsse nur in eng begrenzten Ausnahmefällen zulässig sind.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 7,
                "markierung": "wobei Abschüsse nur in eng begrenzten Ausnahmefällen zulässig sind"
              }
            },
            {
              "id": "st-a110",
              "parteiId": "linke",
              "kurz": "Der Herdenschutz soll staatlich finanziert werden; für gezielte Entnahmen sollen klare Bedingungen gelten.",
              "original": "Wir wollen eine sachliche, faktenbasierte Wolfspolitik, die Weidetierhaltung stärkt und die Akzeptanz des Wolfs fördert. Gleichzeitig braucht es aber auch klare Bedingungen für gegebenenfalls notwendige gezielte Entnahmen von Wölfen. Wir wollen: einen starken, staatlich getragenen Herdenschutz mit verlässlicher Finanzierung […]",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 112,
                "markierung": "klare Bedingungen für gegebenenfalls notwendige gezielte Entnahmen von Wölfen"
              }
            },
            {
              "id": "st-a067",
              "parteiId": "fdp",
              "kurz": "Der Wolf soll wie andere stabile Arten aktiv gemanagt werden; dafür wird das Jagdrecht weiter modernisiert.",
              "original": "Das Jagdrecht wollen wir weiter spürbar modernisieren. […] Auch andere Tierarten, die aufgrund des erfolgreichen Artenschutzes inzwischen stabile Populationen gebildet haben, müssen in Zukunft gemanagt werden, wie etwa die Saatkrähen oder der Wolf.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 20,
                "markierung": "müssen in Zukunft gemanagt werden, wie etwa die Saatkrähen oder der Wolf"
              }
            }
          ]
        },
        {
          "id": "st-f002",
          "text": "Wie streng sollen die Regeln für die Nutztierhaltung sein?",
          "aussagen": [
            {
              "id": "st-a109",
              "parteiId": "cdu",
              "kurz": "Tierwohl soll mit praxisgerechten Standards gesichert werden; zusätzliche Verschärfungen werden abgelehnt.",
              "original": "Tierhaltung im Land erhalten: Wir setzen uns für tierwohlgerechte Haltung mit praxisgerechten Standards ein und lehnen zusätzliche Verschärfungen ab. […] Im Baurecht und bei Stallgenehmigungsverfahren wollen wir Vereinfachungen und ein Moratorium bei technischen Standards umsetzen.",
              "quelle": {
                "datei": "data/programme/st/cdu.pdf",
                "seite": 41,
                "markierung": "lehnen zusätzliche Verschärfungen ab"
              }
            },
            {
              "id": "st-a022",
              "parteiId": "spd",
              "kurz": "Investitionen in tiergerechte Ställe sollen gefördert und regionale Schlachtstrukturen ausgebaut werden.",
              "original": "Tierwohl und wirtschaftliche Perspektiven müssen zusammen gedacht werden. Investitionen in tiergerechte Haltungssysteme werden gefördert. Umbauprogramme des Bundes werden unterstützt, um neue Marktchancen für höhere Haltungsstufen zu erschließen. Regionale Schlacht- und Vermarktungsstrukturen werden wieder gefördert, um Tiertransporte zu reduzieren […]",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 46,
                "markierung": "Investitionen in tiergerechte Haltungssysteme werden gefördert"
              }
            },
            {
              "id": "st-a027",
              "parteiId": "bsw",
              "kurz": "Der Tierschutz soll streng kontrolliert, Qualzucht unterbunden und mehr Platz im Stall gefördert werden.",
              "original": "[…] für einen Tierschutz, der konsequent umgesetzt und wirksam kontrolliert wird. Qualzuchten sind entschieden zu unterbinden, tiergerechte Haltungsstandards strikt einzuhalten und Stallumbauten mit mehr Platz und besseren Bedingungen gezielt zu fördern.",
              "quelle": {
                "datei": "data/programme/st/bsw.pdf",
                "seite": 86,
                "markierung": "Qualzuchten sind entschieden zu unterbinden"
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
          "id": "st-f016",
          "text": "Wie soll die Verwaltung digitalisiert werden?",
          "aussagen": [
            {
              "id": "st-a050",
              "parteiId": "cdu",
              "kurz": "Erfolgreiche Modellprojekte sollen zentral finanziert und standardisiert in die Fläche gebracht werden, mit Open Source.",
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
              "kurz": "Digitale Lösungen sollen zentral entwickelt werden, um Kommunen zu entlasten; Bewährtes wird von anderen übernommen.",
              "original": "[Lösungen sollen] zentral entwickelt und bereitgestellt werden, um Kommunen bei der Umsetzung zu entlasten. Digital etablierte Lösungen sind aus anderen Bundesländern zu übernehmen. Digitale Verwaltung dient nicht der Technik um ihrer selbst willen, sondern besserem Service, schnelleren Verfahren und mehr Transparenz.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 50,
                "markierung": "Digital etablierte Lösungen sind aus anderen Bundesländern zu übernehmen"
              }
            },
            {
              "id": "st-a087",
              "parteiId": "gruene",
              "kurz": "Die digitale Verwaltung soll von den Nutzenden her gedacht werden: ein zentraler Zugang, Verfahren ohne Medienbruch.",
              "original": "Die digitale Verwaltung muss aus Sicht der Nutzenden gedacht und gestaltet werden. Alle Verwaltungsdienstleistungen sollen über einen zentralen Zugang erreichbar sein.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 89,
                "markierung": "Alle Verwaltungsdienstleistungen sollen über einen zentralen Zugang erreichbar se"
              }
            },
            {
              "id": "st-a063",
              "parteiId": "bsw",
              "kurz": "Behördengänge sollen digital einfacher und nachvollziehbarer werden. Digitalisierung bleibt ein Angebot, kein Zwang.",
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
          "id": "st-f023",
          "text": "Wie soll der Staat schlanker und einfacher werden?",
          "aussagen": [
            {
              "id": "st-a088",
              "parteiId": "fdp",
              "kurz": "Digitalisierung soll Wege sparen und Entscheidungen beschleunigen. Der Bürokratieabbau soll gemessen und sichtbar werden.",
              "original": "So wird Entbürokratisierung zum politischen Gradmesser: Jede Regierung muss daran erkennbar liefern. Digitale Verwaltung ohne Umwege: Digitalisierung ist dann gut, wenn sie Freiheit schafft: bessere Services, weniger Wege, weniger Papier, schnellere Entscheidungen.",
              "quelle": {
                "datei": "data/programme/st/fdp.pdf",
                "seite": 44,
                "markierung": "Digitalisierung ist dann gut, wenn sie Freiheit schafft: bessere Services, weniger Wege"
              }
            },
            {
              "id": "st-a093",
              "parteiId": "afd",
              "kurz": "Die Ausgaben in Ministerien und Verwaltung sollen pauschal um mindestens zehn Prozent gekürzt werden; Doppelarbeit entfällt.",
              "original": "Die Kommunalverwaltungen im Land sind gesetzlich auf die örtliche Daseinsvorsorge zu beschränken. […] Ausgaben in Ministerien und Verwaltung kürzen! Die Kosten für die Bürokratie sind in den letzten zehn Jahren um über 60 Prozent explodiert […]. Deshalb fordern wir eine pauschale Ausgabenkürzung von mindestens 10 Prozent.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 211,
                "markierung": "Die Kosten für die Bürokratie sind in den letzten zehn Jahren um über 60 Prozent explodiert"
              }
            },
            {
              "id": "st-a036",
              "parteiId": "linke",
              "kurz": "Statt Behörden-Dschungel sollen One-Stop-Shops mit klaren Zuständigkeiten die Abläufe für alle einfacher machen.",
              "original": "Statt Behörden-Dschungel und unklaren Verantwortlichkeiten, können „OneStop-Shops“ und damit klare Zuständigkeiten geschaffen werden.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 98,
                "markierung": "„OneStop-Shops“ und damit klare Zuständigkeiten"
              }
            }
          ]
        },
        {
          "id": "st-f025",
          "text": "Soll in der Landesverwaltung Personal abgebaut werden?",
          "aussagen": [
            {
              "id": "st-a038",
              "parteiId": "afd",
              "kurz": "Frei werdende Stellen sollen nur im Ausnahmefall nachbesetzt werden, damit das Personal schrittweise sinkt.",
              "original": "Wir werden alle Behörden einer Soll-Ist-Überprüfung unterziehen, eine strenge Aufgabenkritik üben und überflüssige Tätigkeiten sowie Doppelzuständigkeiten ersatzlos streichen. […] Freiwerdende Stellen werden nur noch im Ausnahmefall nachbesetzt, sodass der Personalbestand durch natürliche Fluktuation schrittweise sinkt.",
              "quelle": {
                "datei": "data/programme/st/afd.pdf",
                "seite": 214,
                "markierung": "Freiwerdende Stellen werden nur noch im Ausnahmefall nachbesetzt"
              }
            },
            {
              "id": "st-a052",
              "parteiId": "gruene",
              "kurz": "Die Verwaltung soll auf 18,7 Vollzeitstellen je 1.000 Einwohner kommen, mit einem Personalplan bis 2035.",
              "original": "Die Effizienzsteigerung in Verwaltungen soll fortgesetzt werden, mit einer Zielgröße von 18,7 Vollzeitäquivalenten pro 1.000 Einwohner*innen und einem landesweiten Personalentwicklungsplan 2035. Kontinuierliche Aufgaben- und Effizienzkritik soll eingeführt und über einen Open-Data-Haushalt öffentlich nachvollziehbar gemacht werden.",
              "quelle": {
                "datei": "data/programme/st/gruene.pdf",
                "seite": 49,
                "markierung": "mit einer Zielgröße von 18,7 Vollzeitäquivalenten"
              }
            },
            {
              "id": "st-a049",
              "parteiId": "linke",
              "kurz": "Einen Personalabbau im öffentlichen Dienst soll es nicht geben; dafür wird höhere Verschuldung hingenommen.",
              "original": "Eine kurzfristige höhere Verschuldung wird durch unsere steuerpolitischen Änderungen und die Förderung der Binnenwirtschaft langfristig kompensiert. Kürzungen in den Bereichen Soziales und Umwelt wird es mit uns nicht geben, ebenso wenig den Abbau öffentlicher Infrastruktur oder Personalabbau im öffentlichen Dienst.",
              "quelle": {
                "datei": "data/programme/st/linke.pdf",
                "seite": 19,
                "markierung": "ebenso wenig den Abbau öffentlicher Infrastruktur oder Personalabbau im öffentlichen Dienst"
              }
            },
            {
              "id": "st-a107",
              "parteiId": "spd",
              "kurz": "Das Personal soll den Aufgaben folgen; ein Abbau darf Verfahren nicht verlängern oder verteuern.",
              "original": "Personaldurchlässigkeit zwischen den Ebenen wird gestärkt, damit Beschäftigte dort eingesetzt werden können, wo sie gebraucht werden. Starre Zuständigkeitsgrenzen werden überprüft. Personalkennzahlen sind kein Selbstzweck. Personalabbau darf nicht zu längeren Verfahrensdauern führen oder durch steigende Sachkosten kompensiert werden.",
              "quelle": {
                "datei": "data/programme/st/spd.pdf",
                "seite": 57,
                "markierung": "Personalabbau darf nicht zu längeren Verfahrensdauern führen"
              }
            }
          ]
        }
      ]
    }
  ],
  "begriffe": [
    {
      "wort": "Agri-PV",
      "erklaerung": "Solarmodule über oder zwischen Ackerflächen. Darunter wird weiter angebaut, die Fläche liefert also Strom und Ernte zugleich.",
      "formen": [
        "Agri-PV"
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
      "wort": "Bleiberecht",
      "erklaerung": "Die Erlaubnis, dauerhaft in Deutschland zu bleiben. Wer sie nicht bekommt, ist ausreisepflichtig – kann aber geduldet werden, solange eine Ausreise nicht möglich ist.",
      "formen": [
        "Bleiberecht"
      ]
    },
    {
      "wort": "Bodycams",
      "erklaerung": "Kleine Kameras an der Uniform, die Polizeieinsätze aufzeichnen. Gestritten wird darüber, wer sie einschaltet und wie lange die Aufnahmen gespeichert bleiben.",
      "formen": [
        "Bodycams"
      ]
    },
    {
      "wort": "Deutschlandticket",
      "erklaerung": "Ein bundesweit gültiges Monatsticket für Busse und Bahnen im Nahverkehr. Bund und Länder schießen die Differenz zu den tatsächlichen Kosten zu; über diese Zuschüsse wird jedes Jahr neu gestritten.",
      "formen": [
        "Deutschlandticket"
      ]
    },
    {
      "wort": "E-Akte",
      "erklaerung": "Die elektronische Akte der Verwaltung: Vorgänge werden digital geführt statt auf Papier. Ohne sie landen auch digitale Anträge wieder im Drucker.",
      "formen": [
        "Medienbruch"
      ]
    },
    {
      "wort": "Eigenanteile",
      "erklaerung": "Der Teil der Pflegekosten, den Bewohner selbst zahlen. Die Pflegeversicherung übernimmt nur einen festen Betrag; Unterkunft, Verpflegung und die Kosten des Gebäudes kommen obendrauf.",
      "formen": [
        "Eigenanteile"
      ]
    },
    {
      "wort": "Energie-Sharing",
      "erklaerung": "Nachbarn oder Genossenschaften erzeugen Strom gemeinsam und teilen ihn untereinander, statt ihn vollständig ins Netz zu geben.",
      "formen": [
        "Energiegenossenschaften",
        "Energie-Sharing",
        "Bürgerstrom"
      ]
    },
    {
      "wort": "Fallpauschalen",
      "erklaerung": "Krankenhäuser bekommen je Behandlungsfall einen festen Betrag, unabhängig von der Verweildauer. Kritiker sagen, das belohne Menge; Befürworter, es verhindere unnötig lange Aufenthalte.",
      "formen": [
        "Fallpauschalen"
      ]
    },
    {
      "wort": "Ganztag",
      "erklaerung": "Schule mit Betreuung und Angeboten über den Unterricht hinaus, meist bis in den Nachmittag. Ab 2026 gilt für Grundschulkinder schrittweise ein Rechtsanspruch darauf.",
      "formen": [
        "Ganztagsangebote",
        "Ganztagsangebot",
        "Ganztag"
      ]
    },
    {
      "wort": "Netzentgelte",
      "erklaerung": "Der Teil des Strompreises, der für die Leitungen gezahlt wird. Er ist je nach Region verschieden hoch und steigt dort besonders, wo viel Netz neu gebaut wird.",
      "formen": [
        "Netzentgelte"
      ]
    },
    {
      "wort": "Nutztierhaltung",
      "erklaerung": "Die Haltung von Tieren zur Lebensmittelerzeugung. Streitpunkte sind der Platz im Stall, wer den Umbau bezahlt und wie streng kontrolliert wird.",
      "formen": [
        "Nutztierhaltung"
      ]
    },
    {
      "wort": "Personalschlüssel",
      "erklaerung": "Wie viele Kinder auf eine Fachkraft kommen. Ein Schlüssel von 1:5 heißt fünf Kinder je Erzieherin – rechnerisch. Urlaub, Krankheit und Vorbereitung sind darin meist nicht enthalten.",
      "formen": [
        "Betreuungsschlüssel",
        "Personalschlüssel"
      ]
    },
    {
      "wort": "Pflegevollversicherung",
      "erklaerung": "Ein Modell, bei dem die Versicherung alle Pflegekosten übernimmt. Heute zahlt sie nur einen festen Betrag, den Rest tragen die Bewohner selbst.",
      "formen": [
        "Pflegevollversicherung"
      ]
    },
    {
      "wort": "Repowering",
      "erklaerung": "Alte Windräder durch neue, größere am selben Standort ersetzen. Das bringt mehr Strom ohne zusätzliche Fläche, die Anlagen werden aber höher.",
      "formen": [
        "Repowering"
      ]
    },
    {
      "wort": "Share Deals",
      "erklaerung": "Statt einer Immobilie werden Anteile der Firma verkauft, der sie gehört. Bleibt der Anteil unter einer Schwelle, fällt keine Grunderwerbsteuer an.",
      "formen": [
        "Share Deals"
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
        "Tasern",
        "Taser"
      ]
    },
    {
      "wort": "Unterrichtsausfall",
      "erklaerung": "Stunden, die ersatzlos entfallen oder fachfremd vertreten werden. Die Länder zählen unterschiedlich, deshalb sind ihre Quoten kaum vergleichbar.",
      "formen": [
        "Unterrichtsausfall"
      ]
    },
    {
      "wort": "Vergabegesetz",
      "erklaerung": "Ein Landesgesetz, das öffentliche Aufträge an Bedingungen knüpft – etwa Tariflohn, Mindestlohn oder ökologische Standards. Ohne es gilt nur das Vergaberecht von Bund und EU.",
      "formen": [
        "Tariftreue- und Vergabegesetz",
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
      "wort": "Windräder",
      "erklaerung": "Windkraftanlagen an Land. Wo sie stehen dürfen, entscheidet die Planung von Land und Region; jedes Bundesland muss dafür einen festgelegten Anteil seiner Fläche ausweisen.",
      "formen": [
        "Windkraftanlagen",
        "Windräder",
        "Windkraft"
      ]
    },
    {
      "wort": "Wolf",
      "erklaerung": "Seit den 2000er Jahren leben wieder Wölfe in Deutschland; sie stehen unter strengem Schutz. Gestritten wird, ob und wie schnell Tiere geschossen werden dürfen, die Schafe oder Rinder reißen.",
      "formen": [
        "Wolf"
      ]
    },
    {
      "wort": "Wärmeversorgung",
      "erklaerung": "Heizung und Warmwasser - zusammen rund die Hälfte des Energieverbrauchs in Gebäuden. Sie kommt aus Gas, Öl, Fernwärme oder Wärmepumpen; der Umstieg auf klimafreundliche Quellen heißt Wärmewende.",
      "formen": [
        "Wärmewende"
      ]
    },
    {
      "wort": "Ökolandbau",
      "erklaerung": "Landwirtschaft nach den Regeln des ökologischen Anbaus: kein chemisch-synthetischer Pflanzenschutz, kein Kunstdünger, begrenzte Tierzahl je Fläche. Die Erträge sind niedriger, die Preise höher.",
      "formen": [
        "Ökolandbau",
        "Ökoprämien"
      ]
    }
  ]
}
);
