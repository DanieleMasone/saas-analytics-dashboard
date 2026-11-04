import {expect, test, type Page, type TestInfo} from "@playwright/test";

test("revenue chart labels have readable contrast in both themes", async ({page}) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({colorScheme});
    await page.goto("/revenue");
    const labels = page.locator(".recharts-cartesian-axis-tick-value, .recharts-legend-item-text > span");
    await expect(labels.first()).toBeVisible();
    expect(await labels.count()).toBeGreaterThan(5);
    const ratios = await labels.evaluateAll((elements) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const luminance = (color: string) => {
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const channels = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3)
            .map((value) => value / 255)
            .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      return elements.map((element) => {
        const style = getComputedStyle(element);
        const foreground = luminance(element instanceof SVGElement ? style.fill : style.color);
        const background = luminance(getComputedStyle(element.closest("section")!).backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      });
    });
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
});

test("tablet delivery gives the trend enough room before the manager readout", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "Desktop Chromium", "Tablet layout uses the desktop browser profile.");
  await page.setViewportSize({width: 1024, height: 900});
  await page.goto("/delivery");
  const table = page.getByRole("table", {name: /Jira weekly delivery trend/});
  await expect(table).toBeVisible();
  const trend = await table.locator("..").boundingBox();
  const readout = await page.getByRole("heading", {name: "Manager readout", exact: true}).boundingBox();
  expect(trend).not.toBeNull();
  expect(readout).not.toBeNull();
  expect(trend!.width).toBeGreaterThan(500);
  expect(readout!.y).toBeGreaterThan(trend!.y + trend!.height);
});

type RouteSpec = {
  content: RegExp[];
  heading: string;
  navName: string;
  path: string;
};

const routeSpecs: RouteSpec[] = [
  {
    content: [/Revenue composition/i, /Operating pulse/i],
    heading: "SaaS Analytics Dashboard",
    navName: "Overview",
    path: "/",
  },
  {
    content: [/Revenue composition/i, /Operating pulse/i],
    heading: "SaaS Analytics Dashboard",
    navName: "Overview",
    path: "/dashboard",
  },
  {
    content: [/Revenue history/i, /Expansion motion/i],
    heading: "Revenue",
    navName: "Revenue",
    path: "/revenue",
  },
  {
    content: [/Customer accounts/i, /Total customers/i],
    heading: "Customers",
    navName: "Customers",
    path: "/customers",
  },
  {
    content: [/Jira delivery signals/i, /Jira risk queue/i],
    heading: "Delivery",
    navName: "Delivery",
    path: "/delivery",
  },
  {
    content: [/Health distribution/i, /Risk queue/i],
    heading: "Health",
    navName: "Health",
    path: "/health",
  },
  {
    content: [/Alert subscriptions/i, /Operating guardrails/i],
    heading: "Settings",
    navName: "Settings",
    path: "/settings",
  },
];

const navigationSpecs = routeSpecs.filter((route) => route.path !== "/dashboard");
const mobileOverflowRoutes = ["/", "/customers", "/delivery", "/revenue", "/settings"];
const errorPagePattern = /Application error|Dashboard unavailable|This page could not be found|Unhandled Runtime Error/i;

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === "Mobile Chromium";
}

async function expectNoErrorPage(page: Page) {
  await expect(page.getByText(errorPagePattern)).toHaveCount(0);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const pageWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);

    return pageWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(2);
}

async function expectRouteLoaded(page: Page, route: RouteSpec) {
  await page.goto(route.path, {waitUntil: "domcontentloaded"});

  const main = page.getByRole("main");
  await expect(main).toBeVisible();
  await expect(page.getByRole("heading", {level: 1, name: route.heading})).toBeVisible();

  for (const content of route.content) {
    await expect(main.getByText(content).first()).toBeVisible();
  }

  await expectNoErrorPage(page);
}

async function openMobileNavigationIfPresent(page: Page) {
  const mobileNavigation = page.getByRole("navigation", {name: "Mobile dashboard navigation"});
  const menuButton = page.getByRole("button", {name: "Menu"});

  if (await mobileNavigation.isVisible()) return;

  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(mobileNavigation).toBeVisible();
  }
}

async function getCurrentNavigation(page: Page) {
  const mobileNavigation = page.getByRole("navigation", {name: "Mobile dashboard navigation"});

  if (await mobileNavigation.isVisible()) return mobileNavigation;

  return page.getByRole("navigation", {name: "Dashboard navigation"});
}

