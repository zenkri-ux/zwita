import type { Locale } from "@/content/types";
import type { Dictionary } from "./types";
import { ar } from "./ar";
import { fr } from "./fr";
import { en } from "./en";

export type { Dictionary } from "./types";

const DICTS: Record<Locale, Dictionary> = { ar, fr, en };

/** Resolve the UI dictionary for a locale (Arabic is the reference/default). */
export function getDict(locale: Locale): Dictionary {
  return DICTS[locale] ?? ar;
}
