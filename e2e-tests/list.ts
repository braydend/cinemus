import { test, type Page } from "@playwright/test";

// test.beforeEach(async ({ page }) => {
//   await page.goto("/");
//   await login(page);
//   await navigateToList(page);
// });

// test.afterEach(async ({ page }) => {
//   const deleteButtons = await page
//     .getByRole("button", { name: "Delete" })
//     .all();

//   for (const deleteButton of deleteButtons) {
//     await deleteButton.click();
//   }
// });

export const navigateToList = async (page: Page): Promise<void> => {
  if (await page.getByRole("button", { name: "navigation menu" }).isVisible()) {
    await page.getByRole("button", { name: "navigation menu" }).click();
  }
  await page.getByRole("link", { name: "List" }).click();
};

export const login = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("test@email.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "test@email.com" }).waitFor();
};

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await page.getByLabel('Email address').click();
//   await page.getByLabel('Email address').dblclick();
//   await page.getByLabel('Email address').fill('test@email.com');
//   await page.getByLabel('Password').click();
//   await page.getByLabel('Password').fill('testpass');
//   await page.getByRole('button', { name: 'Continue' }).click();
//   await page.getByRole('button', { name: 'List' }).click();
//   await page.getByLabel('Search shows').click();
//   await page.getByLabel('Search shows').fill('always');
//   await page.getByRole('option', { name: 'It\'s Always Sunny in Philadelphia poster It\'s Always Sunny in Philadelphia' }).click();
//   await page.getByRole('listitem', { name: 'It\'s Always Sunny in Philadelphia' }).getByRole('button', { name: 'Mark as seen' }).click();
//   await page.getByRole('listitem', { name: 'It\'s Always Sunny in Philadelphia' }).getByRole('button', { name: 'Delete' }).click();
//   await page.getByRole('button', { name: 'Delete' }).nth(3).click();
//   await page.getByRole('button', { name: 'Delete' }).nth(1).click();
//   await page.getByRole('button', { name: 'Delete' }).nth(1).click();
//   await page.getByRole('button', { name: 'Delete' }).nth(1).click();
//   await page.getByRole('button', { name: 'Delete' }).click();
// });

// test("successfully adds TV show to list", async ({ page }) => {
const assertAddShowToList = async (page: Page) => {
  await page.getByRole("button", { name: "TV Show" }).click();
  await page.getByLabel("Search").click();
  await page.getByRole("combobox", { name: "Search" }).fill("always sunny");
  await page
    .getByRole("option", {
      name: "It's Always Sunny in Philadelphia poster It's Always Sunny in Philadelphia",
    })
    .click();
  await page
    .getByRole("option", {
      name: "It's Always Sunny in Philadelphia poster It's Always Sunny in Philadelphia",
    })
    .click();
};

// test("successfully adds movie to list", async ({ page }) => {
const assertAddMovieToList = async (page: Page) => {
  await page.getByRole("button", { name: "Movie" }).click();
  await page.getByLabel("Search").click();
  await page.getByRole("combobox", { name: "Search" }).fill("the matrix");
  await page
    .getByRole("option", { name: "The Matrix poster The Matrix" })
    .click();
};

// test("successfully marks media as watched", async ({ page }) => {
const assertMarkMediaAsWatched = async (page: Page) => {
  if (
    await page
      .getByLabel("Expand It's Always Sunny in Philadelphia")
      .isVisible()
  ) {
    await page.getByLabel("Expand It's Always Sunny in Philadelphia").click();
  }
  await page.getByRole("button", { name: "Mark as seen" }).click();
  await page.getByRole("button", { name: "Mark as unseen" }).click();
};

export const assertList = async (page: Page) => {
  await navigateToList(page);
  await assertAddMovieToList(page);
  await assertAddShowToList(page);
  await assertMarkMediaAsWatched(page);
};
