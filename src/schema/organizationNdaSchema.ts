import { z } from "zod";

export const FileSchema = z.object({
  id: z.uuid(),
  filename: z.string(),
  s3Key: z.string(),
  size: z.number().int(),
});

export const NdaSchema = z.object({
  organizationId: z.uuid(),
  ndaFileId: z.uuid(),
  ndaVersion: z.number().int(),
  createdAt: z.coerce.date(),
  validTo: z.coerce.date().nullable(),
  isActive: z.boolean(),
  type: z.enum(["STANDARD"]),
  file: FileSchema,
});

export const NdaListSchema = z.object({
  items: z.array(NdaSchema),
});

export type NdaList = z.infer<typeof NdaListSchema>;
