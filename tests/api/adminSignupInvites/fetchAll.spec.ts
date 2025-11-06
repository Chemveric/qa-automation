import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { validateSignupInviteSchema } from "../../../src/utils/validateSignupInviteSchema";
import { faker } from "@faker-js/faker";
import { signupInviteStatusEnum } from "../../../src/config/enums";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("API smoke: Admin Signup Invites Get ALL.", () => {
  for (const status of signupInviteStatusEnum) {
    test(`should return expected schema when send valid request with status: ${status}`, async () => {
      const adminCookie = getAdminCookie();
      const api = new AdminSignupInvitesApiClient();
      await api.init({}, adminCookie);
      const res = await api.getAdminSignupInvites({
        sort: ["sendDate", "DESC"],
        range: [0, 10],
        filter: { status: status },
      });
      const invited = res.body.data;
      expect(res.status).toBe(200);
      for (const user of invited) {
        expect(() => {
          try {
            validateSignupInviteSchema(user);
          } catch (e) {
            throw new Error(
              `Schema validation is failed for user ${user}: ${
                (e as Error).message
              }`
            );
          }
        }).not.toThrow();
      }
    });
  }
});

test("should return expected schema when send valid request with no params", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites();
  const invited = res.body.data;
  expect(res.status).toBe(200);
  for (const user of invited) {
    expect(() => {
      try {
        validateSignupInviteSchema(user);
      } catch (e) {
        throw new Error(
          `Schema validation is failed for user ${user}: ${
            (e as Error).message
          }`
        );
      }
    }).not.toThrow();
  }
});

test("should return 401 Unauthorized when login with fake cookie", async () => {
  const api = new AdminSignupInvitesApiClient();
  const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
  await api.init({}, fakeCookie);
  const res = await api.getAdminSignupInvites();
  validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
});

test("should return 400 when send invalid status value in params", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    filter: { status: "Sorted" },
  });
  validator.expectStatusCodeAndMessage(res, 400, "Invalid status filter");
});

test("should return 422 when send invalid sort param", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    sort: ["sendDateTime", "DESC"],
  });
  validator.expectStatusCodeAndMessage(
    res,
    422,
    "Value must be a valid JSON array of two strings"
  );
});

test("should return 422 when send invalid range param", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    range: [faker.word.words(1), faker.word.words(1)],
  });
  validator.expectStatusCodeAndMessage(
    res,
    422,
    "Value must be a valid JSON array of two numbers"
  );
});
