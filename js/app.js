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

  var zustand = {
    schritt: 'wahl',        /* wahl | gewichtung | tipp | bewertung | probe | zuordnung | ergebnis */
    datensatz: null,
    gewichte: {},           /* themaId -> Punkte aus dem Budget */
    ablauf: [],             /* [{themaId, frageId}] der abzufragenden Fragen */
    frageIndex: 0,
    antworten: {},          /* frageId -> {beste, schlechteste} */
    fassung: {},            /* aussageId -> 'kurz'|'original' */
    mischung: {},           /* frageId -> aussageId[] (stabil gemischt) */
    ergebnis: null,
    tipp: null,             /* parteiId der Erwartung vor dem Durchgang */
    zuordnung: null,        /* {aufgaben:[], antworten:{}} - "Wer war wer?" */
    stich: null,            /* {kandidaten:[], duelle:[], antworten:{}} bei knapper Spitze */
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
    { id: 'bewertung', label: 'Fragen' },
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
    var hier = zustand.schritt === 'stichentscheid' ? 'bewertung' : zustand.schritt;
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
    var an = zustand.schritt === 'bewertung' && zustand.ablauf.length > 0;
    bandEl.hidden = !an;
    if (an) {
      var anteil = (zustand.frageIndex + 1) / zustand.ablauf.length;
      bandFuell.style.width = (anteil * 100).toFixed(1) + '%';
    }
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
    zustand.antworten = {};
    zustand.fassung = {};
    zustand.mischung = {};
    zustand.frageIndex = 0;
    zustand.ergebnis = null;
    zustand.tipp = null;
    zustand.zuordnung = null;
    zustand.stich = null;
    zustand.aufgedeckt = false;
    zustand.gewichte = A.startPunkte(datensatz);
    datensatz.themen.forEach(function (t) {
      t.fragen.forEach(function (f) {
        zustand.mischung[f.id] = mische(f.aussagen.map(function (a) { return a.id; }));
      });
    });
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
        var tiefe = A.fragenTiefe(p, t.fragen.length);
        tiefeEl.textContent = tiefe === 0
          ? A.punkteLabel(p)
          : A.punkteLabel(p) + ' · ' + tiefe + (tiefe === 1 ? ' Frage' : ' Fragen');
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
      zustand.ablauf = [];
      d.themen.forEach(function (t) {
        A.fragenFuer(t, zustand.gewichte[t.id]).forEach(function (f) {
          zustand.ablauf.push({ themaId: t.id, frageId: f.id });
        });
      });
      if (!zustand.ablauf.length) {
        hinweis.textContent = 'Bitte mindestens einem Thema Punkte geben.';
        return;
      }
      zustand.frageIndex = 0;
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
      zustand.frageIndex = 0;
      gehe('bewertung');
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

  /* ---------- 3. Fragen beantworten (anonym) ---------- */

  ANSICHTEN.bewertung = function () {
    var schritt = zustand.ablauf[zustand.frageIndex];
    var t = themaNach(schritt.themaId);
    var fr = frageNach(schritt.themaId, schritt.frageId);
    var gesamt = zustand.ablauf.length;

    var antwort = zustand.antworten[fr.id] || {};
    var karten = {};

    var liste = el('div', { 'class': 'liste' });
    zustand.mischung[fr.id].forEach(function (aussageId, i) {
      var a = fr.aussagen.filter(function (x) { return x.id === aussageId; })[0];
      var karte = aussageKarte(a, fr, 'ABCD'.charAt(i), function () { aktualisiereAlle(); });
      karten[aussageId] = karte;
      liste.appendChild(karte.wurzel);
    });

    var stand = el('p', { 'class': 'fortschritt fortschritt--zaehler' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt' });

    function aktualisiereAlle() {
      antwort = zustand.antworten[fr.id] || {};
      Object.keys(karten).forEach(function (id) { karten[id].zeichne(antwort); });
      var fertig = A.beantwortet(antwort);
      stand.textContent = fertig
        ? 'Beantwortet.'
        : (antwort.beste || antwort.schlechteste)
          ? 'Noch offen: ' + (antwort.beste ? 'die Aussage, der Sie am wenigsten zustimmen.'
                                            : 'die Aussage, der Sie am ehesten zustimmen.')
          : 'Bitte je eine Aussage oben und unten auswählen.';
      stand.classList.toggle('fortschritt--offen', !fertig);
      weiter.classList.toggle('knopf--haupt', fertig);
      weiter.classList.toggle('knopf--still', !fertig);
    }

    var letzte = zustand.frageIndex + 1 >= gesamt;
    weiter.textContent = letzte ? 'Fragen abschließen' : 'Nächste Frage';
    weiter.addEventListener('click', function () {
      if (letzte) { gehe(nachDenFragen()); }
      else { zustand.frageIndex++; gehe('bewertung'); }
    });

    var zurueck = el('button', { 'class': 'knopf knopf--still', text: 'Zurück' });
    zurueck.addEventListener('click', function () {
      if (zustand.frageIndex > 0) { zustand.frageIndex--; gehe('bewertung'); }
      else { gehe('tipp'); }
    });

    aktualisiereAlle();

    /* Ziffer waehlt die beste, Umschalt+Ziffer die schlechteste Aussage.
     * Ueber e.code statt e.key, weil Umschalt+1 je nach Tastaturbelegung ein
     * anderes Zeichen liefert (Ziffernreihe ist auf allen Layouts gleich). */
    tastenHoerer = function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) { return; }
      var ziel = e.target && e.target.tagName;
      if (ziel === 'INPUT' || ziel === 'SELECT' || ziel === 'TEXTAREA') { return; }

      if (e.key === 'Enter' && A.beantwortet(zustand.antworten[fr.id])) {
        e.preventDefault();
        weiter.click();
        return;
      }
      var stelle = -1;
      if (/^Digit[1-9]$/.test(e.code || '')) { stelle = parseInt(e.code.charAt(5), 10) - 1; }
      else if (!e.shiftKey && /^[1-9]$/.test(e.key)) { stelle = parseInt(e.key, 10) - 1; }
      if (stelle < 0 || stelle >= zustand.mischung[fr.id].length) { return; }
      e.preventDefault();
      waehle(fr.id, zustand.mischung[fr.id][stelle],
        e.shiftKey ? 'schlechteste' : 'beste');
      aktualisiereAlle();
    };
    document.addEventListener('keydown', tastenHoerer);

    buehne.appendChild(el('section', {}, [
      el('p', { 'class': 'fortschritt', text: 'Frage ' + (zustand.frageIndex + 1) + ' von ' + gesamt + ' · ' + t.titel }),
      el('h1', { text: fr.text }),
      el('p', { 'class': 'fliess fliess--klein', text: 'Wählen Sie die Aussage, der Sie am ehesten zustimmen, und die, der Sie am wenigsten zustimmen. Die Reihenfolge ist zufällig. Nennt ein Zitat die eigene Partei, steht dort „[Partei]“.' }),
      liste,
      stand,
      tastenhinweis(),
      el('div', { 'class': 'navi navi--fest' }, [zurueck, weiter])
    ]));
  };

  /* Die Zifferntasten wählen die beste, mit Umschalt die schlechteste
   * Aussage - bei 20 Fragen spart das den Weg zur Maus. */
  function tastenhinweis() {
    var z = el('p', { 'class': 'tastenhinweis' }, [
      el('span', { 'class': 'taste', text: '1' }),
      el('span', { text: '…' }),
      el('span', { 'class': 'taste', text: '4' }),
      el('span', { text: ' beste Aussage · ' }),
      el('span', { 'class': 'taste', text: '⇧' }),
      el('span', { text: ' + Ziffer schlechteste · ' }),
      el('span', { 'class': 'taste', text: '↵' }),
      el('span', { text: ' weiter' })
    ]);
    return z;
  }

  /* Vor der Aufdeckung werden Parteinamen im Text maskiert – Originalzitate
   * nennen die eigene Partei ("Die AfD fordert", "Wir Freie Demokraten"). */
  function aussageText(a, fassung) {
    var roh = fassung === 'kurz' ? a.kurz : a.original;
    return zustand.aufgedeckt ? roh : D.anonymisiere(zustand.datensatz, roh);
  }

  /* Setzt eine Wahl und löst dabei Kollisionen auf: dieselbe Aussage kann
   * nicht zugleich beste und schlechteste sein, und beide Rollen sind je
   * Frage nur einmal vergeben. */
  function waehle(frageId, aussageId, rolle) {
    var a = zustand.antworten[frageId] || {};
    var gegen = rolle === 'beste' ? 'schlechteste' : 'beste';
    if (a[rolle] === aussageId) { delete a[rolle]; }
    else {
      a[rolle] = aussageId;
      if (a[gegen] === aussageId) { delete a[gegen]; }
    }
    zustand.antworten[frageId] = a;
  }

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
    var erg = A.berechne(zustand.datensatz, zustand.gewichte, zustand.antworten);
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
    zustand.ablauf.forEach(function (schritt) {
      var fr = frageNach(schritt.themaId, schritt.frageId);
      var antwort = zustand.antworten[fr.id];
      if (!A.beantwortet(antwort)) { return; }
      fr.aussagen.forEach(function (a) {
        var markiert = antwort.beste === a.id || antwort.schlechteste === a.id;
        (proPartei[a.parteiId] = proPartei[a.parteiId] || []).push({
          aussage: a, frage: fr, markiert: markiert
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
          zustand.frageIndex = zustand.ablauf.length - 1;
          gehe('bewertung');
        } }),
        weiter
      ])
    ]));
  };

  function aussageKarte(a, fr, marke, beiAenderung) {
    var fassung = zustand.fassung[a.id] || 'kurz';
    var textEl = el('p', { 'class': 'aussage-text', text: aussageText(a, fassung) });
    if (fassung === 'original') { textEl.classList.add('aussage-text--zitat'); }

    var toggle = el('button', {
      'class': 'link',
      text: fassung === 'kurz' ? 'Originalzitat anzeigen' : 'Zusammenfassung anzeigen'
    });
    toggle.addEventListener('click', function () {
      var neu = (zustand.fassung[a.id] || 'kurz') === 'kurz' ? 'original' : 'kurz';
      zustand.fassung[a.id] = neu;
      textEl.textContent = aussageText(a, neu);
      textEl.classList.toggle('aussage-text--zitat', neu === 'original');
      toggle.textContent = neu === 'kurz' ? 'Originalzitat anzeigen' : 'Zusammenfassung anzeigen';
    });

    var beste = el('button', { 'class': 'bewertung bewertung--beste', text: 'Am ehesten' });
    var schlecht = el('button', { 'class': 'bewertung bewertung--schlechteste', text: 'Am wenigsten' });
    beste.addEventListener('click', function () { waehle(fr.id, a.id, 'beste'); beiAenderung(); });
    schlecht.addEventListener('click', function () { waehle(fr.id, a.id, 'schlechteste'); beiAenderung(); });

    var knoepfe = el('div', { 'class': 'wahlknoepfe' }, [beste, schlecht]);

    /* Bewusst neutral: weder parteiId noch Name, Farbe oder Dateiname im DOM. */
    var wurzel = el('article', { 'class': 'karte karte--aussage' }, [
      el('div', { 'class': 'aussage-kopf' }, [
        el('span', { 'class': 'aussage-marke', text: marke })
      ]),
      textEl, toggle, knoepfe
    ]);

    return {
      wurzel: wurzel,
      zeichne: function (antwort) {
        var istBeste = antwort.beste === a.id;
        var istSchlecht = antwort.schlechteste === a.id;
        beste.classList.toggle('bewertung--aktiv', istBeste);
        schlecht.classList.toggle('bewertung--aktiv', istSchlecht);
        wurzel.classList.toggle('karte--beste', istBeste);
        wurzel.classList.toggle('karte--schlechteste', istSchlecht);
      }
    };
  }

  /* ---------- 4. Ergebnis ---------- */

  function wahlLabel(wert) {
    if (wert === null) { return 'nicht beantwortet'; }
    if (wert === A.PUNKTE.beste) { return 'am ehesten'; }
    if (wert === A.PUNKTE.schlechteste) { return 'am wenigsten'; }
    return 'dazwischen';
  }

  ANSICHTEN.ergebnis = function () {
    var d = zustand.datensatz;
    var erg = A.berechne(d, zustand.gewichte, zustand.antworten);
    zustand.ergebnis = erg;

    var abschnitt = el('section', {}, [
      el('h1', { text: 'Ihr Ergebnis' }),
      el('p', { 'class': 'fliess', text: d.name + ' am ' + datumDeutsch(d.wahltag) + '.' })
    ]);

    if (!zustand.aufgedeckt) {
      abschnitt.appendChild(el('div', { 'class': 'karte karte--aufdeckung' }, [
        el('p', { 'class': 'aufdeckung-zahl', text: String(erg.fragenGesamt - erg.offeneFragen) }),
        el('p', { 'class': 'aufdeckung-text', text: (erg.fragenGesamt - erg.offeneFragen) === 1
          ? 'beantwortete Frage ist ausgewertet.'
          : 'beantwortete Fragen sind ausgewertet.' }),
        el('p', { 'class': 'fliess', style: 'margin:1.25rem auto 0',
          text: 'Bis hierhin haben Sie nur Sätze verglichen. Der nächste Schritt zeigt, wer sie geschrieben hat – er lässt sich nicht zurücknehmen.' }),
        erg.offeneFragen
          ? el('p', { 'class': 'fliess fliess--klein', text: erg.offeneFragen + ' von ' + erg.fragenGesamt + ' Fragen sind offen geblieben. Sie fließen für keine Partei in die Wertung ein – Sie können sie noch nachtragen.' })
          : null,
        el('button', {
          'class': 'knopf knopf--haupt', text: 'Parteien aufdecken',
          onclick: function () { zustand.aufgedeckt = true; gehe('ergebnis'); }
        }),
        el('button', {
          'class': 'knopf knopf--still', text: 'Zurück zu den Fragen',
          onclick: function () {
            zustand.frageIndex = zustand.ablauf.length - 1;
            gehe('bewertung');
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
      rang.appendChild(karte);
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
      rang.appendChild(zKarte);
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
      rang.appendChild(tKarte);
    }

    erg.ranking.slice(spitze.length).forEach(function (r, i) {
      var p = D.partei(d, r.parteiId);
      var breite = Math.round(r.prozent);
      rang.appendChild(el('div', { 'class': 'karte karte--rang' }, [
        el('span', { 'class': 'rang-nr', text: String(spitze.length + i + 1) }),
        parteiMarke(p),
        el('span', { 'class': 'rang-wert', text: breite + ' %' }),
        balken(p, breite)
      ]));
    });
    /* Erst im naechsten Bild fuellen, sonst startet die Ueberblendung nicht -
     * der Balken staende sofort auf Endbreite. */
    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(function () {
        fuellungen.forEach(function (f) { f[0].style.width = f[1] + '%'; });
      });
    } else {
      fuellungen.forEach(function (f) { f[0].style.width = f[1] + '%'; });
    }
    abschnitt.appendChild(el('h2', { text: 'Alle Parteien' }));
    abschnitt.appendChild(rang);
    abschnitt.appendChild(el('p', { 'class': 'fliess fliess--klein', text:
      'So wird gerechnet: In jeder Frage bekommt die Aussage, der Sie am ehesten '
      + 'zustimmen, 100 Punkte, die mit der geringsten Zustimmung 0, die übrigen 50. '
      + 'Der Themenwert einer Partei ist der Mittelwert über die Fragen dieses Themas, '
      + 'in denen sie vorkommt – eine Frage zeigt nur 3 bis 4 der Parteien. Der '
      + 'Gesamtwert ist der mit Ihrer Themengewichtung gewichtete Durchschnitt. Offene '
      + 'Fragen zählen für niemanden.' }));

    /* Aufschlüsselung je Thema */
    abschnitt.appendChild(el('h2', { text: 'Nach Themen' }));
    erg.themen.filter(function (t) { return t.gewicht > 0; }).forEach(function (t) {
      var thema = themaNach(t.id);
      var inhalt = el('div', { 'class': 'themen-werte' });

      t.werte.forEach(function (w) {
        var p = D.partei(d, w.parteiId);
        inhalt.appendChild(el('div', { 'class': 'wert-kopf' }, [
          parteiMarke(p),
          el('span', { 'class': 'wert-zahl', text: Math.round(w.wert) + ' %' })
        ]));
      });

      var fragen = el('div', { 'class': 'fragen-liste' });
      t.fragen.forEach(function (fErg) {
        var fr = frageNach(t.id, fErg.id);
        var block = el('div', { 'class': 'frage-block' }, [
          el('p', { 'class': 'frage-text', text: fr.text
            + (fErg.beantwortet ? '' : ' (nicht beantwortet)') })
        ]);
        fErg.werte.forEach(function (w) {
          var p = D.partei(d, w.parteiId);
          var a = fr.aussagen.filter(function (x) { return x.id === w.aussageId; })[0];
          var quellKnopf = el('button', { 'class': 'link link--quelle', text: 'Quelle: Seite ' + a.quelle.seite });
          quellKnopf.addEventListener('click', function () {
            if (!global.S47_QUELLE.zeige(a.quelle, p.programm && p.programm.titel)) {
              window.open(global.S47_QUELLE.fallbackUrl(a.quelle), '_blank', 'noopener');
            }
          });
          block.appendChild(el('div', { 'class': 'wert-zeile' }, [
            el('div', { 'class': 'wert-kopf' }, [
              parteiMarke(p),
              el('span', { 'class': 'wert-zahl', text: w.wert === null ? '–' : w.wert + ' %' })
            ]),
            el('p', { 'class': 'wert-aussage', text: aussageText(a, 'kurz') }),
            el('p', { 'class': 'wert-antwort' + (fErg.beantwortet ? '' : ' wert-antwort--offen'),
                      text: 'Ihre Wahl: ' + wahlLabel(w.wert) }),
            quellKnopf
          ]));
        });
        fragen.appendChild(block);
      });

      abschnitt.appendChild(el('div', { 'class': 'karte' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('h3', { 'class': 'thema-titel', text: thema.titel }),
          el('span', { 'class': 'gewicht-wert', text: A.punkteLabel(t.gewicht) + ' · ' + t.gewicht + ' Punkte' })
        ]),
        inhalt,
        fragen
      ]));
    });

    var exportKnopf = el('button', { 'class': 'knopf knopf--still', text: 'Ergebnis als PDF' });
    exportKnopf.addEventListener('click', function () {
      try {
        /* Das komplette Auswertungsergebnis weiterreichen, damit der Export
         * dieselben Zahlen zeigt wie die Seite – auch die offenen Fragen. */
        global.S47_EXPORT.erzeuge({
          datensatz: d, ranking: erg.ranking, themen: erg.themen,
          offeneFragen: erg.offeneFragen, fragenGesamt: erg.fragenGesamt,
          gewichte: zustand.gewichte, antworten: zustand.antworten
        });
      } catch (e) {
        exportKnopf.textContent = 'Export fehlgeschlagen: ' + e.message;
      }
    });

    abschnitt.appendChild(el('div', { 'class': 'navi' }, [
      el('button', {
        'class': 'knopf knopf--still', text: 'Antworten ändern',
        onclick: function () {
          zustand.frageIndex = zustand.ablauf.length - 1;
          gehe('bewertung');
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
