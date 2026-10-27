import { defineConfig, devices } from "@playwright/test";

const port = 4321;

export default defineConfig({
  testDir: "e2e",
  // Own suffix so Vitest's default *.test/*.spec glob never picks these up.
  testMatch: "*.e2e.ts",
  forbidOnly: !!process.env["CI"],
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // CI uses the runner's preinstalled Chrome: installing Playwright's Chromium needs apt,
    // whose mirror has stalled the job for minutes.
    ...(process.env["CI"] && { channel: "chrome" }),
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  // Tests the production build (pnpm build first), not the dev server.
  webServer: {
    command: `pnpm preview --port ${port}`,
    port,
    reuseExistingServer: !process.env["CI"],
  },
});
