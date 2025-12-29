import { test, expect } from "@playwright/test";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { SuppliersApiClient } from "../../../src/api/suppliers/SuppliersApiClient";
import { SuppliersServicesListSchema } from "../../../src/schema/suppliersServicesSchema";

const validator = new ResponseValidationHelper();

test.describe("API: Get suppliers services", () => {
  let api: SuppliersApiClient;
  let adminCookie: string;
  let supplierCoockie: string;
  let buyerCookie: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    supplierCoockie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
  });

  test(`should return expected schema when send request with supplier coockie`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);

    const res = await api.getSupplierServices();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersServicesListSchema
    );
    expect(Array.isArray(validated.services)).toBe(true);
  });

  test(`should return expected schema when send request with buyer coockie`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, buyerCookie);

    const res = await api.getSupplierServices();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersServicesListSchema
    );
    expect(Array.isArray(validated.services)).toBe(true);
  });

  test(`should return expected schema when send request with admin coockie`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, adminCookie);

    const res = await api.getSupplierServices();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersServicesListSchema
    );
    expect(Array.isArray(validated.services)).toBe(true);
  });

  test.skip(`Bug: should return Unauthorized with fake coockie`, async () => {
    api = new SuppliersApiClient();
    let fakeCookie = "invalid_cookie_value";
    await api.init({}, fakeCookie);

    const res = await api.getSupplierServices();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
