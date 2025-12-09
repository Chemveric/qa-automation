import { BaseAPIClient } from "../core/BaseAPIClient";

type OrdersQuery = {
  cursor?: string;
  limit?: number | string;
  status?: string[];
  startDate?: string;
  endDate?: string;
};

export class OrdersApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async postOrdersCheckout() {
    return this.post(`/v1/orders/checkout`);
  }
  async getOrders(query?: OrdersQuery) {
    const searchParams = new URLSearchParams();

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;

        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }

    const qs = searchParams.toString();
    const url = qs ? `/v1/orders?${qs}` : `/v1/orders`;

    return this.get(url);
  }
}
