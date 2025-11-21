import { BaseAPIClient } from "../core/BaseAPIClient";

type OrganizationsQuery = {
  page?: number;
  limit?: number;
};

export class OrganizationsApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getOrganizationDetails() {
    return this.get(`/v1/organizations/detail`);
  }

  async editOrganizationDetail(body: Record<string, any>) {
    return this.post(`/v1/organizations/detail/edit`, body);
  }

  async inviteOrganizationTeammates(body: Record<string, any>) {
    return this.post(`/v1/organizations/teammates/invite`, body);
  }

  async getOrganizationTeammates(query?: OrganizationsQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])
        )
      : {};

    const searchParams = new URLSearchParams(params as Record<string, string>);
    const url = `/v1/organizations/teammates?${searchParams.toString()}`;
    return this.get(url);
  }

  async deleteOrganizationTeammember(body: Record<string, any>) {
    return this.delete(`/v1/organizations/teammates/delete`, body);
  }

  async organizationsTeammateReinvite(body: Record<string, any>) {
    return this.post(`/v1/organizations/teammates/reinvite`, body);
  }

  async getOrganizationRoles() {
    return this.get(`/v1/organizations/roles`);
  }

  async getOrganizationRoleset() {
    return this.get(`/v1/organizations/roleset`);
  }
}
