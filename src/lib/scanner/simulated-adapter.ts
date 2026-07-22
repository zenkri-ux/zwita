import type { ScannerAdapter, ScannerError } from "./types";

/**
 * Developer/test scanner. It does not touch the camera; instead a UI (or a test)
 * pushes payloads via `emit`, or via a global hook on `window` so Playwright can
 * drive deterministic scans.
 *
 * Enabled when NEXT_PUBLIC_SCANNER=simulated or when no real camera is usable.
 */
export class SimulatedScannerAdapter implements ScannerAdapter {
  private onResult: ((raw: string) => void) | null = null;

  isSupported(): boolean {
    return true;
  }

  async start(
    _video: HTMLVideoElement | null,
    onResult: (raw: string) => void,
    _onError: (error: ScannerError) => void,
  ): Promise<void> {
    this.onResult = onResult;
    // Expose a test hook so e2e can inject a scan without real hardware.
    if (typeof window !== "undefined") {
      (window as unknown as { __zwitaSimScan?: (raw: string) => void }).__zwitaSimScan =
        (raw: string) => this.emit(raw);
    }
  }

  /** Push a raw payload as if it had just been decoded. */
  emit(raw: string): void {
    this.onResult?.(raw);
  }

  stop(): void {
    this.onResult = null;
    if (typeof window !== "undefined") {
      delete (window as unknown as { __zwitaSimScan?: (raw: string) => void }).__zwitaSimScan;
    }
  }
}
