const { test, expect } = require('@playwright/test');

test.describe('Window Title Tests', () => {
  // Setup: Create a test table before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to load
    await page.waitForTimeout(500);
    
    // Fill in the table name
    await page.locator('[data-testid="table-name-input"]').fill('Test Title Table');
    
    // Fill in the table items
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3');
    
    // Click the import button
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
  });

  test('should have default title on homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForTimeout(500);
    
    // Check the window title
    await expect(page).toHaveTitle('RtR: Roll Table Roller');
  });

  test('should update title in roll mode', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Find our test table in the sidebar using text content
    const tableLink = page.getByText('Test Title Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
    
    // Check the window title in roll mode
    await expect(page).toHaveTitle('Test Title Table');
  });

  test('should update title in edit mode', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Find our test table in the sidebar using text content
    const tableLink = page.getByText('Test Title Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
    
    // Click the edit link
    await page.locator('[data-testid="edit-table-link"]').click();
    await page.waitForTimeout(500);
    
    // Check the window title in edit mode
    await expect(page).toHaveTitle('Test Title Table');
  });

  test('should restore default title when navigating away', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Find our test table in the sidebar using text content
    const tableLink = page.getByText('Test Title Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
    
    // Verify title is updated in roll mode
    await expect(page).toHaveTitle('Test Title Table');
    
    // Navigate back to home
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Check that title is restored to default
    await expect(page).toHaveTitle('RtR: Roll Table Roller');
  });
});
