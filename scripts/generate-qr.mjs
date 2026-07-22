// Generate the printable QR codes for the mill's plaques.
//
//   npm run qr
//   NEXT_PUBLIC_BASE_URL=https://autre-domaine.tn npm run qr
//
// Output: qr/*.svg (vector, scales to any print size) + qr/index.html (a
// printable contact sheet with one card per plaque).
//
// Each SVG is SELF-LABELLED: the station name (ar + fr) and the short code are
// drawn under the QR. Nine bare QR codes are indistinguishable by eye, so the
// label is what stops the wrong code being glued to the wrong plaque. Printing
// the code also gives visitors the manual fallback when scanning fails (dust,
// dim light, refused camera permission).
//
// The station codes are read straight out of src/content/stations.ts so this
// script and the app can never disagree. If that file's shape changes, the
// script fails loudly rather than emitting wrong codes onto physical signage.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://zwita.gr07-idriss.work.gd"
).replace(/\/+$/, "");

const OUT_DIR = "qr";
const EXPECTED_STATIONS = 8;

// Higher error correction: plaques get dusty and are read in dim light.
const QR_OPTIONS = { errorCorrectionLevel: "Q", margin: 2, width: 1024 };

// Human labels for the printable sheet (ar = what visitors see on the plaque).
const LABELS = {
  "access-corridor": { ar: "الممر", fr: "Couloir d'accès" },
  "olive-storage": { ar: "مخزن الزيتون", fr: "Stockage des olives" },
  "crusher-mdar": { ar: "المدار", fr: "Meule / broyeur" },
  "rudimentary-press": { ar: "المِعصرة", fr: "Presse traditionnelle" },
  boiler: { ar: "المرجل", fr: "Chaudière" },
  "settling-jars": { ar: "جِرار الترقيد", fr: "Jarres de décantation" },
  byproducts: { ar: "المنتجات الجانبية", fr: "Sous-produits" },
  dome: { ar: "القُبّة", fr: "Coupole" },
};

function readStations() {
  const source = readFileSync("src/content/stations.ts", "utf8");
  const re = /id:\s*"([a-z-]+)",\s*\n\s*slug:\s*"[a-z-]+",\s*\n\s*scanCode:\s*"([A-Z0-9]+)"/g;
  const found = [];
  for (const match of source.matchAll(re)) {
    found.push({ id: match[1], code: match[2] });
  }
  if (found.length !== EXPECTED_STATIONS) {
    throw new Error(
      `Expected ${EXPECTED_STATIONS} scannable stations, parsed ${found.length}. ` +
        `Check the shape of src/content/stations.ts before printing anything.`,
    );
  }
  const codes = new Set(found.map((s) => s.code));
  if (codes.size !== found.length) {
    throw new Error("Duplicate scanCode detected — refusing to generate.");
  }
  return found;
}

const escapeXml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );

/**
 * Wrap a bare QR SVG with nothing but the short manual-entry code beneath it.
 *
 * The plaques stay deliberately bare: the station name is already printed on
 * the physical panel next to the code, so repeating it would be noise. The code
 * is kept because it is the visitor's fallback when scanning fails. The entry
 * QR has no code and therefore renders as a plain square.
 *
 * Which file belongs on which plaque is identified by the file name and the
 * contact sheet, not by text on the sticker.
 *
 * The QR stays pure black-on-white — styling it would only hurt scan
 * reliability.
 */
