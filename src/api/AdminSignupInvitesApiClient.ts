import { BaseAPIClient } from "../core/BaseAPIClient";

type AdminSignupInvitesQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: Record<string, string>;
};

export class AdminSignupInvitesApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getAdminSignupInvites(customParams: AdminSignupInvitesQuery = {}) {
    const params = Object.fromEntries(
      Object.entries(customParams).map(([k, v]) => [k, JSON.stringify(v)])
    );

    return this.get("/v1/signup-invites", params);
  }

  async postSignupInvite(body: Record<string, any> = {}) {
    return this.post("/v1/signup-invites/invite", body);
  }

  async patchSignupInvite(id: string){
    return this.patch(`/v1/signup-invites/${id}/resend`);
  }
} 
