import { test, expect, type Page } from "@playwright/test";

const navigateToAbout = async (page: Page): Promise<void> => {
  if (await page.getByRole("button", { name: "navigation menu" }).isVisible()) {
    await page.getByRole("button", { name: "navigation menu" }).click();
  }
  await page.getByRole("link", { name: "About" }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await navigateToAbout(page);
});

test("about page", async ({ page }) => {
  // Features
  await expect(page.getByRole("heading", { name: "Features" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Create personalised lists" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Easily create customized lists of TV shows and movies that you want to watch. You can categorize your lists based on genres, streaming services, or any other criteria that suits your preferences."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Track your progress" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Keep track of the TV shows and movies you've watched by marking them as watched or not watched. Cinemus remembers your progress, so you can easily see what you've already seen."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Discover Streaming Availability" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Find out which streaming services in your region have the TV shows and movies on your watchlist available. Cinemus provides information on streaming availability, so you can easily find where to watch your favorite shows and movies."
    )
  ).toBeVisible();

  // Inspiration
  await expect(
    page.getByRole("heading", { name: "Inspiration" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "At Cinemus, we understand the struggle of constantly being told about new TV shows and movies to watch by friends and family, only to forget them later. We've been there too! That's why we created Cinemus to solve this common problem. Our team is passionate about movies and TV shows, and we know how important it is to keep track of the ones you want to watch. Cinemus was born out of our love for entertainment and our desire to create a web app that makes managing your watchlist simple, fun, and convenient."
    )
  ).toBeVisible();
});
