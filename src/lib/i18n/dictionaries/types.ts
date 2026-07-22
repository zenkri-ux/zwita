import type { ar } from "./ar";

// Widen the Arabic reference dictionary's literal types to plain `string` (and
// readonly tuples to arrays) so other locales supply their own text while being
// structurally checked against the same shape.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof ar>;
