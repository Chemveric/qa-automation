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

  async getOrganizationById(id: string | number) {
    return this.get(`/v1/admin/organizations/${id}`);
  }

  async patchOrganizationById(id: string | number, body: Record<string, any>) {
    return this.patch(`/v1/admin/organizations/${id}`, body);
  }

  async getOrganizationsRoleset() {
    return this.get(`/v1/admin/organizations/roleset`);
  }

  async getAdminOrganizationsRoles(id: string | number) {
    const url = `v1/admin/organizations/${id}/roles`;
    console.log("👉 Full organizations role URL:", url);
    return this.get(`v1/admin/organizations/${id}/roles`);
  }
}
