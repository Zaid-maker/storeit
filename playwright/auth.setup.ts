import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // Create a storage state file for authentication
  const storageState = {
    cookies: [{
      name: 'appwrite-session',
      value: 'mock-session-value',
      domain: 'localhost',
      path: '/',
    }],
    origins: [{
      origin: 'http://localhost:3000',
      localStorage: [{
        name: 'user',
        value: JSON.stringify({
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
        })
      }]
    }]
  };

  // Save the authentication state to a file
  await setup.expect(async () => {
    const fs = require('fs/promises');
    await fs.writeFile(authFile, JSON.stringify(storageState));
  }).toPass();
});
