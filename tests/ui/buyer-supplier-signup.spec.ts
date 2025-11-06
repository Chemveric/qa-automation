import { test } from "@playwright/test";
import { SignupPage } from "../../src/pages/SignupPage";
import { SignupTestData } from "../../src/data/signupTestData";

test.describe("ABA-US-001 Sign Up as Buyer Company Admin Role", () => {
  test("should successfully complete the signup flow as buyer.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = SignupTestData.guestUser;
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(user.email);
  });

  test("should successfully complete the signup flow as supplier.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = SignupTestData.guestUser;
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.selectSupplierRoleAndClickNext();
    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(user.email);
  });

  test("should successfully complete the signup flow as buyer with subrole.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = SignupTestData.guestUser;
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.selectBuyerRoleWithSubroleAndClickNext();
    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(user.email);
  });

  test("should successfully complete the signup flow as supplier with subrole.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = SignupTestData.guestUser;
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(user.email);
  });
});
