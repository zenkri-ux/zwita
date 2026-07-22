import type { RouteTemplate } from "./types";

// Manually approved route templates. Route assignment picks one of these
// deterministically (see src/lib/game/route.ts) — never a random permutation —
// so starting points are distributed while unsafe transitions cannot occur.
//
// The first vertical slice ships a single approved THREE-station demo route.
// Additional templates (and full nine-station routes) are added later once
// their transitions are safety-validated (see plan item U2).
//
// Invariant enforced by tests: every template must contain the same number of
// stations so all players receive an equivalent-length experience.

export const routeTemplates: RouteTemplate[] = [
  {
    id: "demo-a",
    stationIds: ["olive-storage", "crusher-mdar", "settling-jars"],
  },
];

export const STATIONS_PER_ROUTE = 3;
