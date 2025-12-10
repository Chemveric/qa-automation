import { z } from "zod";

const UuidSchema = z.uuid();
const IsoDateSchema = z.coerce.date();

const AddressSchema = z.object({
  addressLine: z.string(),
  city: z.string(),
  country: z.string(),
  region: z.string(),
  state: z.string(),
  postalCode: z.string(),
});

const RecipientInfoSchema = z.object({
  address: AddressSchema,
});

const VendorModeSchema = z.enum(["CRO_CDMO", "CATALOG"]);

const SupplierSchema = z.object({
  id: UuidSchema,
  name: z.string(),
  address: AddressSchema,
  vendorModes: z.array(VendorModeSchema),
});

const PaymentInfoSchema = z.object({
  methodName: z.string(),
  cardNumber: z.string().nullable(),
});

const OrderItemSupplierSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

const ChemicalInfoSchema = z.object({
  smiles: z.string(),
  inchi: z.string(),
  name: z.string(),
  structureImageS3Key: z.string(),
  structureImageUrl: z.url(),
});

const OrderItemSchema = z.object({
  packageId: UuidSchema,
  packageName: z.string(),
  packageSize: z.number(),
  packageUnit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  currency: z.string(),
  supplier: OrderItemSupplierSchema,
  estimatedDeliveryDate: z.coerce.date().nullable(),
  shippingTrackingNumber: z.string().nullable(),
  chemicalInfo: ChemicalInfoSchema,
});

export const OrderDetailsSchema = z.object({
  id: UuidSchema,
  orderNumber: z.string(),
  status: z.enum([
    "PAYMENT_PENDING",
    "PAYMENT_PROCESSING",
    "PAYMENT_CONFIRMED",
    "PARTIALLY_SHIPPED",
    "SHIPPED",
    "CANCELLED",
    "CANCELLED_BY_SYSTEM",
  ]),
  totalAmount: z.number(),
  currency: z.string(),
  recipientInfo: RecipientInfoSchema,
  suppliers: z.array(SupplierSchema),
  paymentInfo: PaymentInfoSchema.nullable(),
  orderItems: z.array(OrderItemSchema),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
});

export type OrderDetailsSchema = z.infer<typeof OrderDetailsSchema>;
