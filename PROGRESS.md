# PROGRESS – Seite 47

**Abgeschlossen: Phase 3/5 – Kern-App**
**Nächste Phase: Phase 4/5 – Quellenanzeige & PDF-Export** (Opus 5, hoch)

## Stand

Die App ist auf echten Daten vollständig durchspielbar: Wahl wählen, 9–10 Themen
per Slider gewichten (0 schließt ein Thema aus Abfrage und Wertung aus), Aussagen
themenweise anonym bewerten, Ergebnis mit Ranking, Themenaufschlüsselung und
separatem Aufdeckungsschritt.

In Phase 3 ergänzt:
- **Maskierung von Parteinamen** in Aussagetexten vor der Aufdeckung
  (`S47_DATA.anonymisiere`, gespeist aus `parteien[].name`/`alias` im Datensatz).
- Zähler „x von y bewertet“ und Hinweis, dass offene Aussagen wie „Neutral“ zählen.
- Ergebnisseite zeigt je Aussage die **eigene Bewertung** und den Rechenweg.
- Rückwege „Zurück zur Bewertung“ und „Antworten ändern“.

Verifiziert: Durchlauf für alle drei Wahlen fehlerfrei, keine Konsolenfehler.
Handrechnung eines Themas stimmt exakt (Gewichte 3/1/0…: Zustimmung → 87,5 %,
Ablehnung → 12,5 %, übrige 50 %). Anonymitätsscan über alle drei Wahlen mit
**jedem einzelnen Zitat geöffnet** (70 + 63 + 63 Aussagen): keine Parteinennung,
keine Partei-ID, keine Parteifarbe, kein PDF-Pfad.

## Offene Punkte / Abweichungen

- Gefunden und behoben: Originalzitate nannten in 14 Fällen die eigene Partei
  („Die AfD fordert“, „Wir Freie Demokraten“). Der Fassungs-Toggle war damit ein
  Weg zur vorzeitigen Aufdeckung. Gelöst durch datengetriebene Maskierung, nicht
  durch Umschreiben der Zitate – nach der Aufdeckung steht das Zitat unverändert da.
- AfD Sachsen-Anhalt nur als Kurzprogramm verfügbar, Grüne MV als gespiegeltes PDF
  (Begründung siehe Phase-2-Eintrag in der Git-Historie und `docs/quellen.md`).
- `file://`-Start weiterhin nur konstruktiv abgesichert, noch nicht per Doppelklick
  bestätigt.
- `js/quelle.js` und `js/export.js` sind Schnittstellen-Stubs (Phase 4), `vendor/` leer.
  Der Quellen-Knopf öffnet derzeit den Fallback `datei#page=N`.
- Parteilogos fehlen; das Ergebnis zeigt ersatzweise Farbpunkte.
