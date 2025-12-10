import { z } from "zod";

const UuidSchema = z.uuid();
const IsoDateSchema = z.coerce.date();

const AddressSchema = z.object({
  addressLine: z.string(),
  city: z.string(),
  country: z.string(),
  region: z.string(),
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

const ChemicalInfoSchema = z.object({
  smiles: z.string(),
  inchi: z.string(),
  name: z.string(),
  structureImageS3Key: z.string(),
  structureImageUrl: z.string().url(),
});

const OrderItemSupplierSchema = z.object({
  id: UuidSchema,
  name: z.string(),
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
  estimatedDeliveryDate: z.string().datetime().nullable(),
  chemicalInfo: ChemicalInfoSchema,
});

export const OrderCheckoutSchema = z.object({
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
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
  recipientInfo: RecipientInfoSchema,
  suppliers: z.array(SupplierSchema),
  orderItems: z.array(OrderItemSchema),
});
