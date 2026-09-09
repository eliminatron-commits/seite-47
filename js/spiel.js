/* Seite 47 – Die Spielansicht: ein Duell nach dem anderen.
 *
 * DIE IDEE
 *
 * Zwei Sätze, einer gewinnt. Erst NACH dem Klick zeigt sich, welchem
 * verdeckten Kandidaten der Punkt zufällt – ein Marker fliegt aus der
 * gewählten Karte hinunter ins Feld, der Balken wächst, das Feld sortiert
 * sich um.
 *
 * Diese Reihenfolge ist der ganze Trick. Die Entscheidung bleibt blind, also
 * unbeeinflusst vom Zwischenstand; die Rückmeldung kommt trotzdem sofort.
 * Umgekehrt – Kandidat sichtbar, dann wählen – wäre das Spiel eine
 * Selbstbestätigung: man füttert, wer vorn liegt.
 *
 * Und es beantwortet den eigentlichen Einwand gegen die Vorform: dort fiel
 * zwanzig Minuten lang keine einzige Rückmeldung, alles hing am Schluss. Hier
 * passiert bei jedem Klick etwas, und der Zwischenstand baut die Spannung auf,
 * die die Aufdeckung dann einlöst: „Wer ist eigentlich dieses C, dem ich
 * ständig recht gebe?"
 *
 * ANONYMITÄT
 *
 * Die Kandidatenbuchstaben werden je Sitzung neu ausgelost. Im DOM steht nur
 * der Buchstabe. Weder parteiId noch Name, Farbe, Logo oder Dateiname wandern
 * vor der Aufdeckung hinein – die Zuordnung Buchstabe→Partei lebt allein in
 * zustand.kandidaten.
 */
