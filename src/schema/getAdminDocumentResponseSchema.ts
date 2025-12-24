import { z } from "zod";
import { DocumentCategory } from "../utils/types/documentCategory.typess";
import { DocumentKind } from "../utils/types/documentKind.types";

export const DocumentSchema = z.object({
  id: z.uuid(),
    category: z.enum(DocumentCategory),
  kind: z.enum(DocumentKind),
  displayName: z.string(),
  versionNumber: z.number().int(),
  fileUrl: z.url(),
  s3Key: z.string(),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  createdById: z.uuid(),
  updatedAt: z.coerce.date(),
});

export const GetAdminDocumentsResponseSchema = z.object({
  data: z.array(DocumentSchema),
  total: z.number().int(),
});
