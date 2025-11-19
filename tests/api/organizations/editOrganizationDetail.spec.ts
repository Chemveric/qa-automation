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
import { DictionaryApiClient } from "../../../src/api/DictionaryApiClient";
import { DictionarySupportedCountriesSchema } from "../../../src/schema/dictionarySupportedCountriesSchema";
import { organizationTestData } from "../../../src/utils/invalidData/invalidEditOrganization";

const validator = new ResponseValidationHelper();

test.describe("API: edit organization details", () => {
  let buyerCookie: string;
  let supplierCookie: string;
  let adminCoockie: string;
  const api = new OrganizationsApiClient();
  let countries: Record<string, any>[];
  let buyerId: string;
  let supplierId: string;

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
    adminCoockie = getAdminCookie();
    await api.init({}, buyerCookie);
    const res = await api.getOrganizationDetails();
    const body = await res.body;
    buyerId = body.id;
    const supplierRes = await api.getOrganizationDetails();
    const supplierBody = await supplierRes.body;
    supplierId = supplierBody.id;
    const dictionaryApi = new DictionaryApiClient();
    await dictionaryApi.init({ "Content-Type": false });
    const countryRes = await dictionaryApi.getDictionarySupportedCountries({});
    const countryBody = await countryRes.body;
    countries = await validateResponse(
      { status: countryRes.status, body: countryBody },
      DictionarySupportedCountriesSchema,
      200
    );
  });

  test(`edit organization with valid data for buyer`, async () => {
    await api.init({}, buyerCookie);
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const regionId = randomCountry.regionId;
    const params = {
      id: buyerId,
      regionId,
      countryId,
      licenseFilesIds: [],
      name: "Some name",
      state: "California",
      city: "Some city",
      street: "Test street",
      postalCode: "54345",
      email: ENV.buyer.email,
    };
    const editRes = await api.editOrganizationDetail(params);
    expect(
      editRes.status,
      `Expected status code is 200, but got ${editRes.status}`
    ).toBe(200);
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
    expect(validated.countryId).toBe(params.countryId);
    expect(validated.regionId).toBe(params.regionId);
    expect(validated.name).toBe(params.name);
    expect(validated.state).toBe(params.state);
    expect(validated.city).toBe(params.city);
    expect(validated.street).toBe(params.street);
    expect(validated.postalCode).toBe(params.postalCode);
    expect(validated.email).toBe(ENV.buyer.email);
  });

  test(`edit organization with valid data for supplier`, async () => {
    await api.init({}, supplierCookie);
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const regionId = randomCountry.regionId;
    const params = {
      id: buyerId,
      regionId,
      countryId,
      licenseFilesIds: [],
      name: "Some name",
      state: "California",
      city: "Some city",
      street: "Test street",
      postalCode: "54345",
      email: ENV.vendor.email,
    };
    const editRes = await api.editOrganizationDetail(params);
    expect(
      editRes.status,
      `Expected status code is 200, but got ${editRes.status}`
    ).toBe(200);

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
    expect(validated.countryId).toBe(params.countryId);
    expect(validated.regionId).toBe(params.regionId);
    expect(validated.name).toBe(params.name);
    expect(validated.state).toBe(params.state);
    expect(validated.city).toBe(params.city);
    expect(validated.street).toBe(params.street);
    expect(validated.postalCode).toBe(params.postalCode);
    expect(validated.email).toBe(ENV.vendor.email);
  });

  for (const testCase of organizationTestData) {
    test(testCase.name, async () => {
      await api.init({}, buyerCookie);
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const { params, expectedMessage } = testCase.getData(
        buyerId!,
        randomCountry.regionId,
        randomCountry.id
      );
      const response = await api.editOrganizationDetail(params);
      validator.expectStatusCodeAndMessage(response, 422, expectedMessage);
    });
  }

  test("should return 401 Unauthorized when login with admin cookie", async () => {
    await api.init({}, adminCoockie);
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const params = {
      id: buyerId,
      regionId: randomCountry.regionId,
      countryId: randomCountry.id,
      licenseFilesIds: [],
      name: "Some company",
      state: "California",
      city: "Some street",
      street: "Some street",
      postalCode: "32453",
      email: "semeEmail@company.com",
    };
    const res = await api.editOrganizationDetail(params);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
