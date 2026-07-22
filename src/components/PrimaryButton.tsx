import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

/**
 * Large, high-contrast action. Olive is the primary action colour of the design
 * system; `secondary` is a quiet underlined link and `danger` uses clay for
 * destructive confirmations. Always ≥44px (in practice 56px) touch target.
 */
export function PrimaryButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2.5 rounded-btn px-6 text-[17px] font-extrabold transition-colors disabled:opacity-50";

  const styles: Record<Variant, string> = {
    primary:
      "min-h-[56px] bg-zwita-olive text-white shadow-btn hover:bg-zwita-olive-dark active:bg-zwita-olive-dark",
    secondary:
      "touch-target bg-transparent text-zwita-olive-dark underline underline-offset-4 hover:text-zwita-olive",
    danger:
      "min-h-[52px] bg-zwita-clay text-white hover:brightness-95 active:brightness-90",
  };

  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
