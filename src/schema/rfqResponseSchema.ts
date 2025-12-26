import { z } from "zod";

export const NdaModeSchema = z.enum([
    "STANDARD",
    "CUSTOM",
]);

export const ProjectTypeSchema = z.enum([
    "BULK",
    "CUSTOM",
    "OPEN",
]);

export const RfqResponseSchema = z.object({
    id: z.uuid(),
    buyerOrgId: z.uuid(),

    ndaMode: NdaModeSchema,
    status: z.enum(["DRAFT"]),

    engagementModel: z.null(),
    nonconf: z.null(),

    projectType: ProjectTypeSchema,

    latestVersion: z.null(),

    services: z.array(z.any()),
    timeline: z.null(),

    contacts: z.array(z.any()),

    confidentialDetails: z.null(),
    sendOptions: z.null(),
});
