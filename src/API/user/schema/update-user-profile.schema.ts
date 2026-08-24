import { z } from "zod";
import {
  DesignationSchema,
  UserRoleSchema,
} from "../../auth/validation/register-input.validation.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Enum matching your Prisma Role model
export const RoleEnum = z.enum(["USER", "PROFESSIONAL", "COMPANY", "ADMIN"]);

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .optional(),

  email: z
    .string()
    .email("Invalid email address format")
    .trim()
    .lowercase()
    .optional(),

  contact: z.string().trim().optional(),

  avatar: z
    .union([
      z.object({
        fieldname: z.string(),
        originalname: z.string(),
        mimetype: z.string(),
        path: z.string(),
      }),
      z.string(),
    ])
    .optional(),
  role: UserRoleSchema.optional().default("EMPLOYEE"),
  designation: DesignationSchema.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
