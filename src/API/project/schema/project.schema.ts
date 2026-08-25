import { z } from "zod";

// ==========================================
// Enum Schema
// ==========================================
export const ProjectStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "IN_PROGRESS_50",
  "IN_PROGRESS_60",
  "IN_PROGRESS_70",
  "IN_PROGRESS_80",
  "ALMOST_COMPLETED",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

// ==========================================
// Base Project Entity Schema
// ==========================================
export const ProjectSchema = z.object({
  id: z.string().uuid("Invalid project ID").optional(),
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(150, "Project name cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .nullable()
    .optional(),
  status: ProjectStatusEnum.default("NOT_STARTED"),
  progress: z
    .number()
    .int()
    .min(0, "Progress cannot be less than 0")
    .max(100, "Progress cannot exceed 100")
    .default(0),
  startDate: z.coerce.date().nullable().optional(),
  deadline: z.coerce.date().nullable().optional(),
  totalMileStone: z
    .number()
    .int()
    .min(0, "Total milestones cannot be negative"),
  completedMileStone: z
    .number()
    .int()
    .min(0, "Completed milestones cannot be negative")
    .default(0),
  amount: z.number().int().min(0, "Amount cannot be negative"),
  receivedAmount: z
    .number()
    .int()
    .min(0, "Received amount cannot be negative")
    .default(0),
  createdById: z.string().uuid("Invalid creator user ID"),
  teamId: z.string(),
});

export type ProjectType = z.infer<typeof ProjectSchema>;

// ==========================================
// Create Project Schema
// ==========================================
export const CreateProjectInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters")
      .max(150, "Project name cannot exceed 150 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .nullable(),
    status: ProjectStatusEnum.optional().default("NOT_STARTED"),
    progress: z.number().int().min(0).max(100).optional().default(0),
    startDate: z.coerce.date().optional().nullable(),
    deadline: z.coerce.date().optional().nullable(),
    totalMileStone: z
      .number()
      .int()
      .min(0, "Milestone count must be at least 0"),
    completedMileStone: z.number().int().min(0).optional().default(0),
    amount: z.number().int().min(0, "Amount must be a positive integer"),
    receivedAmount: z.number().int().min(0).optional().default(0),
    teamId: z.string(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.deadline) {
        return data.deadline >= data.startDate;
      }
      return true;
    },
    {
      message: "Deadline cannot be earlier than start date",
      path: ["deadline"],
    },
  )
  .refine((data) => data.completedMileStone <= data.totalMileStone, {
    message: "Completed milestones cannot exceed total milestones",
    path: ["completedMileStone"],
  })
  .refine((data) => data.receivedAmount <= data.amount, {
    message: "Received amount cannot exceed total amount",
    path: ["receivedAmount"],
  });

export type CreateProjectInputType = z.infer<typeof CreateProjectInputSchema>;

// ==========================================
// Update Project Schema
// ==========================================
export const UpdateProjectInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters")
      .max(150, "Project name cannot exceed 150 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .nullable(),
    status: ProjectStatusEnum.optional(),
    progress: z.number().int().min(0).max(100).optional(),
    startDate: z.coerce.date().optional().nullable(),
    deadline: z.coerce.date().optional().nullable(),
    totalMileStone: z.number().int().min(0).optional(),
    completedMileStone: z.number().int().min(0).optional(),
    amount: z.number().int().min(0).optional(),
    receivedAmount: z.number().int().min(0).optional(),
    teamId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.deadline) {
        return data.deadline >= data.startDate;
      }
      return true;
    },
    {
      message: "Deadline cannot be earlier than start date",
      path: ["deadline"],
    },
  );

export type UpdateProjectInputType = z.infer<typeof UpdateProjectInputSchema>;
