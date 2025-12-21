import { test, expect } from "@playwright/test";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { SuppliersApiClient } from "../../../src/api/suppliers/SuppliersApiClient";
import { SuppliersSearchRequest } from "../../../src/api/suppliers/suppliers.types";
import { SuppliersSearchSchema } from "../../../src/schema/supplierSearchSchema";
import { SuppliersShortSchema } from "../../../src/schema/supplierShortSchema";

const validator = new ResponseValidationHelper();

test.describe("API: POST search suppliers", () => {
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

  test(`should return expected schema when send valid request with limit`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "",
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "region",
      sortDir: "desc",
    };
    const res = await api.postSuppliersSearch(params);
    expect(res.status).toBe(201);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersSearchSchema,
      201
    );
    expect(validated.items).toHaveLength(20);
  });

  test("should return expected schema when send valid request with query parameter", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "name",
      sortDir: "asc",
    };
    const res = await api.postSuppliersSearch(params);
    expect(res.status).toBe(201);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersSearchSchema,
      201
    );
    const names = validated.items.map((item) => item.name);

    expect(names.some((name) => name.includes("Chemveric"))).toBe(true);
  });

  test("should return expected schema when send valid request with product type parameter", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: ["PEPTIDE"],
      },
      limit: 20,
      sortField: "name",
      sortDir: "asc",
    };
    const res = await api.postSuppliersSearch(params);
    expect(res.status).toBe(201);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersSearchSchema,
      201
    );
    const names = validated.items.map((item) => item.name);

    expect(names.some((name) => name.includes("Chemveric"))).toBe(true);
  });

  test("should return 422 when send valid request with wrong sort parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "id",
      sortDir: "asc",
    };
    const res = await api.postSuppliersSearch(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "sortField must be one of the following values: name, country, region"
    );
  });

  test("should return 422 when send valid request with wrong product type parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: ["SOME_NAME"],
      },
      limit: 20,
      sortField: "name",
      sortDir: "asc",
    };
    const res = await api.postSuppliersSearch(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "each value in productTypes must be one of the following values: PEPTIDE, OLIGOS"
    );
  });

  test("should return 422 when send valid request with wrong sort direction parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "name",
      sortDir: "ascending",
    };
    const res = await api.postSuppliersSearch(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "sortDir must be one of the following values: asc, desc"
    );
  });

  test("should return 422 when send valid request with wrong limit parameters", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: "Chemveric",
      filters: {
        productTypes: [],
      },
      limit: 200,
      sortField: "name",
      sortDir: "asc",
    };
    const res = await api.postSuppliersSearch(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "limit must not be greater than 100"
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
        SuppliersShortSchema
    );
    expect(Array.isArray(validated)).toBe(true);
  });

  test("should return expected schema for buyer", async () => {
    api = new SuppliersApiClient();
    await api.init({}, buyerCookie);
    const params: SuppliersSearchRequest = {
      query: "",
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "region",
      sortDir: "desc",
    };
    const res = await api.postSuppliersSearch(params);
    expect(res.status).toBe(201);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SuppliersSearchSchema,
      201
    );
    expect(validated.items).toHaveLength(20);
  });
});
