import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads and displays the ticker block", async ({ page }) => {
    await page.goto("/")

    // Ticker section is present
    const ticker = page.getByRole("region", { name: "Departure ticker" })
    await expect(ticker).toBeVisible()

    // Ticker headline (h1) is present
    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toContainText("over ethical concerns")
  })

  test("has correct page title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Ethical AI Departures/)
  })

  test("has lang attribute set to en", async ({ page }) => {
    await page.goto("/")
    const lang = await page.locator("html").getAttribute("lang")
    expect(lang).toBe("en")
  })

  test("renders all major homepage sections", async ({ page }) => {
    await page.goto("/")

    // Main content landmark with skip link target
    const main = page.locator("main#main-content")
    await expect(main).toBeVisible()

    // Skip links navigation
    const skipNav = page.getByRole("navigation", { name: "Skip links" })
    await expect(skipNav).toBeAttached()

    // Profiles section with skip link target (#profiles)
    const profiles = page.locator("section#profiles")
    await expect(profiles).toBeVisible()

    // Profile browser search input is present within the profiles section
    const search = profiles.getByPlaceholder(/Search profiles/i)
    await expect(search).toBeVisible()
  })

  test("skip links navigate to correct targets", async ({ page }) => {
    await page.goto("/")

    // Tab to first skip link
    await page.keyboard.press("Tab")
    const skipToMain = page.getByText("Skip to main content")
    await expect(skipToMain).toBeVisible()

    // Tab to second skip link
    await page.keyboard.press("Tab")
    const skipToProfiles = page.getByText("Skip to profiles")
    await expect(skipToProfiles).toBeVisible()
  })
})
