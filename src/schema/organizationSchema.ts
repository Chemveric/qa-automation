import { z } from "zod";

export const UpdatedBySchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
  })
  .nullable();

export const LicenseFilesSchema = z.object({
  id: z.string(),
  key: z.string(),
  filename: z.string(),
  size: z.number(),
  mimeType: z.string(),
  status: z.enum(["ADDED", "DELETED"]),
  updatedAt: z.coerce.date(),
  updatedBy: UpdatedBySchema,
});

export const PendingEmailRequestSchema = z.object({
  id: z.string(),
  requestedEmail: z.email(),
  createdAt: z.coerce.date(),
});

export const OrganizationSchema = z.object({
  id: z.string(),
  email: z.email(),
  slug: z.string(),
  domains: z.array(z.string()).default([]),
  title: z.string().nullable(),
  name: z.string(),
  regionId: z.string(),
  countryId: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  postalCode: z.string(),
  regionName: z.string(),
  countryName: z.string(),
  licenseFiles: z.array(LicenseFilesSchema).default([]),
  pendingEmailRequest: PendingEmailRequestSchema.nullable().optional(),
});

export const OrganizationListSchema = z.object({
  data: z.array(OrganizationSchema),
  total: z.number().optional(),
});
