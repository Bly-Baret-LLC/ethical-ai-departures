import { defineConfig, devices } from "@playwright/test"

// Local, read-only QA after the scoped Kim migration. Never targets production.
export default defineConfig({
  testDir: ".",
  testMatch: "devin-kim.spec.ts",
  workers: 1,
  reporter: "line",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3700",
    trace: "retain-on-failure",
  },
})
