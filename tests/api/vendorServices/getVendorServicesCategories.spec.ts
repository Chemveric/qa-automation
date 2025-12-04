import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { CategoriesShema } from "../../../src/schema/vendorServicesShema";


test.describe("API: GET categories of vendor services", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return valid shema when supplier get categories`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getCategories();
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      CategoriesShema
    );
    validated.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("code");
      expect(item).toHaveProperty("name");
    });
  });

  test(`should return valid shema when buyer get categories`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getCategories();
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      CategoriesShema
    );
    validated.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("code");
      expect(item).toHaveProperty("name");
    });
  });

  test(`should return valid shema when admin get categories`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const resGet = await api.getCategories();
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      CategoriesShema
    );
     validated.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("code");
      expect(item).toHaveProperty("name");
    });
  });
});
