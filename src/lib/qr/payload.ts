import { getBaseUrl } from "@/lib/config";

// Scan payload parsing.
//
// Printed QR codes encode a URL:  <baseUrl>/q/<SCANCODE>
// e.g. "http://51.103.179.122/q/P6H2ZC"
//
// A URL is used (rather than an opaque custom string) so that the phone's
// NATIVE camera app — which simply opens whatever URL it reads — lands on the
// app's /q/<code> route and the game continues. The in-app ZXing scanner reads
// the very same string and routes it through this parser.
//
// SECURITY: scanned content is untrusted. This module only EXTRACTS a code from
// the string; it never fetches, resolves or navigates to a scanned URL. The
// extracted code is then checked against the station allowlist. A string that
// is not a bare code or a `/q/<code>` URL is rejected as malformed.

/** Path segment that carries the station code. */
export const SCAN_PATH_SEGMENT = "q";

/**
 * Codes are short, uppercase and avoid ambiguous glyphs (0/O, 1/I/L) so they
 * survive being typed by hand as the manual fallback.
 */
const CODE_RE = /^[A-Z0-9]{4,12}$/;

export type ParsedScan =
  | { ok: true; code: string }
  | { ok: false; reason: "malformed" };

const MALFORMED: ParsedScan = { ok: false, reason: "malformed" };

/**
 * Extract a station code from a scanned QR value, a pasted link, or a manually
 * typed code. Returns `malformed` for anything else.
 */
export function parseScanInput(raw: unknown): ParsedScan {
  if (typeof raw !== "string") return MALFORMED;

  let value = raw.trim();
  if (!value) return MALFORMED;

  if (/^https?:\/\//i.test(value)) {
    const fromUrl = codeFromUrl(value);
    if (!fromUrl) return MALFORMED;
    value = fromUrl;
  }

  const code = value.toUpperCase();
  return CODE_RE.test(code) ? { ok: true, code } : MALFORMED;
}

/**
 * Pull the segment following `/q/` out of a URL. Parsing only — the URL is
 * never requested.
 */
function codeFromUrl(value: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  const segments = parsed.pathname.split("/").filter(Boolean);
  const index = segments.indexOf(SCAN_PATH_SEGMENT);
  if (index === -1) return null;
  return segments[index + 1] ?? null;
}

/** Build the URL to encode in a printed QR code for a station. */
export function buildScanUrl(code: string, baseUrl: string = getBaseUrl()): string {
  return `${baseUrl.replace(/\/+$/, "")}/${SCAN_PATH_SEGMENT}/${code}`;
}
