/* Seite 47 – Duelle: Paarbildung und Wertung (Schema 2, Spielform).
 *
 * WARUM DUELLE STATT RANGFOLGE
 *
 * Die Vorform stellte je Frage 3–4 Aussagen nebeneinander; gewählt wurden die
 * beste und die schlechteste. Zwei Nachteile, die zusammenhängen:
 *
 * 1. Aufwand. Vier Programmabsätze zu lesen und gegeneinander zu ordnen kostet
 *    fast eine Minute. Über zwanzig Fragen ist das Arbeit, kein Spiel – und
 *    die Rückmeldung kam erst ganz am Schluss.
 * 2. Auflösung. Innerhalb einer Frage gab es nur drei Werte (100/50/0), und
 *    jede Partei trat je Thema nur wenige Male an. Ein Themenwert konnte
 *    deshalb bloß 0, 50 oder 100 sein; die Spitze war in 13–27 % der
 *    Durchgänge geteilt.
 *
 * Das Duell behebt beides mit demselben Griff. Zwei Sätze, einer gewinnt –
 * das ist die kleinste mögliche Entscheidung und in Sekunden getroffen. Und
 * weil jede Partei über den Durchgang hinweg in vielen Paarungen antritt,
 * ergibt die Siegquote eine feine, stetige Skala statt dreier Stufen.
 *
 * Die Siegquote ist außerdem direkt lesbar: „In 8 von 11 Duellen, in denen
 * dieses Programm antrat, haben Sie es gewählt." Kein Punktesystem, das man
 * erklären muss.
 *
 * WAS DIE ANONYMITÄT ANGEHT
 *
 * Die Paarung entsteht immer innerhalb EINER Frage – beide Sätze beantworten
 * dieselbe Unterfrage, sonst ist der Vergleich sinnlos (CLAUDE.md Punkt 4).
 * Welche Partei hinter einem Satz steht, steht nur hier im Speicher, nie im
 * DOM.
 */
