import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { CartSchema } from "../../../src/schema/cartSchema";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { AddCartSchema } from "../../../src/schema/addCartSchema";

const validator = new ResponseValidationHelper();

test.describe("API: POST update item in the cart", () => {
  let api: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let packageId: string | undefined;
  let cardItemId: string | undefined;
  let availableQuantity: number | undefined;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();

    searchApi = new SearchApiClient();
    await searchApi.init({}, supplierCookie);

    const res = await searchApi.search({ limit: 10 });
    expect(res.status).toBe(201);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      SearchResponseSchema,
      201
    );
    let product = validated.items.find((item) => item.inStock === true);
    packageId = product?.packages[0].id;

    // Add item to the cart
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const addRes = await api.addCartItem({
      packageId,
      quantity: 1,
    });
    const cart = await validateResponse(
      { status: addRes.status, body: await addRes.body },
      AddCartSchema,
      201
    );

    const cardItem = cart.items.find((item) =>
      item.packs.some((p) => p.id === packageId)
    );
    cardItemId = cardItem?.id;
    availableQuantity = cardItem?.packs?.[0]?.quantityAvailable;
  });

  test(`should update item in the cart`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const quantity = Math.floor(Math.random() * availableQuantity!) + 1;
    const params = {
      newPackageId: packageId,
      quantity: quantity,
    };

    const res = await api.updateCartItem(params, cardItemId!);
    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      CartSchema,
      201
    );
    const updatedItem = validated.items.find((item) => item.id === cardItemId);
    expect(updatedItem?.packs.some((pack) => pack.id === packageId)).toBe(true);
    expect(updatedItem?.quantity).toBe(quantity);
  });

  test(`should return 403 if updated with supplier cookie`, async () => {
    api = new CartApiClient();
    await api.init({}, supplierCookie);

    const params = {
      newPackageId: packageId,
      quantity: 2,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 422 if updated to 0`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);

    const params = {
      newPackageId: packageId,
      quantity: 0,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(res, 422, "quantity");
  });

  test(`should return 400 if updated more quantity that exist`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);

    const params = {
      newPackageId: packageId,
      quantity: availableQuantity! + 10,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(res, 400, "quantity");
  });

  test(`should return 401 unauthorized for admin cookie`, async () => {
    api = new CartApiClient();
    let adminCookie = getAdminCookie();
    await api.init({}, adminCookie);

    const params = {
      newPackageId: packageId,
      quantity: 2,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return 400 when non existing package id`, async () => {
    const fakePackageId = randomUUID();
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const params = {
      newPackageId: fakePackageId,
      quantity: 2,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Failed to get chemical package"
    );
  });

  test(`should return 400 when non existing cardItem id`, async () => {
    const fakeCardItemId = randomUUID();
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const params = {
      newPackageId: packageId,
      quantity: 2,
    };
    const res = await api.updateCartItem(params, fakeCardItemId!);
    validator.expectStatusCodeAndMessage(res, 400, "Failed to get cart");
  });

  test(`should return 422 when wrong package id`, async () => {
    const wrongPackageId = "";
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const params = {
      newPackageId: wrongPackageId,
      quantity: 2,
    };
    const res = await api.updateCartItem(params, cardItemId!);
    validator.expectStatusCodeAndMessage(res, 422, "Internal server error");
  });
});
