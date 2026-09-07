/* Seite 47 – PDF-Export mit pdfmake (vendor/pdfmake/).
 * Warum pdfmake und nicht jsPDF oder window.print(): CLAUDE.md, Punkt 5.
 * Diese Datei kapselt den Export vollständig, damit die App-Logik
 * bibliotheksunabhängig bleibt.
 *
 * Aufbau des Dokuments: Gesamtranking, danach die Themenaufschlüsselung,
 * im Anhang sämtliche Aussagen mit der eigenen Bewertung.
 */
(function (global) {
  'use strict';

  function prozent(p) {
    return p === null || p === undefined ? '–' : Math.round(p) + ' %';
  }

  function datumDeutsch(iso) {
    var t = String(iso || '').split('-');
    return t.length === 3 ? (t[2] + '.' + t[1] + '.' + t[0]) : String(iso || '');
  }

  function parteiName(datensatz, id) {
    var p = global.S47_DATA.partei(datensatz, id);
    return p ? p.name : id;
  }

  function bewertungText(id) {
    var b = global.S47_AUSWERTUNG.BEWERTUNGEN.filter(function (x) { return x.id === id; })[0];
    return b ? b.label : 'nicht beantwortet';
  }

  function rangTabelle(e) {
    var zeilen = [[
      { text: 'Rang', style: 'kopf' },
      { text: 'Partei', style: 'kopf' },
      { text: 'Übereinstimmung', style: 'kopf', alignment: 'right' },
      { text: 'Themen', style: 'kopf', alignment: 'right' }
    ]];
    e.ranking.forEach(function (r, i) {
      zeilen.push([
        String(i + 1),
        parteiName(e.datensatz, r.parteiId),
        { text: prozent(r.prozent), alignment: 'right' },
        { text: String(r.beruecksichtigteThemen), alignment: 'right' }
      ]);
    });
    return {
      table: { headerRows: 1, widths: [28, '*', 90, 45], body: zeilen },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 12]
    };
  }

  function themenTeil(e) {
    var teile = [];
    e.themen.filter(function (t) { return t.gewicht > 0; }).forEach(function (t) {
      var zeilen = [[
        { text: 'Partei', style: 'kopf' },
        { text: 'Wert', style: 'kopf', alignment: 'right' },
        { text: 'Ihre Bewertung', style: 'kopf' }
      ]];
      t.werte.forEach(function (w) {
        zeilen.push([
          parteiName(e.datensatz, w.parteiId),
          { text: w.wert + ' %', alignment: 'right' },
          bewertungText(w.bewertung)
        ]);
      });
      teile.push({
        text: t.titel + '  ·  ' + global.S47_AUSWERTUNG.GEWICHTE[t.gewicht].label,
        style: 'thema', margin: [0, 10, 0, 4]
      });
      teile.push({
        table: { headerRows: 1, widths: ['*', 45, 120], body: zeilen },
        layout: 'lightHorizontalLines'
      });
    });
    return teile;
  }

  /* Anhang: jede Aussage im Wortlaut der vereinfachten Fassung, mit Partei,
   * eigener Bewertung und Fundstelle – das Ergebnis bleibt so nachprüfbar. */
  function anhang(e) {
    var teile = [{ text: 'Anhang: Ihre Antworten', style: 'h1', pageBreak: 'before' }];
    e.datensatz.themen.forEach(function (t) {
      var gewicht = e.themen.filter(function (x) { return x.id === t.id; })[0];
      var g = gewicht ? gewicht.gewicht : 0;
      teile.push({
        text: t.titel + '  ·  ' + global.S47_AUSWERTUNG.GEWICHTE[g].label
          + (g > 0 ? '' : ' (nicht abgefragt)'),
        style: 'thema', margin: [0, 10, 0, 4]
      });
      var zeilen = [[
        { text: 'Aussage', style: 'kopf' },
        { text: 'Partei', style: 'kopf' },
        { text: 'Ihre Bewertung', style: 'kopf' },
        { text: 'Quelle', style: 'kopf' }
      ]];
      t.aussagen.forEach(function (a) {
        zeilen.push([
          { text: a.kurz, style: 'klein' },
          { text: parteiName(e.datensatz, a.parteiId), style: 'klein' },
          { text: g > 0 ? bewertungText(e.antworten[a.id]) : '–', style: 'klein' },
          { text: 'Seite ' + a.quelle.seite, style: 'klein' }
        ]);
      });
      teile.push({
        table: { headerRows: 1, dontBreakRows: true, widths: ['*', 60, 78, 45], body: zeilen },
        layout: 'lightHorizontalLines'
      });
    });
    return teile;
  }

  function dokument(e) {
    var d = e.datensatz;
    var inhalt = [
      { text: 'Seite 47 – Ihr Ergebnis', style: 'h1' },
      { text: d.name + ' · Wahltag ' + datumDeutsch(d.wahltag), style: 'unter' },
      { text: 'Gesamt', style: 'h2' },
      rangTabelle(e),
      { text: 'So wird gerechnet: Zustimmung zählt 100, Neutral 50, Ablehnung 0 Punkte. '
        + 'Je Thema ergibt das den Themenwert einer Partei. Der Gesamtwert ist der mit '
        + 'Ihrer Themengewichtung gewichtete Durchschnitt – nur über Themen, zu denen '
        + 'die Partei eine Position im Programm hat. Unbeantwortete Aussagen zählen wie '
        + '„Neutral“.', style: 'klein' },
      { text: 'Nach Themen', style: 'h2' }
    ];
    inhalt = inhalt.concat(themenTeil(e)).concat(anhang(e));

    return {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 45],
      info: { title: 'Seite 47 – Ergebnis ' + d.name },
      content: inhalt,
      footer: function (seite, anzahl) {
        return {
          margin: [40, 8, 40, 0],
          columns: [
            { text: 'Erzeugt im Browser, ohne Server und ohne Speicherung.', style: 'fuss' },
            { text: seite + ' / ' + anzahl, style: 'fuss', alignment: 'right' }
          ]
        };
      },
      defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.25 },
      styles: {
        h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 2] },
        h2: { fontSize: 13, bold: true, margin: [0, 14, 0, 6] },
        unter: { fontSize: 10, color: '#5f5f58', margin: [0, 0, 0, 8] },
        thema: { fontSize: 11, bold: true },
        kopf: { bold: true, fontSize: 9, color: '#5f5f58' },
        klein: { fontSize: 9 },
        fuss: { fontSize: 8, color: '#5f5f58' }
      }
    };
  }

  global.S47_EXPORT = {
    verfuegbar: function () {
      return !!(global.pdfMake && global.pdfMake.createPdf);
    },

    /**
     * @param {object} ergebnis {datensatz, ranking, themen, gewichte, antworten}
     */
    erzeuge: function (ergebnis) {
      if (!this.verfuegbar()) {
        throw new Error('PDF-Bibliothek nicht geladen.');
      }
      var name = 'Seite-47-Ergebnis-' + ergebnis.datensatz.id + '.pdf';
      global.pdfMake.createPdf(dokument(ergebnis)).download(name);
    },

    /* Für die Prüfung: liefert die Dokumentdefinition ohne Erzeugung. */
    _dokument: dokument
  };
})(window);
