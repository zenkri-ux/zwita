import { NextResponse } from "next/server";
import { getActivity, getPlayers, getSummary } from "@/lib/server/store";

// Protected by middleware (valid admin cookie required). Returns everything the
// dashboard needs in one call: headline counts, the players table, and the
// recent activity feed — optionally filtered to a single player.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const player = url.searchParams.get("player") ?? undefined;
  try {
    return NextResponse.json({
      summary: getSummary(),
      players: getPlayers(200),
      activity: getActivity(player ? 200 : 60, player),
      player: player ?? null,
    });
  } catch (error) {
    console.error("admin data query failed", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }
}
