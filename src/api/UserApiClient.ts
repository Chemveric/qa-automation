import { BaseAPIClient } from "../core/BaseAPIClient";


export class UserApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getUser() {
    return this.get("/v1/user");
  }

  async getUserRoles() {
    return this.get("/v1/user/roles");
  }

  async postUserRoles(body: Record<string, any> = {}) {
    return this.post("/v1/user/roles", body);
  }

  async patchUser(body: Record<string, any> = {}){
    return this.patch("/v1/user", body);
  }

}
