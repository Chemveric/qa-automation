import { faker } from "@faker-js/faker";

export class SignupRequestStepOneBuilder {
  private requestStepOne: Record<string, any>;
  constructor() {
    this.requestStepOne = {
      role: "BUYER",
      firstName: `AQA-${faker.person.firstName()}`,
      lastName: `AQA-${faker.person.lastName()}`,
      companyTitle: faker.company.name(),
      email: `nadiia.patrusheva+${faker.string.uuid()}@globaldev.tech`,
      termsAccepted: true,
    };
  }

  withRole(role: string | null | undefined) {
    this.requestStepOne.role = role;
    return this;
  }

  withSecondaryRole(secondaryRole?: string | null | undefined) {
    this.requestStepOne.secondaryRole = secondaryRole;
    return this;
  }

  withVendorModes(vendorModes?: string[] | string) {
    if (vendorModes) {
      this.requestStepOne.vendorModes = Array.isArray(vendorModes)
        ? vendorModes
        : [vendorModes];
    }

    return this;
  }

  withEmail(email: string | null | undefined) {
    this.requestStepOne.email = email;
    return this;
  }

  withCompanyTitle(companyTitle: string | null | undefined) {
    this.requestStepOne.companyTitle = companyTitle;
    return this;
  }

  withFirstName(firstName: string | null | undefined) {
    this.requestStepOne.firstName = firstName;
    return this;
  }

  withLastName(lastName: string | null | undefined) {
    this.requestStepOne.lastName = lastName;
    return this;
  }

  withTermsAccepted(termsAccepted: boolean){
       this.requestStepOne.termsAccepted = termsAccepted;
    return this;
  }

  withoutField(field: string) {
    const copy = { ...this.requestStepOne };
    delete copy[field];
    this.requestStepOne = copy;
    return this;
  }

  build() {
    return { ...this.requestStepOne };
  }
}
