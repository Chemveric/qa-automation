import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";

export class UserCompanyPage extends BasePage {
  readonly editButton;
  readonly inputCompanyName;
  readonly country;
  readonly selectCountry;
  readonly province;
  readonly city;
  readonly street;
  readonly postalCode;
  readonly saveChangesButton;
  readonly uploadFileButton;
  readonly fileInput;
  readonly popup;
  readonly viewFileButton;
  readonly downloadPromise;
  readonly downloadButton;
  readonly removeFileButton;
  readonly successUpdatedMessage;

  constructor(page: Page) {
    super(page, "company", ENV.guest.url);

    this.editButton = page.getByRole("button", { name: "Edit" });
    this.inputCompanyName = page.locator('input[name="name"][type="text"]');
    this.country = page.getByRole("combobox", { name: "Country *" });
    this.selectCountry = page.getByRole("option", { name: "Estonia" });
    this.province = page.getByRole("textbox", { name: "State/Province *" });
    this.city = page.getByRole("textbox", { name: "City *" });
    this.street = page.getByRole("textbox", { name: "Street *" });
    this.postalCode = page.getByRole("textbox", { name: "Zip/Postal Code *" });
    this.saveChangesButton = page.getByRole("button", { name: "Save Changes" });
    this.uploadFileButton = page.getByText("Click to upload");
    this.fileInput = page.locator('input[type="file"]');
    this.removeFileButton = page.locator('button[title="Remove File"]');
    this.popup = page.waitForEvent("popup");
    this.viewFileButton = page.getByRole("button", { name: "View File" }).first();
    this.downloadPromise = page.waitForEvent("download");
    this.downloadButton = this.page.getByRole("button", {
      name: "Download File",
    }).first();
    this.successUpdatedMessage = page.getByText("Company details updated.");
  }

  async assertLoaded() {
    await this.goto(this.path);
    await expect(
      this.page.getByRole("heading", { name: "Company" })
    ).toBeVisible();
  }

  async assertCompanyDetailsUpdated() {
    await expect(this.successUpdatedMessage).toBeVisible();
  }

  async clikcEditButton() {
    await this.editButton.click();
  }

  async clickSaveChangesBth() {
    await this.saveChangesButton.click();
  }

  async editCompanyName() {
    await this.inputCompanyName.fill("Some new COMPANY");
  }

  async editCountry() {
    await this.country.click();
    await this.selectCountry.click();
  }

  async editProvince() {
    await this.province.click();
    await this.province.fill("Some State");
  }

  async editCity() {
    await this.city.click();
    await this.city.fill("Updated-City");
  }

  async editStreet() {
    await this.street.click();
    await this.street.fill("New test street");
  }

  async editPostalCode() {
    await this.postalCode.click();
    await this.postalCode.fill("12345");
  }

  async uploadFile() {
    await this.fileInput.setInputFiles(
      "src/data/files/Basic-Non-Disclosure-Agreement.pdf"
    );
  }

  async openFilePreview(): Promise<Page> {
    const popupPromise = this.popup;
    await this.viewFileButton.scrollIntoViewIfNeeded();
    await this.viewFileButton.click({ force: true });
    const popup = await popupPromise;
    return popup;
  }

  async downloadFile() {
    const downloadPromise = this.downloadPromise;
    await this.downloadButton.click({ force: true });
    const download = await downloadPromise;
    return download;
  }

  async removeFile() {
    await this.removeFileButton.click();
  }
}
