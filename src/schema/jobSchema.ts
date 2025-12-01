import { z } from "zod";

export const JobStatusSchema = z.object({
  jobId: z.string(),
  state: z.enum(["active", "completed", "failed", "pending"]).default("active"),
  progressPct: z.number(),
  total: z.number(),
  valid: z.number(),
  invalid: z.number(),
  insertedCompounds: z.number(),
  upsertedProducts: z.number(),
  upsertedPackages: z.number(),
  skippedInvalidSmiles: z.number(),
  prunedProducts: z.number(),
  prunedPackages: z.number(),
  enqueuedAt: z.string().optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  errorsLocation: z.string().optional(),
  failureReason: z.string().optional(),
});
