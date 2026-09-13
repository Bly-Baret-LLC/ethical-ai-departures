import { test, expect } from "@playwright/test"

test.describe("Editorial release", () => {
  test("separates evidence-linked records from unresolved allegations", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page.getByText("NaN", { exact: true })).toHaveCount(0)
    const ticker = page.getByRole("region", { name: "Departure ticker" })
    const headlineCount = await ticker.locator("[aria-live='polite']").textContent()
    await expect(ticker.getByText(/evidence-linked departures/)).toContainText(
      `${headlineCount} evidence-linked departures`
    )
    await expect(
      page.getByRole("button", { name: /^Evidence-linked \(/ })
    ).toHaveAttribute("aria-pressed", "true")

    await page
      .getByRole("button", { name: /^Unresolved allegations \(/ })
      .click()

    await expect(page).toHaveURL(/evidence=alleged/)
    await expect(page.getByText(/unresolved-allegation records?/)).toBeVisible()
  })

  test("publishes the criteria-change disclosure", async ({ page }) => {
    await page.goto("/corrections")

    await expect(
      page.getByText(
        /from 69 published person records to 39 evidence-linked departures/
      )
    ).toBeVisible()
    await expect(page.getByText(/current count to 40/)).toBeVisible()
  })

  test("renders organizational events as a separate sourced record", async ({
    page,
  }) => {
    await page.goto("/organizational-events")

    await expect(
      page.getByRole("heading", { name: "Superalignment team dissolved" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", {
        name: "Responsible Innovation team disbanded",
      })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", {
        name: "ML Ethics, Transparency and Accountability team eliminated",
      })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Meta disbands Responsible Innovation team/ })
    ).toHaveAttribute(
      "href",
      "https://www.theregister.com/2022/09/09/meta_disbands_responsible_innovation_team/"
    )
  })

  test("renders Schwarz as an explicitly stated departure", async ({ page }) => {
    await page.goto("/profiles/jonathan-richard-schwarz")

    await expect(
      page.getByRole("heading", { name: "Jonathan Richard Schwarz" })
    ).toBeVisible()
    await expect(page.getByText("Explicitly stated", { exact: true })).toBeVisible()
    await expect(page.getByText(/exact departure date is not publicly documented/)).toBeVisible()
    await expect(
      page.getByRole("link", {
        name: "Computer Science Colloquium: Jonathan Richard Schwarz",
      })
    ).toHaveCount(0)
  })

  test("keeps departure tips open to partial information", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Submit a Departure Tip" }).click()

    const dialog = page.getByRole("dialog", { name: "Submit a departure tip" })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel(/Name/)).not.toHaveAttribute("required")
    await expect(dialog.getByLabel(/Source Link/)).not.toHaveAttribute("required")
    await expect(dialog.getByLabel(/Source Link/)).toHaveAttribute(
      "inputmode",
      "url"
    )
  })
})
