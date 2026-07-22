"use client";

import { useEffect, useRef, useState } from "react";
import { createScanner, isSimulatedMode } from "@/lib/scanner";
import type { ScannerAdapter, ScannerError } from "@/lib/scanner";
import { SimulatedScannerAdapter } from "@/lib/scanner/simulated-adapter";
import { ManualCodeEntry } from "./ManualCodeEntry";
import { useDict } from "@/lib/i18n/useDict";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { RetryIcon } from "./icons";

function errorMessage(dict: Dictionary, error: ScannerError): string {
  switch (error) {
    case "permission-denied":
      return dict.scanner.permissionDenied;
    case "no-camera":
      return dict.scanner.noCamera;
    case "insecure-context":
      return dict.scanner.insecure;
    case "unsupported":
      return dict.scanner.unsupported;
    default:
      return dict.scanner.cameraError;
  }
}

export type SimulationPayload = { label: string; raw: string; testid?: string };

/**
 * Camera surface with guaranteed fallbacks: any camera error swaps the
 * viewfinder for a dark explanatory panel, and manual entry is always present
 * underneath. In simulated mode (dev/e2e) the camera is skipped entirely.
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
  const dict = useDict();
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
      <h1 className="text-lg font-extrabold text-zwita-ink">{dict.scanner.title}</h1>

      {error ? (
        <div
          role="alert"
          className="flex aspect-square flex-col items-center justify-center gap-3 rounded-media bg-zwita-ink p-6 text-center"
        >
          <RetryIcon size={30} className="text-zwita-amber" />
          <p className="text-sm font-bold text-zwita-white">
            {errorMessage(dict, error)}
          </p>
        </div>
      ) : (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-media bg-zwita-ink">
          {!simulated ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              // Required for inline camera on iOS Safari.
              playsInline
              muted
              autoPlay
              aria-label={dict.scanner.title}
            />
          ) : null}
          {/* Amber viewfinder frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-6 rounded-media border-[2.5px] border-zwita-amber/90"
          />
          <p className="relative px-8 text-center text-[12.5px] text-white/80">
            {simulated ? dict.scanner.simulateHint : dict.scanner.hint}
          </p>
        </div>
      )}

      {/* Manual entry is always offered. */}
      <ManualCodeEntry onSubmit={onResult} />

      {simulated && simulationPayloads.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {simulationPayloads.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => emitSim(p.raw)}
              data-testid={p.testid}
              className="touch-target rounded-input border-[1.5px] border-dashed border-zwita-olive/40 bg-zwita-olive/5 px-3 py-3 text-[12.5px] font-bold text-zwita-olive-deep"
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        className="touch-target w-full text-sm font-bold text-zwita-olive-dark underline underline-offset-4"
      >
        {dict.scanner.close}
      </button>
    </div>
  );
}
