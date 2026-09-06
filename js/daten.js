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

    /* Minimale Schemaprüfung – meldet Verstöße, blockiert aber nicht. */
    pruefe: function (d) {
      var f = [];
      if (!d || typeof d !== 'object') { return ['Kein Objekt.']; }
      ['id', 'name', 'region', 'wahltag'].forEach(function (k) {
        if (!d[k]) { f.push('Feld fehlt: ' + k); }
      });
      if (!Array.isArray(d.parteien) || !d.parteien.length) { f.push('parteien fehlen'); }
      if (!Array.isArray(d.themen) || !d.themen.length) { f.push('themen fehlen'); }
      var parteiIds = Object.create(null);
      (d.parteien || []).forEach(function (p) {
        if (!p.id || !p.name) { f.push('Partei ohne id/name'); }
        if (parteiIds[p.id]) { f.push('Partei doppelt: ' + p.id); }
        parteiIds[p.id] = true;
      });
      var aussageIds = Object.create(null);
      (d.themen || []).forEach(function (t) {
        if (!t.id || !t.titel) { f.push('Thema ohne id/titel'); }
        if (!Array.isArray(t.aussagen) || !t.aussagen.length) { f.push('Thema ohne Aussagen: ' + t.id); return; }
        var proPartei = Object.create(null);
        t.aussagen.forEach(function (a) {
          if (!a.id) { f.push('Aussage ohne id in ' + t.id); }
          if (aussageIds[a.id]) { f.push('Aussage-id doppelt: ' + a.id); }
          aussageIds[a.id] = true;
          if (!parteiIds[a.parteiId]) { f.push('Aussage ' + a.id + ': unbekannte parteiId ' + a.parteiId); }
          if (proPartei[a.parteiId]) { f.push('Thema ' + t.id + ': mehrere Aussagen von ' + a.parteiId); }
          proPartei[a.parteiId] = true;
          if (!a.kurz) { f.push('Aussage ' + a.id + ': kurz fehlt'); }
          if (!a.original) { f.push('Aussage ' + a.id + ': original fehlt'); }
          if (!a.quelle || !a.quelle.datei || !a.quelle.seite || !a.quelle.markierung) {
            f.push('Aussage ' + a.id + ': unvollständige Quelle');
          }
        });
      });
      return f;
    },

    partei: function (datensatz, parteiId) {
      return datensatz.parteien.filter(function (p) { return p.id === parteiId; })[0] || null;
    }
  };

  global.S47_DATA = S47Data;
})(window);
