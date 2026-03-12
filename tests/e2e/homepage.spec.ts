import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads and displays the ticker block", async ({ page }) => {
    await page.goto("/")

    // Ticker block is present with dark inverse background
    const ticker = page.locator("main > div").first()
    await expect(ticker).toBeVisible()

    // Page heading is present
    const heading = page.getByRole("heading", { level: 2 })
    await expect(heading).toContainText("The Warning Collective")
  })

  test("has correct page title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/The Warning Collective/)
  })

  test("has lang attribute set to en", async ({ page }) => {
    await page.goto("/")
    const lang = await page.locator("html").getAttribute("lang")
    expect(lang).toBe("en")
  })
})
