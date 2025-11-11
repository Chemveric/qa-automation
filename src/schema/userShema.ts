import { z } from "zod";

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
    role: z.enum(["BUYER", "VENDOR"]),
    subroles: z.array(z.enum(["VENDOR_ADMIN", "BUYER_ADMIN"])),
  })
);

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  organization: Organization,
  activeRole: z.enum(["BUYER", "VENDOR"]),
  roles: userRoles,
  identities: useriIdentities,
  status: z.enum(["ACTIVE", "SERVICES_ONBOARDING", "BLOCKED"]),
  permissions: z.array(z.string()),
});

export type UserSchema = z.infer<typeof UserSchema>;
