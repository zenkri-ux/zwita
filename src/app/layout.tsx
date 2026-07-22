import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { ar } from "@/lib/i18n/dictionaries/ar";
import "./globals.css";

// Arabic-first font. next/font self-hosts the files (no external runtime
// request) and applies font-display: swap, so nothing blocks first paint.
// NOTE: the subset is fetched at BUILD time, so the build machine needs network
// access; swap for a local .woff2 if building fully offline.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-zwita",
});

export const metadata: Metadata = {
  title: ar.appName,
  description: ar.welcome.tagline,
  applicationName: ar.appName,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: ar.appName,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0878c9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
