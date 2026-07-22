import type { ReactNode } from "react";

/**
 * Page scaffold with semantic landmarks. Keeps one primary action prominent by
 * pinning `footer` content to the bottom of the viewport.
 */
export function Screen({
  children,
  footer,
  header,
}: {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-zwita-white text-zwita-ink">
      {header ? (
        <header className="px-5 pt-5">{header}</header>
      ) : null}
      <main className="flex flex-1 flex-col px-5 py-6">{children}</main>
      {footer ? (
        <footer className="sticky bottom-0 border-t border-black/5 bg-zwita-white/95 px-5 py-4 backdrop-blur">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
