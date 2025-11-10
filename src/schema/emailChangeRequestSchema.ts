import { z } from "zod";

export const Organization = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const EmailChangeRequestSchema = z.object({
  id: z.uuid(),
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
  previousEmail: z.email(),
  newEmail: z.email(),
  organization: Organization,
  createdAt: z.coerce.date(),
  reviewedAt: z.coerce.date(),
  rejectionreason: z.string().nullable().optional(),
});

export const EmailChangeRequestListSchema = z.object({
  data: z.array(EmailChangeRequestSchema),
  total: z.number(),
});