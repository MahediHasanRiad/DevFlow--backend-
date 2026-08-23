import { z } from "zod";

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

  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),

  address: z.string().trim().optional(),

  bio: z
    .string()
    .trim()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional(),

  stripeAccountId: z.string().trim().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
