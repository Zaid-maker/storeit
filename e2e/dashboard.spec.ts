import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/sign-in');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display user files', async ({ page }) => {
    // Verify file list is visible
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check if some default files are listed
    await expect(page.getByText('test.pdf')).toBeVisible();
    await expect(page.getByText('image.jpg')).toBeVisible();
  });

  test('should allow file upload', async ({ page }) => {
    // Create a test file
    const filePath = path.join(__dirname, 'fixtures', 'test-file.txt');
    
    // Upload file using the file input
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Wait for upload to complete and verify file appears in list
    await expect(page.getByText('test-file.txt')).toBeVisible();
    
    // Verify success message
    await expect(page.getByText(/successfully uploaded/i)).toBeVisible();
  });

  test('should allow file deletion', async ({ page }) => {
    // Find and click delete button for a file
    await page.getByRole('button', { name: /delete/i }).first().click();
    
    // Confirm deletion in the modal
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Verify success message
    await expect(page.getByText(/successfully deleted/i)).toBeVisible();
    
    // Verify file is removed from the list
    await expect(page.getByText('test.pdf')).not.toBeVisible();
  });

  test('should allow file search', async ({ page }) => {
    // Type in search box
    await page.getByRole('searchbox').fill('pdf');
    
    // Verify filtered results
    await expect(page.getByText('test.pdf')).toBeVisible();
    await expect(page.getByText('image.jpg')).not.toBeVisible();
  });

  test('should allow file type filtering', async ({ page }) => {
    // Select PDF filter
    await page.getByRole('combobox', { name: /filter/i }).selectOption('PDF');
    
    // Verify filtered results
    await expect(page.getByText('test.pdf')).toBeVisible();
    await expect(page.getByText('image.jpg')).not.toBeVisible();
  });

  test('should show file details', async ({ page }) => {
    // Click on a file to show details
    await page.getByText('test.pdf').click();
    
    // Verify file details are shown
    await expect(page.getByText(/file size/i)).toBeVisible();
    await expect(page.getByText(/upload date/i)).toBeVisible();
    await expect(page.getByText(/file type/i)).toBeVisible();
  });

  test('should handle drag and drop upload', async ({ page }) => {
    // Create a data transfer object
    const dataTransfer = await page.evaluateHandle(() => {
      const data = new DataTransfer();
      const file = new File(['test content'], 'drag-drop.txt', { type: 'text/plain' });
      data.items.add(file);
      return data;
    });

    // Trigger drag and drop events
    await page.dispatchEvent('[data-testid="dropzone"]', 'drop', { dataTransfer });
    
    // Verify file appears in list
    await expect(page.getByText('drag-drop.txt')).toBeVisible();
  });

  test('should handle multiple file selection', async ({ page }) => {
    // Select multiple files using checkboxes
    await page.getByRole('checkbox').first().check();
    await page.getByRole('checkbox').nth(1).check();
    
    // Verify batch actions are available
    await expect(page.getByText(/selected items/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /delete selected/i })).toBeVisible();
  });
});
