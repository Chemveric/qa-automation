import { z } from "zod";

export const DictionarySupportedCountrySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  regionId: z.string(),
});

export const DictionarySupportedCountriesSchema = z.array(
  DictionarySupportedCountrySchema
);

export type SupportedCountries = z.infer<typeof DictionarySupportedCountriesSchema>;
