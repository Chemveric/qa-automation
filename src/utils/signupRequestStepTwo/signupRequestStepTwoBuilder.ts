import { faker } from "@faker-js/faker";

interface SignupStepTwoData {
  token?: string;
  data?: {
    companyName?: string;
    companyRegionId?: string;
    companyCountryId?: string;
    companyState?: string;
    companyCity?: string;
    companyStreet?: string;
    companyPostalCode?: string;
  };
}

export class SignupRequestStepTwoBuilder {
  private request: SignupStepTwoData = {};

  setToken(token: string) {
    this.request.token = token;
    return this;
  }

  withCompanyName(name?: string | null | undefined) {
    this.ensureData();
    this.request.data!.companyName = name ?? faker.company.name();
    return this;
  }

  withRegion(regionId = "70e8dbae-76d3-45b4-a48a-de3726644347") {
    this.ensureData();
    this.request.data!.companyRegionId = regionId;
    return this;
  }

  withCountry(countryId = "a5890849-cb0d-43b8-a0af-8ac7c38295cd") {
    this.ensureData();
    this.request.data!.companyCountryId = countryId;
    return this;
  }

  withCompanyState(state: string | null | undefined) {
    this.ensureData();
    this.request.data!.companyState = state ?? faker.location.state();
    return this;
  }

  withCompanyCity(city: string | null | undefined) {
    this.ensureData();
    this.request.data!.companyCity = city ?? faker.location.city();
    return this;
  }

  withCompanyStreet(street: string | null | undefined) {
    this.ensureData();
    this.request.data!.companyStreet = street ?? faker.location.streetAddress();
    return this;
  }

  withCompanyPostalCode(zipcode: string | null | undefined) {
    this.ensureData();
    this.request.data!.companyPostalCode = zipcode ?? faker.location.zipCode();
    return this;
  }

  withRandomLocation() {
    this.ensureData();
    this.request.data!.companyState = faker.location.state();
    this.request.data!.companyCity = faker.location.city();
    this.request.data!.companyStreet = faker.location.streetAddress();
    this.request.data!.companyPostalCode = faker.location.zipCode();
    return this;
  }

  /**
   * Removes a top-level or nested data field.
   * Example: .withoutField("token") or .withoutField("data.companyName")
   */
  withoutField(field: string) {
    if (field.startsWith("data.")) {
      const key = field.replace("data.", "") as keyof NonNullable<
        SignupStepTwoData["data"]
      >;
      if (this.request.data && key in this.request.data) {
        const copy = { ...this.request.data };
        delete copy[key];
        this.request.data = copy;
      }
    } else {
      const key = field as keyof SignupStepTwoData;
      if (key in this.request) {
        const copy = { ...this.request };
        delete copy[key];
        this.request = copy;
      }
    }
    return this;
  }

  build() {
    return this.request;
  }

  private ensureData() {
    if (!this.request.data) this.request.data = {};
  }
}
