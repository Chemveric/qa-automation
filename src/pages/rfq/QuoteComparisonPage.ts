import { Page, expect } from '@playwright/test';
export class QuoteComparisonPage {
  constructor(private page: Page) {}
  async open(rfqId: number) { await this.page.goto(`/rfq/${rfqId}/compare`); }
  async expectTable() {
    await expect(this.page.locator('[data-testid="quote-compare-table"]')).toBeVisible();
  }
}
