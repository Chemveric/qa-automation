import { SignupRequestStepOneBuilder } from "./signupRequestStepOneBuilder";

export const SingnupRequestStepOneFactory = {
  validBuyer() {
    return new SignupRequestStepOneBuilder().build();
  },

  validVendor(role: string, vendorModes: string[] | string) {
    return new SignupRequestStepOneBuilder()
      .withRole(role)
      .withVendorModes(vendorModes)
      .build();
  },

  validBuyerWithSecondaryVendorRole(
    role: string,
    vendorModes: string[] | string
  ) {
    return new SignupRequestStepOneBuilder()
      .withSecondaryRole(role)
      .withVendorModes(vendorModes)
      .build();
  },

  validVendorWithSecondaryBuyerRole(
    role: string,
    secondaryRole: string,
    vendorModes: string[] | string
  ) {
    return new SignupRequestStepOneBuilder()
      .withRole(role)
      .withSecondaryRole(secondaryRole)
      .withVendorModes(vendorModes)
      .build();
  },

  requestWithEmail(email: string | null | undefined) {
    return new SignupRequestStepOneBuilder().withEmail(email).build();
  },

  missing(field: string) {
    return new SignupRequestStepOneBuilder().withoutField(field).build();
  },

  invalid(field: string, value: any) {
    const builder = new SignupRequestStepOneBuilder();
    switch (field) {
      case "role":
        return builder.withRole(value).build();
      case "secondaryRole":
        return builder.withSecondaryRole(value).build();
      case "vendorModes":
        return builder.withVendorModes(value).build();
      case "companyTitle":
        return builder.withCompanyTitle(value).build();
      case "firstName":
        return builder.withFirstName(value).build();
      case "lastName":
        return builder.withLastName(value).build();
      case "termsAccepted":
        return builder.withTermsAccepted(value).build();
      default:
        return builder.build();
    }
  },
};
