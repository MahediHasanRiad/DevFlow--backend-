import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .optional(),
  createdById: z.string().uuid("Invalid creator user ID"),
});

export type TeamType = z.infer<typeof TeamSchema>;

export const CreateTeamInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
  createdById: z.string(),
});

export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>;

export const UpdateTeamInputSchema = CreateTeamInputSchema.partial();

export type UpdateTeamType = z.infer<typeof UpdateTeamInputSchema>;

export const TeamIdParamSchema = z.object({
  id: z.string().uuid("Invalid team ID format"),
});

export type TeamIdParam = z.infer<typeof TeamIdParamSchema>;
