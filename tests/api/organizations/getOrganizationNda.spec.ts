import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { randomUUID } from "crypto";
import { getBuyerCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { NdaListSchema } from "../../../src/schema/organizationNdaSchema";

const validator = new ResponseValidationHelper();

test.describe("API: get organization nda", () => {
  let buyerCookie: string;

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
  });

  test(`should return nda details for buyer`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, buyerCookie);

    const res = await api.getOrganizationNda();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      NdaListSchema
    );
    expect(validated).not.toBeNull();
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    const api = new OrganizationsApiClient();
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationNda();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
