const { test, expect } = require('@playwright/test');

test.describe('Table Import Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
  });

  test('should import a table successfully', async ({ page }) => {
    // Fill in the table name
    await page.locator('[data-testid="table-name-input"]').fill('Test Import Table');
    
    // Fill in the table items
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3');
    
    // Take a screenshot before import
    await page.screenshot({ path: 'test-results/before-import.png' });
    
    // Click the import button
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify success message appears
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Take a screenshot after import
    await page.screenshot({ path: 'test-results/after-import.png' });
    
    // Wait for the sidebar to update
    await page.waitForTimeout(1000);
    
    // Navigate to home and back to ensure the sidebar fully refreshes
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.goto('/#/import');
    await page.waitForTimeout(500);
    
    // Open the sidebar if it's not already open
    const sidebarButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();
      await page.waitForTimeout(500);
    }
    
    // Take a screenshot of the sidebar with the imported table
    await page.screenshot({ path: 'test-results/sidebar-with-imported-table.png' });
    
    // Check for the table in the sidebar using data-testid
    const tableLinks = page.locator('[data-testid^="table-link-"]');
    await expect(tableLinks.first()).toBeVisible();
    
    // Verify at least one table link contains our table name
    const count = await tableLinks.count();
    let foundTable = false;
    
    for (let i = 0; i < count; i++) {
      const text = await tableLinks.nth(i).textContent();
      if (text.includes('Test Import Table')) {
        foundTable = true;
        break;
      }
    }
    
    expect(foundTable).toBeTruthy();
  });

  test('should prevent duplicate table names', async ({ page }) => {
    // Create first table
    await page.locator('[data-testid="table-name-input"]').fill('Duplicate Test');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3');
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for success message
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Try to create another table with the same name
    await page.goto('/#/import');
    await page.waitForTimeout(500);
    
    await page.locator('[data-testid="table-name-input"]').fill('Duplicate Test');
    await page.locator('[data-testid="table-content-textarea"]').fill('Different Item 1\nDifferent Item 2');
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify error message appears
    await expect(page.locator('[data-testid="import-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="import-error"]')).toContainText(/duplicate|already exists/i);
  });

  test('should process import preferences', async ({ page }) => {
    // Toggle preferences
    const removeNumbersCheckbox = page.locator('[data-testid="remove-numbers-checkbox"]');
    if (await removeNumbersCheckbox.isVisible()) {
      await removeNumbersCheckbox.check();
    }
    
    const removeBulletsCheckbox = page.locator('[data-testid="remove-bullets-checkbox"]');
    if (await removeBulletsCheckbox.isVisible()) {
      await removeBulletsCheckbox.check();
    }
    
    // Import a table with numbered and bulleted items
    await page.locator('[data-testid="table-name-input"]').fill('Preferences Test');
    await page.locator('[data-testid="table-content-textarea"]').fill('1. Item One\n• Item Two\n- Item Three\n2) Item Four');
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify success message
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Navigate to the table to check if formatting was removed
    // First check if we need to open the sidebar
    const sidebarButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();
      await page.waitForTimeout(500);
    }
    
    // Click on the table
    await page.getByText('Preferences Test').click();
    
    // Navigate to edit page
    await page.getByRole('link', { name: /Edit Table/i }).click();
    
    // Check the textarea content
    const textareaContent = await page.locator('[data-testid="table-content-textarea"]').inputValue();
    
    // Verify numbers and bullets were removed
    expect(textareaContent).not.toContain('1.');
    expect(textareaContent).not.toContain('•');
    expect(textareaContent).not.toContain('-');
    expect(textareaContent).not.toContain('2)');
    
    // Verify the items are still there
    expect(textareaContent).toContain('Item One');
    expect(textareaContent).toContain('Item Two');
    expect(textareaContent).toContain('Item Three');
    expect(textareaContent).toContain('Item Four');
  });

  test('should import multiple tables successfully', async ({ page }) => {
    // Import first table
    await page.locator('[data-testid="table-name-input"]').fill('Test Import Table 1');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3');
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify success message appears
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Wait for the sidebar to update
    await page.waitForTimeout(1000);
    
    // Import second table
    await page.locator('[data-testid="table-name-input"]').fill('Test Import Table 2');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item A\nItem B\nItem C');
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify success message appears
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Wait for the sidebar to update
    await page.waitForTimeout(1000);
       
    // Import third table
    await page.locator('[data-testid="table-name-input"]').fill('Test Import Table 3');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item X\nItem Y\nItem Z');
    await page.locator('[data-testid="import-button"]').click();
    
    // Verify success message appears
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    
    // Wait for the sidebar to update
    await page.waitForTimeout(1000);
    
    // Open the sidebar if it's not already open
    const sidebarButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();
      await page.waitForTimeout(500);
    }
    
    // Take a screenshot of the sidebar with all imported tables
    await page.screenshot({ path: 'test-results/sidebar-with-multiple-imported-tables.png' });
    
    // Check for all three tables in the sidebar
    const tableLinks = page.locator('[data-testid^="table-link-"]');
    await expect(tableLinks.first()).toBeVisible();
    
    // Verify all three table links are present
    const count = await tableLinks.count();
    const tableNames = ['Test Import Table 1', 'Test Import Table 2', 'Test Import Table 3'];
    const foundTables = [false, false, false];
    
    for (let i = 0; i < count; i++) {
      const text = await tableLinks.nth(i).textContent();
      for (let j = 0; j < tableNames.length; j++) {
        if (text.includes(tableNames[j])) {
          foundTables[j] = true;
        }
      }
    }
    
    // Verify all three tables were found
    expect(foundTables[0]).toBeTruthy();
    expect(foundTables[1]).toBeTruthy();
    expect(foundTables[2]).toBeTruthy();
  });
});
