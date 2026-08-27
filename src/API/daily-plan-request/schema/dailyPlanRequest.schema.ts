import { z } from "zod";

// ==========================================
// Enum Schema
// ==========================================
export const DailyPlanRequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export type DailyPlanRequestStatusType = z.infer<typeof DailyPlanRequestStatusEnum>;

// ==========================================
// Base DailyPlanRequest Entity Schema
// ==========================================
export const DailyPlanRequestSchema = z.object({
  id: z.string().uuid("Invalid Daily Plan Request ID").optional(),
  userId: z.string().uuid("Invalid User ID"),
  teamId: z.string().min(1, "Team ID is required"),
  task: z
    .string()
    .trim()
    .min(1, "Task is required")
    .max(1000, "Task cannot exceed 1000 characters"),
  date: z.coerce.date(),
  status: DailyPlanRequestStatusEnum.default("PENDING"),
  note: z
    .string()
    .trim()
    .max(1000, "Note cannot exceed 1000 characters")
    .nullable()
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type DailyPlanRequestType = z.infer<typeof DailyPlanRequestSchema>;

// ==========================================
// Create DailyPlanRequest Schema
// ==========================================
export const CreateDailyPlanRequestInputSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  task: z
    .string()
    .trim()
    .min(1, "Task is required")
    .max(1000, "Task cannot exceed 1000 characters"),
  date: z.coerce.date().optional(),
  status: DailyPlanRequestStatusEnum.optional().default("PENDING"),
  note: z
    .string()
    .trim()
    .max(1000, "Note cannot exceed 1000 characters")
});

export type CreateDailyPlanRequestInputType = z.infer<
  typeof CreateDailyPlanRequestInputSchema
>;

// CamelCase aliases
export const createDailyPlanRequestSchema = CreateDailyPlanRequestInputSchema;
export type CreateDailyPlanRequestInput = CreateDailyPlanRequestInputType;

// ==========================================
// Update DailyPlanRequest Schema
// ==========================================
export const UpdateDailyPlanRequestInputSchema = z.object({
  teamId: z.string().min(1, "Team ID is required").optional(),
  task: z
    .string()
    .trim()
    .min(1, "Task is required")
    .max(1000, "Task cannot exceed 1000 characters")
    .optional(),
  status: DailyPlanRequestStatusEnum.optional(),
  note: z
    .string()
    .trim()
    .max(1000, "Note cannot exceed 1000 characters")
    .optional()
    .nullable(),
});

export type UpdateDailyPlanRequestInputType = z.infer<
  typeof UpdateDailyPlanRequestInputSchema
>;

// CamelCase aliases
export const updateDailyPlanRequestSchema = UpdateDailyPlanRequestInputSchema;
export type UpdateDailyPlanRequestInput = UpdateDailyPlanRequestInputType;

// ==========================================
// Update DailyPlanRequest Status Schema
// ==========================================
export const UpdateDailyPlanRequestStatusSchema = z.object({
  status: DailyPlanRequestStatusEnum,
});

export type UpdateDailyPlanRequestStatusInputType = z.infer<
  typeof UpdateDailyPlanRequestStatusSchema
>;
export const updateDailyPlanRequestStatusSchema = UpdateDailyPlanRequestStatusSchema;


