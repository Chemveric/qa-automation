import { test, expect } from "@playwright/test";
import { getSupplierCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { randomUUID } from "crypto";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { CartSchema } from "../../../src/schema/cartSchema";

const validator = new ResponseValidationHelper();

test.describe("API: DELETE item from the cart", () => {
  let api: CartApiClient;
  let searchApi: SearchApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let packageId: string | undefined;

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

    // Add item to the cart before deleting
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const addRes = await api.addCartItem({
      packageId,
      quantity: 1,
    });
    expect(addRes.status).toBe(201);
  });

  test(`should delete item from the cart`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);

    const res = await api.removeItemFromCart(packageId!, { packageId });
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      CartSchema,
      200
    );
    if (validated.items.length > 0) {
      expect(
        validated.items
          .flatMap((item) => item.packs)
          .some((pack) => pack.id === packageId)
      ).toBe(false);
    }
  });

  test(`should return 403 forbidden for supplier cookie`, async () => {
    api = new CartApiClient();
    await api.init({}, supplierCookie);

    const res = await api.removeItemFromCart(packageId!, { packageId });
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

    const res = await api.removeItemFromCart(packageId!, { packageId });
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
    const res = await api.removeItemFromCart(fakePackageId, {
      packageId: fakePackageId,
    });
    expect(res.status).toBe(400);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Failed to get chemical package"
    );
  });

  test(`should return 400 when wrong package id`, async () => {
    const wrongPackageId = "";
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const res = await api.removeItemFromCart(wrongPackageId!, {
      packageId: wrongPackageId,
    });
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });
});
