/* ==========================================================================
   WARRAQ (ورّاق) — Store, Schema Normalization & Data Persistence
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});
  const { T, tr } = Warraq.i18n;

  const KEY = "novelLibrary.v1";
  const VER = 2;
  const LOGO = "assets/logo.svg";

  const THEMES = tr({
    neutral: "Neutral",
    elegant: "Elegant",
    modern: "Modern",
    dark: "Dark mode",
  });

  const STAT = tr({
    unread: "Not started",
    reading: "Reading",
    completed: "Completed",
    hold: "On hold",
    dropped: "Dropped",
  });

  const PUR = tr({
    no: "Not purchased",
    yes: "Purchased",
    gift: "Gift",
    borrowed: "Borrowed",
  });

  const ROLES = tr({
    "": "No special behavior",
    reading: "Marks books as Reading",
    completed: "Marks books as Completed",
    toread: "Counts as Want to Read",
    tobuy: "Counts as Want to Buy",
    hold: "Marks books as On hold",
    dropped: "Marks books as Dropped",
  });

  const DEF_ICONS = [
    "📖", "📚", "✅", "🔖", "🛒", "⏸️", "🚫", "⭐", "🌙", "🔥",
    "🧙", "💌", "🎁", "🔁", "☀️", "🕵️", "🚀", "🌸", "🏆", "🇪🇬"
  ];

  const BK = {
    title: "",
    author: "",
    cover: "",
    desc: "",
    genre: "",
    section: "",
    status: "unread",
    pages: 0,
    page: 0,
    prev: 0,
    year: "",
    publisher: "",
    isbn: "",
    lang: "",
    price: "",
    pdate: "",
    purchase: "no",
    rating: 0,
    notes: "",
    fav: false,
    added: "",
    started: "",
    completed: "",
  };

  const uid = () =>
    Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

  const today = () => new Date().toISOString().slice(0, 10);

  const pct = (b) =>
    b.pages > 0
      ? Math.min(100, Math.round((b.page / b.pages) * 1000) / 10)
      : b.status === "completed"
      ? 100
      : 0;

  const pagesRead = (b) =>
    b.status === "completed" ? b.pages || b.page : b.page;

  function defaults() {
    const mk = (name, icon, color, role, desc) => ({
      id: uid(),
      name,
      icon,
      color,
      role,
      desc,
      nav: true,
      dflt: true,
    });

    const s = [
      mk("Currently Reading", "📖", "#3b82f6", "reading", "Books you are reading right now"),
      mk("Completed Books", "✅", "#16a34a", "completed", "Finished reads"),
      mk("Want to Read", "🔖", "#a855f7", "toread", "Your reading wishlist"),
      mk("Want to Buy", "🛒", "#d97706", "tobuy", "Books to get next"),
      mk("On Hold", "⏸️", "#64748b", "hold", "Paused for now"),
      mk("Dropped / Abandoned", "🚫", "#ef4444", "dropped", "Not for me"),
      mk("Favorites", "⭐", "#ec4899", "", "All-time favorites"),
    ];

    return {
      v: VER,
      sections: s,
      series: [],
      books: [],
      customIcons: [],
      prefs: {
        theme: "neutral",
        view: "grid",
        defSec: s[2].id,
        lang:
          typeof navigator !== "undefined" &&
          navigator.language &&
          navigator.language.startsWith("ar")
            ? "ar"
            : "en",
        digits: "latn",
        sort: "added",
        ssort: "added",
      },
    };
  }

  const DEF = Object.fromEntries(defaults().sections.map((s) => [s.name, s.desc]));

  function normalize(d, warn) {
    if (
      !d ||
      typeof d !== "object" ||
      !Array.isArray(d.sections) ||
      !Array.isArray(d.books)
    ) {
      throw new Error(T("Not a valid library file"));
    }
    warn = warn || {};

    const rawSecs = d.sections.filter(
      (s) => s && typeof s === "object" && s.id && s.name
    );
    const secs = rawSecs.map((s) => ({
      id: String(s.id),
      name: String(s.name).slice(0, 60),
      desc: String(s.desc || "").slice(0, 200),
      icon: String(s.icon || "📖").slice(0, 16),
      color: /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : "#5f8a68",
      nav: s.nav !== false,
      role: ROLES[s.role] !== undefined ? s.role : "",
      dflt: s.dflt !== undefined ? !!s.dflt : DEF[s.name] === s.desc,
    }));
    warn.sections = d.sections.length - rawSecs.length;

    if (!secs.length) throw new Error(T("The file has no sections"));

    const ids = new Set(secs.map((s) => s.id));
    const p = d.prefs || {};
    const defSec = ids.has(p.defSec) ? p.defSec : secs[0].id;

    const rawBooks = d.books.filter(
      (b) => b && typeof b === "object" && String(b.title || "").trim()
    );
    const books = rawBooks.map((b) => {
      const o = { ...BK };
      for (const k in BK) {
        const t = typeof BK[k];
        const v = b[k];
        if (t === "string") o[k] = String(v ?? "");
        else if (t === "number") o[k] = Math.max(0, Number(v) || 0);
        else o[k] = !!v;
      }
      o.id = String(b.id || uid());
      if (!ids.has(o.section)) o.section = defSec;
      if (!STAT[o.status]) o.status = "unread";
      if (!PUR[o.purchase]) o.purchase = "no";
      o.rating = Math.min(5, Math.round(o.rating));
      o.added = o.added || today();
      return o;
    });
    warn.books = d.books.length - rawBooks.length;

    /* series */
    const bset = new Set(books.map((b) => b.id));
    const seenSer = new Set();
    let memBad = 0;
    const series = (Array.isArray(d.series) ? d.series : [])
      .filter((s) => {
        if (
          !s ||
          typeof s !== "object" ||
          !s.id ||
          !String(s.name || "").trim() ||
          seenSer.has(String(s.id))
        )
          return false;
        seenSer.add(String(s.id));
        return true;
      })
      .map((s) => {
        const mem = [];
        const seenMem = new Set();
        (Array.isArray(s.books) ? s.books : []).forEach((m, idx) => {
          if (
            !m ||
            typeof m !== "object" ||
            !m.id ||
            !bset.has(String(m.id)) ||
            seenMem.has(String(m.id))
          ) {
            memBad++;
            return;
          }
          seenMem.add(String(m.id));
          mem.push({ id: String(m.id), ord: Number(m.ord) || idx + 1 });
        });
        mem.sort((a, b) => a.ord - b.ord);
        const sortedMem = mem.map((m, k) => ({ id: m.id, ord: k + 1 }));
        return {
          id: String(s.id),
          name: String(s.name).trim().slice(0, 80),
          desc: String(s.desc || "").slice(0, 300),
          cover: String(s.cover || "").slice(0, 600),
          icon: String(s.icon || "📚").slice(0, 16),
          added: String(s.added || today()).slice(0, 10),
          books: sortedMem,
        };
      });
    warn.series = (Array.isArray(d.series) ? d.series.length : 0) - series.length;
    warn.members = memBad;

    const customIcons = Array.isArray(d.customIcons)
      ? d.customIcons.map((x) => String(x || "").trim().slice(0, 16)).filter(Boolean)
      : [];

    return {
      v: VER,
      sections: secs,
      series,
      books,
      customIcons: Array.from(new Set(customIcons)),
      prefs: {
        theme: THEMES[p.theme] ? p.theme : "neutral",
        view: p.view === "list" ? "list" : "grid",
        defSec,
        lang: p.lang === "ar" ? "ar" : "en",
        digits: p.digits === "ar" ? "ar" : "latn",
        sort: ["added", "az", "rating", "progress"].includes(p.sort)
          ? p.sort
          : "added",
        ssort: p.ssort === "az" ? "az" : "added",
      },
    };
  }

  let recovered = false;

  const Store = {
    load() {
      try {
        const r = localStorage.getItem(KEY);
        if (!r) return defaults();
        return normalize(JSON.parse(r));
      } catch (e) {
        recovered = true;
        try {
          localStorage.setItem(KEY + ".corrupt", localStorage.getItem(KEY) || "");
        } catch (_) {}
        return defaults();
      }
    },
    save() {
      try {
        localStorage.setItem(KEY, JSON.stringify(Warraq.S));
      } catch (e) {
        if (Warraq.toast) {
          Warraq.toast(T("Storage is full or blocked. Export a backup now."));
        }
      }
    },
    isRecovered() {
      return recovered;
    },
  };

  // Export Store and primitives
  Warraq.KEY = KEY;
  Warraq.VER = VER;
  Warraq.LOGO = LOGO;
  Warraq.THEMES = THEMES;
  Warraq.STAT = STAT;
  Warraq.PUR = PUR;
  Warraq.ROLES = ROLES;
  Warraq.DEF_ICONS = DEF_ICONS;
  Warraq.BK = BK;
  Warraq.uid = uid;
  Warraq.today = today;
  Warraq.pct = pct;
  Warraq.pagesRead = pagesRead;
  Warraq.defaults = defaults;
  Warraq.normalize = normalize;
  Warraq.Store = Store;
})(window);
