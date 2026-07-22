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
        zwita: {
          white: "var(--zwita-white)",
          olive: "var(--zwita-olive)",
          "olive-dark": "var(--zwita-olive-dark)",
          "olive-deep": "var(--zwita-olive-deep)",
          clay: "var(--zwita-clay)",
          "clay-dark": "var(--zwita-clay-dark)",
          amber: "var(--zwita-amber)",
          "amber-dark": "var(--zwita-amber-dark)",
          ink: "var(--zwita-ink)",
          blue: "var(--zwita-blue)",
          "blue-dark": "var(--zwita-blue-dark)",
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
