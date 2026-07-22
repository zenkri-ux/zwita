import type { Station } from "./types";

// ---------------------------------------------------------------------------
// Station content, written from the mill's own information panels (which carry
// French and English text). The Arabic here is a faithful CONDENSED adaptation
// of those panels — not a word-for-word copy — as required by AGENTS.md, and
// nothing has been invented beyond what the panels state.
//
// The clues are derived from the same panel facts, phrased so a visitor can
// recognise the station without it being named outright.
//
// `scanCode` values are the codes encoded in the PRINTED QR plaques
// (`<baseUrl>/q/<scanCode>`). They avoid ambiguous characters (0/O, 1/I/L) so
// they stay readable when typed by hand. Do NOT change them once printed.
// The history board has no scanCode: it carries the entry QR to the site.
// ---------------------------------------------------------------------------

export const stations: Station[] = [
  {
    id: "history",
    slug: "history",
    title: { ar: "المعصرة الجوفية" },
    shortTitle: { ar: "المعصرة" },
    clues: [{ ar: "لوحة التعريف عند المدخل." }],
    description: {
      ar: "معصرة زيت جوفية تقليدية بجربة، حُفرت تحت الأرض لتبقى حرارتها معتدلة طوال موسم العصر.",
    },
    images: [
      {
        src: "/images/mill/panels/history-panel.jpg",
        alt: { ar: "لوحة تعريفية عند مدخل المعصرة" },
        width: 1536,
        height: 2048,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "access-corridor",
    slug: "access-corridor",
    scanCode: "M3K7Q2",
    title: { ar: "ممر الدخول" },
    shortTitle: { ar: "الممر" },
    clues: [
      {
        ar: "المنفذ الوحيد إلى قلب المعصرة: درج ضيّق لكنه عالٍ، صُنع ليمرّ منه جمل.",
      },
    ],
    description: {
      ar: "هو المنفذ الوحيد إلى داخل المعصرة، عبر درج ضيّق لكن مرتفع السقف يتّسع لمرور جمل. طوله اللافت وسقفه المائل في اتجاه واحد يضاعفان إحساس العمق نحو الفضاء المركزي.",
    },
    funFact: {
      ar: "ارتفاع الممر لم يكن ترفًا: كان الجمل ينزل منه إلى داخل المعصرة.",
    },
    images: [
      {
        src: "/images/mill/stations/access-corridor.jpg",
        alt: { ar: "ممر الدخول إلى المعصرة" },
        width: 1536,
        height: 2048,
        kind: "station",
      },
    ],
    safetyNote: { ar: "انتبه لدرجات السلّم وسِر بروية." },
    estimatedDiscoveryMinutes: 2,
  },
  {
    id: "olive-storage",
    slug: "olive-storage",
    scanCode: "R9T4XB",
    title: { ar: "قاعة تخزين الزيتون" },
    shortTitle: { ar: "المخزن" },
    clues: [
      {
        ar: "أحواض محفورة في الأرض، كان كل مالك يفرغ فيها محصوله من فتحة في السقف.",
      },
    ],
    description: {
      ar: "قاعة مقسَّمة إلى أحواض محفورة مباشرة في الأرض، يُخزَّن في كل واحد منها محصول مالك بعينه. تتّصل هذه الأحواض بسطح الأرض في الخارج عبر فتحات في السقف يصبّ منها الملّاك زيتونهم.",
    },
    images: [
      {
        src: "/images/mill/stations/olive-storage.jpg",
        alt: { ar: "أحواض تخزين الزيتون" },
        width: 1536,
        height: 2048,
        kind: "station",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "crusher-mdar",
    slug: "crusher-mdar",
    scanCode: "P6H2ZC",
    title: { ar: "المدار — حجر السحق" },
    shortTitle: { ar: "المدار" },
    clues: [
      {
        ar: "حجر ضخم يدور فوق حوض من الغرانيت، كان يجرّه جمل أو بغل بلا توقّف.",
      },
    ],
    description: {
      ar: "بعد غسل الزيتون وتنقيته من الأوراق يُفرش في حوض من الغرانيت، تدور فوقه على محور أفقي رحى أو رحيان من الغرانيت أو البورفير تُسمّى «القيقة». يجرّها جمل أو بغل يدور دون كلل، فيسحق الزيتون ويعجن العجينة في الوقت نفسه.",
    },
    funFact: {
      ar: "الدوران المستمر لم يكن للسحق فقط، بل لعجن العجينة في الآن ذاته.",
    },
    images: [
      {
        src: "/images/mill/stations/crusher-mdar.jpg",
        alt: { ar: "حجر المدار فوق حوض الغرانيت" },
        width: 1536,
        height: 2048,
        kind: "station",
      },
    ],
    estimatedDiscoveryMinutes: 4,
  },
  {
    id: "rudimentary-press",
    slug: "rudimentary-press",
    scanCode: "D8V5NK",
    title: { ar: "المعصرة البدائية — إبريسة" },
    shortTitle: { ar: "المعصرة" },
    clues: [
      {
        ar: "جذعان من النخل، ولولب خشبي ضخم، وحجر ثقيل يقارب الطن يشدّ الرافعة نحو الأسفل.",
      },
    ],
    description: {
      ar: "تتكوّن من جذعَي نخل يُحرّكهما الرجال بلولب خشبي كبير. تُكدَّس أقراص الليف المحمّلة بالعجينة ثم تُضغط بجذع طويل يبلغ خمسة إلى ستة أمتار يعمل كرافعة، يشدّه نحو الأسفل حجر ثقيل يقارب الطن عبر لولب خشبي عمودي يديره الرجال فيضاعف قوة الضغط.",
    },
    funFact: { ar: "الحجر المعاكس وحده كان يقارب وزن الطن." },
    images: [
      {
        src: "/images/mill/stations/traditional-press.jpg",
        alt: { ar: "المعصرة التقليدية" },
        width: 1536,
        height: 2048,
        kind: "station",
      },
    ],
    estimatedDiscoveryMinutes: 4,
  },
  {
    id: "boiler",
    slug: "boiler",
    scanCode: "T2Y7WF",
    title: { ar: "المرجل" },
    shortTitle: { ar: "المرجل" },
    clues: [
      {
        ar: "الموضع الذي يُسخَّن فيه الماء: بضع درجات كانت تكفي ليسيل الزيت بسهولة.",
      },
    ],
    description: {
      ar: "فضاء مخصّص لتسخين الماء المستعمل في عجن العجينة داخل حوض الطحن. الغاية ضبط حرارة الكتلة في حدود 27 درجة مئوية، فتقلّ لزوجة الزيت ويصبح استخلاصه أيسر.",
    },
    funFact: { ar: "27 درجة مئوية: حرارة مدروسة، لا أكثر ولا أقل." },
    images: [
      {
        src: "/images/mill/panels/boiler-panel.jpg",
        alt: { ar: "لوحة تعريفية عن المرجل" },
        width: 1536,
        height: 2048,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "settling-jars",
    slug: "settling-jars",
    scanCode: "J4B9RM",
    title: { ar: "جرار الترقيد" },
    shortTitle: { ar: "الجرار" },
    clues: [
      {
        ar: "جرار متتالية: الزيت يطفو، والماء يرسب، والفائض ينساب من جرّة إلى التي تليها.",
      },
    ],
    description: {
      ar: "تُفرز العجينة المضغوطة سائلًا يجمع ماء النبات والزيت، فيُترك ليرقد بفعل الجاذبية في جرار متتالية. لا يمتزج الزيت بالماء: يرسب الماء والمرجين الأثقل في القاع ويطفو الزيت فوقه، وكلّما امتلأت جرّة فاض الزيت إلى التي تليها حتى تحتوي الأخيرة زيتًا بكرًا صافيًا.",
    },
    funFact: {
      ar: "لا مرشِّح ولا آلة: الفصل يقوم على اختلاف الكثافة والصبر فقط.",
    },
    images: [
      {
        src: "/images/mill/stations/settling-jars.jpg",
        alt: { ar: "جرار ترقيد الزيت" },
        width: 1536,
        height: 2048,
        kind: "station",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "byproducts",
    slug: "byproducts",
    scanCode: "X7C3PD",
    title: { ar: "تصريف النواتج الجانبية" },
    shortTitle: { ar: "النواتج" },
    clues: [
      {
        ar: "في نهاية الدورة تخرج ثلاثة نواتج على الأيدي. ابحث عن موضع تصريفها وراحة العمّال.",
      },
    ],
    description: {
      ar: "في نهاية دورة العمل تُخرَج ثلاثة نواتج على الأيدي: الزيت، وماء النبات (المرجين)، والتفل الجاف (الفيتورة) الذي يُعاد استعماله. وهو أيضًا فضاء للراحة ولإيداع الزيت.",
    },
    funFact: {
      ar: "كان العمل متواصلًا ليلًا ونهارًا بفرق متناوبة، بمعدل ثلاثة إلى أربعة أطنان من الزيتون في اليوم طوال الشتاء.",
    },
    images: [
      {
        src: "/images/mill/panels/byproducts-panel.jpg",
        alt: { ar: "لوحة تعريفية عن تصريف النواتج" },
        width: 1536,
        height: 2048,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "dome",
    slug: "dome",
    scanCode: "H5N8VQ",
    title: { ar: "القُبّة" },
    shortTitle: { ar: "القُبّة" },
    clues: [
      {
        ar: "ارفع نظرك: العنصر الوحيد الظاهر فوق الأرض، ومن فتحاته يدخل الضوء.",
      },
    ],
    description: {
      ar: "بُنيت على مستوى سطح الأرض، وهي العنصر الظاهر الوحيد الذي يدلّ على وجود المعصرة من الخارج. تعلو غالبًا فضاء سحق الزيتون، وتسمح بفتحاتها بنفاذ الضوء اللازم لسير العمل.",
    },
    funFact: {
      ar: "من الخارج لا يُرى من المعصرة كلّها سوى هذه القبّة.",
    },
    images: [
      {
        src: "/images/mill/exterior/rooftop-domes.jpg",
        alt: { ar: "قِباب سطح المعصرة" },
        width: 1536,
        height: 2048,
        kind: "context",
      },
    ],
    estimatedDiscoveryMinutes: 2,
  },
];

/** Lookup map by station id. */
export const stationsById: Readonly<Record<string, Station>> = Object.freeze(
  Object.fromEntries(stations.map((s) => [s.id, s])),
);

/**
 * Stations that have a physical scannable plaque (i.e. a printed QR code).
 * The history board is excluded: it carries the entry QR to the site instead.
 */
export const scannableStations: Station[] = stations.filter((s) => s.scanCode);

/**
 * Allowlist used to validate scans: opaque scanCode -> station. A scanned value
 * is only ever accepted if its code appears here.
 */
export const stationsByScanCode: Readonly<Record<string, Station>> = Object.freeze(
  Object.fromEntries(scannableStations.map((s) => [s.scanCode as string, s])),
);

export function getStation(id: string): Station | undefined {
  return stationsById[id];
}

export function getStationByScanCode(code: string): Station | undefined {
  return stationsByScanCode[code];
}
