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
};

export default withSerwist(nextConfig);
