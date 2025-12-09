import { z } from "zod";
import { OrderCheckoutSchema } from "./orderCheckoutSchema";

export const OrderListSchema = z.object({
  items: z.array(OrderCheckoutSchema),

  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalCount: z.number(),
});

export type OrderList = z.infer<typeof OrderListSchema>;
