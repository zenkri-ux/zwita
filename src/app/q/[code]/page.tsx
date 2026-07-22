"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DiscoveryCard } from "@/components/DiscoveryCard";
import { ScanFeedback } from "@/components/ScanFeedback";
import { OfflineBanner } from "@/components/OfflineBanner";
import type { Station } from "@/content/types";
import type { ScanOutcome } from "@/lib/game/types";

/**
 * Deep-link landing page for a printed QR code (`<baseUrl>/q/<CODE>`).
 *
 * This is the path most visitors take: a phone's native camera app opens the
 * scanned URL in the browser rather than going through the in-app scanner. The
 * page resolves the code against the player's saved game (same origin, so
 * IndexedDB progress is available) and reacts exactly like an in-app scan:
 * the required plaque reveals the station photo + explanation, anything else
 * gets friendly feedback.
 */
export default function ScanCodePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, state, phase } = useHydratedGame();
  const submitScan = useGameStore((s) => s.submitScan);

  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (!hydrated || processed.current) return;
    // Only meaningful during an active mission; other phases are handled below.
    if (!state || phase !== "mission") return;
    processed.current = true;
    const result = submitScan(params.code);
    setOutcome(result.outcome);
    setStation(result.station ?? null);
  }, [hydrated, state, phase, params.code, submitScan]);

  if (!hydrated) {
    return <Screen>{null}</Screen>;
  }

  // No game yet on this device: send the visitor to the welcome screen.
  if (!state || phase === "welcome" || phase === "setup") {
    return (
      <Screen
        footer={
          <PrimaryButton onClick={() => router.replace("/")} data-testid="scan-go-home">
            {dict.welcome.start}
          </PrimaryButton>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-black text-zwita-blue-dark">
            {dict.welcome.toZwita}
          </h1>
          <p className="mt-3 max-w-xs text-zwita-ink/80">{dict.welcome.toMill}</p>
        </div>
      </Screen>
    );
  }

  // Route already finished.
  if (phase === "complete" && !outcome) {
    return (
      <Screen
        footer={
          <PrimaryButton onClick={() => router.replace("/complete")}>
            {dict.complete.title}
          </PrimaryButton>
        }
      >
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-lg text-zwita-ink/80">{dict.complete.subtitle}</p>
        </div>
      </Screen>
    );
  }

  // Correct plaque -> photo + short explanation, then continue the hunt.
  if (outcome === "correct" && station) {
    return (
      <>
        <OfflineBanner />
        <Screen>
          <DiscoveryCard
            station={station}
            locale={state.locale}
            onContinue={() =>
              router.replace(phase === "complete" ? "/complete" : "/mission")
            }
            continueLabel={
              phase === "complete" ? dict.complete.title : dict.discovery.continue
            }
          />
        </Screen>
      </>
    );
  }

  // Wrong / unknown / already-done plaque -> friendly feedback.
  return (
    <>
      <OfflineBanner />
      <Screen
        footer={
          <PrimaryButton onClick={() => router.replace("/mission")} data-testid="scan-back">
            {dict.mission.next}
          </PrimaryButton>
        }
      >
        <div className="flex flex-1 flex-col justify-center">
          {outcome ? (
            <ScanFeedback outcome={outcome as Exclude<ScanOutcome, "correct">} />
          ) : null}
        </div>
      </Screen>
    </>
  );
}
