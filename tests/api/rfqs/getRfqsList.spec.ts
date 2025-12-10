import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { RfqsApiClient } from "../../../src/api/RfqsApiClient";
import { invalidRfqQueryParams } from "../../../src/utils/invalidData/invalidRfq";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { RfqsListResponseSchema } from "../../../src/schema/rfqShema";
import { RfqTabParams } from "../../../src/config/enums";

const validator = new ResponseValidationHelper();

test.describe("API: GET RFQs list", () => {
  let api: RfqsApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should get RFQs list with pagination`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqsList({
      tab: "rfqs",
      page: 1,
      limit: 10,
    });
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);

    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqsListResponseSchema
    );
    expect(validated.tabs).toHaveProperty("rfqs");
    expect(validated.meta.page).toBe(1);
    expect(validated.meta.limit).toBe(10);
  });

  for (let param of RfqTabParams) {
    test(`should get RFQs list with params: ${param}`, async () => {
      api = new RfqsApiClient();
      await api.init({ "Content-Type": false }, buyerCookie);
      const resGet = await api.getRfqsList({
        tab: param,
      });
      const body = resGet.body;

      expect(
        resGet.status,
        `Expected status code is 200, but got ${resGet.status}`
      ).toBe(200);

      const validated = await validateResponse(
        { status: resGet.status, body },
        RfqsListResponseSchema
      );
      expect(validated.tabs).toHaveProperty("rfqs");
    });
  }

  test(`should get RFQs list with search query`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqsList({
      search: "Open",
    });
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);

    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqsListResponseSchema
    );
    expect(validated.tabs).toHaveProperty("rfqs");
    expect(validated).toHaveProperty("data");
  });

  test(`should get RFQs list with all params combined`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqsList({
      tab: "rfqs",
      page: 1,
      limit: 10,
      search: "Open",
    });
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);

    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqsListResponseSchema
    );
    expect(validated.tabs).toHaveProperty("rfqs");
    expect(validated).toHaveProperty("data");
  });

  test(`should get RFQs list with no params`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqsList({});
    const body = resGet.body;

    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);

    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqsListResponseSchema
    );
    expect(validated.tabs).toHaveProperty("rfqs");
    expect(validated).toHaveProperty("data");
  });

  test(`should return 403 when send request with supplier cookie`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getRfqsList({});

    validator.expectStatusCodeAndMessage(
      resGet,
      403,
      "Forbidden for your permission"
    );
  });

  test(`should return 401 when send request with admin cookie`, async () => {
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const resGet = await api.getRfqsList({});

    validator.expectStatusCodeAndMessage(resGet, 401, "Unauthorized");
  });

  for (const [field, invalidValues] of Object.entries(invalidRfqQueryParams)) {
    for (const { value, expectedError } of invalidValues) {
      test(`should return 422 for invalid query param: ${field} = "${value}"`, async () => {
        api = new RfqsApiClient();
        await api.init({ "Content-Type": false }, buyerCookie);

        const params: any = {
          tab: "rfqs",
          page: 1,
          limit: 10,
        };
        params[field] = value;

        const res = await api.getRfqsList(params);

        validator.expectStatusCodeAndMessage(res, 422, expectedError, field);
      });
    }
  }
});
