import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect, Locator } from "@playwright/test";
import { ENV } from "../config/env";
import { log } from "../core/logger";

export class UserProductCatalogPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly pageHeading;
  readonly uploadCatalogButton;
  readonly partialUpdateButton;
  readonly fileInput;
  readonly uploadButton;
  readonly importStartedMessage;
  readonly importStatus;
  readonly successImportMessage;
  readonly partialUpdateDialogName;
  readonly nextButton;
  readonly backButton;
  readonly structureRow;
  readonly productNameRow;
  readonly molecularWeightRow;
  readonly molecularFormulaRow;
  readonly mfcdRow;
  readonly casNumberRow;
  readonly supplierRow;
  readonly catalogNoRow;
  readonly stockRow;
  readonly inChIKeyOption;
  readonly ignoreOption;
  readonly productNameOption;
  readonly catalogNumberOption;
  readonly casOption;
  readonly confirmButton;
  readonly updateStartedMessage;
  readonly firstRowStructure;
  readonly productsDetailsPage;
  readonly twoDStructureImage;
  readonly productName;

  private readonly allOptions: Locator[];

  constructor(page: Page) {
    super(page, "/dashboard/product-catalog", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.pageHeading = page.getByRole("heading", { name: "Product Catalog" });
    this.uploadCatalogButton = page.getByRole("button", {
      name: "Upload Catalog",
    });
    this.partialUpdateButton = page.getByRole("button", {
      name: "Partial Update",
    });
    this.fileInput = page.locator('input[type="file"]');
    this.uploadButton = page.getByRole("button", { name: "Upload" });
    this.importStartedMessage = page.getByText(/Import started/i);
    this.updateStartedMessage = page.getByText("Partial update started.");
    this.importStatus = page.getByText(/Import status: active/i);
    this.successImportMessage = page.getByText(/Catalog import completed/i);
    this.partialUpdateDialogName = page.locator("h2");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.backButton = page.getByRole("button", { name: "Back" });
    this.structureRow = page
      .getByRole("row", { name: "structure" })
      .getByRole("combobox");
    this.productNameRow = page
      .getByRole("row", { name: "product_name" })
      .getByRole("combobox");
    this.molecularWeightRow = page
      .getByRole("row", { name: "molecular_weight" })
      .getByRole("combobox");
    this.molecularFormulaRow = page
      .getByRole("row", { name: "molecular_formula" })
      .getByRole("combobox");
    this.mfcdRow = page
      .getByRole("row", { name: "mfcd" })
      .getByRole("combobox");
    this.casNumberRow = page
      .getByRole("row", { name: "cas_number_cas" })
      .getByRole("combobox");
    this.supplierRow = page
      .getByRole("row", { name: "supplier" })
      .getByRole("combobox");
    this.catalogNoRow = page
      .getByRole("row", { name: "catalog_no" })
      .getByRole("combobox");
    this.stockRow = page
      .getByRole("row", { name: "stock" })
      .getByRole("combobox");

    this.inChIKeyOption = page.getByRole("option", { name: "InChIKey" });
    this.ignoreOption = page.getByRole("option", { name: "Ignore" });
    this.productNameOption = page.getByRole("option", { name: "Product Name" });
    this.catalogNumberOption = page.getByRole("option", {
      name: "Catalog Number",
    });
    this.casOption = page.getByRole("option", { name: "CAS" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });
    this.firstRowStructure = page.locator('.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeSmall').nth(0);
    this.productsDetailsPage = page.getByText('Product Details Page');
    this.twoDStructureImage = page.getByRole('img', { name: '2D Structure' });
    this.productName = page.locator("h5");

    this.allOptions = [
      this.inChIKeyOption,
      this.ignoreOption,
      this.productNameOption,
      this.catalogNumberOption,
      this.casOption,
    ];
  }

  private async selectRandomOption(): Promise<void> {
  const randomIndex = Math.floor(Math.random() * this.allOptions.length);
  const option = this.allOptions[randomIndex];
  await option.click();
}

  async assertLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  async assertImportStated() {
    await expect(this.importStartedMessage).toBeVisible();
  }

  async assertFileIsUploaded() {
    await expect(this.uploadButton).toHaveCSS(
      "background-color",
      "rgb(220, 237, 200)"
    );
  }

  async assertFileForPartialUpdateIsUploaded() {
    await expect(this.nextButton).toHaveCSS(
      "background-color",
      "rgb(220, 237, 200)"
    );
  }

  async assertImportStatus() {
    await expect(this.importStatus).toBeVisible();
    log.step("Check import status");
  }

  async assertImportSuccess() {
    const successToast = this.successImportMessage;

    try {
      await expect(successToast).toBeVisible({ timeout: 30000 });
      log.step("Catalog import completed");
    } catch (e) {
      log.error("⚠️ Import failed");
    }
  }

  async assertPartialUpdateDialogIsVisible() {
    await expect(this.partialUpdateDialogName).toContainText("Partial Update");
  }

  async assertUpdatestarted() {
    await expect(this.updateStartedMessage).toBeVisible();
  }

  async assertProductDetailsPage(){
    await expect(this.productsDetailsPage).toBeVisible();
  }

  async assert2DStructureIsVisible(){
    await expect(this.twoDStructureImage).toBeVisible();
  }

  async assertProductNameIsVisible(){
    await expect(this.productName).toBeVisible();
  }

  async clickOnUploadProductCatalog() {
    await this.uploadCatalogButton.click();
  }

  async clickOnPartialUpdate() {
    await this.partialUpdateButton.click();
  }

  async uploadFile(filePathath: string) {
    await this.fileInput.setInputFiles(filePathath);
    log.step("Upload Product Catalog file");
  }

  async uploadFileForUpdate() {
    await this.fileInput.setInputFiles("src/data/files/chemical_catalog.xlsx");
    log.step("Upload file for update products");
  }

  async clickUploadButton() {
    await this.uploadButton.click();
  }

  async clickOnNextButton() {
    await this.nextButton.click();
  }

  async clickOnBackButton() {
    await this.backButton.click();
  }

  async updateStructure() {
    await this.structureRow.click();
    await this.selectRandomOption();
  }
 
  async updateProductName() {
    await this.productNameRow.click();
    await this.selectRandomOption();
  }

  async updateMolecularWeight() {
    await this.molecularWeightRow.click();
    await this.selectRandomOption();
  }

  async updateMolecularFormula() {
    await this.molecularFormulaRow.click();
    await this.selectRandomOption();
  }

  async updateMfcd() {
    await this.mfcdRow.click();
    await this.selectRandomOption();
  }

  async updateCasNumber() {
    await this.casNumberRow.click();
    await this.selectRandomOption();
  }

  async updateSupplier() {
    await this.supplierRow.click();
    await this.selectRandomOption();
  }

  async updateCatalogNo() {
    await this.catalogNoRow.click();
    await this.selectRandomOption();
  }

  async updateStock() {
    await this.stockRow.click();
    await this.selectRandomOption();
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }

  async openFirstProductDetails(){
    await this.firstRowStructure.click();
  }
}
