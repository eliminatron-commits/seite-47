/* Seite 47 – PDF-Export (Schnittstelle).
 * Phase 4 bindet pdfmake (vendor/pdfmake/) ein; Begründung der Wahl in CLAUDE.md.
 * Diese Datei kapselt den Export vollständig, damit die App-Logik
 * bibliotheksunabhängig bleibt.
 */
(function (global) {
  'use strict';

  global.S47_EXPORT = {
    verfuegbar: function () {
      return !!(global.pdfMake && global.pdfMake.createPdf);
    },

    /**
     * @param {object} ergebnis {datensatz, ranking, themen, gewichte, antworten}
     */
    erzeuge: function (ergebnis) {
      if (!this.verfuegbar()) {
        throw new Error('PDF-Bibliothek nicht geladen (Phase 4).');
      }
      /* Phase 4: Dokumentdefinition + Anhang aller Antworten. */
      throw new Error('Noch nicht implementiert.');
    }
  };
})(window);
