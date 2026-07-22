import { test, expect } from "@playwright/test";

// These flows rely on the simulated scanner adapter (NEXT_PUBLIC_SCANNER=simulated,
// set by the webServer config), so no real camera is needed.

async function startGame(page: import("@playwright/test").Page, name = "سارة") {
  await page.goto("/");
  await page.getByTestId("start").click();
  await page.getByTestId("nickname").fill(name);
  await page.getByTestId("setup-continue").click();
  // Rules / how-to screen precedes the mission.
  await page.getByTestId("rules-start").click();
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

test("distinguishes a wrong panel from the required one", async ({ page }) => {
  await startGame(page);
  await page.getByTestId("open-scanner").click();
  // Scanning the wrong station's QR is rejected with playful feedback...
  await page.getByTestId("sim-wrong").click();
  await expect(page.getByRole("status")).toContainText("ليست هذه المحطة");
  await expect(page).toHaveURL(/\/mission/);
  // ...while the correct panel advances to the discovery screen.
  await page.getByTestId("sim-correct").click();
  await expect(page.getByTestId("discovery-continue")).toBeVisible();
});

test("restores an interrupted game after reload", async ({ page }) => {
  await startGame(page);
  await page.getByTestId("open-scanner").click();
  await page.getByTestId("sim-correct").click();
  await page.getByTestId("discovery-continue").click();
  await expect(page.getByTestId("open-scanner")).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/mission/);
  await expect(page.getByTestId("open-scanner")).toBeVisible();
});

test("language selection switches the UI to French (LTR)", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("start").click();
  await page.getByTestId("lang-fr").click();
  await page.getByTestId("nickname").fill("Sara");
  await page.getByTestId("setup-continue").click();
  // Rules screen now renders in French, and the document flips to LTR.
  await expect(page.getByRole("heading", { name: "Comment jouer" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
