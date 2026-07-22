import { parseScanInput } from "@/lib/qr/payload";
import { stationsByScanCode } from "@/content/stations";
import type { Station } from "@/content/types";
import type { GameState, ScanOutcome } from "./types";

export type ValidateResult = {
  outcome: ScanOutcome;
  /** The recognised station, when the code matched the allowlist. */
  station?: Station;
};

/**
 * Validate a scanned QR / typed code against the player's current state.
 *
 * Trust boundary: `raw` is untrusted. It is parsed to a code (never navigated
 * to), then the code must appear in the station allowlist before any content is
 * revealed. This is what decides whether the player scanned the REQUIRED plaque
 * or a different one.
 *
 * `allowlist` is injectable for testing; production uses the content map.
 */
export function validateScan(
  raw: unknown,
  state: Pick<GameState, "stationIds" | "currentIndex" | "completedStationIds">,
  allowlist: Readonly<Record<string, Station>> = stationsByScanCode,
): ValidateResult {
  const parsed = parseScanInput(raw);
  if (!parsed.ok) return { outcome: "malformed" };

  const station = allowlist[parsed.code];
  if (!station) return { outcome: "unknown-station" };

  if (state.completedStationIds.includes(station.id)) {
    return { outcome: "already-completed", station };
  }

  const expectedId = state.stationIds[state.currentIndex];
  if (station.id === expectedId) {
    return { outcome: "correct", station };
  }

  return { outcome: "wrong-station", station };
}
