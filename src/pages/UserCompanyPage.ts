import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { companyProfileTestData } from "../../src/data/companyData";
import { log } from "../core/logger";

export class UserCompanyPage extends BasePage {
  readonly pageHeading;
  readonly editButton;
  readonly inputCompanyName;
  readonly region;
  readonly selectEuropeRegion;
  readonly selectChinaRegion;
  readonly selectUsaRegion;
  readonly country;
  readonly selectEstoniaCountry;
  readonly selectChinaCountry;
  readonly selectUsaCountry;
  readonly province;
  readonly state;
  readonly selectColoradoState;
  readonly city;
  readonly street;
  readonly postalCode;
  readonly postalCodeUsa;
  readonly saveChangesButton;
  readonly uploadFileButton;
  readonly fileInput;
  readonly viewFileButton;
  readonly downloadButton;
  readonly removeFileButton;
  readonly successUpdatedMessage;

  constructor(page: Page) {
    super(page, "/dashboard/company", ENV.guest.url);

    this.pageHeading = page.getByRole("heading", { name: "Company" });
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.inputCompanyName = page.locator('input[name="name"][type="text"]');
    this.region = page.getByRole("combobox", { name: "Region *" });
    this.selectEuropeRegion = page.getByRole("option", { name: "Europe" });
    this.selectChinaRegion = page.getByRole("option", { name: "China" });
    this.selectUsaRegion = page.getByRole("option", { name: "United States" });
    this.country = page.getByRole("combobox", { name: "Country *" });
    this.selectEstoniaCountry = page.getByRole("option", { name: "Estonia" });
    this.selectChinaCountry = page.getByRole("option", { name: "China" });
    this.selectUsaCountry = page.getByRole("option", { name: "United States" });
    this.province = page.getByRole("textbox", { name: "State/Province *" });
    this.state = page.getByRole("combobox", { name: "State *" });
    this.selectColoradoState = page.getByRole("option", { name: "Colorado" });
    this.city = page.getByRole("textbox", { name: "City *" });
    this.street = page.getByRole("textbox", { name: "Street *" });
    this.postalCode = page.getByRole("textbox", { name: "Zip/Postal Code *" });
    this.postalCodeUsa = page.getByRole("textbox", { name: "Zip Code *" });
    this.saveChangesButton = page.getByRole("button", { name: "Save Changes" });
    this.uploadFileButton = page.getByText("Click to upload");
    this.fileInput = page.locator('input[type="file"]');
    this.removeFileButton = page.locator('button[title="Remove File"]').first();
    this.viewFileButton = page
      .getByRole("button", { name: "View File" })
      .first();
    this.downloadButton = page
      .getByRole("button", { name: "Download File" })
      .first();
    this.successUpdatedMessage = page.getByText("Company details updated.");
  }

  async assertLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  async assertCompanyDetailsUpdated() {
    await this.successUpdatedMessage.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await expect(this.successUpdatedMessage).toBeVisible();
  }

  async assertFieldsDataUpdated() {
    expect(await this.inputCompanyName.inputValue()).toBe(
      companyProfileTestData.companyName
    );
    expect(await this.province.inputValue()).toBe(
      companyProfileTestData.province
    );
    expect(await this.city.inputValue()).toBe(companyProfileTestData.city);
    expect(await this.street.inputValue()).toBe(companyProfileTestData.street);
    expect(await this.postalCode.inputValue()).toBe(
      companyProfileTestData.postalCode
    );
  }

  async assertFieldsDataUpdatedForUSA() {
    expect(await this.inputCompanyName.inputValue()).toBe(
      companyProfileTestData.companyName
    );
    expect(await this.region.inputValue()).toBe("United States");
    expect(await this.country.inputValue()).toBe("United States");
    expect(await this.state.inputValue()).toBe("Colorado");
    expect(await this.city.inputValue()).toBe(companyProfileTestData.city);
    expect(await this.street.inputValue()).toBe(companyProfileTestData.street);
    expect(await this.postalCodeUsa.inputValue()).toBe(
      companyProfileTestData.postalCode
    );
  }

  async clickEditButton() {
    await this.editButton.click();
  }
  async clickSaveChangesBth() {
    await this.saveChangesButton.click();
  }

  async editCompanyName() {
    await this.inputCompanyName.fill(companyProfileTestData.companyName);
    log.step("Edit Company name");
  }

  async editRegionSelectEurope() {
    await this.region.click();
    await this.selectEuropeRegion.click();
    log.step("Select Europe Region");
  }

  async editRegionSelectChina() {
    await this.region.click();
    await this.selectEuropeRegion.click();
    log.step("Select China Region");
  }

  async editRegionSelectUSA() {
    await this.region.click();
    await this.selectUsaRegion.click();
    log.step("Select USA Region");
  }

  async editCountrySelectChina() {
    await this.country.click();
    await this.selectEstoniaCountry.click();
    log.step("Edit Country select China");
  }

  async editCountrySelectEstonia() {
    await this.country.click();
    await this.selectEstoniaCountry.click();
    log.step("Edit Country select Estonia");
  }

  async editCountrySelectUSA() {
    await this.country.click();
    await this.selectUsaCountry.click();
    log.step("Edit Country select USA");
  }

  async selectState() {
    await this.state.click();
    await this.selectColoradoState.click();
    log.step("Select Colorado state");
  }

  async editProvince() {
    await this.province.click();
    await this.province.fill(companyProfileTestData.province);
    log.step("Edit Province");
  }

  async editCity() {
    await this.city.click();
    await this.city.fill(companyProfileTestData.city);
    log.step("Edit City");
  }

  async editStreet() {
    await this.street.click();
    await this.street.fill(companyProfileTestData.street);
    log.step("Edit Street");
  }

  async editPostalCode() {
    await this.postalCode.click();
    await this.postalCode.fill(companyProfileTestData.postalCode);
    log.step("Edit Postal code");
  }

    async editPostalCodeUsa() {
    await this.postalCodeUsa.click();
    await this.postalCodeUsa.fill(companyProfileTestData.postalCode);
    log.step("Edit Postal code");
  }

  async uploadFile() {
    await this.fileInput.setInputFiles(
      "src/data/files/Basic-Non-Disclosure-Agreement.pdf"
    );
    log.step("Upload NDA file");
  }

  async openFilePreview(): Promise<Page> {
    log.step("Open File Preview");
    await this.viewFileButton.scrollIntoViewIfNeeded();
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.viewFileButton.click({ force: true }),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    return popup;
  }

  async downloadFile() {
    log.step("Download File");
    await this.downloadButton.scrollIntoViewIfNeeded();
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.downloadButton.click({ force: true }),
    ]);
    await download.path();
    return download;
  }

  async removeFile() {
    await this.removeFileButton.click();
    log.step("Remove file");
  }
}
