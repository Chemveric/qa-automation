import { BaseAPIClient } from "../core/BaseAPIClient";

export class UploadSessionsApiClient extends BaseAPIClient {
  async postUploadsSessions(body: Record<string, any> = {}) {
    return this.post("/v1/uploads/sessions", body);
  }

  async getUploadsSessions(id: string | number | undefined, organizationId?: string) {
    const params = new URLSearchParams();
    if (organizationId) params.set("organizationId", organizationId);

    const query = params.toString();
    const url = `/v1/uploads/sessions/${id}${query ? `?${query}` : ""}`;
    return this.get(url);
  }
}
