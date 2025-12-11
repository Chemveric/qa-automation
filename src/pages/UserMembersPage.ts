import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
import { faker } from "@faker-js/faker";

type Role =
  | "Procurement Manager"
  | "Scientist/Researcher"
  | "Legal/Compliance"
  | "Customer Service"
  | "All";

export class UserMembersPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly inviteMemberButton;
  readonly memberFirstName;
  readonly memberLastName;
  readonly corporateEmail;
  readonly memberRolesDropdown;
  readonly saveChangesButton;
  readonly successMessage;
  readonly adminUserRadioButton;
  readonly firstNameErrorMessage;
  readonly lastNameErrorMessage;
  readonly emailErrorMessage;
  readonly resendButton;
  readonly cancelButton;
  readonly deleteButton;
  readonly successResendMessage;
  readonly successUpdatedMessage;
  readonly successDeleteMessage;
  readonly dialog;

  private readonly roleMap: Record<Role, Locator>;

  constructor(page: Page) {
    super(page, "/dashboard/members", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.inviteMemberButton = page.getByRole("button", {
      name: "Invite Member",
    });
    this.adminUserRadioButton = page.getByRole("radio").first();
    this.memberFirstName = page.getByRole("textbox", { name: "First Name *" });
    this.memberLastName = page.getByRole("textbox", { name: "Last Name *" });
    this.corporateEmail = page.getByRole("textbox", {
      name: "Corporate Email *",
    });
    this.memberRolesDropdown = page.getByRole("combobox", {
      name: "Member Assigned Roles",
    });

    this.roleMap = {
      "Procurement Manager": page
        .getByRole("option", { name: "Procurement Manager" })
        .getByRole("checkbox"),
      "Scientist/Researcher": page
        .getByRole("option", { name: "Scientist/Researcher" })
        .getByRole("checkbox"),
      "Legal/Compliance": page
        .getByRole("option", { name: "Legal/Compliance" })
        .getByRole("checkbox"),
      "Customer Service": page
        .getByRole("option", { name: "Customer Service" })
        .getByRole("checkbox"),
      All: page.getByRole("option", { name: "All" }).getByRole("checkbox"),
    };

    this.saveChangesButton = page.getByRole("button", { name: "Save Changes" });
    this.successMessage = page.getByText(/successfully invited/i);
    this.successResendMessage = page.getByText(/successfully resent/i);
    this.successUpdatedMessage = page.getByText(/successfully edited/i);
    this.successDeleteMessage = page.getByText(/successfully deleted/i)
    this.firstNameErrorMessage = page
      .getByText("This field is required")
      .nth(0);
    this.lastNameErrorMessage = page.getByText("This field is required").nth(1);
    this.emailErrorMessage = page.getByText("Invalid email format");
    this.resendButton = page.getByRole("button", { name: "Resend" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.deleteButton = page.getByRole("button", { name: "Delete"});
    this.dialog = page.locator(".MuiDialog-paper");
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Members" })
    ).toBeVisible();
  }

  async assertSuccessMessageIsVisible() {
    await expect(this.successMessage).toBeVisible({ timeout: 10_000 });
  }

  async assertErrors() {
    await expect(this.firstNameErrorMessage).toHaveClass(/Mui-error/);
    await expect(this.lastNameErrorMessage).toHaveClass(/Mui-error/);
    await expect(this.emailErrorMessage).toHaveClass(/Mui-error/);
    await expect(this.firstNameErrorMessage).toBeVisible();
    await expect(this.lastNameErrorMessage).toBeVisible();
    await expect(this.emailErrorMessage).toBeVisible();
    await expect(this.memberFirstName).toHaveCSS("color", "rgb(211, 47, 47)");
    await expect(this.memberLastName).toHaveCSS("color", "rgb(211, 47, 47)");
    await expect(this.corporateEmail).toHaveCSS("color", "rgb(211, 47, 47)");
    await expect(this.memberRolesDropdown).toHaveCSS(
      "color",
      "rgb(211, 47, 47)"
    );
  }

  async assertInvited() {
    const row = await this.getRowByMemberName();
    const chip = row.locator("div.MuiChip-colorDefault");
    await expect(chip).toHaveText(/invited/i);
  }

  async assertRecendInvite() {
    await expect(this.successResendMessage).toBeVisible();
  }

  async assertUpdateInvite() {
    await expect(this.successUpdatedMessage).toBeVisible();
  }

  async assertDialogIsCloced() {
    await expect(this.dialog).not.toBeVisible();
  }

  async assertDeleteInvite(){
    await expect(this.successDeleteMessage).toBeVisible();
  }

  async clickOnInviteMember() {
    await this.inviteMemberButton.click();
  }

  async fillMemberFirstName() {
    await this.memberFirstName.fill("AQA-Nadia");
  }

  async fillMemberLastName() {
    await this.memberLastName.fill("AQA-Member-test");
  }

  async updateMemberLastName(){
    await this.memberLastName.fill("AQA-Member-updated");
  }

  async fillMemberEmail() {
    await this.corporateEmail.fill(
      `aqa.test+${faker.string.uuid()}@globaldev.tech`
    );
  }

  async assignRole(role: Role) {
    await this.memberRolesDropdown.click();
    await this.roleMap[role].check({ force: true });
  }

  async assignRandomRole() {
    await this.memberRolesDropdown.click();

    const roles = Object.keys(this.roleMap) as Role[];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    await this.roleMap[randomRole].check({ force: true });
    return randomRole;
  }

  async checkAdminUserRadioButton() {
    await this.adminUserRadioButton.check();
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }

  async getRowByMemberName() {
    return this.page
      .getByRole("row")
      .filter({
        has: this.page.getByText("AQA-Nadia AQA-Member-"),
      })
      .first();
  }

  async resendInvite() {
    const row = await this.getRowByMemberName();
    await row.getByLabel("Resend Invitation").click();
    await this.resendButton.click();
  }

  async cancelResend() {
    const row = await this.getRowByMemberName();
   await row.getByLabel("Resend Invitation").click();
    await this.cancelButton.click();
  }

  async clickEditMember() {
    const row = await this.getRowByMemberName();
    const editBtn = row.getByLabel('Edit');
    await editBtn.click();
  }

  async deleteMember() {
    const row = await this.getRowByMemberName();
    const deleteBtn = row.getByLabel("Delete");
    await deleteBtn.click();
    await this.deleteButton.click();
  }
}
