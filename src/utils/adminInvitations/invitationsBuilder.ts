import { faker } from "@faker-js/faker";

export class InvitationBuilder {
  private invitation: Record<string, any>;
  constructor() {
    this.invitation = {
      email: `AQA-${faker.internet.email()}`,
      companyName: `AQA-${faker.company.name()}`,
      firstName: `AQA-${faker.person.firstName()}`,
      lastName: `AQA-${faker.person.lastName()}`,
    };
  }
  withEmail(email: string | null | undefined) {
    this.invitation.email = email;
    return this;
  }

  withCompanyName(companyName: string | null | undefined) {
    this.invitation.companyName = companyName;
    return this;
  }

  withFirstName(firstName: string | null | undefined) {
    this.invitation.firstName = firstName;
    return this;
  }

  withLastName(lastName: string | null | undefined) {
    this.invitation.lastName = lastName;
    return this;
  }

  withoutField(field: string) {
    const copy = { ...this.invitation };
    delete copy[field];
    this.invitation = copy;
    return this;
  }

  build() {
    return { ...this.invitation };
  }
}
