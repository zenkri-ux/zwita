import { NextResponse } from "next/server";
import { getEditorContent, resetOverride, saveOverride } from "@/lib/server/content";

// Protected by middleware. GET returns the editor's current values for every
// station; PUT saves one station's override; DELETE reverts it to the built-in
// default.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ stations: getEditorContent() });
  } catch (error) {
    console.error("editor content query failed", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const stationId = typeof body.stationId === "string" ? body.stationId : "";
  const clue = (body.clue ?? {}) as Record<string, unknown>;
  const description = (body.description ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);

  const ok = saveOverride(stationId, {
    clue: { ar: str(clue.ar), fr: str(clue.fr), en: str(clue.en) },
    description: { ar: str(description.ar), fr: str(description.fr), en: str(description.en) },
    coverImage: typeof body.coverImage === "string" ? body.coverImage : null,
    explainImage: typeof body.explainImage === "string" ? body.explainImage : null,
  });

  if (!ok) return NextResponse.json({ error: "unknown_station" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const stationId = new URL(request.url).searchParams.get("stationId");
  if (!stationId) return NextResponse.json({ error: "missing_station" }, { status: 400 });
  resetOverride(stationId);
  return NextResponse.json({ ok: true });
}
