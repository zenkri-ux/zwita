import "server-only";
import { getDb } from "./db";
import { stations, stationsById } from "@/content/stations";
import {
  applyOverride,
  defaultDisplay,
  type StationDisplay,
  type StationOverride,
} from "@/lib/content/display";
import { MAX_STRING_LEN } from "@/lib/analytics/events";

type OverrideRow = {
  station_id: string;
  clue_ar: string | null;
  clue_fr: string | null;
  clue_en: string | null;
  desc_ar: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  cover_image: string | null;
  explain_image: string | null;
};

const DESC_MAX = 2000;

function rowToOverride(r: OverrideRow): StationOverride {
  return {
    clue: { ar: r.clue_ar ?? undefined, fr: r.clue_fr ?? undefined, en: r.clue_en ?? undefined },
    description: {
      ar: r.desc_ar ?? undefined,
      fr: r.desc_fr ?? undefined,
      en: r.desc_en ?? undefined,
    },
    coverImage: r.cover_image,
    explainImage: r.explain_image,
  };
}

function overridesById(): Map<string, OverrideRow> {
  const rows = getDb().prepare("SELECT * FROM station_overrides").all() as OverrideRow[];
  return new Map(rows.map((r) => [r.station_id, r]));
}

/** Merged content for the game/public API: defaults with overrides applied. */
export function getPublicContent(): Record<string, StationDisplay> {
  const overrides = overridesById();
  const out: Record<string, StationDisplay> = {};
  for (const s of stations) {
    const base = defaultDisplay(s);
    const row = overrides.get(s.id);
    out[s.id] = row ? applyOverride(base, rowToOverride(row)) : base;
  }
  return out;
}

export type EditorStation = {
  id: string;
  titleAr: string;
  effective: StationDisplay;
  /** Built-in default cover URL, so the editor can revert an uploaded image. */
  defaultCoverImage: string;
  override: {
    coverImage: string | null;
    explainImage: string | null;
  } | null;
};

/** Per-station data for the admin editor: effective values + raw image state. */
export function getEditorContent(): EditorStation[] {
  const overrides = overridesById();
  return stations.map((s) => {
    const base = defaultDisplay(s);
    const row = overrides.get(s.id);
    const effective = row ? applyOverride(base, rowToOverride(row)) : base;
    return {
      id: s.id,
      titleAr: s.title.ar,
      effective,
      defaultCoverImage: base.coverImage,
      override: row
        ? { coverImage: row.cover_image, explainImage: row.explain_image }
        : null,
    };
  });
}

export type SaveOverrideInput = {
  clue: { ar?: string; fr?: string; en?: string };
  description: { ar?: string; fr?: string; en?: string };
  coverImage: string | null;
  explainImage: string | null;
};

function clip(v: unknown, max = MAX_STRING_LEN): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
}

/** Returns false if the station id is not part of the built-in content. */
export function saveOverride(stationId: string, input: SaveOverrideInput): boolean {
  if (!stationsById[stationId]) return false;
  getDb()
    .prepare(
      `INSERT INTO station_overrides
         (station_id, clue_ar, clue_fr, clue_en, desc_ar, desc_fr, desc_en,
          cover_image, explain_image, updated_at)
       VALUES
         (@id, @clue_ar, @clue_fr, @clue_en, @desc_ar, @desc_fr, @desc_en,
          @cover, @explain, @ts)
       ON CONFLICT(station_id) DO UPDATE SET
         clue_ar=@clue_ar, clue_fr=@clue_fr, clue_en=@clue_en,
         desc_ar=@desc_ar, desc_fr=@desc_fr, desc_en=@desc_en,
         cover_image=@cover, explain_image=@explain, updated_at=@ts`,
    )
    .run({
      id: stationId,
      clue_ar: clip(input.clue.ar),
      clue_fr: clip(input.clue.fr),
      clue_en: clip(input.clue.en),
      desc_ar: clip(input.description.ar, DESC_MAX),
      desc_fr: clip(input.description.fr, DESC_MAX),
      desc_en: clip(input.description.en, DESC_MAX),
      cover: clip(input.coverImage),
      explain: clip(input.explainImage),
      ts: new Date().toISOString(),
    });
  return true;
}

export function resetOverride(stationId: string): void {
  getDb().prepare("DELETE FROM station_overrides WHERE station_id = ?").run(stationId);
}

/** Filenames still referenced by an override, to avoid deleting live images. */
export function imageIsReferenced(filename: string): boolean {
  const row = getDb()
    .prepare(
      "SELECT 1 FROM station_overrides WHERE cover_image = ? OR explain_image = ? LIMIT 1",
    )
    .get(filename, filename);
  return !!row;
}

