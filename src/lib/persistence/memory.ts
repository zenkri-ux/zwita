import type { PersistenceAdapter } from "./types";

/**
 * In-memory adapter. Used in unit tests and as a last-resort fallback so the
 * app never crashes when no browser storage is available (data is simply not
 * durable across reloads in that degraded case).
 */
export class MemoryAdapter implements PersistenceAdapter {
  private store = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return (this.store.has(key) ? (this.store.get(key) as T) : null);
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
}
