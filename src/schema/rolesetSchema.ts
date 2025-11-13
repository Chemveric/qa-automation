import { z } from "zod";

export const RoleEnum = z.enum(["BUYER", "VENDOR"]);
export const VendorModeEnum = z.enum(["CATALOG", "CRO_CDMO"]);

export const RolesetSchema = z.object({
  roles: z.array(RoleEnum).default([]),
  vendorModes: z.array(VendorModeEnum).default([]),
});

export type RolesetSchema = z.infer<typeof RolesetSchema>;
