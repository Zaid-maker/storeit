import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for files
    await page.route('**/api/files**', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          documents: [
            { 
              $id: 'file1',
              name: 'test.pdf',
              size: 1024,
              type: 'application/pdf',
              uploadedAt: new Date().toISOString()
            },
            {
              $id: 'file2',
              name: 'image.jpg',
              size: 2048,
              type: 'image/jpeg',
              uploadedAt: new Date().toISOString()
            }
          ],
          total: 2
        })
      });
    });

    // Go to dashboard
    await page.goto('/dashboard');
  });

  test('should display user files', async ({ page }) => {
    // Verify file list is visible
    await expect(page.getByRole('table')).toBeVisible();
    
    // Check if mocked files are listed
    await expect(page.getByText('test.pdf')).toBeVisible();
    await expect(page.getByText('image.jpg')).toBeVisible();
  });

  test('should allow file upload', async ({ page }) => {
    // Mock file upload response
    await page.route('**/api/files/upload', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          $id: 'new-file',
          name: 'test-file.txt',
          size: 512,
          type: 'text/plain',
          uploadedAt: new Date().toISOString()
        })
      });
    });

    // Create a test file
    const filePath = path.join(__dirname, 'fixtures', 'test-file.txt');
    
    // Upload file using the file input
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Wait for upload to complete and verify file appears in list
    await expect(page.getByText('test-file.txt')).toBeVisible();
    await expect(page.getByText(/successfully uploaded/i)).toBeVisible();
  });

  test('should allow file deletion', async ({ page }) => {
    // Mock delete response
    await page.route('**/api/files/*', async route => {
      await route.fulfill({ status: 200 });
    });

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
    // Mock filtered response
    await page.route('**/api/files**', async route => {
      const url = route.request().url();
      if (url.includes('type=pdf')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            documents: [
              {
                $id: 'file1',
                name: 'test.pdf',
                size: 1024,
                type: 'application/pdf',
                uploadedAt: new Date().toISOString()
              }
            ],
            total: 1
          })
        });
      }
    });

    // Select PDF filter
    await page.getByRole('combobox').selectOption('PDF');
    
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
