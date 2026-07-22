import { parseQrPayload } from "@/lib/qr/payload";
import { stationsById } from "@/content/stations";
import type { Station } from "@/content/types";
import type { GameState, ScanOutcome } from "./types";

export type ValidateResult = {
  outcome: ScanOutcome;
  /** The recognised station, when the id+token matched the allowlist. */
  station?: Station;
};

/**
 * Validate a raw scanned/entered payload against the player's current game
 * state and the station allowlist.
 *
 * Trust boundary: the raw value is untrusted. We parse strictly, then require
 * BOTH the station id AND its non-obvious token to match an allowlisted station
 * before any content is revealed. Nothing is ever treated as a URL.
 *
 * `allowlist` is injectable for testing; production uses the content map.
 */
export function validateScan(
  raw: unknown,
  state: Pick<GameState, "stationIds" | "currentIndex" | "completedStationIds">,
  allowlist: Readonly<Record<string, Station>> = stationsById,
): ValidateResult {
  const parsed = parseQrPayload(raw);
  if (!parsed.ok) return { outcome: "malformed" };

  const station = allowlist[parsed.stationId];
  if (!station || station.qrToken !== parsed.token) {
    // Unknown id, or a known id with the wrong token — not a recognised code.
    return { outcome: "unknown-station" };
  }

  if (state.completedStationIds.includes(station.id)) {
    return { outcome: "already-completed", station };
  }

  const expectedId = state.stationIds[state.currentIndex];
  if (station.id === expectedId) {
    return { outcome: "correct", station };
  }

  return { outcome: "wrong-station", station };
}
