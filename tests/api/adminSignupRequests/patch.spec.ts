import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe.skip("API smoke: Admin Signup Requests PATCH Status", () => {
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

  test(`should return success when send request with valid APPROVED status`, async () => {
    const body = {
      status: "APPROVED",
    };
    const res = await api.patchSignupInvite(firstId, body);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    await api.init({ "Content-Type": false }, adminCookie);
    const updatedRes = await api.getAdminSignupRequestById(firstId);
    expect(
      updatedRes.body.status,
      `Expected status is APPROVED, but got ${updatedRes.body.status}`
    ).toBe(body.status);
  });

  test("should return success when send request with valid REJECTED status", async () => {
    const body = {
      status: "REJECTED",
      rejectReason: "Docs did not meet requirements",
    };
    const res = await api.patchSignupInvite(firstId, body);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    await api.init({ "Content-Type": false }, adminCookie);
    const updatedRes = await api.getAdminSignupRequestById(firstId);
    expect(
      updatedRes.body.status,
      `Expected status is REJECTED, but got ${updatedRes.body.status}`
    ).toBe(body.status);
  });

  test("should return 422 when send request with not valid status", async () => {
    const body = {
      status: "status",
    };
    const res = await api.patchSignupInvite(firstId, body);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "status must be one of the following values: APPROVED, REJECTED"
    );
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const fakeId = faker.string.uuid();
    await api.init({}, fakeCookie);
    const body = {
      status: "status",
    };
    const res = await api.patchSignupInvite(fakeId, body);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
