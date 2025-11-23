import { BasePage } from '../core/BasePage';
import { Page, expect } from '@playwright/test';
import { ENV } from '../config/env';

export class UserDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, 'dashboard', ENV.guest.url);
  }

  async assertLoaded() {
    await this.goto(this.path);
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }
}
