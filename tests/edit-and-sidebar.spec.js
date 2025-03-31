// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Edit mode and sidebar functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test table with specific content for this test
    await page.goto('/#/import');
    await page.waitForTimeout(500);
    
    // Create a test table with specific content
    await page.locator('[data-testid="table-name-input"]').fill('Edit Test Table');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
  });

  test('should show the sidebar on all pages', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Check if the sidebar is visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // Navigate to the import page
    await page.goto('/#/import');
    
    // Check if the sidebar is still visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('should edit a table successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the sidebar to load
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // Find our test table in the sidebar
    const tableLink = page.getByText('Edit Test Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
    
    // Click the edit link
    const editLink = page.locator('[data-testid="edit-table-link"]');
    await expect(editLink).toBeVisible();
    await editLink.click();
    
    // Wait for the edit page to load
    await expect(page.locator('[data-testid="edit-table-title"]')).toBeVisible();
    
    // Edit the table name
    await page.locator('[data-testid="table-name-input"]').fill('Edit Test Table Updated');
    
    // Edit the table content
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5\nItem 6');
    
    // Save the changes
    await page.locator('[data-testid="save-changes-button"]').click();
    
    // Wait for the save to complete and redirect to the roll page
    await page.waitForTimeout(1000);
    
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-mode"]')).toBeVisible();
    
    // Verify the table name has been updated in the sidebar
    await expect(page.getByText('Edit Test Table Updated')).toBeVisible();
    
    // Verify the table content has been updated by going back to edit
    await page.locator('[data-testid="edit-table-link"]').click();
    await page.waitForTimeout(500);
    
    // Check the content in the textarea
    const textareaContent = await page.locator('[data-testid="table-content-textarea"]').inputValue();
    expect(textareaContent).toContain('Item 6');
    
    // Test the duplicate functionality
    const duplicateButton = page.locator('[data-testid="duplicate-button"]');
    
    if (await duplicateButton.isVisible()) {
      await duplicateButton.click();
      await page.waitForTimeout(1000);
      
      // Verify we're on the edit page for the duplicated table
      const heading = page.locator('[data-testid="edit-table-title"]');
      await expect(heading).toBeVisible();
      
      // Verify the duplicated table name contains "Copy" in the input field
      const tableNameInput = await page.locator('[data-testid="table-name-input"]').inputValue();
      expect(tableNameInput).toMatch(/Copy/i);
      
      // Get the content and log it for debugging
      const textareaContent = await page.locator('[data-testid="table-content-textarea"]').inputValue();
      console.log('Duplicated table content:', textareaContent);
      
      // Check if the content contains our expected items
      expect(textareaContent).toContain('Item 1');
      expect(textareaContent).toContain('Item 5');
      expect(textareaContent).toContain('Item 6');
    }
  });
});
