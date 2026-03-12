import { test } from "@playwright/test"
import { checkAccessibility } from "../utils/setup"

test.describe("Accessibility", () => {
  test("homepage has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/")
    await checkAccessibility(page)
  })
})
