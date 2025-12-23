import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { Invitation } from "../../src/utils/types/invitation.types";

export class SignupPage extends BasePage {
  readonly signUpButton;
  readonly buyerRoleRadio;
  readonly supplierRoleRadio;
  readonly supplierSecondaryBusinessType;
  readonly buyerSecondaryBusinessType;
  readonly checkbox;
  readonly businessTypeTitle;
  readonly companyDetailsTitle;
  readonly selectedRegion;
  readonly selectedCountry;
  readonly nextButton;
  readonly backButton;
  readonly personalInfoTitle;
  readonly firstNameInput;
  readonly lastNameInput;
  readonly emailInput;
  readonly roleInput;
  readonly agreementCheckbox;
  readonly companyNameInput;
  readonly regionSelect;
  readonly countrySelect;
  readonly stateInput;
  readonly cityInput;
  readonly streetInput;
  readonly zipInput;
  readonly doneButton;
  readonly toastMessage;
  readonly message;
  readonly pendingReviewMessage;

  constructor(page: Page) {
    super(page, "", ENV.guest.url);

    this.signUpButton = page.getByRole("button", { name: "Sign Up" });
    this.businessTypeTitle = page.getByText(/Business Type/i).nth(1);
    this.buyerRoleRadio = page.getByRole("radio", {
      name: "Buyer Purchase products and",
    });
    this.supplierRoleRadio = page.getByRole("radio", {
      name: "Provide services, list in-stock products, or both",
    });
    this.supplierSecondaryBusinessType = page.getByRole("checkbox", {
      name: "Supplier",
    });
    this.checkbox = page.getByRole("checkbox");

    this.buyerSecondaryBusinessType = page.getByRole("checkbox", {
      name: "Buyer",
    });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.backButton = page.getByRole("button", { name: "Back" });
    this.personalInfoTitle = page.getByText("Personal Information").nth(1);

    // Personal info step
    this.firstNameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.emailInput = page.getByRole("textbox", { name: "Corporate Email" });
    this.roleInput = page.getByRole("textbox", { name: "Company Role/Title" });
    this.agreementCheckbox = page.getByRole("checkbox");

    // Company info step
    this.companyDetailsTitle = page.getByText("Company Details").nth(0);
    this.companyNameInput = page.getByRole("textbox", { name: "Company Name" });
    this.regionSelect = page.getByRole("combobox", { name: "Region" });
    this.selectedRegion = page.getByRole("option", { name: "Europe" });
    this.countrySelect = page.getByRole("combobox", { name: "Country" });
    this.selectedCountry = page.getByRole("option", { name: "Hungary" });
    this.stateInput = page.getByRole("textbox", { name: "State/Province" });
    this.cityInput = page.getByRole("textbox", { name: "City" });
    this.streetInput = page.getByRole("textbox", { name: "Street" });
    this.zipInput = page.getByRole("textbox", { name: "Zip/Postal Code" });
    this.doneButton = page.getByRole("button", { name: "Done" });

    this.toastMessage = page.locator("div.MuiBox-root.mui-j0ozid");
    this.message = page.getByText(/We’ll review your application within/i);
    this.pendingReviewMessage = page.getByText(/pending/i);
  }

  // ========== Navigation ==========
  async openAsGuest() {
    await this.goto();
  }

  async openAsInvitedUser(inviteToken: string) {
    const inviteUrl = `${ENV.guest.url}/?signup_invite_token=${inviteToken}`;
    await this.goto(inviteUrl);
  }

  async assertLoaded() {
    await expect(this.signUpButton).toBeVisible();
  }

