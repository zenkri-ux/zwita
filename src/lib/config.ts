/**
 * Public base URL of the deployment. This is what printed QR codes encode, so
 * it must stay stable once codes are physically printed.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_BASE_URL (set at build time for link/QR generation)
 *   2. the browser's current origin (so the app works on localhost and on the
 *      server without rebuilding)
 *   3. the production domain used to generate the printed codes
 *
 * Served over HTTPS via Traefik + Let's Encrypt, which is what allows the
 * in-app camera (getUserMedia) and the offline service worker to work.
 */
export const FALLBACK_BASE_URL = "https://zwita.gr07-idriss.work.gd";

export function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return stripTrailingSlash(configured);
  if (typeof window !== "undefined" && window.location?.origin) {
    return stripTrailingSlash(window.location.origin);
  }
  return FALLBACK_BASE_URL;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
