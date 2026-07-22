// Generate the printable QR codes for the mill's plaques.
//
//   npm run qr
//   NEXT_PUBLIC_BASE_URL=https://autre-domaine.tn npm run qr
//
// Output: qr/*.svg (vector, scales to any print size) + qr/index.html (a
// printable contact sheet with one card per plaque).
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

function card(entry) {
  return `    <figure class="card">
      <img src="./${entry.file}" alt="QR ${entry.title}" />
      <figcaption>
        <strong class="ar">${entry.ar}</strong>
        <span class="fr">${entry.fr}</span>
        <code>${entry.code ?? "—"}</code>
        <span class="url">${entry.url}</span>
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
  .card { margin: 0; padding: 16px; background: #fff; border: 1px solid #ddd8cc; border-radius: 12px; text-align: center; break-inside: avoid; }
  .card img { width: 100%; height: auto; }
  figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
  .ar { font-size: 1.25rem; }
  .fr { color: #6F7938; }
  code { background: #F7F2E8; padding: 2px 6px; border-radius: 6px; font-size: 1rem; letter-spacing: 1px; }
  .url { font-size: .7rem; color: #8a837b; word-break: break-all; }
  @media print { body { background: #fff; margin: 0; } .card { border-color: #999; } }
</style>
</head>
<body>
  <h1>ZWITA — codes QR des plaques</h1>
  <p class="base">Base : <strong>${BASE_URL}</strong> — ${entries.length} codes.
     Le code court sous chaque QR peut être saisi à la main dans l'app si le scan échoue.</p>
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
    ar: "الدخول",
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
    const svg = await QRCode.toString(entry.url, { ...QR_OPTIONS, type: "svg" });
    writeFileSync(join(OUT_DIR, entry.file), svg, "utf8");
    console.log(`${entry.file.padEnd(28)} ${entry.url}`);
  }

  writeFileSync(join(OUT_DIR, "index.html"), sheet(entries), "utf8");
  console.log(`\n${entries.length} QR generated in ./${OUT_DIR} (+ index.html to print).`);
}

main().catch((error) => {
  console.error(`QR generation failed: ${error.message}`);
  process.exit(1);
});
