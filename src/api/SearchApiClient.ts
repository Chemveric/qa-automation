import { BaseAPIClient } from "../core/BaseAPIClient";

export class SearchApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async search(body: Record<string, any>) {
    return this.post("/v1/search/text", body);
  }
}
