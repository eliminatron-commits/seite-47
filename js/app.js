/* Seite 47 – Ablaufsteuerung und Oberfläche.
 * Enthält KEINE Inhalte einzelner Wahlen. Alles Wahlspezifische kommt aus data/.
 *
 * Bewertet wird durch Vergleich (Schema 2): je Frage stehen 3–4 Aussagen
 * verschiedener Parteien nebeneinander, gewählt werden die beste und die
 * schlechteste. Begründung: CLAUDE.md, Punkt 4.
 */
(function (global) {
  'use strict';

  var D = global.S47_DATA;
  var DU = global.S47_DUELLE;

  /* Wie viele Duelle ein Thema ueberhaupt hergibt: alle Paare aller Fragen. */
  function vorratVon(thema) {
    return thema.fragen.reduce(function (s, fr) {
      var k = fr.aussagen.length;
      return s + k * (k - 1) / 2;
    }, 0);
  }

  var zustand = {
    schritt: 'wahl',        /* wahl | gewichtung | tipp | spiel | zwischenstand | finale | zuordnung | ergebnis */
    datensatz: null,
    gewichte: {},           /* themaId -> Punkte aus dem Budget */
    duelle: [],             /* Duellplan aus S47_DUELLE.plan */
    duellIndex: 0,
    duellAntworten: {},     /* Duellindex -> aussageId des Siegers */
    kandidaten: {},         /* parteiId -> Buchstabe (je Sitzung ausgelost) */
    halte: [],              /* Duellindizes, an denen der Zwischenstand einhaelt */
    halteGezeigt: {},
    wetten: {},             /* parteiId (Kandidat) -> {parteiId getippt, nachDuell} */
    finaleGebaut: false,
    umfang: 'normal',       /* kurz | normal | gruendlich */
    fassung: {},            /* aussageId -> 'kurz'|'original' */
    ergebnis: null,
    tipp: null,             /* parteiId der Erwartung vor dem Durchgang */
    zuordnung: null,        /* {aufgaben:[], antworten:{}} - "Wer war wer?" */
    stufe: 0,               /* 0 verhüllt, 1 Proben, 2 Spitze, 3 alles */
    aufgedeckt: false
  };

  var buehne = document.getElementById('buehne');
  var schritteEl = document.getElementById('schritte');
  var tastenHoerer = null;   /* nur die Frageansicht hoert auf Tasten */
  var bandEl = document.getElementById('band');
  var bandFuell = document.getElementById('band-fuell');

  var SCHRITTE = [
    { id: 'wahl', label: 'Wahl' },
    { id: 'gewichtung', label: 'Themen' },
    { id: 'tipp', label: 'Tipp' },
    { id: 'spiel', label: 'Duelle' },
    { id: 'zuordnung', label: 'Wer war wer?' },
    { id: 'ergebnis', label: 'Ergebnis' }
  ];

  /* ---------- Hilfen ---------- */

  function el(tag, attrs, kinder) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') { e.textContent = attrs[k]; }
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') { e.addEventListener(k.slice(2), attrs[k]); }
      else if (attrs[k] !== null && attrs[k] !== undefined) { e.setAttribute(k, attrs[k]); }
    });
    (kinder || []).forEach(function (k) { if (k) { e.appendChild(k); } });
    return e;
  }

  function leere(n) { while (n.firstChild) { n.removeChild(n.firstChild); } }

  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  function datumDeutsch(iso) {
    var t = String(iso).split('-');
    return parseInt(t[2], 10) + '. ' + MONATE[parseInt(t[1], 10) - 1] + ' ' + t[0];
  }

  /* Zufällige, aber innerhalb der Sitzung stabile Reihenfolge – sonst wäre die
   * Position in der Frage ein Marker: die Datensätze führen die Parteien immer
   * in derselben Reihenfolge auf. */
  function mische(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function zeigeSchritte() {
    leere(schritteEl);
    if (zustand.schritt === 'wahl') { schritteEl.setAttribute('aria-hidden', 'true'); return; }
    schritteEl.setAttribute('aria-hidden', 'false');
    /* Zwischenstand und Finale sind Haltepunkte innerhalb der Duelle, keine
     * eigenen Schritte - in der Leiste bleibt die Marke deshalb auf "Duelle"
     * stehen, statt zu springen. */
    var innerhalb = { zwischenstand: 'spiel', finale: 'spiel' };
    var hier = innerhalb[zustand.schritt] || zustand.schritt;
    var jetzt = 0;
    SCHRITTE.forEach(function (s, i) { if (s.id === hier) { jetzt = i; } });
    SCHRITTE.forEach(function (s, i) {
      var klasse = 'schritt';
      if (i < jetzt) { klasse += ' schritt--erledigt'; }
      if (i === jetzt) { klasse += ' schritt--aktiv'; }
      schritteEl.appendChild(el('span', { 'class': klasse }, [
        el('span', { 'class': 'schritt-text', text: s.label })
      ]));
    });
  }

  /* Das Band zeigt den Weg durch die Fragen - die einzige Strecke, deren
   * Laenge der Nutzer vorher nicht kennt. */
  function zeigeBand() {
    /* Der Fortschritt steckt seit der Spielform im Bogen der Spielansicht,
     * direkt ueber den Karten - dort schaut der Nutzer ohnehin hin. Ein
     * zweites Band im Kopf waere dieselbe Auskunft an der falschen Stelle. */
    bandEl.hidden = true;
    if (bandFuell) { bandFuell.style.width = '0%'; }
  }

  var ANSICHTEN = {};

  function gehe(schritt) {
    zustand.schritt = schritt;
    zeigeSchritte();
    if (tastenHoerer) {
      document.removeEventListener('keydown', tastenHoerer);
      tastenHoerer = null;
    }
    /* Flugmarker sind am body verankert, nicht an der Buehne - ein
     * Ansichtswechsel mitten im Flug (Kopfzeile, Neustart) liesse sie
     * sonst stehen. */
    var reste = document.querySelectorAll('.marker');
    for (var r = 0; r < reste.length; r++) {
      if (reste[r].parentNode) { reste[r].parentNode.removeChild(reste[r]); }
    }
    leere(buehne);
    window.scrollTo(0, 0);
    ANSICHTEN[schritt]();
    zeigeBand();
    if (buehne.firstChild && buehne.firstChild.classList) {
      buehne.firstChild.classList.add('einblenden');
    }
  }

  function themaNach(id) {
    return zustand.datensatz.themen.filter(function (t) { return t.id === id; })[0];
  }

  function frageNach(themaId, frageId) {
    return themaNach(themaId).fragen.filter(function (f) { return f.id === frageId; })[0];
  }

  /* ---------- 1. Wahl auswählen ---------- */

  /* Sieben Buchstaben, die sich langsam umsortieren: der Aufmacher zeigt in
   * zwei Sekunden, worum es geht - verdeckte Programme, die sich waehrend des
   * Spiels gegenseitig ueberholen. Reine Zierde, ohne Bezug zu echten Daten
   * (es ist noch keine Wahl gewaehlt). */
  function heroFeld() {
    var reihe = el('div', { 'class': 'hero-feld' });
    var marken = [];
    'ABCDEFG'.split('').forEach(function (b) {
      var m = el('span', { 'class': 'hero-marke', text: b });
      marken.push(m);
      reihe.appendChild(m);
    });
    var takt = setInterval(function () {
      if (!reihe.parentNode) { clearInterval(takt); return; }
      var i = Math.floor(Math.random() * marken.length);
      var j = Math.floor(Math.random() * marken.length);
      if (i === j) { return; }
      /* Position je Element merken, nicht je Platz - nach dem Tausch steht
       * an Platz k ein anderes Element, und die Rechnung ginge daneben. */
      var vorher = marken.map(function (m) {
        return { el: m, links: m.getBoundingClientRect().left };
      });
      var t = marken[i]; marken[i] = marken[j]; marken[j] = t;
      marken.forEach(function (m) { reihe.appendChild(m); });
      vorher.forEach(function (v) {
        var m = v.el;
        var weg = v.links - m.getBoundingClientRect().left;
        if (!weg) { return; }
        m.style.transition = 'none';
        m.style.transform = 'translateX(' + weg + 'px)';
        requestAnimationFrame(function () {
          if (!m.parentNode) { return; }
          m.style.transition = 'transform 700ms cubic-bezier(.2,.8,.2,1)';
          m.style.transform = '';
        });
      });
    }, 1500);
    return reihe;
  }

  ANSICHTEN.wahl = function () {
    var wahlen = D.manifest();

    var select = el('select', { id: 'wahlauswahl', 'class': 'feld' });
    select.appendChild(el('option', { value: '', text: 'Bitte Wahl auswählen …' }));
    wahlen.forEach(function (w) {
      select.appendChild(el('option', {
        value: w.id,
        text: w.name + ' – ' + datumDeutsch(w.wahltag)
      }));
    });

    var hinweis = el('p', { 'class': 'hinweis' });
    var knopf = el('button', { 'class': 'knopf knopf--haupt', text: 'Weiter', disabled: 'disabled' });

    select.addEventListener('change', function () { knopf.disabled = !select.value; });

    knopf.addEventListener('click', function () {
      if (!select.value) { return; }
      knopf.disabled = true;
      hinweis.textContent = 'Datensatz wird geladen …';
      D.lade(select.value, function (fehler, datensatz) {
        if (fehler) {
          hinweis.textContent = 'Fehler: ' + fehler.message;
          knopf.disabled = false;
          return;
        }
        starteWahl(datensatz);
      });
    });

    var ablauf = el('ol', { 'class': 'ablauf' });
    [
      ['Punkte setzen', 'Zehn Punkte je Thema, zum Verteilen. Wo Sie mehr setzen, wird öfter gefragt – länger wird es dadurch nie.'],
      ['Duellieren', 'Zwei Sätze, einer gewinnt. Erst nach dem Klick sehen Sie, welchem verdeckten Programm der Punkt zufällt.'],
      ['Aufdecken', 'Am Ende bekommen die Buchstaben Namen – und Sie erfahren, wie gut Sie sie erkannt haben.']
    ].forEach(function (t, i) {
      ablauf.appendChild(el('li', { 'class': 'ablauf-schritt' }, [
        el('span', { 'class': 'ablauf-nr', text: String(i + 1) }),
        el('span', {}, [
          el('span', { 'class': 'ablauf-titel', text: t[0] }),
          el('span', { 'class': 'ablauf-text', text: t[1] })
        ])
      ]));
    });

    buehne.appendChild(el('section', {}, [
      el('div', { 'class': 'hero' }, [
        heroFeld(),
        el('h1', { text: 'Sieben Programme. Keine Namen.' }),
        el('p', { 'class': 'hero-lead', text: 'Einzeln gelesen klingt jedes Wahlprogramm zustimmungsfähig. Hier treten die Sätze gegeneinander an – ohne Absender. Wer sie geschrieben hat, erfahren Sie zum Schluss. Alles bleibt in diesem Browser.' })
      ]),
      ablauf,
      el('div', { 'class': 'karte karte--start' }, [
        el('label', { 'class': 'label', 'for': 'wahlauswahl', text: 'Welche Wahl?' }),
        select,
        hinweis,
        knopf
      ])
    ]));

    if (!wahlen.length) {
      hinweis.textContent = 'Keine Wahl-Datensätze gefunden (data/wahlen.js).';
    }
  };

  function starteWahl(datensatz) {
    zustand.datensatz = datensatz;
    zustand.gewichte = {};
    zustand.duelle = [];
    zustand.duellAntworten = {};
    zustand.duellIndex = 0;
    zustand.fassung = {};
    zustand.kandidaten = global.S47_SPIEL.loseKandidaten(datensatz);
    zustand.halte = [];
    zustand.halteGezeigt = {};
    zustand.wetten = {};
    zustand.finaleGebaut = false;
    zustand.ergebnis = null;
    zustand.tipp = null;
    zustand.zuordnung = null;
    zustand.stufe = 0;
    zustand.aufgedeckt = false;
    zustand.umfang = 'normal';
    zustand.gewichte = DU.startPunkte(datensatz);
    gehe('gewichtung');
  }

  /* ---------- 2. Themen gewichten ---------- */

  ANSICHTEN.gewichtung = function () {
    var d = zustand.datensatz;
    var gesamt = DU.budget(d);
    var liste = el('div', { 'class': 'punkte-liste' });
    var zeilen = [];

    function vergeben() {
      var summe = 0;
      d.themen.forEach(function (t) { summe += zustand.gewichte[t.id]; });
      return summe;
    }

    function duelleGesamt() {
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
    });

    var restZahl = el('strong', { 'class': 'budget-zahl' });
    var restText = el('span', { 'class': 'budget-text' });
    var kasse = el('div', { 'class': 'budget' }, [restZahl, restText]);
    var bilanz = el('p', { 'class': 'budget-bilanz' });

    /* Die Kasse ist der einzige Ort, der die Knappheit sichtbar macht -
     * deshalb steht dort die Zahl, nicht nur ein Balken. */
    function zeichneKasse() {
      var rest = gesamt - vergeben();
      restZahl.textContent = rest === 0 ? '✓' : String(rest);
      restText.textContent = rest === 0
        ? 'Alle ' + gesamt + ' Punkte verteilt.'
        : (rest === 1 ? 'Punkt noch zu vergeben.' : 'Punkte noch zu vergeben.');
      kasse.classList.toggle('budget--fertig', rest === 0);
      weiter.disabled = rest !== 0;

      /* Was man sich einhandelt, in einer Zeile. Ohne sie ist "10 Punkte"
       * eine Zahl ohne Folgen - und die Laenge des Durchgangs war der
       * haeufigste Grund abzubrechen. */
      umfangKnoepfe.forEach(function (x) {
        x.el.classList.toggle('umfang-knopf--aktiv', x.id === zustand.umfang);
      });
      var n = duelleGesamt();
      bilanz.textContent = n + ' Duelle, ungefähr ' + Math.max(2, Math.round(n / 8))
        + ' Minuten. Wie Sie die Punkte verteilen, ändert diese Zahl nicht – '
        + 'die Punkte verschieben nur, wo genauer gefragt wird. Ein kürzerer '
        + 'Durchgang heißt weniger Duelle je Programm und damit gröbere Werte.';
    }

    d.themen.forEach(function (t) {
      var punkteEl = el('span', { 'class': 'punkte-wert' });
      var tiefeEl = el('span', { 'class': 'punkte-tiefe' });
      var fuell = el('div', { 'class': 'punkte-fuell' });
      var weniger = el('button', {
        'class': 'punkte-knopf', type: 'button', text: '−',
        'aria-label': 'Weniger Punkte für ' + t.titel
      });
      var mehr = el('button', {
        'class': 'punkte-knopf', type: 'button', text: '+',
        'aria-label': 'Mehr Punkte für ' + t.titel
      });

      var zeile = el('div', { 'class': 'punkte-zeile' }, [
        el('div', { 'class': 'punkte-kopf' }, [
          el('span', { 'class': 'punkte-titel', text: t.titel }),
          punkteEl
        ]),
        t.beschreibung
          ? el('p', { 'class': 'punkte-text', text: t.beschreibung })
          : null,
        el('div', { 'class': 'punkte-balken' }, [fuell]),
        el('div', { 'class': 'punkte-regler' }, [weniger, mehr, tiefeEl])
      ]);

      function zeichne() {
        var p = zustand.gewichte[t.id];
        var rest = gesamt - vergeben();
        punkteEl.textContent = p + ' P.';
        fuell.style.width = (p / DU.PUNKTE_MAX * 100) + '%';
        var n = DU.duelleFuerPunkte(p, vorratVon(t), zustand.umfang);
        tiefeEl.textContent = n === 0
          ? DU.punkteLabel(p)
          : DU.punkteLabel(p) + ' · ' + n + (n === 1 ? ' Duell' : ' Duelle');
        weniger.disabled = p <= 0;
        mehr.disabled = p >= DU.PUNKTE_MAX || rest < DU.PUNKTE_SCHRITT;
        zeile.classList.toggle('punkte-zeile--aus', p === 0);
      }

      function alleZeichnen() {
        zeilen.forEach(function (f) { f(); });
        zeichneKasse();
      }

      weniger.addEventListener('click', function () {
        zustand.gewichte[t.id] = Math.max(0, zustand.gewichte[t.id] - DU.PUNKTE_SCHRITT);
        alleZeichnen();
      });
      mehr.addEventListener('click', function () {
        if (gesamt - vergeben() < DU.PUNKTE_SCHRITT) { return; }
        zustand.gewichte[t.id] = Math.min(DU.PUNKTE_MAX,
          zustand.gewichte[t.id] + DU.PUNKTE_SCHRITT);
        alleZeichnen();
      });

      zeilen.push(zeichne);
      liste.appendChild(zeile);
    });

    var hinweis = el('p', { 'class': 'hinweis' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Weiter' });
    weiter.addEventListener('click', function () {
      zustand.duelle = DU.plan(d, zustand.gewichte, null, zustand.umfang);
      if (!zustand.duelle.length) {
        hinweis.textContent = 'Bitte mindestens einem Thema Punkte geben.';
        return;
      }
      zustand.duellIndex = 0;
      zustand.duellAntworten = {};
      zustand.halte = global.S47_SPIEL.haltepunkte(zustand.duelle.length);
      zustand.halteGezeigt = {};
      zustand.finaleGebaut = false;
      gehe('tipp');
    });

    zeilen.forEach(function (f) { f(); });
    zeichneKasse();

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Sie haben ' + gesamt + ' Punkte.' }),
      el('p', { 'class': 'fliess', text: 'Verteilen Sie sie auf die Themen. Mehr für das eine geht nur zu Lasten des anderen – und wo Sie mehr setzen, wird öfter gefragt. Die Themen stammen aus den Programmen zu: ' + d.name + '.' }),
      kasse,
      umfangReihe,
      liste,
      bilanz,
      hinweis,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück', onclick: function () { gehe('wahl'); } }),
        weiter
      ])
    ]));
  };

  /* ---------- 2b. Tipp vor dem Durchgang ----------
   * Die These des Projekts lautet: Menschen wählen Etiketten, nicht Inhalte.
   * Prüfbar wird sie erst, wenn die Erwartung festgehalten wird, bevor der
   * erste Satz gelesen ist - hinterher erinnert sich niemand unverzerrt daran,
   * was er vorher gedacht hat.
   *
   * Hier stehen Parteinamen im DOM, und das ist die einzige Stelle vor der
   * Aufdeckung, an der das erlaubt ist: Die Namen hängen an nichts. Es ist
   * eine bloße Liste der Parteien dieser Wahl, keine Zuordnung zu einer
   * Aussage. Die Ansicht zeigt deshalb auch keine Farben und keine Logos -
   * die gehören zur Aufdeckung, und ein Farbschema hier wäre ein Marker,
   * den das Auge später wiedererkennt.
   */
  ANSICHTEN.tipp = function () {
    var d = zustand.datensatz;
    var liste = el('div', { 'class': 'tipp-liste' });

    function waehle(id) {
      zustand.tipp = id;
      zeichne();
    }

    var knoepfe = [];
    d.parteien.forEach(function (p) {
      var k = el('button', { 'class': 'tipp-knopf', type: 'button', text: p.name });
      k.addEventListener('click', function () { waehle(p.id); });
      knoepfe.push({ id: p.id, el: k });
      liste.appendChild(k);
    });
    var keiner = el('button', {
      'class': 'tipp-knopf tipp-knopf--offen', type: 'button',
      text: 'Weiß ich nicht'
    });
    keiner.addEventListener('click', function () { waehle('_offen'); });
    knoepfe.push({ id: '_offen', el: keiner });
    liste.appendChild(keiner);

    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Los geht’s' });

    function zeichne() {
      knoepfe.forEach(function (k) {
        k.el.classList.toggle('tipp-knopf--aktiv', zustand.tipp === k.id);
      });
      weiter.disabled = !zustand.tipp;
    }
    zeichne();

    weiter.addEventListener('click', function () {
      zustand.duellIndex = 0;
      gehe('spiel');
    });

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Und, was erwarten Sie?' }),
      el('p', { 'class': 'fliess', text: 'Bevor Sie den ersten Satz lesen: Welche Partei wird am Ende oben stehen? Der Tipp bleibt in diesem Browser und wird erst nach der Aufdeckung wieder gezeigt - dann können Sie ihn mit dem Ergebnis vergleichen.' }),
      liste,
      el('p', { 'class': 'fliess fliess--klein', text: 'Der Tipp beeinflusst die Auswertung nicht. Er wird nirgends gespeichert und nirgends übertragen.' }),
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück', onclick: function () { gehe('gewichtung'); } }),
        weiter
      ])
    ]));
  };

  /* ---------- 3. Das Spiel: ein Duell nach dem anderen ----------
   * Die Ansicht selbst steckt in js/spiel.js - sie ist fast nur Bewegung und
   * haette app.js sonst zugeschuettet. Hier bleibt nur die Bruecke: Was die
   * Ansicht vom Ablauf braucht, bekommt sie als Kontext gereicht, statt sich
   * ein zweites Mal an den Zustand zu haengen.
   */
  /* Der Kontext ist die einzige Bruecke zwischen Ablauf und Spielansicht.
   * Ohne ihn haenge js/spiel.js ein zweites Mal am Zustand, und wer die
   * Reihenfolge der Schritte aendert, muesste an zwei Stellen suchen. */
  function spielKontext() {
    return {
      el: el,
      buehne: buehne,
      zustand: zustand,
      D: D,
      gehe: gehe,
      setzeTasten: function (fn) {
        tastenHoerer = fn;
        document.addEventListener('keydown', tastenHoerer);
      }
    };
  }

  ANSICHTEN.zwischenstand = function () { global.S47_SPIEL.zwischenstand(spielKontext()); };
  ANSICHTEN.finale = function () { global.S47_SPIEL.finale(spielKontext()); };

  ANSICHTEN.spiel = function () {
    global.S47_SPIEL.ansicht({
      el: el,
      buehne: buehne,
      zustand: zustand,
      D: D,
      gehe: gehe,
      setzeTasten: function (fn) {
        tastenHoerer = fn;
        document.addEventListener('keydown', tastenHoerer);
      }
    });
  };

  /* ---------- 5. Wer war wer? ----------
   * Die Messung zur These: nicht, ob jemand „gut“ oder „schlecht“ rät,
   * sondern wie viel die Etiketten über die Sätze tatsächlich hergeben.
   *
   * Gefragt wird nach den BUCHSTABEN, nicht nach einzelnen Sätzen. Der Nutzer
   * hat fünf Minuten lang C und E gefüttert und sich längst ein Bild von
   * ihnen gemacht - danach nach einem einzelnen Satz zu fragen, wäre eine
   * andere, künstlichere Aufgabe. Als Beleg steht bei jedem Buchstaben, was
   * der Nutzer selbst für ihn gewählt hat.
   *
   * Jede Partei ist genau einmal zu vergeben. Das macht daraus ein
   * Zuordnungsrätsel mit Ausschlussverfahren statt sieben unabhängiger
   * Ratefragen - und es hält den Zufallserwartungswert bei genau 1 Treffer,
   * unabhängig von der Parteienzahl (Fixpunkte einer zufälligen Permutation).
   * Ohne diese Eins wäre "2 von 7" keine Auskunft.
   *
   * Kein parteibezogenes Datum wandert vor der Aufdeckung in den DOM - die
   * Lösung steht in zustand.zuordnung, nicht am Element.
   */
  function baueZuordnung() {
    var erg = DU.werte(zustand.datensatz, zustand.duelle,
      zustand.duellAntworten, zustand.gewichte);

    /* Belege je Kandidat: bevorzugt Sätze, die der Nutzer GEWAEHLT hat - die
     * hat er sicher gelesen, und sie sind der Grund, warum dieser Buchstabe
     * dort steht, wo er steht. */
    var gewonnen = Object.create(null), verloren = Object.create(null);
    zustand.duelle.forEach(function (duell, i) {
      var sieger = zustand.duellAntworten[i];
      if (!sieger) { return; }
      [duell.links, duell.rechts].forEach(function (x) {
        var topf = x.id === sieger ? gewonnen : verloren;
        (topf[x.parteiId] = topf[x.parteiId] || []).push(x);
      });
    });

    var aufgaben = erg.ranking.map(function (r) {
      var belege = (gewonnen[r.parteiId] || []).slice();
      var selbstGewaehlt = belege.length > 0;
      if (!selbstGewaehlt) { belege = (verloren[r.parteiId] || []).slice(); }
      return {
        parteiId: r.parteiId,
        marke: zustand.kandidaten[r.parteiId],
        prozent: Math.round(r.prozent),
        siege: r.siege,
        auftritte: r.auftritte,
        gewaehlt: selbstGewaehlt,
        belege: mische(belege).slice(0, 2)
      };
    });

    return { aufgaben: aufgaben, antworten: {} };
  }

  ANSICHTEN.zuordnung = function () {
    var d = zustand.datensatz;
    if (!zustand.zuordnung) { zustand.zuordnung = baueZuordnung(); }
    var z = zustand.zuordnung;

    if (!z.aufgaben.length) { gehe('ergebnis'); return; }

    var liste = el('div', { 'class': 'liste' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt' });
    var stand = el('p', { 'class': 'fortschritt' });
    var zeilen = [];

    function benutztVon(parteiId) {
      var wer = null;
      Object.keys(z.antworten).forEach(function (kandidat) {
        if (z.antworten[kandidat] === parteiId) { wer = kandidat; }
      });
      return wer;
    }

    function zeichneAlle() {
      zeilen.forEach(function (f) { f(); });
      var offen = z.aufgaben.length - Object.keys(z.antworten).length;
      stand.textContent = offen === 0
        ? 'Alles zugeordnet.'
        : offen + (offen === 1 ? ' Buchstabe ist noch offen.' : ' Buchstaben sind noch offen.');
      stand.classList.toggle('fortschritt--offen', offen > 0);
      weiter.textContent = offen === 0 ? 'Aufdecken' : 'Ohne Rest aufdecken';
      weiter.classList.toggle('knopf--haupt', offen === 0);
      weiter.classList.toggle('knopf--still', offen > 0);
    }

    z.aufgaben.forEach(function (auf) {
      var wahl = el('div', { 'class': 'tipp-liste tipp-liste--eng' });
      var knoepfe = [];

      d.parteien.forEach(function (p) {
        var k = el('button', {
          'class': 'tipp-knopf tipp-knopf--klein', type: 'button', text: p.name
        });
        k.addEventListener('click', function () {
          /* Jede Partei nur einmal: wer sie schon woanders vergeben hat, gibt
           * sie dort ab. Das ist bequemer als eine Fehlermeldung und macht das
           * Ausschlussverfahren erst benutzbar. */
          var vorher = benutztVon(p.id);
          if (vorher && vorher !== auf.parteiId) { delete z.antworten[vorher]; }
          if (z.antworten[auf.parteiId] === p.id) { delete z.antworten[auf.parteiId]; }
          else { z.antworten[auf.parteiId] = p.id; }
          zeichneAlle();
        });
        knoepfe.push({ id: p.id, el: k });
        wahl.appendChild(k);
      });

      var belege = el('div', { 'class': 'zuordnung-belege' });
      auf.belege.forEach(function (x) {
        belege.appendChild(el('p', { 'class': 'zuordnung-text',
          text: '„' + D.anonymisiere(d, x.kurz) + '“' }));
      });

      var karte = el('div', { 'class': 'karte karte--zuordnung' }, [
        el('div', { 'class': 'zuordnung-kopf' }, [
          el('span', { 'class': 'zuordnung-marke', text: auf.marke }),
          el('div', {}, [
            el('p', { 'class': 'zuordnung-zahl', text: auf.prozent + ' %' }),
            el('p', { 'class': 'zuordnung-nr',
              text: auf.siege + ' von ' + auf.auftritte + ' Duellen gewonnen' })
          ])
        ]),
        el('p', { 'class': 'zuordnung-label', text: auf.gewaehlt
          ? 'Diese Sätze haben Sie gewählt:'
          : 'Von diesem Programm haben Sie nichts gewählt:' }),
        belege,
        wahl
      ]);

      zeilen.push(function () {
        var gesetzt = z.antworten[auf.parteiId];
        knoepfe.forEach(function (x) {
          var anderswo = benutztVon(x.id);
          x.el.classList.toggle('tipp-knopf--aktiv', gesetzt === x.id);
          x.el.classList.toggle('tipp-knopf--weg', !!anderswo && anderswo !== auf.parteiId);
        });
        karte.classList.toggle('karte--zuordnung-fertig', !!gesetzt);
      });

      liste.appendChild(karte);
    });

    weiter.addEventListener('click', function () { gehe('ergebnis'); });
    zeichneAlle();

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Sieben Buchstaben, sieben Programme.' }),
      el('p', { 'class': 'fliess', text: 'Die Duelle sind durch. Bevor aufgedeckt wird: Welcher Buchstabe ist welche Partei? Jede Partei kommt genau einmal vor – wer eine schon vergeben hat, nimmt sie dem anderen weg. Rückmeldung gibt es erst danach, sonst könnte man sich den Rest zusammenreimen.' }),
      liste,
      stand,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück zu den Duellen', onclick: function () {
          zustand.duellIndex = Math.max(0, zustand.duelle.length - 1);
          gehe('spiel');
        } }),
        weiter
      ])
    ]));
  };

  /* ---------- 4. Ergebnis ---------- */


  ANSICHTEN.ergebnis = function () {
    var d = zustand.datensatz;
    var erg = DU.werte(d, zustand.duelle, zustand.duellAntworten, zustand.gewichte);
    zustand.ergebnis = erg;

    var abschnitt = el('section', {}, [
      el('h1', { text: 'Ihr Ergebnis' }),
      el('p', { 'class': 'fliess', text: d.name + ' am ' + datumDeutsch(d.wahltag) + '.' })
    ]);

    if (!zustand.aufgedeckt) {
      abschnitt.appendChild(el('div', { 'class': 'karte karte--aufdeckung' }, [
        el('p', { 'class': 'aufdeckung-zahl', text: String(erg.gespielt) }),
        el('p', { 'class': 'aufdeckung-text', text: erg.gespielt === 1
          ? 'Duell ist ausgewertet.'
          : 'Duelle sind ausgewertet.' }),
        el('p', { 'class': 'fliess', style: 'margin:1.25rem auto 0',
          text: 'Bis hierhin haben Sie nur Sätze gegeneinander abgewogen. Der nächste Schritt gibt den sieben Buchstaben ihre Namen – er lässt sich nicht zurücknehmen.' }),
        (erg.duelleGesamt - erg.gespielt)
          ? el('p', { 'class': 'fliess fliess--klein', text: (erg.duelleGesamt - erg.gespielt) + ' von ' + erg.duelleGesamt + ' Duellen haben Sie übersprungen. Sie zählen für keine Partei.' })
          : null,
        el('button', {
          'class': 'knopf knopf--haupt', text: 'Aufdecken',
          onclick: function () { zustand.stufe = 1; zustand.aufgedeckt = true; gehe('ergebnis'); }
        }),
        el('button', {
          'class': 'knopf knopf--still', text: 'Zurück zu den Duellen',
          onclick: function () {
            zustand.duellIndex = Math.max(0, zustand.duelle.length - 1);
            gehe('spiel');
          }
        })
      ]));
      buehne.appendChild(abschnitt);
      return;
    }

    /* Gesamt-Ranking */
    var rang = el('div', { 'class': 'liste' });
    var fuellungen = [];

    /* Wie viele Parteien teilen sich den ersten Platz? Verglichen wird der
     * gerundete Wert - zwei Parteien, die beide als 70 % dastehen, dürfen
     * nicht durch eine unsichtbare Nachkommastelle sortiert werden. */
    var spitzenwert = erg.ranking.length ? Math.round(erg.ranking[0].prozent) : 0;
    var spitze = erg.ranking.filter(function (r) {
      return Math.round(r.prozent) === spitzenwert;
    });

    /* Der Balken wächst von der Mitte, wie die Säulen im Spiel: 50 % ist der
     * Münzwurf. Von links gemessen sahen 43 % und 57 % fast gleich lang aus,
     * obwohl das eine unter und das andere über dem Zufall liegt - und genau
     * dieser Unterschied ist die Auskunft. Maßstab wie dort: eine halbe
     * Balkenbreite steht für 30 Prozentpunkte. */
    function balken(p, wert, stil) {
      var fuell = el('div', { 'class': 'balken-fuell', style: 'background:' + (p.farbe || '#888') });
      fuellungen.push([fuell, wert]);
      return el('div', { 'class': 'balken', style: stil || null }, [fuell]);
    }

    function balkenSetzen(fuell, wert) {
      var abweichung = (wert - 50) / 100;
      var breite = Math.min(50, Math.abs(abweichung) / 0.30 * 50);
      if (abweichung >= 0) { fuell.style.left = '50%'; fuell.style.right = 'auto'; }
      else { fuell.style.right = '50%'; fuell.style.left = 'auto'; }
      fuell.style.width = Math.max(1.5, breite).toFixed(1) + '%';
    }

    /* Das Finale ist eigens ausgewiesen: Wer dort gewonnen hat, hat den
     * direkten Vergleich gewonnen - das ist eine andere Auskunft als ein
     * Prozentwert und soll nicht darin verschwinden. */
    var finaleStand = null;
    zustand.duelle.forEach(function (duell, k) {
      if (!duell.finale) { return; }
      var sieger = zustand.duellAntworten[k];
      if (!sieger) { return; }
      finaleStand = finaleStand || { siege: Object.create(null), gespielt: 0 };
      finaleStand.gespielt++;
      [duell.links, duell.rechts].forEach(function (x) {
        if (finaleStand.siege[x.parteiId] === undefined) { finaleStand.siege[x.parteiId] = 0; }
        if (x.id === sieger) { finaleStand.siege[x.parteiId]++; }
      });
    });

    var siegerKarte = null, trefferKarte = null, tippKarte = null;

    if (spitze.length) {
      var karte = el('div', { 'class': 'karte karte--sieger' }, [
        el('p', { 'class': 'sieger-zeile', text:
          spitze.length > 1 ? 'Gleichauf an der Spitze' : 'Größte Übereinstimmung' })
      ]);
      spitze.forEach(function (r) {
        var p = D.partei(d, r.parteiId);
        karte.appendChild(el('p', { 'class': 'sieger-name' }, [
          parteiMarke(p),
          el('span', { 'class': 'sieger-wert', text: spitzenwert + ' %' })
        ]));
        karte.appendChild(balken(p, spitzenwert, 'margin-top:.6rem'));
      });
      if (finaleStand && finaleStand.gespielt) {
        var namen = Object.keys(finaleStand.siege);
        var sortiert = namen.slice().sort(function (x, y) {
          return finaleStand.siege[y] - finaleStand.siege[x];
        });
        var eindeutig = namen.length === 2
          && finaleStand.siege[sortiert[0]] !== finaleStand.siege[sortiert[1]];
        karte.appendChild(el('p', { 'class': 'fliess fliess--klein', style: 'margin:.9rem 0 0',
          text: 'Im Finale standen sich '
            + sortiert.map(function (pid) {
                return D.partei(d, pid).name + ' ' + finaleStand.siege[pid];
              }).join(' und ') + ' gegenüber'
            + (eindeutig
              ? ' – der direkte Vergleich ging an ' + D.partei(d, sortiert[0]).name + '.'
              : ' – der direkte Vergleich blieb unentschieden.') }));
      } else if (spitze.length > 1) {
        karte.appendChild(el('p', { 'class': 'fliess fliess--klein', style: 'margin:.9rem 0 0',
          text: spitze.length + ' Parteien erreichen denselben Wert. Ein Vorsprung '
            + 'lässt sich daraus nicht ableiten – hilfreich ist der Blick auf die '
            + 'einzelnen Themen weiter unten.' }));
      }
      siegerKarte = karte;
    }

    /* Die Wetten aus den Zwischenständen. Sie sind die schärfste Fassung der
     * These: Der Nutzer hat mitten im Lauf getippt, wer der Kandidat ist, dem
     * er ständig recht gibt – allein aus Sätzen, ohne Namen. Deshalb steht
     * dabei, nach wie vielen Duellen der Tipp fiel; ein früher Treffer sagt
     * mehr als ein später. */
    var wettKarte = null;
    var wettIds = Object.keys(zustand.wetten);
    if (wettIds.length) {
      var wKarte = el('div', { 'class': 'karte karte--tipp' }, [
        el('p', { 'class': 'tipp-zeile', text: 'Ihre Wetten während des Spiels' })
      ]);
      wettIds.forEach(function (kandidatId) {
        var w = zustand.wetten[kandidatId];
        var richtig = w.parteiId === kandidatId;
        wKarte.appendChild(el('p', { 'class': 'wett-zeile' + (richtig ? ' wett-zeile--gut' : ''),
          text: (richtig ? '✓ ' : '✕ ')
            + 'Kandidat ' + zustand.kandidaten[kandidatId] + ' nach ' + w.nachDuell
            + ' Duellen auf ' + D.partei(d, w.parteiId).name + ' getippt – '
            + (richtig ? 'richtig.' : 'es war ' + D.partei(d, kandidatId).name + '.') }));
      });
      wettKarte = wKarte;
    }

    /* Wer war wer? Die Trefferzahl allein sagt nichts - erst der
     * Zufallserwartungswert macht sie lesbar. Bei jeder Partei genau einmal
     * ist der im Mittel exakt 1 Treffer, unabhängig von der Zahl der Parteien
     * (Fixpunkte einer zufälligen Permutation). Diese Eins steht deshalb
     * daneben. */
    if (zustand.zuordnung && zustand.zuordnung.aufgaben.length) {
      var za = zustand.zuordnung;
      var treffer = 0, gesetzt = 0;
      za.aufgaben.forEach(function (auf) {
        var geraten = za.antworten[auf.parteiId];
        if (!geraten) { return; }
        gesetzt++;
        if (geraten === auf.parteiId) { treffer++; }
      });

      var zKarte = el('div', { 'class': 'karte karte--treffer' }, [
        el('p', { 'class': 'tipp-zeile', text: 'Wer war wer?' }),
        el('p', { 'class': 'treffer-zahl', text: treffer + ' von ' + za.aufgaben.length }),
        el('p', { 'class': 'fliess', text: gesetzt === 0
          ? 'Sie haben keinen Buchstaben zugeordnet.'
          : 'richtig zugeordnet. Wer blind rät, trifft im Mittel genau einen – '
            + (treffer > 2 ? 'Sie lagen deutlich darüber.'
              : treffer === 0 ? 'darunter kommt man kaum.'
              : 'ungefähr so weit tragen die Etiketten.') })
      ]);

      var aufl = el('div', { 'class': 'aufloesung' });
      za.aufgaben.forEach(function (auf) {
        var geraten = za.antworten[auf.parteiId];
        var richtig = D.partei(d, auf.parteiId);
        var ok = geraten === auf.parteiId;
        aufl.appendChild(el('div', {
          'class': 'aufloesung-zeile' + (ok ? ' aufloesung-zeile--gut' : '')
        }, [
          el('p', { 'class': 'aufloesung-marke' }, [
            el('span', { 'class': 'aufloesung-buchstabe', text: auf.marke }),
            el('span', { text: geraten
              ? (ok ? ' war ' + richtig.name + '. Richtig.'
                    : ' war ' + richtig.name + ' – Sie hatten ' + D.partei(d, geraten).name + '.')
              : ' war ' + richtig.name + '. Nicht zugeordnet.' })
          ])
        ]));
      });
      zKarte.appendChild(aufl);
      trefferKarte = zKarte;
    }

    /* Was Sie nicht erwartet haben.
     *
     * Hier landet die These persönlich: Auch das Programm, das ganz unten
     * steht, hat Sätze, denen der Nutzer zugestimmt hat - er wusste nur
     * nicht, von wem sie waren. Das ist eine andere Auskunft als ein
     * Prozentwert, und es ist die einzige Stelle, an der eigene Zustimmung
     * und abgelehntes Etikett direkt nebeneinanderstehen.
     *
     * Gezeigt wird das LETZTE Programm der Wertung, nicht das vom Nutzer
     * getippte: Der Tipp kann fehlen, und wer sein Schlusslicht selbst
     * gewählt hat, hat sich darüber schon Rechenschaft abgelegt.
     */
    var letzterKarte = null;
    if (erg.ranking.length >= 3) {
      var letzter = erg.ranking[erg.ranking.length - 1];
      var gewaehlteSaetze = [];
      zustand.duelle.forEach(function (duell, k) {
        var sieger = zustand.duellAntworten[k];
        if (!sieger) { return; }
        [duell.links, duell.rechts].forEach(function (x) {
          if (x.parteiId === letzter.parteiId && x.id === sieger) {
            gewaehlteSaetze.push({ aussage: x, frage: duell.frageText });
          }
        });
      });

      if (gewaehlteSaetze.length) {
        var lp = D.partei(d, letzter.parteiId);
        letzterKarte = el('div', { 'class': 'karte karte--gegenprobe' }, [
          el('p', { 'class': 'tipp-zeile', text: 'Was Sie nicht erwartet haben' }),
          el('p', { 'class': 'fliess', text: lp.name
            + ' steht bei Ihnen auf dem letzten Platz. Trotzdem haben Sie '
            + (gewaehlteSaetze.length === 1
                ? 'einen Satz aus diesem Programm gewählt:'
                : gewaehlteSaetze.length + ' Sätze aus diesem Programm gewählt, darunter:') })
        ]);
        mische(gewaehlteSaetze).slice(0, 2).forEach(function (g) {
          letzterKarte.appendChild(el('div', { 'class': 'gegenprobe-satz' }, [
            el('p', { 'class': 'gegenprobe-frage', text: g.frage }),
            el('p', { 'class': 'gegenprobe-text', text: '„' + g.aussage.kurz + '“' })
          ]));
        });
        letzterKarte.appendChild(el('p', { 'class': 'fliess fliess--klein',
          text: 'Darum geht es hier: Ohne Absender liest man anders. '
            + 'Das heißt nicht, dass Sie dieses Programm wählen sollten – es heißt, '
            + 'dass der Name und die Sätze nicht dasselbe sind.' }));
      }
    }

    /* Tipp gegen Ergebnis. Der Kern der These wird hier abgerechnet: nicht
     * ob der Nutzer richtig lag, sondern wie weit die Erwartung von den
     * Sätzen entfernt war, denen er tatsächlich zugestimmt hat. Deshalb
     * steht bei einem Fehltipp der Platz der getippten Partei dabei - ein
     * bloßes "falsch" wäre eine Wertung und keine Auskunft. */
    if (zustand.tipp) {
      var tKarte = el('div', { 'class': 'karte karte--tipp' });
      if (zustand.tipp === '_offen') {
        tKarte.appendChild(el('p', { 'class': 'tipp-zeile', text: 'Ohne Tipp gestartet' }));
        tKarte.appendChild(el('p', { 'class': 'fliess',
          text: 'Sie wollten sich vorher nicht festlegen. Oben steht jetzt: '
            + spitze.map(function (r) { return D.partei(d, r.parteiId).name; }).join(', ') + '.' }));
      } else {
        var getippt = D.partei(d, zustand.tipp);
        var platz = -1, wert = null;
        erg.ranking.forEach(function (r, i) {
          if (r.parteiId === zustand.tipp) { platz = i + 1; wert = Math.round(r.prozent); }
        });
        var getroffen = spitze.some(function (r) { return r.parteiId === zustand.tipp; });
        tKarte.appendChild(el('p', { 'class': 'tipp-zeile',
          text: getroffen ? 'Ihr Tipp hat gehalten' : 'Ihr Tipp und Ihre Antworten gehen auseinander' }));
        tKarte.appendChild(el('p', { 'class': 'fliess',
          text: getroffen
            ? 'Sie hatten ' + getippt.name + ' erwartet, und ' + getippt.name
              + ' steht oben. Die Sätze, denen Sie ohne Absender zugestimmt haben, '
              + 'passen zu dem, was Sie vorher vermutet haben.'
            : 'Sie hatten ' + getippt.name + ' erwartet. Oben steht '
              + spitze.map(function (r) { return D.partei(d, r.parteiId).name; }).join(', ')
              + '.' + (platz > 0
                ? ' ' + getippt.name + ' liegt auf Platz ' + platz + ' mit ' + wert + ' %.'
                : ' ' + getippt.name + ' kam in Ihren beantworteten Fragen nicht vor.') }));
        if (!getroffen) {
          tKarte.appendChild(el('p', { 'class': 'fliess fliess--klein',
            text: 'Das heißt nicht, dass Ihr Tipp falsch war – eine Wahlentscheidung '
              + 'hängt an mehr als an Programmsätzen. Es heißt, dass die Sätze und der '
              + 'Name, den Sie mit ihnen verbinden, nicht dasselbe sind.' }));
        }
      }
      tippKarte = tKarte;
    }

    var restKarten = [];
    erg.ranking.slice(spitze.length).forEach(function (r, i) {
      var p = D.partei(d, r.parteiId);
      var breite = Math.round(r.prozent);
      restKarten.push(el('div', { 'class': 'karte karte--rang' }, [
        el('span', { 'class': 'rang-nr', text: String(spitze.length + i + 1) }),
        parteiMarke(p),
        el('span', { 'class': 'rang-wert', text: breite + ' %' }),
        balken(p, breite)
      ]));
    });
    /* Erst im naechsten Bild fuellen, sonst startet die Ueberblendung nicht -
     * der Balken staende sofort auf Endbreite. */
    function fuelle() {
      if (global.requestAnimationFrame) {
        global.requestAnimationFrame(function () {
          fuellungen.forEach(function (f) { balkenSetzen(f[0], f[1]); });
        });
      } else {
        fuellungen.forEach(function (f) { balkenSetzen(f[0], f[1]); });
      }
    }
    /* Gestufte Auflösung. Alles auf einmal aufzudecken verschenkte den
     * einzigen Moment, auf den der ganze Durchgang hinausläuft: Zuerst
     * erfährt der Nutzer, wie weit er die Sätze den Absendern zuordnen
     * konnte - dann erst, wer oben steht. Umgekehrt hätte niemand die
     * Auflösung der Zuordnung noch gelesen.
     *
     * Die Stufen sind nur Anzeige: gerechnet ist zu diesem Zeitpunkt alles,
     * und Zurückspringen ist ausgeschlossen - das steht auf der letzten
     * verhüllten Seite ausdrücklich so. */
    var stufe = zustand.stufe;

    function weiterKnopf(text, hinweis) {
      var n = el('div', { 'class': 'stufe-weiter' }, [
        hinweis ? el('p', { 'class': 'fliess fliess--klein', text: hinweis }) : null,
        el('button', { 'class': 'knopf knopf--haupt', text: text, onclick: function () {
          zustand.stufe = stufe + 1;
          gehe('ergebnis');
        } })
      ]);
      return n;
    }

    /* STUFE 1 - Die Aufdeckung.
     * Dasselbe Feld, dieselben Säulen, dieselbe Reihenfolge; nur wird aus
     * jedem Buchstaben ein Name. Die Auflösung von hinten nach vorn, damit
     * die Spitze zum Schluss kommt - dort sitzt die Frage, die das Spiel
     * fünf Minuten lang aufgebaut hat.
     *
     * Bewusst ohne alles andere: keine Zuordnungsbilanz, keine Wetten, kein
     * Rechenweg. Wer hier ankommt, will eine einzige Auskunft. */
    if (stufe < 2) {
      var auf = global.S47_SPIEL.aufdeckung(spielKontext(), erg);
      var weiterAuf = weiterKnopf('Wie gut lagen Sie?');
      weiterAuf.style.opacity = '0';
      weiterAuf.style.transition = 'opacity 500ms ease';
      abschnitt.appendChild(el('p', { 'class': 'halt-marke', text: 'Aufdeckung' }));
      abschnitt.appendChild(el('div', { 'class': 'auf-buehne' }, [auf.wurzel]));
      abschnitt.appendChild(weiterAuf);
      /* Der Knopf erscheint erst, wenn alle Namen stehen - sonst klickt man
       * mitten in die Auflösung hinein und sieht sie nie. */
      setTimeout(function () {
        if (weiterAuf.parentNode) { weiterAuf.style.opacity = '1'; }
      }, auf.dauer);
      buehne.appendChild(abschnitt);
      return;
    }

    /* STUFE 2 - Wie gut lagen Sie?
     * Jetzt erst die Abrechnung der These: der Tipp von vor dem Spiel, die
     * Wetten aus den Zwischenständen, die Zuordnung am Ende. */
    if (stufe < 3) {
      if (siegerKarte) { rang.appendChild(siegerKarte); }
      if (tippKarte) { rang.appendChild(tippKarte); }
      if (letzterKarte) { rang.appendChild(letzterKarte); }
      if (wettKarte) { rang.appendChild(wettKarte); }
      if (trefferKarte) { rang.appendChild(trefferKarte); }
      abschnitt.appendChild(el('h2', { text: 'Wie gut lagen Sie?' }));
      abschnitt.appendChild(rang);
      fuelle();
      abschnitt.appendChild(weiterKnopf('Alles im Einzelnen'));
      buehne.appendChild(abschnitt);
      return;
    }

    /* STUFE 3 - Alles im Einzelnen. */
    if (siegerKarte) { rang.appendChild(siegerKarte); }
    if (tippKarte) { rang.appendChild(tippKarte); }
    if (letzterKarte) { rang.appendChild(letzterKarte); }
    if (wettKarte) { rang.appendChild(wettKarte); }
    restKarten.forEach(function (k) { rang.appendChild(k); });
    if (trefferKarte) { rang.appendChild(trefferKarte); }
    if (trefferKarte) { rang.appendChild(trefferKarte); }
    fuelle();
    abschnitt.appendChild(el('h2', { text: 'Alle Parteien' }));
    abschnitt.appendChild(rang);
    abschnitt.appendChild(el('p', { 'class': 'fliess fliess--klein', text:
      'So wird gerechnet: Gewertet wird die Siegquote – wie oft haben Sie ein '
      + 'Programm gewählt, wenn es angetreten ist? Beide Sätze eines Duells '
      + 'beantworten dieselbe Unterfrage. Damit eine einzelne Paarung nicht '
      + 'überzeichnet, zählt ein halber Sieg und eine halbe Niederlage als '
      + 'Vorannahme mit: vier aus vier ergeben deshalb 90 Prozent und nicht 100. '
      + 'Der Gesamtwert ist der mit Ihren Punkten gewichtete Durchschnitt über die '
      + 'Themen. 50 Prozent ist der Münzwurf – darüber wurde ein Programm öfter '
      + 'gewählt als nicht, darunter seltener. Übersprungene Duelle zählen für '
      + 'niemanden.' }));

    /* Aufschluesselung je Thema: Siegquote und die tatsaechlich gespielten
     * Duelle. Anders als die Vorform zeigt der Anhang jetzt genau das, was
     * passiert ist - Paarung fuer Paarung, mit Ihrer Wahl daneben. Das ist
     * nachvollziehbarer als eine Punktzahl, die man erst erklaeren muss. */
    abschnitt.appendChild(el('h2', { text: 'Nach Themen' }));

    var duelleProThema = Object.create(null);
    zustand.duelle.forEach(function (duell, index) {
      (duelleProThema[duell.themaId] = duelleProThema[duell.themaId] || [])
        .push({ duell: duell, index: index });
    });

    erg.themen.filter(function (t) { return t.gewicht > 0; }).forEach(function (t) {
      var thema = themaNach(t.id);
      var inhalt = el('div', { 'class': 'themen-werte' });

      t.werte.forEach(function (w) {
        inhalt.appendChild(el('div', { 'class': 'wert-kopf' }, [
          parteiMarke(D.partei(d, w.parteiId)),
          el('span', { 'class': 'wert-zahl',
            text: Math.round(w.wert) + ' % (' + w.siege + '/' + w.auftritte + ')' })
        ]));
      });

      var liste = el('div', { 'class': 'fragen-liste' });
      (duelleProThema[t.id] || []).forEach(function (eintrag) {
        var duell = eintrag.duell;
        var sieger = zustand.duellAntworten[eintrag.index];
        var block = el('div', { 'class': 'frage-block' }, [
          el('p', { 'class': 'frage-text', text: duell.frageText
            + (sieger ? '' : '  (uebersprungen)') })
        ]);
        [duell.links, duell.rechts].forEach(function (a) {
          var p = D.partei(d, a.parteiId);
          var gewonnen = sieger === a.id;
          var quellKnopf = el('button', { 'class': 'link link--quelle',
            text: 'Quelle: Seite ' + a.quelle.seite });
          quellKnopf.addEventListener('click', function () {
            if (!global.S47_QUELLE.zeige(a.quelle, p.programm && p.programm.titel)) {
              window.open(global.S47_QUELLE.fallbackUrl(a.quelle), '_blank', 'noopener');
            }
          });
          block.appendChild(el('div', {
            'class': 'wert-zeile' + (gewonnen ? ' wert-zeile--sieg' : '')
          }, [
            el('div', { 'class': 'wert-kopf' }, [
              parteiMarke(p),
              el('span', { 'class': 'wert-zahl',
                text: !sieger ? '–' : gewonnen ? 'gewaehlt' : '' })
            ]),
            el('p', { 'class': 'wert-aussage', text: a.kurz }),
            quellKnopf
          ]));
        });
        liste.appendChild(block);
      });

      abschnitt.appendChild(el('div', { 'class': 'karte' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('h3', { 'class': 'thema-titel', text: thema.titel }),
          el('span', { 'class': 'gewicht-wert',
            text: DU.punkteLabel(t.gewicht) + ' · ' + t.gewicht + ' Punkte' })
        ]),
        inhalt,
        liste
      ]));
    });

    var exportKnopf = el('button', { 'class': 'knopf knopf--still', text: 'Ergebnis als PDF' });
    exportKnopf.addEventListener('click', function () {
      try {
        /* Das komplette Auswertungsergebnis weiterreichen, damit der Export
         * dieselben Zahlen zeigt wie die Seite – auch die offenen Fragen. */
        global.S47_EXPORT.erzeuge({
          datensatz: d, ranking: erg.ranking, themen: erg.themen,
          offeneFragen: erg.duelleGesamt - erg.gespielt, fragenGesamt: erg.duelleGesamt,
          gewichte: zustand.gewichte,
          duelle: zustand.duelle, duellAntworten: zustand.duellAntworten
        });
      } catch (e) {
        exportKnopf.textContent = 'Export fehlgeschlagen: ' + e.message;
      }
    });

    /* Noch einmal heisst: dieselbe Wahl, neue Buchstaben, neuer Duellplan.
     * Das ist kein blosser Neustart - die Zuordnung der Kandidaten wird neu
     * ausgelost, und die Paarungen sind andere. Wer zweimal spielt, prueft
     * damit sich selbst, nicht sein Gedaechtnis fuer Buchstaben. */
    abschnitt.appendChild(el('div', { 'class': 'navi' }, [
      el('button', {
        'class': 'knopf knopf--still', text: 'Noch einmal',
        onclick: function () { starteWahl(zustand.datensatz); }
      }),
      el('button', { 'class': 'knopf knopf--still', text: 'Andere Wahl',
        onclick: function () { gehe('wahl'); } }),
      exportKnopf
    ]));

    buehne.appendChild(abschnitt);
  };

  function parteiMarke(p) {
    var kinder = [];
    if (p.logo) {
      kinder.push(el('img', { 'class': 'partei-logo', src: p.logo, alt: p.name }));
    } else {
      kinder.push(el('span', { 'class': 'partei-punkt', style: 'background:' + (p.farbe || '#888') }));
    }
    kinder.push(el('span', { 'class': 'partei-name', text: p.name }));
    return el('span', { 'class': 'partei-marke' }, kinder);
  }

  /* ---------- Hell und dunkel ----------
   * Voreinstellung ist die Systemeinstellung. Der Knopf wechselt nur fuer
   * diese Sitzung: Speichern ist ausgeschlossen (CLAUDE.md), und ein
   * Zustand, der das Neuladen ueberlebt, ginge ohne Speicher nicht. */
  var modusKnopf = document.getElementById('modus');

  function systemDunkel() {
    return !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function zeigeModus() {
    var gesetzt = document.documentElement.getAttribute('data-modus');
    var dunkel = gesetzt ? gesetzt === 'dunkel' : systemDunkel();
    modusKnopf.textContent = dunkel ? '☀' : '☽';
    modusKnopf.setAttribute('aria-label',
      dunkel ? 'Zur hellen Darstellung wechseln' : 'Zur dunklen Darstellung wechseln');
  }

  modusKnopf.addEventListener('click', function () {
    var gesetzt = document.documentElement.getAttribute('data-modus');
    var dunkel = gesetzt ? gesetzt === 'dunkel' : systemDunkel();
    document.documentElement.setAttribute('data-modus', dunkel ? 'hell' : 'dunkel');
    zeigeModus();
  });

  if (global.matchMedia) {
    var abfrage = global.matchMedia('(prefers-color-scheme: dark)');
    var beiWechsel = function () {
      if (!document.documentElement.getAttribute('data-modus')) { zeigeModus(); }
    };
    if (abfrage.addEventListener) { abfrage.addEventListener('change', beiWechsel); }
    else if (abfrage.addListener) { abfrage.addListener(beiWechsel); }
  }

  zeigeModus();

  /* ---------- Start ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-aktion="neustart"]') : null;
    if (t) { e.preventDefault(); gehe('wahl'); }
  });

  gehe('wahl');
})(window);
