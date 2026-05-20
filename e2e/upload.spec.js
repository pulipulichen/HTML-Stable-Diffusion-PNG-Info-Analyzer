import { test, expect } from '@playwright/test';

test('should load demo images and render sidebar thumbnails', async ({ page }) => {
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
  await expect(sidebarItems.first()).toBeVisible();

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});