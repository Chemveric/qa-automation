import { InvitationBuilder } from "./invitationsBuilder";

export const InvitationFactory = {
  valid() {
    return new InvitationBuilder().build();
  },

  invitationWithEmail(email: string | null | undefined) {
    return new InvitationBuilder().withEmail(email).build();
  },

  invitationWithCompanyName(companyName: string | null | undefined) {
    return new InvitationBuilder().withCompanyName(companyName).build();
  },

  invitationWithFirstName(firstName: string | null | undefined) {
    return new InvitationBuilder().withFirstName(firstName).build();
  },

  invitationWithLastName(lastName: string | null | undefined) {
    return new InvitationBuilder().withLastName(lastName).build();
  },

  missing(field: string) {
    return new InvitationBuilder().withoutField(field).build();
  },

  invalid(field: string, value: any) {
    const builder = new InvitationBuilder();
    switch (field) {
      case "companyName":
        return builder.withCompanyName(value).build();
      case "firstName":
        return builder.withFirstName(value).build();
      case "lastName":
        return builder.withLastName(value).build();
      default:
        return builder.build();
    }
  },
};
