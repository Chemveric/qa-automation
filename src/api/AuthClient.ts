import { BaseAPIClient } from "../core/BaseAPIClient";

/**
 * Basic API client for health check and authentication endpoints.
 * Currently used for smoke tests (verifies that API is reachable).
 */
export class AuthClient extends BaseAPIClient {
  /**
   * Calls /v1/health endpoint to confirm that the API is online.
   */
  async health() {
    // Simple GET to /health (expected 200)
    return this.get("/v1/health");
  }

  /**
   * @async
   * @function getAdminSignupInvites
   * @returns {Promise<Object>} The API response containing the list of signup invites.
   */

  async getAdminSignupInvites() {
    const query = {
      sort: ["sendDate", "DESC"],
      range: [0, 10],
      filter: { status: "INVITED"},
    };

    const params = Object.fromEntries(
      Object.entries(query).map(([k, v]) => [k, JSON.stringify(v)])
    );

    return await this.get("/v1/signup-invites", params);
  }
}
