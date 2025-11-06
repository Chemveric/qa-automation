import { faker } from "@faker-js/faker";
import { Invitation } from '../types/invitation.types';

export class InvitationBuilder {
  private invitation: Invitation;
  constructor() {
    this.invitation = {
      email: `nadiia.patrusheva+${faker.string.uuid()}@globaldev.tech`,
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

  // withoutField(field: keyof Invitation) {
  //   const copy = { ...this.invitation };
  //   delete copy[field];
  //   this.invitation = copy;
  //   return this;
  // }

  withoutField<T extends keyof Invitation>(field: T): this {
  const copy = { ...this.invitation };
  delete copy[field];
  this.invitation = copy;
  return this;
}

  build(): Invitation {
    return this.invitation;
  }
}
