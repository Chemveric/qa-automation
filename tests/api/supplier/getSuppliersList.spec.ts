import { test, expect } from "@playwright/test";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { SuppliersApiClient } from "../../../src/api/SuppliersApiClient";
import { SuppliersResponseSchema } from "../../../src/schema/supplierSchema";

const validator = new ResponseValidationHelper();

test.describe("API: Get emails filtered", () => {
  let api: SuppliersApiClient;
  let adminCookie: string;
  let supplierCoockie: string;
  let buyerCookie: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    supplierCoockie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    api = new SuppliersApiClient();
    await api.init({}, adminCookie);
  });

  test(`should return expected schema when send valid request with parameters`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params = {
      modes: ["CATALOG", "CRO_CDMO"],
    };
    const res = await api.getSuppliersList(params);
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersResponseSchema
    );
    expect(Array.isArray(validated)).toBe(true);
  });

  test("should return expected schema when send valid request without parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const res = await api.getSuppliersList();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersResponseSchema
    );
    expect(Array.isArray(validated)).toBe(true);
  });

  test("should return 422 when send valid request with wrong parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params = {
      modes: ["SOME_NAME"],
    };
    const res = await api.getSuppliersList(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "each value in modes must be one of the following values: CATALOG, CRO_CDMO"
    );
  });

  test("should return expected schema for admin", async () => {
    api = new SuppliersApiClient();
    await api.init({}, adminCookie);
    const res = await api.getSuppliersList();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersResponseSchema
    );
    expect(Array.isArray(validated)).toBe(true);
  });

  test("should return expected schema for buyer", async () => {
    api = new SuppliersApiClient();
    await api.init({}, buyerCookie);
    const res = await api.getSuppliersList();
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersResponseSchema
    );
    expect(Array.isArray(validated)).toBe(true);
  });
});
