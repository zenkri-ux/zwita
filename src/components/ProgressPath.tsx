/**
 * Compact progress bars for the route: olive = discovered, amber = where you
 * are now, neutral = still ahead. State is also announced in the text label, so
 * progress is never conveyed by colour alone.
 */
export function ProgressPath({
  total,
  currentIndex,
  label,
  caption,
}: {
  total: number;
  currentIndex: number;
  label: string;
  caption?: string;
}) {
  return (
    <div className="w-full">
      <div className="mb-2">
        {caption ? (
          <p className="text-xs font-bold text-zwita-ink/50">{caption}</p>
        ) : null}
        <p className="text-[13px] font-extrabold text-zwita-olive-dark">{label}</p>
      </div>
      <ol className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li
              key={i}
              className={[
                "h-2 flex-1 rounded-full",
                done
                  ? "bg-zwita-olive"
                  : active
                    ? "bg-zwita-amber"
                    : "bg-zwita-ink/15",
              ].join(" ")}
            />
          );
        })}
      </ol>
    </div>
  );
}
