import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // Mock the authentication state
  await page.route('**/api/auth/**', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
        },
      }),
    });
  });

  // Set mock cookies
  await page.context().addCookies([
    {
      name: 'appwrite-session',
      value: 'mock-session-value',
      domain: 'localhost',
      path: '/',
    },
  ]);

  // Save signed-in state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
