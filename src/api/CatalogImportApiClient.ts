import { BaseAPIClient } from "../core/BaseAPIClient";


export interface ImportData {
    fileId: string;
    importKind: string;
    mode: string;
    withRefresh: string;
}
export class CatalogImportApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async postImports(body: Record<string, any>) {
    return this.post("/v1/catalog/imports", body);
  }
  async getImports(id: string | number) {
    return this.get(`/v1/catalog/imports/${id}`);
  }
  async getProducts() {
    return this.get(`/v1/catalog/products`);
  }
  async getProductById(id: string | number) {
    return this.get(`/v1/catalog/products/${id}`);
  }
}
