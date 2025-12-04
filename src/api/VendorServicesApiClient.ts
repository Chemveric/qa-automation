import { BaseAPIClient } from "../core/BaseAPIClient";

type VendorServicesSearchQuery = {
  query: string | number | undefined;
  itemsCount?: number | string | undefined;
};

export class VendorServicesApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getCategories() {
    return this.get("/v1/vendor-services/categories");
  }

  async getSearch(query?: VendorServicesSearchQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])
        )
      : {};
    const searchParams = new URLSearchParams(params).toString();
    const url = `/v1/vendor-services/search${
      searchParams ? "?" + searchParams : ""
    }`;
    console.log("GET SEARCH URL: ", url);

    return this.get(url);
  }

  async getList() {
    return this.get("/v1/vendor-services/list");
  }

  async getListByOrganization() {
    return this.get("/v1/vendor-services/list/by-organization");
  }
}
