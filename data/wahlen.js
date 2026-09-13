/* Seite 47 – Manifest der verfügbaren Wahlen. REINE DATEN.
 * Eine neue Wahl entsteht ausschließlich durch:
 *   1. eine Datei data/wahlen/<id>.js  (Datensatz)
 *   2. die zugehörigen PDFs unter data/programme/<kuerzel>/
 *   3. einen Eintrag in dieser Liste
 * Kein App-Code (js/, css/, index.html) wird dafür verändert.
 * Sortierung übernimmt die App: aktuellste Wahl oben.
 */
window.S47_MANIFEST = [
  {
    "id": "lt-st-2026",
    "name": "Landtagswahl Sachsen-Anhalt",
    "region": "Sachsen-Anhalt",
    "wahltag": "2026-09-06",
    "datei": "data/wahlen/lt-st-2026.js",
    "ergebnis": {
      "art": "Vorläufiges amtliches Ergebnis, Zweitstimmen",
      "quelle": "Landeswahlleiterin Sachsen-Anhalt",
      "url": "https://wahlergebnisse.sachsen-anhalt.de/wahlen/lt26/erg_land.html",
      "parteien": [
        { "name": "AfD", "prozent": 43.8 },
        { "name": "CDU", "prozent": 17.2 },
        { "name": "SPD", "prozent": 9.3 },
        { "name": "Grüne", "prozent": 8.9 },
        { "name": "Die Linke", "prozent": 8.6 },
        { "name": "BSW", "prozent": 5.3 },
        { "name": "FDP", "prozent": 2.6 },
        { "name": "Sonstige", "prozent": 4.3 }
      ]
    }
  },
  {
    "id": "agh-be-2026",
    "name": "Abgeordnetenhauswahl Berlin",
    "region": "Berlin",
    "wahltag": "2026-09-20",
    "datei": "data/wahlen/agh-be-2026.js"
  },
  {
    "id": "lt-mv-2026",
    "name": "Landtagswahl Mecklenburg-Vorpommern",
    "region": "Mecklenburg-Vorpommern",
    "wahltag": "2026-09-20",
    "datei": "data/wahlen/lt-mv-2026.js"
  }
];
