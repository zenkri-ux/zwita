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
          blue: "var(--zwita-blue)",
          "blue-dark": "var(--zwita-blue-dark)",
          olive: "var(--zwita-olive)",
          clay: "var(--zwita-clay)",
          amber: "var(--zwita-amber)",
          ink: "var(--zwita-ink)",
        },
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
