import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { SearchResponseSchema } from "../../../src/schema/vendorServicesSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET vendor services search", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return a valid schema when Supplier performs a search`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getSearch({ query: "oligos" });
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      SearchResponseSchema
    );
    expect(validated).toHaveProperty("searchResult");
  });

  test(`should return a valid schema when Buyer performs a search`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getSearch({ query: "chemical", itemsCount: 5 });
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      SearchResponseSchema
    );
    expect(validated.searchResult.length).toBe(5);
    expect(validated).toHaveProperty("searchResult");
  });

  test(`should return 422 when Buyer search with invalid data type`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getSearch({ query: 8346, itemsCount: "hello" });
    console.log("RES: ", resGet);
    validator.expectStatusCodeAndMessage(resGet, 422, "TAXON003", "itemsCount");
  });

  test(`should return 422 when Buyer perform search with empty data`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getSearch({ query: "", itemsCount: "" });
    console.log("RES: ", resGet);
    validator.expectStatusCodeAndMessage(resGet, 422, "TAXON003", "itemsCount");
  });
});
