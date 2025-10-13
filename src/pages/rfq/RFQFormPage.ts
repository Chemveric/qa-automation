import { Page, expect } from '@playwright/test';
export class RFQFormPage {
  constructor(private page: Page) {}
  async open() { await this.page.goto('/rfq/new'); }
  async fillStep1(title: string, description: string) {
    await this.page.getByLabel(/title/i).fill(title);
    await this.page.getByLabel(/description/i).fill(description);
    await this.page.getByRole('button', { name: /next/i }).click();
  }
  async selectConfidentiality(level: 'open'|'restricted'|'internal' = 'restricted') {
    await this.page.getByRole('combobox', { name: /confidentiality/i }).selectOption(level);
  }
  async submit() {
    await this.page.getByRole('button', { name: /submit/i }).click();
    await expect(this.page.getByText(/rfq submitted|success/i)).toBeVisible({ timeout: 15000 });
  }
}
