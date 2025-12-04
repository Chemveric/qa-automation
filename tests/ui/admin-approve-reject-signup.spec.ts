import { test } from "@playwright/test";
import { DashboardPage } from "../../src/pages/DashboardPage";
import { SignupRequestDetailsPage } from "../../src/pages/SignUpRequestDetailsPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { da, de } from "@faker-js/faker/.";

test.describe("Admin approve or reject signup request", () => {
  let dashboardPage: DashboardPage;
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Admin),
  });

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test("should approve signup request", async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.assertLoaded();

    // act
    await dashboardPage.openPendingRequestsTab();
    await dashboardPage.approveSignupRequest();
    await dashboardPage.assertSignUpRequestDialogIsVisible();
    await dashboardPage.clickApprove();

    // assert
    await dashboardPage.assertSignUpRequestDialogIsNotVisible();
  });

  test("should cancel approvement of signup request", async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.assertLoaded();

    // act
    await dashboardPage.openPendingRequestsTab();
    await dashboardPage.approveSignupRequest();
    await dashboardPage.assertSignUpRequestDialogIsVisible();

    await dashboardPage.clickCancel();

    // assert
    await dashboardPage.assertSignUpRequestDialogIsNotVisible();
  });

  test("should reject signup request", async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.assertLoaded();

    // act
    await dashboardPage.openPendingRequestsTab();
    await dashboardPage.rejectSignupRequest();
    await dashboardPage.assertRejectSignUpRequestDialogIsVisible();

    await dashboardPage.addRejectReason();
    await dashboardPage.clickReject();

    // assert
    await dashboardPage.assertSuccessRejectMessage();
  });

  test("should approve signup request via <Sign up request details page>", async ({
    page,
  }) => {
    await dashboardPage.goto();
    await dashboardPage.assertLoaded();

    // act
    await dashboardPage.openPendingRequestsTab();
    await dashboardPage.openRequestDetails();

    // assert new page
    const detailsPage = new SignupRequestDetailsPage(page);
    await detailsPage.assertLoaded();

    //click on approve
    await detailsPage.clickApprove();
    await detailsPage.assertSignUpRequestDialogIsVisible();
    await detailsPage.clickApprove();

    // assert
    await detailsPage.assertSignUpRequestDialogIsNotVisible();
  });

  test("should reject signup request via <Sign up request details page>", async ({
    page,
  }) => {
    await dashboardPage.goto();
    await dashboardPage.assertLoaded();

    // act
    await dashboardPage.openPendingRequestsTab();
    await dashboardPage.openRequestDetails();

    // assert new page
    const detailsPage = new SignupRequestDetailsPage(page);
    await detailsPage.assertLoaded();

    //click on approve
    await detailsPage.clickReject();
    await detailsPage.assertRejectSignUpRequestDialogIsVisible();
    await detailsPage.addRejectReason();
    await detailsPage.clickReject();

    // assert
    await detailsPage.assertSuccessRejectMessage();
  });
});
