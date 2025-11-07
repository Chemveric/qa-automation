import { test } from "@playwright/test";
import { SignupPage } from "../../src/pages/SignupPage";
import { createSignupTestData } from "../../src/data/signup.factory";

test.describe("ABA-US-001 Sign Up as Buyer Company Admin Role", () => {
  test("should successfully complete the signup flow as buyer.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = createSignupTestData();
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();

    await signupPage.verifyReviewMessage(user.email);
    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as supplier.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = createSignupTestData();
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyReviewMessage(user.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as buyer with subrole.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = createSignupTestData();
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();

    await signupPage.verifyReviewMessage(user.email);
    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as supplier with subrole.", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    const user = createSignupTestData();
    await signupPage.openAsGuest();
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationAndClickNext(user);

    await signupPage.verifyCompanyDetailsStep();
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();

    await signupPage.verifyReviewMessage(user.email);
    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });
});
