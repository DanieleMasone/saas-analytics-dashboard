import {expect, test, type Page, type TestInfo} from "@playwright/test";

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === "Mobile Chromium";
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const pageWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    return pageWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(2);
}

test.describe("published User Guide", () => {
  test("renders product documentation with accessible navigation and resource links", async ({page}) => {
    await page.goto("/guide", {waitUntil: "domcontentloaded"});

    await expect(page.getByRole("main")).toBeVisible();
    await expect(
        page.getByRole("heading", {level: 1, name: "SaaS Analytics Dashboard User Guide"}),
    ).toBeVisible();
    await expect(page.getByRole("navigation", {name: "User guide sections"})).toBeVisible();
    await expect(page.getByRole("heading", {level: 2, name: "Delivery"})).toBeVisible();
    await expect(page.getByRole("heading", {level: 2, name: "Settings"})).toBeVisible();
    await expect(page.getByRole("link", {name: /Developer reference/})).toHaveAttribute("href", /\/reference\/$/);
    await expect(page.getByRole("link", {name: /Coverage report/})).toHaveAttribute("href", /\/coverage\/$/);
  });

  test("section navigation and the dashboard return link work", async ({page}) => {
    await page.goto("/guide", {waitUntil: "domcontentloaded"});

    await page.getByRole("navigation", {name: "User guide sections"}).getByRole("link", {name: "Delivery"}).click();
    await expect(page).toHaveURL(/\/guide\/?#delivery$/);
    await expect(page.locator("#delivery")).toBeInViewport();

    await page.getByRole("link", {name: "Open dashboard"}).click();
    await expect(page.getByRole("heading", {level: 1, name: "SaaS Analytics Dashboard"})).toBeVisible();
  });

  test("mobile guide remains readable without document overflow", async ({page}, testInfo) => {
    test.skip(!isMobileProject(testInfo), "Guide overflow is covered by the mobile project.");

    await page.goto("/guide", {waitUntil: "domcontentloaded"});

    await expect(page.getByRole("heading", {level: 1, name: "SaaS Analytics Dashboard User Guide"})).toBeVisible();
    await expect(page.getByRole("navigation", {name: "User guide sections"})).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
