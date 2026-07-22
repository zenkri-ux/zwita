import { test, expect } from "@playwright/test";

// These flows rely on the simulated scanner adapter (NEXT_PUBLIC_SCANNER=simulated,
// set by the webServer config), so no real camera is needed. The simulated
// buttons emit exactly what a printed QR contains: a <baseUrl>/q/<CODE> URL.

// Every approved route covers all eight scannable plaques.
const STATIONS_PER_ROUTE = 8;

async function startGame(page: import("@playwright/test").Page, name = "سارة") {
  await page.goto("/");
  await page.getByTestId("start").click();
  await page.getByTestId("nickname").fill(name);
  await page.getByTestId("setup-continue").click();
  await page.getByTestId("rules-start").click();
  await expect(page.getByTestId("open-scanner")).toBeVisible();
}

test("starts a game and reaches the first clue", async ({ page }) => {
  await startGame(page);
  await expect(page).toHaveURL(/\/mission/);
});

test("completes the full eight-station route", async ({ page }) => {
  // Walking all eight stations is three screen transitions per station; it is
  // legitimately longer than the default budget, so give it room rather than
  // letting a slow run masquerade as a failure.
  test.setTimeout(120_000);
  await startGame(page);
  for (let step = 0; step < STATIONS_PER_ROUTE; step += 1) {
    await page.getByTestId("open-scanner").click();
    await page.getByTestId("sim-correct").click();

    // Wait for each transition rather than firing eight clicks blind: without
    // this the loop can run ahead of a re-render, land a click on a screen that
    // is on its way out, and desynchronise the whole run.
    const cont = page.getByTestId("discovery-continue");
    await expect(cont).toBeVisible();
    await cont.click();

    if (step < STATIONS_PER_ROUTE - 1) {
      await expect(page.getByTestId("open-scanner")).toBeVisible();
    }
  }
  await expect(page).toHaveURL(/\/complete/);
  await expect(page.getByTestId("complete-title")).toBeVisible();
});

test("distinguishes a wrong plaque from the required one", async ({ page }) => {
  await startGame(page);
  await page.getByTestId("open-scanner").click();
  // Scanning another plaque's QR is rejected with playful feedback...
  await page.getByTestId("sim-wrong").click();
  await expect(page.getByRole("status")).toContainText("ليست هذه المحطة");
  await expect(page).toHaveURL(/\/mission/);
  // ...while the required plaque reveals the discovery content.
  await page.getByTestId("sim-correct").click();
  await expect(page.getByTestId("discovery-continue")).toBeVisible();
});

test("rejects an unreadable code", async ({ page }) => {
  await startGame(page);
  await page.getByTestId("open-scanner").click();
  await page.getByTestId("sim-bad").click();
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page).toHaveURL(/\/mission/);
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

// --- Printed-QR deep link (/q/<code>) -------------------------------------
// This is the path a phone's native camera takes: it opens the scanned URL
// directly rather than going through the in-app scanner.

test("deep link invites a first-time visitor to start", async ({ page }) => {
  // No saved game on this device yet.
  await page.goto("/q/P6H2ZC");
  await expect(page.getByTestId("scan-go-home")).toBeVisible();
});

test("deep link with an unknown code gives feedback mid-game", async ({ page }) => {
  await startGame(page);
  await page.goto("/q/ZZZZ99");
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByTestId("scan-back")).toBeVisible();
});

test("language selection switches the UI to French (LTR)", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("start").click();
  await page.getByTestId("lang-fr").click();
  await page.getByTestId("nickname").fill("Sara");
  await page.getByTestId("setup-continue").click();
  await expect(page.getByRole("heading", { name: "Comment jouer" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
