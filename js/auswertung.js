/* Seite 47 – Auswertung.
 *
 * Bewertung je Aussage: 'zu' (Zustimmung) | 'ne' (Neutral) | 'ab' (Ablehnung).
 * Punktwert einer Aussage aus Sicht der dahinterstehenden Partei:
 *   Zustimmung = 100, Neutral = 50, Ablehnung = 0.
 * Nicht beantwortete Aussagen zählen wie Neutral (50) – so kann Überspringen
 * keine Partei bevorzugen oder benachteiligen.
 *
 * Themenwert einer Partei = Punktwert ihrer Aussage zu diesem Thema
 * (je Thema höchstens eine Aussage pro Partei; fehlt sie, entfällt das Thema
 *  für diese Partei vollständig).
 *
 * Gesamtwert = Σ(gewicht_t × themenwert_{p,t}) / Σ(gewicht_t)
 * jeweils nur über die Themen, zu denen die Partei eine Position hat und
 * deren Gewicht > 0 ist.
 */
(function (global) {
  'use strict';

  var PUNKTE = { zu: 100, ne: 50, ab: 0 };

  function punkte(bewertung) {
    return Object.prototype.hasOwnProperty.call(PUNKTE, bewertung) ? PUNKTE[bewertung] : 50;
  }

  /**
   * @param {object} datensatz  Wahl-Datensatz
   * @param {object} gewichte   { themaId: 0..3 }
   * @param {object} antworten  { aussageId: 'zu'|'ne'|'ab' }
   * @returns {{ranking:Array, themen:Array}}
   */
  function berechne(datensatz, gewichte, antworten) {
    var themen = datensatz.themen.map(function (t) {
      var g = gewichteWert(gewichte, t.id);
      return {
        id: t.id,
        titel: t.titel,
        gewicht: g,
        werte: t.aussagen.map(function (a) {
          return {
            parteiId: a.parteiId,
            aussageId: a.id,
            bewertung: antworten[a.id] || null,
            wert: punkte(antworten[a.id])
          };
        }).sort(function (x, y) { return y.wert - x.wert; })
      };
    });

    var summe = Object.create(null);
    var gewichtSumme = Object.create(null);
    var themenAnzahl = Object.create(null);

    themen.forEach(function (t) {
      t.werte.forEach(function (w) {
        themenAnzahl[w.parteiId] = (themenAnzahl[w.parteiId] || 0) + 1;
        if (t.gewicht <= 0) { return; }
        summe[w.parteiId] = (summe[w.parteiId] || 0) + t.gewicht * w.wert;
        gewichtSumme[w.parteiId] = (gewichtSumme[w.parteiId] || 0) + t.gewicht;
      });
    });

    var ranking = datensatz.parteien.map(function (p) {
      var gs = gewichtSumme[p.id] || 0;
      return {
        parteiId: p.id,
        prozent: gs > 0 ? (summe[p.id] / gs) : null,
        beruecksichtigteThemen: themenAnzahl[p.id] || 0,
        gewertet: gs > 0
      };
    }).filter(function (r) {
      return r.beruecksichtigteThemen > 0;
    }).sort(function (a, b) {
      if (a.prozent === null && b.prozent === null) { return 0; }
      if (a.prozent === null) { return 1; }
      if (b.prozent === null) { return -1; }
      return b.prozent - a.prozent;
    });

    return { ranking: ranking, themen: themen };
  }

  function gewichteWert(gewichte, themaId) {
    var g = gewichte[themaId];
    return (typeof g === 'number' && g >= 0) ? g : 1;
  }

  global.S47_AUSWERTUNG = {
    berechne: berechne,
    punkte: punkte,
    PUNKTE: PUNKTE,
    BEWERTUNGEN: [
      { id: 'zu', label: 'Zustimmung' },
      { id: 'ne', label: 'Neutral' },
      { id: 'ab', label: 'Ablehnung' }
    ],
    GEWICHTE: [
      { wert: 0, label: 'Nicht wichtig' },
      { wert: 1, label: 'Etwas wichtig' },
      { wert: 2, label: 'Wichtig' },
      { wert: 3, label: 'Sehr wichtig' }
    ]
  };
})(window);
