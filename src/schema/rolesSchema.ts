import { z } from "zod";

export const RoleEnum = z.enum(["BUYER", "VENDOR"]);
export const BuyerSubrolesEnum = z.enum([
  "BUYER_PROCUREMENT_MANAGER",
  "BUYER_SCIENTIST",
  "BUYER_LEGAL",
  "BUYER_CUSTOMER_SERVICE",
]);
export const VendorSubrolesEnum = z.enum([
  "VENDOR_SALES",
  "VENDOR_TECH_LEAD",
  "VENDOR_QUALITY",
]);
export const VendorModeEnum = z.enum(["CRO_CDMO", "CATALOG"]);

export const SubrolesSchema = z.object({
  BUYER: z.array(BuyerSubrolesEnum).nullable(),
  VENDOR: z.array(VendorSubrolesEnum).nullable(),
});

export const RolesSchema = z
  .object({
    role: RoleEnum,
    secondaryRole: RoleEnum.optional().nullable(),
    subroles: SubrolesSchema,
    vendorModes: z.array(VendorModeEnum).default([]),
  })
  .refine(
    (data) => {
      if (data.role === "BUYER") {
        return Array.isArray(data.subroles.BUYER);
      }
      if (data.role === "VENDOR") {
        return (
          Array.isArray(data.subroles.VENDOR) && data.vendorModes.length > 0
        );
      }
      return true;
    },
    {
      message: "Invalid subroles/vendorModes combination for role",
    }
  );
