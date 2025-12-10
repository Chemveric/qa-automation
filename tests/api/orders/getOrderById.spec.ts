import { test, expect, request } from "@playwright/test";
import { getSupplierCookie, getAdminCookie } from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { OrdersApiClient } from "../../../src/api/OrdersApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { OrderListSchema } from "../../../src/schema/orderListSchema";
import { OrderDetailsSchema } from "../../../src/schema/orderItemSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET order by id", () => {
  let userApi: UserApiClient;
  let api: OrdersApiClient;
  let cartApi: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let adminCookie: string;
  let packageId: string | undefined;
  let orderItems: Array<any>;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
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

    //get all orders
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const ordersBody = {
      setRole: "BUYER",
    };
    const ordersPost = await userApi.postUserRoles(ordersBody);
    expect(
      ordersPost.status,
      `Expected status code is 201, but got ${ordersPost.status}`
    ).toBe(201);
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);

    const ordersRes = await api.getOrders();
    const orders = await validateResponse(
      { status: ordersRes.status, body: await ordersRes.body },
      OrderListSchema,
      200
    );
    orderItems = orders.items;
  });

  test(`should get order by id`, async () => {
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
    const order = orderItems[0];
    const res = await api.getOrderById(order.id);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      OrderDetailsSchema,
      200
    );

    expect(validated.id).toBe(order.id);
    expect(validated.totalAmount).toBe(order.totalAmount);
    expect(validated.status).toBe(order.status);
  });

  test(`should get 404 with not existing order id`, async () => {
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
    let wrongOrderId = randomUUID();
    const res = await api.getOrderById(wrongOrderId);
    expect(res.status).toBe(404);
    validator.expectStatusCodeAndMessage(res, 404, "Order not found");
  });

  test(`should get 404 with wrong order id`, async () => {
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
    let wrongOrderId = "123453";
    const res = await api.getOrderById(wrongOrderId);
    expect(res.status).toBe(400);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  test(`should return 401 unauthorized for admin cookie`, async () => {
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.getOrderById(orderItems[0].id);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
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
    const res = await api.getOrderById(orderItems[0].id);
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 401 when fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, fakeCookie);
    const res = await api.getOrderById(orderItems[0].id);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
