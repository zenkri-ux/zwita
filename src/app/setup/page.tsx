"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ar } from "@/lib/i18n/dictionaries/ar";

// Avatar symbols reflect the mill's world (olive, jar, door, dome, sun, key).
const AVATARS = ["🫒", "🏺", "🚪", "🕌", "☀️", "🗝️"];

export default function SetupPage() {
  const router = useRouter();
  const { hydrated, phase } = useHydratedGame();
  const setProfile = useGameStore((s) => s.setProfile);

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0] ?? "🫒");

  // Guard: only valid from the setup phase.
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "welcome") router.replace("/");
    else if (phase === "mission") router.replace("/mission");
    else if (phase === "complete") router.replace("/complete");
  }, [hydrated, phase, router]);

  function handleContinue() {
    if (!nickname.trim()) return;
    setProfile(nickname, avatar);
    router.push("/mission");
  }

  const canContinue = nickname.trim().length > 0;

  return (
    <Screen
      footer={
        <PrimaryButton
          onClick={handleContinue}
          disabled={!canContinue}
          data-testid="setup-continue"
        >
          {ar.setup.continue}
        </PrimaryButton>
      }
    >
      <h1 className="text-3xl font-extrabold text-zwita-blue-dark">
        {ar.setup.title}
      </h1>

      <div className="mt-6 space-y-2">
        <label htmlFor="nickname" className="block font-semibold">
          {ar.setup.nicknameLabel}
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          autoComplete="off"
          maxLength={40}
          placeholder={ar.setup.nicknamePlaceholder}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="touch-target w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-lg"
          data-testid="nickname"
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 font-semibold">{ar.setup.avatarLabel}</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((symbol) => {
            const selected = symbol === avatar;
            return (
              <button
                key={symbol}
                type="button"
                aria-pressed={selected}
                onClick={() => setAvatar(symbol)}
                className={[
                  "touch-target flex items-center justify-center rounded-2xl border text-2xl",
                  selected
                    ? "border-zwita-blue bg-zwita-blue/10 ring-2 ring-zwita-blue"
                    : "border-black/15 bg-white",
                ].join(" ")}
              >
                <span aria-hidden>{symbol}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
