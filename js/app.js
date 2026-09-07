/* Seite 47 – Ablaufsteuerung und Oberfläche.
 * Enthält KEINE Inhalte einzelner Wahlen. Alles Wahlspezifische kommt aus data/.
 */
(function (global) {
  'use strict';

  var A = global.S47_AUSWERTUNG;
  var D = global.S47_DATA;

  var zustand = {
    schritt: 'wahl',        /* wahl | gewichtung | bewertung | ergebnis */
    datensatz: null,
    gewichte: {},           /* themaId -> 0..3 */
    reihenfolge: [],        /* themaId[] der zu bewertenden Themen */
    themaIndex: 0,
    antworten: {},          /* aussageId -> 'zu'|'ne'|'ab' */
    fassung: {},            /* aussageId -> 'kurz'|'original' */
    mischung: {},           /* themaId -> aussageId[] (stabil gemischt) */
    ergebnis: null,
    aufgedeckt: false
  };

  var buehne = document.getElementById('buehne');
  var schritteEl = document.getElementById('schritte');

  var SCHRITTE = [
    { id: 'wahl', label: 'Wahl' },
    { id: 'gewichtung', label: 'Themen' },
    { id: 'bewertung', label: 'Aussagen' },
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

  /* Zufällige, aber innerhalb der Sitzung stabile Reihenfolge der Aussagen. */
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
      el('p', { 'class': 'fliess', text: 'Sie gewichten Themen, bewerten anonymisierte Aussagen aus den Wahlprogrammen und erfahren erst am Ende, welche Partei wofür steht. Alle Angaben bleiben in diesem Browser.' }),
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
    zustand.themaIndex = 0;
    zustand.ergebnis = null;
    zustand.aufgedeckt = false;
    datensatz.themen.forEach(function (t) {
      zustand.gewichte[t.id] = 2;
      zustand.mischung[t.id] = mische(t.aussagen.map(function (a) { return a.id; }));
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
        type: 'range', min: '0', max: '3', step: '1',
        value: String(zustand.gewichte[t.id]),
        'class': 'slider', id: 'g-' + t.id
      });
      var zeile = el('div', { 'class': 'karte karte--thema' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('label', { 'class': 'thema-titel', 'for': 'g-' + t.id, text: t.titel }),
          ausgabe
        ]),
        t.beschreibung ? el('p', { 'class': 'thema-text', text: t.beschreibung }) : null,
        slider
      ]);
      function aktualisiere() {
        var v = parseInt(slider.value, 10);
        zustand.gewichte[t.id] = v;
        ausgabe.textContent = A.GEWICHTE[v].label;
        zeile.classList.toggle('karte--aus', v === 0);
      }
      slider.addEventListener('input', aktualisiere);
      aktualisiere();
      liste.appendChild(zeile);
    });

    var hinweis = el('p', { 'class': 'hinweis' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Zu den Aussagen' });
    weiter.addEventListener('click', function () {
      zustand.reihenfolge = d.themen
        .filter(function (t) { return zustand.gewichte[t.id] > 0; })
        .map(function (t) { return t.id; });
      if (!zustand.reihenfolge.length) {
        hinweis.textContent = 'Bitte mindestens ein Thema oberhalb von „Nicht wichtig“ einstellen.';
        return;
      }
      zustand.themaIndex = 0;
      gehe('bewertung');
    });

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Wie wichtig sind Ihnen diese Themen?' }),
      el('p', { 'class': 'fliess', text: 'Themen auf „Nicht wichtig“ werden weder abgefragt noch gewertet. Die Themenliste stammt aus den Programmen zu: ' + d.name + '.' }),
      liste,
      hinweis,
      el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still', text: 'Zurück', onclick: function () { gehe('wahl'); } }),
        weiter
      ])
    ]));
  };

  /* ---------- 3. Aussagen bewerten (anonym) ---------- */

  function themaNach(id) {
    return zustand.datensatz.themen.filter(function (t) { return t.id === id; })[0];
  }

  ANSICHTEN.bewertung = function () {
    var themaId = zustand.reihenfolge[zustand.themaIndex];
    var t = themaNach(themaId);
    var gesamt = zustand.reihenfolge.length;

    var liste = el('div', { 'class': 'liste' });
    zustand.mischung[themaId].forEach(function (aussageId, i) {
      var a = t.aussagen.filter(function (x) { return x.id === aussageId; })[0];
      liste.appendChild(aussageKarte(a, i + 1));
    });

    var zaehler = el('p', { 'class': 'fortschritt fortschritt--zaehler' });
    zustand.zaehlerAktualisieren = function () {
      var offen = t.aussagen.filter(function (a) { return !zustand.antworten[a.id]; }).length;
      zaehler.textContent = (t.aussagen.length - offen) + ' von ' + t.aussagen.length
        + ' bewertet' + (offen ? ' – offene zählen wie „Neutral“' : '');
      zaehler.classList.toggle('fortschritt--offen', offen > 0);
    };
    zustand.zaehlerAktualisieren();

    var letztes = zustand.themaIndex + 1 >= gesamt;
    var weiter = el('button', {
      'class': 'knopf knopf--haupt',
      text: letztes ? 'Ergebnis anzeigen' : 'Nächstes Thema'
    });
    weiter.addEventListener('click', function () {
      if (letztes) { gehe('ergebnis'); }
      else { zustand.themaIndex++; gehe('bewertung'); }
    });

    var zurueck = el('button', { 'class': 'knopf knopf--still', text: 'Zurück' });
    zurueck.addEventListener('click', function () {
      if (zustand.themaIndex > 0) { zustand.themaIndex--; gehe('bewertung'); }
      else { gehe('gewichtung'); }
    });

    buehne.appendChild(el('section', {}, [
      el('p', { 'class': 'fortschritt', text: 'Thema ' + (zustand.themaIndex + 1) + ' von ' + gesamt }),
      el('h1', { text: t.titel }),
      t.frage ? el('p', { 'class': 'fliess', text: t.frage }) : null,
      el('p', { 'class': 'fliess fliess--klein', text: 'Die Reihenfolge ist zufällig. Nennt ein Zitat die eigene Partei, steht dort „[Partei]“. Welche Partei hinter einer Aussage steht, erfahren Sie am Ende.' }),
      liste,
      zaehler,
      el('div', { 'class': 'navi' }, [zurueck, weiter])
    ]));
  };

  /* Vor der Aufdeckung werden Parteinamen im Text maskiert – Originalzitate
   * nennen die eigene Partei ("Die AfD fordert", "Wir Freie Demokraten"). */
  function aussageText(a, fassung) {
    var roh = fassung === 'kurz' ? a.kurz : a.original;
    return zustand.aufgedeckt ? roh : D.anonymisiere(zustand.datensatz, roh);
  }

  function aussageKarte(a, nummer) {
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

    var knoepfe = el('div', { 'class': 'wahlknoepfe' });
    A.BEWERTUNGEN.forEach(function (b) {
      var k = el('button', {
        'class': 'bewertung' + (zustand.antworten[a.id] === b.id ? ' bewertung--aktiv' : ''),
        text: b.label
      });
      k.addEventListener('click', function () {
        zustand.antworten[a.id] = b.id;
        Array.prototype.forEach.call(knoepfe.children, function (c) { c.classList.remove('bewertung--aktiv'); });
        k.classList.add('bewertung--aktiv');
        karte.classList.remove('karte--offen');
        if (zustand.zaehlerAktualisieren) { zustand.zaehlerAktualisieren(); }
      });
      knoepfe.appendChild(k);
    });

    /* Bewusst neutral: weder parteiId noch Name, Farbe oder Dateiname im DOM. */
    var karte = el('article', {
      'class': 'karte karte--aussage' + (zustand.antworten[a.id] ? '' : ' karte--offen')
    }, [
      el('span', { 'class': 'aussage-nr', text: 'Aussage ' + nummer }),
      textEl,
      toggle,
      knoepfe
    ]);
    return karte;
  }

  /* ---------- 4. Ergebnis ---------- */

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
        erg.unbeantwortet
          ? el('p', { 'class': 'fliess fliess--klein', text: erg.unbeantwortet + ' Aussage' + (erg.unbeantwortet === 1 ? ' ist' : 'n sind') + ' unbeantwortet geblieben und zähl' + (erg.unbeantwortet === 1 ? 't' : 'en') + ' wie „Neutral“. Sie können sie noch nachtragen.' })
          : null,
        el('button', {
          'class': 'knopf knopf--haupt', text: 'Parteien aufdecken',
          onclick: function () { zustand.aufgedeckt = true; gehe('ergebnis'); }
        }),
        el('button', {
          'class': 'knopf knopf--still', text: 'Zurück zur Bewertung',
          onclick: function () {
            zustand.themaIndex = zustand.reihenfolge.length - 1;
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
        el('span', { 'class': 'rang-wert', text: r.prozent === null ? '–' : Math.round(r.prozent) + ' %' }),
        el('div', { 'class': 'balken' }, [
          el('div', { 'class': 'balken-fuell', style: 'width:' + Math.round(r.prozent || 0) + '%;background:' + (p.farbe || '#888') })
        ])
      ]));
    });
    abschnitt.appendChild(el('h2', { text: 'Gesamt' }));
    abschnitt.appendChild(rang);
    abschnitt.appendChild(el('p', { 'class': 'fliess fliess--klein', text:
      'So wird gerechnet: Zustimmung zählt 100, Neutral 50, Ablehnung 0 Punkte. '
      + 'Je Thema ergibt das den Themenwert einer Partei. Der Gesamtwert ist der mit '
      + 'Ihrer Themengewichtung gewichtete Durchschnitt – nur über Themen, zu denen die '
      + 'Partei eine Position im Programm hat.' }));

    /* Aufschlüsselung je Thema */
    abschnitt.appendChild(el('h2', { text: 'Nach Themen' }));
    erg.themen.filter(function (t) { return t.gewicht > 0; }).forEach(function (t) {
      var thema = themaNach(t.id);
      var tabelle = el('div', { 'class': 'themen-werte' });
      t.werte.forEach(function (w) {
        var p = D.partei(d, w.parteiId);
        var a = thema.aussagen.filter(function (x) { return x.id === w.aussageId; })[0];
        var quellKnopf = el('button', { 'class': 'link link--quelle', text: 'Quelle: Seite ' + a.quelle.seite });
        quellKnopf.addEventListener('click', function () {
          if (!global.S47_QUELLE.zeige(a.quelle, p.programm && p.programm.titel)) {
            window.open(global.S47_QUELLE.fallbackUrl(a.quelle), '_blank', 'noopener');
          }
        });
        var antwort = w.bewertung
          ? A.BEWERTUNGEN.filter(function (b) { return b.id === w.bewertung; })[0].label
          : 'nicht beantwortet';
        tabelle.appendChild(el('div', { 'class': 'wert-zeile' }, [
          el('div', { 'class': 'wert-kopf' }, [
            parteiMarke(p),
            el('span', { 'class': 'wert-zahl', text: w.wert + ' %' })
          ]),
          el('p', { 'class': 'wert-aussage', text: aussageText(a, 'kurz') }),
          el('p', { 'class': 'wert-antwort' + (w.bewertung ? '' : ' wert-antwort--offen'),
                    text: 'Ihre Bewertung: ' + antwort }),
          quellKnopf
        ]));
      });
      abschnitt.appendChild(el('div', { 'class': 'karte' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('h3', { 'class': 'thema-titel', text: thema.titel }),
          el('span', { 'class': 'gewicht-wert', text: A.GEWICHTE[t.gewicht].label })
        ]),
        tabelle
      ]));
    });

    var exportKnopf = el('button', { 'class': 'knopf knopf--still', text: 'Ergebnis als PDF' });
    exportKnopf.addEventListener('click', function () {
      try {
        global.S47_EXPORT.erzeuge({
          datensatz: d, ranking: erg.ranking, themen: erg.themen,
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
          zustand.themaIndex = zustand.reihenfolge.length - 1;
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
