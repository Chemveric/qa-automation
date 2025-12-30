import { test, expect } from "@playwright/test";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { SuppliersApiClient } from "../../../src/api/suppliers/SuppliersApiClient";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { SuppliersSearchSchema } from "../../../src/schema/supplierSearchSchema";
import { SuppliersSearchRequest } from "../../../src/api/suppliers/suppliers.types";
import { SupplierSchema } from "../../../src/schema/supplierSchema";
import { SignupRequestStepTwoFactory } from "../../../src/utils/signupRequestStepTwo/signupRequestStepTwoFactory";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { randomUUID } from "crypto";

const validator = new ResponseValidationHelper();

test.describe("API: Get supplier by id", () => {
  let api: SuppliersApiClient;
  let adminCookie: string;
  let supplierCoockie: string;
  let buyerCookie: string;
  let supplierSlug: string;
  let stepOneRequestBody: Record<string, any>;
  let stepTwoRequestBody: Record<string, any>;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    supplierCoockie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    const authApi = new AuthApiClient();
    await authApi.init({});
    stepOneRequestBody = SignupRequestStepOneFactory.validVendor("VENDOR", [
      "CRO_CDMO",
    ]);
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    const signUpApi = new AdminSignupRequestsApiClient();
    adminCookie = getAdminCookie();
    await signUpApi.init({}, adminCookie);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const allRequestBody = await signUpRes.body;

    const requstValidated = await validateResponse(
      { status: signUpRes.status, body: allRequestBody },
      UsersSignupRequestListSchema
    );
    const targetRecord = requstValidated.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    if (!targetRecord?.id) {
      throw new Error("Signup request ID not found in beforeEach setup");
    }
    let id = targetRecord?.id;
    const signUpBody = {
      status: "APPROVED",
    };
    const afterRes = await signUpApi.patchSignupRequest(id, signUpBody);
    expect(
      afterRes.status,
      `Expected status code is 200, but got ${afterRes.status}`
    ).toBe(200);
    await signUpApi.init({ "Content-Type": false }, adminCookie);
    const updatedRes = await signUpApi.getAdminSignupRequestById(id);
    expect(
      updatedRes.body.status,
      `Expected status is APPROVED, but got ${updatedRes.body.status}`
    ).toBe(signUpBody.status);

    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const params: SuppliersSearchRequest = {
      query: stepTwoRequestBody.data!.companyName,
      filters: {
        productTypes: [],
      },
      limit: 20,
      sortField: "name",
      sortDir: "asc",
    };
    const searchRes = await api.postSuppliersSearch(params);
    expect(searchRes.status).toBe(201);
    const body = await searchRes.body;
    const validated = await validateResponse(
      { status: searchRes.status, body },
      SuppliersSearchSchema,
      201
    );
    if (Array.isArray(validated.items) && validated.items.length > 0) {
      supplierSlug = validated.items[0].slug;
    }
  });

  test(`should return expected schema for existing supplier`, async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    const res = await api.getSupplierSlug(supplierSlug);
    // expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SupplierSchema
    );
    expect(validated.slug).toBe(supplierSlug);
    expect(validated.email).toBe(stepOneRequestBody.email);
    expect(validated.name).toBe(stepTwoRequestBody.data!.companyName);
  });

  test("should return 404 error when not existing supplier id", async () => {
    api = new SuppliersApiClient();
    await api.init({}, supplierCoockie);
    let fakeId = randomUUID();
    const res = await api.getSupplierSlug(fakeId);
    validator.expectStatusCodeAndMessage(res, 404, "Organization not found");
  });

  test("should return expected schema for buyer coockie", async () => {
    api = new SuppliersApiClient();
    await api.init({}, buyerCookie);
    const res = await api.getSupplierSlug(supplierSlug);
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SupplierSchema
    );
    expect(validated.slug).toBe(supplierSlug);
    expect(validated.email).toBe(stepOneRequestBody.email);
    expect(validated.name).toBe(stepTwoRequestBody.data!.companyName);
  });

  test("should return expected schema for admin coockie", async () => {
    api = new SuppliersApiClient();
    await api.init({}, adminCookie);
    const res = await api.getSupplierSlug(supplierSlug);
    expect(res.status).toBe(200);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      SupplierSchema
    );
    expect(validated.slug).toBe(supplierSlug);
    expect(validated.email).toBe(stepOneRequestBody.email);
    expect(validated.name).toBe(stepTwoRequestBody.data!.companyName);
  });

  test.skip("BUG: should return 401 when send request with fake coockie", async () => {
    api = new SuppliersApiClient();
    await api.init({}, "fake-coockie");
    const res = await api.getSupplierSlug(supplierSlug);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });
});
