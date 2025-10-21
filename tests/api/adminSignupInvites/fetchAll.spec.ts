import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { validateSchema } from "../../../src/utils/validateSchema";
import { faker } from "@faker-js/faker";
import { statusEnum, StatusEnum } from "../../../src/config/enums";

test.describe("API smoke: get invites with different statuses and validate shema.", () => {
  for (const status of statusEnum) {
    test(`should get users with status: ${status}`, async () => {
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
  }
});

test("API smoke: get all invites and validate shema.", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
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

test("API smoke: login with incorrect cookie, expected response status is 401 Unauthorized.", async () => {
  const api = new AdminSignupInvitesApiClient();
  const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
  await api.init({}, fakeCookie);
  const res = await api.getAdminSignupInvites();
  expect(res.status, `Expected status code is 401, but got: ${res.status}`).toBe(401);
});

test("API smoke: get invites with invalid status param, expected response status is 400 Bad Request.", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    filter: { status: "invited" },
  });
  const expectedErrorMessage = "Invalid status filter";
  expect(res.status).toBe(400);
  expect(
    res.body.message,
    `Expected error message is: ${expectedErrorMessage}, but got: ${res.body.message}`
  ).toContain(expectedErrorMessage);
});

test("API smoke: get invites with invalid sort param, expected response status is 400 Bad Request.", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    sort: ["sendDateTime", "DESC"],
  });
  const expectedErrorMessage = "Value must be a valid JSON array of two strings";
  expect(res.status).toBe(400);
  expect(
    res.body.message,
    `Expected error message is: ${expectedErrorMessage}, but got: ${res.body.message}`
  ).toContain(expectedErrorMessage);
});

test("API smoke: get invites with invalid range param, expected response status is 400 Bad Request.", async () => {
  const adminCookie = getAdminCookie();
  const api = new AdminSignupInvitesApiClient();
  await api.init({}, adminCookie);
  const res = await api.getAdminSignupInvites({
    range: [faker.word.words(1), faker.word.words(1)],
  });
  const expectedErrorMessage = "Value must be a valid JSON array of two numbers";
  expect(res.status).toBe(400);
  expect(
    res.body.message,
    `Expected error message is: ${expectedErrorMessage}, but got: ${res.body.message}`
  ).toContain(expectedErrorMessage);
});