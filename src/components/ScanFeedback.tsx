"use client";

import type { ScanOutcome } from "@/lib/game/types";
import { useDict } from "@/lib/i18n/useDict";

// Correctness is conveyed by an icon + text + heading, never colour alone.
const ICON: Record<Exclude<ScanOutcome, "correct">, string> = {
  "wrong-station": "↻",
  "already-completed": "✓",
  "unknown-station": "?",
  malformed: "!",
};

/** Playful, non-frightening feedback for a non-correct scan. */
export function ScanFeedback({
  outcome,
}: {
  outcome: Exclude<ScanOutcome, "correct">;
}) {
  const dict = useDict();
  const copy: Record<
    Exclude<ScanOutcome, "correct">,
    { title: string; body: string }
  > = {
    "wrong-station": {
      title: dict.feedback.wrongTitle,
      body: dict.feedback.wrongBody,
    },
    "already-completed": {
      title: dict.feedback.alreadyTitle,
      body: dict.feedback.alreadyBody,
    },
    "unknown-station": {
      title: dict.feedback.unknownTitle,
      body: dict.feedback.unknownBody,
    },
    malformed: {
      title: dict.feedback.malformedTitle,
      body: dict.feedback.malformedBody,
    },
  };
  const info = copy[outcome];
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-zwita-amber/15 p-5 ring-1 ring-zwita-amber/40"
    >
      <p className="flex items-center gap-3 text-lg font-bold text-zwita-ink">
        <span aria-hidden className="text-2xl">
          {ICON[outcome]}
        </span>
        {info.title}
      </p>
      <p className="mt-1 text-zwita-ink/80">{info.body}</p>
    </div>
  );
}
