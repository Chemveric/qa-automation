import { z } from "zod";

export const rfqType = z.enum(["BULK", "CUSTOM", "OPEN"]);

export const RfqSchema = z.object({
  id: z.uuid(),
  buyerOrgId: z.uuid(),
  type: rfqType,
  status: z.enum(["DRAFT"]),
  dueDate: z.string(),
});

export type RfqSchema = z.infer<typeof RfqSchema>;
