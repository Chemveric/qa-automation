import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.CHEMVERIC_BASE_URL || 'https://chemveric.dev.gdev.group';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit', use: { ...devices['Desktop Safari'] } }
  ]
});
