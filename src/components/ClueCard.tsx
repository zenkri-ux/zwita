/**
 * The active clue, set over a darkened photograph. The background image is the
 * station's cover, which the admin can change; it may be a built-in /images
 * path or an uploaded /api/media image, so a plain <img> is used rather than
 * next/image. The amber eyebrow marks the step; the clue stays short and
 * high-contrast for dim light.
 */
export function ClueCard({
  clue,
  eyebrow,
  coverImage,
}: {
  clue: string;
  eyebrow?: string;
  coverImage: string;
}) {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="relative overflow-hidden rounded-media shadow-lift">
        <img
          src={coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
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
