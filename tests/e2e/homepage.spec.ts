import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads and displays the ticker block", async ({ page }) => {
    await page.goto("/")

    // Ticker block is present with dark inverse background
    const ticker = page.locator("main > div").first()
    await expect(ticker).toBeVisible()

    // Page heading is present
    const heading = page.getByRole("heading", { level: 2 })
    await expect(heading).toContainText("Ethical AI Departures")
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

    // Profiles section with skip link target
    const profiles = page.locator("section#profiles")
    await expect(profiles).toBeVisible()

    // Departures heading in profiles section
    const departuresHeading = page.getByRole("heading", {
      name: "Departures",
    })
    await expect(departuresHeading).toBeVisible()
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
