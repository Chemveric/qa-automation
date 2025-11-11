import { BaseAPIClient } from "../core/BaseAPIClient";

type AdminOrganizationsQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: Record<string, string>;
};

export class AdminOrganizationsApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }
  async getAdminOrganizations(query?: AdminOrganizationsQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
              key,
              JSON.stringify(value),
          ])
      )
      : {};

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const url = `/v1/admin/organizations?${searchParams.toString()}`;
  return this.get(url);
  }
}