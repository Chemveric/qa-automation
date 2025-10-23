import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { faker } from "@faker-js/faker";

test.describe("API smoke: PATCH.", () => {
  test("API smoke: resend invitation with valid ID.", async () => {
    const adminCookie = getAdminCookie();
    const api = new AdminSignupInvitesApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const id = "5943ad04-0937-4e3e-81a7-bef01b4b3f72";
    const res = await api.patchSignupInvite(id);
    console.log(res);
    expect(res.status).toBe(200);
  });

  test("API smoke: resend invitation with invalid ID", async () => {
    const adminCookie = getAdminCookie();
    const api = new AdminSignupInvitesApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const id = faker.string.uuid();
    const res = await api.patchSignupInvite(id);
    console.log(res.body.message);
    expect(res.status).toBe(200);

  });
});
