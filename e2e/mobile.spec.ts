import { test, expect } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  test('desktop nav links are hidden on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav .nav-links')).not.toBeVisible();
  });

  test('hamburger toggles mobile menu', async ({ page }) => {
    await page.goto('/');
    await page.click('.hamburger');
    // After click, the mobile dropdown should be visible
    await expect(page.locator('.dropdown')).toBeVisible();
  });
});
