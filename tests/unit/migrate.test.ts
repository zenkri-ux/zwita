import { describe, it, expect } from "vitest";
import { migrateGameState } from "@/lib/game/migrate";
import { CURRENT_GAME_VERSION } from "@/lib/game/types";

describe("migrateGameState", () => {
  it("returns null for non-object input", () => {
    expect(migrateGameState(null)).toBeNull();
    expect(migrateGameState("nope")).toBeNull();
  });

  it("returns null when identity fields are missing", () => {
    expect(migrateGameState({ gameVersion: 1, nickname: "x" })).toBeNull();
  });

  it("upgrades a pre-versioned (v0) shape and backfills defaults", () => {
    const migrated = migrateGameState({
      sessionId: "s1",
      playerId: "p1",
      nickname: "Sara",
    });
    expect(migrated).not.toBeNull();
    expect(migrated?.gameVersion).toBe(CURRENT_GAME_VERSION);
    expect(migrated?.locale).toBe("ar");
    expect(migrated?.stationIds).toEqual([]);
    expect(migrated?.attemptsByStation).toEqual({});
    expect(migrated?.score).toBe(0);
  });

  it("preserves a valid current-version state", () => {
    const input = {
      gameVersion: CURRENT_GAME_VERSION,
      sessionId: "s",
      playerId: "p",
      nickname: "N",
      avatar: "🫒",
      locale: "ar",
      routeId: "demo-a",
      stationIds: ["olive-storage", "crusher-mdar"],
      currentIndex: 1,
      completedStationIds: ["olive-storage"],
      attemptsByStation: { "olive-storage": 2 },
      hintsUsed: 0,
      score: 80,
      startedAt: "2026-07-22T00:00:00.000Z",
    };
    const migrated = migrateGameState(input);
    expect(migrated).toMatchObject({
      routeId: "demo-a",
      currentIndex: 1,
      completedStationIds: ["olive-storage"],
      score: 80,
    });
  });

  it("rejects data from a future version", () => {
    expect(
      migrateGameState({
        gameVersion: CURRENT_GAME_VERSION + 1,
        sessionId: "s",
        playerId: "p",
      }),
    ).toBeNull();
  });

  it("drops corrupt field types via coercion", () => {
    const migrated = migrateGameState({
      gameVersion: 1,
      sessionId: "s",
      playerId: "p",
      stationIds: ["ok", 5, null],
      currentIndex: "bad",
      attemptsByStation: { a: 1, b: "x" },
    });
    expect(migrated?.stationIds).toEqual(["ok"]);
    expect(migrated?.currentIndex).toBe(0);
    expect(migrated?.attemptsByStation).toEqual({ a: 1 });
  });
});
