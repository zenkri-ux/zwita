// Arabic UI chrome strings (the only shipped locale in the vertical slice).
// Heritage/station content lives in src/content, not here.

export const ar = {
  appName: "زويتة",
  welcome: {
    tagline: "رحلة اكتشاف في معصرة الزيت التقليدية",
    start: "ابدأ",
  },
  setup: {
    title: "عرِّف بنفسك",
    nicknameLabel: "اسمك في اللعبة",
    nicknamePlaceholder: "اكتب اسمًا",
    avatarLabel: "اختر رمزًا",
    continue: "تابِع",
  },
  mission: {
    stepLabel: "المحطة",
    of: "من",
    scan: "امسح رمز المحطة",
    openScanner: "افتح الكاميرا",
    manualEntry: "أدخِل الرمز يدويًا",
    manualLabel: "رمز المحطة",
    manualPlaceholder: "ZWITA:1:…",
    submit: "تحقّق",
    next: "المحطة التالية",
    close: "إغلاق",
  },
  feedback: {
    correctTitle: "أحسنت! وجدتَها",
    wrongTitle: "ليست هذه المحطة",
    wrongBody: "لا بأس، جرِّب محطة أخرى قريبة.",
    alreadyTitle: "اكتشفتَ هذه من قبل",
    alreadyBody: "ابحث عن محطتك الحالية.",
    unknownTitle: "رمز غير معروف",
    unknownBody: "تأكّد أنك مسحت رمز المعصرة الصحيح.",
    malformedTitle: "تعذّرت قراءة الرمز",
    malformedBody: "أعِد المحاولة أو أدخِل الرمز يدويًا.",
  },
  scanner: {
    cameraError: "تعذّر تشغيل الكاميرا",
    permissionDenied: "لم يُسمح باستخدام الكاميرا. يمكنك إدخال الرمز يدويًا.",
    noCamera: "لا توجد كاميرا متاحة. استخدم الإدخال اليدوي.",
    insecure: "الكاميرا تحتاج اتصالًا آمنًا. استخدم الإدخال اليدوي.",
    unsupported: "الكاميرا غير مدعومة هنا. استخدم الإدخال اليدوي.",
    simulateHint: "وضع المحاكاة (للتطوير)",
    close: "إغلاق الكاميرا",
  },
  discovery: {
    funFactLabel: "معلومة",
    safetyLabel: "تنبيه",
    continue: "متابعة",
  },
  complete: {
    title: "أكملتَ الرحلة!",
    subtitle: "شكرًا لاكتشافك المعصرة",
    scoreLabel: "نقاطك",
    finalTitle: "لقبك",
    restart: "ابدأ من جديد",
  },
  reset: {
    action: "إعادة الضبط",
    confirmTitle: "هل تريد البدء من جديد؟",
    confirmBody: "سيُحذف تقدّمك الحالي.",
    confirm: "نعم، أعِد الضبط",
    cancel: "إلغاء",
  },
  offline: {
    banner: "أنت غير متصل — يمكنك متابعة اللعب.",
  },
} as const;

export type Dictionary = typeof ar;
