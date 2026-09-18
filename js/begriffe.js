/* Seite 47 – Begriffe: Fachwoerter im Fragetext erklaeren.  -> S47_BEGRIFF
 *
 * WARUM
 * „Soll Berlin die Bezahlkarte fuer Gefluechtete nutzen?" laesst sich nur
 * beantworten, wenn man den Begriff kennt. Die App fragt nach Positionen,
 * nicht nach Vorwissen; wer das Wort nicht kennt, waehlt sonst nach Gefuehl.
 *
 * WAS HIER NICHT STEHT
 * Kein einziger Begriff und keine Erklaerung. Beides ist Wahlinhalt und steht
 * im Datensatz (`begriffe`, erzeugt aus .claude/quellen/begriffe.py). Diese
 * Datei kennt nur die Mechanik.
 *
 * NUR IM FRAGETEXT
 * Markiert wird ausschliesslich die Frage. Sie steht ueber beiden Karten und
 * sagt damit ueber keine von beiden etwas. Eine gepunktete Linie in nur einer
 * der zwei Aussagen waere ein Unterschied im Schriftbild genau an der Stelle,
 * an der entschieden wird - das Auge geht dorthin, und der Vergleich waere
 * nicht mehr sauber.
 *
 * KEIN title-ATTRIBUT
 * Der eingebaute Tooltip erscheint erst nach rund einer Sekunde, laesst sich
 * nicht gestalten und ist auf dem Telefon gar nicht zu bekommen. Stattdessen
 * eine eigene Blase: zeigen bei Mauszeiger und Tastaturfokus, umschalten bei
 * Klick oder Tipp.
 *
 * DIE BLASE LIEGT FEST AM FENSTER (position: fixed) und schiebt nichts.
 * Waere sie im Textfluss, ruckte die Leiste unter den Karten - und die steht
 * nach CLAUDE.md fest.
 */
