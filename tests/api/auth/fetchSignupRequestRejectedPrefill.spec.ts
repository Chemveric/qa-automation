import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";
import { JoseJwtWrapper } from "../../../helpers/jwt/jose-jwt-wrapper.service";
import {
  getRejectedRequestData,
  getRejectedRequestId,
} from "../../../src/utils/signupRequestPrefill/signupRequestRejectTestData";

const validator = new ResponseValidationHelper();

test.describe("Auth: GET Signup Request Prefill", () => {
  let jwtWrapper: JoseJwtWrapper;

  test.beforeEach(async () => {
    jwtWrapper = new JoseJwtWrapper();
  });
  test(`should return success when send request with valid token`, async () => {
    const validToken = await jwtWrapper.signSignUpRejectJwt({
      signUpReject: getRejectedRequestId(),
    });
    const api = new AuthApiClient();
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestRejectedPrefill(validToken);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(getRejectedRequestData());
  });

  test(`should return 422 when send request with invalid token`, async () => {
    const api = new AuthApiClient();
    const token = faker.string.alphanumeric(64);
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestRejectedPrefill(token);
    validator.expectStatusCodeAndMessage(
      getResponse,
      422,
      "token must be a jwt string"
    );
  });

  test(`should return 401 when send request with fakeToken jwt token`, async () => {
    const api = new AuthApiClient();
        const fakeToken = await jwtWrapper.signTestToken({
      signUpInvitation: faker.string.uuid(),
    });
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestRejectedPrefill(fakeToken);
    validator.expectStatusCodeAndMessage(
      getResponse,
      401,
      "Token has invalid signature"
    );
  });
});
