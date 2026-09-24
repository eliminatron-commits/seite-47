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
    "datei": "data/wahlen/agh-be-2026.js",
    "ergebnis": {
      "art": "Vorläufiges amtliches Ergebnis, Zweitstimmen",
      "quelle": "Landeswahlleiter für Berlin",
      "url": "https://www.berlin.de/wahlen/pressemitteilungen/2026/pressemitteilung.1716422.php",
      "parteien": [
        { "name": "Die Linke", "prozent": 25.7 },
        { "name": "CDU", "prozent": 18.8 },
        { "name": "AfD", "prozent": 16.3 },
        { "name": "Grüne", "prozent": 14.3 },
        { "name": "SPD", "prozent": 12.1 },
        { "name": "BSW", "prozent": 4.7 },
        { "name": "FDP", "prozent": 2.5 },
        { "name": "Sonstige", "prozent": 5.7 }
      ]
    }
  },
  {
    "id": "lt-mv-2026",
    "name": "Landtagswahl Mecklenburg-Vorpommern",
    "region": "Mecklenburg-Vorpommern",
    "wahltag": "2026-09-20",
    "datei": "data/wahlen/lt-mv-2026.js",
    "ergebnis": {
      "art": "Vorläufiges amtliches Endergebnis, Zweitstimmen",
      "quelle": "Landeswahlleitung Mecklenburg-Vorpommern",
      "url": "https://www.landtag-mv.de/aktuelles/artikel/landtagswahl-2026-vorlaeufiges-amtliches-endergebnis",
      "parteien": [
        { "name": "AfD", "prozent": 38.2 },
        { "name": "SPD", "prozent": 35.5 },
        { "name": "Die Linke", "prozent": 6.5 },
        { "name": "Grüne", "prozent": 5.7 },
        { "name": "CDU", "prozent": 4.9 },
        { "name": "BSW", "prozent": 4.8 },
        { "name": "FDP", "prozent": 1.0 },
        { "name": "Sonstige", "prozent": 3.3 }
      ]
    }
  }
];
