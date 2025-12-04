import { test, expect } from "@playwright/test";
import { getSupplierCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import {
  SearchItem,
  SearchResponseSchema,
} from "../../../src/schema/searchResponseSchema";
import { AddCartSchema } from "../../../src/schema/addCartSchema";

const validator = new ResponseValidationHelper();

test.describe("API: POST add item to the cart", () => {
  let api: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let product: SearchItem | undefined;

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
    product = validated.items.find((item) => item.inStock === true);
  });

  test(`should add item to the cart`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);

    const res = await api.addCartItem({
      packageId: product?.packages[0].id,
      quantity: 2,
    });
    expect(res.status).toBe(201);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      AddCartSchema,
      201
    );
    expect(validated.items.length).toBeGreaterThan(0);
    expect(
      validated.items
        .flatMap((item) => item.packs)
        .some((pack) => pack.id === product?.packages[0].id)
    ).toBe(true);
  });

  test(`should return 403 forbidden for supplier cookie`, async () => {
    api = new CartApiClient();
    await api.init({}, supplierCookie);

    const res = await api.addCartItem({
      packageId: product?.packages[0].id,
      quantity: 2,
    });
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 403 forbidden for admin cookie`, async () => {
    api = new CartApiClient();
    let adminCookie = getSupplierCookie();
    await api.init({}, adminCookie);

    const res = await api.addCartItem({
      packageId: product?.packages[0].id,
      quantity: 2,
    });
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 400 when non existing product id`, async () => {
    const fakePackageId = randomUUID();
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const res = await api.addCartItem({
      packageId: fakePackageId,
      quantity: 2,
    });
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Failed to get chemical package"
    );
  });

  test(`should return 422 when wrong package id`, async () => {
    const wrongPackageId = "some package id";
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const res = await api.addCartItem({
      packageId: wrongPackageId,
      quantity: 2,
    });
    validator.expectStatusCodeAndMessage(res, 422, "ERR017", "packageId");
  });
});