test.describe("public product routes", () => {
  for (const route of routeSpecs) {
    test(`${route.path} renders its primary workspace`, async ({page}) => {
      await expectRouteLoaded(page, route);
    });
  }

  test("workspace navigation reaches each documented route", async ({page}) => {
    test.setTimeout(60_000);

    await page.goto("/dashboard", {waitUntil: "networkidle"});

    for (const route of navigationSpecs) {
      await openMobileNavigationIfPresent(page);
      await (await getCurrentNavigation(page)).getByRole("link", {exact: true, name: route.navName}).click();
      await expect(page.getByRole("heading", {level: 1, name: route.heading})).toBeVisible();

      for (const content of route.content) {
        await expect(page.getByRole("main").getByText(content).first()).toBeVisible();
      }

      await expectNoErrorPage(page);
    }
  });
});

test.describe("responsive and accessibility smoke checks", () => {
  test("header controls expose useful accessible names", async ({page}) => {
    await page.goto("/", {waitUntil: "domcontentloaded"});

    await expect(page.getByRole("button", {name: "Notifications"})).toBeVisible();
    await expect(page.getByRole("button", {name: /Use (dark|light) theme/i})).toBeVisible();
    await expect(page.getByRole("button", {name: "Refresh"})).toBeVisible();
  });

  test("keyboard access reaches the skip link, desktop navigation, and theme switch", async ({page}, testInfo) => {
    test.skip(isMobileProject(testInfo), "Desktop sidebar focus order is covered by the desktop project.");

    await page.goto("/", {waitUntil: "domcontentloaded"});

    const skipLink = page.getByRole("link", {name: "Skip to dashboard content"});
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();

    await page.goto("/", {waitUntil: "domcontentloaded"});

    const overviewLink = page.getByRole("link", {name: "Overview"});

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Tab");
      if (await overviewLink.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(overviewLink).toBeFocused();

    const themeSwitch = page.getByRole("button", {name: /Use (dark|light) theme/i});

    for (let index = 0; index < 12; index += 1) {
      if (await themeSwitch.evaluate((element) => element === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }

    await expect(themeSwitch).toBeFocused();
  });

  test("mobile dashboard keeps navigation reachable and primary content visible", async ({page}, testInfo) => {
    test.skip(!isMobileProject(testInfo), "Mobile navigation is covered by the mobile project.");

    await page.goto("/", {waitUntil: "domcontentloaded"});

    const menuButton = page.getByRole("button", {name: "Menu"});
    await expect(menuButton).toBeVisible();
    await expect(page.getByRole("heading", {level: 1, name: "SaaS Analytics Dashboard"})).toBeVisible();

    await menuButton.click();
    await expect(page.getByRole("navigation", {name: "Mobile dashboard navigation"})).toBeVisible();
    await expect(
        page
            .getByRole("navigation", {name: "Mobile dashboard navigation"})
            .getByRole("link", {exact: true, name: "Delivery"}),
    ).toBeVisible();
    await expect(
        page
            .getByRole("navigation", {name: "Mobile dashboard navigation"})
            .getByRole("link", {exact: true, name: "User guide"}),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("mobile key routes avoid document-level horizontal overflow", async ({page}, testInfo) => {
    test.skip(!isMobileProject(testInfo), "Document overflow is covered by the mobile project.");
    test.setTimeout(60_000);

    for (const path of mobileOverflowRoutes) {
      const route = routeSpecs.find((item) => item.path === path);
      if (!route) continue;

      await expectRouteLoaded(page, route);
      await expectNoHorizontalOverflow(page);
    }
  });

  test("mobile delivery exposes Jira trend cards without layout overflow", async ({page}, testInfo) => {
    test.skip(!isMobileProject(testInfo), "Delivery mobile layout is covered by the mobile project.");

    await page.goto("/delivery", {waitUntil: "domcontentloaded"});

    await expect(page.getByRole("heading", {level: 1, name: "Delivery"})).toBeVisible();
    await expect(page.getByRole("list", {name: "Jira weekly delivery trend"})).toBeVisible();
    await expect(page.getByRole("list", {name: "Jira risk queue"})).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("tablet customer controls avoid document-level overflow", async ({page}, testInfo) => {
    test.skip(isMobileProject(testInfo), "The tablet breakpoint is covered by the desktop project.");
    await page.setViewportSize({height: 900, width: 1024});

    await page.goto("/customers", {waitUntil: "domcontentloaded"});
    await expect(page.getByRole("heading", {level: 1, name: "Customers"})).toBeVisible();
    await expect(page.getByRole("textbox", {name: "Search customers"})).toBeVisible();
    await expectNoErrorPage(page);
    await expectNoHorizontalOverflow(page);
  });
});
