import { test } from "@playwright/test";
import { SignupPage } from "../../src/pages/SignupPage";
import { SignupTestData } from "../../src/data/signupTestData";
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
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.verifyPrefilledPersonalInfo(invitationData);

    await signupPage.clickNext();
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
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.verifyPrefilledPersonalInfo(invitationData);

    await signupPage.clickNext();
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
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    await signupPage.openAsInvitedUser(validToken);

    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.verifyPrefilledPersonalInfo(invitationData);

    await signupPage.clickNext();
    await signupPage.verifyCompanyDetailsStep();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test("should successfully complete the signup flow as invited supplier with subrole.", async ({
    page,
  }) => {
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.verifyPersonalInfoStep();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.verifyPrefilledPersonalInfo(invitationData);

    await signupPage.clickNext();
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
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.clickBack();

    await signupPage.verifyBuyerRadioIsChecked();
    await signupPage.clickNext();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.verifyPrefilledPersonalInfo(invitationData);
    await signupPage.clickNext();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickBack();

    await signupPage.verifyFullPersonalInfoIsFilled(invitationData, user);
    await signupPage.clickNext();
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(invitationData.email);

    await signupPage.clickDone();
    await signupPage.verifyPendingReviewMessage();
  });

  test.skip("should allow user to navigate back and see previously filled data and change it", async ({
    page,
  }) => {
    const invitationData = InvitationFactory.valid();
    const res = await api.postSignupInvite(invitationData);
    const jwtWrapper = new JoseJwtWrapper();
    const invitationId = res.body.id;
    newInvites.push(invitationId);
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const signupPage = new SignupPage(page);
    const user = SignupTestData.invitedUser;
    const user2 = SignupTestData.guestUser;

    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.verifyBusinessTypeStep();

    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.clickBack();
    await signupPage.verifyBuyerRadioIsChecked();

    await signupPage.selectSupplierRoleWithSubroleAndClickNext();

    await signupPage.prefilledPersonalInfoFillRole(user);
    await signupPage.clickNext();


    await signupPage.clickBack();
    await signupPage.verifyFullPersonalInfoIsFilled(invitationData, user);

    await signupPage.fillInPersonalInformationAndClickNext(user2);
    await signupPage.clickNext();

    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.clickNext();
    await signupPage.verifyToastMessage();
    await signupPage.verifyReviewMessage(user2.email);
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
