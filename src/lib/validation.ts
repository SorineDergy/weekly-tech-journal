import { z } from "zod";

export const createEntrySchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().min(1).max(50000),
});

export const updateEntrySchema = createEntrySchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field is required",
  });

export const idSchema = z.uuid();

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});