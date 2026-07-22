/**
 * Public base URL of the deployment. This is what printed QR codes encode, so
 * it must stay stable once codes are physically printed.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_BASE_URL (set at build time for link/QR generation)
 *   2. the browser's current origin (so the app works on localhost and on the
 *      server without rebuilding)
 *   3. the Azure VM fallback used to generate the printed codes
 */
export const FALLBACK_BASE_URL = "http://51.103.179.122";

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
