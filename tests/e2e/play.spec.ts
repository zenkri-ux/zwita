import { test, expect } from "@playwright/test";

// These flows rely on the simulated scanner adapter (NEXT_PUBLIC_SCANNER=simulated,
// set by the webServer config), so no real camera is needed.

async function startGame(page: import("@playwright/test").Page, name = "سارة") {
  await page.goto("/");
  await page.getByTestId("start").click();
  await page.getByTestId("nickname").fill(name);
  await page.getByTestId("setup-continue").click();
  await expect(page.getByTestId("open-scanner")).toBeVisible();
}

test("starts a game and reaches the first clue", async ({ page }) => {
  await startGame(page);
  await expect(page).toHaveURL(/\/mission/);
});

test("completes the three-station route", async ({ page }) => {
  await startGame(page);
  for (let step = 0; step < 3; step += 1) {
    await page.getByTestId("open-scanner").click();
    await page.getByTestId("sim-correct").click();
    await page.getByTestId("discovery-continue").click();
  }
  await expect(page).toHaveURL(/\/complete/);
  await expect(page.getByTestId("complete-title")).toBeVisible();
});

test("shows playful feedback for a wrong station", async ({ page }) => {
  await startGame(page);
  await page.getByTestId("open-scanner").click();
  await page.getByTestId("sim-wrong").click();
  // Non-correct feedback appears as a polite status region.
  await expect(page.getByRole("status")).toContainText("ليست هذه المحطة");
  // Still on the mission; not advanced.
  await expect(page).toHaveURL(/\/mission/);
});

test("restores an interrupted game after reload", async ({ page }) => {
  await startGame(page);
  // Complete the first station only.
  await page.getByTestId("open-scanner").click();
  await page.getByTestId("sim-correct").click();
  await page.getByTestId("discovery-continue").click();
  await expect(page.getByTestId("open-scanner")).toBeVisible();

  await page.reload();
  // Resumes on the mission, not the welcome screen.
  await expect(page).toHaveURL(/\/mission/);
  await expect(page.getByTestId("open-scanner")).toBeVisible();
});
