import { expect, test } from '@playwright/test';

test('homepage has app title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Movie List' })).toBeVisible();
});
