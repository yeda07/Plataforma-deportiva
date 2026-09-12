import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port.toString()}`;

export default defineConfig({
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] }
    }
  ],
  reporter: [["list"]],
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "retain-on-failure"
  },
  webServer: {
    command: `pnpm exec next start --hostname 127.0.0.1 --port ${port.toString()}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL
  }
});
