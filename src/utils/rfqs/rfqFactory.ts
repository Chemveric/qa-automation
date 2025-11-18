import { RfqBuilder } from "./rfqBuilder";
import { faker } from "@faker-js/faker";

export const RfqFactory = {
  validRfqBulk() {
    return new RfqBuilder("BULK").setDueDateInMonths(2).build();
  },

  validRfqCustom(fileId: string, fileName: string) {
    return new RfqBuilder("CUSTOM")
      .setDueDateInMonths(2)
      .setQuantity("500g")
      .setPurity(99)
      .setDeliveryTime("4-6 weeks")
      .addAttachment({
        fileId,
        filename: fileName,
        purpose: "RFQ",
      })
      .build();
  },

  validRfqOpen() {
    return new RfqBuilder("OPEN")
      .setDueDateInMonths(1)
      .setQuantity("1kg")
      .setPurity(95)
      .setDeliveryTime("2-3 weeks")
      .build();
  },

  invalidPurity() {
    return new RfqBuilder("CUSTOM")
      .setDueDate("2025-01-01")
      .overrideNonconf({
        quantity: "1kg",
        purityMinPct: "hello!",
        deliveryTime: "4-6 weeks",
      }) 
      .build();
  },

  invalidWrongType() {
    return new RfqBuilder("BULK")
      .override({ type: "INVALID" as any, dueDate: "2026-01-01" })
      .build();
  },

  emptyDate() {
    return new RfqBuilder("BULK").build();
  },

  invalidDueDate() {
    return new RfqBuilder("OPEN")
      .setDueDate("546-677-22") 
      .setQuantity("1kg")
      .setPurity(95)
      .setDeliveryTime("2 weeks")
      .build();
  },

  invalidNonconfOnBulk() {
    return new RfqBuilder("BULK")
      .setDueDateInMonths(1)
      .override({
        nonconf: {
          quantity: "1kg",
          purityMinPct: 99,
          deliveryTime: "4-6 weeks",
        } as any,
      })
      .build();
  },
};
