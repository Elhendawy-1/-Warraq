<div align="center">
  <img src="assets/logo.jpg" width="120" alt="Warraq (ورّاق) logo">
  <h1>Warraq (ورّاق)</h1>
  <p><b>Your personal novel &amp; book library — مكتبتك الشخصية للروايات</b></p>
  <p>
    <a href="https://elhendawy-1.github.io/-Warraq/"><b>🌐 Open the live website</b></a>
    ·
    <a href="https://elhendawy-1.github.io/-Warraq/app/">Direct app link</a>
  </p>
  <p><i>No accounts · No servers · No dependencies — everything stays in your browser</i></p>
</div>

---

**Warraq (ورّاق)** is a personal novel and book library designed to organize your reading journey. Manage your books, track reading progress, create custom collections, and keep your reading goals organized — all in a beautiful, responsive, bilingual Arabic and English interface.

In classical Arabic, a *warrāq* (ورّاق) was the bookseller and keeper of books — the person you visited to find your next read. This app carries that spirit: your own private library, always a click away.

## ✨ Features

### 📊 Dashboard
- Quick-glance stats: total books, currently reading, completed, want to read, want to buy, favorites, and pages read
- Overall reading-progress bar across your whole library
- **Continue reading** cards with one-tap page updates
- Recently added and recently completed shelves, plus a six-month reading-activity chart
- Section overview tiles

### 📚 Library
- Instant search across title, author, and genre (diacritics-tolerant, including Arabic letter normalization)
- Filter by section, reading status, or favorites
- Sort by newest added, A to Z, rating, or progress
- Switchable **grid** and **list** views

### 🗂️ Custom sections
- Create your own collections with a name, description, emoji icon, and color
- Reorder sections, show or hide them from the main menu
- Optional *behavior* per section (e.g. *Want to Buy*, *Currently Reading*) — moving a book there automatically updates its reading status
- Built-in defaults: Currently Reading, Completed Books, Want to Read, Want to Buy, On Hold, Dropped, Favorites

### 📖 Books
- Rich details: title, author, genre, year, publisher, ISBN, language, description, and personal notes
- **Reading progress**: total pages, current page with a live progress bar, and automatic completion when you reach the last page
- **Completion is reversible**: marking a book as completed remembers the page you were on; undo the completion from *Edit book* and your previous reading position (and percentage) is restored automatically
- **Cover images**: upload a file, drag & drop, or paste a URL — covers are auto-compressed and books without a cover get a tasteful generated placeholder
- Purchase information (purchased, gift, borrowed) with price and date
- Personal 1–5 ⭐ rating, favorite flag, and start/finish dates

### 📈 Statistics
- Totals, pages read, average rating, total spent on your library
- Books completed over the last 12 months (monthly chart)
- Breakdowns by reading status and by genre

### 🎨 Appearance & languages
- Four themes: **Neutral**, **Elegant**, **Modern**, and **Dark**
- Full **English** and **Arabic** interface with automatic RTL/LTR switching
- Optional **Arabic-Indic digits** (١٢٣٤) for numbers and long-form Arabic dates

### ♿ Comfort & accessibility
- Responsive layout: sidebar menu on desktop, slide-in drawer + top bar on mobile
- Keyboard-operable book cards, visible focus states, ARIA labels, and screen-reader announcements
- Honors the system *reduced motion* preference

## 💾 Your data & privacy

- Everything is stored **only in your browser** (localStorage) — no accounts, no tracking, no servers
- Data is scoped to this site (origin) **inside the browser profile you use** — separate browser profiles (Chrome profiles, Edge profiles, incognito, different browsers) each hold their own separate library; there is no cross-user or cross-device sharing, but also no account system or sync
- **Export** your library as a JSON backup from *Settings*, and **import** it on another browser or device (choose *merge* or *replace*) — this is the way to move data between users or devices
- If saved data ever becomes unreadable, Warraq keeps the corrupted copy aside and starts a fresh library — nothing is silently lost
- Opening the app on another device or browser starts an empty library; use the backup file to move your data

## 🚀 Getting started

1. Open [the live website](https://elhendawy-1.github.io/-Warraq/) — or download `app/index.html` and open it directly in any modern browser (it even works fully offline).
2. Click **＋ Add book** and start building your library.
3. Tune the experience in **⚙️ Settings**: theme, language, digits, default section/view/sorting, and backups.

> Tip: your data lives per browser per origin, so exporting a backup before switching browsers or devices is the safe way to carry your library with you.

## 🗂️ Repository structure

```
.
├── app/
│   └── index.html      # The Warraq application (single HTML file)
├── assets/
│   └── logo.jpg        # Project logo
├── tests/
│   └── run-tests.html  # Self-running test harness (works locally and on GitHub Pages)
├── index.html          # GitHub Pages entry point (redirects to app/)
└── README.md
```

## 🧪 Tests

The repository ships a self-contained test harness, `tests/run-tests.html`, that loads the **real** app file over HTTP, executes it, and drives it through realistic scenarios (dialog flows, form submissions, persistence). It reports per-assertion results as JSON.

Coverage includes the critical reading-status workflow (288-page book marked completed at page 100 → edit → back to *Currently Reading* → page restored to 100 of 288, ≈34.7%), undo-completion edge cases (page 0, final page, no page count, repeated completion, in-dialog complete-then-backtrack), dialog keep-editing/discard flows, section-behavior moves, search/filter/sort, statistics, EN/AR + RTL switching, backup round-trips and invalid-record handling, erase-everything, corruption recovery, **persistence after refresh** (same browser profile), and **two-profile isolation** (separate browser profiles see only their own data). A built-in guard also verifies the app makes zero network calls at runtime.

Five modes run in order against the same profiles:

| Mode      | What it proves |
|-----------|----------------|
| `main`    | Full logic suite (104 assertions) + seeds canonical state for the refresh test |
| `reload`  | Restarts the browser on the same profile — progress, status and settings survive |
| `corrupt` | Corrupted stored JSON → clean recovery, corrupt copy kept aside |
| `iso-a` / `iso-b` | Two separate browser profiles: B boots with an **empty** library and never sees A's data |

Run them locally (any static server + any Chromium browser):

```
node server.cjs . 8931        # serve the repo root
# open http://127.0.0.1:8931/tests/run-tests.html?run=main  (then ?run=reload, corrupt, iso-a, iso-b)
```

Or simply run them against GitHub Pages: <https://elhendawy-1.github.io/-Warraq/tests/run-tests.html?run=main>

## 🛠️ Under the hood

- One self-contained HTML file: plain HTML, CSS, and vanilla JavaScript
- Zero dependencies, zero build tools — open it and it works
- Native `<dialog>` elements and a versioned, client-side JSON backup format

## 📌 Links

- 🌐 Live website: <https://elhendawy-1.github.io/-Warraq/>
- 📦 Repository: <https://github.com/Elhendawy-1/-Warraq>
