import { z } from "zod";

export const DocumentCategorySchema = z.enum([
  "LEGAL",
  "HELP_CENTER",
  "MARKETING",
  "EMAIL_ASSETS",
]);

export const DocumentKindSchema = z.enum([
  "STANDARD_NDA",
  "TERMS",
  "PRIVACY",
  "SECURITY",
  "EMAIL_LOGO",
]);

export const PublicDocumentSchema = z.object({
  id: z.uuid(),
  category: DocumentCategorySchema,
  kind: DocumentKindSchema,
  displayName: z.string(),
  versionNumber: z.number().int().nonnegative(),
  fileUrl: z.url(),
  s3Key: z.string(),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  createdById: z.uuid(),
  updatedAt: z.coerce.date(),
});

export type PublicDocument = z.infer<typeof PublicDocumentSchema>;
