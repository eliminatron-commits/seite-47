/* Prueft die Spielform: Umfang, Ausgewogenheit, Trennschaerfe, Finale.
 *
 * Simuliert vollstaendige Durchgaenge. Modell: Der Nutzer urteilt ueber
 * Saetze, nicht ueber Parteien - der Reiz eines Satzes ist Parteiaffinitaet
 * plus Rauschen. Bei Rauschen 0 waehlt er immer parteitreu, bei hohem
 * Rauschen fast zufaellig; interessant ist der mittlere Bereich, dort steht
 * der echte Nutzer.
 *
 * Gemessen wird gegen die alte Form (siehe .claude/trennschaerfe.js):
 * dort konnte ein Themenwert nur 0, 50 oder 100 sein, und die Spitze war
 * geteilt. Hier soll die Spanne groesser und der Gleichstand seltener sein.
 *
 * Aufruf:  node .claude/pruefe_duelle.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var WURZEL = path.join(__dirname, '..');
var LAEUFE = 400;

var f = {};
f.window = f; f.self = f;
f.document = { addEventListener: function () {} };
f.setTimeout = setTimeout;
vm.createContext(f);
function lade(rel) {
  vm.runInContext(fs.readFileSync(path.join(WURZEL, rel), 'utf8'), f, { filename: rel });
}
lade('js/daten.js');
lade('js/duelle.js');
lade('data/wahlen.js');

var DU = f.S47_DUELLE;

function mittel(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
function anteil(n, ganz) { return Math.round(n / ganz * 100); }

var fehler = 0;
function pruefe(bedingung, text) {
  if (!bedingung) { fehler++; }
  console.log('   ' + (bedingung ? 'ok   ' : 'FEHL ') + text);
}

['lt-st-2026', 'agh-be-2026', 'lt-mv-2026'].forEach(function (id) {
  lade('data/wahlen/' + id + '.js');
  var d = null;
  f.S47_DATA.lade(id, function (e, x) { d = x; });

  var budget = {};
  d.themen.forEach(function (t) { budget[t.id] = 10; });

  console.log('');
  console.log('== ' + id + '  (' + d.parteien.length + ' Parteien, '
    + d.themen.length + ' Themen)');

  /* ---- Umfang: das Budget darf nur verschieben, nie verlaengern ---- */
  var gleich = DU.plan(d, budget).length;
  var schief = {};
  d.themen.forEach(function (t, i) { schief[t.id] = i === 0 ? 30 : (i < 4 ? 15 : 5); });
  var summeSchief = 0;
  Object.keys(schief).forEach(function (k) { summeSchief += schief[k]; });
  var schiefPlan = DU.plan(d, schief);
  console.log('   Umfang: gleichverteilt ' + gleich + ' Duelle, '
    + 'zugespitzt (' + summeSchief + ' Punkte) ' + schiefPlan.length + ' Duelle');
  pruefe(Math.abs(gleich - d.themen.length * 4) <= 1,
    'gleichverteiltes Budget ergibt 4 Duelle je Thema');

  /* ---- Ausgewogenheit, am Ende UND zwischendurch ----
   * Zwischendurch ist der schaerfere Massstab: Das Feld zeigt waehrend des
   * Spiels einen laufenden Stand und wird beim Zwischenstand zur Wette
   * gemacht. War eine Partei bis dahin neunmal dran und eine andere einmal,
   * fuehrt womoeglich ein einzelner Zufallstreffer das Feld an - und die
   * Frage "wer ist das?" zielt auf ein Artefakt. */
  var spannenEnde = [], spannenMitte = [], seltenste = [], wiederholung = 0, duelleGesamt = 0;
  for (var v = 0; v < 60; v++) {
    var p = DU.plan(d, budget);
    var zahl = {};
    d.parteien.forEach(function (x) { zahl[x.id] = 0; });
    p.forEach(function (duell, k) {
      zahl[duell.links.parteiId]++;
      zahl[duell.rechts.parteiId]++;
      duelleGesamt++;
      if (k > 0 && p[k - 1].frageId === duell.frageId) { wiederholung++; }
      if (k === 12) {
        var m = d.parteien.map(function (x) { return zahl[x.id]; });
        spannenMitte.push(Math.max.apply(null, m) - Math.min.apply(null, m));
        seltenste.push(Math.min.apply(null, m));
      }
    });
    var w = d.parteien.map(function (x) { return zahl[x.id]; });
    spannenEnde.push(Math.max.apply(null, w) - Math.min.apply(null, w));
  }
  var maxEnde = Math.max.apply(null, spannenEnde);
  var maxMitte = Math.max.apply(null, spannenMitte);
  var minSelten = Math.min.apply(null, seltenste);
  console.log('   Auftritte je Partei: Spanne am Ende hoechstens ' + maxEnde
    + ', nach 13 Duellen hoechstens ' + maxMitte
    + ' (seltenste Partei dann mindestens ' + minSelten + ' Auftritte)');
  console.log('   Dieselbe Frage zweimal hintereinander: '
    + wiederholung + ' von ' + duelleGesamt + ' Duellen');
  pruefe(maxEnde <= 2, 'Auftritte am Ende ausgewogen (Spanne hoechstens 2)');
  pruefe(maxMitte <= 2, 'Auftritte auch zwischendurch ausgewogen (Spanne hoechstens 2)');
  pruefe(minSelten >= 3, 'jede Partei ist beim ersten Zwischenstand mindestens 3x angetreten');
  pruefe(wiederholung / duelleGesamt < 0.01, 'so gut wie nie dieselbe Frage zweimal hintereinander');

  /* ---- Trennschaerfe ---- */
  console.log('   Rauschen | Spanne 1. zu letzter | Abstand 1. zu 2. | Gleichstand | Finale');
  [0.5, 1, 1.5, 2].forEach(function (rauschen) {
    var spannenW = [], abstaende = [], gleichstand = 0, finaleOk = 0, finaleLaengen = [];

    for (var n = 0; n < LAEUFE; n++) {
      var affin = {};
      d.parteien.forEach(function (x) { affin[x.id] = Math.random(); });

      var plan = DU.plan(d, budget);
      var antworten = {};
      plan.forEach(function (duell, k) {
        var a = affin[duell.links.parteiId] + (Math.random() - 0.5) * rauschen;
        var b = affin[duell.rechts.parteiId] + (Math.random() - 0.5) * rauschen;
        antworten[k] = a >= b ? duell.links.id : duell.rechts.id;
      });

      var erg = DU.werte(d, plan, antworten, budget);
      var werte = erg.ranking.map(function (r) { return Math.round(r.prozent); });
      spannenW.push(werte[0] - werte[werte.length - 1]);
      abstaende.push(werte[0] - werte[1]);
      if (werte[0] === werte[1]) { gleichstand++; }

      /* Wie lang das Finale werden kann, haengt daran, wie oft sich die
       * beiden Finalisten im Datensatz ueberhaupt zur selben Unterfrage
       * aeussern - gemessen 2 bis 7 Mal je Paar. Zwei Duelle sind der
       * datenseitige Boden; laenger wird es mit jeder zusaetzlichen Frage
       * je Thema. Gefordert wird deshalb nur, dass es ueberhaupt
       * stattfinden kann. */
      var fin = DU.finale(d, erg.ranking[0].parteiId, erg.ranking[1].parteiId, plan, 5);
      finaleLaengen.push(fin.length);
      if (fin.length >= 2) { finaleOk++; }
    }

    console.log('     ' + rauschen.toFixed(1)
      + '     |          ' + Math.round(mittel(spannenW)) + ' %'
      + '          |      ' + mittel(abstaende).toFixed(1) + ' %'
      + '       |     ' + anteil(gleichstand, LAEUFE) + ' %'
      + '     |   ' + mittel(finaleLaengen).toFixed(1) + ' Duelle');

    if (rauschen === 1) {
      pruefe(mittel(abstaende) >= 4,
        'bei mittlerem Rauschen trennt die Spitze um mindestens 4 Punkte');
      pruefe(gleichstand / LAEUFE <= 0.08,
        'Gleichstand an der Spitze in hoechstens 8 % der Durchgaenge');
      pruefe(finaleOk === LAEUFE, 'Finale kommt in jedem Durchgang zustande (mind. 2 Duelle)');
    }
  });
});

