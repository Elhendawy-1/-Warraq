/* ==========================================================================
   WARRAQ (ورّاق) — UI Views, Templates & Dialogs
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});
  const { T, nf, fd, sn, sd, nz, loc, getLang, setLang } = Warraq.i18n;
  const { esc, stars, hue, allIcons, Sec, Bk, Ser } = Warraq;
  const { pct, pagesRead, Store } = Warraq;

  const $ = (s, r = document) => r.querySelector(s);

  /* SVG Icons Dictionary */
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    heart:
      '<path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
    upload: '<path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 19V5"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H6"/>',
    note: '<path d="M5 3h14v18H5zM9 8h6M9 12h6M9 16h3"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
  };

  const ico = (p) =>
    `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  /* Toast Notification */
  function toast(m) {
    const t = document.createElement("div");
    t.textContent = m;
    const cont = $("#toast");
    if (cont) {
      cont.append(t);
      setTimeout(() => t.remove(), 3200);
    }
  }

  /* Modal Question / Dialog */
  function ask({ title, msg, btns, input }) {
    return new Promise((res) => {
      const c = $("#cfm");
      if (!c) return res({ btn: "x" });
      const safeMsg = String(msg ?? "")
        .replace(/[&<>"']/g, (ch) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[ch]))
        .replace(/&lt;(\/?)b&gt;/g, "<$1b>");
      c.innerHTML = `<form method="dialog" class="db">
        <h2 style="margin-top:0">${esc(title)}</h2>
        <p class="mut">${safeMsg}</p>
        ${
          input
            ? `<input id="cin" type="${input.type || "text"}" value="${esc(
                input.value ?? ""
              )}" min="${input.min ?? ""}" max="${
                input.max ?? ""
              }" aria-label="${esc(title)}" style="margin-top:12px">`
            : ""
        }
        <div class="acts">${btns
          .map(
            ([v, t, c2]) =>
              `<button class="btn ${c2 || ""}" value="${v}">${esc(t)}</button>`
          )
          .join("")}</div>
      </form>`;
      c.onclose = () => res({ btn: c.returnValue || "x", val: $("#cin", c)?.value });
      c.returnValue = "";
      c.showModal();
    });
  }

  const confirmDel = (title, msg) =>
    ask({
      title,
      msg,
      btns: [
        ["ok", T("Delete"), "dng"],
        ["x", T("Cancel")],
      ],
    }).then((r) => r.btn === "ok");

  /* Custom Accessible Dropdowns Enhancer */
  function enhanceSelects(container = document) {
    if (!container) return;
    const selects = container.querySelectorAll(
      "select:not([data-custom-enhanced])"
    );
    selects.forEach((sel) => {
      sel.setAttribute("data-custom-enhanced", "1");

      const wrap = document.createElement("div");
      wrap.className = "c-select";
      if (sel.dataset.f) wrap.dataset.f = sel.dataset.f;
      if (sel.name) wrap.dataset.name = sel.name;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "c-select-trigger";
      btn.setAttribute("role", "combobox");
      btn.setAttribute("aria-haspopup", "listbox");
      btn.setAttribute("aria-expanded", "false");

      const ariaLabel =
        sel.getAttribute("aria-label") ||
        sel.closest("label")?.firstChild?.textContent?.trim() ||
        "";
      if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);

      const labelSpan = document.createElement("span");
      labelSpan.className = "c-select-label";

      const arrowSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      arrowSvg.setAttribute("class", "c-select-arrow");
      arrowSvg.setAttribute("viewBox", "0 0 20 20");
      arrowSvg.setAttribute("fill", "none");
      arrowSvg.setAttribute("stroke", "currentColor");
      arrowSvg.setAttribute("stroke-width", "2");
      arrowSvg.setAttribute("stroke-linecap", "round");
      arrowSvg.setAttribute("stroke-linejoin", "round");
      arrowSvg.setAttribute("aria-hidden", "true");
      arrowSvg.innerHTML = '<path d="m5 7.5 5 5 5-5"/>';

      btn.append(labelSpan, arrowSvg);

      const menu = document.createElement("ul");
      menu.className = "c-select-menu";
      menu.setAttribute("role", "listbox");
      menu.setAttribute("tabindex", "-1");

      function syncOptions() {
        menu.innerHTML = "";
        const currentVal = String(sel.value ?? "");
        let matchedText = "";

        Array.from(sel.options).forEach((opt) => {
          const isSel = String(opt.value) === currentVal;
          if (isSel && !matchedText) matchedText = opt.text;

          const li = document.createElement("li");
          li.className = "c-select-opt" + (isSel ? " is-selected" : "");
          li.setAttribute("role", "option");
          li.setAttribute("data-val", opt.value);
          li.setAttribute("aria-selected", isSel ? "true" : "false");
          li.setAttribute("tabindex", "-1");

          const textSpan = document.createElement("span");
          textSpan.className = "c-opt-text";
          textSpan.textContent = opt.text;

          const checkSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          checkSvg.setAttribute("class", "c-opt-check");
          checkSvg.setAttribute("viewBox", "0 0 20 20");
          checkSvg.setAttribute("fill", "currentColor");
          checkSvg.setAttribute("aria-hidden", "true");
          checkSvg.innerHTML =
            '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>';

          li.append(textSpan, checkSvg);

          li.addEventListener("click", (e) => {
            e.stopPropagation();
            const newVal = li.dataset.val;
            if (sel.value !== newVal) {
              sel.value = newVal;
              sel.dispatchEvent(new Event("change", { bubbles: true }));
              sel.dispatchEvent(new Event("input", { bubbles: true }));
            }
            closeMenu();
            syncOptions();
            btn.focus({ preventScroll: true });
          });

          menu.appendChild(li);
        });

        labelSpan.textContent =
          matchedText ||
          (sel.selectedOptions && sel.selectedOptions[0]?.text) ||
          (sel.options[0]?.text || "");
      }

      function openMenu() {
        document.querySelectorAll(".c-select.is-open").forEach((el) => {
          if (el !== wrap) {
            el.classList.remove("is-open", "opens-up");
            el.querySelector(".c-select-trigger")?.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        });

        wrap.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");

        // Dynamic positioning detection: open upwards if near bottom
        const rect = wrap.getBoundingClientRect();
        const dlgParent = wrap.closest("dialog, .db");
        const bottomEdge = dlgParent
          ? dlgParent.getBoundingClientRect().bottom
          : window.innerHeight;
        const topEdge = dlgParent ? dlgParent.getBoundingClientRect().top : 0;
        const spaceBelow = bottomEdge - rect.bottom;
        const spaceAbove = rect.top - topEdge;

        if (spaceBelow < 220 && spaceAbove > spaceBelow) {
          wrap.classList.add("opens-up");
        } else {
          wrap.classList.remove("opens-up");
        }

        const selectedLi = menu.querySelector(".c-select-opt.is-selected");
        if (selectedLi && menu.scrollHeight > menu.clientHeight) {
          menu.scrollTop = selectedLi.offsetTop - menu.offsetTop;
        }
      }

      function closeMenu() {
        wrap.classList.remove("is-open", "opens-up");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (wrap.classList.contains("is-open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!wrap.classList.contains("is-open")) {
            openMenu();
            const activeLi =
              menu.querySelector(".c-select-opt.is-selected") ||
              menu.firstElementChild;
            activeLi?.focus();
          }
        } else if (e.key === "Escape") {
          closeMenu();
        }
      });

      menu.addEventListener("keydown", (e) => {
        const active = document.activeElement;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = active?.nextElementSibling || menu.firstElementChild;
          next?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = active?.previousElementSibling || menu.lastElementChild;
          prev?.focus();
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeMenu();
          btn.focus();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (active && active.classList.contains("c-select-opt")) {
            active.click();
          }
        }
      });

      sel.addEventListener("change", syncOptions);

      syncOptions();
      wrap.append(btn, menu);
      sel.parentNode.insertBefore(wrap, sel.nextSibling);
    });
  }

  // Global listeners for closing dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".c-select")) {
      document.querySelectorAll(".c-select.is-open").forEach((el) => {
        el.classList.remove("is-open", "opens-up");
        el.querySelector(".c-select-trigger")?.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".c-select.is-open").forEach((el) => {
        el.classList.remove("is-open", "opens-up");
        el.querySelector(".c-select-trigger")?.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    }
  });

  function openDlg(h) {
    const dlg = $("#dlg");
    if (!dlg) return;
    dlg.innerHTML = `<div class="db">${h}</div>`;
    enhanceSelects(dlg);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    dlg.scrollLeft = 0;
    if (!dlg._scrollBound) {
      dlg._scrollBound = true;
      dlg.addEventListener("scroll", () => {
        dlg.scrollTop = 0;
        dlg.scrollLeft = 0;
      });
    }
  }

  function commit() {
    Store.save();
    render();
    const dlg = $("#dlg");
    if (Warraq.UI.open && dlg && dlg.open) {
      Bk.get(Warraq.UI.open) ? showBook(Warraq.UI.open, true) : dlg.close();
    }
  }

  /* Rendering Helpers */
  const ph = (b) =>
    `<div class="cv ph" style="--h:${hue(b.title)}" role="img" aria-label="${T(
      "No cover for {0}",
      esc(b.title)
    )}"><span>${esc(b.title)}</span></div>`;

  const coverH = (b) =>
    b.cover
      ? `<img class="cv" src="${esc(b.cover)}" data-id="${b.id}" alt="${T(
          "Cover of {0}",
          esc(b.title)
        )}" loading="lazy">`
      : ph(b);

  const progBar = (b, p) =>
    `<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${T(
      "Reading progress {0}%",
      p
    )}"><i style="width:${p}%"></i></div>`;

  function card(b) {
    const s = Sec.get(b.section);
    const p = pct(b);
    const show = b.pages > 0 && (b.status === "reading" || p > 0);
    return `<div class="card bk" role="button" tabindex="0" data-act="open" data-id="${
      b.id
    }">
      ${coverH(b)}
      <div class="bi">
        <h3 dir="auto">${esc(b.title)}${
      b.fav
        ? ` <span title="${T("Favorite")}" aria-label="${T(
            "Favorite"
          )}" style="color:#ef4444">♥</span>`
        : ""
    }</h3>
        <p dir="auto" class="mut sm">${esc(b.author || T("Unknown author"))}</p>
        ${
          b.rating
            ? `<p class="st" aria-label="${T("{0} of 5 stars", b.rating)}">${stars(
                b.rating
              )}</p>`
            : ""
        }
        ${show ? progBar(b, p) : ""}
        <p class="mut sm">
          ${
            s
              ? `<span class="dot" style="background:${s.color}"></span>${esc(
                  sn(s)
                )} · `
              : ""
          }${Warraq.STAT[b.status]}${show ? ` · ${nf(p)}%` : ""}
        </p>
        <p class="ex mut sm">${esc(
          [b.genre, b.pages ? T("{0} pages", b.pages) : ""].filter(Boolean).join(" · ")
        )}</p>
      </div>
    </div>`;
  }

  const bars = (a) => {
    const m = Math.max(1, ...a.map((x) => x[1]));
    return `<div class="bars card" role="img" aria-label="${T(
      "Books completed per month"
    )}">${a
      .map(
        ([l, v]) =>
          `<div><b>${nf(v)}</b><i style="height:${
            (v / m) * 80
          }%"></i><span>${l}</span></div>`
      )
      .join("")}</div>`;
  };

  function months(n) {
    const a = [];
    const d = new Date();
    d.setDate(1);
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const k =
        x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0");
      a.push([
        x.toLocaleString(getLang() === "ar" ? loc() : undefined, {
          month: "short",
        }),
        (Warraq.S.books || []).filter(
          (b) => b.status === "completed" && (b.completed || "").slice(0, 7) === k
        ).length,
      ]);
    }
    return a;
  }

  const strip = (a, t) =>
    a.length ? `<h2>${t}</h2><div class="grid">${a.map(card).join("")}</div>` : "";

  const byAdded = (a) =>
    a
      .map((b, i) => [b, i])
      .sort(
        (x, y) =>
          (y[0].added || "").localeCompare(x[0].added || "") || y[1] - x[1]
      )
      .map((x) => x[0]);

  const backBtnHtml = () => {
    if (Warraq.UI.route === "dash") return "";
    const d = (history.state && Number(history.state.depth)) || 0;
    return d > 0
      ? `<button type="button" class="btn ib back-btn" data-act="back" aria-label="${T(
          "Back"
        )}" title="${T("Back")}">${ico(IC.back)}</button>`
      : "";
  };

  /* Icon Grid Helpers */
  function iconGridHtml(cur) {
    const list = allIcons();
    const customSet = new Set((Warraq.S && Warraq.S.customIcons) || []);
    return list
      .map((i) => {
        const isCustom = customSet.has(i);
        const isPressed = i === cur;
        return `<span class="ic-btn-wrap"><button type="button" data-act="pickicon" data-i="${esc(
          i
        )}" aria-pressed="${isPressed}" aria-label="Icon ${esc(i)}" title="${esc(
          i
        )}">${esc(i)}</button>${
          isCustom
            ? `<button type="button" class="del-ic-btn" data-act="delcustomicon" data-i="${esc(
                i
              )}" title="${T("Remove icon")}" aria-label="${T(
                "Remove icon"
              )}">×</button>`
            : ""
        }</span>`;
      })
      .join("");
  }

  function iconPickerHtml(cur) {
    const curIcon = cur || "📚";
    return `<div class="wide icon-picker-section">
      <label style="font-weight:600;margin-bottom:8px;display:block">${T(
        "Icon"
      )}</label>
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <input name="icon" id="sic" class="cur-icon-input" maxlength="16" dir="auto" value="${esc(
          curIcon
        )}" placeholder="📚" aria-label="${T(
      "Selected icon"
    )}" title="${T(
      "Selected icon - you can type or paste any emoji/text here"
    )}">
        <div style="display:flex;gap:6px;flex:1;min-width:200px">
          <input id="new_ic" type="text" dir="auto" maxlength="16" placeholder="${T(
            "Add custom icon or emoji…"
          )}" aria-label="${T("Add custom icon")}">
          <button type="button" class="btn sm" data-act="addcustomicon" title="${T(
            "Add icon to list"
          )}">＋ ${T("Add")}</button>
        </div>
      </div>
      <div class="mut sm" style="margin-bottom:6px">${T(
        "Or choose from available icons:"
      )}</div>
      <div class="ic2" id="ic_grid">${iconGridHtml(curIcon)}</div>
    </div>`;
  }

  /* Series Tile */
  const serTile = (x, cls) => {
    const hh = hue(x.name);
    return x.cover
      ? `<span class="${cls}" style="--h:${hh}"><img src="${esc(
          x.cover
        )}" alt="${T("Cover of {0}", esc(x.name))}" loading="lazy"></span>`
      : `<span class="${cls}" style="--h:${hh};background:hsl(${hh} 32% 88%);color:hsl(${hh} 40% 35%)"><span aria-hidden="true">${esc(
          x.icon || "📚"
        )}</span></span>`;
  };

  /* Navigation Sidebar */
  function renderNav() {
    const it = (r, i, t, c) =>
      `<button class="nv" data-act="go" data-r="${r}" ${
        Warraq.UI.route === r ? 'aria-current="page"' : ""
      }><span aria-hidden="true">${i}</span><span dir="auto">${esc(t)}</span>${
        c != null ? `<em>${nf(c)}</em>` : ""
      }</button>`;

    const navEl = $("#nav");
    if (!navEl) return;
    navEl.innerHTML =
      it("dash", "🏠", T("Dashboard")) +
      it("lib", "📚", T("My Library"), Warraq.S.books.length) +
      it("series", "📑", T("Book Series"), (Warraq.S.series || []).length) +
      `<div class="sh">${T("Sections")}</div>` +
      Warraq.S.sections
        .filter((s) => s.nav)
        .map((s) => it("sec:" + s.id, s.icon, sn(s), Sec.count(s.id)))
        .join("") +
      `<div class="sh">${T("More")}</div>` +
      it("stats", "📊", T("Statistics")) +
      it("set", "⚙️", T("Settings"));
  }

  /* Views: Dashboard */
  function dash() {
    const B = Warraq.S.books || [];
    const rd = B.filter((b) => b.status === "reading");
    const done = B.filter((b) => b.status === "completed");
    const role = (r) => B.filter((b) => Sec.get(b.section)?.role === r).length;
    const pr = B.reduce((a, b) => a + pagesRead(b), 0);
    const tp = B.reduce((a, b) => a + (b.pages || 0), 0);
    const op = tp ? Math.min(100, Math.round((pr / tp) * 100)) : 0;

    const st = [
      [T("Total books"), B.length],
      [T("Currently reading"), rd.length],
      [T("Completed"), done.length],
      [T("Want to read"), role("toread")],
      [T("Want to buy"), role("tobuy")],
      [T("Favorites"), B.filter((b) => b.fav).length],
      [T("Pages read"), pr],
    ];

    return `<div class="hd">${backBtnHtml()}<div><h1>${T(
      "Welcome back"
    )}</h1><p class="mut">${T(
      "Your reading life at a glance."
    )}</p></div><button class="btn pri" data-act="add">${T(
      "＋ Add book"
    )}</button></div>
    <div class="stats">${st
      .map(
        ([l, v]) =>
          `<div class="card stat"><b>${nf(v)}</b><span class="mut sm">${l}</span></div>`
      )
      .join("")}</div>
    <h2>${T("Reading progress overview")}</h2>
    <div class="card" style="padding:16px">${progBar(
      {},
      op
    )}<p class="sm mut" style="margin-top:6px">${T(
      "{0} of {1} pages across books with a page count ({2}%)",
      pr,
      tp,
      op
    )}</p></div>
    <h2>${T("Continue reading")}</h2>
    ${
      rd.length
        ? `<div class="row2">${rd
            .map((b) => {
              const p = pct(b);
              return `<div class="card cr"><div style="flex:none;width:64px;cursor:pointer" data-act="open" data-id="${
                b.id
              }">${coverH(b)}</div><div><h3 dir="auto">${esc(
                b.title
              )}</h3><p dir="auto" class="mut sm">${esc(b.author)}</p>${progBar(
                b,
                p
              )}<p class="sm mut">${T(
                "Page {0} of {1} · {2}%",
                b.page,
                b.pages || "?",
                p
              )}</p><button class="btn sm" style="margin-top:8px" data-act="page" data-id="${
                b.id
              }">${T("Update progress")}</button></div></div>`;
            })
            .join("")}</div>`
        : `<div class="card empty"><p class="mut">${T(
            "Nothing in progress. Start a book from your library."
          )}</p></div>`
    }
    ${strip(byAdded(B).slice(0, 6), T("Recently added"))}
    ${strip(
      [...done]
        .sort((a, b) => (b.completed || "").localeCompare(a.completed || ""))
        .slice(0, 6),
      T("Recently completed")
    )}
    <h2>${T("Reading activity")}</h2>${bars(months(6))}
    <h2>${T("Sections")}</h2><div class="row2">${Warraq.S.sections
      .map(
        (s) =>
          `<button class="sc" data-act="go" data-r="sec:${
            s.id
          }"><span class="big" style="background:${s.color}22;color:${
            s.color
          }">${s.icon}</span><span><b dir="auto">${esc(
            sn(s)
          )}</b><br><span class="mut sm">${T(
            "{0} books",
            Sec.count(s.id)
          )}</span></span></button>`
      )
      .join("")}</div>`;
  }

  /* Views: Library */
  function lib(sid) {
    const s = sid && Sec.get(sid);
    const o = (v, t, sel) =>
      `<option value="${v}" ${sel ? "selected" : ""}>${esc(t)}</option>`;

    return `<div class="hd">${backBtnHtml()}${
      s
        ? `<span class="big" style="background:${s.color}22;color:${s.color}">${s.icon}</span>`
        : ""
    }<div><h1 dir="auto">${
      s ? esc(sn(s)) : T("My Library")
    }</h1><p class="mut">${
      s ? esc(sd(s)) : T("Every book you own, want or love.")
    }</p></div><button class="btn pri" data-act="add" data-sec="${
      sid || ""
    }">${T("＋ Add book")}</button></div>
    <div class="bar2" role="search">
      <div class="srch">${ico(
        IC.search
      )}<input id="q" type="search" dir="auto" placeholder="${T(
      "Search title, author or genre"
    )}" aria-label="${T("Search books")}" value="${esc(
      Warraq.UI.q
    )}"><button type="button" class="clr" data-act="clrq" aria-label="${T(
      "Clear search"
    )}" ${Warraq.UI.q ? "" : "hidden"}>${ico(IC.x)}</button></div>
      <div class="grp" role="group" aria-label="${T("Filters")}">${
      sid
        ? ""
        : `<select data-f="sec" aria-label="${T("Filter by section")}">${o(
            "",
            T("All sections")
          )}${Warraq.S.sections
            .map((x) => o(x.id, sn(x), Warraq.UI.sec === x.id))
            .join("")}</select>`
    }
      <select data-f="st" aria-label="${T("Filter by status")}">${o(
      "",
      T("Any status")
    )}${Object.entries(Warraq.STAT)
      .map(([k, v]) => o(k, v, Warraq.UI.st === k))
      .join("")}</select>
      <button type="button" class="chip" data-act="favf" aria-pressed="${
        Warraq.UI.fav
      }">${ico(IC.heart)}${T("Favorites")}</button></div>
      <div class="grp"><select data-f="sort" aria-label="${T("Sort by")}">${SORTS()
      .map(([k, v]) => o(k, v, Warraq.UI.sort === k))
      .join("")}</select>
      <div class="seg" role="group" aria-label="${T(
        "View"
      )}"><button data-act="view" data-v="grid" aria-pressed="${
      Warraq.S.prefs.view === "grid"
    }" aria-label="${T("Grid view")}">${ico(
      IC.grid
    )}</button><button data-act="view" data-v="list" aria-pressed="${
      Warraq.S.prefs.view === "list"
    }" aria-label="${T("List view")}">${ico(IC.list)}</button></div></div>
    </div>
    <div id="res" aria-live="polite">${results()}</div>`;
  }

  function results() {
    const sid = Warraq.UI.route.startsWith("sec:")
      ? Warraq.UI.route.slice(4)
      : "";
    const q = nz(Warraq.UI.q.trim());
    let a = byAdded(Warraq.S.books || []);
    const total = sid ? a.filter((b) => b.section === sid).length : a.length;
    if (sid) a = a.filter((b) => b.section === sid);
    else if (Warraq.UI.sec) a = a.filter((b) => b.section === Warraq.UI.sec);
    if (q) a = a.filter((b) => [b.title, b.author, b.genre].some((x) => nz(x).includes(q)));
    if (Warraq.UI.st) a = a.filter((b) => b.status === Warraq.UI.st);
    if (Warraq.UI.fav) a = a.filter((b) => b.fav);
    if (Warraq.UI.sort === "az") a.sort((x, y) => x.title.localeCompare(y.title));
    else if (Warraq.UI.sort === "rating") a.sort((x, y) => y.rating - x.rating);
    else if (Warraq.UI.sort === "progress") a.sort((x, y) => pct(y) - pct(x));

    if (!a.length) {
      const s = sid && Sec.get(sid);
      return total || (!sid && Warraq.S.books.length)
        ? `<div class="card empty"><h2>${T(
            "No matching books"
          )}</h2><p class="mut">${T(
            "Try a different search or clear the filters."
          )}</p></div>`
        : `<div class="card empty"><h2>${T(
            "Your reading journey starts here."
          )}</h2><p class="mut">${
            s
              ? T("Nothing in “{0}” yet.", esc(sn(s)))
              : T("Your library is empty.")
          } ${T(
            "Add your first book."
          )}</p><button class="btn pri" data-act="add" data-sec="${sid}">${T(
            "＋ Add book"
          )}</button></div>`;
    }
    return `<div class="${
      Warraq.S.prefs.view === "list" ? "list" : "grid"
    }">${a.map(card).join("")}</div>`;
  }

  /* Views: Series */
  function serListAll(q) {
    let a = [...(Warraq.S.series || [])];
    if (Warraq.S.prefs.ssort === "az")
      a.sort((x, y) => x.name.localeCompare(y.name));
    else
      a.sort(
        (x, y) =>
          (y.added || "").localeCompare(x.added || "") ||
          (Warraq.S.series || []).indexOf(x) - (Warraq.S.series || []).indexOf(y)
      );
    if (q) a = a.filter((s) => nz(s.name + " " + (s.desc || "")).includes(q));
    return a;
  }

  function serList() {
    const q = nz(Warraq.UI.q.trim());
    const body = serBody(serListAll(q), q);
    return `<div class="hd">${backBtnHtml()}<div><h1>${T(
      "Book Series"
    )}</h1><p class="mut">${T(
      "Track your multi-book sagas in reading order."
    )}</p></div><button class="btn pri" data-act="sernew">＋ ${T(
      "New series"
    )}</button></div>
    <div class="bar2" role="search">
      <div class="srch">${ico(
        IC.search
      )}<input id="sesq" type="search" dir="auto" placeholder="${T(
      "Search series"
    )}" aria-label="${T("Search series")}" value="${esc(Warraq.UI.q)}"></div>
      <div class="grp"><select data-f="ssort" aria-label="${T(
        "Sort series"
      )}">${[
      ["added", T("Newest added")],
      ["az", T("A to Z")],
    ]
      .map(
        ([k, v]) =>
          `<option value="${k}" ${
            Warraq.S.prefs.ssort === k ? "selected" : ""
          }>${esc(v)}</option>`
      )
      .join("")}</select></div>
    </div>
    <div id="sres" aria-live="polite">${body}</div>`;
  }

  function serBody(a, q) {
    return a.length
      ? a
          .map((s) => {
            const st = Ser.stats(s);
            return `<div class="srow" role="button" tabindex="0" data-act="go" data-r="ser:${
              s.id
            }">
        ${serTile(s, "srt")}<span class="grow"><b dir="auto">${esc(
              s.name
            )}</b>
        ${
          s.desc
            ? `<span class="mut sm" dir="auto" style="display:block">${esc(
                s.desc
              )}</span>`
            : ""
        }
        <span class="mut sm">${T("{0} books", st.total)} · ${T(
              "Completed"
            )} ${nf(st.done)} · ${T("Currently reading")} ${nf(
              st.reading
            )}</span>
        <div style="margin-top:6px;max-width:260px">${progBar(
          {},
          st.prog
        )}</div></span>
        <b class="pos" style="width:auto;padding:0 10px">${nf(st.prog)}%</b></div>`;
          })
          .join("")
      : `<div class="card empty"><h2>${
          q ? T("No matching series") : T("No series yet")
        }</h2><p class="mut">${
          q
            ? T("Try a different search or clear the filters.")
            : T("Track your multi-book sagas in reading order.")
        }</p>${
          q
            ? ""
            : `<button class="btn pri" data-act="sernew">${T(
                "New series"
              )}</button>`
        }</div>`;
  }

  function serRows(x) {
    const ms = Ser.sorted(x);
    const q = nz((Warraq.UI.sq || "").trim());
    const all = ms.map((m) => Bk.get(m.id)).filter(Boolean);
    const posOf = {};
    all.forEach((b, i) => {
      posOf[b.id] = i;
    });
    let rows = all.filter(
      (b) => !q || [b.title, b.author].some((v) => nz(v).includes(q))
    );
    if (!rows.length)
      return `<div class="card empty"><h2>${
        q ? T("No matching books") : T("This series is empty")
      }</h2><p class="mut">${
        q
          ? T("Try a different search or clear the filters.")
          : T("Add the first book to start tracking progress.")
      }</p>${
        q
          ? ""
          : `<button class="btn pri" data-act="add" data-ser="${x.id}">＋ ${T(
              "Add book to series"
            )}</button>`
      }</div>`;

    return rows
      .map((b) => {
        const p = pct(b);
        const show = b.pages > 0 && (b.status === "reading" || p > 0);
        const i = posOf[b.id];
        return `<div class="srow"><b class="pos" title="${T(
          "Position in series (1–{0}, empty = end)",
          all.length
        )}">${nf(i + 1)}</b>
        ${
          b.cover
            ? `<span class="srt"><img src="${esc(
                b.cover
              )}" alt="" loading="lazy"></span>`
            : `<span class="srt" style="--h:${hue(
                b.title
              )}"><span aria-hidden="true">📖</span></span>`
        }
        <span class="grow" role="button" tabindex="0" data-act="open" data-id="${
          b.id
        }"><b dir="auto">${esc(b.title)}</b><br>
        <span class="mut sm">${Warraq.STAT[b.status]}${
          b.pages ? `<br>${T("Page {0} of {1} · {2}%", b.page, b.pages, p)}` : ""
        }</span>
        ${show ? progBar(b, p) : ""}</span>
        <span class="mctl"><button class="btn sm" data-act="serup" data-ser="${
          x.id
        }" data-id="${b.id}" ${
          i ? "" : "disabled"
        } aria-label="${T(
          "Move {0} up",
          esc(b.title)
        )}">▲</button><button class="btn sm" data-act="serdn" data-ser="${
          x.id
        }" data-id="${b.id}" ${
          i < all.length - 1 ? "" : "disabled"
        } aria-label="${T(
          "Move {0} down",
          esc(b.title)
        )}">▼</button><button class="btn sm dng" data-act="rmser" data-ser="${
          x.id
        }" data-id="${b.id}" aria-label="${T(
          "Remove from series"
        )}">✕</button></span></div>`;
      })
      .join("");
  }

  function serView(x) {
    const st = Ser.stats(x);
    const ms = Ser.sorted(x);
    return `<div class="hd">${backBtnHtml()}<div style="max-width:920px">
    <div class="sv">${serTile(x, "big")}<div class="grow"><h1 dir="auto" style="margin:0">${esc(
      x.name
    )}</h1>
    ${x.desc ? `<p class="mut" dir="auto">${esc(x.desc)}</p>` : ""}
    <div class="chips"><span class="chip2">${T(
      "{0} books",
      st.total
    )}</span><span class="chip2">${T("Completed")} ${nf(
      st.done
    )}</span><span class="chip2">${T("Currently reading")} ${nf(
      st.reading
    )}</span><span class="chip2">${Warraq.STAT.unread} ${nf(
      st.unread
    )}</span></div></div></div></div></div>
    <div class="acts" style="justify-content:flex-start;margin-top:12px"><button class="btn pri" data-act="add" data-ser="${
      x.id
    }">＋ ${T("Add book to series")}</button><button class="btn" data-act="seredit" data-id="${
      x.id
    }">${T("Edit")}</button><button class="btn dng" data-act="serdel" data-id="${
      x.id
    }">${T("Delete")}</button></div>
    <h2>${T("Series progress")}</h2><div class="card" style="padding:16px">${progBar(
      {},
      st.prog
    )}<p class="sm mut" style="margin-top:6px">${T(
      "Across this series: {0} of {1} pages read ({2}%)",
      st.pr,
      st.tp,
      st.prog
    )}</p></div>
    <h2>${T("Books in series")}${
      ms.length ? ` <span class="mut sm">(${ms.length})</span>` : ""
    }</h2>
    <div class="bar2" role="search" style="margin-bottom:12px"><div class="srch">${ico(
      IC.search
    )}<input id="ssq" type="search" dir="auto" placeholder="${T(
      "Filter by title or author"
    )}" aria-label="${T("Filter by title or author")}" value="${esc(
      Warraq.UI.sq || ""
    )}"></div></div>
    <div id="mres" aria-live="polite">${serRows(x)}</div>`;
  }

  /* Views: Statistics */
  function stats() {
    const B = Warraq.S.books || [];
    const done = B.filter((b) => b.status === "completed");
    const rated = B.filter((b) => b.rating);
    const g = {};
    B.forEach((b) => {
      const k = (b.genre || "").trim() || T("No genre");
      g[k] = (g[k] || 0) + 1;
    });
    const gs = Object.entries(g)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const gm = gs[0] ? gs[0][1] : 1;
    const spent = B.reduce((a, b) => a + (parseFloat(b.price) || 0), 0);
    const st = [
      [T("Total books"), B.length],
      [T("Completed"), done.length],
      [T("Pages read"), B.reduce((a, b) => a + pagesRead(b), 0)],
      [
        T("Average rating"),
        rated.length
          ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1)
          : "–",
      ],
      [T("Total spent"), spent ? spent.toFixed(2) : "–"],
    ];

    return `<div class="hd">${backBtnHtml()}<div><h1>${T(
      "Statistics"
    )}</h1><p class="mut">${T("Calculated live from your library.")}</p></div></div>
    <div class="stats">${st
      .map(
        ([l, v]) =>
          `<div class="card stat"><b>${nf(v)}</b><span class="mut sm">${l}</span></div>`
      )
      .join("")}</div>
    <h2>${T("Books completed, last 12 months")}</h2>${bars(months(12))}
    <h2>${T("By status")}</h2><div class="card" style="padding:14px">${Object.entries(
      Warraq.STAT
    )
      .map(([k, v]) => {
        const n = B.filter((b) => b.status === k).length;
        return `<div class="hb"><span>${v}</span>${progBar(
          {},
          B.length ? Math.round((n / B.length) * 100) : 0
        )}<b>${nf(n)}</b></div>`;
      })
      .join("")}</div>
    <h2>${T("By genre")}</h2><div class="card" style="padding:14px">${
      gs.length
        ? gs
            .map(
              ([k, n]) =>
                `<div class="hb"><span>${esc(k)}</span>${progBar(
                  {},
                  Math.round((n / gm) * 100)
                )}<b>${nf(n)}</b></div>`
            )
            .join("")
        : `<p class="mut">${T("Add books to see genres.")}</p>`
    }</div>`;
  }

  /* Views: Settings */
  function settings() {
    const sw = {
      neutral: "#5f8a68",
      elegant: "#b8588a",
      modern: "#1f3a64",
      dark: "#8fb7ff",
    };
    const set = (l, d, c) =>
      `<div class="set"><div><b>${T(l)}</b>${
        d ? `<p class="mut sm">${T(d)}</p>` : ""
      }</div><div class="ctl">${c}</div></div>`;
    const scCard = (ic, ti, ds, body) =>
      `<section class="sc2"><header><span class="ci">${ic}</span><div><h2>${T(
        ti
      )}</h2><p class="mut sm">${T(ds)}</p></div></header>${body}</section>`;
    const pill = (act, at, val, on, label, lg) =>
      `<button type="button" class="btn pill" data-act="${act}" data-${at}="${val}" aria-pressed="${on}" ${
        lg ? `lang="${lg}"` : ""
      }>${label}</button>`;
    const sel = (f, val, opts) =>
      `<select data-f="${f}" aria-label="${T(
        f === "defSec"
          ? "Default section for new books"
          : "Default sorting"
      )}">${opts
        .map(
          ([k, t]) =>
            `<option value="${k}" ${val === k ? "selected" : ""}>${esc(
              t
            )}</option>`
        )
        .join("")}</select>`;

    return `<div class="hd">${backBtnHtml()}<div><h1>${T(
      "Settings"
    )}</h1></div></div><div class="sgrid">
    ${scCard(
      "🎨",
      "Appearance",
      "Choose how the library looks.",
      set(
        "Theme",
        "",
        `<div class="pills">${Object.entries(Warraq.THEMES)
          .map(
            ([k, v]) =>
              `<button type="button" class="btn pill" data-act="theme" data-t="${k}" aria-pressed="${
                Warraq.S.prefs.theme === k
              }"><i class="sw" style="background:${sw[k]}"></i>${esc(v)}</button>`
          )
          .join("")}</div>`
      )
    )}
    ${scCard(
      "🌐",
      "Language",
      "Choose the interface language.",
      set(
        "Language",
        "",
        `<div class="pills">${pill(
          "lang",
          "l",
          "ar",
          Warraq.S.prefs.lang === "ar",
          "العربية",
          "ar"
        )}${pill(
          "lang",
          "l",
          "en",
          Warraq.S.prefs.lang === "en",
          "English",
          "en"
        )}</div>`
      ) +
        (Warraq.S.prefs.lang === "ar"
          ? set(
              "Numbers",
              "Digits used for numbers and dates.",
              `<div class="pills">${pill(
                "digits",
                "d",
                "latn",
                Warraq.S.prefs.digits !== "ar",
                T("Western digits (1234)")
              )}${pill(
                "digits",
                "d",
                "ar",
                Warraq.S.prefs.digits === "ar",
                T("Arabic-Indic digits (١٢٣٤)")
              )}</div>`
            )
          : "")
    )}
    ${scCard(
      "📚",
      "Library preferences",
      "Defaults used when browsing and adding books.",
      set(
        "Default section for new books",
        "",
        sel(
          "defSec",
          Warraq.S.prefs.defSec,
          Warraq.S.sections.map((s) => [s.id, s.icon + " " + sn(s)])
        )
      ) +
        set(
          "Default view",
          "",
          `<div class="pills">${pill(
            "view",
            "v",
            "grid",
            Warraq.S.prefs.view === "grid",
            T("Grid view")
          )}${pill(
            "view",
            "v",
            "list",
            Warraq.S.prefs.view === "list",
            T("List view")
          )}</div>`
        ) +
        set("Default sorting", "", sel("defSort", Warraq.S.prefs.sort, SORTS()))
    )}
    ${scCard(
      "🗂️",
      "Sections",
      "Create, rename, reorder or delete your sections.",
      Warraq.S.sections
        .map(
          (s, i) =>
            `<div class="row"><span class="big mini" style="background:${
              s.color
            }22;color:${s.color}">${s.icon}</span><div class="grow"><b dir="auto">${esc(
              sn(s)
            )}</b> ${
              Warraq.S.prefs.defSec === s.id
                ? `<span class="tag">${T("Default")}</span>`
                : ""
            }${
              s.nav ? "" : ` <span class="mut sm">${T("(hidden from menu)")}</span>`
            }<br><span class="mut sm">${T(
              "{0} books",
              Sec.count(s.id)
            )}</span></div><button class="btn sm" data-act="sup" data-id="${
              s.id
            }" aria-label="${T("Move {0} up", esc(sn(s)))}" ${
              i ? "" : "disabled"
            }>▲</button><button class="btn sm" data-act="sdn" data-id="${
              s.id
            }" aria-label="${T("Move {0} down", esc(sn(s)))}" ${
              i < Warraq.S.sections.length - 1 ? "" : "disabled"
            }>▼</button><button class="btn sm" data-act="sedit" data-id="${
              s.id
            }">${T("Edit")}</button><button class="btn sm dng" data-act="sdel" data-id="${
              s.id
            }">${T("Delete")}</button></div>`
        )
        .join("") +
        `<div class="set" style="padding-top:14px"><button class="btn pri" data-act="sedit">${T(
          "＋ New section"
        )}</button></div>`
    )}
    ${scCard(
      "💾",
      "Data management",
      "Back up your library or move it to another device.",
      `<p class="sm note mut">${T(
        "storageNote"
      )}</p><div class="set"><div class="pills"><button class="btn pri" data-act="export">${T(
        "Export library (JSON)"
      )}</button><button class="btn" data-act="import">${T(
        "Import backup"
      )}</button></div></div><div class="set danger"><div><b>${T(
        "Danger zone"
      )}</b><p class="mut sm">${T(
        "Deletes every book and section from this browser."
      )}</p></div><button class="btn dng" data-act="reset">${T(
        "Erase everything"
      )}</button></div>`
    )}
    ${scCard(
      "ℹ️",
      "About",
      "Your data stays in this browser.",
      `<div class="set"><div><b>${T("Warraq")}</b><p class="mut sm">${T(
        "Data format version {0}",
        Warraq.VER
      )}</p></div></div>`
    )}</div>`;
  }

  /* Static Elements Applicator */
  function applyStatic() {
    $("aside")?.setAttribute("aria-label", T("Main navigation"));
    const br = $(".brand");
    if (br) {
      const isAr = Warraq.i18n.getLang() === "ar";
      br.setAttribute("data-act", "go");
      br.setAttribute("data-r", "dash");
      br.setAttribute("role", "button");
      br.setAttribute("tabindex", "0");
      br.setAttribute("title", T("Dashboard"));
      br.setAttribute("aria-label", T("Dashboard"));
      br.innerHTML = `<img class="brand-logo" src="${Warraq.LOGO}" alt="" onerror="this.remove()"><span>${
        isAr ? "ورّاق" : "Warraq"
      }</span><span class="brand-ar">${isAr ? "Warraq" : "ورّاق"}</span>`;
    }
    document.title = T("Warraq");
    $(".top button")?.setAttribute("aria-label", T("Open menu"));
    $(".top .pri")?.setAttribute("aria-label", T("Add book"));
    const bb = $("#bb");
    if (bb) bb.setAttribute("aria-label", T("Back"));
    const ttl = $("#ttl");
    if (ttl) {
      ttl.setAttribute("data-act", "go");
      ttl.setAttribute("data-r", "dash");
      ttl.setAttribute("role", "button");
      ttl.setAttribute("tabindex", "0");
      ttl.setAttribute("title", T("Dashboard"));
      ttl.setAttribute("aria-label", T("Dashboard"));
    }
  }

  /* Main View Dispatcher */
  function render() {
    setLang(Warraq.S.prefs.lang);
    const H = document.documentElement;
    H.dataset.theme = Warraq.S.prefs.theme;
    H.lang = getLang();
    H.dir = getLang() === "ar" ? "rtl" : "ltr";
    applyStatic();
    renderNav();

    const r = Warraq.UI.route;
    let h,
      t = T("Warraq");

    if (r.startsWith("sec:") && Sec.get(r.slice(4))) {
      h = lib(r.slice(4));
      t = sn(Sec.get(r.slice(4)));
    } else if (r === "lib") {
      h = lib();
      t = T("My Library");
    } else if (r === "series") {
      h = serList();
      t = T("Book Series");
    } else if (r.startsWith("ser:") && Ser.get(r.slice(4))) {
      const x = Ser.get(r.slice(4));
      h = serView(x);
      t = x.name;
    } else if (r.startsWith("ser:")) {
      Warraq.UI.route = "series";
      t = T("Book Series");
      h = serList();
      renderNav();
    } else if (r === "stats") {
      h = stats();
      t = T("Statistics");
    } else if (r === "set") {
      h = settings();
      t = T("Settings");
    } else {
      Warraq.UI.route = "dash";
      h = dash();
      t = T("Dashboard");
      renderNav();
    }

    const m = $("#main");
    if (m) {
      m.innerHTML = h;
      enhanceSelects(m);
    }
    const ttl = $("#ttl");
    if (ttl) ttl.textContent = t;
    Warraq.updateBack();
  }

  /* Book Dialog */
  function bookDlg(b, secId, fromHist = false) {
    Warraq.UI.dirty = false;
    const v =
      b || {
        ...Warraq.BK,
        section: secId && Sec.get(secId) ? secId : Warraq.S.prefs.defSec,
      };
    const fld = (k, l, t = "text", x = "") =>
      `<label>${T(l)}<input name="${k}" type="${t}" dir="${
        t === "text" ? "auto" : "ltr"
      }" value="${esc(v[k] || "")}" ${x}></label>`;
    const sel = (k, l, o) =>
      `<label>${T(l)}<select name="${k}">${o
        .map(
          ([a, x]) =>
            `<option value="${a}" ${
              String(v[k]) === String(a) ? "selected" : ""
            }>${esc(x)}</option>`
        )
        .join("")}</select></label>`;
    const cardSection = (ic, ti, open, body) =>
      `<details class="fc" ${open ? "open" : ""}><summary><span class="ci">${ico(
        ic
      )}</span><b>${T(ti)}</b><span class="mut sm">${T(
        "Optional"
      )}</span></summary><div class="fg">${body}</div></details>`;
    const p = pct(v);

    openDlg(`<form id="bf">
      <div class="fh"><h2>${T(b ? "Edit book" : "Add a book")}</h2><button type="button" class="btn ib" data-act="close" aria-label="${T(
      "Close"
    )}">${ico(IC.x)}</button></div>
      <input type="hidden" name="id" value="${b ? b.id : ""}">
      <section class="fc">
        <div class="fg">
          <label class="wide big-in">${T(
            "Title *"
          )}<input name="title" required dir="auto" placeholder="${T(
      "e.g. Dune"
    )}" value="${esc(v.title)}" autofocus></label>
          ${sel(
            "section",
            "Section",
            Warraq.S.sections.map((s) => [s.id, s.icon + " " + sn(s)])
          )}
          ${sel("status", "Reading status", Object.entries(Warraq.STAT))}
          ${fld("author", "Author")}
          ${fld("genre", "Genre")}
          <label class="wide">${T(
            "Description"
          )}<textarea dir="auto" name="desc" rows="3">${esc(
      v.desc
    )}</textarea></label>
        </div>
      </section>
      ${cardSection(
        IC.upload,
        "Cover image",
        !!v.cover,
        `<div class="wide cvrow"><div class="cvp">${ico(
          IC.upload
        )}<img id="pv" alt="${T("Cover preview")}" ${
          v.cover ? `src="${esc(v.cover)}"` : "hidden"
        }></div><div class="cvc"><input type="hidden" name="cover" id="cvh" value="${esc(
          v.cover
        )}"><input type="file" id="cvf" class="vh" accept="image/*"><label for="cvf" class="drop">${ico(
          IC.upload
        )}<b id="dropt">${T(
          v.cover ? "Replace cover image" : "Choose a cover image"
        )}</b><span class="mut sm">${T(
          "or drag and drop it here"
        )}</span></label><label>${T(
          "Image URL"
        )}<input id="cvu" type="url" dir="ltr" placeholder="https://…" value="${
          v.cover && !v.cover.startsWith("data:") ? esc(v.cover) : ""
        }"></label><div><button type="button" class="btn sm" data-act="rmcover">${T(
          "Remove cover"
        )}</button></div></div></div>`
      )}
      ${cardSection(
        IC.book,
        "Reading progress",
        v.status === "reading" || !!(v.pages || v.page || v.started || v.completed),
        `${fld("pages", "Total pages", "number", 'min="0"')}${fld(
          "page",
          "Current page",
          "number",
          'min="0"'
        )}${fld("started", "Date started", "date")}${fld(
          "completed",
          "Date completed",
          "date"
        )}<div class="wide"><div class="bar" id="fpb"><i style="width:${p}%"></i></div><p class="sm mut" id="fpt">${nf(
          p
        )}%</p></div>`
      )}
      ${cardSection(
        IC.cart,
        "Purchase information",
        v.purchase !== "no" || !!(v.price || v.pdate),
        `${sel(
          "purchase",
          "Purchase status",
          Object.entries(Warraq.PUR)
        )}${fld("price", "Price", "number", 'step="any" min="0"')}${fld(
          "pdate",
          "Purchase date",
          "date"
        )}`
      )}
      ${cardSection(
        IC.note,
        "Rating and notes",
        !!(v.notes || v.rating || v.fav),
        `${sel("rating", "Personal rating", [
          [0, T("No rating")],
          ...[1, 2, 3, 4, 5].map((n) => [n, stars(n)]),
        ])}<label><input type="checkbox" name="fav" ${
          v.fav ? "checked" : ""
        }> ${T(
          "Favorite"
        )}</label><label class="wide">${T(
          "Personal notes"
        )}<textarea dir="auto" name="notes" rows="5">${esc(
          v.notes
        )}</textarea></label>`
      )}
      <div class="acts sticky"><button type="button" class="btn" data-act="close">${T(
        "Cancel"
      )}</button><button class="btn pri" type="submit">${T(
      "Save book"
    )}</button></div>
    </form>`);

    const fbf = $("#bf");
    if (fbf) {
      fbf.op = String(v.page || 0);
      fbf.wasC = "";
    }
  }

  function saveForm(f) {
    const d = Object.fromEntries(new FormData(f));
    const n = (k) => Math.max(0, Number(d[k]) || 0);
    const old = d.id ? Bk.get(d.id) : null;
    const b = old || { ...Warraq.BK, id: Warraq.uid(), added: Warraq.today() };
    [
      "title",
      "author",
      "genre",
      "cover",
      "desc",
      "price",
      "pdate",
      "notes",
      "started",
      "completed",
    ].forEach((k) => (b[k] = String(d[k] || "").trim()));

    const st = d.status;
    const pages = n("pages");
    let page = n("page");
    if (pages && page > pages) page = pages;
    const completing = st === "completed" && (!old || old.status !== "completed");
    const undoing = !!old && old.status === "completed" && st !== "completed";

    if (completing) {
      if (old && old.pages && old.page < old.pages) b.prev = old.page;
      if (pages) page = pages;
    }
    if (undoing) {
      if (page === old.pages && old.prev > 0 && old.prev < old.pages)
        page = Math.min(old.prev, pages || old.prev);
      b.completed = "";
    }

    Object.assign(b, {
      section: d.section,
      status: st,
      purchase: d.purchase,
      pages,
      page,
      rating: Math.min(5, n("rating")),
      fav: !!d.fav,
    });

    if (completing) {
      b.completed = b.completed || Warraq.today();
      b.started = b.started || Warraq.today();
    }
    if (st === "reading") b.started = b.started || Warraq.today();
    if (!old) Warraq.S.books.push(b);
    return b;
  }

  function showBook(id, fromHist = false) {
    const b = Bk.get(id);
    if (!b) return;
    Warraq.UI.open = id;
    const s = Sec.get(b.section);
    const p = pct(b);
    const row = (k, v) => (v ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : "");
    const ss = (Warraq.S.series || []).filter((x) =>
      (x.books || []).some((m) => m.id === id)
    );
    const chips = ss.length
      ? `<div class="chips" style="margin-bottom:10px">${ss
          .map(
            (x) =>
              `<button type="button" class="chip2" data-act="go" data-r="ser:${
                x.id
              }">${esc(x.icon || "📚")} ${esc(x.name)}</button>`
          )
          .join("")}</div>`
      : "";

    openDlg(`<div class="det">${coverH(b)}<div><h2 dir="auto" style="margin:0">${esc(
      b.title
    )}</h2><p dir="auto" class="mut">${esc(
      b.author || T("Unknown author")
    )}</p>${
      b.rating
        ? `<p class="st" aria-label="${T("{0} of 5 stars", b.rating)}">${stars(
            b.rating
          )}</p>`
        : ""
    }
    ${chips}
    ${
      b.pages || b.status === "reading"
        ? `${progBar(b, p)}<p class="sm mut">${T(
            "Page {0} of {1} · {2}%",
            b.page,
            b.pages || "?",
            p
          )}</p>`
        : ""
    }
    <dl class="dl">${row(T("Section"), s ? s.icon + " " + sn(s) : "")}${row(
      T("Status"),
      Warraq.STAT[b.status]
    )}${row(T("Genre"), b.genre)}${row(T("Pages"), b.pages || "")}${row(
      T("Year"),
      b.year
    )}${row(T("Publisher"), b.publisher)}${row("ISBN", b.isbn)}${row(
      T("Language"),
      b.lang
    )}${row(
      T("Purchase"),
      Warraq.PUR[b.purchase] +
        (b.price ? " · " + b.price : "") +
        (b.pdate ? " · " + fd(b.pdate) : "")
    )}${row(T("Added"), fd(b.added))}${row(T("Started"), fd(b.started))}${row(
      T("Completed"),
      fd(b.completed)
    )}</dl></div></div>
    ${
      b.desc
        ? `<h3 style="margin-top:14px">${T("Description")}</h3><p dir="auto">${esc(
            b.desc
          ).replace(/\n/g, "<br>")}</p>`
        : ""
    }
    ${
      b.notes
        ? `<h3 style="margin-top:14px">${T("Notes")}</h3><p dir="auto">${esc(
            b.notes
          ).replace(/\n/g, "<br>")}</p>`
        : ""
    }
    <label class="sm mut" style="display:block;margin-top:14px">${T(
      "Move to section"
    )} <select data-act="move" data-id="${b.id}" style="margin-top:4px">${Warraq.S.sections
      .map(
        (x) =>
          `<option value="${x.id}" ${
            x.id === b.section ? "selected" : ""
          }>${esc(x.icon + " " + sn(x))}</option>`
      )
      .join("")}</select></label>
    <div class="acts" style="justify-content:flex-start;margin-top:18px"><button class="btn" data-act="fav" data-id="${
      b.id
    }" aria-pressed="${b.fav}">${
      b.fav ? T("♥ Favorited") : T("♡ Add to favorites")
    }</button>${
      b.status !== "completed"
        ? `<button class="btn" data-act="page" data-id="${
            b.id
          }">${T("Update page")}</button><button class="btn" data-act="done" data-id="${
            b.id
          }">${T("Mark completed")}</button>`
        : ""
    }<button class="btn" data-act="edit" data-id="${b.id}">${T(
      "Edit"
    )}</button><button class="btn dng" data-act="del" data-id="${b.id}">${T(
      "Delete"
    )}</button><button class="btn" data-act="close">${T("Close")}</button></div>`);
  }

  function secDlg(id) {
    const s = id
      ? Sec.get(id)
      : { name: "", desc: "", icon: "📖", color: "#5f8a68", nav: true, role: "" };
    openDlg(`<form id="sf"><h2 style="margin-top:0">${
      id ? T("Edit section") : T("New section")
    }</h2><input type="hidden" name="id" value="${id || ""}">
    <div class="fg"><label>${T(
      "Name *"
    )}<input dir="auto" name="name" required maxlength="60" value="${esc(
      sn(s)
    )}"></label><label>${T(
      "Color"
    )}<input type="color" name="color" value="${
      s.color
    }" style="width:100%;height:44px;padding:2px"></label>
    <label class="wide">${T(
      "Description"
    )}<input dir="auto" name="desc" maxlength="200" value="${esc(
      sd(s)
    )}"></label>
    ${iconPickerHtml(s.icon || "📖")}
    <label class="wide">${T(
      "Behavior"
    )}<select name="role">${Object.entries(Warraq.ROLES)
      .map(
        ([k, v]) =>
          `<option value="${k}" ${s.role === k ? "selected" : ""}>${v}</option>`
      )
      .join("")}</select></label>
    <label style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="nav" ${
      s.nav ? "checked" : ""
    }> ${T("Show in main menu")}</label>
    <label style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="def" ${
      Warraq.S.prefs.defSec === id ? "checked" : ""
    }> ${T("Default for new books")}</label></div>
    <div class="acts"><button type="button" class="btn" data-act="close">${T(
      "Cancel"
    )}</button><button class="btn pri" type="submit">${T("Save section")}</button></div></form>`);
  }

  function serDlg(id) {
    const x = id
      ? Ser.get(id)
      : { name: "", desc: "", cover: "", icon: "📚", added: "" };
    openDlg(`<form id="xf"><h2 style="margin-top:0">${
      id ? T("Edit series") : T("New series")
    }</h2><input type="hidden" name="id" value="${id || ""}">
    <div class="fg"><label class="wide">${T(
      "Series name"
    )}<input dir="auto" name="name" required maxlength="80" value="${esc(
      x.name
    )}" placeholder="${T("e.g. Harry Potter")}" autofocus></label>
    <label class="wide">${T(
      "Series description"
    )}<textarea dir="auto" name="desc" rows="2" maxlength="300">${esc(
      x.desc || ""
    )}</textarea></label>
    <label class="wide">${T(
      "Series cover URL"
    )}<input id="scu" type="url" dir="ltr" placeholder="https://…" value="${
      x.cover && !x.cover.startsWith("data:") ? esc(x.cover) : ""
    }"></label>
    <div style="display:flex;gap:12px;align-items:center;margin-top:-4px;margin-bottom:8px"><div class="sv" style="flex:none"><span class="big" style="--h:${hue(
      x.name || "📚"
    )}"><img id="spv" alt="${T("Cover preview")}" ${
      x.cover ? `src="${esc(x.cover)}"` : "hidden"
    }></span></div><span class="mut sm">${T(
      "Cover image preview (optional)"
    )}</span></div>
    ${iconPickerHtml(x.icon || "📚")}</div>
    <div class="acts"><button type="button" class="btn" data-act="close">${T(
      "Cancel"
    )}</button><button class="btn pri" type="submit">${T("Save series")}</button></div></form>`);
  }

  function pickRows(x) {
    const q = nz((Warraq.UI.pq || "").trim());
    const cand = (Warraq.S.books || []).filter(
      (b) =>
        !Ser.inSeries(x, b.id) &&
        (!q || [b.title, b.author, b.genre].some((v) => nz(v).includes(q)))
    );
    if (!cand.length)
      return `<div class="card empty"><p class="mut">${
        q
          ? T("No matching books")
          : T("Every book in your library is already in this series.")
      }</p></div>`;

    return cand
      .map(
        (b) => `<button type="button" class="srow" data-act="pickb" data-ser="${
          x.id
        }" data-bid="${b.id}">
    ${
      b.cover
        ? `<span class="srt"><img src="${esc(
            b.cover
          )}" alt="" loading="lazy"></span>`
        : `<span class="srt" style="--h:${hue(
            b.title
          )}"><span aria-hidden="true">📖</span></span>`
    }
    <span class="grow"><b dir="auto">${esc(
      b.title
    )}</b><br><span class="mut sm" dir="auto">${esc(
          b.author || T("Unknown author")
        )} · ${Warraq.STAT[b.status]}</span></span>
    <span class="pos" aria-hidden="true">＋</span></button>`
      )
      .join("");
  }

  function pickDlg(sid) {
    const x = Ser.get(sid);
    if (!x) return;
    Warraq.UI.pq = "";
    Warraq.UI.pser = sid;
    const n = (x.books || []).length;
    const pos = (m) =>
      `<label>${T(
        "Position in series (1–{0}, empty = end)",
        m
      )}<input id="sepos" type="number" min="1" max="${m}" style="max-width:140px;margin-top:4px"></label>`;

    openDlg(`<div class="fh"><h2>${T(
      "Add to “{0}”",
      esc(x.name)
    )}</h2><button type="button" class="btn ib" data-act="close" aria-label="${T(
      "Close"
    )}">${ico(IC.x)}</button></div>
    <p class="mut sm" style="margin-top:0">${T(
      "Choose a book from your library"
    )}</p>
    <div class="srch">${ico(
      IC.search
    )}<input id="sepq" type="search" dir="auto" placeholder="${T(
      "Filter by title or author"
    )}" aria-label="${T("Filter by title or author")}"></div>
    <div style="margin:12px 0" id="posw">${pos(n + 1)}</div>
    <div id="plist" class="plist" aria-live="polite">${pickRows(x)}</div>
    <button type="button" class="btn pri" style="width:100%;margin-top:12px" data-act="picknew" data-ser="${
      x.id
    }">${T("Create a new book instead")}</button>`);
  }

  const SORTS = () => [
    ["added", T("Newest added")],
    ["az", T("A to Z")],
    ["rating", T("Rating")],
    ["progress", T("Progress")],
  ];

  async function closeForm() {
    const dlg = $("#dlg");
    if (dlg && Warraq.UI.dirty && dlg.querySelector("#bf")) {
      const r = await ask({
        title: T("Discard changes?"),
        msg: T("You have unsaved changes. Close without saving?"),
        btns: [
          ["ok", T("Discard"), "dng"],
          ["x", T("Keep editing")],
        ],
      });
      if (r.btn !== "ok") return;
    }
    Warraq.pendSer = null;
    Warraq.pendPos = 0;
    Warraq.UI.dirty = false;
    if (history.state && history.state.dlg) {
      history.replaceState({ ...Warraq.snap(), dlg: null }, "");
      Warraq.UI._hj = JSON.stringify(history.state);
    }
    if (dlg) dlg.close();
  }

  // Export functions to Warraq namespace
  Warraq.ico = ico;
  Warraq.toast = toast;
  Warraq.ask = ask;
  Warraq.confirmDel = confirmDel;
  Warraq.openDlg = openDlg;
  Warraq.commit = commit;
  Warraq.ph = ph;
  Warraq.coverH = coverH;
  Warraq.progBar = progBar;
  Warraq.card = card;
  Warraq.bars = bars;
  Warraq.months = months;
  Warraq.strip = strip;
  Warraq.byAdded = byAdded;
  Warraq.backBtnHtml = backBtnHtml;
  Warraq.iconGridHtml = iconGridHtml;
  Warraq.iconPickerHtml = iconPickerHtml;
  Warraq.serTile = serTile;
  Warraq.renderNav = renderNav;
  Warraq.dash = dash;
  Warraq.lib = lib;
  Warraq.results = results;
  Warraq.serList = serList;
  Warraq.serBody = serBody;
  Warraq.serRows = serRows;
  Warraq.serView = serView;
  Warraq.stats = stats;
  Warraq.settings = settings;
  Warraq.applyStatic = applyStatic;
  Warraq.render = render;
  Warraq.bookDlg = bookDlg;
  Warraq.saveForm = saveForm;
  Warraq.showBook = showBook;
  Warraq.secDlg = secDlg;
  Warraq.serDlg = serDlg;
  Warraq.pickDlg = pickDlg;
  Warraq.pickRows = pickRows;
  Warraq.SORTS = SORTS;
  Warraq.closeForm = closeForm;
  Warraq.enhanceSelects = enhanceSelects;
})(window);
