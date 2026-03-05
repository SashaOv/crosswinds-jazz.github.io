import { test, expect } from '@playwright/test';

test.describe('Contact dialog', () => {
  test('opens when Contact Us button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Contact Us")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('closes on X button click', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Contact Us")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.click('[aria-label="Close dialog"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('closes on Escape key', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Contact Us")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Contact Us")');
    await page.click('button:has-text("Send")');
    await expect(page.locator('text=Name must be at least 8 characters')).toBeVisible();
    await expect(page.locator('text=valid email')).toBeVisible();
    await expect(page.locator('text=Message must be at least 12 characters')).toBeVisible();
  });

  test('submits successfully with valid data', async ({ page }) => {
    // Mock the contact form endpoint
    await page.route('**/api/contact', route =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    );

    await page.goto('/');
    await page.click('button:has-text("Contact Us")');
    await page.fill('#contact-name', 'John Doe Test');
    await page.fill('#contact-email', 'john@example.com');
    await page.fill('#contact-message', 'This is a test message for the band.');
    await page.click('button:has-text("Send")');

    // Should show Sent! state
    await expect(page.locator('button:has-text("Sent!")')).toBeVisible({ timeout: 5000 });
  });
});
