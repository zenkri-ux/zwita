import "server-only";
import { getDb } from "./db";
import { EVENT_TYPES, MAX_STRING_LEN, type GameEvent } from "@/lib/analytics/events";

// Read/write helpers over the SQLite database. Everything that touches the DB
// goes through here so the API routes stay thin.

function clip(value: unknown): string | null {
  return typeof value === "string" ? value.slice(0, MAX_STRING_LEN) : null;
}

function int(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : null;
}

/** Validate a single untrusted event; returns null if it is not usable. */
export function sanitizeEvent(raw: unknown): GameEvent | null {
  if (typeof raw !== "object" || raw === null) return null;
  const e = raw as Record<string, unknown>;
  const type = e.type;
  if (typeof type !== "string" || !(EVENT_TYPES as readonly string[]).includes(type))
    return null;
  const sessionId = clip(e.sessionId);
  const playerId = clip(e.playerId);
  if (!sessionId || !playerId) return null;
  return {
    type: type as GameEvent["type"],
    clientTs: clip(e.clientTs) ?? new Date().toISOString(),
    sessionId,
    playerId,
    nickname: clip(e.nickname) ?? undefined,
    avatar: clip(e.avatar) ?? undefined,
    locale: (clip(e.locale) as GameEvent["locale"]) ?? undefined,
    total: int(e.total) ?? undefined,
    index: int(e.index) ?? undefined,
    stationId: clip(e.stationId) ?? undefined,
    outcome: (clip(e.outcome) as GameEvent["outcome"]) ?? undefined,
    score: int(e.score) ?? undefined,
  };
}

const insertEventStmt = () =>
  getDb().prepare(`
    INSERT INTO events
      (ts, client_ts, session_id, player_id, type, nickname, avatar, locale, station_id, outcome, score, idx, total)
    VALUES
      (@ts, @clientTs, @sessionId, @playerId, @type, @nickname, @avatar, @locale, @stationId, @outcome, @score, @idx, @total)
  `);

/**
 * Store a batch of events and roll each one into the materialised players row.
 * Runs in a single transaction.
 */
export function recordEvents(events: GameEvent[]): number {
  const db = getDb();
  const ts = new Date().toISOString();
  const insert = insertEventStmt();
  const tx = db.transaction((batch: GameEvent[]) => {
    for (const e of batch) {
      insert.run({
        ts,
        clientTs: e.clientTs,
        sessionId: e.sessionId,
        playerId: e.playerId,
        type: e.type,
        nickname: e.nickname ?? null,
        avatar: e.avatar ?? null,
        locale: e.locale ?? null,
        stationId: e.stationId ?? null,
        outcome: e.outcome ?? null,
        score: e.score ?? null,
        idx: e.index ?? null,
        total: e.total ?? null,
      });
      upsertPlayer(e, ts);
    }
  });
  tx(events);
  return events.length;
}

function upsertPlayer(e: GameEvent, ts: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO players (player_id, first_seen) VALUES (?, ?)
     ON CONFLICT(player_id) DO NOTHING`,
  ).run(e.playerId, ts);

  const sets: string[] = ["last_seen = @ts", "events = events + 1"];
  const params: Record<string, unknown> = { ts, playerId: e.playerId };
  if (e.sessionId) (sets.push("session_id = @sessionId"), (params.sessionId = e.sessionId));
  if (e.nickname) (sets.push("nickname = @nickname"), (params.nickname = e.nickname));
  if (e.avatar) (sets.push("avatar = @avatar"), (params.avatar = e.avatar));
  if (e.locale) (sets.push("locale = @locale"), (params.locale = e.locale));
  if (e.total != null) (sets.push("total = @total"), (params.total = e.total));
  if (e.score != null) (sets.push("score = @score"), (params.score = e.score));
  if (e.type === "scan" && e.outcome === "correct") sets.push("discovered = discovered + 1");
  if (e.type === "completed") sets.push("completed = 1");

  db.prepare(`UPDATE players SET ${sets.join(", ")} WHERE player_id = @playerId`).run(params);
}

// --- Admin reads -------------------------------------------------------------

export type PlayerRow = {
  player_id: string;
  nickname: string | null;
  avatar: string | null;
  locale: string | null;
  score: number;
  discovered: number;
  total: number | null;
  completed: number;
  events: number;
  first_seen: string | null;
  last_seen: string | null;
};

export function getSummary() {
  const db = getDb();
  const players = db.prepare("SELECT COUNT(*) n FROM players").get() as { n: number };
  const completed = db
    .prepare("SELECT COUNT(*) n FROM players WHERE completed = 1")
    .get() as { n: number };
  const scans = db
    .prepare("SELECT COUNT(*) n FROM events WHERE type = 'scan'")
    .get() as { n: number };
  const correct = db
    .prepare("SELECT COUNT(*) n FROM events WHERE type = 'scan' AND outcome = 'correct'")
    .get() as { n: number };
  const started = db
    .prepare("SELECT COUNT(*) n FROM players WHERE total IS NOT NULL")
    .get() as { n: number };
  return {
    players: players.n,
    started: started.n,
    completed: completed.n,
    scans: scans.n,
    correctScans: correct.n,
  };
}

export function getPlayers(limit = 200): PlayerRow[] {
  return getDb()
    .prepare("SELECT * FROM players ORDER BY last_seen DESC LIMIT ?")
    .all(limit) as PlayerRow[];
}

export type ActivityRow = {
  id: number;
  ts: string;
  player_id: string;
  nickname: string | null;
  type: string;
  station_id: string | null;
  outcome: string | null;
  score: number | null;
};

export function getActivity(limit = 100, playerId?: string): ActivityRow[] {
  const db = getDb();
  if (playerId) {
    return db
      .prepare(
        `SELECT id, ts, player_id, nickname, type, station_id, outcome, score
         FROM events WHERE player_id = ? ORDER BY id DESC LIMIT ?`,
      )
      .all(playerId, limit) as ActivityRow[];
  }
  return db
    .prepare(
      `SELECT id, ts, player_id, nickname, type, station_id, outcome, score
       FROM events ORDER BY id DESC LIMIT ?`,
    )
    .all(limit) as ActivityRow[];
}
