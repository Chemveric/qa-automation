import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { getBuyerCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { faker } from "@faker-js/faker";
import { RolesSchema } from "../../../src/schema/rolesSchema";

const validator = new ResponseValidationHelper();

test.describe("API: get organization roles", () => {
  let buyerCookie: string;
  let supplierCookie: string;
  const api = new OrganizationsApiClient();

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
    await api.init({}, buyerCookie);
  });

  test(`get buyer organization role`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, buyerCookie);
    const res = await api.getOrganizationRoles();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      RolesSchema
    );
    expect(validated.role).toEqual("BUYER");
    expect(validated.secondaryRole).toBeUndefined();
    expect(validated.subroles.BUYER).toEqual([
      "BUYER_PROCUREMENT_MANAGER",
      "BUYER_SCIENTIST",
      "BUYER_LEGAL",
      "BUYER_CUSTOMER_SERVICE",
    ]);
    expect(validated.subroles.VENDOR).toBeNull();
  });

  test(`get supplier organization role`, async () => {
    await api.init({}, supplierCookie);
    const res = await api.getOrganizationRoles();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      RolesSchema
    );
    expect(validated.role).toEqual("BUYER");
    expect(validated.secondaryRole).toEqual("VENDOR");
    expect(validated.subroles.BUYER).toEqual([
      "BUYER_PROCUREMENT_MANAGER",
      "BUYER_SCIENTIST",
      "BUYER_LEGAL",
      "BUYER_CUSTOMER_SERVICE",
    ]);
    expect(validated.subroles.VENDOR).toEqual([
      "VENDOR_SALES",
      "VENDOR_TECH_LEAD",
      "VENDOR_QUALITY",
    ]);
  });

  test("should return 401 Unauthorized when login with admin cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const api = new OrganizationsApiClient();
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationRoles();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
