import { z } from "zod";

const UuidSchema = z.uuid();

const SupplierShortSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

export const SuppliersResponseSchema = z.array(SupplierShortSchema);

export type SupplierShort = z.infer<typeof SupplierShortSchema>;
export type SuppliersResponse = z.infer<typeof SuppliersResponseSchema>;
