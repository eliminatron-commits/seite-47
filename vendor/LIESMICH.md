Hier liegen mitgelieferte Bibliotheken als lokale Dateien (kein CDN).

- `pdfjs/` – PDF.js 3.11.174 (Apache-2.0), Quellenanzeige.
  `pdf.min.js` (UMD-Build, setzt `window.pdfjsLib`) und `pdf.worker.min.js`.
  Bewusst der ältere UMD-Build statt der aktuellen ESM-Fassung: Module sind
  ausgeschlossen (siehe CLAUDE.md, „Verbotene Ansätze“).
- `pdfmake/` – pdfmake 0.2.10 (MIT), Ergebnis-Export.
  `pdfmake.min.js` und `vfs_fonts.js` (Roboto als Base64-VFS, deshalb Umlaute).

Bezogen von cdnjs, danach nur noch lokal eingebunden. Beim Austausch gegen eine
neuere Fassung muss `window.pdfjsLib` bzw. `window.pdfMake` weiterhin ohne
Modul-Loader entstehen.
