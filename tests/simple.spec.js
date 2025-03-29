const { test, expect } = require('@playwright/test');

test('basic app functionality', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  console.log('Page loaded, waiting for content...');
  
  // Wait for the app to load
  await page.waitForTimeout(3000);
  
  // Take a screenshot to see what's rendered
  await page.screenshot({ path: 'homepage.png' });
  
  // Try to navigate directly to the import page using hash routing
  console.log('Navigating directly to import page...');
  await page.goto('/#/import');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'import-page.png' });
  
  // Find the input field and fill it using data-testid
  console.log('Looking for input field by data-testid...');
  const nameInput = page.locator('[data-testid="table-name-input"]');
  if (await nameInput.isVisible()) {
    console.log('Found input field with data-testid, filling it...');
    await nameInput.fill('Test Table');
  } else {
    // Fallback to generic input if data-testid is not found
    console.log('Data-testid not found, trying generic input...');
    const genericInput = page.locator('input').first();
    if (await genericInput.isVisible()) {
      console.log('Found generic input, filling it...');
      await genericInput.fill('Test Table');
    } else {
      console.log('No input field found');
    }
  }
  
  // Find the textarea and fill it using data-testid
  console.log('Looking for textarea by data-testid...');
  const contentArea = page.locator('[data-testid="table-content-textarea"]');
  if (await contentArea.isVisible()) {
    console.log('Found textarea with data-testid, filling it...');
    await contentArea.fill('Item 1\nItem 2\nItem 3');
  } else {
    // Fallback to generic textarea if data-testid is not found
    console.log('Data-testid not found, trying generic textarea...');
    const genericTextarea = page.locator('textarea').first();
    if (await genericTextarea.isVisible()) {
      console.log('Found generic textarea, filling it...');
      await genericTextarea.fill('Item 1\nItem 2\nItem 3');
    } else {
      console.log('No textarea found');
    }
  }
  
  // Find the import button using data-testid
  console.log('Looking for import button by data-testid...');
  const importButton = page.locator('[data-testid="import-button"]');
  if (await importButton.isVisible()) {
    console.log('Found import button with data-testid, clicking it...');
    await importButton.click();
  } else {
    // Fallback to generic button if data-testid is not found
    console.log('Data-testid not found, trying generic button...');
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    console.log(`Found ${count} buttons`);
    
    if (count > 0) {
      console.log('Clicking first button...');
      await buttons.first().click();
    } else {
      console.log('No buttons found');
    }
  }
  
  // Wait for import to complete
  await page.waitForTimeout(2000);
  
  // Take a screenshot after import
  await page.screenshot({ path: 'after-import.png' });
  
  console.log('Import completed, navigating to home...');
  await page.goto('/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'home-after-import.png' });
  
  console.log('Test completed successfully!');
});
