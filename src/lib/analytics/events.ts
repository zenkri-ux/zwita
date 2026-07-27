// Shared analytics event shapes (client emits, server stores).
//
// Privacy: an event only ever carries a nickname and anonymous session/player
// ids — never an email, phone, or precise location. See AGENTS.md.

import type { Locale } from "@/content/types";
import type { ScanOutcome } from "@/lib/game/types";

export type GameEventType =
  | "session_started"
  | "profile_set"
  | "route_started"
  | "scan"
  | "completed"
  | "reset";

export type GameEvent = {
  type: GameEventType;
  /** Client clock (ISO). The server also records its own receive time. */
  clientTs: string;
  sessionId: string;
  playerId: string;
  nickname?: string;
  avatar?: string;
  locale?: Locale;
  /** Route length, when known. */
  total?: number;
  /** 1-based station position within the route, when relevant. */
  index?: number;
  stationId?: string;
  outcome?: ScanOutcome;
  score?: number;
};

/** Hard caps so a malicious client cannot flood or bloat the store. */
export const MAX_EVENTS_PER_REQUEST = 50;
export const MAX_STRING_LEN = 120;

export const EVENT_TYPES: readonly GameEventType[] = [
  "session_started",
  "profile_set",
  "route_started",
  "scan",
  "completed",
  "reset",
];
