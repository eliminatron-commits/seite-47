/* Anonymitaetspruefung im laufenden DOM.
 *
 * Zur Ausfuehrung in die Browser-Konsole einfuegen, waehrend die App laeuft.
 * Sie spielt einen ganzen Durchgang durch und durchsucht nach JEDEM Bild das
 * gesamte DOM nach allem, was eine Partei verraten koennte:
 *
 *   - Parteinamen und Aliasse aus dem Datensatz
 *   - Parteifarben (als Text im style-Attribut)
 *   - Partei-IDs
 *   - Pfade zu den Programm-PDFs
 *
 * Erlaubt sind Parteinamen an genau zwei Stellen: in der Tipp-Ansicht vor dem
 * Spiel und in der Wett-/Zuordnungsauswahl. Dort haengen sie an nichts - es
 * ist eine blosse Liste der Parteien dieser Wahl, ohne Zuordnung zu einer
 * Aussage, ohne Farbe und ohne Logo (CLAUDE.md Punkt 11).
 *
 * Der Rueckgabewert ist die Liste der Funde; leer heisst bestanden.
 */
(function () {
  'use strict';

  var ERLAUBT = ['tipp-knopf', 'wette', 'karte--zuordnung'];

  function datensatzAusDom() {
    /* Der Zustand ist gekapselt; die Parteiliste steht aber im geladenen
     * Datensatz, den S47_DATA gecacht hat. */
    var wahlen = window.S47_DATA.manifest();
    for (var i = 0; i < wahlen.length; i++) {
      var d = null;
      window.S47_DATA.lade(wahlen[i].id, function (fehler, x) { if (!fehler) { d = x; } });
      if (d) { return d; }
    }
    return null;
  }

  function erlaubterOrt(knoten) {
    var k = knoten;
    while (k && k.classList) {
      for (var i = 0; i < ERLAUBT.length; i++) {
        if (k.classList.contains(ERLAUBT[i])) { return true; }
      }
      k = k.parentNode;
    }
    return false;
  }

  function suche(d, wo) {
    var funde = [];
    var nadeln = [];

    d.parteien.forEach(function (p) {
      (p.alias || []).concat([p.name]).forEach(function (n) {
        if (n && n.length >= 3) { nadeln.push({ art: 'Name', text: n, partei: p.id }); }
      });
      if (p.farbe) { nadeln.push({ art: 'Farbe', text: p.farbe, partei: p.id }); }
      nadeln.push({ art: 'Id', text: '"' + p.id + '"', partei: p.id });
      if (p.programm && p.programm.datei) {
        nadeln.push({ art: 'Datei', text: p.programm.datei, partei: p.id });
      }
    });

    /* Textknoten einzeln pruefen, damit der Fundort benennbar bleibt. */
    var lauf = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var knoten;
    while ((knoten = lauf.nextNode())) {
      var text = knoten.nodeValue || '';
      if (!text.trim()) { continue; }
      nadeln.forEach(function (n) {
        if (n.art !== 'Name') { return; }
        var treffer = new RegExp('(^|[^\\wÄÖÜäöüß])' + n.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          + '($|[^\\wÄÖÜäöüß])');
        if (treffer.test(text) && !erlaubterOrt(knoten.parentNode)) {
          funde.push(wo + ': Parteiname "' + n.text + '" in "' + text.trim().slice(0, 60) + '"');
        }
      });
    }

    /* Attribute: Farben, Ids, Dateipfade. */
    var alle = document.body.querySelectorAll('*');
    for (var i = 0; i < alle.length; i++) {
      var el = alle[i];
      for (var j = 0; j < el.attributes.length; j++) {
        var wert = el.attributes[j].value || '';
        nadeln.forEach(function (n) {
          if (n.art === 'Name') { return; }
          if (wert.indexOf(n.text.replace(/"/g, '')) > -1 && !erlaubterOrt(el)) {
            funde.push(wo + ': ' + n.art + ' "' + n.text + '" in @'
              + el.attributes[j].name + ' von .' + (el.className || el.tagName));
          }
        });
      }
    }
    return funde;
  }

  var d = datensatzAusDom();
  if (!d) { return ['Kein Datensatz geladen - erst eine Wahl starten.']; }

  var funde = [];
  var bilder = 0;

  function taste(k) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  }

  for (var r = 0; r < 400; r++) {
    bilder++;
    funde = funde.concat(suche(d, 'Bild ' + bilder));

    var karten = document.querySelectorAll('.duell-satz');
    if (karten.length) {
      taste(Math.random() < 0.5 ? '1' : '2');
      taste('1');
      continue;
    }
    /* Ab der Aufdeckung ist alles erlaubt - dann aufhoeren. */
    if (document.querySelector('.karte--aufdeckung')) { break; }

    var wette = document.querySelectorAll('.wette .tipp-knopf');
    if (wette.length) { wette[0].click(); }
    var zuordnung = document.querySelectorAll('.karte--zuordnung');
    if (zuordnung.length) {
      [].forEach.call(zuordnung, function (k, i) {
        k.querySelectorAll('.tipp-knopf')[i].click();
      });
    }
    var weiter = document.querySelector('.knopf--haupt');
    if (!weiter) { break; }
    weiter.click();
  }

  return { bilder: bilder, funde: funde };
})();
