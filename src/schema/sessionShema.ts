import { z } from "zod";

export const ScanReportSchema = z
  .object({
    description: z.string().optional(), 
  })
  .nullable();

export const SessionShema = z.object({
  id: z.uuid(),
  purpose: z.enum([
    "LICENSE_PRE_SIGNUP",
    "RFQ",
    "CATALOG_SOURCE",
    "NDA",
    "PROFILE_IMAGE",
    "SERVICES_SCANNING",
    "PRODUCT_DOCUMENT",
  ]),
  filename: z.string(),
  mime: z.enum(["image/jpeg", "image/png", "application/pdf"]),
  size: z.number(),
  state: z.enum([
    "INITIATED",
    "UPLOADED",
    "SCANNING",
    "CLEAN",
    "INFECTED",
    "FAILED",
    "EXPIRED",
    "FINALIZED",
  ]),
  scanReport: ScanReportSchema,
  checksum: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
});

export type SessionShema = z.infer<typeof SessionShema>;
