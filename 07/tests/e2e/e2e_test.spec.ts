import { test, expect } from '@playwright/test';

test('User can test a public API using the proxy', async ({ page }) => {
  // 1. Go to the API Tester app
  await page.goto('http://localhost:3000');
  
  // 2. Input a known working API URL
  const testUrl = 'https://jsonplaceholder.typicode.com/todos/1';
  await page.fill('#urlInput', testUrl);
  
  // 3. Click Send
  await page.click('#sendBtn');
  
  // 4. Verify that the response area contains the expected JSON content
  const responseArea = page.locator('#responseArea');
  await expect(responseArea).toContainText('"userId": 1');
  
  // 5. Verify the status bar shows a successful response
  const statusBar = page.locator('#statusBar');
  await expect(statusBar).toContainText('200 OK');
});
