import {expect, test} from "@playwright/test";

const themeStorageKey = "dashboard-theme";

test.describe("theme switch regression", () => {
  test("initial light theme, action label, toggle state, and reload persistence stay consistent", async ({page}) => {
    await page.emulateMedia({colorScheme: "light"});
    await page.goto("/", {waitUntil: "domcontentloaded"});
    await page.waitForLoadState("networkidle");

    const root = page.locator("html");

    await expect(root).toHaveAttribute("data-dashboard-theme", "light");
    expect(await root.evaluate((element) => element.classList.contains("dark"))).toBe(false);
    await expect(page.getByRole("button", {name: "Use dark theme"})).toBeVisible();

    await page.getByRole("button", {name: "Use dark theme"}).click();

    await expect(root).toHaveAttribute("data-dashboard-theme", "dark");
    expect(await root.evaluate((element) => element.classList.contains("dark"))).toBe(true);
    await expect(page.getByRole("button", {name: "Use light theme"})).toBeVisible();
    await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), themeStorageKey)).toBe("dark");

    await page.reload({waitUntil: "domcontentloaded"});
    await page.waitForLoadState("networkidle");

    await expect(root).toHaveAttribute("data-dashboard-theme", "dark");
    await expect(page.getByRole("button", {name: "Use light theme"})).toBeVisible();

    await page.getByRole("button", {name: "Use light theme"}).click();

    await expect(root).toHaveAttribute("data-dashboard-theme", "light");
    expect(await root.evaluate((element) => element.classList.contains("dark"))).toBe(false);
    await expect(page.getByRole("button", {name: "Use dark theme"})).toBeVisible();
  });

  test("initial dark system preference matches the rendered theme and action label", async ({page}) => {
    await page.emulateMedia({colorScheme: "dark"});
    await page.goto("/", {waitUntil: "domcontentloaded"});
    await page.waitForLoadState("networkidle");

    const root = page.locator("html");

    await expect(root).toHaveAttribute("data-dashboard-theme", "dark");
    expect(await root.evaluate((element) => element.classList.contains("dark"))).toBe(true);
    await expect(page.getByRole("button", {name: "Use light theme"})).toBeVisible();
  });
});
