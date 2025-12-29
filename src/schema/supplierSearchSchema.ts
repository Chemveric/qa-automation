import { z } from "zod";

const DomainSchema = z.object({
  domain: z.string(),
  servicesCount: z.number().int().nonnegative(),
});

const SupplierItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  isFoundingSupplier: z.boolean(),
  region: z.string(),
  country: z.string(),
  domains: z.array(DomainSchema),
  companyBriefUrl: z.url().nullable().optional(),
  logoUrl: z.url().nullable().optional(),
  companyProfileUrl: z.url().nullable().optional(),
  isUnclaimed: z.boolean(),
});

export const SuppliersSearchSchema = z.object({
  items: z.array(SupplierItemSchema),
  totalCount: z.number().int().nonnegative(),
  nextCursor: z.string().nullable().optional(),
  prevCursor: z.string().nullable().optional(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type SuppliersSearchResponse = z.infer<typeof SuppliersSearchSchema>;
