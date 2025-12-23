import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { UserMembersPage } from "../../src/pages/UserMembersPage";
import { test } from "@playwright/test";

test.describe("Team Management", () => {
  let teamMembersPage: UserMembersPage;
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });

  test.beforeEach(async ({ page }) => {
    teamMembersPage = new UserMembersPage(page);
  });
  test("buyer should successfully invite team member", async ({ page }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.clickOnInviteMember();
    await teamMembersPage.fillMemberFirstName();
    await teamMembersPage.fillMemberLastName();
    await teamMembersPage.fillMemberEmail();
    await teamMembersPage.assignRandomRole();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertSuccessMessageIsVisible();
    await teamMembersPage.assertInvited();
  });

  test("buyer should successfully invite admin member: Bug", async ({
    page,
  }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.clickOnInviteMember();
    await teamMembersPage.checkAdminUserRadioButton();
    await teamMembersPage.fillMemberFirstName();
    await teamMembersPage.fillMemberLastName();
    await teamMembersPage.fillMemberEmail();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertSuccessMessageIsVisible();
  });

  test("should show validation errors when invite member without filled in data", async ({
    page,
  }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.clickOnInviteMember();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertErrors();
  });

  test("should successfully resend invitation ", async ({ page }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.resendInvite();

    //assert
    await teamMembersPage.assertRecendInvite();
  });

  test("should cansel resend invitation ", async ({ page }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.cancelResend();

    //assert
    await teamMembersPage.assertDialogIsCloced();
  });

  test("should edit invitation ", async ({ page }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.clickEditMember();
    await teamMembersPage.updateMemberLastName();
    await teamMembersPage.saveChanges();

    //assert
    await teamMembersPage.assertUpdateInvite();
    await teamMembersPage.assertDialogIsCloced();
  });

  test("should delete invitation ", async ({ page }) => {
    await teamMembersPage.goto();
    await teamMembersPage.assertLoaded();

    // act
    await teamMembersPage.deleteMember();

    //assert
    await teamMembersPage.assertDialogIsCloced();
    await teamMembersPage.assertDeleteInvite();
  });
});
