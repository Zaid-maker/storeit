import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow user to sign up', async ({ page }) => {
    // Click sign up link
    await page.getByRole('link', { name: /sign up/i }).click();
    
    // Fill in the sign up form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    
    // Submit the form
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify welcome message
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show error for existing email during sign up', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    
    // Fill in the form with existing email
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    
    // Submit the form
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Verify error message
    await expect(page.getByText(/email already exists/i)).toBeVisible();
  });

  test('should allow user to sign in', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    
    // Fill in the sign in form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    
    // Fill in the form with wrong credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('WrongPass123!');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
