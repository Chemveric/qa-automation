import { z } from "zod";

export const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  structureUrl: z.url().optional(),
  molWeight: z.number().optional(),
  molFormula: z.string().optional(),
  mfcd: z.string().optional(),
  cas: z.string().optional(),
  smiles: z.string().optional(),

  suppliers: z.array(z.string()),
  catalogNumbers: z.array(z.string()),
  inStock: z.boolean(),
});

export const CatalogResponseSchema = z.object({
  total: z.number(),
  items: z.array(CatalogItemSchema),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;
