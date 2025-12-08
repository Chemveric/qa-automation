import { test, expect, request } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { OrdersApiClient } from "../../../src/api/OrdersApiClient";
import { OrderCheckoutSchema } from "../../../src/schema/orderCheckoutSchema";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { CartSchema } from "../../../src/schema/cartSchema";

const validator = new ResponseValidationHelper();

test.describe("API: POST orders checkout", () => {
  let userApi: UserApiClient;
  let api: OrdersApiClient;
  let cartApi: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let packageId: string | undefined;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();

    searchApi = new SearchApiClient();
    await searchApi.init({}, supplierCookie);

    //search products to get packageId
    const res = await searchApi.search({ limit: 10 });
    expect(res.status).toBe(201);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      SearchResponseSchema,
      201
    );

    //get first product with stock available
    let product = validated.items.find((item) => item.inStock === true);
    packageId = product?.packages[0].id;

    // Add item to the cart
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    cartApi = new CartApiClient();
    await cartApi.init({}, supplierCookie);
    const addRes = await cartApi.addCartItem({
      packageId,
      quantity: 1,
    });
    expect(addRes.status).toBe(201);
  });

  test(`should checkout created orders`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);

    const res = await api.postOrdersCheckout();
    expect(res.status).toBe(201);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      OrderCheckoutSchema,
      201
    );
    expect(validated.totalAmount).toBeGreaterThan(0);
    expect(validated.status).toBe("PAYMENT_PENDING");
    expect(validated.orderItems.map((i) => i.packageId)).toEqual(
      expect.arrayContaining([packageId])
    );
  });

  test(`should return 403 forbidden for supplier cookie`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);

    const res = await api.postOrdersCheckout();
    expect(res.status).toBe(403);
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 401 unauthorized for admin cookie`, async () => {
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.postOrdersCheckout();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return empty order when there are no items in the cart`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "BUYER",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    cartApi = new CartApiClient();
    await cartApi.init({}, supplierCookie);

    const cartRes = await cartApi.getCart();
    expect(cartRes.status).toBe(200);
    const body = await cartRes.body;
    const cart = await validateResponse(
      { status: cartRes.status, body },
      CartSchema,
      200
    );
    for (const item of cart.items) {
      await cartApi.removeItemFromCart(item.selectedPack.id, {
        packageId: item.selectedPack.id,
      });
    }

    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);

    const res = await api.postOrdersCheckout();
    expect(res.status).toBe(201);
    const checkoutBody = await res.body;

    const validated = await validateResponse(
      { status: res.status, body: checkoutBody },
      OrderCheckoutSchema,
      201
    );
    expect(validated.totalAmount).toBe(0);
    expect(validated.orderItems.length).toBe(0);
  });

  test(`should return 401 when fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, fakeCookie);
    const res = await api.postOrdersCheckout();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
