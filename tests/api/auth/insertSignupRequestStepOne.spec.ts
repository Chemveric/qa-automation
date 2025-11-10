import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { invalidEmails } from "../../../src/utils/invalidData/invalidEmails";
import {
  invalidRequestsStepOne,
  requiredFields,
} from "../../../src/utils/invalidData/invalidRequestsStepOne";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";

const validator = new ResponseValidationHelper();

test.describe("Auth: Signup Request Step One", () => {
  let api: AuthApiClient;
  let newRequests: string[] = [];

  test.beforeAll(async () => {
    api = new AuthApiClient();
    await api.init({});
  });

  test(`should return success when send body with valid BUYER data`, async () => {
    const requestBody = SignupRequestStepOneFactory.validBuyer();
    const res = await api.postSignupRequestStepOne(requestBody);
    newRequests.push(res.body.jwt);
    expect(res.status).toBe(201);
  });

  const vendorModes = [["CRO_CDMO"], ["CATALOG"], ["CRO_CDMO", "CATALOG"]];
  for (const vendorMode of vendorModes) {
    test(`should return success when send body with valid VENDOR data and vendorMode: ${vendorMode}`, async () => {
      const requestBody = SignupRequestStepOneFactory.validVendor(
        "VENDOR",
        vendorMode
      );
      const res = await api.postSignupRequestStepOne(requestBody);
      newRequests.push(res.body.jwt);
      expect(res.status).toBe(201);
    });
  }

  for (const vendorMode of vendorModes) {
    test(`should return success when send body with valid BUYER and secondary VENDOR role and vendorModes: ${vendorMode}`, async () => {
      const requestBody =
        SignupRequestStepOneFactory.validBuyerWithSecondaryVendorRole(
          "VENDOR",
          vendorMode
        );
      const res = await api.postSignupRequestStepOne(requestBody);
      newRequests.push(res.body.jwt);
      expect(res.status).toBe(201);
    });
  }

  for (const vendorMode of vendorModes) {
    test(`should return success when send body with valid VENDOR and secondary BUYER role and vendorModes: ${vendorMode}`, async () => {
      const requestBody =
        SignupRequestStepOneFactory.validVendorWithSecondaryBuyerRole(
          "BUYER",
          "VENDOR",
          vendorMode
        );
      const res = await api.postSignupRequestStepOne(requestBody);
      newRequests.push(res.body.jwt);
      expect(res.status).toBe(201);
    });
  }

  for (const badEmail of invalidEmails) {
    test(`should return 422 when POST signup request with invalid email: ${badEmail}`, async () => {
      const requestBody = SignupRequestStepOneFactory.requestWithEmail(
        badEmail as any
      );
      const res = await api.postSignupRequestStepOne(requestBody);
      validator.expectStatusCodeAndMessage(res, 422, "email");
    });
  }

  for (const [field, invalidValues] of Object.entries(invalidRequestsStepOne)) {
    for (const { value, expectedError } of invalidValues) {
      test(`should return 422 when POST signup request with invalid or empty value: ${field} = "${value}" error: ${expectedError}`, async () => {
        const requestBody = SignupRequestStepOneFactory.invalid(field, value);
        const res = await api.postSignupRequestStepOne(requestBody);
        validator.expectStatusCodeAndMessage(res, 422, expectedError, field);
      });
    }
  }

  for (const { field, message } of requiredFields) {
    test(`should return 422 when POST with no required field: ${field}`, async () => {
      const bodyWithoutField = SignupRequestStepOneFactory.missing(field);
      const res = await api.postSignupRequestStepOne(bodyWithoutField);
      validator.expectMultipleFieldErrors(res, 422, {
        [field]: message,
      });
    });
  }
});
