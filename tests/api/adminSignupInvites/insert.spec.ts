import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { faker } from "@faker-js/faker";
import { InvitationFactory } from "../../../src/utils/invitationsFactory";
import { invalidEmails } from "../../../src/utils/invalidData/invalidEmails";
import { invalidInvitations } from "../../../src/utils/invalidData/invalidInvitations";

test.describe("API smoke: POST new invite.", () => {
  let api: AdminSignupInvitesApiClient;
  let newInvites = [];

  test.beforeAll(async () => {
    const adminCookie = getAdminCookie();
    api = new AdminSignupInvitesApiClient();
    await api.init({}, adminCookie);
  });

  test(`POST new user invitation, expect success`, async () => {
    const newInvitation = InvitationFactory.valid();
    const res = await api.postSignupInvite(newInvitation);
    expect(
      res.status,
      `Expected status code is 201, but got ${res.status}`
    ).toBe(201);
    newInvites.push(res.body.id);
    expect(
      res.body.status,
      `Expected invitation status is INVITED, but got ${res.body.status}`
    ).toBe("INVITED");
    expect(
      res.body.companyName,
      `Expected invitation status is ${newInvitation.companyName}, but got ${res.body.status}`
    ).toBe(newInvitation.companyName);
    expect(
      res.body.firstName,
      `Expected invitation status is ${newInvitation.firstName}, but got ${res.body.firstName}`
    ).toBe(newInvitation.firstName);
    expect(
      res.body.lastName,
      `Expected invitation status is ${newInvitation.lastName}, but got ${res.body.lastName}`
    ).toBe(newInvitation.lastName);
    expect(
      res.body.email,
      `Expected invitation status is ${newInvitation.email}, but got ${res.body.email}`
    ).toBe(newInvitation.email);
  });

  test(`POST same user invitation two times, expect 422 ??? Unprocessable Content`, async () => {
    const newInvitation = InvitationFactory.valid();
    const res = await api.postSignupInvite(newInvitation);
    const res2 = await api.postSignupInvite(newInvitation);
 
    expect(
      res2.status,
      `Expected status code is 400, but got ${res.status}`
    ).toBe(400);
    newInvites.push(res.body.id);
    const expectedErrorMessage = "Invite already sent to this email";
    expect(
      res.body.message,
      `Expected error message is ${expectedErrorMessage}, but got ${res.body.message}`
    ).toBe(expectedErrorMessage);
  });

  for (const badEmail of invalidEmails) {
    test(`POST invitation with invalid email: ${badEmail}, expected status code is 400`, async () => {
      const invitationBody = InvitationFactory.invitationWithEmail(
        badEmail as any
      );
      const res = await api.postSignupInvite(invitationBody);
      const expectedErrorMessage = "Email format is wrong";
      expect(
        res.status,
        `Expected status code is 400, but got ${res.status}`
      ).toBe(400);
      expect(
        res.body.errors.email,
        `Expected error message is ${expectedErrorMessage}, but got ${res.body.errors.email}`
      ).toBe(expectedErrorMessage);
    });
  }

  for (const [field, invalidValues] of Object.entries(invalidInvitations)) {
    for (const { value, expectedError } of invalidValues) {
      test(`POST invitation with invalid or empty value: ${field} = "${value}", expected status code is 400`, async () => {
        const invitation = InvitationFactory.invalid(field, value);
        const res = await api.postSignupInvite(invitation);
        expect(res.status).toBe(400);
        const errorMsg =
          res.body.error ||
          res.body.message ||
          res.body.errors?.[field] ||
          JSON.stringify(res.body);
        expect(
          errorMsg,
          `Expected "${expectedError}" but got "${errorMsg}"`
        ).toContain(expectedError);
      });
    }
  }

  test(`POST without token, expected 401 Unauthorized`, async () => {
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init();
    const newInvitation = InvitationFactory.valid();
    const resNoAuth = await unauthApi.postSignupInvite(newInvitation);
    expect(
      resNoAuth.status,
      `Expected status code 401, but got ${resNoAuth.status}`
    ).toBe(401);
  });

  test(`POST with invalid cookie, expected 401 Unauthorized`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init({}, fakeCookie);
    const newInvitation = InvitationFactory.valid();
    const resNoAuth = await unauthApi.postSignupInvite(newInvitation);
    expect(
      resNoAuth.status,
      `Expected status code 401, but got ${resNoAuth.status}`
    ).toBe(401);
    const expectedErrorMessage = "Admin access required";
    expect(
      resNoAuth.body.message,
      `Expected error message is: ${expectedErrorMessage}, but got: ${resNoAuth.body.message}`
    ).toBe(expectedErrorMessage);
  });
});
