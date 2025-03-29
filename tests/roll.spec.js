const { test, expect } = require('@playwright/test');

test.describe('Table Rolling Functionality', () => {
  // Setup: Create a test table before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Fill in the table name
    await page.locator('[data-testid="table-name-input"]').fill('Test Roll Table');
    
    // Fill in the table items
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
    
    // Click the import button
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Navigate to the roll page for this table
    // First check if we need to use the sidebar
    const tableLink = page.locator('[data-testid^="table-link-"]').first();
    
    if (await tableLink.isVisible()) {
      await tableLink.click();
    } else {
      // We might need to open the sidebar first
      const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
      if (await hamburgerButton.isVisible()) {
        await hamburgerButton.click();
        await page.waitForTimeout(500);
        
        // Look for the table in the sidebar
        const sidebarTableLink = page.locator('[data-testid^="table-link-"]').first();
        if (await sidebarTableLink.isVisible()) {
          await sidebarTableLink.click();
        }
      }
    }
    
    // Wait for navigation
    await page.waitForTimeout(1000);
  });

  test('should roll on table in normal mode', async ({ page }) => {
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-mode"]')).toBeVisible();
    
    // Click the roll button
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Verify a result is displayed
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    
    // Roll a few more times
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Verify the roll history is updated - looking for any highlighted row
    const highlightedRow = page.locator('tr.highlighted');
    await expect(highlightedRow).toBeVisible();
  });

  test('should highlight rolled items in the table', async ({ page }) => {
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Wait for the roll to complete
    await page.waitForTimeout(500);
    
    // Verify that at least one item in the table is highlighted
    const highlightedItem = page.locator('tr.highlighted').first();
    await expect(highlightedItem).toBeVisible();
  });

  test('should change roll styles', async ({ page }) => {
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-mode"]')).toBeVisible();
    
    // Get the initial roll style
    const initialRollStyle = await page.locator('[data-testid="roll-style-select"]').inputValue();
    
    // Select a different roll style
    await page.locator('[data-testid="roll-style-select"]').selectOption('weighted');
    
    // Verify the roll style has changed
    const newRollStyle = await page.locator('[data-testid="roll-style-select"]').inputValue();
    expect(newRollStyle).not.toEqual(initialRollStyle);
    
    // Roll with the new style
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Verify a result is displayed
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
  });

  test('should reset roll history', async ({ page }) => {
    // Roll a few times
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(300);
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(300);
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(300);
    
    // Verify the roll history has items
    await expect(page.locator('tr.highlighted')).toBeVisible();
    
    // Click the reset history button
    await page.locator('[data-testid="reset-history-button"]').click();
    
    // Wait for reset to complete
    await page.waitForTimeout(500);
    
    // Verify the roll history is empty (no highlighted rows)
    const highlightedCount = await page.locator('tr.highlighted').count();
    expect(highlightedCount).toBe(0);
  });

  test('should navigate to edit mode', async ({ page }) => {
    // Click the edit link
    await page.locator('[data-testid="edit-table-link"]').click();
    
    // Verify we're on the edit page
    await expect(page.locator('[data-testid="edit-table-title"]')).toBeVisible();
    
    // Verify the table name is correct
    const tableName = await page.locator('[data-testid="table-name-input"]').inputValue();
    expect(tableName).toEqual('Test Roll Table');
  });
});
