import type { ScanOutcome } from "@/lib/game/types";
import { ar } from "@/lib/i18n/dictionaries/ar";

// Correctness is conveyed by an icon + text + heading, never colour alone.
const MAP: Record<
  Exclude<ScanOutcome, "correct">,
  { icon: string; title: string; body: string }
> = {
  "wrong-station": {
    icon: "↻",
    title: ar.feedback.wrongTitle,
    body: ar.feedback.wrongBody,
  },
  "already-completed": {
    icon: "✓",
    title: ar.feedback.alreadyTitle,
    body: ar.feedback.alreadyBody,
  },
  "unknown-station": {
    icon: "?",
    title: ar.feedback.unknownTitle,
    body: ar.feedback.unknownBody,
  },
  malformed: {
    icon: "!",
    title: ar.feedback.malformedTitle,
    body: ar.feedback.malformedBody,
  },
};

/** Playful, non-frightening feedback for a non-correct scan. */
export function ScanFeedback({
  outcome,
}: {
  outcome: Exclude<ScanOutcome, "correct">;
}) {
  const info = MAP[outcome];
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-zwita-amber/15 p-5 ring-1 ring-zwita-amber/40"
    >
      <p className="flex items-center gap-3 text-lg font-bold text-zwita-ink">
        <span aria-hidden className="text-2xl">
          {info.icon}
        </span>
        {info.title}
      </p>
      <p className="mt-1 text-zwita-ink/80">{info.body}</p>
    </div>
  );
}
