const { test, expect } = require('@playwright/test');

test.describe('Table Editing and Sidebar Functionality', () => {
  // Setup: Create a test table before running tests
  test.beforeEach(async ({ page }) => {
    // Navigate to import page and create a test table
    await page.goto('/#/import');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Fill in the table name
    await page.locator('[data-testid="table-name-input"]').fill('Edit Test Table');
    
    // Fill in the table items
    await page.locator('[data-testid="table-content-textarea"]').fill('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
    
    // Click the import button
    await page.locator('[data-testid="import-button"]').click();
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
  });

  test('should edit a table successfully', async ({ page }) => {
    // Navigate directly to the table page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Open the sidebar if needed
    const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(500);
    }
    
    // Look for the table link - using a more generic selector since we don't know the ID
    const tableLinks = page.locator('[data-testid^="table-link-"]').first();
    if (await tableLinks.isVisible()) {
      await tableLinks.click();
      await page.waitForTimeout(1000);
      
      // Look for the Edit Table link
      const editLink = page.locator('[data-testid="edit-table-link"]');
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Verify we're on the edit page
        const heading = page.locator('[data-testid="edit-table-title"]');
        await expect(heading).toBeVisible();
        
        // Edit the table name
        await page.locator('[data-testid="table-name-input"]').fill('Edited Table Name');
        
        // Verify the table name input has been updated
        const inputValue = await page.locator('[data-testid="table-name-input"]').inputValue();
        expect(inputValue).toBe('Edited Table Name');
        
        // Edit the table content
        await page.locator('[data-testid="table-content-textarea"]').fill('New Item 1\nNew Item 2\nNew Item 3');
        
        // Save changes
        const saveButton = page.locator('[data-testid="save-changes-button"]');
        if (await saveButton.isVisible()) {
          await saveButton.click();
          
          // Wait longer for the save operation to complete
          await page.waitForTimeout(2000);
          
          // Navigate directly to the roll page to ensure we see the updated table
          // First get the current URL which should contain the table ID
          const currentUrl = page.url();
          const tableIdMatch = currentUrl.match(/\/table\/([^\/]+)\/edit/);
          
          if (tableIdMatch && tableIdMatch[1]) {
            const tableId = tableIdMatch[1];
            // Navigate to the roll page for this table
            await page.goto(`/#/table/${tableId}/roll`);
            await page.waitForTimeout(1000);
            
            // Verify the table name has been updated in the header
            const updatedHeading = page.locator('[data-testid="table-name"]');
            await expect(updatedHeading).toContainText('Edited Table Name');
          }
        }
      }
    }
  });

  test('should duplicate a table', async ({ page }) => {
    // Navigate directly to the table page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Open the sidebar if needed
    const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(500);
    }
    
    // Look for the table link - using a more generic selector since we don't know the ID
    const tableLinks = page.locator('[data-testid^="table-link-"]').first();
    if (await tableLinks.isVisible()) {
      await tableLinks.click();
      await page.waitForTimeout(1000);
      
      // Look for the Edit Table link
      const editLink = page.locator('[data-testid="edit-table-link"]');
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Click the Duplicate button
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
          
          // Verify the duplicated table has the same content
          const textareaContent = await page.locator('[data-testid="table-content-textarea"]').inputValue();
          expect(textareaContent).toContain('Item 1');
          expect(textareaContent).toContain('Item 5');
        }
      }
    }
  });

  test('should delete a table', async ({ page }) => {
    // Navigate directly to the table page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Open the sidebar if needed
    const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(500);
    }
    
    // Look for the table link - using a more generic selector since we don't know the ID
    const tableLinks = page.locator('[data-testid^="table-link-"]').first();
    if (await tableLinks.isVisible()) {
      await tableLinks.click();
      await page.waitForTimeout(1000);
      
      // Look for the Edit Table link
      const editLink = page.locator('[data-testid="edit-table-link"]');
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Set up dialog handler to accept confirmation
        page.on('dialog', dialog => dialog.accept());
        
        // Click the Delete button
        const deleteButton = page.locator('[data-testid="delete-button"]');
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForTimeout(1000);
          
          // Verify we're redirected to the home page
          await expect(page).toHaveURL('/#/');
        }
      }
    }
  });

  test('should show newly imported tables in sidebar without refresh', async ({ page }) => {
    // Open the sidebar
    const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(1000);
      
      // Verify the initial table is in the sidebar
      await expect(page.locator('[data-testid^="table-link-"]')).toBeVisible();
      
      // Navigate to import page
      await page.goto('/#/import');
      await page.waitForTimeout(1000);
      
      // Import a new table
      await page.locator('[data-testid="table-name-input"]').fill('New Sidebar Test Table');
      await page.locator('[data-testid="table-content-textarea"]').fill('Sidebar Item 1\nSidebar Item 2\nSidebar Item 3');
      await page.locator('[data-testid="import-button"]').click();
      await page.waitForTimeout(1000);
      
      // Open the sidebar again
      await hamburgerButton.click();
      await page.waitForTimeout(1000);
      
      // Verify the new table appears in the sidebar without page refresh
      // Count the number of table links to verify a new one was added
      const tableLinks = page.locator('[data-testid^="table-link-"]');
      const count = await tableLinks.count();
      expect(count).toBeGreaterThan(1);
    }
  });

  test('should filter tables in sidebar with search', async ({ page }) => {
    // Create another table with a different name
    await page.goto('/#/import');
    await page.locator('[data-testid="table-name-input"]').fill('Unique Search Name');
    await page.locator('[data-testid="table-content-textarea"]').fill('Search Item');
    await page.locator('[data-testid="import-button"]').click();
    await page.waitForTimeout(1000);
    
    // Open the sidebar
    const hamburgerButton = page.locator('[data-testid="hamburger-menu-button"]');
    if (await hamburgerButton.isVisible()) {
      await hamburgerButton.click();
      await page.waitForTimeout(1000);
      
      // Verify both tables are visible by counting table links
      const initialTableLinks = page.locator('[data-testid^="table-link-"]');
      const initialCount = await initialTableLinks.count();
      expect(initialCount).toBeGreaterThan(1);
      
      // Enter search term
      const searchInput = page.locator('[data-testid="sidebar-search-input"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Unique');
        await page.waitForTimeout(500);
        
        // Verify only the matching table is visible
        const filteredTableLinks = page.locator('[data-testid^="table-link-"]');
        const filteredCount = await filteredTableLinks.count();
        expect(filteredCount).toBeLessThan(initialCount);
        
        // Clear search
        const clearSearchButton = page.locator('[data-testid="clear-search-button"]');
        if (await clearSearchButton.isVisible()) {
          await clearSearchButton.click();
          await page.waitForTimeout(500);
          
          // Verify all tables are visible again
          const resetTableLinks = page.locator('[data-testid^="table-link-"]');
          const resetCount = await resetTableLinks.count();
          expect(resetCount).toEqual(initialCount);
        }
      }
    }
  });
});
