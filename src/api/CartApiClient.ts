import { BaseAPIClient } from "../core/BaseAPIClient";

export class CartApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async addCartItem(body: Record<string, any>) {
    return this.post("/v1/cart/add-item", body);
  }
  async getCart() {
    return this.get(`/v1/cart`);
  }
  async removeItemFromCart(id: string | number) {
    return this.delete(`/v1/cart/items/${id}`);
  }
  async updateCartItem(body: Record<string, any>, id: string | number) {
    return this.post(`/v1/cart/update-item/${id}`, body);
  }
}
