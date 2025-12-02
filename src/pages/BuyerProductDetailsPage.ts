import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class BuyerProductDetailsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageName;
  readonly packSizeColumn;
  readonly pricePerPackColumn;
  readonly pricePerUnitColumn;
  readonly addToCartButton;
  readonly successMessage;

  constructor(page: Page) {
    super(page, "", "");
    this.sidebar = new UserSidebar(page);
    this.pageName = page.getByText("Product Details Page");
    this.packSizeColumn = page.getByRole("columnheader", { name: "Pack Size" });
    this.pricePerPackColumn = page.getByRole("columnheader", {
      name: "Price per Pack",
    });
    this.pricePerUnitColumn = page.getByRole("columnheader", {
      name: "Price per Unit",
    });
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.successMessage = page.getByText(
      /Product successfully added to your cart/i
    );
  }

  /**
   * Extract product ID from current URL
   */
  async getProductId(): Promise<string> {
    // Ensure we really are on a product details page
    await this.page.waitForURL(/\/products\/([^\/]+)$/);

    const url = new URL(this.page.url());
    const id = url.pathname.split("/").pop();

    if (!id) {
      throw new Error(`Product ID not found in URL: ${url.pathname}`);
    }

    return id;
  }

  async assertLoaded() {
    await expect(this.pageName).toBeVisible();
  }

  async assertProductNameIsVisible(productName: string) {
    await expect(
      this.page.getByRole("heading", {
        name: productName,
      })
    ).toBeVisible();
  }

  async assertColumnNamesAreVisisble() {
    await expect(this.packSizeColumn).toBeVisible();
    await expect(this.pricePerPackColumn).toBeVisible();
    await expect(this.pricePerUnitColumn).toBeVisible();
  }

  async assertProductAddedToCart() {
    await expect(this.successMessage).toBeVisible();
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }
}
