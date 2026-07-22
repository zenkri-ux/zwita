import { describe, it, expect } from "vitest";
import { validateScan } from "@/lib/game/validate";
import { buildQrPayload } from "@/lib/qr/payload";
import type { Station } from "@/content/types";

function station(id: string, token: string): Station {
  return {
    id,
    slug: id,
    qrToken: token,
    title: { ar: id },
    shortTitle: { ar: id },
    clues: [{ ar: "clue" }],
    description: { ar: "desc" },
    images: [],
    estimatedDiscoveryMinutes: 1,
  };
}

const allowlist = {
  "olive-storage": station("olive-storage", "tok-a"),
  "crusher-mdar": station("crusher-mdar", "tok-b"),
  "settling-jars": station("settling-jars", "tok-c"),
} as const;

const state = {
  stationIds: ["olive-storage", "crusher-mdar", "settling-jars"],
  currentIndex: 1, // expecting crusher-mdar
  completedStationIds: ["olive-storage"],
};

describe("validateScan", () => {
  it("accepts the correct current station", () => {
    const raw = buildQrPayload("crusher-mdar", "tok-b");
    expect(validateScan(raw, state, allowlist).outcome).toBe("correct");
  });

  it("flags a valid-but-wrong station", () => {
    const raw = buildQrPayload("settling-jars", "tok-c");
    expect(validateScan(raw, state, allowlist).outcome).toBe("wrong-station");
  });

  it("flags an already-completed station", () => {
    const raw = buildQrPayload("olive-storage", "tok-a");
    expect(validateScan(raw, state, allowlist).outcome).toBe("already-completed");
  });

  it("rejects an unknown station id", () => {
    const raw = buildQrPayload("ghost-room", "tok-x");
    expect(validateScan(raw, state, allowlist).outcome).toBe("unknown-station");
  });

  it("rejects a known id with the wrong token", () => {
    const raw = buildQrPayload("crusher-mdar", "wrong-token");
    expect(validateScan(raw, state, allowlist).outcome).toBe("unknown-station");
  });

  it("rejects malformed payloads", () => {
    expect(validateScan("not-a-code", state, allowlist).outcome).toBe("malformed");
    expect(validateScan("https://evil.example", state, allowlist).outcome).toBe(
      "malformed",
    );
  });
});
