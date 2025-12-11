import { expect, Page, Locator } from "@playwright/test";
import { UserSidebar } from "./components/UserSidebar";
import { BasePage } from "../core/BasePage";
import { ENV } from "../config/env";

export class BuyerOrderDetailsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageTitle: Locator;
  readonly orderHeading: Locator;
  readonly pendingChip: Locator;
  readonly placedOnText: Locator;
  readonly supplierTab: Locator;

  // section headings
  readonly senderInformation: Locator;
  readonly recipientInformation: Locator;
  readonly orderSummary: Locator;
  readonly shipmentTracking: Locator;
  readonly paymentInformation: Locator;
  readonly supplierHeading: Locator;
  readonly orderedItemsHeading: Locator;

  constructor(page: Page) {
    super(page, "/dashboard/orders/:id", ENV.guest.url);

    this.sidebar = new UserSidebar(page);

    this.pageTitle = page.getByText("Order Details");
    this.orderHeading = page.getByRole("heading", { name: /Order ORD-/i });
    this.pendingChip = this.page.locator(
      ".MuiChip-root.MuiChip-colorWarning >> text=Pending"
    );
    this.placedOnText = page.getByText(/Placed on /i);

    this.supplierTab = page.getByRole("tab").first(); // OR set inside method

    // section headings
    this.senderInformation = page.getByRole("heading", {
      name: "Sender Information",
    });
    this.recipientInformation = page.getByRole("heading", {
      name: "Recipient Information",
    });
    this.orderSummary = page.getByRole("heading", { name: "Order Summary" });
    this.shipmentTracking = page.getByRole("heading", {
      name: "Shipment Tracking",
    });
    this.paymentInformation = page.getByRole("heading", {
      name: "Payment Information",
    });
    this.supplierHeading = page.getByRole("heading", {
      name: "Supplier",
      exact: true,
    });
    this.orderedItemsHeading = page.getByRole("heading", {
      name: "Ordered Items",
    });
  }

  /** Extract order ID from URL */
  async getOrderId() {
    return await this.page.url().split("/").pop()!;
  }

  /** Verify we are on order details page */
  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard\/orders\/[^/]+$/);
    await expect(this.pageTitle).toBeVisible();
  }

  /** Verify all sections exist */
  async assertAllSectionsVisible() {
    await expect(this.orderHeading).toBeVisible();
    await expect(this.pendingChip).toBeVisible();
    await expect(this.pendingChip).toHaveCSS("color", "rgb(239, 108, 0)");
    await expect(this.placedOnText).toBeVisible();

    await expect(this.senderInformation).toBeVisible();
    await expect(this.recipientInformation).toBeVisible();
    await expect(this.orderSummary).toBeVisible();
    await expect(this.shipmentTracking).toBeVisible();
    await expect(this.paymentInformation).toBeVisible();
    await expect(this.supplierHeading).toBeVisible();
    await expect(this.orderedItemsHeading).toBeVisible();
  }

  /** Verify supplier tab by name */
  async assertSupplierTab(name: string) {
    await expect(this.page.getByRole("tab", { name })).toBeVisible();
  }
}
