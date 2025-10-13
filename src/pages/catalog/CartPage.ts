import { Page, expect } from '@playwright/test';
export class CartPage {
  constructor(private page: Page) {}
  async assertItemInCart(name: string) {
    await expect(this.page.locator('[data-testid="cart-item"]', { hasText: name })).toBeVisible();
  }
  async proceedToCheckout() {
    await this.page.getByRole('button', { name: /checkout/i }).click();
  }
}
