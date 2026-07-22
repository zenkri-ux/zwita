import type { MetadataRoute } from "next";
import { ar } from "@/lib/i18n/dictionaries/ar";

// Generated at /manifest.webmanifest by Next. Arabic-first, RTL, installable.
// NOTE: SVG icon is a placeholder for the slice; PNG (incl. 180×180 apple-touch
// and maskable variants) are a later task (plan item A7).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ar.appName,
    short_name: ar.appName,
    description: ar.welcome.tagline,
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F2E8",
    theme_color: "#0878C9",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
