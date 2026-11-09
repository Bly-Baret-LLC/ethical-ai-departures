import { test, expect } from "@playwright/test"

test.skip(process.env.TEST_DEVIN_KIM !== "1", "Requires Kim's local testimony update")

const profile = "/profiles/devin-kim"
const sources = [
  "https://sanfordheisler.com/wp-content/uploads/2026/06/2026-06-09-Complaint-Kim-v.-xAI-and-SpaceX.pdf",
  "https://council.nyc.gov/press/2026/10/16/3301/",
  "https://www.amny.com/politics/menin-spacexai-grok-sexualized-image/",
]

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const request = route.request()
    return new URL(request.url()).origin === new URL(baseURL!).origin && ["GET", "HEAD"].includes(request.method())
      ? route.continue()
      : route.abort()
  })
})

test("profile preserves attribution, sources, correction and layout", async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(profile)
    const main = page.locator("main")
    await expect(main.getByRole("heading", { name: "Devin Kim", exact: true })).toBeVisible()
    await expect(main.getByText("Alleged retaliation", { exact: true })).toBeVisible()
    await expect(main.getByText("Claim status: contested")).toBeVisible()
    await expect(main).toContainText("Kim alleges xAI fired him")
    await expect(main).toContainText("September 15, 2025 (paragraph 66)")
    await expect(main).toContainText("Kim said most of the safety team resigned")
    await expect(main).toContainText("she was unfamiliar with his case")
    await expect(main).toContainText("His retaliation claim remains unresolved")
    await expect(main.locator('time[dateTime="2026-11-08"]')).toHaveCount(1)
    await expect(main.locator("#sources li")).toHaveCount(6)
    for (const source of sources) await expect(main.locator(`#sources a[href='${source}']`)).toHaveCount(1)
    await expect(main.getByRole("heading", { name: "Key Publications" })).toHaveCount(0)
    // This preview deliberately configures NEXT_PUBLIC_SITE_URL to localhost.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `http://localhost:3700${profile}`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Kim alleges xAI fired him/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`kim-${width}.png`), fullPage: true })
  }
  expect(errors).toEqual([])
})

test("directory, filters and exports retain unresolved membership and corrected date", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("region", { name: "Departure ticker" }).locator("[aria-live='polite']")).toHaveText("51")
  await expect(page.getByRole("button", { name: "Evidence-linked (51)", exact: true })).toBeVisible()
  await expect(page.locator(`a[href='${profile}']`)).toHaveCount(0)
  await page.getByRole("button", { name: "Unresolved allegations (6)", exact: true }).click()
  await expect(page.locator(`a[href='${profile}']`)).toHaveCount(1)
  await page.getByRole("searchbox", { name: "Search profiles" }).fill("Devin Kim")
  await expect(page.getByText("Showing 1 of 6 records in this category", { exact: true })).toBeVisible()
  for (const format of ["JSON", "CSV"]) {
    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: `Export ${format}`, exact: true }).click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
    const content = Buffer.concat(chunks).toString("utf8")
    expect(content).toContain("2025-09-15")
    expect(content).toContain("paragraph 66")
    if (format === "JSON") {
      const records = JSON.parse(content)
      expect(records).toHaveLength(1)
      expect(records[0]).toMatchObject({ name: "Devin Kim", motiveEvidence: "alleged", headlineCounted: false, claimStatus: "contested", departureDatePrecision: "day" })
    }
  }
  await page.goto("/?evidence=alleged&year=2025&company=xai&concern=whistleblower-retaliation")
  await expect(page.locator(`a[href='${profile}']`)).toHaveCount(1)
})

test("company overview, concerns, publications and corrections remain consistent", async ({ page }, testInfo) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/companies/xai")
    const main = page.locator("main")
    await expect(main.getByRole("heading", { name: "xAI", exact: true })).toBeVisible()
    await expect(main).toContainText("0 evidence-linked departures")
    await expect(main).toContainText("1 unresolved")
    await expect(main).toContainText("Kim alleges xAI fired him")
    await expect(main).toContainText("she was unfamiliar with his case")
    await expect(main.locator(`a[href='${profile}']`)).toHaveCount(1)
    const context = main.getByRole("region", { name: "Safety-team departures" })
    await expect(context).toContainText("did not give reasons")
    await expect(context).toContainText("December 2025")
    await expect(context).toContainText("safety staff remained")
    await expect(context.getByRole("link", { name: /CNN/ })).toHaveAttribute("href", "https://www.wral.com/archive/22297674")
    await expect(context.getByRole("link", { name: /Business Insider/ })).toHaveAttribute("href", "https://www.aol.com/articles/war-rooms-group-chats-video-100801506.html")
    await expect(main.getByRole("heading", { name: "Organizational Events" })).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`xai-${width}.png`), fullPage: true })
  }
  // This tag has no authored guide: its profile link uses the directory fallback.
  await page.goto("/?concern=whistleblower-retaliation&evidence=alleged")
  await expect(page.locator(`main a[href='${profile}']`)).toHaveCount(1)
  await page.goto("/concerns/safety-deprioritization#allegations")
  await expect(page.locator(`main a[href='${profile}']`)).toHaveCount(1)
  await page.goto("/publications")
  await expect(page.locator(`main a[href='${profile}']`)).toHaveCount(0)
  await page.goto("/corrections")
  await expect(page.getByText(/^Corrected Devin Kim’s stored departure date/)).toBeVisible()
})

test("sitemap retains the existing profile once", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.ok()).toBe(true)
  expect((await response.text()).match(/\/profiles\/devin-kim</g)).toHaveLength(1)
})

test("company listing, count widget and social preview use consistent data", async ({ page, baseURL }, testInfo) => {
  await page.goto("/companies")
  const company = page.locator("a[href='/companies/xai']")
  await expect(company).toContainText("0 evidence-linked")
  await expect(company).toContainText("1 unresolved")
  await page.goto("/widgets/ticker")
  await expect(page.getByText("51", { exact: true })).toBeVisible()
  await page.goto(profile)
  const socialImage = new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!)
  expect(socialImage.searchParams.get("name")).toBe("Devin Kim")
  expect(socialImage.searchParams.get("summary")).toMatch(/^Kim alleges/)
  expect(socialImage.searchParams.has("quote")).toBe(false)
  // Load only the local image route even when metadata uses another host alias.
  const response = await page.goto(`${baseURL}${socialImage.pathname}${socialImage.search}`)
  expect(response?.headers()["content-type"]).toMatch(/^image\/png/)
  await expect(page.locator("img")).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath("kim-social-preview.png") })
})
