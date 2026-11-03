/* ==========================================================================
   WARRAQ (ورّاق) — Localization (Arabic / English) & String Utilities
   ========================================================================== */

(function (window) {
  "use strict";

  const Warraq = window.Warraq || (window.Warraq = {});

  let LANG = "en";

  const AR = {
    Warraq: "ورّاق",
    "Main navigation": "القائمة الرئيسية",
    "Open menu": "فتح القائمة",
    "Add book": "إضافة كتاب",
    Dashboard: "لوحة التحكم",
    "My Library": "مكتبتي",
    Sections: "الأقسام",
    More: "المزيد",
    Statistics: "الإحصائيات",
    Settings: "الإعدادات",
    "Welcome back": "مرحبًا بعودتك",
    "Your reading life at a glance.": "نظرة سريعة على رحلتك مع القراءة.",
    "＋ Add book": "＋ إضافة كتاب",
    "Total books": "إجمالي الكتب",
    "Currently reading": "أقرأ حاليًا",
    Completed: "مكتملة",
    "Want to read": "أريد قراءتها",
    "Want to buy": "أريد شراءها",
    Favorites: "المفضلة",
    "Pages read": "الصفحات المقروءة",
    "Reading progress overview": "نظرة عامة على تقدم القراءة",
    "{0} of {1} pages across books with a page count ({2}%)":
      "{0} من {1} صفحة في الكتب التي لها عدد صفحات ({2}%)",
    "Continue reading": "متابعة القراءة",
    "Page {0} of {1} · {2}%": "الصفحة {0} من {1} · {2}%",
    "Update progress": "تحديث التقدم",
    "Nothing in progress. Start a book from your library.":
      "لا توجد كتب قيد القراءة. ابدأ كتابًا من مكتبتك.",
    "Recently added": "أُضيفت مؤخرًا",
    "Recently completed": "اكتملت مؤخرًا",
    "Reading activity": "نشاط القراءة",
    "Books completed per month": "الكتب المكتملة شهريًا",
    "{0} books": "{0} كتاب",
    "Every book you own, want or love.": "كل كتاب تملكه أو تريده أو تحبه.",
    "Search title, author or genre": "ابحث بالعنوان أو المؤلف أو النوع",
    "Search books": "البحث عن الكتب",
    "All sections": "كل الأقسام",
    "Filter by section": "تصفية حسب القسم",
    "Any status": "أي حالة",
    "Filter by status": "تصفية حسب الحالة",
    "Sort by": "ترتيب حسب",
    "Newest added": "الأحدث إضافة",
    "A to Z": "أبجديًا",
    Rating: "التقييم",
    Progress: "التقدم",
    View: "العرض",
    "Grid view": "عرض شبكي",
    "List view": "عرض قائمة",
    "No matching books": "لم يتم العثور على كتب",
    "Try a different search or clear the filters.":
      "جرّب بحثًا مختلفًا أو أزل عوامل التصفية.",
    "Your reading journey starts here.": "رحلتك مع القراءة تبدأ من هنا.",
    "Nothing in “{0}” yet.": "لا توجد كتب في «{0}» بعد.",
    "Your library is empty.": "مكتبتك فارغة.",
    "Add your first book.": "أضف أول كتاب لك.",
    "Unknown author": "مؤلف غير معروف",
    "{0} pages": "{0} صفحة",
    Favorite: "مفضل",
    "Calculated live from your library.": "تُحسب مباشرة من بيانات مكتبتك.",
    "Average rating": "متوسط التقييم",
    "Total spent": "إجمالي الإنفاق",
    "Books completed, last 12 months": "الكتب المكتملة خلال آخر 12 شهرًا",
    "By status": "حسب الحالة",
    "By genre": "حسب النوع",
    "Add books to see genres.": "أضف كتبًا لعرض الأنواع.",
    "No genre": "بدون نوع",
    Language: "اللغة",
    Numbers: "الأرقام",
    "Western digits (1234)": "أرقام غربية (1234)",
    "Arabic-Indic digits (١٢٣٤)": "أرقام هندية (١٢٣٤)",
    Theme: "المظهر",
    Neutral: "محايد",
    Elegant: "أنيق",
    Modern: "عصري",
    "Dark mode": "الوضع الداكن",
    "Default section for new books": "القسم الافتراضي للكتب الجديدة",
    Default: "افتراضي",
    "(hidden from menu)": "(مخفي من القائمة)",
    "Move {0} up": "نقل {0} للأعلى",
    "Move {0} down": "نقل {0} للأسفل",
    Edit: "تعديل",
    Delete: "حذف",
    "＋ New section": "＋ قسم جديد",
    "Backup and restore": "النسخ الاحتياطي والاستعادة",
    "Export library (JSON)": "تصدير المكتبة (JSON)",
    "Import backup": "استيراد نسخة احتياطية",
    "Erase everything": "مسح كل شيء",
    storageNote:
      "<b>بياناتك محفوظة في هذا المتصفح فقط.</b> فتح هذا التطبيق في متصفح أو جهاز آخر سيبدأ بمكتبة فارغة، ولا تتم أي مزامنة تلقائية. لنقل مكتبتك، صدّر ملف نسخة احتياطية ثم استورده هناك.",
    "Edit book": "تعديل الكتاب",
    "Add a book": "إضافة كتاب",
    "Title *": "العنوان *",
    Author: "المؤلف",
    Genre: "النوع",
    Section: "القسم",
    "Reading status": "حالة القراءة",
    Description: "الوصف",
    "Cover image": "صورة الغلاف",
    "Image URL": "رابط الصورة",
    "Or upload a picture": "أو ارفع صورة",
    "Cover preview": "معاينة الغلاف",
    "Remove cover": "إزالة الغلاف",
    Reading: "قيد القراءة",
    "Total pages": "إجمالي الصفحات",
    "Current page": "الصفحة الحالية",
    "Date started": "تاريخ البدء",
    "Date completed": "تاريخ الإكمال",
    "Personal rating": "التقييم الشخصي",
    "No rating": "بدون تقييم",
    Publication: "النشر",
    "Publication year": "سنة النشر",
    Publisher: "الناشر",
    Purchase: "الشراء",
    "Purchase status": "حالة الشراء",
    Price: "السعر",
    "Purchase date": "تاريخ الشراء",
    Notes: "الملاحظات",
    "Personal notes": "ملاحظات شخصية",
    Cancel: "إلغاء",
    "Save book": "حفظ الكتاب",
    Save: "حفظ",
    "Not started": "لم تبدأ",
    "On hold": "مؤجلة",
    Dropped: "متروكة",
    "Not purchased": "لم يُشترَ",
    Purchased: "تم الشراء",
    Gift: "هدية",
    Borrowed: "مستعار",
    Status: "الحالة",
    Pages: "الصفحات",
    Year: "السنة",
    Added: "تاريخ الإضافة",
    Started: "تاريخ البدء",
    "Move to section": "نقل إلى قسم",
    "♥ Favorited": "♥ في المفضلة",
    "♡ Add to favorites": "♡ أضف إلى المفضلة",
    "Update page": "تحديث الصفحة",
    "Mark completed": "تحديد كمكتمل",
    Close: "إغلاق",
    "Edit section": "تعديل القسم",
    "New section": "قسم جديد",
    "Name *": "الاسم *",
    Color: "اللون",
    Icon: "الأيقونة",
    Behavior: "السلوك",
    "Save section": "حفظ القسم",
    "Show in main menu": "إظهار في القائمة الرئيسية",
    "Default for new books": "افتراضي للكتب الجديدة",
    Untitled: "بدون عنوان",
    "No special behavior": "بدون سلوك خاص",
    "Marks books as Reading": "يحوّل الكتب إلى «قيد القراءة»",
    "Marks books as Completed": "يحوّل الكتب إلى «مكتملة»",
    "Counts as Want to Read": "يُحتسب ضمن «أريد قراءتها»",
    "Counts as Want to Buy": "يُحتسب ضمن «أريد شراءها»",
    "Marks books as On hold": "يحوّل الكتب إلى «مؤجلة»",
    "Marks books as Dropped": "يحوّل الكتب إلى «متروكة»",
    "Backup downloaded": "تم تنزيل النسخة الاحتياطية",
    "Import failed: {0}": "فشل الاستيراد: {0}",
    "Not a valid library file": "ملف المكتبة غير صالح",
    "The file has no sections": "لا يحتوي الملف على أقسام",
    "this is not a valid library backup.": "هذا ليس ملف نسخة احتياطية صالحًا.",
    "Import library": "استيراد المكتبة",
    "This file has <b>{0} books</b> and <b>{1} sections</b>. Merge adds only what is missing from your library. Replace deletes your current library first.":
      "يحتوي هذا الملف على <b>{0} كتاب</b> و<b>{1} قسم</b>. الدمج يضيف فقط ما ليس موجودًا في مكتبتك، أما الاستبدال فيحذف مكتبتك الحالية أولًا.",
    Merge: "دمج",
    Replace: "استبدال",
    "Library imported": "تم استيراد المكتبة",
    "Storage is full or blocked. Export a backup now.":
      "مساحة التخزين ممتلئة أو محظورة. صدّر نسخة احتياطية الآن.",
    "Saved data could not be read. A copy was kept and a fresh library started.":
      "تعذّرت قراءة البيانات المحفوظة. تم الاحتفاظ بنسخة منها وبدء مكتبة جديدة.",
    "of {0} pages": "من {0} صفحة",
    "page number": "رقم الصفحة",
    "Marked as completed 🎉": "تم تحديد الكتاب كمكتمل 🎉",
    "Finished! Marked as completed 🎉": "أحسنت! تم إكمال الكتاب 🎉",
    "Delete book?": "حذف الكتاب؟",
    "“{0}” will be removed permanently.": "سيتم حذف «{0}» نهائيًا.",
    "Book deleted": "تم حذف الكتاب",
    "Keep at least one section": "يجب الإبقاء على قسم واحد على الأقل",
    "Delete section?": "حذف القسم؟",
    "“{0}” will be removed. {1}": "سيتم حذف «{0}». {1}",
    "{0} book(s) will move to your default section.":
      "سيتم نقل {0} كتاب إلى القسم الافتراضي.",
    "It has no books.": "لا يحتوي على كتب.",
    "Erase everything?": "مسح كل شيء؟",
    "All books and sections will be deleted. Export a backup first if unsure.":
      "سيتم حذف كل الكتب والأقسام. صدّر نسخة احتياطية أولًا إن لم تكن متأكدًا.",
    "Library erased": "تم مسح المكتبة",
    "Book saved": "تم حفظ الكتاب",
    "Section saved": "تم حفظ القسم",
    "Book moved": "تم نقل الكتاب",
    "Image too large (max 8 MB)": "الصورة كبيرة جدًا (الحد الأقصى 8 ميجابايت)",
    "Could not read that image": "تعذّرت قراءة هذه الصورة",
    "Please fill out this field.": "يرجى ملء هذا الحقل.",
    "Cover of {0}": "غلاف {0}",
    "No cover for {0}": "لا يوجد غلاف لـ {0}",
    "Reading progress {0}%": "تقدم القراءة {0}%",
    "{0} of 5 stars": "{0} من 5 نجوم",
    "Currently Reading": "أقرأ حاليًا",
    "Books you are reading right now": "الكتب التي تقرؤها الآن",
    "Completed Books": "الكتب المكتملة",
    "Finished reads": "قراءات انتهيت منها",
    "Want to Read": "أريد قراءتها",
    "Your reading wishlist": "قائمة رغباتك في القراءة",
    "Want to Buy": "أريد شراءها",
    "Books to get next": "كتب تنوي اقتناءها",
    "On Hold": "مؤجلة",
    "Paused for now": "متوقفة مؤقتًا",
    "Dropped / Abandoned": "متروكة / مهجورة",
    "Not for me": "لم تناسبني",
    "All-time favorites": "المفضلة على الإطلاق",
    Optional: "اختياري",
    "Clear search": "مسح البحث",
    Filters: "عوامل التصفية",
    "Discard changes?": "تجاهل التغييرات؟",
    "You have unsaved changes. Close without saving?":
      "لديك تغييرات غير محفوظة. هل تريد الإغلاق دون حفظ؟",
    Discard: "تجاهل",
    "Keep editing": "متابعة التحرير",
    "Choose a cover image": "اختر صورة الغلاف",
    "or drag and drop it here": "أو اسحبها وأفلتها هنا",
    "Reading progress": "تقدم القراءة",
    "Purchase information": "معلومات الشراء",
    "Rating and notes": "التقييم والملاحظات",
    Appearance: "المظهر العام",
    "Choose how the library looks.": "اختر شكل المكتبة.",
    "Choose the interface language.": "اختر لغة الواجهة.",
    "Library preferences": "تفضيلات المكتبة",
    "Defaults used when browsing and adding books.":
      "القيم الافتراضية عند التصفح وإضافة الكتب.",
    "Default view": "العرض الافتراضي",
    "Default sorting": "الترتيب الافتراضي",
    "Create, rename, reorder or delete your sections.":
      "أنشئ أقسامك أو أعد تسميتها أو رتّبها أو احذفها.",
    "Data management": "إدارة البيانات",
    "Back up your library or move it to another device.":
      "انسخ مكتبتك احتياطيًا أو انقلها إلى جهاز آخر.",
    "Danger zone": "منطقة الخطر",
    "Deletes every book and section from this browser.":
      "يحذف كل الكتب والأقسام من هذا المتصفح.",
    About: "حول التطبيق",
    "Data format version {0}": "إصدار تنسيق البيانات {0}",
    "Digits used for numbers and dates.": "الأرقام المستخدمة في الأعداد والتواريخ.",
    "Your data stays in this browser.": "تبقى بياناتك في هذا المتصفح.",
    "e.g. Dune": "مثال: أرض زيكولا",
    "Replace cover image": "استبدال صورة الغلاف",
    "Import skipped {0} invalid record(s).":
      "تم تجاهل {0} من السجلات غير الصالحة أثناء الاستيراد.",
    "Book Series": "سلاسل الكتب",
    "New series": "سلسلة جديدة",
    "Edit series": "تعديل السلسلة",
    "Series name": "اسم السلسلة",
    "Series description": "وصف السلسلة",
    "Series cover URL": "رابط صورة السلسلة",
    "Add book to series": "إضافة كتاب إلى السلسلة",
    "Create a new book instead": "إنشاء كتاب جديد بدلًا من ذلك",
    "Choose a book from your library": "اختر كتابًا من مكتبتك",
    "Filter by title or author": "تصفية بالعنوان أو المؤلف",
    "Add to “{0}”": "إضافة إلى «{0}»",
    "Position in series (1–{0}, empty = end)":
      "الترتيب في السلسلة (1–{0}، الفارغ = النهاية)",
    "No matching series": "لا توجد سلاسل مطابقة",
    "Search series": "البحث في السلاسل",
    "Sort series": "ترتيب السلاسل",
    "Series progress": "تقدّم السلسلة",
    "No series yet": "لا توجد سلاسل بعد",
    "Track your multi-book sagas in reading order.":
      "تابع سلاسلك من الكتب المتتابعة بترتيب القراءة.",
    "This series is empty": "هذه السلسلة فارغة",
    "Add the first book to start tracking progress.":
      "أضف أول كتاب في السلسلة لبدء متابعة التقدم.",
    "Remove from series": "إزالة من السلسلة",
    "Remove “{0}” from this series? The book stays in your library.":
      "إزالة «{0}» من هذه السلسلة؟ يبقى الكتاب في مكتبتك.",
    "Delete series?": "حذف السلسلة؟",
    "“{0}” series will be deleted. Books stay in your library.":
      "سيتم حذف سلسلة «{0}». تبقى الكتب في مكتبتك.",
    "Book added to series": "تمت إضافة الكتاب إلى السلسلة",
    "Book removed from series": "تمت إزالة الكتاب من السلسلة",
    "Series saved": "تم حفظ السلسلة",
    "Series deleted": "تم حذف السلسلة",
    "Save series": "حفظ السلسلة",
    "e.g. Harry Potter": "مثال: هاري بوتر",
    Back: "رجوع",
    "This file also contains <b>{0} series</b>.":
      "يحتوي الملف أيضًا على <b>{0} من السلاسل</b>.",
    "Books in series": "كتب السلسلة",
    Remove: "إزالة",
    "Every book in your library is already in this series.":
      "كل كتب مكتبتك موجودة بالفعل في هذه السلسلة.",
    "Across this series: {0} of {1} pages read ({2}%)":
      "في هذه السلسلة: قُرئت {0} من {1} صفحة ({2}%)",
    "Selected icon": "الأيقونة المحددة",
    "Selected icon - you can type or paste any emoji/text here":
      "الأيقونة المحددة - يمكنك كتابة أو لصق أي إيموجي أو رمز هنا",
    "Add custom icon or emoji…": "أضف أيقونة أو إيموجي مخصص…",
    "Add custom icon": "إضافة أيقونة مخصصة",
    Add: "إضافة",
    "Add icon to list": "إضافة الأيقونة إلى القائمة",
    "Or choose from available icons:": "أو اختر من الأيقونات المتاحة:",
    "Remove icon": "إزالة الأيقونة",
    "Icon added!": "تمت إضافة الأيقونة!",
    "Cover image preview (optional)": "معاينة صورة الغلاف (اختياري)",
  };

  const EN = {
    storageNote:
      "<b>Your data is stored only in this browser.</b> Opening this app in another browser or on another device starts an empty library; nothing syncs automatically. To move your library, export a backup file and import it there.",
  };

  function T(s, ...a) {
    const raw = LANG === "ar" ? AR[s] : EN[s] ?? s;
    return (raw ?? s)?.replace(/\{(\d)\}/g, (m, i) => nf(a[i])) ?? s;
  }

  const loc = () =>
    Warraq.S && Warraq.S.prefs && Warraq.S.prefs.digits === "ar"
      ? "ar-EG"
      : "ar-EG-u-nu-latn";

  const nf = (n) =>
    LANG === "ar" && typeof n === "number"
      ? new Intl.NumberFormat(loc()).format(n)
      : n;

  const fd = (d) => {
    if (!d || LANG !== "ar") return d;
    const x = new Date(d + "T00:00:00");
    return isNaN(x)
      ? d
      : x.toLocaleDateString(loc(), {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const tr = (o) =>
    new Proxy(o, {
      get: (a, k) => (typeof a[k] === "string" ? T(a[k]) : a[k]),
    });

  const sn = (s) => (s && s.dflt ? T(s.name) : (s && s.name) || "");
  const sd = (s) => (s && s.dflt ? T(s.desc) : (s && s.desc) || "");

  // Arabic search normalization (strips diacritics, normalizes Alef, Yaa, Taa Marbuta)
  const nz = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f\u064B-\u065F\u0670\u0640]/g, "")
      .replace(/[إأآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه");

  function setLang(l) {
    LANG = l === "ar" ? "ar" : "en";
  }

  function getLang() {
    return LANG;
  }

  // Export functions to Warraq namespace
  Warraq.i18n = {
    T,
    loc,
    nf,
    fd,
    tr,
    sn,
    sd,
    nz,
    setLang,
    getLang,
  };
})(window);
