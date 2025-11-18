import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { randomUUID } from "crypto";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { OrganizationSchema } from "../../../src/schema/organizationSchema";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { ENV } from "../../../src/config/env";

const validator = new ResponseValidationHelper();

test.describe("API: get organization details", () => {
  let buyerCookie: string;
  let supplierCookie: string;
  let adminCoockie: string;
  const api = new OrganizationsApiClient();

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
    adminCoockie = getAdminCookie();
  });

  test(`should return organization with existing buyer details`, async () => {
    await api.init({}, buyerCookie);
    const res = await api.getOrganizationDetails();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      OrganizationSchema
    );
    expect(validated.email).toBe(ENV.buyer.email);
  });

  test(`should return organization with existing suppliyer details`, async () => {
    await api.init({}, supplierCookie);
    const res = await api.getOrganizationDetails();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      OrganizationSchema
    );
    expect(validated.email).toBe(ENV.vendor.email);
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationDetails();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test("should return 401 Unauthorized when login with admin cookie", async () => {
    await api.init({}, adminCoockie);
    const res = await api.getOrganizationDetails();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
