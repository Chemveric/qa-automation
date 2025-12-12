import { z } from "zod";

export const PaymentSessionSchema = z.object({
  clientSecret: z.string().min(1, "clientSecret should not be empty"),
  sessionId: z.string().min(1, "sessionId should not be empty"),
});
export type PaymentSession = z.infer<typeof PaymentSessionSchema>;
