import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

/**
 * Large, high-contrast, ≥44px touch target. The one prominent action per screen
 * uses `primary`; alternatives use `secondary`.
 */
export function PrimaryButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "touch-target inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-lg font-bold transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-zwita-blue text-white hover:bg-zwita-blue-dark active:bg-zwita-blue-dark"
      : "bg-transparent text-zwita-blue-dark underline underline-offset-4 hover:text-zwita-blue";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
