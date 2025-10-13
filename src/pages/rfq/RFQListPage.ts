import { Page, expect } from '@playwright/test';
export class RFQListPage {
  constructor(private page: Page) {}
  async open() { await this.page.goto('/rfq'); }
  async expectRfqVisible(title: string) {
    await expect(this.page.locator('[data-testid="rfq-card"]', { hasText: title })).toBeVisible({ timeout: 15000 });
  }
}
