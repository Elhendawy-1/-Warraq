<div align="center">
  <img src="assets/logo.svg" width="120" height="120" alt="Warraq (ورّاق) Logo">
  
  # Warraq (ورّاق)
  ### Your Personal Reading Universe & Novel Library
  
  <p align="center">
    <a href="https://elhendawy-1.github.io/Warraq/" target="_blank">
      <img src="https://img.shields.io/badge/🌐_LIVE_DEMO-Launch_Warraq_App-2ea44f?style=for-the-badge&logoColor=white" alt="Live Demo">
    </a>
  </p>

  [![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-238636?style=flat-square&logo=github&logoColor=white)](https://elhendawy-1.github.io/Warraq/)
  [![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6_Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-Modern_Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-Modern_Design_Tokens-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-0969da?style=flat-square)](#)
  [![100% Offline](https://img.shields.io/badge/Storage-100%25_Local_&_Offline-8957e5?style=flat-square)](#)
  [![Bilingual](https://img.shields.io/badge/Localization-English_%7C_العربية-informational?style=flat-square)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

  <br>

  <p>
    <b>
      <a href="https://elhendawy-1.github.io/Warraq/">🚀 Open Live App</a>
      &nbsp;•&nbsp;
      <a href="#-about-warraq">📖 About</a>
      &nbsp;•&nbsp;
      <a href="#-key-features">✨ Features</a>
      &nbsp;•&nbsp;
      <a href="#-architecture">🏛️ Architecture</a>
      &nbsp;•&nbsp;
      <a href="#-privacy--offline-first">🔒 Privacy</a>
      &nbsp;•&nbsp;
      <a href="#-getting-started">⚡ Quick Start</a>
    </b>
  </p>
</div>

---

## 📖 About Warraq

In classical Arabic literary tradition, a **Warrāq** (ورّاق) was the copyist, bookseller, binder, and guardian of manuscripts — the learned person you visited in the book bazaar to discover your next great read.

**Warraq (ورّاق)** embodies that timeless spirit in a modern, lightweight, privacy-first web application. Designed for bibliophiles, novel enthusiasts, and everyday readers, it enables you to curate your personal library, track your reading progress page-by-page, organize multi-volume book series, and create custom categorized bookshelves — all wrapped in a tactile, bilingual interface.

> **No accounts · No servers · No tracking · Zero dependencies — Everything runs locally inside your browser.**

---

## 🌐 Live Demo Server

Explore the full application live in your browser hosted on **GitHub Pages**:

👉 **[Launch Live Application — elhendawy-1.github.io/Warraq](https://elhendawy-1.github.io/Warraq/)**

*Tip: Add the page to your browser bookmarks or phone's home screen for an instant, offline-capable reading companion.*

---

## ✨ Key Features

### 📊 1. Comprehensive Reading Dashboard
- **Instant Metrics:** Real-time counters for total books, currently reading, completed, want to read, wishlist, favorites, and total pages read.
- **Whole-Library Progress Bar:** Visual indicator calculating the overall completion percentage across your catalog.
- **"Continue Reading" Shelf:** Quick-access shelf for books in progress featuring one-tap page update buttons (`+1 Page`).
- **Reading Activity Timeline:** Six-month interactive chart tracking books completed month over month.

### 📚 2. Intelligent Library Management
- **Diacritics-Tolerant Search:** Fast search across titles, authors, and genres with intelligent Arabic letter normalization (unifying alef forms, yaa, and taa marbuta) and case-insensitive Latin matching.
- **Multi-Criteria Filtering:** Filter instantly by custom section, reading status, or favorites.
- **Flexible Sorting:** Sort by recently added, title (A–Z), personal star rating (1–5 ⭐), or reading percentage.
- **Switchable Layouts:** One-click toggle between an editorial **Grid View** and a detailed **List View**.

### 📖 3. Multi-Volume Book Series
- Organize book series and novel sagas in their exact chronological or reading order (Volume 1 to N).
- Automatic calculation of series completion percentage (by total books and pages).
- Assign existing library books to series or spawn new books directly within a series.
- Seamlessly reorder volumes up and down with instant position updates.

### 🗂️ 4. Custom Shelves & Automated Behaviors
- Create unlimited custom bookshelves with unique colors, names, and descriptions.
- **Freeform Emoji & Icon Selector:** Choose from curated icons or paste any custom Unicode emoji directly.
- **Automated Shelf Behaviors:** Optionally set a shelf action (e.g. moving a book into *"Currently Reading"* or *"Want to Buy"* automatically updates its reading status).

### 🎨 5. Four Curated Literary Themes
Carefully crafted palettes inspired by historic reading rooms and fine bookbinding:
1. 📜 **Classic Parchment (Neutral):** Warm book-paper background (`#f7f4ed`), deep ink typography, and forest-green botanical accents (`#2c5e3b`).
2. 🌸 **Burgundy & Rosewater (Elegant):** Soft blush tones and velvet-wine accents (`#912d5c`) for a refined literary salon aesthetic.
3. 🖋️ **Editorial Slate (Modern):** High-contrast ivory, slate grey, and royal cobalt blue (`#1d4ed8`) with crisp typography.
4. 🕯️ **Midnight Library (Dark Mode):** Deep obsidian reading room (`#0b0f15`) illuminated by the warm amber glow of a brass desk lamp (`#f59e0b`).

### 🌍 6. Complete Bilingual Localization
- Native **Arabic (RTL)** experience with literary **Amiri** typography, natural right-to-left layout flow, and optional Arabic-Indic numerals (`١٢٣٤`).
- Crisp **English (LTR)** experience powered by **Plus Jakarta Sans** and classical **Cinzel** display lettering.
- Automatic locale detection based on browser settings with one-tap instant switching.

### 📱 7. Responsive & Ergonomic Interface
- Fixed, elegant sidebar navigation on desktop monitors and tablets.
- Off-canvas slide-in drawer with frosted backdrop for mobile devices.
- Hardware safe-area support (`env(safe-area-inset-top)` / `bottom`) preventing clipping on notched screens and dynamic islands.
- Generous touch targets (44px+) compliant with WCAG accessibility guidelines.

### 🔒 8. 100% Local-First Privacy
- **Zero Cloud Leakage:** All book metadata, notes, and reading progress reside strictly in your browser's `localStorage`.
- **JSON Backup & Restore:** Export your entire library into an interoperable `.json` backup file at any time.
- **Smart Import:** Choose between **Merge** (safely integrates new books without duplicates) or **Replace** (full restore).
- **Client-Side Image Compression:** Uploaded cover photos are compressed in-memory via HTML5 Canvas to preserve local storage limits.

---

## 🏛️ Architecture

Warraq is engineered around a clean, modular **Vanilla Web Architecture** utilizing modern ES6 Modules without external framework overhead:

```
Warraq/
├── index.html          # Application entry point & GitHub Pages root
├── .nojekyll           # Bypasses Jekyll processing for pure static hosting
├── README.md           # Documentation & project showcase
├── assets/
│   └── logo.svg        # Scalable vector brand insignia (Open book & quill)
├── css/
│   ├── variables.css   # Design tokens, CSS variables, and 4 theme palettes
│   ├── base.css        # Base typography, layout resets, and RTL/LTR rules
│   ├── components.css  # Book cards, dialogs, buttons, progress bars, and forms
│   └── responsive.css  # Mobile breakpoints, drawers, and safe-area margins
└── js/
    ├── app.js          # App lifecycle, event delegation, and image processing
    ├── store.js        # LocalStorage state management, schema, and normalization
    ├── services.js     # Domain logic: Books (Bk), Sections (Sec), Series (Ser)
    ├── router.js       # Client routing, History API integration, and navigation
    ├── i18n.js         # Translation dictionaries, date and number formatters
    └── ui.js           # View templates, card builders, and dialog renderers
```

---

## ⚡ Getting Started

Warraq requires **zero installations, zero build steps, and zero dependencies**.

### Option A: Open Directly
Simply clone the repository and open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge, Brave):

```bash
git clone https://github.com/Elhendawy-1/Warraq.git
cd Warraq
# Open index.html in your default browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option B: Local HTTP Server
Run a lightweight local development server using Python or Node:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 💾 Backup & Data Portability

Because Warraq does not rely on cloud databases, your data is completely under your control:
1. Navigate to **⚙️ Settings** (`الإعدادات`).
2. Under **Backup & Restore**, click **Export Backup (تصدير نسخة احتياطية)** to download your library as a versioned JSON file.
3. To restore on another computer, tablet, or browser profile, click **Import Backup (استيراد نسخة احتياطية)** and select whether to merge or replace.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 Semantic Elements (`<dialog>`, `<aside>`, `<main>`) |
| **Styling** | Modern CSS3 (CSS Variables, Grid, Flexbox, Fluid Clamps) |
| **Logic** | Vanilla JavaScript (ES6 Modules, Canvas API, History API) |
| **Persistence** | Browser `localStorage` (Schema v1 with corruption recovery) |
| **Typography** | Google Fonts: *Amiri* (Arabic Serif), *Cinzel* (Display), *Plus Jakarta Sans* (UI) |
| **Hosting** | GitHub Pages (Static edge delivery) |

---

## 🤝 Contributing

Contributions, feature requests, and suggestions are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Crafted with passion for books and quiet reading spaces 📖 · <b>Warraq (ورّاق)</b></sub>
</div>
