import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { SignupRequestStepTwoFactory } from "../../../src/utils/signupRequestStepTwo/signupRequestStepTwoFactory";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { AdminOrganizationsApiClient } from "../../../src/api/AdminOrganizationsApiClient";
import { AdminOrganizationListSchema, AdminOrganizationSchema } from "../../../src/schema/adminOrganizationSchema";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: get organization by Id", () => {
  let stepTwoRequestBody: Record<string, any>;
  let stepOneRequestBody: Record<string, any>;
  let api: AdminOrganizationsApiClient;
  let orgId: string | undefined;

  test.beforeAll(async () => {
    const authApi = new AuthApiClient();
    await authApi.init({});
    stepOneRequestBody = SignupRequestStepOneFactory.validBuyer();
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(stepTwoRequestBody);
    expect(resStepTwo.status).toBe(201);
    let adminCookie = getAdminCookie();
    const signUpApi = new AdminSignupRequestsApiClient();
    await signUpApi.init({}, adminCookie);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const body = await signUpRes.body;
    const validated = await validateResponse(
      { status: signUpRes.status, body },
      UsersSignupRequestListSchema
    );
    const targetRecord = validated.data.find(item => item.email === stepOneRequestBody.email);
    const approveRes = await signUpApi.patchSignupRequest(targetRecord?.id!, { status: "APPROVED" });
    expect(approveRes.status).toBe(200);
    api = new AdminOrganizationsApiClient();
    await api.init({}, adminCookie);
    const idRes = await api.getAdminOrganizations({ filter: { name: stepTwoRequestBody.data.companyName }, })
    const idBody = await idRes.body;
    const search = await validateResponse(
      { status: idRes.status, body: idBody },
      AdminOrganizationListSchema
    );
    const searchRes = search.data.find(item => item.email === stepOneRequestBody.email);
    orgId = searchRes?.id;
  });

  test(`should return organization with existing id`, async () => {
    const res = await api.getOrganizationById(orgId!);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      AdminOrganizationSchema
    );
    expect(validated.email).toBe(stepOneRequestBody.email);
    expect(validated.id).toBe(orgId);
    expect(validated.name).toBe(stepTwoRequestBody.data.companyName);
    expect(validated.title).toBe(stepOneRequestBody.companyTitle);
    expect(validated.street).toBe(stepTwoRequestBody.data.companyStreet);
  })

  test(`should return error when call with wrong id`, async () => {
    const notExistingId = faker.string.uuid();
    const res = await api.getOrganizationById(notExistingId);
    validator.expectStatusCodeAndMessage(
      res,
      404,
      "Organization not found"
    );
  });

  test("should return 400 when send request with no Id", async () => {
    const res = await api.getOrganizationById("");
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  test("should return 401 Unauthorized when login with fake cookie", async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    const someId = faker.string.uuid();
    await api.init({}, fakeCookie);
    const res = await api.getOrganizationById(someId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});