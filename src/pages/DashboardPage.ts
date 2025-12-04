import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class DashboardPage extends BasePage {
  readonly heading;
  readonly pendingRequestsTab;
  readonly allRequestsTab;
  readonly approvedRequestsTab;
  readonly rejectedRequestsTab;
  readonly approveButton;
  readonly rejectButton;
  readonly rejectReason;
  readonly successRejectmMessage;
  readonly menuItemSignUpRequests;
  readonly cancelButton;
  readonly approveSignUpRequestDialog;
  readonly rejectSignupRequestDialog;
  readonly firstRequest;

  constructor(page: Page) {
    super(page, "/#/signup-requests", ENV.uiURL);
    this.heading = page.getByRole("heading", { name: "Sign up requests" });
    this.pendingRequestsTab = page.getByRole("tab", { name: "Pending" });
    this.allRequestsTab = page.getByRole("tab", { name: "All" });
    this.approvedRequestsTab = page.getByRole("tab", { name: "Approved" });
    this.rejectedRequestsTab = page.getByRole("tab", { name: "Rejected" });
    this.approveButton = page.getByRole("button", { name: "Approve" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.rejectButton = page.getByRole("button", { name: "Reject" });
    this.rejectReason = page.getByRole("textbox", {
      name: "Reason for rejection",
    });
    this.successRejectmMessage = page.getByText(/Sign Up Request has been successfully rejected./i);
    this.menuItemSignUpRequests = page.getByRole("menuitem", {
      name: "Sign up requests",
    });
    this.approveSignUpRequestDialog = page.getByRole("dialog", {
      name: "Approve Sign Up Request",
    });
    this.rejectSignupRequestDialog = page.getByRole("dialog", {
      name: "Reject Sign Up Request",
    });
    this.firstRequest = page.getByText(/nadiia.patrusheva/i).first();
  }

  async assertLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async assertSignUpRequestDialogIsVisible() {
    await expect(this.approveSignUpRequestDialog).toBeVisible();
  }

  async assertSignUpRequestDialogIsNotVisible() {
    await expect(this.approveSignUpRequestDialog).not.toBeVisible();
  }

  async assertRejectSignUpRequestDialogIsVisible() {
    await expect(this.rejectSignupRequestDialog).toBeVisible();
  }

  async assertSuccessRejectMessage() {
    await expect(this.successRejectmMessage).toBeVisible();
  }

  async openPendingRequestsTab() {
    await this.pendingRequestsTab.click();
  }

  async openApprovedRequestsTab() {
    await this.approvedRequestsTab.click();
  }

  async openRejectedRequestsTab() {
    await this.rejectedRequestsTab.click();
  }

  async approveSignupRequest() {
    const row = this.page
      .locator(".MuiTableRow-root")
      .filter({ has: this.page.getByText(/nadiia.patrusheva/i) })
      .first();

    await row.getByRole("button", { name: /Approve/i }).click();
  }

  async rejectSignupRequest() {
    const row = this.page
      .locator(".MuiTableRow-root")
      .filter({ has: this.page.getByText(/nadiia.patrusheva/i) })
      .first();

    await row.getByRole("button", { name: /Reject/i }).click();
  }

  async clickApprove() {
    await this.approveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickReject() {
    await this.rejectButton.click();
  }

  async addRejectReason() {
    await this.rejectReason.fill("AQA test");
  }

  async openRequestDetails(){
    await this.firstRequest.click();
  }
}
