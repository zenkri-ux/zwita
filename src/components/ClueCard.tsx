import Image from "next/image";

/**
 * The active clue, set over a darkened photograph of the mill interior. The
 * amber eyebrow marks which step the player is on; the clue itself stays short
 * and high-contrast so it reads at a glance in dim light.
 */
export function ClueCard({
  clue,
  eyebrow,
}: {
  clue: string;
  eyebrow?: string;
}) {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="relative overflow-hidden rounded-media shadow-lift">
        <Image
          src="/images/mill/interior/main-hall.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          priority
        />
        {/* Darkening wash keeps the Arabic legible over the photograph. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-zwita-ink/40 to-zwita-ink/75"
        />
        <div className="relative px-6 py-8 text-center">
          {eyebrow ? (
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-zwita-amber">
              {eyebrow}
            </p>
          ) : null}
          <p className="text-[22px] font-extrabold leading-[1.7] text-zwita-white">
            {clue}
          </p>
        </div>
      </div>
    </section>
  );
}
