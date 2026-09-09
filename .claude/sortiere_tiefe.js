/* Fragenreihenfolge innerhalb der Themen so drehen, dass auch die Praefixe
 * ausgewogen sind (siehe .claude/pruefe_tiefe.js und CLAUDE.md Punkt 12).
 *
 * Erlaubt ist nur das Umsortieren der Fragen INNERHALB eines Themas. Beide
 * Fragen gehoeren ohnehin zu diesem Thema, es geht keine Zuordnung verloren
 * und kein Text aendert sich - nur, welche Frage zuerst gestellt wird, wenn
 * das Thema wenige Punkte bekommt.
 *
 * Gesucht wird die Anordnung, die die Spanne der Auftritte ueber alle
 * Praefixlaengen minimiert. Bei 9-10 Themen mit je 2 Fragen sind das 512-1024
 * Moeglichkeiten - vollstaendig durchgerechnet, kein Naeherungsverfahren
 * noetig. Bei drei Fragen je Thema waeren es 6^10; dann greift der
 * Zufallsteil unten (viele Ziehungen, beste behalten).
 *
 * Aufruf:  node .claude/sortiere_tiefe.js data/wahlen/lt-st-2026.js [--schreiben]
 */
'use strict';
var fs = require('fs');

var pfad = process.argv[2];
var schreiben = process.argv.indexOf('--schreiben') > -1;
if (!pfad) {
  console.error('Aufruf: node .claude/sortiere_tiefe.js <datensatz.js> [--schreiben]');
  process.exit(2);
}

var roh = fs.readFileSync(pfad, 'utf8');
var anfang = roh.indexOf('register(') + 'register('.length;
var ende = roh.lastIndexOf(')');
var kopf = roh.slice(0, anfang);
var fuss = roh.slice(ende);
var d = JSON.parse(roh.slice(anfang, ende).trim().replace(/;$/, ''));

var parteien = d.parteien.map(function (p) { return p.id; });
var maxFragen = d.themen.reduce(function (m, t) { return Math.max(m, t.fragen.length); }, 0);

/* Guete einer Anordnung: Summe der Spannen ueber alle Praefixlaengen, wobei
 * kurze Praefixe schwerer wiegen - die erste Frage wird am haeufigsten
 * gestellt und richtet den groessten Schaden an. */
function guete(ordnungen) {
  var summe = 0;
  for (var k = 1; k <= maxFragen; k++) {
    var zahl = {};
    parteien.forEach(function (p) { zahl[p] = 0; });
    d.themen.forEach(function (t, ti) {
      ordnungen[ti].slice(0, k).forEach(function (fi) {
        t.fragen[fi].aussagen.forEach(function (a) { zahl[a.parteiId]++; });
      });
    });
    var werte = parteien.map(function (p) { return zahl[p]; });
    var spanne = Math.max.apply(null, werte) - Math.min.apply(null, werte);
    summe += spanne * (maxFragen - k + 1);
  }
  return summe;
}

function permutationen(n) {
  if (n === 1) { return [[0]]; }
  var aus = [];
  permutationen(n - 1).forEach(function (rest) {
    for (var i = 0; i < n; i++) {
      var kopie = rest.slice();
      kopie.splice(i, 0, n - 1);
      aus.push(kopie);
    }
  });
  return aus;
}

var kandidaten = d.themen.map(function (t) { return permutationen(t.fragen.length); });
var gesamt = kandidaten.reduce(function (s, k) { return s * k.length; }, 1);

var beste = d.themen.map(function (t) {
  return t.fragen.map(function (_, i) { return i; });
});
var bestwert = guete(beste);
var start = bestwert;

if (gesamt <= 200000) {
  /* Vollstaendig durchzaehlen. */
  var zaehler = d.themen.map(function () { return 0; });
  for (var n = 0; n < gesamt; n++) {
    var ordnung = zaehler.map(function (z, ti) { return kandidaten[ti][z]; });
    var g = guete(ordnung);
    if (g < bestwert) { bestwert = g; beste = ordnung.map(function (o) { return o.slice(); }); }
    for (var ti = 0; ti < zaehler.length; ti++) {
      zaehler[ti]++;
      if (zaehler[ti] < kandidaten[ti].length) { break; }
      zaehler[ti] = 0;
    }
  }
  console.log(gesamt + ' Anordnungen vollstaendig geprueft.');
} else {
  for (var v = 0; v < 200000; v++) {
    var zufall = kandidaten.map(function (k) {
      return k[Math.floor(Math.random() * k.length)];
    });
    var gz = guete(zufall);
    if (gz < bestwert) { bestwert = gz; beste = zufall.map(function (o) { return o.slice(); }); }
  }
  console.log('200000 Ziehungen aus ' + gesamt + ' Anordnungen.');
}

console.log('Guete vorher ' + start + ', nachher ' + bestwert + '.');
d.themen.forEach(function (t, ti) {
  var gedreht = beste[ti].some(function (fi, i) { return fi !== i; });
  if (gedreht) {
    console.log('   gedreht: ' + t.titel + '  -> ' + beste[ti].map(function (fi) {
      return t.fragen[fi].id;
    }).join(', '));
  }
});

if (!schreiben) {
  console.log('\nNichts geschrieben. Mit --schreiben uebernehmen.');
  process.exit(0);
}

d.themen.forEach(function (t, ti) {
  t.fragen = beste[ti].map(function (fi) { return t.fragen[fi]; });
});
/* Formatierung wie gehabt: Zeilenumbruch nach register( und vor ). */
fs.writeFileSync(pfad, kopf + '\n' + JSON.stringify(d, null, 2) + '\n' + fuss, 'utf8');
console.log('\n' + pfad + ' geschrieben.');
