import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationServicesListSchema } from "../../../src/schema/vendorServicesSchema";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("API: GET vendor services list by organization ID", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let userApi: UserApiClient;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return valid schema when get supplier's services list as supplier`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getListByOrganization();
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      OrganizationServicesListSchema
    );

    expect(validated).toHaveProperty("services");
  });

  test(`should return unauthorized when get supplier's services list as an admin`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const resGet = await api.getListByOrganization();
    validator.expectStatusCodeAndMessage(resGet, 401, "Unauthorized");
  });

  test(`should return 403 get supplier's services list as a buyer`, async () => {
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getListByOrganization();
    validator.expectStatusCodeAndMessage(resGet, 403, "Forbidden");
  });

  test(`should return 403 get supplier's services list as a buyer in vendor mode`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    api = new VendorServicesApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getListByOrganization();
    validator.expectStatusCodeAndMessage(resGet, 403, "Forbidden");
  });
});
