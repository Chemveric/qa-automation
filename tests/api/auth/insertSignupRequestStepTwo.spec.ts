import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { SignupRequestStepOneFactory } from "../../../src/utils/signupRequestStepOne/signupRequestStepOneFactory";
import { SignupRequestStepTwoFactory } from "../../../src/utils/signupRequestStepTwo/signupRequestStepTwoFactory";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import {
  requiredFields,
  invalidSignupStepTwoData,
} from "../../../src/utils/invalidData/invalidRequestStepTwo";

const validator = new ResponseValidationHelper();

test.describe("Auth: Signup Request Step Two", () => {
  let api: AuthApiClient;

  test.beforeAll(async () => {
    api = new AuthApiClient();
    await api.init({});
  });

  test(`should return success when send body with valid company data`, async () => {
    const reqStepOne = SignupRequestStepOneFactory.validBuyer();
    const res = await api.postSignupRequestStepOne(reqStepOne);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );

    // Act
    const resStepTwo = await api.postSignupRequestStepTwo(stepTwoRequestBody);

    // Assert
    expect(resStepTwo.status).toBe(201);
  });

  test(`should return 400 when send same body two times`, async () => {
    const reqStepOne = SignupRequestStepOneFactory.validBuyer();
    const res = await api.postSignupRequestStepOne(reqStepOne);
    const stepTwoRequestBody = SignupRequestStepTwoFactory.validCompanyData(
      res.body.jwt
    );

    // Act
    await api.postSignupRequestStepTwo(stepTwoRequestBody);
    const resStepTwo2 = await api.postSignupRequestStepTwo(stepTwoRequestBody);

    // Assert
    await validator.expectStatusCodeAndMessage(resStepTwo2, 400, "Sign up request with this email already exists");
  });

  for (const { field, message } of requiredFields) {
    test(`should return 422 when missing ${field}`, async () => {
      const reqStepOne = SignupRequestStepOneFactory.validBuyer();
      const res = await api.postSignupRequestStepOne(reqStepOne);
      const bodyWithoutField = SignupRequestStepTwoFactory.missing(
        field,
        res.body.jwt
      );

      // Act
      const resStepTwo = await api.postSignupRequestStepTwo(bodyWithoutField);

      // Assert
      validator.expectMultipleFieldErrors(resStepTwo, 422, {
        [field]: message,
      });
    });
  }

  for (const { field, value, expectedError } of invalidSignupStepTwoData) {
    test(`should return 422 for invalid ${field} = ${value}`, async () => {
      const body = SignupRequestStepTwoFactory.invalid(field, value);

      // Act
      const res = await api.postSignupRequestStepTwo(body);

      // Assert
      await validator.expectMultipleFieldErrors(res, 422, {
        [field]: expectedError,
      });
    });
  }
});
