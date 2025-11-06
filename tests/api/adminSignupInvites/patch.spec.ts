import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { InvitationFactory } from "../../../src/utils/adminInvitations/invitationsFactory";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { invalidIds } from "../../../src/utils/invalidData/invalidInvitations";
import { log } from "../../../src/core/logger";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API smoke: PATCH Admin Signup Invite", () => {
  let api: AdminSignupInvitesApiClient;
  let invitationId: string;
  let adminCookie: string;
  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupInvitesApiClient();
    await api.init({}, adminCookie);
    const newInvitation = InvitationFactory.valid();
    const res = await api.postSignupInvite(newInvitation);
    invitationId = res.body.id;
  });

  test("should return success when resend invitation with valid ID.", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.patchSignupInvite(invitationId);
    expect(res.status).toBe(200);
  });

  test("should return 404 when resend invitation with invalid ID", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const id = faker.string.uuid();
    const res = await api.patchSignupInvite(id);
    validator.expectStatusCodeAndMessage(res, 404, "Invite not found");
  });

  test(`should return 401 when resend invitation with invalid cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init({ "Content-Type": false }, fakeCookie);
    const resNoAuth = await unauthApi.patchSignupInvite(invitationId);
    validator.expectStatusCodeAndMessage(resNoAuth, 401, "Unauthorized");
  });

  for (const id of invalidIds) {
    test(`should return 400 when resend invitation with invalid id type: ${id}`, async () => {
      await api.init({ "Content-Type": false }, adminCookie);
      const res = await api.patchSignupInvite(id);
      validator.expectStatusCodeAndMessage(
        res,
        400,
        "Validation failed (uuid is expected)"
      );
    });
  }

  test.afterAll(async () => {
      await api.init({ "Content-Type": false }, adminCookie);
      await api.deleteSignupInvite(invitationId);
      log.step(`Deleted test invitation with id: ${invitationId}`);
  });
});
