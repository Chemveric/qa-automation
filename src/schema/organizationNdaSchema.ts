import { z } from "zod";

const BaseItemSchema = z.object({
  organizationId: z.uuid(),
  ndaVersion: z.number(),
  createdAt: z.coerce.date(),
  validTo: z.coerce.date().nullable(),
  isActive: z.boolean(),
});

const StandardItemSchema = BaseItemSchema.extend({
  type: z.literal("STANDARD"),
  ndaFileId: z.null(),
  publicDocumentId: z.uuid(),
  acceptedAt: z.coerce.date(),

  publicDocument: z.object({
    id: z.uuid(),
    displayName: z.string(),
    versionNumber: z.number(),
    fileUrl: z.url(),
    s3Key: z.string(),
  }),
});

const CustomItemSchema = BaseItemSchema.extend({
  type: z.literal("CUSTOM"),
  ndaFileId: z.uuid(),
  publicDocumentId: z.null(),
  acceptedAt: z.null(),

  file: z.object({
    id: z.uuid(),
    filename: z.string(),
    s3Key: z.string(),
    size: z.number(),
  }),

  acceptedBy: z.object({
    id: z.uuid(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const ItemSchema = z.discriminatedUnion("type", [
  StandardItemSchema,
  CustomItemSchema,
]);

export const NdaListSchema = z.object({
  items: z.array(ItemSchema),
  currentStandardNda: z
    .object({
      id: z.uuid(),
      displayName: z.string(),
      versionNumber: z.number(),
      fileUrl: z.url(),
      s3Key: z.string(),
    })
    .optional(),
});

export type NdaList = z.infer<typeof NdaListSchema>;
