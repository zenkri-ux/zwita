/**
 * Compact progress indicator for the route. Communicates state with shape + a
 * text label, not colour alone (accessibility).
 */
export function ProgressPath({
  total,
  currentIndex,
  label,
}: {
  total: number;
  currentIndex: number;
  label: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-zwita-ink/70">{label}</p>
      <ol className="flex gap-2" aria-hidden={false}>
        {Array.from({ length: total }).map((_, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li
              key={i}
              className={[
                "h-2.5 flex-1 rounded-full",
                done
                  ? "bg-zwita-olive"
                  : active
                    ? "bg-zwita-amber"
                    : "bg-black/10",
              ].join(" ")}
            />
          );
        })}
      </ol>
    </div>
  );
}
