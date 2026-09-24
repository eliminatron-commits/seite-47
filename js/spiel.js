/* Seite 47 – Die Spielansichten: Duell, Zwischenstand, Finale.
 *
 * DIE IDEE
 *
 * Zwei Sätze, einer gewinnt. Der Punkt fällt einem der sieben verdeckten
 * Kandidaten zu, aber nicht sofort sichtbar: er wandert erst in die
 * Gutschrift und wird zusammen mit den nächsten in einer WELLE ins Feld
 * gebucht.
 *
 * Die Verzögerung ist kein Schmuck, sie schließt ein Leck. Blind bleibt die
 * Entscheidung ohnehin – der Kandidat steht erst nach dem Klick fest, sonst
 * wäre das Spiel eine Selbstbestätigung. Der Weg zurück war aber offen: Wer
 * einen Satz an Inhalt oder Ton erkannte und danach genau eine Säule wachsen
 * sah, hatte den Buchstaben, und zwar für den ganzen Durchgang. Ein einziger
 * Treffer deckte eine Partei über vierzig Duelle hinweg auf.
 *
 * Drei Dinge machten das leicht, alle drei sind weg: der Marker trug den
 * Buchstaben, genau eine Säule blinkte, und die Säulen zeigten den exakten
 * Zähler („2/2"). Jetzt bewegt sich das Feld erst nach WELLE Duellen, dann
 * aber als Ganzes – jedes Duell verändert zwei Parteien, eine Welle also bis
 * zu acht Säulen. Ein erkannter Satz ist damit einer unter vielen.
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
   * Halt verliert seinen Rang. Kurze Durchgänge bekommen nur einen: auf
   * fünfzehn Duellen stünden zwei Wetten fast nebeneinander, und beide
   * beträfen einen Stand aus wenigen Duellen. */
  var HALTE = [0.32, 0.68];
  var HALT_EINZELN = [0.5];
  var HALT_AB = 16;

  /* Das Finale zählt im Gesamtwert wie jedes andere Duell. Bei rund zwanzig
   * Duellen wären fünf davon ein Viertel des Durchgangs – deshalb drei. */
  var FINALE_DUELLE = 3;

  /* Wie viele Duelle in einer Gutschrift zusammengefasst werden. Vier ist
   * der kleinste Wert, bei dem die Welle das ganze Feld umwirft (jedes Duell
   * bewegt Sieger UND Verlierer) und die Rueckmeldung trotzdem nie weiter
   * weg ist als drei Klicks. Bei acht wartet man zu lange auf die einzige
   * Belohnung, die es im Mittelteil gibt. */
  var WELLE = 4;

  /* Gebucht wird nur an einer Grenze: alle WELLE Duelle, an jedem Halt, beim
   * Anpfiff des Finales und am Ende. Halt und Finale muessen dabei sein,
   * sonst zeigte der Zwischenstand einen Stand, der ein bis drei Duelle alt
   * ist - und auf genau diesen Stand wird gewettet. */
  function istGrenze(zustand, anzahl) {
    if (anzahl <= 0) { return true; }
    if (anzahl % WELLE === 0) { return true; }
    if (anzahl >= zustand.duelle.length) { return true; }
    if (zustand.halte.indexOf(anzahl) > -1) { return true; }
    var hier = zustand.duelle[anzahl], davor = zustand.duelle[anzahl - 1];
    if (hier && hier.finale && !(davor && davor.finale)) { return true; }
    return false;
  }

  /* Der jüngste Index, der schon gebucht ist. -1 heisst: noch nichts. */
  function gutschrift(zustand, bisIndex) {
    var anzahl = bisIndex + 1;
    while (anzahl > 0 && !istGrenze(zustand, anzahl)) { anzahl--; }
    return anzahl - 1;
  }

  function haltepunkte(anzahl) {
    var p = [];
    (anzahl < HALT_AB ? HALT_EINZELN : HALTE).forEach(function (anteil) {
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
    /* Der exakte Zaehler steht nur im grossen Feld, also am Halt und am
     * Ende. Waehrend der Duelle waere er die bequemste Art, eine Welle
     * wieder auseinanderzurechnen: zwei Bilder nebeneinanderlegen, eine
     * Differenz bilden, fertig. Die Saeulenhoehe sagt dasselbe unschaerfer,
     * und unschaerfer genuegt hier voellig. */
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
        c.quote.textContent = !gross ? ''
          : (r.auftritte ? r.siege + '/' + r.auftritte : '·');
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

  /* ---------- Feste Hoehe fuer Frage und Karten ----------
   * Die Karten sind so hoch wie ihr laengster Satz. Die Leiste darunter
   * sprang deshalb bei jeder Frage; am Fensterrand festgemacht stand sie auf
   * hohen Bildschirmen dafuer weit weg von den Karten (und unter der
   * Fusszeile). Jetzt wird der Bereich einmal auf das Maximum ALLER Duelle
   * dieses Durchgangs reserviert - die Leiste steht direkt darunter und bei
   * jeder Frage auf demselben Pixel. Passt das nicht ins Fenster, haelt die
   * Leiste per sticky am unteren Rand; pro Fenster ist das immer derselbe
   * Fall.
   *
   * Gemessen verdeckt, im selben Abschnitt und damit bei derselben Breite
   * und denselben Regeln. Im Messbereich stehen nur Satztexte, keine
   * Parteidaten, und er verschwindet im selben Schritt wieder. Neu gemessen
   * wird, wenn sich Breite, Plan oder Duellzahl aendern (das Finale haengt
   * Duelle an) - und beim Aendern der Fenstergroesse. Bei Breite 0
   * (verborgenes Fenster) wird nichts zwischengespeichert. */
  /* Beide Fassungen laufen durch die Maskierung: auch die vereinfachten
   * Saetze nennen Parteinamen, die Originalzitate tun es fast immer
   * ("Wir Freie Demokraten"). Ohne anonymisiere waere der Umschalter der
   * kuerzeste Weg zur Aufdeckung. */
  /* Die Frage traegt die Begriffsmarken, die Karten nicht (siehe
   * js/begriffe.js). Die verdeckte Messung in messeMitte laesst sie weg:
   * Marken aendern die Zeilenumbrueche nicht, und gemessen wird die Hoehe. */
  function frageMitBegriffen(macher, datensatz, text) {
    var p = macher('p', { 'class': 'spiel-frage' });
    global.S47_BEGRIFF.setze(p, text, datensatz && datensatz.begriffe);
    return p;
  }

  function satzText(D, d, aussage, wortlaut) {
    return wortlaut
      ? '„' + D.anonymisiere(d, aussage.original) + '“'
      : D.anonymisiere(d, aussage.kurz);
  }

  function messeMitte(ctx, abschnitt) {
    var zustand = ctx.zustand, el = ctx.el, D = ctx.D, d = zustand.datensatz;
    var c = zustand.mitteHoehe;
    var breite = abschnitt.clientWidth;
    var wl = !!zustand.wortlaut;
    if (c && c.duelle === zustand.duelle && c.anzahl === zustand.duelle.length
        && c.breite === breite && c.wortlaut === wl) {
      return c.hoehe;
    }
    var klasse = 'duell-satz' + (wl ? ' duell-satz--wortlaut' : '');
    var satz1 = el('p', { 'class': klasse });
    var satz2 = el('p', { 'class': klasse });
    var frage = el('p', { 'class': 'spiel-frage' });
    var begriffe = el('p', { 'class': 'duell-begriffe' });
    var probe = el('div', { 'class': 'spiel-mitte spiel-messung', 'aria-hidden': 'true' }, [
      frage,
      el('div', { 'class': 'wortlaut-zeile' }, [
        el('button', { 'class': 'link link--zitat', text: 'Wortlaut' })]),
      el('div', { 'class': 'duell-buehne' }, [
        el('div', { 'class': 'duell-karte duell-karte--links' }, [
          el('span', { 'class': 'duell-nr', text: '1' }), satz1]),
        el('div', { 'class': 'duell-gegen' }, [
          el('span', { 'class': 'duell-gegen-text', text: 'oder' })]),
        el('div', { 'class': 'duell-karte duell-karte--rechts' }, [
          el('span', { 'class': 'duell-nr', text: '2' }), satz2])
      ]),
      begriffe,
      el('span', { 'class': 'spiel-serie' })
    ]);
    abschnitt.appendChild(probe);
    var hoechste = 0;
    zustand.duelle.forEach(function (dl) {
      frage.textContent = dl.frageText;
      satz1.textContent = satzText(D, d, dl.links, wl);
      satz2.textContent = satzText(D, d, dl.rechts, wl);
      /* Die Begriffszeile wird mitgemessen: sie ist je Duell verschieden
       * lang, und die Leiste darunter darf davon nichts merken. */
      global.S47_BEGRIFF.zeile(begriffe, [satz1.textContent, satz2.textContent],
        d.begriffe, global.S47_BEGRIFF.finde([dl.frageText], d.begriffe)
          .map(function (t) { return t.begriff.wort; }));
      hoechste = Math.max(hoechste, probe.offsetHeight);
    });
    abschnitt.removeChild(probe);
    if (breite > 0) {
      zustand.mitteHoehe = { duelle: zustand.duelle, anzahl: zustand.duelle.length,
        breite: breite, wortlaut: wl, hoehe: hoechste };
    }
    return hoechste;
  }

  var aktuelleMitte = null;
  function setzeMitte(ctx, abschnitt, mitte) {
    aktuelleMitte = { ctx: ctx, abschnitt: abschnitt, mitte: mitte };
    mitte.style.minHeight = messeMitte(ctx, abschnitt) + 'px';
  }
  /* Fenster gedreht oder breiter gezogen: Umbruch und damit Hoehe aendern
   * sich, der Zwischenspeicher gilt dann nicht mehr. */
  if (global.addEventListener) {
    global.addEventListener('resize', function () {
      var a = aktuelleMitte;
      if (!a || !a.abschnitt.parentNode) { return; }
      a.mitte.style.minHeight = messeMitte(a.ctx, a.abschnitt) + 'px';
    });
  }

  /* ---------- 1. Das Duell ---------- */

  /* Zuletzt gezeigter Stand des Fortschrittsbogens. Der Bogen wird mit jeder
   * Frage neu gebaut; ohne diesen Wert startete er jedes Mal bei null und lief
   * von dort hoch - er blitzte zurueck, statt nur ein Stueck zu wachsen. */
  var bogenZuletzt = 0;

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
    bogen.firstChild.style.width = (i === 0 ? 0 : bogenZuletzt) + '%';
    /* Neben dem Zaehler die verstrichene Zeit - vorwaerts, nie rueckwaerts:
     * eine Auskunft, kein Countdown. app.js schreibt sie jede Sekunde neu. */
    var zaehler = el('span', { 'class': 'spiel-zaehler' }, [
      el('span', { text: (i + 1) + ' / ' + duelle.length }),
      ctx.uhrText ? el('span', { 'class': 'spiel-uhr', text: ctx.uhrText() }) : null
    ]);
    var serieEl = el('span', { 'class': 'spiel-serie' });

    /* Randspalte fuer breite Schirme: wo man im Bogen des Durchgangs steht
     * (Sichtung, Halte, Finale) und wie weit jedes Thema ist. Nur Themen und
     * Zaehler - nichts, was an einer Partei haengt. Unter 75rem per CSS aus. */
    function randSpalte() {
      var halte = (zustand.halte || []).slice().sort(function (a, b) { return a - b; });
      var schritte = [];
      halte.forEach(function (h, k) {
        schritte.push({ name: (k + 1) + '. Zwischenstand', text: 'nach Duell ' + h,
          fertig: !!duell.finale || i >= h, jetzt: false });
      });
      schritte.push({ name: 'Finale', text: 'die zwei Ersten direkt gegeneinander',
        fertig: false, jetzt: !!duell.finale });

      var proThema = Object.create(null);
      duelle.forEach(function (x, k) {
        if (x.finale) { return; }
        var e = proThema[x.themaId] || (proThema[x.themaId] = { n: 0, fertig: 0 });
        e.n++;
        if (k < i) { e.fertig++; }
      });

      return el('aside', { 'class': 'spiel-rand', 'aria-label': 'Ablauf des Durchgangs' }, [
        el('p', { 'class': 'dachzeile', text: 'Dieser Durchgang' }),
        el('ol', { 'class': 'spiel-rand-liste' }, schritte.map(function (s) {
          return el('li', { 'class': 'spiel-rand-schritt'
            + (s.jetzt ? ' spiel-rand-schritt--jetzt' : s.fertig ? ' spiel-rand-schritt--fertig' : '') }, [
            el('span', { text: s.name }),
            el('small', { text: s.text })
          ]);
        })),
        el('p', { 'class': 'dachzeile', text: 'Themen' }),
        el('ul', { 'class': 'spiel-rand-liste' }, d.themen.filter(function (t) {
          return proThema[t.id];
        }).map(function (t) {
          var e = proThema[t.id];
          return el('li', { 'class': 'spiel-rand-thema'
            + (!duell.finale && t.id === duell.themaId ? ' spiel-rand-thema--jetzt'
              : e.fertig >= e.n ? ' spiel-rand-thema--fertig' : '') }, [
            el('span', { 'class': 'spiel-rand-thema-titel', text: t.titel, title: t.titel }),
            el('span', { 'class': 'spiel-rand-zahl', text: e.fertig + ' / ' + e.n })
          ]);
        }))
      ]);
    }

    function siegerPartei(index) {
      var s = zustand.duellAntworten[index];
      if (!s) { return null; }
      var dl = duelle[index];
      return dl.links.id === s ? dl.links.parteiId : dl.rechts.parteiId;
    }

    /* Die Hinweiszeile wertet keine Meinung. Sie sagt, dass eine Serie läuft
     * – nicht, WEM sie gehört.
     *
     * Vorher stand hier „3× hintereinander für G" und, wenn es passte,
     * „Überraschung: Das war bisher Ihr Schlusslicht." Beides beantwortete
     * unmittelbar nach einem Klick die Frage, die der ganze Durchgang offen
     * halten soll: welcher Buchstabe gehört zu diesem Satz. Der erste nannte
     * ihn direkt, der zweite zeigte auf die letzte Säule. Ein Hinweis, der
     * die Auflösung ausplaudert, kostet mehr, als er einbringt.
     *
     * Die Beobachtung über den Ausreißer geht nicht verloren, sie steht
     * jetzt im Zwischenstand – dort bezieht sie sich auf viele Duelle und
     * verrät keinen einzelnen Satz.
     */
    function zeichneHinweis() {
      var text = '';
      var laenge = 0, letzter = null;
      for (var k = i; k >= 0; k--) {
        var pid = siegerPartei(k);
        if (!pid) { break; }
        if (letzter === null) { letzter = pid; }
        if (pid !== letzter) { break; }
        laenge++;
      }
      if (laenge >= 3) {
        text = laenge + '× hintereinander dasselbe Programm';
      }

      serieEl.textContent = text;
      serieEl.classList.toggle('spiel-serie--an', !!text);
    }

    var feld = baueFeld(ctx, false);

    /* Die Gutschrift: WELLE Marken links neben dem Feld, ausserhalb der
     * Saeulen. Der Punkt flog vorher in die Mitte des Feldes und landete
     * damit auf einer verdeckten Partei - eine Stelle, die dort nichts zu
     * suchen hat (vom Nutzer gemeldet). Nebenbei wird sichtbar, warum sich
     * das Feld erst nach vier Duellen bewegt. */
    var gutschriftPunkte = [];
    var gutschriftFeld = el('div', { 'class': 'gutschrift', 'aria-hidden': 'true' });
    for (var g = 0; g < WELLE; g++) {
      var pk = el('span', { 'class': 'gutschrift-punkt' });
      gutschriftPunkte.push(pk);
      gutschriftFeld.appendChild(pk);
    }
    function zeigeGutschrift(offen) {
      gutschriftPunkte.forEach(function (pk, nr) {
        pk.classList.toggle('gutschrift-punkt--voll', nr < offen);
      });
    }
    zeigeGutschrift(i - gutschrift(zustand, i - 1) - 1);

    /* ---------- Die beiden Karten ---------- */

    var buehneKarten = el('div', { 'class': 'duell-buehne' });
    var karten = [];
    var saetze = [];

    /* ---------- Der Umschalter zum Wortlaut ----------
     * Er schaltet BEIDE Karten zugleich, nie eine einzelne: Stand auf der
     * einen Karte das Zitat und auf der anderen die Zusammenfassung, waere
     * der Vergleich verzerrt, und die unterschiedliche Laenge der Zitate
     * waere ein Erkennungsmerkmal fuer sich. Die Wahl gilt fuer den ganzen
     * Durchgang (zustand.wortlaut), damit niemand sie bei jeder Frage neu
     * treffen muss. */
    var wortlautKnopf = el('button', {
      'class': 'link link--zitat', type: 'button',
      text: zustand.wortlaut ? 'Vereinfachte Fassung' : 'Wortlaut',
      title: 'Gilt fuer beide Karten'
    });
    wortlautKnopf.addEventListener('click', function () {
      zustand.wortlaut = !zustand.wortlaut;
      wortlautKnopf.textContent = zustand.wortlaut ? 'Vereinfachte Fassung' : 'Wortlaut';
      saetze.forEach(function (x) {
        x.el.textContent = satzText(D, d, x.aussage, zustand.wortlaut);
        x.el.classList.toggle('duell-satz--wortlaut', !!zustand.wortlaut);
      });
      /* Die reservierte Hoehe gilt fuer eine Fassung; beim Umschalten wird
       * sie neu bestimmt. Einmal auf Klick zu springen ist richtig - die
       * Alternative waere, dauerhaft Platz fuer die laengere Fassung
       * freizuhalten, und der fehlte dann auf dem Telefon. */
      setzeMitte(ctx, abschnitt, mitte);
    });
    var wortlautZeile = el('div', { 'class': 'wortlaut-zeile' }, [wortlautKnopf]);

    function karteFuer(a, seite, nr) {
      var satz = el('p', {
        'class': 'duell-satz' + (zustand.wortlaut ? ' duell-satz--wortlaut' : ''),
        text: satzText(D, d, a, zustand.wortlaut)
      });
      var k = el('button', {
        'class': 'duell-karte duell-karte--' + seite, type: 'button'
      }, [
        el('span', { 'class': 'duell-nr', text: String(nr) }),
        satz
      ]);
      saetze.push({ aussage: a, el: satz });
      k.addEventListener('click', function (e) {
        /* Der Griff der Bildlaufleiste liegt innerhalb der Karte, und die
         * Karte ist ein Knopf: Wer im Wortlaut scrollt, haette damit
         * gewaehlt. Klicks rechts vom Textbereich zaehlen deshalb nicht. */
        if (e && e.target === satz && satz.scrollHeight > satz.clientHeight
            && e.offsetX > satz.clientWidth) { return; }
        /* Der Klickort wandert mit: der Stoss soll dort entstehen, wo der
         * Finger war, nicht in der Kartenmitte. Bei Tastaturbedienung gibt
         * es keinen Ort - dann von der Mitte aus. */
        waehle(a, k, e && e.clientX ? e : null);
      });
      karten.push({ aussage: a, el: k });
      return k;
    }

    buehneKarten.appendChild(karteFuer(duell.links, 'links', 1));
    buehneKarten.appendChild(el('div', { 'class': 'duell-gegen' }, [
      el('span', { 'class': 'duell-gegen-text', text: 'oder' })
    ]));
    buehneKarten.appendChild(karteFuer(duell.rechts, 'rechts', 2));

    /* Ein kurzer Stoss vom Klickort aus. Die Karte skaliert ohnehin, aber
     * das ist eine Eigenschaft der Karte - der Stoss gehört dem Klick. Er
     * ist die kleinste mögliche Quittung für die am häufigsten wiederholte
     * Handlung im ganzen Durchgang, und ohne ihn fühlt sie sich beliebig an. */
    function stoss(karteEl, ereignis) {
      var kasten = karteEl.getBoundingClientRect();
      var x = ereignis ? ereignis.clientX - kasten.left : kasten.width / 2;
      var y = ereignis ? ereignis.clientY - kasten.top : kasten.height / 2;
      var welle = el('span', { 'class': 'stoss' });
      welle.style.left = x + 'px';
      welle.style.top = y + 'px';
      karteEl.appendChild(welle);
      spaeter(function () {
        if (welle.parentNode) { welle.parentNode.removeChild(welle); }
      }, 620);
    }

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

    function waehle(a, karteEl, ereignis) {
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
      wortlautKnopf.disabled = true;
      stoss(karteEl, ereignis);
      zeichneHinweis();

      /* Wer waehrend der Beat-Folge irgendwohin klickt, will weiter. Die
       * Karten sind da bereits deaktiviert und schlucken jeden Klick - ohne
       * diesen Faenger am Dokument liefe das angekuendigte Ueberspringen
       * ins Leere, und ungeduldige Nutzer klickten wirkungslos. Capture,
       * damit er vor allen anderen Zielen greift. */
      ueberspringer = function (e) {
        if (e.target && e.target.closest
            && e.target.closest('.navi, .begriff, .begriff-blase')) { return; }
        e.preventDefault();
        e.stopPropagation();
        weiter();
      };
      spaeter(function () {
        document.addEventListener('click', ueberspringer, true);
      }, 140);

      /* Der Marker trägt den Punkt von der gewählten Karte hinunter zur
       * Gutschrift – ohne Buchstaben und ohne Ziel-Säule. Vorher stand sein
       * Kürzel darauf und er landete auf genau einer Säule; das war die
       * Zuordnung Satz→Kandidat, ausgeschrieben und mit dem Finger
       * daraufgezeigt. Jetzt fliegt er in die Mitte des Feldes, und was
       * daraus wird, zeigt sich erst mit der nächsten Welle. */
      var ziel = gutschriftFeld;
      var von = karteEl.getBoundingClientRect();
      var nach = ziel.getBoundingClientRect();
      marker = el('div', { 'class': 'marker' });
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

      /* Die Welle: fällt dieses Duell auf eine Grenze, bucht das Feld alles
       * seit der letzten Grenze auf einmal. Sonst bleibt es stehen und nur
       * die Gutschrift quittiert. */
      var vorher = gutschrift(zustand, i - 1);
      var nachher = gutschrift(zustand, i);
      var welle = nachher > vorher;

      spaeter(function () {
        if (marker && marker.parentNode) { marker.parentNode.removeChild(marker); }
        marker = null;
        zeigeGutschrift(welle ? 0 : i - vorher);
        if (welle) {
          feld.wurzel.classList.add('feld--welle');
          feld.zeichne(nachher, true);
          spaeter(function () {
            feld.wurzel.classList.remove('feld--welle');
          }, 620);
        }
      }, FLUG);

      /* Ohne Welle gibt es im Feld nichts zu sehen – dann darf die Folge
       * kürzer sein, statt den Nutzer vor ein unverändertes Bild zu setzen. */
      spaeter(weiter, welle ? FLUG + HALT + 400 : FLUG + 120);
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

    /* Frage, Karten und Hinweiszeile: Hoehe fuer den ganzen Durchgang
     * reserviert (reserviereMitte), damit die Leiste darunter nie springt. */
    /* Fachwoerter aus BEIDEN Aussagen, gesammelt unter den Karten - ohne
     * die, die in der Frage schon markiert sind. */
    var begriffsZeile = el('p', { 'class': 'duell-begriffe' });
    var inDerFrage = global.S47_BEGRIFF.finde([duell.frageText], d.begriffe)
      .map(function (t) { return t.begriff.wort; });
    var wieViele = global.S47_BEGRIFF.zeile(begriffsZeile,
      [satzText(D, d, duell.links, zustand.wortlaut),
        satzText(D, d, duell.rechts, zustand.wortlaut)], d.begriffe, inDerFrage);
    if (!wieViele) { begriffsZeile.classList.add('duell-begriffe--leer'); }

    var mitte = el('div', { 'class': 'spiel-mitte' }, [
      frageMitBegriffen(el, d, duell.frageText),
      wortlautZeile,
      buehneKarten,
      begriffsZeile,
      serieEl
    ]);

    var abschnitt = el('section', { 'class': 'spiel' + (duell.finale ? ' spiel--finale' : '') }, [
      randSpalte(),
      el('div', { 'class': 'spiel-kopf' }, [kopfLinks, zaehler]),
      bogen,
      mitte,

      /* Feld und Knoepfe als feste Leiste am unteren Rand: Ihre Lage haengt
       * nicht am Text der Karten, sonst sprangen sie bei jeder Frage. */
      el('div', { 'class': 'spiel-dock' }, [
      el('div', { 'class': 'feld-huelle' }, [gutschriftFeld, feld.wurzel]),
      el('div', { 'class': 'navi navi--spiel' }, [
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Zurück', title: 'Zurück',
          onclick: function () {
            sofort();
            if (i > 0) { zustand.duellIndex = i - 1; ctx.gehe('spiel'); }
            else { ctx.gehe('gewichtung'); }
          } }),
        el('button', { 'class': 'knopf knopf--still knopf--klein', text: 'Überspringen',
          title: 'Überspringen – zählt für niemanden',
          onclick: function () { delete zustand.duellAntworten[i]; weiter(); } })
      ])
      ])
    ]);

    buehne.appendChild(abschnitt);
    setzeMitte(ctx, abschnitt, mitte);
    feld.zeichne(gutschrift(zustand, i - 1), false);
    zeichneHinweis();
    /* Erst den Startwert (Stand der vorigen Frage) berechnen lassen, dann den
     * Zielwert setzen - so laeuft der Uebergang vom alten zum neuen Stand,
     * statt von null. Bewusst ohne requestAnimationFrame: der gemerkte Stand
     * soll nicht davon abhaengen, ob ein Bild gezeichnet wurde. */
    void bogen.firstChild.offsetWidth;
    bogenZuletzt = (i + 1) / duelle.length * 100;
    bogen.firstChild.style.width = bogenZuletzt + '%';
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
    var notiz = el('p', { 'class': 'halt-notiz' });
    var wetteBereich = el('div', { 'class': 'wette' });
    var weiter = el('button', { 'class': 'knopf knopf--haupt', text: 'Weiter' });

    weiter.addEventListener('click', function () { ctx.gehe('spiel'); });

    var abschnitt = el('section', { 'class': 'halt' }, [
      el('p', { 'class': 'halt-marke', text: 'Zwischenstand' }),
      el('h1', { 'class': 'halt-titel',
        text: i + ' von ' + zustand.duelle.length + ' Duellen' }),
      notiz,
      el('div', { 'class': 'feld-huelle feld-huelle--halt' }, [feld.wurzel]),
      wetteBereich,
      el('div', { 'class': 'navi navi--spiel' }, [weiter])
    ]);
    buehne.appendChild(abschnitt);

    var reihen = feld.zeichne(i - 1, false);

    /* Die These im Kleinen, mitten im Lauf: Auch dem Programm, dem Sie sonst
     * widersprechen, haben Sie mehrfach recht gegeben.
     *
     * Diese Beobachtung stand früher direkt nach dem Klick im Duell
     * („Überraschung: Das war bisher Ihr Schlusslicht.") und verriet damit,
     * zu welcher Säule der eben gewählte Satz gehört. Hier bezieht sie sich
     * auf ein Dutzend Duelle und nennt weder Buchstaben noch Satz. */
    (function () {
      var letzte = reihen.filter(function (r) { return r.auftritte >= 3; });
      if (letzte.length < 5) { return; }
      var schluss = letzte[letzte.length - 1];
      var treffer = 0;
      for (var k = 0; k < i; k++) {
        var sid = zustand.duellAntworten[k];
        if (!sid) { continue; }
        var dl = zustand.duelle[k];
        var pid = dl.links.id === sid ? dl.links.parteiId : dl.rechts.parteiId;
        if (pid === schluss.id) { treffer++; }
      }
      if (treffer < 2) { return; }
      notiz.textContent = 'Auch dem Programm, das gerade hinten liegt, haben '
        + 'Sie ' + treffer + '× recht gegeben.';
      notiz.classList.add('halt-notiz--an');
    }());

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
    gutschrift: gutschrift,
    WELLE: WELLE,
    parteiName: parteiName,
    FINALE_DUELLE: FINALE_DUELLE,
    BUCHSTABEN: BUCHSTABEN
  };
})(window);
