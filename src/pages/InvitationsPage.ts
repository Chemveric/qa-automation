import { BasePage } from '../core/BasePage';
import { Page, expect } from '@playwright/test';

export class InvitationsPage extends BasePage {
  constructor(page: Page) {
    super(page, '/#/invitations');
  }

  async open() {
    await this.goto(this.path);
    await expect(this.page.getByRole('link', { name: /create/i })).toBeVisible();
  }

  async openCreateForm() {
    await this.page.getByRole('link', { name: /create/i }).click();
    await expect(this.page).toHaveURL(/#\/invitations\/create/);
  }

  async fillAndSend(first: string, last: string, email: string, company: string) {
    await this.page.getByLabel(/first name/i).fill(first);
    await this.page.getByLabel(/last name/i).fill(last);
    await this.page.getByLabel(/^email$/i).fill(email);
    await this.page.getByLabel(/company name/i).fill(company);
    await this.page.getByRole('button', { name: /send invitation/i }).click();
    await expect(this.page.getByText(/invitation is sent/i)).toBeVisible({ timeout: 15000 });
  }
}
