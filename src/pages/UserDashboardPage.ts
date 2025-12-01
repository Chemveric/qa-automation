import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class UserDashboardPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly companyManagement;
  readonly teamManagement;
  readonly productCatalogManagement;
  readonly cart;

  constructor(page: Page) {
    super(page, "dashboard", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.companyManagement = page.getByRole("button", {
      name: "Company Management",
    });
    this.teamManagement = page.getByRole("button", {
      name: "Team Management",
    });
    this.productCatalogManagement = page.getByRole("button", {
      name: "Product Catalog Management",
    });
    this.cart = page.getByRole('button', { name: 'Cart' });
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  }

  async clickOnCompanyManagement() {
    await this.companyManagement.click();
  }

  async clickOnTeamManagement() {
    await this.teamManagement.click();
  }

  async clickOnProductCatalogManagement() {
    await this.productCatalogManagement.click();
  }

  async clickOnCart(){
    await this.cart.click();
  }
}
