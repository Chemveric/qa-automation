import { SignupRequestStepTwoBuilder } from "./signupRequestStepTwoBuilder";

export const SignupRequestStepTwoFactory = {
  validCompanyData(token: string) {
    return new SignupRequestStepTwoBuilder()
      .setToken(token)
      .withCompanyName()
      .withRegion()
      .withCountry()
      .withRandomLocation()
      .build();
  },


  missing(field: string, token?: string) {
    const builder = new SignupRequestStepTwoBuilder();
    if (field !== "token" && token) {
      builder.setToken(token);
    }
    builder.withoutField(field);

    return builder.build();
  },

  invalid(field: string, value: any) {
      const builder = new SignupRequestStepTwoBuilder();
      switch (field) {
        case "token":
          return builder.setToken(value).build();
        case "data.companyName":
          return builder.withCompanyName(value).build();
        case "data.companyRegionId":
          return builder.withRegion(value).build();
        case "data.companyCountryId":
          return builder.withCountry(value).build();
        case "data.companyState":
          return builder.withCompanyState(value).build();
        case "data.companyCity":
          return builder.withCompanyCity(value).build();
        case "data.companyStreet":
          return builder.withCompanyStreet(value).build();
        case "data.companyPostalCode":
          return builder.withCompanyPostalCode(value).build();  
        default:
          return builder.build();
      }
    },

};
