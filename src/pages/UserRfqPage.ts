import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
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
  readonly smilesButton;
  readonly smilesField;
  readonly projectTitle;
  readonly startDate;
  readonly endDate;
  readonly therapeuticArea;
  readonly successCriteria;
  readonly firstName;
  readonly lastName;
  readonly company;
  readonly email;
  readonly phone;
  readonly stepFive;
  readonly submitRfqButton;
  readonly useDefaultNda;
  readonly sendFullRfq;
  readonly sendNonConfOnly;

  constructor(page: Page) {
    super(page, "/projects/rfq-management", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.pageName = page.getByRole("heading", { name: "RFQ Management" });
    this.createRfqButton = page.getByRole("button", { name: "Create RFQ" });

    //common
    this.continueButton = page.getByRole("button", { name: "Continue" });

    // step 1 locators
    this.ffs = page.getByRole("radio").first();
    this.stepOne = page.getByText("Step 1: Services");

    //step 2 locators
    this.stepTwo = page.getByText("Step 2: Non-Confidential Scope ");
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

    // step 3 locators
    this.stepThree = page.getByText("Step 3: Confidential Details");
    this.compoundName = page.getByRole("textbox", { name: "Compound Name" });
    this.quantity = page.getByRole("spinbutton", { name: "Quantity" });
    this.unit = page.getByRole("combobox", { name: "Unit mg" });
    this.purity = page.getByRole("spinbutton", { name: "Purity" });
    this.analitycalMethods = page.getByRole("combobox", {
      name: "Analytical Methods",
    });
    this.addCompoundButton = page.getByRole("button", { name: "Add Compound" });
    this.notes = page.getByRole("textbox", { name: "Notes" });
    this.smilesButton = page.getByRole("tab", { name: "SMILES" });
    this.smilesField = page.getByRole("textbox", { name: "SMILES" });

    // step 4 locators
    this.stepFour = page.getByText("Step 4: Timeline & Contacts");
    this.projectTitle = page.getByRole("textbox", { name: "Project Title" });
    this.startDate = page.getByRole("textbox", { name: "Start Date" });
    this.endDate = page.getByRole("textbox", { name: "End Date" });
    this.therapeuticArea = page.locator(
      '[id="mui-component-select-form.timelineAndContacts.therapeuticArea"]'
    );
    this.successCriteria = page.getByRole("textbox", {
      name: "Success Criteria",
    });
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.company = page.getByRole("textbox", { name: "Company" });
    this.email = page.getByRole("textbox", { name: "Email" });
    this.phone = page.getByRole("textbox", { name: "Phone" });

    // step 5 locators
    this.stepFive = page.getByText("Step 5: Review & Send");
    this.submitRfqButton = page.getByText("BackSubmit RFQ");
    this.useDefaultNda = page.getByRole("radio").first();
    this.sendFullRfq = page.getByRole("radio").first();
    this.sendNonConfOnly = page.getByRole("radio").nth(3);
  }

  // assertions
  async assertLoaded() {
    await expect(this.pageName).toBeVisible();
  }

  async assertStepOneIsVisible() {
    await expect(this.stepOne).toBeVisible();
  }

  async assertStepTwoIsVisible() {
    await expect(this.stepTwo).toBeVisible();
  }

  async assertStepThreeIsVisible() {
    await expect(this.stepThree).toBeVisible();
  }

  async assertStepFourIsVisible() {
    await expect(this.stepFour).toBeVisible();
  }

  async assertStepFiveIsVisible() {
    await expect(this.stepFive).toBeVisible();
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

  // step 1
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

  async fillStep1(serviceName: string, serviceOption: string) {
    log.step("Fill step 1 RFQ flow");
    await this.selectService(serviceName, serviceOption);
    await this.checkFeeForService();
    await this.clickContinue();
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

  async switchToSmiles() {
    await this.smilesButton.click();
  }

  async addSmiles(smiles: string) {
    await this.smilesField.fill(smiles);
  }

  async fillStep2(
    turnaroundDays: string,
    deliveryDate: string,
    targetBudget: string,
    description: string,
    filePath: string,
    sector: string,
    complexity: string,
    region: string,
    projectStage: string,
    companySize: string,
    priorityLevel: string
  ) {
    log.step("Fill step 2 RFQ flow");
    await this.setProposalTurnaroundDays(turnaroundDays);
    await this.setRequiredDeliveryDate(deliveryDate);
    await this.setTargetBudget(targetBudget);
    await this.addDescription(description);
    await this.uploadFile(filePath);
    await this.selectSector(sector);
    await this.selectComplexity(complexity);
    await this.selectRegion(region);
    await this.selectProjectStage(projectStage);
    await this.selectCompanySize(companySize);
    await this.selectPriorityLevel(priorityLevel);
    await this.clickContinue();
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

  async addNotes(n: string) {
    await this.notes.fill(n);
  }

  async fillStep3(
    compoundName: string,
    quantity: string,
    purity: string,
    analyticalMethod: string,
    filePath1: string,
    filaPath2: string,
    notes: string
  ) {
    log.step("Fill step 3 RFQ flow");
    await this.addCompoundName(compoundName);
    await this.addQuantity(quantity);
    await this.addPurity(purity);
    await this.selectAnalitycalMethod(analyticalMethod);
    await this.uploadChemFile(filePath1);
    await this.assertChemFileIsLoaded();
    await this.clickOnAddCompoundButton();
    await this.uploadConfFile(filaPath2);
    await this.addNotes(notes);
    await this.clickContinue();
  }

  async fillStep3UseSmile(
    compoundName: string,
    quantity: string,
    purity: string,
    analyticalMethod: string,
    smiles: string,
    notes: string,
    filePath: string,
  ) {
    log.step("Fill step 3 RFQ flow with smiles");
    await this.addCompoundName(compoundName);
    await this.addQuantity(quantity);
    await this.addPurity(purity);
    await this.selectAnalitycalMethod(analyticalMethod);
    await this.switchToSmiles();
    await this.addSmiles(smiles);
    await this.clickOnAddCompoundButton();
    await this.addNotes(notes);
    await this.uploadFile(filePath)
    await this.clickContinue();
  }


  async fillStep3UseSmileNoConfFileAndNotes(
    compoundName: string,
    quantity: string,
    purity: string,
    analyticalMethod: string,
    smiles: string,
  ) {
    log.step("Fill step 3 RFQ flow with smiles and no confidential files");
    await this.addCompoundName(compoundName);
    await this.addQuantity(quantity);
    await this.addPurity(purity);
    await this.selectAnalitycalMethod(analyticalMethod);
    await this.switchToSmiles();
    await this.addSmiles(smiles);
    await this.clickOnAddCompoundButton();
    await this.clickContinue();
  }

  // step 4
  async addProjectTitle(title: string) {
    await this.projectTitle.fill(title);
  }

  async addTherapeuticArea(area: string) {
    await this.therapeuticArea.click();
    await this.page.getByRole("option", { name: area }).click();
  }

  async addStartDate(stDate: string) {
    await this.startDate.fill(stDate);
  }

  async addEndDate(endDate: string) {
    await this.endDate.fill(endDate);
  }

  async addSuccessCriteria(criteria: string) {
    await this.successCriteria.fill(criteria);
  }

  async addFirstName(firstName: string) {
    await this.firstName.fill(firstName);
  }

  async addLastName(lastName: string) {
    await this.lastName.fill(lastName);
  }

  async addCompany(company: string) {
    await this.company.fill(company);
  }

  async addEmail(email: string) {
    await this.email.fill(email);
  }

  async addPhone(phone: string) {
    await this.phone.fill(phone);
  }

  async fillStage4(
    title: string,
    area: string,
    stDate: string,
    endDate: string,
    criteria: string,
    firstName: string,
    lastName: string,
    company: string,
    email: string,
    phone: string,
    notes: string
  ) {
    log.step("Fill step 4 RFQ flow");
    await this.addProjectTitle(title);
    await this.addTherapeuticArea(area);
    await this.addStartDate(stDate);
    await this.addEndDate(endDate);
    await this.addSuccessCriteria(criteria);
    await this.addFirstName(firstName);
    await this.addLastName(lastName);
    await this.addCompany(company);
    await this.addEmail(email);
    await this.addPhone(phone);
    await this.addNotes(notes);
    await this.clickContinue();
  }

  async fillStage4WithoutNotes(
    title: string,
    area: string,
    stDate: string,
    endDate: string,
    criteria: string,
    firstName: string,
    lastName: string,
    company: string,
    email: string,
    phone: string,
  ) {
    log.step("Fill step 4 RFQ flow without notes");
    await this.addProjectTitle(title);
    await this.addTherapeuticArea(area);
    await this.addStartDate(stDate);
    await this.addEndDate(endDate);
    await this.addSuccessCriteria(criteria);
    await this.addFirstName(firstName);
    await this.addLastName(lastName);
    await this.addCompany(company);
    await this.addEmail(email);
    await this.addPhone(phone);
    await this.clickContinue();
  }

  //step 5
  async chooseToUseDefaultNda() {
    await this.useDefaultNda.check();
  }

  async chooseToSendFullRfq() {
    await this.sendFullRfq.check();
  }

  async clickOnSubmitRfq() {
    await this.submitRfqButton.click();
  }

  async fillStep5() {
    log.step("Fill step 5 RFQ flow ");
    await this.chooseToUseDefaultNda();
    await this.chooseToSendFullRfq();
    await this.clickOnSubmitRfq();
  }
}
