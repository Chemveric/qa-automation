import { APIRequestContext } from '@playwright/test';
export class QuoteClient {
  constructor(private api: APIRequestContext) {}
  async submitQuote(rfqId: number, data: any) {
    return await this.api.post(`/rfqs/${rfqId}/quotes`, { data });
  }
  async listQuotes(rfqId: number) {
    return await this.api.get(`/rfqs/${rfqId}/quotes`);
  }
}
