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
import { OrderListSchema } from "../../../src/schema/orderListSchema";
import { startsWith } from "zod";

const validator = new ResponseValidationHelper();

test.describe("API: GET orders", () => {
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

  test(`should get orders with filter`, async () => {
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

    const params = {
      status: ["PAYMENT_PROCESSING"],
    };
    const res = await api.getOrders(params);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      OrderListSchema,
      200
    );

    expect(
      validated.items.every((item) => item.status === "PAYMENT_PROCESSING")
    ).toBe(true);
  });

  test(`should get orders with no filters`, async () => {
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

    const res = await api.getOrders();
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      OrderListSchema,
      200
    );
    expect(validated.items.length).toBeGreaterThan(0);
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

    const res = await api.getOrders();
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
    const res = await api.getOrders();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return orders with limit`, async () => {
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
    const params = {
      limit: 10,
    };
    const res = await api.getOrders(params);
    expect(res.status).toBe(200);
    const checkoutBody = await res.body;

    const validated = await validateResponse(
      { status: res.status, body: checkoutBody },
      OrderListSchema,
      200
    );
    expect(validated.totalCount).toBe(10);
  });

  test(`should return no orders when start date filter in future`, async () => {
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
    const d = new Date();
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    const iso = d.toISOString().replace(".000Z", "Z");
    const params = {
      startDate: iso,
    };
    const res = await api.getOrders(params);
    expect(res.status).toBe(200);
    const checkoutBody = await res.body;

    const validated = await validateResponse(
      { status: res.status, body: checkoutBody },
      OrderListSchema,
      200
    );
    expect(validated.items).toHaveLength(0);
    expect(validated.totalCount).toBe(0);
  });

  test(`should return 401 when fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, fakeCookie);
    const res = await api.getOrders();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
