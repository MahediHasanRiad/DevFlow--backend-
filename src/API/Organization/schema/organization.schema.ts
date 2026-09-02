import { z } from "zod";

// Base schema for shared field validation rules
const baseOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .nullable()
    .optional(),
});

export const createOrganizationSchema = baseOrganizationSchema;
export const updateOrganizationSchema = baseOrganizationSchema.partial();

export type CreateOrganizationInputType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInputType = z.infer<typeof updateOrganizationSchema>;