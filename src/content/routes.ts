import type { RouteTemplate } from "./types";

// Manually approved route templates. Route assignment picks one of these
// deterministically (see src/lib/game/route.ts) — never a random permutation —
// so starting points are distributed while unsafe transitions cannot occur.
//
// Every template covers the SAME eight scannable stations (the eight physical
// plaques). The history board is not included: it carries the entry QR to the
// site rather than a station code.
//
// The base order follows the mill's production flow (storage → crushing →
// pressing → boiling → settling → by-products → dome). The other templates are
// rotations of it, so players start at different points.
//
// TODO (on-site validation): confirm each template's transitions are safe to
// walk in the underground space before printing final signage.

const FLOW = [
  "access-corridor",
  "olive-storage",
  "crusher-mdar",
  "rudimentary-press",
  "boiler",
  "settling-jars",
  "byproducts",
  "dome",
] as const;

/** Rotate the canonical flow so routes start at different stations. */
function rotate(offset: number): string[] {
  return FLOW.map((_, i) => FLOW[(i + offset) % FLOW.length] as string);
}

export const routeTemplates: RouteTemplate[] = [
  { id: "flow-a", stationIds: rotate(0) },
  { id: "flow-b", stationIds: rotate(2) },
  { id: "flow-c", stationIds: rotate(4) },
  { id: "flow-d", stationIds: rotate(6) },
];

export const STATIONS_PER_ROUTE = FLOW.length;
