/* Seite 47 – PDF-Export mit pdfmake (vendor/pdfmake/).
 * Warum pdfmake und nicht jsPDF oder window.print(): CLAUDE.md, Punkt 5.
 * Diese Datei kapselt den Export vollständig, damit die App-Logik
 * bibliotheksunabhängig bleibt.
 *
 * Satzregeln (CLAUDE.md, Punkt 9):
 * - Zusammengehöriges bleibt zusammen. Jede Frage samt ihren Aussagen ist ein
 *   `unbreakable`-Block; eine Überschrift ohne folgenden Inhalt wandert per
 *   `pageBreakBefore` auf die nächste Seite. Ohne beides zerreißt pdfmake die
 *   Blöcke an beliebiger Stelle – ein Satz unten, der Rest oben auf der
 *   nächsten Seite.
 * - Aussagetexte stehen als Fließtext untereinander, nicht in Tabellenzellen.
 *   In einer Spalte von 60 pt bricht jeder zweite Satz um.
 */
(function (global) {
  'use strict';

  /* Nutzbare Breite: A4 (595,28 pt) abzüglich der Seitenränder. */
  var RAND = 44;
  var BREITE = 595.28 - 2 * RAND;

  var TON = {
    text: '#1c1b17',
    leise: '#6a665c',
    linie: '#e2ddd2',
    spur: '#efece5',
    gut: '#1f6b3a',
    schlecht: '#93342f'
  };

  function prozent(p) {
    return p === null || p === undefined ? '–' : Math.round(p) + ' %';
  }

  function datumDeutsch(iso) {
    var t = String(iso || '').split('-');
    return t.length === 3 ? (t[2] + '.' + t[1] + '.' + t[0]) : String(iso || '');
  }

  function partei(datensatz, id) {
    return global.S47_DATA.partei(datensatz, id) || { name: id, farbe: null };
  }

  /* Seit der Spielform ist die eigene Wahl binaer: In jedem Duell hat genau
   * eine der beiden Aussagen gewonnen. */
  function wahlText(gewonnen, gespielt) {
    if (!gespielt) { return 'uebersprungen'; }
    return gewonnen ? 'gewaehlt' : 'nicht gewaehlt';
  }

  function wahlFarbe(gewonnen, gespielt) {
    if (!gespielt) { return TON.leise; }
    return gewonnen ? TON.gut : TON.leise;
  }

  function gewichtText(wert) {
    return global.S47_AUSWERTUNG.punkteLabel(wert) + ' (' + Math.round(wert) + ' Punkte)';
  }

  function themaNach(datensatz, id) {
    return datensatz.themen.filter(function (t) { return t.id === id; })[0];
  }

  /* ---------- Bausteine ---------- */

  /* Farbtupfer der Partei. Erscheint erst im Export, also nach der
   * Aufdeckung – vorher gibt es kein PDF. */
  function tupfer(farbe, groesse) {
    var g = groesse || 7;
    return {
      width: g,
      margin: [0, 3, 0, 0],
      canvas: [{ type: 'ellipse', x: g / 2, y: g / 2, r1: g / 2, r2: g / 2,
        color: farbe || '#888888' }]
    };
  }

  function balken(anteil, breite, farbe) {
    var voll = Math.max(0, Math.min(100, anteil || 0)) / 100 * breite;
    var teile = [{ type: 'rect', x: 0, y: 0, w: breite, h: 5, r: 2.5, color: TON.spur }];
    if (voll > 0.5) {
      teile.push({ type: 'rect', x: 0, y: 0, w: voll, h: 5, r: 2.5,
        color: farbe || '#888888' });
    }
    return { width: breite, margin: [0, 5, 0, 0], canvas: teile };
  }

  function linie(oben, unten) {
    return {
      margin: [0, oben === undefined ? 6 : oben, 0, unten === undefined ? 6 : unten],
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: BREITE, y2: 0,
        lineWidth: 0.75, lineColor: TON.linie }]
    };
  }

  function ueberschrift(text, stufe, umbruch) {
    return {
      text: text,
      style: stufe === 1 ? 'h1' : 'h2',
      headlineLevel: stufe,
      pageBreak: umbruch ? 'before' : undefined
    };
  }

  /* ---------- Gesamtwertung ---------- */

  function rangListe(e) {
    var teile = [];
    var spitze = e.ranking.length ? Math.round(e.ranking[0].prozent) : 0;
    var geteilt = e.ranking.filter(function (r) {
      return Math.round(r.prozent) === spitze;
    }).length;

    e.ranking.forEach(function (r, i) {
      var p = partei(e.datensatz, r.parteiId);
      var wert = Math.round(r.prozent);
      var erste = i < geteilt;
      teile.push({
        margin: [0, 0, 0, 7],
        columns: [
          { width: 16, text: String(i + 1), style: 'rang',
            color: erste ? TON.text : TON.leise },
          tupfer(p.farbe, erste ? 9 : 7),
          { width: 132, text: p.name, bold: erste, fontSize: erste ? 11 : 10 },
          balken(wert, 250, p.farbe),
          { width: '*', text: prozent(r.prozent), alignment: 'right',
            bold: erste, fontSize: erste ? 11 : 10 }
        ],
        columnGap: 7
      });
    });

    if (geteilt > 1) {
      teile.push({
        text: geteilt + ' Parteien erreichen denselben Wert. Ein Vorsprung lässt sich '
          + 'daraus nicht ableiten.',
        style: 'klein', italics: true, margin: [16, 0, 0, 6]
      });
    }
    return { stack: teile, unbreakable: true };
  }

  /* ---------- Themen ---------- */

  function themenTeil(e) {
    /* Kein erzwungener Umbruch: Gesamtwertung und Themenmatrix gehoeren
     * zusammen und fuellen zusammen die erste Seite. Erst Anhang und
     * Quellen beginnen neu. */
    var teile = [{ text: '', margin: [0, 8, 0, 0] }, ueberschrift('Nach Themen', 1)];
    teile.push({
      text: 'Der Themenwert ist die Siegquote einer Partei in den Duellen dieses '
        + 'Themas, in denen sie angetreten ist. Hervorgehoben ist je Thema der '
        + 'höchste Wert. Die Spalten stehen in der Reihenfolge der Gesamtwertung.',
      style: 'klein', margin: [0, 0, 0, 10]
    });

    var aktiv = e.themen.filter(function (t) { return t.gewicht > 0; });
    if (!aktiv.length) { return teile; }

    /* Spaltenreihenfolge aus der Gesamtwertung: so steht in jeder Zeile
     * dieselbe Partei an derselben Stelle, und die Spalten sind von links
     * nach rechts absteigend sortiert. */
    var reihe = e.ranking.map(function (r) { return r.parteiId; });

    var kopf = [{ text: 'Thema', style: 'kopf' }];
    reihe.forEach(function (id) {
      var pa = partei(e.datensatz, id);
      kopf.push({
        style: 'kopf',
        alignment: 'center',
        stack: [
          { canvas: [{ type: 'ellipse', x: 4, y: 3, r1: 3, r2: 3,
            color: pa.farbe || '#888888' }], margin: [0, 0, 0, 1] },
          { text: pa.name, style: 'kopf', alignment: 'center' }
        ]
      });
    });

    var koerper = [kopf];
    aktiv.forEach(function (t) {
      var beiId = {};
      t.werte.forEach(function (w) { beiId[w.parteiId] = w.wert; });
      var hoechster = null;
      reihe.forEach(function (id) {
        var v = beiId[id];
        if (v !== undefined && v !== null && (hoechster === null || v > hoechster)) {
          hoechster = v;
        }
      });

      var zeile = [{
        stack: [
          { text: t.titel, fontSize: 9, bold: true },
          { text: gewichtText(t.gewicht), style: 'quelle' }
        ]
      }];
      reihe.forEach(function (id) {
        var v = beiId[id];
        var da = v !== undefined && v !== null;
        zeile.push({
          text: da ? Math.round(v) + ' %' : '–',
          alignment: 'center',
          fontSize: 9,
          bold: da && v === hoechster,
          color: da ? (v === hoechster ? TON.text : TON.leise) : TON.linie,
          margin: [0, 4, 0, 0]
        });
      });
      koerper.push(zeile);
    });

    var wert = (BREITE - 136) / reihe.length;
    var breiten = [136];
    reihe.forEach(function () { breiten.push(wert); });

    teile.push({
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        dontBreakRows: true,
        widths: breiten,
        body: koerper
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === 1 || i === node.table.body.length) ? 0.75 : 0.4;
        },
        vLineWidth: function () { return 0; },
        hLineColor: function () { return TON.linie; },
        paddingTop: function () { return 5; },
        paddingBottom: function () { return 5; },
        paddingLeft: function (i) { return i === 0 ? 0 : 2; },
        paddingRight: function (i, node) {
          return i === node.table.widths.length - 1 ? 0 : 2;
        }
      }
    });
    return teile;
  }

  /* ---------- Anhang: alle Duelle ----------
   * Ein Duell ein geschlossener Block: die Unterfrage, darunter die beiden
   * Aussagen mit Partei, Fundstelle und der eigenen Wahl. Das ist die
   * vollstaendige Rechenschaft ueber den Durchgang - wer im PDF nachsehen
   * will, warum ein Programm vorn liegt, findet hier jeden einzelnen Klick.
   */
  function duellBlock(e, duell, gewinnerId, kopf) {
    var block = [];
    /* Die Themenueberschrift steckt im selben unbreakable-Block wie das
     * erste Duell. Sonst bleibt sie als letzte Zeile am Seitenfuss stehen:
     * pageBreakBefore hilft dagegen nicht, weil pdfmake dort auch Knoten
     * als "folgend auf dieser Seite" meldet, die gar nicht mehr passen. */
    if (kopf) { block.push(kopf); }
    block.push({
      text: duell.frageText + (gewinnerId ? '' : '  (uebersprungen)'),
      style: 'frage', margin: [0, 0, 0, 5]
    });

    [duell.links, duell.rechts].forEach(function (aussage, i) {
      var p = partei(e.datensatz, aussage.parteiId);
      var gewonnen = gewinnerId === aussage.id;
      block.push({
        margin: [0, i === 0 ? 0 : 7, 0, 2],
        columns: [
          tupfer(p.farbe),
          { width: 'auto', text: p.name, bold: true, fontSize: 9.5 },
          { width: '*', text: wahlText(gewonnen, !!gewinnerId), fontSize: 9.5,
            color: wahlFarbe(gewonnen, !!gewinnerId), bold: gewonnen },
          { width: 'auto', text: 'Seite ' + aussage.quelle.seite, style: 'klein',
            alignment: 'right' }
        ],
        columnGap: 6
      });
      block.push({ text: aussage.kurz, style: 'klein', margin: [14, 0, 0, 0] });
    });

    return { stack: block, unbreakable: true, margin: [0, 0, 0, 13] };
  }

  function anhang(e) {
    /* Auch hier kein erzwungener Umbruch: eine halb leere Seite vor jedem
     * Abschnitt sieht aus wie ein Fehler. Die Linie und der Abstand trennen
     * die Teile deutlich genug. */
    var teile = [linie(14, 12), ueberschrift('Anhang: alle Duelle und Ihre Wahl', 1)];
    teile.push({
      text: 'Die Seitenzahlen verweisen auf die Wahlprogramme im Quellenverzeichnis '
        + 'am Ende.',
      style: 'klein', margin: [0, 0, 0, 10]
    });

    var duelle = e.duelle || [];
    var antworten = e.duellAntworten || {};

    /* Nach Themen gruppieren, in der Reihenfolge des Datensatzes - im
     * Durchgang sind die Duelle absichtlich durchmischt, im Nachschlagewerk
     * waere das nur hinderlich. Das Finale steht als eigener Abschnitt am
     * Ende, weil es zu keinem Thema gehoert. */
    var proThema = {}, finaleDuelle = [];
    duelle.forEach(function (duell, i) {
      if (duell.finale) { finaleDuelle.push({ duell: duell, index: i }); return; }
      (proThema[duell.themaId] = proThema[duell.themaId] || []).push({ duell: duell, index: i });
    });

    e.datensatz.themen.forEach(function (thema) {
      var liste = proThema[thema.id];
      if (!liste || !liste.length) { return; }
      var gewicht = e.gewichte ? e.gewichte[thema.id] : 0;
      var kopf = {
        text: thema.titel + '  ·  ' + gewichtText(gewicht)
          + '  ·  ' + liste.length + (liste.length === 1 ? ' Duell' : ' Duelle'),
        style: 'thema', margin: [0, 6, 0, 8]
      };
      liste.forEach(function (eintrag, i) {
        teile.push(duellBlock(e, eintrag.duell, antworten[eintrag.index], i === 0 ? kopf : null));
      });
    });

    if (finaleDuelle.length) {
      var finaleKopf = {
        text: 'Das Finale  ·  ' + finaleDuelle.length
          + (finaleDuelle.length === 1 ? ' Duell' : ' Duelle'),
        style: 'thema', margin: [0, 6, 0, 8]
      };
      finaleDuelle.forEach(function (eintrag, i) {
        teile.push(duellBlock(e, eintrag.duell, antworten[eintrag.index], i === 0 ? finaleKopf : null));
      });
    }

    return teile;
  }

  /* ---------- Quellen ----------
   * Ohne dieses Verzeichnis ist im ausgedruckten PDF nicht mehr
   * nachvollziehbar, worauf sich die Seitenzahlen im Anhang beziehen. */
  function quellen(e) {
    var d = e.datensatz;
    var teile = [linie(14, 12), ueberschrift('Quellen', 1)];
    teile.push({
      text: 'Alle Aussagen stammen wörtlich aus den folgenden Wahlprogrammen. Die '
        + 'Seitenzahlen im Anhang beziehen sich auf die Seiten dieser PDF-Dateien.'
        + (d.stand ? ' Stand der Erhebung: ' + datumDeutsch(d.stand) + '.' : ''),
      style: 'klein', margin: [0, 0, 0, 12]
    });

    d.parteien.forEach(function (p) {
      var pr = p.programm || {};
      teile.push({
        unbreakable: true,
        margin: [0, 0, 0, 11],
        stack: [
          {
            columns: [
              tupfer(p.farbe),
              { width: '*', text: p.name, style: 'thema' }
            ],
            columnGap: 6
          },
          { text: pr.titel || '(ohne Titel)', style: 'klein', margin: [13, 1, 0, 0] },
          pr.url
            ? { text: pr.url, style: 'quelle', link: pr.url, margin: [13, 1, 0, 0] }
            : { text: 'Fundort nicht dokumentiert', style: 'quelle', margin: [13, 1, 0, 0] },
          { text: 'Datei im Projekt: ' + (pr.datei || '–'), style: 'quelle',
            margin: [13, 1, 0, 0] }
        ]
      });
    });
    return teile;
  }

  /* ---------- Dokument ---------- */

  function dokument(e) {
    var d = e.datensatz;

    var inhalt = [
      { text: 'Seite 47', style: 'marke' },
      { text: 'Ihr Ergebnis', style: 'titel' },
      { text: d.name + '  ·  Wahltag ' + datumDeutsch(d.wahltag), style: 'unter' },
      linie(10, 16),

      ueberschrift('Übereinstimmung insgesamt', 2),
      rangListe(e),

      {
        margin: [0, 10, 0, 0],
        table: {
          widths: ['*'],
          body: [[{
            border: [false, false, false, false],
            fillColor: '#f7f5f0',
            margin: [10, 8, 10, 8],
            stack: [
              { text: 'So wird gerechnet', bold: true, style: 'klein',
                margin: [0, 0, 0, 3] },
              { text: 'Gewertet wird die Siegquote: Wie oft haben Sie ein Programm '
                + 'gewählt, wenn es angetreten ist? Beide Sätze eines Duells '
                + 'beantworten dieselbe Unterfrage. Damit eine einzelne Paarung nicht '
                + 'überzeichnet, zählt ein halber Sieg und eine halbe Niederlage als '
                + 'Vorannahme mit – vier aus vier ergeben deshalb 90 % und nicht '
                + '100 %. Der Gesamtwert ist der mit Ihren Punkten gewichtete '
                + 'Durchschnitt über die Themen. 50 % ist der Münzwurf: darüber '
                + 'wurde ein Programm öfter gewählt als nicht, darunter seltener. '
                + 'Übersprungene Duelle zählen für keine Partei.',
                style: 'klein' },
              { text: e.offeneFragen
                  ? e.offeneFragen + ' von ' + e.fragenGesamt
                    + ' Duellen wurden übersprungen.'
                  : 'Alle ' + e.fragenGesamt + ' Duelle wurden entschieden.',
                style: 'klein', bold: true, margin: [0, 4, 0, 0] }
            ]
          }]]
        },
        layout: 'noBorders'
      }
    ];

    inhalt = inhalt.concat(themenTeil(e)).concat(anhang(e)).concat(quellen(e));

    return {
      pageSize: 'A4',
      pageMargins: [RAND, 46, RAND, 46],
      info: {
        title: 'Seite 47 – Ergebnis ' + d.name,
        creator: 'Seite 47',
        subject: 'Vergleich von Wahlprogrammen'
      },
      content: inhalt,

      /* Eine Überschrift, hinter der auf der Seite nichts mehr steht, wandert
       * mit auf die nächste. Sonst hängt sie allein am Seitenfuß. */
      pageBreakBefore: function (aktuell, folgendeAufSeite) {
        if (!aktuell.headlineLevel) { return false; }
        /* Zwei Faelle: hinter der Ueberschrift kommt auf dieser Seite nichts
         * mehr, oder sie steht so weit unten, dass darunter kein Block mehr
         * Platz haette. Ohne den zweiten Fall bleibt eine Ueberschrift als
         * letzte Zeile am Seitenfuss stehen. */
        if (folgendeAufSeite.length === 0) { return true; }
        var pos = aktuell.startPosition;
        return !!pos && pos.verticalRatio > 0.86;
      },

      header: function (seite) {
        if (seite === 1) { return null; }
        return {
          margin: [RAND, 24, RAND, 0],
          columns: [
            { text: 'Seite 47 · ' + d.name, style: 'fuss' },
            { text: 'Ihr Ergebnis', style: 'fuss', alignment: 'right' }
          ]
        };
      },

      footer: function (seite, anzahl) {
        return {
          margin: [RAND, 12, RAND, 0],
          columns: [
            { text: 'Im Browser erzeugt, ohne Server und ohne Speicherung.',
              style: 'fuss' },
            { text: seite + ' von ' + anzahl, style: 'fuss', alignment: 'right' }
          ]
        };
      },

      defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.3, color: TON.text },
      styles: {
        marke: { fontSize: 9, bold: true, characterSpacing: 1.4, color: TON.leise },
        titel: { fontSize: 26, bold: true, margin: [0, 4, 0, 2] },
        unter: { fontSize: 10.5, color: TON.leise },
        h1: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] },
        h2: { fontSize: 12, bold: true, margin: [0, 4, 0, 9] },
        thema: { fontSize: 11, bold: true },
        frage: { fontSize: 10.5, bold: true },
        rang: { fontSize: 10, bold: true },
        klein: { fontSize: 9, color: TON.text, lineHeight: 1.35 },
        quelle: { fontSize: 8.5, color: TON.leise },
        fuss: { fontSize: 8, color: TON.leise }
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
