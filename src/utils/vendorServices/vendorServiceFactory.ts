import { CustomVendorServiceBuilder } from "./vendorServiceBuilder";
import { VendorService } from "../types/vendorService.types";

export const CustomVendorServiceFactory = {
  valid(categoryId: string | null | undefined): VendorService {
    return new CustomVendorServiceBuilder().withCategoryId(categoryId).build();
  },

  invalid(field: string, value: any): VendorService {
    const builder = new CustomVendorServiceBuilder();
    switch (field) {
      case "name":
        return builder.withName(value).build();
      case "description":
        return builder.withDescription(value).build();
      case "categoryId":
        return builder.withCategoryId(value).build();
      case "domain":
        return builder.withDomain(value).build();
      case "developmentPhase":
        return builder.withDevelopmentPhase(value).build();
      default:
        return builder.build();
    }
  },

  missing(field: keyof VendorService): VendorService {
    return new CustomVendorServiceBuilder().withoutField(field).build();
  },
};
