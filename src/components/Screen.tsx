import type { ReactNode } from "react";

/**
 * Page scaffold with semantic landmarks.
 *
 * `bleed` drops the horizontal padding so hero screens (welcome, completion)
 * can run their photography edge to edge; the footer keeps its own padding so
 * the single primary action stays reachable and inside the safe area.
 */
export function Screen({
  children,
  footer,
  header,
  bleed = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  bleed?: boolean;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-zwita-white text-zwita-ink">
      {header ? (
        <header className="safe-top safe-x px-5 pt-5">{header}</header>
      ) : null}
      <main
        className={
          bleed
            ? "flex flex-1 flex-col"
            : "safe-x flex flex-1 flex-col px-5 py-6"
        }
      >
        {children}
      </main>
      {footer ? (
        <footer className="action-bar safe-bottom safe-x sticky bottom-0 px-5 pb-5 pt-4">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
