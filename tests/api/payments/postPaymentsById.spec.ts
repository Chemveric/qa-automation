import { test, expect, request } from "@playwright/test";
import {
  getSupplierCookie,
  getAdminCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { OrdersApiClient } from "../../../src/api/OrdersApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { OrderListSchema } from "../../../src/schema/orderListSchema";
import { PaymentsApiClient } from "../../../src/api/PaymentsApiClient";
import { PaymentSessionSchema } from "../../../src/schema/paymentsSchema";

const validator = new ResponseValidationHelper();

test.describe("API: POST payments by id", () => {
  let userApi: UserApiClient;
  let ordersApi: OrdersApiClient;
  let api: PaymentsApiClient;
  let cartApi: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let adminCookie: string;
  let buyerCookie: string;
  let packageId: string | undefined;
  let orderItems: Array<any>;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    buyerCookie = getBuyerCookie();

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
    ordersApi = new OrdersApiClient();
    await ordersApi.init({}, buyerCookie);

    const ordersRes = await ordersApi.getOrders();
    const orders = await validateResponse(
      { status: ordersRes.status, body: await ordersRes.body },
      OrderListSchema,
      200
    );
    orderItems = orders.items;
  });

  test(`should get session id`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const order = orderItems[0];

    const res = await api.postPayment(order.id, { paymentMethod: "STRIPE_CC" });
    expect(res.status).toBe(201);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      PaymentSessionSchema,
      201
    );

    expect(validated.clientSecret).toBeDefined();
    expect(validated.sessionId).toBeDefined();
  });

  test(`should get 422 when wrong payment type`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const order = orderItems[0];

    const res = await api.postPayment(order.id, { paymentMethod: "STRIPE_DC" });
    expect(res.status).toBe(422);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "paymentMethod must be one of the following values: STRIPE_CC"
    );
  });

  test(`should get 400 with wrong order id`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    let wrongOrderId = "123453";
    const res = await api.postPayment(wrongOrderId, {
      paymentMethod: "STRIPE_CC",
    });
    expect(res.status).toBe(400);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  test(`should get 404 not fount for not existing order id`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    let notExistingId = randomUUID();
    const res = await api.postPayment(notExistingId, {
      paymentMethod: "STRIPE_CC",
    });
    expect(res.status).toBe(404);
    validator.expectStatusCodeAndMessage(res, 404, "Order not found");
  });

  test(`should get 422 when no body in request`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const order = orderItems[0];
    const res = await api.postPayment(order.id);
    expect(res.status).toBe(422);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "paymentMethod must be one of the following values: STRIPE_CC"
    );
  });

  test(`should return 401 unauthorized for admin cookie`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postPayment(orderItems[0].id, {
      paymentMethod: "STRIPE_CC",
    });
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return 404 order not found for supplier cookie`, async () => {
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);

    const res = await api.postPayment(orderItems[0].id, {
      paymentMethod: "STRIPE_CC",
    });
    validator.expectStatusCodeAndMessage(res, 404, "Order not found");
  });

  test(`should return 401 when fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new PaymentsApiClient();
    await api.init({ "Content-Type": false }, fakeCookie);

    const res = await api.postPayment(orderItems[0].id, {
      paymentMethod: "STRIPE_CC",
    });
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
