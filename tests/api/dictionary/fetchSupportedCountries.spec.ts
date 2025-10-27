import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { DictionaryApiClient } from "../../../src/api/DictionaryApiClient";
import { faker } from "@faker-js/faker";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { DictionarySupportedRegionsSchema } from "../../../src/schema/dictionarySupportedRegionsSchema";
import { DictionarySupportedCountriesSchema } from "../../../src/schema/dictionarySupportedCountriesSchema";
import { invalidIds } from "../../../src/utils/invalidData/invalidIds";

const validator = new ResponseValidationHelper();

test.describe("API smoke: GET supported-countries by ID", () => {
  let api: DictionaryApiClient;
  let adminCookie: string;
  let id: string;

  test.beforeAll(async () => {
    adminCookie = getAdminCookie();
    api = new DictionaryApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getDictionarySupportedRegions();
    const body = await res.body;
    const regions = await validateResponse(
      { status: res.status, body },
      DictionarySupportedRegionsSchema,
      200
    );
    id = regions[0].id;
  });

  test("should return expected schema when send valid request with no params", async () => {
    const res = await api.getDictionarySupportedCountries({
      regionId: id,
    });
    const body = await res.body;
    const countries = await validateResponse(
      { status: res.status, body },
      DictionarySupportedCountriesSchema,
      200
    );
    expect(Array.isArray(countries)).toBe(true);
    for (const country of countries) {
      expect(typeof country.id).toBe("string");
      expect(typeof country.name).toBe("string");
      expect(typeof country.code).toBe("string");
      expect(typeof country.regionId).toBe("string");
    }
  });

  test("should return 400 when send invalid status value in params", async () => {
    const fakeId = faker.string.uuid();
    const res = await api.getDictionarySupportedCountries({
      regionId: fakeId,
    });
    console.log(res.body, res.status);
    validator.expectStatusCodeAndMessage(res, 400, "Invalid regionId");
  });

  for (const id of invalidIds) {
    test(`should return 422 when send invalid id: ${id}`, async () => {
      const res = await api.getDictionarySupportedCountries({
        regionId: id,
      });
      validator.expectStatusCodeAndMessage(res, 422, "regionId must be a UUID");
    });
  }
});
