import { describe, it, expect } from "vitest";
import { validateScan } from "@/lib/game/validate";
import { buildScanUrl } from "@/lib/qr/payload";
import { stationsByScanCode, scannableStations } from "@/content/stations";
import { STATIONS_PER_ROUTE } from "@/content/routes";
import type { Station } from "@/content/types";

function station(id: string, scanCode: string): Station {
  return {
    id,
    slug: id,
    scanCode,
    title: { ar: id },
    shortTitle: { ar: id },
    clues: [{ ar: "clue" }],
    description: { ar: "desc" },
    images: [],
    estimatedDiscoveryMinutes: 1,
  };
}

const allowlist = {
  AAAA11: station("olive-storage", "AAAA11"),
  BBBB22: station("crusher-mdar", "BBBB22"),
  CCCC33: station("settling-jars", "CCCC33"),
};

const state = {
  stationIds: ["olive-storage", "crusher-mdar", "settling-jars"],
  currentIndex: 1, // expecting crusher-mdar
  completedStationIds: ["olive-storage"],
};

describe("validateScan", () => {
  it("accepts the required plaque (scanned as a URL)", () => {
    const raw = buildScanUrl("BBBB22", "http://51.103.179.122");
    expect(validateScan(raw, state, allowlist).outcome).toBe("correct");
  });

  it("accepts the required plaque typed as a bare code", () => {
    expect(validateScan("bbbb22", state, allowlist).outcome).toBe("correct");
  });

  it("rejects a different (valid) plaque as wrong-station", () => {
    const raw = buildScanUrl("CCCC33", "http://51.103.179.122");
    expect(validateScan(raw, state, allowlist).outcome).toBe("wrong-station");
  });

  it("flags an already-completed plaque", () => {
    expect(validateScan("AAAA11", state, allowlist).outcome).toBe("already-completed");
  });

  it("rejects a code that is not on the allowlist", () => {
    expect(validateScan("ZZZZ99", state, allowlist).outcome).toBe("unknown-station");
  });

  it("rejects malformed input and foreign URLs", () => {
    expect(validateScan("not-a-code", state, allowlist).outcome).toBe("malformed");
    expect(validateScan("https://evil.example/phish", state, allowlist).outcome).toBe(
      "malformed",
    );
  });
});

describe("station scan codes (printed plaques)", () => {
  it("has exactly one scannable station per route slot", () => {
    expect(scannableStations.length).toBe(STATIONS_PER_ROUTE);
  });

  it("codes are unique", () => {
    const codes = scannableStations.map((s) => s.scanCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("codes avoid ambiguous characters so they can be typed by hand", () => {
    for (const s of scannableStations) {
      expect(s.scanCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    }
  });

  it("every code resolves back to its station", () => {
    for (const s of scannableStations) {
      expect(stationsByScanCode[s.scanCode as string]?.id).toBe(s.id);
    }
  });

  it("the history board has no scannable code (it carries the entry QR)", () => {
    expect(scannableStations.some((s) => s.id === "history")).toBe(false);
  });
});
