import type { Locale } from "@/content/types";

export type { Locale };

/**
 * The persisted game state. Shape is defined in AGENTS.md and must stay stable;
 * changes require bumping CURRENT_GAME_VERSION and adding a migration step.
 */
export type GameState = {
  gameVersion: number;
  sessionId: string;
  playerId: string;
  nickname: string;
  avatar: string;
  locale: Locale;
  routeId: string;
  stationIds: string[];
  currentIndex: number;
  completedStationIds: string[];
  attemptsByStation: Record<string, number>;
  hintsUsed: number;
  score: number;
  startedAt: string;
  completedAt?: string;
};

/** Current persisted schema version. Bump when GameState shape changes. */
export const CURRENT_GAME_VERSION = 1;

/**
 * Derived, non-persisted phase of the experience. Computed from GameState so a
 * refresh always resumes on the correct screen.
 */
export type GamePhase = "welcome" | "setup" | "mission" | "complete";

/** Outcome of validating a scanned (or manually entered) QR payload. */
export type ScanOutcome =
  | "correct"
  | "wrong-station"
  | "already-completed"
  | "unknown-station"
  | "malformed";
