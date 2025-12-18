import { z } from "zod";

const DomainSchema = z.object({
  domain: z.string(),
  servicesCount: z.number().int().nonnegative(),
});

const SupplierItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  region: z.string(),
  country: z.string(),
  domains: z.array(DomainSchema),
});

export const SuppliersSearchSchema = z.object({
  items: z.array(SupplierItemSchema),
  totalCount: z.number().int().nonnegative(),
  nextCursor: z.string().nullable().optional(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type SuppliersSearchSchema = z.infer<typeof SuppliersSearchSchema>;
