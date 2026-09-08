/* Seite 47 – PDF-Export mit pdfmake (vendor/pdfmake/).
 * Warum pdfmake und nicht jsPDF oder window.print(): CLAUDE.md, Punkt 5.
 * Diese Datei kapselt den Export vollständig, damit die App-Logik
 * bibliotheksunabhängig bleibt.
 *
 * Aufbau (Schema 2): Gesamtranking, danach die Themenaufschlüsselung mit den
 * Mittelwerten je Partei, im Anhang jede Frage mit ihren Aussagen und der
 * eigenen Wahl.
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

  /* Die eigene Wahl steckt im Punktwert: 100 = am ehesten, 0 = am wenigsten. */
  function wahlText(wert) {
    var P = global.S47_AUSWERTUNG.PUNKTE;
    if (wert === null || wert === undefined) { return 'nicht beantwortet'; }
    if (wert === P.beste) { return 'am ehesten'; }
    if (wert === P.schlechteste) { return 'am wenigsten'; }
    return 'dazwischen';
  }

  function gewichtText(wert) {
    return global.S47_AUSWERTUNG.gewichtLabel(wert) + ' (' + Math.round(wert) + ')';
  }

  function themaNach(datensatz, id) {
    return datensatz.themen.filter(function (t) { return t.id === id; })[0];
  }

  function frageNach(thema, id) {
    return thema.fragen.filter(function (f) { return f.id === id; })[0];
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
        { text: 'Themenwert', style: 'kopf', alignment: 'right' },
        { text: 'Fragen', style: 'kopf', alignment: 'right' }
      ]];
      t.werte.forEach(function (w) {
        zeilen.push([
          parteiName(e.datensatz, w.parteiId),
          { text: prozent(w.wert), alignment: 'right' },
          { text: String(w.fragen), alignment: 'right' }
        ]);
      });
      teile.push({
        text: t.titel + '  ·  ' + gewichtText(t.gewicht),
        style: 'thema', margin: [0, 10, 0, 4]
      });
      teile.push({
        table: { headerRows: 1, widths: ['*', 70, 45], body: zeilen },
        layout: 'lightHorizontalLines'
      });
    });
    return teile;
  }

  /* Anhang: jede Frage mit ihren Aussagen, Partei, eigener Wahl und
   * Fundstelle – das Ergebnis bleibt so nachprüfbar. */
  function anhang(e) {
    var teile = [{ text: 'Anhang: Ihre Antworten', style: 'h1', pageBreak: 'before' }];
    e.themen.forEach(function (tErg) {
      var thema = themaNach(e.datensatz, tErg.id);
      teile.push({
        text: thema.titel + '  ·  ' + gewichtText(tErg.gewicht)
          + (tErg.gewicht > 0 ? '' : ' – nicht abgefragt'),
        style: 'thema', margin: [0, 12, 0, 2]
      });

      tErg.fragen.forEach(function (fErg) {
        var fr = frageNach(thema, fErg.id);
        teile.push({
          text: fr.text + (fErg.beantwortet ? '' : '  (nicht beantwortet)'),
          style: 'frage', margin: [0, 6, 0, 3]
        });
        var zeilen = [[
          { text: 'Aussage', style: 'kopf' },
          { text: 'Partei', style: 'kopf' },
          { text: 'Ihre Wahl', style: 'kopf' },
          { text: 'Quelle', style: 'kopf' }
        ]];
        fErg.werte.forEach(function (w) {
          var a = fr.aussagen.filter(function (x) { return x.id === w.aussageId; })[0];
          zeilen.push([
            { text: a.kurz, style: 'klein' },
            { text: parteiName(e.datensatz, w.parteiId), style: 'klein' },
            { text: wahlText(w.wert), style: 'klein' },
            { text: 'Seite ' + a.quelle.seite, style: 'klein' }
          ]);
        });
        teile.push({
          table: { headerRows: 1, dontBreakRows: true, widths: ['*', 60, 70, 45], body: zeilen },
          layout: 'lightHorizontalLines'
        });
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
      { text: 'So wird gerechnet: In jeder Frage bekommt die Aussage, der Sie am ehesten '
        + 'zustimmen, 100 Punkte, die mit der geringsten Zustimmung 0, die übrigen 50. '
        + 'Der Themenwert einer Partei ist der Mittelwert über die Fragen dieses Themas, '
        + 'in denen sie vorkommt – eine Frage zeigt nur 3 bis 4 der Parteien. Der '
        + 'Gesamtwert ist der mit Ihrer Themengewichtung gewichtete Durchschnitt über die '
        + 'Themen mit Gewicht über null. Offene Fragen zählen für keine Partei.',
        style: 'klein' },
      { text: e.offeneFragen
          ? e.offeneFragen + ' von ' + e.fragenGesamt + ' abgefragten Fragen sind offen geblieben.'
          : 'Alle ' + e.fragenGesamt + ' abgefragten Fragen wurden beantwortet.',
        style: 'klein', margin: [0, 4, 0, 0] },
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
        frage: { fontSize: 10, bold: true, color: '#2c3e50' },
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
     * @param {object} ergebnis Rückgabe von S47_AUSWERTUNG.berechne,
     *   ergänzt um datensatz (und optional gewichte/antworten).
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
