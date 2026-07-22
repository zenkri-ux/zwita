import { describe, it, expect } from "vitest";
import { isRouteComplete, derivePhase } from "@/lib/game/completion";
import { CURRENT_GAME_VERSION, type GameState } from "@/lib/game/types";

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    gameVersion: CURRENT_GAME_VERSION,
    sessionId: "s",
    playerId: "p",
    nickname: "N",
    avatar: "🫒",
    locale: "ar",
    routeId: "demo-a",
    stationIds: ["a", "b", "c"],
    currentIndex: 0,
    completedStationIds: [],
    attemptsByStation: {},
    hintsUsed: 0,
    score: 0,
    startedAt: "2026-07-22T00:00:00.000Z",
    ...overrides,
  };
}

describe("isRouteComplete", () => {
  it("is false with an empty route", () => {
    expect(isRouteComplete({ stationIds: [], completedStationIds: [] })).toBe(false);
  });

  it("is false until every station is done", () => {
    expect(
      isRouteComplete({ stationIds: ["a", "b"], completedStationIds: ["a"] }),
    ).toBe(false);
  });

  it("is true when all stations are completed (order-independent)", () => {
    expect(
      isRouteComplete({
        stationIds: ["a", "b", "c"],
        completedStationIds: ["c", "a", "b"],
      }),
    ).toBe(true);
  });
});

describe("derivePhase", () => {
  it("welcome only when there is no session at all", () => {
    expect(derivePhase(null)).toBe("welcome");
  });

  it("setup once a session exists but no route is assigned (nickname may be empty)", () => {
    // A session is created before the nickname is entered on the setup screen.
    expect(
      derivePhase(baseState({ nickname: "", routeId: "", stationIds: [] })),
    ).toBe("setup");
    expect(derivePhase(baseState({ routeId: "", stationIds: [] }))).toBe("setup");
  });

  it("mission when a route is in progress", () => {
    expect(derivePhase(baseState({ currentIndex: 1 }))).toBe("mission");
  });

  it("complete when all stations are done", () => {
    expect(
      derivePhase(
        baseState({ completedStationIds: ["a", "b", "c"], currentIndex: 3 }),
      ),
    ).toBe("complete");
  });

  it("complete when completedAt is set", () => {
    expect(derivePhase(baseState({ completedAt: "2026-07-22T01:00:00.000Z" }))).toBe(
      "complete",
    );
  });
});
