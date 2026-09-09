# -*- coding: utf-8 -*-
import io

# ---------- duelle.js: Umfangsfaktor ----------
s = io.open('js/duelle.js', encoding='utf-8').read()

alt = u'''  function duelleFuerPunkte(punkte, vorrat) {
    if (!punkte || punkte <= 0) { return 0; }
    return Math.max(1, Math.min(vorrat, Math.round(punkte / PUNKTE_JE_DUELL)));
  }'''
neu = u'''  /* ---------- Umfang ----------
   * Das Budget verschiebt nur die Aufmerksamkeit, es verlängert nie - genau
   * das soll ein Budget tun. Damit hatte der Nutzer aber keinen Hebel für die
   * Länge, und die Länge ist der häufigste Grund abzubrechen. Deshalb ein
   * eigener, ehrlicher Regler daneben: drei Stufen, die die Zahl der Duelle
   * halbieren, lassen oder anderthalbfachen.
   *
   * Die Stufen ändern nichts an der Rechnung, nur an der Datenmenge, auf der
   * sie beruht. Kurz heißt: weniger Duelle je Partei, also gröbere Quoten -
   * das steht auch so auf dem Bildschirm.
   */
  var UMFAENGE = [
    { id: 'kurz', name: 'Kurz', faktor: 0.5 },
    { id: 'normal', name: 'Normal', faktor: 1 },
    { id: 'gruendlich', name: 'Gründlich', faktor: 1.5 }
  ];

  function faktorVon(umfangId) {
    for (var i = 0; i < UMFAENGE.length; i++) {
      if (UMFAENGE[i].id === umfangId) { return UMFAENGE[i].faktor; }
    }
    return 1;
  }

  function duelleFuerPunkte(punkte, vorrat, umfangId) {
    if (!punkte || punkte <= 0) { return 0; }
    var n = Math.round(punkte * faktorVon(umfangId) / PUNKTE_JE_DUELL);
    return Math.max(1, Math.min(vorrat, n));
  }'''
assert alt in s, 'duelleFuerPunkte-Anker fehlt'
s = s.replace(alt, neu, 1)

alt2 = u'''  function plan(datensatz, punkte, zufall) {'''
neu2 = u'''  function plan(datensatz, punkte, zufall, umfangId) {'''
assert alt2 in s
s = s.replace(alt2, neu2, 1)

alt3 = u'''      var n = duelleFuerPunkte(punkte ? punkte[t.id] : 0, vorrat);'''
neu3 = u'''      var n = duelleFuerPunkte(punkte ? punkte[t.id] : 0, vorrat, umfangId);'''
assert alt3 in s
s = s.replace(alt3, neu3, 1)

s = s.replace(u'    duelleFuerPunkte: duelleFuerPunkte,',
              u'    duelleFuerPunkte: duelleFuerPunkte,\n    UMFAENGE: UMFAENGE,\n    faktorVon: faktorVon,', 1)
io.open('js/duelle.js', 'w', encoding='utf-8').write(s)

# ---------- app.js: Bedienung ----------
a = io.open('js/app.js', encoding='utf-8').read()

a = a.replace(u"    finaleGebaut: false,",
              u"    finaleGebaut: false,\n    umfang: 'normal',       /* kurz | normal | gruendlich */", 1)
a = a.replace(u"    zustand.finaleGebaut = false;\n    gehe('gewichtung');",
              u"    zustand.finaleGebaut = false;\n    zustand.umfang = 'normal';\n    gehe('gewichtung');", 1)

alt4 = u'''    function duelleGesamt() {
      var n = 0;
      d.themen.forEach(function (t) {
        n += DU.duelleFuerPunkte(zustand.gewichte[t.id], vorratVon(t));
      });
      return n;
    }'''
neu4 = u'''    function duelleGesamt() {
      var n = 0;
      d.themen.forEach(function (t) {
        n += DU.duelleFuerPunkte(zustand.gewichte[t.id], vorratVon(t), zustand.umfang);
      });
      return n;
    }

    /* Der Umfang steht neben dem Budget, nicht darin: Das Budget verteilt
     * Aufmerksamkeit, der Umfang entscheidet über die Länge. Zwei Fragen,
     * zwei Bedienelemente. */
    var umfangKnoepfe = [];
    var umfangReihe = el('div', { 'class': 'umfang' }, [
      el('span', { 'class': 'umfang-label', text: 'Umfang' })
    ]);
    DU.UMFAENGE.forEach(function (u) {
      var k = el('button', { 'class': 'umfang-knopf', type: 'button', text: u.name });
      k.addEventListener('click', function () {
        zustand.umfang = u.id;
        zeilen.forEach(function (f) { f(); });
        zeichneKasse();
      });
      umfangKnoepfe.push({ id: u.id, el: k });
      umfangReihe.appendChild(k);
    });'''
assert alt4 in a, 'duelleGesamt-Anker fehlt'
a = a.replace(alt4, neu4, 1)

alt5 = u'''      var n = duelleGesamt();
      bilanz.textContent = n + ' Duelle, ungefähr ' + Math.max(2, Math.round(n / 8))
        + ' Minuten. Die Zahl ändert sich nicht, egal wie Sie verteilen – '
        + 'die Punkte verschieben nur, wo genauer gefragt wird.';'''
neu5 = u'''      umfangKnoepfe.forEach(function (x) {
        x.el.classList.toggle('umfang-knopf--aktiv', x.id === zustand.umfang);
      });
      var n = duelleGesamt();
      bilanz.textContent = n + ' Duelle, ungefähr ' + Math.max(2, Math.round(n / 8))
        + ' Minuten. Wie Sie die Punkte verteilen, ändert diese Zahl nicht – '
        + 'die Punkte verschieben nur, wo genauer gefragt wird. Kürzer heißt '
        + 'weniger Duelle je Programm und damit gröbere Werte.';'''
assert alt5 in a, 'bilanz-Anker fehlt'
a = a.replace(alt5, neu5, 1)

alt6 = u'''        var n = DU.duelleFuerPunkte(p, vorratVon(t));'''
neu6 = u'''        var n = DU.duelleFuerPunkte(p, vorratVon(t), zustand.umfang);'''
assert alt6 in a
a = a.replace(alt6, neu6, 1)

alt7 = u"      zustand.duelle = DU.plan(d, zustand.gewichte);"
neu7 = u"      zustand.duelle = DU.plan(d, zustand.gewichte, null, zustand.umfang);"
assert alt7 in a
a = a.replace(alt7, neu7, 1)

alt8 = u'''      kasse,
      liste,'''
neu8 = u'''      kasse,
      umfangReihe,
      liste,'''
assert alt8 in a
a = a.replace(alt8, neu8, 1)
io.open('js/app.js', 'w', encoding='utf-8').write(a)
print('ok')
