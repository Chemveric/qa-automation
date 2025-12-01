import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class UserMainProductsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly search;
  readonly firstFoundElement;
  readonly productName;
  readonly packSizeColumn;
  readonly pricePerPackColumn;
  readonly pricePerUnitColumn;
  readonly addToCartButton;
  readonly successMessage;

  constructor(page: Page) {
    super(page, "products", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.search = page.getByRole("textbox", {
      name: "Search by chemical name, CAS",
    });
    this.firstFoundElement = page.getByText("L-Asparagine monohydrate").first();
    this.productName = page.getByRole("heading", {
      name: "L-Asparagine monohydrate",
    });
    this.packSizeColumn = page.getByRole("columnheader", { name: "Pack Size" });
    this.pricePerPackColumn = page.getByRole("columnheader", {
      name: "Price per Pack",
    });
    this.pricePerUnitColumn = page.getByRole("columnheader", {
      name: "Price per Unit",
    });
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.successMessage = page.getByText(/Product successfully added to your cart/i);
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Products Marketplace" })
    ).toBeVisible();
  }

  async assertProductIsFound() {
    await expect(this.firstFoundElement).toBeVisible();
  }

  async assertProductNameIsVisible() {
    await expect(this.productName).toBeVisible();
  }

  async assertColumnNamesAreVisisble() {
    await expect(this.packSizeColumn).toBeVisible();
    await expect(this.pricePerPackColumn).toBeVisible();
    await expect(this.pricePerUnitColumn).toBeVisible();
  }

  async assertProductAddedToCart(){
    await expect(this.successMessage).toBeVisible();
  }

  async searchForProduct() {
    await this.search.click();
    await this.search.fill("asparagine");
  }

  async openProductDetails() {
    await this.firstFoundElement.click();
  }

  async addProductToCart(){
    await this.addToCartButton.click();
  }
}
