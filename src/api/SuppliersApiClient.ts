import { BaseAPIClient } from "../core/BaseAPIClient";

type SuppliersQuery = {
  modes?: string[];
};

export class SuppliersApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getSuppliersList(query?: SuppliersQuery) {
    const searchParams = new URLSearchParams();

    if (query?.modes?.length) {
      for (const mode of query.modes) {
        searchParams.append("modes", mode);
      }
    }
    const url = `/v1/suppliers/list/short${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;
    return this.get(url);
  }
}
