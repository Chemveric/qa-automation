import { z } from "zod";

export const PackSchema = z.object({
  id: z.uuid(),
  size: z.number(),
  unit: z.string(),
  pricePerPack: z.number(),
  pricePerUnit: z.number(),
  currency: z.string(),
  quantityAvailable: z.number(),
});

export const ChemicalInfoSchema = z.object({
  smiles: z.string(),
  inchi: z.string(),
  name: z.string(),
  structureImageS3Key: z.string().optional(),
  structureImageUrl: z.url().optional(),
});

export const SupplierLiteSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const WarehouseSchema = z.object({
  name: z.string(),
  addressLine: z.string(),
  city: z.string(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string(),
  region: z.string().optional(),
});

export const CartItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number(),
  totalPrice: z.number(),
  packs: z.array(PackSchema),
  selectedPack: PackSchema,
  chemicalInfo: ChemicalInfoSchema,
  supplier: SupplierLiteSchema,
  warehouse: WarehouseSchema.optional(),
});

export const CartSchema = z.object({
  id: z.uuid(),
  items: z.array(CartItemSchema),
  totalAmount: z.number(),
  currency: z.string(),
  updatedAt: z.coerce.date(),
});

export type Pack = z.infer<typeof PackSchema>;
export type ChemicalInfo = z.infer<typeof ChemicalInfoSchema>;
export type SupplierLite = z.infer<typeof SupplierLiteSchema>;
export type Warehouse = z.infer<typeof WarehouseSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
