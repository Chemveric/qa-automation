import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getSupplierCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { UserSchema } from "../../../src/schema/userShema";

const validator = new ResponseValidationHelper();

test.describe("API: GET user.", () => {
  let api: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    buyerCookie = getBuyerCookie();
    api = new UserApiClient();
  });

  test(`should return expected shema when send request with valid supplier cookie`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const res = await api.getUser();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const user = await validateResponse(
      { status: res.status, body: res.body },
      UserSchema
    );
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("status");
    expect(user).toHaveProperty("organization");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("firstName");
    expect(user).toHaveProperty("lastName");
    expect(user).toHaveProperty("hasSeenSupplierOnboarding");
    expect(user).toHaveProperty("activeRole");
    expect(user).toHaveProperty("roles");
    expect(user).toHaveProperty("identities");
    expect(user).toHaveProperty("permissions");
  });

  test(`should return success when send request with valid buyer cookie`, async () => {
    await api.init({ "Content-Type": false }, buyerCookie);
    const res = await api.getUser();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const user = await validateResponse(
      { status: res.status, body: res.body },
      UserSchema
    );
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("status");
    expect(user).toHaveProperty("organization");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("firstName");
    expect(user).toHaveProperty("lastName");
    expect(user).toHaveProperty("activeRole");
    expect(user).toHaveProperty("roles");
    expect(user).toHaveProperty("identities");
    expect(user).toHaveProperty("permissions");
  });

  test(`should return 401 when send request with admin cookie`, async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getUser();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
