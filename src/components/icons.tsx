import type { SVGProps } from "react";

// Icon set from the design system: 24px grid, 1.8 stroke, rounded joins.
// All icons are decorative — screens supply the accessible text next to them.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const stroke = {
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Olive drop — the ZWITA mark, also used for the clue. */
export function DropIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...props}>
      <path
        d="M12 3C8 6 6 9.5 6 13a6 6 0 0012 0c0-3.5-2-7-6-10z"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        {...stroke}
      />
    </Svg>
  );
}

export function ScanIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" {...stroke} />
      <path d="M8 7L9.5 4.5h5L16 7" stroke="currentColor" {...stroke} />
      <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...stroke} />
      <path d="M8 12.5l2.6 2.6L16.5 9" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

/** Retry / wrong-station loop. */
export function RetryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12a8 8 0 0113.6-5.7M20 12a8 8 0 01-13.6 5.7" stroke="currentColor" {...stroke} />
      <path d="M17 3v4h-4M7 21v-4h4" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

export function ProgressIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.6" fill="var(--zwita-olive)" />
      <circle cx="12" cy="12" r="2.6" fill="var(--zwita-amber)" />
      <circle cx="18" cy="12" r="2.6" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

export function OfflineIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 15a9 9 0 0118 0" stroke="currentColor" {...stroke} />
      <path d="M3 21L21 3" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

export function KeypadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" {...stroke} />
      <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h8" stroke="currentColor" {...stroke} />
    </Svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function QuestionIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...stroke} />
      <path d="M9.6 9.4a2.5 2.5 0 013.9-1.2c1.2.9.9 2.3-.2 3-.8.5-1.3 1-1.3 1.9" stroke="currentColor" {...stroke} />
      <path d="M12 17h.01" stroke="currentColor" {...stroke} />
    </Svg>
  );
}
