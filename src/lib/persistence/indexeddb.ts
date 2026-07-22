import type { PersistenceAdapter } from "./types";
import { MemoryAdapter } from "./memory";

const DB_NAME = "zwita";
const STORE_NAME = "kv";
const DB_VERSION = 1;

/**
 * Hand-rolled IndexedDB key/value adapter (no external dependency). Values are
 * stored as structured clones under a single object store.
 */
export class IndexedDbAdapter implements PersistenceAdapter {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.dbPromise;
  }

  private async tx<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest,
  ): Promise<T> {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = run(store);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.tx<T | undefined>("readonly", (s) => s.get(key));
    return value ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.tx("readwrite", (s) => s.put(value, key));
  }

  async remove(key: string): Promise<void> {
    await this.tx("readwrite", (s) => s.delete(key));
  }
}

/**
 * localStorage-backed adapter. JSON-serialised. Durable-ish fallback when
 * IndexedDB is missing but Web Storage works.
 */
export class LocalStorageAdapter implements PersistenceAdapter {
  async get<T>(key: string): Promise<T | null> {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  }
}

/**
 * Choose the best available persistence for the current environment:
 * IndexedDB → localStorage → memory. Never throws; degrades gracefully.
 */
export function createPersistence(): PersistenceAdapter {
  if (typeof window === "undefined") return new MemoryAdapter();
  try {
    if ("indexedDB" in window && window.indexedDB) {
      return new IndexedDbAdapter();
    }
  } catch {
    // Access to indexedDB can throw in some privacy modes.
  }
  try {
    if ("localStorage" in window && window.localStorage) {
      // Probe: some browsers expose localStorage but throw on write.
      const probe = "__zwita_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return new LocalStorageAdapter();
    }
  } catch {
    // fall through
  }
  return new MemoryAdapter();
}
