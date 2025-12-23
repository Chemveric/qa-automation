import { z } from "zod";

export const userStatus = z.enum([
  "ACTIVE",
  "SERVICES_AND_CATALOG_ONBOARDING",
  "SERVICES_ONBOARDING",
  "CATALOG_ONBOARDING",
  "BLOCKED",
  "INACTIVE",
  "PENDING",
]);

export const userRole = z.enum(["BUYER", "VENDOR", "SUPPLIER", "ADMIN"]);

export const userSubrole = z.enum(["VENDOR_ADMIN", "BUYER_ADMIN"]);

export const vendorMode = z.enum(["CATALOG", "CRO_CDMO"]);

export const Organization = z.object({
  id: z.uuid(),
  name: z.string(),
  hasActiveStandardNda: z.boolean().optional(),
  accountNumber: z.number().optional(),
});

export const ProfileImage = z.object({
  id: z.string().uuid(),
  key: z.string(),
  filename: z.string(),
  size: z.number(),
  mimeType: z.string(),
});

export const UserIdentity = z.object({
  provider: z.string(),
  providerSub: z.string(),
});

export const UserRoleEntry = z.object({
  role: userRole,
  subroles: z.array(userSubrole),
});

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  organization: Organization,
  identities: z.array(UserIdentity),
  activeRole: userRole,
  roles: z.array(UserRoleEntry),
  vendorModes: z.array(vendorMode),
  status: userStatus,
  permissions: z.array(z.string()),
  hasSeenSupplierOnboarding: z.boolean().optional(),
  profileImage: ProfileImage.nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
