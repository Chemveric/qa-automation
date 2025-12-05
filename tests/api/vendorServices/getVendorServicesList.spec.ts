import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ServicesListSchema } from "../../../src/schema/vendorServicesSchema";


test.describe("API: GET vendor services list", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return valid schema when supplier get services list`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getList();
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      ServicesListSchema
    );
    validated.forEach((item) => {
      expect(item).toHaveProperty("categoryName");
      expect(item).toHaveProperty("categoryCode");
      expect(item).toHaveProperty("services");
    });
  });

  test(`should return valid schema when buyer get services list`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getList();
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      ServicesListSchema
    );
    validated.forEach((item) => {
      expect(item).toHaveProperty("categoryName");
      expect(item).toHaveProperty("categoryCode");
      expect(item).toHaveProperty("services");
    });
  });

  test(`should return valid schema when admin get services list`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const resGet = await api.getList();
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      ServicesListSchema
    );
    validated.forEach((item) => {
      expect(item).toHaveProperty("categoryName");
      expect(item).toHaveProperty("categoryCode");
      expect(item).toHaveProperty("services");
    });
  });
});
