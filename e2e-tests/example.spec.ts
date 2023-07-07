import { test, expect, Page, BrowserContext } from "@playwright/test";

const baseUrl = process.env.TEST_BASE_URL ?? "";

const setUp = async ({ context }: { context: BrowserContext }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { sessionToken } = await (
    await fetch(`${baseUrl}/api/test/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: process.env.TEST_TOKEN ?? "" }),
    })
  ).json();
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken as string,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
};

const cleanUp = async () => {
  await fetch(`${baseUrl}/api/test/cleanup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: process.env.TEST_TOKEN ?? "" }),
  });
};

test.afterEach(async () => {
  await cleanUp();
});

test("test", async ({ page, context }) => {
  await setUp({ context });

  await page.goto(baseUrl);
  if (await page.getByRole("button", { name: "navigation menu" }).isVisible()) {
    await page.getByRole("button", { name: "navigation menu" }).click();
  }
  await page.getByRole("link", { name: "List" }).click();

  await expect(page).toHaveURL(`${baseUrl}/list`);
  await page.getByText("Create a list to get started!").isVisible();
  await page.getByRole("button", { name: "Create List" }).click();

  await page.getByText("Text User's List").isVisible();
  await page.getByRole("combobox", { name: "Search shows" }).fill("Curb");
  await page
    .getByRole("option", {
      name: "Curb Your Enthusiasm poster Curb Your Enthusiasm",
    })
    .click();

  await page.getByText("Successfully added Curb Your Enthusiasm.").isVisible();

  if (await page.getByLabel("Expand Curb Your Enthusiasm").isVisible()) {
    await page.getByLabel("Expand Curb Your Enthusiasm").click();
  }

  await page.getByRole("button", { name: "Mark as seen" }).click();

  await page
    .getByText("Successfully updated Curb Your Enthusiasm.")
    .isVisible();
});
