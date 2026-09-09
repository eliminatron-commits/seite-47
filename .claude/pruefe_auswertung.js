/* Handrechnung gegen S47_AUSWERTUNG.berechne. */
var fs = require('fs'), vm = require('vm');
var ctx = { console: console }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/auswertung.js', 'utf8'), ctx, 'auswertung.js');
var A = ctx.S47_AUSWERTUNG;

function aussage(id, partei) {
  return { id: id, parteiId: partei, kurz: 'x', original: 'x',
           quelle: { datei: 'x', seite: 1, markierung: 'x' } };
}
var d = {
  schemaVersion: 2, id: 't', name: 'Test', region: 'T', wahltag: '2026-01-01',
  parteien: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
  themen: [
    { id: 'T1', titel: 'T1', fragen: [
      { id: 'xx-f001', text: 'f1', aussagen: [aussage('xx-a001','a'), aussage('xx-a002','b'), aussage('xx-a003','c'), aussage('xx-a004','d')] },
      { id: 'xx-f002', text: 'f2', aussagen: [aussage('xx-a005','a'), aussage('xx-a006','b'), aussage('xx-a007','c')] }
    ] },
    { id: 'T2', titel: 'T2', fragen: [
      { id: 'xx-f003', text: 'f3', aussagen: [aussage('xx-a008','a'), aussage('xx-a009','b'), aussage('xx-a010','d')] }
    ] }
  ]
};

var faelle = [];
function pruefe(name, ist, soll) {
  var ok = Math.abs(ist - soll) < 1e-9;
  faelle.push((ok ? 'OK   ' : 'FEHL ') + name + ': ' + ist + ' (erwartet ' + soll + ')');
  return ok;
}

/* Fall 1: alles beantwortet, Gewichte gleich.
 * f1: a=beste(100), d=schlechteste(0), b und c dazwischen (50)
 * f2: c=beste(100), a=schlechteste(0), b=50
 * f3: b=beste(100), d=schlechteste(0), a=50
 * T1: a=(100+0)/2=50, b=(50+50)/2=50, c=(50+100)/2=75, d=0/1=0
 * T2: a=50, b=100, d=0
 * Gewichte 50/50 -> Gesamt = Mittel der Themenwerte
 * a=(50+50)/2=50  b=(50+100)/2=75  c=75 (nur T1)  d=(0+0)/2=0
 */
var antworten = {
  'xx-f001': { beste: 'xx-a001', schlechteste: 'xx-a004' },
  'xx-f002': { beste: 'xx-a007', schlechteste: 'xx-a005' },
  'xx-f003': { beste: 'xx-a009', schlechteste: 'xx-a010' }
};
var e = A.berechne(d, { T1: 50, T2: 50 }, antworten);
var nach = {}; e.ranking.forEach(function (r) { nach[r.parteiId] = r.prozent; });
var alle = true;
alle &= pruefe('a gesamt', nach.a, 50);
alle &= pruefe('b gesamt', nach.b, 75);
alle &= pruefe('c gesamt', nach.c, 75);
alle &= pruefe('d gesamt', nach.d, 0);
alle &= pruefe('offene Fragen', e.offeneFragen, 0);
alle &= pruefe('Fragen gesamt', e.fragenGesamt, 3);

/* Fall 2: T2 ausgeschlossen (Gewicht 0) -> nur T1 zaehlt, und f3 wird nicht
 * mitgezaehlt. a=50, b=50, c=75, d=0 */
var e2 = A.berechne(d, { T1: 50, T2: 0 }, antworten);
var n2 = {}; e2.ranking.forEach(function (r) { n2[r.parteiId] = r.prozent; });
alle &= pruefe('T2 aus: b gesamt', n2.b, 50);
alle &= pruefe('T2 aus: Fragen gezaehlt', e2.fragenGesamt, 2);

/* Fall 3: ungleiche Gewichte, jetzt in Punkten. T1=20, T2=10.
 * b: (20*50 + 10*100)/30 = 2000/30 = 66,67 */
var e3 = A.berechne(d, { T1: 20, T2: 10 }, antworten);
var n3 = {}; e3.ranking.forEach(function (r) { n3[r.parteiId] = r.prozent; });
alle &= pruefe('Punkte 20/10: b', n3.b, 2000 / 30);

/* Fall 3b: Tiefe folgt den Punkten. Unter 10 Punkten wird nur die erste Frage
 * eines Themas gestellt - sie gilt dann nicht als offen, sondern als nicht
 * Teil des Durchgangs. */
alle &= pruefe('Tiefe bei 0 Punkten', A.fragenTiefe(0, 3), 0);
alle &= pruefe('Tiefe bei 5 Punkten', A.fragenTiefe(5, 3), 1);
alle &= pruefe('Tiefe bei 10 Punkten', A.fragenTiefe(10, 3), 2);
alle &= pruefe('Tiefe bei 15 Punkten', A.fragenTiefe(15, 3), 2);
alle &= pruefe('Tiefe bei 20 Punkten', A.fragenTiefe(20, 3), 3);
alle &= pruefe('Tiefe gedeckelt durch Vorrat', A.fragenTiefe(30, 2), 2);
var e3c = A.berechne(d, { T1: 5, T2: 10 }, antworten);
alle &= pruefe('T1 flach: Fragen gezaehlt', e3c.fragenGesamt, 2);
alle &= pruefe('T1 flach: offene Fragen', e3c.offeneFragen, 0);
var e3d = A.berechne(d, { T1: 20, T2: 10 }, antworten);
alle &= pruefe('T1 tief: Fragen gezaehlt', e3d.fragenGesamt, 3);

/* Fall 3e: Startlage verteilt das Budget gleich und ergibt 2 Fragen je Thema. */
var start = A.startPunkte(d);
alle &= pruefe('Budget', A.budget(d), 20);
alle &= pruefe('Startpunkte je Thema', start.T1, 10);

/* Fall 4: halbe Antwort zaehlt nicht. */
var e4 = A.berechne(d, { T1: 50, T2: 50 }, {
  'xx-f001': { beste: 'xx-a001' },
  'xx-f002': antworten['xx-f002'], 'xx-f003': antworten['xx-f003']
});
var n4 = {}; e4.ranking.forEach(function (r) { n4[r.parteiId] = r.prozent; });
alle &= pruefe('halbe Antwort: offene Fragen', e4.offeneFragen, 1);
/* T1 nur noch aus f2: a=0, b=50, c=100; d faellt aus T1 heraus -> d nur T2=0 */
alle &= pruefe('halbe Antwort: a gesamt', n4.a, (0 + 50) / 2);
alle &= pruefe('halbe Antwort: d gesamt', n4.d, 0);

/* Fall 5: gar nichts beantwortet -> niemand im Ranking. */
var e5 = A.berechne(d, { T1: 50, T2: 50 }, {});
alle &= pruefe('ohne Antworten: Ranking leer', e5.ranking.length, 0);

faelle.forEach(function (z) { console.log(z); });
console.log(alle ? '\nAlle Handrechnungen bestaetigt.' : '\nABWEICHUNGEN GEFUNDEN.');
process.exit(alle ? 0 : 1);
