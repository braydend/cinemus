import { test, type Page } from "@playwright/test";

test.afterEach(async ({ page }) => {
  const deleteButtons = await page
    .getByRole("button", { name: "Delete" })
    .all();

  for (const deleteButton of deleteButtons) {
    await deleteButton.click();
  }
});

const login = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("test@email.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: "Continue" }).click();
};

test("successfully adds TV show to list", async ({ page }) => {
  await login(page);
  await page.getByLabel("Search").click();
  await page.getByLabel("Search").fill("always sunny");
  await page
    .getByRole("option", {
      name: "It's Always Sunny in Philadelphia poster It's Always Sunny in Philadelphia",
    })
    .click();
});

test("successfully adds movie to list", async ({ page }) => {
  await login(page);
  await page.getByRole("checkbox").check();
  await page.getByLabel("Search").click();
  await page.getByRole("combobox", { name: "Search" }).fill("the matrix");
  await page
    .getByRole("option", { name: "The Matrix poster The Matrix" })
    .click();
});

test("successfully marks media as watched", async ({ page }) => {
  await login(page);
  await page.getByLabel("Search").click();
  await page.getByLabel("Search").fill("brooklyn");
  await page
    .getByRole("option", {
      name: "Brooklyn Nine-Nine poster Brooklyn Nine-Nine",
    })
    .click();
  await page.getByRole("button", { name: "Mark as watched" }).click();
  await page.getByRole("button", { name: "Unmark as watched" }).click();
});
