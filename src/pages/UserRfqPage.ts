import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
import { faker } from "@faker-js/faker";
import { log } from "../core/logger";

export class UserRfqPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageName;
  readonly createRfqButton;
  readonly ffs;
  readonly continueButton;
  readonly stepOne;
  readonly stepTwo;
  readonly stepThree;
  readonly stepFour;
  readonly proposalTurnaroundDays;
  readonly requiredDeliveryDate;
  readonly targetBudget;
  readonly projectDescription;
  readonly fileInput;
  readonly sector;
  readonly complexity;
  readonly region;
  readonly projectStage;
  readonly companySize;
  readonly priorityLevel;
  readonly compoundName;
  readonly quantity;
  readonly unit;
  readonly purity;
  readonly analitycalMethods;
  readonly addCompoundButton;
  readonly notes;

  constructor(page: Page) {
    super(page, "/projects/rfq-management", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.pageName = page.getByRole("heading", { name: "RFQ Management" });
    this.createRfqButton = page.getByRole("button", { name: "Create RFQ" });
    this.ffs = page.getByRole("radio").first();
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.stepOne = page.getByText("Step 1: Services");
    this.stepTwo = page.getByText("Step 2: Non-Confidential Scope ");
    this.stepThree = page.getByText("Step 3: Confidential Details");
    this.stepFour = page.getByText("Step 4: Timeline & Contacts");

    this.proposalTurnaroundDays = page.getByRole("textbox", {
      name: "Proposal turnaround (days)",
    });
    this.requiredDeliveryDate = page.locator('input[type="date"]');
    this.targetBudget = page.getByRole("textbox", { name: "Target budget" });
    this.projectDescription = page.getByRole("textbox", {
      name: "Brief Description",
    });
    this.fileInput = page.locator('input[type="file"]');
    this.sector = page.locator(
      '[id="mui-component-select-form.nonconf.sector"]'
    );
    this.complexity = page.locator(
      '[id="mui-component-select-form.nonconf.complexity"]'
    );
    this.region = page.locator(
      '[id="mui-component-select-form.nonconf.region"]'
    );
    this.projectStage = page.locator(
      '[id="mui-component-select-form.nonconf.stage"]'
    );
    this.companySize = page.locator(
      '[id="mui-component-select-form.nonconf.companySize"]'
    );
    this.priorityLevel = page.locator(
      '[id="mui-component-select-form.nonconf.priority"]'
    );
    this.compoundName = page.getByRole("textbox", { name: "Compound Name" });
    this.quantity = page.getByRole("spinbutton", { name: "Quantity" });
    this.unit = page.getByRole("combobox", { name: "Unit mg" });
    this.purity = page.getByRole("spinbutton", { name: "Purity" });
    this.analitycalMethods = page.getByRole("combobox", {
      name: "Analytical Methods",
    });
    this.addCompoundButton = page.getByRole("button", { name: "Add Compound" });
    this.notes = page.getByRole("textbox", { name: "Notes" });
  }

  async assertLoaded() {
    await expect(this.pageName).toBeVisible();
  }

  async assertStepOne() {
    await expect(this.stepOne).toBeVisible();
  }

  async assertStepTwo() {
    await expect(this.stepTwo).toBeVisible();
  }

  async assertStepThree() {
    await expect(this.stepThree).toBeVisible();
  }

  async assertStepFour(){
    await expect(this.stepFour).toBeVisible();
  }

  async assertChemFileIsLoaded() {
    await expect(this.addCompoundButton).toHaveCSS(
      "background-color",
      "rgb(220, 237, 200)"
    );
  }

  async clickOnCreateRfqButton() {
    await this.createRfqButton.click();
  }

  async selectService(serviceName: string, optionName: string) {
    await this.page.getByRole("heading", { name: serviceName }).click();
    await this.page
      .getByRole("checkbox", {
        name: optionName,
      })
      .click();
  }

  async checkFeeForService() {
    await this.ffs.check();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  // step 2
  async setProposalTurnaroundDays(daysCount: string) {
    await this.proposalTurnaroundDays.fill(daysCount);
  }

  async setRequiredDeliveryDate(deliveryDate: string) {
    await this.requiredDeliveryDate.click();
    await this.requiredDeliveryDate.fill(deliveryDate);
  }

  async setTargetBudget(budget: string) {
    await this.targetBudget.fill(budget);
  }

  async addDescription(description: string) {
    await this.projectDescription.fill(description);
  }

  async uploadFile(filePathath: string) {
    await this.fileInput.setInputFiles(filePathath);
    log.step("Upload file");
  }

  async selectSector(optionName: string) {
    await this.sector.click();
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async selectComplexity(optionName: string) {
    await this.complexity.click();
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async selectRegion(optionName: string) {
    await this.region.click();
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async selectProjectStage(optionName: string) {
    await this.projectStage.click();
    await this.page
      .getByRole("option", { name: optionName, exact: true })
      .click();
  }

  async selectCompanySize(optionName: string) {
    await this.companySize.click();
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async selectPriorityLevel(optionName: string) {
    await this.priorityLevel.click();
    await this.page.getByRole("option", { name: optionName }).click();
  }

  // step 3
  async addCompoundName(compName: string) {
    await this.compoundName.fill(compName);
  }

  async addQuantity(q: string) {
    await this.quantity.fill(q);
  }

  async addPurity(p: string) {
    await this.purity.fill(p);
  }

  async selectAnalitycalMethod(optionName: string) {
    await this.analitycalMethods.click();
    await this.page.getByRole("option", { name: optionName }).click();
    await this.page.keyboard.press("Escape");
  }

  async uploadChemFile(filePathath: string) {
    await this.fileInput.nth(0).setInputFiles(filePathath);
    log.step("Upload file with chemical structure");
  }

  async clickOnAddCompoundButton() {
    await this.addCompoundButton.click();
  }

  async uploadConfFile(filePathath: string) {
    await this.fileInput.nth(1).setInputFiles(filePathath);
    log.step("Upload confidential file");
  }

  async addConfNotes(n: string){
    await this.notes.fill(n);
  }

  // click smiles and add smiles:
  

  // step 4
}
