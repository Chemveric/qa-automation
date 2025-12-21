import { z } from "zod";

export const ShipFromSchema = z.object({
  location: z.string(),
});

export const PackSchema = z.object({
  id: z.string(),
  size: z.number(),
  unit: z.string(),
  pricePerPack: z.number(),
  pricePerUnit: z.number(),
  currency: z.string(),
  quantityAvailable: z.number(),
});

export const ChemicalInfoSchema = z.object({
  countryOfOrigin: z.string(),
  cas: z.string(),
  mfcd: z.string(),
  smiles: z.string(),
  inchi: z.string(),
  name: z.string(),
  purity: z.number(),
  molecularFormula: z.string(),
  molecularWeight: z.number(),
  physicalForm: z.string(),
  recommendedStorage: z.string(),
  appearance: z.string(),
  productCategory: z.string(),
  isPrePlated: z.boolean().optional(),
  perWellConcentrationMm: z.number().nullable(),
  solvent: z.string().optional(),
});

export const DocumentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  mime: z.string(),
  size: z.number(),
  key: z.string(),
  createdAt: z.coerce.date(),
});

const SupplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  modes: z.array(z.string()),
  certifications: z.array(z.string()),
  shippingInfo: z.string(),
  averageRating: z.number(),
  totalReviews: z.number(),
});

export const CatalogProductSchema = z.object({
  id: z.string(),
  inStock: z.boolean(),
  productCategory: z.string(),
  shipFrom: z.array(ShipFromSchema),
  packs: z.array(PackSchema),
  chemicalInfo: ChemicalInfoSchema,
  documents: z.array(DocumentSchema),
  suplier: SupplierSchema,
});

export type CatalogProductSchema = z.infer<typeof CatalogProductSchema>;
