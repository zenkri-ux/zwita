"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { DEFAULT_LOCALE, dir } from "@/lib/i18n/locale";

/**
 * Keeps the document's language and direction in sync with the player's chosen
 * locale (Arabic defaults to RTL; French/English switch to LTR). The initial
 * server render is Arabic/RTL; this progressively updates on the client once a
 * locale is known. Renders nothing.
 */
export function LocaleSync() {
  const locale = useGameStore((s) => s.state?.locale ?? DEFAULT_LOCALE);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir(locale);
  }, [locale]);
  return null;
}
