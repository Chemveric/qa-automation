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
import { RolesSchema } from "../../../src/schema/rolesSchema";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: get all organization roles", () => {
  let api: AdminOrganizationsApiClient;
  let authApi: AuthApiClient;
  let signUpApi: AdminSignupRequestsApiClient;

  test.beforeAll(async () => {
    authApi = new AuthApiClient();
    await authApi.init({});
    let adminCookie = getAdminCookie();
    signUpApi = new AdminSignupRequestsApiClient();
    await signUpApi.init({}, adminCookie);
    api = new AdminOrganizationsApiClient();
    await api.init({}, adminCookie);
  });

  test(`should return organization roles for buyer`, async () => {
    const stepOneRequestBody = SignupRequestStepOneFactory.validBuyer();
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const signUpBody = await signUpRes.body;
    const signUpValidate = await validateResponse(
      { status: signUpRes.status, body: signUpBody },
      UsersSignupRequestListSchema
    );
    const targetRecord = signUpValidate.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const approveRes = await signUpApi.patchSignupRequest(targetRecord?.id!, {
      status: "APPROVED",
    });
    expect(approveRes.status).toBe(200);
    const idRes = await api.getAdminOrganizations({
      filter: { name: stepTwoRequestBody!.data!.companyName! },
    });
    const idBody = await idRes.body;
    const search = await validateResponse(
      { status: idRes.status, body: idBody },
      AdminOrganizationListSchema
    );
    const searchRes = search.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const orgId = searchRes?.id;

    const rolesResponse = await api.getAdminOrganizationsRoles(orgId!);
    expect(
      rolesResponse.status,
      `Expected status code is 200, but got ${rolesResponse.status}`
    ).toBe(200);

    const body = await rolesResponse.body;
    console.log("Response status:", rolesResponse.status);
    console.log("Response body:", JSON.stringify(rolesResponse.body, null, 2));
    const validated = await validateResponse(
      { status: rolesResponse.status, body },
      RolesSchema
    );
    expect(validated.role).toBe("BUYER");
    expect(Array.isArray(validated.subroles.BUYER)).toBe(true);
    expect(validated.subroles.BUYER).not.toBeNull();
    expect(validated.subroles.VENDOR).toBeNull();
  });

  test(`should return organization roles for vendor`, async () => {
    const vendorModes = [["CRO_CDMO"], ["CATALOG"], ["CRO_CDMO", "CATALOG"]];
    const randomIndex = Math.floor(Math.random() * vendorModes.length);
    const randomVendorMode = vendorModes[randomIndex];
    const stepOneRequestBody = SignupRequestStepOneFactory.validVendor(
      "VENDOR",
      randomVendorMode
    );
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const signUpBody = await signUpRes.body;
    const signUpValidate = await validateResponse(
      { status: signUpRes.status, body: signUpBody },
      UsersSignupRequestListSchema
    );
    const targetRecord = signUpValidate.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const approveRes = await signUpApi.patchSignupRequest(targetRecord?.id!, {
      status: "APPROVED",
    });
    expect(approveRes.status).toBe(200);
    const idRes = await api.getAdminOrganizations({
      filter: { name: stepTwoRequestBody!.data!.companyName! },
    });
    const idBody = await idRes.body;
    const search = await validateResponse(
      { status: idRes.status, body: idBody },
      AdminOrganizationListSchema
    );
    const searchRes = search.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const orgId = searchRes?.id;

    const rolesResponse = await api.getAdminOrganizationsRoles(orgId!);
    expect(
      rolesResponse.status,
      `Expected status code is 200, but got ${rolesResponse.status}`
    ).toBe(200);

    const body = await rolesResponse.body;
    console.log("Response status:", rolesResponse.status);
    console.log("Response body:", JSON.stringify(rolesResponse.body, null, 2));
    const validated = await validateResponse(
      { status: rolesResponse.status, body },
      RolesSchema
    );
    expect(validated.role).toBe("VENDOR");
    expect(validated.vendorModes).toStrictEqual(randomVendorMode);
    expect(Array.isArray(validated.subroles.VENDOR)).toBe(true);
    expect(validated.subroles.VENDOR).not.toBeNull();
    expect(validated.subroles.BUYER).toBeNull();
  });

  test(`should return organization roles for buyer with secondary vendor role`, async () => {
    const vendorModes = [["CRO_CDMO"], ["CATALOG"], ["CRO_CDMO", "CATALOG"]];
    const randomIndex = Math.floor(Math.random() * vendorModes.length);
    const randomVendorMode = vendorModes[randomIndex];
    const stepOneRequestBody =
      SignupRequestStepOneFactory.validBuyerWithSecondaryVendorRole(
        "VENDOR",
        randomVendorMode
      );
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const signUpBody = await signUpRes.body;
    const signUpValidate = await validateResponse(
      { status: signUpRes.status, body: signUpBody },
      UsersSignupRequestListSchema
    );
    const targetRecord = signUpValidate.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const approveRes = await signUpApi.patchSignupRequest(targetRecord?.id!, {
      status: "APPROVED",
    });
    expect(approveRes.status).toBe(200);
    const idRes = await api.getAdminOrganizations({
      filter: { name: stepTwoRequestBody!.data!.companyName! },
    });
    const idBody = await idRes.body;
    const search = await validateResponse(
      { status: idRes.status, body: idBody },
      AdminOrganizationListSchema
    );
    const searchRes = search.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const orgId = searchRes?.id;

    const rolesResponse = await api.getAdminOrganizationsRoles(orgId!);
    expect(
      rolesResponse.status,
      `Expected status code is 200, but got ${rolesResponse.status}`
    ).toBe(200);

    const body = await rolesResponse.body;
    console.log("Response status:", rolesResponse.status);
    console.log("Response body:", JSON.stringify(rolesResponse.body, null, 2));
    const validated = await validateResponse(
      { status: rolesResponse.status, body },
      RolesSchema
    );
    expect(validated.role).toBe("BUYER");
    expect(validated.secondaryRole).toBe("VENDOR");
    expect(validated.vendorModes).toStrictEqual(randomVendorMode);
    expect(Array.isArray(validated.subroles.VENDOR)).toBe(true);
    expect(Array.isArray(validated.subroles.BUYER)).toBe(true);
    expect(validated.subroles.VENDOR).not.toBeNull();
    expect(validated.subroles.BUYER).not.toBeNull();
  });

  test(`should return organization roles for vendor with secondary buyer role`, async () => {
    const vendorModes = [["CRO_CDMO"], ["CATALOG"], ["CRO_CDMO", "CATALOG"]];
    const randomIndex = Math.floor(Math.random() * vendorModes.length);
    const randomVendorMode = vendorModes[randomIndex];
    const stepOneRequestBody =
      SignupRequestStepOneFactory.validVendorWithSecondaryBuyerRole(
        "VENDOR",
        "BUYER",
        randomVendorMode
      );
    const res = await authApi.postSignupRequestStepOne(stepOneRequestBody);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );
    const resStepTwo = await authApi.postSignupRequestStepTwo(
      stepTwoRequestBody
    );
    expect(resStepTwo.status).toBe(201);
    const signUpRes = await signUpApi.getAllAdminSignupRequests();
    const signUpBody = await signUpRes.body;
    const signUpValidate = await validateResponse(
      { status: signUpRes.status, body: signUpBody },
      UsersSignupRequestListSchema
    );
    const targetRecord = signUpValidate.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const approveRes = await signUpApi.patchSignupRequest(targetRecord?.id!, {
      status: "APPROVED",
    });
    expect(approveRes.status).toBe(200);
    const idRes = await api.getAdminOrganizations({
      filter: { name: stepTwoRequestBody!.data!.companyName! },
    });
    const idBody = await idRes.body;
    const search = await validateResponse(
      { status: idRes.status, body: idBody },
      AdminOrganizationListSchema
    );
    const searchRes = search.data.find(
      (item) => item.email === stepOneRequestBody.email
    );
    const orgId = searchRes?.id;

    const rolesResponse = await api.getAdminOrganizationsRoles(orgId!);
    expect(
      rolesResponse.status,
      `Expected status code is 200, but got ${rolesResponse.status}`
    ).toBe(200);

    const body = await rolesResponse.body;
    console.log("Response status:", rolesResponse.status);
    console.log("Response body:", JSON.stringify(rolesResponse.body, null, 2));
    const validated = await validateResponse(
      { status: rolesResponse.status, body },
      RolesSchema
    );
    expect(validated.role).toBe("VENDOR");
    expect(validated.secondaryRole).toBe("BUYER");
    expect(validated.vendorModes).toStrictEqual(randomVendorMode);
    expect(Array.isArray(validated.subroles.VENDOR)).toBe(true);
    expect(Array.isArray(validated.subroles.BUYER)).toBe(true);
    expect(validated.subroles.VENDOR).not.toBeNull();
    expect(validated.subroles.BUYER).not.toBeNull();
  });

  test(`should return 400 with no existing company id`, async () => {
    var fakeId = faker.string.uuid();
    const rolesResponse = await api.getAdminOrganizationsRoles(fakeId!);
    validator.expectStatusCodeAndMessage(
      rolesResponse,
      400,
      "Primary admin not found"
    );
  });

  test(`should return 401 Unauthorized when call with fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${faker.string.uuid()}`;
    api = new AdminOrganizationsApiClient();
    await api.init({}, fakeCookie);
    var id = faker.string.uuid();
    const rolesResponse = await api.getAdminOrganizationsRoles(id!);
    validator.expectStatusCodeAndMessage(rolesResponse, 401, "Unauthorized");
  });
});
