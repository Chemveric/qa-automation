import { BaseAPIClient } from "../../core/BaseAPIClient";
import { SuppliersSearchRequest } from "./suppliers.types";

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

  async postSuppliersSearch(body: SuppliersSearchRequest) {
    return this.post("/v1/suppliers/search", body);
  }

  async getSupplierById(id: string) {
    return this.get(`/v1/suppliers/${id}`);
  }
}
