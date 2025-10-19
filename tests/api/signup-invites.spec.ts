import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../src/utils/getEnv";
import { AuthClient } from "../../src/api/AuthClient";
import { validateSchema } from "../../src/utils/validateSchema";

test("API smoke: get all invited users and validate shema.", async () => {
  const adminCookie = getAdminCookie();
  const api = new AuthClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites();
  const invited = res.body.data;
  expect(res.status).toBe(200);
  for (const user of invited) {
    expect(() => {
      try {
        validateSchema(user);
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
