import { Page, expect } from '@playwright/test';
export class ProductDetailPage {
  constructor(private page: Page) {}
  async assertLoaded(name: string) {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }
  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }
}
