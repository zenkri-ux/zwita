import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import type { ScannerAdapter, ScannerError } from "./types";

/**
 * Real camera scanner backed by ZXing + getUserMedia.
 *
 * iOS Safari notes: getUserMedia requires a secure context and only works in
 * Safari proper (not most in-app webviews). The <video> element must carry
 * playsinline/muted/autoplay (set by the component) or the stream will not
 * render inline. Errors are categorised so the UI can offer manual entry.
 */
export class ZxingScannerAdapter implements ScannerAdapter {
  private reader: BrowserQRCodeReader | null = null;
  private controls: IScannerControls | null = null;

  isSupported(): boolean {
    if (typeof window === "undefined") return false;
    if (!window.isSecureContext) return false;
    return (
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    );
  }

  async start(
    video: HTMLVideoElement | null,
    onResult: (raw: string) => void,
    onError: (error: ScannerError) => void,
  ): Promise<void> {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      onError("insecure-context");
      return;
    }
    if (!this.isSupported()) {
      onError("unsupported");
      return;
    }
    if (!video) {
      onError("unknown");
      return;
    }

    try {
      this.reader = new BrowserQRCodeReader(undefined, {
        // Throttle decode attempts to reduce CPU/thermal load on mobile.
        delayBetweenScanAttempts: 300,
      });
      // Prefer the rear camera; ZXing selects a device from constraints.
      this.controls = await this.reader.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        video,
        (result, err) => {
          if (result) {
            onResult(result.getText());
          }
          // Per-frame decode misses arrive as errors; ignore them here.
          void err;
        },
      );
    } catch (err) {
      onError(mapError(err));
    }
  }

  stop(): void {
    this.controls?.stop();
    this.controls = null;
    this.reader = null;
  }
}

function mapError(err: unknown): ScannerError {
  const name = (err as { name?: string } | null)?.name ?? "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "permission-denied";
    case "NotFoundError":
    case "OverconstrainedError":
      return "no-camera";
    case "NotReadableError":
    case "AbortError":
      return "unknown";
    default:
      return "unknown";
  }
}
