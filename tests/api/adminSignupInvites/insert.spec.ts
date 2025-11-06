import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { faker } from "@faker-js/faker";
import { InvitationFactory } from "../../../src/utils/adminInvitations/invitationsFactory";
import { invalidEmails } from "../../../src/utils/invalidData/invalidEmails";
import {
  invalidInvitations,
  requiredFields,
} from "../../../src/utils/invalidData/invalidInvitations";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { log } from "../../../src/core/logger";

const validator = new ResponseValidationHelper();

test.describe("API smoke: POST Admin Signup Invite", () => {
  let api: AdminSignupInvitesApiClient;
  let newInvites: string[] = [];
  let adminCookie: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupInvitesApiClient();
    await api.init({}, adminCookie);
  });

  test(`should return success when send body with valid data`, async () => {
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

  test(`should return "409 Conflict" when send request with the same data second time`, async () => {
    const newInvitation = InvitationFactory.valid();
    const res = await api.postSignupInvite(newInvitation);
    const res2 = await api.postSignupInvite(newInvitation);
    newInvites.push(res.body.id);
    validator.expectStatusCodeAndMessage(
      res2,
      409,
      "Invite already sent to this email"
    );
  });

  for (const badEmail of invalidEmails) {
    test(`should return 422 when POST invitation with invalid email: ${badEmail}`, async () => {
      const invitationBody = InvitationFactory.invitationWithEmail(
        badEmail as any
      );
      const res = await api.postSignupInvite(invitationBody);
      validator.expectStatusCodeAndMessage(res, 422, "email must be an email");
    });
  }

  for (const [field, invalidValues] of Object.entries(invalidInvitations)) {
    for (const { value, expectedError } of invalidValues) {
      test(`should return 422 when POST invitation with invalid or empty value: ${field} = "${value}"`, async () => {
        const invitation = InvitationFactory.invalid(field, value);
        const res = await api.postSignupInvite(invitation);
        validator.expectStatusCodeAndMessage(res, 422, expectedError, field);
      });
    }
  }

  test(`should return "401 Unauthorized" when POST without token`, async () => {
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init();
    const newInvitation = InvitationFactory.valid();
    const resNoAuth = await unauthApi.postSignupInvite(newInvitation);
    validator.expectStatusCodeAndMessage(resNoAuth, 401, "Unauthorized");
  });

  test(`should return "401 Unauthorized" when POST with invalid cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init({}, fakeCookie);
    const newInvitation = InvitationFactory.valid();
    const resNoAuth = await unauthApi.postSignupInvite(newInvitation);
    validator.expectStatusCodeAndMessage(resNoAuth, 401, "Unauthorized");
  });

  for (const { field, message } of requiredFields) {
    test(`should return 422 when POST with no required field: ${field}`, async () => {
      const bodyWithoutField = InvitationFactory.missing(field);
      const res = await api.postSignupInvite(bodyWithoutField);
      validator.expectMultipleFieldErrors(res, 422, {
        [field]: message,
      });
    });
  }

  test.afterAll(async () => {
    for (const invite of newInvites) {
      await api.init({ "Content-Type": false }, adminCookie);
      await api.deleteSignupInvite(invite);
      log.step(`Deleted test invitation with id: ${invite}`);
    }
  });
});
