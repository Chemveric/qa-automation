import { UUID } from "crypto";
import { BaseAPIClient } from "../core/BaseAPIClient";

type SupportedCountriesQuery = {
  regionId?: UUID |string | number;
};

export class DictionaryApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }

  async getDictionarySupportedRegions() {
    return this.get("/v1/dictionary/supported-regions");
  }

  async getDictionarySupportedCountries(query?: SupportedCountriesQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).filter(([_, value]) => value !== undefined)
        )
      : {};
    return this.get(`/v1/dictionary/supported-countries`, params);
  }
}
