import { z } from "zod";

export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    region: z.string(),
});