import { z } from "zod";

const roleSchema = z.object({
  roleset: z.string(),
  priority: z.number(),
  lastActive: z.boolean(),
  subRoles: z.array(z.string()),
});

const teammateSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(roleSchema),
  inviteStatus: z.enum(["INVITED", "ACCEPTED", "REVOKED"]),
  sendDate: z.coerce.date(),
});

export const organizationTeammatesSchema = z.object({
  isAbleToAddAdminTeammate: z.boolean(),
  items: z.array(teammateSchema),
  totalCount: z.number(),
});
