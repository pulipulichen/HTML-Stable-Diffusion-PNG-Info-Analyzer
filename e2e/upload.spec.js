import { test, expect } from '@playwright/test';
import path from 'path';

test('should upload demo images and show 3 items in sidebar', async ({ page }) => {
  await page.goto('http://localhost:8080');

  // Upload the PDF file
  // const filePath = path.resolve(__dirname, '../test/Healthkeep_八點體脂計入門指南.pdf');

  // console.log(`準備上傳檔案： ${filePath}`)
  const pdfUrlButton = page.locator('#loadDemoImagesButton');
  await pdfUrlButton.waitFor();
  await pdfUrlButton.click();

  // Wait for #sidebarContent > div to have data (up to 60 seconds)
  const sidebarItems = page.locator('#gallery-list > div');
  await sidebarItems.first().waitFor();
  await expect(sidebarItems.first()).toBeVisible({ timeout: 60000 });

  // Expect #sidebarContent > div to have 15 items (修改為預期的數量，例如 3)
  await expect(sidebarItems).toHaveCount(3, { timeout: 60000 });

  await checkFirstSplittedPiecesSize(page);
  // await downloadSVGFile(page);
});

// async function 