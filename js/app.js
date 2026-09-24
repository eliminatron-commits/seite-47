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

  /* Unter drei Themen ist die Rangfolge der Parteien Zufall: jedes Programm
   * traete nur eine Handvoll Mal an. Deshalb ist drei die Untergrenze der
   * Auswahl, nicht eins. */
  var MINDEST_THEMEN = 3;

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
    ergebnis: null,
    tipp: null,             /* parteiId der Erwartung vor dem Durchgang */
    ausschluss: null,       /* parteiId der vorab ausgeschlossenen Partei */
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
    var innerhalb = { zwischenstand: 'spiel', finale: 'spiel', turnier: 'ergebnis' };
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
    sichere();
  }

  function themaNach(id) {
    return zustand.datensatz.themen.filter(function (t) { return t.id === id; })[0];
  }

  function frageNach(themaId, frageId) {
    return themaNach(themaId).fragen.filter(function (f) { return f.id === frageId; })[0];
  }

  /* ---------- 1. Wahl auswählen ---------- */

  /* Die Titelseite hat keinen Auswahlkasten und kein animiertes Band mehr
   * (Nutzer: "passt nicht in dieses Design"). Gewaehlt wird ueber die
   * Terminkaesten "Zur Wahl stehen", auf jeder Bildschirmbreite. */
  ANSICHTEN.wahl = function () {
    var wahlen = D.manifest();

    var hinweis = el('p', { 'class': 'hinweis' });
    var laedt = false;
    function starte(id) {
      if (laedt) { return; }
      laedt = true;
      hinweis.textContent = 'Datensatz wird geladen …';
      D.lade(id, function (fehler, datensatz) {
        laedt = false;
        if (fehler) {
          hinweis.textContent = 'Fehler: ' + fehler.message;
          return;
        }
        starteWahl(datensatz);
      });
    }

    var ablauf = el('ol', { 'class': 'ablauf' });
    [
      ['Schwerpunkte wählen', 'Wie lange soll es dauern, und welche Themen zählen für Sie mehr? Schwerpunkte verschieben nur, wo genauer gefragt wird.'],
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

    /* Der Zeitungskopf. Das Heutedatum ist das einzige, was sich darin
     * bewegt - und genau das macht aus einem Logo eine Ausgabe. Kein
     * Wahldatum: die Startseite gehoert keiner einzelnen Wahl. */
    var heute = '';
    try {
      heute = new Date().toLocaleDateString('de-DE',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { heute = ''; }

    var zeitungskopf = el('div', { 'class': 'zeitungskopf' }, [
      el('p', { 'class': 'zeitungskopf-titel', text: 'Seite 47' }),
      el('p', { 'class': 'zeitungskopf-zeile' }, [
        el('span', { text: 'Ausgabe Nr. 47' }),
        el('span', { text: heute }),
        el('span', { text: 'Ohne Absender · ohne Tracking' })
      ])
    ]);

    /* "Zur Wahl stehen" - auf breiten Schirmen rechte Randspalte, schmal
     * direkt unter dem Aufmacher. Die Wahlen kommen aus dem Manifest, nicht
     * aus dem App-Code. Ein Klick startet direkt. Vergangene Wahlen tragen,
     * wo das Manifest es mitbringt, ihr Ergebnis wie eine Zeitungsmeldung. */
    function tageBis(iso) {
      var t = String(iso).split('-');
      var ziel = new Date(parseInt(t[0], 10), parseInt(t[1], 10) - 1, parseInt(t[2], 10));
      var heute = new Date();
      heute.setHours(0, 0, 0, 0);
      return Math.round((ziel - heute) / 86400000);
    }
    function frist(n) {
      if (n > 1) { return 'in ' + n + ' Tagen'; }
      if (n === 1) { return 'morgen'; }
      if (n === 0) { return 'heute'; }
      return 'bereits gewählt';
    }
    var rand = el('aside', { 'class': 'wahl-rand' }, [
      el('p', { 'class': 'dachzeile', text: 'Zur Wahl stehen' })
    ]);
    wahlen.slice().sort(function (a, b) {
      return String(a.wahltag).localeCompare(String(b.wahltag));
    }).forEach(function (w) {
      var t = String(w.wahltag).split('-');
      var tage = tageBis(w.wahltag);
      var teaser = el('button', {
        'class': 'wahl-teaser' + (tage < 0 ? ' wahl-teaser--vorbei' : ''), type: 'button' }, [
        el('span', { 'class': 'wahl-teaser-tag', text: parseInt(t[2], 10) + '.' }),
        el('span', { 'class': 'wahl-teaser-monat',
          text: MONATE[parseInt(t[1], 10) - 1] + ' ' + t[0] }),
        el('span', { 'class': 'wahl-teaser-name', text: w.name }),
        el('span', { 'class': 'wahl-teaser-frist', text: frist(tage) }),
        tage < 0 ? ergebnisMeldung(w.ergebnis) : null
      ]);
      teaser.addEventListener('click', function () { starte(w.id); });
      rand.appendChild(teaser);
      var lauf = laufKasten(w.id);
      if (lauf) { rand.appendChild(lauf); }
    });
    rand.appendChild(hinweis);

    /* Ergebnis einer vergangenen Wahl als Kurzmeldung: Parteien mit Prozent
     * und grauem Balken, dazu Art und Quelle des Ergebnisses. Unbunt wie der
     * Rest der Titelseite - Parteifarben gehoeren erst zur Aufdeckung. */
    /* Eigene Durchgaenge unter dem Terminkasten: Modus, Zeitpunkt, alle
     * Parteien mit Wert. Mehrere Durchgaenge derselben Wahl lassen sich
     * blaettern (neuester zuerst); ein Klick oeffnet das Ergebnis wieder. */
    function laufKasten(wahlId) {
      var laeufe = LAEUFE.filter(function (l) { return l.wahlId === wahlId; });
      if (!laeufe.length) { return null; }
      var pos = laeufe.length - 1;
      var kasten = el('div', { 'class': 'lauf-kasten' });
      /* Starr beim Blaettern: Alle Durchgaenge liegen uebereinander in einer
       * Rasterzelle, nur einer ist sichtbar. Der Kasten ist damit immer so
       * hoch wie der hoechste - vorher sprang die ganze Titelseite, weil
       * Durchgaenge verschieden viele Parteien und Zeilen haben. */
      var stapel = el('div', { 'class': 'lauf-stapel' });
      var tafeln = laeufe.map(function (l) {
        var tafel = el('div', { 'class': 'lauf-tafel' });
        baueTafel(tafel, l);
        stapel.appendChild(tafel);
        return tafel;
      });
      var zurueck = el('button', { 'class': 'lauf-pfeil', type: 'button', text: '‹',
        title: 'Früherer Durchgang', 'aria-label': 'Früherer Durchgang',
        onclick: function () { if (pos > 0) { pos--; zeige(); } } });
      var vor = el('button', { 'class': 'lauf-pfeil', type: 'button', text: '›',
        title: 'Späterer Durchgang', 'aria-label': 'Späterer Durchgang',
        onclick: function () { if (pos < laeufe.length - 1) { pos++; zeige(); } } });
      var zaehler = el('span', { 'class': 'lauf-zaehler' });
      kasten.appendChild(el('div', { 'class': 'lauf-kopf' }, [
        el('span', { 'class': 'lauf-titel', text: laeufe.length > 1 ? 'Ihre Durchgänge' : 'Ihr Durchgang' }),
        laeufe.length > 1 ? el('span', { 'class': 'lauf-blaettern' }, [zurueck, zaehler, vor]) : null
      ]));
      kasten.appendChild(stapel);
      function zeige() {
        tafeln.forEach(function (t, i) {
          t.classList.toggle('lauf-tafel--an', i === pos);
          t.setAttribute('aria-hidden', i === pos ? 'false' : 'true');
          var knopf = t.querySelector('button');
          if (knopf) { knopf.tabIndex = i === pos ? 0 : -1; }
        });
        zurueck.disabled = pos === 0;
        vor.disabled = pos === laeufe.length - 1;
        zaehler.textContent = (pos + 1) + ' / ' + laeufe.length;
      }
      zeige();
      return kasten;

      function baueTafel(kasten, l) {
        var ds = l.zustand.datensatz;
        var modus = DU.UMFAENGE.filter(function (u) { return u.id === l.zustand.umfang; })[0];
        var zeit = '';
        try {
          zeit = l.zeit.toLocaleString('de-DE',
            { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + ' Uhr';
        } catch (e) { zeit = ''; }
        kasten.appendChild(el('p', { 'class': 'lauf-meta',
          text: [(modus ? modus.name : 'Normal'), zeit, l.gespielt + ' Duelle'].filter(Boolean).join(' · ') }));
        var zeilen = l.ranking.map(function (r) {
          var p = D.partei(ds, r.parteiId);
          var wert = Math.round(r.prozent);
          return el('span', { 'class': 'wahl-ergebnis-zeile' }, [
            el('span', { 'class': 'wahl-ergebnis-name', text: p ? p.name : r.parteiId }),
            el('span', { 'class': 'wahl-ergebnis-balken' }, [
              el('span', { 'class': 'wahl-ergebnis-fuell', style: 'width:' + Math.max(0, Math.min(100, wert)) + '%' })
            ]),
            el('span', { 'class': 'wahl-ergebnis-zahl', text: wert + ' %' })
          ]);
        });
        kasten.appendChild(el('button', { 'class': 'lauf-oeffnen', type: 'button',
          onclick: function () { oeffneLauf(l); } }, [
          el('span', { 'class': 'wahl-ergebnis' }, zeilen),
          el('span', { 'class': 'lauf-weiter', text: 'Zum Ergebnis →' })
        ]));
      }
    }

    function ergebnisMeldung(erg) {
      if (!erg || !erg.parteien || !erg.parteien.length) { return null; }
      var hoechster = erg.parteien.reduce(function (m, p) {
        return Math.max(m, parseFloat(p.prozent) || 0);
      }, 0) || 1;
      var zeilen = erg.parteien.map(function (p) {
        var wert = parseFloat(p.prozent) || 0;
        return el('span', { 'class': 'wahl-ergebnis-zeile' }, [
          el('span', { 'class': 'wahl-ergebnis-name', text: p.name }),
          el('span', { 'class': 'wahl-ergebnis-balken' }, [
            el('span', { 'class': 'wahl-ergebnis-fuell',
              style: 'width:' + Math.round(wert / hoechster * 100) + '%' })
          ]),
          el('span', { 'class': 'wahl-ergebnis-zahl',
            text: wert.toFixed(1).replace('.', ',') + ' %' })
        ]);
      });
      return el('span', { 'class': 'wahl-ergebnis' }, zeilen.concat([
        el('span', { 'class': 'wahl-ergebnis-quelle',
          text: [erg.art, erg.quelle].filter(Boolean).join(' · ') })
      ]));
    }

    /* Zweiter Artikel unter dem Aufmacher: die These, die das Projekt
     * traegt, gesetzt wie ein Leitartikel. Allgemein, ohne Wahlinhalte. */
    var leitartikel = el('article', { 'class': 'leitartikel' }, [
      el('p', { 'class': 'dachzeile', text: 'Leitartikel' }),
      el('h2', { text: 'Wir wählen Etiketten, nicht Inhalte' }),
      el('div', { 'class': 'leitartikel-text' }, [
        el('p', { text: 'Wer eine Partei wählt, wählt selten ihr Programm. Man kennt einen Namen, eine Farbe, ein Gesicht – und schließt vom Etikett auf den Inhalt. Die Sätze dahinter liest kaum jemand.' }),
        el('p', { text: 'Seite 47 dreht das um. Zuerst halten Sie fest, wen Sie vorn erwarten und wen Sie ausschließen. Dann lesen Sie Sätze ohne Absender, jeweils zwei gegeneinander. Am Ende sehen Sie, ob beides zusammenpasst.' }),
        el('p', { text: 'Gemessen wird nur die Zustimmung zu Programmsätzen – nicht zu Personen, Koalitionen oder Regierungsbilanzen. Gespeichert wird nur in diesem Browser-Tab, verschickt wird nichts.' })
      ])
    ]);

    buehne.appendChild(el('section', { 'class': 'titelseite' }, [
      zeitungskopf,
      el('div', { 'class': 'hero' }, [
        el('p', { 'class': 'dachzeile', text: 'Der Wahlhelfer ohne Etiketten' }),
        el('h1', { text: 'Sieben Programme. Keine Namen.' }),
        el('p', { 'class': 'hero-lead', text: 'Einzeln gelesen klingt jedes Wahlprogramm zustimmungsfähig. Hier treten die Sätze gegeneinander an – ohne Absender. Wer sie geschrieben hat, erfahren Sie zum Schluss. Alles bleibt in diesem Browser.' })
      ]),
      rand,
      ablauf,
      leitartikel
    ]));

    /* Ganz unten: alle Durchgaenge dieser Sitzung loeschen, mit Rueckfrage
     * im Blatt statt Browser-Dialog. Nur sichtbar, wenn es welche gibt. */
    if (LAEUFE.length) {
      var loeschZeile = el('div', { 'class': 'laeufe-loeschen' });
      var zeichneLoeschen = function (fragen) {
        leere(loeschZeile);
        if (!fragen) {
          loeschZeile.appendChild(el('button', { 'class': 'loeschen-link', type: 'button',
            text: 'Alle bisherigen Durchläufe löschen',
            onclick: function () { zeichneLoeschen(true); } }));
          return;
        }
        var ja = el('button', { 'class': 'loeschen-link loeschen-link--ja', type: 'button',
          text: 'Ja, alle löschen',
          onclick: function () {
            LAEUFE.length = 0;
            zustand.lauf = null;
            gehe('wahl');
          } });
        loeschZeile.appendChild(el('p', { 'class': 'laeufe-loeschen-frage' }, [
          el('span', { text: 'Wirklich alle ' + LAEUFE.length
            + (LAEUFE.length === 1 ? ' Durchlauf' : ' Durchläufe')
            + ' löschen? Das lässt sich nicht rückgängig machen. ' }),
          ja,
          el('span', { 'class': 'loeschen-trenner', text: ' · ' }),
          el('button', { 'class': 'loeschen-link', type: 'button', text: 'Abbrechen',
            onclick: function () { zeichneLoeschen(false); } })
        ]));
        ja.focus();
      };
      zeichneLoeschen(false);
      buehne.appendChild(loeschZeile);
    }

    if (!wahlen.length) {
      hinweis.textContent = 'Keine Wahl-Datensätze gefunden (data/wahlen.js).';
    }
  };

  /* Gespielte Durchgaenge dieser Sitzung. Sie liegen im Speicher und
   * zusaetzlich im Sitzungsspeicher des Tabs (SITZUNG, unten). Jeder
   * Durchgang haelt Verweise auf seine eigenen Objekte; starteWahl legt fuer
   * den naechsten Durchgang durchweg neue an, deshalb bleibt ein gemerkter
   * Durchgang unveraendert. */
  var LAEUFE = [];

  var LAUF_FELDER = ['datensatz', 'gewichte', 'duelle', 'duellAntworten', 'kandidaten',
    'halte', 'halteGezeigt', 'wetten', 'finaleGebaut', 'umfang', 'tipp', 'ausschluss',
    'zuordnung', 'turnier'];

  function merkeLauf(erg) {
    var kopie = {};
    LAUF_FELDER.forEach(function (f) { kopie[f] = zustand[f]; });
    var lauf = {
      wahlId: zustand.datensatz.id,
      zeit: new Date(),
      gespielt: erg.gespielt,
      zustand: kopie,
      ranking: erg.ranking.map(function (r) { return { parteiId: r.parteiId, prozent: r.prozent }; })
    };
    LAEUFE.push(lauf);
    zustand.lauf = lauf;
  }

  function oeffneLauf(lauf) {
    LAUF_FELDER.forEach(function (f) { zustand[f] = lauf.zustand[f]; });
    zustand.ergebnis = null;
    zustand.duellIndex = Math.max(0, zustand.duelle.length - 1);
    zustand.aufgedeckt = true;
    zustand.stufe = 2;
    zustand.lauf = lauf;
    gehe('ergebnis');
  }

  /* ---------- Sitzungsspeicher ----------
   * Ein Durchgang ueberlebt Neuladen und Wegnavigieren im selben Tab. Vorher
   * lebte er nur im Speicher: Auf dem Telefon fuehrte ein Abstecher zur Quelle
   * mit anschliessendem Neuladen zum Verlust des ganzen Laufs (Nutzermeldung).
   *
   * Bewusst sessionStorage, nicht localStorage: gilt nur fuer diesen Tab,
   * bleibt auf dem Geraet und ist weg, sobald der Tab geschlossen wird. Auf
   * einem geteilten Rechner liegt damit keine politische Neigung auf Dauer
   * herum.
   *
   * Gespeichert werden Verweise, nicht Kopien: Aussagen, Parteien, Themen
   * und der Datensatz selbst werden als Pfad in ihren Datensatz abgelegt
   * ({$r: "wahlId|themen.0.fragen.1.aussagen.2"}) und beim Laden wieder
   * durch dieselben Objekte ersetzt. Sonst waeren die Duelle Kopien, und
   * Vergleiche per Identitaet (Sieger === Aussage) liefen ins Leere. */
  var SITZUNG = 's47-sitzung';
  var SITZUNG_FELDER = LAUF_FELDER.concat(['schritt', 'duellIndex', 'stufe',
    'aufgedeckt', 'wortlaut']);

  function sitzungsSpeicher() {
    try { return global.sessionStorage || null; } catch (e) { return null; }
  }

  /* Objekt -> Pfad fuer alle Objekte eines Datensatzes. */
  function pfadVerzeichnis(datensatze) {
    var verz = new Map();
    function lauf(wert, wahlId, pfad) {
      if (!wert || typeof wert !== 'object' || verz.has(wert)) { return; }
      verz.set(wert, wahlId + '|' + pfad);
      Object.keys(wert).forEach(function (k) {
        lauf(wert[k], wahlId, pfad ? pfad + '.' + k : k);
      });
    }
    datensatze.forEach(function (d) { lauf(d, d.id, ''); });
    return verz;
  }

  function sichere() {
    var speicher = sitzungsSpeicher();
    if (!speicher) { return; }
    try {
      var datensatze = [];
      LAEUFE.forEach(function (l) {
        if (datensatze.indexOf(l.zustand.datensatz) < 0) { datensatze.push(l.zustand.datensatz); }
      });
      var aktiv = null;
      if (zustand.datensatz && zustand.schritt !== 'wahl') {
        if (datensatze.indexOf(zustand.datensatz) < 0) { datensatze.push(zustand.datensatz); }
        aktiv = { lauf: LAEUFE.indexOf(zustand.lauf) };
        SITZUNG_FELDER.forEach(function (f) { aktiv[f] = zustand[f]; });
      }
      if (!LAEUFE.length && !aktiv) { speicher.removeItem(SITZUNG); return; }
      var verz = pfadVerzeichnis(datensatze);
      speicher.setItem(SITZUNG, JSON.stringify({ version: 1, laeufe: LAEUFE, aktiv: aktiv },
        function (k, v) {
          if (v && typeof v === 'object' && verz.has(v)) { return { $r: verz.get(v) }; }
          return v;
        }));
    } catch (e) {
      /* Voll oder gesperrt (privates Fenster): dann eben nur im Speicher. */
      if (global.console) { console.warn('Sitzung nicht gesichert:', e && e.message); }
    }
  }

  /* Stellt den gesicherten Stand wieder her. Ruft fertig(true) auf, wenn
   * eine Ansicht gezeigt wurde, sonst fertig(false). */
  function stelleWiederHer(fertig) {
    var speicher = sitzungsSpeicher(), roh = null;
    try { roh = speicher && speicher.getItem(SITZUNG); } catch (e) { roh = null; }
    if (!roh) { fertig(false); return; }
    var daten;
    try { daten = JSON.parse(roh); } catch (e) { fertig(false); return; }
    if (!daten || daten.version !== 1) { fertig(false); return; }

    var ids = [];
    (function sammle(w) {
      if (!w || typeof w !== 'object') { return; }
      if (typeof w.$r === 'string') {
        var id = w.$r.split('|')[0];
        if (ids.indexOf(id) < 0) { ids.push(id); }
        return;
      }
      Object.keys(w).forEach(function (k) { sammle(w[k]); });
    })(daten);

    var geladen = {}, offen = ids.length, gescheitert = false;
    function weiter() {
      if (gescheitert) { fertig(false); return; }
      try {
        wende(daten, geladen);
      } catch (e) {
        if (global.console) { console.warn('Sitzung nicht wiederhergestellt:', e && e.message); }
        try { speicher.removeItem(SITZUNG); } catch (x) { /* egal */ }
        fertig(false);
        return;
      }
      fertig(true);
    }
    if (!offen) { weiter(); return; }
    ids.forEach(function (id) {
      D.lade(id, function (fehler, d) {
        if (fehler || !d) { gescheitert = true; } else { geladen[id] = d; }
        if (--offen === 0) { weiter(); }
      });
    });
  }

  function wende(daten, geladen) {
    function aufloesen(ref) {
      var teile = ref.split('|');
      var ziel = geladen[teile[0]];
      if (!ziel) { throw new Error('Datensatz fehlt: ' + teile[0]); }
      (teile[1] ? teile[1].split('.') : []).forEach(function (k) {
        if (ziel === null || ziel === undefined) { throw new Error('Pfad ungueltig: ' + ref); }
        ziel = ziel[k];
      });
      if (ziel === undefined) { throw new Error('Pfad ungueltig: ' + ref); }
      return ziel;
    }
    function belebe(w) {
      if (!w || typeof w !== 'object') { return w; }
      if (typeof w.$r === 'string') { return aufloesen(w.$r); }
      Object.keys(w).forEach(function (k) { w[k] = belebe(w[k]); });
      return w;
    }
    var laeufe = belebe(daten.laeufe || []);
    var aktiv = belebe(daten.aktiv);
    laeufe.forEach(function (l) { l.zeit = new Date(l.zeit); });

    LAEUFE.length = 0;
    laeufe.forEach(function (l) { LAEUFE.push(l); });
    if (!aktiv) { gehe('wahl'); return; }

    SITZUNG_FELDER.forEach(function (f) {
      if (Object.prototype.hasOwnProperty.call(aktiv, f)) { zustand[f] = aktiv[f]; }
    });
    zustand.ergebnis = null;
    zustand.lauf = aktiv.lauf >= 0 ? LAEUFE[aktiv.lauf] || null : null;
    /* Der offene Durchgang und sein gemerkter Lauf teilen sich die Objekte -
     * wie vor dem Neuladen. */
    if (zustand.lauf) {
      LAUF_FELDER.forEach(function (f) { zustand.lauf.zustand[f] = zustand[f]; });
    }
    gehe(ANSICHTEN[zustand.schritt] ? zustand.schritt : 'wahl');
  }

  /* Neben jedem Ansichtswechsel (gehe) auch beim Verlassen sichern: eine
   * Antwort im Duell wechselt nicht immer die Ansicht. */
  global.addEventListener('pagehide', sichere);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { sichere(); }
  });

  function starteWahl(datensatz) {
    zustand.turnier = null;
    zustand.lauf = null;
    zustand.datensatz = datensatz;
    zustand.gewichte = {};
    zustand.duelle = [];
    zustand.duellAntworten = {};
    zustand.duellIndex = 0;
    zustand.kandidaten = global.S47_SPIEL.loseKandidaten(datensatz);
    zustand.halte = [];
    zustand.halteGezeigt = {};
    zustand.wetten = {};
    zustand.finaleGebaut = false;
    zustand.ergebnis = null;
    zustand.tipp = null;
    zustand.ausschluss = null;
    zustand.zuordnung = null;
    zustand.stufe = 0;
    zustand.aufgedeckt = false;
    zustand.umfang = 'normal';
    zustand.gewichte = DU.startGewichte(datensatz);
    gehe('gewichtung');
  }

  /* ---------- 2. Themen gewichten ---------- */

  /* ---------- 2. Laenge und Schwerpunkte ----------
   * Vorgaenger war ein Punktebudget: 90 Punkte in Fuenferschritten auf die
   * Themen verteilen, bis die Kasse stimmte - mit Plus- und Minusknoepfen je
   * Zeile, einer Restanzeige und der Zusatzfrage "Umfang" daneben. Der
   * Nutzer nannte das zu Recht unfertig: Es war eine Rechenaufgabe, deren
   * Ergebnis niemand vorhersagen konnte, und das eigentliche Anliegen
   * ("diese zwei Themen sind mir wichtig") liess sich nur ueber Umwege
   * ausdruecken.
   *
   * Jetzt zwei Fragen, beide in Sekunden zu beantworten:
   *   1. Wie lange? - drei Karten mit echten Zahlen (Duelle und Minuten).
   *   2. Welche Themen? - angeklickt wird, was abgefragt werden soll; davon
   *      hoechstens drei als Schwerpunkt.
   *
   * Alle Themen sind vorgewaehlt (DU.startGewichte); abgewaehlt wird, was
   * einen nicht angeht. Die Liste startete zwischenzeitlich leer, das hat
   * der Nutzer zurueckgenommen. Die Laenge haelt die Obergrenze je Umfang,
   * und die Folge jedes Klicks steht als Zahl darunter.
   *
   * Kein Restbetrag, keine Schrittweite, keine Zahl ohne Bedeutung. Die
   * Zahlen stehen trotzdem da, nur als Folge statt als Eingabe: je Thema die
   * Duelle, unten der Durchgang insgesamt.
   */
  ANSICHTEN.gewichtung = function () {
    var d = zustand.datensatz;
    if (!zustand.gewichte || !Object.keys(zustand.gewichte).length) {
      zustand.gewichte = DU.startGewichte(d);
    }

    var zeilen = [];
    var hinweis = el('p', { 'class': 'hinweis' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Weiter' });
    var bilanz = el('p', { 'class': 'bilanz' });

    function schwerpunkte() {
      var n = 0;
      d.themen.forEach(function (t) {
        if (zustand.gewichte[t.id] === DU.GEWICHT_SCHWERPUNKT) { n++; }
      });
      return n;
    }
    /* Gemessene Zeit statt geschaetzter: Ein Testnutzer brauchte fuer 45
     * Duelle 25 Minuten. Die alte Formel (n / 4.5) rechnete mit 13 Sekunden
     * je Duell und liess das Finale ganz weg - sie sagte 9 Minuten an, wo 25
     * wurden. Jetzt: Rahmen fuer Tipp, Zwischenstaende, Zuordnung und
     * Ergebnis plus SEKUNDEN_JE_DUELL, Finale inbegriffen.
     *
     * SEKUNDEN_JE_DUELL haengt an der Textlaenge: 30 Sekunden bei den langen
     * Fassungen (gemessen), 22 bei den gekuerzten. Wer die Aussagen kuerzt
     * oder verlaengert, muss diese Zahl mitfuehren - sonst sagt die App
     * wieder eine Zeit an, die niemand einhaelt. */
    var RAHMEN_MINUTEN = 3, SEKUNDEN_JE_DUELL = 22;
    function minuten(n) {
      var roh = RAHMEN_MINUTEN + (n + global.S47_SPIEL.FINALE_DUELLE) * SEKUNDEN_JE_DUELL / 60;
      return Math.max(5, Math.round(roh));
    }
    function themenAn() {
      var n = 0;
      d.themen.forEach(function (t) { if (zustand.gewichte[t.id] > 0) { n++; } });
      return n;
    }

    /* ---- Frage 1: Wie lange? ---- */
    var laengeKnoepfe = [];
    var laengeReihe = el('div', { 'class': 'laenge' });
    DU.UMFAENGE.forEach(function (u) {
      var zahl = el('span', { 'class': 'laenge-zahl' });
      var zeit = el('span', { 'class': 'laenge-zeit' });
      var k = el('button', { 'class': 'laenge-karte', type: 'button' }, [
        el('span', { 'class': 'laenge-name', text: u.name }),
        zahl,
        zeit
      ]);
      k.addEventListener('click', function () {
        zustand.umfang = u.id;
        zeichneAlles();
      });
      laengeKnoepfe.push({ id: u.id, el: k, zahl: zahl, zeit: zeit });
      laengeReihe.appendChild(k);
    });

    /* ---- Frage 2: Schwerpunkte ---- */
    var liste = el('div', { 'class': 'themen-wahl' });
    d.themen.forEach(function (t) {
      var stand = el('span', { 'class': 'thema-stand' });
      var haupt = el('button', { 'class': 'thema-haupt', type: 'button' }, [
        el('span', { 'class': 'thema-titel', text: t.titel }),
        t.beschreibung ? el('span', { 'class': 'thema-text', text: t.beschreibung }) : null,
        stand
      ]);
      var ausKnopf = el('button', { 'class': 'thema-aus', type: 'button' });
      var zeile = el('div', { 'class': 'thema-zeile' }, [haupt, ausKnopf]);

      /* Zeile an/aus, Stern daneben macht daraus einen Schwerpunkt. Vorher
       * war es umgekehrt (Zeile = Schwerpunkt, Kreuz = abwaehlen); das setzte
       * voraus, dass ohnehin alles an ist. */
      haupt.addEventListener('click', function () {
        zustand.gewichte[t.id] = zustand.gewichte[t.id] > 0 ? 0 : DU.GEWICHT_NORMAL;
        hinweis.textContent = '';
        zeichneAlles();
      });
      ausKnopf.addEventListener('click', function () {
        var g = zustand.gewichte[t.id];
        if (g === DU.GEWICHT_SCHWERPUNKT) { zustand.gewichte[t.id] = DU.GEWICHT_NORMAL; }
        else if (schwerpunkte() >= DU.SCHWERPUNKT_MAX) {
          hinweis.textContent = 'Höchstens ' + DU.SCHWERPUNKT_MAX
            + ' Schwerpunkte. Nehmen Sie zuerst einen weg.';
          return;
        } else { zustand.gewichte[t.id] = DU.GEWICHT_SCHWERPUNKT; }
        hinweis.textContent = '';
        zeichneAlles();
      });

      zeilen.push(function (verteilung) {
        var g = zustand.gewichte[t.id];
        var n = verteilung.proThema[t.id] || 0;
        var schwer = g === DU.GEWICHT_SCHWERPUNKT;
        zeile.classList.toggle('thema-zeile--schwer', schwer);
        zeile.classList.toggle('thema-zeile--aus', g === 0);
        stand.textContent = g === 0
          ? 'Nicht gewählt'
          : (schwer ? 'Schwerpunkt · ' : '') + n + (n === 1 ? ' Duell' : ' Duelle');
        ausKnopf.textContent = schwer ? '■' : '□';
        ausKnopf.disabled = g === 0;
        ausKnopf.setAttribute('title', schwer
          ? 'Schwerpunkt aufheben' : t.titel + ' als Schwerpunkt');
        haupt.setAttribute('title', g === 0
          ? t.titel + ' abfragen' : t.titel + ' nicht abfragen');
      });
      liste.appendChild(zeile);
    });

    function zeichneAlles() {
      var verteilung = DU.verteile(d, zustand.gewichte, zustand.umfang);
      zeilen.forEach(function (f) { f(verteilung); });
      laengeKnoepfe.forEach(function (x) {
        var probe = DU.verteile(d, zustand.gewichte, x.id);
        x.el.classList.toggle('laenge-karte--aktiv', x.id === zustand.umfang);
        x.zahl.textContent = probe.gesamt
          ? (probe.gesamt + global.S47_SPIEL.FINALE_DUELLE) + ' Duelle' : 'Themen wählen';
        x.zeit.textContent = probe.gesamt
          ? 'ungefähr ' + minuten(probe.gesamt) + ' Minuten' : '';
      });
      var s = schwerpunkte();
      var an = themenAn();
      bilanz.textContent = an < MINDEST_THEMEN
        ? (an === 0 ? 'Noch kein Thema gewählt.' : an + ' von mindestens '
           + MINDEST_THEMEN + ' Themen gewählt.')
        : an + (an === 1 ? ' Thema · ' : ' Themen · ')
          + (verteilung.gesamt + global.S47_SPIEL.FINALE_DUELLE) + ' Duelle, ungefähr '
          + minuten(verteilung.gesamt) + ' Minuten · '
          + (s === 0 ? 'keine Schwerpunkte'
             : s === 1 ? 'ein Schwerpunkt' : s + ' Schwerpunkte')
          + '. Schwerpunkte verlängern den Durchgang nicht, sie verschieben nur, '
          + 'wo genauer gefragt wird.';
      weiter.disabled = an < MINDEST_THEMEN;
    }

    weiter.addEventListener('click', function () {
      if (themenAn() < MINDEST_THEMEN) {
        hinweis.textContent = 'Bitte mindestens ' + MINDEST_THEMEN
          + ' Themen wählen – aus weniger lässt sich kein Bild ableiten.';
        return;
      }
      zustand.duelle = DU.plan(d, zustand.gewichte, null, zustand.umfang);
      if (!zustand.duelle.length) {
        hinweis.textContent = 'Bitte mindestens ein Thema abfragen lassen.';
        return;
      }
      zustand.duellIndex = 0;
      zustand.duellAntworten = {};
      zustand.halte = global.S47_SPIEL.haltepunkte(zustand.duelle.length);
      zustand.halteGezeigt = {};
      zustand.finaleGebaut = false;
      gehe('tipp');
    });

    zeichneAlles();

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Worauf kommt es Ihnen an?' }),
      el('p', { 'class': 'fliess', text: 'Zwei Fragen, dann geht es los. '
        + 'Die Themen stammen aus den Programmen zu: ' + d.name + '.' }),
      el('p', { 'class': 'dachzeile', text: 'Wie lange möchten Sie spielen?' }),
      laengeReihe,
      el('p', { 'class': 'dachzeile', text: 'Welche Themen?' }),
      el('p', { 'class': 'fliess fliess--klein', text: 'Alle Themen sind gewählt. Tippen Sie '
        + 'ein Thema an, um es abzuwählen – mindestens ' + MINDEST_THEMEN + ' bleiben. '
        + 'Je weniger Themen, desto kürzer der Durchgang. Mit □ machen Sie bis zu '
        + DU.SCHWERPUNKT_MAX + ' davon zum Schwerpunkt; dort wird doppelt so oft '
        + 'gefragt, ohne dass es länger dauert.' }),
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

    /* Zwei Erwartungen, nicht eine. Die zweite ist die aussagekräftigere:
     * Wen man ausschließt, weiß man meist genauer als, wen man wählt - der
     * Ausschluss ist die festere Überzeugung und hängt am Etikett, nicht am
     * Programm. Genau deshalb ist er der schärfere Prüfstein für die These.
     * Wenn ausgerechnet dort Sätze gewonnen haben, sagt das mehr als ein
     * verfehlter Tipp auf die Spitze. */
    function baueListe(feld) {
      var liste = el('div', { 'class': 'tipp-liste' });
      var knoepfe = [];
      d.parteien.forEach(function (p) {
        var k = el('button', { 'class': 'tipp-knopf', type: 'button', text: p.name });
        k.addEventListener('click', function () { zustand[feld] = p.id; zeichne(); });
        knoepfe.push({ id: p.id, el: k });
        liste.appendChild(k);
      });
      var keiner = el('button', {
        'class': 'tipp-knopf tipp-knopf--offen', type: 'button',
        text: 'Weiß ich nicht'
      });
      keiner.addEventListener('click', function () { zustand[feld] = '_offen'; zeichne(); });
      knoepfe.push({ id: '_offen', el: keiner });
      liste.appendChild(keiner);
      return { wurzel: liste, knoepfe: knoepfe, feld: feld };
    }

    var oben = baueListe('tipp');
    var unten = baueListe('ausschluss');

    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Los geht’s' });

    function zeichne() {
      [oben, unten].forEach(function (l) {
        /* Dieselbe Partei oben und unten waere ein Widerspruch. Sie wird in
         * der jeweils anderen Liste durchgestrichen statt gesperrt: Wer sie
         * trotzdem antippt, verschiebt seine Wahl, statt gegen einen toten
         * Knopf zu klicken. */
        var andere = zustand[l.feld === 'tipp' ? 'ausschluss' : 'tipp'];
        l.knoepfe.forEach(function (k) {
          k.el.classList.toggle('tipp-knopf--aktiv', zustand[l.feld] === k.id);
          k.el.classList.toggle('tipp-knopf--weg',
            k.id !== '_offen' && k.id === andere && zustand[l.feld] !== k.id);
        });
      });
      weiter.disabled = !zustand.tipp || !zustand.ausschluss;
    }

    /* Wer oben und unten dieselbe Partei setzt, hebt die andere Angabe auf -
     * anders bliebe ein Widerspruch stehen, den das Ergebnis nicht deuten
     * kann. */
    [oben, unten].forEach(function (l) {
      l.wurzel.addEventListener('click', function () {
        var gegen = l.feld === 'tipp' ? 'ausschluss' : 'tipp';
        if (zustand[l.feld] !== '_offen' && zustand[l.feld] === zustand[gegen]) {
          zustand[gegen] = null;
          zeichne();
        }
      });
    });
    zeichne();

    weiter.addEventListener('click', function () {
      zustand.duellIndex = 0;
      gehe('spiel');
    });

    buehne.appendChild(el('section', {}, [
      el('h1', { text: 'Und, was erwarten Sie?' }),
      el('p', { 'class': 'fliess', text: 'Bevor Sie den ersten Satz lesen: zwei Erwartungen. Beide bleiben in diesem Browser und werden erst nach der Aufdeckung wieder gezeigt - dann können Sie sie mit dem Ergebnis vergleichen.' }),
      el('p', { 'class': 'tipp-frage', text: 'Welche Partei wird am Ende oben stehen?' }),
      oben.wurzel,
      el('p', { 'class': 'tipp-frage', text: 'Und welche kommt für Sie am wenigsten in Frage?' }),
      unten.wurzel,
      el('p', { 'class': 'fliess fliess--klein', text: 'Beide Angaben beeinflussen die Auswertung nicht. Sie bleiben in diesem Browser-Tab und werden nirgends übertragen.' }),
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

  /* Das Originalzitat gehört zum Beleg: die vereinfachte Fassung ist eine
   * Behauptung, solange man den Wortlaut nicht danebenlegen kann. Im Duell
   * hat es keinen Platz - zwei Programmabsätze im Original nebeneinander
   * sprengen jedes Telefon, und ihre unterschiedliche Länge wäre selbst ein
   * Erkennungsmerkmal. Hier im Anhang, nach der Aufdeckung, ist beides kein
   * Problem mehr.
   *
   * Aufgeklappt wird einzeln und ohne Zustand über die Sitzung hinaus: Wer
   * ein Zitat sehen will, will meistens genau dieses eine. */
  function zitatSchalter(aussage) {
    if (!aussage.original || aussage.original === aussage.kurz) { return null; }
    var zitat = el('p', { 'class': 'wert-zitat', text: '„' + aussage.original + '“' });
    zitat.hidden = true;
    var schalter = el('button', { 'class': 'link link--zitat', text: 'Wortlaut' });
    schalter.addEventListener('click', function () {
      zitat.hidden = !zitat.hidden;
      schalter.textContent = zitat.hidden ? 'Wortlaut' : 'Wortlaut ausblenden';
    });
    return el('div', { 'class': 'wert-zitat-block' }, [schalter, zitat]);
  }



  /* ---------- Turnier nach dem Ergebnis ----------
   * Nur die beiden Finalisten, beide beginnen bei null. Gefragt wird jede
   * Unterfrage, zu der sich beide aeussern. Die Saetze bleiben maskiert und
   * die Seiten zufaellig - gewaehlt wird wie im Spiel blind, erst der Stand
   * danach zeigt, wohin der Punkt ging. Das Gesamtergebnis bleibt
   * unberuehrt: Das Turnier ist ein eigener Vergleich, keine Nachwertung. */
  ANSICHTEN.turnier = function () {
    var d = zustand.datensatz;
    var t = zustand.turnier;
    if (!t) { gehe('ergebnis'); return; }
    var pa = D.partei(d, t.a), pb = D.partei(d, t.b);

    var stand = {};
    stand[t.a] = 0;
    stand[t.b] = 0;
    Object.keys(t.antworten).forEach(function (k) {
      var duell = t.duelle[k];
      [duell.links, duell.rechts].forEach(function (x) {
        if (x.id === t.antworten[k]) { stand[x.parteiId]++; }
      });
    });

    var abschnitt = el('section', { 'class': 'turnier' }, [
      el('p', { 'class': 'dachzeile', text: 'Turnier' }),
      el('h1', { text: pa.name + ' gegen ' + pb.name }),
      el('p', { 'class': 'turnier-stand' }, [
        el('span', { 'class': 'turnier-name', text: pa.name }),
        el('span', { 'class': 'turnier-zahl', text: stand[t.a] + ' : ' + stand[t.b] }),
        el('span', { 'class': 'turnier-name', text: pb.name })
      ]),
      el('p', { 'class': 'fliess fliess--klein turnier-hinweis',
        text: 'Beide beginnen bei null, nur diese zwei. Die Sätze sind wieder ohne Absender, die Seiten zufällig. Ihr Ergebnis bleibt davon unberührt.' })
    ]);

    var duell = t.duelle[t.index];
    if (duell) {
      function waehle(aussage) {
        if (aussage) { t.antworten[t.index] = aussage.id; }
        t.index++;
        gehe('turnier');
      }
      var karten = [duell.links, duell.rechts].map(function (a, i) {
        return el('button', {
          'class': 'duell-karte duell-karte--' + (i ? 'rechts' : 'links'), type: 'button',
          onclick: function () { waehle(a); }
        }, [
          el('span', { 'class': 'duell-nr', text: String(i + 1) }),
          el('p', { 'class': 'duell-satz', text: D.anonymisiere(d, a.kurz) })
        ]);
      });
      abschnitt.appendChild(el('p', { 'class': 'turnier-zaehler',
        text: 'Frage ' + (t.index + 1) + ' von ' + t.duelle.length + ' · ' + duell.themaTitel }));
      var frageAbsatz = el('p', { 'class': 'spiel-frage' });
      global.S47_BEGRIFF.setze(frageAbsatz, duell.frageText, d.begriffe);
      abschnitt.appendChild(frageAbsatz);
      abschnitt.appendChild(el('div', { 'class': 'duell-buehne' }, [
        karten[0],
        el('div', { 'class': 'duell-gegen' }, [el('span', { 'class': 'duell-gegen-text', text: 'oder' })]),
        karten[1]
      ]));
      abschnitt.appendChild(el('div', { 'class': 'navi' }, [
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Zurück zum Ergebnis',
          onclick: function () { gehe('ergebnis'); } }),
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Überspringen',
          title: 'Überspringen – zählt für niemanden', onclick: function () { waehle(null); } })
      ]));
      /* Dieselben Tasten wie im Duell; gehe() nimmt den Hoerer beim
       * naechsten Ansichtswechsel wieder ab. */
      tastenHoerer = function (e) {
        if (e.key === '1' || e.key === 'ArrowLeft') { e.preventDefault(); waehle(duell.links); }
        else if (e.key === '2' || e.key === 'ArrowRight') { e.preventDefault(); waehle(duell.rechts); }
      };
      document.addEventListener('keydown', tastenHoerer);
    } else {
      var gespielt = Object.keys(t.antworten).length;
      var vorn = stand[t.a] === stand[t.b] ? null : (stand[t.a] > stand[t.b] ? pa : pb);
      abschnitt.appendChild(el('div', { 'class': 'karte' }, [
        el('p', { 'class': 'tipp-zeile', text: 'Turnier beendet' }),
        el('p', { 'class': 'fliess', text: gespielt === 0
          ? 'Sie haben alle Fragen übersprungen.'
          : vorn
            ? 'In ' + gespielt + ' direkten Vergleichen haben Sie ' + Math.max(stand[t.a], stand[t.b])
              + '-mal den Satz von ' + vorn.name + ' gewählt.'
            : 'In ' + gespielt + ' direkten Vergleichen steht es unentschieden.' }),
        el('div', { 'class': 'navi' }, [
          el('button', { 'class': 'knopf knopf--haupt', text: 'Zurück zum Ergebnis',
            onclick: function () { gehe('ergebnis'); } })
        ])
      ]));
    }
    buehne.appendChild(abschnitt);
  };

  ANSICHTEN.ergebnis = function () {
    var d = zustand.datensatz;
    var erg = DU.werte(d, zustand.duelle, zustand.duellAntworten, zustand.gewichte);
    zustand.ergebnis = erg;

    var abschnitt = el('section', {}, [
      el('h1', { text: 'Ihr Ergebnis' }),
      el('p', { 'class': 'fliess', text: d.name + ' am ' + datumDeutsch(d.wahltag) + '.' })
    ]);

    /* Kein eigener Zwischenschritt "N Duelle ausgewertet - Aufdecken /
     * Zurueck zu den Duellen" mehr: Aufgedeckt wird bereits mit dem Knopf in
     * "Wer war wer?", und wer alle Fragen beantwortet hat, will nicht zurueck
     * (Nutzer: "der Sinn dieser Seite erschliesst sich mir nicht"). */
    if (!zustand.aufgedeckt) {
      zustand.aufgedeckt = true;
      zustand.stufe = Math.max(1, zustand.stufe || 0);
      merkeLauf(erg);
    }
    /* Ein spaeter gespieltes Turnier gehoert zum gemerkten Durchgang. */
    if (zustand.lauf) { zustand.lauf.zustand.turnier = zustand.turnier; }

    /* Gesamt-Ranking */
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

        /* Prozentwert und Finale messen Verschiedenes, und nebeneinander
         * gestellt lasen sie sich wie ein Widerspruch (Nutzer: "Finale ging
         * an BSW - warum liegt die Linke so weit vorn?"). Deshalb steht der
         * Stand vor dem Finale daneben, und es wird ausgesprochen, dass die
         * Finalduelle nur ein kleiner Teil aller gewerteten Duelle sind. */
        var ab = -1;
        zustand.duelle.forEach(function (duell, k) { if (duell.finale && ab < 0) { ab = k; } });
        var vorher = ab > 0 ? DU.werte(d, zustand.duelle.slice(0, ab),
          zustand.duellAntworten, zustand.gewichte) : null;
        function prozentVon(auswertung, pid) {
          var r = auswertung && auswertung.ranking.filter(function (x) { return x.parteiId === pid; })[0];
          return r ? Math.round(r.prozent) + ' %' : '–';
        }
        var nameA = D.partei(d, sortiert[0]).name;
        var nameB = sortiert[1] ? D.partei(d, sortiert[1]).name : '';
        var saetze = [
          'Im Finale haben Sie ' + finaleStand.siege[sortiert[0]] + '-mal ' + nameA
            + (nameB ? ' und ' + finaleStand.siege[sortiert[1]] + '-mal ' + nameB : '') + ' gewählt'
            + (eindeutig ? ' – der direkte Vergleich ging an ' + nameA + '.'
              : ' – der direkte Vergleich blieb unentschieden.')
        ];
        if (eindeutig && sortiert[0] !== spitze[0].parteiId) {
          saetze.push('Über alle Themen liegt trotzdem ' + D.partei(d, spitze[0].parteiId).name
            + ' vorn. Das ist kein Widerspruch: Der Prozentwert zählt alle '
            + erg.gespielt + ' Duelle, die ' + finaleStand.gespielt
            + ' Finalduelle gehen darin ein wie jedes andere.');
        }
        if (vorher && nameB) {
          saetze.push('Stand vor dem Finale: ' + nameA + ' ' + prozentVon(vorher, sortiert[0])
            + ', ' + nameB + ' ' + prozentVon(vorher, sortiert[1])
            + '. Danach: ' + prozentVon(erg, sortiert[0]) + ' und ' + prozentVon(erg, sortiert[1]) + '.');
        }
        karte.appendChild(el('p', { 'class': 'fliess fliess--klein', style: 'margin:.9rem 0 0',
          text: saetze.join(' ') }));

        /* Wer es genauer wissen will: ein eigenes Turnier nur zwischen den
         * beiden, mit allen Unterfragen, zu denen sich beide aeussern. */
        if (nameB) {
          var turnierDuelle = DU.finale(d, sortiert[0], sortiert[1], [], 999);
          if (turnierDuelle.length) {
            /* Ein gespieltes Turnier steht neben dem Knopf - dort, wo man
             * nach "Zurueck zum Ergebnis" wieder landet. */
            var tu = zustand.turnier;
            var turnierStand = null;
            if (tu && ((tu.a === sortiert[0] && tu.b === sortiert[1]) || (tu.a === sortiert[1] && tu.b === sortiert[0]))) {
              var st = {};
              st[sortiert[0]] = 0;
              st[sortiert[1]] = 0;
              var gezaehlt = 0;
              Object.keys(tu.antworten).forEach(function (k) {
                gezaehlt++;
                [tu.duelle[k].links, tu.duelle[k].rechts].forEach(function (x) {
                  if (x.id === tu.antworten[k]) { st[x.parteiId]++; }
                });
              });
              if (gezaehlt) {
                turnierStand = el('p', { 'class': 'turnier-ergebnis' }, [
                  el('span', { 'class': 'turnier-ergebnis-kopf',
                    text: tu.index >= tu.duelle.length ? 'Ihr Turnier' : 'Turnier, unterbrochen' }),
                  el('span', { 'class': 'turnier-ergebnis-stand',
                    text: nameA + ' ' + st[sortiert[0]] + ' : ' + st[sortiert[1]] + ' ' + nameB }),
                  el('span', { 'class': 'turnier-ergebnis-fuss',
                    text: gezaehlt + (gezaehlt === 1 ? ' direkter Vergleich' : ' direkte Vergleiche') })
                ]);
              }
            }
            karte.appendChild(el('div', { 'class': 'turnier-zeile' }, [
              el('button', {
                'class': 'knopf knopf--still turnier-start', type: 'button',
                text: (turnierStand ? 'Neues Turnier: ' : 'Turnier: ') + nameA + ' gegen ' + nameB
                  + ' (' + turnierDuelle.length + ' Fragen)',
                onclick: function () {
                  zustand.turnier = { a: sortiert[0], b: sortiert[1],
                    duelle: turnierDuelle, antworten: {}, index: 0 };
                  gehe('turnier');
                }
              }),
              turnierStand
            ]));
          }
        }
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
      var wKarte = el('div', { 'class': 'karte karte--tipp karte--wette' }, [
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
        /* Aufklappbar: welche Saetze bei der Zuordnung unter diesem
         * Buchstaben standen - dieselben Belege wie in der Zuordnungsansicht.
         * Nach der Aufdeckung, Parteinamen sind hier erlaubt. */
        var belege = (auf.belege || []).map(function (a) {
          return el('li', { 'class': 'aufloesung-beleg', text: a.kurz });
        });
        aufl.appendChild(el('details', {
          'class': 'aufloesung-zeile' + (ok ? ' aufloesung-zeile--gut' : '')
        }, [
          el('summary', { 'class': 'aufloesung-marke' }, [
            el('span', { 'class': 'aufloesung-buchstabe', text: auf.marke }),
            el('span', { text: geraten
              ? (ok ? ' war ' + richtig.name + '. Richtig.'
                    : ' war ' + richtig.name + ' – Sie hatten ' + D.partei(d, geraten).name + '.')
              : ' war ' + richtig.name + '. Nicht zugeordnet.' })
          ]),
          el('div', { 'class': 'aufloesung-belege' }, belege.length ? [
            el('p', { 'class': 'aufloesung-belege-kopf', text: auf.gewaehlt
              ? 'Diese Sätze standen bei ' + auf.marke + ' – Sie hatten sie gewählt:'
              : 'Diese Sätze standen bei ' + auf.marke + ' – Sie hatten sie abgelehnt:' }),
            el('ul', { 'class': 'aufloesung-belegliste' }, belege)
          ] : [
            el('p', { 'class': 'aufloesung-belege-kopf', text: 'Zu ' + auf.marke + ' stand kein Satz zur Auswahl.' })
          ])
        ]));
      });
      zKarte.appendChild(aufl);
      trefferKarte = zKarte;
    }

    /* Was Sie nicht erwartet haben.
     *
     * Hier landet die These persönlich: Auch das Programm, das der Nutzer
     * vorab ausgeschlossen hat, hat Sätze, denen er zugestimmt hat - er
     * wusste nur nicht, von wem sie waren. Das ist eine andere Auskunft als
     * ein Prozentwert, und es ist die einzige Stelle, an der eigene
     * Zustimmung und abgelehntes Etikett direkt nebeneinanderstehen.
     *
     * Gezeigt wird die AUSGESCHLOSSENE Partei, ersatzweise die
     * letztplatzierte. Der Ausschluss ist die härtere Vorannahme: er kommt
     * vom Nutzer selbst, steht vor dem ersten Satz fest und hängt am
     * Etikett. Das Schlusslicht der Wertung dagegen ist ein Ergebnis - es
     * gegen den Nutzer zu wenden, wäre ein Zirkelschluss ("Sie mögen es
     * nicht, weil Sie es nicht gewählt haben").
     *
     * Zu jedem Satz steht, WOGEGEN er gewonnen hat. Ohne den Gegner ist
     * "gewählt" die halbe Auskunft: Zustimmung entsteht hier immer im
     * Vergleich, nie für sich.
     *
     * Auch der leere Befund wird gezeigt, und das ist Absicht. Kein einziger
     * gewählter Satz aus dem ausgeschlossenen Programm ist die
     * aussagekräftigste Auskunft, die diese Karte geben kann: die Ablehnung
     * hielt der Blindprobe stand. Sie zu verschweigen, hieße nur die
     * Treffer der These zu zeigen und ihre Fehlschläge wegzulassen.
     */
    var letzterKarte = null;
    var probeId = null, ausGewaehlt = false;
    if (zustand.ausschluss && zustand.ausschluss !== '_offen') {
      probeId = zustand.ausschluss;
      ausGewaehlt = true;
    } else if (erg.ranking.length >= 3) {
      probeId = erg.ranking[erg.ranking.length - 1].parteiId;
    }

    if (probeId) {
      var gewaehlteSaetze = [], angetreten = 0;
      zustand.duelle.forEach(function (duell, k) {
        var sieger = zustand.duellAntworten[k];
        if (!sieger) { return; }
        var seiten = [duell.links, duell.rechts];
        seiten.forEach(function (x, nr) {
          if (x.parteiId !== probeId) { return; }
          angetreten++;
          if (x.id !== sieger) { return; }
          gewaehlteSaetze.push({ aussage: x, frage: duell.frageText, gegen: seiten[1 - nr] });
        });
      });

      var pp = D.partei(d, probeId);
      var platz = -1;
      erg.ranking.forEach(function (r, i) { if (r.parteiId === probeId) { platz = i + 1; } });

      var lage = ausGewaehlt
        ? 'Sie hatten ' + pp.name + ' vorab als die Partei benannt, die für Sie am '
          + 'wenigsten in Frage kommt'
        : pp.name + ' steht bei Ihnen auf dem letzten Platz';

      if (gewaehlteSaetze.length) {
        letzterKarte = el('div', { 'class': 'karte karte--gegenprobe' }, [
          el('p', { 'class': 'tipp-zeile', text: 'Was Sie nicht erwartet haben' }),
          el('p', { 'class': 'fliess', text: lage + '. In ' + angetreten
            + ' Duellen stand ein Satz daraus zur Wahl, und '
            + (gewaehlteSaetze.length === 1
                ? 'einmal haben Sie ihn genommen:'
                : gewaehlteSaetze.length + ' Mal haben Sie ihn genommen'
                  + (gewaehlteSaetze.length > 2 ? ', darunter:' : ':')) })
        ]);
        mische(gewaehlteSaetze).slice(0, 2).forEach(function (g) {
          letzterKarte.appendChild(el('div', { 'class': 'gegenprobe-satz' }, [
            el('p', { 'class': 'gegenprobe-frage', text: g.frage }),
            el('p', { 'class': 'gegenprobe-text', text: '„' + g.aussage.kurz + '“' }),
            el('p', { 'class': 'gegenprobe-gegen',
              text: 'Stehen gelassen haben Sie dafür ' + D.partei(d, g.gegen.parteiId).name
                + ': „' + g.gegen.kurz + '“' })
          ]));
        });
        letzterKarte.appendChild(el('p', { 'class': 'fliess fliess--klein',
          text: 'Darum geht es hier: Ohne Absender liest man anders. '
            + 'Das heißt nicht, dass Sie dieses Programm wählen sollten – es heißt, '
            + 'dass der Name und die Sätze nicht dasselbe sind.' }));

      } else if (ausGewaehlt && angetreten > 0) {
        letzterKarte = el('div', { 'class': 'karte karte--gegenprobe' }, [
          el('p', { 'class': 'tipp-zeile', text: 'Ihr Ausschluss hat gehalten' }),
          el('p', { 'class': 'fliess', text: lage + '. In ' + angetreten
            + ' Duellen stand ein Satz daraus zur Wahl, und Sie haben ihn kein '
            + 'einziges Mal genommen'
            + (platz > 0 ? ' – am Ende steht ' + pp.name + ' auf Platz ' + platz + '.' : '.') }),
          el('p', { 'class': 'fliess fliess--klein',
            text: 'Das ist der seltenere Ausgang: Ihre Ablehnung hielt auch dann, '
              + 'als der Absender nicht zu sehen war.' })
        ]);

      } else if (ausGewaehlt) {
        letzterKarte = el('div', { 'class': 'karte karte--gegenprobe' }, [
          el('p', { 'class': 'tipp-zeile', text: 'Nicht geprüft' }),
          el('p', { 'class': 'fliess', text: lage + '. In diesem Durchgang stand '
            + 'aber kein Satz daraus zur Wahl – über ' + pp.name + ' sagen Ihre '
            + 'Antworten deshalb nichts.' })
        ]);
      }
    }

    /* Tipp gegen Ergebnis. Der Kern der These wird hier abgerechnet: nicht
     * ob der Nutzer richtig lag, sondern wie weit die Erwartung von den
     * Sätzen entfernt war, denen er tatsächlich zugestimmt hat. Deshalb
     * steht bei einem Fehltipp der Platz der getippten Partei dabei - ein
     * bloßes "falsch" wäre eine Wertung und keine Auskunft. */
    /* Kein eigener Kasten mehr: Wie wir es mit einer Zeitung halten, steht
     * die Abrechnung als Schlagzeile ueber der Seite (Nutzerwunsch). Erst ab
     * Stufe 2 - in der Aufdeckung gehoert der Blick allein dem Feld. */
    if (zustand.tipp && (zustand.stufe || 0) >= 2) {
      var spitzenNamen = spitze.map(function (r) { return D.partei(d, r.parteiId).name; }).join(' und ');
      var schlagzeile, unterzeile;
      if (zustand.tipp === '_offen') {
        schlagzeile = spitzenNamen + ' vorn';
        unterzeile = 'Ohne Tipp gestartet. Ohne die Partei zu kennen, lag ' + spitzenNamen + ' vorn.';
      } else {
        var getippt = D.partei(d, zustand.tipp);
        var platz = -1, wert = null;
        erg.ranking.forEach(function (r, i) {
          if (r.parteiId === zustand.tipp) { platz = i + 1; wert = Math.round(r.prozent); }
        });
        var getroffen = spitze.some(function (r) { return r.parteiId === zustand.tipp; });
        if (getroffen) {
          schlagzeile = 'Tipp gehalten: ' + getippt.name + ' vorn';
          unterzeile = 'Vor dem ersten Satz haben Sie auf ' + getippt.name
            + ' getippt. Ohne die Partei zu kennen, lag ' + getippt.name + ' tatsächlich vorn.';
        } else {
          schlagzeile = getippt.name + ' erwartet, ' + spitzenNamen + ' vorn';
          unterzeile = 'Vor dem ersten Satz haben Sie auf ' + getippt.name + ' getippt. '
            + (platz > 0
              ? 'Ohne die Partei zu kennen, kam ' + getippt.name + ' auf Platz ' + platz + ' (' + wert + ' %).'
              : getippt.name + ' kam in Ihren Duellen nicht vor.')
            + ' Das spricht nicht gegen den Tipp – eine Wahl hängt an mehr als an Programmsätzen.';
        }
      }
      var kopfTitel = abschnitt.querySelector('h1');
      if (kopfTitel) {
        kopfTitel.textContent = schlagzeile;
        kopfTitel.classList.add('ergebnis-schlagzeile');
        abschnitt.insertBefore(el('p', { 'class': 'dachzeile', text: 'Ihr Ergebnis' }), kopfTitel);
        abschnitt.insertBefore(el('p', { 'class': 'ergebnis-unterzeile', text: unterzeile }),
          kopfTitel.nextSibling);
      }
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
    var stufe = Math.min(3, Math.max(1, zustand.stufe || 1));

    /* Blaettern wie in einer Zeitung: drei Seiten, vor und zurueck. Oben
     * ein Seitenkopf mit allen drei Seiten (die aktuelle unterstrichen),
     * unten zwei Blaetter "Zurueck auf Seite n" / "Weiter auf Seite n", die
     * beim Zeigen ein Eselsohr umschlagen. Pfeiltasten blaettern ebenso.
     * Zurueckblaettern ist erlaubt - gerechnet ist ohnehin alles, und die
     * Aufdeckung (Seite 1) laeuft dann einfach noch einmal ab. */
    var SEITEN = ['Aufdeckung', 'Wie gut lagen Sie?', 'Alles im Einzelnen'];
    function blaettereZu(n) {
      if (n < 1 || n > SEITEN.length || n === stufe) { return; }
      zustand.stufe = n;
      gehe('ergebnis');
    }
    function seitenKopf() {
      return el('nav', { 'class': 'blatt-kopf', 'aria-label': 'Seiten des Ergebnisses' },
        SEITEN.map(function (name, i) {
          var nr = i + 1;
          return el('button', {
            'class': 'blatt-kopf-seite' + (nr === stufe ? ' blatt-kopf-seite--jetzt' : ''),
            type: 'button', 'aria-current': nr === stufe ? 'page' : null,
            onclick: function () { blaettereZu(nr); }
          }, [
            el('span', { 'class': 'blatt-kopf-nr', text: 'S. ' + nr }),
            el('span', { 'class': 'blatt-kopf-name', text: name })
          ]);
        }));
    }
    function blaettern() {
      var zurueck = stufe > 1
        ? el('button', { 'class': 'blatt-knopf blatt-knopf--zurueck', type: 'button',
            onclick: function () { blaettereZu(stufe - 1); } }, [
            el('span', { 'class': 'blatt-knopf-pfeil', text: '←' }),
            el('span', { 'class': 'blatt-knopf-text' }, [
              el('small', { text: 'Zurück auf Seite ' + (stufe - 1) }),
              el('span', { text: SEITEN[stufe - 2] })
            ])
          ])
        : el('span');
      var vor = stufe < SEITEN.length
        ? el('button', { 'class': 'blatt-knopf blatt-knopf--vor', type: 'button',
            onclick: function () { blaettereZu(stufe + 1); } }, [
            el('span', { 'class': 'blatt-knopf-text' }, [
              el('small', { text: 'Weiter auf Seite ' + (stufe + 1) }),
              el('span', { text: SEITEN[stufe] })
            ]),
            el('span', { 'class': 'blatt-knopf-pfeil', text: '→' })
          ])
        : el('span');
      return el('nav', { 'class': 'blaettern', 'aria-label': 'Blättern' }, [
        zurueck,
        el('span', { 'class': 'blaettern-seite', text: 'Seite ' + stufe + ' von ' + SEITEN.length }),
        vor
      ]);
    }
    tastenHoerer = function (e) {
      var ziel = e.target && e.target.tagName;
      if (ziel === 'INPUT' || ziel === 'SELECT' || ziel === 'TEXTAREA') { return; }
      if (e.key === 'ArrowLeft') { blaettereZu(stufe - 1); }
      else if (e.key === 'ArrowRight') { blaettereZu(stufe + 1); }
    };
    document.addEventListener('keydown', tastenHoerer);
    abschnitt.appendChild(seitenKopf());

    /* Rangliste und Abrechnung in zwei Spalten: links die Wertung, rechts
     * die Randspalte mit Tipp, Gegenprobe, Wetten und Zuordnung. Das ist nur
     * auf breiten Schirmen zu sehen (CSS, .ergebnis-spalten); auf schmalen
     * loesen sich beide Huellen auf (display: contents), und die Karten
     * stehen per order in der gewohnten Reihenfolge untereinander. */
    function spalten(haupt, rand) {
      var h = el('div', { 'class': 'ergebnis-haupt' });
      var r = el('div', { 'class': 'ergebnis-rand' });
      haupt.forEach(function (k) { if (k) { h.appendChild(k); } });
      rand.forEach(function (k) { if (k) { r.appendChild(k); } });
      return el('div', { 'class': 'ergebnis-spalten' }, [h, r]);
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
      var blaetterAuf = blaettern();
      var vorAuf = blaetterAuf.querySelector('.blatt-knopf--vor');
      if (vorAuf) {
        vorAuf.style.opacity = '0';
        vorAuf.style.transition = 'opacity 500ms ease';
      }
      abschnitt.appendChild(el('p', { 'class': 'halt-marke', text: 'Aufdeckung' }));
      abschnitt.appendChild(el('div', { 'class': 'auf-buehne' }, [auf.wurzel]));
      abschnitt.appendChild(blaetterAuf);
      /* Das Weiter-Blatt erscheint erst, wenn alle Namen stehen - sonst
       * klickt man mitten in die Auflösung hinein und sieht sie nie. */
      setTimeout(function () {
        if (vorAuf && vorAuf.parentNode) { vorAuf.style.opacity = '1'; }
      }, auf.dauer);
      buehne.appendChild(abschnitt);
      return;
    }

    /* STUFE 2 - Wie gut lagen Sie?
     * Jetzt erst die Abrechnung der These: der Tipp von vor dem Spiel, die
     * Wetten aus den Zwischenständen, die Zuordnung am Ende. */
    abschnitt.classList.add('ergebnis-blatt');
    if (stufe < 3) {
      abschnitt.appendChild(el('h2', { text: 'Wie gut lagen Sie?' }));
      /* Alle Plaetze stehen hier unter dem Sieger - und nur hier. */
      abschnitt.appendChild(spalten([siegerKarte, tippKarte].concat(restKarten),
        [letzterKarte, wettKarte, trefferKarte]));
      fuelle();
      abschnitt.appendChild(blaettern());
      buehne.appendChild(abschnitt);
      return;
    }

    /* STUFE 3 - Alles im Einzelnen. Ohne Rangliste, Tipp und Wetten: die
     * stehen auf Seite 2 und waeren hier nur gedoppelt (Nutzerwunsch). */
    fuelle();
    /* Der Rechenweg als eigener Kasten oben auf Seite 3 - vorher hing er
     * als loser Absatz unter der Rangliste und landete nach deren Wegfall
     * zwischen den Spalten. */
    abschnitt.appendChild(el('div', { 'class': 'karte karte--rechenweg' }, [
      el('p', { 'class': 'tipp-zeile', text: 'So wird gerechnet' }),
      el('p', { 'class': 'fliess', text:
        'Gewertet wird die Siegquote: Wie oft haben Sie ein Programm gewählt, wenn '
        + 'es angetreten ist? Beide Sätze eines Duells beantworten dieselbe Unterfrage. '
        + 'Damit eine einzelne Paarung nicht überzeichnet, zählt ein halber Sieg und '
        + 'eine halbe Niederlage als Vorannahme mit – vier aus vier ergeben deshalb '
        + '90 Prozent und nicht 100.' }),
      el('p', { 'class': 'fliess', text:
        'Der Gesamtwert ist der Durchschnitt über die Themen, Schwerpunkte zählen '
        + 'doppelt. 50 Prozent ist der Münzwurf: Darüber wurde ein Programm öfter '
        + 'gewählt als nicht, darunter seltener. Übersprungene Duelle zählen für niemanden.' })
    ]));

    /* Aufschluesselung je Thema: Siegquote und die tatsaechlich gespielten
     * Duelle. Anders als die Vorform zeigt der Anhang jetzt genau das, was
     * passiert ist - Paarung fuer Paarung, mit Ihrer Wahl daneben. Das ist
     * nachvollziehbarer als eine Punktzahl, die man erst erklaeren muss. */
    abschnitt.appendChild(el('h2', { text: 'Nach Themen' }));
    var themenSpalten = el('div', { 'class': 'themen-spalten' });
    abschnitt.appendChild(themenSpalten);

    var duelleProThema = Object.create(null);
    zustand.duelle.forEach(function (duell, index) {
      (duelleProThema[duell.themaId] = duelleProThema[duell.themaId] || [])
        .push({ duell: duell, index: index });
    });

    erg.themen.filter(function (t) { return t.gewicht > 0; }).sort(function (a, b) {
      return b.gewicht - a.gewicht;   /* Schwerpunkte zuerst, sonst Reihenfolge des Datensatzes */
    }).forEach(function (t) {
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
        var frageZeile = el('p', { 'class': 'frage-text' });
        global.S47_BEGRIFF.setze(frageZeile, duell.frageText, d.begriffe);
        if (!sieger) {
          frageZeile.appendChild(document.createTextNode('  (übersprungen)'));
        }
        var block = el('div', { 'class': 'frage-block' }, [frageZeile]);
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
                text: !sieger ? '–' : gewonnen ? 'gewählt' : '' })
            ]),
            el('p', { 'class': 'wert-aussage', text: a.kurz }),
            zitatSchalter(a),
            quellKnopf
          ]));
        });
        liste.appendChild(block);
      });

      /* Zuerst nur die Summe je Partei; die einzelnen Fragen stehen
       * aufklappbar darunter (Nutzerwunsch - sonst war jede Karte eine
       * lange Liste und die Themen liessen sich nicht mehr vergleichen). */
      var anzahlFragen = (duelleProThema[t.id] || []).length;
      /* Schwerpunkte auf einen Blick: dicke Kopflinie und gefuelltes
       * Etikett, normale Themen mit blassem Etikett (Nutzerwunsch). */
      var schwer = t.gewicht > DU.GEWICHT_NORMAL;
      themenSpalten.appendChild(el('div', { 'class': 'karte' + (schwer ? ' karte--schwerpunkt' : '') }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('h3', { 'class': 'thema-titel', text: thema.titel }),
          el('span', { 'class': 'gewicht-wert' + (schwer ? ' gewicht-wert--schwer' : ''),
            text: schwer ? 'Schwerpunkt · zählt doppelt' : DU.gewichtLabel(t.gewicht) })
        ]),
        inhalt,
        anzahlFragen ? el('details', { 'class': 'thema-details' }, [
          el('summary', { 'class': 'thema-details-knopf',
            text: 'Einzelne Fragen ansehen (' + anzahlFragen + ')' }),
          liste
        ]) : null
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

    /* Was das Ergebnis ist und was nicht.
     *
     * Eine Prozentzahl neben einem Parteinamen liest sich wie eine
     * Empfehlung, und das ist sie nicht: Gemessen wurde die Zustimmung zu
     * vierzig Sätzen aus Programmen, nicht zu Personen, nicht zu Koalitionen,
     * nicht zu einer Regierungsbilanz. Das gehört an das Ende geschrieben und
     * nicht ins Kleingedruckte - wer bis hierhin gelesen hat, verdient die
     * Einordnung an derselben Stelle wie die Zahl. */
    abschnitt.appendChild(el('div', { 'class': 'karte karte--schluss' }, [
      el('p', { 'class': 'tipp-zeile', text: 'Was hier gemessen wurde' }),
      el('p', { 'class': 'fliess', text: 'Ihre Zustimmung zu einzelnen Sätzen '
        + 'aus Wahlprogrammen – nicht zu Personen, nicht zu Koalitionen, nicht '
        + 'zu einer Regierungsbilanz. Programme sind Absichtserklärungen; was '
        + 'davon umgesetzt wird, steht in keinem von ihnen.' }),
      el('p', { 'class': 'fliess fliess--klein', text: 'Jede Aussage oben ist '
        + 'mit Seitenzahl belegt und über „Wortlaut“ im Original nachlesbar. '
        + 'Die Programme selbst stehen im Quellenverzeichnis des PDF – wenn '
        + 'dieser Durchgang zu etwas gut war, dann dazu, drei oder vier Seiten '
        + 'davon wirklich zu lesen.' })
    ]));

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

    abschnitt.appendChild(blaettern());
    buehne.appendChild(abschnitt);

    /* Alle Summen-Bereiche so hoch wie der hoechste: Themen mit weniger
     * Parteien sonst kuerzer, und die Karten standen treppauf, treppab.
     * Erst messen, wenn die Seite im DOM steht. */
    var summen = themenSpalten.querySelectorAll('.themen-werte');
    var hoechste = 0;
    for (var s = 0; s < summen.length; s++) { hoechste = Math.max(hoechste, summen[s].offsetHeight); }
    for (var s2 = 0; s2 < summen.length; s2++) { summen[s2].style.minHeight = hoechste + 'px'; }
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
   * Hell ist Standard, unabhaengig von der Systemeinstellung. Der Knopf
   * wechselt nur fuer diese Sitzung: Speichern ist ausgeschlossen
   * (CLAUDE.md), und ein Zustand, der das Neuladen ueberlebt, ginge ohne
   * Speicher nicht. */
  var modusKnopf = document.getElementById('modus');

  function zeigeModus() {
    var dunkel = document.documentElement.getAttribute('data-modus') === 'dunkel';
    modusKnopf.textContent = dunkel ? '☀' : '☽';
    modusKnopf.setAttribute('aria-label',
      dunkel ? 'Zur hellen Darstellung wechseln' : 'Zur dunklen Darstellung wechseln');
  }

  modusKnopf.addEventListener('click', function () {
    var dunkel = document.documentElement.getAttribute('data-modus') === 'dunkel';
    document.documentElement.setAttribute('data-modus', dunkel ? 'hell' : 'dunkel');
    zeigeModus();
  });

  zeigeModus();

  /* ---------- Start ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-aktion="neustart"]') : null;
    if (t) { e.preventDefault(); gehe('wahl'); }
  });

  stelleWiederHer(function (gezeigt) { if (!gezeigt) { gehe('wahl'); } });
})(window);
