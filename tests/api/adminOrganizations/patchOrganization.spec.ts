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
import { DictionaryApiClient } from "../../../src/api/DictionaryApiClient";
import { DictionarySupportedCountriesSchema } from "../../../src/schema/dictionarySupportedCountriesSchema";
import { organizationTestData } from "../../../src/utils/invalidData/invalidUpadateOrganizations";

const validator = new ResponseValidationHelper();

test.describe("API: edit organization by Id", () => {
  let stepTwoRequestBody: Record<string, any>;
  let stepOneRequestBody: Record<string, any>;
  let api: AdminOrganizationsApiClient;
  let orgId: string | undefined;
  let countries: Record<string, any>[];

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
    const dictionaryApi = new DictionaryApiClient();
    await dictionaryApi.init({ "Content-Type": false });
    const countryRes = await dictionaryApi.getDictionarySupportedCountries({});
    const countryBody = await countryRes.body;
    countries = await validateResponse({ status: countryRes.status, body: countryBody }, DictionarySupportedCountriesSchema, 200);
  });

  test(`should edit organization with existing id and full data`, async () => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const regionId = randomCountry.regionId;
    const params = {
      "id": orgId,
      "name": faker.company.name(),
      "regionId": regionId,
      "countryId": countryId,
      "state": faker.location.state(),
      "city": faker.location.city(),
      "street": faker.location.streetAddress(),
      "postalCode": faker.location.zipCode()
    }
    const res = await api.patchOrganizationById(orgId!, params);
    expect(
        res.status,
        `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const actualRes = await api.getOrganizationById(orgId!);
    expect(
        actualRes.status,
        `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await actualRes.body;
    console.log("Response status:", actualRes.status);
    console.log("Response body:", JSON.stringify(actualRes.body, null, 2));
    const validated = await validateResponse(
        { status: actualRes.status, body },
        AdminOrganizationSchema
    );
    expect(validated.name).toBe(params.name);
    expect(validated.street).toBe(params.street);
    expect(validated.regionId).toBe(params.regionId);
    expect(validated.countryId).toBe(params.countryId);
    expect(validated.state).toBe(params.state);
    expect(validated.postalCode).toBe(params.postalCode);
    expect(validated.city).toBe(params.city);
    expect(validated.street).toBe(params.street);
  });


  test(`should edit organization with existing id and minimum data`, async () => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const regionId = randomCountry.regionId;
    const params = {
      "id": orgId,
      "name": "",
      "regionId": regionId,
      "countryId": countryId,
      "state": "",
      "city": "",
      "street": "",
      "postalCode": ""
    }
    const res = await api.patchOrganizationById(orgId!, params);
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);

    const actualRes = await api.getOrganizationById(orgId!);
    expect(
      actualRes.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(200);
    const body = await actualRes.body;
    console.log("Response status:", actualRes.status);
    console.log("Response body:", JSON.stringify(actualRes.body, null, 2));
    const validated = await validateResponse(
      { status: actualRes.status, body },
      AdminOrganizationSchema
    );
    expect(validated.regionId).toBe(params.regionId);
    expect(validated.countryId).toBe(params.countryId);
  });

  test(`should be error editing with wrong organization id`, async () => {
    const fakeId = faker.string.uuid();
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const regionId = randomCountry.regionId;
    const params = {
      "id": orgId,
      "name": faker.company.name(),
      "regionId": regionId,
      "countryId": countryId,
      "state": faker.location.state(),
      "city": faker.location.city(),
      "street": faker.location.streetAddress(),
      "postalCode": faker.location.zipCode()
    }
    const res = await api.patchOrganizationById(fakeId!, params);
    expect(
      res.status,
      `Expected status code is 500, but got ${res.status}`
    ).toBe(500);
  });

  test(`should be error editing with wrong region id`, async () => {
    const fakeId = faker.string.uuid();
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const countryId = randomCountry.id;
    const params = {
      "id": orgId,
      "name": faker.company.name(),
      "regionId": fakeId,
      "countryId": countryId,
      "state": faker.location.state(),
      "city": faker.location.city(),
      "street": faker.location.streetAddress(),
      "postalCode": faker.location.zipCode()
    }
    const res = await api.patchOrganizationById(fakeId!, params);
    expect(
      res.status,
      `Expected status code is 500, but got ${res.status}`
    ).toBe(500);
  });

  test(`should be error editing with wrong country id`, async () => {
    const fakeId = faker.string.uuid();
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const regionId = randomCountry.regionId;
    const params = {
      "id": orgId,
      "name": faker.company.name(),
      "regionId": regionId,
      "countryId": fakeId,
      "state": faker.location.state(),
      "city": faker.location.city(),
      "street": faker.location.streetAddress(),
      "postalCode": faker.location.zipCode()
    }
    const res = await api.patchOrganizationById(fakeId!, params);
    expect(
      res.status,
      `Expected status code is 500, but got ${res.status}`
    ).toBe(500);
  });

  for (const testCase of organizationTestData) {
    test(testCase.name, async () => {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const countryId = randomCountry.id;
      const regionId = randomCountry.regionId;
      const { params, expectedMessage } = testCase.getData(orgId!, randomCountry.regionId, randomCountry.id);
      const response = await api.patchOrganizationById(orgId!, params);
      validator.expectStatusCodeAndMessage(response, 422, expectedMessage);
    });
  }
});