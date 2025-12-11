import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { OrdersApiClient } from "../../../src/api/OrdersApiClient";
import { AddressSchema } from "../../../src/schema/orderShippingAddressSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET orders shipping address", () => {
  let api: OrdersApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should get address for supplier`, async () => {
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const res = await api.getOrdersAddress();
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      AddressSchema,
      200
    );

    expect(validated).toBeDefined();
  });

  test(`should get address for buyer`, async () => {
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const res = await api.getOrdersAddress();
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      AddressSchema,
      200
    );

    expect(validated).toBeDefined();
  });

  test(`should 401 unauthorized for admin coockie`, async () => {
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getOrdersAddress();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return 401 when fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new OrdersApiClient();
    await api.init({ "Content-Type": false }, fakeCookie);
    const res = await api.getOrdersAddress();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
