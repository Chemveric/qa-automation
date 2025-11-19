import { BaseAPIClient } from "../core/BaseAPIClient";

export class RfqsApiClient extends BaseAPIClient {
  async postRfqs(body: Record<string, any> = {}) { 
    return this.post("/v1/rfqs", body);
  }

  async getRfqById(id: string){
    return this.get(`/v1/rfqs/${id}`);
  }
}
 