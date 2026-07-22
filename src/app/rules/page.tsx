"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";

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
      <h1 className="text-3xl font-extrabold text-zwita-blue-dark">
        {dict.rules.title}
      </h1>
      <p className="mt-2 text-zwita-ink/80">{dict.rules.intro}</p>

      <ol className="mt-6 flex-1 space-y-4">
        {dict.rules.steps.map((step) => (
          <li
            key={step.title}
            className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
          >
            <h2 className="text-lg font-bold text-zwita-ink">{step.title}</h2>
            <p className="mt-1 leading-relaxed text-zwita-ink/80">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-2xl bg-zwita-clay/10 p-4 text-sm text-zwita-ink/80 ring-1 ring-zwita-clay/30">
        {dict.rules.safety}
      </p>
    </Screen>
  );
}
