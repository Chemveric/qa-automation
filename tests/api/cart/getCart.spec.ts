import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { CartApiClient } from "../../../src/api/CartApiClient";
import { SearchApiClient } from "../../../src/api/SearchApiClient";
import { SearchResponseSchema } from "../../../src/schema/searchResponseSchema";
import { CartSchema } from "../../../src/schema/cartSchema";
import { randomUUID } from "crypto";

const validator = new ResponseValidationHelper();

test.describe("API: Get cart items", () => {
  test.describe.configure({ retries: 2 });
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

    // Add item to the cart
    api = new CartApiClient();
    await api.init({}, buyerCookie);
    const addRes = await api.addCartItem({
      packageId,
      quantity: 1,
    });
    expect(addRes.status).toBe(201);
  });

  test(`should return items from the cart`, async () => {
    api = new CartApiClient();
    await api.init({}, buyerCookie);

    const res = await api.getCart();
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      CartSchema,
      200
    );
    expect(validated.items.length).toBeGreaterThan(0);
    expect(
      validated.items
        .flatMap((item) => item.packs)
        .some((pack) => pack.id === packageId)
    ).toBe(true);
  });

  test(`should return 403 forbidden for supplier cookie`, async () => {
    api = new CartApiClient();
    await api.init({}, supplierCookie);

    const res = await api.getCart();
    validator.expectStatusCodeAndMessage(
      res,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 401 unauthorized for admin cookie`, async () => {
    api = new CartApiClient();
    let adminCookie = getAdminCookie();
    await api.init({}, adminCookie);
    const res = await api.getCart();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return 401 unauthorized for fake cookie`, async () => {
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    api = new CartApiClient();
    await api.init({}, fakeCookie);
    const res = await api.getCart();
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
