/* Erzeugt ein Beispiel-PDF ausserhalb des Browsers, damit sich der Satz
 * ansehen und pruefen laesst (Seitenumbrueche, Dichte, Weissraum).
 *
 * Die App laeuft im Browser; hier werden dieselben Dateien mit einem
 * minimalen window-Ersatz geladen. Nichts davon gehoert zur Auslieferung.
 *
 * Aufruf: node .claude/baue_pdf.js <wahlId> [zieldatei]
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var wurzel = path.join(__dirname, '..');
var wahlId = process.argv[2] || 'lt-st-2026';
var ziel = process.argv[3] || path.join(__dirname, 'muster.pdf');

/* Ein Fenster-Ersatz, der fuer die reinen Datenskripte und pdfmake reicht. */
var fenster = {};
fenster.window = fenster;
fenster.self = fenster;
fenster.global = fenster;
fenster.navigator = { userAgent: 'node' };
fenster.document = {
  createElement: function () { return { style: {}, getContext: function () { return null; } }; },
  createElementNS: function () { return { style: {} }; },
  documentElement: { style: {} },
  head: { appendChild: function () {} },
  body: { appendChild: function () {} },
  addEventListener: function () {},
  getElementById: function () { return null; }
};
fenster.location = { href: 'file:///', protocol: 'file:' };
fenster.setTimeout = setTimeout;
fenster.clearTimeout = clearTimeout;
fenster.matchMedia = function () { return { matches: false, addListener: function () {} }; };
fenster.Buffer = Buffer;
fenster.process = process;
fenster.require = require;

var raum = vm.createContext(fenster);

function lade(rel) {
  var quelle = fs.readFileSync(path.join(wurzel, rel), 'utf8');
  vm.runInContext(quelle, raum, { filename: rel });
}

lade('vendor/pdfmake/pdfmake.min.js');
lade('vendor/pdfmake/vfs_fonts.js');
lade('js/daten.js');
lade('js/auswertung.js');
lade('js/export.js');

lade('data/wahlen.js');
lade('data/wahlen/' + wahlId + '.js');

var D = fenster.S47_DATA;
var A = fenster.S47_AUSWERTUNG;

var datensatz = null;
D.lade(wahlId, function (fehler, d) {
  if (fehler) { throw fehler; }
  datensatz = d;
});
if (!datensatz) { throw new Error('Datensatz nicht geladen: ' + wahlId); }

/* Antworten erzeugen: immer die erste Aussage am ehesten, die zweite am
 * wenigsten. Reicht, um jeden Zweig des Satzes zu fuellen. */
var gewichte = {};
var antworten = {};
datensatz.themen.forEach(function (t) {
  gewichte[t.id] = A.PUNKTE_JE_THEMA;
  t.fragen.forEach(function (f) {
    antworten[f.id] = {
      beste: f.aussagen[0].id,
      schlechteste: f.aussagen[1].id
    };
  });
});

var erg = A.berechne(datensatz, gewichte, antworten);
var def = fenster.S47_EXPORT._dokument({
  datensatz: datensatz,
  ranking: erg.ranking,
  themen: erg.themen,
  offeneFragen: erg.offeneFragen,
  fragenGesamt: erg.fragenGesamt,
  gewichte: gewichte,
  antworten: antworten
});

fenster.pdfMake.createPdf(def).getBuffer(function (puffer) {
  fs.writeFileSync(ziel, Buffer.from(puffer));
  console.log('geschrieben: ' + ziel + ' (' + Math.round(puffer.byteLength / 1024) + ' kB)');
});
