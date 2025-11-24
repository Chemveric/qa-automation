import { test } from "../../src/base/testFixtures.ui";
import { UserLoginPage } from "../../src/pages/UserLoginPage";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCompanyPage } from "../../src/pages/UserCompanyPage";
import { ENV } from "../../src/config/env";
import { da } from "@faker-js/faker/.";

test.describe("Company Menegement", () => {
  // let user: UserLoginPage;

  test("should change company info as buyer", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);
    const companyPage = new UserCompanyPage(page);
    await companyPage.goto();
    await companyPage.assertLoaded();

    // edit user data
    await companyPage.clickEditButton();
    await companyPage.editCompanyName();
    await companyPage.editCountry();
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
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);
    const companyPage = new UserCompanyPage(page);
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
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);
    const companyPage = new UserCompanyPage(page);
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
