import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { BuyerProductDetailsPage } from "./BuyerProductDetailsPage";

export class UserMainProductsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly search;

  constructor(page: Page) {
    super(page, "products", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.search = page.getByRole("textbox", {
      name: "Search by chemical name, CAS",
    });
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Products Marketplace" })
    ).toBeVisible();
  }

  async assertProductIsFound(productName: string) {
    await expect(this.page.getByText(productName).first()).toBeVisible();
  }

  async assertProductNameIsVisible(productName: string) {
    await expect(
      this.page.getByRole("heading", {
        name: productName,
      })
    ).toBeVisible();
  }

  async searchForProduct(partialProductName: string) {
    await this.search.click();
    await this.search.fill(partialProductName);
  }

  /**
   * Click any product card by displayed name
   * and return ProductDetailsPage.
   */
  async openProductByName(name: string): Promise<BuyerProductDetailsPage> {
    const productCard = this.page.getByText(name).first();

    await Promise.all([
      this.page.waitForURL("**/products/*"),
      productCard.click(),
    ]);

    return new BuyerProductDetailsPage(this.page);
  }
}
