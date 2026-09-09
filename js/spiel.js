/* Seite 47 – Die Spielansichten: Duell, Zwischenstand, Finale.
 *
 * DIE IDEE
 *
 * Zwei Sätze, einer gewinnt. Erst NACH dem Klick zeigt sich, welchem
 * verdeckten Kandidaten der Punkt zufällt – ein Marker fliegt aus der
 * gewählten Karte hinunter ins Feld, die Säule wächst, das Feld sortiert
 * sich um.
 *
 * Diese Reihenfolge ist der ganze Trick. Die Entscheidung bleibt blind, also
 * unbeeinflusst vom Zwischenstand; die Rückmeldung kommt trotzdem sofort.
 * Umgekehrt – Kandidat sichtbar, dann wählen – wäre das Spiel eine
 * Selbstbestätigung: man füttert, wer ohnehin vorn liegt.
 *
 * DER BOGEN
 *
 * Vierzig gleiche Klicks sind kein Spiel, sondern eine Liste. Deshalb hat der
 * Durchgang eine Form:
 *
 *   Sichtung           – Duelle quer durch die Themen, verteilt nach dem Budget
 *   Zwischenstand (2×) – das Feld groß, dazu eine Wette: „Wer ist C?"
 *   Finale             – nur noch die beiden Erstplatzierten, direkt gegeneinander
 *
 * Die Wette ist die These in Spielform: Sie tippen mitten im Lauf, wer der
 * Kandidat ist, dem Sie ständig recht geben – und erfahren erst am Ende, ob
 * Sie richtig lagen. Je früher die Wette sitzt, desto mehr sagt sie.
 *
 * ANONYMITÄT
 *
 * Die Kandidatenbuchstaben werden je Sitzung neu ausgelost. Im DOM steht nur
 * der Buchstabe. Weder parteiId noch Name, Farbe, Logo oder Dateiname wandern
 * vor der Aufdeckung hinein – die Zuordnung Buchstabe→Partei lebt allein in
 * zustand.kandidaten. Einzige Ausnahme bleibt die reine Parteiliste in der
 * Tipp- und der Wettansicht: Namen ohne jede Zuordnung zu einem Satz.
 */
