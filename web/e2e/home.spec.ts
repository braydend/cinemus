import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home page", async ({ page }) => {
  // Features
  await expect(
    page.getByRole("main").getByRole("img", { name: "Cinemus" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Showtime Simplified" })
  ).toBeVisible();
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
});
