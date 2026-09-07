/* Seite 47 – Quellenanzeige.
 * Eingebetteter PDF.js-Viewer (vendor/pdfjs/) mit Sprung auf die hinterlegte
 * Seite und farbiger Hervorhebung des Textausschnitts.
 *
 * Fallback zuerst (siehe CLAUDE.md, Punkt 6): zeige() liefert false, sobald
 * der Viewer nicht sicher funktioniert – dann öffnet die App datei#page=N.
 * Unter file:// ist das der Normalfall: PDF.js lädt das PDF per XHR/fetch,
 * was der Browser bei lokalen Dateien blockiert.
 */
(function (global) {
  'use strict';

  var doc = global.document;

  /* Muss zur Normalisierung in .claude/pdftool.py passen, damit die im
   * Datensatz gespeicherten Markierungen im Textlayer wiedergefunden werden. */
  var ERSATZ = {
    '\uFB00': 'ff',
    '\uFB01': 'fi',
    '\uFB02': 'fl',
    '\uFB03': 'ffi',
    '\uFB04': 'ffl',
    '\u014C': 'ft',
    '\u019F': 'ti',
    '\u01A9': 'tt',
    '\u2010': '-',
    '\u2011': '-',
    '\u2012': '-',
    '\u2212': '-',
    '\u00AD': '',
    '\u00A0': ' ',
    '\u2002': ' ',
    '\u2003': ' ',
    '\u2009': ' ',
    '\u202F': ' ',
    '\u2028': ' ',
    '\uF0B7': ' ',
    '\uE00A': ' ',
    '\u25CF': ' ',
    '\u25B6': ' ',
    '\u25CB': ' '
  };

  function ersetze(z) {
    return Object.prototype.hasOwnProperty.call(ERSATZ, z) ? ERSATZ[z] : z;
  }

  /* Normalisiert und merkt sich zu jedem Zeichen den Index des Textstücks,
   * aus dem es stammt – nur so lassen sich Treffer auf Rechtecke abbilden. */
  function normalisiere(stuecke) {
    var text = '', herkunft = [], letztesLeer = false, i, k, z, ers, j;
    for (i = 0; i < stuecke.length; i++) {
      var roh = String(stuecke[i].str || '');
      for (k = 0; k < roh.length; k++) {
        ers = ersetze(roh.charAt(k));
        for (j = 0; j < ers.length; j++) {
          z = ers.charAt(j);
          if (/\s/.test(z)) {
            if (letztesLeer || !text) { continue; }
            text += ' '; herkunft.push(i); letztesLeer = true;
          } else {
            text += z; herkunft.push(i); letztesLeer = false;
          }
        }
      }
      if (stuecke[i].hasEOL && !letztesLeer && text) {
        /* Silbentrennung am Zeilenende auflösen – genauso wie in
         * .claude/pdftool.py, gegen das die Markierungen geprüft sind. */
        if (text.charAt(text.length - 1) === '-'
            && /\S/.test(text.charAt(text.length - 2))) {
          text = text.slice(0, -1); herkunft.pop();
        } else {
          text += ' '; herkunft.push(i); letztesLeer = true;
        }
      }
    }
    return { text: text, herkunft: herkunft };
  }

  function vereinfache(s) {
    var t = '', i;
    for (i = 0; i < s.length; i++) { t += ersetze(s.charAt(i)); }
    return t.replace(/\s+/g, ' ').trim();
  }

  /* Findet die Markierung; bei Misserfolg schrittweise gekürzte Anfänge,
   * damit ein am Zeilenumbruch getrenntes Wort den Treffer nicht verhindert. */
  function finde(text, markierung) {
    var m = vereinfache(markierung), pos = text.indexOf(m);
    if (pos >= 0) { return { von: pos, bis: pos + m.length }; }
    var worte = m.split(' '), teil;
    while (worte.length > 4) {
      worte.pop();
      teil = worte.join(' ');
      pos = text.indexOf(teil);
      if (pos >= 0) { return { von: pos, bis: pos + teil.length }; }
    }
    return null;
  }

  var S47Quelle = {
    /* Der Inline-Viewer gilt nur als verfügbar, wenn PDF.js geladen ist und
     * die Seite nicht über file:// läuft (dort ist der PDF-Abruf gesperrt). */
    verfuegbar: function () {
      return !!(global.pdfjsLib && global.pdfjsLib.getDocument)
        && global.location.protocol !== 'file:';
    },

    /* Nur zur Prüfung: erlaubt, die Trefferbestimmung ohne Darstellung
     * gegen alle Quellenangaben eines Datensatzes laufen zu lassen. */
    _finde: function (stuecke, markierung) {
      var n = normalisiere(stuecke);
      return finde(n.text, markierung);
    },

    /** @param {{datei:string, seite:number, markierung:string}} quelle */
    fallbackUrl: function (quelle) {
      return quelle.datei + '#page=' + quelle.seite;
    },

    /**
     * Öffnet die Fundstelle eingebettet. Gibt true zurück, wenn der Viewer
     * übernimmt, sonst false – dann öffnet die App den Fallback.
     */
    zeige: function (quelle, titel) {
      if (!S47Quelle.verfuegbar()) { return false; }
      try {
        oeffne(quelle, titel || '');
      } catch (e) {
        return false;
      }
      return true;
    }
  };

  var schicht = null;

  function beiTaste(e) {
    if (e.key === 'Escape') { schliesse(); }
  }

  function schliesse() {
    if (schicht && schicht.parentNode) { schicht.parentNode.removeChild(schicht); }
    schicht = null;
    doc.removeEventListener('keydown', beiTaste);
  }

  function el(tag, klasse, text) {
    var n = doc.createElement(tag);
    if (klasse) { n.className = klasse; }
    if (text) { n.textContent = text; }
    return n;
  }

  function oeffne(quelle, titel) {
    schliesse();
    schicht = el('div', 'quelle-schicht');
    var rahmen = el('div', 'quelle-rahmen');
    var kopf = el('div', 'quelle-kopf');
    kopf.appendChild(el('span', 'quelle-titel',
      (titel ? titel + ' – ' : '') + 'Seite ' + quelle.seite));

    var extern = doc.createElement('a');
    extern.className = 'link';
    extern.href = S47Quelle.fallbackUrl(quelle);
    extern.target = '_blank';
    extern.rel = 'noopener';
    extern.textContent = 'Extern öffnen';
    kopf.appendChild(extern);

    var zu = el('button', 'knopf knopf--still quelle-zu', 'Schließen');
    zu.addEventListener('click', schliesse);
    kopf.appendChild(zu);

    var buehne = el('div', 'quelle-buehne');
    var stand = el('p', 'quelle-stand', 'Programm wird geladen …');
    buehne.appendChild(stand);

    rahmen.appendChild(kopf);
    rahmen.appendChild(buehne);
    schicht.appendChild(rahmen);
    schicht.addEventListener('click', function (e) {
      if (e.target === schicht) { schliesse(); }
    });
    doc.addEventListener('keydown', beiTaste);
    doc.body.appendChild(schicht);

    var meins = schicht;
    /* Bleibt das Rendern hängen (etwa weil der Browser die Seite nicht
     * zeichnet), soll der Weg nach draußen sichtbar werden. */
    global.setTimeout(function () {
      if (meins === schicht && stand.parentNode) {
        stand.textContent = 'Die Darstellung dauert ungewöhnlich lange. '
          + 'Über „Extern öffnen“ erscheint das Programm direkt auf Seite '
          + quelle.seite + '.';
        stand.className = 'quelle-stand quelle-stand--fehler';
      }
    }, 12000);
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js';

    global.pdfjsLib.getDocument(quelle.datei).promise.then(function (pdf) {
      var nr = Math.min(Math.max(1, quelle.seite), pdf.numPages);
      return pdf.getPage(nr);
    }).then(function (seite) {
      if (meins !== schicht) { return; }
      zeichne(seite, quelle, buehne, stand);
    })['catch'](function (fehler) {
      if (meins !== schicht) { return; }
      stand.textContent = 'Das Programm lässt sich hier nicht einbetten. '
        + 'Über „Extern öffnen“ erscheint es direkt auf Seite ' + quelle.seite + '.';
      stand.className = 'quelle-stand quelle-stand--fehler';
      if (global.console) { console.warn('Quellenanzeige:', fehler && fehler.message); }
    });
  }

  function zeichne(seite, quelle, buehne, stand) {
    var breite = Math.min(buehne.clientWidth || 800, 1000);
    var roh = seite.getViewport({ scale: 1 });
    var sicht = seite.getViewport({ scale: breite / roh.width });

    var huelle = el('div', 'quelle-seite');
    huelle.style.width = Math.round(sicht.width) + 'px';
    huelle.style.height = Math.round(sicht.height) + 'px';

    var leinwand = doc.createElement('canvas');
    var dpr = global.devicePixelRatio || 1;
    leinwand.width = Math.round(sicht.width * dpr);
    leinwand.height = Math.round(sicht.height * dpr);
    leinwand.style.width = Math.round(sicht.width) + 'px';
    leinwand.style.height = Math.round(sicht.height) + 'px';
    var ctx = leinwand.getContext('2d');
    ctx.scale(dpr, dpr);
    huelle.appendChild(leinwand);
    buehne.appendChild(huelle);

    /* Zeichnen und Textlage getrennt behandeln: die Hervorhebung soll auch
     * dann stehen, wenn das Malen der Seite noch läuft oder der Browser die
     * Seite gerade nicht zeichnet (dann bremst er rAF aus). */
    seite.render({ canvasContext: ctx, viewport: sicht }).promise['catch'](function () {
      stand.textContent = 'Die Seite ließ sich nicht vollständig darstellen.';
      stand.className = 'quelle-stand quelle-stand--fehler';
      if (stand.parentNode !== buehne) { buehne.insertBefore(stand, huelle); }
    });

    seite.getTextContent().then(function (inhalt) {
      if (stand.parentNode) { stand.parentNode.removeChild(stand); }
      markiere(inhalt.items, quelle.markierung, sicht, huelle, buehne);
    })['catch'](function () { /* ohne Textlage bleibt die Seite ohne Markierung */ });
  }

  function markiere(stuecke, markierung, sicht, huelle, buehne) {
    var n = normalisiere(stuecke);
    var treffer = finde(n.text, markierung);
    if (!treffer) { return; }

    var indizes = Object.create(null), i;
    for (i = treffer.von; i < treffer.bis; i++) { indizes[n.herkunft[i]] = true; }

    var erstes = null;
    Object.keys(indizes).forEach(function (schluessel) {
      var s = stuecke[Number(schluessel)];
      if (!s || !s.str || !/\S/.test(s.str)) { return; }
      var t = global.pdfjsLib.Util.transform(sicht.transform, s.transform);
      var hoehe = Math.sqrt(t[2] * t[2] + t[3] * t[3]) || (s.height * sicht.scale);
      var kasten = el('div', 'quelle-treffer');
      kasten.style.left = (t[4] - 1) + 'px';
      kasten.style.top = (t[5] - hoehe) + 'px';
      kasten.style.width = (s.width * sicht.scale + 2) + 'px';
      kasten.style.height = (hoehe * 1.2) + 'px';
      huelle.appendChild(kasten);
      if (!erstes || kasten.offsetTop < erstes.offsetTop) { erstes = kasten; }
    });

    if (erstes) {
      buehne.scrollTop = Math.max(0, erstes.offsetTop - buehne.clientHeight / 3);
    }
  }

  global.S47_QUELLE = S47Quelle;
})(window);
