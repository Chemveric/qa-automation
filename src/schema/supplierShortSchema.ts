import { z } from "zod";

const UuidSchema = z.uuid();

const SupplierShortSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

export const SuppliersShortSchema = z.array(SupplierShortSchema);
