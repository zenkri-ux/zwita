"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ClueCard } from "@/components/ClueCard";
import { ProgressPath } from "@/components/ProgressPath";
import { ScannerView, type SimulationPayload } from "@/components/ScannerView";
import { DiscoveryCard } from "@/components/DiscoveryCard";
import { ScanFeedback } from "@/components/ScanFeedback";
import { OfflineBanner } from "@/components/OfflineBanner";
import { getStation } from "@/content/stations";
import { buildQrPayload } from "@/lib/qr/payload";
import type { Station } from "@/content/types";
import type { ScanOutcome } from "@/lib/game/types";
import { t } from "@/lib/i18n/locale";
import { ar } from "@/lib/i18n/dictionaries/ar";

type Mode = "clue" | "scanning" | "discovery";

export default function MissionPage() {
  const router = useRouter();
  const { hydrated, state, phase } = useHydratedGame();
  const submitScan = useGameStore((s) => s.submitScan);
  const reset = useGameStore((s) => s.reset);

  const [mode, setMode] = useState<Mode>("clue");
  const [feedback, setFeedback] = useState<Exclude<ScanOutcome, "correct"> | null>(null);
  const [discovered, setDiscovered] = useState<Station | null>(null);
  const [showReset, setShowReset] = useState(false);

  // Phase guards. Do not redirect to /complete while showing the final
  // discovery screen (mode === "discovery").
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "welcome") router.replace("/");
    else if (phase === "setup") router.replace("/setup");
    else if (phase === "complete" && mode !== "discovery") router.replace("/complete");
  }, [hydrated, phase, mode, router]);

  const currentStationId = state?.stationIds[state.currentIndex];
  const currentStation = currentStationId ? getStation(currentStationId) : undefined;

  const handleResult = useCallback(
    (raw: string) => {
      const result = submitScan(raw);
      if (result.outcome === "correct" && result.station) {
        setFeedback(null);
        setDiscovered(result.station);
        setMode("discovery");
      } else {
        setFeedback(result.outcome as Exclude<ScanOutcome, "correct">);
      }
    },
    [submitScan],
  );

  const handleContinue = useCallback(() => {
    setDiscovered(null);
    setFeedback(null);
    setMode("clue");
    // If that was the last station, the guard effect routes to /complete.
  }, []);

  // Dev/e2e simulation buttons for the current step.
  const simulationPayloads = useMemo<SimulationPayload[]>(() => {
    if (!currentStation) return [];
    const wrong = getStation("dome");
    const payloads: SimulationPayload[] = [
      {
        label: `✓ ${t(currentStation.shortTitle, "ar")}`,
        raw: buildQrPayload(currentStation.id, currentStation.qrToken),
        testid: "sim-correct",
      },
    ];
    if (wrong && wrong.id !== currentStation.id) {
      payloads.push({
        label: `↻ ${t(wrong.shortTitle, "ar")}`,
        raw: buildQrPayload(wrong.id, wrong.qrToken),
        testid: "sim-wrong",
      });
    }
    payloads.push({ label: "! ???", raw: "not-a-zwita-code", testid: "sim-bad" });
    return payloads;
  }, [currentStation]);

  if (!hydrated || !state) {
    return <Screen>{null}</Screen>;
  }

  const locale = state.locale;
  const total = state.stationIds.length;
  const stepLabel = `${ar.mission.stepLabel} ${Math.min(state.currentIndex + 1, total)} ${ar.mission.of} ${total}`;

  // Discovery screen (also used for the final station before /complete).
  if (mode === "discovery" && discovered) {
    return (
      <>
        <OfflineBanner />
        <Screen header={<ProgressPath total={total} currentIndex={state.currentIndex} label={stepLabel} />}>
          <DiscoveryCard
            station={discovered}
            locale={locale}
            onContinue={handleContinue}
            continueLabel={
              phase === "complete" ? ar.complete.title : ar.discovery.continue
            }
          />
        </Screen>
      </>
    );
  }

  // Scanner screen.
  if (mode === "scanning") {
    return (
      <>
        <OfflineBanner />
        <Screen header={<ProgressPath total={total} currentIndex={state.currentIndex} label={stepLabel} />}>
          <div className="space-y-4">
            {feedback ? <ScanFeedback outcome={feedback} /> : null}
            <ScannerView
              onResult={handleResult}
              onClose={() => {
                setFeedback(null);
                setMode("clue");
              }}
              simulationPayloads={simulationPayloads}
            />
          </div>
        </Screen>
      </>
    );
  }

  // Clue screen (default).
  return (
    <>
      <OfflineBanner />
      <Screen
        header={
          <div className="flex items-center justify-between gap-3">
            <ProgressPath total={total} currentIndex={state.currentIndex} label={stepLabel} />
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="touch-target shrink-0 text-sm text-zwita-ink/60 underline"
            >
              {ar.reset.action}
            </button>
          </div>
        }
        footer={
          <PrimaryButton onClick={() => setMode("scanning")} data-testid="open-scanner">
            {ar.mission.openScanner}
          </PrimaryButton>
        }
      >
        {currentStation ? (
          <ClueCard clue={t(currentStation.clues[0] ?? currentStation.title, locale)} />
        ) : (
          <ClueCard clue={ar.mission.scan} />
        )}
      </Screen>

      {showReset ? (
        <ResetDialog
          onCancel={() => setShowReset(false)}
          onConfirm={() => {
            reset();
            router.replace("/");
          }}
        />
      ) : null}
    </>
  );
}

function ResetDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-zwita-white p-6">
        <h2 id="reset-title" className="text-xl font-extrabold">
          {ar.reset.confirmTitle}
        </h2>
        <p className="mt-2 text-zwita-ink/80">{ar.reset.confirmBody}</p>
        <div className="mt-5 space-y-2">
          <PrimaryButton onClick={onConfirm} data-testid="reset-confirm">
            {ar.reset.confirm}
          </PrimaryButton>
          <PrimaryButton variant="secondary" onClick={onCancel}>
            {ar.reset.cancel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
