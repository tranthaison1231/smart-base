import { expect, test } from "@playwright/test"

test("home route shows the starter heading and main landmark", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Smart Base", level: 1 })).toBeVisible()
  await expect(page.getByRole("main")).toBeVisible()
})

test("a missing page provides a link back home", async ({ page }) => {
  await page.goto("/page-that-does-not-exist")

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
  await page.getByRole("link", { name: "Back to home" }).click()
  await expect(page.getByRole("heading", { name: "Smart Base" })).toBeVisible()
})
