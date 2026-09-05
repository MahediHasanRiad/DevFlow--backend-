import { z } from "zod";

export const RoleSchema = z.object({
    id: z.string().uuid("Invalid Role ID format"),
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name cannot exceed 50 characters"),
  orgId: z
    .string()
    .uuid("Invalid Organization ID format"),
});

export const RoleBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name cannot exceed 50 characters"),
  orgId: z
    .string()
    .uuid("Invalid Organization ID format"),
});


export const CreateRoleSchema = RoleBaseSchema;

export const UpdateRoleSchema = RoleBaseSchema.partial();

export type RoleType = z.infer<typeof RoleSchema>; 
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;