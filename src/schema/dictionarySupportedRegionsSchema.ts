import { z } from "zod";

export const DictionarySupportedRegionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
});

export const DictionarySupportedRegionsSchema = z.array(
  DictionarySupportedRegionSchema
);

export type SupportedRegions = z.infer<typeof DictionarySupportedRegionsSchema>;
