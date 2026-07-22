/**
 * Stable, deterministic 32-bit FNV-1a hash of a string.
 *
 * Used for deterministic route assignment so a given (sessionId + playerId)
 * always maps to the same approved route template across refreshes and devices.
 * It is NOT a cryptographic hash and must not be used for security.
 */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiply via shifts, kept within uint32.
    hash = Math.imul(hash, 0x01000193);
  }
  // Coerce to unsigned 32-bit.
  return hash >>> 0;
}
