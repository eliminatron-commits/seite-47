/* Seite 47 – Datenschicht.
 * Lädt Wahl-Datensätze. Bewusst OHNE fetch(): unter file:// blockieren Browser
 * XHR/fetch auf lokale Dateien (CORS, Origin "null"). Datensätze werden deshalb
 * per Script-Injection geladen; die Nutzlast in den Dateien ist reines JSON.
 */
(function (global) {
  'use strict';

  var registry = Object.create(null);
  var wartend = Object.create(null);

  var S47Data = {
    /* Wird von data/wahlen/<id>.js aufgerufen. */
    register: function (datensatz) {
      var fehler = S47Data.pruefe(datensatz);
      if (fehler.length) {
        console.error('Ungültiger Datensatz "' + (datensatz && datensatz.id) + '":', fehler);
      }
      registry[datensatz.id] = datensatz;
      var w = wartend[datensatz.id];
      if (w) { delete wartend[datensatz.id]; w.forEach(function (fn) { fn(null, datensatz); }); }
    },

    manifest: function () {
      var m = (global.S47_MANIFEST || []).slice();
      /* Aktuellste Wahl oben. */
      m.sort(function (a, b) { return (a.wahltag < b.wahltag) ? 1 : (a.wahltag > b.wahltag ? -1 : 0); });
      return m;
    },

    eintrag: function (id) {
      return S47Data.manifest().filter(function (e) { return e.id === id; })[0] || null;
    },

    /* callback(fehler, datensatz) */
    lade: function (id, callback) {
      if (registry[id]) { callback(null, registry[id]); return; }
      var eintrag = S47Data.eintrag(id);
      if (!eintrag) { callback(new Error('Unbekannte Wahl: ' + id)); return; }
      if (wartend[id]) { wartend[id].push(callback); return; }
      wartend[id] = [callback];

      var s = document.createElement('script');
      s.src = eintrag.datei;
      s.onerror = function () {
        var w = wartend[id] || []; delete wartend[id];
        w.forEach(function (fn) { fn(new Error('Datensatz nicht ladbar: ' + eintrag.datei)); });
      };
      s.onload = function () {
        if (!registry[id] && wartend[id]) {
          var w = wartend[id]; delete wartend[id];
          w.forEach(function (fn) { fn(new Error('Datei geladen, aber keine Wahl mit id "' + id + '" registriert.')); });
        }
      };
      document.head.appendChild(s);
    },

    /* Schemaprüfung – meldet Verstöße, blockiert aber nicht.
     * Prueft neben der Struktur die Ausgewogenheit: eine Frage zeigt nur 3–4
     * der Parteien, deshalb hängt der Wert einer Partei davon ab, gegen wen
     * sie antritt. Kommt eine Partei innerhalb eines Themas öfter vor als
     * eine andere, steuert allein die Gruppierung das Ergebnis. */
    pruefe: function (d) {
      var f = [];
      if (!d || typeof d !== 'object') { return ['Kein Objekt.']; }
      if (d.schemaVersion !== 2) {
        f.push('schemaVersion ' + d.schemaVersion + ' – erwartet wird 2 (Fragen mit 3–4 Aussagen).');
      }
      ['id', 'name', 'region', 'wahltag'].forEach(function (k) {
        if (!d[k]) { f.push('Feld fehlt: ' + k); }
      });
      if (!Array.isArray(d.parteien) || !d.parteien.length) { f.push('parteien fehlen'); }
      if (!Array.isArray(d.themen) || !d.themen.length) { f.push('themen fehlen'); }

      /* Das Glossar ist freiwillig - eine Wahl ohne Fachwoerter braucht
       * keines. Steht es da, muss es vollstaendig sein: eine Marke ohne
       * Erklaerung waere ein Knopf, der nichts sagt. */
      (d.begriffe || []).forEach(function (b) {
        if (!b || !b.wort) { f.push('Begriff ohne wort'); return; }
        if (!b.erklaerung) { f.push('Begriff ' + b.wort + ': erklaerung fehlt'); }
        if (b.formen && !Array.isArray(b.formen)) {
          f.push('Begriff ' + b.wort + ': formen ist keine Liste');
        }
      });

      var parteiIds = Object.create(null);
      (d.parteien || []).forEach(function (p) {
        if (!p.id || !p.name) { f.push('Partei ohne id/name'); }
        if (parteiIds[p.id]) { f.push('Partei doppelt: ' + p.id); }
        parteiIds[p.id] = true;
      });

      var aussageIds = Object.create(null), frageIds = Object.create(null);
      (d.themen || []).forEach(function (t) {
        if (!t.id || !t.titel) { f.push('Thema ohne id/titel'); }
        if (!Array.isArray(t.fragen) || !t.fragen.length) {
          f.push('Thema ohne Fragen: ' + t.id); return;
        }
        var auftritte = Object.create(null);

        t.fragen.forEach(function (fr) {
          if (!fr.id) { f.push('Frage ohne id in ' + t.id); }
          if (frageIds[fr.id]) { f.push('Frage-id doppelt: ' + fr.id); }
          frageIds[fr.id] = true;
          if (!fr.text) { f.push('Frage ' + fr.id + ': text fehlt'); }
          if (!Array.isArray(fr.aussagen) || fr.aussagen.length < 3 || fr.aussagen.length > 4) {
            f.push('Frage ' + fr.id + ': ' + ((fr.aussagen || []).length)
              + ' Aussagen – erlaubt sind 3 bis 4.');
            if (!Array.isArray(fr.aussagen)) { return; }
          }
          var proPartei = Object.create(null);
          fr.aussagen.forEach(function (a) {
            if (!a.id) { f.push('Aussage ohne id in ' + fr.id); }
            if (aussageIds[a.id]) { f.push('Aussage-id doppelt: ' + a.id); }
            aussageIds[a.id] = true;
            if (!parteiIds[a.parteiId]) { f.push('Aussage ' + a.id + ': unbekannte parteiId ' + a.parteiId); }
            if (proPartei[a.parteiId]) { f.push('Frage ' + fr.id + ': mehrere Aussagen von ' + a.parteiId); }
            proPartei[a.parteiId] = true;
            auftritte[a.parteiId] = (auftritte[a.parteiId] || 0) + 1;
            if (!a.kurz) { f.push('Aussage ' + a.id + ': kurz fehlt'); }
            if (!a.original) { f.push('Aussage ' + a.id + ': original fehlt'); }
            if (!a.quelle || !a.quelle.datei || !a.quelle.seite || !a.quelle.markierung) {
              f.push('Aussage ' + a.id + ': unvollständige Quelle');
            }
          });
        });

        /* Ausgewogenheit je Thema: gleich viele Auftritte, Abweichung 1. */
        var zahlen = Object.keys(auftritte).map(function (k) { return auftritte[k]; });
        if (zahlen.length) {
          var min = Math.min.apply(null, zahlen), max = Math.max.apply(null, zahlen);
          if (max - min > 1) {
            f.push('Thema ' + t.id + ': unausgewogen – eine Partei kommt ' + max
              + '-mal vor, eine andere nur ' + min + '-mal.');
          }
        }
      });
      return f;
    },

    /* Diagnose für die Werkzeuge: Auftritte je Partei und wie oft zwei
     * Parteien zusammen in einer Frage stehen. Ungleiche Paarungen sind kein
     * Fehler, aber ein Hinweis darauf, dass die Rotation nachgebessert
     * gehört – wer ständig neben derselben Partei steht, wird an ihr
     * gemessen statt am ganzen Feld. */
    ausgewogenheit: function (d) {
      var auftritte = Object.create(null), paare = Object.create(null), fragen = 0;
      (d.themen || []).forEach(function (t) {
        (t.fragen || []).forEach(function (fr) {
          fragen++;
          var ids = (fr.aussagen || []).map(function (a) { return a.parteiId; });
          ids.forEach(function (a, i) {
            auftritte[a] = (auftritte[a] || 0) + 1;
            ids.slice(i + 1).forEach(function (b) {
              var k = [a, b].sort().join('+');
              paare[k] = (paare[k] || 0) + 1;
            });
          });
        });
      });
      return { fragen: fragen, auftritte: auftritte, paare: paare };
    },

    partei: function (datensatz, parteiId) {
      return datensatz.parteien.filter(function (p) { return p.id === parteiId; })[0] || null;
    },

    /* Maskiert Parteinamen in Aussagetexten, solange nicht aufgedeckt ist.
     * Nötig, weil Originalzitate die eigene Partei nennen ("Die AfD fordert",
     * "Wir Freie Demokraten", "Das BSW will"). Welche Namen zu maskieren sind,
     * steht im Datensatz (name + alias) – nicht im App-Code. */
    maske: function (datensatz) {
      if (datensatz._maske) { return datensatz._maske; }
      var namen = [];
      datensatz.parteien.forEach(function (p) {
        namen.push(p.name);
        (p.alias || []).forEach(function (a) { namen.push(a); });
      });
      /* Längere Namen zuerst, damit "Die Linke" vor "Linke" greift. */
      namen.sort(function (a, b) { return b.length - a.length; });
      var teile = namen.map(function (n) {
        return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
      });
      datensatz._maske = new RegExp('(^|[^\\wÄÖÜäöüß])(' + teile.join('|')
        + ')(?![\\wÄÖÜäöüß])', 'gi');
      return datensatz._maske;
    },

    /* Ersetzt Parteinamen durch einen neutralen Platzhalter. */
    anonymisiere: function (datensatz, text) {
      return String(text).replace(S47Data.maske(datensatz), '$1[Partei]');
    }
  };

  global.S47_DATA = S47Data;
})(window);
