import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/server/content";
import { defaultDisplay } from "@/lib/content/display";
import { stations } from "@/content/stations";

// Public, merged station content for the game (built-in defaults with any admin
// overrides applied). If the database is unavailable the built-in defaults are
// still returned, so the game never loses its content.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ stations: getPublicContent() });
  } catch (error) {
    console.error("content query failed, serving defaults", error);
    const fallback = Object.fromEntries(stations.map((s) => [s.id, defaultDisplay(s)]));
    return NextResponse.json({ stations: fallback });
  }
}
