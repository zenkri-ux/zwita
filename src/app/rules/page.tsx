"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CheckCircleIcon, DropIcon, ScanIcon } from "@/components/icons";

// One icon per step, in the order the dictionary lists them.
const STEP_ICONS = [DropIcon, ScanIcon, CheckCircleIcon];

export default function RulesPage() {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, state, phase } = useHydratedGame();
  const startRoute = useGameStore((s) => s.startRoute);

  // Guard: reachable only after a profile is set and before the route starts.
  useEffect(() => {
    if (!hydrated) return;
    if (!state || !state.nickname) router.replace("/setup");
    else if (phase === "mission") router.replace("/mission");
    else if (phase === "complete") router.replace("/complete");
  }, [hydrated, state, phase, router]);

  function handleStart() {
    startRoute();
    router.push("/mission");
  }

  return (
    <Screen
      footer={
        <PrimaryButton onClick={handleStart} data-testid="rules-start">
          {dict.rules.start}
        </PrimaryButton>
      }
    >
      <h1 className="text-[22px] font-black text-zwita-olive-dark">
        {dict.rules.title}
      </h1>

      {/* A real corridor of the mill, to set expectations before going in. */}
      <div className="relative mt-4 h-[130px] overflow-hidden rounded-card">
        <Image
          src="/images/mill/extra/corridor-press.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent to-zwita-ink/55"
        />
      </div>

      <p className="mt-4 text-[13.5px] text-zwita-ink/70">{dict.rules.intro}</p>

      <ol className="mt-3 space-y-3">
        {dict.rules.steps.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? DropIcon;
          return (
            <li
              key={step.title}
              className="flex items-start gap-3.5 rounded-card bg-white p-4 shadow-card"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-input bg-zwita-olive/10">
                <Icon size={18} className="text-zwita-olive" />
              </span>
              <div>
                <h2 className="text-[15.5px] font-extrabold text-zwita-ink">
                  {step.title}
                </h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-zwita-ink/70">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex items-start gap-3 rounded-card bg-zwita-clay/10 px-4 py-3.5">
        <span aria-hidden className="text-lg leading-none">
          🚶
        </span>
        <p className="text-[13.5px] font-bold leading-relaxed text-zwita-clay-dark">
          {dict.rules.safety}
        </p>
      </div>
    </Screen>
  );
}
