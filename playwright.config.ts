import {defineConfig} from "@playwright/test";

const isCI = Boolean(process.env.CI);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? "http://localhost:3000";
const webServerCommand = process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? "npm run build && npm run start";
const inheritedEnv = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);

export default defineConfig({
  expect: {
    timeout: 7_000,
  },
  forbidOnly: isCI,
  outputDir: "test-results/playwright",
  projects: [
    {
      name: "Desktop Chromium",
      use: {
        browserName: "chromium",
        viewport: {height: 900, width: 1366},
      },
    },
    {
      name: "Mobile Chromium",
      use: {
        browserName: "chromium",
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
        viewport: {height: 844, width: 390},
      },
    },
  ],
  reporter: isCI ? [["list"], ["html", {open: "never"}]] : [["list"]],
  retries: isCI ? 2 : 0,
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    actionTimeout: 10_000,
    baseURL,
    navigationTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: externalBaseURL
      ? undefined
      : {
        command: webServerCommand,
        env: {
          ...inheritedEnv,
          NEXT_PUBLIC_DATA_MODE: "static",
          NEXT_TELEMETRY_DISABLED: "1",
        },
        reuseExistingServer: !isCI,
        timeout: 300_000,
        url: baseURL,
      },
  workers: 1,
});
