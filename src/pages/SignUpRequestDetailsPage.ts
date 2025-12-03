import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";

export class SignupRequestDetailsPage extends BasePage {
  readonly approveButton;
  readonly cancelButton;
  readonly rejectButton;
  readonly rejectReason;
  readonly menuItemSignUpRequests;
  readonly approveSignUpRequestDialog;
  readonly rejectSignupRequestDialog;
  readonly successRejectmMessage;


  constructor(page: Page) {
    super(page, "", "");
    this.approveButton = page.getByRole("button", { name: "Approve" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.rejectButton = page.getByRole("button", { name: "Reject" });
    this.rejectReason = page.getByRole("textbox", {
      name: "Reason for rejection",
    });
    this.menuItemSignUpRequests = page.getByRole("menuitem", {
      name: "Sign up requests",
    });
    this.approveSignUpRequestDialog = page.getByRole("dialog", {
      name: "Approve Sign Up Request",
    });
    this.rejectSignupRequestDialog = page.getByRole("dialog", {
      name: "Reject Sign Up Request",
    });
     this.successRejectmMessage = page.getByText(/Sign Up Request has been successfully rejected./i);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/signup-requests\/[0-9a-fA-F-]+\/show/);
    await expect(
      this.page.getByRole("heading", { name: /Sign up request details/i })
    ).toBeVisible();
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

  /**
   * Extract request UUID from URL
   */
  getRequestId(): string {
    const url = new URL(this.page.url());
    const parts = url.pathname.split("/");
    return parts[parts.length - 2]; // safe and TS-compatible
  }
}
