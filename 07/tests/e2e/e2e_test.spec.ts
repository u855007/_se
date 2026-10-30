import { test, expect } from '@playwright/test';

test('Basic E2E flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('#title')).toHaveText('Welcome');
  
  await page.fill('#input', 'Hello E2E');
  await page.click('#sendBtn');
  
  await expect(page.locator('#response')).toHaveText('Hello E2E');
});
