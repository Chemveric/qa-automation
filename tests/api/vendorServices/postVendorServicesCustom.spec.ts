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

const validator = new ResponseValidationHelper();

test.describe("API: POST custom vendor service", () => {
  let api: VendorServicesApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return success when send valid data`, async () => {
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
    await api.init({}, supplierCookie);

    const postTestData = CustomVendorServiceFactory.valid(categoryId);
    const postRes = await api.postCustom(postTestData);

    console.log("POST RES: ", postRes);
    await expect(postRes.status).toBe(201);
    await expect(postRes.body).toHaveProperty("id");
    await expect(postRes.body).toHaveProperty("code");
    await expect(postRes.body).toHaveProperty("name");
    await expect(postRes.body).toHaveProperty("domain");
    await expect(postRes.body).toHaveProperty("developmentPhase");
    await expect(postRes.body).toHaveProperty("description");
    await expect(postRes.body).toHaveProperty("categoryId");
    await expect(postRes.body).toHaveProperty("organizationId");
    await expect(postRes.body).toHaveProperty("isActive");
    await expect(postRes.body).toHaveProperty("createdAt");
    await expect(postRes.body.name).toBe(postTestData.name);
    await expect(postRes.body.domain).toBe(postTestData.domain);
    await expect(postRes.body.developmentPhase).toBe(
      postTestData.developmentPhase
    );
    await expect(postRes.body.categoryId).toBe(categoryId);
  });

  for (const [field, invalidValues] of Object.entries(invalidVendorServices)) {
    for (const { value, expectedError } of invalidValues) {
      test(`should return 422 when POST invitation with invalid or empty value: ${field} = "${value}"`, async () => {
        api = new VendorServicesApiClient();
        await api.init({}, supplierCookie);
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
