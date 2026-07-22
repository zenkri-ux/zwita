/**
 * Durable local persistence for game progress.
 *
 * The adapter interface hides the storage mechanism so it can be swapped or
 * mocked. Production prefers IndexedDB (durable, larger quota) and falls back to
 * localStorage or memory when IndexedDB is unavailable (private mode, iOS
 * eviction, older webviews).
 *
 * All methods are async so IndexedDB fits without changing callers.
 */
export interface PersistenceAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export const GAME_STATE_KEY = "zwita.gameState";
