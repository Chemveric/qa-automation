import { faker } from "@faker-js/faker";
import { VendorService } from "../types/vendorService.types";

const domains = [
  "BIOLOGY",
  "CHEMISTRY",
  "CLINICAL_OPERATIONS",
  "DIGITAL_SOLUTIONS",
  "MANUFACTURING",
  "MEDICAL_DEVICES",
  "REGULATORY_AND_QUALITY",
];
const developmentPhase = [
  "DISCOVERY",
  "PRECLINICAL",
  "CLINICAL_DEVELOPMENT",
  "MULTI_STAGE",
  "FUNCTIONAL_SERVICES",
  "COMMERCIAL_POST_MARKET",
  "POST_MARKET",
];

export class CustomVendorServiceBuilder {
  private vendorService: VendorService;
  constructor() {
    this.vendorService = {
      name: `aqa ${faker.company.buzzPhrase()}`,
      description: `aqa ${faker.lorem.sentence()}`,
      categoryId: faker.string.uuid(),
      domain: faker.helpers.arrayElement(domains),
      developmentPhase: faker.helpers.arrayElement(developmentPhase),
    };
  }

  withName(name: string | null | undefined) {
    this.vendorService.name = name;
    return this;
  }

  withDescription(description: string | null | undefined) {
    this.vendorService.description = description;
    return this;
  }

  withCategoryId(categoryId: string | null | undefined) {
    this.vendorService.categoryId = categoryId;
    return this;
  }

  withDomain(domain: string | null | undefined) {
    this.vendorService.domain = domain;
    return this;
  }

  withDevelopmentPhase(developmentPhase: string | null | undefined) {
    this.vendorService.developmentPhase = developmentPhase;
    return this;
  }

  withoutField<T extends keyof VendorService>(field: T): this {
    const copy = { ...this.vendorService };
    delete copy[field];
    this.vendorService = copy;
    return this;
  }

  build(): VendorService {
    return this.vendorService;
  }
}
