"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";

/**
 * Client hook that triggers a one-time hydrate of persisted game state and
 * returns the current store slice. Every screen uses this so a refresh restores
 * progress before any redirect decision is made.
 */
export function useHydratedGame() {
  const hydrate = useGameStore((s) => s.hydrate);
  const hydrated = useGameStore((s) => s.hydrated);
  const state = useGameStore((s) => s.state);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  return { hydrated, state, phase };
}
