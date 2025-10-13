import { APIRequestContext } from '@playwright/test';
export class CatalogClient {
  constructor(private api: APIRequestContext) {}
  async search(query: string) {
    return await this.api.get(`/catalog/search`, { params: { q: query } });
  }
  async productByCAS(cas: string) {
    return await this.api.get(`/catalog/product`, { params: { cas } });
  }
}
