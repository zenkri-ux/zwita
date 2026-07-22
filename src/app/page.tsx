"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ar } from "@/lib/i18n/dictionaries/ar";

export default function WelcomePage() {
  const router = useRouter();
  const { hydrated, phase } = useHydratedGame();
  const initSession = useGameStore((s) => s.initSession);

  // Resume an in-progress game on refresh.
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "setup") router.replace("/setup");
    else if (phase === "mission") router.replace("/mission");
    else if (phase === "complete") router.replace("/complete");
  }, [hydrated, phase, router]);

  function handleStart() {
    initSession();
    router.push("/setup");
  }

  return (
    <>
      <OfflineBanner />
      <Screen
        footer={
          <PrimaryButton
            onClick={handleStart}
            disabled={!hydrated}
            data-testid="start"
          >
            {ar.welcome.start}
          </PrimaryButton>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-black text-zwita-blue-dark">
            {ar.appName}
          </h1>
          <p className="mt-4 max-w-xs text-xl leading-relaxed text-zwita-ink/80">
            {ar.welcome.tagline}
          </p>
        </div>
      </Screen>
    </>
  );
}
