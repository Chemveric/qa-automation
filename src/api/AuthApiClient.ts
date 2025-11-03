import { BaseAPIClient } from "../core/BaseAPIClient";

export class AuthApiClient extends BaseAPIClient {
  async postSignupRequestStepOne(body: Record<string, any> = {}) {
    return this.post("/v1/auth/signup/request/step-one", body);
  }

  async getSignupRequestPrefill(token: string | number) {
    const params = { token: String(token) };
    return this.get("/v1/auth/signup/request/prefill", params);
  }

  async getSignupRequestRejectedPrefill(token: string | number) {
    const params = { token: String(token) };
    return this.get("/v1/auth/signup/request/rejected/prefill", params);
  }
}
   