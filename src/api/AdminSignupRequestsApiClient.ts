import { BaseAPIClient } from "../core/BaseAPIClient";

type AdminSignupRequestsQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: {
    status?: string;
    origin?: string;
    [key: string]: string | undefined;
  };
};

export class AdminSignupRequestsApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getAllAdminSignupRequests(query?: AdminSignupRequestsQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])
        )
      : {};

    return this.get("/v1/signup-requests", params);
  }

  async getAdminSignupRequestById(id: string | number) {
    return this.get(`/v1/signup-requests/${id}`);
  }

  async patchSignupRequest(
    id: string | number,
    body: Record<string, any> = {}
  ) {
    return this.patch(`/v1/signup-requests/${id}/status`, body);
  }
}
