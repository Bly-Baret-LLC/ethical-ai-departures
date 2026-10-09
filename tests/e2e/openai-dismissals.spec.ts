import { test, expect } from "@playwright/test"

// Opt in against a database with this local, not-yet-published release applied.
test.skip(process.env.TEST_OPENAI_DISMISSALS !== "1", "Requires the dismissal-record preview migration")

const people = [
  ["tomek-korbak", "Tomek Korbak"],
  ["jasmine-wang", "Jasmine Wang"],
  ["mikita-balesni", "Mikita Balesni"],
] as const
const individualStatements = {
  "tomek-korbak": "https://x.com/tomekkorbak/status/2108266859397283953",
  "jasmine-wang": "https://x.com/j_asminewang/status/2108263312291180680",
  "mikita-balesni": "https://x.com/balesni/status/2108262814003687745",
}
const letter = "https://mikitabalesni.com/letter/letter.pdf"
const paper = "https://arxiv.org/abs/2507.11473"

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const request = route.request()
    const origin = new URL(request.url()).origin
    if (origin !== new URL(baseURL!).origin || !["GET", "HEAD"].includes(request.method())) {
      return route.abort()
    }
    return route.continue()
  })
})

for (const [slug, name] of people) {
  test(`${name}: complete, attributed profile on desktop and mobile`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/profiles/${slug}`)
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
      await expect(page.getByText("Fired", { exact: true })).toBeVisible()
      await expect(page.getByText("Alleged retaliation", { exact: true })).toBeVisible()
      await expect(page.getByText("Claim status: contested")).toBeVisible()
      await expect(page.getByText(/exact departure dates are not confirmed/)).toBeVisible()
      await expect(page.getByText(/OpenAI denies retaliation/)).toBeVisible()
      await expect(page.locator("#sources li")).toHaveCount(4)
      await expect(page.locator(`#sources a[href='${letter}']`)).toHaveCount(1)
      await expect(page.locator(`#sources a[href='${individualStatements[slug]}']`)).toHaveCount(1)
      const writings = page.locator("section").filter({ has: page.getByRole("heading", { name: "Key Publications" }) })
      await expect(writings.locator("li")).toHaveCount(2)
      await expect(writings.locator(`a[href='${paper}']`)).toHaveCount(1)
      await expect(writings.getByText("essay", { exact: true })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Forecasts & Warnings" })).toHaveCount(0)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/profiles/${slug}$`))
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /disputes.*dismissal/)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
    expect(errors).toEqual([])
  })
}

test("headline stays unchanged and all three appear only in disputed directory", async ({ page }) => {
  await page.goto("/")
  const ticker = page.getByRole("region", { name: "Departure ticker" })
  await expect(ticker.locator("[aria-live='polite']")).toHaveText("46")
  await expect(ticker).toContainText("6 disputed cases are listed separately.")
  for (const [slug] of people) {
    await expect(page.locator(`a[href='/profiles/${slug}']`)).toHaveCount(0)
  }
  await page.getByRole("button", { name: "Unresolved allegations (6)" }).click()
  for (const [slug] of people) {
    await expect(page.locator(`a[href='/profiles/${slug}']`)).toBeVisible()
  }
})

test("OpenAI company page separates the cases and shared writings link back to each author", async ({ page }) => {
  // Assert rendered content independently of remaining subresource requests.
  await page.goto("/companies/openai", { waitUntil: "domcontentloaded" })
  const allegations = page.locator("section").filter({ has: page.getByRole("heading", { name: "Unresolved Allegations", exact: true }) })
  const departures = page.locator("section").filter({ has: page.getByRole("heading", { name: "Evidence-Linked Departures", exact: true }) })
  for (const [slug] of people) {
    await expect(allegations.locator(`a[href='/profiles/${slug}']`)).toHaveCount(1)
    await expect(departures.locator(`a[href='/profiles/${slug}']`)).toHaveCount(0)
  }
  await page.goto("/publications")
  for (const [slug] of people) {
    await expect(page.locator(`a[href='/profiles/${slug}']`)).toHaveCount(2)
  }
})

test("sitemap includes each new public preview record once", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.ok()).toBe(true)
  const sitemap = await response.text()
  for (const [slug] of people) {
    expect(sitemap.match(new RegExp(`/profiles/${slug}<`, "g"))).toHaveLength(1)
  }
})
