/* Prueft das Glossar der Datensaetze.
 *
 * Gesucht wird, was schiefgehen kann, ohne dass es jemandem auffaellt:
 *  - ein Begriff im Datensatz, der nirgends vorkommt (tote Erklaerung),
 *  - eine Erklaerung, die einen Parteinamen nennt (waere eine Aufdeckung),
 *  - eine Erklaerung, die zu lang ist (die Blase soll man im Vorbeigehen
 *    lesen koennen, nicht studieren),
 *  - ein Begriff, der nur im Wortlaut steht: der ist zuschaltbar, die Zeile
 *    unter den Karten richtet sich aber nach der gezeigten Fassung.
 *
 * NICHT geprueft wird, ob ein erklaerungsbeduerftiges Wort FEHLT - das sieht
 * nur ein Mensch, der die Fragen am Stueck liest.
 *
 * Aufruf:  node .claude/pruefe_begriffe.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var WURZEL = path.join(__dirname, '..');
var HOECHSTLAENGE = 260;

var f = {};
f.window = f; f.self = f;
vm.createContext(f);
function lade(rel) {
  vm.runInContext(fs.readFileSync(path.join(WURZEL, rel), 'utf8'), f, { filename: rel });
}
lade('js/daten.js');
lade('js/begriffe.js');
lade('data/wahlen.js');

var B = f.S47_BEGRIFF;
var fehler = 0, warnungen = 0;

f.S47_MANIFEST.forEach(function (w) {
  lade(w.datei);
  var d = null;
  f.S47_DATA.lade(w.id, function (e, x) { d = x; });
  if (!d) { console.log('FEHL ' + w.id + ': Datensatz nicht ladbar'); fehler++; return; }

  console.log('');
  console.log('== ' + d.id + '  (' + (d.begriffe || []).length + ' Begriffe)');

  var fragen = [], kurz = [], wortlaut = [];
  d.themen.forEach(function (t) {
    t.fragen.forEach(function (fr) {
      fragen.push(fr.text);
      fr.aussagen.forEach(function (a) { kurz.push(a.kurz); wortlaut.push(a.original); });
    });
  });

  var namen = [];
  d.parteien.forEach(function (p) {
    namen.push(p.name);
    (p.alias || []).forEach(function (a) { namen.push(a); });
  });

  (d.begriffe || []).forEach(function (b) {
    var inFrage = B.finde(fragen, [b]).length;
    var inKurz = B.finde(kurz, [b]).length;
    var imWortlaut = B.finde(wortlaut, [b]).length;

    if (!inFrage && !inKurz && !imWortlaut) {
      console.log('   FEHL "' + b.wort + '" kommt nirgends vor');
      fehler++;
    } else if (!inFrage && !inKurz) {
      console.log('   HINW "' + b.wort + '" steht nur im Wortlaut – '
        + 'in der Zeile unter den Karten erscheint er nur mit zugeschaltetem Zitat');
      warnungen++;
    }

    if (b.erklaerung.length > HOECHSTLAENGE) {
      console.log('   FEHL "' + b.wort + '": Erklaerung ' + b.erklaerung.length
        + ' Zeichen (hoechstens ' + HOECHSTLAENGE + ')');
      fehler++;
    }

    namen.forEach(function (n) {
      var muster = new RegExp('(^|[^0-9A-Za-zÄÖÜäöüß])'
        + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        + '([^0-9A-Za-zÄÖÜäöüß]|$)');
      if (muster.test(b.erklaerung)) {
        console.log('   FEHL "' + b.wort + '": Erklaerung nennt ' + n);
        fehler++;
      }
    });
  });

  var ohne = fragen.filter(function (t) { return !B.finde([t], d.begriffe || []).length; });
  console.log('   ' + (fragen.length - ohne.length) + ' von ' + fragen.length
    + ' Fragen tragen mindestens einen Begriff');
});

console.log('');
console.log(fehler ? fehler + ' Fehler, ' + warnungen + ' Hinweise.'
  : 'Glossar in Ordnung' + (warnungen ? ' (' + warnungen + ' Hinweise).' : '.'));
process.exit(fehler ? 1 : 0);
