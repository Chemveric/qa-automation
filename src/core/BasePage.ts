import { Page, expect } from '@playwright/test';
import { log } from './logger';

export abstract class BasePage {
  constructor(protected page: Page, protected path?: string) {}

  async goto(relative?: string) {
    const base = process.env.CHEMVERIC_UI_URL || 'https://admin-chemveric.dev.gdev.group';
    const url = relative?.startsWith('http')
        ? relative
        : `${base}${relative || this.path || '/'}`;
    log.step(`Navigate to: ${url}`);
    await this.page.goto(url);
  }

  async waitForText(text: string | RegExp) {
    log.step(`Wait for text: ${text}`);
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async clickByText(text: string | RegExp) {
    log.step(`Click by text: ${text}`);
    await this.page.getByText(text).first().click();
  }
}
