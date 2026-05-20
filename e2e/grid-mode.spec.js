import { test, expect } from '@playwright/test';

test('should switch grid view and resize thumbnails', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:8080');

  const demoButton = page.locator('[data-action="load-demo-images"]').first();
  await demoButton.waitFor();
  await demoButton.click();

  const sidebarItems = page.locator('#gallery-list > div[id^="thumb-"]');
  await expect.poll(async () => sidebarItems.count(), { timeout: 60000 }).toBeGreaterThan(0);

  await page.locator('#btn-view-grid').click();
  await expect(page.locator('#grid-view')).toBeVisible();
  await expect(page.locator('#single-view')).toBeHidden();

  const gridCards = page.locator('#grid-cards > div[id^="grid-card-"]');
  await expect.poll(async () => gridCards.count(), { timeout: 60000 }).toBeGreaterThan(0);

  const firstCardImage = gridCards.first().locator('img').first();
  await expect(firstCardImage).toHaveClass(/h-40/);

  await page.locator('#btn-grid-size-sm').click();
  await expect(firstCardImage).toHaveClass(/h-32/);

  await page.locator('#btn-grid-size-lg').click();
  await expect(firstCardImage).toHaveClass(/h-56/);

  await page.keyboard.press('g');
  await expect(page.locator('#single-view')).toBeVisible();
  await expect(page.locator('#grid-view')).toBeHidden();

  await page.keyboard.press('g');
  await expect(page.locator('#grid-view')).toBeVisible();

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});
