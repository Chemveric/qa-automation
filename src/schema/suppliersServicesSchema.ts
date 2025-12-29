import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  domain: z.string(),
  developmentPhase: z.string(),
  description: z.string().nullable().optional(),
  categoryId: z.uuid(),
});

export const SuppliersServicesListSchema = z.object({
  services: z.array(ServiceSchema),
});

export type Service = z.infer<typeof ServiceSchema>;
export type ServicesListResponse = z.infer<typeof SuppliersServicesListSchema>;
