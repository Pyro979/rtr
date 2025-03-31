const { test, expect } = require('@playwright/test');

test.describe('Table Rolling Functionality', () => {
  // Setup: Create a test table before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to load
    await page.waitForTimeout(500);
    
    // Fill in the table name
    await page.locator('[data-testid="table-name-input"]').fill('Test Roll Table');
    
    // Fill in the table items
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
    
    // Click the import button
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Find and click on our test table in the sidebar
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Find our test table in the sidebar
    const tableLink = page.getByText('Test Roll Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
  });

  test('should roll on table in normal mode', async ({ page }) => {
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-mode"]')).toBeVisible();
    
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(500);
    
    // Verify a roll result is displayed
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    
    // Verify the roll result format and content
    const rollResult = await page.locator('[data-testid="roll-result"]').textContent();
    expect(rollResult).toMatch(/^Rolled: (Item 1|Item 2|Item 3|Item 4|Item 5)$/);
  });

  test('should roll on table in weighted mode', async ({ page }) => {
    // Change to weighted mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('weighted');
    
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(500);
    
    // Verify a roll result is displayed
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    
    // Verify the roll result format and content
    const rollResult = await page.locator('[data-testid="roll-result"]').textContent();
    expect(rollResult).toMatch(/^Rolled: (Item 1|Item 2|Item 3|Item 4|Item 5)$/);
  });

  test('should roll on table in no-repeat mode', async ({ page }) => {
    // Change to no-repeat mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('noRepeat');
    
    // Roll on the table multiple times to test no-repeat functionality
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="floating-roll-button"]').click();
      await page.waitForTimeout(300);
    }
    
    // Verify the "Done" text appears on the roll button when all items are rolled
    const buttonText = await page.locator('[data-testid="floating-roll-button"] .roll-text').textContent();
    expect(buttonText).toBe('Done');
    
    // Verify the roll button is disabled
    await expect(page.locator('[data-testid="floating-roll-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="floating-roll-button"]')).toHaveClass(/disabled/);
  });

  test('should navigate to edit page', async ({ page }) => {
    // Click the edit link
    await page.locator('[data-testid="edit-table-link"]').click();
    
    // Verify we're on the edit page
    await expect(page.locator('[data-testid="edit-table-title"]')).toBeVisible();
    
    // Verify the table name is correct
    const tableName = await page.locator('[data-testid="table-name-input"]').inputValue();
    expect(tableName).toEqual('Test Roll Table');
  });

  test('should verify roll state persistence', async ({ page }) => {
    // Change to weighted mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('weighted');
    
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(500);
    
    // Verify a roll result is displayed
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    
    // Verify the roll result format and content
    const rollResult = await page.locator('[data-testid="roll-result"]').textContent();
    expect(rollResult).toMatch(/^Rolled: (Item 1|Item 2|Item 3|Item 4|Item 5)$/);
    
    // Navigate away and back to verify state persistence
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Find our test table in the sidebar again
    const tableLink = page.getByText('Test Roll Table', { exact: true });
    await expect(tableLink).toBeVisible();
    
    // Click on the table to navigate back to its roll page
    await tableLink.click();
    await page.waitForTimeout(500);
    
    // Verify we're still in weighted mode
    const selectedOption = await page.locator('[data-testid="roll-style-select"]').inputValue();
    expect(selectedOption).toBe('weighted');
    
    // Verify roll history is preserved by checking for a roll result
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
  });
});
