import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "../constants/lead.js";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const leadParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().toLowerCase(),
    status: z.enum(LEAD_STATUSES).default("New"),
    source: z.enum(LEAD_SOURCES)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().email().toLowerCase().optional(),
      status: z.enum(LEAD_STATUSES).optional(),
      source: z.enum(LEAD_SOURCES).optional()
    })
    .refine((body) => Object.keys(body).length > 0, "At least one field is required")
});

export const listLeadsSchema = z.object({
  query: z.object({
    status: z.enum(LEAD_STATUSES).optional(),
    source: z.enum(LEAD_SOURCES).optional(),
    search: z.string().trim().max(100).optional(),
    sort: z.enum(["latest", "oldest"]).optional().default("latest"),
    page: z.coerce.number().int().positive().optional().default(1)
  })
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>["body"];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>["body"];
export type ListLeadsQuery = z.infer<typeof listLeadsSchema>["query"];
