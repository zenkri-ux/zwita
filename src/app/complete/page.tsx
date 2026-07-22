"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Playful, non-historical completion title keyed by score band.
function finalTitle(score: number, dict: Dictionary): string {
  if (score >= 260) return dict.titles.expert;
  if (score >= 180) return dict.titles.skilled;
  return dict.titles.curious;
}

export default function CompletePage() {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, state, phase } = useHydratedGame();
  const reset = useGameStore((s) => s.reset);

  useEffect(() => {
    if (!hydrated) return;
    if (phase === "welcome") router.replace("/");
    else if (phase === "setup") router.replace("/setup");
    else if (phase === "mission") router.replace("/mission");
  }, [hydrated, phase, router]);

  if (!hydrated || !state) {
    return <Screen>{null}</Screen>;
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          onClick={() => {
            reset();
            router.replace("/");
          }}
          data-testid="restart"
        >
          {dict.complete.restart}
        </PrimaryButton>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-6xl" aria-hidden>
          {state.avatar || "🫒"}
        </p>
        <h1 className="mt-4 text-3xl font-black text-zwita-blue-dark" data-testid="complete-title">
          {dict.complete.title}
        </h1>
        <p className="mt-2 text-lg text-zwita-ink/80">{dict.complete.subtitle}</p>

        <dl className="mt-8 w-full max-w-xs space-y-3 text-lg">
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-5 py-3 ring-1 ring-black/5">
            <dt className="font-semibold">{dict.complete.finalTitle}</dt>
            <dd className="font-bold text-zwita-olive">
              {finalTitle(state.score, dict)}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-5 py-3 ring-1 ring-black/5">
            <dt className="font-semibold">{dict.complete.scoreLabel}</dt>
            <dd className="font-bold">{state.score}</dd>
          </div>
        </dl>
      </div>
    </Screen>
  );
}
