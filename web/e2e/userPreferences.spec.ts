import { test, expect, type Page } from "@playwright/test";

const login = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("test@email.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "test@email.com" }).waitFor();
};

const navigateToUserPreferences = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "test@email.com" }).click();
  await page.getByRole("link", { name: "Preferences" }).click();
};

const resetRegion = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Australia" }).click();
  await page.getByRole("option", { name: "Please select" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await login(page);
  await navigateToUserPreferences(page);
});

test.afterEach(async ({ page }) => {
  await resetRegion(page);
});

test("User preferences page", async ({ page }) => {
  // Region selection
  await page.getByRole("button", { name: "Region ​" }).click();
  await page.getByRole("option", { name: "Australia" }).click();
  await page.getByRole("button", { name: "Reset Changes" }).click();
  await page.getByRole("button", { name: "Region ​" }).click();
  await page.getByRole("option", { name: "Australia" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(
    page.getByText("Preferences updated successfully")
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Australia" })).toBeVisible();
});
