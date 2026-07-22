"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ClueCard } from "@/components/ClueCard";
import { ProgressPath } from "@/components/ProgressPath";
import { ScannerView, type SimulationPayload } from "@/components/ScannerView";
import { DiscoveryCard } from "@/components/DiscoveryCard";
import { ScanFeedback } from "@/components/ScanFeedback";
import { OfflineBanner } from "@/components/OfflineBanner";
import { BackIcon, CheckCircleIcon, ProgressIcon, ScanIcon } from "@/components/icons";
import { getStation, scannableStations } from "@/content/stations";
import { buildScanUrl } from "@/lib/qr/payload";
import type { Station } from "@/content/types";
import type { ScanOutcome } from "@/lib/game/types";
import { t } from "@/lib/i18n/locale";

type Mode = "clue" | "scanning" | "discovery" | "progress";

export default function MissionPage() {
  const router = useRouter();
  const dict = useDict();
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

  // Dev/e2e simulation buttons emit exactly what a printed QR contains.
  const simulationPayloads = useMemo<SimulationPayload[]>(() => {
    if (!currentStation?.scanCode) return [];
    const wrong = scannableStations.find((s) => s.id !== currentStation.id);
    const payloads: SimulationPayload[] = [
      {
        label: `✓ ${t(currentStation.shortTitle, "ar")}`,
        raw: buildScanUrl(currentStation.scanCode),
        testid: "sim-correct",
      },
    ];
    if (wrong?.scanCode) {
      payloads.push({
        label: `↻ ${t(wrong.shortTitle, "ar")}`,
        raw: buildScanUrl(wrong.scanCode),
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
  const step = Math.min(state.currentIndex + 1, total);
  const stepLabel = `${dict.mission.stepLabel} ${step} ${dict.mission.of} ${total}`;

  const progress = (
    <ProgressPath
      total={total}
      currentIndex={state.currentIndex}
      label={stepLabel}
      caption={dict.progressOverview.title}
    />
  );

  // --- Progress overview -------------------------------------------------
  if (mode === "progress") {
    return (
      <>
        <OfflineBanner />
        <Screen>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("clue")}
              aria-label={dict.mission.close}
              data-testid="progress-close"
              className="flex h-10 w-10 items-center justify-center rounded-input bg-zwita-olive/10"
            >
              <BackIcon size={16} className="text-zwita-olive-dark rtl:rotate-180" />
            </button>
            <h1 className="text-[19px] font-black text-zwita-olive-dark">
              {dict.progressOverview.title}
            </h1>
          </div>

          <ul className="mt-4 space-y-2.5">
            {state.stationIds.map((id, index) => {
              const station = getStation(id);
              const done = state.completedStationIds.includes(id);
              const active = index === state.currentIndex;
              const thumb = station?.images[0];
              const stateLabel = done
                ? dict.progressOverview.done
                : active
                  ? dict.progressOverview.current
                  : dict.progressOverview.upcoming;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-card bg-white p-2.5 shadow-card"
                >
                  <div className="relative h-[52px] w-[52px] flex-none overflow-hidden rounded-input bg-zwita-ink/5">
                    {thumb ? (
                      <Image
                        src={thumb.src}
                        alt=""
                        fill
                        sizes="52px"
                        className={done || active ? "object-cover" : "object-cover opacity-40"}
                      />
                    ) : null}
                    <span
                      className={[
                        "absolute bottom-0.5 end-0.5 flex h-5 w-5 items-center justify-center rounded-[7px]",
                        done
                          ? "bg-zwita-olive"
                          : active
                            ? "bg-zwita-amber"
                            : "bg-zwita-ink/30",
                      ].join(" ")}
                    >
                      {done ? <CheckCircleIcon size={12} className="text-white" /> : null}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-extrabold text-zwita-ink">
                      {/* Undiscovered stations stay secret — that is the game. */}
                      {done || active ? t(station?.title ?? { ar: "…" }, locale) : "؟؟؟"}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-zwita-ink/50">{stateLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Screen>
      </>
    );
  }

  // --- Discovery (also used for the final station before /complete) -------
  if (mode === "discovery" && discovered) {
    return (
      <>
        <OfflineBanner />
        <Screen header={progress}>
          <div className="mt-4">
            <DiscoveryCard
              station={discovered}
              locale={locale}
              onContinue={handleContinue}
              continueLabel={
                phase === "complete" ? dict.complete.title : dict.discovery.continue
              }
              successLabel={dict.feedback.correctTitle}
            />
          </div>
        </Screen>
      </>
    );
  }

  // --- Scanner -----------------------------------------------------------
  if (mode === "scanning") {
    return (
      <>
        <OfflineBanner />
        <Screen header={progress}>
          <div className="mt-4 space-y-4">
            {feedback ? (
              <ScanFeedback outcome={feedback} onRetry={() => setFeedback(null)} />
            ) : null}
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

  // --- Clue (default) ----------------------------------------------------
  return (
    <>
      <OfflineBanner />
      <Screen
        header={
          <div className="flex items-center gap-3">
            {progress}
            <button
              type="button"
              onClick={() => setMode("progress")}
              aria-label={dict.progressOverview.title}
              data-testid="open-progress"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-input bg-zwita-olive/10"
            >
              <ProgressIcon size={18} className="text-zwita-ink/40" />
            </button>
          </div>
        }
        footer={
          <>
            <PrimaryButton onClick={() => setMode("scanning")} data-testid="open-scanner">
              <ScanIcon size={20} />
              {dict.mission.openScanner}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="touch-target mt-1 w-full text-xs text-zwita-ink/40 underline"
            >
              {dict.reset.action}
            </button>
          </>
        }
      >
        {currentStation ? (
          <ClueCard
            clue={t(currentStation.clues[0] ?? currentStation.title, locale)}
            eyebrow={`${dict.mission.stepLabel} ${step}`}
          />
        ) : (
          <ClueCard clue={dict.mission.scan} />
        )}
      </Screen>

      {showReset ? (
        <ResetSheet
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

/** Bottom sheet, per the design's reset-confirmation pattern. */
function ResetSheet({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dict = useDict();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      className="fixed inset-0 z-50 flex items-end bg-black/40"
    >
      <div className="pad-x pad-bottom w-full rounded-t-sheet bg-zwita-white pt-5 shadow-sheet">
        <div aria-hidden className="mx-auto mb-4 h-[5px] w-10 rounded-full bg-zwita-ink/15" />
        <h2 id="reset-title" className="text-lg font-black text-zwita-ink">
          {dict.reset.confirmTitle}
        </h2>
        <p className="mt-2 text-[13.5px] leading-[1.7] text-zwita-ink/70">
          {dict.reset.confirmBody}
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[50px] flex-1 rounded-input border-[1.5px] border-zwita-ink/15 text-sm font-bold text-zwita-ink"
          >
            {dict.reset.cancel}
          </button>
          <PrimaryButton
            variant="danger"
            onClick={onConfirm}
            data-testid="reset-confirm"
            className="flex-1 text-sm"
          >
            {dict.reset.confirm}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
