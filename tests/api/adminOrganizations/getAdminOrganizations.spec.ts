import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { SignupRequestStepTwoFactory } from "../../../src/utils/signupRequestStepTwo/signupRequestStepTwoFactory";
import { AdminSignupRequestsApiClient } from "../../../src/api/AdminSignupRequestsApiClient";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { UsersSignupRequestListSchema } from "../../../src/schema/userSignupRequestSchema";
import { AdminOrganizationsApiClient } from "../../../src/api/AdminOrganizationsApiClient";
import { AdminOrganizationListSchema } from "../../../src/schema/adminOrganizationSchema";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: get all organizations", () => {
  let stepTwoRequestBody: Record<string, any>;
  let stepOneRequestBody: Record<string, any>;
  let api: AdminOrganizationsApiClient;

  test.beforeAll(async () => {
    const authApi = new AuthApiClient();
    await authApi.init({});
    stepOneRequestBody = SignupRequestStepOneFactory.validBuyer();
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
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
    const targetRecord = validated.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const orgId = targetRecord?.id;
    const approveRes = await signUpApi.patchSignupRequest(orgId!, {
      status: "APPROVED",
    });
    expect(approveRes.status).toBe(200);
    api = new AdminOrganizationsApiClient();
    await api.init({}, adminCookie);
  });

  test(`should return organization filterd by company name`, async () => {
    const params = {
      range: [0, 10],
      filter: { name: stepTwoRequestBody.data.companyName },
    };
    const res = await api.getAdminOrganizations(params);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      AdminOrganizationListSchema
    );
    expect(Array.isArray(validated.data)).toBe(true);
    for (const item of validated.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("email");
      expect(item).toHaveProperty("regionId");
    }
    expect(
      validated.data.some((item) => item.email === stepOneRequestBody.email)
    ).toBe(true);
  });

  test("should return expected schema when send valid request with no params", async () => {
    const res = await api.getAdminOrganizations();
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      AdminOrganizationListSchema
    );
    expect(Array.isArray(validated.data)).toBe(true);
    for (const item of validated.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("email");
      expect(item).toHaveProperty("regionId");
    }
  });

  test("should return expected schema and result count when send valid request with range param", async () => {
    const randomInt = Math.floor(Math.random() * 10) + 1;
    const params = {
      range: [0, randomInt],
    };
    const res = await api.getAdminOrganizations(params);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      AdminOrganizationListSchema
    );
    expect(Array.isArray(validated.data)).toBe(true);
    expect(validated.data.length).toBe(randomInt + 1);
    for (const item of validated.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("email");
      expect(item).toHaveProperty("regionId");
    }
  });

  test("should return 422 when send invalid sort param", async () => {
    const res = await api.getAdminOrganizations({
      sort: ["firstName", "ASC"],
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two strings"
    );
  });

  test("should return 422 when send invalid range param", async () => {
    const res = await api.getAdminOrganizations({
      range: [faker.word.words(1), faker.word.words(1)],
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two numbers"
    );
  });

  test("should return 422 when send invalid filter param", async () => {
    const res = await api.getAdminOrganizations({
      filter: { firstName: "SomeName" },
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Filter must be a JSON object with allowed fields: name, id"
    );
  });
});
