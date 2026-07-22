import { describe, it, expect } from "vitest";
import { assignRoute } from "@/lib/game/route";
import { routeTemplates, STATIONS_PER_ROUTE } from "@/content/routes";
import type { RouteTemplate } from "@/content/types";

const templates: RouteTemplate[] = [
  { id: "t1", stationIds: ["a", "b", "c"] },
  { id: "t2", stationIds: ["d", "e", "f"] },
  { id: "t3", stationIds: ["g", "h", "i"] },
];

describe("assignRoute", () => {
  it("is deterministic for the same session and player", () => {
    const first = assignRoute("session-1", "player-1", templates);
    const second = assignRoute("session-1", "player-1", templates);
    expect(second.id).toBe(first.id);
  });

  it("distributes starting points across templates", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i += 1) {
      seen.add(assignRoute(`s-${i}`, `p-${i}`, templates).id);
    }
    // With three templates and varied inputs we expect more than one bucket.
    expect(seen.size).toBeGreaterThan(1);
  });

  it("only ever returns an approved template", () => {
    const ids = new Set(templates.map((t) => t.id));
    for (let i = 0; i < 30; i += 1) {
      expect(ids.has(assignRoute(`x-${i}`, `y-${i}`, templates).id)).toBe(true);
    }
  });

  it("throws when no templates are configured", () => {
    expect(() => assignRoute("s", "p", [])).toThrow();
  });

  it("every approved production template has the same station count", () => {
    for (const template of routeTemplates) {
      expect(template.stationIds.length).toBe(STATIONS_PER_ROUTE);
    }
  });
});
