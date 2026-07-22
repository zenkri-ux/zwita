import { CURRENT_GAME_VERSION, type GameState } from "./types";

/**
 * Migrate a persisted, possibly-older game state to the current schema.
 *
 * Persisted data can outlive code. This function accepts unknown input (what
 * actually came out of storage), validates the essential shape, and upgrades it
 * version by version. Anything unrecognisable returns null so the caller can
 * start a fresh session rather than crash on corrupt data.
 */
export function migrateGameState(input: unknown): GameState | null {
  if (!isRecord(input)) return null;

  const version =
    typeof input.gameVersion === "number" ? input.gameVersion : 0;

  // Reject data from a future version we do not understand.
  if (version > CURRENT_GAME_VERSION) return null;

  let state = input;

  // Version 0 → 1: the pre-versioned shape. Backfill defaults for any fields
  // that may be missing so strict consumers get a complete object.
  if (version < 1) {
    state = { ...state, gameVersion: 1 };
  }

  // Future steps: `if (version < 2) { ... }`.

  return coerce(state);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function attemptsRecord(v: unknown): Record<string, number> {
  if (!isRecord(v)) return {};
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === "number" && Number.isFinite(val)) out[k] = val;
  }
  return out;
}

/**
 * Coerce a record to a fully-typed GameState. Requires the identity fields to
 * be present (a session without ids is not a resumable game).
 */
function coerce(v: Record<string, unknown>): GameState | null {
  const sessionId = str(v.sessionId);
  const playerId = str(v.playerId);
  if (!sessionId || !playerId) return null;

  const locale = v.locale === "fr" || v.locale === "en" ? v.locale : "ar";

  return {
    gameVersion: CURRENT_GAME_VERSION,
    sessionId,
    playerId,
    nickname: str(v.nickname),
    avatar: str(v.avatar),
    locale,
    routeId: str(v.routeId),
    stationIds: strArray(v.stationIds),
    currentIndex: num(v.currentIndex),
    completedStationIds: strArray(v.completedStationIds),
    attemptsByStation: attemptsRecord(v.attemptsByStation),
    hintsUsed: num(v.hintsUsed),
    score: num(v.score),
    startedAt: str(v.startedAt),
    completedAt: typeof v.completedAt === "string" ? v.completedAt : undefined,
  };
}
