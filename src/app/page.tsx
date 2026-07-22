"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { OfflineBanner } from "@/components/OfflineBanner";

export default function WelcomePage() {
  const router = useRouter();
  const dict = useDict();
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
            {dict.welcome.start}
          </PrimaryButton>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative mb-8 aspect-square w-44 overflow-hidden rounded-full ring-4 ring-zwita-blue/20">
            <Image
              src="/images/mill/exterior/main-blue-door.jpg"
              alt=""
              fill
              sizes="176px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl font-black text-zwita-blue-dark">
            {dict.welcome.toZwita}
          </h1>
          <p className="mt-3 max-w-xs text-xl font-semibold leading-relaxed text-zwita-ink">
            {dict.welcome.toMill}
          </p>
          <p className="mt-3 max-w-xs leading-relaxed text-zwita-ink/70">
            {dict.welcome.tagline}
          </p>
        </div>
      </Screen>
    </>
  );
}
