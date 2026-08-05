import type { GitHubActionOptions } from '@estruyf/github-actions-reporter';
import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { getCurrentEnvironment } from './tests/support/utils/environmentsConfig';
import { settings, validateSettings } from './tests/support/utils/settingsConfig';


// Validate settings
validateSettings();

const TEST_ENV = getCurrentEnvironment().name;

// Reporters
const reporters: ReporterDescription[] = [
  ['allure-playwright', { resultsDir: 'allure-results' }],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['line'],
];

// The GitHub Actions reporter writes to the Actions job summary and only works
// inside that runtime. Run locally it throws "__dirname is not defined" (it
// relies on CommonJS globals that don't exist under our ESM config) and
// pollutes every run's output, so gate it behind the CI env flag.
if (process.env.CI) {
  reporters.push([
    '@estruyf/github-actions-reporter',
    <GitHubActionOptions>{
      title: 'Playwright Test Report',
      useDetails: true,
      showError: true,
    },
  ]);
}

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Match worker count to available CPU cores */
  workers: settings.workers,
  /* Global timeout for entire test run (15 minutes for DST tests in CI only) */
  globalTimeout: process.env.CI && TEST_ENV === 'local' ? 900000 : undefined, // DST tests only (TEST_ENV=local)

  reporter: reporters,
  /* Timeout varies by test type:
   * - DST tests (local): 15s (fast, no network calls)
   * - E2E tests (qa): 60s (slower, real network calls)
   * Individual tests can override with test.setTimeout() */
  timeout: 60000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: settings.baseURL,
    headless: process.env.CI ? true : false,
    actionTimeout: 60000,
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    bypassCSP: true,
    launchOptions: {
      args: [
        '--disable-web-security', // Disable CORS for testing
        '--disk-cache-size=1', // Minimize disk cache to reduce I/O
        '--media-cache-size=1', // Minimize media cache
      ],
    },
    /* Use persistent context for DST tests to cache browser state and reduce cold start overhead */
    /* Only use Chrome channel locally - CI uses bundled Chromium from Docker image */
    ...(TEST_ENV === 'local' && !process.env.CI ? {
      channel: 'chrome', // Use system Chrome for better caching (local only)
    } : {}),
  },
  expect: {
    timeout: 30000,  // Increase the default timeout for expect assertions globally
    // Visual comparison settings

    toHaveScreenshot: {
      threshold: 0.2,
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
 
  projects: [
    {
      name: 'default',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // DST tests (local) start unauthenticated; E2E tests (qa) reuse saved login session
        storageState: TEST_ENV === 'local'
          ? 'tests/.auth/unauthenticated.json'
          : 'tests/.auth/authenticated.json',
      },
    },
  ],
});
