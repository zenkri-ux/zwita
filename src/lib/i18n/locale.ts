import type { Locale, LocalizedText } from "@/content/types";

export type { Locale };

export const DEFAULT_LOCALE: Locale = "ar";
export const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

/**
 * Resolve a localized string, falling back to Arabic (the mandatory field) when
 * the requested locale is absent.
 */
export function t(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.ar;
}
