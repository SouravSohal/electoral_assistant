import { test, expect } from '@playwright/test';

test.describe('Polling Booth Finder E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/find-polling');
  });

  test('should load the polling finder interface', async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter your address/i)).toBeVisible();
    await expect(page.getByTestId('polling-map')).toBeVisible();
  });

  test('should show initial state', async ({ page }) => {
    await expect(page.getByText(/Featured Election Hubs/i)).toBeVisible();
  });

  test('should search for an address and show results', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter your address/i);
    
    // We'll search for a generic Indian landmark
    await input.fill('Connaught Place, New Delhi');
    await page.keyboard.press('Enter');

    // Wait for the list to update
    const list = page.getByTestId('polling-list');
    
    // Since we are using real APIs, we check for either results OR a specific "not found/error" message 
    // to ensure the component handled the state change.
    await expect(async () => {
      const isVisible = await list.isVisible() || await page.getByText(/No polling data found/i).isVisible();
      expect(isVisible).toBeTruthy();
    }).toPass({ timeout: 10000 });
  });

  test('should show a map and list simultaneously', async ({ page }) => {
    // Accessibility requirement: both visual and text representations
    await expect(page.getByTestId('polling-map')).toBeVisible();
    
    // Even if empty, the list container/instruction should be there
    await expect(page.locator('aside')).toBeVisible();
  });
});
