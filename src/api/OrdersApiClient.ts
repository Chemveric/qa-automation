import { BaseAPIClient } from "../core/BaseAPIClient";

export class OrdersApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async postOrdersCheckout() {
    return this.post(`/v1/orders/checkout`);
  }
}
