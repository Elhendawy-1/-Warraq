/* ==========================================================================
   WARRAQ (ورّاق) — History API Router & Navigation State
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});
  const { T } = Warraq.i18n;

  const UI = {
    route: "dash",
    q: "",
    sec: "",
    st: "",
    fav: false,
    sort: "added",
    sq: "",
    pq: "",
    open: null,
    dirty: false,
    _hj: "",
  };

  let pendSer = null;
  let pendPos = 0;

  const snap = () => ({
    route: UI.route,
    q: UI.q || "",
    sec: UI.sec || "",
    st: UI.st || "",
    fav: !!UI.fav,
    sort: UI.sort || "",
    sq: UI.sq || "",
    depth: (history.state && Number(history.state.depth)) || 0,
  });

  function syncHist() {
    const curDepth = (history.state && Number(history.state.depth)) || 0;
    const s = { ...snap(), depth: curDepth + 1 };
    const j = JSON.stringify(s);
    if (UI._hj === j) return;
    UI._hj = j;
    try {
      history.pushState(s, "");
    } catch (_) {}
    updateBack();
  }

  function syncHistDlg(dlgType, did) {
    const curDepth = (history.state && Number(history.state.depth)) || 0;
    const s = { ...snap(), dlg: dlgType, did: did || "", depth: curDepth + 1 };
    const j = JSON.stringify(s);
    if (UI._hj === j) return;
    UI._hj = j;
    try {
      history.pushState(s, "");
    } catch (_) {}
    updateBack();
  }

  function syncState() {
    if (!history.state) return;
    const curDepth = (history.state && Number(history.state.depth)) || 0;
    const s = { ...snap(), depth: curDepth };
    const j = JSON.stringify(s);
    if (UI._hj === j) return;
    UI._hj = j;
    try {
      history.replaceState(s, "");
    } catch (_) {}
  }

  function updateBack() {
    const d = (history.state && Number(history.state.depth)) || 0;
    const show = d > 0;
    const bb = document.getElementById("bb");
    if (bb) bb.hidden = !show;
    document.querySelectorAll(".back-btn").forEach((b) => {
      b.hidden = !show;
    });
  }

  async function applySnap(s) {
    const dlg = document.getElementById("dlg");
    if (dlg && dlg.open && UI.dirty && dlg.querySelector("#bf")) {
      const r = await Warraq.ask({
        title: T("Discard changes?"),
        msg: T("You have unsaved changes. Close without saving?"),
        btns: [
          ["ok", T("Discard"), "dng"],
          ["x", T("Keep editing")],
        ],
      });
      if (r.btn !== "ok") {
        try {
          const curDepth = (history.state && Number(history.state.depth)) || 0;
          const st = { ...snap(), dlg: "edit", depth: curDepth + 1 };
          UI._hj = JSON.stringify(st);
          history.pushState(st, "");
        } catch (_) {}
        return;
      }
    }

    pendSer = null;
    pendPos = 0;
    UI.dirty = false;
    if (dlg && dlg.open) dlg.close();

    try {
      history.replaceState(s, "");
    } catch (_) {}

    Object.assign(UI, {
      route: s.route || "dash",
      q: s.q || "",
      sec: s.sec || "",
      st: s.st || "",
      fav: !!s.fav,
      sort: s.sort || (Warraq.S && Warraq.S.prefs.sort) || "added",
      sq: s.sq || "",
    });

    UI._hj = JSON.stringify(snap());
    Warraq.render();

    if (s.dlg === "show" && s.did && Warraq.Bk.get(s.did)) {
      Warraq.showBook(s.did, true);
    } else if (s.dlg === "edit") {
      Warraq.bookDlg(s.did ? Warraq.Bk.get(s.did) : null, "", true);
    }

    window.scrollTo(0, 0);
    updateBack();
  }

  function nav(r) {
    UI.route = r;
    Object.assign(UI, { q: "", sec: "", st: "", fav: false, sq: "" });
    pendSer = null;
    pendPos = 0;
    document.body.classList.remove("nv-open");
    const dlg = document.getElementById("dlg");
    if (dlg && dlg.open) dlg.close();
    syncHist();
    Warraq.render();
    window.scrollTo(0, 0);
  }

  window.addEventListener("popstate", (e) =>
    applySnap(e.state || { route: "dash", depth: 0 })
  );

  Warraq.UI = UI;
  Warraq.snap = snap;
  Warraq.syncHist = syncHist;
  Warraq.syncHistDlg = syncHistDlg;
  Warraq.syncState = syncState;
  Warraq.updateBack = updateBack;
  Warraq.applySnap = applySnap;
  Warraq.nav = nav;

  Object.defineProperty(Warraq, "pendSer", {
    get: () => pendSer,
    set: (v) => {
      pendSer = v;
    },
  });
  Object.defineProperty(Warraq, "pendPos", {
    get: () => pendPos,
    set: (v) => {
      pendPos = v;
    },
  });
})(window);
