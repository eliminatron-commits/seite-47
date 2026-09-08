/* Prueft, dass nach der Maskierung kein Parteiname mehr in einem Text steht,
 * der vor der Aufdeckung im DOM landen kann. */
var fs = require('fs'), vm = require('vm');
var ctx = { console: console }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/daten.js', 'utf8'), ctx, 'daten.js');
var D = ctx.S47_DATA, gesamt = 0, treffer = 0;

function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

process.argv.slice(2).forEach(function (p) {
  var t = fs.readFileSync(p, 'utf8');
  var d = JSON.parse(t.slice(t.indexOf('register(') + 9, t.lastIndexOf(')')));
  var namen = [];
  d.parteien.forEach(function (pa) {
    namen.push(pa.name);
    (pa.alias || []).forEach(function (a) { namen.push(a); });
  });

  d.themen.forEach(function (th) {
    th.fragen.forEach(function (fr) {
      namen.forEach(function (n) {
        var re = new RegExp('(^|[^\\wÄÖÜäöüß])' + escape(n) + '([^\\wÄÖÜäöüß]|$)', 'i');
        if (re.test(fr.text)) { treffer++; console.log('  LECK Fragetext ' + fr.id + ': ' + n); }
        if (re.test(th.titel) || re.test(th.beschreibung || '')) {
          treffer++; console.log('  LECK Thema ' + th.id + ': ' + n);
        }
      });
      fr.aussagen.forEach(function (a) {
        ['kurz', 'original'].forEach(function (feld) {
          gesamt++;
          var maskiert = D.anonymisiere(d, a[feld]);
          namen.forEach(function (n) {
            var re = new RegExp('(^|[^\\wÄÖÜäöüß])' + escape(n) + '([^\\wÄÖÜäöüß]|$)', 'i');
            if (re.test(maskiert)) {
              treffer++;
              console.log('  LECK ' + a.id + ' (' + feld + '): "' + n + '" -> ' + maskiert.slice(0, 120));
            }
          });
        });
      });
    });
  });
});
console.log(gesamt + ' Aussagetexte geprueft, ' + treffer + ' Funde.');
