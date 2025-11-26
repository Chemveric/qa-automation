import { test } from "@playwright/test";
import { SignupPage } from "../../src/pages/SignupPage";
import { createSignupTestData } from "../../src/data/signup.factory";
import { AdminSignupInvitesApiClient } from "../../src/api/AdminSignupInvitesApiClient";
import { getAdminCookie } from "../../src/utils/getEnv";
import { InvitationFactory } from "../../src/utils/adminInvitations/invitationsFactory";
import { JoseJwtWrapper } from "../../helpers/jwt/jose-jwt-wrapper.service";
import { log } from "../../src/core/logger";

test.describe("ABA-US-001 Sign Up as Buyer and Supplier Invited by Admin ", () => {
  let api: AdminSignupInvitesApiClient;
  let newInvites: string[] = [];
  let adminCookie: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupInvitesApiClient();
    await api.init({}, adminCookie);
  });

  test("should successfully complete the signup flow as invited buyer.", async ({
    page,
  }) => {
    const user = createSignupTestData();
    const invitationData = InvitationFactory.invitationWithEmail(user.email);
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationWithCompanyAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as invited supplier.", async ({
    page,
  }) => {
    const user = createSignupTestData();
    const invitationData = InvitationFactory.invitationWithEmail(user.email);
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationWithCompanyAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as invited buyer with subrole.", async ({
    page,
  }) => {
    const user = createSignupTestData();
    const invitationData = InvitationFactory.invitationWithEmail(user.email);
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);

    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationWithCompanyAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(user.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as invited supplier with subrole.", async ({
    page,
  }) => {
    const user = createSignupTestData();
    const invitationData = InvitationFactory.invitationWithEmail(user.email);
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.fillInPersonalInformationWithCompanyAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should allow user to navigate back and see previously filled data", async ({
    page,
  }) => {
    const user = createSignupTestData();
    const invitationData = InvitationFactory.invitationWithEmail(user.email);
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();
    await signupPage.clickBack();

    await signupPage.verifyBuyerRadioIsChecked();
    await signupPage.clickNext();

    await signupPage.fillInPersonalInformationWithCompanyAndClickNext(user);
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickBack();

    await signupPage.verifyFullPersonalInfoIsFilled(invitationData, user);
    await signupPage.clickNext();
    await signupPage.verifyCompanyDetailsStep();
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test.afterAll(async () => {
    for (const invite of newInvites) {
      await api.init({ "Content-Type": false }, adminCookie);
      await api.deleteSignupInvite(invite);
      log.step(`Deleted test invitation with id: ${invite}`);
    }
  });
});
