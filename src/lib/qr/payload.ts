// QR payload parsing.
//
// Scanned content is UNTRUSTED input. Payloads use a strict, versioned,
// colon-delimited format that is deliberately NOT a URL:
//
//     ZWITA:1:<stationId>:<token>
//
// e.g. "ZWITA:1:crusher-mdar:dev-mdar-9X3"
//
// This module never constructs, resolves or opens a URL from scanned data. It
// only extracts the station id and token for allowlist validation elsewhere.

export const QR_PREFIX = "ZWITA";
export const QR_VERSION = "1";

export type ParsedPayload =
  | { ok: true; stationId: string; token: string }
  | { ok: false; reason: "malformed" };

// stationId: lowercase kebab (matches content slugs). token: url-safe-ish, no colons.
const STATION_ID_RE = /^[a-z][a-z0-9-]{0,63}$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * Parse a raw scanned string into a station id + token, or a malformed result.
 * Strict by design: anything that is not an exact ZWITA:1 payload is rejected,
 * including URL-shaped strings, so no arbitrary link can ever be followed.
 */
export function parseQrPayload(raw: unknown): ParsedPayload {
  if (typeof raw !== "string") return { ok: false, reason: "malformed" };

  const value = raw.trim();
  // Exactly four colon-separated segments; extra colons (e.g. in a URL) fail.
  const parts = value.split(":");
  if (parts.length !== 4) return { ok: false, reason: "malformed" };

  const [prefix, version, stationId, token] = parts as [
    string,
    string,
    string,
    string,
  ];

  if (prefix !== QR_PREFIX) return { ok: false, reason: "malformed" };
  if (version !== QR_VERSION) return { ok: false, reason: "malformed" };
  if (!STATION_ID_RE.test(stationId)) return { ok: false, reason: "malformed" };
  if (!TOKEN_RE.test(token)) return { ok: false, reason: "malformed" };

  return { ok: true, stationId, token };
}

/** Build a canonical payload string (used by the simulated scanner and tests). */
export function buildQrPayload(stationId: string, token: string): string {
  return `${QR_PREFIX}:${QR_VERSION}:${stationId}:${token}`;
}