(function (global) {
  'use strict';

  var BUCHSTABEN = 'ABCDEFGH';

  /* Dauer der Beat-Folge nach einem Klick. Länger fühlt sich zäh an, kürzer
   * nimmt dem Marker die Flugbahn und damit den Zusammenhang zwischen Karte
   * und Kandidat. Ein weiterer Klick überspringt den Rest. */
  var FLUG = 420, HALT = 260;

  function ctxHilfen(ctx) { return ctx; }

  /* Buchstaben je Sitzung auslosen. Stabil, damit Kandidat C über den ganzen
   * Durchgang derselbe bleibt – sonst wäre der Zwischenstand sinnlos. */
  function loseKandidaten(datensatz) {
    var ids = datensatz.parteien.map(function (p) { return p.id; });
    for (var i = ids.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = ids[i]; ids[i] = ids[j]; ids[j] = t;
    }
    var zu = Object.create(null);
    ids.forEach(function (id, i) { zu[id] = BUCHSTABEN.charAt(i); });
    return zu;
  }

  function ansicht(ctx) {
    var el = ctx.el, zustand = ctx.zustand, D = ctx.D, buehne = ctx.buehne;
    var DU = global.S47_DUELLE;
    var d = zustand.datensatz;
    var duelle = zustand.duelle;
    var i = zustand.duellIndex;
    var duell = duelle[i];

    if (!duell) { ctx.gehe('zuordnung'); return; }

    var laeuft = false;   /* während der Beat-Folge sind Klicks Überspringen */
    var zeitgeber = [];
    function spaeter(fn, ms) { zeitgeber.push(setTimeout(fn, ms)); }
    function sofort() {
      zeitgeber.forEach(clearTimeout);
      zeitgeber = [];
    }

    /* ---------- Kopf: Fortschritt und Serie ---------- */

    var bogen = el('div', { 'class': 'spiel-bogen' }, [
      el('div', { 'class': 'spiel-bogen-fuell' })
    ]);
    var zaehler = el('span', { 'class': 'spiel-zaehler',
      text: (i + 1) + ' / ' + duelle.length });
    var serieEl = el('span', { 'class': 'spiel-serie' });

    function zeichneSerie() {
      var laenge = 0, letzter = null;
      for (var k = i - 1; k >= 0; k--) {
        var s = zustand.duellAntworten[k];
        if (!s) { break; }
        var pid = siegerPartei(k);
        if (letzter === null) { letzter = pid; }
        if (pid !== letzter) { break; }
        laenge++;
      }
      if (laenge >= 3 && letzter) {
        serieEl.textContent = laenge + '× in Folge für ' + zustand.kandidaten[letzter];
        serieEl.classList.add('spiel-serie--an');
      } else {
        serieEl.textContent = '';
        serieEl.classList.remove('spiel-serie--an');
      }
    }

    function siegerPartei(index) {
      var s = zustand.duellAntworten[index];
      if (!s) { return null; }
      var dl = duelle[index];
      return dl.links.id === s ? dl.links.parteiId : dl.rechts.parteiId;
    }

    /* ---------- Das Feld der verdeckten Kandidaten ----------
     * Saeulen statt Zeilen: sieben schmale Balken nebeneinander passen unter
     * die Karten, ohne sie aus dem Bild zu draengen. Als Zeilenliste war das
     * Feld doppelt so hoch und lag unter dem Falz - der Marker flog aus dem
     * Bild, und genau seine Landung ist die Rueckmeldung. */

    var feld = el('div', { 'class': 'feld' });
    var chips = Object.create(null);

    d.parteien.forEach(function (p) {
      var balken = el('div', { 'class': 'chip-fuell' });
      var quote = el('span', { 'class': 'chip-quote' });
      var chip = el('div', { 'class': 'chip' }, [
        el('div', { 'class': 'chip-saeule' }, [balken]),
        el('span', { 'class': 'chip-marke', text: zustand.kandidaten[p.id] }),
        quote
      ]);
      chips[p.id] = { wurzel: chip, fuell: balken, quote: quote };
      feld.appendChild(chip);
    });

    function zeichneFeld(animiert) {
      var stand = DU.standNach(duelle, zustand.duellAntworten, i - 1);
      var reihen = d.parteien.map(function (p) {
        var a = stand.auftritte[p.id] || 0;
        var s = stand.siege[p.id] || 0;
        return { id: p.id, anteil: a ? s / a : 0, auftritte: a, siege: s };
      }).sort(function (x, y) {
        if (y.anteil !== x.anteil) { return y.anteil - x.anteil; }
        return y.auftritte - x.auftritte;
      });

      /* FLIP: erst messen, dann umhängen, dann von der alten Stelle
       * zurückgleiten lassen. Ohne das springt die Liste, und genau das
       * Umsortieren ist der Moment, den man sehen soll. */
      var vorher = Object.create(null);
      if (animiert) {
        d.parteien.forEach(function (p) {
          vorher[p.id] = chips[p.id].wurzel.getBoundingClientRect().left;
        });
      }

      reihen.forEach(function (r) { feld.appendChild(chips[r.id].wurzel); });

      reihen.forEach(function (r) {
        var c = chips[r.id];
        c.fuell.style.height = (r.auftritte ? Math.max(5, r.anteil * 100) : 0).toFixed(1) + '%';
        c.quote.textContent = r.auftritte ? r.siege + '/' + r.auftritte : '–';
        c.wurzel.classList.toggle('chip--leer', !r.auftritte);
      });

      if (animiert && global.requestAnimationFrame) {
        d.parteien.forEach(function (p) {
          var c = chips[p.id].wurzel;
          var jetzt = c.getBoundingClientRect().left;
          var weg = vorher[p.id] - jetzt;
          if (!weg) { return; }
          c.style.transition = 'none';
          c.style.transform = 'translateX(' + weg + 'px)';
          global.requestAnimationFrame(function () {
            c.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
            c.style.transform = '';
          });
        });
      }
    }

    /* ---------- Die beiden Karten ---------- */

    var buehneKarten = el('div', { 'class': 'duell-buehne' });
    var karten = [];

    function karteFuer(a, seite) {
      var text = el('p', { 'class': 'duell-satz', text: D.anonymisiere(d, a.kurz) });
      var k = el('button', {
        'class': 'duell-karte duell-karte--' + seite, type: 'button'
      }, [
        el('span', { 'class': 'duell-nr', text: seite === 'links' ? '1' : '2' }),
        text
      ]);
      k.addEventListener('click', function () { waehle(a, k); });
      karten.push({ aussage: a, el: k });
      return k;
    }

    buehneKarten.appendChild(karteFuer(duell.links, 'links'));
    buehneKarten.appendChild(el('div', { 'class': 'duell-gegen', text: 'oder' }));
    buehneKarten.appendChild(karteFuer(duell.rechts, 'rechts'));

    /* ---------- Der Klick und was danach passiert ---------- */

    function weiter() {
      sofort();
      if (i + 1 >= duelle.length) { ctx.gehe('zuordnung'); }
      else { zustand.duellIndex = i + 1; ctx.gehe('spiel'); }
    }

    function waehle(a, karteEl) {
      if (laeuft) { weiter(); return; }
      laeuft = true;
      zustand.duellAntworten[i] = a.id;

      karten.forEach(function (k) {
        k.el.classList.add(k.aussage.id === a.id ? 'duell-karte--sieg' : 'duell-karte--raus');
        k.el.disabled = true;
      });
      zeichneSerie();

      /* Marker von der gewählten Karte zum Kandidaten fliegen lassen. Er sagt,
       * wem der Punkt gehört – und macht den Zusammenhang zwischen dem Satz
       * und dem Kürzel körperlich, statt ihn nur zu behaupten. */
      var ziel = chips[a.parteiId].wurzel;
      var von = karteEl.getBoundingClientRect();
      var nach = ziel.getBoundingClientRect();
      var marker = el('div', { 'class': 'marker',
        text: zustand.kandidaten[a.parteiId] });
      marker.style.left = (von.left + von.width / 2) + 'px';
      marker.style.top = (von.top + von.height / 2) + 'px';
      document.body.appendChild(marker);

      if (global.requestAnimationFrame) {
        global.requestAnimationFrame(function () {
          marker.style.transform = 'translate('
            + (nach.left + nach.width / 2 - (von.left + von.width / 2)) + 'px,'
            + (nach.top + nach.height / 2 - (von.top + von.height / 2)) + 'px) scale(.55)';
          marker.style.opacity = '.15';
        });
      }

      spaeter(function () {
        if (marker.parentNode) { marker.parentNode.removeChild(marker); }
        ziel.classList.add('chip--treffer');
        /* Der Stand rechnet bis i-1; für die Anzeige zählt das eben
         * gespielte Duell mit, deshalb kurz hochzählen. */
        i++;
        zeichneFeld(true);
        i--;
        spaeter(function () { ziel.classList.remove('chip--treffer'); }, 380);
      }, FLUG);

      spaeter(weiter, FLUG + HALT + 380);
    }

    /* ---------- Tastatur ---------- */

    ctx.setzeTasten(function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) { return; }
      var ziel = e.target && e.target.tagName;
      if (ziel === 'INPUT' || ziel === 'SELECT' || ziel === 'TEXTAREA') { return; }
      if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault(); karten[0].el.click();
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault(); karten[1].el.click();
      }
    });

    /* ---------- Zusammensetzen ---------- */

    var abschnitt = el('section', { 'class': 'spiel' }, [
      el('div', { 'class': 'spiel-kopf' }, [
        el('span', { 'class': 'spiel-thema', text: duell.themaTitel }),
        zaehler
      ]),
      bogen,
      el('p', { 'class': 'spiel-frage', text: duell.frageText }),
      buehneKarten,
      serieEl,
      el('div', { 'class': 'feld-huelle' }, [
        el('p', { 'class': 'feld-titel', text: 'Ihr Feld – sieben verdeckte Programme' }),
        feld
      ]),
      el('div', { 'class': 'navi navi--spiel' }, [
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Zurück',
          onclick: function () {
            sofort();
            if (i > 0) { zustand.duellIndex = i - 1; ctx.gehe('spiel'); }
            else { ctx.gehe('gewichtung'); }
          } }),
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Überspringen',
          onclick: function () { delete zustand.duellAntworten[i]; weiter(); } })
      ])
    ]);

    buehne.appendChild(abschnitt);

    zeichneFeld(false);
    zeichneSerie();
    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(function () {
        bogen.firstChild.style.width = ((i + 1) / duelle.length * 100) + '%';
      });
    }
  }

  global.S47_SPIEL = {
    ansicht: ansicht,
    loseKandidaten: loseKandidaten,
    BUCHSTABEN: BUCHSTABEN
  };
})(window);
