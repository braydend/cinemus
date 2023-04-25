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

const navigateToList = async (page: Page): Promise<void> => {
  if (await page.getByRole("button", { name: "navigation menu" }).isVisible()) {
    await page.getByRole("button", { name: "navigation menu" }).click();
  }
  await page.getByRole("link", { name: "List" }).click();
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
});

test.afterEach(async ({ page }) => {
  await navigateToList(page);
  const deleteButtons = await page
    .getByRole("button", { name: "Delete" })
    .all();

  for (const deleteButton of deleteButtons) {
    await deleteButton.click();
  }

  await navigateToUserPreferences(page);
  await resetRegion(page);
});

test("Watch providers", async ({ page }) => {
  // Set up watchlist
  await navigateToList(page);
  await page.getByLabel("Search").click();
  await page.getByLabel("Search").fill("always sunny");
  await page
    .getByRole("option", {
      name: "It's Always Sunny in Philadelphia poster It's Always Sunny in Philadelphia",
    })
    .click();
  await expect(
    page.getByRole("img", { name: "Disney Plus", exact: true })
  ).not.toBeVisible();

  // Region selection
  await navigateToUserPreferences(page);
  await page.getByRole("button", { name: "Region ​" }).click();
  await page.getByRole("option", { name: "Australia" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();

  // Watchlist
  await navigateToList(page);
  await expect(
    page.getByRole("img", { name: "Disney Plus", exact: true })
  ).toBeVisible();
});
