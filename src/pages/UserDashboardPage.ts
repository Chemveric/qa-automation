import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class UserDashboardPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly companyManagement;

  constructor(page: Page) {
    super(page, "dashboard", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.companyManagement = page.getByRole("button", {
      name: "Company Management",
    });
  }

  async assertLoaded() {
    await this.goto(this.path);
    await expect(
      this.page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  }

  async clickOnCompanyManagement() {
    await this.companyManagement.click();
  }
}
