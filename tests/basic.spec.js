const { test, expect } = require('@playwright/test');

test.describe('Basic Functionality Tests', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify the app title is present
    const appTitle = await page.locator('h1, h2').first();
    await expect(appTitle).toBeVisible();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/test-results/homepage.png' });
  });

  test('should navigate to import page directly', async ({ page }) => {
    // Navigate directly to the import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the import page using data-testid
    const importTitle = page.locator('[data-testid="import-title"]');
    await expect(importTitle).toBeVisible();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/test-results/import-page.png' });
  });
  
  test('should be able to fill import form', async ({ page }) => {
    // Navigate directly to the import page using hash routing
    await page.goto('/#/import');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Find the input field and fill it using data-testid
    const nameInput = page.locator('[data-testid="table-name-input"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test Table Name');
    
    // Find the textarea and fill it using data-testid
    const textArea = page.locator('[data-testid="table-content-textarea"]');
    await expect(textArea).toBeVisible();
    await textArea.fill('Item 1\nItem 2\nItem 3');
    
    // Find the import button using data-testid
    const importButton = page.locator('[data-testid="import-button"]');
    await expect(importButton).toBeVisible();
    
    // Take a screenshot of the filled form
    await page.screenshot({ path: 'test-results/test-results/filled-form.png' });
  });
});
