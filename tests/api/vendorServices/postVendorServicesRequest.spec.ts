import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { faker } from "@faker-js/faker";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ServicesListSchema } from "../../../src/schema/vendorServicesSchema";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe.skip("API: POST vendor services request", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should 400 when services onboarding has already been completed for this organization`, async () => {
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
    console.log(validated[0].services[0].id);
    const serviceId = validated[0].services[0].id;
    await api.init({}, supplierCookie);
    const postTestData = {
      vendorServicesIds: [serviceId],
      description: "Services description aqa test",
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    validator.expectStatusCodeAndMessage(
      postRes,
      400,
      "Services onboarding has already been completed for this organization."
    );
  });

  test(`should return success when send valida data and buyer cookie`, async () => {
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
    console.log(validated[0].services[0].id);
    const serviceId = validated[0].services[0].id;

    await api.init({}, supplierCookie);
    const postTestData = {
      vendorServicesIds: [serviceId],
      description: "Services description aqa test",
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    expect(postRes.status).toBe(201);
  });

  test(`should return 401 when send valid data with admin cookie`, async () => {
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

    console.log(validated[0].services[0].id);
    const serviceId = validated[0].services[0].id;

    await api.init({}, adminCookie);
    const postTestData = {
      vendorServicesIds: [serviceId],
      description: "Services description aqa test",
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    validator.expectStatusCodeAndMessage(postRes, 401, "Unauthorized");
  });

  test(`should return 400 when send invalid serviceId `, async () => {
    api = new VendorServicesApiClient();
    const serviceId = faker.string.uuid();
    await api.init({}, buyerCookie);
    const postTestData = {
      vendorServicesIds: [serviceId],
      description: 12345,
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    validator.expectStatusCodeAndMessage(
      postRes,
      400,
      "The provided vendor service ID is invalid or does not exist."
    );
  });

  test(`should return 422 when send empty serviceId `, async () => {
    api = new VendorServicesApiClient();
    await api.init({}, buyerCookie);
    const postTestData = {
      vendorServicesIds: [],
      description: "",
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    validator.expectStatusCodeAndMessage(
      postRes,
      422,
      "vendorServicesIds must contain at least 1 elements",
      "vendorServicesIds"
    );
  });

  test(`should return 422 when send empty description `, async () => {
    api = new VendorServicesApiClient();
    const serviceId = faker.string.uuid();
    await api.init({}, buyerCookie);
    const postTestData = {
      vendorServicesIds: [serviceId],
      description: "",
    };

    const postRes = await api.postRequest(postTestData);
    console.log("POST RES: ", postRes);
    validator.expectStatusCodeAndMessage(
      postRes,
      422,
      "description must be longer than or equal to 1 characters",
      "description"
    );
  });
});
