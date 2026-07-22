"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useReducedMotion } from "@/components/useReducedMotion";
import { useDict } from "@/lib/i18n/useDict";
import { PrimaryButton } from "@/components/PrimaryButton";
import { OfflineBanner } from "@/components/OfflineBanner";

// Optional welcome background film. The still below always renders, so if the
// file is absent (or the network is too weak, or motion is reduced) the screen
// simply stays on the photograph — never a black or broken hero.
const WELCOME_VIDEO = "/videos/welcome-bg.mp4";
const WELCOME_POSTER = "/images/mill/exterior/exterior-wide.jpg";

export default function WelcomePage() {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, phase } = useHydratedGame();
  const reducedMotion = useReducedMotion();
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
      {/* Full-bleed hero: the mill's blue door under warm light, fading into
          the limewash background so the single action sits on solid ground. */}
      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zwita-white">
        {/* Still frame: always present, and the only layer when motion is
            reduced or the film has not loaded. */}
        <Image
          src={WELCOME_POSTER}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {!reducedMotion ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={WELCOME_VIDEO}
            poster={WELCOME_POSTER}
            autoPlay
            muted
            loop
            // Required for inline autoplay on iOS Safari.
            playsInline
            // The mill's network is poor; do not block the hero on the film.
            preload="metadata"
            aria-hidden
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,34,29,0.15)_0%,rgba(37,34,29,0.35)_55%,var(--zwita-white)_92%)]"
        />

        <div className="safe-top safe-x relative flex flex-1 flex-col items-center justify-end px-5 pb-4 text-center">
          <h1 className="text-[34px] font-black text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
            {dict.welcome.toZwita}
          </h1>
          <p className="mt-2.5 max-w-[270px] text-lg font-bold leading-relaxed text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
            {dict.welcome.toMill}
          </p>
          <p className="mb-7 mt-2.5 max-w-[250px] text-sm leading-[1.7] text-white/80">
            {dict.welcome.tagline}
          </p>
        </div>

        <div className="safe-bottom safe-x relative px-5 pb-6">
          <PrimaryButton
            onClick={handleStart}
            disabled={!hydrated}
            data-testid="start"
          >
            {dict.welcome.start}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
