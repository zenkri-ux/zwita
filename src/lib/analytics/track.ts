"use client";

import type { GameEvent } from "./events";

// Fire-and-forget analytics. The game must keep working underground on a weak
// or absent network, so this never blocks, never throws, and quietly re-queues
// anything it could not deliver. It is a thin client — the store builds the
// events and calls track().

const ENDPOINT = "/api/events";
const QUEUE_KEY = "zwita.analytics.queue";
const MAX_QUEUE = 200;
const FLUSH_DELAY_MS = 1500;

let queue: GameEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let loaded = false;
let listenerAdded = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Deliver anything still queued when the page is hidden or closed. */
function ensureUnloadFlush(): void {
  if (listenerAdded || !isBrowser()) return;
  listenerAdded = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushBeacon();
  });
}

function loadQueue(): void {
  if (loaded || !isBrowser()) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (raw) queue = JSON.parse(raw) as GameEvent[];
  } catch {
    queue = [];
  }
}

function persistQueue(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
  } catch {
    // Storage may be full or blocked; losing analytics is acceptable.
  }
}

/** Queue an event and schedule a flush. Safe to call anywhere on the client. */
export function track(event: GameEvent): void {
  if (!isBrowser()) return;
  ensureUnloadFlush();
  loadQueue();
  queue.push(event);
  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  persistQueue();
  scheduleFlush();
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_DELAY_MS);
}

/**
 * Attempt to deliver the queued events. On any failure the batch is put back so
 * it is retried on the next flush (or after a reload, from localStorage).
 */
export async function flush(): Promise<void> {
  if (!isBrowser() || queue.length === 0) return;
  const batch = queue.slice(0, 50);
  const body = JSON.stringify({ events: batch });

  let delivered = false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
    delivered = res.ok;
  } catch {
    delivered = false;
  }

  if (delivered) {
    queue = queue.slice(batch.length);
    persistQueue();
    if (queue.length > 0) scheduleFlush();
  } else {
    // Leave the queue intact and try again later.
    scheduleFlush();
  }
}

/**
 * Best-effort delivery when the page is being hidden/closed, using sendBeacon
 * which survives navigation. Called from a visibilitychange handler.
 */
export function flushBeacon(): void {
  if (!isBrowser() || queue.length === 0) return;
  loadQueue();
  try {
    const blob = new Blob([JSON.stringify({ events: queue.slice(0, 50) })], {
      type: "application/json",
    });
    if (navigator.sendBeacon(ENDPOINT, blob)) {
      queue = queue.slice(50);
      persistQueue();
    }
  } catch {
    // ignore
  }
}
