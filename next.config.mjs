import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Service worker source and output. The SW is disabled in development so it
  // does not interfere with hot reloading or the simulated scanner.
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lean container image: only the standalone server + required node_modules
  // are emitted, which keeps the Docker image small.
  output: "standalone",
  reactStrictMode: true,
  images: {
    // Local authentic photography only; no remote image hosts in the slice.
    formats: ["image/avif", "image/webp"],
  },
  // better-sqlite3 is a native module: keep webpack from trying to bundle it,
  // and make sure its compiled binary is traced into the standalone output.
  // Both keys live under `experimental` in Next 14.
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "sharp"],
    outputFileTracingIncludes: {
      "/api/**": ["./node_modules/better-sqlite3/build/Release/*.node"],
    },
  },
};

export default withSerwist(nextConfig);
