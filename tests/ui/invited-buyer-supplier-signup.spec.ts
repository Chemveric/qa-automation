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
    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
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
    await signupPage.selectSupplierRoleAndClickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
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
    await signupPage.selectBuyerRoleWithSubroleAndClickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
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
    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
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
    await signupPage.selectBuyerRoleAndClickNext();
    await signupPage.clickBack();
    await signupPage.verifyBuyerRadioIsChecked();
    await signupPage.clickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.clickBack();
    await signupPage.verifyPersonalInfoIsFilled(invitationData, user);
    await signupPage.clickNext();
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
  });

  test("should allow user to navigate back and see previously filled data and change it", async ({
    page,
  }) => {
    const invitationData = InvitationFactory.valid();
    // const invitationData2 = InvitationFactory.valid();
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
    console.log("DATA: ", user.role, invitationData);
    await signupPage.openAsInvitedUser(validToken);
    await signupPage.clickSignUpButton();
    await signupPage.selectBuyerRoleAndClickNext();
    await page.pause();
    await signupPage.clickBack();
    await signupPage.verifyBuyerRadioIsChecked();
    await signupPage.selectSupplierRoleWithSubroleAndClickNext();
    await signupPage.prefilledPersonalInfoFillRoleAndClickNext(
      invitationData,
      user
    );
    await signupPage.clickBack();
    await page.pause();
    await signupPage.verifyPersonalInfoIsFilled(invitationData, user);
    await page.pause();
    await signupPage.fillInPersonalInformationAndClickNext(
      user2
    );
    await signupPage.fillInCompanyInformation(user.company);
    await signupPage.finishSignUp(invitationData.email);
  });

  test.afterAll(async () => {
    for (const invite of newInvites) {
      await api.init({ "Content-Type": false }, adminCookie);
      await api.deleteSignupInvite(invite);
      log.step(`Deleted test invitation with id: ${invite}`);
    }
  });
});
