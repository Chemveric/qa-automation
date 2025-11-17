import { z } from "zod";

export const userStatus = z.enum([
  "ACTIVE",
  "SERVICES_AND_CATALOG_ONBOARDING",
  "SERVICES_ONBOARDING",
  "CATALOG_ONBOARDING",
  "BLOCKED",
]);

export const userRole = z.enum(["BUYER", "VENDOR"]);

export const userSubrole = z.array(z.enum(["VENDOR_ADMIN", "BUYER_ADMIN"]));

export const Organization = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const useriIdentities = z.array(
  z.object({
    provider: z.string(),
    providerSub: z.string(),
  })
);

export const userRoles = z.array(
  z.object({
    role: userRole,
    subroles: userSubrole,
  })
);

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  organization: Organization,
  activeRole: userRole,
  roles: userRoles,
  identities: useriIdentities,
  status: userStatus,
  permissions: z.array(z.string()),
});

export type UserSchema = z.infer<typeof UserSchema>;
