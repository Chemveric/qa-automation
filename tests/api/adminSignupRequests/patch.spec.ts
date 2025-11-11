import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { SignupRequestStepTwoFactory } from "../../../src/utils/signupRequestStepTwo/signupRequestStepTwoFactory";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API smoke: Admin Signup Requests PATCH Status", () => {
  let signUpApi: AdminSignupRequestsApiClient;
  let adminCookie: string;
  let id: string;

  test.beforeEach(async () => {
    const authApi = new AuthApiClient();
    await authApi.init({});
    const stepOneRequestBody = SignupRequestStepOneFactory.validBuyer();
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    signUpApi = new AdminSignupRequestsApiClient();
    adminCookie = getAdminCookie();
    await signUpApi.init({}, adminCookie);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const body = await signUpRes.body;

    const validated = await validateResponse(
      { status: signUpRes.status, body },
      UsersSignupRequestListSchema
    );
    const targetRecord = validated.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    if (!targetRecord?.id) {
      throw new Error("Signup request ID not found in beforeEach setup");
    }

    id = targetRecord?.id;
  });

  test(`should return success when send request with valid APPROVED status`, async () => {
    const body = {
      status: "APPROVED",
    };
    const res = await signUpApi.patchSignupRequest(id, body);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    await signUpApi.init({ "Content-Type": false }, adminCookie);
    const updatedRes = await signUpApi.getAdminSignupRequestById(id);
    expect(
      updatedRes.body.status,
      `Expected status is APPROVED, but got ${updatedRes.body.status}`
    ).toBe(body.status);
  });

  test("should return success when send request with valid REJECTED status", async () => {
    const body = {
      status: "REJECTED",
      rejectReason: "Docs did not meet requirements",
    };
    const res = await signUpApi.patchSignupRequest(id, body);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    await signUpApi.init({ "Content-Type": false }, adminCookie);
    const updatedRes = await signUpApi.getAdminSignupRequestById(id);
    expect(
      updatedRes.body.status,
      `Expected status is REJECTED, but got ${updatedRes.body.status}`
    ).toBe(body.status);
  });

  test("should return 422 when send request with not valid status", async () => {
    const body = {
      status: "status",
    };
    const res = await signUpApi.patchSignupRequest(id, body);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "status must be one of the following values: APPROVED, REJECTED"
    );
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const fakeId = faker.string.uuid();
    await signUpApi.init({}, fakeCookie);
    const body = {
      status: "status",
    };
    const res = await signUpApi.patchSignupRequest(fakeId, body);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
