/* ==========================================================================
   WARRAQ (ورّاق) — Event Delegation, Actions & Bootstrap
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});
  const { T, nz } = Warraq.i18n;
  const { esc, Sec, Bk, Ser } = Warraq;
  const {
    Store,
    commit,
    toast,
    ask,
    confirmDel,
    render,
    closeForm,
    bookDlg,
    showBook,
    secDlg,
    serDlg,
    pickDlg,
    pickRows,
    results,
    serBody,
    serListAll,
    serRows,
    iconGridHtml,
  } = Warraq;

  const $ = (s, r = document) => r.querySelector(s);

  /* Backup & Export / Import */
  function exportLib() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              app: T("Warraq"),
              exported: new Date().toISOString(),
              ...Warraq.S,
            },
            null,
            1
          ),
        ],
        { type: "application/json" }
      )
    );
    a.download = `warraq-backup-${Warraq.today()}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    toast(T("Backup downloaded"));
  }

  async function importLib(file) {
    let d;
    const skip = { books: 0, sections: 0, series: 0, members: 0 };
    try {
      d = Warraq.normalize(JSON.parse(await file.text()), skip);
    } catch (e) {
      return toast(
        T(
          "Import failed: {0}",
          e instanceof SyntaxError
            ? T("this is not a valid library backup.")
            : e.message
        )
      );
    }
    const bad =
      (skip.books || 0) +
      (skip.sections || 0) +
      (skip.series || 0) +
      (skip.members || 0);
    if (bad) toast(T("Import skipped {0} invalid record(s).", bad));

    const serMsg =
      d.series && d.series.length
        ? ` ${T("This file also contains <b>{0} series</b>.", d.series.length)}`
        : "";

    const r = await ask({
      title: T("Import library"),
      msg:
        T(
          "This file has <b>{0} books</b> and <b>{1} sections</b>. Merge adds only what is missing from your library. Replace deletes your current library first.",
          d.books.length,
          d.sections.length
        ) + serMsg,
      btns: [
        ["merge", T("Merge"), "pri"],
        ["replace", T("Replace"), "dng"],
        ["x", T("Cancel")],
      ],
    });

    if (r.btn === "replace") {
      Warraq.S = d;
    } else if (r.btn === "merge") {
      const sid = new Set(Warraq.S.sections.map((s) => s.id));
      const bid = new Set(Warraq.S.books.map((b) => b.id));
      d.sections.forEach((s) => {
        if (!sid.has(s.id)) Warraq.S.sections.push(s);
      });
      d.books.forEach((b) => {
        if (!bid.has(b.id)) {
          Warraq.S.books.push(b);
          bid.add(b.id);
        }
      });
      if (!Array.isArray(Warraq.S.series)) Warraq.S.series = [];
      d.series.forEach((sr) => {
        const mine = Warraq.S.series.find((s) => s.id === sr.id);
        if (!mine) {
          Warraq.S.series.push({
            id: sr.id,
            name: sr.name,
            desc: sr.desc,
            cover: sr.cover,
            icon: sr.icon,
            added: sr.added,
            books: sr.books.filter((m) => bid.has(m.id)),
          });
        } else {
          sr.books.forEach((m) => {
            if (bid.has(m.id) && !Ser.inSeries(mine, m.id)) {
              mine.books.push({ id: m.id, ord: m.ord });
            }
          });
          Ser.renum(mine);
        }
      });
      if (Array.isArray(d.customIcons)) {
        Warraq.S.customIcons = Array.from(
          new Set([...(Warraq.S.customIcons || []), ...d.customIcons])
        );
      }
    } else {
      return;
    }

    Store.save();
    render();
    toast(T("Library imported"));
  }

  /* Cover Image Canvas Compression */
  function syncCover() {
    const t = $("#dropt");
    if (t) {
      t.textContent = T(
        $("#cvh")?.value ? "Replace cover image" : "Choose a cover image"
      );
    }
  }

  function readCover(file) {
    if (file.size > 8e6) return toast(T("Image too large (max 8 MB)"));
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 400 / im.width);
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * k);
        c.height = Math.round(im.height * k);
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.drawImage(im, 0, 0, c.width, c.height);
          const u = c.toDataURL("image/jpeg", 0.8);
          const cvh = $("#cvh");
          if (cvh) cvh.value = u;
          const cvu = $("#cvu");
          if (cvu) cvu.value = "";
          const p = $("#pv");
          if (p) {
            p.src = u;
            p.hidden = false;
          }
          syncCover();
        }
      };
      im.onerror = () => toast(T("Could not read that image"));
      im.src = r.result;
    };
    r.readAsDataURL(file);
  }

  /* Action Handlers */
  const A = {
    go(t) {
      Warraq.nav(t.dataset.r);
    },
    menu() {
      document.body.classList.toggle("nv-open");
    },
    add(t) {
      const sid =
        t.dataset.ser && Ser.get(t.dataset.ser)
          ? t.dataset.ser
          : Warraq.UI.route.startsWith("ser:") && Ser.get(Warraq.UI.route.slice(4))
          ? Warraq.UI.route.slice(4)
          : "";

      if (t.dataset.act === "add" && Warraq.UI.route === "series" && !sid) {
        return serDlg(null);
      }
      if (sid) return pickDlg(sid);
      bookDlg(
        null,
        t.dataset.sec ||
          (Warraq.UI.route.startsWith("sec:") ? Warraq.UI.route.slice(4) : "")
      );
    },
    open(t) {
      showBook(t.dataset.id);
    },
    edit(t) {
      bookDlg(Bk.get(t.dataset.id));
    },
    close() {
      closeForm();
    },
    view(t) {
      Warraq.S.prefs.view = t.dataset.v;
      commit();
    },
    fav(t) {
      const b = Bk.get(t.dataset.id);
      if (b) {
        b.fav = !b.fav;
        commit();
      }
    },
    done(t) {
      const b = Bk.get(t.dataset.id);
      if (b) {
        Bk.finish(b);
        commit();
        toast(T("Marked as completed 🎉"));
      }
    },
    async page(t) {
      const b = Bk.get(t.dataset.id);
      if (!b) return;
      const r = await ask({
        title: T("Update progress"),
        msg:
          esc(b.title) +
          " (" +
          (b.pages ? T("of {0} pages", b.pages) : T("page number")) +
          ")",
        input: {
          type: "number",
          value: b.page,
          min: 0,
          max: b.pages || "",
        },
        btns: [
          ["ok", T("Save"), "pri"],
          ["x", T("Cancel")],
        ],
      });
      if (r.btn !== "ok") return;
      const fin = Bk.setPage(b, Number(r.val) || 0);
      commit();
      if (fin) toast(T("Finished! Marked as completed 🎉"));
    },
    async del(t) {
      const b = Bk.get(t.dataset.id);
      if (!b) return;
      if (
        await confirmDel(
          T("Delete book?"),
          T("“{0}” will be removed permanently.", esc(b.title))
        )
      ) {
        Bk.del(b.id);
        const dlg = $("#dlg");
        if (dlg) dlg.close();
        commit();
        toast(T("Book deleted"));
      }
    },
    theme(t) {
      Warraq.S.prefs.theme = t.dataset.t;
      commit();
    },
    rmcover() {
      Warraq.UI.dirty = true;
      const cvh = $("#cvh");
      if (cvh) cvh.value = "";
      const cvu = $("#cvu");
      if (cvu) cvu.value = "";
      const cvf = $("#cvf");
      if (cvf) cvf.value = "";
      const pv = $("#pv");
      if (pv) pv.hidden = true;
      syncCover();
    },
    sedit(t) {
      secDlg(t.dataset.id);
    },
    sup(t) {
      Sec.shift(t.dataset.id, -1);
      commit();
    },
    sdn(t) {
      Sec.shift(t.dataset.id, 1);
      commit();
    },
    async sdel(t) {
      const s = Sec.get(t.dataset.id);
      if (!s) return;
      if (Warraq.S.sections.length < 2)
        return toast(T("Keep at least one section"));
      const n = Sec.count(s.id);
      if (
        await confirmDel(
          T("Delete section?"),
          T(
            "“{0}” will be removed. {1}",
            esc(sn(s)),
            n
              ? T("{0} book(s) will move to your default section.", n)
              : T("It has no books.")
          )
        )
      ) {
        if (Warraq.UI.route === "sec:" + s.id) Warraq.UI.route = "set";
        Sec.remove(s.id);
        commit();
      }
    },
    pickicon(t) {
      const v = t.dataset.i;
      const sic = $("#sic");
      if (sic) {
        sic.value = v;
        sic.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const dlg = $("#dlg");
      if (dlg) {
        dlg
          .querySelectorAll('.ic2 [data-act="pickicon"]')
          .forEach((x) =>
            x.setAttribute("aria-pressed", x === t ? "true" : "false")
          );
      }
    },
    addcustomicon() {
      const inp = $("#new_ic") || $("#sic");
      const raw = (inp ? inp.value : "").trim();
      if (!raw) return;
      const val = raw.slice(0, 16);
      if (!Array.isArray(Warraq.S.customIcons)) Warraq.S.customIcons = [];
      if (!Warraq.S.customIcons.includes(val)) {
        Warraq.S.customIcons.unshift(val);
        Store.save();
      }
      const sic = $("#sic");
      if (sic) {
        sic.value = val;
        sic.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const newIc = $("#new_ic");
      if (newIc) newIc.value = "";
      const grid = $("#ic_grid");
      if (grid) grid.innerHTML = iconGridHtml(val);
      toast(T("Icon added!"));
    },
    delcustomicon(t) {
      const val = t.dataset.i;
      if (!val) return;
      Warraq.S.customIcons = (Warraq.S.customIcons || []).filter(
        (x) => x !== val
      );
      Store.save();
      const sic = $("#sic");
      const cur = sic ? sic.value : "";
      const grid = $("#ic_grid");
      if (grid) grid.innerHTML = iconGridHtml(cur);
    },
    export: exportLib,
    import() {
      $("#imp")?.click();
    },
    async reset() {
      if (
        await confirmDel(
          T("Erase everything?"),
          T(
            "All books and sections will be deleted. Export a backup first if unsure."
          )
        )
      ) {
        Warraq.S = Warraq.defaults();
        Warraq.UI.route = "dash";
        Store.save();
        try {
          history.replaceState({ ...Warraq.snap(), depth: 0 }, "");
          Warraq.UI._hj = JSON.stringify(history.state);
        } catch (_) {}
        render();
        toast(T("Library erased"));
      }
    },
    lang(t) {
      Warraq.S.prefs.lang = t.dataset.l;
      commit();
    },
    digits(t) {
      Warraq.S.prefs.digits = t.dataset.d;
      commit();
    },
    /* series */
    sernew() {
      serDlg(null);
    },
    seredit(t) {
      serDlg(t.dataset.id);
    },
    addto(t) {
      pickDlg(t.dataset.ser);
    },
    async serdel(t) {
      const x = Ser.get(t.dataset.id);
      if (!x) return;
      if (
        await confirmDel(
          T("Delete series?"),
          T(
            "“{0}” series will be deleted. Books stay in your library.",
            esc(x.name)
          )
        )
      ) {
        Warraq.S.series = (Warraq.S.series || []).filter((s) => s.id !== x.id);
        Store.save();
        if (Warraq.UI.route.startsWith("ser:")) Warraq.nav("series");
        else render();
        toast(T("Series deleted"));
      }
    },
    pickb(t) {
      const x = Ser.get(t.dataset.ser);
      const bid = t.dataset.bid;
      if (!x || !bid) return;
      if (
        !Ser.add(x, bid, +($("#sepos") ? $("#sepos").value : 0) || 0)
      )
        return;
      Store.save();
      render();
      toast(T("Book added to series"));
      const pl = $("#plist");
      if (pl) pl.innerHTML = pickRows(x);
      const sp = $("#sepos");
      if (sp) {
        sp.value = "";
        sp.max = x.books.length + 1;
        const lb = sp.closest("label");
        if (lb && lb.firstChild)
          lb.firstChild.textContent = T(
            "Position in series (1–{0}, empty = end)",
            x.books.length + 1
          );
      }
    },
    picknew(t) {
      const x = Ser.get(t.dataset.ser);
      if (!x) return;
      Warraq.pendSer = x.id;
      Warraq.pendPos = +($("#sepos") ? $("#sepos").value : 0) || 0;
      const dlg = $("#dlg");
      if (dlg) dlg.close();
      bookDlg(null, "");
    },
    serup(t) {
      Ser.shift(t.dataset.ser, t.dataset.id, -1);
      commit();
    },
    serdn(t) {
      Ser.shift(t.dataset.ser, t.dataset.id, 1);
      commit();
    },
    async rmser(t) {
      const x = Ser.get(t.dataset.ser);
      const b = Bk.get(t.dataset.id);
      if (!x || !b) return;
      if (
        await ask({
          title: T("Remove from series"),
          msg: T(
            "Remove “{0}” from this series? The book stays in your library.",
            esc(b.title)
          ),
          btns: [
            ["ok", T("Remove"), "dng"],
            ["x", T("Cancel")],
          ],
        }).then((r) => r.btn === "ok")
      ) {
        Ser.remove(x, b.id);
        Store.save();
        render();
        toast(T("Book removed from series"));
      }
    },
    back() {
      if (history.state && Number(history.state.depth) > 0) history.back();
    },
    favf(t) {
      Warraq.UI.fav = !Warraq.UI.fav;
      t.setAttribute("aria-pressed", Warraq.UI.fav ? "true" : "false");
      const res = $("#res");
      if (res) res.innerHTML = results();
      Warraq.syncState();
    },
    clrq() {
      Warraq.UI.q = "";
      const q = $("#q");
      if (q) {
        q.value = "";
        q.focus();
      }
      const clr = $(".clr");
      if (clr) clr.hidden = true;
      const res = $("#res");
      if (res) res.innerHTML = results();
      Warraq.syncState();
    },
  };

  /* Event Listeners Binding */
  function bindEvents() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-act]");
      if (!t || t.tagName === "SELECT") return;
      if (t.dataset.act === "menu" || A[t.dataset.act]) {
        e.stopPropagation();
        A[t.dataset.act](t);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target && e.target.id === "new_ic") {
        e.preventDefault();
        A.addcustomicon();
        return;
      }
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.matches("[role=button][data-act]")
      ) {
        e.preventDefault();
        A[e.target.dataset.act](e.target);
      }
    });

    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.name === "status" && t.form && t.form.getAttribute("id") === "bf") {
        const f = t.form;
        const bid = f.querySelector("[name=id]")?.value;
        const ob = bid ? Bk.get(bid) : null;
        const pg = f.querySelector("[name=page]");
        const pgs = +f.querySelector("[name=pages]")?.value || 0;
        if (t.value === "completed") {
          f.wasC = "1";
          if (pgs && +pg.value !== pgs) {
            pg.value = pgs;
            pg.dispatchEvent(new Event("input", { bubbles: true }));
          }
        } else if (ob && ob.status === "completed") {
          pg.value = Math.min(ob.prev || 0, pgs || ob.prev || 0);
          pg.dispatchEvent(new Event("input", { bubbles: true }));
        } else if (f.wasC === "1") {
          const op = +f.op || 0;
          pg.value = Math.min(op, pgs || op);
          pg.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } else if (t.dataset.act === "move") {
        Bk.move(t.dataset.id, t.value);
        commit();
        toast(T("Book moved"));
      } else if (t.dataset.f) {
        if (t.dataset.f === "defSec") {
          Warraq.S.prefs.defSec = t.value;
          commit();
        } else if (t.dataset.f === "defSort") {
          Warraq.S.prefs.sort = Warraq.UI.sort = t.value;
          commit();
          Warraq.syncState();
        } else if (t.dataset.f === "ssort") {
          Warraq.S.prefs.ssort = t.value;
          commit();
        } else {
          Warraq.UI[t.dataset.f] =
            t.type === "checkbox" ? t.checked : t.value;
          const res = $("#res");
          if (res) res.innerHTML = results();
          Warraq.syncState();
        }
      } else if (t.id === "cvf" && t.files[0]) {
        readCover(t.files[0]);
      } else if (t.id === "imp" && t.files[0]) {
        importLib(t.files[0]);
        t.value = "";
      }
    });

    document.addEventListener("input", (e) => {
      const t = e.target;
      if (t.id === "q") {
        Warraq.UI.q = t.value;
        const clr = $(".clr");
        if (clr) clr.hidden = !t.value;
        const res = $("#res");
        if (res) res.innerHTML = results();
        Warraq.syncState();
      } else if (t.id === "sesq") {
        Warraq.UI.q = t.value;
        const q = nz(Warraq.UI.q.trim());
        const c = $("#sres");
        if (c) c.innerHTML = serBody(serListAll(q), q);
      } else if (t.id === "ssq") {
        Warraq.UI.sq = t.value;
        const x =
          Warraq.UI.route.startsWith("ser:") &&
          Ser.get(Warraq.UI.route.slice(4));
        const c = $("#mres");
        if (x && c) c.innerHTML = serRows(x);
      } else if (t.id === "sepq") {
        Warraq.UI.pq = t.value;
        const x = Ser.get(Warraq.UI.pser);
        const pl = $("#plist");
        if (x && pl) pl.innerHTML = pickRows(x);
      } else if (t.id === "scu") {
        const p = $("#spv");
        const u = t.value.trim();
        if (p) {
          p.hidden = !u;
          p.src = u;
        }
      } else if (t.id === "cvu") {
        const cvh = $("#cvh");
        if (cvh) cvh.value = t.value.trim();
        const p = $("#pv");
        if (p) {
          p.hidden = !t.value.trim();
          p.src = t.value.trim();
        }
        syncCover();
      } else if (t.id === "sic") {
        const v = t.value.trim();
        const dlg = $("#dlg");
        if (dlg && dlg.open) {
          dlg
            .querySelectorAll('.ic2 [data-act="pickicon"]')
            .forEach((x) =>
              x.setAttribute(
                "aria-pressed",
                x.dataset.i === v ? "true" : "false"
              )
            );
        }
      }
    });

    document.addEventListener("submit", (e) => {
      const f = e.target;
      const fid = f.getAttribute && f.getAttribute("id");
      if (fid === "bf") {
        e.preventDefault();
        const b = Warraq.saveForm(f);
        if (Warraq.pendSer) {
          const ps = Ser.get(Warraq.pendSer);
          if (ps && !Ser.inSeries(ps, b.id))
            Ser.add(ps, b.id, Warraq.pendPos);
          Warraq.pendSer = null;
          Warraq.pendPos = 0;
        }
        Warraq.UI.open = null;
        Warraq.UI.dirty = false;
        if (history.state && history.state.dlg) {
          history.replaceState({ ...Warraq.snap(), dlg: null }, "");
          Warraq.UI._hj = JSON.stringify(history.state);
        }
        const dlg = $("#dlg");
        if (dlg) dlg.close();
        commit();
        toast(T("Book saved"));
      } else if (fid === "xf") {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(f));
        const x = d.id ? Ser.get(d.id) : null;
        const scu = $("#scu") ? $("#scu").value.trim() : "";
        const ic = (d.icon || "").trim() || "📚";
        if (
          ic &&
          !Warraq.DEF_ICONS.includes(ic) &&
          !(Warraq.S.customIcons || []).includes(ic)
        ) {
          if (!Array.isArray(Warraq.S.customIcons))
            Warraq.S.customIcons = [];
          Warraq.S.customIcons.unshift(ic);
          Store.save();
        }
        const val = {
          name: d.name.trim() || T("Untitled"),
          desc: (d.desc || "").trim(),
          icon: ic,
          cover:
            scu ||
            (x && x.cover && x.cover.startsWith("data:") ? x.cover : ""),
          added: x ? x.added : Warraq.today(),
        };
        if (x) Object.assign(x, val);
        else Warraq.S.series.push({ id: Warraq.uid(), ...val, books: [] });
        const dlg = $("#dlg");
        if (dlg) dlg.close();
        commit();
        toast(T("Series saved"));
      } else if (fid === "sf") {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(f));
        const ic = (d.icon || "").trim() || "📖";
        if (
          ic &&
          !Warraq.DEF_ICONS.includes(ic) &&
          !(Warraq.S.customIcons || []).includes(ic)
        ) {
          if (!Array.isArray(Warraq.S.customIcons))
            Warraq.S.customIcons = [];
          Warraq.S.customIcons.unshift(ic);
          Store.save();
        }
        const s = d.id ? Sec.get(d.id) : Sec.add({});
        const keep =
          s.dflt &&
          d.name.trim() === Warraq.i18n.sn(s) &&
          d.desc.trim() === Warraq.i18n.sd(s);
        const o = [s.name, s.desc];
        Object.assign(s, {
          name: d.name.trim() || T("Untitled"),
          desc: (d.desc || "").trim(),
          icon: ic,
          color: d.color,
          role: d.role,
          nav: !!d.nav,
        });
        if (keep) [s.name, s.desc] = o;
        else s.dflt = false;
        if (d.def) Warraq.S.prefs.defSec = s.id;
        const dlg = $("#dlg");
        if (dlg) dlg.close();
        commit();
        toast(T("Section saved"));
      }
    });

    ["input", "change"].forEach((ev) =>
      document.addEventListener(ev, (e) => {
        if (e.target.closest && e.target.closest("#bf")) {
          Warraq.UI.dirty = true;
        }
      })
    );

    document.addEventListener("input", (e) => {
      const t = e.target;
      if (
        t.form &&
        t.form.getAttribute("id") === "bf" &&
        (t.name === "page" || t.name === "pages")
      ) {
        const f = t.form;
        const pg = +f.pages.value || 0;
        let c = +f.page.value || 0;
        if (pg && c > pg) {
          f.page.value = pg;
          c = pg;
        }
        const v = pg ? Math.min(100, Math.round((c / pg) * 1000) / 10) : 0;
        const fpb = $("#fpb i");
        if (fpb) fpb.style.width = v + "%";
        const fpt = $("#fpt");
        if (fpt) fpt.textContent = Warraq.i18n.nf(v) + "%";
      }
    });

    document.addEventListener("dragover", (e) => {
      const drop = e.target.closest && e.target.closest(".drop");
      if (drop) {
        e.preventDefault();
        drop.classList.add("on");
      }
    });

    document.addEventListener("dragleave", (e) => {
      const drop = e.target.closest && e.target.closest(".drop");
      if (drop) {
        drop.classList.remove("on");
      }
    });

    document.addEventListener("drop", (e) => {
      const drop = e.target.closest && e.target.closest(".drop");
      if (drop) {
        e.preventDefault();
        drop.classList.remove("on");
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) {
          Warraq.UI.dirty = true;
          readCover(f);
        }
      }
    });

    document.addEventListener(
      "error",
      (e) => {
        const i = e.target;
        if (i.tagName !== "IMG") return;
        if (i.dataset.id && Bk.get(i.dataset.id)) {
          i.outerHTML = Warraq.ph(Bk.get(i.dataset.id));
        } else if (i.id === "pv" || i.id === "spv") {
          i.hidden = true;
        }
      },
      true
    );

    document.addEventListener(
      "invalid",
      (e) => e.target.setCustomValidity(T("Please fill out this field.")),
      true
    );
    document.addEventListener("input", (e) => {
      if (e.target.setCustomValidity) e.target.setCustomValidity("");
    });

    const dlg = $("#dlg");
    if (dlg) {
      dlg.addEventListener("close", () => {
        Warraq.UI.open = null;
        Warraq.UI.dirty = false;
        Warraq.UI.pser = "";
        Warraq.UI.pq = "";
      });
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg) closeForm();
      });
      dlg.addEventListener("cancel", (e) => {
        if (Warraq.UI.dirty && dlg.querySelector("#bf")) {
          e.preventDefault();
          closeForm();
        } else {
          Warraq.pendSer = null;
          Warraq.pendPos = 0;
          Warraq.UI.dirty = false;
          if (history.state && history.state.dlg) {
            history.replaceState({ ...Warraq.snap(), dlg: null }, "");
            Warraq.UI._hj = JSON.stringify(history.state);
          }
        }
      });
    }
  }

  /* Initialization */
  function init() {
    Warraq.S = Store.load();
    Warraq.i18n.setLang(Warraq.S.prefs.lang);
    bindEvents();
    render();

    try {
      history.replaceState({ ...Warraq.snap(), depth: 0 }, "");
      Warraq.UI._hj = JSON.stringify(history.state);
    } catch (_) {}

    if (Store.isRecovered()) {
      toast(
        T(
          "Saved data could not be read. A copy was kept and a fresh library started."
        )
      );
    }
  }

  // Export functions
  Warraq.A = A;
  Warraq.exportLib = exportLib;
  Warraq.importLib = importLib;
  Warraq.readCover = readCover;
  Warraq.syncCover = syncCover;
  Warraq.init = init;

  // Auto-boot when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
