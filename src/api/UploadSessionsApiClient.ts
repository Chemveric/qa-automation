import { BaseAPIClient } from "../core/BaseAPIClient";

export class UploadSessionsApiClient extends BaseAPIClient {
  async postUploadsSessions(body: Record<string, any> = {}) {
    return this.post("/v1/uploads/sessions", body);
  }
}
