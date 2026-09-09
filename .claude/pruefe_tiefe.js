/* Ausgewogenheit unter "Tiefe folgt den Punkten".
 *
 * Seit A.fragenTiefe() entscheidet, wie viele Fragen eines Themas gestellt
 * werden, ist die REIHENFOLGE der Fragen innerhalb eines Themas
 * bedeutungstragend: die erste Frage wird am haeufigsten gestellt, die dritte
 * am seltensten. Damit reicht die alte Ausgewogenheitsregel nicht mehr aus -
 * sie zaehlt ueber alle Fragen und merkt nicht, wenn eine Partei systematisch
 * in den dritten Fragen sitzt.
 *
 * Geprueft wird deshalb je Praefixlaenge k (nur erste Frage / erste zwei /
 * alle): Wie oft tritt jede Partei ueber ALLE Themen hinweg an?
 *
 * Warum ueber alle Themen und nicht je Thema: Bei 3-4 Aussagen je Frage und 7
 * Parteien kann eine einzelne Frage nie alle Parteien zeigen - je Thema waere
 * die Regel bei k=1 grundsaetzlich verletzt. Ausschlaggebend ist ohnehin die
 * Gesamtwertung, und die summiert ueber die Themen.
 *
 * Aufruf:  node .claude/pruefe_tiefe.js data/wahlen/*.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

/* Toleranz: um wie viel darf die haeufigste Partei die seltenste ueberholen?
 * Nicht 1 wie bei der Auftrittsregel je Thema - ueber 9-10 Themen summieren
 * sich unvermeidbare Einzelabweichungen. Gemessen wurde die Spanne der
 * heutigen Datensaetze; 3 laesst Luft, ohne eine Schieflage durchzulassen. */
var TOLERANZ = 3;

function datensatz(pfad) {
  var roh = fs.readFileSync(pfad, 'utf8');
  var anfang = roh.indexOf('register(') + 'register('.length;
  var ende = roh.lastIndexOf(')');
  return JSON.parse(roh.slice(anfang, ende).trim().replace(/;$/, ''));
}

function auftritte(d, k) {
  var zahl = {};
  d.parteien.forEach(function (p) { zahl[p.id] = 0; });
  d.themen.forEach(function (t) {
    t.fragen.slice(0, k).forEach(function (fr) {
      fr.aussagen.forEach(function (a) { zahl[a.parteiId] = (zahl[a.parteiId] || 0) + 1; });
    });
  });
  return zahl;
}

var dateien = process.argv.slice(2);
if (!dateien.length) {
  console.error('Aufruf: node .claude/pruefe_tiefe.js data/wahlen/*.js');
  process.exit(2);
}

var fehler = 0;
dateien.forEach(function (pfad) {
  var d = datensatz(pfad);
  var maxFragen = d.themen.reduce(function (m, t) {
    return Math.max(m, t.fragen.length);
  }, 0);
  console.log(path.basename(pfad, '.js') + '  (' + d.themen.length + ' Themen, bis '
    + maxFragen + ' Fragen je Thema)');

  for (var k = 1; k <= maxFragen; k++) {
    var zahl = auftritte(d, k);
    var werte = d.parteien.map(function (p) { return zahl[p.id]; });
    var min = Math.min.apply(null, werte);
    var max = Math.max.apply(null, werte);
    var spanne = max - min;
    var schlimmste = d.parteien.filter(function (p) {
      return zahl[p.id] === min || zahl[p.id] === max;
    }).map(function (p) { return p.id + ' ' + zahl[p.id]; }).join(', ');

    var ok = spanne <= TOLERANZ;
    if (!ok) { fehler++; }
    console.log('   ' + (ok ? 'ok   ' : 'FEHL ') + 'erste ' + k + ' Frage(n) je Thema: '
      + 'Auftritte ' + min + '-' + max + ' (Spanne ' + spanne + ', erlaubt ' + TOLERANZ + ')'
      + (ok ? '' : '  ->  ' + schlimmste));
  }
});

console.log('');
if (fehler) {
  console.log(fehler + ' Verstoss/Verstoesse. Fragen innerhalb der betroffenen Themen '
    + 'umsortieren, bis die Praefixe tragen - der Inhalt aendert sich dabei nicht.');
  process.exit(1);
}
console.log('Alle Praefixe ausgewogen.');
