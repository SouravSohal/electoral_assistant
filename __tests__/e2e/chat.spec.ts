import { test, expect } from '@playwright/test';

test.describe('AI Assistant E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assistant');
  });

  test('should load the chat interface', async ({ page }) => {
    await expect(page.getByTestId('chat-input')).toBeVisible();
    await expect(page.getByText('Civic AI Assistant')).toBeVisible();
  });

  test('should show suggested questions when empty', async ({ page }) => {
    const suggestions = page.locator('button:has-text("What is")');
    await expect(suggestions.first()).toBeVisible();
  });

  test('should send a message and receive a response', async ({ page }) => {
    const input = page.getByTestId('chat-input');
    const sendButton = page.locator('button:has(svg)');

    await input.fill('How do I register to vote in India?');
    await input.press('Enter');

    // Check if user message appears
    await expect(page.getByText('How do I register to vote in India?')).toBeVisible();

    // Wait for AI response (streaming)
    const aiResponse = page.getByTestId('ai-response');
    await expect(aiResponse).toBeVisible({ timeout: 15000 });
    
    // Check if response has content
    const responseText = await aiResponse.innerText();
    expect(responseText.length).toBeGreaterThan(10);
  });

  test('should handle suggested question clicks', async ({ page }) => {
    const firstSuggestion = page.locator('button:has-text("What is NOTA")').first();
    const text = await firstSuggestion.innerText();
    
    await firstSuggestion.click();
    
    // Check if message was sent
    await expect(page.getByText(text)).toBeVisible();
    
    // Check for AI response
    await expect(page.getByTestId('ai-response')).toBeVisible({ timeout: 15000 });
  });
});
