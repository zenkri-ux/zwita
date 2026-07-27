import { NextResponse } from "next/server";
import { MAX_EVENTS_PER_REQUEST } from "@/lib/analytics/events";
import { recordEvents, sanitizeEvent } from "@/lib/server/store";

// Ingestion endpoint for game analytics. Untrusted input: the batch is capped,
// every event is validated, and anything unusable is dropped silently.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const raw = (body as { events?: unknown })?.events;
  if (!Array.isArray(raw)) {
    return NextResponse.json({ error: "events must be an array" }, { status: 400 });
  }

  const clean = raw
    .slice(0, MAX_EVENTS_PER_REQUEST)
    .map(sanitizeEvent)
    .filter((e): e is NonNullable<typeof e> => e !== null);

  try {
    const stored = clean.length > 0 ? recordEvents(clean) : 0;
    return NextResponse.json({ ok: true, stored });
  } catch (error) {
    // A storage failure is retried by the client, so keep the log quiet-ish.
    console.error("event ingestion failed", error);
    return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  }
}
