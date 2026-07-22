import { describe, it, expect } from "vitest";
import { parseQrPayload, buildQrPayload } from "@/lib/qr/payload";

describe("parseQrPayload", () => {
  it("parses a valid ZWITA:1 payload", () => {
    const result = parseQrPayload("ZWITA:1:crusher-mdar:dev-mdar-9X3");
    expect(result).toEqual({
      ok: true,
      stationId: "crusher-mdar",
      token: "dev-mdar-9X3",
    });
  });

  it("trims surrounding whitespace", () => {
    const result = parseQrPayload("  ZWITA:1:dome:dev-dome-5J6  ");
    expect(result.ok).toBe(true);
  });

  it("rejects a wrong prefix", () => {
    expect(parseQrPayload("NOPE:1:dome:tok").ok).toBe(false);
  });

  it("rejects an unsupported version", () => {
    expect(parseQrPayload("ZWITA:2:dome:tok").ok).toBe(false);
  });

  it("rejects a URL-shaped payload (never opened as a link)", () => {
    expect(parseQrPayload("https://evil.example/zwita").ok).toBe(false);
    // Extra colons from a URL cause a segment-count mismatch.
    expect(parseQrPayload("ZWITA:1:dome:https://evil.example").ok).toBe(false);
  });

  it("rejects malformed station ids and tokens", () => {
    expect(parseQrPayload("ZWITA:1:BAD_ID:tok").ok).toBe(false);
    expect(parseQrPayload("ZWITA:1:dome:").ok).toBe(false);
    expect(parseQrPayload("ZWITA:1::tok").ok).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(parseQrPayload(null).ok).toBe(false);
    expect(parseQrPayload(undefined).ok).toBe(false);
    expect(parseQrPayload(42 as unknown).ok).toBe(false);
  });

  it("round-trips with buildQrPayload", () => {
    const raw = buildQrPayload("olive-storage", "dev-stor-1B5");
    const parsed = parseQrPayload(raw);
    expect(parsed).toMatchObject({
      ok: true,
      stationId: "olive-storage",
      token: "dev-stor-1B5",
    });
  });
});
