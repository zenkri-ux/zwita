import type { GameState, GamePhase } from "./types";

/**
 * A route is complete only when every station in the assigned route has been
 * recorded as completed. Order-independent and duplicate-safe.
 */
export function isRouteComplete(
  state: Pick<GameState, "stationIds" | "completedStationIds">,
): boolean {
  if (state.stationIds.length === 0) return false;
  const done = new Set(state.completedStationIds);
  return state.stationIds.every((id) => done.has(id));
}

/**
 * Derive the current phase from persisted state so a refresh resumes on the
 * right screen. Never persisted.
 *
 * A session is created (initSession) the moment the player taps "start", before
 * a nickname is entered — so the presence of a session, not of a nickname, is
 * what moves the player past the welcome screen. "setup" is exactly the window
 * where a session exists but no route has been assigned yet.
 */
export function derivePhase(state: GameState | null): GamePhase {
  if (!state) return "welcome";
  if (!state.routeId || state.stationIds.length === 0) return "setup";
  if (state.completedAt || isRouteComplete(state)) return "complete";
  return "mission";
}
