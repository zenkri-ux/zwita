// Avatar symbols drawn from the mill's own vocabulary — an olive leaf, a clay
// jar, a drop of oil, a rooftop dome — as CSS shapes rather than emoji, so they
// render identically on every device and match the brand palette.

export const AVATAR_IDS = ["leaf", "jar", "droplet", "dome"] as const;
export type AvatarId = (typeof AVATAR_IDS)[number];

export function isAvatarId(value: string): value is AvatarId {
  return (AVATAR_IDS as readonly string[]).includes(value);
}

/** Scale factor 1 renders at the setup-picker size. */
export function AvatarMark({ id, scale = 1 }: { id: string; scale?: number }) {
  const px = (n: number) => `${n * scale}px`;
  const shape = isAvatarId(id) ? id : "leaf";

  if (shape === "jar") {
    return (
      <span
        aria-hidden
        style={{
          width: px(22),
          height: px(26),
          background: "var(--zwita-clay)",
          borderRadius: `${px(6)} ${px(6)} ${px(12)} ${px(12)}`,
          clipPath: "polygon(20% 0,80% 0,100% 20%,100% 100%,0 100%,0 20%)",
          display: "block",
        }}
      />
    );
  }

  if (shape === "droplet") {
    return (
      <span
        aria-hidden
        style={{
          width: px(22),
          height: px(22),
          background: "var(--zwita-amber)",
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(45deg)",
          display: "block",
        }}
      />
    );
  }

  if (shape === "dome") {
    return (
      <span
        aria-hidden
        style={{
          width: px(28),
          height: px(16),
          background: "var(--zwita-amber)",
          borderRadius: `${px(14)} ${px(14)} 0 0`,
          display: "block",
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{
        width: px(26),
        height: px(26),
        background: "var(--zwita-olive)",
        borderRadius: "0% 100% 0% 100%",
        display: "block",
      }}
    />
  );
}
