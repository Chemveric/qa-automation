import { BasePage } from '../core/BasePage';
import { Page, expect } from '@playwright/test';
import { ENV } from '../config/env';
import { log } from '../core/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Opens the Admin UI and waits for redirect to Auth0 login page.
   * Adds additional wait to ensure elements are rendered in headless mode.
   */
  async open() {
    log.step('Navigate to Admin UI (Auth0 login expected)');
    await this.page.goto(ENV.uiURL);

    // Wait until we are redirected to Auth0 login page
    await this.page.waitForURL(/auth0\.com\/u\/login/, { timeout: 30000 });

    // Give the page time to render all Auth0 fields (headless browsers are slower)
    await this.page.waitForTimeout(3000);

    // Wait for email input field to be visible
    await expect(this.page.getByPlaceholder('Email address')).toBeVisible({ timeout: 20000 });
  }

  /**
   * Performs login on Auth0 page and waits for redirect back to Admin dashboard.
   * Includes multiple locator strategies and wait time for stability.
   */
  async login(email: string, password: string) {
    log.step(`Login as ${email}`);

    // Fill the email field (by placeholder or label as fallback)
    const emailField = this.page.getByPlaceholder('Email address').or(this.page.getByLabel(/email/i));
    await emailField.fill(email);

    // Fill the password field (by placeholder or label as fallback)
    const passField = this.page.getByPlaceholder('Password').or(this.page.getByLabel(/password/i));
    await passField.fill(password);

    // Small delay before clicking (helps avoid stale element issues)
    await this.page.waitForTimeout(1000);

    // Click the Continue button to submit
    await this.page.getByRole('button', { name: /^Continue$/ }).click();

    // Wait for redirect back to Admin UI
    await this.page.waitForURL(/admin-chemveric\.dev\.gdev\.group/, { timeout: 60000 });
  }
}
