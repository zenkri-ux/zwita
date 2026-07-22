"use client";

import type { ScanOutcome } from "@/lib/game/types";
import { useDict } from "@/lib/i18n/useDict";
import { CheckCircleIcon, QuestionIcon, RetryIcon, ScanIcon } from "./icons";

type NonCorrect = Exclude<ScanOutcome, "correct">;

/**
 * Playful, never-alarming feedback for a scan that did not advance the player.
 * Each outcome gets its own tint, icon and wording — correctness is never
 * signalled by colour alone.
 */
export function ScanFeedback({
  outcome,
  onRetry,
}: {
  outcome: NonCorrect;
  onRetry?: () => void;
}) {
  const dict = useDict();

  const style: Record<NonCorrect, { wrap: string; fg: string; Icon: typeof ScanIcon }> = {
    "wrong-station": {
      wrap: "bg-zwita-amber/10",
      fg: "text-zwita-amber-dark",
      Icon: RetryIcon,
    },
    "already-completed": {
      wrap: "bg-zwita-olive/10",
      fg: "text-zwita-olive-deep",
      Icon: CheckCircleIcon,
    },
    "unknown-station": {
      wrap: "bg-zwita-clay/10",
      fg: "text-zwita-clay-dark",
      Icon: QuestionIcon,
    },
    malformed: {
      wrap: "bg-zwita-ink/5",
      fg: "text-zwita-ink/70",
      Icon: ScanIcon,
    },
  };

  const copy: Record<NonCorrect, { title: string; body: string }> = {
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

  const { wrap, fg, Icon } = style[outcome];
  const { title, body } = copy[outcome];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-toast-in rounded-card p-4 shadow-card ${wrap}`}
    >
      <p className={`flex items-center gap-2.5 text-[15.5px] font-extrabold ${fg}`}>
        <Icon size={22} />
        {title}
      </p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/60">{body}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="touch-target mt-3 w-full rounded-input bg-white/70 py-3 text-[13.5px] font-bold text-zwita-ink"
        >
          {dict.feedback.tryAgain}
        </button>
      ) : null}
    </div>
  );
}
