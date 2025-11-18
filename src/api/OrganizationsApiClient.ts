import { BaseAPIClient } from "../core/BaseAPIClient";

type OrganizationsQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: Record<string, string>;
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
}
