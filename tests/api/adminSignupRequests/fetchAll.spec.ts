import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { faker } from "@faker-js/faker";
import { signupRequestStatusEnum } from "../../../src/config/enums";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { z } from "zod";

const validator = new ResponseValidationHelper();

test.describe("API smoke: Admin Signup Requests GET ALL.", () => {
  let api: AdminSignupRequestsApiClient;
  let adminCookie: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new AdminSignupRequestsApiClient();
    await api.init({}, adminCookie);
  });
  for (const status of signupRequestStatusEnum) {
    test(`should return expected schema when send valid request with status: ${status}`, async () => {
      const params = {
        sort: ["createdAt", "DESC"],
        range: [0, 10],
        filter: { status: status, origin: "SITE" },
      };
      const res = await api.getAllAdminSignupRequests(params);
      expect(res.status).toBe(200);
      const body = await res.body;
      type UsersResponse = z.infer<typeof UsersSignupRequestListSchema>;
      const validated: UsersResponse = await validateResponse(
        { status: res.status, body },
        UsersSignupRequestListSchema
      );
      expect(validated.data).toBeInstanceOf(Array);
    });
  }

  test("should return expected schema when send valid request with no params", async () => {
    const res = await api.getAllAdminSignupRequests();
    expect(res.status).toBe(200);
    const body = await res.body;
    type UsersResponse = z.infer<typeof UsersSignupRequestListSchema>;
    const validated: UsersResponse = await validateResponse(
      { status: res.status, body },
      UsersSignupRequestListSchema
    );
    expect(validated.data).toBeInstanceOf(Array);
  });

  test("should return 400 when send invalid status value in params", async () => {
    const res = await api.getAllAdminSignupRequests({
      filter: { status: "something", origin: "SITE" },
    });
    validator.expectStatusCodeAndMessage(res, 400, "Invalid status filter");
  });

  test("should return 400 when send invalid status and origin value in params.", async () => {
    const res = await api.getAllAdminSignupRequests({
      filter: { status: "", origin: "" },
    });
    validator.expectStatusCodeAndMessage(res, 400, "Invalid status filter");
  });

  test("should return 422 when send invalid sort param", async () => {
    const res = await api.getAllAdminSignupRequests({
      sort: ["sendDateTime", "ASC"],
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two strings"
    );
  });

  test("should return 422 when send invalid range param", async () => {
    const res = await api.getAllAdminSignupRequests({
      range: [faker.word.words(1), faker.word.words(1)],
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two numbers"
    );
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    await api.init({}, fakeCookie);
    const res = await api.getAllAdminSignupRequests();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
