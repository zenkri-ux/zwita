"use client";

import { useEffect, useState } from "react";

/**
 * Whether the visitor asked for reduced motion. Used to skip decorative
 * autoplaying video entirely rather than merely shortening it — a looping
 * background is exactly the kind of motion the preference is about.
 *
 * Defaults to `true` (motion off) until the media query has been read, so the
 * first paint never starts motion we might have to take back.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
