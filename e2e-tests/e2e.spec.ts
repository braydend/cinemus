import { test, expect, type Page } from "@playwright/test";
import { assertHomePage } from "./home";
import { assertAboutPage } from "./about";
import { assertList, login } from "./list";
import {
  assertWatchProviders,
  navigateToList,
  navigateToUserPreferences,
  resetRegion,
} from "./watchProvider";

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

test("entire user journey", async ({ page }) => {
  await assertHomePage(page);
  await assertAboutPage(page);
  await login(page);
  await assertList(page);
  await assertWatchProviders(page);
});
