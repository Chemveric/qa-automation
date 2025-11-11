import { test, expect } from "@playwright/test";
import { getAdminCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("API: POST user roles.", () => {
  let api: UserApiClient;
  let supplierCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    api = new UserApiClient();
  });

  test(`should return success when send request with valid supplier cookie and BUYER role`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const resPost = await api.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    const res = await api.getUser();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    expect(res.body.activeRole).toBe("BUYER");
  });

  test(`should return success when send request with valid supplier cookie and VENDOR role`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await api.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    const res = await api.getUser();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    expect(res.body.activeRole).toBe("VENDOR");
  });

  const invalidRoles = ["vendor", 123, "@@@"];
  for (const invalidRole of invalidRoles) {
    test(`should return 422 when send request with invalid role: ${invalidRole}`, async () => {
      await api.init({ "Content-Type": false }, supplierCookie);
      const postBody = {
        setRole: invalidRole,
      };
      const resPost = await api.postUserRoles(postBody);
      validator.expectStatusCodeAndMessage(
        resPost,
        422,
        "setRole must be one of the following values: BUYER, VENDOR"
      );
    });
  }

  test(`should return 401 when send request with admin cookie`, async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const res = await api.postUserRoles(postBody);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
