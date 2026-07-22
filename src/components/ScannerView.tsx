"use client";

import { useEffect, useRef, useState } from "react";
import { createScanner, isSimulatedMode } from "@/lib/scanner";
import type { ScannerAdapter, ScannerError } from "@/lib/scanner";
import { SimulatedScannerAdapter } from "@/lib/scanner/simulated-adapter";
import { PrimaryButton } from "./PrimaryButton";
import { ManualCodeEntry } from "./ManualCodeEntry";
import { ar } from "@/lib/i18n/dictionaries/ar";

const ERROR_MESSAGE: Record<ScannerError, string> = {
  "permission-denied": ar.scanner.permissionDenied,
  "no-camera": ar.scanner.noCamera,
  "insecure-context": ar.scanner.insecure,
  unsupported: ar.scanner.unsupported,
  unknown: ar.scanner.cameraError,
};

export type SimulationPayload = { label: string; raw: string; testid?: string };

/**
 * Camera scanner surface with guaranteed fallbacks: on any camera error the
 * manual-entry form is shown. In simulated mode (dev/e2e) the camera is skipped
 * and payload buttons drive scans deterministically.
 */
export function ScannerView({
  onResult,
  onClose,
  simulationPayloads = [],
}: {
  onResult: (raw: string) => void;
  onClose: () => void;
  simulationPayloads?: SimulationPayload[];
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const adapterRef = useRef<ScannerAdapter | null>(null);
  const [error, setError] = useState<ScannerError | null>(null);
  const simulated = isSimulatedMode();

  useEffect(() => {
    const adapter = createScanner();
    adapterRef.current = adapter;
    let cancelled = false;
    void adapter.start(
      videoRef.current,
      (raw) => {
        if (!cancelled) onResult(raw);
      },
      (err) => {
        if (!cancelled) setError(err);
      },
    );
    return () => {
      cancelled = true;
      adapter.stop();
    };
  }, [onResult]);

  function emitSim(raw: string) {
    const adapter = adapterRef.current;
    if (adapter instanceof SimulatedScannerAdapter) adapter.emit(raw);
    else onResult(raw);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/90">
        {!simulated && !error ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            // Required for inline camera on iOS Safari.
            playsInline
            muted
            autoPlay
            aria-label={ar.mission.scan}
          />
        ) : null}
        {simulated ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-white/80">
            {ar.scanner.simulateHint}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl bg-zwita-clay/15 p-4 text-zwita-ink ring-1 ring-zwita-clay/40"
        >
          {ERROR_MESSAGE[error]}
        </p>
      ) : null}

      {simulated && simulationPayloads.length > 0 ? (
        <div className="grid gap-2">
          {simulationPayloads.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => emitSim(p.raw)}
              data-testid={p.testid}
              className="touch-target rounded-xl border border-dashed border-zwita-blue/50 px-4 py-3 text-zwita-blue-dark"
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Manual entry is always offered. */}
      <ManualCodeEntry onSubmit={onResult} />

      <PrimaryButton variant="secondary" onClick={onClose}>
        {ar.scanner.close}
      </PrimaryButton>
    </div>
  );
}
