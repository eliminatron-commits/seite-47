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
lade('js/duelle.js');
lade('js/export.js');

lade('data/wahlen.js');
lade('data/wahlen/' + wahlId + '.js');

var D = fenster.S47_DATA;

var datensatz = null;
D.lade(wahlId, function (fehler, d) {
  if (fehler) { throw fehler; }
  datensatz = d;
});
if (!datensatz) { throw new Error('Datensatz nicht geladen: ' + wahlId); }

/* Einen vollstaendigen Durchgang nachstellen: gleichverteiltes Budget, ein
 * Duellplan wie in der App, jedes zweite Duell an die linke Seite entschieden
 * und jedes zehnte uebersprungen - so laeuft der Satz durch alle Zweige,
 * einschliesslich "uebersprungen". Am Ende noch ein Finale, damit auch der
 * Finale-Abschnitt im Anhang geprueft wird. */
var DU = fenster.S47_DUELLE;
var gewichte = DU.startGewichte(datensatz);

var duelle = DU.plan(datensatz, gewichte);
var antworten = {};
duelle.forEach(function (duell, i) {
  if (i % 10 === 9) { return; }
  antworten[i] = (i % 2 === 0 ? duell.links : duell.rechts).id;
});

var vorlauf = DU.werte(datensatz, duelle, antworten, gewichte);
DU.finale(datensatz, vorlauf.ranking[0].parteiId, vorlauf.ranking[1].parteiId,
  duelle, 5).forEach(function (duell) {
  antworten[duelle.length] = duell.links.id;
  duelle.push(duell);
});

var erg = DU.werte(datensatz, duelle, antworten, gewichte);
var def = fenster.S47_EXPORT._dokument({
  datensatz: datensatz,
  ranking: erg.ranking,
  themen: erg.themen,
  offeneFragen: erg.duelleGesamt - erg.gespielt,
  fragenGesamt: erg.duelleGesamt,
  gewichte: gewichte,
  duelle: duelle,
  duellAntworten: antworten
});

fenster.pdfMake.createPdf(def).getBuffer(function (puffer) {
  fs.writeFileSync(ziel, Buffer.from(puffer));

  /* Den gespielten Plan danebenlegen. pruefe_pdf.py kann ihn nicht aus dem
   * Datensatz herleiten: welche Paarungen ueberhaupt vorkommen, entscheidet
   * sich erst beim Bauen des Plans, und nur diese Bloecke stehen im PDF. */
  var neben = ziel.replace(/\.pdf$/, '.plan.json');
  fs.writeFileSync(neben, JSON.stringify({
    wahlId: wahlId,
    duelle: duelle.map(function (duell, i) {
      return {
        frageText: duell.frageText,
        finale: !!duell.finale,
        gespielt: !!antworten[i],
        aussagen: [duell.links.kurz, duell.rechts.kurz]
      };
    })
  }, null, 1), 'utf8');

  console.log('geschrieben: ' + ziel + ' (' + Math.round(puffer.byteLength / 1024) + ' kB)'
    + ', Plan: ' + duelle.length + ' Duelle');
});
