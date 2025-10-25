import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { InvitationFactory } from "../../../src/utils/invitationsFactory";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { invalidIds } from "../../../src/utils/invalidData/invalidInvitations";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API smoke: DELETE", () => {
  let api: AdminSignupInvitesApiClient;
  let newInvites = [];
  let invitationId: string;
  let adminCookie: string;
  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupInvitesApiClient();
    await api.init({}, adminCookie);
    const newInvitation = InvitationFactory.valid();
    const res = await api.postSignupInvite(newInvitation);
    invitationId = res.body.id;
    newInvites.push(invitationId);
  });

  test("DELETE invitation with valid ID and check it is removed from the invitations list.", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.deleteSignupInvite(invitationId);
    console.log("RESPONSE: ", res);
    expect(res.status).toBe(200);
    expect(res.ok).toBeTruthy();

    const getInvited = await api.getAdminSignupInvites({
      sort: ["sendDate", "DESC"],
      range: [0, 1],
      filter: { status: "INVITED" },
    });
    const invited = getInvited.body.data;
    expect(invited[0].id).not.toBe(invitationId);
  });

  test("DELETE invitation with fake ID", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const id = faker.string.uuid();
    const res = await api.deleteSignupInvite(id);
    validator.expectStatusCodeAndMessage(res, 404, "Invite not found");
  });

  test(`DELETE invitation with invalid cookie, expected 401 Unauthorized`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const unauthApi = new AdminSignupInvitesApiClient();
    await unauthApi.init({ "Content-Type": false }, fakeCookie);
    const id = faker.string.uuid();
    const resNoAuth = await unauthApi.deleteSignupInvite(id);
    validator.expectStatusCodeAndMessage(resNoAuth, 401, "Unauthorized");
  });

  for (const id of invalidIds) {
    test(`DELETE invitation with invalid id type: ${id}`, async () => {
      await api.init({ "Content-Type": false }, adminCookie);
      const res = await api.deleteSignupInvite(id);
      validator.expectStatusCodeAndMessage(res, 400, "Validation failed (uuid is expected)");
    });
  }
});
