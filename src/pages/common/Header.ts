import { Page } from '@playwright/test';
export class Header {
  constructor(private page: Page) {}
  async openSignIn() {
    await this.page.getByRole('link', { name: /sign in|log in/i }).click();
  }
  async openCart() {
    await this.page.getByRole('button', { name: /cart|basket/i }).click();
  }
}
