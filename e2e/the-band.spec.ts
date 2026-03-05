import { test, expect } from '@playwright/test';

test.describe('The Band page', () => {
  test('loads and shows the hero section', async ({ page }) => {
    await page.goto('/the-band');
    await expect(page.locator('.hero-text')).toBeVisible();
  });

  test('displays band member sections', async ({ page }) => {
    await page.goto('/the-band');
    const sections = page.locator('.info-section');
    await expect(sections.first()).toBeVisible();
  });

  test('can navigate back to home', async ({ page }) => {
    await page.goto('/the-band');
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});
