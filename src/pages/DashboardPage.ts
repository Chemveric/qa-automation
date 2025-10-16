import { BasePage } from '../core/BasePage';
import { Page, expect } from '@playwright/test';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, '/#/signup-requests');
  }

  async assertLoaded() {
    await this.goto(this.path);
    await expect(this.page.getByRole('heading', { name: 'Sign up requests' })).toBeVisible();
  }
}
