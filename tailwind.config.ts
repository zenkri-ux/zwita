import type { Config } from "tailwindcss";

// Design tokens mirror the CSS custom properties declared in globals.css so the
// mill's visual language (limewashed white, blue doors, olive, clay, amber) is
// available as Tailwind utilities. Colours reference the CSS variables to keep a
// single source of truth.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Channel form + <alpha-value> so opacity modifiers (bg-zwita-olive/10,
        // text-zwita-ink/70, …) actually emit CSS. See globals.css.
        zwita: {
          white: "rgb(var(--zwita-white-rgb) / <alpha-value>)",
          olive: "rgb(var(--zwita-olive-rgb) / <alpha-value>)",
          "olive-dark": "rgb(var(--zwita-olive-dark-rgb) / <alpha-value>)",
          "olive-deep": "rgb(var(--zwita-olive-deep-rgb) / <alpha-value>)",
          clay: "rgb(var(--zwita-clay-rgb) / <alpha-value>)",
          "clay-dark": "rgb(var(--zwita-clay-dark-rgb) / <alpha-value>)",
          amber: "rgb(var(--zwita-amber-rgb) / <alpha-value>)",
          "amber-dark": "rgb(var(--zwita-amber-dark-rgb) / <alpha-value>)",
          ink: "rgb(var(--zwita-ink-rgb) / <alpha-value>)",
          blue: "rgb(var(--zwita-blue-rgb) / <alpha-value>)",
          "blue-dark": "rgb(var(--zwita-blue-dark-rgb) / <alpha-value>)",
        },
      },
      borderRadius: {
        input: "var(--r-input)",
        card: "var(--r-card)",
        btn: "var(--r-btn)",
        media: "var(--r-media)",
        sheet: "var(--r-sheet)",
      },
      boxShadow: {
        card: "var(--sh-card)",
        lift: "var(--sh-lift)",
        btn: "var(--sh-btn)",
        sheet: "var(--sh-sheet)",
      },
      fontFamily: {
        // Self-hosted Arabic-first stack; system fallbacks avoid blocking fonts.
        sans: ["var(--font-zwita)", "system-ui", "sans-serif"],
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
