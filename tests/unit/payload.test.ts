import { describe, it, expect } from "vitest";
import { parseScanInput, buildScanUrl } from "@/lib/qr/payload";

describe("parseScanInput", () => {
  it("extracts the code from a printed QR URL", () => {
    expect(parseScanInput("http://51.103.179.122/q/P6H2ZC")).toEqual({
      ok: true,
      code: "P6H2ZC",
    });
  });

  it("works over https and with a trailing slash or query", () => {
    expect(parseScanInput("https://zwita.example/q/M3K7Q2/")).toMatchObject({
      ok: true,
      code: "M3K7Q2",
    });
    expect(parseScanInput("https://zwita.example/q/M3K7Q2?utm=poster")).toMatchObject({
      ok: true,
      code: "M3K7Q2",
    });
  });

  it("accepts a bare code typed by hand, case-insensitively", () => {
    expect(parseScanInput("p6h2zc")).toEqual({ ok: true, code: "P6H2ZC" });
    expect(parseScanInput("  R9T4XB  ")).toEqual({ ok: true, code: "R9T4XB" });
  });

  it("rejects URLs that are not scan links", () => {
    expect(parseScanInput("https://evil.example/phish").ok).toBe(false);
    expect(parseScanInput("https://evil.example/").ok).toBe(false);
    // A /q/ path with no code is still malformed.
    expect(parseScanInput("https://zwita.example/q/").ok).toBe(false);
  });

  it("rejects malformed values", () => {
    expect(parseScanInput("not-a-zwita-code").ok).toBe(false);
    expect(parseScanInput("").ok).toBe(false);
    expect(parseScanInput("AB").ok).toBe(false); // too short
    expect(parseScanInput("TOOLONGCODE1234").ok).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(parseScanInput(null).ok).toBe(false);
    expect(parseScanInput(undefined).ok).toBe(false);
    expect(parseScanInput(42).ok).toBe(false);
  });

  it("round-trips with buildScanUrl", () => {
    const url = buildScanUrl("H5N8VQ", "http://51.103.179.122");
    expect(url).toBe("http://51.103.179.122/q/H5N8VQ");
    expect(parseScanInput(url)).toEqual({ ok: true, code: "H5N8VQ" });
  });

  it("does not duplicate slashes when the base URL has one", () => {
    expect(buildScanUrl("H5N8VQ", "http://host/")).toBe("http://host/q/H5N8VQ");
  });
});
