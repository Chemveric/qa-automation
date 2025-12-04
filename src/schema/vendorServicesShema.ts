import { z } from "zod";

export const CategorieShema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
});

export const CategoriesShema = z.array(CategorieShema);

export const SearchResponseSchema = z.object({
  searchResult: z.array(z.string()),
  totalTookMs: z.number(),
});

export const ServisesSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  domain: z.string(),
  developmentPhase: z.string(),
  description: z.string(),
});

export const ServicesListSchema = z.array(
  z.object({
    categoryName: z.string(),
    categoryCode: z.string(),
    services: z.array(ServisesSchema),
  })
);

export const OrganizationServicesListSchema = z.object({
  services: z.array(
    z.object({
      id: z.uuid(),
      code: z.string(),
      name: z.string(),
      domain: z.string(),
      developmentPhase: z.string(),
      description: z.string(),
      categoryId: z.string(),
      isActive: z.boolean(),
      createdAt: z.string(),
    })
  ),
  customServices: z.array(z.string()),
});

export type CategoriesShema = z.infer<typeof CategoriesShema>;
export type SearchResponseSchema = z.infer<typeof SearchResponseSchema>;
export type ServicesListSchema = z.infer<typeof ServicesListSchema>;
export type OrganizationServicesListSchema = z.infer<typeof OrganizationServicesListSchema>;
