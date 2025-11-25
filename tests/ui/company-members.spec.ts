import { test } from "../../src/base/testFixtures.ui";
import { UserLoginPage } from "../../src/pages/UserLoginPage";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserMembersPage } from "../../src/pages/UserMembersPage";
import { ENV } from "../../src/config/env";
import { da } from "@faker-js/faker/.";

test.describe("Team Managemant", () => {
  test("buyer should successfully invite team member", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);

    // // navigate on Dashboard page
    // const mainPage = new UserMainProductsPage(page);
    // await mainPage.sidebar.openDashboard();

    // // open Dashbord page
    // const dashboardPage = new UserDashboardPage(page);
    // await dashboardPage.assertLoaded();
    // // await page.pause();
    // await dashboardPage.clickOnTeamManagement();

    const teamMembersPage = new UserMembersPage(page);
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    await teamMembersPage.clickOnInviteMember();
    await teamMembersPage.fillMemberFirstName();
    await teamMembersPage.fillMemberLastName();
    await teamMembersPage.fillMemberEmail();
    await teamMembersPage.assignRandomRole();
    // await page.pause();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertSuccessMessageIsVisible();
  });

  test("buyer should successfully invite admin member", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);

    const teamMembersPage = new UserMembersPage(page);
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    await teamMembersPage.clickOnInviteMember();
    await teamMembersPage.checkAdminUserRadioButton();
    // await page.pause();
    await teamMembersPage.fillMemberFirstName();
    await teamMembersPage.fillMemberLastName();
    await teamMembersPage.fillMemberEmail();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertSuccessMessageIsVisible();
  });

  test("should show validation errors when invite member without filled in data", async ({ page }) => {
    const buyer = new UserLoginPage(page);
    await buyer.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);

    const teamMembersPage = new UserMembersPage(page);
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    await teamMembersPage.clickOnInviteMember();

    await page.pause();

    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertErrors();
  });
});
