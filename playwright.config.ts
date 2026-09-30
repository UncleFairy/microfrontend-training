import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run dev --workspace=trade-panel-a",
      url: "http://127.0.0.1:3001/remoteEntry.js",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev --workspace=trade-panel-b",
      url: "http://127.0.0.1:3002/remoteEntry.js",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev --workspace=shell",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
