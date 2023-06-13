import { test, expect, type Page } from "@playwright/test";

export const navigateToAbout = async (page: Page): Promise<void> => {
  if (await page.getByRole("button", { name: "navigation menu" }).isVisible()) {
    await page.getByRole("button", { name: "navigation menu" }).click();
  }
  await page.getByRole("link", { name: "About" }).click();
};

// test.beforeEach(async ({ page }) => {
//   await page.goto("/");
//   await navigateToAbout(page);
// });

// test("about page", async ({ page }) => {
export const assertAboutPage = async (page: Page) => {
  await navigateToAbout(page);

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

  // TMDB info
  await expect(
    page.getByRole("heading", { name: "Powered by TMDB" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Cinemus relies on The Movie Database (TMDB), a comprehensive and community-driven source for TV show and movie information, to provide the data used in our app. TMDB's extensive database, which is constantly updated by a large community of contributors, allows us to deliver a seamless and user-friendly experience to our app users. We are grateful for the valuable contribution of TMDB and its community, which enables us to offer a robust and reliable service to our Cinemus users."
    )
  ).toBeVisible();
  await expect(
    page.getByText(
      "Please note that Cinemus is not affiliated with or endorsed by TMDB. We utilize their publicly available data in compliance with their API terms of use. For more information about TMDB, including their data usage policies and terms of service, please visit their official website at https://www.themoviedb.org."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "https://www.themoviedb.org" })
  ).toBeVisible();
};
