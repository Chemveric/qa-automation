import { BaseAPIClient } from "../core/BaseAPIClient";

type userRfqQuery = {
  tab?: string | number | undefined;
  page?: number | string | undefined;
  limit?: number | string | undefined;
  search?: string;
};

export class RfqsApiClient extends BaseAPIClient {
  async getRfqsList(customParams: userRfqQuery = {}) {
    const params = Object.fromEntries(
      Object.entries(customParams).map(([k, v]) => [k, String(v)])
    );
    return this.get("/v1/rfqs/list", params);
  }

  async getRfqById(id: string) {
    return this.get(`/v1/rfqs/${id}`);
  }

  async postRfqsIdPublish(id: string, body: Record<string, any> = {}) {
    return this.post(`/v1/rfqs/${id}/publish`, body);
  }

  async postRfqs(body: Record<string, any> = {}) {
    return this.post("/v1/rfqs", body);
  }

  async patchRfqsId(id: string, body: Record<string, any> = {}) {
    return this.patch(`/v1/rfqs/${id}`, body);
  }
}
