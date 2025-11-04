import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const UI_URL = process.env.CHEMVERIC_UI_URL || 'https://admin-chemveric.dev.gdev.group';

export default defineConfig({
  testDir: './tests',
  globalSetup: path.join(__dirname, 'src/config/globalSetup.ts'),
  timeout: 70_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright']
  ],
  use: {
    headless: false,
    baseURL: UI_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1400, height: 900 }
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  outputDir: 'test-results'
});

