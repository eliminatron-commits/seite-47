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

  /* ---------- Punktebudget ----------
   * Der stufenlose Regler liess jedes Thema gleichzeitig "sehr wichtig" sein,
   * und wo alles wichtig ist, wiegt nichts. Das Budget erzwingt die Abwaegung,
   * die die Wahl selbst auch erzwingt: 10 Punkte je Thema als Vorrat,
   * Schrittweite 5, Obergrenze 30 je Thema. Gleichverteilung ist die
   * Startlage.
   *
   * Die Obergrenze verhindert, dass ein einziges Thema das ganze Budget
   * bindet und die Gesamtwertung auf wenige Duelle zusammenschnurrt.
   */
  /* ---------- Gewicht und Laenge ----------
   * Vorgaenger war ein Punktebudget: 90 Punkte in Fuenferschritten auf die
   * Themen verteilen, bis die Kasse auf null steht. Das war eine
   * Rechenaufgabe mit Restbetrag, und der Nutzer hat es als unfertig
   * empfunden. Ersetzt durch zwei Fragen, die jeder in Sekunden beantwortet:
   *
   *   1. Wie lange? -> Tiefe je Thema (UMFAENGE)
   *   2. Worauf kommt es an? -> hoechstens SCHWERPUNKT_MAX Schwerpunkte
   *
   * Das Gewicht bleibt eine Zahl, weil die Wertung damit rechnet (werte()):
   * abgewaehlt 0, normal 10, Schwerpunkt 20. Nur eingegeben wird sie nicht
   * mehr.
   *
   * Der Grundsatz von vorher gilt weiter: Die Gewichtung verschiebt nur, wo
   * genauer gefragt wird, sie verlaengert den Durchgang nie. Deshalb haengt
   * die Gesamtzahl allein an der Tiefe und der Zahl der aktiven Themen. */
  var GEWICHT_NORMAL = 10, GEWICHT_SCHWERPUNKT = 20, SCHWERPUNKT_MAX = 3;

  /* Unter drei Duellen je Thema bricht die Trennschaerfe ein (gemessen in
   * .claude/pruefe_duelle.js), deshalb ist die kuerzeste Stufe 3 und nicht
   * weniger. MINDEST_TIEFE ist die Untergrenze fuer ein einzelnes Thema,
   * wenn Schwerpunkte Duelle abziehen - zwei Duelle sagen ueber ein Thema
   * wenig, aber das Thema ist dann bewusst Nebensache.
   *
   * OBERGRENZE deckelt die Gesamtzahl. Gemessen brauchte ein Testnutzer je
   * Duell rund eine halbe Minute; Tiefe x Themen allein lief damit bei zehn
   * gewaehlten Themen auf ueber zwanzig Minuten hinaus. Wer viele Themen
   * waehlt, bekommt deshalb nicht laenger, sondern je Thema duenner - und
   * unterhalb des Deckels faellt der Boden auf ein Duell, sonst liesse sich
   * die Zahl gar nicht einhalten. */
  var UMFAENGE = [
    { id: 'kurz', name: 'Zügig', tiefe: 3, obergrenze: 18 },
    { id: 'normal', name: 'Normal', tiefe: 4, obergrenze: 28 },
    { id: 'gruendlich', name: 'Gründlich', tiefe: 5, obergrenze: 38 }
  ];
  var MINDEST_TIEFE = 2;

  /* Ein Wort statt einer Zahl: Im Ergebnis und im PDF steht, wie das Thema
   * gewichtet war - "20 Punkte" sagt nach dem Umbau niemandem mehr etwas. */
  function gewichtLabel(gewicht) {
    if (!gewicht) { return 'Wird nicht abgefragt'; }
    return gewicht >= GEWICHT_SCHWERPUNKT ? 'Schwerpunkt' : 'Normal gewichtet';
  }

  /* Nichts ist vorgewaehlt. Vorher waren alle Themen an, und der Nutzer
   * musste abwaehlen, was ihn nicht angeht - erwartungsgemaess tat das
   * niemand, und jeder Durchgang lief ueber alle zehn Themen. Wer aktiv
   * waehlt, waehlt weniger, und das ist zugleich der ehrlichste Zeitregler.
   * baue_pdf.js braucht dagegen ein volles Feld: dafuer alleGewichte(). */
  function startGewichte(datensatz) {
    var g = Object.create(null);
    datensatz.themen.forEach(function (t) { g[t.id] = 0; });
    return g;
  }

  function alleGewichte(datensatz) {
    var g = Object.create(null);
    datensatz.themen.forEach(function (t) { g[t.id] = GEWICHT_NORMAL; });
    return g;
  }

  function tiefeVon(umfangId) {
    for (var i = 0; i < UMFAENGE.length; i++) {
      if (UMFAENGE[i].id === umfangId) { return UMFAENGE[i].tiefe; }
    }
    return 4;
  }

  function vorratVonThema(t) {
    return t.fragen.reduce(function (summe, fr) {
      var k = fr.aussagen.length;
      return summe + k * (k - 1) / 2;
    }, 0);
  }

  function obergrenzeVon(umfangId) {
    for (var i = 0; i < UMFAENGE.length; i++) {
      if (UMFAENGE[i].id === umfangId) { return UMFAENGE[i].obergrenze; }
    }
    return 28;
  }

  /**
   * Verteilt die Duelle des Durchgangs auf die Themen.
   * Gesamtzahl = Tiefe x aktive Themen, hoechstens aber die Obergrenze des
   * Umfangs; innerhalb davon proportional zum Gewicht, mit MINDEST_TIEFE als
   * Boden (im gedeckelten Fall 1) und dem Vorrat des Themas als Deckel. Der
   * Rest wird nach groesstem Bruchteil vergeben.
   * @returns {{proThema: object, gesamt: number}}
   */
  function verteile(datensatz, gewichte, umfangId) {
    var tiefe = tiefeVon(umfangId);
    var ergebnis = Object.create(null);
    var aktiv = [];
    datensatz.themen.forEach(function (t) {
      ergebnis[t.id] = 0;
      if (gewichte && gewichte[t.id] > 0) { aktiv.push(t); }
    });
    if (!aktiv.length) { return { proThema: ergebnis, gesamt: 0 }; }

    var ziel = tiefe * aktiv.length;
    var grenze = obergrenzeVon(umfangId);
    var boden = MINDEST_TIEFE;
    if (ziel > grenze) { ziel = grenze; boden = 1; }
    var summe = 0;
    aktiv.forEach(function (t) { summe += gewichte[t.id]; });

    var reste = [], vergeben = 0;
    aktiv.forEach(function (t) {
      var soll = ziel * gewichte[t.id] / summe;
      var deckel = vorratVonThema(t);
      var n = Math.max(boden, Math.floor(soll));
      if (n > deckel) { n = deckel; }
      ergebnis[t.id] = n;
      vergeben += n;
      reste.push({ id: t.id, rest: soll - Math.floor(soll), deckel: deckel });
    });
    reste.sort(function (a, b) { return b.rest - a.rest; });

    var i, vorher;
    while (vergeben < ziel) {
      vorher = vergeben;
      for (i = 0; i < reste.length && vergeben < ziel; i++) {
        if (ergebnis[reste[i].id] < reste[i].deckel) { ergebnis[reste[i].id]++; vergeben++; }
      }
      if (vergeben === vorher) { break; }          /* alles am Deckel */
    }
    while (vergeben > ziel) {
      vorher = vergeben;
      for (i = reste.length - 1; i >= 0 && vergeben > ziel; i--) {
        if (ergebnis[reste[i].id] > boden) { ergebnis[reste[i].id]--; vergeben--; }
      }
      if (vergeben === vorher) { break; }          /* alles am Boden */
    }
    return { proThema: ergebnis, gesamt: vergeben };
  }

  /* ---------- Geglaettete Siegquote ----------
   * Die rohe Quote Siege/Auftritte behandelt 1 aus 1 wie 5 aus 5 - und im
   * laufenden Spiel fuehrte damit regelmaessig ein Programm mit einem
   * einzigen Auftritt vor einem mit fuenf. Das ist keine Rundungsfrage,
   * sondern eine falsche Aussage: aus einem Duell laesst sich nichts
   * ableiten.
   *
   * Deshalb ein halber Sieg und eine halbe Niederlage als Vorannahme
   * (Laplace-Glaettung mit k = 1). Wer nichts vorzuweisen hat, steht bei
   * 50 % und damit in der Mitte; mit jedem weiteren Duell zaehlt das
   * Tatsaechliche mehr und die Vorannahme weniger.
   *
   *   1 aus 1 -> 75 %     4 aus 4 -> 90 %     3 aus 5 -> 58 %
   *   0 aus 1 -> 25 %     0 aus 4 -> 10 %     2 aus 5 -> 42 %
   *
   * Die Glaettung deckelt zugleich die Extreme: 100 % kaeme sonst schon
   * nach einem Duell zustande und behauptete eine Sicherheit, die die
   * Daten nicht hergeben.
   */
  var VORANNAHME = 1;

  function quote(siege, auftritte) {
    if (!auftritte) { return null; }
    return (siege + VORANNAHME / 2) / (auftritte + VORANNAHME) * 100;
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
   * seltensten angetreten ist. Der Zaehler wird von aussen hereingereicht
   * und ueber ALLE Themen weitergefuehrt - waere er je Thema neu, glichen
   * sich die Auftritte nur innerhalb eines Themas aus und liefen ueber den
   * Durchgang auseinander. Gemessen wurde genau das: nach 13 Duellen war
   * eine Partei neunmal angetreten und eine andere einmal.
   */
  function waehleAusThema(thema, anzahl, auftritte, zufall) {
    var vorrat = [];
    thema.fragen.forEach(function (fr) {
      paareDerFrage(fr).forEach(function (p) { vorrat.push(p); });
    });
    vorrat = mische(vorrat, zufall);

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

  /* Reihenfolge des fertigen Plans.
   *
   * Nicht einfach mischen: Das Feld zeigt waehrend des Spiels einen
   * laufenden Stand, und der ist nur brauchbar, wenn die Parteien auch
   * ZWISCHENDURCH ungefaehr gleich oft angetreten sind. Ein gemischter Plan
   * ist am Ende ausgewogen und mittendrin schief - dort fuehrte dann ein
   * Programm mit einem einzigen Auftritt das Feld an.
   *
   * Deshalb gierig auffaedeln: als naechstes kommt immer das Duell, dessen
   * beide Parteien bisher am seltensten dran waren. Zwei Nebenbedingungen:
   * nicht zweimal dieselbe Frage hintereinander (das wirkt wie ein
   * Wiederholungsfehler) und moeglichst nicht zweimal dasselbe Thema.
   */
  function faedle(alle, zufall) {
    var offen = mische(alle, zufall);
    var gereiht = [];
    var auftritte = Object.create(null);

    while (offen.length) {
      var bestesI = -1, bestesMass = null;
      var vorige = gereiht[gereiht.length - 1];

      for (var i = 0; i < offen.length; i++) {
        var k = offen[i];
        var last = (auftritte[k.links.parteiId] || 0) + (auftritte[k.rechts.parteiId] || 0);
        var strafe = 0;
        if (vorige && k.frageId === vorige.frageId) { strafe += 100; }
        if (vorige && k.themaId === vorige.themaId) { strafe += 4; }
        var mass = last * 10 + strafe;
        if (bestesMass === null || mass < bestesMass) { bestesMass = mass; bestesI = i; }
      }

      var nimm = offen.splice(bestesI, 1)[0];
      auftritte[nimm.links.parteiId] = (auftritte[nimm.links.parteiId] || 0) + 1;
      auftritte[nimm.rechts.parteiId] = (auftritte[nimm.rechts.parteiId] || 0) + 1;
      gereiht.push(nimm);
    }
    return gereiht;
  }

  /**
   * Baut den Duellplan eines Durchgangs.
   * @param {object} datensatz
   * @param {object} punkte   themaId -> Punkte
   * @returns {Array} [{themaId, themaTitel, frageId, frageText, links, rechts}]
   */
  function plan(datensatz, punkte, zufall, umfangId) {
    var alle = [];
    var auftritte = Object.create(null);
    var verteilung = verteile(datensatz, punkte, umfangId).proThema;

    /* Themen in zufaelliger Reihenfolge abarbeiten: wer zuerst drankommt,
     * darf bei gleichem Zaehlerstand zuerst waehlen, und das soll nicht
     * immer dasselbe Thema sein. */
    mische(datensatz.themen, zufall).forEach(function (t) {
      waehleAusThema(t, verteilung[t.id] || 0, auftritte, zufall).forEach(function (p) {
        /* Seite wuerfeln: sonst stuende die im Datensatz zuerst genannte
         * Partei immer links, und die Position waere ein Marker. */
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

    return faedle(alle, zufall);
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
          wert: quote(e.siege, e.auftritte),
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

  /* ---------- Das Finale ----------
   * Am Ende der Sichtung stehen zwei Kandidaten vorn. Statt das Ergebnis
   * einfach hinzuschreiben, laeuft es aus: bis zu fuenf Duelle nur zwischen
   * diesen beiden, gleiche Unterfrage, direkt gegeneinander.
   *
   * Das ersetzt den frueheren Stichentscheid, der nur bei knappem Ausgang
   * kam und deshalb meistens ausfiel. Ein Hoehepunkt, der in drei von vier
   * Durchgaengen nicht stattfindet, ist keiner. Ausserdem misst der direkte
   * Vergleich genau da nach, wo es zaehlt - und ein Duell zwischen den
   * beiden Erstplatzierten ist die schaerfste Frage, die die Daten hergeben.
   *
   * @param {Array} gespielt  bereits gespielter Plan (wird nicht wiederholt)
   */
  function finale(datensatz, ersterId, zweiterId, gespielt, anzahl, zufall) {
    var belegt = Object.create(null);
    (gespielt || []).forEach(function (duell) {
      belegt[duell.links.id + '|' + duell.rechts.id] = true;
      belegt[duell.rechts.id + '|' + duell.links.id] = true;
    });

    var treffer = [];
    datensatz.themen.forEach(function (t) {
      t.fragen.forEach(function (fr) {
        var va = null, vb = null;
        fr.aussagen.forEach(function (x) {
          if (x.parteiId === ersterId) { va = x; }
          if (x.parteiId === zweiterId) { vb = x; }
        });
        if (!va || !vb) { return; }
        if (belegt[va.id + '|' + vb.id]) { return; }
        treffer.push({
          themaId: t.id, themaTitel: t.titel,
          frageId: fr.id, frageText: fr.text,
          links: va, rechts: vb, finale: true
        });
      });
    });

    /* Reicht der frische Vorrat nicht, duerfen bereits gespielte Paarungen
     * wieder ran - im Finale ist die Wiederholung kein Fehler, sondern eine
     * zweite Gelegenheit; die Antwort darf sich unterscheiden. */
    if (treffer.length < anzahl) {
      (gespielt || []).forEach(function (duell) {
        var ids = [duell.links.parteiId, duell.rechts.parteiId];
        if (ids.indexOf(ersterId) > -1 && ids.indexOf(zweiterId) > -1) {
          treffer.push({
            themaId: duell.themaId, themaTitel: duell.themaTitel,
            frageId: duell.frageId, frageText: duell.frageText,
            links: duell.links, rechts: duell.rechts, finale: true
          });
        }
      });
    }

    return mische(treffer, zufall).slice(0, anzahl).map(function (x) {
      var dreh = (zufall || Math.random)() < 0.5;
      return {
        themaId: x.themaId, themaTitel: x.themaTitel,
        frageId: x.frageId, frageText: x.frageText,
        links: dreh ? x.rechts : x.links,
        rechts: dreh ? x.links : x.rechts,
        finale: true
      };
    });
  }

  global.S47_DUELLE = {
    GEWICHT_NORMAL: GEWICHT_NORMAL,
    GEWICHT_SCHWERPUNKT: GEWICHT_SCHWERPUNKT,
    SCHWERPUNKT_MAX: SCHWERPUNKT_MAX,
    startGewichte: startGewichte,
    alleGewichte: alleGewichte,
    verteile: verteile,
    plan: plan,
    finale: finale,
    werte: werte,
    standNach: standNach,
    gewichtLabel: gewichtLabel,
    UMFAENGE: UMFAENGE,
    tiefeVon: tiefeVon,
    quote: quote,
    VORANNAHME: VORANNAHME,
    paareDerFrage: paareDerFrage,
    faedle: faedle
  };
})(window);
