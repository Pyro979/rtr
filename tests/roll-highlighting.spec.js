const { test, expect } = require('@playwright/test');

test.describe('Roll Highlighting Functionality', () => {
  // Setup: Create a test table before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page and create a test table
    await page.goto('/#/import');
    await page.locator('[data-testid="table-name-input"]').fill('Highlight Test Table');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Navigate directly to the table's roll page using the URL
    // This avoids having to use the sidebar navigation which can be unreliable
    // First get the table ID from localStorage
    const tableId = await page.evaluate(() => {
      const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
      const table = tables.find(t => t.name === 'Highlight Test Table');
      return table ? table.id : null;
    });
    
    if (tableId) {
      // Navigate directly to the table's roll page
      await page.goto(`/#/table/${tableId}/roll`);
      await page.waitForTimeout(1000);
    }
  });

  test('should highlight the rolled item in the table', async ({ page }) => {
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-table-title"]')).toBeVisible();
    
    // Click the roll button
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Verify a result appears
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    const rolledText = await page.locator('[data-testid="roll-result"] p').textContent();
    const rolledItem = rolledText.replace(/Rolled:|\s+/g, ' ').trim();
    
    // Verify the corresponding row in the table is highlighted
    const highlightedRow = page.locator('tr[class*="highlighted"]');
    await expect(highlightedRow).toBeVisible();
    
    // Verify the highlighted row contains the rolled item text
    await expect(highlightedRow).toContainText(rolledItem);
    
    // Don't test for being in viewport as this can be flaky
  });

 
  test('should update highlighting when rolling multiple times', async ({ page }) => {
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Get the first rolled item
    const rolledText1 = await page.locator('[data-testid="roll-result"] p').textContent();
    const rolledItem1 = rolledText1.replace(/Rolled:|\s+/g, ' ').trim();
    
    // Verify the first item is highlighted
    const highlightedRow1 = page.locator('tr[class*="highlighted"]');
    await expect(highlightedRow1).toContainText(rolledItem1);
    
    // Roll again
    await page.locator('[data-testid="floating-roll-button"]').click();
    
    // Get the second rolled item
    const rolledText2 = await page.locator('[data-testid="roll-result"] p').textContent();
    const rolledItem2 = rolledText2.replace(/Rolled:|\s+/g, ' ').trim();
    
    // Verify the second item is now highlighted
    const highlightedRow2 = page.locator('tr[class*="highlighted"]');
    await expect(highlightedRow2).toContainText(rolledItem2);
    
    // If the items are different, verify the first is no longer highlighted
    if (rolledItem1 !== rolledItem2) {
      const firstItemRow = page.locator(`tr:has-text("${rolledItem1}")`);
      await expect(firstItemRow).not.toHaveClass(/highlighted/);
    }
  });
});
