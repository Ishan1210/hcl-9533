// @ts-check
import { test, expect } from '@playwright/test';

test('home page loads from baseURL', async ({ page }) => {
  await page.goto('/');

  // Confirms the app rendered root content instead of a blank page
  await expect(page.locator('body')).not.toBeEmpty();
});

test('has expected page title', async ({ page }) => {
  await page.goto('/');

  // Replace /Vite|React/i with the actual <title> of your app
  await expect(page).toHaveTitle(/.+/);
});