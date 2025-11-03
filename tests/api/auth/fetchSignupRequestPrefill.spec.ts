import "dotenv/config";
import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../src/api/AuthApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { faker } from "@faker-js/faker";
import { generateTestToken } from "../../../helpers/tokenHelper";
import { JoseJwtWrapper } from "../../../helpers/jwt/jose-jwt-wrapper.service";
import { InvitationFactory } from "../../../src/utils/adminInvitations/invitationsFactory";
import { AdminSignupInvitesApiClient } from "../../../src/api/AdminSignupInvitesApiClient";
import { getAdminCookie } from "../../../src/utils/getEnv";

const validator = new ResponseValidationHelper();

test.describe("Auth: GET Signup Request Prefill", () => {
  let jwtWrapper: JoseJwtWrapper;

  test(`should return success when send request with valid token`, async () => {
    jwtWrapper = new JoseJwtWrapper();
    const adminCookie = getAdminCookie();
    const apiInvite = new AdminSignupInvitesApiClient();
    await apiInvite.init({}, adminCookie);
    const newInvitation = InvitationFactory.valid();
    const res = await apiInvite.postSignupInvite(newInvitation);
    const invitationId = res.body.id;
    const validToken = await jwtWrapper.signSignUpInvitationJwt({
      signUpInvitation: invitationId,
    });
    const expectedResponse = {
    firstName: res.body.firstName,
    lastName: res.body.lastName,
    email: res.body.email
  };
    const api = new AuthApiClient();
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestPrefill(validToken);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(expectedResponse);
  });

  test(`should return 422 when send request with invalid token`, async () => {
    const api = new AuthApiClient();
    const token = faker.string.alphanumeric(64);
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestPrefill(token);
    validator.expectStatusCodeAndMessage(
      getResponse,
      422,
      "token must be a jwt string"
    );
  });

  test(`should return 401 when send request with invalid jwt token`, async () => {
    const api = new AuthApiClient();
    const token = generateTestToken();
    await api.init({ "Content-Type": false });
    const getResponse = await api.getSignupRequestPrefill(token);
    validator.expectStatusCodeAndMessage(
      getResponse,
      401,
      "Token has invalid signature"
    );
  });
});