(function (global) {
  'use strict';

  var doc = global.document;
  var blase = null;
  var offen = null;        /* die Marke, zu der die Blase gerade gehoert */
  var festgehalten = false; /* per Klick geoeffnet: bleibt bis zum naechsten Klick */

  /* Ganze Woerter, mit deutschen Umlauten als Wortbestandteil: sonst fiele
   * „Moor" in „Moorbrand" auf und „Taser" in „Tasered". Lookbehind koennen
   * aeltere Browser nicht, deshalb wird von Hand geprueft. */
  function istWortgrenze(zeichen) {
    return !zeichen || !/[0-9A-Za-zÄÖÜäöüß]/.test(zeichen);
  }

  /* Sucht die naechste Fundstelle irgendeiner Form ab Position `ab`.
   * Rueckgabe: {start, laenge, begriff} oder null. */
  function naechsterTreffer(text, begriffe, ab) {
    var bester = null;
    for (var i = 0; i < begriffe.length; i++) {
      var b = begriffe[i];
      var formen = b.formen && b.formen.length ? b.formen : [b.wort];
      for (var k = 0; k < formen.length; k++) {
        var form = formen[k];
        var pos = ab - 1;
        while (true) {
          pos = text.toLowerCase().indexOf(form.toLowerCase(), pos + 1);
          if (pos < 0) { break; }
          if (istWortgrenze(text.charAt(pos - 1))
              && istWortgrenze(text.charAt(pos + form.length))) {
            /* Frueheste Fundstelle gewinnt, bei gleicher Stelle die laengere
             * Form („Milieuschutzgebieten" vor „Milieuschutz"). */
            if (!bester || pos < bester.start
                || (pos === bester.start && form.length > bester.laenge)) {
              bester = { start: pos, laenge: form.length, begriff: b };
            }
            break;
          }
        }
      }
    }
    return bester;
  }

  function baueBlase() {
    if (blase) { return blase; }
    blase = doc.createElement('div');
    blase.className = 'begriff-blase';
    blase.setAttribute('role', 'note');
    blase.hidden = true;
    doc.body.appendChild(blase);
    return blase;
  }

  function schliesse() {
    if (!offen) { return; }
    offen.setAttribute('aria-expanded', 'false');
    offen = null;
    festgehalten = false;
    if (blase) { blase.hidden = true; }
  }

  function zeige(marke, begriff) {
    var b = baueBlase();
    b.textContent = begriff.erklaerung;
    b.hidden = false;
    offen = marke;
    marke.setAttribute('aria-expanded', 'true');

    /* Erst messen, dann setzen: die Blase steht unter dem Wort, rutscht bei
     * Platzmangel darueber und bleibt immer im Fenster. */
    var rand = 12;
    b.style.left = '0px';
    b.style.top = '0px';
    var mass = b.getBoundingClientRect();
    var stelle = marke.getBoundingClientRect();
    var links = stelle.left + stelle.width / 2 - mass.width / 2;
    var maxLinks = global.innerWidth - mass.width - rand;
    if (links > maxLinks) { links = maxLinks; }
    if (links < rand) { links = rand; }
    var oben = stelle.bottom + 8;
    if (oben + mass.height > global.innerHeight - rand) {
      oben = stelle.top - mass.height - 8;
    }
    if (oben < rand) { oben = rand; }
    b.style.left = Math.round(links) + 'px';
    b.style.top = Math.round(oben) + 'px';
  }

  function marke(begriff, wortlaut) {
    var knopf = doc.createElement('button');
    knopf.type = 'button';
    knopf.className = 'begriff';
    knopf.textContent = wortlaut;
    knopf.setAttribute('aria-expanded', 'false');
    knopf.setAttribute('aria-label', wortlaut + ' – erklären');

    knopf.addEventListener('mouseenter', function () {
      if (!festgehalten) { zeige(knopf, begriff); }
    });
    knopf.addEventListener('mouseleave', function () {
      if (!festgehalten && offen === knopf) { schliesse(); }
    });
    knopf.addEventListener('focus', function () { zeige(knopf, begriff); });
    knopf.addEventListener('blur', function () {
      if (!festgehalten) { schliesse(); }
    });
    knopf.addEventListener('click', function (e) {
      /* Der Klick darf nicht als Wahl oder als Ueberspringen durchgehen. */
      e.preventDefault();
      e.stopPropagation();
      if (offen === knopf && festgehalten) { schliesse(); return; }
      zeige(knopf, begriff);
      festgehalten = true;
    });
    return knopf;
  }

  /**
   * Sammelt die Begriffe, die in `texte` vorkommen - je Begriff einmal, in
   * der Reihenfolge des ersten Auftretens.
   * @returns {Array} [{begriff, wortlaut}]
   */
  function finde(texte, begriffe) {
    var gesehen = Object.create(null), raus = [];
    if (!begriffe || !begriffe.length) { return raus; }
    (texte || []).forEach(function (text) {
      var rest = text || '', schutz = 0;
      while (rest && schutz++ < 60) {
        var treffer = naechsterTreffer(rest, begriffe, 0);
        if (!treffer) { break; }
        if (!gesehen[treffer.begriff.wort]) {
          gesehen[treffer.begriff.wort] = true;
          raus.push({
            begriff: treffer.begriff,
            wortlaut: rest.substr(treffer.start, treffer.laenge)
          });
        }
        rest = rest.slice(treffer.start + treffer.laenge);
      }
    });
    return raus;
  }

  /**
   * Fuellt `element` mit den Begriffen aus `texte` - als Zeile unter beiden
   * Duellkarten. Sie steht bewusst NICHT in der Karte: eine gepunktete Linie
   * in nur einer der zwei Aussagen waere ein Unterschied im Schriftbild
   * genau dort, wo entschieden wird.
   * `schonMarkiert` sind die Woerter, die oben schon in der Frage stehen -
   * sie zweimal anzubieten waere Fuellmaterial.
   * @returns {number} Anzahl der Begriffe (0 = Zeile bleibt leer)
   */
  function zeile(element, texte, begriffe, schonMarkiert) {
    while (element.firstChild) { element.removeChild(element.firstChild); }
    var aus = Object.create(null);
    (schonMarkiert || []).forEach(function (w) { aus[w] = true; });
    var treffer = finde(texte, begriffe).filter(function (t) {
      return !aus[t.begriff.wort];
    });
    if (!treffer.length) { return 0; }
    element.appendChild(doc.createTextNode('Begriffe: '));
    treffer.forEach(function (t, i) {
      if (i) { element.appendChild(doc.createTextNode(' \u00b7 ')); }
      element.appendChild(marke(t.begriff, t.begriff.wort));
    });
    return treffer.length;
  }

  /**
   * Schreibt `text` in `element` und macht bekannte Begriffe anklickbar.
   * Ohne Treffer bleibt es bei reinem Text - auch das Ergebnis ist derselbe
   * Textinhalt, nur ohne Marken.
   * @param {Element} element Ziel; wird geleert.
   * @param {string} text Fragetext aus dem Datensatz.
   * @param {Array} begriffe datensatz.begriffe (darf fehlen).
   */
  function setze(element, text, begriffe) {
    while (element.firstChild) { element.removeChild(element.firstChild); }
    if (!text) { return; }
    if (!begriffe || !begriffe.length) {
      element.appendChild(doc.createTextNode(text));
      return;
    }
    var rest = text, verschoben = 0;
    while (rest) {
      var treffer = naechsterTreffer(rest, begriffe, 0);
      if (!treffer) { break; }
      if (treffer.start > 0) {
        element.appendChild(doc.createTextNode(rest.slice(0, treffer.start)));
      }
      element.appendChild(marke(treffer.begriff,
        rest.substr(treffer.start, treffer.laenge)));
      rest = rest.slice(treffer.start + treffer.laenge);
      if (++verschoben > 40) { break; }   /* Reissleine gegen Endlosschleifen */
    }
    if (rest) { element.appendChild(doc.createTextNode(rest)); }
  }

  /* Alles, was den Blick woanders hinlenkt, schliesst die Blase: ein Klick
   * daneben, Escape, Scrollen (die Blase haengt am Fenster, das Wort nicht)
   * und jeder Ansichtswechsel. */
  /* Ohne DOM laeuft nur die Suche: .claude/baue_pdf.js laedt diese Datei,
   * um fuer das Begriffsverzeichnis dieselbe Fundlogik zu benutzen wie die
   * App - eine zweite Implementierung wuerde irgendwann abweichen. */
  if (!doc || !doc.addEventListener || !global.addEventListener) {
    global.S47_BEGRIFF = { setze: setze, zeile: zeile, finde: finde,
      schliesse: function () {} };
    return;
  }

  doc.addEventListener('click', function (e) {
    if (offen && !(e.target && e.target.closest && e.target.closest('.begriff'))) {
      schliesse();
    }
  }, true);
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offen) { schliesse(); }
  });
  global.addEventListener('scroll', function () { schliesse(); }, true);
  global.addEventListener('resize', function () { schliesse(); });

  global.S47_BEGRIFF = {
    setze: setze,
    zeile: zeile,
    finde: finde,
    schliesse: schliesse
  };
})(window);
