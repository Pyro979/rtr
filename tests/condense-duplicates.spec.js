const { test, expect } = require('@playwright/test');

test.describe('Condense Duplicates Functionality', () => {
  // Setup: Create a test table with duplicate items before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page and create a test table with duplicate items
    await page.goto('/#/import');
    await page.waitForTimeout(500);
    
    // Make sure "Remove duplicates" option is unchecked
    const removeDuplicatesCheckbox = page.locator('[data-testid="remove-duplicates-checkbox"]');
    if (await removeDuplicatesCheckbox.isChecked()) {
      await removeDuplicatesCheckbox.uncheck();
    }
    
    await page.locator('[data-testid="table-name-input"]').fill('Condense Test Table');
    
    // Create a table with intentional duplicates
    await page.locator('[data-testid="table-content-textarea"]').fill(
      'Item A\nItem A\nItem A\nItem B\nItem C\nItem C\nItem D\nItem E\nItem E\nItem E'
    );
    
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Navigate directly to the table's roll page using the URL
    const tableId = await page.evaluate(() => {
      const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
      const table = tables.find(t => t.name === 'Condense Test Table');
      return table ? table.id : null;
    });
    
    if (tableId) {
      // Navigate directly to the table's roll page
      await page.goto(`/#/table/${tableId}/roll`);
      await page.waitForTimeout(1000);
      
      // Make sure the table is fully loaded
      await expect(page.locator('[data-testid="roll-table-container"]')).toBeVisible();
      
      // Reset any existing history to ensure a clean state
      await page.locator('[data-testid="reset-history-button"]').click();
      await page.waitForTimeout(500);
      
      // Verify that we actually have duplicates in the table
      const tableRows = page.locator('[data-testid^="roll-table-row-"]');
      const rowCount = await tableRows.count();
      
      // If we don't have 10 rows, the duplicates might have been removed
      if (rowCount !== 10) {
        console.warn(`Expected 10 rows but found ${rowCount}. Duplicates may have been removed during import.`);
        
        // Let's create the table directly through localStorage to ensure duplicates
        await page.evaluate(() => {
          const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
          const tableIndex = tables.findIndex(t => t.name === 'Condense Test Table');
          
          if (tableIndex >= 0) {
            // Update the existing table with our items including duplicates
            tables[tableIndex].items = [
              'Item A', 'Item A', 'Item A',
              'Item B',
              'Item C', 'Item C',
              'Item D',
              'Item E', 'Item E', 'Item E'
            ];
            localStorage.setItem('randomTables', JSON.stringify(tables));
          }
        });
        
        // Reload the page to see the updated table
        await page.reload();
        await page.waitForTimeout(1000);
      }
    } else {
      throw new Error('Failed to create test table');
    }
  });

  test('should show all items individually by default', async ({ page }) => {
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-table-title"]')).toBeVisible();
    
    // Check that all 10 items are displayed individually
    const tableRows = page.locator('[data-testid^="roll-table-row-"]');
    await expect(tableRows).toHaveCount(10);
    
    // Verify the first three rows all contain "Item A"
    await expect(page.locator('[data-testid="roll-table-row-0"]')).toContainText('Item A');
    await expect(page.locator('[data-testid="roll-table-row-1"]')).toContainText('Item A');
    await expect(page.locator('[data-testid="roll-table-row-2"]')).toContainText('Item A');
  });

  test('should condense duplicate items when option is enabled', async ({ page }) => {
    // Enable the condense duplicates option
    await page.locator('[data-testid="condense-checkbox"]').check();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Now we should have fewer rows because duplicates are condensed
    const tableRows = page.locator('[data-testid^="roll-table-row-"]');
    
    // We expect 5 rows instead of 10 (A×3, B×1, C×2, D×1, E×3 become 5 rows)
    await expect(tableRows).toHaveCount(5);
    
    // Check that the first row shows "1-3" for the first three items (Item A)
    const firstRowIndex = await page.locator('[data-testid="roll-table-item-0"]').textContent();
    expect(firstRowIndex.trim()).toBe('1-3');
    
    // Check that the fifth row shows "8-10" for the last three items (Item E)
    const lastRowIndex = await page.locator('[data-testid="roll-table-item-7"]').textContent();
    expect(lastRowIndex.trim()).toBe('8-10');
  });

  test('should toggle between condensed and expanded views', async ({ page }) => {
    // Initially should show all items
    let tableRows = page.locator('[data-testid^="roll-table-row-"]');
    await expect(tableRows).toHaveCount(10);
    
    // Enable condense option
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Should now show condensed rows
    tableRows = page.locator('[data-testid^="roll-table-row-"]');
    await expect(tableRows).toHaveCount(5);
    
    // Disable condense option
    await page.locator('[data-testid="condense-checkbox"]').uncheck();
    await page.waitForTimeout(500);
    
    // Should go back to showing all items
    tableRows = page.locator('[data-testid^="roll-table-row-"]');
    await expect(tableRows).toHaveCount(10);
  });

  test('should preserve roll history when toggling condense option', async ({ page }) => {
    // Roll on the table
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(300);
    
    // Get the rolled item text
    const rolledText = await page.locator('[data-testid="roll-result"] p').textContent();
    
    // Find the highlighted row
    const highlightedRow = page.locator('tr.highlighted');
    await expect(highlightedRow).toBeVisible();
    
    // Enable condense option
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // The roll result should still be visible
    await expect(page.locator('[data-testid="roll-result"] p')).toHaveText(rolledText);
    
    // A row should still be highlighted
    await expect(page.locator('tr.highlighted')).toBeVisible();
    
    // Disable condense option
    await page.locator('[data-testid="condense-checkbox"]').uncheck();
    await page.waitForTimeout(500);
    
    // The roll result should still be the same
    await expect(page.locator('[data-testid="roll-result"] p')).toHaveText(rolledText);
    
    // A row should still be highlighted
    await expect(page.locator('tr.highlighted')).toBeVisible();
  });

  test('should work correctly with weighted roll mode', async ({ page }) => {
    // Enable condense duplicates to test with condensed view
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Switch to weighted mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('weighted');
    await page.waitForTimeout(300);
    
    // Roll several times to build up weights
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="floating-roll-button"]').click();
      await page.waitForTimeout(300);
    }
    
    // Enable condense option
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Check that roll counts are displayed and combined for condensed items
    const condensedRows = page.locator('[data-testid^="roll-table-row-"]');
    
    // At least one roll count should be visible (using first() to avoid strict mode violation)
    const rollCountElements = page.locator('.roll-count').first();
    await expect(rollCountElements).toBeVisible();
    
    // The roll counts should be preserved when toggling back
    await page.locator('[data-testid="condense-checkbox"]').uncheck();
    await page.waitForTimeout(500);
    
    // Roll counts should still be visible
    await expect(page.locator('.roll-count').first()).toBeVisible();
  });

  test('should work correctly with no-repeat roll mode', async ({ page }) => {
    // Enable condense duplicates to test with condensed view
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Switch to no-repeat mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('noRepeat');
    await page.waitForTimeout(300);
    
    // Roll a few times
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid="floating-roll-button"]').click();
      await page.waitForTimeout(300);
    }
    
    // Check that the progress bar is visible
    await expect(page.locator('.roll-progress')).toBeVisible();
    
    // Some items should be marked as rolled (strikethrough)
    const rolledItems = page.locator('td.rolled-text').first();
    await expect(rolledItems).toBeVisible();
    
    // Enable condense option
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Check that condensed items show the correct roll count
    const rollCountElements = page.locator('.roll-count').first();
    await expect(rollCountElements).toBeVisible();
    
    // Disable condense option
    await page.locator('[data-testid="condense-checkbox"]').uncheck();
    await page.waitForTimeout(500);
    
    // Items should still be marked as rolled
    await expect(page.locator('td.rolled-text').first()).toBeVisible();
  });

  test('should not highlight any item when first loading the page', async ({ page }) => {
    // Reload the page to ensure we're starting fresh
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify we're on the roll page
    await expect(page.locator('[data-testid="roll-table-title"]')).toBeVisible();
    
    // There should be no highlighted rows initially
    const highlightedRows = page.locator('tr.highlighted');
    await expect(highlightedRows).toHaveCount(0);
    
    // Enable condense duplicates to test with condensed view
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // There should still be no highlighted rows
    await expect(page.locator('tr.highlighted')).toHaveCount(0);
    
    // After rolling, there should be exactly one highlighted row
    await page.locator('[data-testid="floating-roll-button"]').click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('tr.highlighted')).toHaveCount(1);
  });

  test('should not allow rolling the same item twice in no-repeat mode', async ({ page }) => {
    // Switch to no-repeat mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('noRepeat');
    await page.waitForTimeout(300);
    
    // Enable condense duplicates to test with condensed view
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(500);
    
    // Roll until we've rolled 5 unique items
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="floating-roll-button"]').click();
      await page.waitForTimeout(300);
    }
    
    // Get the list of rolled items
    const rolledItems = await page.locator('td.rolled-text').allTextContents();
    
    // Check that all rolled items are unique
    const uniqueRolledItems = new Set(rolledItems.map(text => text.trim()));
    expect(uniqueRolledItems.size).toBe(rolledItems.length);
    
    // The condensed view should show the progress of rolled items
    const progressText = await page.locator('.roll-progress-text').textContent();
    expect(progressText).toMatch(/5\/10 rolled/);
    
    // Disable condense option to verify it works in regular view too
    await page.locator('[data-testid="condense-checkbox"]').uncheck();
    await page.waitForTimeout(500);
    
    // The non-condensed view should still show the progress
    const progressTextAfter = await page.locator('.roll-progress-text').textContent();
    expect(progressTextAfter).toMatch(/5\/10 rolled/);
  });

  test('should correctly show rolled counts for each condensed group in no-repeat mode', async ({ page }) => {
    // Switch to no-repeat mode
    await page.locator('[data-testid="roll-style-select"]').selectOption('noRepeat');
    await page.waitForTimeout(100);
    
    // Enable condense duplicates
    await page.locator('[data-testid="condense-checkbox"]').check();
    await page.waitForTimeout(100);
    
    // Reset history to start fresh
    await page.locator('[data-testid="reset-history-button"]').click();
    await page.waitForTimeout(100);
    
    // Roll 10 times to hit all items
    for (let i = 0; i < 10; i++) {
      const buttonText = await page.locator('[data-testid="floating-roll-button"] .roll-text').textContent();
      
      // If the button says "Done", we need to reset
      if (buttonText.trim() === 'Done') {
        await page.locator('[data-testid="reset-history-button"]').click();
        await page.waitForTimeout(100);
      }
      
      await page.locator('[data-testid="floating-roll-button"]').click();
      await page.waitForTimeout(100);
    }
    
    // Check the progress shows all items rolled
    const progressText = await page.locator('.roll-progress-text').textContent();
    expect(progressText).toMatch(/10\/10 rolled/);
    
    // Get all the condensed rows
    const condensedRows = await page.locator('[data-testid^="roll-table-row-"]').all();
    
    // Expected counts for each item type
    const expectedGroups = {
      'Item A': { count: 3, isCondensed: true },
      'Item B': { count: 1, isCondensed: false },
      'Item C': { count: 2, isCondensed: true },
      'Item D': { count: 1, isCondensed: false },
      'Item E': { count: 3, isCondensed: true }
    };
    
    // Check each row
    for (const row of condensedRows) {
      // Get the item text
      const itemText = await row.locator('td:nth-child(2)').textContent();
      const itemName = itemText.split('(')[0].trim();
      
      // Check if this item matches one of our expected items
      if (expectedGroups[itemName]) {
        const expectedGroup = expectedGroups[itemName];
        
        // Only condensed groups (with more than 1 item) should have roll count labels
        if (expectedGroup.isCondensed) {
          // Get the roll count from the span
          const rollCountSpan = row.locator('.roll-count');
          const isVisible = await rollCountSpan.isVisible();
          expect(isVisible).toBe(true);
          
          if (isVisible) {
            const rollCountText = await rollCountSpan.textContent();
            
            // Extract the numbers from the format (X/Y rolled)
            const match = rollCountText.match(/\((\d+)\/(\d+) rolled\)/);
            expect(match).not.toBeNull();
            
            if (match) {
              const rolledCount = parseInt(match[1]);
              const totalCount = parseInt(match[2]);
              
              // All items should be rolled
              expect(rolledCount).toBe(totalCount);
              // The total count should match our expected count
              expect(totalCount).toBe(expectedGroup.count);
            }
          }
        } else {
          // Non-condensed items should not have roll count labels
          const rollCountSpan = row.locator('.roll-count');
          const isVisible = await rollCountSpan.count() > 0;
          expect(isVisible).toBe(false);
        }
      }
    }
  });

  test('should only show condense option when table has duplicates', async ({ page }) => {
    // First verify that our test table with duplicates shows the option
    await expect(page.locator('[data-testid="condense-checkbox"]')).toBeVisible();
    
    // Now create a new table without duplicates
    await page.goto('/#/import');
    await page.waitForTimeout(500);
    
    // Make sure "Remove duplicates" option is unchecked
    const removeDuplicatesCheckbox = page.locator('[data-testid="remove-duplicates-checkbox"]');
    if (await removeDuplicatesCheckbox.isChecked()) {
      await removeDuplicatesCheckbox.uncheck();
    }
    
    await page.locator('[data-testid="table-name-input"]').fill('No Duplicates Table');
    
    // Create a table with no duplicates
    await page.locator('[data-testid="table-content-textarea"]').fill(
      'Item 1\nItem 2\nItem 3\nItem 4\nItem 5'
    );
    
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Navigate directly to the table's roll page using the URL
    const tableId = await page.evaluate(() => {
      const tables = JSON.parse(localStorage.getItem('randomTables') || '[]');
      const table = tables.find(t => t.name === 'No Duplicates Table');
      return table ? table.id : null;
    });
    
    if (tableId) {
      // Navigate directly to the table's roll page
      await page.goto(`/#/table/${tableId}/roll`);
      await page.waitForTimeout(1000);
      
      // Make sure the table is fully loaded
      await expect(page.locator('[data-testid="roll-table-container"]')).toBeVisible();
      
      // The condense option should NOT be visible for a table without duplicates
      await expect(page.locator('[data-testid="condense-checkbox"]')).not.toBeVisible();
    }
  });
});
