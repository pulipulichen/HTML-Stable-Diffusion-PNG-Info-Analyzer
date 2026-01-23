---
name: e2e-test-generator
description: Generate Playwright E2E test scripts compatible with the project's Docker-based infrastructure.
---

# E2E Test Generator Skill

This skill provides instructions for generating Playwright test scripts that are designed to run within the project's Docker-based testing environment.

## Infrastructure Context

The project uses a Docker-based test runner defined in `docker-compose.yml` and `Dockerfile.test`.
- **Base URL**: `http://localhost:8080` (mapped within Docker).
- **Test Command**: `npm start` (runs `docker compose up --build`).
- **Test Directory**: `e2e/`.
- **Tech Stack**: Playwright, Node.js, `http-server`.

## Test Script Template

Create new tests in the `e2e/` directory with the `.spec.js` extension.

```javascript
import { test, expect } from '@playwright/test';

test('describe the test scenario', async ({ page }) => {
  // 1. Navigate to the app
  await page.goto('http://localhost:8080');

  // 2. Setup console error tracking (recommended)
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. Perform actions
  // Example: await page.locator('#button-id').click();

  // 4. Assertions
  // Example: await expect(page.locator('h1')).toBeVisible();

  // 5. Final checks
  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});
```

## Common Patterns

### Waiting for Elements
Use `waitFor()` or specific Playwright assertions that include automatic waiting:
```javascript
const element = page.locator('#my-element');
await element.waitFor();
await expect(element).toBeVisible({ timeout: 60000 });
```

### Checking List Counts
```javascript
const items = page.locator('#item-list > div');
await expect(items).toHaveCount(3);
```

### Triggering Demo/Internal Actions
The project includes specific buttons for testing (e.g., `#loadDemoImagesButton`). Use these to populate data without complex external dependencies.

## Workflow

1. **Create Test**: Add a file to `e2e/file-name.spec.js`.
2. **Run Test**: Execute `npm start` in the terminal.
3. **Debug**: Check the output or examine the `playwright-report-videos/` directory if configured.
