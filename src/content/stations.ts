import type { Station } from "./types";

// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT — NOT VALIDATED HERITAGE FACT.
//
// Every Arabic string below is prefixed with «[نموذج]» ("[sample]") so nothing
// here can be mistaken for approved copy or a historical claim. Real Arabic
// text, fun facts and safety notes replace these only with explicit approval
// (see AGENTS.md: "Do not invent historical facts").
//
// `scanCode` values are the codes encoded in the PRINTED QR plaques
// (`<baseUrl>/q/<scanCode>`). They avoid ambiguous characters (0/O, 1/I/L) so
// they stay readable when typed by hand. Do NOT change them once printed.
// The history board has no scanCode: it carries the entry QR to the site.
//
// Image paths point at the authentic photography already in /public/images.
// Intrinsic width/height are nominal hints; components render inside fixed
// aspect-ratio containers with object-cover.
// ---------------------------------------------------------------------------

const P = "[نموذج]"; // sample marker

export const stations: Station[] = [
  {
    id: "history",
    slug: "history",
    title: { ar: `${P} تاريخ المعصرة` },
    shortTitle: { ar: `${P} التاريخ` },
    clues: [{ ar: `${P} ابدأ من حيث تُروى الحكاية الأولى للمكان.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن تاريخ المعصرة، بانتظار المحتوى المعتمد.` },
    funFact: { ar: `${P} معلومة طريفة مؤقتة.` },
    images: [
      {
        src: "/images/mill/panels/history-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن التاريخ` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "access-corridor",
    slug: "access-corridor",
    scanCode: "M3K7Q2",
    title: { ar: `${P} الممر` },
    shortTitle: { ar: `${P} الممر` },
    clues: [{ ar: `${P} تَقدَّم في الطريق الذي يقودك إلى الأسفل بهدوء.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن ممر الدخول، بانتظار المحتوى المعتمد.` },
    images: [
      {
        src: "/images/mill/stations/access-corridor.jpg",
        alt: { ar: `${P} ممر الدخول` },
        width: 1600,
        height: 1200,
        kind: "station",
      },
      {
        src: "/images/mill/panels/access-corridor-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن الممر` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    safetyNote: { ar: `${P} انتبه لدرجات السلّم وسِر بروية.` },
    estimatedDiscoveryMinutes: 2,
  },
  {
    id: "olive-storage",
    slug: "olive-storage",
    scanCode: "R9T4XB",
    title: { ar: `${P} مخزن الزيتون` },
    shortTitle: { ar: `${P} المخزن` },
    clues: [{ ar: `${P} ابحث عن المكان الذي يُجمَع فيه المحصول قبل العصر.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن مخزن الزيتون، بانتظار المحتوى المعتمد.` },
    funFact: { ar: `${P} معلومة طريفة مؤقتة.` },
    images: [
      {
        src: "/images/mill/stations/olive-storage.jpg",
        alt: { ar: `${P} مخزن الزيتون` },
        width: 1600,
        height: 1200,
        kind: "station",
      },
      {
        src: "/images/mill/panels/storage-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن المخزن` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
      {
        src: "/images/mill/interior/storage-room.jpg",
        alt: { ar: `${P} غرفة التخزين` },
        width: 1600,
        height: 1200,
        kind: "context",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "crusher-mdar",
    slug: "crusher-mdar",
    scanCode: "P6H2ZC",
    title: { ar: `${P} المدار` },
    shortTitle: { ar: `${P} المدار` },
    clues: [{ ar: `${P} ابحث عن الحجر الكبير الذي يدور ليَسحق الثمار.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن حجر المدار، بانتظار المحتوى المعتمد.` },
    funFact: { ar: `${P} معلومة طريفة مؤقتة.` },
    images: [
      {
        src: "/images/mill/stations/crusher-mdar.jpg",
        alt: { ar: `${P} حجر المدار` },
        width: 1600,
        height: 1200,
        kind: "station",
      },
      {
        src: "/images/mill/panels/crusher-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن المدار` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 4,
  },
  {
    id: "rudimentary-press",
    slug: "rudimentary-press",
    scanCode: "D8V5NK",
    title: { ar: `${P} المِعصرة` },
    shortTitle: { ar: `${P} المِعصرة` },
    clues: [{ ar: `${P} ابحث عن الأداة التي تضغط العجين لتستخرج الزيت.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن المعصرة التقليدية، بانتظار المحتوى المعتمد.` },
    images: [
      {
        src: "/images/mill/stations/traditional-press.jpg",
        alt: { ar: `${P} المعصرة التقليدية` },
        width: 1600,
        height: 1200,
        kind: "station",
      },
      {
        src: "/images/mill/panels/press-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن المعصرة` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 4,
  },
  {
    id: "boiler",
    slug: "boiler",
    scanCode: "T2Y7WF",
    title: { ar: `${P} المرجل` },
    shortTitle: { ar: `${P} المرجل` },
    clues: [{ ar: `${P} ابحث عن الموضع الذي يُسخَّن فيه الماء.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن المرجل، بانتظار المحتوى المعتمد.` },
    images: [
      {
        src: "/images/mill/panels/boiler-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن المرجل` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "settling-jars",
    slug: "settling-jars",
    scanCode: "J4B9RM",
    title: { ar: `${P} جِرار الترقيد` },
    shortTitle: { ar: `${P} الجِرار` },
    clues: [{ ar: `${P} ابحث عن الجِرار الكبيرة التي يهدأ فيها الزيت.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن جِرار الترقيد، بانتظار المحتوى المعتمد.` },
    funFact: { ar: `${P} معلومة طريفة مؤقتة.` },
    images: [
      {
        src: "/images/mill/stations/settling-jars.jpg",
        alt: { ar: `${P} جِرار الترقيد` },
        width: 1600,
        height: 1200,
        kind: "station",
      },
      {
        src: "/images/mill/panels/settling-jars-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن الجِرار` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
      {
        src: "/images/mill/interior/jar-room.jpg",
        alt: { ar: `${P} غرفة الجِرار` },
        width: 1600,
        height: 1200,
        kind: "context",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "byproducts",
    slug: "byproducts",
    scanCode: "X7C3PD",
    title: { ar: `${P} المنتجات الجانبية` },
    shortTitle: { ar: `${P} المخلّفات` },
    clues: [{ ar: `${P} ابحث عمّا يتبقّى بعد استخراج الزيت وله فائدة أخرى.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن المنتجات الجانبية، بانتظار المحتوى المعتمد.` },
    images: [
      {
        src: "/images/mill/panels/byproducts-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن المنتجات الجانبية` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
    ],
    estimatedDiscoveryMinutes: 3,
  },
  {
    id: "dome",
    slug: "dome",
    scanCode: "H5N8VQ",
    title: { ar: `${P} القُبّة` },
    shortTitle: { ar: `${P} القُبّة` },
    clues: [{ ar: `${P} ارفع نظرك نحو السقف المقوّس لتُنهي رحلتك.` }],
    description: { ar: `${P} نصّ تعريفي مؤقت عن القُبّة، بانتظار المحتوى المعتمد.` },
    funFact: { ar: `${P} معلومة طريفة مؤقتة.` },
    images: [
      {
        src: "/images/mill/panels/dome-panel.jpg",
        alt: { ar: `${P} لوحة تعريفية عن القُبّة` },
        width: 1600,
        height: 1200,
        kind: "panel",
      },
      {
        src: "/images/mill/exterior/rooftop-domes.jpg",
        alt: { ar: `${P} قِباب السطح` },
        width: 1600,
        height: 1200,
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
  Object.fromEntries(
    scannableStations.map((s) => [s.scanCode as string, s]),
  ),
);

export function getStation(id: string): Station | undefined {
  return stationsById[id];
}

export function getStationByScanCode(code: string): Station | undefined {
  return stationsByScanCode[code];
}
