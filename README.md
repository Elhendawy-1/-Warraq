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
- **Export** your library as a JSON backup from *Settings*, and **import** it on another browser or device (choose *merge* or *replace*)
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
│   └── index.html    # The Warraq application (single HTML file)
├── assets/
│   └── logo.jpg      # Project logo
├── index.html        # GitHub Pages entry point (redirects to app/)
└── README.md
```

## 🛠️ Under the hood

- One self-contained HTML file: plain HTML, CSS, and vanilla JavaScript
- Zero dependencies, zero build tools — open it and it works
- Native `<dialog>` elements and a versioned, client-side JSON backup format

## 📌 Links

- 🌐 Live website: <https://elhendawy-1.github.io/-Warraq/>
- 📦 Repository: <https://github.com/Elhendawy-1/-Warraq>
