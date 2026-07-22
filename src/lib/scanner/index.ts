import type { ScannerAdapter } from "./types";
import { ZxingScannerAdapter } from "./zxing-adapter";
import { SimulatedScannerAdapter } from "./simulated-adapter";

export type { ScannerAdapter, ScannerError } from "./types";
export { SimulatedScannerAdapter } from "./simulated-adapter";
export { ZxingScannerAdapter } from "./zxing-adapter";

/** Whether the app is forced into simulated scanning (dev/e2e). */
export function isSimulatedMode(): boolean {
  return process.env.NEXT_PUBLIC_SCANNER === "simulated";
}

/**
 * Pick the appropriate scanner adapter:
 *   - forced simulation via env (development / e2e);
 *   - otherwise ZXing when the environment supports the camera;
 *   - otherwise fall back to the simulated adapter so a manual/dev path exists.
 */
export function createScanner(): ScannerAdapter {
  if (isSimulatedMode()) return new SimulatedScannerAdapter();
  const zxing = new ZxingScannerAdapter();
  return zxing.isSupported() ? zxing : new SimulatedScannerAdapter();
}
