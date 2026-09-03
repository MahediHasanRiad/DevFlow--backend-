import { z } from "zod";

// Match your Prisma Enums
export const OrganizationRoleEnum = z.enum([
  "ADMIN",
  "PROJECT_MANAGER",
  "EMPLOYEE",
]);

export const DesignationEnum = z.enum([
  "SOFTWARE_ENGINEER",
  "PRODUCT_MANAGER",
  "DESIGNER",
  "HR",
]);


// --- Create Schema ---
export const createOrganizationMemberSchema = z.object({
  organizationId: z.string().uuid("Invalid Organization ID format"),
  userId: z.string().uuid("Invalid User ID format"),
  role: OrganizationRoleEnum.default("EMPLOYEE"),
  designation: DesignationEnum.optional(),
});

// --- Update Schema ---
export const updateOrganizationMemberSchema = z.object({
  id: z.string().uuid("Invalid Member ID format"),
  role: OrganizationRoleEnum.optional(),
  designation: DesignationEnum.optional(),
});

// TypeScript type inference (optional, for controller/service typing)
export type CreateOrganizationMemberInput = z.infer<
  typeof createOrganizationMemberSchema
>;
export type UpdateOrganizationMemberInput = z.infer<
  typeof updateOrganizationMemberSchema
>;
