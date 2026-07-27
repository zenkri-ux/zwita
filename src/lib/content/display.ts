import type { LocalizedText, Station } from "@/content/types";

// The runtime-resolvable view of a station's content. Only these fields can be
// edited from the admin panel; identity, scanCode and route membership always
// come from the built-in content and never change (printed QR codes depend on
// them). Used on BOTH the server (to merge overrides) and the client (to seed
// defaults for offline), so it must stay free of server/client-only imports.

export type StationDisplay = {
  id: string;
  title: LocalizedText;
  clue: LocalizedText;
  description: LocalizedText;
  funFact?: LocalizedText;
  safetyNote?: LocalizedText;
  /** URL for the clue-screen background. */
  coverImage: string;
  /** URL for the image shown on the discovery screen, if any. */
  explainImage?: string;
};

/** Raw override values as stored/edited (image fields are filenames or null). */
export type StationOverride = {
  clue?: Partial<LocalizedText>;
  description?: Partial<LocalizedText>;
  coverImage?: string | null;
  explainImage?: string | null;
};

const MEDIA_PREFIX = "/api/media/";

/** Uploaded images are stored as filenames; built-in images are /images paths. */
export function mediaUrl(fileOrPath: string): string {
  return fileOrPath.startsWith("/") ? fileOrPath : `${MEDIA_PREFIX}${fileOrPath}`;
}

/** The default display for a station, from built-in content. */
export function defaultDisplay(station: Station): StationDisplay {
  const cover =
    station.images.find((i) => i.kind === "station")?.src ??
    station.images[0]?.src ??
    "/images/mill/interior/main-hall.jpg";
  return {
    id: station.id,
    title: station.title,
    clue: station.clues[0] ?? station.title,
    description: station.description,
    funFact: station.funFact,
    safetyNote: station.safetyNote,
    coverImage: cover,
    // Text-only by default; an image only appears once the admin sets one.
    explainImage: undefined,
  };
}

function mergeText(base: LocalizedText, patch?: Partial<LocalizedText>): LocalizedText {
  if (!patch) return base;
  return {
    ar: patch.ar?.trim() || base.ar,
    fr: patch.fr?.trim() || base.fr,
    en: patch.en?.trim() || base.en,
  };
}

/** Apply an admin override on top of the built-in default. */
export function applyOverride(
  base: StationDisplay,
  ov: StationOverride | null | undefined,
): StationDisplay {
  if (!ov) return base;
  return {
    ...base,
    clue: mergeText(base.clue, ov.clue),
    description: mergeText(base.description, ov.description),
    coverImage: ov.coverImage ? mediaUrl(ov.coverImage) : base.coverImage,
    explainImage: ov.explainImage ? mediaUrl(ov.explainImage) : base.explainImage,
  };
}
