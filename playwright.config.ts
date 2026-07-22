import { defineConfig, devices } from "@playwright/test";

// E2E runs against a production build with the simulated scanner adapter so the
// happy/wrong/restore flows are deterministic and camera-free.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    // Run against a production build: pages are pre-compiled so React hydration
    // (and thus button click handlers) is ready immediately — dev-mode compile
    // latency would otherwise drop the first click. `next start` serves the full
    // .next output here (the output:standalone notice is advisory). The simulated
    // scanner is forced via env so these flows never touch a real camera.
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SCANNER: "simulated",
      PORT: "3000",
    },
  },
});
