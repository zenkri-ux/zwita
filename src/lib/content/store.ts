"use client";

import { create } from "zustand";
import { stations } from "@/content/stations";
import { defaultDisplay, type StationDisplay } from "./display";

// Runtime station content for the game. Seeded synchronously from the built-in
// defaults so the first paint always has content and the game works offline;
// then refreshed from /api/content (which applies admin overrides) and cached
// so a later offline visit keeps the last known content.

const CACHE_KEY = "zwita.content";

function seed(): Record<string, StationDisplay> {
  return Object.fromEntries(stations.map((s) => [s.id, defaultDisplay(s)]));
}

type ContentStore = {
  byId: Record<string, StationDisplay>;
  loaded: boolean;
  load: () => Promise<void>;
};

export const useContentStore = create<ContentStore>((set, get) => ({
  byId: seed(),
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    set({ loaded: true });

    // Instant offline content from the previous session, if any.
    if (typeof window !== "undefined") {
      try {
        const cached = window.localStorage.getItem(CACHE_KEY);
        if (cached) set({ byId: { ...seed(), ...JSON.parse(cached) } });
      } catch {
        // ignore corrupt cache
      }
    }

    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { stations?: Record<string, StationDisplay> };
      if (data.stations) {
        set({ byId: { ...seed(), ...data.stations } });
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(data.stations));
        } catch {
          // storage full/blocked — not fatal
        }
      }
    } catch {
      // Offline or server down: keep the seeded/cached content.
    }
  },
}));

/** Resolved display content for a station, always defined (falls back to default). */
export function useStationDisplay(id: string | undefined): StationDisplay | undefined {
  return useContentStore((s) => (id ? s.byId[id] : undefined));
}
