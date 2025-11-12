import { test, expect } from "@playwright/test";
import { getAdminCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: PATCH user roles.", () => {
  let api: UserApiClient;
  let supplierCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    api = new UserApiClient();
  });

  /*
  Positive tests will be covered after upload files endpoints.
  */
  test(`should return 400 when send request with invalid profileImageId and supplier token`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const patchBody = {
      firstName: `aqa-${faker.person.firstName()}`,
      lastName: `aqa-${faker.person.lastName()}`,
      profileImageId: faker.string.uuid(),
    };

    const resPatch = await api.patchUser(patchBody);

    validator.expectStatusCodeAndMessage(
      resPatch,
      400,
      "The provided file key is invalid or the file does not exist."
    );
  });

  test(`should return 401 when send request with admin cookie`, async () => {
    await api.init({ "Content-Type": false }, adminCookie);
    const patchBody = {
      firstName: `aqa-${faker.person.firstName()}`,
      lastName: `aqa-${faker.person.lastName()}`,
      profileImageId: faker.string.uuid(),
    };
    const resPatch = await api.patchUser(patchBody);
    validator.expectStatusCodeAndMessage(resPatch, 401, "Unauthorized");
  });
});
