import { defineConfig, devices } from "@playwright/test"

// Data-release checks against the actual production-style local preview.
// Apply only the scoped local SQL first; build/start the preview if necessary.
// TEST_OPENAI_DISMISSALS=1 npx playwright test -c tests/e2e/openai-dismissals.config.ts
// Add DISMISSAL_LIVE_CHECK=1 for read-only post-publication verification.
const live = process.env.DISMISSAL_LIVE_CHECK === "1"
export default defineConfig({
  testDir: ".",
  testMatch: "openai-dismissals.spec.ts",
  fullyParallel: true,
  workers: 2,
  reporter: "line",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: live ? "https://ethicalaidepartures.fyi" : "http://localhost:3700",
    trace: "retain-on-failure",
  },
  webServer: live ? undefined : {
    command: "npm run start -- --port 3700 --hostname 127.0.0.1",
    url: "http://localhost:3700",
    reuseExistingServer: true,
  },
})
