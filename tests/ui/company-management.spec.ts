import { test } from "@playwright/test";
import { UserCompanyPage } from "../../src/pages/UserCompanyPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";

test.describe("Company Management", () => {
  let companyPage: UserCompanyPage;

  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });

  test.beforeEach(async ({ page }) => {
    companyPage = new UserCompanyPage(page);
  });

  test("buyer should change company info to Europe", async ({ page }) => {
    await companyPage.goto();
    await companyPage.assertLoaded();

    // edit user data
    await companyPage.clickEditButton();
    await companyPage.editCompanyName();
    await companyPage.editRegionSelectEurope();
    await companyPage.editCountrySelectEstonia();
    await companyPage.editProvince();
    await companyPage.editCity();
    await companyPage.editStreet();
    await companyPage.editPostalCode();

    // save changes
    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertCompanyDetailsUpdated();
    await companyPage.assertFieldsDataUpdated();
  });

  test("buyer should change company info to China", async ({ page }) => {
    await companyPage.goto();
    await companyPage.assertLoaded();

    // edit user data
    await companyPage.clickEditButton();
    await companyPage.editCompanyName();
    await companyPage.editRegionSelectChina();
    await companyPage.editCountrySelectChina();
    await companyPage.editProvince();
    await companyPage.editCity();
    await companyPage.editStreet();
    await companyPage.editPostalCode();

    // save changes
    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertCompanyDetailsUpdated();
    await companyPage.assertFieldsDataUpdated();
  });

  test("should upload NDA file as buyer", async ({ page }) => {
    await companyPage.goto();
    await companyPage.assertLoaded();

    // upload file and save
    await companyPage.clickEditButton();
    await companyPage.uploadFile();

    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertCompanyDetailsUpdated();

    // view uploaded file
    await companyPage.openFilePreview();
    await companyPage.downloadFile();
  });

  test("should remove uploaded NDA file as buyer", async ({ page }) => {
    // const companyPage = new UserCompanyPage(page);
    await companyPage.goto();
    await companyPage.assertLoaded();

    // remove uploaded file and save
    await companyPage.clickEditButton();
    await companyPage.removeFile();
    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertCompanyDetailsUpdated();
  });
});
