"use client";

import { useEffect, useState } from "react";
import { useDict } from "@/lib/i18n/useDict";

/**
 * Non-blocking banner shown when the browser reports it is offline. The core
 * loop keeps working, so this only reassures — it never interrupts a mission.
 */
export function OfflineBanner() {
  const dict = useDict();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return (
    <div
      role="status"
      className="bg-zwita-ink px-4 py-2 text-center text-sm text-zwita-white"
    >
      {dict.offline.banner}
    </div>
  );
}
