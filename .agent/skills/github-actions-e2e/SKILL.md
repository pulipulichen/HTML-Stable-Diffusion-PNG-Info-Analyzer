---
name: github-actions-e2e
description: Set up automated E2E testing using Docker Compose and GitHub Actions.
---

# GitHub Actions E2E Testing Skill

This skill provides instructions for setting up automated end-to-end (E2E) testing that runs inside a Docker container via GitHub Actions.

## Instructions

### 1. Project Requirements
- **Docker Compose**: The project should have a `docker-compose.yml` file.
- **Test Runner Service**: A service (e.g., `test-runner`) in `docker-compose.yml` that executes the tests and returns a non-zero exit code on failure.
- **Test Directory**: A directory (e.g., `e2e/`) containing the test files.

### 2. Configure GitHub Action Workflow
Create a file at `.github/workflows/e2e.yml` with the following content:

```yaml
name: E2E Tests

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Run E2E tests with Docker Compose
      run: |
        docker compose up --build --exit-code-from test-runner

    - name: Upload Playwright Report (Optional)
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 3. Notification Setup
- GitHub Actions automatically sends email notifications to the repository owner and the person who triggered the workflow if a run fails.
- To ensure notifications are active:
    1. Go to **Settings** > **Notifications** on GitHub.
    2. Check that **Actions** notifications are enabled.

### 4. Verification
- Push the changes to GitHub.
- Navigate to the **Actions** tab in the repository to monitor the progress.
- If tests fail, the job will market as failed (Red Cross) and an email will be sent.
