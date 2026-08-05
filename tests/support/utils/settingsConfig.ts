// Playwright Test Settings Configuration
import * as dotenv from 'dotenv';
import * as os from 'os';
import { getCurrentEnvironment } from './environmentsConfig';

// Load environment variables from .env file
dotenv.config({ quiet: true });

// Browser types supported by Playwright
export type BrowserType = 'chrome' | 'edge' | 'firefox' | 'safari';

export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface TestSettings {
  defaultBrowser: BrowserType;
  baseURL: string;
  workers?: number;
  availableBrowsers: readonly BrowserType[];
}

const getWorkerCount = (): number | undefined => {
  // An explicit PLAYWRIGHT_WORKERS overrides everything, including CI, so
  // sharded CI jobs can run more than one worker per shard (see e2e-nightly.yml).
  // Without an override, CI stays at a single worker.
  if (process.env.PLAYWRIGHT_WORKERS) return parseInt(process.env.PLAYWRIGHT_WORKERS, 10);
  if (process.env.CI) return 1;

  const cpuCount = os.availableParallelism?.() || os.cpus().length;

  // For DST tests (local), use 3 workers (optimal for Vite dev server)
  // For E2E tests (qa), use 25% of CPU cores (min 1, max 4)
  if (getCurrentEnvironment().name === 'local') {
    return 3;
  } else {
    return Math.max(1, Math.min(4, Math.floor(cpuCount / 4)));
  }
};

export const getCredentials = (): UserCredentials => {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  if (!username || !password) {
    throw new Error(
      `Missing required E2E credentials. Add them to your .env file (see .env-example).`,
    );
  }

  return {
    username: username,
    password: password,
    email: process.env.EMAIL || '',
  };
};

// Default settings with environment variable support
export const settings: TestSettings = {
  // Default browser for tests (when no browser is specified in filename)
  defaultBrowser: (process.env.DEFAULT_BROWSER as BrowserType) || 'chrome',

  // Base URL for your application - now environment-aware
  baseURL: (() => {
    const currentEnv = getCurrentEnvironment();
    return currentEnv.baseURL;
  })(),

  availableBrowsers: ['chrome', 'edge', 'firefox', 'safari'],

  workers: getWorkerCount(),
};

export const validateSettings = (): void => {
  if (!settings.baseURL) {
    throw new Error('Base URL must be specified');
  }

  if (!settings.availableBrowsers.includes(settings.defaultBrowser)) {
    throw new Error(`Invalid default browser: ${settings.defaultBrowser}`);
  }

  if (settings.workers !== undefined && (isNaN(settings.workers) || settings.workers <= 0)) {
    throw new Error(`Invalid worker count: ${settings.workers}`);
  }
};
