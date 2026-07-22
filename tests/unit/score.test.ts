import { describe, it, expect } from "vitest";
import { scoreForStation, BASE_STATION_POINTS } from "@/lib/game/score";

describe("scoreForStation", () => {
  it("awards full points for a first-try find", () => {
    expect(scoreForStation(1)).toBe(BASE_STATION_POINTS);
  });

  it("decreases as attempts increase", () => {
    expect(scoreForStation(2)).toBeLessThan(scoreForStation(1));
    expect(scoreForStation(3)).toBeLessThan(scoreForStation(2));
  });

  it("never drops below the floor", () => {
    expect(scoreForStation(100)).toBeGreaterThanOrEqual(20);
  });

  it("is deterministic", () => {
    expect(scoreForStation(4)).toBe(scoreForStation(4));
  });

  it("treats zero/negative attempts as a first find (defensive)", () => {
    expect(scoreForStation(0)).toBe(BASE_STATION_POINTS);
  });
});
