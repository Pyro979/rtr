// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Reset All Data functionality', () => {
  test('should reset all data and restore default tables', async ({ page }) => {
    // First, navigate to the import page to create a custom table
    await page.goto('/#/import');
    await page.waitForTimeout(100);
    
    // Create a custom table
    await page.locator('[data-testid="table-name-input"]').fill('Test Custom Table');
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3');
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(500);
    
    // Verify the custom table exists
    await page.goto('/');
    await page.waitForTimeout(100);
    
    // Check if our custom table is in the sidebar
    await expect(page.locator('text=Test Custom Table')).toBeVisible();
    
    // Create a roll history by navigating to the table and rolling
    const tableId = await page.evaluate(() => {
      const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
      const table = tables.find(t => t.name === 'Test Custom Table');
      return table ? table.id : null;
    });
    
    if (tableId) {
      // Navigate to the table's roll page
      await page.goto(`/#/table/${tableId}/roll`);
      await page.waitForTimeout(500);
      
      // Wait for the roll button to be visible and enabled
      await expect(page.locator('[data-testid="floating-roll-button"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="floating-roll-button"]')).toBeEnabled({ timeout: 5000 });
      
      // Roll on the table a few times
      for (let i = 0; i < 3; i++) {
        await page.locator('[data-testid="floating-roll-button"]').click();
        await page.waitForTimeout(100);
      }
      
      // Verify roll history exists
      const hasRollHistory = await page.evaluate(() => {
        const history = JSON.parse(localStorage.getItem('rollHistory') || '{}');
        return Object.keys(history).length > 0;
      });
      
      expect(hasRollHistory).toBeTruthy();
      
      // Check if condense checkbox exists before trying to interact with it
      const condenseCheckboxVisible = await page.locator('[data-testid="condense-checkbox"]').isVisible()
        .catch(() => false);
      
      if (condenseCheckboxVisible) {
        await page.locator('[data-testid="condense-checkbox"]').check();
        await page.waitForTimeout(100);
        
        // Verify condense option is saved
        const hasCondenseOptions = await page.evaluate(() => {
          const options = JSON.parse(localStorage.getItem('condenseOptions') || '{}');
          return Object.keys(options).length > 0;
        });
        
        expect(hasCondenseOptions).toBeTruthy();
      }
      
      // Now go to options page and reset all data
      await page.goto('/#/options');
      await page.waitForTimeout(500);
      
      // Wait for the options page to be fully loaded
      await expect(page.getByRole('heading', { name: 'Options' })).toBeVisible({ timeout: 5000 });
      
      // Click the reset all data button (use role selector to get the button specifically)
      await page.getByRole('button', { name: 'Reset All Data' }).click();
      await page.waitForTimeout(500);
      
      // Wait for the confirmation dialog to appear
      await expect(page.getByText('⚠️ WARNING')).toBeVisible({ timeout: 5000 });
      
      // Type the confirmation text
      await page.locator('input[data-testid="reset-confirm-input"]').fill('DELETE ALL DATA');
      await page.waitForTimeout(100);
      
      // Click the confirm button
      await page.locator('button[data-testid="reset-confirm-button"]').click();
      
      // Wait for the page to reload
      await page.waitForTimeout(1500);
      
      // Verify custom table is gone
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Custom table should be gone
      await expect(page.locator('text=Test Custom Table')).not.toBeVisible();
      
      // Verify roll history is cleared
      const rollHistoryCleared = await page.evaluate(() => {
        const history = JSON.parse(localStorage.getItem('rollHistory') || '{}');
        return Object.keys(history).length === 0;
      });
      
      expect(rollHistoryCleared).toBeTruthy();
      
      // Verify condense options are cleared
      const condenseOptionsCleared = await page.evaluate(() => {
        const options = JSON.parse(localStorage.getItem('condenseOptions') || '{}');
        return Object.keys(options).length === 0;
      });
      
      expect(condenseOptionsCleared).toBeTruthy();
      
      // Verify the localStorage has the default tables
      const hasDefaultTables = await page.evaluate(() => {
        const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
        return tables.some(t => t.name.includes('Random Enemies')) &&
               tables.some(t => t.name.includes('Random Treasure')) &&
               tables.some(t => t.name.includes('Random Weather')) &&
               tables.some(t => t.name.includes('Random Tavern')) &&
               tables.some(t => t.name.includes('Random NPC'));
      });
      
      expect(hasDefaultTables).toBeTruthy();
    }
  });
});
