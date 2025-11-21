import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { getBuyerCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { RolesetSchema } from "../../../src/schema/rolesetSchema";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: get organization roleset", () => {
  let buyerCookie: string;
  let supplierCookie: string;
  const api = new OrganizationsApiClient();

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
    await api.init({}, buyerCookie);
  });

  test(`get buyer organization roleset`, async () => {
    await api.init({}, buyerCookie);
    const res = await api.getOrganizationRoleset();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      RolesetSchema
    );
    expect(validated.roles).toEqual(["BUYER", "VENDOR"]);
    expect(validated.vendorModes).toEqual(["CATALOG", "CRO_CDMO"]);
  });

  test(`get supplier organization roleset`, async () => {
    await api.init({}, supplierCookie);
    const res = await api.getOrganizationRoleset();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      RolesetSchema
    );
    expect(validated.roles).toEqual(["BUYER", "VENDOR"]);
    expect(validated.vendorModes).toEqual(["CATALOG", "CRO_CDMO"]);
  });

  test("should return 401 Unauthorized when login with admin cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const api = new OrganizationsApiClient();
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationRoleset();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
