import { z } from "zod";

const PackageSchema = z.object({
  id: z.string(),
  basePrice: z.number(),
  packageSize: z.number(),
  packageUnit: z.string(),
  currency: z.string(),
  inStock: z.boolean(),
  leadTimeDays: z.number().nullable().optional(),
  quantityAvailable: z.number(),
});

const ItemSchema = z.object({
  id: z.string(),
  productName: z.string(),
  vendorProductCode: z.string(),
  smiles: z.string(),
  mdl: z.string().nullable(),
  formula: z.string(),
  mw: z.number(),
  inStock: z.boolean(),
  chemicalPurityPct: z.number(),
  leadTime: z.string().nullable().optional(),
  hazmat: z.string(),
  countryOfOrigin: z.string(),
  updatedAt: z.string(),
  packages: z.array(PackageSchema),
  organizationName: z.string(),
  structureImageS3Key: z.string(),
  structureImageUrl: z.string().url(),
});

export const SearchResponseSchema = z.object({
  items: z.array(ItemSchema),
  totalCount: z.number(),
  nextCursor: z.string().nullable().optional(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  tookMs: z.number(),
  usedFallback: z.boolean(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type SearchItem = z.infer<typeof ItemSchema>;
