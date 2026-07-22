import { fnv1a32 } from "@/lib/hash";
import { routeTemplates } from "@/content/routes";
import type { RouteTemplate } from "@/content/types";

/**
 * Deterministically assign an approved route template to a player.
 *
 * A stable FNV-1a hash of `${sessionId}:${playerId}` selects a template by
 * modulo, so:
 *   - the route never changes after refresh (same inputs → same template);
 *   - starting points are distributed across players;
 *   - only manually approved templates can be produced (no random permutation);
 *   - every route has the same station count (invariant checked by tests).
 *
 * `templates` is injectable for testing; production uses the approved set.
 */
export function assignRoute(
  sessionId: string,
  playerId: string,
  templates: RouteTemplate[] = routeTemplates,
): RouteTemplate {
  if (templates.length === 0) {
    throw new Error("No approved route templates are configured.");
  }
  const index = fnv1a32(`${sessionId}:${playerId}`) % templates.length;
  // Index is always in range because of the modulo; the assertion documents it.
  const template = templates[index];
  if (!template) {
    throw new Error("Route assignment produced an out-of-range index.");
  }
  return template;
}