function labelledSvg(qrSvg, entry) {
  // The qrcode lib emits `viewBox="0 0 N N"`; re-embed its content as a nested
  // <svg> so it scales into our layout independently of its module count.
  const viewBox = qrSvg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 37 37";
  const inner = qrSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

  const W = 1000;
  const PAD = 48;
  const qrSize = W - PAD * 2;

  const boxY = PAD + qrSize + 40;
  const boxH = 118;
  const H = entry.code ? boxY + boxH + PAD : PAD + qrSize + PAD;

  const codeBlock = entry.code
    ? `  <rect x="${PAD}" y="${boxY}" width="${W - PAD * 2}" height="${boxH}" rx="20"
        fill="#F7F2E8" stroke="#B7794C" stroke-width="3"/>
  <text x="${W / 2}" y="${boxY + 78}" text-anchor="middle" font-size="72"
        font-weight="700" letter-spacing="10" fill="#25221D"
        font-family="ui-monospace, 'Courier New', monospace">${escapeXml(entry.code)}</text>
`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"
     viewBox="0 0 ${W} ${H}" font-family="system-ui, 'Segoe UI', Tahoma, Arial, sans-serif">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <svg x="${PAD}" y="${PAD}" width="${qrSize}" height="${qrSize}" viewBox="${viewBox}">
${inner}
  </svg>
${codeBlock}</svg>
`;
}

function card(entry) {
  // The printed sticker stays bare, so the sheet carries the identification:
  // station name, file name and code — everything needed to match a printout
  // to the right plaque before sticking it on.
  return `    <figure class="card">
      <img src="./${escapeXml(entry.file)}" alt="QR ${escapeXml(entry.fr)}" />
      <figcaption>
        <strong>${escapeXml(entry.ar)}</strong>
        <span>${escapeXml(entry.fr)}</span>
        <span class="meta">${escapeXml(entry.file)}${entry.code ? ` · ${escapeXml(entry.code)}` : ""}</span>
      </figcaption>
    </figure>`;
}

function sheet(entries) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>ZWITA — QR à imprimer</title>
<style>
  body { font-family: system-ui, sans-serif; color: #25221D; background: #F7F2E8; margin: 24px; }
  h1 { color: #07598F; }
  p.base { color: #6b6560; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
  .card { margin: 0; padding: 12px; background: #fff; border: 1px solid #ddd8cc; border-radius: 12px; text-align: center; break-inside: avoid; }
  .card img { width: 100%; height: auto; }
  figcaption { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
  figcaption strong { font-size: 1.05rem; }
  figcaption span { font-size: .8rem; color: #6F7938; }
  figcaption .meta { font-size: .7rem; color: #8a837b; font-family: ui-monospace, monospace; }
  @media print { body { background: #fff; margin: 0; } .card { border-color: #999; } }
</style>
</head>
<body>
  <h1>ZWITA — codes QR des plaques</h1>
  <p class="base">Base : <strong>${escapeXml(BASE_URL)}</strong> — ${entries.length} codes.
     Chaque QR porte son nom de station et son code court : ce code peut être saisi
     à la main dans l'app si le scan échoue (poussière, faible lumière, caméra refusée).<br>
     Taille d'impression conseillée : <strong>4×4 cm minimum</strong> (scan à ~30 cm),
     <strong>8×8 cm</strong> si les visiteurs scannent à 1 m.</p>
  <div class="grid">
${entries.map(card).join("\n")}
  </div>
</body>
</html>
`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const entries = [];

  // 1. Entry QR (history board) — opens the game, not a station.
  const entryUrl = `${BASE_URL}/`;
  entries.push({
    file: "00-entree-histoire.svg",
    url: entryUrl,
    ar: "امسح لتبدأ الرحلة",
    fr: "Entrée — plaque Histoire",
    code: null,
  });

  // 2. One QR per physical plaque.
  readStations().forEach((station, index) => {
    const label = LABELS[station.id] ?? { ar: station.id, fr: station.id };
    entries.push({
      file: `${String(index + 1).padStart(2, "0")}-${station.id}.svg`,
      url: `${BASE_URL}/q/${station.code}`,
      ar: label.ar,
      fr: label.fr,
      code: station.code,
    });
  });

  for (const entry of entries) {
    const qrSvg = await QRCode.toString(entry.url, { ...QR_OPTIONS, type: "svg" });
    writeFileSync(join(OUT_DIR, entry.file), labelledSvg(qrSvg, entry), "utf8");
    console.log(
      `${entry.file.padEnd(28)} ${(entry.code ?? "entrée").padEnd(8)} ${entry.url}`,
    );
  }

  writeFileSync(join(OUT_DIR, "index.html"), sheet(entries), "utf8");
  console.log(`\n${entries.length} QR generated in ./${OUT_DIR} (+ index.html to print).`);
}

main().catch((error) => {
  console.error(`QR generation failed: ${error.message}`);
  process.exit(1);
});
