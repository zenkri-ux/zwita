// Content schema for ZWITA heritage stations.
//
// This module contains TYPES ONLY. Authored data lives in `stations.ts` and
// `routes.ts`. Presentation components must import this data — never inline it —
// so heritage content stays editable and separate from UI code.

export type Locale = "ar" | "fr" | "en";

/**
 * A translatable string. Arabic is mandatory (Arabic-first product); French and
 * English are optional and may be filled in later.
 */
export type LocalizedText = {
  ar: string;
  fr?: string;
  en?: string;
};

export type StationImageKind = "station" | "panel" | "detail" | "context";

export type StationImage = {
  /** Path under /public, e.g. "/images/mill/stations/crusher-mdar.jpg". */
  src: string;
  alt: LocalizedText;
  width: number;
  height: number;
  kind: StationImageKind;
  /** Optional small variant safe to pre-cache for offline use. */
  thumbnail?: string;
};

export type Station = {
  id: string;
  slug: string;
  /**
   * Non-obvious token printed inside the station's QR payload. Never contains
   * educational content. Development tokens are used until real codes are
   * printed.
   */
  qrToken: string;
  title: LocalizedText;
  shortTitle: LocalizedText;
  /** One or more clue phrasings; the active game uses the first by default. */
  clues: LocalizedText[];
  description: LocalizedText;
  funFact?: LocalizedText;
  images: StationImage[];
  safetyNote?: LocalizedText;
  estimatedDiscoveryMinutes: number;
};

/**
 * A manually approved ordering of stations. Route assignment picks one of these
 * deterministically — never a random permutation — so transitions stay safe and
 * stable across refreshes.
 */
export type RouteTemplate = {
  id: string;
  stationIds: string[];
};
