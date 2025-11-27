import { test } from "@playwright/test";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCompanyPage } from "../../src/pages/UserCompanyPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";

test.describe("E2E: Company Management", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  test("should change company info as buyer", async ({ page }) => {
    // navigate on Dashboard page
    const companyPage = new UserCompanyPage(page);
    await companyPage.goto();
    await companyPage.assertLoaded();
    const mainPage = new UserMainProductsPage(page);
    await mainPage.sidebar.openDashboard();

    // open Dashbord page
    const dashboardPage = new UserDashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickOnCompanyManagement();

    // open Company Management page
    await companyPage.assertLoaded();

    // edit user data
    await companyPage.clickEditButton();
    await companyPage.editCompanyName();
    await companyPage.editRegionSelectUSA();
    await companyPage.editCountrySelectUSA();
    await companyPage.selectState();
    await companyPage.editCity();
    await companyPage.editStreet();
    await companyPage.editPostalCodeUsa();

    // upload file
    await companyPage.uploadFile();

    // save changes
    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertFieldsDataUpdatedForUSA();

    // view uploaded file
    await companyPage.openFilePreview();
    await companyPage.downloadFile();

    // remove file
    await companyPage.clickEditButton();
    await companyPage.removeFile();
    await companyPage.clickSaveChangesBth();

    // assert
    await companyPage.assertCompanyDetailsUpdated();
  });
});
