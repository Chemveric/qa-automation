import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { faker } from "@faker-js/faker";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("API smoke: Admin Signup Requests GET by ID.", () => {
  let api: AdminSignupRequestsApiClient;
  let adminCookie: string;
  let firstId: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupRequestsApiClient();
    await api.init({}, adminCookie);
    const params = {
      sort: ["createdAt", "DESC"],
      range: [0, 10],
      filter: { status: "PENDING", origin: "SITE" },
    };
    const res = await api.getAllAdminSignupRequests(params);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      UsersSignupRequestListSchema
    );
    firstId = validated.data[0].id;
  });

  test(`should return success when send request with valid Id`, async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getAdminSignupRequestById(firstId);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
  });

  test("should return 404 when send request with fake Id", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const fakeId = faker.string.uuid();
    const res = await api.getAdminSignupRequestById(fakeId);
    validator.expectStatusCodeAndMessage(
      res,
      404,
      "Value must be a valid JSON array of two strings"
    );
  });

  test("should return 400 when send request with no Id", async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getAdminSignupRequestById("");
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const fakeId = faker.string.uuid();
    await api.init({}, fakeCookie);
    const res = await api.getAdminSignupRequestById(fakeId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
