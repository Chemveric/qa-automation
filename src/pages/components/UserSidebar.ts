import { Page, Locator, expect } from "@playwright/test";
import { log } from "../../core/logger";

export class UserSidebar {
  private page: Page;
  readonly dashboard: Locator;
  readonly products: Locator;
  readonly services: Locator;
  readonly projects: Locator;
  readonly suppliers: Locator;
  readonly analytics: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboard = page.getByRole("link", { name: "Dashboard" });
    this.products = page.getByRole("link", { name: "Products" });
    this.services = page.getByRole("link", { name: "Services" });
    this.projects = page.getByRole("link", { name: "Projects" });
    this.suppliers = page.getByRole("link", { name: "Suppliers" });
    this.analytics = page.getByRole("link", { name: "Analytics" });
  }

  async openDashboard() {
    await this.dashboard.click();
    log.step("Open Dashboard Page");
  }

  async openProducts() {
    await this.products.click();
    log.step("Open Products Page");
  }

  async openServices() {
    await this.services.click();
    log.step("Open Services Page");
  }

  async openProjects() {
    await this.projects.click();
    log.step("Open Projects Page");
  }

  async openSuppliers() {
    await this.suppliers.click();
    log.step("Open Suppliers Page");
  }

  async openAnalytics() {
    await this.analytics.click();
    log.step("Open Analytics Page");
  }
}