(function (global) {
  'use strict';

  /* Duelle je Thema aus dem Punktebudget. Der Teiler ist so gewählt, dass das
   * volle Budget immer dieselbe Gesamtzahl ergibt: 100 Punkte / 2,5 = 40
   * Duelle, egal wie verteilt. Das Budget verschiebt also nur die
   * Aufmerksamkeit, es verlängert den Durchgang nie – genau das soll ein
   * Budget tun. */
  var PUNKTE_JE_DUELL = 2.5;

  function duelleFuerPunkte(punkte, vorrat) {
    if (!punkte || punkte <= 0) { return 0; }
    return Math.max(1, Math.min(vorrat, Math.round(punkte / PUNKTE_JE_DUELL)));
  }

  function mische(liste, zufall) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((zufall || Math.random)() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Alle Paare einer Frage. Bei 4 Aussagen sind das 6, bei 3 genau 3. */
  function paareDerFrage(frage) {
    var aus = [];
    for (var i = 0; i < frage.aussagen.length; i++) {
      for (var j = i + 1; j < frage.aussagen.length; j++) {
        aus.push({
          frageId: frage.id,
          frageText: frage.text,
          links: frage.aussagen[i],
          rechts: frage.aussagen[j]
        });
      }
    }
    return aus;
  }

  /* Auswahl innerhalb eines Themas: gierig nach der Partei, die bisher am
   * seltensten angetreten ist. Sonst häuft der Zufall Auftritte, und wer
   * öfter antritt, hat mehr Gelegenheiten – die Siegquote gliche das zwar
   * aus, aber die Zahl dahinter wäre bei manchen Parteien zu dünn, um
   * etwas zu bedeuten. */
  function waehleAusThema(thema, anzahl, zufall) {
    var vorrat = [];
    thema.fragen.forEach(function (fr) {
      paareDerFrage(fr).forEach(function (p) { vorrat.push(p); });
    });
    vorrat = mische(vorrat, zufall);

    var auftritte = Object.create(null);
    var gewaehlt = [];
    while (gewaehlt.length < anzahl && vorrat.length) {
      var bestesI = 0, besteLast = Infinity;
      for (var i = 0; i < vorrat.length; i++) {
        var p = vorrat[i];
        var last = (auftritte[p.links.parteiId] || 0) + (auftritte[p.rechts.parteiId] || 0);
        if (last < besteLast) { besteLast = last; bestesI = i; }
      }
      var nimm = vorrat.splice(bestesI, 1)[0];
      auftritte[nimm.links.parteiId] = (auftritte[nimm.links.parteiId] || 0) + 1;
      auftritte[nimm.rechts.parteiId] = (auftritte[nimm.rechts.parteiId] || 0) + 1;
      gewaehlt.push(nimm);
    }
    return gewaehlt;
  }

  /**
   * Baut den Duellplan eines Durchgangs.
   * @param {object} datensatz
   * @param {object} punkte   themaId -> Punkte
   * @returns {Array} [{themaId, themaTitel, frageId, frageText, links, rechts}]
   */
  function plan(datensatz, punkte, zufall) {
    var alle = [];
    datensatz.themen.forEach(function (t) {
      var vorrat = t.fragen.reduce(function (s, fr) {
        var k = fr.aussagen.length;
        return s + k * (k - 1) / 2;
      }, 0);
      var n = duelleFuerPunkte(punkte ? punkte[t.id] : 0, vorrat);
      waehleAusThema(t, n, zufall).forEach(function (p) {
        /* Seite würfeln: sonst stünde die im Datensatz zuerst genannte Partei
         * immer links, und die Position wäre ein Marker. */
        var dreh = (zufall || Math.random)() < 0.5;
        alle.push({
          themaId: t.id,
          themaTitel: t.titel,
          frageId: p.frageId,
          frageText: p.frageText,
          links: dreh ? p.rechts : p.links,
          rechts: dreh ? p.links : p.rechts
        });
      });
    });

    /* Themen durchmischen, aber nicht die Duelle einer Frage direkt
     * hintereinander: zwei Paare derselben Frage nacheinander wirken wie ein
     * Wiederholungsfehler, obwohl sie verschiedene Sätze zeigen. */
    var gemischt = mische(alle, zufall);
    for (var i = 1; i < gemischt.length; i++) {
      if (gemischt[i].frageId === gemischt[i - 1].frageId) {
        for (var j = i + 1; j < gemischt.length; j++) {
          if (gemischt[j].frageId !== gemischt[i - 1].frageId
              && (j + 1 >= gemischt.length || gemischt[j + 1].frageId !== gemischt[i].frageId)) {
            var t = gemischt[i]; gemischt[i] = gemischt[j]; gemischt[j] = t;
            break;
          }
        }
      }
    }
    return gemischt;
  }

  /**
   * Wertung. Für jede Partei die Siegquote, gewichtet über die Themen.
   *
   * Themenwert = Siege / Auftritte innerhalb dieses Themas.
   * Gesamtwert  = Σ(punkte_t × themenwert_t) / Σ(punkte_t) über die Themen,
   *               in denen die Partei überhaupt angetreten ist.
   *
   * Wie vorher unterscheiden sich die Nenner bewusst je Partei: nicht jede
   * Partei tritt in jedem Thema an, und ein Ersatzwert wäre nicht neutral.
   * Unentschiedene Duelle gibt es nicht – ein übersprungenes Duell zählt für
   * niemanden.
   *
   * @param {object} datensatz
   * @param {Array}  duelle     Plan aus plan()
   * @param {object} antworten  index -> aussageId des Siegers
   * @param {object} punkte     themaId -> Punkte
   */
  function werte(datensatz, duelle, antworten, punkte) {
    antworten = antworten || {};
    var proThema = Object.create(null);   /* themaId -> parteiId -> {siege, auftritte} */
    var gespielt = 0;

    duelle.forEach(function (duell, i) {
      var sieger = antworten[i];
      if (!sieger) { return; }
      gespielt++;
      var t = (proThema[duell.themaId] = proThema[duell.themaId] || Object.create(null));
      [duell.links, duell.rechts].forEach(function (a) {
        var e = (t[a.parteiId] = t[a.parteiId] || { siege: 0, auftritte: 0 });
        e.auftritte++;
        if (a.id === sieger) { e.siege++; }
      });
    });

    var themen = datensatz.themen.map(function (th) {
      var g = punkte && typeof punkte[th.id] === 'number' ? punkte[th.id] : 0;
      var eintraege = proThema[th.id] || Object.create(null);
      var werte = Object.keys(eintraege).map(function (pid) {
        var e = eintraege[pid];
        return {
          parteiId: pid,
          wert: e.auftritte ? (e.siege / e.auftritte) * 100 : null,
          siege: e.siege,
          auftritte: e.auftritte
        };
      }).sort(function (a, b) { return b.wert - a.wert; });
      return { id: th.id, titel: th.titel, gewicht: g, werte: werte };
    });

    var zaehler = Object.create(null), nenner = Object.create(null);
    var siege = Object.create(null), auftritte = Object.create(null);
    themen.forEach(function (t) {
      if (t.gewicht <= 0) { return; }
      t.werte.forEach(function (w) {
        zaehler[w.parteiId] = (zaehler[w.parteiId] || 0) + t.gewicht * w.wert;
        nenner[w.parteiId] = (nenner[w.parteiId] || 0) + t.gewicht;
        siege[w.parteiId] = (siege[w.parteiId] || 0) + w.siege;
        auftritte[w.parteiId] = (auftritte[w.parteiId] || 0) + w.auftritte;
      });
    });

    var ranking = datensatz.parteien.map(function (p) {
      var n = nenner[p.id] || 0;
      return {
        parteiId: p.id,
        prozent: n > 0 ? zaehler[p.id] / n : null,
        siege: siege[p.id] || 0,
        auftritte: auftritte[p.id] || 0,
        gewertet: n > 0
      };
    }).filter(function (r) { return r.gewertet; })
      .sort(function (a, b) { return b.prozent - a.prozent; });

    return {
      ranking: ranking,
      themen: themen,
      gespielt: gespielt,
      duelleGesamt: duelle.length
    };
  }

  /* Laufender Stand während des Spiels – dieselbe Rechnung, aber ohne Themen
   * und ohne Datensatz, damit sie nach jedem Klick billig ist. */
  function standNach(duelle, antworten, bisIndex) {
    var siege = Object.create(null), auftritte = Object.create(null);
    for (var i = 0; i <= bisIndex && i < duelle.length; i++) {
      var sieger = antworten[i];
      if (!sieger) { continue; }
      [duelle[i].links, duelle[i].rechts].forEach(function (a) {
        auftritte[a.parteiId] = (auftritte[a.parteiId] || 0) + 1;
        if (a.id === sieger) { siege[a.parteiId] = (siege[a.parteiId] || 0) + 1; }
      });
    }
    return { siege: siege, auftritte: auftritte };
  }

  global.S47_DUELLE = {
    plan: plan,
    werte: werte,
    standNach: standNach,
    duelleFuerPunkte: duelleFuerPunkte,
    paareDerFrage: paareDerFrage,
    PUNKTE_JE_DUELL: PUNKTE_JE_DUELL
  };
})(window);
