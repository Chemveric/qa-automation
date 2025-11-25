import { test, expect } from "../../src/base/testFixtures.ui";
import { UserLoginPage } from "../../src/pages/UserLoginPage";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCompanyPage } from "../../src/pages/UserCompanyPage";
import { ENV } from "../../src/config/env";
import { da } from "@faker-js/faker/.";

test.describe("E2E: Company Management", () => {

  test("should change company info as buyer", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);

    // navigate on Dashboard page
    const mainPage = new UserMainProductsPage(page);
    await mainPage.sidebar.openDashboard();

    // open Dashbord page 
    const dashboardPage = new UserDashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickOnCompanyManagement();

    // open Company Management page
    const companyPage = new UserCompanyPage(page);
    await companyPage.assertLoaded();

    // edit user data
    await companyPage.clickEditButton();
    await companyPage.editCompanyName();
    await companyPage.editCountry();
    await companyPage.editProvince();
    await companyPage.editCity();
    await companyPage.editStreet();
    await companyPage.editPostalCode();

    // upload file
    await companyPage.uploadFile();

    // save changes
    await companyPage.clickSaveChangesBth();

    // assert 
    await companyPage.assertCompanyDetailsUpdated();
    await companyPage.assertFieldsDataUpdated();

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
