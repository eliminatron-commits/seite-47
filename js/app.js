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
    schritt: 'wahl',        /* wahl | gewichtung | bewertung | ergebnis */
    datensatz: null,
    gewichte: {},           /* themaId -> 0..100 (stufenlos) */
    ablauf: [],             /* [{themaId, frageId}] der abzufragenden Fragen */
    frageIndex: 0,
    antworten: {},          /* frageId -> {beste, schlechteste} */
    fassung: {},            /* aussageId -> 'kurz'|'original' */
    mischung: {},           /* frageId -> aussageId[] (stabil gemischt) */
    ergebnis: null,
    aufgedeckt: false
  };

  var buehne = document.getElementById('buehne');
  var schritteEl = document.getElementById('schritte');

  var SCHRITTE = [
    { id: 'wahl', label: 'Wahl' },
    { id: 'gewichtung', label: 'Themen' },
    { id: 'bewertung', label: 'Fragen' },
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
    SCHRITTE.forEach(function (s) {
      schritteEl.appendChild(el('span', {
        'class': 'schritt' + (s.id === zustand.schritt ? ' schritt--aktiv' : ''),
        text: s.label
      }));
    });
  }

  var ANSICHTEN = {};

  function gehe(schritt) {
    zustand.schritt = schritt;
    zeigeSchritte();
    leere(buehne);
    window.scrollTo(0, 0);
    ANSICHTEN[schritt]();
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

    buehne.appendChild(el('section', { 'class': 'karte karte--start' }, [
      el('h1', { text: 'Positionen zuerst, Parteien zuletzt.' }),
      el('p', { 'class': 'fliess', text: 'Sie gewichten Themen, vergleichen anonymisierte Aussagen aus den Wahlprogrammen und erfahren erst am Ende, welche Partei wofür steht. Alle Angaben bleiben in diesem Browser.' }),
      el('label', { 'class': 'label', 'for': 'wahlauswahl', text: 'Wahl' }),
      select,
      hinweis,
      knopf
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
    zustand.aufgedeckt = false;
    datensatz.themen.forEach(function (t) {
      zustand.gewichte[t.id] = A.GEWICHT_START;
      t.fragen.forEach(function (f) {
        zustand.mischung[f.id] = mische(f.aussagen.map(function (a) { return a.id; }));
      });
    });
    gehe('gewichtung');
  }

  /* ---------- 2. Themen gewichten ---------- */

  ANSICHTEN.gewichtung = function () {
    var d = zustand.datensatz;
    var liste = el('div', { 'class': 'liste' });

    d.themen.forEach(function (t) {
      var ausgabe = el('span', { 'class': 'gewicht-wert' });
      var slider = el('input', {
        type: 'range',
        min: String(A.GEWICHT_MIN), max: String(A.GEWICHT_MAX), step: '1',
        value: String(zustand.gewichte[t.id]),
        'class': 'slider', id: 'g-' + t.id
      });
      var anzahl = t.fragen.length;
      var zeile = el('div', { 'class': 'karte karte--thema' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('label', { 'class': 'thema-titel', 'for': 'g-' + t.id, text: t.titel }),
          ausgabe
        ]),
        t.beschreibung ? el('p', { 'class': 'thema-text', text: t.beschreibung }) : null,
        slider,
        el('p', { 'class': 'thema-fragen', text: anzahl + (anzahl === 1 ? ' Frage' : ' Fragen') })
      ]);
      function aktualisiere() {
        var v = parseInt(slider.value, 10);
        /* Die Null ist eine echte Schwelle und darf nicht aus Versehen beim
         * Wischen entstehen: die unteren Prozente rasten auf 0 ein. */
        if (v > 0 && v < 4) { v = 0; slider.value = '0'; }
        zustand.gewichte[t.id] = v;
        ausgabe.textContent = A.gewichtLabel(v);
        zeile.classList.toggle('karte--aus', v === 0);
      }
      slider.addEventListener('input', aktualisiere);
      aktualisiere();
      liste.appendChild(zeile);
    });

    var hinweis = el('p', { 'class': 'hinweis' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Zu den Fragen' });
    weiter.addEventListener('click', function () {
      zustand.ablauf = [];
      d.themen.forEach(function (t) {
        if (zustand.gewichte[t.id] <= 0) { return; }
        t.fragen.forEach(function (f) {
          zustand.ablauf.push({ themaId: t.id, frageId: f.id });
        });
      });
      if (!zustand.ablauf.length) {
        hinweis.textContent = 'Bitte mindestens ein Thema oberhalb von „Nicht wichtig“ einstellen.';
        return;
      }
      zustand.frageIndex = 0;
      gehe('bewertung');
    });

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Wie wichtig sind Ihnen diese Themen?' }),
      el('p', { 'class': 'fliess', text: 'Der Regler ist stufenlos. Themen ganz links werden weder abgefragt noch gewertet. Die Themenliste stammt aus den Programmen zu: ' + d.name + '.' }),
      liste,
      hinweis,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück', onclick: function () { gehe('wahl'); } }),
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
    zustand.mischung[fr.id].forEach(function (aussageId) {
      var a = fr.aussagen.filter(function (x) { return x.id === aussageId; })[0];
      var karte = aussageKarte(a, fr, function () { aktualisiereAlle(); });
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
    weiter.textContent = letzte ? 'Ergebnis anzeigen' : 'Nächste Frage';
    weiter.addEventListener('click', function () {
      if (letzte) { gehe('ergebnis'); }
      else { zustand.frageIndex++; gehe('bewertung'); }
    });

    var zurueck = el('button', { 'class': 'knopf knopf--still', text: 'Zurück' });
    zurueck.addEventListener('click', function () {
      if (zustand.frageIndex > 0) { zustand.frageIndex--; gehe('bewertung'); }
      else { gehe('gewichtung'); }
    });

    aktualisiereAlle();

    buehne.appendChild(el('section', {}, [
      el('p', { 'class': 'fortschritt', text: 'Frage ' + (zustand.frageIndex + 1) + ' von ' + gesamt + ' · ' + t.titel }),
      el('h1', { text: fr.text }),
      el('p', { 'class': 'fliess fliess--klein', text: 'Wählen Sie die Aussage, der Sie am ehesten zustimmen, und die, der Sie am wenigsten zustimmen. Die Reihenfolge ist zufällig. Nennt ein Zitat die eigene Partei, steht dort „[Partei]“.' }),
      liste,
      stand,
      el('div', { 'class': 'navi' }, [zurueck, weiter])
    ]));
  };

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

  function aussageKarte(a, fr, beiAenderung) {
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
    var wurzel = el('article', { 'class': 'karte karte--aussage' }, [textEl, toggle, knoepfe]);

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
        el('p', { 'class': 'fliess', text: 'Ihre Antworten sind ausgewertet. Im nächsten Schritt werden die Parteien hinter den Aussagen sichtbar.' }),
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
    erg.ranking.forEach(function (r, i) {
      var p = D.partei(d, r.parteiId);
      rang.appendChild(el('div', { 'class': 'karte karte--rang' }, [
        el('span', { 'class': 'rang-nr', text: String(i + 1) }),
        parteiMarke(p),
        el('span', { 'class': 'rang-wert', text: Math.round(r.prozent) + ' %' }),
        el('div', { 'class': 'balken' }, [
          el('div', { 'class': 'balken-fuell', style: 'width:' + Math.round(r.prozent) + '%;background:' + (p.farbe || '#888') })
        ])
      ]));
    });
    abschnitt.appendChild(el('h2', { text: 'Gesamt' }));
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
          el('span', { 'class': 'gewicht-wert', text: A.gewichtLabel(t.gewicht) })
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

  /* ---------- Start ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-aktion="neustart"]') : null;
    if (t) { e.preventDefault(); gehe('wahl'); }
  });

  gehe('wahl');
})(window);
