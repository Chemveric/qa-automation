import { test, expect } from "@playwright/test";
import { getAdminCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("API: GET user roles.", () => {
  let api: UserApiClient;
  let supplierCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    api = new UserApiClient();
  });

  test(`should return success when send request with valid supplier cookie`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const res = await api.getUserRoles();
    const expectedRoles = ["BUYER", "VENDOR"];
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    expect(
      res.body,
      `Expected roles: ${expectedRoles}, but got ${res.body}`
    ).toEqual(expectedRoles);
  });

  test(`should return 401 when send request with admin cookie`, async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getUser();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
