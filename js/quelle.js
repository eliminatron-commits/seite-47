/* Seite 47 – Quellenanzeige (Schnittstelle).
 * Phase 4 füllt dies mit einem eingebetteten PDF.js-Viewer (vendor/pdfjs/).
 * Bis dahin: verlässlicher Fallback – das PDF wird extern geöffnet, mit
 * Seitensprung über den PDF-Fragmentbezeichner (#page=N).
 */
(function (global) {
  'use strict';

  var S47Quelle = {
    verfuegbar: function () {
      return !!(global.pdfjsLib && S47Quelle._viewerBereit);
    },
    _viewerBereit: false,

    /** @param {{datei:string, seite:number, markierung:string}} quelle */
    fallbackUrl: function (quelle) {
      return quelle.datei + '#page=' + quelle.seite;
    },

    /**
     * Öffnet die Fundstelle. Gibt true zurück, wenn inline gerendert wurde,
     * sonst false (dann wurde der Fallback verwendet bzw. ist anzuzeigen).
     */
    zeige: function (quelle) {
      if (!S47Quelle.verfuegbar()) { return false; }
      return false; /* Phase 4 */
    }
  };

  global.S47_QUELLE = S47Quelle;
})(window);
