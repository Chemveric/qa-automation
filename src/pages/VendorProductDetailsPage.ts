import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class VendorProductDetailsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageName;
  readonly packSizeColumn;
  readonly pricePerPackColumn;
  readonly pricePerUnitColumn;
  readonly structure2D;
  readonly structure3D;
  readonly structure2DImage;
  readonly productName;
  readonly chemicalInfoTab;
  readonly documentsTab;
  readonly supplierTab;
  readonly orderSummaryHeading;

  constructor(page: Page) {
    super(page, "dashboard/product-catalog/", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.pageName = page.getByText("Product Details Page");

    this.packSizeColumn = page.getByRole("columnheader", { name: "Pack Size" });
    this.pricePerPackColumn = page.getByRole("columnheader", {
      name: "Price per Pack",
    });
    this.pricePerUnitColumn = page.getByRole("columnheader", {
      name: "Price per Unit",
    });
    this.structure2D = page.getByRole("button", { name: "2D view" });
    this.productName = page.locator("h5");

    this.chemicalInfoTab = page.getByRole("tab", { name: "Chemical Info" });
    this.documentsTab = page.getByRole("tab", { name: "Documents" });
    this.supplierTab = page.getByRole("tab", { name: "Supplier" });
    this.structure3D = page.getByRole("button", { name: "3D view" });
    this.structure2DImage = page.getByRole('img', { name: '2D Structure' })
    this.orderSummaryHeading = page
      .getByRole("heading", { name: "Order Summary" })
      .click();
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard\/product-catalog\/[^/]+$/);
    await expect(this.pageName).toBeVisible();
  }

  async assertProductNameIsVisible() {
    await expect(this.productName).toBeVisible();
  }

  async assertStructuresAreVisible() {
    await expect(this.structure2D).toBeVisible();
    await expect(this.structure3D).toBeVisible()
    await expect(this.structure2DImage).toBeVisible();
  }

  async assertTabNamesAreVisible(){
    await expect(this.chemicalInfoTab).toBeVisible();
    await expect(this.documentsTab).toBeVisible();
    await expect(this.supplierTab).toBeVisible();
  }

  async assertColumnNamesAreVisisble() {
    await expect(this.packSizeColumn).toBeVisible();
    await expect(this.pricePerPackColumn).toBeVisible();
    await expect(this.pricePerUnitColumn).toBeVisible();
  }
}
