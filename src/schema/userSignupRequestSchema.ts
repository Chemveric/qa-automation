import { z } from "zod";

export const LicenseFilesSchema = z.object({
  id: z.uuid(),
  key: z.string(),
  filename: z.string(),
});

export const UserSignupRequestSchema = z.object({
  id: z.uuid(),
  role: z.enum(["BUYER", "VENDOR"]),
  secondaryRole: z.enum(["BUYER", "VENDOR"]).nullable(),
  email: z.email(),
  origin: z.string(), //z.string(),  z.object(), ask what data type expected???
  firstName: z.string(),
  lastName: z.string(),
  companyTitle: z.string(),
  companyCity: z.string(),
  companyName: z.string(),
  companyRegionId: z.string(),
  companyRegionName: z.string(),
  companyCountryId: z.string(),
  companyCountryName: z.string(),
  companyState: z.string(),
  companyStreet: z.string(),
  companyPostalCode: z.string(),
  status: z.enum(["APPROVED", "PENDING", "REJECTED", "ALL"]),
  termsAccepted: z.boolean(),
  createdAt: z.coerce.date(),
  licenseFiles: z.array(LicenseFilesSchema),
});

export const UsersSignupRequestListSchema = z.object({
  data: z.array(UserSignupRequestSchema), 
  total: z.number(),
});
