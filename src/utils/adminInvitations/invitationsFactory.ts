import { InvitationBuilder } from "./invitationsBuilder";
import { Invitation } from '../types/invitation.types';

export const InvitationFactory = {
  valid(): Invitation {
    return new InvitationBuilder().build();
  },

  invitationWithEmail(email: string | null | undefined): Invitation {
    return new InvitationBuilder().withEmail(email).build();
  },

  invitationWithCompanyName(companyName: string | null | undefined): Invitation {
    return new InvitationBuilder().withCompanyName(companyName).build();
  },

  invitationWithFirstName(firstName: string | null | undefined): Invitation {
    return new InvitationBuilder().withFirstName(firstName).build();
  },

  invitationWithLastName(lastName: string | null | undefined): Invitation {
    return new InvitationBuilder().withLastName(lastName).build();
  },

  missing(field: keyof Invitation): Invitation {
    return new InvitationBuilder().withoutField(field).build();
  },

  invalid(field: string, value: any): Invitation {
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
