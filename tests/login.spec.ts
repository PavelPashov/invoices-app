import { test, expect } from "@playwright/test";

test("Login", async ({ page }) => {
  await page.goto("http://localhost:3001/login");

  await expect(page).toHaveTitle(/Фактури/);

  await page.locator("[type='email']").type("");
  await page.locator("[type='password']").type("");

  await page.locator("button[type='submit']").click();

  const toast = page.locator("[role='alert']");
  await expect(toast).toHaveText("Успешно влизане");
});
