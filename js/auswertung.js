/* Seite 47 – Auswertung (Schema 2).
 *
 * Antwort je Frage: { beste: aussageId, schlechteste: aussageId }.
 * Der Nutzer wählt aus 3–4 Aussagen zur selben Unterfrage die zustimmungs-
 * fähigste und die ablehnungswürdigste; die übrigen bleiben ungeordnet.
 *
 * Punktwert einer Aussage innerhalb ihrer Frage:
 *   beste = 100, schlechteste = 0, dazwischen = 50.
 *
 * Warum nicht die volle Reihenfolge 1–4: der Aufwand je Frage steigt stark,
 * der Erkenntnisgewinn kaum. Warum keine Zustimmungsskala mehr: Programmsätze
 * sind so formuliert, dass man ihnen schwer widerspricht – die Skala lief auf
 * lauter Zustimmung hinaus und alle Parteien landeten nahe beieinander.
 *
 * Unbeantwortete Fragen zählen für NIEMANDEN – sie fallen ganz heraus, statt
 * mit einem Ersatzwert belegt zu werden. Eine Ersatzannahme wäre hier nicht
 * neutral: sie würde die Parteien einer Frage künstlich gleichziehen.
 *
 * Themenwert einer Partei = Mittel ihrer Punktwerte über die beantworteten
 * Fragen dieses Themas, in denen sie vorkommt. Weil eine Frage nur 3–4 der
 * Parteien zeigt, kommt nicht jede Partei in jeder Frage vor; deshalb wird
 * gemittelt und nicht summiert.
 *
 * Gesamtwert = Σ(gewicht_t × themenwert_{p,t}) / Σ(gewicht_t)
 * über die Themen mit Gewicht > 0, zu denen die Partei mindestens eine
 * beantwortete Frage hat. Die Nenner unterscheiden sich damit bewusst je
 * Partei.
 *
 * Gewicht: stufenlos 0–100. 0 schließt das Thema aus der Abfrage aus.
 */
(function (global) {
  'use strict';

  var BESTE = 100, MITTE = 50, SCHLECHTESTE = 0;

  /* Punktwert einer Aussage innerhalb einer beantworteten Frage. */
  function punkte(aussageId, antwort) {
    if (!antwort) { return null; }
    if (antwort.beste === aussageId) { return BESTE; }
    if (antwort.schlechteste === aussageId) { return SCHLECHTESTE; }
    return MITTE;
  }

  /* Eine Frage zählt erst, wenn beide Enden gesetzt sind – eine halbe Antwort
   * ließe offen, ob die übrigen Aussagen mittelmäßig oder ungelesen sind. */
  function beantwortet(antwort) {
    return !!(antwort && antwort.beste && antwort.schlechteste
      && antwort.beste !== antwort.schlechteste);
  }

  function gewichtWert(gewichte, themaId) {
    var g = gewichte ? gewichte[themaId] : undefined;
    if (typeof g !== 'number' || !isFinite(g) || g < 0) { return 50; }
    return Math.min(100, g);
  }

  /**
   * @param {object} datensatz  Wahl-Datensatz (Schema 2)
   * @param {object} gewichte   { themaId: 0..100 }
   * @param {object} antworten  { frageId: {beste, schlechteste} }
   * @returns {{ranking:Array, themen:Array, offeneFragen:number, fragenGesamt:number}}
   */
  function berechne(datensatz, gewichte, antworten) {
    antworten = antworten || {};
    var offen = 0, gesamt = 0;

    var themen = datensatz.themen.map(function (t) {
      var g = gewichtWert(gewichte, t.id);
      /* Summe und Anzahl je Partei innerhalb dieses Themas. */
      var summe = Object.create(null), anzahl = Object.create(null);

      var fragen = t.fragen.map(function (fr) {
        var antwort = antworten[fr.id] || null;
        var fertig = beantwortet(antwort);
        if (g > 0) {
          gesamt++;
          if (!fertig) { offen++; }
        }
        var werte = fr.aussagen.map(function (a) {
          var w = fertig ? punkte(a.id, antwort) : null;
          if (fertig) {
            summe[a.parteiId] = (summe[a.parteiId] || 0) + w;
            anzahl[a.parteiId] = (anzahl[a.parteiId] || 0) + 1;
          }
          return { parteiId: a.parteiId, aussageId: a.id, wert: w };
        });
        return {
          id: fr.id,
          text: fr.text,
          beantwortet: fertig,
          werte: werte.slice().sort(function (x, y) { return (y.wert || 0) - (x.wert || 0); })
        };
      });

      var werte = Object.keys(anzahl).map(function (pid) {
        return { parteiId: pid, wert: summe[pid] / anzahl[pid], fragen: anzahl[pid] };
      }).sort(function (x, y) { return y.wert - x.wert; });

      return { id: t.id, titel: t.titel, gewicht: g, fragen: fragen, werte: werte };
    });

    var zaehler = Object.create(null), nenner = Object.create(null), themenAnzahl = Object.create(null);
    themen.forEach(function (t) {
      if (t.gewicht <= 0) { return; }
      t.werte.forEach(function (w) {
        zaehler[w.parteiId] = (zaehler[w.parteiId] || 0) + t.gewicht * w.wert;
        nenner[w.parteiId] = (nenner[w.parteiId] || 0) + t.gewicht;
        themenAnzahl[w.parteiId] = (themenAnzahl[w.parteiId] || 0) + 1;
      });
    });

    var ranking = datensatz.parteien.map(function (p) {
      var n = nenner[p.id] || 0;
      return {
        parteiId: p.id,
        prozent: n > 0 ? (zaehler[p.id] / n) : null,
        beruecksichtigteThemen: themenAnzahl[p.id] || 0,
        gewertet: n > 0
      };
    }).filter(function (r) {
      return r.gewertet;
    }).sort(function (a, b) {
      return b.prozent - a.prozent;
    });

    return {
      ranking: ranking,
      themen: themen,
      offeneFragen: offen,
      fragenGesamt: gesamt
    };
  }

  global.S47_AUSWERTUNG = {
    berechne: berechne,
    punkte: punkte,
    beantwortet: beantwortet,
    PUNKTE: { beste: BESTE, mitte: MITTE, schlechteste: SCHLECHTESTE },

    /* Beschriftung der stufenlosen Gewichtung. Der Regler liefert 0–100;
     * 0 ist eine eigene, rastende Stellung und schließt das Thema aus. */
    GEWICHT_MIN: 0,
    GEWICHT_MAX: 100,
    GEWICHT_START: 50,
    gewichtLabel: function (wert) {
      if (wert <= 0) { return 'Nicht wichtig – wird nicht abgefragt'; }
      if (wert < 34) { return 'Etwas wichtig'; }
      if (wert < 67) { return 'Wichtig'; }
      return 'Sehr wichtig';
    }
  };
})(window);
