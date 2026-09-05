import { z } from "zod";


// --- Create Schema ---
export const createOrganizationMemberSchema = z.object({
  organizationId: z.string().uuid("Invalid Organization ID format"),
  userId: z.string().uuid("Invalid User ID format"),
  roleId: z.string().optional(),
});

// --- Update Schema ---
export const updateOrganizationMemberSchema = z.object({
  id: z.string().uuid("Invalid Member ID format").optional(),
  roleId: z.string().optional(),
});

// TypeScript type inference (optional, for controller/service typing)
export type CreateOrganizationMemberInput = z.infer<
  typeof createOrganizationMemberSchema
>;
export type UpdateOrganizationMemberInput = z.infer<
  typeof updateOrganizationMemberSchema
>;
