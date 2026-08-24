import { z } from "zod";

export type UserRoleType = "ADMIN" | "PROJECT_MANAGER" | "EMPLOYEE"
export type DesignationType = "UI_UX" | "FRONTEND" | "BACKEND" | "FULL_STACK" | "QA" | "DEVOPS" | "TEAM_LEAD"

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

export type UserRole = z.infer<typeof UserRoleSchema>;
export type Designation = z.infer<typeof DesignationSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: UserRoleSchema.default("EMPLOYEE"),
  designation: DesignationSchema,
  avatar: z.instanceof(File).optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;

// Create User / Registration
export const RegisterInputSchema = z.object({
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

// User Login
export const LoginUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;


export const UserResponseSchema = UserSchema.omit({
  password: true,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
