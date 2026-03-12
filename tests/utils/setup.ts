import AxeBuilder from "@axe-core/playwright"
import { type Page, expect } from "@playwright/test"

export async function checkAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()
  expect(results.violations).toEqual([])
}
