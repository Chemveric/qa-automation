import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { AdminOrganizationsApiClient } from "../../../src/api/AdminOrganizationsApiClient";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { RolesetSchema } from "../../../src/schema/roleSetSchema";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: GET Admin Organization roleset", () => {
  let api: AdminOrganizationsApiClient;

  test(`should return valid schema for admin organization`, async () => {
    let adminCookie = getAdminCookie();
    api = new AdminOrganizationsApiClient();
    await api.init({}, adminCookie);
    const res = await api.getOrganizationsRoleset();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      RolesetSchema
    );
  });

  test(`should return 401 Unauthorized when call with fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    api = new AdminOrganizationsApiClient();
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationsRoleset();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
