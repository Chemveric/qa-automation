import { APIRequestContext } from '@playwright/test';
export class RFQClient {
  constructor(private api: APIRequestContext) {}
  async createRFQ(payload: any) {
    return await this.api.post('/rfqs', { data: payload });
  }
  async listRFQs() {
    return await this.api.get('/rfqs');
  }
}
