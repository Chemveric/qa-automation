import { BaseAPIClient } from "../core/BaseAPIClient";

export class PaymentsApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async postPayment(orderid: string, body: Record<string, any> = {}) {
    return this.post(`/v1/payment/${orderid}/payments`, body);
  }
}
