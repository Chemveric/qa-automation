import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { VendorServicesApiClient } from "../../../src/api/VendorServicesApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { CategoriesSchema } from "../../../src/schema/vendorServicesSchema";
import { CustomVendorServiceFactory } from "../../../src/utils/vendorServices/vendorServiceFactory";
import {
  invalidVendorServices,
  requiredFields,
} from "../../../src/utils/invalidData/invalidVendorServices";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { VendorService } from "../../../src/utils/types/vendorService.types";
import { UserApiClient } from "../../../src/api/UserApiClient";

const validator = new ResponseValidationHelper();

test.describe.skip("API: POST custom vendor service", () => {
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

  test.skip(`should return success when send valid data`, async () => {
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
    const resGet = await api.getCategories();
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      CategoriesSchema
    );
    const categoryId = validated[0].id;

    const postTestData = CustomVendorServiceFactory.valid(categoryId);
    const postRes = await api.postCustom(postTestData);

    console.log("POST RES: ", postRes);
    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty("id");
    expect(postRes.body).toHaveProperty("code");
    expect(postRes.body).toHaveProperty("name");
    expect(postRes.body).toHaveProperty("domain");
    expect(postRes.body).toHaveProperty("developmentPhase");
    expect(postRes.body).toHaveProperty("description");
    expect(postRes.body).toHaveProperty("categoryId");
    expect(postRes.body).toHaveProperty("organizationId");
    expect(postRes.body).toHaveProperty("isActive");
    expect(postRes.body).toHaveProperty("createdAt");
    expect(postRes.body.name).toBe(postTestData.name);
    expect(postRes.body.domain).toBe(postTestData.domain);
    expect(postRes.body.developmentPhase).toBe(postTestData.developmentPhase);
    expect(postRes.body.categoryId).toBe(categoryId);
  });

  for (const [field, invalidValues] of Object.entries(invalidVendorServices)) {
    for (const { value, expectedError } of invalidValues) {
      test(`should return 422 when POST invitation with invalid or empty value: ${field} = "${value}"`, async () => {
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
        await api.init({}, buyerCookie);
        const postTestData = CustomVendorServiceFactory.invalid(field, value);
        const postRes = await api.postCustom(postTestData);

        console.log("INVALID DATA RES: ", postRes);

        validator.expectStatusCodeAndMessage(
          postRes,
          422,
          expectedError,
          field
        );
      });
    }
  }

  for (const { field, message } of requiredFields) {
    test(`should return 422 when POST with no required field: ${field}`, async () => {
      api = new VendorServicesApiClient();
      await api.init({}, supplierCookie);
      const typedField = field as keyof VendorService;
      const bodyWithoutField = CustomVendorServiceFactory.missing(typedField);
      const res = await api.postCustom(bodyWithoutField);
      validator.expectMultipleFieldErrors(res, 422, {
        [field]: message,
      });
    });
  }
});
