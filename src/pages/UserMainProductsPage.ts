import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class UserMainProductsPage extends BasePage {
  readonly sidebar: UserSidebar;

  constructor(page: Page) {
    super(page, "products", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Products Marketplace" })
    ).toBeVisible();
  }
}
