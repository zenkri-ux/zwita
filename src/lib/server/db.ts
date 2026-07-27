import "server-only";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/** Directory for admin-uploaded images, alongside the database file. */
export function uploadsDir(): string {
  const dir = process.env.ZWITA_UPLOADS_DIR || join(dirname(dbPath()), "uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
}

// Single SQLite database for game analytics. The file lives outside the app
// bundle (a mounted Docker volume in production) so it survives redeploys.
//
// Two tables:
//   events  — an append-only log of everything that happened.
//   players — the current state per anonymous player, kept up to date on each
//             event so the admin dashboard reads are trivial and fast.

let db: Database.Database | null = null;

function dbPath(): string {
  return process.env.ZWITA_DB_PATH || join(process.cwd(), "data", "zwita.db");
}

export function getDb(): Database.Database {
  if (db) return db;
  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });
  db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      ts          TEXT NOT NULL,
      client_ts   TEXT,
      session_id  TEXT NOT NULL,
      player_id   TEXT NOT NULL,
      type        TEXT NOT NULL,
      nickname    TEXT,
      avatar      TEXT,
      locale      TEXT,
      station_id  TEXT,
      outcome     TEXT,
      score       INTEGER,
      idx         INTEGER,
      total       INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_events_player ON events(player_id);
    CREATE INDEX IF NOT EXISTS idx_events_ts ON events(id DESC);

    CREATE TABLE IF NOT EXISTS station_overrides (
      station_id   TEXT PRIMARY KEY,
      clue_ar TEXT, clue_fr TEXT, clue_en TEXT,
      desc_ar TEXT, desc_fr TEXT, desc_en TEXT,
      cover_image  TEXT,
      explain_image TEXT,
      updated_at   TEXT
    );

    CREATE TABLE IF NOT EXISTS players (
      player_id   TEXT PRIMARY KEY,
      session_id  TEXT,
      nickname    TEXT,
      avatar      TEXT,
      locale      TEXT,
      score       INTEGER NOT NULL DEFAULT 0,
      discovered  INTEGER NOT NULL DEFAULT 0,
      total       INTEGER,
      completed   INTEGER NOT NULL DEFAULT 0,
      events      INTEGER NOT NULL DEFAULT 0,
      first_seen  TEXT,
      last_seen   TEXT
    );
  `);
  return db;
}