(function (global) {
  'use strict';

  var BUCHSTABEN = 'ABCDEFGH';

  /* Dauer der Beat-Folge nach einem Klick. Länger fühlt sich zäh an, kürzer
   * nimmt dem Marker die Flugbahn und damit den Zusammenhang zwischen Karte
   * und Kandidat. Ein weiterer Klick überspringt den Rest. */
  var FLUG = 400, HALT = 240;

  /* Wo der Zwischenstand einhält, als Anteil des Durchgangs. Zwei Halte auf
   * vierzig Duellen: einer zu wenig, und die Mitte zieht sich; drei, und der
   * Halt verliert seinen Rang. */
  var HALTE = [0.32, 0.68];

  var FINALE_DUELLE = 5;

  function haltepunkte(anzahl) {
    var p = [];
    HALTE.forEach(function (anteil) {
      var n = Math.round(anzahl * anteil);
      if (n > 2 && n < anzahl - 2 && p.indexOf(n) < 0) { p.push(n); }
    });
    return p;
  }

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

  /* ---------- Saeulenhoehe ----------
   * Die Saeule waechst nicht vom Boden, sondern von der Mitte: 50 % ist der
   * Muenzwurf und damit der einzige Bezugspunkt, der etwas bedeutet. Wer
   * darueber liegt, wurde oefter gewaehlt als nicht - wer darunter, seltener.
   *
   * Vom Boden aus gemessen sahen die Saeulen fast gleich aus, weil sich die
   * Werte um die Mitte draengen (die Glaettung zieht zusaetzlich dorthin).
   * Von der Mitte aus wird aus 55 gegen 40 ein sichtbarer Unterschied,
   * ohne dass die Zahl verzerrt waere.
   */
  /* Wie weit die halbe Saeule reicht. Nicht bis 0 bzw. 100 %: Siegquoten
   * jenseits von 20 und 80 kommen praktisch nicht vor (gemessene Spanne
   * ueber einen Durchgang: rund 30 bis 75), und eine Skala, deren Raender
   * leer bleiben, verschenkt drei Viertel der Flaeche. Mit 30 Punkten je
   * Haelfte fuellt ein realistischer Durchgang die Saeule aus; Werte
   * darueber hinaus laufen an den Anschlag, was ehrlich ist - dort steht
   * die Zahl daneben. */
  var SKALA = 0.30;

  function saeuleSetzen(fuell, anteil, hatAuftritte) {
    if (!hatAuftritte) {
      fuell.style.height = '0%';
      fuell.style.bottom = '50%';
      fuell.style.top = 'auto';
      return;
    }
    var abweichung = anteil - 0.5;              /* -0.5 .. +0.5 */
    var hoehe = Math.min(50, Math.abs(abweichung) / SKALA * 50);
    if (abweichung >= 0) {
      fuell.style.bottom = '50%';
      fuell.style.top = 'auto';
    } else {
      fuell.style.top = '50%';
      fuell.style.bottom = 'auto';
    }
    fuell.style.height = Math.max(1.5, hoehe).toFixed(1) + '%';
  }

  function parteiName(datensatz, parteiId) {
    var p = datensatz.parteien.filter(function (x) { return x.id === parteiId; })[0];
    return p ? p.name : parteiId;
  }

  /* ---------- Das Feld ----------
   * Sieben Säulen nebeneinander. Sie tauschen die Plätze, sobald sich die
   * Rangfolge ändert – das Umsortieren ist der Moment, den man sehen soll,
   * und waagerecht braucht es einen Bruchteil der Höhe einer Zeilenliste.
   * Als Zeilenliste lag das Feld unter dem Falz und der Marker flog aus dem
   * Bild; genau seine Landung ist aber die Rückmeldung.
   */
  function baueFeld(ctx, gross) {
    var el = ctx.el, zustand = ctx.zustand, d = zustand.datensatz;
    var feld = el('div', { 'class': 'feld' + (gross ? ' feld--gross' : '') });
    var chips = Object.create(null);

    d.parteien.forEach(function (p) {
      var fuell = el('div', { 'class': 'chip-fuell' });
      var quote = el('span', { 'class': 'chip-quote' });
      var chip = el('div', { 'class': 'chip' }, [
        el('div', { 'class': 'chip-saeule' }, [fuell]),
        el('span', { 'class': 'chip-marke', text: zustand.kandidaten[p.id] }),
        quote
      ]);
      chips[p.id] = { wurzel: chip, fuell: fuell, quote: quote };
      feld.appendChild(chip);
    });

    function zeichne(bisIndex, animiert) {
      var stand = global.S47_DUELLE.standNach(zustand.duelle, zustand.duellAntworten, bisIndex);
      var reihen = d.parteien.map(function (p) {
        var a = stand.auftritte[p.id] || 0;
        var s = stand.siege[p.id] || 0;
        /* Dieselbe Glaettung wie in der Wertung - sonst zeigte das Feld
         * waehrend des Spiels eine andere Rangfolge als das Ergebnis. */
        return { id: p.id, anteil: a ? global.S47_DUELLE.quote(s, a) / 100 : .5,
                 auftritte: a, siege: s };
      }).sort(function (x, y) {
        if (y.anteil !== x.anteil) { return y.anteil - x.anteil; }
        return y.auftritte - x.auftritte;
      });

      /* FLIP: erst messen, dann umhängen, dann von der alten Stelle
       * zurückgleiten lassen. Ohne das springt die Reihe, und genau das
       * Umsortieren soll man sehen. */
      var vorher = Object.create(null);
      if (animiert) {
        d.parteien.forEach(function (p) {
          vorher[p.id] = chips[p.id].wurzel.getBoundingClientRect().left;
        });
      }

      reihen.forEach(function (r) { feld.appendChild(chips[r.id].wurzel); });

      reihen.forEach(function (r, rang) {
        var c = chips[r.id];
        saeuleSetzen(c.fuell, r.anteil, r.auftritte > 0);
        c.quote.textContent = r.auftritte ? r.siege + '/' + r.auftritte : '·';
        c.wurzel.classList.toggle('chip--leer', !r.auftritte);
        c.wurzel.classList.toggle('chip--fuehrt', rang === 0 && r.auftritte > 0);
      });

      if (animiert && global.requestAnimationFrame) {
        d.parteien.forEach(function (p) {
          var c = chips[p.id].wurzel;
          if (!c.parentNode) { return; }
          var weg = vorher[p.id] - c.getBoundingClientRect().left;
          if (!weg) { return; }
          c.style.transition = 'none';
          c.style.transform = 'translateX(' + weg + 'px)';
          global.requestAnimationFrame(function () {
            if (!c.parentNode) { return; }
            c.style.transition = 'transform 460ms cubic-bezier(.2,.8,.2,1)';
            c.style.transform = '';
          });
        });
      }
      return reihen;
    }

    return { wurzel: feld, chips: chips, zeichne: zeichne };
  }

  /* ---------- 1. Das Duell ---------- */

  function ansicht(ctx) {
    var el = ctx.el, zustand = ctx.zustand, D = ctx.D, buehne = ctx.buehne;
    var d = zustand.datensatz;
    var duelle = zustand.duelle;
    var i = zustand.duellIndex;
    var duell = duelle[i];

    if (!duell) { ctx.gehe(zustand.finaleGebaut ? 'zuordnung' : 'finale'); return; }

    var laeuft = false;   /* während der Beat-Folge ist ein Klick "überspringen" */
    var zeitgeber = [];
    var ueberspringer = null;
    var marker = null;
    function spaeter(fn, ms) { zeitgeber.push(setTimeout(fn, ms)); }

    /* Alles zuruecknehmen, was die Beat-Folge angelegt hat. Wird der Beat
     * uebersprungen, feuert der Zeitgeber nicht mehr, der den Marker
     * entfernt - ohne diese Aufraeumung bleiben die Marker am Bildrand
     * liegen und sammeln sich ueber den Durchgang an. */
    function sofort() {
      zeitgeber.forEach(clearTimeout);
      zeitgeber = [];
      if (ueberspringer) {
        document.removeEventListener('click', ueberspringer, true);
        ueberspringer = null;
      }
      if (marker && marker.parentNode) { marker.parentNode.removeChild(marker); }
      marker = null;
    }

    var bogen = el('div', { 'class': 'spiel-bogen' }, [
      el('div', { 'class': 'spiel-bogen-fuell' })
    ]);
    var zaehler = el('span', { 'class': 'spiel-zaehler',
      text: (i + 1) + ' / ' + duelle.length });
    var serieEl = el('span', { 'class': 'spiel-serie' });

    function siegerPartei(index) {
      var s = zustand.duellAntworten[index];
      if (!s) { return null; }
      var dl = duelle[index];
      return dl.links.id === s ? dl.links.parteiId : dl.rechts.parteiId;
    }

    /* Die Hinweiszeile wertet keine Meinung. Sie stellt eine Frage – „wer ist
     * eigentlich dieses C?" – und genau die löst die Aufdeckung später ein.
     *
     * Zwei Anlässe, in dieser Rangfolge:
     *
     * 1. Der Ausreißer. Wer gerade dem Schlusslicht recht gegeben hat, hat
     *    etwas über sich erfahren, das keine Serie zeigt: Auch das Programm,
     *    dem er sonst widerspricht, hat Sätze, denen er zustimmt. Das ist die
     *    These im Kleinen, mitten im Spiel.
     * 2. Die Serie ab drei gleichen Treffern.
     *
     * Beides nur mit Datengrundlage – unter drei Auftritten sagt eine
     * Rangfolge nichts, und ein „Schlusslicht" nach einem Duell wäre eine
     * Behauptung.
     */
    function zeichneHinweis(gewaehltePartei) {
      var text = '';

      if (gewaehltePartei) {
        var stand = global.S47_DUELLE.standNach(duelle, zustand.duellAntworten, i - 1);
        var reihen = d.parteien.map(function (p) {
          var a = stand.auftritte[p.id] || 0;
          return {
            id: p.id,
            auftritte: a,
            anteil: a ? global.S47_DUELLE.quote(stand.siege[p.id] || 0, a) / 100 : 0.5
          };
        }).filter(function (r) { return r.auftritte >= 3; })
          .sort(function (x, y) { return x.anteil - y.anteil; });

        var eigen = reihen.filter(function (r) { return r.id === gewaehltePartei; })[0];
        if (reihen.length >= 5 && eigen === reihen[0] && eigen.anteil < 0.4) {
          text = 'Überraschung: Das war bisher Ihr Schlusslicht.';
        }
      }

      if (!text) {
        var laenge = 0, letzter = null;
        for (var k = i; k >= 0; k--) {
          var pid = siegerPartei(k);
          if (!pid) { break; }
          if (letzter === null) { letzter = pid; }
          if (pid !== letzter) { break; }
          laenge++;
        }
        if (laenge >= 3 && letzter) {
          text = laenge + '× hintereinander für ' + zustand.kandidaten[letzter];
        }
      }

      serieEl.textContent = text;
      serieEl.classList.toggle('spiel-serie--an', !!text);
    }

    var feld = baueFeld(ctx, false);

    /* ---------- Die beiden Karten ---------- */

    var buehneKarten = el('div', { 'class': 'duell-buehne' });
    var karten = [];

    function karteFuer(a, seite, nr) {
      var k = el('button', {
        'class': 'duell-karte duell-karte--' + seite, type: 'button'
      }, [
        el('span', { 'class': 'duell-nr', text: String(nr) }),
        el('p', { 'class': 'duell-satz', text: D.anonymisiere(d, a.kurz) })
      ]);
      k.addEventListener('click', function () { waehle(a, k); });
      karten.push({ aussage: a, el: k });
      return k;
    }

    buehneKarten.appendChild(karteFuer(duell.links, 'links', 1));
    buehneKarten.appendChild(el('div', { 'class': 'duell-gegen' }, [
      el('span', { 'class': 'duell-gegen-text', text: 'oder' })
    ]));
    buehneKarten.appendChild(karteFuer(duell.rechts, 'rechts', 2));

    /* ---------- Klick und Folge ---------- */

    function weiter() {
      sofort();
      var naechster = i + 1;
      if (naechster >= duelle.length) {
        ctx.gehe(zustand.finaleGebaut ? 'zuordnung' : 'finale');
        return;
      }
      zustand.duellIndex = naechster;
      if (zustand.halte.indexOf(naechster) > -1 && !zustand.halteGezeigt[naechster]) {
        zustand.halteGezeigt[naechster] = true;
        ctx.gehe('zwischenstand');
        return;
      }
      ctx.gehe('spiel');
    }

    function waehle(a, karteEl) {
      if (laeuft) { weiter(); return; }
      laeuft = true;
      zustand.duellAntworten[i] = a.id;

      /* Ein kurzer Stups auf dem Handy. Kein Ton: Ton braucht eine Datei,
       * laesst sich nicht leise machen und ist in der Bahn peinlich. Die
       * Vibration ist derselbe Gedanke ohne diese Nachteile - und wo es sie
       * nicht gibt, fehlt nichts. */
      if (global.navigator && typeof global.navigator.vibrate === 'function') {
        try { global.navigator.vibrate(12); } catch (e) { /* egal */ }
      }

      karten.forEach(function (k) {
        k.el.classList.add(k.aussage.id === a.id ? 'duell-karte--sieg' : 'duell-karte--raus');
        k.el.disabled = true;
      });
      zeichneHinweis(a.parteiId);

      /* Wer waehrend der Beat-Folge irgendwohin klickt, will weiter. Die
       * Karten sind da bereits deaktiviert und schlucken jeden Klick - ohne
       * diesen Faenger am Dokument liefe das angekuendigte Ueberspringen
       * ins Leere, und ungeduldige Nutzer klickten wirkungslos. Capture,
       * damit er vor allen anderen Zielen greift. */
      ueberspringer = function (e) {
        if (e.target && e.target.closest && e.target.closest('.navi')) { return; }
        e.preventDefault();
        e.stopPropagation();
        weiter();
      };
      spaeter(function () {
        document.addEventListener('click', ueberspringer, true);
      }, 140);

      /* Der Marker trägt den Buchstaben des Kandidaten von der gewählten
       * Karte hinunter ins Feld. Er macht den Zusammenhang zwischen dem Satz
       * und dem Kürzel körperlich, statt ihn nur zu behaupten. */
      var ziel = feld.chips[a.parteiId].wurzel;
      var von = karteEl.getBoundingClientRect();
      var nach = ziel.getBoundingClientRect();
      marker = el('div', { 'class': 'marker', text: zustand.kandidaten[a.parteiId] });
      marker.style.left = (von.left + von.width / 2) + 'px';
      marker.style.top = (von.top + von.height / 2) + 'px';
      document.body.appendChild(marker);

      if (global.requestAnimationFrame) {
        var flieger = marker;
        global.requestAnimationFrame(function () {
          /* Wer sofort weiterklickt, hat den Marker inzwischen abgeraeumt -
           * das naechste Bild kommt trotzdem noch. */
          if (!flieger.parentNode) { return; }
          flieger.style.transform = 'translate('
            + (nach.left + nach.width / 2 - (von.left + von.width / 2)) + 'px,'
            + (nach.top + nach.height / 2 - (von.top + von.height / 2)) + 'px) scale(.5)';
          flieger.style.opacity = '.1';
        });
      }

      spaeter(function () {
        if (marker && marker.parentNode) { marker.parentNode.removeChild(marker); }
        marker = null;
        ziel.classList.add('chip--treffer');
        feld.zeichne(i, true);
        spaeter(function () { ziel.classList.remove('chip--treffer'); }, 420);
      }, FLUG);

      spaeter(weiter, FLUG + HALT + 400);
    }

    ctx.setzeTasten(function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) { return; }
      var ziel = e.target && e.target.tagName;
      if (ziel === 'INPUT' || ziel === 'SELECT' || ziel === 'TEXTAREA') { return; }
      if (laeuft) {
        /* Auch die Tastatur soll waehrend der Folge weiterschalten. */
        if (e.key === '1' || e.key === '2' || e.key === 'Enter'
            || e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          weiter();
        }
        return;
      }
      if (e.key === '1' || e.key === 'ArrowLeft') { e.preventDefault(); waehle(karten[0].aussage, karten[0].el); }
      else if (e.key === '2' || e.key === 'ArrowRight') { e.preventDefault(); waehle(karten[1].aussage, karten[1].el); }
    });

    /* ---------- Zusammensetzen ---------- */

    var kopfLinks = duell.finale
      ? el('span', { 'class': 'spiel-thema spiel-thema--finale', text: 'Finale' })
      : el('span', { 'class': 'spiel-thema', text: duell.themaTitel });

    var abschnitt = el('section', { 'class': 'spiel' + (duell.finale ? ' spiel--finale' : '') }, [
      el('div', { 'class': 'spiel-kopf' }, [kopfLinks, zaehler]),
      bogen,
      el('p', { 'class': 'spiel-frage', text: duell.frageText }),
      buehneKarten,
      serieEl,
      el('p', { 'class': 'tastenhinweis',
        text: 'Tastatur: 1 und 2 oder Pfeil links und rechts.' }),
      el('div', { 'class': 'feld-huelle' }, [feld.wurzel]),
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
    feld.zeichne(i - 1, false);
    zeichneHinweis(null);
    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(function () {
        if (!bogen.firstChild || !bogen.parentNode) { return; }
        bogen.firstChild.style.width = ((i + 1) / duelle.length * 100) + '%';
      });
    }
  }

  /* ---------- 2. Zwischenstand mit Wette ----------
   * Der Halt tut zwei Dinge auf einmal: Er unterbricht die Reihe, bevor sie
   * zur Liste wird, und er verwandelt die These in einen Einsatz. Wer hier
   * tippt, hat den Kandidaten allein aus Sätzen erschlossen – der Name kommt
   * erst am Ende dazu.
   */
  function zwischenstand(ctx) {
    var el = ctx.el, zustand = ctx.zustand, buehne = ctx.buehne;
    var d = zustand.datensatz;
    var i = zustand.duellIndex;

    var feld = baueFeld(ctx, true);
    var wetteBereich = el('div', { 'class': 'wette' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Weiter' });

    weiter.addEventListener('click', function () { ctx.gehe('spiel'); });

    var abschnitt = el('section', { 'class': 'halt' }, [
      el('p', { 'class': 'halt-marke', text: 'Zwischenstand' }),
      el('h1', { 'class': 'halt-titel',
        text: i + ' von ' + zustand.duelle.length + ' Duellen' }),
      el('div', { 'class': 'feld-huelle feld-huelle--halt' }, [feld.wurzel]),
      wetteBereich,
      el('div', { 'class': 'navi navi--spiel' }, [weiter])
    ]);
    buehne.appendChild(abschnitt);

    var reihen = feld.zeichne(i - 1, false);

    /* Säulen von null hochfahren lassen: der Zwischenstand soll wirken wie
     * ein Vorhang, der aufgeht, nicht wie eine fertige Tabelle. */
    d.parteien.forEach(function (p) { saeuleSetzen(feld.chips[p.id].fuell, 0.5, false); });
    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(function () {
        global.requestAnimationFrame(function () {
          if (!feld.wurzel.parentNode) { return; }
          feld.zeichne(i - 1, false);
        });
      });
    } else {
      feld.zeichne(i - 1, false);
    }

    /* ---------- Die Wette ---------- */

    var fuehrend = reihen[0];
    if (!fuehrend || !fuehrend.auftritte) { return; }
    var marke = zustand.kandidaten[fuehrend.id];
    var schon = zustand.wetten[fuehrend.id];

    if (schon) {
      wetteBereich.appendChild(el('p', { 'class': 'wette-frage',
        text: 'Auf ' + marke + ' haben Sie bereits getippt.' }));
      wetteBereich.appendChild(el('p', { 'class': 'fliess fliess--klein',
        text: 'Ihr Tipp: ' + parteiName(d, schon.parteiId) + ' – abgegeben nach '
          + schon.nachDuell + ' Duellen. Die Auflösung kommt am Ende.' }));
      return;
    }

    wetteBereich.appendChild(el('p', { 'class': 'wette-frage', text: 'Wer ist ' + marke + '?' }));
    var liste = el('div', { 'class': 'tipp-liste tipp-liste--eng' });
    var knoepfe = [];
    d.parteien.forEach(function (p) {
      var k = el('button', { 'class': 'tipp-knopf tipp-knopf--klein', type: 'button', text: p.name });
      k.addEventListener('click', function () {
        zustand.wetten[fuehrend.id] = { parteiId: p.id, nachDuell: i };
        knoepfe.forEach(function (x) {
          x.el.classList.toggle('tipp-knopf--aktiv', x.id === p.id);
          x.el.disabled = true;
        });
        weiter.textContent = 'Weiter – Auflösung am Ende';
      });
      knoepfe.push({ id: p.id, el: k });
      liste.appendChild(k);
    });
    wetteBereich.appendChild(liste);
    wetteBereich.appendChild(el('p', { 'class': 'fliess fliess--klein',
      text: 'Freiwillig. Ein Tipp zählt umso mehr, je früher er sitzt – '
        + 'und Sie kennen bisher nur Sätze, keine Namen.' }));
  }

  /* ---------- 3. Das Finale ----------
   * Die Sichtung ist durch, zwei Kandidaten stehen vorn. Statt das Ergebnis
   * hinzuschreiben, läuft es aus: fünf Duelle nur zwischen diesen beiden.
   *
   * Das ersetzt den früheren Stichentscheid, der nur bei knappem Ausgang kam
   * und deshalb meistens ausfiel. Ein Höhepunkt, der in drei von vier
   * Durchgängen nicht stattfindet, ist keiner.
   */
  function finale(ctx) {
    var el = ctx.el, zustand = ctx.zustand, buehne = ctx.buehne;
    var DU = global.S47_DUELLE;
    var d = zustand.datensatz;

    var erg = DU.werte(d, zustand.duelle, zustand.duellAntworten, zustand.gewichte);
    var oben = erg.ranking.slice(0, 2);

    if (oben.length < 2) { zustand.finaleGebaut = true; ctx.gehe('zuordnung'); return; }

    var neue = DU.finale(d, oben[0].parteiId, oben[1].parteiId,
      zustand.duelle, FINALE_DUELLE);
    if (!neue.length) { zustand.finaleGebaut = true; ctx.gehe('zuordnung'); return; }

    var starten = el('button', { 'class': 'knopf knopf--haupt', text: 'Anpfiff' });
    starten.addEventListener('click', function () {
      var ab = zustand.duelle.length;
      zustand.duelle = zustand.duelle.concat(neue);
      zustand.finaleGebaut = true;
      zustand.duellIndex = ab;
      ctx.gehe('spiel');
    });

    var a = zustand.kandidaten[oben[0].parteiId];
    var b = zustand.kandidaten[oben[1].parteiId];

    buehne.appendChild(el('section', { 'class': 'halt halt--finale' }, [
      el('p', { 'class': 'halt-marke', text: 'Und jetzt' }),
      el('h1', { 'class': 'finale-titel', text: 'Das Finale' }),
      el('div', { 'class': 'finale-paar' }, [
        el('span', { 'class': 'finale-marke', text: a }),
        el('span', { 'class': 'finale-gegen', text: 'gegen' }),
        el('span', { 'class': 'finale-marke', text: b })
      ]),
      el('p', { 'class': 'fliess',
        text: 'Nach ' + erg.gespielt + ' Duellen stehen diese beiden vorn – '
          + a + ' mit ' + Math.round(oben[0].prozent) + ' %, '
          + b + ' mit ' + Math.round(oben[1].prozent) + ' %. '
          + neue.length + ' letzte Duelle, nur zwischen ihnen, Sätze zur selben Frage. '
          + 'Danach wird aufgedeckt.' }),
      el('div', { 'class': 'navi navi--spiel' }, [starten])
    ]));
  }

  /* ---------- 4. Die Aufdeckung ----------
   * Der Nutzer hat fuenf Minuten lang sieben Buchstaben gefuettert. Die
   * Aufloesung darf deshalb keine neue Liste sein, sondern muss die
   * Verwandlung genau dieses Feldes sein: dieselben Saeulen, an derselben
   * Stelle, in derselben Reihenfolge - nur dass aus C jetzt ein Name und
   * eine Parteifarbe wird.
   *
   * Aufgedeckt wird von hinten nach vorn. Wer zuletzt steht, ist die
   * geringste Ueberraschung; die Spitze kommt zum Schluss, weil dort die
   * Frage sitzt, die das ganze Spiel aufgebaut hat.
   *
   * Erst ab hier duerfen Parteiname und Parteifarbe in den DOM.
   */
  function aufdeckung(ctx, erg) {
    var el = ctx.el, zustand = ctx.zustand, D = ctx.D, d = zustand.datensatz;
    var DU = global.S47_DUELLE;

    var reihen = erg.ranking.map(function (r) {
      return {
        id: r.parteiId,
        anteil: r.prozent / 100,
        siege: r.siege,
        auftritte: r.auftritte
      };
    });

    var feld = el('div', { 'class': 'feld feld--gross feld--auf' });
    var stufen = [];

    reihen.forEach(function (r, rang) {
      var p = D.partei(d, r.id);
      var fuell = el('div', { 'class': 'chip-fuell' });
      var name = el('span', { 'class': 'chip-name', text: p.name });
      var marke = el('span', { 'class': 'chip-marke', text: zustand.kandidaten[r.id] });
      var wert = el('span', { 'class': 'chip-quote', text: Math.round(r.anteil * 100) + ' %' });
      var chip = el('div', { 'class': 'chip chip--verdeckt' }, [
        el('span', { 'class': 'chip-rang', text: String(rang + 1) }),
        el('div', { 'class': 'chip-saeule' }, [fuell]),
        marke,
        name,
        wert
      ]);
      saeuleSetzen(fuell, r.anteil, true);
      stufen.push({ chip: chip, fuell: fuell, farbe: p.farbe || null });
      feld.appendChild(chip);
    });

    /* Von hinten nach vorn, mit Abstand dazwischen. Der Takt ist so
     * gewaehlt, dass man jedem Namen einzeln folgen kann; alles auf einmal
     * waere wieder nur eine Tabelle. */
    var takt = 260;
    stufen.slice().reverse().forEach(function (st, k) {
      setTimeout(function () {
        /* Wer waehrend der Aufloesung weiterblaettert, hat das Feld schon
         * verlassen - die uebrigen Zeitgeber laufen trotzdem ab. */
        if (!st.chip.parentNode) { return; }
        if (st.farbe) { st.fuell.style.background = st.farbe; }
        st.chip.classList.remove('chip--verdeckt');
        st.chip.classList.add('chip--auf');
      }, 260 + k * takt);
    });

    return { wurzel: feld, dauer: 260 + stufen.length * takt };
  }

  global.S47_SPIEL = {
    ansicht: ansicht,
    zwischenstand: zwischenstand,
    finale: finale,
    baueFeld: baueFeld,
    saeuleSetzen: saeuleSetzen,
    aufdeckung: aufdeckung,
    loseKandidaten: loseKandidaten,
    haltepunkte: haltepunkte,
    parteiName: parteiName,
    FINALE_DUELLE: FINALE_DUELLE,
    BUCHSTABEN: BUCHSTABEN
  };
})(window);
