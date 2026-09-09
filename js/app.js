/* Seite 47 – Ablaufsteuerung und Oberfläche.
 * Enthält KEINE Inhalte einzelner Wahlen. Alles Wahlspezifische kommt aus data/.
 *
 * Bewertet wird durch Vergleich (Schema 2): je Frage stehen 3–4 Aussagen
 * verschiedener Parteien nebeneinander, gewählt werden die beste und die
 * schlechteste. Begründung: CLAUDE.md, Punkt 4.
 */
(function (global) {
  'use strict';

  var A = global.S47_AUSWERTUNG;
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
    schritt: 'wahl',        /* wahl | gewichtung | tipp | spiel | stichentscheid | zuordnung | ergebnis */
    datensatz: null,
    gewichte: {},           /* themaId -> Punkte aus dem Budget */
    duelle: [],             /* Duellplan aus S47_DUELLE.plan */
    duellIndex: 0,
    duellAntworten: {},     /* Duellindex -> aussageId des Siegers */
    kandidaten: {},         /* parteiId -> Buchstabe (je Sitzung ausgelost) */
    fassung: {},            /* aussageId -> 'kurz'|'original' */
    ergebnis: null,
    tipp: null,             /* parteiId der Erwartung vor dem Durchgang */
    zuordnung: null,        /* {aufgaben:[], antworten:{}} - "Wer war wer?" */
    stich: null,            /* {kandidaten:[], duelle:[], antworten:{}} bei knapper Spitze */
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
    /* Der Stichentscheid steht nicht in der Leiste: er kommt nur bei knapper
     * Spitze, und ein Schritt, der meistens ausfällt, wäre ein falsches
     * Versprechen. Für die Markierung zählt er zu den Fragen. */
    var hier = zustand.schritt === 'stichentscheid' ? 'spiel' : zustand.schritt;
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
      ['Gewichten', 'Sie stellen ein, wie wichtig Ihnen jedes Thema ist.'],
      ['Vergleichen', 'Je Frage stehen drei bis vier Aussagen nebeneinander. Sie wählen die beste und die schlechteste.'],
      ['Aufdecken', 'Erst danach erfahren Sie, welche Partei welche Aussage geschrieben hat.']
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
        el('h1', { text: 'Positionen zuerst, Parteien zuletzt.' }),
        el('p', { 'class': 'hero-lead', text: 'Wahlprogramme klingen einzeln gelesen alle zustimmungsfähig. Hier stehen sie nebeneinander – ohne Absender. Alle Angaben bleiben in diesem Browser.' })
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
    zustand.ergebnis = null;
    zustand.tipp = null;
    zustand.zuordnung = null;
    zustand.stich = null;
    zustand.stufe = 0;
    zustand.aufgedeckt = false;
    zustand.gewichte = A.startPunkte(datensatz);
    gehe('gewichtung');
  }

  /* ---------- 2. Themen gewichten ---------- */

  ANSICHTEN.gewichtung = function () {
    var d = zustand.datensatz;
    var gesamt = A.budget(d);
    var liste = el('div', { 'class': 'liste' });
    var zeilen = [];

    function vergeben() {
      var summe = 0;
      d.themen.forEach(function (t) { summe += zustand.gewichte[t.id]; });
      return summe;
    }

    var restZahl = el('strong', { 'class': 'budget-zahl' });
    var restText = el('span', { 'class': 'budget-text' });
    var kasse = el('div', { 'class': 'budget' }, [
      restZahl,
      restText
    ]);

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
    }

    d.themen.forEach(function (t) {
      var punkteEl = el('span', { 'class': 'punkte-wert' });
      var tiefeEl = el('span', { 'class': 'punkte-tiefe' });
      var balken = el('div', { 'class': 'punkte-balken' }, [
        el('div', { 'class': 'punkte-fuell' })
      ]);
      var weniger = el('button', {
        'class': 'punkte-knopf', type: 'button', text: '−',
        'aria-label': 'Weniger Punkte für ' + t.titel
      });
      var mehr = el('button', {
        'class': 'punkte-knopf', type: 'button', text: '+',
        'aria-label': 'Mehr Punkte für ' + t.titel
      });
      var zeile = el('div', { 'class': 'karte karte--thema' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('span', { 'class': 'thema-titel', text: t.titel }),
          punkteEl
        ]),
        t.beschreibung ? el('p', { 'class': 'thema-text', text: t.beschreibung }) : null,
        balken,
        el('div', { 'class': 'punkte-zeile' }, [weniger, mehr, tiefeEl])
      ]);

      function zeichne() {
        var p = zustand.gewichte[t.id];
        var rest = gesamt - vergeben();
        punkteEl.textContent = p + ' Punkte';
        balken.firstChild.style.width = (p / A.PUNKTE_MAX * 100) + '%';
        var tiefe = DU.duelleFuerPunkte(p, vorratVon(t));
        tiefeEl.textContent = tiefe === 0
          ? A.punkteLabel(p)
          : A.punkteLabel(p) + ' · ' + tiefe + (tiefe === 1 ? ' Duell' : ' Duelle');
        weniger.disabled = p <= 0;
        mehr.disabled = p >= A.PUNKTE_MAX || rest < A.PUNKTE_SCHRITT;
        zeile.classList.toggle('karte--aus', p === 0);
      }

      function alleZeichnen() {
        zeilen.forEach(function (f) { f(); });
        zeichneKasse();
      }

      weniger.addEventListener('click', function () {
        zustand.gewichte[t.id] = Math.max(0, zustand.gewichte[t.id] - A.PUNKTE_SCHRITT);
        alleZeichnen();
      });
      mehr.addEventListener('click', function () {
        if (gesamt - vergeben() < A.PUNKTE_SCHRITT) { return; }
        zustand.gewichte[t.id] = Math.min(A.PUNKTE_MAX, zustand.gewichte[t.id] + A.PUNKTE_SCHRITT);
        alleZeichnen();
      });

      zeilen.push(zeichne);
      liste.appendChild(zeile);
    });

    var hinweis = el('p', { 'class': 'hinweis' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Zu den Fragen' });
    weiter.addEventListener('click', function () {
      zustand.duelle = DU.plan(d, zustand.gewichte);
      if (!zustand.duelle.length) {
        hinweis.textContent = 'Bitte mindestens einem Thema Punkte geben.';
        return;
      }
      zustand.duellIndex = 0;
      zustand.duellAntworten = {};
      gehe('tipp');
    });

    zeilen.forEach(function (f) { f(); });
    zeichneKasse();

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Sie haben ' + gesamt + ' Punkte.' }),
      el('p', { 'class': 'fliess', text: 'Verteilen Sie die Punkte auf die Themen. Mehr für das eine geht nur zu Lasten des anderen – und wo Sie mehr Punkte setzen, wird auch genauer nachgefragt. Die Themen stammen aus den Programmen zu: ' + d.name + '.' }),
      kasse,
      liste,
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

  /* ---------- 4. Stichentscheid bei knapper Spitze ----------
   * Weil je Frage nur eine von drei Stufen vergeben wird (100/50/0) und jede
   * Partei je Thema nur wenige Male auftritt, landen die vordersten Parteien
   * regelmäßig auf demselben gerundeten Wert. Gemessen an 600 simulierten
   * Durchgängen war die Spitze bei realistischem Rauschen in 13 bis 21 % der
   * Fälle geteilt.
   *
   * Der Stichentscheid löst das nicht durch Nachkommastellen – die wären
   * vorgetäuschte Genauigkeit –, sondern durch echte Direktvergleiche: genau
   * zwei Aussagen derselben Unterfrage, von genau den Parteien, die gleichauf
   * liegen. Alle 21 Parteipaare sind in jedem der drei Datensätze mindestens
   * zweimal belegt, der Vorrat reicht also überall.
   *
   * Die Prozentwerte bleiben unberührt. Der Stichentscheid ordnet nur
   * innerhalb des Gleichstands und wird als das benannt, was er ist – sonst
   * stünde am Ende eine Zahl, die anders zustande kam als angekündigt.
   */
  var STICH_SCHWELLE = 3;   /* Prozentpunkte Abstand, bis zu denen entschieden wird */
  var STICH_MAX = 5;        /* mehr als fünf Duelle ermüden mehr, als sie klären */

  function knappeSpitze(erg) {
    if (erg.ranking.length < 2) { return []; }
    var spitze = Math.round(erg.ranking[0].prozent);
    return erg.ranking.filter(function (r) {
      return spitze - Math.round(r.prozent) <= STICH_SCHWELLE;
    }).map(function (r) { return r.parteiId; });
  }

  /* Alle Fragen des Datensatzes, in denen beide Parteien vorkommen – auch
   * solche, die dieser Durchgang nicht gestellt hat. Der Stichentscheid darf
   * dort zugreifen: er wertet nichts nach, er fragt neu. */
  function duelleFuer(kandidaten) {
    var d = zustand.datensatz, gefunden = [];
    for (var i = 0; i < kandidaten.length; i++) {
      for (var j = i + 1; j < kandidaten.length; j++) {
        var a = kandidaten[i], b = kandidaten[j], treffer = [];
        d.themen.forEach(function (t) {
          t.fragen.forEach(function (fr) {
            var va = null, vb = null;
            fr.aussagen.forEach(function (x) {
              if (x.parteiId === a) { va = x; }
              if (x.parteiId === b) { vb = x; }
            });
            if (va && vb) { treffer.push({ frage: fr, links: va, rechts: vb }); }
          });
        });
        mische(treffer).slice(0, 2).forEach(function (x) { gefunden.push(x); });
      }
    }
    return mische(gefunden).slice(0, STICH_MAX).map(function (x) {
      /* Seite würfeln, sonst stünde eine Partei immer links. */
      return Math.random() < 0.5 ? x
        : { frage: x.frage, links: x.rechts, rechts: x.links };
    });
  }

  function nachDenFragen() {
    var erg = DU.werte(zustand.datensatz, zustand.duelle, zustand.duellAntworten, zustand.gewichte);
    var kandidaten = knappeSpitze(erg);
    if (kandidaten.length < 2) { return 'zuordnung'; }
    var duelle = duelleFuer(kandidaten);
    if (!duelle.length) { return 'zuordnung'; }
    zustand.stich = { kandidaten: kandidaten, duelle: duelle, antworten: {}, index: 0 };
    return 'stichentscheid';
  }

  /* Siege je Partei aus den beantworteten Duellen. */
  function stichStand() {
    if (!zustand.stich) { return null; }
    var siege = Object.create(null), gespielt = 0;
    zustand.stich.kandidaten.forEach(function (p) { siege[p] = 0; });
    zustand.stich.duelle.forEach(function (duell, i) {
      var w = zustand.stich.antworten[i];
      if (!w) { return; }
      gespielt++;
      siege[w] = (siege[w] || 0) + 1;
    });
    return { siege: siege, gespielt: gespielt };
  }

  ANSICHTEN.stichentscheid = function () {
    var st = zustand.stich;
    var duell = st.duelle[st.index];
    var d = zustand.datensatz;

    var karten = [];
    var liste = el('div', { 'class': 'liste' });
    [duell.links, duell.rechts].forEach(function (a) {
      var knopf = el('button', { 'class': 'karte karte--duell', type: 'button' }, [
        el('p', { 'class': 'duell-text', text: D.anonymisiere(d, a.kurz) })
      ]);
      knopf.addEventListener('click', function () {
        st.antworten[st.index] = a.parteiId;
        karten.forEach(function (k) {
          k.el.classList.toggle('karte--duell-gewaehlt', k.id === a.id);
        });
        zeichne();
      });
      karten.push({ id: a.id, el: knopf });
      liste.appendChild(knopf);
    });

    var weiter = el('button', { 'class': 'knopf' });
    var letzte = st.index + 1 >= st.duelle.length;
    function zeichne() {
      var gesetzt = !!st.antworten[st.index];
      weiter.textContent = letzte ? 'Weiter' : 'Nächster Vergleich';
      weiter.classList.toggle('knopf--haupt', gesetzt);
      weiter.classList.toggle('knopf--still', !gesetzt);
    }
    zeichne();

    weiter.addEventListener('click', function () {
      if (letzte) { gehe('zuordnung'); }
      else { st.index++; gehe('stichentscheid'); }
    });

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Es ist knapp.' }),
      el('p', { 'class': 'fliess', text: st.index === 0
        ? 'Nach Ihren Antworten liegen mehrere Programme an der Spitze so dicht beieinander, dass die Rechnung sie nicht trennt. Deshalb noch ' + st.duelle.length + ' Direktvergleiche – diesmal nur zwei Sätze, und beide von genau diesen Programmen. Sie ändern die Prozentwerte nicht, sie entscheiden nur den Gleichstand.'
        : 'Welcher Satz überzeugt Sie mehr?' }),
      el('p', { 'class': 'zuordnung-nr', text: 'Vergleich ' + (st.index + 1) + ' von ' + st.duelle.length }),
      el('p', { 'class': 'zuordnung-frage', text: duell.frage.text }),
      liste,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Überspringen', onclick: function () { gehe('zuordnung'); } }),
        weiter
      ])
    ]));
  };

  /* ---------- 5. Wer war wer? ----------
   * Der Nutzer ordnet einigen der gerade bewerteten Aussagen die Partei zu,
   * die er dahinter vermutet - vor der Aufdeckung, ohne Rückmeldung. Das ist
   * die Messung zur These: nicht, ob jemand "gut" oder "schlecht" rät,
   * sondern wie viel die Etiketten über die Sätze tatsächlich hergeben.
   * Der Zufallserwartungswert (eine Aufgabe je Partei, jede Partei genau
   * einmal) steht deshalb später neben dem Ergebnis - ohne ihn ist "2 von 7"
   * keine Auskunft.
   *
   * Ausgewählt werden Aussagen aus beantworteten Fragen, und dort bevorzugt
   * die selbst markierten: die hat der Nutzer nachweislich gelesen. Kein
   * parteibezogenes Datum wandert in den DOM - die richtige Lösung steht in
   * zustand.zuordnung, nicht am Element.
   */
  function baueZuordnung() {
    var d = zustand.datensatz;
    /* Kandidaten je Partei sammeln, aus den tatsächlich gestellten Fragen. */
    var proPartei = Object.create(null);
    zustand.duelle.forEach(function (duell, i) {
      var sieger = zustand.duellAntworten[i];
      if (!sieger) { return; }
      [duell.links, duell.rechts].forEach(function (a) {
        (proPartei[a.parteiId] = proPartei[a.parteiId] || []).push({
          aussage: a,
          frage: { id: duell.frageId, text: duell.frageText },
          /* Der Sieger eines Duells ist die Aussage, fuer die sich der Nutzer
           * ausdruecklich entschieden hat - die hat er sicher gelesen. */
          markiert: a.id === sieger
        });
      });
    });

    var aufgaben = [];
    d.parteien.forEach(function (p) {
      var k = proPartei[p.id];
      if (!k || !k.length) { return; }
      var markiert = k.filter(function (x) { return x.markiert; });
      var topf = markiert.length ? markiert : k;
      aufgaben.push(topf[Math.floor(Math.random() * topf.length)]);
    });
    return { aufgaben: mische(aufgaben), antworten: {} };
  }

  ANSICHTEN.zuordnung = function () {
    var d = zustand.datensatz;
    if (!zustand.zuordnung) { zustand.zuordnung = baueZuordnung(); }
    var z = zustand.zuordnung;

    if (!z.aufgaben.length) { gehe('ergebnis'); return; }

    var liste = el('div', { 'class': 'liste' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt' });
    var stand = el('p', { 'class': 'fortschritt' });

    function zeichneStand() {
      var offen = z.aufgaben.length - Object.keys(z.antworten).length;
      stand.textContent = offen === 0
        ? 'Alle zugeordnet.'
        : offen + (offen === 1 ? ' Aussage ist noch offen.' : ' Aussagen sind noch offen.');
      stand.classList.toggle('fortschritt--offen', offen > 0);
      weiter.textContent = offen === 0 ? 'Ergebnis anzeigen' : 'Ohne Rest anzeigen';
      weiter.classList.toggle('knopf--haupt', offen === 0);
      weiter.classList.toggle('knopf--still', offen > 0);
    }

    z.aufgaben.forEach(function (auf, i) {
      var wahl = el('div', { 'class': 'tipp-liste tipp-liste--eng' });
      var knoepfe = [];
      d.parteien.forEach(function (p) {
        var k = el('button', { 'class': 'tipp-knopf tipp-knopf--klein', type: 'button', text: p.name });
        k.addEventListener('click', function () {
          z.antworten[auf.aussage.id] = p.id;
          knoepfe.forEach(function (x) {
            x.el.classList.toggle('tipp-knopf--aktiv', x.id === p.id);
          });
          zeichneStand();
        });
        knoepfe.push({ id: p.id, el: k });
        wahl.appendChild(k);
      });
      liste.appendChild(el('div', { 'class': 'karte karte--zuordnung' }, [
        el('p', { 'class': 'zuordnung-nr', text: (i + 1) + ' von ' + z.aufgaben.length }),
        el('p', { 'class': 'zuordnung-frage', text: auf.frage.text }),
        el('p', { 'class': 'zuordnung-text', text: D.anonymisiere(d, auf.aussage.kurz) }),
        wahl
      ]));
    });

    weiter.addEventListener('click', function () { gehe('ergebnis'); });
    zeichneStand();

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Wer war wer?' }),
      el('p', { 'class': 'fliess', text: 'Die Fragen sind durch. Bevor aufgedeckt wird: Ordnen Sie diese ' + z.aufgaben.length + ' Sätze den Parteien zu, von denen Sie glauben, dass sie sie geschrieben haben. Jede Partei kommt genau einmal vor. Rückmeldung gibt es erst mit dem Ergebnis – sonst könnte man sich den Rest zusammenreimen.' }),
      liste,
      stand,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück zu den Fragen', onclick: function () {
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
          text: 'Bis hierhin haben Sie nur Sätze verglichen. Der nächste Schritt zeigt, wer sie geschrieben hat – er lässt sich nicht zurücknehmen.' }),
        (erg.duelleGesamt - erg.gespielt)
          ? el('p', { 'class': 'fliess fliess--klein', text: (erg.duelleGesamt - erg.gespielt) + ' von ' + erg.duelleGesamt + ' Duellen haben Sie übersprungen. Sie zählen für keine Partei.' })
          : null,
        el('button', {
          'class': 'knopf knopf--haupt', text: 'Aufdecken',
          onclick: function () { zustand.stufe = 1; zustand.aufgedeckt = true; gehe('ergebnis'); }
        }),
        el('button', {
          'class': 'knopf knopf--still', text: 'Zurück zu den Fragen',
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

    function balken(p, breite, stil) {
      var fuell = el('div', { 'class': 'balken-fuell', style: 'background:' + (p.farbe || '#888') });
      fuellungen.push([fuell, breite]);
      return el('div', { 'class': 'balken', style: stil || null }, [fuell]);
    }

    /* Hat der Stichentscheid den Gleichstand aufgelöst? Nur dann, wenn er
     * überhaupt gespielt wurde und die Siege nicht selbst gleich stehen. */
    var stand = stichStand();
    var entschieden = null;
    if (stand && stand.gespielt && spitze.length > 1) {
      var sortiert = spitze.slice().sort(function (x, y) {
        return (stand.siege[y.parteiId] || 0) - (stand.siege[x.parteiId] || 0);
      });
      var bester = stand.siege[sortiert[0].parteiId] || 0;
      var gleichauf = sortiert.filter(function (r) {
        return (stand.siege[r.parteiId] || 0) === bester;
      });
      if (gleichauf.length === 1) { entschieden = sortiert[0]; spitze = sortiert; }
    }

    var siegerKarte = null, trefferKarte = null, tippKarte = null;

    if (spitze.length) {
      var karte = el('div', { 'class': 'karte karte--sieger' }, [
        el('p', { 'class': 'sieger-zeile', text: entschieden
          ? 'Im Stichentscheid vorn'
          : spitze.length > 1 ? 'Gleichauf an der Spitze' : 'Größte Übereinstimmung' })
      ]);
      spitze.forEach(function (r) {
        var p = D.partei(d, r.parteiId);
        karte.appendChild(el('p', { 'class': 'sieger-name' }, [
          parteiMarke(p),
          el('span', { 'class': 'sieger-wert', text: spitzenwert + ' %' })
        ]));
        karte.appendChild(balken(p, spitzenwert, 'margin-top:.6rem'));
      });
      if (entschieden) {
        var e = D.partei(d, entschieden.parteiId);
        karte.appendChild(el('p', { 'class': 'fliess fliess--klein', style: 'margin:.9rem 0 0',
          text: spitze.length + ' Parteien erreichen denselben Prozentwert; die Rechnung '
            + 'trennt sie nicht. In den ' + stand.gespielt + ' Direktvergleichen danach '
            + 'haben Sie ' + e.name + ' am häufigsten gewählt ('
            + spitze.map(function (r) {
                return D.partei(d, r.parteiId).name + ' ' + (stand.siege[r.parteiId] || 0);
              }).join(', ') + '). Der Prozentwert bleibt der gleiche – entschieden '
            + 'hat der direkte Vergleich, nicht die Wertung.' }));
      } else if (spitze.length > 1) {
        karte.appendChild(el('p', { 'class': 'fliess fliess--klein', style: 'margin:.9rem 0 0',
          text: spitze.length + ' Parteien erreichen denselben Wert' + (stand && stand.gespielt
            ? ', und auch die Direktvergleiche danach standen unentschieden'
            : '') + '. Ein Vorsprung lässt sich daraus nicht ableiten – hilfreich ist '
            + 'der Blick auf die einzelnen Themen weiter unten.' }));
      }
      siegerKarte = karte;
    }

    /* Wer war wer? Die Trefferzahl allein sagt nichts - erst der
     * Zufallserwartungswert macht sie lesbar. Bei einer Aufgabe je Partei
     * und jeder Partei genau einmal ist das im Mittel genau 1 Treffer,
     * unabhängig von der Zahl der Parteien (Fixpunkte einer zufälligen
     * Permutation). Diese Eins steht deshalb daneben. */
    if (zustand.zuordnung && zustand.zuordnung.aufgaben.length) {
      var za = zustand.zuordnung;
      var treffer = 0, gesetzt = 0;
      za.aufgaben.forEach(function (auf) {
        var geraten = za.antworten[auf.aussage.id];
        if (!geraten) { return; }
        gesetzt++;
        if (geraten === auf.aussage.parteiId) { treffer++; }
      });
      var zKarte = el('div', { 'class': 'karte karte--treffer' }, [
        el('p', { 'class': 'tipp-zeile', text: 'Wer war wer?' }),
        el('p', { 'class': 'treffer-zahl', text: treffer + ' von ' + za.aufgaben.length }),
        el('p', { 'class': 'fliess', text: gesetzt === 0
          ? 'Sie haben keine Aussage zugeordnet.'
          : 'richtig zugeordnet. Wer blind rät, trifft im Mittel eine – '
            + (treffer > 2 ? 'Sie lagen deutlich darüber.'
              : treffer === 0 ? 'darunter kommt man kaum.'
              : 'ungefähr so weit tragen die Etiketten.') })
      ]);
      var aufl = el('div', { 'class': 'aufloesung' });
      za.aufgaben.forEach(function (auf) {
        var geraten = za.antworten[auf.aussage.id];
        var richtig = D.partei(d, auf.aussage.parteiId);
        var ok = geraten === auf.aussage.parteiId;
        aufl.appendChild(el('div', { 'class': 'aufloesung-zeile' + (ok ? ' aufloesung-zeile--gut' : '') }, [
          el('p', { 'class': 'aufloesung-text', text: auf.aussage.kurz }),
          el('p', { 'class': 'aufloesung-marke', text: geraten
            ? (ok ? '✓ ' + richtig.name
                  : '✕ getippt: ' + D.partei(d, geraten).name + ' · war: ' + richtig.name)
            : 'nicht zugeordnet · war: ' + richtig.name })
        ]));
      });
      zKarte.appendChild(aufl);
      trefferKarte = zKarte;
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
          fuellungen.forEach(function (f) { f[0].style.width = f[1] + '%'; });
        });
      } else {
        fuellungen.forEach(function (f) { f[0].style.width = f[1] + '%'; });
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

    /* Auf Stufe 1 steht die Zuordnung allein da - sie ist der Anlass dieser
     * Stufe. Danach ist sie Beleg und wandert hinter das Ergebnis: sonst
     * schiebt die Auflösung Satz für Satz die Spitze unter den Falz. */
    if (stufe < 2) {
      if (trefferKarte) { rang.appendChild(trefferKarte); }
      abschnitt.appendChild(el('h2', { text: 'Wer war wer?' }));
      abschnitt.appendChild(rang);
      abschnitt.appendChild(weiterKnopf('Und wer steht oben?',
        trefferKarte ? null
          : 'Es lagen keine Aussagen zum Zuordnen vor – dafür braucht es beantwortete Fragen.'));
      buehne.appendChild(abschnitt);
      return;
    }

    if (siegerKarte) { rang.appendChild(siegerKarte); }
    if (tippKarte) { rang.appendChild(tippKarte); }
    if (stufe < 3) {
      if (trefferKarte) { rang.appendChild(trefferKarte); }
      abschnitt.appendChild(el('h2', { text: 'An der Spitze' }));
      abschnitt.appendChild(rang);
      fuelle();
      abschnitt.appendChild(weiterKnopf('Das ganze Feld zeigen'));
      buehne.appendChild(abschnitt);
      return;
    }

    restKarten.forEach(function (k) { rang.appendChild(k); });
    if (trefferKarte) { rang.appendChild(trefferKarte); }
    fuelle();
    abschnitt.appendChild(el('h2', { text: 'Alle Parteien' }));
    abschnitt.appendChild(rang);
    abschnitt.appendChild(el('p', { 'class': 'fliess fliess--klein', text:
      'So wird gerechnet: In jeder Frage bekommt die Aussage, der Sie am ehesten '
      + 'zustimmen, 100 Punkte, die mit der geringsten Zustimmung 0, die übrigen 50. '
      + 'Der Themenwert einer Partei ist der Mittelwert über die Fragen dieses Themas, '
      + 'in denen sie vorkommt – eine Frage zeigt nur 3 bis 4 der Parteien. Der '
      + 'Gesamtwert ist der mit Ihrer Themengewichtung gewichtete Durchschnitt. Offene '
      + 'Fragen zählen für niemanden.' }));

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
            text: A.punkteLabel(t.gewicht) + ' · ' + t.gewicht + ' Punkte' })
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

    abschnitt.appendChild(el('div', { 'class': 'navi' }, [
      el('button', {
        'class': 'knopf knopf--still', text: 'Antworten ändern',
        onclick: function () {
          zustand.duellIndex = Math.max(0, zustand.duelle.length - 1);
          gehe('spiel');
        }
      }),
      el('button', { 'class': 'knopf knopf--still', text: 'Neu starten', onclick: function () { gehe('wahl'); } }),
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
    modusKnopf.textContent = dunkel ? '\u2600' : '\u263D';
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
