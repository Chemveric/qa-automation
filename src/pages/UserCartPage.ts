import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
import { faker } from "@faker-js/faker";

export class UserCartPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly heading;
  readonly checkoutButton;
  readonly successRemoveMessage;

  constructor(page: Page) {
    super(page, "/dashboard/cart", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.heading = page.getByRole("heading", { name: "My Cart" });
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.successRemoveMessage = page.getByText(
      /Product successfully removed from your cart/i
    );
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible();
  }
  async assertProductNameIsVisible(productName: string) {
    await expect(
      this.page.getByRole("heading", {
        name: productName,
      }).first()
    ).toBeVisible();
  }

  async assertProductRemoved(){
    await expect(this.successRemoveMessage).toBeVisible();
  }

async removeProduct(productName: string) {
  const item = this.page.locator('.MuiStack-root').filter({
    has: this.page.getByText(productName, { exact: false })
  });

  await item.getByRole("button", { name: /remove/i }).first().click();
}
}
