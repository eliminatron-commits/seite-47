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
    "datei": "data/wahlen/lt-st-2026.js"
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
