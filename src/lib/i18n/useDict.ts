"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { getDict, type Dictionary } from "./dictionaries";
import { DEFAULT_LOCALE } from "./locale";

/**
 * Returns the UI dictionary for the player's currently selected locale. Falls
 * back to the default (Arabic) before hydration or when no session exists.
 */
export function useDict(): Dictionary {
  const locale = useGameStore((s) => s.state?.locale ?? DEFAULT_LOCALE);
  return getDict(locale);
}
