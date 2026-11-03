/* ==========================================================================
   WARRAQ (ورّاق) — Business Logic Services (Bk, Sec, Ser)
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});
  const { T } = Warraq.i18n;

  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const hue = (t) =>
    [...String(t || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  function allIcons() {
    const custom = (Warraq.S && Warraq.S.customIcons) || [];
    return Array.from(new Set([...custom, ...Warraq.DEF_ICONS]));
  }

  /* ===== Section service ===== */
  const Sec = {
    get: (id) => (Warraq.S.sections || []).find((s) => s.id === id),
    count: (id) => (Warraq.S.books || []).filter((b) => b.section === id).length,
    add(d) {
      const s = {
        id: Warraq.uid(),
        name: T("New section"),
        desc: "",
        icon: "📖",
        color: "#5f8a68",
        nav: true,
        role: "",
        ...d,
      };
      Warraq.S.sections.push(s);
      return s;
    },
    remove(id) {
      const rest = Warraq.S.sections.filter((s) => s.id !== id);
      if (!rest.length) return false;
      if (Warraq.S.prefs.defSec === id) Warraq.S.prefs.defSec = rest[0].id;
      Warraq.S.books.forEach((b) => {
        if (b.section === id) b.section = Warraq.S.prefs.defSec;
      });
      Warraq.S.sections = rest;
      return true;
    },
    shift(id, d) {
      const i = Warraq.S.sections.findIndex((s) => s.id === id);
      const j = i + d;
      if (j < 0 || j >= Warraq.S.sections.length) return;
      [Warraq.S.sections[i], Warraq.S.sections[j]] = [
        Warraq.S.sections[j],
        Warraq.S.sections[i],
      ];
    },
  };

  const roleStatus = {
    reading: "reading",
    completed: "completed",
    hold: "hold",
    dropped: "dropped",
  };

  /* ===== Book service ===== */
  const Bk = {
    get: (id) => (Warraq.S.books || []).find((b) => b.id === id),
    del(id) {
      Warraq.S.books = Warraq.S.books.filter((b) => b.id !== id);
      if (Warraq.S.series) {
        Warraq.S.series.forEach((s) => {
          s.books = (s.books || []).filter((m) => m.id !== id);
          Ser.renum(s);
        });
      }
    },
    complete(b) {
      if (b.status !== "completed") {
        b.prev = b.page; /* remember exact last reading position for undo */
        if (b.pages) b.page = b.pages;
        b.completed = Warraq.today();
        b.started = b.started || Warraq.today();
      }
      b.status = "completed";
    },
    reopen(b, st = "reading") {
      if (b.status !== "completed") return;
      b.status = st; /* undo completion: restore saved position */
      b.page = Math.max(0, Math.min(b.pages || 1e6, b.prev || 0));
      b.completed = "";
    },
    move(id, sid) {
      const b = Bk.get(id);
      const s = Sec.get(sid);
      if (!b || !s) return;
      const was = b.status;
      b.section = sid;
      if (s.role === "completed") {
        Bk.complete(b);
      } else if (roleStatus[s.role]) {
        const r = roleStatus[s.role];
        if (was === "completed") Bk.reopen(b, r);
        else b.status = r;
        if (s.role === "reading") b.started = b.started || Warraq.today();
      }
    },
    finish(b) {
      Bk.complete(b);
      const t = Warraq.S.sections.find((s) => s.role === "completed");
      if (t) b.section = t.id;
    },
    setPage(b, p) {
      b.page = Math.max(0, Math.min(b.pages || 1e6, p));
      if (b.pages && b.page >= b.pages) {
        Bk.finish(b);
        return true;
      }
      if (b.page > 0 && b.status === "unread") {
        b.status = "reading";
        b.started = b.started || Warraq.today();
      }
      return false;
    },
  };

  /* ===== Series service ===== */
  const Ser = {
    get: (id) => (Warraq.S.series || []).find((s) => s.id === id),
    inSeries: (ser, bid) => (ser.books || []).some((m) => m.id === bid),
    sorted(ser) {
      return (ser.books || [])
        .map((m, i) => ({ m, i }))
        .sort(
          (a, b) =>
            (Number(a.m.ord) || 0) - (Number(b.m.ord) || 0) || a.i - b.i
        )
        .map((x) => x.m);
    },
    renum(ser) {
      ser.books = Ser.sorted(ser).map((m, j) => ({ id: m.id, ord: j + 1 }));
    },
    add(ser, bid, pos) {
      if (!Bk.get(bid) || Ser.inSeries(ser, bid)) return false;
      const ms = Ser.sorted(ser);
      const p = Number(pos) || 0;
      if (p >= 1 && p <= ms.length) {
        ms.splice(p - 1, 0, { id: bid, ord: p });
      } else {
        ms.push({ id: bid, ord: ms.length + 1 });
      }
      ser.books = ms.map((m, k) => ({ id: m.id, ord: k + 1 }));
      return true;
    },
    shift(sid, bid, d) {
      const ser = Ser.get(sid);
      if (!ser) return;
      const ms = Ser.sorted(ser);
      const i = ms.findIndex((m) => m.id === bid);
      const j = i + d;
      if (i < 0 || j < 0 || j >= ms.length) return;
      [ms[i], ms[j]] = [ms[j], ms[i]];
      ser.books = ms.map((m, k) => ({ id: m.id, ord: k + 1 }));
    },
    remove(ser, bid) {
      ser.books = (ser.books || []).filter((m) => m.id !== bid);
      Ser.renum(ser);
    },
    stats(ser) {
      const bs = Ser.sorted(ser)
        .map((m) => Bk.get(m.id))
        .filter(Boolean);
      const done = bs.filter((b) => b.status === "completed").length;
      const rd = bs.filter((b) => b.status === "reading").length;
      const pr = bs.reduce((a, b) => a + Warraq.pagesRead(b), 0);
      const tp = bs.reduce(
        (a, b) => a + (b.pages > 0 ? b.pages : Warraq.pagesRead(b)),
        0
      );
      let p = 0;
      if (tp > 0) p = Math.min(100, Math.round((pr / tp) * 1000) / 10);
      else if (bs.length > 0)
        p = Math.min(100, Math.round((done / bs.length) * 1000) / 10);
      if (isNaN(p) || !isFinite(p)) p = 0;
      return {
        total: bs.length,
        done,
        reading: rd,
        unread: bs.length - done - rd,
        prog: p,
        pr,
        tp,
      };
    },
  };

  Warraq.esc = esc;
  Warraq.stars = stars;
  Warraq.hue = hue;
  Warraq.allIcons = allIcons;
  Warraq.Sec = Sec;
  Warraq.Bk = Bk;
  Warraq.Ser = Ser;
})(window);
