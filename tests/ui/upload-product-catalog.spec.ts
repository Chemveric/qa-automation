import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { UserMembersPage } from "../../src/pages/UserMembersPage";
import { UserProductCatalogPage } from "../../src/pages/UserProductCatalogPage";
import { VendorProductDetailsPage } from "../../src/pages/VendorProductDetailsPage";
import { createRandomXlsx } from "../../src/data/catalogSourceData";
import { test } from "@playwright/test";

test.describe("Product Catalog Management", () => {
  test.describe.configure({ retries: 2 });

  let teamMembersPage: UserMembersPage;
  let productCatalogPage: UserProductCatalogPage;
  let xlsxPath: string;

  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Vendor),
  });

  test.beforeEach(async ({ page }) => {
    teamMembersPage = new UserMembersPage(page);
    productCatalogPage = new UserProductCatalogPage(page);
    xlsxPath = await createRandomXlsx("chemical_random.xlsx", 3);
  });

  test("vendor should successfully upload product catalog and check only building blocks", async ({
    page,
  }) => {
    await productCatalogPage.goto();
    await productCatalogPage.assertLoaded();

    //act
    await productCatalogPage.clickOnUploadProductCatalog();
    await productCatalogPage.uploadFile(xlsxPath);
    await productCatalogPage.checkOnlyBuildingBlocks();

    await productCatalogPage.assertFileIsUploaded();
    await productCatalogPage.clickUploadButton();

    // accert
    await productCatalogPage.assertImportStated();
    await productCatalogPage.assertImportStatus();

    await productCatalogPage.assertImportSuccess();
  });

  test("vendor should successfully upload product catalog and check only screening compounds", async ({
    page,
  }) => {
    await productCatalogPage.goto();
    await productCatalogPage.assertLoaded();

    //act
    await productCatalogPage.clickOnUploadProductCatalog();
    await productCatalogPage.uploadFile(xlsxPath);
    await productCatalogPage.checkOnlyScreeningCompounds();

    await productCatalogPage.assertFileIsUploaded();
    await productCatalogPage.clickUploadButton();

    // accert
    await productCatalogPage.assertImportStated();
    await productCatalogPage.assertImportStatus();

    await productCatalogPage.assertImportSuccess();
  });

  test("vendor should successfully partially update products with only building blocks", async ({
    page,
  }) => {
    await productCatalogPage.goto();
    await productCatalogPage.assertLoaded();

    //act
    await productCatalogPage.clickOnPartialUpdate();
    await productCatalogPage.assertPartialUpdateDialogIsVisible();

    await productCatalogPage.uploadFileForUpdate();
    await productCatalogPage.checkOnlyBuildingBlocks();
    await productCatalogPage.assertFileForPartialUpdateIsUploaded();

    await productCatalogPage.clickOnNextButton();

    await productCatalogPage.updateStructure();
    await productCatalogPage.updateProductName();
    await productCatalogPage.updateMolecularWeight();
    await productCatalogPage.updateMolecularFormula();
    await productCatalogPage.updateMfcd();
    await productCatalogPage.updateCasNumber();
    await productCatalogPage.updateSupplier();
    await productCatalogPage.updateCatalogNo();
    await productCatalogPage.updateStock();

    await productCatalogPage.clickOnNextButton();
    await productCatalogPage.clickOnConfirmButton();

    // assert
    await productCatalogPage.assertUpdatestarted();
    await productCatalogPage.assertImportStatus();
    await productCatalogPage.assertImportSuccess();
  });

  test("vendor should successfully partially update products with only screening compounds", async ({
    page,
  }) => {
    await productCatalogPage.goto();
    await productCatalogPage.assertLoaded();

    //act
    await productCatalogPage.clickOnPartialUpdate();
    await productCatalogPage.assertPartialUpdateDialogIsVisible();

    await productCatalogPage.uploadFileForUpdate();
    await productCatalogPage.checkOnlyScreeningCompoundsForUpdate();
    await productCatalogPage.assertFileForPartialUpdateIsUploaded();

    await productCatalogPage.clickOnNextButton();

    await productCatalogPage.updateStructure();
    await productCatalogPage.updateProductName();
    await productCatalogPage.updateMolecularWeight();
    await productCatalogPage.updateMolecularFormula();
    await productCatalogPage.updateMfcd();
    await productCatalogPage.updateCasNumber();
    await productCatalogPage.updateSupplier();
    await productCatalogPage.updateCatalogNo();
    await productCatalogPage.updateStock();

    await productCatalogPage.clickOnNextButton();
    await productCatalogPage.clickOnConfirmButton();

    // assert
    await productCatalogPage.assertUpdatestarted();
    await productCatalogPage.assertImportStatus();
    await productCatalogPage.assertImportSuccess();
  });

  test("vendor can open product details", async ({ page }) => {
    await productCatalogPage.goto();
    await productCatalogPage.assertLoaded();

    // act
    await productCatalogPage.openFirstProductDetails();
    const productDetails = new VendorProductDetailsPage(page);

    // assert
    await productDetails.assertLoaded();
    await productDetails.assertProductNameIsVisible();
    await productDetails.assertStructuresAreVisible();
    await productDetails.assertColumnNamesAreVisisble();
    await productDetails.assertTabNamesAreVisible();
  });
});
