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
}
