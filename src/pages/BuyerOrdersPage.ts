import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class BuyerOrdersPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageName;
  readonly expectedColumns;
  readonly gridColumnTitle;
  readonly tabs;
  readonly expectedTabs;
  readonly chips;
  readonly chipRoots;
  readonly firstPendingRow;

  constructor(page: Page) {
    super(page, "/dashboard/orders", ENV.guest.url);
    this.sidebar = new UserSidebar(page);

    this.pageName = page.getByRole("heading", { name: "My Orders" });
    this.gridColumnTitle = page.locator(".MuiDataGrid-columnHeaderTitle");
    this.expectedColumns = [
      "Structure",
      "Order Number",
      "Estimated Delivery",
      "Name",
      "Pack Size",
      "Pack Amount",
      "Price",
      "Status",
      "Supplier",
    ];

    this.tabs = {
      all: page.getByRole("tab", { name: "All" }),
      pending: page.getByRole("tab", { name: "Pending" }),
      shipping: page.getByRole("tab", { name: "Shipping" }),
      completed: page.getByRole("tab", { name: "Completed" }),
    };
    this.expectedTabs = ["All", "Pending", "Shipping", "Completed"];
    this.chips = page.locator(".MuiChip-colorWarning .MuiChip-label");
    this.chipRoots = page.locator(".MuiChip-colorWarning");
    this.firstPendingRow = page
      .locator(".MuiChip-colorWarning .MuiChip-label")
      .filter({ has: this.page.getByText("Pending") })
      .first();
  }

  async assertOrderPageLoaded() {
    await expect(this.pageName).toBeVisible();
  }

  async assertTabsVisible() {
    for (const tabName of this.expectedTabs) {
      const tab = this.page.getByRole("tab", { name: tabName });
      await expect(tab).toBeVisible();
    }
  }

  async assertColumnsVisible() {
    for (const column of this.expectedColumns) {
      const locator = this.gridColumnTitle.filter({ hasText: column });
      await locator.scrollIntoViewIfNeeded();
      await expect(locator).toBeVisible();
    }
  }

  async checkOrdersStatus(status: string) {
    await expect(this.chips).not.toHaveCount(0);
    const count = await this.chips.count();
    for (let i = 0; i < count; i++) {
      await expect(this.chips.nth(i)).toHaveText(status);
    }
  }

  async checkPendingOrdersStatusAndStatusColor() {
    const chipLabels = this.chipRoots.locator(".MuiChip-label");

    await expect(this.chipRoots).not.toHaveCount(0);
    const count = await this.chipRoots.count();
    for (let i = 0; i < count; i++) {
      await expect(chipLabels.nth(i)).toHaveText("pending");
      await expect(this.chipRoots.nth(i)).toHaveCSS(
        "background-color",
        "rgb(255, 243, 224)"
      );

      await expect(chipLabels.nth(i)).toHaveCSS("color", "rgb(239, 108, 0)");
    }
  }

  async clickTab(tabName: keyof typeof this.tabs) {
    await this.tabs[tabName].click();
  }

  async clickOnFirstPendingOrder() {
    await this.firstPendingRow.click();
  }
}