/* ---- Die Umfangsstufen ----
 * Jede angebotene Stufe muss ein brauchbares Ergebnis liefern. Eine Stufe,
 * die haeufig im Gleichstand endet, waere keine Wahlmoeglichkeit, sondern
 * eine Falle - gemessen bricht die Trennschaerfe unterhalb von drei Duellen
 * je Thema ein (bei zwei Duellen je Thema: 21 bis 25 % geteilte Spitze,
 * dasselbe Niveau wie in der alten Form).
 */
console.log('');
console.log('== Umfangsstufen');
DU.UMFAENGE.forEach(function (stufe) {
  var zeile = [];
  var schlimmste = 0;
  ['lt-st-2026', 'agh-be-2026', 'lt-mv-2026'].forEach(function (id) {
    lade('data/wahlen/' + id + '.js');
    var d = null;
    f.S47_DATA.lade(id, function (e, x) { d = x; });
    var budget = {};
    d.themen.forEach(function (t) { budget[t.id] = 10; });

    var gleich = 0, laenge = 0;
    for (var n = 0; n < 300; n++) {
      var affin = {};
      d.parteien.forEach(function (x) { affin[x.id] = Math.random(); });
      var plan = DU.plan(d, budget, null, stufe.id);
      laenge = plan.length;
      var antworten = {};
      plan.forEach(function (duell, k) {
        var a = affin[duell.links.parteiId] + (Math.random() - 0.5);
        var b = affin[duell.rechts.parteiId] + (Math.random() - 0.5);
        antworten[k] = a >= b ? duell.links.id : duell.rechts.id;
      });
      var werte = DU.werte(d, plan, antworten, budget).ranking
        .map(function (r) { return Math.round(r.prozent); });
      if (werte[0] === werte[1]) { gleich++; }
    }
    var anteilGleich = Math.round(gleich / 300 * 100);
    schlimmste = Math.max(schlimmste, anteilGleich);
    zeile.push(laenge + ' Duelle / ' + anteilGleich + ' %');
  });
  console.log('   ' + stufe.name + ' (Faktor ' + stufe.faktor + '): ' + zeile.join(',  '));
  pruefe(schlimmste <= 15,
    'Stufe "' + stufe.name + '" bleibt unter 15 % Gleichstand an der Spitze');
});

console.log('');
if (fehler) {
  console.log(fehler + ' Befund(e).');
  process.exit(1);
}
console.log('Spielform bestaetigt.');
