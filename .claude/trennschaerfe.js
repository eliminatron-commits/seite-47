/* Wie stark trennt die heutige Rechnung?
 *
 * Modell: Der Nutzer urteilt ueber Saetze, nicht ueber Parteien. Der Reiz
 * eines Satzes ist Parteiaffinitaet + Rauschen. Bei Rauschen 0 waehlt er
 * immer parteitreu, bei hohem Rauschen fast zufaellig. Interessant ist der
 * mittlere Bereich - dort steht der echte Nutzer.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var wurzel = process.argv[2];
var f = {}; f.window = f; f.self = f; f.document = { addEventListener: function () {} };
f.setTimeout = setTimeout;
var raum = vm.createContext(f);
function lade(rel) { vm.runInContext(fs.readFileSync(path.join(wurzel, rel), 'utf8'), raum, { filename: rel }); }
lade('js/daten.js'); lade('js/auswertung.js'); lade('data/wahlen.js');

function mittel(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }

['lt-st-2026'].forEach(function (id) {
  lade('data/wahlen/' + id + '.js');
  var d = null;
  f.S47_DATA.lade(id, function (e, x) { d = x; });

  console.log('== ' + id + ' (' + d.parteien.length + ' Parteien, '
    + d.themen.length + ' Themen)');
  console.log('Rauschen | Spanne 1. zu 7. | Abstand 1. zu 2. | Lieblingspartei gewinnt | Gleichstand an der Spitze');

  [0, 0.5, 1, 1.5, 2, 3].forEach(function (rauschen) {
    var laeufe = 600, spannen = [], abstaende = [], treffer = 0, gleich = 0;

    for (var n = 0; n < laeufe; n++) {
      var affin = {};
      d.parteien.forEach(function (p) { affin[p.id] = Math.random(); });
      var liebling = Object.keys(affin).sort(function (a, b) { return affin[b] - affin[a]; })[0];

      var gewichte = {}, antworten = {};
      d.themen.forEach(function (t) {
        gewichte[t.id] = 50;
        t.fragen.forEach(function (fr) {
          var bewertet = fr.aussagen.map(function (a) {
            return { id: a.id, reiz: affin[a.parteiId] + (Math.random() - 0.5) * rauschen };
          }).sort(function (a, b) { return b.reiz - a.reiz; });
          antworten[fr.id] = {
            beste: bewertet[0].id,
            schlechteste: bewertet[bewertet.length - 1].id
          };
        });
      });

      var erg = f.S47_AUSWERTUNG.berechne(d, gewichte, antworten);
      var werte = erg.ranking.map(function (r) { return Math.round(r.prozent); });
      spannen.push(werte[0] - werte[werte.length - 1]);
      abstaende.push(werte[0] - werte[1]);
      if (erg.ranking[0].parteiId === liebling) { treffer++; }
      if (werte[0] === werte[1]) { gleich++; }
    }

    console.log('  ' + rauschen.toFixed(1)
      + '     |      ' + Math.round(mittel(spannen)) + ' %'
      + '       |       ' + mittel(abstaende).toFixed(1) + ' %'
      + '        |        ' + Math.round(treffer / laeufe * 100) + ' %'
      + '         |        ' + Math.round(gleich / laeufe * 100) + ' %');
  });

  /* Wie viele verschiedene Endwerte sind ueberhaupt moeglich?
   * Jede Partei kommt je Thema genau einmal vor -> Themenwert nur 0/50/100. */
  var moeglich = {};
  d.themen.forEach(function (t) {
    var proPartei = {};
    t.fragen.forEach(function (fr) {
      fr.aussagen.forEach(function (a) {
        proPartei[a.parteiId] = (proPartei[a.parteiId] || 0) + 1;
      });
    });
    Object.keys(proPartei).forEach(function (p) {
      moeglich[proPartei[p]] = (moeglich[proPartei[p]] || 0) + 1;
    });
  });
  console.log('Auftritte je Partei und Thema:', JSON.stringify(moeglich),
    '-> Themenwert kann nur 0, 50 oder 100 sein');
});
