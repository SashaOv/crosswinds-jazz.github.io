import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows the nav bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('has the correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/crosswinds/i);
  });

  test('displays info sections', async ({ page }) => {
    await page.goto('/');
    const sections = page.locator('.info-section');
    await expect(sections.first()).toBeVisible();
  });

  test('nav links work', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/the-band"]');
    await expect(page).toHaveURL('/the-band');
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });
});
