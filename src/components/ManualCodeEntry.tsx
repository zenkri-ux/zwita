"use client";

import { useState, type FormEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { ar } from "@/lib/i18n/dictionaries/ar";

/**
 * Manual short-code entry. Always available as an alternative to the camera
 * (permission denied, no camera, low light). Feeds the exact same
 * parse/validate pipeline as scanning.
 */
export function ManualCodeEntry({
  onSubmit,
}: {
  onSubmit: (raw: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="manual-code" className="block font-semibold">
        {ar.mission.manualLabel}
      </label>
      <input
        id="manual-code"
        name="manual-code"
        type="text"
        inputMode="text"
        autoComplete="off"
        dir="ltr"
        placeholder={ar.mission.manualPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="touch-target w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-lg"
      />
      <PrimaryButton type="submit">{ar.mission.submit}</PrimaryButton>
    </form>
  );
}
