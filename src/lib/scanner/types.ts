// QR scanner abstraction.
//
// Hardware access is hidden behind ScannerAdapter so the camera can be mocked
// in tests and simulated in development. Adapters emit RAW strings only; parsing
// and validation happen downstream (untrusted input).

export type ScannerError =
  | "permission-denied"
  | "no-camera"
  | "insecure-context"
  | "unsupported"
  | "unknown";

export interface ScannerAdapter {
  /** Whether this adapter can run in the current environment. */
  isSupported(): boolean;
  /**
   * Begin scanning. Calls `onResult` with each decoded raw string and
   * `onError` with a categorised failure. Implementations must be idempotent
   * with `stop()`.
   */
  start(
    video: HTMLVideoElement | null,
    onResult: (raw: string) => void,
    onError: (error: ScannerError) => void,
  ): Promise<void>;
  /** Stop scanning and release the camera. Safe to call multiple times. */
  stop(): void;
}
