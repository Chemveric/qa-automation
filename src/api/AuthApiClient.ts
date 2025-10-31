import { BaseAPIClient } from "../core/BaseAPIClient";

export class AuthApiClient extends BaseAPIClient {
  async postSignupRequestStepOne(body: Record<string, any> = {}) {
    return this.post("/v1/auth/signup/request/step-one", body);
  }
}
