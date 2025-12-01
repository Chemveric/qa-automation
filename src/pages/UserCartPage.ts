import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
import { faker } from "@faker-js/faker";

export class UserCartPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly heading;
  readonly cartProduct;
  readonly checkoutButton;
  readonly removeItemButton;

  constructor(page: Page) {
    super(page, "/dashboard/cart", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.heading = page.getByRole("heading", { name: "My Cart" });
    this.cartProduct = page.getByRole('heading', { name: 'L-Asparagine monohydrate' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.removeItemButton = page.getByRole('button', { name: 'Remove Item' }).first();
    
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible();
  }
  async assertCartProductNameIsVisible(){
    await expect(this.cartProduct).toBeVisible();
  }

  async removeItemFromTheCart(){
    await this.removeItemButton.click();
  }
}




