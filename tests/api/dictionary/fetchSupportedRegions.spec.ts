import { test, expect } from "@playwright/test";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { DictionaryApiClient } from "../../../src/api/DictionaryApiClient";
import { DictionarySupportedRegionsSchema } from "../../../src/schema/dictionarySupportedRegionsSchema";
import { validateResponse } from "../../../helpers/schemaResponseValidator";

test.describe("API smoke: Dictionary GET Supported Regions", () => {
  test(`should return expected schema when send valid request`, async () => {
    const adminCookie = getAdminCookie();
    const api = new DictionaryApiClient();
    await api.init({ "Content-Type": false }, adminCookie);
    const res = await api.getDictionarySupportedRegions();
    const body = await res.body;
    const regions = await validateResponse(
      { status: res.status, body },
      DictionarySupportedRegionsSchema,
      200
    );
    expect(Array.isArray(regions)).toBe(true);
    for (const region of regions) {
      expect(region).toHaveProperty("id");
      expect(typeof region.name).toBe("string");
      expect(typeof region.code).toBe("string");
    }
  });

  test(`should return expected schema when send valid request without admin cookie`, async () => {
    const api = new DictionaryApiClient();
    await api.init({ "Content-Type": false });
    const res = await api.getDictionarySupportedRegions();
    const body = await res.body;
    const regions = await validateResponse(
      { status: res.status, body },
      DictionarySupportedRegionsSchema,
      200
    );
    expect(Array.isArray(regions)).toBe(true);
    for (const region of regions) {
      expect(region).toHaveProperty("id");
      expect(typeof region.name).toBe("string");
      expect(typeof region.code).toBe("string");
    }
  });
});
