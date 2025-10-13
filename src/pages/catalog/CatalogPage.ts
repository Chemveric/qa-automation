import { expect, Page } from '@playwright/test';
export class CatalogPage {
  constructor(private page: Page) {}
  async goto() { await this.page.goto('/'); }
  get productCard() { return this.page.locator('[data-testid="product-card"]'); }
  async searchText(q: string) {
    await this.page.getByPlaceholder(/search|cas|name/i).fill(q);
    await this.page.keyboard.press('Enter');
  }
  async searchByCAS(cas: string) { await this.searchText(cas); }
  async addToCartByName(name: string) {
    const card = this.page.locator('[data-testid="product-card"]', { hasText: name });
    await card.getByRole('button', { name: /add to cart/i }).click();
  }
  async openCart() {
    await this.page.getByRole('button', { name: /cart|basket/i }).click();
  }
  cartItem(name: string) {
    return this.page.locator('[data-testid="cart-item"]', { hasText: name });
  }
}
