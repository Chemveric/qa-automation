import { z } from "zod";

export const rfqType = z.enum(["BULK", "CUSTOM", "OPEN"]);

export const RfqSchema = z.object({
  id: z.uuid(),
  buyerOrgId: z.uuid(),
  type: rfqType,
  status: z.enum(["DRAFT"]),
  dueDate: z.string(),
});

export const RfqItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectType: z.enum(["CUSTOM_RFQ", "OPEN_QUOTE", "BULK"]),
  status: z.enum([
    "DRAFT",
    "SCHEDULED",
    "AWAITING_QUOTES",
    "AWAITING_SELECTION",
    "PENDING_SIGNATURE",
    "AWARDED",
    "COMPLETED",
    "CLOSED",
  ]),
  budget: z.number().optional().nullable(),
  deliveryDate: z.coerce.date().optional(),
  invitedCount: z.number(),
  responseCount: z.number(),
  createdAt: z.string(),
  dueDate: z.coerce.date().optional(),
});

export const RfqMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const RfqTabsSchema = z.object({
  rfqs: z.number(),
  templates: z.number(),
  drafts: z.number(),
  archived: z.number(),
});

export const RfqsListResponseSchema = z.object({
  data: z.array(RfqItemSchema),
  meta: RfqMetaSchema,
  tabs: RfqTabsSchema,
});

export type RfqSchema = z.infer<typeof RfqSchema>;
export type RfqsListResponseSchema = z.infer<typeof RfqsListResponseSchema>;