  async clickSignUpButton() {
    await this.signUpButton.first().click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickDone() {
    await this.doneButton.click();
  }

  // ========== Signup Flow ==========
  async selectBuyerRoleAndClickNext() {
    await this.buyerRoleRadio.check();
    await this.clickNext();
  }

  async selectSupplierRoleAndClickNext() {
    await this.supplierRoleRadio.check();
    await this.checkbox.nth(0).check();
    await this.clickNext();
  }

  async selectBuyerRoleWithSubroleAndClickNext() {
    await this.buyerRoleRadio.check();
    await this.supplierSecondaryBusinessType.check();
    await this.checkbox.nth(2).check();
    await this.checkbox.nth(3).check();
    await this.clickNext();
  }

  async selectSupplierRoleWithSubroleAndClickNext() {
    await this.supplierRoleRadio.check();
    await this.checkbox.nth(1).check();
    await this.buyerSecondaryBusinessType.check();
    await this.clickNext();
  }

  async fillInPersonalInformationAndClickNext(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.roleInput.fill(data.role);
    await this.agreementCheckbox.check();
    await this.clickNext();
  }

  async fillInPersonalInformationWithCompanyAndClickNext(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.roleInput.fill(data.role);
    await this.agreementCheckbox.check();
    await this.clickNext();
  }

  async prefilledPersonalInfoFillRole(data: { role: string }) {
    await this.roleInput.fill(data.role);
    await this.agreementCheckbox.check();
  }

  async fillInCompanyInformation(data: {
    name: string;
    region: string;
    country: string;
    state: string;
    city: string;
    street: string;
    zip: string;
  }) {
    await this.companyNameInput.fill(data.name);
    await this.regionSelect.click();
    await this.selectedRegion.click();
    await this.countrySelect.click();
    await this.selectedCountry.click();
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.streetInput.fill(data.street);
    await this.zipInput.fill(data.zip);
  }

  //========== Verify ==========
  async verifyBusinessTypeStep() {
    await expect(this.businessTypeTitle).toBeVisible();
  }

  async verifyPersonalInfoStep() {
    await expect(this.personalInfoTitle).toBeVisible();
  }

  async verifyCompanyDetailsStep() {
    await expect(this.companyDetailsTitle).toBeVisible();
  }

  async verifyBuyerRadioIsChecked() {
    await this.verifyBusinessTypeStep();
    await expect(this.buyerRoleRadio).toBeChecked();
  }

  async verifyFullPersonalInfoIsFilled(
    invitation: Invitation,
    data: { role: string; firstName: string; lastName: string }
  ) {
    const actualFirstName = await this.firstNameInput.inputValue();
    const actualLastName = await this.lastNameInput.inputValue();
    const actualEmail = await this.emailInput.inputValue();
    const actualRole = await this.roleInput.inputValue();

    expect(actualFirstName).toBe(data.firstName);
    expect(actualLastName).toBe(data.lastName);
    expect(actualEmail).toBe(invitation.email);
    expect(actualRole).toBe(data.role);
    await expect(this.agreementCheckbox).toBeChecked();
  }

  async verifyPrefilledPersonalInfo(invitation: Invitation) {
    await expect(this.firstNameInput).toHaveValue(/.+/, { timeout: 2000 });
    await expect(this.lastNameInput).toHaveValue(/.+/, { timeout: 2000 });
    await expect(this.emailInput).toHaveValue(/.+/, { timeout: 2000 });

    const actualFirstName = await this.firstNameInput.inputValue();
    const actualLastName = await this.lastNameInput.inputValue();
    const actualEmail = await this.emailInput.inputValue();

    expect(actualFirstName).toBe(invitation.firstName);
    expect(actualLastName).toBe(invitation.lastName);
    expect(actualEmail).toBe(invitation.email);
  }

  async verifyToastMessage() {
    await expect(this.toastMessage).toContainText(/Application Submitted/i);
  }

  async verifyReviewMessage(email: string | null | undefined) {
    const expected = `We’ll review your application within 24 hours and email you at ${email}`;
    await expect(this.message).toHaveText(expected);
  }

  async verifyPendingReviewMessage() {
    await expect(this.pendingReviewMessage).toHaveText(
      "Your sign up is pending review."
    );
  }
}
