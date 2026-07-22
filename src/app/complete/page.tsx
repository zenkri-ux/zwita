"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DropIcon } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Playful, non-historical completion title keyed by score band.
function finalTitle(score: number, dict: Dictionary): string {
  if (score >= 700) return dict.titles.expert;
  if (score >= 450) return dict.titles.skilled;
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
    return <div className="min-h-[100dvh] bg-zwita-white" />;
  }

  const discovered = state.completedStationIds.length;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zwita-ink text-center">
      <Image
        src="/images/mill/details/clay-jars.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,34,29,0.35)_0%,rgba(37,34,29,0.25)_35%,rgba(37,34,29,0.88)_100%)]"
      />

      <div className="safe-top safe-x safe-bottom relative flex flex-1 flex-col items-center justify-end px-6 pb-8 pt-6">
        <span className="mb-3 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-zwita-amber shadow-lift">
          <DropIcon size={38} filled className="text-zwita-white" />
        </span>

        <h1
          className="text-[26px] font-black text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]"
          data-testid="complete-title"
        >
          {dict.complete.title}
        </h1>
        <p className="mt-1 text-[14.5px] text-white/85">{dict.complete.subtitle}</p>

        <dl className="mt-4 flex w-full gap-2.5">
          <div className="flex-1 rounded-card bg-white/90 px-2.5 py-3">
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-zwita-ink/50">
              {dict.complete.scoreLabel}
            </dt>
            <dd className="mt-1 text-[19px] font-black text-zwita-olive-dark">
              {state.score}
            </dd>
          </div>
          <div className="flex-1 rounded-card bg-white/90 px-2.5 py-3">
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-zwita-ink/50">
              {dict.complete.levelLabel}
            </dt>
            <dd className="mt-1 text-[15px] font-black text-zwita-olive">
              {discovered}/{state.stationIds.length}
            </dd>
          </div>
        </dl>

        <div className="mt-2.5 w-full rounded-card bg-white/90 px-5 py-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-zwita-ink/50">
            {dict.complete.badgeLabel}
          </p>
          <p className="mt-1 text-[16.5px] font-black text-zwita-olive">
            {finalTitle(state.score, dict)}
          </p>
        </div>

        <PrimaryButton
          onClick={() => {
            reset();
            router.replace("/");
          }}
          data-testid="restart"
          className="mt-5"
        >
          {dict.complete.restart}
        </PrimaryButton>
      </div>
    </div>
  );
}
