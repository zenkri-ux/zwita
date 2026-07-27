// Admin session tokens. A signed, expiring cookie — no database, no library.
// Uses Web Crypto (HMAC-SHA256) so the exact same code verifies in the Edge
// middleware and in the Node route handlers.
//
// The signing key is ADMIN_PASSWORD: rotating the password invalidates every
// existing session, which is the behaviour we want. If ADMIN_PASSWORD is unset
// the admin area is effectively disabled (login always fails).

export const ADMIN_COOKIE = "zwita_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return b64url(new Uint8Array(sig));
}

/** Length-safe constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Create a signed session token valid for SESSION_TTL_MS. */
export async function signSession(secret: string): Promise<string> {
  const payload = b64url(encoder.encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })));
  const sig = await hmac(payload, secret);
  return `${payload}.${sig}`;
}

/** Verify a session token against the current password. */
export async function verifySession(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(payload, secret);
  if (!safeEqual(sig, expected)) return false;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
