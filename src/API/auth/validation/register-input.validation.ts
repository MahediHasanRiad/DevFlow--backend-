import { z } from "zod";

// export type UserRoleType = "ADMIN" | "PROJECT_MANAGER" | "EMPLOYEE"
// export type DesignationType = "UI_UX" | "FRONTEND" | "BACKEND" | "FULL_STACK" | "QA" | "DEVOPS" | "TEAM_LEAD"

export const UserRoleSchema = z.enum([
  "ADMIN",
  "PROJECT_MANAGER",
  "EMPLOYEE",
]);

export const DesignationSchema = z.enum([
  "UI_UX",
  "FRONTEND",
  "BACKEND",
  "FULL_STACK",
  "QA",
  "DEVOPS",
  "TEAM_LEAD",
]);

export type UserRoleType = z.infer<typeof UserRoleSchema>;
export type DesignationType = z.infer<typeof DesignationSchema>;


// Create User / Registration
export const RegisterInputSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRoleSchema.optional().default("EMPLOYEE"),
  designation: DesignationSchema,
  avatar: z.custom<Express.Multer.File>().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof RegisterInputSchema>;



