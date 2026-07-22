"use client";

import { useState, type FormEvent } from "react";
import { useDict } from "@/lib/i18n/useDict";

/**
 * Manual short-code entry (e.g. P6H2ZC, printed under every plaque QR). Always
 * available as an alternative to the camera — permission denied, no camera, or
 * a code too dusty to scan — and feeds the exact same validation pipeline.
 */
export function ManualCodeEntry({
  onSubmit,
}: {
  onSubmit: (raw: string) => void;
}) {
  const dict = useDict();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label
        htmlFor="manual-code"
        className="block text-center text-[12.5px] text-zwita-ink/50"
      >
        {dict.mission.manualEntry}
      </label>
      <div className="flex gap-2">
        <input
          id="manual-code"
          name="manual-code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          dir="ltr"
          placeholder={dict.mission.manualPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[48px] flex-1 rounded-input border-[1.5px] border-zwita-ink/10 bg-white px-4 text-center text-[15px] font-semibold tracking-[0.15em] text-zwita-ink"
        />
        <button
          type="submit"
          className="min-h-[48px] rounded-input bg-zwita-olive px-5 font-extrabold text-white transition-colors hover:bg-zwita-olive-dark"
        >
          {dict.mission.submit}
        </button>
      </div>
    </form>
  );
}
