import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.uuid(),
  email: z.email(),

  roles: z.array(z.string()),
  vendorModes: z.array(z.string()),

  slug: z.string(),

  domains: z.array(z.any()),

  title: z.string(),
  name: z.string(),

  regionId: z.uuid(),
  countryId: z.uuid(),

  state: z.string(),
  city: z.string(),
  street: z.string(),
  postalCode: z.string(),

  regionName: z.string(),
  countryName: z.string(),

  licenseFiles: z.array(z.any()),
});

export type SupplierSchema = z.infer<typeof SupplierSchema>;
