import { test, expect } from "../../src/base/testFixtures.ui";
import { UserLoginPage } from "../../src/pages/UserLoginPage";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserCompanyPage } from "../../src/pages/UserCompanyPage";
import { ENV } from "../../src/config/env";

test.describe("Company Menegement", () => {
  // let user: UserLoginPage;

  test("should change company info as buyer", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);

    const companyPage = new UserCompanyPage(page);
    await companyPage.assertLoaded();

    // // click on dashboard add to e2e
    // await page.getByRole("link", { name: "Dashboard" }).click();

    // // open company management tab add to e2e
    // await page.getByRole("button", { name: "Company Management" }).click();

    await companyPage.clikcEditButton();

    // edit company
    await companyPage.editCompanyName();

    // edit country
    await companyPage.editCountry();

    await companyPage.editProvince();

    // edit city
    await companyPage.editCity();

    // edit street
    await companyPage.editStreet();

    // edit postal code
    await companyPage.editPostalCode();

    // upload file
    await companyPage.uploadFile();

    // save changes
        // await page.pause();
    await companyPage.clickSaveChangesBth();
    await companyPage.assertCompanyDetailsUpdated();
    // await page.pause();
    // check filled data?

    // view uploaded file
    await companyPage.openFilePreview();
    await companyPage.downloadFile();
    // await companyPage.removeFile();
  });

});
