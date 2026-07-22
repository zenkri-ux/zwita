import { create } from "zustand";
import { createPersistence } from "@/lib/persistence/indexeddb";
import { GAME_STATE_KEY, type PersistenceAdapter } from "@/lib/persistence/types";
import { migrateGameState } from "@/lib/game/migrate";
import { assignRoute } from "@/lib/game/route";
import { validateScan, type ValidateResult } from "@/lib/game/validate";
import { scoreForStation } from "@/lib/game/score";
import { isRouteComplete, derivePhase } from "@/lib/game/completion";
import { CURRENT_GAME_VERSION, type GameState, type GamePhase } from "@/lib/game/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/locale";

// Single persistence instance for the app lifetime (client only).
let persistence: PersistenceAdapter | null = null;
function store(): PersistenceAdapter {
  if (!persistence) persistence = createPersistence();
  return persistence;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID.
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type GameStore = {
  state: GameState | null;
  hydrated: boolean;
  phase: GamePhase;

  /** Load persisted state (called once on the client). */
  hydrate: () => Promise<void>;
  /** Create a fresh anonymous session if none exists. */
  initSession: () => void;
  /** Save nickname + avatar and deterministically assign the route. */
  setProfile: (nickname: string, avatar: string) => void;
  /** Validate a scanned/entered payload and update progress. */
  submitScan: (raw: string) => ValidateResult;
  /** Advance to the next clue (after a discovery screen). */
  advance: () => void;
  /** Clear all progress and return to the welcome screen. */
  reset: () => void;
};

function persist(state: GameState | null): void {
  if (state) {
    void store().set(GAME_STATE_KEY, state);
  } else {
    void store().remove(GAME_STATE_KEY);
  }
}

function withPhase(state: GameState | null) {
  return { state, phase: derivePhase(state) };
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  hydrated: false,
  phase: "welcome",

  hydrate: async () => {
    if (get().hydrated) return;
    const raw = await store().get<unknown>(GAME_STATE_KEY);
    // A session may have been created (initSession) while this async read was
    // in flight. Never clobber live in-memory state with the stored snapshot;
    // just mark hydration complete in that case.
    if (get().state) {
      set({ hydrated: true });
      return;
    }
    const migrated = migrateGameState(raw);
    set({ ...withPhase(migrated), hydrated: true });
  },

  initSession: () => {
    if (get().state) return;
    const now = new Date().toISOString();
    const fresh: GameState = {
      gameVersion: CURRENT_GAME_VERSION,
      sessionId: newId(),
      playerId: newId(),
      nickname: "",
      avatar: "",
      locale: DEFAULT_LOCALE,
      routeId: "",
      stationIds: [],
      currentIndex: 0,
      completedStationIds: [],
      attemptsByStation: {},
      hintsUsed: 0,
      score: 0,
      startedAt: now,
    };
    set(withPhase(fresh));
    persist(fresh);
  },

  setProfile: (nickname, avatar) => {
    const current = get().state;
    if (!current) return;
    const route = assignRoute(current.sessionId, current.playerId);
    const next: GameState = {
      ...current,
      nickname: nickname.trim().slice(0, 40),
      avatar,
      routeId: route.id,
      stationIds: [...route.stationIds],
      currentIndex: 0,
      completedStationIds: [],
      attemptsByStation: {},
      score: 0,
    };
    set(withPhase(next));
    persist(next);
  },

  submitScan: (raw) => {
    const current = get().state;
    if (!current) return { outcome: "malformed" };

    const result = validateScan(raw, current);
    const expectedId = current.stationIds[current.currentIndex];

    // Already-completed is a navigation slip, not a wrong guess: no penalty.
    if (!expectedId || result.outcome === "already-completed") {
      return result;
    }

    const attempts = (current.attemptsByStation[expectedId] ?? 0) + 1;
    const attemptsByStation = {
      ...current.attemptsByStation,
      [expectedId]: attempts,
    };

    if (result.outcome !== "correct" || !result.station) {
      const next: GameState = { ...current, attemptsByStation };
      set(withPhase(next));
      persist(next);
      return result;
    }

    // Correct scan: award score, mark complete, advance.
    const completedStationIds = current.completedStationIds.includes(result.station.id)
      ? current.completedStationIds
      : [...current.completedStationIds, result.station.id];

    let next: GameState = {
      ...current,
      attemptsByStation,
      completedStationIds,
      score: current.score + scoreForStation(attempts),
      currentIndex: current.currentIndex + 1,
    };
    if (isRouteComplete(next) && !next.completedAt) {
      next = { ...next, completedAt: new Date().toISOString() };
    }
    set(withPhase(next));
    persist(next);
    return result;
  },

  advance: () => {
    // Advancing already happens on a correct scan; kept for explicit UI flow
    // and future hint/skip mechanics. Currently a no-op guard.
    const current = get().state;
    if (!current) return;
    set(withPhase(current));
  },

  reset: () => {
    set({ ...withPhase(null), hydrated: true });
    persist(null);
  },
}));
