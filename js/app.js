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
    });
    rand.appendChild(hinweis);

    /* Ergebnis einer vergangenen Wahl als Kurzmeldung: Parteien mit Prozent
     * und grauem Balken, dazu Art und Quelle des Ergebnisses. Unbunt wie der
     * Rest der Titelseite - Parteifarben gehoeren erst zur Aufdeckung. */
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
        el('p', { text: 'Gemessen wird nur die Zustimmung zu Programmsätzen – nicht zu Personen, Koalitionen oder Regierungsbilanzen. Nichts wird gespeichert, nichts verschickt.' })
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
   *   2. Worauf kommt es an? - hoechstens drei Schwerpunkte per Klick auf
   *      die Themenzeile; einzelne Themen lassen sich abwaehlen.
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
    function minuten(n) { return Math.max(2, Math.round(n / 4.5)); }

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

      haupt.addEventListener('click', function () {
        var g = zustand.gewichte[t.id];
        if (g === 0) { zustand.gewichte[t.id] = DU.GEWICHT_NORMAL; }
        else if (g === DU.GEWICHT_SCHWERPUNKT) { zustand.gewichte[t.id] = DU.GEWICHT_NORMAL; }
        else if (schwerpunkte() >= DU.SCHWERPUNKT_MAX) {
          hinweis.textContent = 'Höchstens ' + DU.SCHWERPUNKT_MAX
            + ' Schwerpunkte. Nehmen Sie zuerst einen weg.';
          return;
        } else { zustand.gewichte[t.id] = DU.GEWICHT_SCHWERPUNKT; }
        hinweis.textContent = '';
        zeichneAlles();
      });
      ausKnopf.addEventListener('click', function () {
        zustand.gewichte[t.id] = zustand.gewichte[t.id] === 0 ? DU.GEWICHT_NORMAL : 0;
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
          ? 'Wird nicht abgefragt'
          : (schwer ? 'Schwerpunkt · ' : '') + n + (n === 1 ? ' Duell' : ' Duelle');
        ausKnopf.textContent = g === 0 ? '↺' : '✕';
        ausKnopf.setAttribute('title', g === 0
          ? t.titel + ' wieder abfragen' : t.titel + ' nicht abfragen');
        haupt.setAttribute('title', schwer
          ? 'Schwerpunkt aufheben' : 'Als Schwerpunkt setzen');
      });
      liste.appendChild(zeile);
    });

    function zeichneAlles() {
      var verteilung = DU.verteile(d, zustand.gewichte, zustand.umfang);
      zeilen.forEach(function (f) { f(verteilung); });
      laengeKnoepfe.forEach(function (x) {
        var probe = DU.verteile(d, zustand.gewichte, x.id);
        x.el.classList.toggle('laenge-karte--aktiv', x.id === zustand.umfang);
        x.zahl.textContent = probe.gesamt + ' Duelle';
        x.zeit.textContent = 'ungefähr ' + minuten(probe.gesamt) + ' Minuten';
      });
      var s = schwerpunkte();
      bilanz.textContent = verteilung.gesamt + ' Duelle, ungefähr '
        + minuten(verteilung.gesamt) + ' Minuten · '
        + (s === 0 ? 'keine Schwerpunkte'
           : s === 1 ? 'ein Schwerpunkt' : s + ' Schwerpunkte')
        + '. Schwerpunkte verlängern den Durchgang nicht, sie verschieben nur, '
        + 'wo genauer gefragt wird.';
      weiter.disabled = verteilung.gesamt === 0;
    }

    weiter.addEventListener('click', function () {
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
      el('p', { 'class': 'dachzeile', text: 'Ihre Schwerpunkte' }),
      el('p', { 'class': 'fliess fliess--klein', text: 'Tippen Sie bis zu '
        + DU.SCHWERPUNKT_MAX + ' Themen an – dort wird doppelt so oft gefragt. '
        + 'Mit ✕ nehmen Sie ein Thema ganz heraus.' }),
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
      el('p', { 'class': 'fliess fliess--klein', text: 'Beide Angaben beeinflussen die Auswertung nicht. Sie werden nirgends gespeichert und nirgends übertragen.' }),
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
    abschnitt.classList.add('ergebnis-blatt');
    if (stufe < 3) {
      abschnitt.appendChild(el('h2', { text: 'Wie gut lagen Sie?' }));
      abschnitt.appendChild(spalten([siegerKarte, tippKarte],
        [letzterKarte, wettKarte, trefferKarte]));
      fuelle();
      abschnitt.appendChild(weiterKnopf('Alles im Einzelnen'));
      buehne.appendChild(abschnitt);
      return;
    }

    /* STUFE 3 - Alles im Einzelnen. */
    fuelle();
    abschnitt.appendChild(el('h2', { text: 'Alle Parteien' }));
    abschnitt.appendChild(spalten([siegerKarte].concat(restKarten),
      [tippKarte, letzterKarte, wettKarte, trefferKarte]));
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
    var themenSpalten = el('div', { 'class': 'themen-spalten' });
    abschnitt.appendChild(themenSpalten);

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
            + (sieger ? '' : '  (übersprungen)') })
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
                text: !sieger ? '–' : gewonnen ? 'gewählt' : '' })
            ]),
            el('p', { 'class': 'wert-aussage', text: a.kurz }),
            zitatSchalter(a),
            quellKnopf
          ]));
        });
        liste.appendChild(block);
      });

      themenSpalten.appendChild(el('div', { 'class': 'karte' }, [
        el('div', { 'class': 'thema-kopf' }, [
          el('h3', { 'class': 'thema-titel', text: thema.titel }),
          el('span', { 'class': 'gewicht-wert',
            text: DU.gewichtLabel(t.gewicht) })
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

  gehe('wahl');
})(window);
